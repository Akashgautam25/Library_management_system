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
            {book.coverUrl && (
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="book-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            )}

            <div className="book-card-header">
                <span className="category-tag">{book.category}</span>
                <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                </span>
            </div>

            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>

            <div className="book-meta">
                {book.isbn && <span className="meta-item">📖 ISBN: {book.isbn}</span>}
                {book.publishedYear > 0 && <span className="meta-item">📅 {book.publishedYear}</span>}
                {book.publisher && <span className="meta-item">🏢 {book.publisher}</span>}
            </div>

            <Link to={`/books/${book._id}`} className="btn btn-primary btn-block">
                View Details
            </Link>
        </div>
    );
};

export default BookCard;
