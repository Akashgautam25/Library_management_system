import React from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { Menu, Bell, BookOpen } from 'lucide-react';

const TopBar: React.FC = () => {
    const { toggleSidebar } = useUI();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 text-secondaryText hover:text-primaryText hover:bg-white/5 rounded-lg transition-all hidden md:block"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-primaryText tracking-tight flex items-center gap-2">
                        Library<span className="text-accent font-black">OS</span>
                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-black rounded-full uppercase tracking-wider ml-1">SaaS</span>
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-secondaryText hover:text-primaryText hover:bg-white/5 rounded-lg transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-surface"></span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
