import React from 'react';
import { Book } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Hash } from 'lucide-react';

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const isAvailable = book.availableQuantity > 0;

    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5 }}
            className="glass-panel rounded-2xl overflow-hidden flex flex-col group border border-white/5 hover:border-accent/30 transition-all duration-300"
        >
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-secondaryText">
                        {book.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${isAvailable ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-primaryText leading-snug mb-1 group-hover:text-accent transition-colors line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-sm text-secondaryText mb-4 line-clamp-1">by {book.author}</p>

                <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-secondaryText">
                        <Hash className="w-3.5 h-3.5 opacity-50" />
                        <span>ISBN: <span className="font-mono text-white/70">{book.isbn}</span></span>
                    </div>
                    {book.publishedYear && (
                        <div className="flex items-center gap-2 text-xs text-secondaryText">
                            <Calendar className="w-3.5 h-3.5 opacity-50" />
                            <span>{book.publishedYear}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-secondaryText">
                        <BookOpen className="w-3.5 h-3.5 opacity-50" />
                        <span><strong className="text-white">{book.availableQuantity}</strong> of {book.quantity} copies left</span>
                    </div>
                </div>
            </div>

            <div className="p-2 border-t border-white/5 bg-black/20">
                <Link 
                    to={`/books/${book._id}`} 
                    className="flex items-center justify-center w-full py-2.5 bg-surface hover:bg-white/10 text-sm font-semibold text-white rounded-xl transition-all"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

export default BookCard;
