import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bookService } from '../services/bookService';
import { ExternalBook, EXTERNAL_BOOK_SUBJECTS } from '../types';

const DEBOUNCE_MS = 500;

const ExternalBooksPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [activeSubjects, setActiveSubjects] = useState<string[]>([]);
    const [books, setBooks] = useState<ExternalBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchBooks = useCallback(async (q: string, subjects: string[], p: number, append = false) => {
        if (!q.trim()) { setBooks([]); return; }
        setLoading(true);
        setError('');
        try {
            // For multiple subjects we do one request per subject and merge, or use first subject
            const subject = subjects.length === 1 ? subjects[0] : subjects[0];
            const res = await bookService.searchExternalBooks(q, subjects.length ? subject : undefined, p);
            const incoming = subjects.length > 1
                ? res.books.filter((b) =>
                    subjects.every((s) =>
                        b.subjects.some((bs) => bs.toLowerCase().includes(s.toLowerCase()))
                    )
                )
                : res.books;
            setBooks((prev) => append ? [...prev, ...incoming] : incoming);
            setHasMore(res.count === 20);
        } catch {
            setError('Failed to fetch books. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search on query/subject change
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchBooks(query, activeSubjects, 1, false);
        }, DEBOUNCE_MS);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, activeSubjects, fetchBooks]);

    const toggleSubject = (subject: string) => {
        setActiveSubjects((prev) =>
            prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
        );
    };

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchBooks(query, activeSubjects, next, true);
    };

    return (
        <div className="container" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.6rem', fontWeight: 700 }}>
                Explore Books — Open Library
            </h2>

            {/* Search */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search books (e.g. Python, Machine Learning...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
            </div>

            {/* Subject Filter Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {EXTERNAL_BOOK_SUBJECTS.map((s) => (
                    <button
                        key={s}
                        onClick={() => toggleSubject(s)}
                        style={{
                            padding: '5px 14px',
                            borderRadius: '20px',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            background: activeSubjects.includes(s) ? '#4f46e5' : '#f3f4f6',
                            color: activeSubjects.includes(s) ? '#fff' : '#374151',
                            borderColor: activeSubjects.includes(s) ? '#4f46e5' : '#d1d5db',
                            transition: 'all 0.15s',
                        }}
                    >
                        {s}
                    </button>
                ))}
                {activeSubjects.length > 0 && (
                    <button
                        onClick={() => setActiveSubjects([])}
                        style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem' }}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            {/* Loading spinner */}
            {loading && books.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <div className="spinner" style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    <p style={{ marginTop: 12 }}>Searching Open Library...</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && books.length === 0 && query.trim() && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No books found. Try a different search or remove filters.
                </div>
            )}

            {!loading && books.length === 0 && !query.trim() && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                    Start typing to search millions of books from Open Library.
                </div>
            )}

            {/* Book Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {books.map((book, i) => (
                    <BookCard key={`${book.isbn}-${i}`} book={book} onSubjectClick={toggleSubject} />
                ))}
            </div>

            {/* Load More */}
            {hasMore && !loading && books.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <button
                        onClick={loadMore}
                        style={{ padding: '10px 28px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 }}
                    >
                        Load more
                    </button>
                </div>
            )}

            {loading && books.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading more...</div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

interface BookCardProps {
    book: ExternalBook;
    onSubjectClick: (subject: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSubjectClick }) => (
    <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
    }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.13)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)')}
    >
        {/* Cover */}
        <div style={{ height: '200px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {book.cover
                ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '2.5rem' }}>📚</span>
            }
        </div>

        {/* Info */}
        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {book.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{book.author}</div>
            {book.first_publish_year && (
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{book.first_publish_year}</div>
            )}
            {book.isbn && (
                <div style={{ fontSize: '0.7rem', color: '#d1d5db', marginTop: '2px' }}>ISBN: {book.isbn}</div>
            )}

            {/* Subject badges */}
            {book.subjects.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {book.subjects.map((s) => (
                        <button
                            key={s}
                            onClick={() => onSubjectClick(s)}
                            title={`Filter by "${s}"`}
                            style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: '#ede9fe',
                                color: '#5b21b6',
                                border: 'none',
                                fontSize: '0.68rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
);

export default ExternalBooksPage;
