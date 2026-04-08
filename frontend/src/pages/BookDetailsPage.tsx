import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { bookService } from '../services/bookService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

const BookDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await bookService.getBookById(id!);
                setBook(data);
            } catch {
                setMessage({ type: 'error', text: 'Book not found' });
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleIssue = async () => {
        if (!book) return;
        setActionLoading(true);
        setMessage(null);
        try {
            await transactionService.issueBook(book._id);
            setMessage({ type: 'success', text: 'Book issued successfully!' });
            const updatedBook = await bookService.getBookById(book._id);
            setBook(updatedBook);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to issue book' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!book) return;
        setActionLoading(true);
        setMessage(null);
        try {
            const transaction = await transactionService.returnBook(book._id);
            const msg = transaction.fine > 0
                ? `Book returned. Fine: ₹${transaction.fine}`
                : 'Book returned successfully!';
            setMessage({ type: 'success', text: msg });
            const updatedBook = await bookService.getBookById(book._id);
            setBook(updatedBook);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to return book' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!book || !window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await bookService.deleteBook(book._id);
            navigate('/books');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete book' });
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
    if (!book) return <div className="page-container"><div className="alert alert-error">Book not found</div></div>;

    return (
        <div className="page-container">
            <button className="btn btn-outline btn-back" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {message && (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <div className="book-details">
                <div className="book-details-header">
                    <div>
                        <span className={`category-tag ${book.category.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                            {book.category}
                        </span>
                        <h1>{book.title}</h1>
                        <p className="book-author-detail">by {book.author}</p>
                    </div>
                    <div className={`availability-badge-lg ${book.availableQuantity > 0 ? 'available' : 'unavailable'}`}>
                        {book.availableQuantity > 0 ? `${book.availableQuantity} Available` : 'Unavailable'}
                    </div>
                </div>

                <div className="book-details-grid">
                    <div className="detail-card">
                        <h4>📖 ISBN</h4>
                        <p>{book.isbn}</p>
                    </div>
                    <div className="detail-card">
                        <h4>📂 Category</h4>
                        <p>{book.category}</p>
                    </div>
                    <div className="detail-card">
                        <h4>📦 Total Copies</h4>
                        <p>{book.quantity}</p>
                    </div>
                    <div className="detail-card">
                        <h4>✅ Available</h4>
                        <p>{book.availableQuantity}</p>
                    </div>
                    {book.publishedYear && (
                        <div className="detail-card">
                            <h4>📅 Published</h4>
                            <p>{book.publishedYear}</p>
                        </div>
                    )}
                    {book.publisher && (
                        <div className="detail-card">
                            <h4>🏢 Publisher</h4>
                            <p>{book.publisher}</p>
                        </div>
                    )}
                </div>

                {book.description && (
                    <div className="book-description-full">
                        <h3>Description</h3>
                        <p>{book.description}</p>
                    </div>
                )}

                <div className="book-details-meta">
                    <span>Added: {formatDate(book.createdAt)}</span>
                    <span>Updated: {formatDate(book.updatedAt)}</span>
                </div>

                {isAuthenticated && (
                    <div className="book-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleIssue}
                            disabled={book.availableQuantity <= 0 || actionLoading}
                        >
                            {actionLoading ? 'Processing...' : '📖 Issue Book'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleReturn}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Processing...' : '↩️ Return Book'}
                        </button>
                        {isAdmin && (
                            <button className="btn btn-danger" onClick={handleDelete}>
                                🗑️ Delete Book
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailsPage;
