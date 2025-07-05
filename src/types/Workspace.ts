import { Timestamp } from "firebase/firestore";

export interface Workspace {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  adminUid: string;
  visible: boolean;
  approved: boolean;
  brandLogo?: string;
  cacDocument?: string;
  cacNumber?: string;
  [key: string]: any;
}

export interface Service {
  id: string;
  name: string;
  address: string;
  geoAddress: string;
  workingDays: string[];
  workingTime: { start: string; end: string };
  capacity: number;
  minDuration: number;
  maxDuration: number;
  minCharge: number;
  maxCharge: number;
  images?: (string | File)[];
  contactLine: string;
  features: string[];
  type: 'room' | 'seat' | 'desk' | 'meeting' | string;
  description?: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
  durationUnit?: string;
  workspaceId?: string;
}

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  expiry: string; // ISO date string
  usageLimit: number;
}

export interface Booking {
  id?: string;
  userId: string;
  serviceId: string;
  workspaceId: string;
  date: string;
  startTime: string; 
  duration: number;
  numSeats: number;
  totalPrice: number;
  discountCode?: string;
  status: 'pending' | 'inprogress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  durationUnit?: string;
  paused?: boolean;
  pausedAt?: string | null;
}