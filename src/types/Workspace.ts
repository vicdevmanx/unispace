export interface Workspace {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  adminUid: string;
  visible: boolean;
  approved: boolean;
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
}