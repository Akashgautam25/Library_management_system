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
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            try { setToken(savedToken); setUser(JSON.parse(savedUser)); }
            catch { localStorage.removeItem('token'); localStorage.removeItem('user'); }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const result = await authService.login(credentials);
        setUser(result.user); setToken(result.token);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
    };

    const register = async (data: RegisterData) => {
        const result = await authService.register(data);
        setUser(result.user); setToken(result.token);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
    };

    const logout = async () => {
        try { await authService.logout(); } catch {}
        setUser(null); setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
