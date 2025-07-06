import { useEffect, useState } from 'react';
import { db } from '../lib/Firebase';
import { collection, query, where, orderBy, limit as fbLimit, onSnapshot } from 'firebase/firestore';
import { Booking } from '../types/Workspace';
import { useUser } from './useUser';

const PAGE_SIZE = 10;

export function useUserBookings() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      fbLimit(PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
      setBookings(data);
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === PAGE_SIZE);
      setLoading(false);
    }, (err) => {
      setError(err.message || 'Failed to fetch bookings');
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line
  }, [user?.uid]);

  return {
    bookings,
    loading,
    error,
    hasMore,
    // Pagination for next/prev pages would need manual fetching, not real-time
    fetchNext: undefined,
    fetchPrev: undefined,
    page,
  };
} 