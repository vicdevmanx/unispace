import { useState, useEffect } from 'react';
import { auth, db } from '../lib/Firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
}

export function useWorkspacePortal() {
  const [workspace, setWorkspace] = useState<WorkspacePortal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for workspace admin auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const wsDoc = await getDoc(doc(db, 'workspaces', user.uid));
        if (wsDoc.exists()) {
          const data = wsDoc.data() as WorkspacePortal;
          if (!data.approved) {
            await signOut(auth);
            setWorkspace(null);
            setError('Your workspace is pending admin approval.');
          } else {
            setWorkspace({ ...data, id: wsDoc.id });
            setError(null);
          }
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
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const wsDoc = await getDoc(doc(db, 'workspaces', cred.user.uid));
      if (wsDoc.exists()) {
        const data = wsDoc.data() as WorkspacePortal;
        if (!data.approved) {
          await signOut(auth);
          setWorkspace(null);
          setError('Your workspace is pending admin approval.');
          setLoading(false);
          return false;
        }
        Cookies.set('unispace_session', JSON.stringify({
          userType: 'workspace',
          id: wsDoc.id,
          email: data.email,
          name: data.name,
        }), { expires: 7 });
        setWorkspace({ ...data, id: wsDoc.id });
        setError(null);
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
    image?: string;
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
        image: data.image || '',
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

  return {
    workspace,
    loading,
    error,
    login,
    register,
    logout,
  };
} 