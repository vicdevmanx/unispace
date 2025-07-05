import { useState } from 'react';
import { db } from '../lib/Firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp, increment, orderBy } from 'firebase/firestore';
import { Discount, Booking } from '../types/Workspace';
import { getDoc, setDoc } from 'firebase/firestore';

// Define your default discount here
const DEFAULT_DISCOUNT: Discount = {
  id: 'default',
  code: 'DEFAULT',
  percentage: 0, 
  expiry: '2099-12-31T23:59:59.999Z', 
  usageLimit: 1,
};

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate discount code
  const checkDiscountCode = async (workspaceId: string, code: string): Promise<{ discount: Discount | null, error: string | null }> => {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      setError(null);
      setLoading(false);
      // No code provided, return default discount
      return { discount: DEFAULT_DISCOUNT, error: null };
    }
    setLoading(true);
    setError(null);
    try {
      // Debug: log all discounts in this workspace
      const allDiscountsSnap = await getDocs(collection(db, 'workspaces', workspaceId, 'discounts'));
      const allDiscounts = allDiscountsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // console.log('All discounts in workspace', workspaceId, allDiscounts);
      const normalizedCode = code.trim().toUpperCase();
      // console.log('Discount code being checked:', normalizedCode);
      const discountsRef = collection(db, 'workspaces', workspaceId, 'discounts');
      const q = query(
        discountsRef,
        where('code', '==', normalizedCode)
      );
      const snap = await getDocs(q);
      // console.log('Query snapshot size:', snap.size);
      if (snap.empty) {
        setError('Discount code not found');
        if (loading) setLoading(false);
        return { discount: null, error: 'Discount code not found' };
      }
      const discount = snap.docs[0].data() as Discount;
      // console.log('Fetched discount:', discount);
      // Check expiry
      if (discount.expiry && new Date(discount.expiry) < new Date()) {
        setError('Discount code expired');
        if (loading) setLoading(false);
        return { discount: null, error: 'Discount code expired' };
      }
      // Check usage limit
      if (discount.usageLimit <= 0) {
        setError('Discount code usage limit reached');
        if (loading) setLoading(false);
        return { discount: null, error: 'Discount code usage limit reached' };
      }
      setLoading(false);
      return { discount: { ...discount, id: snap.docs[0].id }, error: null };
    } catch (err: any) {
      setError(err.message || 'Failed to check discount');
      if (loading) setLoading(false);
      return { discount: null, error: err.message || 'Failed to check discount' };
    }
  };

  // Decrement usageLimit after use
  const applyDiscountUsage = async (workspaceId: string, discountId: string) => {
    const discountRef = doc(db, 'workspaces', workspaceId, 'discounts', discountId);
    await updateDoc(discountRef, { usageLimit: increment(-1) });
  };

  // Get bookings for a service (for availability checks)
  const getBookingsForService = async (_workspaceId: string, serviceId: string, date: string) => {
    // Now use root-level bookings collection
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('serviceId', '==', serviceId), where('date', '==', date));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Booking);
  };

  // Create a booking (checks for conflicts)
  const createBooking = async (workspaceId: string, booking: Booking) => {
    setLoading(true);
    setError(null);
    // Check for seat/time conflicts
    const existing = await getBookingsForService(workspaceId, booking.serviceId, booking.date);
    // (Add logic here to check for overlapping time/seat conflicts if needed)
    // For now, just create the booking in root-level bookings collection
    await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setLoading(false);
  };

  // Get current bookings for a user (status: pending or inprogress)
  const getUserCurrentBookings = async (userId: string): Promise<Booking[]> => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      where('status', 'in', ['pending', 'inprogress'])
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  };

  // Get all bookings for a workspace (admin view)
  const getWorkspaceBookings = async (workspaceId: string): Promise<Booking[]> => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  };

  // Get all bookings for a user (all statuses)
  const getUserAllBookings = async (userId: string): Promise<Booking[]> => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  };

  // Log a transaction
  const logTransaction = async (transaction: {
    userId: string;
    bookingId: string;
    workspaceId?: string;
    amount: number;
    method: 'paystack' | 'cashtoken';
    status: 'success' | 'failed' | 'pending';
    reference?: string;
    createdAt?: string;
    extra?: any;
  }) => {
    // Remove undefined fields
    const cleanTransaction = Object.fromEntries(
      Object.entries(transaction).filter(([_, v]) => v !== undefined)
    );
    await addDoc(collection(db, 'transactions'), {
      ...cleanTransaction,
      createdAt: transaction.createdAt || new Date().toISOString(),
    });
  };

  // Update Paystack transaction status
  const updatePaystackTransaction = async (bookingId: string, status: 'success' | 'failed', reference?: string) => {
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef, 
      where('bookingId', '==', bookingId), 
      where('method', '==', 'paystack')
    );
    const transactionsSnap = await getDocs(q);
    
    // Update all matching Paystack transactions
    transactionsSnap.docs.forEach(async (doc) => {
      const updateData: any = { status };
      if (reference) updateData.reference = reference;
      await updateDoc(doc.ref, updateData);
    });
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: 'cancelled', updatedAt: new Date().toISOString() });
  };

  // Check in (start booking, handle payment)
  const checkInBooking = async ({
    bookingId,
    userId,
    workspaceId,
    amount,
    method,
    reference,
    cashtokenData,
  }: {
    bookingId: string;
    userId: string;
    workspaceId?: string;
    amount: number;
    method: 'paystack' | 'cashtoken';
    reference?: string;
    cashtokenData?: any;
  }) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    // Payment logic (Paystack or cashtoken)
    if (method === 'paystack') {
      // Assume payment is handled externally and reference is provided
      await updateDoc(bookingRef, { status: 'inprogress', updatedAt: new Date().toISOString() });
      await logTransaction({ 
        userId, 
        bookingId, 
        workspaceId,
        amount, 
        method, 
        status: 'success', 
        reference 
      });
    } else if (method === 'cashtoken') {
      // If cashtokenData is provided, it means the cashtoken was already created
      if (cashtokenData && cashtokenData.code) {
        // Cashtoken was already created, just update booking status
        await updateDoc(bookingRef, { status: 'inprogress', updatedAt: new Date().toISOString() });
        await logTransaction({ 
          userId, 
          bookingId, 
          workspaceId,
          amount, 
          method, 
          status: 'pending' 
        });
      } else {
        // Create cashtoken request for admin to validate
        await addDoc(collection(db, 'cashtokens'), {
          bookingId,
          userId,
          workspaceId,
          amount,
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...cashtokenData,
        });
        await updateDoc(bookingRef, { status: 'inprogress', updatedAt: new Date().toISOString() });
        await logTransaction({ 
          userId, 
          bookingId, 
          workspaceId,
          amount, 
          method, 
          status: 'pending' 
        });
      }
    }
  };

  // Complete booking (on checkout)
  const completeBooking = async ({
    bookingId,
    userId,
    workspaceId,
    extraAmount,
    method,
    reference,
    cashtokenData,
  }: {
    bookingId: string;
    userId: string;
    workspaceId?: string;
    extraAmount: number;
    method: 'paystack' | 'cashtoken';
    reference?: string;
    cashtokenData?: any;
  }) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: 'completed', updatedAt: new Date().toISOString() });
    if (extraAmount > 0) {
      if (method === 'paystack') {
        await logTransaction({ 
          userId, 
          bookingId, 
          workspaceId,
          amount: extraAmount, 
          method, 
          status: 'success', 
          reference 
        });
      } else if (method === 'cashtoken') {
        // If cashtokenData is provided, it means the cashtoken was already created
        if (cashtokenData && cashtokenData.code) {
          // Cashtoken was already created, just log the transaction
          await logTransaction({ 
            userId, 
            bookingId, 
            workspaceId,
            amount: extraAmount, 
            method, 
            status: 'pending' 
          });
        } else {
          // Create cashtoken request for admin to validate
          await addDoc(collection(db, 'cashtokens'), {
            bookingId,
            userId,
            workspaceId,
            amount: extraAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            type: 'overtime',
            ...cashtokenData,
          });
          await logTransaction({ 
            userId, 
            bookingId, 
            workspaceId,
            amount: extraAmount, 
            method, 
            status: 'pending' 
          });
        }
      }
    }
  };

  // Validate or reject a cashtoken transaction and update booking status
  const validateCashtoken = async (cashtokenId: string, bookingId: string, status: 'validated' | 'rejected') => {
    await updateDoc(doc(db, 'cashtokens', cashtokenId), { status });
    
    // Get the booking to determine the appropriate status update
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    const booking = bookingSnap.exists() ? bookingSnap.data() : null;
    
    // Update transaction status in transactions collection
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('bookingId', '==', bookingId), where('method', '==', 'cashtoken'));
    const transactionsSnap = await getDocs(q);
    
    if (status === 'validated') {
      // Determine if this should complete the booking or just start it
      let newBookingStatus = 'inprogress';
      if (booking && booking.status === 'inprogress') {
        // If booking is already in progress, this is likely a checkout/overtime payment
        newBookingStatus = 'completed';
      }
      
      await updateDoc(bookingRef, { 
        status: newBookingStatus, 
        updatedAt: new Date().toISOString() 
      });
      
      // Update transaction status to success
      transactionsSnap.docs.forEach(async (doc) => {
        await updateDoc(doc.ref, { status: 'success' });
      });
      // TODO: Notify user of validation (e.g., send email or in-app notification)
    } else if (status === 'rejected') {
      // For rejected cashtokens, only cancel if the booking is still pending
      if (booking && booking.status === 'pending') {
        await updateDoc(bookingRef, { 
          status: 'cancelled', 
          updatedAt: new Date().toISOString() 
        });
      }
      
      // Update transaction status to failed
      transactionsSnap.docs.forEach(async (doc) => {
        await updateDoc(doc.ref, { status: 'failed' });
      });
      // TODO: Notify user of rejection (e.g., send email or in-app notification)
    }
  };

  // Pause a booking
  const pauseBooking = async (bookingId: string) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      paused: true,
      pausedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  // Resume a booking (adjust startTime by paused duration)
  const resumeBooking = async (bookingId: string) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    // Get the booking to calculate pause duration
    const snap = await getDoc(bookingRef);
    if (!snap.exists()) return;
    const booking = snap.data();
    if (!booking.pausedAt) return;
    const pausedAt = new Date(booking.pausedAt);
    const now = new Date();
    const pauseDurationMs = now.getTime() - pausedAt.getTime();
    // Adjust startTime forward by pause duration
    const startTime = new Date(`${booking.date}T${booking.startTime}`);
    const newStartTime = new Date(startTime.getTime() + pauseDurationMs);
    // Format newStartTime as HH:mm (24hr)
    const pad = (n: number) => n.toString().padStart(2, '0');
    const newStartTimeStr = `${pad(newStartTime.getHours())}:${pad(newStartTime.getMinutes())}`;
    await updateDoc(bookingRef, {
      paused: false,
      pausedAt: null,
      startTime: newStartTimeStr,
      updatedAt: new Date().toISOString(),
    });
  };

  return {
    loading,
    error,
    checkDiscountCode,
    applyDiscountUsage,
    createBooking,
    getBookingsForService,
    getUserCurrentBookings,
    getWorkspaceBookings,
    cancelBooking,
    checkInBooking,
    completeBooking,
    logTransaction,
    validateCashtoken,
    pauseBooking,
    resumeBooking,
    updatePaystackTransaction,
    getUserAllBookings,
  };
} 