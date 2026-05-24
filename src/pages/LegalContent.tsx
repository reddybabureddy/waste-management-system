import React from 'react';

export const TermsContent = (
    <div className="space-y-6">
        <p><strong>Last Updated: May 2026</strong></p>
        <p>Welcome to Greenary. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.</p>
        
        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h3>
        <p>By creating an account and using the Greenary application, you agree to comply with and be bound by these terms. If you do not agree, please do not use our services.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. User Responsibilities</h3>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Accurate Reporting:</strong> You agree to submit truthful and accurate reports regarding waste and environmental issues. Submitting false reports or spam may result in account suspension.</li>
            <li><strong>Lawful Use:</strong> You must use the platform in compliance with all applicable local, state, and national laws.</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Green Points and Rewards</h3>
        <p>Greenary issues "Green Points" for verified community contributions. These points:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Have no actual cash value and cannot be exchanged for real currency.</li>
            <li>Can only be redeemed within the Greenary Eco-Shop.</li>
            <li>May be revoked if earned through fraudulent reporting.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Limitation of Liability</h3>
        <p>Greenary is provided "as is" without warranties of any kind. We are a platform connecting citizens with municipal services and do not guarantee the immediate resolution of any reported issue. We are not liable for any damages arising from your use of the application.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Termination</h3>
        <p>We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.</p>
    </div>
);

export const PrivacyContent = (
    <div className="space-y-6">
        <p><strong>Last Updated: May 2026</strong></p>
        <p>Your privacy is important to us. This Privacy Policy explains how Greenary collects, uses, and protects your personal information.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h3>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Data:</strong> Name, email address, and profile information.</li>
            <li><strong>Location Data:</strong> GPS coordinates and location details when you submit a waste report, essential for municipal authorities to locate the issue.</li>
            <li><strong>Media:</strong> Photos and descriptions of waste issues you upload.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Data</h3>
        <p>We use the collected information to:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li>Route reports to the correct municipal authorities for resolution.</li>
            <li>Award Green Points to your account.</li>
            <li>Improve our AI chatbot and platform services.</li>
            <li>Send you updates about your reported issues.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Sharing</h3>
        <p>We do <strong>not</strong> sell your personal data to third-party advertisers. We only share specific report data (location, photos, description) with verified municipal and environmental authorities to facilitate cleanup efforts. Your personal identity remains anonymous to the public.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Security</h3>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
    </div>
);

export const ContactContent = (
    <div className="space-y-6">
        <p>We are here to help! If you have any questions, feedback, or need assistance with the Greenary platform, please reach out to us through any of the channels below.</p>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mt-8">
            <h3 className="text-xl font-bold text-green-900 mb-4">Customer Support</h3>
            <div className="space-y-4 text-green-800">
                <p><strong>Email:</strong> support@greenary.local</p>
                <p><strong>Phone:</strong> 1-800-GREEN-01 (1-800-473-3601)</p>
                <p><strong>Hours:</strong> Monday – Friday, 9:00 AM to 6:00 PM (EST)</p>
            </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Corporate Office</h3>
        <p>
            Greenary HQ<br />
            123 Eco-Innovation Drive<br />
            Sustainability Park, Tech City 400012
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Partnerships & Municipal Inquiries</h3>
        <p>If you represent a municipality or waste management organization and wish to integrate with our platform, please email us directly at <strong>partners@greenary.local</strong>.</p>
    </div>
);

export const AccessibilityContent = (
    <div className="space-y-6">
        <p>Greenary is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to make our platform as inclusive as possible.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Conformance Status</h3>
        <p>We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Accessibility Features</h3>
        <ul className="list-disc pl-6 space-y-2">
            <li>High-contrast color schemes for visual clarity.</li>
            <li>Keyboard-navigable reporting flows.</li>
            <li>ARIA labels and roles for screen reader compatibility.</li>
            <li>Alternative text for all user-uploaded images and system icons.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Feedback</h3>
        <p>We welcome your feedback on the accessibility of Greenary. If you encounter any accessibility barriers while using our application, please let us know immediately so we can address the issue.</p>
        <p>Contact us at: <strong>accessibility@greenary.local</strong></p>
    </div>
);
