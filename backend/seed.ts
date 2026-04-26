import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Book from './src/models/Book';

const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', quantity: 5, availableQuantity: 5, description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.', publishedYear: 1925, publisher: 'Scribner' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061935466', category: 'Fiction', quantity: 4, availableQuantity: 4, description: 'The story of racial injustice and the loss of innocence in the American South.', publishedYear: 1960, publisher: 'HarperCollins' },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', quantity: 6, availableQuantity: 6, description: 'A handbook of agile software craftsmanship.', publishedYear: 2008, publisher: 'Prentice Hall' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', category: 'Technology', quantity: 4, availableQuantity: 4, description: 'Your journey to mastery in software development.', publishedYear: 2019, publisher: 'Addison-Wesley' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', quantity: 5, availableQuantity: 5, description: 'A brief history of humankind.', publishedYear: 2011, publisher: 'Harper' },
    { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Other', quantity: 7, availableQuantity: 7, description: 'An easy and proven way to build good habits and break bad ones.', publishedYear: 2018, publisher: 'Avery' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Technology', quantity: 3, availableQuantity: 3, description: 'The comprehensive guide to algorithms.', publishedYear: 2009, publisher: 'MIT Press' },
    { title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Fiction', quantity: 5, availableQuantity: 5, description: 'A dystopian social science fiction novel.', publishedYear: 1949, publisher: 'Signet Classic' },
];

async function seed() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI is not defined in the environment variables');
        process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log(`✅ Seeded ${books.length} books`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
