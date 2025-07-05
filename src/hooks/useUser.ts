import { useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { useAuthContext } from '../contexts/AuthContext';

export function useUser() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from Firestore
  const fetchUser = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    setError(null);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update user profile (optionally with image)
  const updateUser = useCallback(
    async (fields: any, imageFile?: File) => {
      if (!user) throw new Error('Not authenticated');
      setLoading(true);
      setError(null);
      let photoURL = fields.photoURL;
      try {
        if (imageFile) {
          photoURL = await uploadImageToCloudinary(imageFile);
        }
        await updateDoc(doc(db, 'users', user.uid), {
          ...fields,
          ...(photoURL ? { photoURL } : {}),
          updatedAt: new Date().toISOString(),
        });
        return { ...fields, photoURL };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
  };
} 