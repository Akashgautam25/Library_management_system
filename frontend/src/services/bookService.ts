import api from './api';
import { ApiResponse, Book, BookFormData } from '../types';

export const bookService = {
    async getAllBooks(query?: string): Promise<Book[]> {
        const url = query ? `/books?${query}` : '/books';
        const response = await api.get<ApiResponse<any>>(url);
        const payload = response.data.data;
        return Array.isArray(payload) ? payload : (payload?.data ?? []);
    },

    async getBookById(id: string): Promise<Book> {
        const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
        return response.data.data!;
    },

    async searchBooks(query: string): Promise<Book[]> {
        const response = await api.get<ApiResponse<any>>(`/books/search?q=${encodeURIComponent(query)}`);
        const payload = response.data.data;
        return Array.isArray(payload) ? payload : (payload?.data ?? []);
    },

    async createBook(data: BookFormData): Promise<Book> {
        const response = await api.post<ApiResponse<Book>>('/books', data);
        return response.data.data!;
    },

    async updateBook(id: string, data: Partial<BookFormData>): Promise<Book> {
        const response = await api.put<ApiResponse<Book>>(`/books/${id}`, data);
        return response.data.data!;
    },

    async deleteBook(id: string): Promise<void> {
        await api.delete(`/books/${id}`);
    },

    async getBooksByCategory(category: string): Promise<Book[]> {
        const response = await api.get<ApiResponse<any>>(`/books/category/${encodeURIComponent(category)}`);
        const payload = response.data.data;
        return Array.isArray(payload) ? payload : (payload?.data ?? []);
    },

    async searchExternal(query: string): Promise<Partial<BookFormData>[]> {
        const response = await api.get<ApiResponse<Partial<BookFormData>[]>>(`/books/external-search?q=${encodeURIComponent(query)}`);
        return response.data.data!;
    },

    async searchExternalBooks(query: string, subject?: string, page = 1): Promise<import('../types').ExternalBooksResponse> {
        const params = new URLSearchParams({ q: query, page: String(page) });
        if (subject) params.append('subject', subject);
        const response = await api.get<ApiResponse<import('../types').ExternalBooksResponse>>(`/external-books?${params}`);
        return response.data.data!;
    },
};
