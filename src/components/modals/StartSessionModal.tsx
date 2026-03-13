import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Station, Customer } from '../../types';
import { useAppStore } from '../../store/appStore';
import { startSession } from '../../lib/firestore';
import { useAuthStore } from '../../store/authStore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search } from 'lucide-react';

interface StartSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    station: Station;
}

export const StartSessionModal: React.FC<StartSessionModalProps> = ({ isOpen, onClose, station }) => {
    const { customers } = useAppStore();
    const { user } = useAuthStore();

    const [phoneSearch, setPhoneSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (v: string) => {
        setPhoneSearch(v);
        const existing = customers.find(c => c.phone === v);
        if (existing) {
            setSelectedCustomer(existing);
            setName(existing.name);
            setPhone(existing.phone);
        } else {
            setSelectedCustomer(null);
            setPhone(v);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            let customerId = selectedCustomer?.id;

            // Create guest/customer if doesn't exist but phone provided or creating new
            if (!customerId) {
                customerId = crypto.randomUUID(); // Auto-generation for our mock/firebase
                const newCustomer: Customer = {
                    id: customerId,
                    name: name,
                    phone: phone || `guest-${Date.now()}`,
                    membershipTier: 'bronze',
                    totalSpent: 0,
                    visitCount: 0,
                    joinDate: Date.now(),
                    lastVisit: Date.now()
                };
                await setDoc(doc(db, 'customers', customerId), newCustomer);
            }

            await startSession(station, customerId, name, phone, user?.id || 'unknown manager');
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Start Session - ${station.id}`}>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="relative">
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Phone Number (Optional)</label>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <Input
                            value={phoneSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search or enter phone..."
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                    {selectedCustomer && (
                        <div className="mt-2 text-sm text-emerald-400 font-medium">
                            Found existing customer: {selectedCustomer.name} ({selectedCustomer.membershipTier})
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Customer Name *</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter name"
                        className="w-full"
                        disabled={!!selectedCustomer}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
                        Start Session
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
