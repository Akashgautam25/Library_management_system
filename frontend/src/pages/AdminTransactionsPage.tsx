import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { BookOpen, RefreshCw, Search, Filter } from 'lucide-react';
import { adminService } from '../services/adminService';

type StatusFilter = 'all' | 'borrowed' | 'returned' | 'overdue';

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
        borrowed: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        returned: 'bg-green-500/15 text-green-400 border-green-500/30',
        overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${map[status] || 'bg-white/10 text-secondaryText border-white/10'}`}>
            {status}
        </span>
    );
};

const FILTERS: { label: string; value: StatusFilter }[] = [
    { label: 'All Transactions', value: 'all' },
    { label: 'Active (Borrowed)', value: 'borrowed' },
    { label: 'Returned', value: 'returned' },
    { label: 'Overdue', value: 'overdue' },
];

const AdminTransactionsPage: React.FC = () => {
    const [filter, setFilter] = useState<StatusFilter>('all');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (f: StatusFilter) => {
        setLoading(true);
        try {
            const data = await adminService.getAllTransactions(f);
            setTransactions(data);
        } catch {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(filter); }, [filter]);

    const filtered = transactions.filter(t => {
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
                    <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-primaryText tracking-tight">All Transactions</h1>
                        <p className="text-sm text-secondaryText">System-wide book borrowing records</p>
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
                    <button onClick={() => load(filter)}
                        className="p-2.5 bg-white/5 hover:bg-accent/10 text-secondaryText hover:text-accent border border-white/10 rounded-xl transition-all"
                        title="Refresh">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Filter tabs */}
            <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl w-fit border border-white/5 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f.value} onClick={() => setFilter(f.value)}
                        className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f.value ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-secondaryText hover:text-primaryText hover:bg-white/5'}`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel rounded-[2rem] overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                    <Filter className="w-4 h-4 text-accent" />
                    <h3 className="font-black text-primaryText text-sm uppercase tracking-widest">
                        {filter === 'all' ? 'All Active' : filter.charAt(0).toUpperCase() + filter.slice(1)} Transactions
                    </h3>
                    <span className="ml-auto text-xs text-secondaryText font-bold">{filtered.length} records</span>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-white/5 animate-pulse rounded-xl" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-secondaryText opacity-20" />
                        <p className="text-secondaryText text-sm font-medium">No transactions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-secondaryText">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Book</th>
                                    <th className="px-6 py-4">Issue Date</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Return Date</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((t: any, i: number) => (
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
                                            {t.issueDate ? format(new Date(t.issueDate), 'MMM dd, yyyy') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondaryText">
                                            {t.dueDate ? format(new Date(t.dueDate), 'MMM dd, yyyy') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondaryText">
                                            {t.returnDate ? format(new Date(t.returnDate), 'MMM dd, yyyy') : (
                                                <span className="italic opacity-30">In progress</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={t.status || 'borrowed'} />
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

export default AdminTransactionsPage;
