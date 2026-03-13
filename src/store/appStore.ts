import { create } from 'zustand';
import type { Station, Session, Customer } from '../types';

interface AppState {
    stations: Station[];
    activeSessions: Session[];
    customers: Customer[];
    setStations: (stations: Station[]) => void;
    updateStation: (id: string, updates: Partial<Station>) => void;
    setActiveSessions: (sessions: Session[]) => void;
    setCustomers: (customers: Customer[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
    stations: [],
    activeSessions: [],
    customers: [],
    setStations: (stations) => set({ stations }),
    updateStation: (id, updates) =>
        set((state) => ({
            stations: state.stations.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
    setActiveSessions: (activeSessions) => set({ activeSessions }),
    setCustomers: (customers) => set({ customers }),
}));
