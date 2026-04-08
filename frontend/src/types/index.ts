// ============================================================
// Frontend TypeScript Types/Interfaces
// These mirror the backend data structures for type safety
// across the full stack.
// ============================================================

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'student';
    createdAt: string;
    updatedAt: string;
}

export interface Book {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    description: string;
    quantity: number;
    availableQuantity: number;
    publishedYear: number;
    publisher: string;
    coverUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    _id: string;
    userId: string | User;
    bookId: string | Book;
    issueDate: string;
    dueDate: string;
    returnDate?: string;
    fine: number;
    status: 'issued' | 'returned' | 'overdue';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Array<{ msg: string; path: string }>;
}

export interface DashboardStats {
    totalBooks: number;
    totalUsers: number;
    activeIssues: number;
    overdueCount: number;
    recentTransactions: Transaction[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'student';
}

export interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    category: string;
    description: string;
    quantity: number;
    publishedYear: number;
    publisher: string;
}

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
