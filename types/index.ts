export interface RoomPricing {
  id: string;
  roomId: string;
  guestType: 'ADULT' | 'CHILD';
  guestCount: number;
  price: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  nameEn: string;
  nameZh: string;
  type: 'corner' | 'standard' | 'connecting';
  maxGuests: number;
  size: number;
  amenities: string[];
  images: string[];
  description: string;
  descriptionEn: string;
  descriptionZh: string;
  isConnecting?: boolean;
  connectsTo?: string;
  pricing?: {
    adult: RoomPricing[];
    child: RoomPricing[];
  };
}

export interface GuestBreakdown {
  adults: number;
  children: number;
  infants: number;
}

export interface PricingBreakdown {
  adults: { count: number; unitPrice: number; totalPrice: number };
  children: { count: number; unitPrice: number; totalPrice: number };
  infants: { count: number; unitPrice: number; totalPrice: number };
}

export interface PricingResult {
  totalPrice: number;
  breakdown: PricingBreakdown;
  nights: number;
}

export interface Booking {
  id: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  infants: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

export type Locale = 'ja' | 'en' | 'zh';