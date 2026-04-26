import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types';
import { motion } from 'framer-motion';
import { History, BookCheck, AlertCircle, IndianRupee } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { TableRowSkeleton } from '../components/ui/Skeletons';

const BorrowingHistoryPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch only returned books
                const data = await transactionService.getMyHistory('returned');
                setTransactions(data);
            } catch (error) {
                toast.error('Failed to load borrowing history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto min-h-screen">
                <div className="w-1/3 h-8 bg-surface animate-pulse rounded-lg mb-8" />
                <div className="glass-panel rounded-2xl overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-primaryText tracking-tight">History & Fines</h1>
                <p className="text-secondaryText mt-1">Review your past borrowing records.</p>
            </motion.div>

            {transactions.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-panel p-16 rounded-3xl flex flex-col items-center text-center border border-white/5"
                >
                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <History className="w-10 h-10 text-secondaryText/50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No history found</h3>
                    <p className="text-secondaryText max-w-md">
                        You haven't returned any books yet. Once you return a borrowed book, its record will appear here.
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-3xl overflow-hidden border border-white/5"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40">
                                    <th className="p-5 font-bold text-xs uppercase tracking-wider text-secondaryText">Book Details</th>
                                    <th className="p-5 font-bold text-xs uppercase tracking-wider text-secondaryText">Issue Date</th>
                                    <th className="p-5 font-bold text-xs uppercase tracking-wider text-secondaryText">Return Date</th>
                                    <th className="p-5 font-bold text-xs uppercase tracking-wider text-secondaryText">Status</th>
                                    <th className="p-5 font-bold text-xs uppercase tracking-wider text-secondaryText">Fine Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, idx) => {
                                    const book = tx.bookId as any;
                                    const isLate = tx.fine > 0;
                                    return (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={tx._id} 
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-5">
                                                <p className="font-bold text-white mb-1">{book?.title || 'Unknown Book'}</p>
                                                <p className="text-xs text-secondaryText">by {book?.author || 'Unknown'}</p>
                                            </td>
                                            <td className="p-5 text-sm text-secondaryText">
                                                {formatDate(tx.issueDate)}
                                            </td>
                                            <td className="p-5 text-sm text-white font-medium">
                                                {tx.returnDate ? formatDate(tx.returnDate) : '—'}
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${isLate ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                    {isLate ? <AlertCircle className="w-3.5 h-3.5" /> : <BookCheck className="w-3.5 h-3.5" />}
                                                    {isLate ? 'Returned Late' : 'Returned On Time'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                {tx.fine > 0 ? (
                                                    <span className="inline-flex items-center text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded-md">
                                                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                        {tx.fine}
                                                    </span>
                                                ) : (
                                                    <span className="text-secondaryText font-medium">—</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BorrowingHistoryPage;
