import api from './api';
import { ApiResponse, Transaction, DashboardStats } from '../types';

export const transactionService = {
    async issueBook(bookId: string): Promise<Transaction> {
        const response = await api.post<ApiResponse<Transaction>>('/transactions/issue', { bookId });
        return response.data.data!;
    },

    async returnBook(bookId: string): Promise<Transaction> {
        const response = await api.post<ApiResponse<Transaction>>('/transactions/return', { bookId });
        return response.data.data!;
    },

    async getMyHistory(): Promise<Transaction[]> {
        const response = await api.get<ApiResponse<Transaction[]>>('/transactions/history');
        return response.data.data!;
    },

    async getActiveTransactions(): Promise<Transaction[]> {
        const response = await api.get<ApiResponse<Transaction[]>>('/transactions/active');
        return response.data.data!;
    },

    async getOverdueTransactions(): Promise<Transaction[]> {
        const response = await api.get<ApiResponse<Transaction[]>>('/transactions/overdue');
        return response.data.data!;
    },

    async getDashboardStats(): Promise<DashboardStats> {
        const response = await api.get<ApiResponse<DashboardStats>>('/transactions/dashboard');
        return response.data.data!;
    },
};
