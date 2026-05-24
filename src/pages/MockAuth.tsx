import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const MockAuth: React.FC = () => {
    const [searchParams] = useSearchParams();
    const provider = searchParams.get('provider') || 'google';

    const handleSimulatedLogin = () => {
        if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_SUCCESS', provider }, window.location.origin);
            window.close();
        } else {
            // Fallback if opened directly
            window.location.href = '/home';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans text-slate-900">
            <div className="w-full max-w-md border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                    {provider === 'google' ? (
                        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    ) : (
                        <svg className="w-12 h-12 fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.39h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 3.39h-2.33v6.489C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                    )}
                </div>
                <h1 className="text-2xl font-bold mb-2 tracking-tight">Sign in with {provider === 'google' ? 'Google' : 'Facebook'}</h1>
                <p className="text-slate-500 mb-8 text-sm">Choose an account to continue to Greenary</p>
                
                <button 
                    onClick={handleSimulatedLogin}
                    className="w-full flex items-center p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all hover:shadow-md mb-4 active:scale-[0.98]"
                >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl mr-4">
                        D
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-semibold text-slate-900">Demo User</div>
                        <div className="text-sm text-slate-500">demo.user@{provider}.com</div>
                    </div>
                </button>

                <div className="text-xs text-slate-400 mt-8 border-t border-slate-100 pt-6">
                    <p>To continue, {provider === 'google' ? 'Google' : 'Facebook'} will share your name, email address, and profile picture with Greenary.</p>
                </div>
            </div>
        </div>
    );
};

export default MockAuth;
