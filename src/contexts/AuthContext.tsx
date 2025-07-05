import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/Firebase';
import { User, UserType } from '../types/User';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, firstname: string, lastname: string, userType?: UserType) => Promise<User | null>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { login, register, forgotPassword, loading, error, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchUserData = async (firebaseUser: any) => {
    let userType: UserType = 'normal';
    let firstname = '';
    let lastname = '';
    let phoneNumber = '';
    let occupation = '';
    let bio = '';
    let photoURL = '';
    let bookings = 0;
    let transactionHistory: any[] = [];
    let createdAt = '';
    let updatedAt = '';
    let badges: string[] = [];
    let isEmailVerified = false;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        userType = data.userType || 'normal';
        firstname = data.firstname || '';
        lastname = data.lastname || '';
        phoneNumber = data.phoneNumber || '';
        occupation = data.occupation || '';
        bio = data.bio || '';
        photoURL = data.photoURL || '';
        bookings = data.bookings || 0;
        transactionHistory = data.transactionHistory || [];
        createdAt = data.createdAt || '';
        updatedAt = data.updatedAt || '';
        badges = data.badges || [];
        isEmailVerified = data.isEmailVerified || false;
      }
    } catch (e) {
      // fallback to defaults
    }
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      firstname,
      lastname,
      userType,
      phoneNumber,
      occupation,
      bio,
      photoURL: photoURL || firebaseUser.photoURL || undefined,
      bookings,
      transactionHistory,
      createdAt,
      updatedAt,
      badges,
      isEmailVerified,
    } as User;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Log out if the session cookie is missing
  useEffect(() => {
    const session = Cookies.get('unispace_session');
    if (!session && user) {
      logout();
    }
  }, [user, logout]);

  const refreshUser = async () => {
    if (user) {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
      }
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || authLoading,
        error: error || authError,
        login,
        register,
        forgotPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}; 