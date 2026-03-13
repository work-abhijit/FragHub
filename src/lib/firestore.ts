import { collection, doc, query, onSnapshot, getDoc, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Customer, Session, Station } from '../types';
import { determineMembershipTier } from '../utils/calculations';

export const subscribeToStations = (callback: (stations: Station[]) => void) => {
    const q = query(collection(db, 'stations'));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Station)));
    });
};

export const subscribeToActiveSessions = (callback: (sessions: Session[]) => void) => {
    const q = query(collection(db, 'sessions'));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Session))
            .filter(session => session.endTime === null)
        );
    });
};

export const subscribeToCustomers = (callback: (customers: Customer[]) => void) => {
    const q = query(collection(db, 'customers'));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
    });
};

export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
    const q = query(collection(db, 'customers'));
    const snapshot = await getDocs(q);
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    return customers.find(c => c.phone === phone) || null;
};

export const startSession = async (station: Station, customerId: string, customerName: string, customerPhone: string, managerId: string) => {
    const sessionData: Omit<Session, 'id'> = {
        stationId: station.id,
        stationType: station.type,
        customerId,
        customerName,
        customerPhone,
        startTime: Date.now(),
        endTime: null,
        pausedDuration: 0,
        baseRate: 0,
        discount: 0,
        totalCost: 0,
        paymentMethod: null,
        paymentStatus: 'pending',
        managerId
    };

    const docRef = await addDoc(collection(db, 'sessions'), sessionData);

    await updateDoc(doc(db, 'stations', station.id), {
        status: 'occupied',
        currentSessionId: docRef.id
    });
    return docRef.id;
};

export const pauseSession = async (station: Station) => {
    if (!station.currentSessionId) return;

    await updateDoc(doc(db, 'sessions', station.currentSessionId), {
        pausedStartTime: Date.now()
    });

    await updateDoc(doc(db, 'stations', station.id), {
        status: 'paused'
    });
};

export const resumeSession = async (station: Station) => {
    if (!station.currentSessionId) return;

    const sn = await getDoc(doc(db, 'sessions', station.currentSessionId));
    const data = sn.data() as Session;

    let newPausedDuration = data.pausedDuration || 0;
    if (data.pausedStartTime) {
        newPausedDuration += Math.floor((Date.now() - data.pausedStartTime) / 1000);
    }

    await updateDoc(doc(db, 'sessions', station.currentSessionId), {
        pausedStartTime: null,
        pausedDuration: newPausedDuration
    });

    await updateDoc(doc(db, 'stations', station.id), {
        status: 'occupied'
    });
};

export const endSession = async (session: Session, station: Station, totalCostValue: number, paymentMethod: string) => {
    // Add time tracking
    let newPausedDuration = session.pausedDuration || 0;
    if (session.pausedStartTime) {
        newPausedDuration += Math.floor((Date.now() - session.pausedStartTime) / 1000);
    }

    // Mark session
    await updateDoc(doc(db, 'sessions', session.id), {
        endTime: Date.now(),
        pausedDuration: newPausedDuration,
        pausedStartTime: null,
        paymentMethod,
        paymentStatus: 'completed',
        totalCost: totalCostValue
    });

    await updateDoc(doc(db, 'stations', station.id), {
        status: 'available',
        currentSessionId: null
    });

    // Update customer
    if (session.customerId) {
        const cSn = await getDoc(doc(db, 'customers', session.customerId));
        if (cSn.exists()) {
            const cData = cSn.data() as Customer;
            const newTotalSpent = (cData.totalSpent || 0) + totalCostValue;
            const newTier = determineMembershipTier(newTotalSpent);

            await updateDoc(doc(db, 'customers', session.customerId), {
                totalSpent: newTotalSpent,
                visitCount: (cData.visitCount || 0) + 1,
                lastVisit: Date.now(),
                membershipTier: newTier
            });
        }
    }
};
