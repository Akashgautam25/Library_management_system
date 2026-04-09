import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const Sidebar: React.FC = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { sidebarOpen } = useUI();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="sidebar-role">
                <span className="sidebar-role-icon">◐</span>
                {isAdmin ? 'ADMIN' : user ? user.name.toUpperCase() : 'GUEST'}
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    DASHBOARD
                </NavLink>
                {isAdmin && (
                    <NavLink to="/admin/books" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        ADD BOOKS
                    </NavLink>
                )}
                <NavLink to="/books" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    {isAdmin ? 'INVENTORY' : 'LIBRARY'}
                </NavLink>
                {isAuthenticated && (
                    <>
                        <NavLink to="/issue-return" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            BORROW
                        </NavLink>
                        <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            RETURN
                        </NavLink>
                    </>
                )}
                {isAdmin && (
                    <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        BORROWERS
                    </NavLink>
                )}
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
                <span className="logout-icon">⏻</span>
                LOGOUT
            </button>
        </aside>
    );
};

export default Sidebar;
