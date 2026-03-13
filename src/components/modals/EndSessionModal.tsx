import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Station, Session, Customer } from '../../types';
import { MEMBERSHIP_TIERS } from '../../utils/constants';
import { calculateCost, calculateDuration } from '../../utils/calculations';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import { endSession } from '../../lib/firestore';
import { generateWhatsAppBillUrl } from '../../utils/whatsapp';
import { MessageSquare } from 'lucide-react';


interface EndSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    station: Station;
    session: Session;
    customer: Customer | null;
}

export const EndSessionModal: React.FC<EndSessionModalProps> = ({ isOpen, onClose, station, session, customer }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isCompleted, setIsCompleted] = useState(false);


    const [liveDuration, setLiveDuration] = useState({ durationSeconds: 0, durationMinutes: 0 });

    useEffect(() => {
        if (isOpen) {
            setIsCompleted(false);
        }
    }, [isOpen]);

    useEffect(() => {
        setLiveDuration(calculateDuration(session.startTime, null, session.pausedDuration, session.pausedStartTime));
    }, [session]);


    const discountPercent = customer ? MEMBERSHIP_TIERS[customer.membershipTier].discountPercent : 0;
    const cost = calculateCost(liveDuration.durationMinutes, station.type, discountPercent);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await endSession(session, station, cost.totalCost, paymentMethod);
            setIsCompleted(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendWhatsApp = () => {
        const url = generateWhatsAppBillUrl(
            session.customerPhone,
            session.customerName,
            station.name || station.id,
            formatDuration(liveDuration.durationSeconds),
            cost.totalCost,
            paymentMethod,
            session.id
        );

        window.open(url, '_blank');
        onClose();
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`End Session - ${station.id}`}>
            <div className="space-y-6">

                <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold text-lg mb-1">{session.customerName}</h3>
                    <p className="text-slate-400 text-sm mb-4">{session.customerPhone}</p>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-slate-300">
                            <span className="text-sm">Duration</span>
                            <span className="font-mono font-medium text-white">{formatDuration(liveDuration.durationSeconds)}</span>
                        </div>

                        <div className="flex justify-between items-center text-slate-300">
                            <span className="text-sm">Base Rate ({station.type.toUpperCase()})</span>
                            <span className="font-mono">{formatCurrency(cost.baseRate)}</span>
                        </div>

                        {cost.discount > 0 && (
                            <div className="flex justify-between items-center text-emerald-400">
                                <span className="text-sm">Discount ({discountPercent}%)</span>
                                <span className="font-mono">-{formatCurrency(cost.discount)}</span>
                            </div>
                        )}

                        <div className="h-px w-full bg-white/10 my-2" />

                        <div className="flex justify-between items-center text-white">
                            <span className="font-bold text-lg">Total Cost</span>
                            <span className="font-bold text-2xl text-emerald-400 tracking-tight">
                                {formatCurrency(cost.totalCost)}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['cash', 'upi', 'card', 'wallet'].map(method => (
                            <label
                                key={method}
                                className={`flex items-center justify-center py-3 px-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === method
                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                    : 'bg-dark-800 border-white/10 text-slate-300 hover:bg-dark-700'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="hidden"
                                />
                                <span className="font-semibold uppercase text-sm">{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {!isCompleted ? (
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} variant="success" className="flex-1" isLoading={loading}>
                            Confirm & Charge
                        </Button>
                    </div>
                ) : (
                    <div className="pt-4 space-y-3">
                        <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/20 text-center mb-4">
                            <p className="font-bold">Session Ended Successfully!</p>
                            <p className="text-sm opacity-80">Payment of {formatCurrency(cost.totalCost)} recorded via {paymentMethod.toUpperCase()}</p>
                        </div>
                        <Button onClick={handleSendWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none py-6 h-auto flex items-center justify-center gap-3 shadow-lg shadow-green-500/20">
                            <MessageSquare className="w-6 h-6" />
                            <div className="text-left">
                                <div className="font-bold text-lg">Send WhatsApp Bill</div>
                                <div className="text-xs opacity-80">Send to {session.customerPhone}</div>
                            </div>
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="w-full">
                            Close without sending
                        </Button>
                    </div>
                )}

            </div>
        </Modal>
    );
};
