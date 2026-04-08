import React from 'react';
import { Link } from 'react-router-dom';

const TopBar: React.FC = () => {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="topbar-menu-btn">☰</button>
                <Link to="/" className="topbar-brand">
                    📚 Lib<span className="brand-badge">rix</span>
                </Link>
            </div>
            <div className="topbar-right">
                <button className="topbar-bell" title="Notifications">🔔</button>
            </div>
        </header>
    );
};

export default TopBar;
