import React, { useEffect, useState } from 'react';
import WorkspaceLayout from '../_components/WorkspaceLayout';
import { useWorkspacePortalContext } from '../../../contexts/WorkspacePortalContext';
import { useBooking } from '../../../hooks/useBooking';
import { useBookingTimer } from '../../../utils/useBookingTimer';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MoreVertical, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { formatTime } from '../../../utils/formatTime';
import { BookingPaymentModal } from '../../main/_components/BookingPaymentModal';
import { getOvertimeCharge } from '../../../utils/getOvertimeCharge';
import { doc, getDoc, query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../../lib/Firebase';

const statusColors = {
  pending: 'bg-green-100 text-green-800',
  inprogress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const WorkspaceBookingsPage = () => {
  const { workspace } = useWorkspacePortalContext();
  const { getWorkspaceBookings, checkInBooking, completeBooking, cancelBooking, pauseBooking, resumeBooking, updatePaystackTransaction } = useBooking();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [paymentModal, setPaymentModal] = useState<{ booking: any; mode: 'checkin' | 'checkout'; extraAmount?: number } | null>(null);

  const refreshBookings = async () => {
    if (!workspace?.id) return;
    setLoading(true);
    getWorkspaceBookings(workspace.id)
      .then(setBookings)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshBookings();
    // eslint-disable-next-line
  }, [workspace?.id]);

  // Download receipt logic (reuse from CurrentBookings)
  const handleDownloadReceipt = (booking: any) => {
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
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Unispace | https://unispace.com', 14, 285);
    doc.save(`booking-receipt-${booking.id}.pdf`);
  };

  // Pause/Resume booking logic
  const handlePauseResume = async (booking: any) => {
    setPausing(booking.id);
    try {
      if (booking.paused) {
        await resumeBooking(booking.id);
        toast.success('Booking resumed');
      } else {
        await pauseBooking(booking.id);
        toast.success('Booking paused');
      }
      await refreshBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking');
    } finally {
      setPausing(null);
    }
  };

  // Timer cell component to fix Rules of Hooks
  const BookingTimerCell = ({ booking }: { booking: any }) => {
    const { phase, secondsLeft } = useBookingTimer(
      booking.startTime && booking.date ? `${booking.date}T${booking.startTime}` : '',
      booking.duration,
      booking.durationUnit,
      booking.paused,
      booking.pausedAt
    );
    return (
      <>
        {phase === 'active' && <span className="text-blue-600">Time left: <span className='font-bold'>{formatTime(secondsLeft)}</span></span>}
        {phase === 'grace' && <span className="text-yellow-600">Grace period: <span className='font-bold'>{formatTime(secondsLeft)}</span></span>}
        {phase === 'overtime' && <span className="text-red-600">Overtime: <span className='font-bold'>{formatTime(secondsLeft)}</span></span>}
      </>
    );
  };

  // Overtime calculation for check-out
  const getOvertimeAmount = async (booking: any): Promise<number> => {
    if (!booking || !booking.startTime || !booking.date || !booking.duration || !booking.durationUnit) return 0;
    const start = new Date(`${booking.date}T${booking.startTime}`);
    const now = new Date();
    const durationMs = booking.duration * 60 * 1000; // duration in ms
    const end = new Date(start.getTime() + durationMs);
    let secondsOvertime = Math.floor((now.getTime() - end.getTime()) / 1000);
    if (secondsOvertime < 0) secondsOvertime = 0;
    let fallbackUnitPrice = 0;
    if (booking.totalPrice === 0 && booking.workspaceId && booking.serviceId) {
      try {
        const serviceDocRef = doc(db, 'workspaces', booking.workspaceId, 'services', booking.serviceId);
        const serviceSnap = await getDoc(serviceDocRef);
        if (serviceSnap.exists()) {
          const data = serviceSnap.data();
          const minCharge = parseFloat(data.minCharge);
          const minDuration = parseFloat(data.minDuration);
          if (!isNaN(minCharge) && !isNaN(minDuration) && minDuration > 0) {
            fallbackUnitPrice = minCharge / minDuration;
          }
        }
      } catch (e) { /* ignore */ }
    }
    return getOvertimeCharge({
      totalPrice: booking.totalPrice,
      duration: booking.duration,
      durationUnit: booking.durationUnit,
      secondsOvertime,
      fallbackUnitPrice,
    });
  };

  // Check if cashtoken already exists for a booking
  const checkExistingCashtoken = async (bookingId: string): Promise<string | null> => {
    try {
      const q = query(collection(db, 'cashtokens'), where('bookingId', '==', bookingId), where('status', '==', 'pending'));
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

  const handleCheckIn = (booking: any) => {
    setPaymentModal({ booking, mode: 'checkin' });
  };
  const handleCheckOut = async (booking: any) => {
    const extraAmount = await getOvertimeAmount(booking);
    setPaymentModal({ booking, mode: 'checkout', extraAmount });
  };

  // Dropdown action menu
  const BookingActionsDropdown = ({ booking }: { booking: any }) => {
    const isInprogress = booking.status === 'inprogress';
    const isActive = booking.status === 'pending';
    return (
      <div className="relative inline-block text-left">
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A] transition"
          onClick={() => setOpenDropdownId(openDropdownId === booking.id ? null : booking.id)}
        >
          <span className="sr-only">Open actions</span>
          <MoreVertical size={18} />
        </button>
        {openDropdownId === booking.id && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border animate-fade-in">
            <button
              className="w-full text-left px-4 py-2 text-[#1D3A8A] hover:bg-[#F3F4F6] text-sm"
              onClick={() => { setSelectedBooking(booking); setOpenDropdownId(null); }}
            >
              View Details
            </button>
            <button
              className="w-full text-left px-4 py-2 text-[#1D3A8A] hover:bg-[#F3F4F6] text-sm"
              onClick={() => { handleDownloadReceipt(booking); setOpenDropdownId(null); }}
            >
              Download Receipt
            </button>
            {isInprogress && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-yellow-600 hover:bg-[#F3F4F6] text-sm"
                  onClick={() => { handlePauseResume(booking); setOpenDropdownId(null); }}
                  disabled={pausing === booking.id}
                >
                  {pausing === booking.id ? (booking.paused ? 'Resuming...' : 'Pausing...') : (booking.paused ? 'Resume' : 'Pause')}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-orange-700 hover:bg-[#F3F4F6] text-sm"
                  onClick={() => { handleCheckOut(booking); setOpenDropdownId(null); }}
                >
                  Check Out
                </button>
              </>
            )}
            {isActive && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-green-700 hover:bg-[#F3F4F6] text-sm"
                  onClick={() => { handleCheckIn(booking); setOpenDropdownId(null); }}
                >
                  Check In
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-[#F3F4F6] text-sm"
                  onClick={() => { cancelBooking(booking.id); setOpenDropdownId(null); }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <WorkspaceLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#1D3A8A]">All Bookings</h1>
        <div className="flex gap-2 items-center">
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-semibold transition ${view === 'table' ? 'bg-[#1D3A8A] text-white border-[#1D3A8A]' : 'bg-white text-[#1D3A8A] border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('table')}
            title="Table view"
          >
            <TableIcon size={18} /> Table
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-semibold transition ${view === 'grid' ? 'bg-[#1D3A8A] text-white border-[#1D3A8A]' : 'bg-white text-[#1D3A8A] border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('grid')}
            title="Grid view"
          >
            <LayoutGrid size={18} /> Grid
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Bookings List</h2>
        {loading ? (
          <div className="text-center text-[#4B5563] py-4">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-[#4B5563] py-4">No bookings found.</div>
        ) : view === 'table' ? (
          <div className="overflow-x-auto h-screen">
            <table className="w-full text-left rounded-xl ">
              <thead>
                <tr className="border-b">
                  <th className="py-2">User ID</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Timer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  return (
                    <tr key={booking.id} className="border-b hover:bg-[#F3F4F6]">
                      <td className="py-2 font-semibold">{booking.userId}</td>
                      <td>{booking.serviceName || booking.serviceId}</td>
                      <td>{booking.date}</td>
                      <td>{booking.startTime}</td>
                      <td>{booking.duration} {booking.durationUnit}</td>
                      <td>₦{booking.totalPrice}</td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.paused && (
                          <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Paused
                          </span>
                        )}
                      </td>
                      <td>
                        {booking.status === 'inprogress' ? <BookingTimerCell booking={booking} /> : <span className="text-gray-400">-</span>}
                      </td>
                      <td>
                        <BookingActionsDropdown booking={booking} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#1D3A8A] transition-all duration-300 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-[#1D3A8A] to-[#214cc3] rounded-lg">
                      <span className="text-white font-bold text-lg">{booking.serviceName?.[0] || 'B'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{booking.serviceName || 'Workspace Booking'}</h3>
                      <p className="text-sm text-gray-500">ID: #{booking.id}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  {booking.paused && (
                    <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Paused
                    </span>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">User:</span> <span>{booking.userId}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">Date:</span> <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">Time:</span> <span>{booking.startTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> <span>{booking.duration} {booking.durationUnit}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">Price:</span> <span>₦{booking.totalPrice}</span>
                  </div>
                  {booking.status === 'inprogress' && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <span className="font-semibold">Timer:</span> <BookingTimerCell booking={booking} />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <BookingActionsDropdown booking={booking} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#1D3A8A]">Booking Details</h3>
              <button className="text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedBooking(null)} aria-label="Close">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1D3A8A] to-[#214cc3] rounded-lg p-4 text-white">
                <h4 className="font-semibold text-lg mb-2">{selectedBooking.serviceName || 'Workspace Booking'}</h4>
                <p className="text-blue-100">Service ID: #{selectedBooking.serviceId}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-gray-600">Booking ID:</span><span className="font-semibold">#{selectedBooking.id}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Date:</span><span className="font-semibold">{selectedBooking.date}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Start Time:</span><span className="font-semibold">{selectedBooking.startTime}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Duration:</span><span className="font-semibold">{selectedBooking.duration} {selectedBooking.durationUnit}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Total Price:</span><span className="font-semibold text-[#1D3A8A]">₦{selectedBooking.totalPrice?.toLocaleString?.() || selectedBooking.totalPrice}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Status:</span><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[selectedBooking.status] || 'bg-gray-100 text-gray-700'}`}>{selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}</span></div>
                {selectedBooking.userEmail && (<div className="flex items-center justify-between"><span className="text-gray-600">Email:</span><span className="font-semibold">{selectedBooking.userEmail}</span></div>)}
                {selectedBooking.createdAt && (<div className="flex items-center justify-between"><span className="text-gray-600">Created:</span><span className="font-semibold">{format(new Date(selectedBooking.createdAt), 'PPP p')}</span></div>)}
                {selectedBooking.updatedAt && (<div className="flex items-center justify-between"><span className="text-gray-600">Last Updated:</span><span className="font-semibold">{format(new Date(selectedBooking.updatedAt), 'PPP p')}</span></div>)}
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#1D3A8A] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#214cc3] transition-colors" onClick={() => handleDownloadReceipt(selectedBooking)}>Download Receipt</button>
                  <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setSelectedBooking(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Payment Modal */}
      {paymentModal && (
        <BookingPaymentModal
          booking={paymentModal.booking}
          open={!!paymentModal}
          mode={paymentModal.mode}
          extraAmount={paymentModal.extraAmount || 0}
          onClose={() => {
            setPaymentModal(null);
            // Update transaction status to failed if payment was cancelled
            if (paymentModal?.booking?.id) {
              updatePaystackTransaction(paymentModal.booking.id, 'failed');
            }
          }}
          onSuccess={async ({ method, reference, amount, cashtokenData }) => {
            if (paymentModal.mode === 'checkin') {
              await checkInBooking({
                bookingId: paymentModal.booking.id,
                userId: paymentModal.booking.userId,
                workspaceId: paymentModal.booking.workspaceId,
                amount,
                method,
                reference,
                cashtokenData,
              });
            } else {
              await completeBooking({
                bookingId: paymentModal.booking.id,
                userId: paymentModal.booking.userId,
                workspaceId: paymentModal.booking.workspaceId,
                extraAmount: paymentModal.extraAmount || 0,
                method,
                reference,
                cashtokenData,
              });
            }
            setPaymentModal(null);
            await refreshBookings();
          }}
          admin={true}
        />
      )}
    </WorkspaceLayout>
  );
};

export default WorkspaceBookingsPage; 