import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Session } from '../types';
import { formatCurrency, formatDuration, formatDate } from '../utils/formatters';
import { Download, Printer, Gamepad2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Receipt: React.FC = () => {
    const { sessionId } = useParams();
    const [searchParams] = useSearchParams();
    const id = sessionId || searchParams.get('id');

    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'sessions', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSession({ id: docSnap.id, ...docSnap.data() } as Session);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black text-white mb-4 uppercase">Receipt Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-md text-lg">We couldn't find the requested session record. Please verify the link or contact the cafe administrator.</p>
                <Button onClick={() => window.close()} variant="ghost">Close Window</Button>
            </div>
        );
    }

    const durationSeconds = Math.max(0, Math.floor(((session.endTime || Date.now()) - session.startTime) / 1000) - (session.pausedDuration || 0));

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 print:py-0 print:px-0 print:bg-white sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none">
                    {/* Header */}
                    <div className="bg-dark-900 px-8 py-10 text-white flex justify-between items-center print:bg-white print:text-black print:border-b print:border-slate-300">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-cyan-500 p-2 rounded-lg">
                                    <Gamepad2 className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight uppercase">FragHub</h1>

                            </div>
                            <p className="text-slate-400 text-sm print:text-slate-600">Premium Gaming & Esports Hub</p>
                        </div>
                        <div className="text-right">
                            <div className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-1 print:text-cyan-600">Digital Receipt</div>
                            <div className="text-3xl font-black">INV-{id?.slice(-6).toUpperCase()}</div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-12">
                        {/* Success Badge */}
                        <div className="flex items-center gap-3 text-emerald-600 font-bold mb-10 bg-emerald-50 px-4 py-2 rounded-full w-fit print:hidden">
                            <CheckCircle2 className="w-5 h-5" />
                            Session Payment Completed
                        </div>

                        {/* Customer & Session Info */}
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h4>
                                <div className="text-slate-900 font-bold text-xl mb-1">{session.customerName}</div>
                                <div className="text-slate-500 font-medium">{session.customerPhone}</div>
                            </div>
                            <div className="text-right">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Session Details</h4>
                                <div className="text-slate-900 font-bold text-lg mb-1">{session.stationId} ({session.stationType.toUpperCase()})</div>
                                <div className="text-slate-500 font-medium">{formatDate(session.endTime || session.startTime)}</div>
                            </div>
                        </div>

                        {/* Order Table */}
                        <div className="border-t border-b border-slate-100 py-6 mb-8">
                            <div className="grid grid-cols-12 gap-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-3 text-right">Duration</div>
                                <div className="col-span-3 text-right">Amount</div>
                            </div>
                            <div className="grid grid-cols-12 gap-4 text-slate-900 font-bold">
                                <div className="col-span-6">Gaming Session - {session.stationType.toUpperCase()}</div>
                                <div className="col-span-3 text-right font-mono">{formatDuration(durationSeconds)}</div>
                                <div className="col-span-3 text-right">{formatCurrency(session.totalCost)}</div>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-12">
                            <div className="w-full sm:w-64 space-y-3">
                                <div className="flex justify-between text-slate-500">
                                    <span className="font-semibold uppercase text-xs tracking-wider">Payment Method</span>
                                    <span className="font-bold text-slate-900 uppercase text-xs">{session.paymentMethod}</span>
                                </div>
                                <div className="h-px bg-slate-100 w-full" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xl font-black text-slate-900 uppercase">Total Paid</span>
                                    <span className="text-3xl font-black text-cyan-600">{formatCurrency(session.totalCost)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Message */}
                        <div className="text-center pt-12 border-t border-slate-100">
                            <p className="text-slate-500 font-medium mb-2">Thank you for playing at FragHub!</p>

                            <p className="text-slate-400 text-xs">This is a system generated digital receipt for your gaming session.</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-4 print:hidden">
                    <Button onClick={handlePrint} className="flex-1 bg-dark-900 py-6 h-auto text-lg rounded-2xl flex items-center justify-center gap-2">
                        <Download className="w-6 h-6" /> Download PDF / Receipt
                    </Button>
                    <Button onClick={handlePrint} variant="ghost" className="bg-white border-2 border-slate-200 py-6 h-auto text-slate-600 px-8 rounded-2xl">
                        <Printer className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
                    .print\\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:text-black { color: black !important; }
                    .print\\:border-b { border-bottom: 1px solid #e2e8f0 !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                }
            ` }} />
        </div>
    );
};
