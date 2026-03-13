import React, { useEffect, useState } from 'react';
import { Monitor, Gamepad2, Play, Pause, Square, Clock, IndianRupee, Crown } from 'lucide-react';
import type { Station, Session, Customer } from '../../types';
import { MEMBERSHIP_TIERS } from '../../utils/constants';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import { calculateCost, calculateDuration } from '../../utils/calculations';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';

interface StationCardProps {
    station: Station;
    onStart: (station: Station) => void;
    onPause: (station: Station) => void;
    onResume: (station: Station) => void;
    onEnd: (station: Station, session: Session, customer: Customer | null) => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, onStart, onPause, onResume, onEnd }) => {
    const { activeSessions, customers } = useAppStore();

    const [session, setSession] = useState<Session | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [liveDuration, setLiveDuration] = useState({ durationSeconds: 0, durationMinutes: 0 });

    useEffect(() => {
        if (station.currentSessionId) {
            const active = activeSessions.find(s => s.id === station.currentSessionId);
            if (active) {
                setSession(active);
                const cust = customers.find(c => c.id === active.customerId);
                if (cust) setCustomer(cust);
            } else {
                setSession(null);
                setCustomer(null);
            }
        } else {
            setSession(null);
            setCustomer(null);
        }
    }, [station.currentSessionId, activeSessions, customers]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (session && !session.endTime && station.status === 'occupied') {
            interval = setInterval(() => {
                setLiveDuration(calculateDuration(session.startTime, null, session.pausedDuration, session.pausedStartTime));
            }, 1000);
        } else if (session && station.status === 'paused') {
            // Calculate once if paused
            setLiveDuration(calculateDuration(session.startTime, null, session.pausedDuration, session.pausedStartTime));
        }
        return () => clearInterval(interval);
    }, [session, station.status]);

    const Icon = station.type === 'pc' ? Monitor : Gamepad2;

    let cost = { baseRate: 0, discount: 0, totalCost: 0 };
    if (session && customer) {
        const tier = MEMBERSHIP_TIERS[customer.membershipTier];
        cost = calculateCost(liveDuration.durationMinutes, station.type, tier.discountPercent);
    } else if (session) {
        cost = calculateCost(liveDuration.durationMinutes, station.type, 0);
    }

    const getStatusStyles = () => {
        switch (station.status) {
            case 'available': return 'from-emerald-500/20 to-green-500/20 border-emerald-500/50 hover:scale-[1.02]';
            case 'occupied': return 'from-red-500/20 to-pink-500/20 border-red-500/50';
            case 'paused': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
            case 'maintenance': return 'from-slate-500/20 to-gray-500/20 border-slate-500/50';
            default: return 'from-slate-500/20 to-gray-500/20 border-slate-500/50';
        }
    };

    const getStatusDot = () => {
        switch (station.status) {
            case 'available': return 'bg-emerald-500';
            case 'occupied': return 'bg-red-500 animate-pulse-slow';
            case 'paused': return 'bg-yellow-500';
            case 'maintenance': return 'bg-slate-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className={`backdrop-blur-xl bg-gradient-to-br border rounded-2xl p-4 transition-all duration-300 ${getStatusStyles()} flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white text-lg">{station.id}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot()}`}></div>
                    <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                        {station.status}
                    </span>
                </div>
            </div>

            {station.status === 'available' && (
                <div className="mt-auto pt-4">
                    <Button onClick={() => onStart(station)} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 border-none">
                        <Play className="inline w-4 h-4 mr-2" /> Start Session
                    </Button>
                </div>
            )}

            {(station.status === 'occupied' || station.status === 'paused') && session && (
                <div className="flex flex-col flex-grow">
                    <div className="mb-4">
                        <h4 className="text-white font-semibold text-lg">{session.customerName}</h4>
                        <div className="text-cyan-400/80 text-sm mb-2">{session.customerPhone}</div>

                        {customer && (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${MEMBERSHIP_TIERS[customer.membershipTier].gradient} text-white text-xs font-bold shadow-md`}>
                                <Crown className="w-3.5 h-3.5" />
                                {MEMBERSHIP_TIERS[customer.membershipTier].label}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                        <div className="glass-card rounded-lg p-3 bg-black/20 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider font-semibold">Time</span>
                            </div>
                            <span className="font-mono text-lg text-white tracking-widest">
                                {formatDuration(liveDuration.durationSeconds)}
                            </span>
                        </div>

                        <div className="glass-card rounded-lg p-3 bg-black/20 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider font-semibold">Cost</span>
                            </div>
                            <span className="font-bold text-lg text-emerald-400">
                                {formatCurrency(cost.totalCost)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                        {station.status === 'occupied' ? (
                            <Button onClick={() => onPause(station)} variant="warning" className="flex-1 py-5">
                                <Pause className="w-4 h-4" /> Pause
                            </Button>
                        ) : (
                            <Button onClick={() => onResume(station)} variant="success" className="flex-1 py-5">
                                <Play className="w-4 h-4" /> Resume
                            </Button>
                        )}
                        <Button onClick={() => onEnd(station, session, customer)} variant="danger" className="flex-1 py-5">
                            <Square className="w-4 h-4" /> End
                        </Button>
                    </div>
                </div>
            )}

            {station.status === 'maintenance' && (
                <div className="mt-auto pt-4 text-center">
                    <span className="text-slate-400 font-semibold mb-2 block">Under Maintenance</span>
                </div>
            )}
        </div>
    );
};
