import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Report from './pages/Report';
import Issues from './pages/Issues';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import InfoPage from './pages/InfoPage';
import Chatbot from './components/Chatbot';
import Shop from './pages/Shop';
import MockAuth from './pages/MockAuth';
import { TermsContent, PrivacyContent, ContactContent, AccessibilityContent } from './pages/LegalContent';

const App: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" replace />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/report" element={<Report />} />
                <Route path="/issues" element={<Issues />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/mock-auth" element={<MockAuth />} />
                <Route path="/contact" element={<InfoPage title="Contact Support" content={ContactContent} />} />
                <Route path="/privacy" element={<InfoPage title="Privacy Policy" content={PrivacyContent} />} />
                <Route path="/terms" element={<InfoPage title="Terms of Service" content={TermsContent} />} />
                <Route path="/accessibility" element={<InfoPage title="Accessibility" content={AccessibilityContent} />} />
            </Routes>
            <Chatbot />
        </>
    );
};

export default App;
