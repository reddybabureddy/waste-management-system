import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
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

        const validUser = existingUsers.find((u: any) => u.email === email && u.password === password);
        
        if (validUser) {
            const userSession = { ...validUser, isAdmin: validUser.email.toLowerCase().includes('admin') };
            localStorage.setItem('greenary_user', JSON.stringify(userSession));
            navigate('/home');
        } else {
            setError('Incorrect email or wrong password. Please try again.');
        }
    };

    const handleOAuth = (provider: 'google' | 'facebook', e: React.MouseEvent) => {
        e.preventDefault();
        
        // Mock OAuth login
        const mockUser = {
            name: `${provider === 'google' ? 'Google' : 'Facebook'} User`,
            email: `demo.user@${provider}.com`,
            password: 'oauth_placeholder_password',
            isAdmin: false
        };

        let existingUsers = JSON.parse(localStorage.getItem('greenary_users') || '[]');
        if (!existingUsers.some((u: any) => u.email === mockUser.email)) {
            existingUsers.push(mockUser);
            localStorage.setItem('greenary_users', JSON.stringify(existingUsers));
        }

        localStorage.setItem('greenary_user', JSON.stringify(mockUser));
        navigate('/home');
    };
    
    return (
        <div className="min-h-screen flex text-slate-900 bg-white">
            {/* Left Panel - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-green-950 items-center justify-center">
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/login-bg.png')` }}
                />
                <div className="absolute inset-0 bg-green-950/60 backdrop-blur-[2px] z-10" />
                
                <div className="relative z-20 p-16 flex flex-col h-full justify-center w-full max-w-2xl">
                    <div className="mt-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                                <Leaf className="w-12 h-12 text-green-300 mb-6" />
                                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome back to Greenary.</h2>
                                <p className="text-green-50 text-lg leading-relaxed">
                                    Smart waste management starts with small responsible actions for a cleaner and greener future.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#F8F9FA]">
                <div className="w-full max-w-md relative">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Log in</h1>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium text-center">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow shadow-sm"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700">Password</label>
                                    <Link to="/forgot-password" className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">Forgot password?</Link>
                                </div>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-green-900 text-white font-semibold rounded-xl px-4 py-4 hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Log in
                            </button>
                        </form>

                        <div className="mt-10 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#F8F9FA] text-slate-400 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button type="button" onClick={(e) => handleOAuth('google', e)} className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                            <button type="button" onClick={(e) => handleOAuth('facebook', e)} className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.39h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 3.39h-2.33v6.489C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        <p className="text-slate-500 mt-8 text-center text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
