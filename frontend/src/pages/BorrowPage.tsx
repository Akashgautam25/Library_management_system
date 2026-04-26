import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpen, Calendar, Clock, Loader2, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const BorrowPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const fetchBorrowedBooks = async () => {
        setLoading(true);
        try {
            const data = await transactionService.getMyHistory('borrowed');
            setTransactions(data);
        } catch (error) {
            toast.error('Failed to load borrowed books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const handleReturn = async (bookId: string) => {
        setActionLoadingId(bookId);
        try {
            const transaction = await transactionService.returnBook(bookId);
            if (transaction.fine > 0) {
                toast.error(`Book returned successfully. Fine applied: ₹${transaction.fine}`);
            } else {
                toast.success('Book returned successfully!');
            }
            // Remove from list or refetch
            fetchBorrowedBooks();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to return book');
        } finally {
            setActionLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-5xl mx-auto min-h-screen">
                <div className="w-1/3 h-8 bg-surface animate-pulse rounded-lg mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-surface/50 h-48 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-primaryText tracking-tight">Borrowed Books</h1>
                <p className="text-secondaryText mt-1">Manage your active book loans and returns.</p>
            </motion.div>

            {transactions.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-panel p-12 rounded-3xl flex flex-col items-center text-center border border-white/5"
                >
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4 border border-accent/20">
                        <BookOpen className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No active borrows</h3>
                    <p className="text-secondaryText max-w-md">
                        You don't have any books currently borrowed. Visit the library to find something new to read!
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    initial="hidden" animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {transactions.map((tx) => {
                        const book = tx.bookId as any; // Populated book object
                        const isOverdue = new Date(tx.dueDate) < new Date();

                        return (
                            <motion.div 
                                key={tx._id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
                            >
                                {/* Status bar indicator */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOverdue ? 'bg-red-500' : 'bg-accent'}`} />

                                <div className="flex justify-between items-start mb-4 pl-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight mb-1">{book.title}</h3>
                                        <p className="text-sm text-secondaryText">by {book.author}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-lg border border-accent/30">
                                        Borrowed
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6 pl-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondaryText border border-white/5">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondaryText">Issued On</p>
                                            <p className="text-white font-medium">{formatDate(tx.issueDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isOverdue ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-surface text-secondaryText border-white/5'}`}>
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondaryText">Due Date</p>
                                            <p className={`font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                                                {formatDate(tx.dueDate)} {isOverdue && '(Overdue)'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-3">
                                    <button
                                        onClick={() => handleReturn(book._id)}
                                        disabled={actionLoadingId === book._id}
                                        className="w-full py-3 bg-surface hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 group-hover:border-white/20"
                                    >
                                        {actionLoadingId === book._id ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                        ) : (
                                            <ArrowRight className="w-5 h-5 text-accent" />
                                        )}
                                        {actionLoadingId === book._id ? 'Processing Return...' : 'Return Book'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};

export default BorrowPage;
