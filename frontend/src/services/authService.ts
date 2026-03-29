import api from './api';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return response.data.data!;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
        return response.data.data!;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/auth/profile');
        return response.data.data!;
    },
};
