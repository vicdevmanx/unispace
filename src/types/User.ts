export type UserType = 'normal' | 'admin';

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO string
  type: 'booking' | 'reward' | 'refund' | 'other';
  description?: string;
}

export interface User {
  uid: string;
  email: string;
  firstname: string;
  lastname: string;
  bio?: string;
  phoneNumber?: string;
  occupation?: string;
  userType: UserType;
  photoURL?: string;
  streak: number;
  points: number;
  leaderboardRank?: number;
  referralCode?: string;
  referredBy?: string;
  bookings: number;
  transactionHistory: Transaction[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  badges?: string[];
  isEmailVerified?: boolean;
  [key: string]: any;
} 