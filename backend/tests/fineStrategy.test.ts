import {
    StandardFineStrategy,
    PremiumFineStrategy,
    FineCalculator,
} from '../src/strategies/FineStrategy';

// ============================================================
// Test Suite: Strategy Pattern — Fine Calculation
// Tests both StandardFineStrategy and PremiumFineStrategy
// and verifies the FineCalculator context class behavior.
// ============================================================

describe('StandardFineStrategy', () => {
    const strategy = new StandardFineStrategy(2); // ₹2/day

    test('returns 0 fine when returned on time', () => {
        const dueDate = new Date('2024-01-15');
        const returnDate = new Date('2024-01-15');
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(0);
    });

    test('returns 0 fine when returned before due date', () => {
        const dueDate = new Date('2024-01-15');
        const returnDate = new Date('2024-01-10');
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(0);
    });

    test('calculates correct fine for 5 overdue days', () => {
        const dueDate = new Date('2024-01-10');
        const returnDate = new Date('2024-01-15');
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(10); // 5 * 2
    });

    test('calculates correct fine for 1 overdue day', () => {
        const dueDate = new Date('2024-01-10');
        const returnDate = new Date('2024-01-11');
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(2);
    });

    test('getStrategyName returns correct name', () => {
        expect(strategy.getStrategyName()).toBe('StandardFineStrategy');
    });
});

describe('PremiumFineStrategy', () => {
    // ₹2/day for first 7 days, ₹5/day after
    const strategy = new PremiumFineStrategy(2, 5, 7);

    test('returns 0 fine when returned on time', () => {
        const dueDate = new Date('2024-01-15');
        const returnDate = new Date('2024-01-15');
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(0);
    });

    test('calculates base rate fine within threshold (3 days)', () => {
        const dueDate = new Date('2024-01-10');
        const returnDate = new Date('2024-01-13');
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(6); // 3 * 2
    });

    test('calculates escalated fine beyond threshold (10 days)', () => {
        const dueDate = new Date('2024-01-01');
        const returnDate = new Date('2024-01-11');
        // 7 days * 2 + 3 days * 5 = 14 + 15 = 29
        expect(strategy.calculateFine(dueDate, returnDate)).toBe(29);
    });

    test('getStrategyName returns correct name', () => {
        expect(strategy.getStrategyName()).toBe('PremiumFineStrategy');
    });
});

describe('FineCalculator (Strategy Context)', () => {
    test('uses injected strategy to calculate fine', () => {
        const calculator = new FineCalculator(new StandardFineStrategy(2));
        const dueDate = new Date('2024-01-10');
        const returnDate = new Date('2024-01-15');
        expect(calculator.calculate(dueDate, returnDate)).toBe(10);
    });

    test('can switch strategy at runtime (OCP / Polymorphism)', () => {
        const calculator = new FineCalculator(new StandardFineStrategy(2));
        const dueDate = new Date('2024-01-01');
        const returnDate = new Date('2024-01-11'); // 10 days overdue

        // Standard: 10 * 2 = 20
        expect(calculator.calculate(dueDate, returnDate)).toBe(20);

        // Switch to premium: 7*2 + 3*5 = 29
        calculator.setStrategy(new PremiumFineStrategy(2, 5, 7));
        expect(calculator.calculate(dueDate, returnDate)).toBe(29);
    });

    test('getActiveStrategy returns current strategy name', () => {
        const calculator = new FineCalculator(new StandardFineStrategy(2));
        expect(calculator.getActiveStrategy()).toBe('StandardFineStrategy');

        calculator.setStrategy(new PremiumFineStrategy());
        expect(calculator.getActiveStrategy()).toBe('PremiumFineStrategy');
    });
});
