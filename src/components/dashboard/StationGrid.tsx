import React, { useState } from 'react';
import { StationCard } from './StationCard';
import { StartSessionModal } from '../modals/StartSessionModal';
import { EndSessionModal } from '../modals/EndSessionModal';
import { useAppStore } from '../../store/appStore';
import type { Station, Session, Customer } from '../../types';
import { pauseSession, resumeSession } from '../../lib/firestore';

export const StationGrid: React.FC = () => {
    const { stations } = useAppStore();
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [sessionToEnd, setSessionToEnd] = useState<Session | null>(null);
    const [customerToEnd, setCustomerToEnd] = useState<Customer | null>(null);

    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);

    const handleStart = (station: Station) => {
        setSelectedStation(station);
        setIsStartModalOpen(true);
    };

    const handlePause = async (station: Station) => {
        await pauseSession(station);
    };

    const handleResume = async (station: Station) => {
        await resumeSession(station);
    };

    const handleEnd = (station: Station, session: Session, customer: Customer | null) => {
        setSelectedStation(station);
        setSessionToEnd(session);
        setCustomerToEnd(customer);
        setIsEndModalOpen(true);
    };

    // Group stations by type
    const pcStations = stations.filter(s => s.type === 'pc');
    const ps5Stations = stations.filter(s => s.type === 'ps5');

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black italic md:not-italic font-sans mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-wide">
                    PC Stations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {pcStations.map(station => (
                        <StationCard
                            key={station.id}
                            station={station}
                            onStart={handleStart}
                            onPause={handlePause}
                            onResume={handleResume}
                            onEnd={handleEnd}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-black italic md:not-italic font-sans mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase tracking-wide">
                    PlayStation 5
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ps5Stations.map(station => (
                        <StationCard
                            key={station.id}
                            station={station}
                            onStart={handleStart}
                            onPause={handlePause}
                            onResume={handleResume}
                            onEnd={handleEnd}
                        />
                    ))}
                </div>
            </div>

            {selectedStation && isStartModalOpen && (
                <StartSessionModal
                    isOpen={isStartModalOpen}
                    onClose={() => setIsStartModalOpen(false)}
                    station={selectedStation}
                />
            )}

            {selectedStation && sessionToEnd && isEndModalOpen && (
                <EndSessionModal
                    isOpen={isEndModalOpen}
                    onClose={() => setIsEndModalOpen(false)}
                    station={selectedStation}
                    session={sessionToEnd}
                    customer={customerToEnd}
                />
            )}
        </div>
    );
};
