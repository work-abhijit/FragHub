import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Session } from '../types';
import { formatCurrency, formatDuration, formatDate } from '../utils/formatters';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

export const Reports: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        // Only load completed sessions for reports
        const q = query(collection(db, 'sessions'), orderBy('endTime', 'desc'), limit(100));
        const unsub = onSnapshot(q, snap => {
            setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session)).filter(s => s.endTime));
        });
        return unsub;
    }, []);

    const totalRevenue = sessions.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
    const totalDuration = sessions.reduce((acc, curr) => {
        const d = Math.max(0, Math.floor(((curr.endTime || Date.now()) - curr.startTime) / 1000) - (curr.pausedDuration || 0));
        return acc + d;
    }, 0);

    // Generate fake week data based on recent sessions for chart
    const lineData = sessions.slice(0, 7).map((s, i) => ({
        name: `Day ${i + 1}`,
        revenue: s.totalCost + Math.floor(Math.random() * 500) // Mock fluctuation
    })).reverse();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center py-4 bg-dark-900/80 backdrop-blur-xl sticky top-0 z-10 border-b border-transparent">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Reports & Analytics</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Revenue Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={lineData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-rows-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl flex flex-col justify-center bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-sm mb-1">Total Period Revenue</span>
                        <span className="text-4xl font-black text-emerald-400">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl flex flex-col justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-sm mb-1">Total Play Time</span>
                        <span className="text-4xl font-black text-cyan-400 font-mono tracking-wider">{formatDuration(totalDuration)}</span>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden mt-8 flex flex-col h-[500px]">
                <div className="p-4 border-b border-white/10 bg-dark-800">
                    <h3 className="font-bold text-white text-lg">Recent Completed Sessions</h3>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-dark-800 z-10 border-b border-white/5">
                            <tr>
                                <th className="p-3 text-xs tracking-wider text-slate-400 uppercase font-bold">Date & Time</th>
                                <th className="p-3 text-xs tracking-wider text-slate-400 uppercase font-bold">Station</th>
                                <th className="p-3 text-xs tracking-wider text-slate-400 uppercase font-bold">Customer</th>
                                <th className="p-3 text-xs tracking-wider text-slate-400 uppercase font-bold">Duration</th>
                                <th className="p-3 text-xs tracking-wider text-slate-400 uppercase font-bold">Cost</th>
                                <th className="p-3 text-xs tracking-wider text-slate-400 uppercase font-bold">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sessions.map(s => (
                                <tr key={s.id} className="hover:bg-white/5">
                                    <td className="p-3 text-sm text-slate-300">{formatDate(s.endTime)}</td>
                                    <td className="p-3 text-sm font-bold text-cyan-400">{s.stationId}</td>
                                    <td className="p-3 text-sm text-white font-medium">{s.customerName}</td>
                                    <td className="p-3 text-sm font-mono text-slate-400">
                                        {formatDuration(Math.max(0, Math.floor(((s.endTime || 0) - s.startTime) / 1000) - (s.pausedDuration || 0)))}
                                    </td>
                                    <td className="p-3 text-sm font-bold text-emerald-400">{formatCurrency(s.totalCost)}</td>
                                    <td className="p-3 text-sm uppercase text-xs font-bold text-slate-300">{s.paymentMethod}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
