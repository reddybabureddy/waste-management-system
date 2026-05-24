import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface GoogleOneTapMockProps {
    isOpen: boolean;
    onClose: () => void;
}

const GoogleOneTapMock: React.FC<GoogleOneTapMockProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const accounts = [
        {
            name: "Punith Royal",
            email: "royalpunith778@gmail.com",
            avatar: "https://ui-avatars.com/api/?name=Punith+Royal&background=f59e0b&color=fff",
        },
        {
            name: "B. Reddy Babu Reddy",
            email: "breddybabureddy@gmail.com",
            avatar: "https://ui-avatars.com/api/?name=B+R&background=9333ea&color=fff",
        }
    ];

    const handleLogin = (account: typeof accounts[0]) => {
        const mockUser = {
            name: account.name,
            email: account.email,
            password: 'oauth_placeholder_password',
            isAdmin: false
        };

        let existingUsers = JSON.parse(localStorage.getItem('greenary_users') || '[]');
        if (!existingUsers.some((u: any) => u.email === mockUser.email)) {
            existingUsers.push(mockUser);
            localStorage.setItem('greenary_users', JSON.stringify(existingUsers));
        }

        localStorage.setItem('greenary_user', JSON.stringify(mockUser));
        onClose();
        navigate('/home');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-[400px] bg-[#202124] rounded-[28px] p-6 shadow-2xl text-white font-sans overflow-hidden relative"
                    >
                        {/* Background particles/decorations */}
                        <div className="absolute top-0 left-0 right-0 h-32 flex items-center justify-center overflow-hidden pointer-events-none">
                            <div className="flex gap-1 absolute left-12 opacity-30">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                            </div>
                            <div className="flex gap-1 absolute right-12 opacity-30">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                            </div>
                        </div>

                        {/* Top Icon */}
                        <div className="flex justify-center mb-6 relative z-10">
                            <div className="w-20 h-20 bg-[#2d2e31] rounded-[24px] flex items-center justify-center shadow-lg relative rotate-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[24px]"></div>
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center -rotate-3 shadow-sm">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Titles */}
                        <div className="mb-6 relative z-10">
                            <h2 className="text-[22px] font-medium text-white mb-1">
                                Sign in to <span className="font-semibold">greenary.com</span> with <span className="font-semibold">google.com</span>
                            </h2>
                            <p className="text-[#9aa0a6] text-[15px]">Choose an account to continue</p>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-[#5f6368]/30 w-full mb-2"></div>

                        {/* Accounts List */}
                        <div className="flex flex-col mb-4">
                            {accounts.map((acc, idx) => (
                                <React.Fragment key={acc.email}>
                                    <button 
                                        onClick={() => handleLogin(acc)}
                                        className="flex items-center w-full p-3 hover:bg-[#303134] rounded-xl transition-colors text-left group"
                                    >
                                        <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium text-[15px] truncate">{acc.name}</div>
                                            <div className="text-[#9aa0a6] text-sm truncate">{acc.email}</div>
                                        </div>
                                        <div className="w-6 h-6 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </div>
                                    </button>
                                    {idx === 0 && <div className="h-[1px] bg-[#5f6368]/30 w-full my-1"></div>}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="h-[1px] bg-[#5f6368]/30 w-full mb-6"></div>

                        {/* Actions */}
                        <div className="flex justify-between items-center relative z-10">
                            <button 
                                onClick={() => handleLogin({ name: "Demo User", email: "demo.user@gmail.com", avatar: "https://ui-avatars.com/api/?name=Demo&background=10b981&color=fff" })}
                                className="px-5 py-2 rounded-full border border-[#5f6368] text-[#8ab4f8] text-sm font-medium hover:bg-[#8ab4f8]/10 transition-colors"
                            >
                                Use a different account
                            </button>
                            <button 
                                onClick={onClose}
                                className="px-5 py-2 rounded-full border border-[#5f6368] text-white text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GoogleOneTapMock;
