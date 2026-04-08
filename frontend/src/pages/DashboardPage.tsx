import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tiles = [
    {
        key: 'library',
        label: 'LIBRARY',
        route: '/books',
        emoji: '🏛️',
        bg: 'linear-gradient(135deg, #2D4A3E 0%, #4A7C59 100%)',
    },
    {
        key: 'borrowers',
        label: 'BORROWERS',
        route: '/admin/users',
        emoji: '👥',
        bg: 'linear-gradient(135deg, #3A5A2E 0%, #6A9E50 100%)',
        adminOnly: true,
    },
    {
        key: 'reports',
        label: 'REPORTS',
        route: '/history',
        emoji: '📊',
        bg: 'linear-gradient(135deg, #C8860A 0%, #E8A020 100%)',
    },
    {
        key: 'manage',
        label: 'MANAGE BOOKS',
        route: '/admin',
        emoji: '📚',
        bg: 'linear-gradient(135deg, #4A3E2D 0%, #7C6A4A 100%)',
        adminOnly: true,
    },
    {
        key: 'borrow',
        label: 'BORROW',
        route: '/issue-return',
        emoji: '📖',
        bg: 'linear-gradient(135deg, #2D3E4A 0%, #4A6A7C 100%)',
    },
    {
        key: 'history',
        label: 'MY HISTORY',
        route: '/history',
        emoji: '🕐',
        bg: 'linear-gradient(135deg, #5A2D2D 0%, #8B4A4A 100%)',
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
