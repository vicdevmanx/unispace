import { useState, useEffect } from 'react';
import { auth, db } from '../lib/Firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, User as FirebaseUser, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, doc as firestoreDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import Cookies from 'js-cookie';

export interface WorkspacePortal {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
  address: string;
  createdAt: string;
  updatedAt?: string;
  adminUid?: string;
  approved: boolean;
  cacNumber?: string;
  brandLogo?: string;
  cacDocument?: string;
}

export function useWorkspacePortal() {
  const [workspace, setWorkspace] = useState<WorkspacePortal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Listen for workspace admin auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setPending(false);
      if (user) {
        const wsDoc = await getDoc(doc(db, 'workspaces', user.uid));
        if (wsDoc.exists()) {
          const data = wsDoc.data() as WorkspacePortal;
          setWorkspace({ ...data, id: wsDoc.id });
          setPending(!data.approved);
          setError(!data.approved ? 'Your workspace is pending admin approval.' : null);
        } else {
          setWorkspace(null);
        }
      } else {
        setWorkspace(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login as workspace admin
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setPending(false);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const wsDoc = await getDoc(doc(db, 'workspaces', cred.user.uid));
      if (wsDoc.exists()) {
        const data = wsDoc.data() as WorkspacePortal;
        setWorkspace({ ...data, id: wsDoc.id });
        setPending(!data.approved);
        setError(!data.approved ? 'Your workspace is pending admin approval.' : null);
        Cookies.set('unispace_session', JSON.stringify({
          userType: 'workspace',
          id: wsDoc.id,
          email: data.email,
          name: data.name,
        }), { expires: 7 });
        return true;
      } else {
        setError('Workspace not found.');
        setWorkspace(null);
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      setWorkspace(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register a new workspace
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    cacNumber?: string;
    brandLogo?: string;
    cacDocument?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, 'workspaces', cred.user.uid), {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        cacNumber: data.cacNumber || '',
        brandLogo: data.brandLogo || '',
        cacDocument: data.cacDocument || '',
        image: '', // deprecated, for backward compatibility
        approved: false,
        createdAt: new Date().toISOString(),
      });
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      Cookies.remove('unispace_session');
      setWorkspace(null);
      setPending(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // On load, try to read cookie and restore session if possible
  useEffect(() => {
    const session = Cookies.get('unispace_session');
    if (session && !workspace) {
      try {
        const data = JSON.parse(session);
        if (data.userType === 'workspace') {
          setWorkspace({
            id: data.id,
            name: data.name,
            email: data.email,
            phoneNumber: '',
            address: '',
            createdAt: '',
            approved: true,
          });
        }
      } catch {}
    }
  }, [workspace]);

  // Discount code management
  const getDiscounts = async (workspaceId: string) => {
    const discountsCol = collection(db, 'workspaces', workspaceId, 'discounts');
    const snapshot = await getDocs(discountsCol);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
  };

  const addDiscount = async (workspaceId: string, discount: Omit<any, 'id'>) => {
    const discountsCol = collection(db, 'workspaces', workspaceId, 'discounts');
    const docRef = await addDoc(discountsCol, discount);
    return { id: docRef.id, ...discount };
  };

  const updateDiscount = async (workspaceId: string, discountId: string, discount: any) => {
    const discountRef = firestoreDoc(db, 'workspaces', workspaceId, 'discounts', discountId);
    await updateDoc(discountRef, discount);
  };

  const deleteDiscount = async (workspaceId: string, discountId: string) => {
    const discountRef = firestoreDoc(db, 'workspaces', workspaceId, 'discounts', discountId);
    await deleteDoc(discountRef);
  };

  const updateWorkspaceProfile = async (workspaceId: string, profileData: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    image?: string;
  }) => {
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    await updateDoc(workspaceRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateWorkspacePassword = async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }
    await updatePassword(user, newPassword);
  };

  return {
    workspace,
    loading,
    error,
    pending,
    login,
    register,
    logout,
    getDiscounts,
    addDiscount,
    updateDiscount,
    deleteDiscount,
    updateWorkspaceProfile,
    updateWorkspacePassword,
  };
} 