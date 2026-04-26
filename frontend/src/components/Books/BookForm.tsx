import React, { useState, useEffect } from 'react';
import { BookFormData, BOOK_CATEGORIES } from '../../types';
import { Loader2 } from 'lucide-react';

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
        if (formData.quantity < 0) newErrors.quantity = 'Quantity must be positive';
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

    const inputClasses = (name: string) => `w-full bg-black/40 border ${errors[name] ? 'border-red-500' : 'border-white/10'} text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent block p-3.5 transition-all outline-none`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">Book Title *</label>
                    <input name="title" value={formData.title} onChange={handleChange} className={inputClasses('title')} placeholder="e.g. The Pragmatic Programmer" />
                    {errors.title && <p className="text-[10px] text-red-400 ml-1">{errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">Author Name *</label>
                    <input name="author" value={formData.author} onChange={handleChange} className={inputClasses('author')} placeholder="e.g. Andy Hunt" />
                    {errors.author && <p className="text-[10px] text-red-400 ml-1">{errors.author}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">ISBN Number *</label>
                    <input name="isbn" value={formData.isbn} onChange={handleChange} className={inputClasses('isbn')} placeholder="e.g. 978-0135957059" />
                    {errors.isbn && <p className="text-[10px] text-red-400 ml-1">{errors.isbn}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className={inputClasses('category')}>
                        {BOOK_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-surface">{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">Quantity *</label>
                    <input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} className={inputClasses('quantity')} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">Published Year</label>
                    <input name="publishedYear" type="number" value={formData.publishedYear} onChange={handleChange} className={inputClasses('publishedYear')} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondaryText ml-1">Publisher</label>
                    <input name="publisher" value={formData.publisher} onChange={handleChange} className={inputClasses('publisher')} placeholder="e.g. Addison-Wesley" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-secondaryText ml-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClasses('description')} resize-none`} rows={4} placeholder="Brief summary of the book..." />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold rounded-xl text-sm px-5 py-4 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-accent/20 active:scale-[0.98]"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : submitLabel}
            </button>
        </form>
    );
};

export default BookForm;
