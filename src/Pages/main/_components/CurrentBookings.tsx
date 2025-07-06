import React, { useState, useEffect } from 'react';
import { Calendar, Eye, Trash2, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useBooking } from '../../../hooks/useBooking';
import { useAuthContext } from '../../../contexts/AuthContext';
import { loadPaystackScript } from '../../../utils/loadPaystackScript';
import { useBookingTimer } from '../../../utils/useBookingTimer';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { collection as fsCollection, addDoc as fsAddDoc, onSnapshot, query as fsQuery, where as fsWhere, doc as fsDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/Firebase';
import { formatTime } from "../../../utils/formatTime";

interface CurrentBookingsProps {
  bookings: any[];
  loading: boolean;
  onBookingDeleted: (bookingId: string) => void;
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const statusColors: Record<string, string> = {
  pending: 'bg-green-100 text-green-800',
  inprogress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Utility to calculate overtime charge based on durationUnit
function getOvertimeCharge({ totalPrice, duration, durationUnit, secondsOvertime, fallbackUnitPrice }) {
  // Use fallbackUnitPrice if totalPrice is 0 (free booking)
  const perUnit = totalPrice > 0 ? totalPrice / duration : fallbackUnitPrice || 0;
  let overtimeUnits = 0;
  switch ((durationUnit || '').toLowerCase()) {
    case 'minute':
    case 'minutes':
      overtimeUnits = Math.ceil(secondsOvertime / 60);
      break;
    case 'hour':
    case 'hours':
      overtimeUnits = Math.ceil(secondsOvertime / 3600);
      break;
    case 'day':
    case 'days':
      overtimeUnits = Math.ceil(secondsOvertime / 86400);
      break;
    case 'week':
    case 'weeks':
      overtimeUnits = Math.ceil(secondsOvertime / (86400 * 7));
      break;
    case 'month':
    case 'months':
      overtimeUnits = Math.ceil(secondsOvertime / (86400 * 30.42));
      break;
    case 'year':
    case 'years':
      overtimeUnits = Math.ceil(secondsOvertime / (86400 * 365.25));
      break;
    default:
      overtimeUnits = Math.ceil(secondsOvertime / 60);
  }
  const charge = Math.max(0, Math.round(perUnit * overtimeUnits));
  // // console.log('Overtime Debug:', { totalPrice, duration, durationUnit, secondsOvertime, perUnit, overtimeUnits, charge, fallbackUnitPrice });
  return charge;
}

const CurrentBookings: React.FC<CurrentBookingsProps> = ({ bookings, loading, onBookingDeleted }) => {
  const { cancelBooking, checkInBooking, completeBooking, updatePaystackTransaction } = useBooking();
  const { user } = useAuthContext();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ bookingId: string; amount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'cashtoken' | null>(null);
  const [paystackError, setPaystackError] = useState<string | null>(null);
  const [cashtokenData, setCashtokenData] = useState<{ code: string; note?: string } | null>(null);
  const [cashtokenForm, setCashtokenForm] = useState<{ code: string; note: string }>({ code: '', note: '' });
  const [cashtokenError, setCashtokenError] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [extraAmount, setExtraAmount] = useState(0);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<any>(null);
  const [cashtokenGenerated, setCashtokenGenerated] = useState<string | null>(null);
  const [cashtokenGenLoading, setCashtokenGenLoading] = useState(false);
  const [cashtokenStatusMap, setCashtokenStatusMap] = useState<Record<string, string>>({});
  const [cashtokenRejectionMap, setCashtokenRejectionMap] = useState<Record<string, boolean>>({});
  const [cashtokenStatus, setCashtokenStatus] = React.useState<string | null>(null);

  const handleDownloadReceipt = (booking: any) => {
    // PDF receipt using jsPDF
    const doc = new jsPDF();
    doc.setFont('helvetica', '');
    doc.setFontSize(18);
    doc.text('Booking Receipt', 14, 18);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Thank you for your booking!', 14, 26);

    doc.setDrawColor(200);
    doc.line(14, 30, 196, 30);

    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text(`Booking ID: #${booking.id}`, 14, 40);
    doc.text(`Service ID: #${booking.serviceId}`, 14, 48);
    doc.text(`Service Name: ${booking.serviceName || 'Workspace Booking'}`, 14, 56);
    doc.text(`Date: ${booking.date}`, 14, 64);
    doc.text(`Start Time: ${booking.startTime}`, 14, 72);
    doc.text(`Duration: ${booking.duration} ${booking.durationUnit}`, 14, 80);
    doc.text(`Total Price: ₦${booking.totalPrice?.toLocaleString?.() || booking.totalPrice}`, 14, 88);
    doc.text(`Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`, 14, 96);
    if (booking.userEmail) {
      doc.text(`Email: ${booking.userEmail}`, 14, 104);
    }
    if (booking.createdAt) {
      doc.text(`Created At: ${format(new Date(booking.createdAt), 'PPP p')}`, 14, 112);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Unispace | https://unispace.com', 14, 285);

    doc.save(`booking-receipt-${booking.id}.pdf`);
  };

  React.useEffect(() => {
    loadPaystackScript();
  }, []);

  // Real-time listener for cashtoken status
  useEffect(() => {
    // console.log('Setting up real-time cashtoken listeners for bookings:', bookings.map(b => b.id));
    const unsubscribes: (() => void)[] = [];
    
    bookings.forEach(booking => {
      // Listen for cashtokens for all bookings, not just pending ones
      const q = fsQuery(fsCollection(db, 'cashtokens'), fsWhere('bookingId', '==', booking.id));
      const unsubscribe = onSnapshot(q, snapshot => {
        // console.log(`Cashtoken snapshot update for booking ${booking.id}:`, snapshot.docs.length, 'documents');
        
        // Clear previous status for this booking
        setCashtokenStatusMap(prev => ({ ...prev, [booking.id]: null }));
        setCashtokenRejectionMap(prev => ({ ...prev, [booking.id]: false }));
        
        // Check all cashtokens for this booking
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          // console.log(`Cashtoken status update for booking ${booking.id}:`, data.status, 'token:', data.token);
          
          if (data.status === 'validated') {
            setCashtokenStatusMap(prev => ({ ...prev, [booking.id]: 'validated' }));
            setCashtokenRejectionMap(prev => ({ ...prev, [booking.id]: false }));
          } else if (data.status === 'rejected') {
            setCashtokenStatusMap(prev => ({ ...prev, [booking.id]: 'rejected' }));
            setCashtokenRejectionMap(prev => ({ ...prev, [booking.id]: true }));
          } else if (data.status === 'pending') {
            setCashtokenStatusMap(prev => ({ ...prev, [booking.id]: 'pending' }));
            setCashtokenRejectionMap(prev => ({ ...prev, [booking.id]: false }));
          }
        });
        
        // If no cashtokens found, ensure status is cleared
        if (snapshot.empty) {
          // console.log(`No cashtokens found for booking ${booking.id}`);
        }
      }, (error) => {
        console.error(`Error in cashtoken listener for booking ${booking.id}:`, error);
      });
      unsubscribes.push(unsubscribe);
    });
    
    return () => {
      // console.log('Cleaning up real-time cashtoken listeners');
      unsubscribes.forEach(unsub => unsub());
    };
  }, [bookings]);

  // Check if cashtoken already exists for a booking
  const checkExistingCashtoken: (bookingId: string) => Promise<string | null> = async (bookingId: string): Promise<string | null> => {
    // console.log('Checking existing cashtoken for booking:', bookingId);
    try {
      const q = fsQuery(fsCollection(db, 'cashtokens'), fsWhere('bookingId', '==', bookingId), fsWhere('status', '==', 'pending'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data().token;
      }
      return null;
    } catch (error) {
      console.error('Error checking existing cashtoken:', error);
      return null;
    }
  };

  // Cancel booking
  const handleCancel = async (bookingId: string) => {
    setDeleting(true);
    try {
      await cancelBooking(bookingId);
      setConfirmDeleteId(null);
      onBookingDeleted(bookingId);
    } finally {
      setDeleting(false);
    }
  };

  // Check in booking
  const handleCheckIn = async (booking: any) => {
    setCheckInId(booking.id);
    setCheckInLoading(true);
    try {
      if (booking.totalPrice > 0) {
        setPaymentModal({ bookingId: booking.id, amount: booking.totalPrice });
        setCheckInLoading(false);
        return;
      }
      // Free booking, just check in
      await checkInBooking({
        bookingId: booking.id,
        userId: booking.userId,
        workspaceId: booking.workspaceId,
        amount: 0,
        method: 'paystack', // treat as paid
      });
      setCheckInId(null);
    } finally {
      setCheckInLoading(false);
    }
  };

  // Handle payment method selection
  const handlePayment = async () => {
    if (!paymentModal || !paymentMethod) return;
    setCheckInLoading(true);
    setPaystackError(null);
    setCashtokenError(null);
    try {
      if (paymentMethod === 'paystack') {
        // Open Paystack inline
        const booking = bookings.find(b => b.id === paymentModal.bookingId);
        if (!booking) throw new Error('Booking not found');
        const paystackHandler = (window as any).PaystackPop || (window as any).PaystackOrPopup;
        // Use booking.userEmail, fallback to user?.email
        const email = booking.userEmail || user?.email;
        if (!email) throw new Error('User email not found');
        paystackHandler && paystackHandler.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email,
          amount: paymentModal.amount * 100, // kobo
          currency: 'NGN',
          ref: 'PSK_' + Date.now(),
          callback: async (response: any) => {
            // Payment successful
            await checkInBooking({
              bookingId: paymentModal.bookingId,
              userId: booking.userId,
              workspaceId: booking.workspaceId,
              amount: paymentModal.amount,
              method: 'paystack',
              reference: response.reference,
            });
            setPaymentModal(null);
            setPaymentMethod(null);
            setCheckInId(null);
            setCheckInLoading(false);
            setTimeout(() => window.location.reload(), 1000);
          },
          onClose: () => {
            setPaystackError('Payment was cancelled.');
            setCheckInLoading(false);
            // Update transaction status to failed
            updatePaystackTransaction(paymentModal.bookingId, 'failed');
          },
        }).openIframe();
        return;
      }
      if (paymentMethod === 'cashtoken') {
        // Generate and store cashtoken
        setCashtokenGenLoading(true);
        try {
          const booking = bookings.find(b => b.id === paymentModal.bookingId);
          if (!booking) throw new Error('Booking not found');
          
          // Check for existing cashtoken first
          const existingToken = await checkExistingCashtoken(paymentModal.bookingId);
          if (existingToken) {
            setCashtokenGenerated(existingToken);
            setCashtokenGenLoading(false);
            setCashtokenStatus(null);
            setCheckInLoading(false);
            setTimeout(() => window.location.reload(), 1000);
            return;
          }
          
          // Generate unique token
          const token = uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
          // Prepare data, remove undefined fields
          const cashtokenData: Record<string, any> = {
            token,
            userId: booking.userId,
            bookingId: booking.id,
            workspaceId: booking.workspaceId,
            amount: paymentModal.amount,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          if (booking.userEmail) cashtokenData['userEmail'] = booking.userEmail;
          if (booking.workspaceName) cashtokenData['workspaceName'] = booking.workspaceName;
          // Remove any undefined fields (defensive)
          Object.keys(cashtokenData).forEach(key => cashtokenData[key] === undefined && delete cashtokenData[key]);
          await fsAddDoc(fsCollection(db, 'cashtokens'), cashtokenData);
          setCashtokenGenerated(token);
          setCashtokenGenLoading(false);
          setCashtokenStatus(null);
        } catch (err: any) {
          setCashtokenError(err.message || 'Failed to generate Cashtoken. Please try again.');
          setCashtokenGenLoading(false);
          setCheckInLoading(false);
          return;
        }
        setCheckInLoading(false);
        setTimeout(() => window.location.reload(), 1000);
        return;
      }
    } catch (err: any) {
      setPaystackError(err.message || 'Payment failed.');
      setCheckInLoading(false);
    }
    setCheckInLoading(false);
  };

  const refreshCashtokenStatus = async () => {
    if (!cashtokenGenerated || !paymentModal?.bookingId) return;
    try {
      const q = fsQuery(
        fsCollection(db, 'cashtokens'),
        fsWhere('bookingId', '==', paymentModal.bookingId),
        fsWhere('token', '==', cashtokenGenerated)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (data.status === 'validated') setCashtokenStatus('validated');
        else if (data.status === 'rejected') setCashtokenStatus('rejected');
        else setCashtokenStatus(data.status);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Helper to get the correct validated message
  const getCashtokenValidatedMessage = () => {
    if (extraAmount > 0) {
      return '✅ Cashtoken validated! Your booking is now completed.';
    } else {
      return '✅ Cashtoken validated! Your booking is now in progress.';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A8A] mr-2"></div>
        <span className="text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Bookings</h3>
        <p className="text-gray-600 mb-4">You don't have any active or upcoming bookings at the moment.</p>
        <a href="/space/service" className="bg-[#1D3A8A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#214cc3] transition">
          Book a Workspace
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Bookings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#1D3A8A] transition-all duration-300">
            {/* Header with Status */}
            <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-[#1D3A8A] to-[#214cc3] rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{booking.serviceName || 'Workspace Booking'}</h3>
                  <p className="text-sm text-gray-500">ID: #{booking.id}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                  {booking.status === 'pending' && 'Active'}
                  {booking.status === 'inprogress' && 'In Progress'}
                  {booking.status === 'completed' && 'Completed'}
                  {booking.status === 'cancelled' && 'Cancelled'}
                </span>
            </div>

            {/* Booking Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-[#1D3A8A]" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-[#1D3A8A]" />
                <span>{booking.startTime} - {booking.duration} {booking.durationUnit}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 text-[#1D3A8A]" />
                <span className="font-semibold text-gray-900">₦{booking.totalPrice?.toLocaleString?.() || booking.totalPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              {/* Debug: Show cashtoken status */}
              {/* {cashtokenStatusMap[booking.id] && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Cashtoken: {cashtokenStatusMap[booking.id]} 🔄
                </div>
              )} */}
              <button 
                className="w-full flex items-center justify-center gap-2 text-sm text-[#1D3A8A] font-medium py-2 px-4 rounded-lg border border-[#1D3A8A] hover:bg-[#1D3A8A] hover:text-white transition-all duration-300"
                onClick={() => setSelectedBookingForDetails(booking)}
              >
                <Eye size={16} /> View Details
              </button>
              {/* Cashtoken status feedback */}
              {/* {cashtokenStatusMap[booking.id] === 'validated' && (
                <div className="w-full text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center font-semibold mt-2">
                  ✅ Cashtoken validated! Your booking is now active.
                </div>
              )}
              {cashtokenStatusMap[booking.id] === 'rejected' && (
                <div className="w-full text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center font-semibold mt-2">
                  ❌ Cashtoken was rejected by admin. Please try another payment method.
                </div>
              )}
              {cashtokenStatusMap[booking.id] === 'pending' && (
                <div className="w-full text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-center font-semibold mt-2">
                  ⏳ Cashtoken pending validation. Please wait for admin approval.
                </div>
              )} */}
              {/* Only show Cancel and Check In if timer hasn't started (not inprogress and not validated) */}
              {!(booking.status === 'inprogress' || cashtokenStatusMap[booking.id] === 'validated') && (
                <>
                  <button
                    className="w-full flex items-center justify-center gap-2 text-sm text-green-600  font-medium py-2 px-4 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
                    onClick={() => handleCheckIn(booking)}
                    disabled={checkInLoading && checkInId === booking.id || booking.status !== 'pending'}
                  >
                    <CheckCircle size={16} />
                    {checkInLoading && checkInId === booking.id ? 'Checking In...' : 'Check In'}
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 text-sm text-red-600 font-medium py-2 px-4 rounded-lg border border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                    onClick={() => setConfirmDeleteId(booking.id)}
                    disabled={deleting && confirmDeleteId === booking.id}
                  >
                    <Trash2 size={16} />
                    {deleting && confirmDeleteId === booking.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </>
              )}

              {/* Timer and Checkout for inprogress bookings */}
              {booking.status === 'inprogress' && (
                <BookingTimerAndCheckout
                  booking={booking}
                  checkExistingCashtoken={checkExistingCashtoken}
                  onCheckout={async (extraAmount, method, reference, cashtokenData) => {
                    setCheckoutLoading(true);
                    try {
                      await completeBooking({
                        bookingId: booking.id,
                        userId: booking.userId,
                        workspaceId: booking.workspaceId,
                        extraAmount,
                        method,
                        reference,
                        cashtokenData,
                      });
                      setCheckoutId(null);
                      setExtraAmount(0);
                    } finally {
                      setCheckoutLoading(false);
                    }
                  }}
                />
              )}
            </div>

            {/* Confirmation Dialog */}
            {confirmDeleteId === booking.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-semibold mb-2">Cancel Booking?</h3>
                  <p className="text-gray-600 mb-4">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={deleting}
                    >
                      Back
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                      onClick={() => handleCancel(booking.id)}
                      disabled={deleting}
                    >
                      {deleting ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Payment Method Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Select Payment Method</h3>
            <p className="text-gray-600 mb-4">To check in, please pay ₦{paymentModal.amount?.toLocaleString?.() || paymentModal.amount}.</p>
            <div className="flex flex-col gap-3 mb-4">
                {/* //TODO  Test Pay with Paystack */}
              {/* <button
                className={`px-4 py-2 rounded-lg font-medium border ${paymentMethod === 'paystack' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setPaymentMethod('paystack')}
                disabled={checkInLoading}
              >
                Pay with Paystack
              </button> */}
              <button
                className={`px-4 py-2 rounded-lg font-medium border ${paymentMethod === 'cashtoken' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={async () => {
                  setPaymentMethod('cashtoken');
                  setCashtokenGenerated(null);
                  setCashtokenError(null);
                  // Immediately trigger payment logic
                  // Generate and store cashtoken
                  setCashtokenGenLoading(true);
                  try {
                    const booking = bookings.find(b => b.id === paymentModal.bookingId);
                    if (!booking) throw new Error('Booking not found');
                    
                    // Check for existing cashtoken first
                    const existingToken = await checkExistingCashtoken(paymentModal.bookingId);
                    if (existingToken) {
                      setCashtokenGenerated(existingToken);
                      setCashtokenGenLoading(false);
                      setCashtokenStatus(null);
                      setCheckInLoading(false);
                      setTimeout(() => window.location.reload(), 1000);
                      return;
                    }
                    
                    // Generate unique token
                    const token = uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
                    // Prepare data, remove undefined fields
                    const cashtokenData: Record<string, any> = {
                      token,
                      userId: booking.userId,
                      bookingId: booking.id,
                      workspaceId: booking.workspaceId,
                      amount: paymentModal.amount,
                      status: 'pending',
                      createdAt: new Date().toISOString(),
                    };
                    if (booking.userEmail) cashtokenData['userEmail'] = booking.userEmail;
                    if (booking.workspaceName) cashtokenData['workspaceName'] = booking.workspaceName;
                    // Remove any undefined fields (defensive)
                    Object.keys(cashtokenData).forEach(key => cashtokenData[key] === undefined && delete cashtokenData[key]);
                    await fsAddDoc(fsCollection(db, 'cashtokens'), cashtokenData);
                    setCashtokenGenerated(token);
                    setCashtokenGenLoading(false);
                    setCashtokenStatus(null);
                  } catch (err: any) {
                    setCashtokenError(err.message || 'Failed to generate Cashtoken. Please try again.');
                    setCashtokenGenLoading(false);
                    setCheckInLoading(false);
                    return;
                  }
                  setCheckInLoading(false);
                  setTimeout(() => window.location.reload(), 1000);
                }}
                disabled={checkInLoading}
              >
                Pay with Cashtoken
              </button>
            </div>
            {paymentMethod === 'cashtoken' && cashtokenGenerated && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-green-700 font-semibold mb-2">Your Cashtoken Code</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-2xl font-mono text-green-900 tracking-widest">{cashtokenGenerated}</div>
                  <button
                    className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-semibold"
                    onClick={refreshCashtokenStatus}
                    title="Refresh status"
                  >
                    Refresh
                  </button>
                </div>
                {cashtokenStatus === 'validated' && (
                  <div className="text-green-700 font-semibold">{getCashtokenValidatedMessage()}</div>
                )}
                {cashtokenStatus === 'rejected' && (
                  <div className="text-red-700 font-semibold">❌ Cashtoken was rejected by admin. Please try another payment method.</div>
                )}
                {cashtokenStatus === 'pending' && (
                  <div className="text-yellow-700 font-semibold">⏳ Cashtoken pending validation. Please wait for admin approval.</div>
                )}
                {cashtokenStatus && !['validated', 'rejected', 'pending'].includes(cashtokenStatus) && (
                  <div className="text-gray-600 font-medium">Status: {cashtokenStatus}</div>
                )}
                <div className="text-xs text-gray-500">Share this code with the workspace admin to complete your payment.</div>
              </div>
            )}
            {cashtokenGenLoading && (
              <div className="text-center text-gray-600 mb-2">Generating Cashtoken...</div>
            )}
            {cashtokenError && <div className="text-red-600 text-sm mb-2">{cashtokenError}</div>}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                onClick={() => {
                  setPaymentModal(null);
                  setPaymentMethod(null);
                  setPaystackError(null);
                  setCashtokenForm({ code: '', note: '' });
                  setCashtokenError(null);
                  setCashtokenGenerated(null);
                }}
                disabled={checkInLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Booking Details Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#1D3A8A]">Booking Details</h3>
                <button
                className="text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setSelectedBookingForDetails(null)}
                aria-label="Close"
              >
                &times;
                </button>
            </div>
            
            <div className="space-y-4">
              {/* Service Information */}
              <div className="bg-gradient-to-br from-[#1D3A8A] to-[#214cc3] rounded-lg p-4 text-white">
                <h4 className="font-semibold text-lg mb-2">{selectedBookingForDetails.serviceName || 'Workspace Booking'}</h4>
                <p className="text-blue-100">Service ID: #{selectedBookingForDetails.serviceId}</p>
              </div>

              {/* Booking Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold">#{selectedBookingForDetails.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{selectedBookingForDetails.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-semibold">{selectedBookingForDetails.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedBookingForDetails.duration} {selectedBookingForDetails.durationUnit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-semibold text-[#1D3A8A]">₦{selectedBookingForDetails.totalPrice?.toLocaleString?.() || selectedBookingForDetails.totalPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[selectedBookingForDetails.status] || 'bg-gray-100 text-gray-700'}`}>
                    {selectedBookingForDetails.status === 'pending' && 'Active'}
                    {selectedBookingForDetails.status === 'inprogress' && 'In Progress'}
                    {selectedBookingForDetails.status === 'completed' && 'Completed'}
                    {selectedBookingForDetails.status === 'cancelled' && 'Cancelled'}
                  </span>
                </div>
                {selectedBookingForDetails.userEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{selectedBookingForDetails.userEmail}</span>
                  </div>
                )}
                {selectedBookingForDetails.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold">{format(new Date(selectedBookingForDetails.createdAt), 'PPP p')}</span>
                  </div>
                )}
                {selectedBookingForDetails.updatedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-semibold">{format(new Date(selectedBookingForDetails.updatedAt), 'PPP p')}</span>
                  </div>
                )}
              </div>

              {/* Additional Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#214cc3] transition-colors"
                    onClick={() => handleDownloadReceipt(selectedBookingForDetails)}
                  >
                    Download Receipt
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setSelectedBookingForDetails(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingTimerAndCheckout: React.FC<{
  booking: any;
  checkExistingCashtoken: (bookingId: string) => Promise<string | null>;
  onCheckout: (extraAmount: number, method: 'paystack' | 'cashtoken', reference?: string, cashtokenData?: any) => void;
}> = ({ booking, checkExistingCashtoken, onCheckout }) => {
  // Helper to get the correct validated message
  const getCashtokenValidatedMessage = () => {
    if (extraAmount > 0) {
      return '✅ Cashtoken validated! Your booking is now completed.';
    } else {
      return '✅ Cashtoken validated! Your booking is now in progress.';
    }
  };
  // Debug log for timer inputs
  // // console.log('Booking Timer Debug:', {
  //   duration: booking.duration,
  //   durationUnit: booking.durationUnit,
  //   startTime: booking.startTime,
  //   date: booking.date,
  // });
  // Combine date and time for valid ISO string
  let startTimeString = booking.startTime;
  if (booking.startTime && booking.startTime.length <= 5 && booking.date) {
    startTimeString = `${booking.date}T${booking.startTime}`;
  }
  const safeDurationUnit = booking.durationUnit && booking.durationUnit.trim() ? booking.durationUnit : '';
  
  
  const { phase, secondsLeft, end, graceEnd, now } = useBookingTimer(startTimeString, booking.duration, safeDurationUnit, booking.paused, booking.pausedAt);
  

  const refreshCashtokenStatus = async () => {
    if (!cashtokenGenerated || !booking.id) return;
    try {
      const q = fsQuery(
        fsCollection(db, 'cashtokens'),
        fsWhere('bookingId', '==', booking.id),
        fsWhere('token', '==', cashtokenGenerated)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (data.status === 'validated') setCashtokenStatus('validated');
        else if (data.status === 'rejected') setCashtokenStatus('rejected');
        else setCashtokenStatus(data.status);
      }
    } catch (err) {
      // Optionally handle error
    }
  };
  
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'paystack' | 'cashtoken' | null>(null);
  const [cashtokenForm, setCashtokenForm] = React.useState({ code: '', note: '' });
  const [cashtokenError, setCashtokenError] = React.useState<string | null>(null);
  const [paystackError, setPaystackError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [serviceDefaultPrice, setServiceDefaultPrice] = React.useState<number | null>(null);
  const [serviceDefaultUnit, setServiceDefaultUnit] = React.useState<string | null>(null);

  const [cashtokenGenerated, setCashtokenGenerated] = React.useState<string | null>(null);
const [cashtokenGenLoading, setCashtokenGenLoading] = React.useState(false);
const [cashtokenStatus, setCashtokenStatus] = React.useState<string | null>(null);

  // Calculate extra time and amount
  let extraUnits = 0;
  let extraAmount = 0;
  if (phase === 'overtime' && serviceDefaultPrice) {
    const secondsOvertime = secondsLeft;
    const overtimeUnit = serviceDefaultUnit || booking.durationUnit;
    const overtimePerUnit = serviceDefaultPrice;
    switch ((overtimeUnit || '').toLowerCase()) {
      case 'minute':
      case 'minutes':
        extraUnits = Math.ceil(secondsOvertime / 60);
        break;
      case 'hour':
      case 'hours':
        extraUnits = Math.ceil(secondsOvertime / 3600);
        break;
      case 'day':
      case 'days':
        extraUnits = Math.ceil(secondsOvertime / 86400);
        break;
      case 'week':
      case 'weeks':
        extraUnits = Math.ceil(secondsOvertime / (86400 * 7));
        break;
      case 'month':
      case 'months':
        extraUnits = Math.ceil(secondsOvertime / (86400 * 30.42));
        break;
      case 'year':
      case 'years':
        extraUnits = Math.ceil(secondsOvertime / (86400 * 365.25));
        break;
      default:
        extraUnits = Math.ceil(secondsOvertime / 60);
    }
    extraAmount = Math.max(0, Math.round(overtimePerUnit * extraUnits));
  }

  // Fetch service default price when in overtime and booking is free
  React.useEffect(() => {
    if (phase === 'overtime' && booking.serviceId && booking.workspaceId) {
      // // console.log('Fetching service for overtime:', { 
      //   serviceId: booking.serviceId, 
      //   workspaceId: booking.workspaceId 
      // });
      const fetchService = async () => {
        try {
          const serviceDoc = fsDoc(db, 'workspaces', booking.workspaceId, 'services', booking.serviceId);
          const serviceSnap = await getDoc(serviceDoc);
          // // console.log('Service snap exists:', serviceSnap.exists());
          if (serviceSnap.exists()) {
            const data = serviceSnap.data();
            // // console.log('Service data:', data);
            const minCharge = parseFloat(data.minCharge);
            const minDuration = parseFloat(data.minDuration);
            // // console.log('minCharge:', minCharge, 'minDuration:', minDuration);
            if (!isNaN(minCharge) && !isNaN(minDuration) && minDuration > 0) {
              const perUnitPrice = minCharge / minDuration;
              setServiceDefaultPrice(perUnitPrice);
              setServiceDefaultUnit(data.durationUnit);
              // // console.log('Set perUnitPrice:', perUnitPrice);
            } else {
              console.warn('Invalid minCharge or minDuration for service:', data);
            }
          } else {
            // // console.log('Service document does not exist');
          }
        } catch (error) {
          console.error('Error fetching service:', error);
        }
      };
      fetchService();
    }
  }, [phase, booking.serviceId, booking.workspaceId]);

  // const refreshCashtokenStatus = async () => {
  //   if (!cashtokenGenerated || !booking.id) return;
  //   try {
  //     const q = fsQuery(
  //       fsCollection(db, 'cashtokens'),
  //       fsWhere('bookingId', '==', booking.id),
  //       fsWhere('token', '==', cashtokenGenerated)
  //     );
  //     const snap = await getDocs(q);
  //     if (!snap.empty) {
  //       const data = snap.docs[0].data();
  //       if (data.status === 'validated') {
  //         setCashtokenStatus('validated');
  //       } else if (data.status === 'rejected') {
  //         setCashtokenStatus('rejected');
  //       } else {
  //         setCashtokenStatus(data.status);
  //       }
  //     }
  //   } catch (err) {
  //     // Optionally handle error
  //   }
  // };

  React.useEffect(() => {
    if (cashtokenStatus === 'validated' && paymentMethod === 'cashtoken' && cashtokenGenerated) {
      if (extraAmount > 0) {
        // This is a check-out (overtime payment)
        onCheckout(extraAmount, 'cashtoken', undefined, { code: cashtokenGenerated });
        setCashtokenGenerated(null);
        setCashtokenStatus(null);
        window.location.reload();
        setTimeout(() => window.location.reload(), 1500);
      } else {
        // This is a check-in
        onCheckout(0, 'cashtoken', undefined, { code: cashtokenGenerated });
        setCashtokenGenerated(null);
        setCashtokenStatus(null);
        window.location.reload();
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  }, [cashtokenStatus, paymentMethod, cashtokenGenerated, extraAmount, onCheckout]);

  // Real-time listener for cashtoken status in this component
  React.useEffect(() => {
    if (!booking.id) return;
    
    // // console.log(`Setting up real-time cashtoken listener for booking ${booking.id} in timer component`);
    const q = fsQuery(fsCollection(db, 'cashtokens'), fsWhere('bookingId', '==', booking.id));
    const unsubscribe = onSnapshot(q, snapshot => {
      // console.log(`Timer component cashtoken update for booking ${booking.id}:`, snapshot.docs.length, 'documents');
      
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        // console.log(`Timer component cashtoken status for booking ${booking.id}:`, data.status, 'token:', data.token);
        
        if (data.status === 'validated') {
          setCashtokenStatus('validated');
        } else if (data.status === 'rejected') {
          setCashtokenStatus('rejected');
        } else if (data.status === 'pending') {
          setCashtokenStatus('pending');
        }
      });
      
      // If no cashtokens found, clear status
      if (snapshot.empty) {
        // console.log(`No cashtokens found for booking ${booking.id} in timer component`);
        setCashtokenStatus(null);
      }
    }, (error) => {
      console.error(`Error in timer component cashtoken listener for booking ${booking.id}:`, error);
    });
    
    return () => {
      // console.log(`Cleaning up timer component cashtoken listener for booking ${booking.id}`);
      unsubscribe();
    };
  }, [booking.id]);

  return (
    <div className="flex flex-col gap-2 border-t py-2">
      <div className="flex justify-center flex-col items-center gap-2 text-sm">
        {phase === 'active' && <span className="text-blue-600">Time left: <span className='font-bold'>{formatTime(secondsLeft)}</span> </span>}
        {phase === 'grace' && <span className="text-yellow-600">Grace period: <span className='font-bold'>{formatTime(secondsLeft)}</span> </span>}
        {phase === 'overtime' && !serviceDefaultPrice && (
          <div className="text-center text-gray-600 mb-2">Calculating overtime charge...</div>
        )}
        {phase === 'overtime' && serviceDefaultPrice && (
          <span className="text-red-600">Overtime: <span className='font-bold'>{formatTime(secondsLeft)}</span> | <span className='text-md'>(Extra ₦{extraAmount})</span></span>
        )}
      </div>
      <button
        className="px-4 py-2 rounded-lg bg-[#1D3A8A] text-white hover:bg-[#214cc3] font-medium mt-1"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        Check Out
      </button>
      {/* Confirmation Dialog for Check Out */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm Check Out</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to check out and end your booking?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#1D3A8A] text-white hover:bg-[#214cc3] font-medium"
                onClick={() => { setShowConfirm(false); setShowCheckout(true); }}
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Check Out</h3>
            {phase === 'overtime' ? (
              <>
                <p className="text-gray-600 mb-4">
                  You are in overtime. {extraAmount > 0
                    ? `Please pay ₦${extraAmount} to complete your booking.`
                    : 'No extra payment is required to complete your booking.'}
                </p>
                {extraAmount > 0 ? (
                  <div className="flex flex-col gap-3 mb-4">
                    {/* //TODO  Test Pay with Paystack */}
                    {/* <button
                      className={`px-4 py-2 rounded-lg font-medium border ${paymentMethod === 'paystack' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setPaymentMethod('paystack')}
                      disabled={loading}
                    >
                      Pay with Paystack
                    </button> */}
                    <button
                      className={`px-4 py-2 rounded-lg font-medium border ${paymentMethod === 'cashtoken' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={async () => {
                        setPaymentMethod('cashtoken');
                        setCashtokenGenerated(null);
                        setCashtokenError(null);
                        setCashtokenGenLoading(true);
                        try {
                          // Check for existing cashtoken first
                          const existingToken = await checkExistingCashtoken(booking.id);
                          if (existingToken) {
                            setCashtokenGenerated(existingToken);
                            setCashtokenGenLoading(false);
                            setCashtokenStatus(null);
                            setTimeout(() => window.location.reload(), 1000);
                            return;
                          }
                          
                          // Generate unique token
                          const token = uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
                          // Prepare data, remove undefined fields
                          const cashtokenData: Record<string, any> = {
                            token,
                            userId: booking.userId,
                            bookingId: booking.id,
                            workspaceId: booking.workspaceId,
                            amount: extraAmount,
                            status: 'pending',
                            createdAt: new Date().toISOString(),
                            type: 'overtime',
                          };
                          if (booking.userEmail) cashtokenData['userEmail'] = booking.userEmail;
                          if (booking.workspaceName) cashtokenData['workspaceName'] = booking.workspaceName;
                          Object.keys(cashtokenData).forEach(key => cashtokenData[key] === undefined && delete cashtokenData[key]);
                          await fsAddDoc(fsCollection(db, 'cashtokens'), cashtokenData);
                          setCashtokenGenerated(token);
                          setCashtokenGenLoading(false);
                          setCashtokenStatus(null);
                        } catch (err: any) {
                          setCashtokenError(err.message || 'Failed to generate Cashtoken. Please try again.');
                          setCashtokenGenLoading(false);
                          return;
                        }
                      }}
                      disabled={loading}
                    >
                      Pay with Cashtoken
                    </button>
                  </div>
                ) : null}
                {paymentMethod === 'cashtoken' && extraAmount > 0 && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    {cashtokenGenLoading ? (
                      <div className="text-center text-gray-600 mb-2">Generating Cashtoken...</div>
                    ) : cashtokenGenerated ? (
                      <>
                        <div className="text-green-700 font-semibold mb-2">Your Cashtoken Code</div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="text-2xl font-mono text-green-900 tracking-widest">{cashtokenGenerated}</div>
                          <button
                            className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-semibold"
                            onClick={refreshCashtokenStatus}
                            title="Refresh status"
                          >
                            Refresh
                          </button>
                        </div>
                        {cashtokenStatus === 'validated' && (
                          <div className="text-green-700 font-semibold">{getCashtokenValidatedMessage()}</div>
                        )}
                        {cashtokenStatus === 'rejected' && (
                          <div className="text-red-700 font-semibold">❌ Cashtoken was rejected by admin. Please try another payment method.</div>
                        )}
                        {cashtokenStatus === 'pending' && (
                          <div className="text-yellow-700 font-semibold">⏳ Cashtoken pending validation. Please wait for admin approval.</div>
                        )}
                        {cashtokenStatus && !['validated', 'rejected', 'pending'].includes(cashtokenStatus) && (
                          <div className="text-gray-600 font-medium">Status: {cashtokenStatus}</div>
                        )}
                        <div className="text-xs text-gray-500">Share this code with the workspace admin to complete your payment.</div>
                      </>
                    ) : cashtokenError ? (
                      <div className="text-red-600 text-sm mb-2">{cashtokenError}</div>
                    ) : null}
                  </div>
                )}
                {paymentMethod === 'paystack' && extraAmount > 0 && (
                  <button
                    className="w-full px-4 py-2 rounded-lg bg-[#1D3A8A] text-white hover:bg-[#214cc3] font-medium mt-2"
                    onClick={() => {
                      setLoading(true);
                      // Use Paystack inline
                      const paystackHandler = (window as any).PaystackPop || (window as any).PaystackOrPopup;
                      const email = booking.userEmail;
                      paystackHandler && paystackHandler.setup({
                        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
                        email,
                        amount: extraAmount * 100,
                        currency: 'NGN',
                        ref: 'PSK_' + Date.now(),
                        callback: (response: any) => {
                          onCheckout(extraAmount, 'paystack', response.reference);
                        },
                        onClose: () => {
                          setPaystackError('Payment was cancelled.');
                          setLoading(false);
                          // Note: We can't update transaction status here since no transaction was created yet
                          // The transaction is only created when onCheckout is called successfully
                        },
                      }).openIframe();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Pay & Complete'}
                  </button>
                )}
                {paystackError && <div className="text-red-600 text-sm mb-2">{paystackError}</div>}
                {/* If no extra payment, show complete button */}
                {extraAmount === 0 && (
                  <button
                    className="w-full px-4 py-2 rounded-lg bg-[#1D3A8A] text-white hover:bg-[#214cc3] font-medium mt-2"
                    onClick={() => {
                      setLoading(true);
                      onCheckout(0, 'paystack');
                    }}
                    disabled={loading}
                  >
                    {loading ? <div className='flex items-center gap-1 justify-center'><Loader2 className='text-white animate-spin'/> Processing...</div> : 'Complete Booking'}
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">You are within your booking time. Click below to complete your booking.</p>
                <button
                  className="w-full px-4 py-2 rounded-lg bg-[#1D3A8A] text-white hover:bg-[#214cc3] font-medium mt-2"
                  onClick={() => {
                    setLoading(true);
                    onCheckout(0, 'paystack');
                  }}
                  disabled={loading}
                >
                  {loading ? <div className='flex items-center gap-1 justify-center'><Loader2 className='text-white animate-spin'/> Processing...</div>: 'Complete Booking'}
                </button>
              </>
            )}
            <button
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium mt-2"
              onClick={() => setShowCheckout(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentBookings; 