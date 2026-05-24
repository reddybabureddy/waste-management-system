import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportData {
    id: string;
    title: string;
    category: string;
    description: string;
    location: string;
    status: string;
    date: string;
}

const Navbar: React.FC = () => {
    const location = useLocation();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [userPoints, setUserPoints] = useState(0);
    const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number>(() => {
        const stored = localStorage.getItem('greenary_last_seen');
        return stored ? parseInt(stored, 10) : 0;
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/reports');
                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                }
            } catch (error) {
                console.error("Error fetching reports from API", error);
            }
            
            const storedLastSeen = localStorage.getItem('greenary_last_seen');
            if (storedLastSeen) {
                setLastSeenTimestamp(parseInt(storedLastSeen, 10));
            }
        };

        const updatePoints = () => {
            const storedUser = localStorage.getItem('greenary_user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setUserPoints(user.points || 0);
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }
        };

        fetchReports();
        updatePoints();
        
        window.addEventListener('reportAdded', fetchReports);
        window.addEventListener('userUpdated', updatePoints);

        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('reportAdded', fetchReports);
            window.removeEventListener('userUpdated', updatePoints);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = () => {
        if (!isNotificationOpen) {
            const now = Date.now();
            setLastSeenTimestamp(now);
            localStorage.setItem('greenary_last_seen', now.toString());
        }
        setIsNotificationOpen(!isNotificationOpen);
    };

    const recentReports = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    const unreadCount = reports.filter(r => new Date(r.date).getTime() > lastSeenTimestamp).length;

    const isActive = (path: string) => {
        if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-white z-50 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center gap-2">
                <Link to="/home" className="font-bold text-xl tracking-tight text-slate-900 hover:text-green-800 transition-colors">
                    Greenary
                </Link>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center space-x-12 px-8">
                <Link 
                    to="/home" 
                    className={`text-sm font-semibold transition-colors pb-1 ${isActive('/home') ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'}`}
                >
                    Home
                </Link>
                <Link 
                    to="/report" 
                    className={`text-sm font-semibold transition-colors pb-1 ${isActive('/report') ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'}`}
                >
                    Report Issue
                </Link>
                <Link 
                    to="/dashboard" 
                    className={`text-sm font-semibold transition-colors pb-1 ${isActive('/dashboard') ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'}`}
                >
                    Dashboard
                </Link>
                <Link 
                    to="/shop" 
                    className={`text-sm font-semibold transition-colors pb-1 ${isActive('/shop') ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'}`}
                >
                    Shop
                </Link>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 cursor-default shadow-sm" title="Your reward points">
                    <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="font-bold text-amber-700 text-sm">{userPoints} pts</span>
                </div>

                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={handleNotificationClick}
                        className="relative p-2 text-slate-600 hover:text-green-800 transition-colors rounded-full hover:bg-slate-50 focus:outline-none"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white box-content"></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isNotificationOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {recentReports.length > 0 ? (
                                        <div className="divide-y divide-slate-50">
                                            {recentReports.map(report => (
                                                <Link 
                                                    key={report.id} 
                                                    to="/dashboard" 
                                                    onClick={() => setIsNotificationOpen(false)}
                                                    className="p-4 flex gap-3 hover:bg-slate-50 transition-colors block"
                                                >
                                                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${report.status.toLowerCase() === 'pending' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                                                        {report.status.toLowerCase() === 'pending' ? (
                                                            <Clock className="w-4 h-4 text-amber-600" />
                                                        ) : (
                                                            <AlertCircle className="w-4 h-4 text-emerald-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{report.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{report.description}</p>
                                                        <p className="text-[10px] text-slate-400 mt-2">
                                                            {new Date(report.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 text-sm">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                                    <Link 
                                        to="/dashboard" 
                                        onClick={() => setIsNotificationOpen(false)}
                                        className="text-xs font-bold text-green-700 hover:text-green-800"
                                    >
                                        View All Reports
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="w-px h-6 bg-slate-200"></div>
                
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                    Log out
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
