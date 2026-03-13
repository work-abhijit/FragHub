import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Session } from '../../types';
import { Play, Square, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Session[]>([]);

    useEffect(() => {
        // Only grab latest 15 sessions to act as an activity feed
        const q = query(
            collection(db, 'sessions'),
            orderBy('startTime', 'desc'),
            limit(15)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session)));
        });

        return unsubscribe;
    }, []);

    return (
        <div className="glass-card rounded-2xl p-5 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-white">Activity Log</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {activities.map(session => {
                    const isCompleted = session.endTime !== null;
                    return (
                        <div key={session.id} className="p-3 rounded-xl bg-dark-800/60 border border-white/5">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-sm font-semibold text-white">{session.customerName}</span>
                                <span className="text-xs text-slate-400">
                                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                                    {session.stationId}
                                </span>

                                {isCompleted ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                                        <Square className="w-3 h-3" /> Ended ({formatCurrency(session.totalCost)})
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded">
                                        <Play className="w-3 h-3" /> Started
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {activities.length === 0 && (
                    <div className="text-center text-slate-500 italic py-10">
                        No recent activity
                    </div>
                )}
            </div>
        </div>
    );
};
