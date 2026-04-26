import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/Books/BookCard';
import { BOOK_CATEGORIES } from '../types';
import { motion } from 'framer-motion';
import { Search, X, Library } from 'lucide-react';

const BookListPage: React.FC = () => {
    const { books, loading, error, searchBooks, fetchBooks } = useBooks();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchBooks(searchQuery);
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        if (category) {
            searchBooks(category);
        } else {
            fetchBooks();
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedCategory('');
        fetchBooks();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-primaryText tracking-tight">Library Catalog</h1>
                <p className="text-secondaryText mt-1">Browse, search, and discover your next read.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
            >
                <form className="flex w-full md:max-w-md relative" onSubmit={handleSearch}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondaryText/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 block pl-12 pr-12 py-3.5 outline-none transition-all"
                    />
                    {searchQuery && (
                        <button type="button" onClick={handleClearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondaryText hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </form>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
                    <button
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${!selectedCategory ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-surface hover:bg-white/5 text-secondaryText border-white/10 hover:text-white'}`}
                        onClick={() => handleCategoryFilter('')}
                    >
                        All
                    </button>
                    {BOOK_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${selectedCategory === cat ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-surface hover:bg-white/5 text-secondaryText border-white/10 hover:text-white'}`}
                            onClick={() => handleCategoryFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-8">{error}</div>}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="bg-surface/50 border border-white/5 rounded-2xl h-80 animate-pulse" />
                    ))}
                </div>
            ) : books.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-20 flex flex-col items-center justify-center text-center"
                >
                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <Library className="w-10 h-10 text-secondaryText/30" />
                    </div>
                    <h3 className="text-xl font-bold text-primaryText mb-2">No books found</h3>
                    <p className="text-secondaryText max-w-sm">We couldn't find any books matching your criteria. Try adjusting your search or filters.</p>
                    {(searchQuery || selectedCategory) && (
                        <button onClick={handleClearSearch} className="mt-6 text-accent hover:text-accent/80 font-medium text-sm transition-colors">
                            Clear all filters
                        </button>
                    )}
                </motion.div>
            ) : (
                <motion.div 
                    initial="hidden" animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default BookListPage;
