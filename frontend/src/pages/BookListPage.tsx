import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/Books/BookCard';
import { BOOK_CATEGORIES } from '../types';

const BookListPage: React.FC = () => {
    const { books, loading, error, searchBooks, fetchBooks, fetchByCategory } = useBooks();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchBooks(searchQuery);
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        if (category) {
            fetchByCategory(category);
        } else {
            fetchBooks();
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedCategory('');
        fetchBooks();
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📖 Book Collection</h1>
                <p>Powered by Open Library — search millions of books</p>
            </div>

            <div className="search-section">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, author, or subject..."
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                    {(searchQuery || selectedCategory) && (
                        <button type="button" className="btn btn-outline" onClick={handleClearSearch}>
                            Clear
                        </button>
                    )}
                </form>

                <div className="category-filters">
                    <button
                        className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter('')}
                    >
                        All
                    </button>
                    {BOOK_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <div className="loading-screen"><div className="spinner" /></div>
            ) : books.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📚</span>
                    <h3>No books found</h3>
                    <p>Try a different search term</p>
                </div>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookListPage;
