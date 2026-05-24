import React from 'react';
import Navbar from '../components/Navbar';

interface InfoPageProps {
    title: string;
    content: React.ReactNode;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, content }) => {
    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />
            <div className="pt-32 pb-16 px-4 sm:px-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{title}</h1>
                    <div className="text-slate-600 leading-relaxed space-y-6 text-lg">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
