import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types';
import { bookService } from '../services/bookService';

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookService.getAllBooks();
            setBooks(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch books');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBooks = useCallback(async (query: string) => {
        if (!query.trim()) {
            return fetchBooks();
        }
        setLoading(true);
        setError(null);
        try {
            const data = await bookService.searchBooks(query);
            setBooks(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    }, [fetchBooks]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return { books, loading, error, fetchBooks, searchBooks };
};
