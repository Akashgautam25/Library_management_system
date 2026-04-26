import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { bookService } from '../services/bookService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpen, Calendar, Hash, Building, ArrowLeft, Loader2, Edit3, Trash2 } from 'lucide-react';
import { PageHeaderSkeleton } from '../components/ui/Skeletons';

const BookDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await bookService.getBookById(id!);
                setBook(data);
            } catch {
                toast.error('Book not found');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleBorrow = async () => {
        if (!book) return;
        setActionLoading(true);
        try {
            await transactionService.issueBook(book._id);
            toast.success('Book borrowed successfully! Added to your borrowed list.');
            navigate('/borrow'); // Redirect to active borrows
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to borrow book');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!book || !window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await bookService.deleteBook(book._id);
            toast.success('Book deleted successfully');
            navigate('/library');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete book');
        }
    };

    if (loading) return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen">
            <PageHeaderSkeleton />
            <div className="bg-surface/50 h-96 rounded-2xl border border-white/5 animate-pulse mt-8" />
        </div>
    );
    
    if (!book) return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primaryText mb-2">Book Not Found</h2>
                <button onClick={() => navigate('/library')} className="text-accent hover:underline">Return to Library</button>
            </div>
        </div>
    );

    const isAvailable = book.availableQuantity > 0;

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen">
            <motion.button 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-secondaryText hover:text-white transition-colors mb-8 font-medium"
                onClick={() => navigate('/library')}
            >
                <ArrowLeft className="w-5 h-5" /> Back to Library
            </motion.button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden"
            >
                {/* Background blur effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left: Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-secondaryText">
                                {book.category}
                            </span>
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${isAvailable ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {isAvailable ? 'Available Now' : 'Out of Stock'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-primaryText leading-tight mb-2 tracking-tight">
                            {book.title}
                        </h1>
                        <p className="text-xl text-secondaryText mb-8">by <span className="text-white font-medium">{book.author}</span></p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                                <Hash className="w-5 h-5 text-accent mb-2" />
                                <p className="text-xs text-secondaryText mb-1">ISBN</p>
                                <p className="text-sm font-mono text-white font-medium">{book.isbn}</p>
                            </div>
                            <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                                <BookOpen className="w-5 h-5 text-accent mb-2" />
                                <p className="text-xs text-secondaryText mb-1">Availability</p>
                                <p className="text-sm text-white font-medium">{book.availableQuantity} of {book.quantity}</p>
                            </div>
                            {book.publishedYear && (
                                <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                                    <Calendar className="w-5 h-5 text-accent mb-2" />
                                    <p className="text-xs text-secondaryText mb-1">Published</p>
                                    <p className="text-sm text-white font-medium">{book.publishedYear}</p>
                                </div>
                            )}
                            {book.publisher && (
                                <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                                    <Building className="w-5 h-5 text-accent mb-2" />
                                    <p className="text-xs text-secondaryText mb-1">Publisher</p>
                                    <p className="text-sm text-white font-medium">{book.publisher}</p>
                                </div>
                            )}
                        </div>

                        {book.description && (
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-white mb-3">About this book</h3>
                                <p className="text-secondaryText leading-relaxed">{book.description}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-secondaryText/50 font-medium">
                            <span>Added {formatDate(book.createdAt)}</span>
                            <span>•</span>
                            <span>Last updated {formatDate(book.updatedAt)}</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-full lg:w-80 flex flex-col gap-4">
                        {isAuthenticated && !isAdmin && (
                            <div className="bg-surface border border-white/5 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-2">Borrow Book</h3>
                                <p className="text-sm text-secondaryText mb-6">
                                    {isAvailable ? "This book is available. You can borrow it for up to 14 days." : "This book is currently out of stock. Please check back later."}
                                </p>
                                <button
                                    className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    onClick={handleBorrow}
                                    disabled={!isAvailable || actionLoading}
                                >
                                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
                                    {actionLoading ? 'Processing...' : 'Borrow Now'}
                                </button>
                            </div>
                        )}

                        {isAdmin && (
                            <div className="bg-surface border border-white/5 p-6 rounded-2xl flex flex-col gap-3">
                                <h3 className="font-bold text-white mb-2">Admin Actions</h3>
                                <button
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                                >
                                    <Edit3 className="w-4 h-4" /> Edit Book
                                </button>
                                <button
                                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Book
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookDetailsPage;
