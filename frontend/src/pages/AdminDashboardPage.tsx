import React, { useState, useEffect } from 'react';
import { DashboardStats, Transaction, Book, User } from '../types';
import { transactionService } from '../services/transactionService';
import { bookService } from '../services/bookService';
import { formatDate, isOverdue } from '../utils/formatters';
import BookForm from '../components/Books/BookForm';
import { BookFormData } from '../types';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddBook, setShowAddBook] = useState(false);
    const [addBookLoading, setAddBookLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchStats = async () => {
        try {
            const data = await transactionService.getDashboardStats();
            setStats(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAddBook = async (data: BookFormData) => {
        setAddBookLoading(true);
        setMessage(null);
        try {
            await bookService.createBook(data);
            setMessage({ type: 'success', text: 'Book added successfully!' });
            setShowAddBook(false);
            fetchStats();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add book' });
        } finally {
            setAddBookLoading(false);
        }
    };

    const getTransactionBookTitle = (t: Transaction): string => {
        if (typeof t.bookId === 'object' && t.bookId !== null) return (t.bookId as Book).title;
        return 'Unknown';
    };

    const getTransactionUserName = (t: Transaction): string => {
        if (typeof t.userId === 'object' && t.userId !== null) return (t.userId as User).name;
        return 'Unknown';
    };

    if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🏠 Admin Dashboard</h1>
                <p>Library overview and management</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {stats && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card stat-books">
                            <div className="stat-icon">📚</div>
                            <div className="stat-info">
                                <h3>{stats.totalBooks}</h3>
                                <p>Total Books</p>
                            </div>
                        </div>
                        <div className="stat-card stat-users">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <h3>{stats.totalUsers}</h3>
                                <p>Students</p>
                            </div>
                        </div>
                        <div className="stat-card stat-issued">
                            <div className="stat-icon">📖</div>
                            <div className="stat-info">
                                <h3>{stats.activeIssues}</h3>
                                <p>Active Issues</p>
                            </div>
                        </div>
                        <div className="stat-card stat-overdue">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-info">
                                <h3>{stats.overdueCount}</h3>
                                <p>Overdue</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>📖 Manage Books</h2>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowAddBook(!showAddBook)}
                            >
                                {showAddBook ? '✕ Cancel' : '+ Add Book'}
                            </button>
                        </div>

                        {showAddBook && (
                            <div className="add-book-section">
                                <BookForm
                                    onSubmit={handleAddBook}
                                    submitLabel="Add Book"
                                    loading={addBookLoading}
                                />
                            </div>
                        )}
                    </div>

                    <div className="dashboard-section">
                        <h2>🕐 Recent Transactions</h2>
                        {stats.recentTransactions.length === 0 ? (
                            <p className="text-muted">No recent transactions</p>
                        ) : (
                            <div className="dashboard-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Book</th>
                                            <th>Issue Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th>Fine</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentTransactions.map((t) => (
                                            <tr key={t._id} className={t.status === 'issued' && isOverdue(t.dueDate) ? 'row-overdue' : ''}>
                                                <td>{getTransactionUserName(t)}</td>
                                                <td className="td-title">{getTransactionBookTitle(t)}</td>
                                                <td>{formatDate(t.issueDate)}</td>
                                                <td>{formatDate(t.dueDate)}</td>
                                                <td>
                                                    <span className={`status-badge status-${t.status}`}>
                                                        {t.status === 'issued' && isOverdue(t.dueDate) ? 'Overdue' : t.status}
                                                    </span>
                                                </td>
                                                <td className={t.fine > 0 ? 'td-fine' : ''}>
                                                    {t.fine > 0 ? `₹${t.fine}` : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Mobile card list */}
                                <div className="mobile-card-list">
                                    {stats.recentTransactions.map((t) => {
                                        const overdue = t.status === 'issued' && isOverdue(t.dueDate);
                                        return (
                                            <div key={t._id} className="mobile-card">
                                                <div className="mobile-card-title">{getTransactionBookTitle(t)}</div>
                                                <div className="mobile-card-row">
                                                    <span className="mobile-card-label">User</span>
                                                    <span>{getTransactionUserName(t)}</span>
                                                </div>
                                                <div className="mobile-card-row">
                                                    <span className="mobile-card-label">Issued</span>
                                                    <span>{formatDate(t.issueDate)}</span>
                                                </div>
                                                <div className="mobile-card-row">
                                                    <span className="mobile-card-label">Due</span>
                                                    <span>{formatDate(t.dueDate)}</span>
                                                </div>
                                                <div className="mobile-card-row">
                                                    <span className="mobile-card-label">Status</span>
                                                    <span className={`status-badge status-${t.status}`}>
                                                        {overdue ? 'Overdue' : t.status}
                                                    </span>
                                                </div>
                                                {t.fine > 0 && (
                                                    <div className="mobile-card-row">
                                                        <span className="mobile-card-label">Fine</span>
                                                        <span className="td-fine">₹{t.fine}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboardPage;
