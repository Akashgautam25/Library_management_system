import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-secondaryText text-sm font-medium animate-pulse tracking-widest uppercase">Initializing LibraryOS...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/books" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
