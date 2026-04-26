import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { AlertCircle, RefreshCw, Search, DollarSign, Bell, Edit2, ShieldAlert } from 'lucide-react';
import { adminService, OverdueTransaction } from '../services/adminService';

const AdminOverduePage: React.FC = () => {
    const [overdue, setOverdue] = useState<OverdueTransaction[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getOverdueTransactions();
            setOverdue(data);
        } catch {
            toast.error('Failed to load overdue transactions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleApplyFine = async (t: OverdueTransaction) => {
        // Mock apply fine action for now, as there isn't a dedicated apply fine endpoint yet
        // In a real app, you would call an endpoint to update the fine.
        toast.success(`Fine applied for ${t.userId.name}`);
    };

    const handleWaiveFine = async (t: OverdueTransaction) => {
        // Mock waive fine
        toast.success(`Fine waived for ${t.userId.name}`);
    };

    const handleSendReminder = async (t: OverdueTransaction) => {
        toast.success(`Reminder sent to ${t.userId.email}`);
    };


    const filtered = overdue.filter(t => {
        if (!search) return true;
        const name = t.userId?.name || '';
        const title = t.bookId?.title || '';
        return name.toLowerCase().includes(search.toLowerCase()) ||
            title.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-primaryText tracking-tight">Overdue &amp; Fines</h1>
                        <p className="text-sm text-secondaryText">Manage late returns and apply penalties</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search user or book..."
                            className="pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-primaryText placeholder:text-secondaryText/50 focus:outline-none focus:border-accent/50 w-56"
                        />
                    </div>
                    <button onClick={load}
                        className="p-2.5 bg-white/5 hover:bg-accent/10 text-secondaryText hover:text-accent border border-white/10 rounded-xl transition-all"
                        title="Refresh">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel rounded-[2rem] overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <h3 className="font-black text-primaryText text-sm uppercase tracking-widest">
                        Overdue Books
                    </h3>
                    <span className="ml-auto text-xs text-red-400 font-bold">{filtered.length} records</span>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1,2,3].map(i => <div key={i} className="h-14 bg-white/5 animate-pulse rounded-xl" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-secondaryText opacity-20" />
                        <p className="text-secondaryText text-sm font-medium">No overdue books found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-secondaryText">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Book</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4 text-center">Days Late</th>
                                    <th className="px-6 py-4 text-right">Fine</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((t, i) => (
                                    <motion.tr key={t._id || i}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                        className="hover:bg-white/[0.025] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-primaryText group-hover:text-accent transition-colors text-sm">
                                                {t.userId?.name || 'Unknown'}
                                            </div>
                                            <div className="text-[11px] text-secondaryText">{t.userId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-primaryText text-sm">{t.bookId?.title || 'Unknown'}</div>
                                            <div className="text-[11px] text-secondaryText">by {t.bookId?.author || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondaryText">
                                            {t.dueDate ? format(new Date(t.dueDate), 'MMM dd, yyyy') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-red-400 font-black text-lg">{t.daysLate}d</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-red-400 font-black flex items-center justify-end gap-1">
                                                <DollarSign className="w-4 h-4" />{(t.fine || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                             <button onClick={() => handleSendReminder(t)} title="Send Reminder"
                                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all">
                                                <Bell className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleApplyFine(t)} title="Apply Fine"
                                                className="p-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white rounded-lg transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminOverduePage;
