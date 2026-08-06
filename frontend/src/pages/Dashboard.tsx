import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FileText, Clock, CheckCircle2, PlusCircle, AlertCircle, Star, Gift, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportData {
    id: string;
    title: string;
    category: string;
    description: string;
    location: string;
    status: string;
    date: string;
    imageUrl?: string;
    rating?: number;
}

const Dashboard: React.FC = () => {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [userPoints, setUserPoints] = useState(0);

    const loadUser = () => {
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

    useEffect(() => {
        loadUser();
        window.addEventListener('userUpdated', loadUser);
        return () => window.removeEventListener('userUpdated', loadUser);
    }, []);

    const fetchReports = async () => {
        let localReports = [];
        try {
            localReports = JSON.parse(localStorage.getItem('greenary_reports') || '[]');
        } catch (e) { }

        try {
            const response = await fetch('/api/reports');
            if (response.ok) {
                const data = await response.json();

                // Merge backend data with local data, prioritizing backend for conflicts
                const mergedMap = new Map();
                localReports.forEach((r: any) => mergedMap.set(r.id, r));
                data.forEach((r: any) => mergedMap.set(r.id, r));

                const mergedReports = Array.from(mergedMap.values());
                // Sort by date descending
                mergedReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setReports(mergedReports);
            } else {
                setReports(localReports);
            }
        } catch (error) {
            console.log("Backend not available, loading reports from localStorage.");
            setReports(localReports);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status.toLowerCase() === 'pending').length;
    const resolvedReports = reports.filter(r => r.status.toLowerCase() === 'resolved').length;

    // Helper to color code statuses
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const updatedReports = reports.map(r => r.id === id ? { ...r, status: newStatus } : r);
        setReports(updatedReports);

        try {
            const localReports = JSON.parse(localStorage.getItem('greenary_reports') || '[]');
            const updatedLocal = localReports.map((r: any) => r.id === id ? { ...r, status: newStatus } : r);
            localStorage.setItem('greenary_reports', JSON.stringify(updatedLocal));
        } catch (e) { }

        try {
            await fetch(`/api/reports/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            window.dispatchEvent(new Event('reportAdded'));
        } catch (error) {
            console.log("Backend not available, updated status in localStorage.");
            window.dispatchEvent(new Event('reportAdded'));
        }
    };

    const handleRatingChange = async (id: string, newRating: number) => {
        const updatedReports = reports.map(r => r.id === id ? { ...r, rating: newRating } : r);
        setReports(updatedReports);

        try {
            const localReports = JSON.parse(localStorage.getItem('greenary_reports') || '[]');
            const updatedLocal = localReports.map((r: any) => r.id === id ? { ...r, rating: newRating } : r);
            localStorage.setItem('greenary_reports', JSON.stringify(updatedLocal));
        } catch (e) { }

        try {
            await fetch(`/api/reports/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: newRating })
            });
        } catch (error) {
            console.log("Backend not available, updated rating in localStorage.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />

            <div className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Your Dashboard</h1>
                        <p className="text-slate-500 mt-1">Track your impact and active waste management requests.</p>
                    </div>
                    <Link
                        to="/report"
                        className="inline-flex items-center gap-2 bg-green-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition-colors shadow-sm"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Report New Issue
                    </Link>
                </div>

                {/* Rewards Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-900 to-green-800 rounded-3xl p-8 shadow-lg mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
                        <Gift className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
                                Greenary Eco-Shop
                            </h2>
                            <p className="text-green-100 mb-2 max-w-lg">
                                You currently have <strong className="text-amber-300 text-lg">{userPoints} points</strong>. Earn more points by reporting waste issues and redeem them for natural, eco-friendly products!
                            </p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto">
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 font-bold py-4 px-8 rounded-2xl hover:bg-amber-300 transition-all hover:scale-105 shadow-lg"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Browse Rewards
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <FileText className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Total Reports</p>
                            <p className="text-3xl font-extrabold text-slate-900">{totalReports}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Clock className="w-7 h-7 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Pending Action</p>
                            <p className="text-3xl font-extrabold text-slate-900">{pendingReports}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Resolved</p>
                            <p className="text-3xl font-extrabold text-slate-900">{resolvedReports}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Reports List */}
                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reports</h2>

                {reports.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No reports yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            You haven't submitted any waste management issues yet. When you do, they will appear here so you can track their status.
                        </p>
                        <Link
                            to="/report"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Submit your first report
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Submitted</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-900">{report.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{report.description}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                                    {report.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-medium text-slate-600 truncate max-w-[200px]" title={report.location}>
                                                    {report.location}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-medium text-slate-600">
                                                    {new Date(report.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="relative inline-block" title="Click to update status">
                                                    <select
                                                        value={report.status}
                                                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                                        className={`inline-flex items-center pl-3 pr-7 py-1 rounded-full text-xs font-bold border cursor-pointer focus:outline-none appearance-none transition-colors ${getStatusColor(report.status)}`}
                                                    >
                                                        <option value="Pending" className="bg-white text-amber-700 font-bold">Pending</option>
                                                        <option value="In Progress" className="bg-white text-blue-700 font-bold">In Progress</option>
                                                        <option value="Resolved" className="bg-white text-emerald-700 font-bold">Resolved</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <svg className={`h-3 w-3 ${report.status.toLowerCase() === 'pending' ? 'text-amber-700' : report.status.toLowerCase() === 'resolved' ? 'text-emerald-700' : report.status.toLowerCase() === 'in progress' ? 'text-blue-700' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {report.status.toLowerCase() === 'resolved' ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => handleRatingChange(report.id, star)}
                                                                className="focus:outline-none transition-transform hover:scale-110"
                                                                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                            >
                                                                <Star
                                                                    className={`w-5 h-5 ${(report.rating || 0) >= star
                                                                            ? 'fill-amber-400 text-amber-400'
                                                                            : 'text-slate-300 hover:text-amber-200'
                                                                        }`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1 opacity-40 cursor-not-allowed" title="Resolution pending">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={star} className="w-5 h-5 text-slate-300" />
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
