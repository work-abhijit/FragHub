import React, { useEffect, useState } from 'react';
import { StatsBar } from '../components/dashboard/StatsBar';
import { StationGrid } from '../components/dashboard/StationGrid';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';

import { Clock } from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';

export const Dashboard: React.FC = () => {
    useRealtime(); // Activate realtime listeners for Dashboard

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Header Row for dashboard */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sticky top-0 bg-dark-900/80 backdrop-blur-xl z-20 py-2 border-b border-transparent">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Command Center</h1>
                        <p className="text-emerald-400 font-semibold tracking-wide text-sm mt-1">Live Server Monitor Active</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 bg-black/20">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span className="font-mono text-xl text-white font-bold tracking-widest">
                                {time.toLocaleTimeString('en-IN', { hour12: false })}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="overflow-y-auto pr-2 pb-10 custom-scrollbar flex-1">
                    <StatsBar />
                    <StationGrid />
                </div>
            </div>

            {/* Sidebar for Activity Feed */}
            <div className="md:w-80 flex-shrink-0 flex flex-col h-full hidden xl:flex pt-[72px]">
                <ActivityFeed />
            </div>
        </div>
    );
};
