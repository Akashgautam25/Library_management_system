import { BookService } from '../src/services/BookService';
import { RepositoryFactory } from '../src/factories';

jest.mock('../src/factories');

const mockBookRepo = {
    findByIsbn: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    search: jest.fn(),
    findByCategory: jest.fn(),
};

(RepositoryFactory.getBookRepository as jest.Mock).mockReturnValue(mockBookRepo);

const bookService = new BookService();

const mockBookResult = {
    _id: 'book123' as any,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Technology',
    quantity: 5,
    availableQuantity: 5,
    description: 'A handbook of agile software craftsmanship',
    publishedYear: 2008,
    publisher: 'Prentice Hall',
};

const mockBookInput = {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Technology',
    quantity: 5,
    availableQuantity: 5,
    description: 'A handbook of agile software craftsmanship',
    publishedYear: 2008,
    publisher: 'Prentice Hall',
};

beforeEach(() => jest.clearAllMocks());

describe('BookService.createBook', () => {
    test('creates a book successfully', async () => {
        mockBookRepo.findByIsbn.mockResolvedValue(null);
        mockBookRepo.create.mockResolvedValue(mockBookResult);

        const result = await bookService.createBook({ ...mockBookInput });
        expect(mockBookRepo.findByIsbn).toHaveBeenCalledWith(mockBookInput.isbn);
        expect(mockBookRepo.create).toHaveBeenCalled();
        expect(result.title).toBe('Clean Code');
    });

    test('throws if ISBN already exists', async () => {
        mockBookRepo.findByIsbn.mockResolvedValue(mockBookResult);
        await expect(bookService.createBook({ ...mockBookInput })).rejects.toThrow('Book with this ISBN already exists');
    });

    test('availableQuantity should match quantity on creation', async () => {
        mockBookRepo.findByIsbn.mockResolvedValue(null);
        mockBookRepo.create.mockImplementation((data) => Promise.resolve(data));

        await bookService.createBook({ ...mockBookInput, quantity: 3, availableQuantity: 0 });
        expect(mockBookRepo.create).toHaveBeenCalledWith(expect.objectContaining({ availableQuantity: 3 }));
    });
});

describe('BookService.getAllBooks', () => {
    test('returns list of books', async () => {
        mockBookRepo.findAll.mockResolvedValue([mockBookResult]);
        const result = await bookService.getAllBooks();
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Clean Code');
    });

    test('returns empty array when no books in db', async () => {
        mockBookRepo.findAll.mockResolvedValue([]);
        const result = await bookService.getAllBooks();
        expect(result).toHaveLength(0);
    });
});

describe('BookService.getBookById', () => {
    test('returns the book if found', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBookResult);
        const result = await bookService.getBookById('book123');
        expect(result.title).toBe('Clean Code');
    });

    test('throws if book id does not exist', async () => {
        mockBookRepo.findById.mockResolvedValue(null);
        await expect(bookService.getBookById('nonexistent')).rejects.toThrow('Book not found');
    });
});

describe('BookService.updateBook', () => {
    test('updates book title', async () => {
        const updated = { ...mockBookResult, title: 'Clean Code 2nd Ed' };
        mockBookRepo.findById.mockResolvedValue(mockBookResult);
        mockBookRepo.update.mockResolvedValue(updated);

        const result = await bookService.updateBook('book123', { title: 'Clean Code 2nd Ed' });
        expect(result.title).toBe('Clean Code 2nd Ed');
    });

    test('throws if book not found', async () => {
        mockBookRepo.findById.mockResolvedValue(null);
        await expect(bookService.updateBook('bad_id', { title: 'X' })).rejects.toThrow('Book not found');
    });

    // edge case — 3 copies are out, can't reduce total below that
    test('throws if new quantity is less than currently issued copies', async () => {
        const book = { ...mockBookResult, quantity: 5, availableQuantity: 2 };
        mockBookRepo.findById.mockResolvedValue(book);
        await expect(bookService.updateBook('book123', { quantity: 2 })).rejects.toThrow();
    });
});

describe('BookService.deleteBook', () => {
    test('deletes book when all copies are available', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBookResult);
        mockBookRepo.delete.mockResolvedValue(mockBookResult);

        const result = await bookService.deleteBook('book123');
        expect(result.title).toBe('Clean Code');
    });

    test('throws if some copies are still issued', async () => {
        const issuedBook = { ...mockBookResult, quantity: 5, availableQuantity: 3 };
        mockBookRepo.findById.mockResolvedValue(issuedBook);
        await expect(bookService.deleteBook('book123')).rejects.toThrow();
    });
});

describe('BookService.searchBooks', () => {
    test('returns results for a valid query', async () => {
        mockBookRepo.search.mockResolvedValue([mockBookResult]);
        const result = await bookService.searchBooks('Clean');
        expect(result).toHaveLength(1);
    });

    test('returns empty for no match', async () => {
        mockBookRepo.search.mockResolvedValue([]);
        const result = await bookService.searchBooks('zzznomatch');
        expect(result).toHaveLength(0);
    });
});
