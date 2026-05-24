import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        let existingUsers = JSON.parse(localStorage.getItem('greenary_users') || '[]');
        
        // Migrate legacy user if needed
        if (existingUsers.length === 0) {
            const legacyUser = localStorage.getItem('greenary_user');
            if (legacyUser) {
                try {
                    const parsedLegacy = JSON.parse(legacyUser);
                    if (parsedLegacy.email) {
                        existingUsers.push(parsedLegacy);
                        localStorage.setItem('greenary_users', JSON.stringify(existingUsers));
                    }
                } catch (e) {}
            }
        }
        
        const userIndex = existingUsers.findIndex((u: any) => u.email === email);
        
        if (userIndex !== -1) {
            // Update the password in the users array
            existingUsers[userIndex].password = newPassword;
            localStorage.setItem('greenary_users', JSON.stringify(existingUsers));
            
            // If they are currently logged in with this email, update their active session too
            const activeSessionStr = localStorage.getItem('greenary_user');
            if (activeSessionStr) {
                try {
                    const activeSession = JSON.parse(activeSessionStr);
                    if (activeSession.email === email) {
                        activeSession.password = newPassword;
                        localStorage.setItem('greenary_user', JSON.stringify(activeSession));
                    }
                } catch (e) {}
            }
            
            setStatus('success');
            setMessage('Password successfully reset! Redirecting to login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }
        
        setStatus('error');
        setMessage('No account found with this email address.');
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col justify-center items-center p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-slate-100">
                <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
                    Reset password
                </h1>

                {status === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 font-medium text-center">
                        {message}
                    </div>
                )}
                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium text-center">
                        {message}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleReset}>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">
                            Email address
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setStatus('idle');
                            }}
                            className="w-full bg-white border-2 border-slate-700 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-600 transition-colors"
                            required
                            disabled={status === 'success'}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-2">
                            New Password
                        </label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setStatus('idle');
                            }}
                            className="w-full bg-white border-2 border-slate-700 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-600 transition-colors"
                            required
                            disabled={status === 'success'}
                            minLength={8}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={status === 'success'}
                        className="w-full bg-green-700 text-white font-bold rounded-lg px-4 py-3.5 hover:bg-green-800 transition-colors disabled:opacity-50"
                    >
                        Reset Password
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link 
                        to="/login" 
                        className="text-green-700 font-bold text-sm hover:text-green-800 transition-colors"
                    >
                        Back to login form
                    </Link>
                </div>

                <div className="mt-8 text-center px-4">
                    <p className="text-green-700 font-medium text-sm leading-relaxed">
                        Tired of resetting passwords? Try Greenary, it's free!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
