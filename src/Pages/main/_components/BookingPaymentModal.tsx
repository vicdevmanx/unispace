import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { db } from '../../../lib/Firebase';
import { getDocs, where, collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { loadPaystackScript } from '../../../utils/loadPaystackScript';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export const BookingPaymentModal = ({
  booking,
  open,
  onClose,
  onSuccess,
  mode = 'checkin', // 'checkin' or 'checkout'
  extraAmount = 0,
  admin = false, // NEW: admin mode disables Paystack
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'cashtoken' | null>(null);
  const [paystackError, setPaystackError] = useState<string | null>(null);
  const [cashtokenGenerated, setCashtokenGenerated] = useState<string | null>(null);
  const [cashtokenGenLoading, setCashtokenGenLoading] = useState(false);
  const [cashtokenStatus, setCashtokenStatus] = useState<string | null>(null);
  const [cashtokenError, setCashtokenError] = useState<string | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  React.useEffect(() => {
    loadPaystackScript();
  }, []);

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

  // Real-time cashtoken status updates
  React.useEffect(() => {
    if (!cashtokenGenerated || !booking?.id) return;
    const q = query(
      collection(db, 'cashtokens'),
      where('bookingId', '==', booking.id),
      where('token', '==', cashtokenGenerated)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (data.status === 'validated') {
          setCashtokenStatus('validated');
          // Complete the checkout/checkin process
          onSuccess({
            method: 'cashtoken',
            reference: undefined,
            amount: mode === 'checkin' ? booking.totalPrice : extraAmount,
            cashtokenData: { code: cashtokenGenerated }
          });
          // Reload page after showing success message
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        else if (data.status === 'rejected') setCashtokenStatus('rejected');
        else setCashtokenStatus(data.status);
      }
    });
    return () => unsub();
  }, [cashtokenGenerated, booking?.id, onSuccess, mode, booking?.totalPrice, extraAmount]);

  const handlePayment = async () => {
    if (!paymentMethod) return;
    setCheckInLoading(true);
    setPaystackError(null);
    setCashtokenError(null);
    try {
      if (paymentMethod === 'paystack') {
        const paystackHandler = (window as any).PaystackPop || (window as any).PaystackOrPopup;
        const email = booking.userEmail;
        paystackHandler && paystackHandler.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email,
          amount: (mode === 'checkin' ? booking.totalPrice : extraAmount) * 100,
          currency: 'NGN',
          ref: 'PSK_' + Date.now(),
          callback: async (response: any) => {
            onSuccess({
              method: 'paystack',
              reference: response.reference,
              amount: mode === 'checkin' ? booking.totalPrice : extraAmount,
            });
            setCheckInLoading(false);
          },
          onClose: () => {
            setPaystackError('Payment was cancelled.');
            setCheckInLoading(false);
          },
        }).openIframe();
        return;
      }
      if (paymentMethod === 'cashtoken') {
        setCashtokenGenLoading(true);
        try {
          // Check for existing cashtoken first
          const existingToken = await checkExistingCashtoken(booking.id);
          if (existingToken) {
            setCashtokenGenerated(existingToken);
            setCashtokenGenLoading(false);
            setCashtokenStatus(null);
            return;
          }

          const token = uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
          const cashtokenData: Record<string, any> = {
            token,
            userId: booking.userId,
            bookingId: booking.id,
            workspaceId: booking.workspaceId,
            amount: mode === 'checkin' ? booking.totalPrice : extraAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            type: mode === 'checkout' ? 'overtime' : 'normal',
          };
          if (booking.userEmail) cashtokenData['userEmail'] = booking.userEmail;
          if (booking.workspaceName) cashtokenData['workspaceName'] = booking.workspaceName;
          Object.keys(cashtokenData).forEach(key => cashtokenData[key] === undefined && delete cashtokenData[key]);
          await addDoc(collection(db, 'cashtokens'), cashtokenData);
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
        return;
      }
    } catch (err: any) {
      setPaystackError(err.message || 'Payment failed.');
      setCheckInLoading(false);
    }
    setCheckInLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Select Payment Method</h3>
        <p className="text-gray-600 mb-4">
          {mode === 'checkin'
            ? `To check in, please pay ₦${booking.totalPrice?.toLocaleString?.() || booking.totalPrice}.`
            : `You are in overtime. Please pay ₦${extraAmount} to complete your booking.`}
        </p>
        <div className="flex flex-col gap-3 mb-4">
          {!admin && (
            <button
              className={`px-4 py-2 rounded-lg font-medium border ${paymentMethod === 'paystack' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setPaymentMethod('paystack')}
              disabled={checkInLoading}
            >
              Pay with Paystack
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-lg font-medium text-[#1D3A8A] border border-[#1D3A8A] ${paymentMethod === 'cashtoken' ? 'bg-[#1D3A8A] text-white' : 'bg-gray-100'}`}
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
                  return;
                }

                const token = uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
                const cashtokenData: Record<string, any> = {
                  token,
                  userId: booking.userId,
                  bookingId: booking.id,
                  workspaceId: booking.workspaceId,
                  amount: mode === 'checkin' ? booking.totalPrice : extraAmount,
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                  type: mode === 'checkout' ? 'overtime' : 'normal',
                };
                if (booking.userEmail) cashtokenData['userEmail'] = booking.userEmail;
                if (booking.workspaceName) cashtokenData['workspaceName'] = booking.workspaceName;
                Object.keys(cashtokenData).forEach(key => cashtokenData[key] === undefined && delete cashtokenData[key]);
                await addDoc(collection(db, 'cashtokens'), cashtokenData);
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
                onClick={handlePayment}
                title="Refresh status"
              >
                Refresh
              </button>
            </div>
            {cashtokenStatus === 'validated' && (
              <div className="text-green-700 font-semibold">Cashtoken validated! Your payment is complete.</div>
            )}
            {cashtokenStatus === 'rejected' && (
              <div className="text-red-700 font-semibold">Cashtoken was rejected by admin. Please try another payment method.</div>
            )}
            {cashtokenStatus && !['validated', 'rejected'].includes(cashtokenStatus) && (
              <div className="text-gray-600 font-medium">Status: {cashtokenStatus}</div>
            )}
            <div className="text-xs text-gray-500">Share this code with the workspace admin to complete your payment.</div>
          </div>
        )}
        {cashtokenGenLoading && (
          <div className="text-center text-gray-600 mb-2">Generating Cashtoken...</div>
        )}
        {cashtokenError && <div className="text-red-600 text-sm mb-2">{cashtokenError}</div>}
        {paystackError && <div className="text-red-600 text-sm mb-2">{paystackError}</div>}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
            onClick={onClose}
            disabled={checkInLoading}
          >
            Cancel
          </button>
          {/* <button
            className="px-4 py-2 rounded-lg bg-[#1D3A8A] text-white hover:bg-[#214cc3] font-medium"
            onClick={handlePayment}
            disabled={checkInLoading || !paymentMethod}
          >
            {checkInLoading ? 'Processing...' : 'Pay & Complete'}
          </button> */}
        </div>
      </div>
    </div>
  );
};
