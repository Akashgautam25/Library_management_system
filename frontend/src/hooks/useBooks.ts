import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types';
import { openLibraryService } from '../services/openLibraryService';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

export const useBooks = (autoFetch = true) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    // Fetch from Open Library by default (trending/popular)
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await openLibraryService.searchBooks('popular books');
            setBooks(data);
        } catch {
            setError('Failed to fetch books from Open Library');
        } finally {
            setLoading(false);
        }
    }, []);

    // Search Open Library
    const searchBooks = useCallback(async (query: string) => {
        if (!query.trim()) return fetchBooks();
        setLoading(true);
        setError(null);
        try {
            const data = await openLibraryService.searchBooks(query);
            setBooks(data);
        } catch {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    }, [fetchBooks]);

    // Search by subject/category
    const fetchByCategory = useCallback(async (subject: string) => {
        if (!subject) return fetchBooks();
        setLoading(true);
        setError(null);
        try {
            const data = await openLibraryService.searchBySubject(subject);
            setBooks(data);
        } catch {
            setError('Failed to fetch by category');
        } finally {
            setLoading(false);
        }
    }, [fetchBooks]);

    // Fetch from your own backend (for admin operations)
    const fetchMyBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookService.getAllBooks();
            setBooks(data);
        } catch {
            setError('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) fetchBooks();
    }, [fetchBooks, autoFetch]);

    return { books, loading, error, fetchBooks, searchBooks, fetchByCategory, fetchMyBooks };
};
