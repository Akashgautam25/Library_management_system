import { UserRepository, BookRepository, TransactionRepository } from '../repositories';
import { StandardFineStrategy, PremiumFineStrategy, FineCalculator } from '../strategies/FineStrategy';


export class RepositoryFactory {
    private static userRepository: UserRepository;
    private static bookRepository: BookRepository;
    private static transactionRepository: TransactionRepository;


    static getUserRepository(): UserRepository {
        if (!RepositoryFactory.userRepository) {
            RepositoryFactory.userRepository = new UserRepository();
        }
        return RepositoryFactory.userRepository;
    }


    static getBookRepository(): BookRepository {
        if (!RepositoryFactory.bookRepository) {
            RepositoryFactory.bookRepository = new BookRepository();
        }
        return RepositoryFactory.bookRepository;
    }


    static getTransactionRepository(): TransactionRepository {
        if (!RepositoryFactory.transactionRepository) {
            RepositoryFactory.transactionRepository = new TransactionRepository();
        }
        return RepositoryFactory.transactionRepository;
    }
}


export class FineStrategyFactory {

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
