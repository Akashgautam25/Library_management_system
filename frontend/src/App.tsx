import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import BorrowPage from './pages/BorrowPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';
import AdminOverduePage from './pages/AdminOverduePage';
import { useAuth } from './context/AuthContext';
import './index.css';

const DashboardRedirect: React.FC = () => {
    const { isAdmin } = useAuth();
    return isAdmin ? <AdminDashboardPage /> : <DashboardPage />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sidebarOpen } = useUI();
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <TopBar />
            <div className="flex flex-1 overflow-hidden pt-16">
                <Sidebar />
                <main className={`flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                    <div className="flex-1 w-full max-w-7xl mx-auto">
                        {children}
                    </div>
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
                        <Route path="/dashboard" element={
                            <AppLayout>
                                <ProtectedRoute>
                                    <DashboardRedirect />
                                </ProtectedRoute>
                            </AppLayout>
                        } />
                        <Route path="/profile" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />
                        <Route path="/library" element={<AppLayout><BookListPage /></AppLayout>} />
                        <Route path="/books" element={<Navigate to="/library" replace />} />
                        <Route path="/books/:id" element={<AppLayout><BookDetailsPage /></AppLayout>} />

                        <Route path="/borrow" element={<AppLayout><ProtectedRoute><BorrowPage /></ProtectedRoute></AppLayout>} />
                        <Route path="/history" element={<AppLayout><ProtectedRoute><BorrowingHistoryPage /></ProtectedRoute></AppLayout>} />
                        <Route path="/admin" element={<AppLayout><ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute></AppLayout>} />
                        <Route path="/admin/books" element={<AppLayout><ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute></AppLayout>} />
                        <Route path="/admin/users" element={<AppLayout><ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute></AppLayout>} />
                        <Route path="/admin/transactions" element={<AppLayout><ProtectedRoute adminOnly><AdminTransactionsPage /></ProtectedRoute></AppLayout>} />
                        <Route path="/admin/overdue" element={<AppLayout><ProtectedRoute adminOnly><AdminOverduePage /></ProtectedRoute></AppLayout>} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        className: '!bg-surface !text-primaryText !border !border-white/10 !shadow-xl !rounded-xl',
                        style: {
                            background: '#18181B',
                            color: '#F4F4F5',
                        },
                    }}
                />
            </UIProvider>
        </AuthProvider>
    );
};

export default App;
