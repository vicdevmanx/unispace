import { useState } from 'react';
import { auth, db } from '../lib/Firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types/User';
import Cookies from 'js-cookie';

export type UserType = 'normal' | 'admin';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Register a new user
  const register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    userType: UserType = 'normal'
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        const userData: User = {
          uid: cred.user.uid,
          email: cred.user.email!,
          firstname,
          lastname,
          userType,
          photoURL: cred.user.photoURL || undefined,
          streak: 0,
          points: 0,
          bookings: 0,
          transactionHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          badges: [],
          isEmailVerified: cred.user.emailVerified,
        };
        await setDoc(doc(db, 'user', cred.user.uid), userData);
        return userData;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          Cookies.set('unispace_session', JSON.stringify({
            userType: userData.userType,
            uid: userData.uid,
            email: userData.email,
          }), { expires: 7 });
          return userData;
        } else {
          setError('User data not found.');
          return null;
        }
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const forgotPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    Cookies.remove('unispace_session');
    setUser(null);
  };

  // On load, try to read cookie and restore session if possible
  const session = Cookies.get('unispace_session');
  if (session && !user) {
    try {
      const data = JSON.parse(session);
      setUser({
        uid: data.uid,
        email: data.email,
        userType: data.userType,
        firstname: '',
        lastname: '',
        photoURL: '',
        streak: 0,
        points: 0,
        bookings: 0,
        transactionHistory: [],
        createdAt: '',
        updatedAt: '',
        badges: [],
        isEmailVerified: false,
      });
    } catch {}
  }

  return {
    loading,
    error,
    register,
    login,
    forgotPassword,
    logout,
  };
} 