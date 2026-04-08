import { UserRepository, BookRepository, TransactionRepository } from '../repositories';
import { StandardFineStrategy, PremiumFineStrategy, FineCalculator } from '../strategies/FineStrategy';

// Creates and caches repository instances (one per app lifetime)
export class RepositoryFactory {
    private static userRepo: UserRepository;
    private static bookRepo: BookRepository;
    private static txnRepo: TransactionRepository;

    static getUserRepository()        { return (this.userRepo ??= new UserRepository()); }
    static getBookRepository()        { return (this.bookRepo ??= new BookRepository()); }
    static getTransactionRepository() { return (this.txnRepo  ??= new TransactionRepository()); }
}

// Creates a FineCalculator with the right strategy
export class FineStrategyFactory {
    static createFineCalculator(type: 'standard' | 'premium' = 'standard'): FineCalculator {
        const rate = Number(process.env.FINE_PER_DAY) || 2;
        const strategy = type === 'premium'
            ? new PremiumFineStrategy(rate, rate * 2.5)
            : new StandardFineStrategy(rate);
        return new FineCalculator(strategy);
    }
}
