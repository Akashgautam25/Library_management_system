import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Library,
    Users,
    BookOpen,
    Clock,
    TrendingUp,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { DashboardStats } from '../types';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

// Mock Data for Charts
const issueData = [
    { name: 'Mon', issues: 12 },
    { name: 'Tue', issues: 19 },
    { name: 'Wed', issues: 15 },
    { name: 'Thu', issues: 22 },
    { name: 'Fri', issues: 28 },
    { name: 'Sat', issues: 14 },
    { name: 'Sun', issues: 5 },
];

const categoryData = [
    { name: 'Fiction', count: 120 },
    { name: 'Science', count: 85 },
    { name: 'History', count: 65 },
    { name: 'Tech', count: 95 },
];

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await transactionService.getDashboardStats();
                if (!data) throw new Error('No data received from server');
                setStats(data);
                setError(null);
            } catch (err: any) {
                console.error('Dashboard Stats Error:', err);
                const msg = err.response?.data?.message || err.message || 'Failed to load dashboard statistics.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-primaryText tracking-tight">
                        Welcome back, {user?.name || 'User'}
                    </h1>
                    <p className="text-secondaryText mt-1 flex items-center gap-2">
                        Here's what's happening in your library today.
                    </p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => navigate('/admin/books')}
                        className="bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
                    >
                        <Library className="w-5 h-5" />
                        Add New Book
                    </button>
                )}
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="bg-surface border border-white/5 p-6 rounded-2xl animate-pulse h-32" />
                    ))}
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {/* Analytics Cards */}
                    <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-accent/50 transition-all cursor-pointer" onClick={() => navigate('/library')}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-secondaryText text-sm font-medium mb-1">Total Books</p>
                                <h3 className="text-3xl font-bold text-primaryText">{stats?.totalBooks || 0}</h3>
                            </div>
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                <Library className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-sm text-green-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Catalog items</span>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-accent/50 transition-all cursor-pointer" onClick={() => navigate('/borrow')}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-secondaryText text-sm font-medium mb-1">Active Issues</p>
                                <h3 className="text-3xl font-bold text-primaryText">{stats?.activeIssues || 0}</h3>
                            </div>
                            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-sm text-green-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>In circulation</span>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-accent/50 transition-all cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-secondaryText text-sm font-medium mb-1">Overdue Books</p>
                                <h3 className="text-3xl font-bold text-primaryText">{stats?.overdueCount || 0}</h3>
                            </div>
                            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-sm text-red-400">
                            <Clock className="w-4 h-4" />
                            <span>Requires attention</span>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
                    </motion.div>

                    {isAdmin && (
                        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-accent/50 transition-all cursor-pointer" onClick={() => navigate('/admin/users')}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-secondaryText text-sm font-medium mb-1">Active Members</p>
                                    <h3 className="text-3xl font-bold text-primaryText">{stats?.totalUsers || 0}</h3>
                                </div>
                                <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-sm text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span>Total registered</span>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-6 rounded-2xl lg:col-span-2"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-primaryText">Issue Trends</h3>
                            <p className="text-sm text-secondaryText">Books issued over the last 7 days</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="w-full h-full bg-surface animate-pulse rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={issueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#3B82F6' }}
                                    />
                                    <Area type="monotone" dataKey="issues" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorIssues)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-panel p-6 rounded-2xl"
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-primaryText">Inventory by Category</h3>
                        <p className="text-sm text-secondaryText">Distribution of books</p>
                    </div>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="w-full h-full bg-surface animate-pulse rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{ backgroundColor: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>
            </div>
            
            {/* Recent Activity Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="glass-panel rounded-2xl overflow-hidden mb-8"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-bold text-primaryText">My Recent Activity</h2>
                    </div>
                    <button onClick={() => navigate('/history')} className="text-sm text-accent hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    {!stats?.recentTransactions || stats.recentTransactions.length === 0 ? (
                        <div className="p-12 text-center text-secondaryText">
                            No recent activity to show. Start exploring the library!
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-secondaryText text-[10px] font-bold uppercase tracking-[0.2em]">
                                    <th className="px-6 py-4">Book Title</th>
                                    <th className="px-6 py-4">Issue Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Fine</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.recentTransactions.map((t: any) => (
                                    <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-primaryText font-semibold line-clamp-1">
                                                    {typeof t.bookId === 'object' ? t.bookId.title : 'Book'}
                                                </span>
                                                <span className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">
                                                    {typeof t.bookId === 'object' ? t.bookId.author : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondaryText">
                                            {new Date(t.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                t.status === 'returned' 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-bold ${t.fine > 0 ? 'text-red-400' : 'text-secondaryText/40'}`}>
                                                {t.fine > 0 ? `$${t.fine.toFixed(2)}` : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
            >
                <h3 className="text-lg font-bold text-primaryText mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Issue Book', icon: <BookOpen className="w-5 h-5"/>, route: '/borrow', color: 'bg-blue-500/20 text-blue-400' },
                        { label: 'Return Book', icon: <ArrowRight className="w-5 h-5"/>, route: '/borrow', color: 'bg-green-500/20 text-green-400' },
                        { label: 'View Reports', icon: <Library className="w-5 h-5"/>, route: '/history', color: 'bg-blue-600/20 text-blue-300' },
                        { label: 'Manage Users', icon: <Users className="w-5 h-5"/>, route: '/admin/users', color: 'bg-cyan-500/20 text-cyan-400', admin: true },
                    ].map((action, i) => (
                        (!action.admin || isAdmin) && (
                            <button
                                key={i}
                                onClick={() => navigate(action.route)}
                                className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all group"
                            >
                                <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                                    {action.icon}
                                </div>
                                <span className="text-sm font-medium text-primaryText">{action.label}</span>
                            </button>
                        )
                    ))}
                </div>
            </motion.div>

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-xl text-sm backdrop-blur-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
