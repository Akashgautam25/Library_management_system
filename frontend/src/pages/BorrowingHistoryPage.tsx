import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { formatDate, isOverdue, getDaysRemaining } from '../utils/formatters';
import { Book } from '../types';

const BorrowingHistoryPage: React.FC = () => {
    const { transactions, loading, error } = useTransactions();

    const getBookInfo = (bookId: string | Book): { title: string; author: string } => {
        if (typeof bookId === 'object' && bookId !== null) {
            return { title: bookId.title, author: bookId.author };
        }
        return { title: 'Unknown Book', author: 'Unknown' };
    };

    if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📋 Borrowing History</h1>
                <p>Track all your book transactions</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {transactions.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <h3>No transactions yet</h3>
                    <p>Your borrowing history will appear here</p>
                </div>
            ) : (
                <div className="history-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Author</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => {
                                const book = getBookInfo(t.bookId);
                                const overdue = t.status === 'issued' && isOverdue(t.dueDate);
                                const daysLeft = t.status === 'issued' ? getDaysRemaining(t.dueDate) : null;
                                return (
                                    <tr key={t._id} className={overdue ? 'row-overdue' : ''}>
                                        <td className="td-title">{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{formatDate(t.issueDate)}</td>
                                        <td>
                                            {formatDate(t.dueDate)}
                                            {daysLeft !== null && (
                                                <span className={`days-badge ${daysLeft < 0 ? 'overdue' : daysLeft <= 3 ? 'warning' : 'ok'}`}>
                                                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                                                </span>
                                            )}
                                        </td>
                                        <td>{t.returnDate ? formatDate(t.returnDate) : '—'}</td>
                                        <td>
                                            <span className={`status-badge status-${t.status}`}>
                                                {overdue ? 'Overdue' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className={t.fine > 0 ? 'td-fine' : ''}>
                                            {t.fine > 0 ? `₹${t.fine}` : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BorrowingHistoryPage;
