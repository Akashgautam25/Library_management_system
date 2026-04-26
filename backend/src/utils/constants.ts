export const ROLES = {
    ADMIN: 'admin',
    STUDENT: 'student',
} as const;

export const TRANSACTION_STATUS = {
    BORROWED: 'borrowed',
    RETURNED: 'returned',
    OVERDUE: 'overdue',
} as const;

export const BOOK_CATEGORIES = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'History',
    'Biography',
    'Literature',
    'Mathematics',
    'Philosophy',
    'Other',
] as const;

export const MAX_BORROW_DAYS = Number(process.env.MAX_BORROW_DAYS) || 14;
