import { useEffect } from 'react';
import { subscribeToStations, subscribeToActiveSessions, subscribeToCustomers } from '../lib/firestore';
import { useAppStore } from '../store/appStore';

export const useRealtime = () => {
    const { setStations, setActiveSessions, setCustomers } = useAppStore();

    useEffect(() => {
        const unsubStations = subscribeToStations((stations) => setStations(stations));
        const unsubSessions = subscribeToActiveSessions((sessions) => setActiveSessions(sessions));
        const unsubCustomers = subscribeToCustomers((customers) => setCustomers(customers));

        return () => {
            unsubStations();
            unsubSessions();
            unsubCustomers();
        };
    }, [setStations, setActiveSessions, setCustomers]);
};
