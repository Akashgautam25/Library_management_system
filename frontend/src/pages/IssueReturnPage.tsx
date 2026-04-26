import React, { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useTransactions } from '../hooks/useTransactions';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Search, BookOpen, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const IssueReturnPage: React.FC = () => {
    const { books, searchBooks, fetchBooks } = useBooks();
    const { issueBook, returnBook } = useTransactions();
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [scanMode, setScanMode] = useState(false);
    const [scannedId, setScannedId] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    // Dynamically load html5-qrcode
    useEffect(() => {
        if (scanMode) {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/html5-qrcode";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const html5QrcodeScanner = new (window as any).Html5QrcodeScanner(
                    "qr-reader",
                    { fps: 10, qrbox: {width: 250, height: 250} },
                    false
                );
                html5QrcodeScanner.render(
                    (decodedText: string) => {
                        setScannedId(decodedText);
                        toast.success('QR Code Scanned!');
                        handleIssue(decodedText);
                        html5QrcodeScanner.clear();
                        setScanMode(false);
                    },
                    (error: any) => { /* ignore */ }
                );
            };
            return () => { document.body.removeChild(script); };
        }
    }, [scanMode]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchBooks(searchQuery);
        } else {
            fetchBooks();
        }
    };

    const handleIssue = async (bookId: string) => {
        setLoadingId(bookId);
        try {
            await issueBook(bookId);
            toast.success('Book issued successfully!', { icon: '📚' });
            fetchBooks();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to issue book');
        } finally {
            setLoadingId(null);
        }
    };

    const handleReturn = async (bookId: string) => {
        setLoadingId(bookId);
        try {
            const transaction = await returnBook(bookId);
            if (transaction.fine > 0) {
                toast.error(`Book returned. Fine: ₹${transaction.fine}`);
            } else {
                toast.success('Book returned successfully!');
            }
            fetchBooks();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to return book');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-primaryText tracking-tight">Issue & Return</h1>
                    <p className="text-secondaryText mt-1">Manage library inventory seamlessly</p>
                </div>
                <button
                    onClick={() => setScanMode(!scanMode)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 ${
                        scanMode 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-accent hover:bg-accent/90 text-white shadow-accent/20'
                    }`}
                >
                    <QrCode className="w-5 h-5" />
                    {scanMode ? 'Close Scanner' : 'Scan QR Code'}
                </button>
            </motion.div>

            <AnimatePresence>
                {scanMode && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                    >
                        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
                            <h3 className="text-lg font-bold text-primaryText mb-4">Scan Book QR</h3>
                            <div id="qr-reader" className="w-full max-w-sm rounded-xl overflow-hidden border border-white/10 bg-black/50" />
                            <p className="text-secondaryText mt-4 text-sm text-center max-w-md">
                                Hold the book's QR code in front of your camera. It will automatically detect and process the issue.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-2xl mb-8"
            >
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondaryText/50" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search books by title, author, or ISBN..."
                            className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 block pl-12 p-3.5 outline-none transition-all"
                        />
                    </div>
                    <button type="submit" className="bg-surface border border-white/10 hover:bg-white/5 text-primaryText px-6 rounded-xl font-medium transition-all">
                        Search
                    </button>
                </form>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {books.map((book) => (
                    <div key={book._id} className="glass-panel p-5 rounded-2xl flex flex-col hover:border-accent/30 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 pr-4">
                                <h3 className="text-lg font-bold text-primaryText leading-tight mb-1">{book.title}</h3>
                                <p className="text-sm text-secondaryText">{book.author}</p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${book.availableQuantity > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {book.availableQuantity}/{book.quantity}
                            </div>
                        </div>
                        
                        <div className="text-xs text-secondaryText/70 mb-5 font-mono">ISBN: {book.isbn}</div>

                        <div className="mt-auto grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleIssue(book._id)}
                                disabled={book.availableQuantity <= 0 || loadingId === book._id}
                                className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loadingId === book._id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Issue'}
                            </button>
                            <button
                                onClick={() => handleReturn(book._id)}
                                disabled={loadingId === book._id}
                                className="bg-surface hover:bg-white/10 text-primaryText border border-white/10 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loadingId === book._id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Return'}
                            </button>
                        </div>
                    </div>
                ))}
                
                {books.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-secondaryText">
                        <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No books found in the inventory.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default IssueReturnPage;
