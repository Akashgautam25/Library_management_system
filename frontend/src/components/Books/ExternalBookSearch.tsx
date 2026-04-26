import React, { useState } from 'react';
import { bookService } from '../../services/bookService';
import { BookFormData } from '../../types';
import { Search, Loader2, BookUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ExternalBookSearchProps {
    onSelectBook: (book: Partial<BookFormData>) => void;
}

const ExternalBookSearch: React.FC<ExternalBookSearchProps> = ({ onSelectBook }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Partial<BookFormData>[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const books = await bookService.searchExternal(query);
            setResults(books);
            if (books.length === 0) {
                toast.error('No matching books found in the global database');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Global search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText/50 group-focus-within:text-accent transition-colors">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Book Title, ISBN, or Author..."
                    className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent block pl-10 pr-20 p-3 transition-all outline-none"
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                >
                    Search
                </button>
            </form>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-black/40 border border-white/10 rounded-xl max-h-[350px] overflow-y-auto scrollbar-hide divide-y divide-white/5"
                    >
                        <div className="p-3 bg-white/5 flex items-center gap-2">
                            <BookUp className="w-3.5 h-3.5 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondaryText">Global Results</span>
                        </div>
                        {results.map((book, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 hover:bg-white/5 transition-all flex items-center justify-between group"
                            >
                                <div className="flex flex-col gap-1 pr-4">
                                    <span className="text-sm font-bold text-primaryText leading-tight group-hover:text-accent transition-colors">
                                        {book.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-secondaryText font-medium">by {book.author}</span>
                                        <span className="w-1 h-1 bg-white/10 rounded-full" />
                                        <span className="text-[10px] text-accent/80 font-bold uppercase tracking-wider">{book.category}</span>
                                    </div>
                                    {book.isbn && (
                                        <span className="text-[9px] text-secondaryText/40 font-mono tracking-tighter">ISBN: {book.isbn}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onSelectBook(book)}
                                    className="p-2 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg transition-all flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase pr-1">Import</span>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExternalBookSearch;
