import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tiles = [
    {
        key: 'library',
        label: 'LIBRARY',
        route: '/books',
        emoji: '🏛️',
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        key: 'borrowers',
        label: 'BORROWERS LIST',
        route: '/admin/users',
        emoji: '👥',
        bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        adminOnly: true,
    },
    {
        key: 'reports',
        label: 'REPORTS',
        route: '/history',
        emoji: '📊',
        bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        key: 'updates',
        label: 'MANAGE BOOKS',
        route: '/admin',
        emoji: '📚',
        bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        adminOnly: true,
    },
    {
        key: 'borrow',
        label: 'BORROW',
        route: '/issue-return',
        emoji: '📖',
        bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
        key: 'history',
        label: 'MY HISTORY',
        route: '/history',
        emoji: '🕐',
        bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    },
];

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const visibleTiles = tiles.filter(t => !t.adminOnly || isAdmin);

    return (
        <div className="dashboard-home">
            <div className="dashboard-tiles">
                {visibleTiles.map((tile) => (
                    <button
                        key={tile.key}
                        className="dash-tile"
                        style={{ background: tile.bg }}
                        onClick={() => navigate(tile.route)}
                    >
                        <div className="dash-tile-icon">{tile.emoji}</div>
                        <div className="dash-tile-label">{tile.label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
