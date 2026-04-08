import { IFineStrategy } from '../interfaces';

// Strategy 1: flat rate per day (default)
export class StandardFineStrategy implements IFineStrategy {
    constructor(private finePerDay = 2) {}

    calculateFine(dueDate: Date, returnDate: Date): number {
        const days = Math.ceil((returnDate.getTime() - dueDate.getTime()) / 86400000);
        return days > 0 ? days * this.finePerDay : 0;
    }

    getStrategyName() { return 'StandardFineStrategy'; }
}

// Strategy 2: escalated rate after threshold days
export class PremiumFineStrategy implements IFineStrategy {
    constructor(
        private baseRate = 2,
        private escalatedRate = 5,
        private threshold = 7
    ) {}

    calculateFine(dueDate: Date, returnDate: Date): number {
        const days = Math.ceil((returnDate.getTime() - dueDate.getTime()) / 86400000);
        if (days <= 0) return 0;
        if (days <= this.threshold) return days * this.baseRate;
        return (this.threshold * this.baseRate) + ((days - this.threshold) * this.escalatedRate);
    }

    getStrategyName() { return 'PremiumFineStrategy'; }
}

// Context class — uses whichever strategy is set
export class FineCalculator {
    constructor(private strategy: IFineStrategy) {}

    setStrategy(strategy: IFineStrategy) { this.strategy = strategy; }
    calculate(dueDate: Date, returnDate: Date) { return this.strategy.calculateFine(dueDate, returnDate); }
    getActiveStrategy() { return this.strategy.getStrategyName(); }
}
