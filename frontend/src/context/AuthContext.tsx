import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // sessionStorage is tab-isolated — prevents cross-tab role leakage
        const savedUser = sessionStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (err) {
                console.error('Failed to parse saved user', err);
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const result = await authService.login(credentials);
        setUser(result.user); setToken(result.token);
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
    };

    const register = async (data: RegisterData) => {
        const result = await authService.register(data);
        setUser(result.user); setToken(result.token);
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
    };

    const logout = async () => {
        try { await authService.logout(); } catch {}
        setUser(null); setToken(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isAdmin: user?.role === 'admin', loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
