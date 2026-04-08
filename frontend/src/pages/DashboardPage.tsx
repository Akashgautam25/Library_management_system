import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tiles = [
    {
        key: 'library',
        label: 'LIBRARY',
        route: '/books',
        emoji: '🏛️',
        color: '#2d6a8f',
        bg: 'linear-gradient(135deg, #1a4a6b 0%, #2d6a8f 60%, #e8734a 100%)',
    },
    {
        key: 'borrowers',
        label: 'BORROWERS LIST',
        route: '/admin/users',
        emoji: '📋',
        color: '#3a5a4a',
        bg: 'linear-gradient(135deg, #2a3a2a 0%, #3a5a4a 60%, #c0392b 100%)',
        adminOnly: true,
    },
    {
        key: 'reports',
        label: 'REPORTS',
        route: '/history',
        emoji: '📊',
        color: '#2a4a6a',
        bg: 'linear-gradient(135deg, #1a2a4a 0%, #2a4a6a 60%, #e8734a 100%)',
    },
    {
        key: 'updates',
        label: 'UPDATES',
        route: '/admin',
        emoji: '🔄',
        color: '#1a7a6a',
        bg: 'linear-gradient(135deg, #0a4a3a 0%, #1a7a6a 100%)',
        adminOnly: true,
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
