import React, { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useTransactions } from '../hooks/useTransactions';
import { bookService } from '../services/bookService';

const IssueReturnPage: React.FC = () => {
    const { books, loading, fetchMyBooks } = useBooks(false);
    const { issueBook, returnBook } = useTransactions();

    useEffect(() => {
        fetchMyBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [searchResults, setSearchResults] = React.useState<typeof books>([]);
    const [isSearching, setIsSearching] = React.useState(false);

    const displayBooks = isSearching ? searchResults : books;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // search backend books
            try {
                const results = await bookService.searchBooks(searchQuery);
                // update books via fetchMyBooks after setting results manually
                // use fetchMyBooks as fallback, but show search results directly
                setSearchResults(results);
                setIsSearching(true);
            } catch {
                setMessage({ type: 'error', text: 'Search failed' });
            }
        } else {
            setIsSearching(false);
            fetchMyBooks();
        }
    };

    const handleIssue = async (bookId: string) => {
        setLoadingId(bookId);
        setMessage(null);
        try {
            await issueBook(bookId);
            setMessage({ type: 'success', text: 'Book issued successfully!' });
            fetchMyBooks();
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
            fetchMyBooks();
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
                        {displayBooks.map((book) => (
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
                {/* Mobile card list */}
                <div className="mobile-card-list">
                    {displayBooks.map((book) => (
                        <div key={book._id} className="mobile-card">
                            <div className="mobile-card-title">{book.title}</div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Author</span>
                                <span>{book.author}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">ISBN</span>
                                <span className="td-isbn">{book.isbn}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Available</span>
                                <span className={`availability-badge ${book.availableQuantity > 0 ? 'available' : 'unavailable'}`}>
                                    {book.availableQuantity}/{book.quantity}
                                </span>
                            </div>
                            <div className="mobile-card-actions">
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
                            </div>
                        </div>
                    ))}
                </div>
                {displayBooks.length === 0 && (
                    <div className="empty-state">
                        <p>No books found. Try searching for a book.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueReturnPage;
