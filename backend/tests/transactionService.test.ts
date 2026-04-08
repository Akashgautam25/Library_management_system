import { TransactionService } from '../src/services/TransactionService';
import { RepositoryFactory, FineStrategyFactory } from '../src/factories';
import { StandardFineStrategy, FineCalculator } from '../src/strategies/FineStrategy';

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
    test('issues book successfully', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBook);
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(null);
        mockTransactionRepo.create.mockResolvedValue(mockTransaction);
        mockBookRepo.decrementAvailable.mockResolvedValue(mockBook);

        const result = await transactionService.issueBook('user123', 'book123');
        expect(result.status).toBe('issued');
        expect(mockBookRepo.decrementAvailable).toHaveBeenCalledWith('book123');
    });

    test('throws if book does not exist', async () => {
        mockBookRepo.findById.mockResolvedValue(null);
        await expect(transactionService.issueBook('user123', 'bad_book')).rejects.toThrow('Book not found');
    });

    test('throws if no copies available', async () => {
        mockBookRepo.findById.mockResolvedValue({ ...mockBook, availableQuantity: 0 });
        await expect(transactionService.issueBook('user123', 'book123')).rejects.toThrow();
    });

    // user tries to borrow same book twice
    test('throws if user already has this book issued', async () => {
        mockBookRepo.findById.mockResolvedValue(mockBook);
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(mockTransaction);
        await expect(transactionService.issueBook('user123', 'book123')).rejects.toThrow();
    });
});

describe('TransactionService.returnBook', () => {
    test('returns book with no fine when on time', async () => {
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(mockTransaction);
        mockTransactionRepo.update.mockResolvedValue({ ...mockTransaction, status: 'returned', fine: 0 });
        mockBookRepo.incrementAvailable.mockResolvedValue(mockBook);

        const result = await transactionService.returnBook('user123', 'book123');
        expect(result.status).toBe('returned');
        expect(result.fine).toBe(0);
        expect(mockBookRepo.incrementAvailable).toHaveBeenCalledWith('book123');
    });

    test('charges fine for late return', async () => {
        const overdueTransaction = { ...mockTransaction, dueDate: new Date('2024-01-15') };

        mockTransactionRepo.findActiveTransaction.mockResolvedValue(overdueTransaction);
        mockTransactionRepo.update.mockImplementation((id, data) =>
            Promise.resolve({ ...overdueTransaction, ...data, status: 'returned' })
        );
        mockBookRepo.incrementAvailable.mockResolvedValue(mockBook);

        (FineStrategyFactory.createFineCalculator as jest.Mock).mockReturnValue({
            calculate: jest.fn().mockReturnValue(10),
        });

        const result = await transactionService.returnBook('user123', 'book123');
        expect(result.fine).toBe(10);
    });

    test('throws if no active borrow found', async () => {
        mockTransactionRepo.findActiveTransaction.mockResolvedValue(null);
        await expect(transactionService.returnBook('user123', 'book123')).rejects.toThrow();
    });
});

describe('TransactionService.getUserHistory', () => {
    test('returns history for a user', async () => {
        mockTransactionRepo.findByUserId.mockResolvedValue([mockTransaction]);
        const result = await transactionService.getUserHistory('user123');
        expect(result).toHaveLength(1);
    });

    test('returns empty array if user has no history', async () => {
        mockTransactionRepo.findByUserId.mockResolvedValue([]);
        const result = await transactionService.getUserHistory('user123');
        expect(result).toHaveLength(0);
    });
});
