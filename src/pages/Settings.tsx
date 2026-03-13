import React from 'react';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex justify-between items-center py-4 bg-dark-900/80 backdrop-blur-xl sticky top-0 z-10 border-b border-transparent">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Settings</h1>
            </div>

            <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Global Configuration</h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">PC Hourly Rate (₹)</label>
                            <div className="glass-input flex items-center px-4 py-2 rounded-lg bg-dark-800 border-white/10">
                                <span className="text-white font-mono text-lg font-bold">80</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">PS5 Hourly Rate (₹)</label>
                            <div className="glass-input flex items-center px-4 py-2 rounded-lg bg-dark-800 border-white/10">
                                <span className="text-white font-mono text-lg font-bold">100</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-white/5">
                        <div>
                            <h4 className="text-white font-bold">Maintenance Mode</h4>
                            <p className="text-slate-400 text-sm mt-1">Disables new sessions from being started globally.</p>
                        </div>
                        <div className="w-12 h-6 bg-dark-900 rounded-full border border-white/20 relative cursor-not-allowed opacity-50">
                            <div className="w-4 h-4 bg-slate-500 rounded-full absolute left-1 top-1"></div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <Button variant="primary">Save Configuration</Button>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border-red-500/20 bg-red-900/5">
                <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
                <p className="text-red-400/80 text-sm mb-6">These actions affect the database directly with no undo available.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="danger" className="w-full sm:w-auto px-8">Reset All Stations</Button>
                    <Button variant="secondary" className="w-full sm:w-auto px-8 hover:text-red-400 hover:border-red-400">Clear Active Sessions</Button>
                </div>
            </div>
        </div>
    );
};
