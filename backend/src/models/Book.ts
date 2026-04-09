import mongoose, { Schema } from 'mongoose';
import { IBook } from '../interfaces';

const BookSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
            maxlength: [100, 'Author name cannot exceed 100 characters'],
        },
        isbn: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: [
                'Fiction',
                'Non-Fiction',
                'Science',
                'Technology',
                'History',
                'Biography',
                'Literature',
                'Mathematics',
                'Philosophy',
                'Other',
            ],
        },
        description: {
            type: String,
            default: '',
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
        },
        availableQuantity: {
            type: Number,
            required: [true, 'Available quantity is required'],
            min: [0, 'Available quantity cannot be negative'],
        },
        publishedYear: {
            type: Number,
            min: [1000, 'Invalid published year'],
            max: [new Date().getFullYear() + 1, 'Published year cannot be in the future'],
        },
        publisher: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Text index for search functionality
BookSchema.index({ title: 'text', author: 'text', category: 'text' });

export default mongoose.model<IBook>('Book', BookSchema);
