import React, { useMemo } from 'react';
import { useAppStore } from '../../store/appStore';
import { Users, MonitorSmartphone, Activity, IndianRupee } from 'lucide-react';
import { calculateCost, calculateDuration } from '../../utils/calculations';
import { MEMBERSHIP_TIERS } from '../../utils/constants';

export const StatsBar: React.FC = () => {
    const { stations, activeSessions, customers } = useAppStore();

    const stats = useMemo(() => {
        const active = activeSessions.length;
        const available = stations.filter(s => s.status === 'available').length;
        const utilization = stations.length > 0 ? ((active / stations.length) * 100).toFixed(0) : 0;

        // Live active revenue
        let liveRevenue = 0;
        activeSessions.forEach(session => {
            const liveDuration = calculateDuration(session.startTime, null, session.pausedDuration, session.pausedStartTime);
            const station = stations.find(s => s.id === session.stationId);
            const cust = customers.find(c => c.id === session.customerId);
            const discount = cust ? MEMBERSHIP_TIERS[cust.membershipTier].discountPercent : 0;

            if (station) {
                const cost = calculateCost(liveDuration.durationMinutes, station.type, discount);
                liveRevenue += cost.totalCost;
            }
        });

        return {
            active,
            available,
            utilization,
            liveRevenue: liveRevenue.toFixed(0)
        };
    }, [stations, activeSessions, customers]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
                        <MonitorSmartphone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/60 text-sm font-semibold tracking-wide uppercase">Stations</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{stats.active}</span>
                    <span className="text-sm font-medium text-slate-400">/ {stations.length} Active</span>
                </div>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/20">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/60 text-sm font-semibold tracking-wide uppercase">Utilization</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{stats.utilization}%</span>
                    <span className="text-sm font-medium text-emerald-400">capacity</span>
                </div>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/20">
                        <IndianRupee className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/60 text-sm font-semibold tracking-wide uppercase">Running</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">₹{stats.liveRevenue}</span>
                    <span className="text-sm font-medium text-slate-400">est. active</span>
                </div>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/60 text-sm font-semibold tracking-wide uppercase">Total Users</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{customers.length}</span>
                    <span className="text-sm font-medium text-slate-400">registered</span>
                </div>
            </div>
        </div>
    );
};
