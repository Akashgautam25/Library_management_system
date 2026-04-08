import { TransactionService } from '../src/services/TransactionService';
import { RepositoryFactory, FineStrategyFactory } from '../src/factories';
import { StandardFineStrategy, FineCalculator } from '../src/strategies/FineStrategy';

// ============================================================
// Test Suite: TransactionService
// Tests book issue, return, fine calculation, and history.
// ============================================================

jest.mock('../src/factories');

const mockTransactionRepo = {
    findActiveTransaction: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByUserId: jest.fn(),
    findAllActive: jest.fn(),
    findOverdueTransactions: jest.fn(),
    findRecent: jest.fn(),
    count: jest.fn(),
};

const mockBookRepo = {
    findById: jest.fn(),
    decrementAvailable: jest.fn(),
    incrementAvailable: jest.fn(),
};

(RepositoryFactory.getTransactionRepository as jest.Mock).mockReturnValue(mockTransactionRepo);
(RepositoryFactory.getBookRepository as jest.Mock).mockReturnValue(mockBookRepo);
(FineStrategyFactory.createFineCalculator as jest.Mock).mockReturnValue(
    new FineCalculator(new StandardFineStrategy(2))
);

const transactionService = new TransactionService();

const mockBook = {
    _id: 'book123',
    title: 'Clean Code',
    availableQuantity: 3,
    quantity: 5,
};

const mockTransaction = {
    _id: 'txn123',
    userId: 'user123',
    bookId: 'book123',
    issueDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-15'),
    status: 'issued',
    fine: 0,
};

beforeEach(() => jest.clearAllMocks());

describe('TransactionService.issueBook', () => {
    test('issues a book successfully', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBook);
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(null);
        mockTransactionRepo.create.mockResolvedValue(mockTransaction);
        mockBookRepo.decrementAvailable.mockResolvedValue(mockBook);

        const result = await transactionService.issueBook('user123', 'book123');

        expect(result.status).toBe('issued');
        expect(mockBookRepo.decrementAvailable).toHaveBeenCalledWith('book123');
    });

    test('throws NotFoundError when book does not exist', async () => {
        mockBookRepo.findById.mockResolvedValue(null);

        await expect(transactionService.issueBook('user123', 'bad_book')).rejects.toThrow(
            'Book not found'
        );
    });

    test('throws ValidationError when book is not available', async () => {
        mockBookRepo.findById.mockResolvedValue({ ...mockBook, availableQuantity: 0 });

        await expect(transactionService.issueBook('user123', 'book123')).rejects.toThrow(
            'Book is not available for issue'
        );
    });

    test('throws ValidationError when user already has the book', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBook);
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(mockTransaction);

        await expect(transactionService.issueBook('user123', 'book123')).rejects.toThrow(
            'You already have this book issued'
        );
    });
});

describe('TransactionService.returnBook', () => {
    test('returns a book on time with zero fine', async () => {
        const onTimeReturn = new Date(mockTransaction.dueDate);
        onTimeReturn.setDate(onTimeReturn.getDate() - 1); // 1 day early

        mockTransactionRepo.findActiveTransaction.mockResolvedValue(mockTransaction);
        mockTransactionRepo.update.mockResolvedValue({ ...mockTransaction, status: 'returned', fine: 0 });
        mockBookRepo.incrementAvailable.mockResolvedValue(mockBook);

        const result = await transactionService.returnBook('user123', 'book123');

        expect(result.status).toBe('returned');
        expect(result.fine).toBe(0);
        expect(mockBookRepo.incrementAvailable).toHaveBeenCalledWith('book123');
    });

    test('calculates fine for overdue return', async () => {
        // dueDate: Jan 15, returnDate will be Jan 20 → 5 days overdue → ₹10
        const overdueTransaction = {
            ...mockTransaction,
            dueDate: new Date('2024-01-15'),
        };

        mockTransactionRepo.findActiveTransaction.mockResolvedValue(overdueTransaction);
        mockTransactionRepo.update.mockImplementation((id, data) =>
            Promise.resolve({ ...overdueTransaction, ...data, status: 'returned' })
        );
        mockBookRepo.incrementAvailable.mockResolvedValue(mockBook);

        // Override FineCalculator to return a known fine
        (FineStrategyFactory.createFineCalculator as jest.Mock).mockReturnValue({
            calculate: jest.fn().mockReturnValue(10),
        });

        const result = await transactionService.returnBook('user123', 'book123');
        expect(result.fine).toBe(10);
    });

    test('throws NotFoundError when no active transaction exists', async () => {
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(null);

        await expect(transactionService.returnBook('user123', 'book123')).rejects.toThrow(
            'No active transaction found for this book'
        );
    });
});

describe('TransactionService.getUserHistory', () => {
    test('returns user transaction history', async () => {
        mockTransactionRepo.findByUserId.mockResolvedValue([mockTransaction]);
        const result = await transactionService.getUserHistory('user123');
        expect(result).toHaveLength(1);
        expect(result[0].userId).toBe('user123');
    });

    test('returns empty array when no history', async () => {
        mockTransactionRepo.findByUserId.mockResolvedValue([]);
        const result = await transactionService.getUserHistory('user123');
        expect(result).toHaveLength(0);
    });
});
