import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Database from '../config/database';
import Book from '../models/Book';

dotenv.config();

const books = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Fiction",
        description: "A story of ambition, love, and the American Dream in the 1920s.",
        quantity: 5,
        availableQuantity: 5,
        publishedYear: 1925,
        publisher: "Charles Scribner's Sons"
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Technology",
        description: "A Handbook of Agile Software Craftsmanship.",
        quantity: 3,
        availableQuantity: 3,
        publishedYear: 2008,
        publisher: "Prentice Hall"
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        category: "History",
        description: "Explores the history and evolution of homo sapiens.",
        quantity: 4,
        availableQuantity: 4,
        publishedYear: 2011,
        publisher: "Harper"
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        isbn: "9780201616224",
        category: "Technology",
        description: "Your journey to mastery.",
        quantity: 2,
        availableQuantity: 2,
        publishedYear: 1999,
        publisher: "Addison-Wesley"
    }
];

const seedBooks = async () => {
    const db = Database.getInstance();
    await db.connect();

    try {
        // Optional: Clear existing books
        // await Book.deleteMany({});
        // console.log('Cleared existing books');

        for (const book of books) {
            const existingBook = await Book.findOne({ isbn: book.isbn });
            if (!existingBook) {
                await Book.create(book);
                console.log(`Added: ${book.title}`);
            } else {
                console.log(`Skipped (already exists): ${book.title}`);
            }
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await db.disconnect();
        process.exit(0);
    }
};

seedBooks();
