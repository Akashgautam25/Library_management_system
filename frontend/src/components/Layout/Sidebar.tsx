import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { LayoutDashboard, Book, Search, BookOpen, Clock, Users, LogOut, Library, PlusCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { sidebarOpen } = useUI();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!sidebarOpen) return null;

    const navLinkClass = ({ isActive }: { isActive: boolean }) => 
        `flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all border-l-2 ${
            isActive 
            ? 'bg-accent/10 text-accent border-accent' 
            : 'text-secondaryText border-transparent hover:bg-white/5 hover:text-primaryText'
        }`;

    return (
        <aside className="w-64 bg-surface/50 backdrop-blur-md border-r border-white/5 flex flex-col fixed left-0 top-16 bottom-0 z-40 hidden md:flex">
            <div className="p-6">
                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="w-10 h-10 bg-gradient-to-tr from-accent to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">
                        {user ? user.name.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-primaryText leading-tight">{user ? user.name : 'Guest'}</p>
                        <p className="text-xs text-secondaryText font-medium">{isAdmin ? 'Administrator' : 'Student'}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-1">
                <div className="px-6 pb-2 text-xs font-bold text-secondaryText/50 uppercase tracking-wider">Main Menu</div>
                <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                </NavLink>
                
                {isAdmin && (
                    <NavLink to="/admin/books" className={navLinkClass}>
                        <PlusCircle className="w-5 h-5" /> Add Books
                    </NavLink>
                )}
                
                <NavLink to="/library" className={navLinkClass}>
                    <Library className="w-5 h-5" /> {isAdmin ? 'Inventory' : 'Library'}
                </NavLink>
                
                <NavLink to="/explore" className={navLinkClass}>
                    <Search className="w-5 h-5" /> Explore APIs
                </NavLink>

                {isAuthenticated && (
                    <>
                        <div className="px-6 pt-6 pb-2 text-xs font-bold text-secondaryText/50 uppercase tracking-wider">Transactions</div>
                        <NavLink to="/borrow" className={navLinkClass}>
                            <BookOpen className="w-5 h-5" /> Borrowed Books
                        </NavLink>
                        <NavLink to="/history" className={navLinkClass}>
                            <Clock className="w-5 h-5" /> History & Fines
                        </NavLink>
                    </>
                )}

                {isAdmin && (
                    <>
                        <div className="px-6 pt-6 pb-2 text-xs font-bold text-secondaryText/50 uppercase tracking-wider">Management</div>
                        <NavLink to="/admin/users" className={navLinkClass}>
                            <Users className="w-5 h-5" /> Borrowers
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="p-4 mt-auto border-t border-white/5">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
