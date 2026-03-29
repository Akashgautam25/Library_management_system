import { UserRepository, BookRepository, TransactionRepository } from '../repositories';
import { StandardFineStrategy, PremiumFineStrategy, FineCalculator } from '../strategies/FineStrategy';

// ============================================================
// Design Pattern: Factory Pattern
// Centralizes the creation logic for repositories and
// strategies, decoupling object creation from usage.
//
// SOLID Principle: Dependency Inversion Principle (DIP)
// Consumers depend on abstractions returned by factories,
// not on concrete implementations directly.
//
// OOP Concept: Encapsulation
// Object creation details are encapsulated within factory
// methods, hiding instantiation complexity from consumers.
// ============================================================

/**
 * RepositoryFactory - Creates repository instances
 * Design Pattern: Factory Pattern
 */
export class RepositoryFactory {
    private static userRepository: UserRepository;
    private static bookRepository: BookRepository;
    private static transactionRepository: TransactionRepository;

    /**
     * Get UserRepository instance (lazy singleton within factory)
     */
    static getUserRepository(): UserRepository {
        if (!RepositoryFactory.userRepository) {
            RepositoryFactory.userRepository = new UserRepository();
        }
        return RepositoryFactory.userRepository;
    }

    /**
     * Get BookRepository instance (lazy singleton within factory)
     */
    static getBookRepository(): BookRepository {
        if (!RepositoryFactory.bookRepository) {
            RepositoryFactory.bookRepository = new BookRepository();
        }
        return RepositoryFactory.bookRepository;
    }

    /**
     * Get TransactionRepository instance (lazy singleton within factory)
     */
    static getTransactionRepository(): TransactionRepository {
        if (!RepositoryFactory.transactionRepository) {
            RepositoryFactory.transactionRepository = new TransactionRepository();
        }
        return RepositoryFactory.transactionRepository;
    }
}

/**
 * FineStrategyFactory - Creates fine strategy instances
 * Design Pattern: Factory Pattern
 *
 * OOP: Polymorphism - returns different strategy implementations
 * based on the type parameter, all conforming to IFineStrategy
 */
export class FineStrategyFactory {
    /**
     * Create a FineCalculator with the appropriate strategy
     * @param type - 'standard' or 'premium'
     */
    static createFineCalculator(type: 'standard' | 'premium' = 'standard'): FineCalculator {
        const finePerDay = Number(process.env.FINE_PER_DAY) || 2;

        switch (type) {
            case 'premium':
                return new FineCalculator(new PremiumFineStrategy(finePerDay, finePerDay * 2.5));
            case 'standard':
            default:
                return new FineCalculator(new StandardFineStrategy(finePerDay));
        }
    }
}
