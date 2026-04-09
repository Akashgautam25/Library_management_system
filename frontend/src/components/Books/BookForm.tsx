import React, { useState, useEffect } from 'react';
import { BookFormData, BOOK_CATEGORIES } from '../../types';

interface BookFormProps {
    initialData?: Partial<BookFormData>;
    onSubmit: (data: BookFormData) => Promise<void>;
    submitLabel: string;
    loading?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit, submitLabel, loading }) => {
    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
        category: 'Fiction',
        description: '',
        quantity: 1,
        publishedYear: new Date().getFullYear(),
        publisher: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author is required';
        if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.quantity < 0) newErrors.quantity = 'Quantity must be non-negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' || name === 'publishedYear' ? Number(value) : value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    return (
        <form className="book-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Book title" />
                    {errors.title && <span className="form-error">{errors.title}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author *</label>
                    <input id="author" name="author" value={formData.author} onChange={handleChange} placeholder="Author name" />
                    {errors.author && <span className="form-error">{errors.author}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="isbn">ISBN *</label>
                    <input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN number" />
                    {errors.isbn && <span className="form-error">{errors.isbn}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange}>
                        {BOOK_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <span className="form-error">{errors.category}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input id="quantity" name="quantity" type="number" min="0" value={formData.quantity} onChange={handleChange} />
                    {errors.quantity && <span className="form-error">{errors.quantity}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="publishedYear">Published Year</label>
                    <input id="publishedYear" name="publishedYear" type="number" value={formData.publishedYear} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="publisher">Publisher</label>
                <input id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher name" />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Book description" rows={3} />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Saving...' : submitLabel}
            </button>
        </form>
    );
};

export default BookForm;
