import React from 'react';
import { Book } from '../../types';
import { Link } from 'react-router-dom';

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const isAvailable = book.availableQuantity > 0;

    return (
        <div className="book-card">
            <div className="book-card-header">
                <span className={`category-tag ${book.category.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                    {book.category}
                </span>
                <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                </span>
            </div>

            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>

            <div className="book-meta">
                <span className="meta-item">📖 ISBN: {book.isbn}</span>
                {book.publishedYear && (
                    <span className="meta-item">📅 {book.publishedYear}</span>
                )}
                <span className="meta-item">
                    📦 {book.availableQuantity}/{book.quantity} copies
                </span>
            </div>

            {book.description && (
                <p className="book-description">
                    {book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                </p>
            )}

            <Link to={`/books/${book._id}`} className="btn btn-primary btn-block">
                View Details
            </Link>
        </div>
    );
};

export default BookCard;
