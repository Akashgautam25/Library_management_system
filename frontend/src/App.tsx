import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailsPage';
import IssueReturnPage from './pages/IssueReturnPage';
import BorrowingHistoryPage from './pages/BorrowingHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sidebarOpen, closeSidebar } = useUI();
    return (
        <div className="app-shell">
            <TopBar />
            <div className="app-body">
                {sidebarOpen && (
                    <div className="sidebar-overlay" onClick={closeSidebar} />
                )}
                <Sidebar />
                <main className={`app-main ${sidebarOpen ? '' : 'app-main-expanded'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <UIProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <AppLayout>
                                <ProtectedRoute><DashboardPage /></ProtectedRoute>
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/books"
                        element={<AppLayout><BookListPage /></AppLayout>}
                    />
                    <Route
                        path="/books/:id"
                        element={<AppLayout><BookDetailsPage /></AppLayout>}
                    />
                    <Route
                        path="/issue-return"
                        element={
                            <AppLayout>
                                <ProtectedRoute><IssueReturnPage /></ProtectedRoute>
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <AppLayout>
                                <ProtectedRoute><BorrowingHistoryPage /></ProtectedRoute>
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AppLayout>
                                <ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/admin/books"
                        element={
                            <AppLayout>
                                <ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <AppLayout>
                                <ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>
                            </AppLayout>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
            </UIProvider>
        </AuthProvider>
    );
};

export default App;
