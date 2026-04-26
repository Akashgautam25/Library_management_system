import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
    Shield, Mail, Calendar, Library, Users, BookOpen, AlertCircle,
    History, Ban, Trash2, Eye, Check, DollarSign, ArrowUpRight,
    CheckCircle, MoreVertical, RefreshCw, Clock
} from 'lucide-react';
import { adminService, UserWithStats, OverdueTransaction, ActivityLog } from '../services/adminService';
import { transactionService } from '../services/transactionService';
import { DashboardStats } from '../types';

type Tab = 'overview' | 'users' | 'overdue' | 'logs';

const Badge = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        blocked: 'bg-red-500/10 text-red-400 border-red-500/20',
        returned: 'bg-green-500/10 text-green-400 border-green-500/20',
        borrowed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        overdue: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        student: 'bg-accent/10 text-accent border-accent/20',
        admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        BOOK_ISSUED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        BOOK_RETURNED: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    const cls = map[status] || 'bg-white/10 text-secondaryText border-white/10';
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const Skeleton = ({ rows = 3 }: { rows?: number }) => (
    <div className="p-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 animate-pulse rounded-xl" />
        ))}
    </div>
);

const EmptyState = ({ msg }: { msg: string }) => (
    <div className="py-16 flex flex-col items-center gap-3 text-secondaryText">
        <Clock className="w-10 h-10 opacity-20" />
        <p className="text-sm font-medium">{msg}</p>
    </div>
);

const AdminProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState<Tab>('overview');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<UserWithStats[]>([]);
    const [overdue, setOverdue] = useState<OverdueTransaction[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingOverdue, setLoadingOverdue] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(false);

    // Load stats on mount
    useEffect(() => {
        transactionService.getDashboardStats()
            .then(setStats)
            .catch(() => toast.error('Failed to load stats'))
            .finally(() => setLoadingStats(false));
    }, []);

    // Lazy-load per tab
    useEffect(() => {
        if (tab === 'users' && users.length === 0) {
            setLoadingUsers(true);
            adminService.getAllUsersWithStats()
                .then(data => setUsers(data.filter(u => u.role === 'student')))
                .catch(() => toast.error('Failed to load users'))
                .finally(() => setLoadingUsers(false));
        }
        if (tab === 'overdue' && overdue.length === 0) {
            setLoadingOverdue(true);
            adminService.getOverdueTransactions()
                .then(setOverdue)
                .catch(() => toast.error('Failed to load overdue'))
                .finally(() => setLoadingOverdue(false));
        }
        if (tab === 'logs' && logs.length === 0) {
            setLoadingLogs(true);
            adminService.getActivityLogs(30)
                .then(setLogs)
                .catch(() => toast.error('Failed to load logs'))
                .finally(() => setLoadingLogs(false));
        }
    }, [tab]);

    const handleBlock = useCallback(async (u: UserWithStats) => {
        try {
            if (u.isBlocked) {
                await adminService.unblockUser(u._id);
                toast.success(`${u.name} unblocked`);
            } else {
                await adminService.blockUser(u._id);
                toast.success(`${u.name} blocked`);
            }
            setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isBlocked: !x.isBlocked } : x));
        } catch { toast.error('Action failed'); }
    }, []);

    const handleDelete = useCallback(async (u: UserWithStats) => {
        if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
        try {
            await adminService.deleteUser(u._id);
            setUsers(prev => prev.filter(x => x._id !== u._id));
            toast.success(`${u.name} deleted`);
        } catch { toast.error('Delete failed'); }
    }, []);

    if (!user) return null;

    const tabs: Tab[] = ['overview', 'users', 'overdue', 'logs'];

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen space-y-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
            >
                <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-tr from-accent to-blue-400 rounded-[1.8rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-accent/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-accent text-white rounded-xl border-2 border-background">
                        <Shield className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                        <h1 className="text-4xl font-black text-primaryText tracking-tighter">{user.name}</h1>
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-xs font-black uppercase tracking-widest border border-accent/30">System Administrator</span>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-secondaryText">
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Mail className="w-4 h-4 text-accent" />{user.email}</span>
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Calendar className="w-4 h-4 text-accent" />Since {format(new Date(user.createdAt || Date.now()), 'MMMM yyyy')}</span>
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Library className="w-4 h-4 text-accent" />LibraryOS Admin</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </motion.header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Books', val: loadingStats ? '...' : stats?.totalBooks ?? 0, icon: Library, color: 'blue' },
                    { label: 'Registered Users', val: loadingStats ? '...' : stats?.totalUsers ?? 0, icon: Users, color: 'cyan' },
                    { label: 'Active Borrowings', val: loadingStats ? '...' : stats?.activeIssues ?? 0, icon: BookOpen, color: 'accent' },
                    { label: 'Overdue Books', val: loadingStats ? '...' : stats?.overdueCount ?? 0, icon: AlertCircle, color: 'red' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-panel p-6 rounded-3xl relative overflow-hidden hover:border-accent/40 transition-all">
                        <div className={`p-3 rounded-2xl mb-4 w-fit bg-${s.color === 'accent' ? 'accent' : s.color + '-500'}/10 text-${s.color === 'accent' ? 'accent' : s.color + '-400'}`}>
                            <s.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondaryText opacity-50">{s.label}</p>
                        <h3 className="text-3xl font-black text-primaryText">{s.val}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Tab nav */}
            <nav className="flex gap-2 bg-black/20 p-1.5 rounded-2xl w-fit border border-white/5 flex-wrap">
                {tabs.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-secondaryText hover:text-primaryText hover:bg-white/5'}`}>
                        {t}
                    </button>
                ))}
            </nav>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                {/* OVERVIEW */}
                {tab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="glass-panel rounded-[2rem] p-8 space-y-4">
                        <h3 className="text-xl font-black text-primaryText mb-6 flex items-center gap-3"><History className="w-5 h-5 text-accent" />System Health</h3>
                        {[
                            { label: 'Total Books in Catalog', value: stats?.totalBooks ?? '—' },
                            { label: 'Registered Members', value: stats?.totalUsers ?? '—' },
                            { label: 'Books Currently Issued', value: stats?.activeIssues ?? '—' },
                            { label: 'Overdue Returns', value: stats?.overdueCount ?? '—' },
                        ].map(row => (
                            <div key={row.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-sm font-bold text-secondaryText">{row.label}</span>
                                <span className="text-sm font-black text-primaryText">{loadingStats ? <RefreshCw className="w-4 h-4 animate-spin text-accent" /> : row.value}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* USERS */}
                {tab === 'users' && (
                    <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="glass-panel rounded-[2rem] overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <Users className="w-5 h-5 text-accent" />
                            <h3 className="text-xl font-black text-primaryText">User Management</h3>
                            <span className="ml-auto text-xs text-secondaryText font-bold">{users.length} students</span>
                        </div>
                        {loadingUsers ? <Skeleton rows={4} /> : users.length === 0 ? <EmptyState msg="No users found" /> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-secondaryText">
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4 text-center">Total Borrows</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(u => (
                                            <tr key={u._id} className="hover:bg-white/[0.02] transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-primaryText">{u.name}</div>
                                                    <div className="text-[11px] text-secondaryText">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4"><Badge status={u.role} /></td>
                                                <td className="px-6 py-4 text-center font-black text-primaryText">{u.borrowCount}</td>
                                                <td className="px-6 py-4"><Badge status={u.isBlocked ? 'blocked' : 'active'} /></td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => handleBlock(u)} title={u.isBlocked ? 'Unblock' : 'Block'}
                                                        className={`p-2 rounded-lg transition-all ${u.isBlocked ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'}`}>
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(u)} title="Delete"
                                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* OVERDUE */}
                {tab === 'overdue' && (
                    <motion.div key="overdue" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="glass-panel rounded-[2rem] overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h3 className="text-xl font-black text-primaryText">Overdue &amp; Fines</h3>
                            <span className="ml-auto text-xs text-red-400 font-black">{overdue.length} overdue</span>
                        </div>
                        {loadingOverdue ? <Skeleton rows={3} /> : overdue.length === 0 ? <EmptyState msg="No overdue books! Great." /> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-secondaryText">
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Book</th>
                                            <th className="px-6 py-4">Due Date</th>
                                            <th className="px-6 py-4 text-center">Days Late</th>
                                            <th className="px-6 py-4 text-right">Fine</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {overdue.map(t => (
                                            <tr key={t._id} className="hover:bg-white/[0.02] transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-primaryText">{(t.userId as any)?.name || 'Student'}</div>
                                                    <div className="text-[11px] text-secondaryText">{(t.userId as any)?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-secondaryText font-medium">{(t.bookId as any)?.title || 'Book'}</td>
                                                <td className="px-6 py-4 text-sm text-secondaryText">{format(new Date(t.dueDate), 'MMM dd, yyyy')}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-red-400 font-black text-lg">{t.daysLate}d</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-red-400 font-black flex items-center justify-end gap-1">
                                                        <DollarSign className="w-4 h-4" />{(t.fine || 0).toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* LOGS */}
                {tab === 'logs' && (
                    <motion.div key="logs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="glass-panel rounded-[2rem] overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <History className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-xl font-black text-primaryText">Activity Logs</h3>
                        </div>
                        {loadingLogs ? <Skeleton rows={5} /> : logs.length === 0 ? <EmptyState msg="No activity logs yet." /> : (
                            <div className="p-4 space-y-3">
                                {logs.map(log => {
                                    const isIssue = log.action === 'BOOK_ISSUED';
                                    const isReturn = log.action === 'BOOK_RETURNED';
                                    return (
                                        <div key={log._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${isIssue ? 'bg-blue-500/20 text-blue-400' : isReturn ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                    {isIssue ? <ArrowUpRight className="w-5 h-5" /> : isReturn ? <CheckCircle className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-primaryText">
                                                        <span className="text-accent">{log.userEmail}</span>
                                                        {' — '}
                                                        <span className="text-secondaryText font-medium">{(log.metadata as any)?.bookTitle || log.action.replace('_', ' ')}</span>
                                                    </div>
                                                    <div className="text-[10px] text-secondaryText uppercase font-black tracking-widest">
                                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge status={log.action} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProfilePage;
