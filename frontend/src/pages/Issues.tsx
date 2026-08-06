import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, MapPin, Clock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportData {
    id: string;
    title: string;
    category: string;
    description: string;
    location: string;
    status: string;
    date: string;
    imageUrl?: string;
}

const Issues: React.FC = () => {
    const locationState = useLocation().state as { filter?: string } | null;
    const [reports, setReports] = useState<ReportData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(locationState?.filter || 'All');
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

    const fetchReports = async () => {
        const localReports = JSON.parse(localStorage.getItem('greenary_reports') || '[]');
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
            console.error("Error fetching reports from API, loading from local storage", error);
            setReports(localReports);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              report.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || report.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock className="w-4 h-4 text-amber-600" />;
            case 'in progress': return <AlertCircle className="w-4 h-4 text-blue-600" />;
            case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            default: return <AlertCircle className="w-4 h-4 text-slate-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />
            
            <div className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Community Issues</h1>
                        <p className="text-slate-500 mt-2 text-lg">Browse and track all waste management requests in your area.</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search issues, locations..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-colors"
                        />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        {['All', 'Pending', 'In Progress', 'Resolved'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                                    statusFilter === status 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-[#F8F9FA] text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid of Issues */}
                {filteredReports.length === 0 ? (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No issues found</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            We couldn't find any issues matching your search criteria. Try adjusting your filters.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredReports.map((report, index) => (
                                <motion.div 
                                    key={report.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    onClick={() => setSelectedReport(report)}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(report.status)}`}>
                                            {getStatusIcon(report.status)}
                                            {report.status}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                            {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(report.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    {report.imageUrl && (
                                        <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                            <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-1">{report.title}</h3>
                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold mb-4 w-fit capitalize">
                                        {report.category}
                                    </span>
                                    
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow">
                                        {report.description}
                                    </p>
                                    
                                    <div className="pt-4 border-t border-slate-100 mt-auto">
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-start gap-2 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors group/location cursor-pointer"
                                            title="Open in Google Maps"
                                        >
                                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0 group-hover/location:text-blue-600 transition-colors" />
                                            <p className="text-sm font-medium text-slate-600 line-clamp-2 group-hover/location:text-blue-700 transition-colors">
                                                {report.location}
                                            </p>
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modal for viewing report details */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setSelectedReport(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
                        >
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            {selectedReport.imageUrl && (
                                <div className="w-full bg-slate-100 border-b border-slate-100">
                                    <img src={selectedReport.imageUrl} alt={selectedReport.title} className="w-full max-h-[50vh] object-contain" />
                                </div>
                            )}

                            <div className="p-8">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusColor(selectedReport.status)}`}>
                                        {getStatusIcon(selectedReport.status)}
                                        {selectedReport.status}
                                    </span>
                                    <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold capitalize">
                                        {selectedReport.category}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        {new Date(selectedReport.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(selectedReport.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                </div>
                                
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{selectedReport.title}</h2>
                                <p className="text-lg text-slate-600 leading-relaxed mb-8">{selectedReport.description}</p>
                                
                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 mb-1">Reported Location</h4>
                                            <p className="text-slate-600 font-medium">{selectedReport.location}</p>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedReport.location)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                Open in Google Maps &rarr;
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Issues;
