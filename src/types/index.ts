export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager';
    createdAt: number;
    lastLogin: number;
    isActive: boolean;
}

export type StationType = 'pc' | 'ps5';
export type StationStatus = 'available' | 'occupied' | 'paused' | 'maintenance';

export interface Station {
    id: string;
    name: string;
    type: StationType;
    status: StationStatus;
    currentSessionId: string | null;
}

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'completed';

export interface Session {
    id: string;
    stationId: string;
    stationType: StationType;
    customerId: string;
    customerName: string;
    customerPhone: string;
    startTime: number;
    endTime: number | null;
    pausedDuration: number; // in seconds
    baseRate: number;
    discount: number;
    totalCost: number;
    paymentMethod: PaymentMethod | null;
    paymentStatus: PaymentStatus;
    managerId: string;
    pausedStartTime?: number | null; // Track when it was paused
}

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    membershipTier: MembershipTier;
    totalSpent: number;
    visitCount: number;
    joinDate: number;
    lastVisit: number;
}
