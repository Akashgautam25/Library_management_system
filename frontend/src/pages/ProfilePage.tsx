import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types';
import { motion } from 'framer-motion';
import { Mail, Calendar, BookOpen, History, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import AdminProfilePage from './AdminProfilePage';

const StudentProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        transactionService.getMyHistory()
            .then(setHistory)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const borrowed = history.filter(t => t.status === 'borrowed').length;
    const returned = history.filter(t => t.status === 'returned').length;
    const fines = history.reduce((s, t) => s + (t.fine || 0), 0);

    if (!user) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-28 h-28 bg-gradient-to-tr from-accent to-blue-400 rounded-[1.8rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-accent/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-black text-primaryText tracking-tighter">{user.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="flex items-center gap-2 text-sm text-secondaryText bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                <Mail className="w-4 h-4 text-accent" />{user.email}
                            </span>
                            <span className="flex items-center gap-2 text-sm text-secondaryText bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                <Calendar className="w-4 h-4 text-accent" />Joined {format(new Date(user.createdAt || Date.now()), 'MMM yyyy')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Borrows', value: borrowed, icon: BookOpen, color: 'blue-500' },
                    { label: 'Total Returned', value: returned, icon: CheckCircle, color: 'green-500' },
                    { label: 'Outstanding Fines', value: `$${fines.toFixed(2)}`, icon: CreditCard, color: 'red-500' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 rounded-3xl flex items-center gap-4 hover:border-accent/40 transition-all">
                        <div className={`p-4 bg-${s.color}/10 text-${s.color} rounded-2xl`}>
                            <s.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondaryText opacity-50">{s.label}</p>
                            <h3 className="text-2xl font-black text-primaryText">{s.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* History Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-panel rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <History className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-black text-primaryText">My Borrowing History</h3>
                </div>
                {loading ? (
                    <div className="p-8 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-white/5 animate-pulse rounded-xl" />)}</div>
                ) : history.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-3 text-secondaryText">
                        <Clock className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-medium">No borrowing history yet. Start exploring the library!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-secondaryText">
                                    <th className="px-8 py-4">Book</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Issue Date</th>
                                    <th className="px-8 py-4">Return Date</th>
                                    <th className="px-8 py-4 text-right">Fine</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map(item => (
                                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-primaryText group-hover:text-accent transition-colors">
                                                {(item.bookId as any)?.title || 'Unknown'}
                                            </div>
                                            <div className="text-[11px] text-secondaryText">
                                                by {(item.bookId as any)?.author || '—'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                item.status === 'returned' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>{item.status}</span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-secondaryText">
                                            {format(new Date(item.issueDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-8 py-5 text-sm text-secondaryText">
                                            {item.returnDate ? format(new Date(item.returnDate), 'MMM dd, yyyy') : <span className="italic opacity-40">In progress</span>}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`text-sm font-black ${item.fine > 0 ? 'text-red-400' : 'text-secondaryText/30'}`}>
                                                {item.fine > 0 ? `$${item.fine.toFixed(2)}` : '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const ProfilePage: React.FC = () => {
    const { isAdmin } = useAuth();
    return isAdmin ? <AdminProfilePage /> : <StudentProfilePage />;
};

export default ProfilePage;
