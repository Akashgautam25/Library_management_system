import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useTransactions } from '../hooks/useTransactions';

const IssueReturnPage: React.FC = () => {
    const { books, searchBooks, fetchBooks } = useBooks();
    const { issueBook, returnBook } = useTransactions();
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

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
        setMessage(null);
        try {
            await issueBook(bookId);
            setMessage({ type: 'success', text: 'Book issued successfully!' });
            fetchBooks();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to issue book' });
        } finally {
            setLoadingId(null);
        }
    };

    const handleReturn = async (bookId: string) => {
        setLoadingId(bookId);
        setMessage(null);
        try {
            const transaction = await returnBook(bookId);
            const msg = transaction.fine > 0
                ? `Book returned. Fine: ₹${transaction.fine}`
                : 'Book returned successfully!';
            setMessage({ type: 'success', text: msg });
            fetchBooks();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to return book' });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📖 Issue / Return Books</h1>
                <p>Search for a book to issue or return</p>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books by title, author, or ISBN..."
                    className="search-input"
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="issue-return-table">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td className="td-title">{book.title}</td>
                                <td>{book.author}</td>
                                <td className="td-isbn">{book.isbn}</td>
                                <td>
                                    <span className={`availability-badge ${book.availableQuantity > 0 ? 'available' : 'unavailable'}`}>
                                        {book.availableQuantity}/{book.quantity}
                                    </span>
                                </td>
                                <td className="td-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleIssue(book._id)}
                                        disabled={book.availableQuantity <= 0 || loadingId === book._id}
                                    >
                                        Issue
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleReturn(book._id)}
                                        disabled={loadingId === book._id}
                                    >
                                        Return
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {books.length === 0 && (
                    <div className="empty-state">
                        <p>No books found. Try searching for a book.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueReturnPage;
