import { doc, writeBatch, collection, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Station, Customer } from '../types';

export const seedInitialData = async () => {
    try {
        const stationsSnap = await getDocs(collection(db, 'stations'));
        if (!stationsSnap.empty) {
            console.log('Database already seeded. Skipping.');
            return;
        }

        const batch = writeBatch(db);

        const pcStations: Station[] = Array.from({ length: 10 }).map((_, i) => ({
            id: `PC-${i + 1}`,
            name: `Gaming PC ${i + 1}`,
            type: 'pc',
            status: 'available',
            currentSessionId: null
        }));

        const ps5Stations: Station[] = Array.from({ length: 8 }).map((_, i) => ({
            id: `PS5-${i + 1}`,
            name: `PlayStation 5 - ${i + 1}`,
            type: 'ps5',
            status: 'available',
            currentSessionId: null
        }));

        [...pcStations, ...ps5Stations].forEach(station => {
            const ref = doc(db, 'stations', station.id);
            batch.set(ref, station);
        });

        // Mock Customers
        const mockCustomers: Customer[] = [
            {
                id: 'cust-1',
                name: 'Rahul Kumar',
                phone: '+919876543210',
                membershipTier: 'gold',
                totalSpent: 16500,
                visitCount: 24,
                joinDate: Date.now() - 1000 * 60 * 60 * 24 * 60,
                lastVisit: Date.now() - 1000 * 60 * 60 * 24 * 2
            },
            {
                id: 'cust-2',
                name: 'Amit Sharma',
                phone: '+919988776655',
                membershipTier: 'bronze',
                totalSpent: 1200,
                visitCount: 3,
                joinDate: Date.now() - 1000 * 60 * 60 * 24 * 10,
                lastVisit: Date.now()
            }
        ];

        mockCustomers.forEach(customer => {
            const ref = doc(db, 'customers', customer.id);
            batch.set(ref, customer);
        });

        await batch.commit();

        // Setup dummy admin details in users
        await setDoc(doc(db, 'users', 'admin-id-mock'), {
            id: 'admin-id-mock',
            email: 'admin@gameground.com',
            name: 'Super Admin',
            role: 'admin',
            createdAt: Date.now(),
            lastLogin: Date.now(),
            isActive: true
        });

        console.log('Successfully seeded database with original state!');
    } catch (error) {
        console.error('Error seeding db', error);
    }
};
