import { BookService } from '../src/services/BookService';
import { RepositoryFactory } from '../src/factories';

// ============================================================
// Test Suite: BookService
// Uses mocks to isolate business logic from the database.
// Tests CRUD operations and validation rules.
// ============================================================

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

// mockBookResult simulates what the DB returns (has _id)
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

// mockBookInput is what we pass to the service (no _id)
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

    test('throws ConflictError if ISBN already exists', async () => {
        mockBookRepo.findByIsbn.mockResolvedValue(mockBookResult);

        await expect(bookService.createBook({ ...mockBookInput })).rejects.toThrow(
            'Book with this ISBN already exists'
        );
    });

    test('sets availableQuantity equal to quantity on creation', async () => {
        mockBookRepo.findByIsbn.mockResolvedValue(null);
        mockBookRepo.create.mockImplementation((data) => Promise.resolve(data));

        await bookService.createBook({ ...mockBookInput, quantity: 3, availableQuantity: 0 });

        expect(mockBookRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({ availableQuantity: 3 })
        );
    });
});

describe('BookService.getAllBooks', () => {
    test('returns all books', async () => {
        mockBookRepo.findAll.mockResolvedValue([mockBookResult]);
        const result = await bookService.getAllBooks();
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Clean Code');
    });

    test('returns empty array when no books', async () => {
        mockBookRepo.findAll.mockResolvedValue([]);
        const result = await bookService.getAllBooks();
        expect(result).toHaveLength(0);
    });
});

describe('BookService.getBookById', () => {
    test('returns book when found', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBookResult);
        const result = await bookService.getBookById('book123');
        expect(result.title).toBe('Clean Code');
    });

    test('throws NotFoundError when book does not exist', async () => {
        mockBookRepo.findById.mockResolvedValue(null);
        await expect(bookService.getBookById('nonexistent')).rejects.toThrow('Book not found');
    });
});

describe('BookService.updateBook', () => {
    test('updates book successfully', async () => {
        const updated = { ...mockBookResult, title: 'Clean Code 2nd Ed' };
        mockBookRepo.findById.mockResolvedValue(mockBookResult);
        mockBookRepo.update.mockResolvedValue(updated);

        const result = await bookService.updateBook('book123', { title: 'Clean Code 2nd Ed' });
        expect(result.title).toBe('Clean Code 2nd Ed');
    });

    test('throws NotFoundError when book does not exist', async () => {
        mockBookRepo.findById.mockResolvedValue(null);
        await expect(bookService.updateBook('bad_id', { title: 'X' })).rejects.toThrow('Book not found');
    });

    test('throws ValidationError when reducing quantity below issued count', async () => {
        // 5 total, 2 available → 3 are issued; reducing to 2 makes availableQuantity = -1
        const book = { ...mockBookResult, quantity: 5, availableQuantity: 2 };
        mockBookRepo.findById.mockResolvedValue(book);

        await expect(bookService.updateBook('book123', { quantity: 2 })).rejects.toThrow(
            'Cannot reduce quantity below currently issued books'
        );
    });
});

describe('BookService.deleteBook', () => {
    test('deletes book when no copies are issued', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBookResult); // quantity === availableQuantity
        mockBookRepo.delete.mockResolvedValue(mockBookResult);

        const result = await bookService.deleteBook('book123');
        expect(result.title).toBe('Clean Code');
    });

    test('throws ValidationError when copies are currently issued', async () => {
        const issuedBook = { ...mockBookResult, quantity: 5, availableQuantity: 3 };
        mockBookRepo.findById.mockResolvedValue(issuedBook);

        await expect(bookService.deleteBook('book123')).rejects.toThrow(
            'Cannot delete a book that has copies currently issued'
        );
    });
});

describe('BookService.searchBooks', () => {
    test('returns matching books', async () => {
        mockBookRepo.search.mockResolvedValue([mockBookResult]);
        const result = await bookService.searchBooks('Clean');
        expect(result).toHaveLength(1);
    });

    test('returns empty array for no matches', async () => {
        mockBookRepo.search.mockResolvedValue([]);
        const result = await bookService.searchBooks('xyz_nonexistent');
        expect(result).toHaveLength(0);
    });
});
