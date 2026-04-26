import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardStats, Transaction, Book, User, BookFormData } from '../types';
import { transactionService } from '../services/transactionService';
import { bookService } from '../services/bookService';
import { formatDate, isOverdue } from '../utils/formatters';
import BookForm from '../components/Books/BookForm';
import ExternalBookSearch from '../components/Books/ExternalBookSearch';
import { 
    LayoutDashboard, 
    BookOpen, 
    Users, 
    AlertCircle, 
    Plus, 
    Search, 
    History,
    CheckCircle2,
    X,
    Loader2,
    Library
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddBook, setShowAddBook] = useState(false);
    const [addBookLoading, setAddBookLoading] = useState(false);
    const [prefillData, setPrefillData] = useState<Partial<BookFormData> | undefined>(undefined);

    const fetchStats = async () => {
        try {
            const data = await transactionService.getDashboardStats();
            setStats(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAddBook = async (data: BookFormData) => {
        setAddBookLoading(true);
        try {
            await bookService.createBook(data);
            toast.success('Book added to library successfully!');
            setShowAddBook(false);
            setPrefillData(undefined);
            fetchStats();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add book');
        } finally {
            setAddBookLoading(false);
        }
    };

    const getTransactionBookTitle = (t: Transaction): string => {
        if (typeof t.bookId === 'object' && t.bookId !== null) return (t.bookId as Book).title;
        return 'Unknown';
    };

    const getTransactionUserName = (t: Transaction): string => {
        if (typeof t.userId === 'object' && t.userId !== null) return (t.userId as User).name;
        return 'Unknown';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primaryText tracking-tight">Admin Console</h1>
                    <p className="text-secondaryText text-sm">System-wide overview and inventory management</p>
                </div>
                <button
                    onClick={() => setShowAddBook(!showAddBook)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                        showAddBook 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent/90'
                    }`}
                >
                    {showAddBook ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showAddBook ? 'Cancel Operation' : 'Add New Book'}
                </button>
            </header>

            <AnimatePresence mode="wait">
                {showAddBook ? (
                    <motion.div
                        key="add-book-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel p-8 rounded-3xl space-y-8 relative overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-accent/20 text-accent rounded-lg">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-primaryText">Quick Import</h3>
                                    </div>
                                    <p className="text-xs text-secondaryText mb-4">Search the Open Library database to automatically fill book details.</p>
                                    <ExternalBookSearch onSelectBook={(book) => {
                                        setPrefillData(book);
                                        toast.success('Book details imported!');
                                    }} />
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <BookForm
                                    initialData={prefillData}
                                    onSubmit={handleAddBook}
                                    submitLabel="Confirm & Add Book"
                                    loading={addBookLoading}
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard-stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Inventory', value: stats?.totalBooks, icon: Library, color: 'blue' },
                                { label: 'Registered Students', value: stats?.totalUsers, icon: Users, color: 'accent' },
                                { label: 'Active Issues', value: stats?.activeIssues, icon: BookOpen, color: 'blue' },
                                { label: 'Overdue Books', value: stats?.overdueCount, icon: AlertCircle, color: 'red' },
                            ].map((stat, i) => (
                                <motion.div 
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:border-accent/30 transition-all group"
                                >
                                    <div className={`p-4 rounded-xl bg-${stat.color === 'accent' ? 'accent' : stat.color + '-500'}/10 text-${stat.color === 'accent' ? 'accent' : stat.color + '-400'} group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-secondaryText uppercase tracking-widest">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-primaryText">{stat.value}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Table */}
                        <div className="glass-panel rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <History className="w-5 h-5 text-accent" />
                                    <h2 className="text-xl font-bold text-primaryText">Recent Activity</h2>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                {!stats?.recentTransactions || stats.recentTransactions.length === 0 ? (
                                    <div className="p-20 text-center text-secondaryText">
                                        No recent transactions found.
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-secondaryText text-[10px] font-bold uppercase tracking-[0.2em]">
                                                <th className="px-6 py-4">Borrower</th>
                                                <th className="px-6 py-4">Book Title</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Fine</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {stats.recentTransactions.map((t) => (
                                                <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                                                                {getTransactionUserName(t).charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-medium text-primaryText">{getTransactionUserName(t)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-primaryText font-semibold line-clamp-1">{getTransactionBookTitle(t)}</span>
                                                            <span className="text-[10px] text-secondaryText uppercase font-bold tracking-wider">Due {formatDate(t.dueDate)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                            t.status === 'returned' 
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                            : isOverdue(t.dueDate)
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                            {t.status === 'borrowed' && isOverdue(t.dueDate) ? 'Overdue' : t.status}
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboardPage;

