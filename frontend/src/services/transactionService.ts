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

    async getMyHistory(status?: string): Promise<Transaction[]> {
        // Backend returns PaginatedResult which has { data, pagination }. The frontend hook handles .data.data when it was unpaginated,
        // Wait, looking at TransactionService.ts, getUserHistory returns { data, pagination }. So the response.data.data has { data, pagination }.
        // Actually I'll just let the backend handle the query param.
        const url = status ? `/transactions/history?status=${status}` : '/transactions/history';
        const response = await api.get<ApiResponse<any>>(url);
        // Extract data array from the paginated response
        return response.data.data.data || response.data.data;
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
