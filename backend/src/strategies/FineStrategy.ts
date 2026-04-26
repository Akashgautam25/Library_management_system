import { IFineStrategy } from '../interfaces';

// ============================================================
// Design Pattern: Strategy Pattern
// Allows the fine calculation algorithm to be selected at
// runtime. Different strategies can be used for different
// user types or library policies without modifying the
// consumer code.
//
// SOLID Principle: Open/Closed Principle (OCP)
// New fine strategies can be added without modifying existing
// code — just create a new class implementing IFineStrategy.
//
// OOP Concept: Polymorphism
// Different strategy implementations provide different behavior
// through the same interface, enabling runtime polymorphism.
// ============================================================

/**
 * Standard fine strategy: flat rate per day
 * Used for regular student accounts
 */
export class StandardFineStrategy implements IFineStrategy {
    private readonly finePerDay: number;

    constructor(finePerDay: number = 2) {
        this.finePerDay = finePerDay;
    }

    calculateFine(dueDate: Date, returnDate: Date): number {
        const diffTime = returnDate.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 0;
        return diffDays * this.finePerDay;
    }

    getStrategyName(): string {
        return 'StandardFineStrategy';
    }
}

/**
 * Premium fine strategy: graduated rate (increases after 7 days)
 * Could be used for special or premium book categories
 */
export class PremiumFineStrategy implements IFineStrategy {
    private readonly baseFinePerDay: number;
    private readonly escalatedFinePerDay: number;
    private readonly escalationThreshold: number;

    constructor(
        baseFinePerDay: number = 2,
        escalatedFinePerDay: number = 5,
        escalationThreshold: number = 7
    ) {
        this.baseFinePerDay = baseFinePerDay;
        this.escalatedFinePerDay = escalatedFinePerDay;
        this.escalationThreshold = escalationThreshold;
    }

    calculateFine(dueDate: Date, returnDate: Date): number {
        const diffTime = returnDate.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 0;

        if (diffDays <= this.escalationThreshold) {
            return diffDays * this.baseFinePerDay;
        }

        const baseFine = this.escalationThreshold * this.baseFinePerDay;
        const escalatedFine = (diffDays - this.escalationThreshold) * this.escalatedFinePerDay;
        return baseFine + escalatedFine;
    }

    getStrategyName(): string {
        return 'PremiumFineStrategy';
    }
}

/**
 * FineCalculator - Context class for Strategy Pattern
 * 
 * SOLID Principle: Dependency Inversion Principle (DIP)
 * This class depends on the IFineStrategy abstraction, not
 * on concrete strategy implementations.
 */
export class FineCalculator {
    private strategy: IFineStrategy;

    constructor(strategy: IFineStrategy) {
        this.strategy = strategy;
    }

    /**
     * Set a new fine calculation strategy at runtime
     */
    setStrategy(strategy: IFineStrategy): void {
        this.strategy = strategy;
    }

    /**
     * Calculate fine using the current strategy
     */
    calculate(dueDate: Date, returnDate: Date): number {
        return this.strategy.calculateFine(dueDate, returnDate);
    }

    /**
     * Get current strategy name
     */
    getActiveStrategy(): string {
        return this.strategy.getStrategyName();
    }
}
