import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, BookOpen, ArrowUpRight, CheckCircle, DollarSign, X } from 'lucide-react';
import { adminService, ActivityLog } from '../../services/adminService';
import { formatDistanceToNow } from 'date-fns';

const TopBar: React.FC = () => {
    const { toggleSidebar } = useUI();
    const { isAdmin } = useAuth();
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Fetch notifications when admin opens bell or on mount
    useEffect(() => {
        if (!isAdmin) return;
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const data = await adminService.getActivityLogs(10);
                setLogs(data);
                setUnread(data.length);
            } catch {
                // silent fail — bell is non-critical
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
        // Poll every 60s
        const interval = setInterval(fetchLogs, 60000);
        return () => clearInterval(interval);
    }, [isAdmin]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen(prev => !prev);
        setUnread(0); // mark as read when opened
    };

    const iconFor = (action: string) => {
        if (action === 'BOOK_ISSUED') return <ArrowUpRight className="w-4 h-4" />;
        if (action === 'BOOK_RETURNED') return <CheckCircle className="w-4 h-4" />;
        return <DollarSign className="w-4 h-4" />;
    };

    const colorFor = (action: string) => {
        if (action === 'BOOK_ISSUED') return 'bg-blue-500/20 text-blue-400';
        if (action === 'BOOK_RETURNED') return 'bg-green-500/20 text-green-400';
        return 'bg-orange-500/20 text-orange-400';
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-secondaryText hover:text-primaryText hover:bg-white/5 rounded-lg transition-all flex items-center justify-center"
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

            <div className="flex items-center gap-3 relative" ref={panelRef}>
                {/* Bell button */}
                <button
                    onClick={handleOpen}
                    className="p-2 text-secondaryText hover:text-primaryText hover:bg-white/5 rounded-lg transition-all relative"
                    title="Notifications"
                >
                    <Bell className={`w-5 h-5 transition-colors ${open ? 'text-accent' : ''}`} />
                    {unread > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-surface" />
                    )}
                </button>

                {/* Dropdown panel */}
                {open && (
                    <div className="absolute top-12 right-0 w-80 md:w-96 bg-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[100]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <h3 className="text-sm font-black text-primaryText uppercase tracking-widest">Recent Activity</h3>
                            <button onClick={() => setOpen(false)} className="text-secondaryText hover:text-primaryText transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 space-y-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-white/5 animate-pulse rounded-xl flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 bg-white/5 animate-pulse rounded-full w-3/4" />
                                                <div className="h-2 bg-white/5 animate-pulse rounded-full w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : !isAdmin ? (
                                <div className="py-10 text-center text-secondaryText text-sm">
                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>No notifications</p>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="py-10 text-center text-secondaryText text-sm">
                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>No recent activity</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {logs.map(log => (
                                        <div key={log._id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                            <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${colorFor(log.action)}`}>
                                                {iconFor(log.action)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-primaryText font-semibold truncate">
                                                    {(log.metadata as any)?.bookTitle || log.action.replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-[11px] text-secondaryText truncate">{log.userEmail}</p>
                                                <p className="text-[10px] text-secondaryText/50 mt-0.5 uppercase font-bold tracking-wider">
                                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {isAdmin && logs.length > 0 && (
                            <div className="px-5 py-3 border-t border-white/5">
                                <Link
                                    to="/profile"
                                    onClick={() => setOpen(false)}
                                    className="text-xs text-accent hover:underline font-bold uppercase tracking-widest"
                                >
                                    View all logs →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default TopBar;
