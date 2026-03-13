import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Input } from '../components/ui/Input';
import { Search, Crown } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MEMBERSHIP_TIERS } from '../utils/constants';

export const Customers: React.FC = () => {
    const { customers } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center bg-dark-900/80 backdrop-blur-xl sticky top-0 z-10 py-4 border-b border-transparent">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Customer Database</h1>

                <div className="w-80 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search name or phone..."
                        className="pl-10 h-12 text-md"
                    />
                </div>
            </div>

            <div className="glass-card flex-1 overflow-hidden p-0 rounded-2xl flex flex-col">
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-dark-800/90 backdrop-blur-md z-10 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-bold">Name & Contact</th>
                                <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-bold text-center">Tier</th>
                                <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-bold text-right">Total Spent</th>
                                <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-bold text-center">Visits</th>
                                <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-bold">Last Visit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
                                <tr key={customer.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {customer.name}
                                        </div>
                                        <div className="text-slate-400 text-sm font-mono mt-1">{customer.phone}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${MEMBERSHIP_TIERS[customer.membershipTier].gradient} text-white shadow-lg text-xs font-bold leading-none`}>
                                            <Crown className="w-3 h-3" />
                                            {MEMBERSHIP_TIERS[customer.membershipTier].label}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-bold text-emerald-400 text-lg tracking-tight">
                                            {formatCurrency(customer.totalSpent)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-dark-700 font-bold text-slate-300">
                                            {customer.visitCount}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono text-sm">
                                        {formatDate(customer.lastVisit)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">
                                        No customers found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
