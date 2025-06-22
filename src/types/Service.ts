export interface Service {
  id: string; // Unique identifier
  name: string;
  address: string;
  geoAddress: string; // Geolocation or Google Maps link
  workingDays: string[]; // e.g. ['Monday', 'Tuesday', ...]
  workingTime: { start: string; end: string }; // e.g. { start: '08:00', end: '18:00' }
  capacity: number; // Number of seats/rooms
  minDuration: number; // in minium
  maxDuration: number; // in minium
  minCharge: number; // in Naira or your currency
  maxCharge: number; // in Naira or your currency
  images: string[]; // Array of image URLs
  contactLine: string; // Phone or WhatsApp
  features: string[]; // e.g. ['Projector', 'Whiteboard', 'WiFi']
  type: 'room' | 'seat' | 'desk' | 'meeting' | string; // Type of service
  description?: string; // Optional description
  visible?: boolean; // For toggling visibility
  createdAt?: string;
  updatedAt?: string;
}
