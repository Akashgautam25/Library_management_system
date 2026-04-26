import api from './api';
import { ApiResponse, User, Transaction } from '../types';

export interface UserWithStats extends User {
    isBlocked: boolean;
    borrowCount: number;
}

export interface ActivityLog {
    _id: string;
    userId: string | User;
    userEmail: string;
    action: string;
    resourceId?: string;
    resourceType?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface OverdueTransaction extends Omit<Transaction, 'bookId' | 'userId'> {
    daysLate: number;
    userId: User;
    bookId: {
        _id: string;
        title: string;
        author: string;
        isbn: string;
    };
}

export const adminService = {
    // ── Users ────────────────────────────────────────────────────────
    async getAllUsersWithStats(): Promise<UserWithStats[]> {
        const res = await api.get<ApiResponse<UserWithStats[]>>('/users/stats');
        return res.data.data!;
    },

    async blockUser(id: string): Promise<User> {
        const res = await api.patch<ApiResponse<User>>(`/users/${id}/block`);
        return res.data.data!;
    },

    async unblockUser(id: string): Promise<User> {
        const res = await api.patch<ApiResponse<User>>(`/users/${id}/unblock`);
        return res.data.data!;
    },

    async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    },

    // ── Transactions / Overdue ────────────────────────────────────────
    async getOverdueTransactions(): Promise<OverdueTransaction[]> {
        const res = await api.get<ApiResponse<{ data: any[]; pagination: any }>>('/transactions/overdue');
        const payload = res.data.data;
        const raw: any[] = Array.isArray(payload) ? payload : (payload?.data ?? []);
        return raw.map((t: any) => {
            const due = new Date(t.dueDate);
            const now = new Date();
            const daysLate = Math.max(0, Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
            return { ...t, daysLate };
        });
    },

    async getActiveTransactions(): Promise<Transaction[]> {
        const res = await api.get<ApiResponse<{ data: any[]; pagination: any }>>('/transactions/active');
        const payload = res.data.data;
        return Array.isArray(payload) ? payload : (payload?.data ?? []);
    },

    async getAllTransactions(status?: 'all' | 'borrowed' | 'returned' | 'overdue'): Promise<any[]> {
        let endpoint = '/transactions/all?limit=200';
        if (status === 'borrowed') endpoint = '/transactions/active';
        else if (status === 'overdue') endpoint = '/transactions/overdue';
        else if (status === 'returned') endpoint = '/transactions/all-history?limit=200';
        const res = await api.get<ApiResponse<any>>(endpoint);
        const payload = res.data.data;
        return Array.isArray(payload) ? payload : (payload?.data ?? []);
    },

    // ── Activity Logs ─────────────────────────────────────────────────
    async getActivityLogs(limit = 20): Promise<ActivityLog[]> {
        const res = await api.get<ApiResponse<{ logs: ActivityLog[] }>>(`/admin/activity?limit=${limit}`);
        return res.data.data?.logs || [];
    },
};
