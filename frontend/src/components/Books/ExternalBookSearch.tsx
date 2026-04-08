import React, { useState } from 'react';
import { bookService } from '../../services/bookService';
import { BookFormData } from '../../types';

interface ExternalBookSearchProps {
    onSelectBook: (book: Partial<BookFormData>) => void;
}

const ExternalBookSearch: React.FC<ExternalBookSearchProps> = ({ onSelectBook }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Partial<BookFormData>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        try {
            const books = await bookService.searchExternal(query);
            setResults(books);
            if (books.length === 0) {
                setError('No books found in Open Library');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to search external books');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="external-search-container" style={{ marginBottom: '20px' }}>
            <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Open Library (e.g. Python, Harry Potter)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="alert alert-error">{error}</div>}

            {results.length > 0 && (
                <div className="external-results" style={{ 
                    background: '#fff', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    maxHeight: '300px', 
                    overflowY: 'auto' 
                }}>
                    <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                        Results from Open Library:
                    </div>
                    <div className="results-list">
                        {results.map((book, index) => (
                            <div key={index} className="result-item" style={{ 
                                padding: '12px 15px', 
                                borderBottom: '1px solid #eee', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            }}>
                                <div className="result-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span className="result-title" style={{ fontWeight: 600, color: '#1a1a1a' }}>{book.title}</span>
                                    <span className="result-author" style={{ fontSize: '0.85rem', color: '#666' }}>by {book.author}</span>
                                    <span className="result-meta" style={{ fontSize: '0.75rem', color: '#999' }}>
                                        {book.publishedYear} | {book.category} | ISBN: {book.isbn}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => onSelectBook(book)}
                                >
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalBookSearch;
