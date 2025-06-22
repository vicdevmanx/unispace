import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/Firebase';
import { User, UserType } from '../types/User';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, firstname: string, lastname: string, userType?: UserType) => Promise<User | null>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { login, register, forgotPassword, loading, error, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch userType, firstname, lastname from Firestore (if you store it there)
        let userType: UserType = 'normal';
        let firstname = '';
        let lastname = '';
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            userType = data.userType || 'normal';
            firstname = data.firstname || '';
            lastname = data.lastname || '';
          }
        } catch (e) {
          // fallback to defaults
        }
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          firstname,
          lastname,
          userType,
          photoURL: firebaseUser.photoURL || undefined,
        } as User);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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