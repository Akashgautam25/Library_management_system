import api from './api';
import { ApiResponse, Book, BookFormData } from '../types';

export const bookService = {
    async getAllBooks(): Promise<Book[]> {
        const response = await api.get<ApiResponse<Book[]>>('/books');
        return response.data.data!;
    },

    async getBookById(id: string): Promise<Book> {
        const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
        return response.data.data!;
    },

    async searchBooks(query: string): Promise<Book[]> {
        const response = await api.get<ApiResponse<Book[]>>(`/books/search?q=${encodeURIComponent(query)}`);
        return response.data.data!;
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
        const response = await api.get<ApiResponse<Book[]>>(`/books/category/${encodeURIComponent(category)}`);
        return response.data.data!;
    },
};
