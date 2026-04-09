import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

const notifications: { id: number; text: string; time: string; unread: boolean }[] = [];

const TopBar: React.FC = () => {
    const { toggleSidebar } = useUI();
    const { isAuthenticated } = useAuth();
    const [bellOpen, setBellOpen] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => n.unread).length;

    // close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setBellOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="topbar-menu-btn" onClick={toggleSidebar} title="Toggle sidebar">
                    ☰
                </button>
                <Link to="/" className="topbar-brand">
                    📚 Library <span className="brand-badge">System</span>
                </Link>
            </div>

            <div className="topbar-right">
                {isAuthenticated && (
                    <div className="bell-wrapper" ref={bellRef}>
                        <button
                            className="topbar-bell"
                            title="Notifications"
                            onClick={() => setBellOpen(p => !p)}
                        >
                            🔔
                            {unreadCount > 0 && (
                                <span className="bell-badge">{unreadCount}</span>
                            )}
                        </button>

                        {bellOpen && (
                            <div className="notifications-dropdown">
                                <div className="notif-header">
                                    <span>Notifications</span>
                                    <span className="notif-count">{unreadCount} new</span>
                                </div>
                                <ul className="notif-list">
                                    {notifications.length === 0 ? (
                                        <li className="notif-empty">No notifications</li>
                                    ) : notifications.map(n => (
                                        <li key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                                            <span className="notif-dot" />
                                            <div className="notif-body">
                                                <p className="notif-text">{n.text}</p>
                                                <span className="notif-time">{n.time}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="notif-footer">Mark all as read</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default TopBar;
