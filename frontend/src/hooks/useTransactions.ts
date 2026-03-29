import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { transactionService } from '../services/transactionService';

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionService.getMyHistory();
            setTransactions(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch history');
        } finally {
            setLoading(false);
        }
    }, []);

    const issueBook = useCallback(async (bookId: string) => {
        const transaction = await transactionService.issueBook(bookId);
        setTransactions((prev) => [transaction, ...prev]);
        return transaction;
    }, []);

    const returnBook = useCallback(async (bookId: string) => {
        const transaction = await transactionService.returnBook(bookId);
        setTransactions((prev) =>
            prev.map((t) => (t._id === transaction._id ? transaction : t))
        );
        return transaction;
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { transactions, loading, error, fetchHistory, issueBook, returnBook };
};
