"use client";

import React from "react";
import { Terminal, Shield, HelpCircle, GitMerge } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans relative">
      {/* Background neon glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] glow-bg glow-indigo opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] glow-bg glow-blue opacity-20"></div>

      {/* Header */}
      <header className="border-b border-gray-900 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-white flex items-center space-x-2">
              <span>Antigravity Research Terminal</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono lowercase tracking-normal">
                v1.0.0
              </span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              AI Multi-Agent Investment Consensus Node
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase font-mono text-gray-500 border border-gray-900 px-3 py-1.5 rounded-lg bg-gray-950/50">
            <GitMerge className="w-3.5 h-3.5 text-indigo-500" />
            <span>Workflow: LangGraph.js</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono text-gray-500 border border-gray-900 px-3 py-1.5 rounded-lg bg-gray-950/50">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Consensus Node</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950/40 py-6 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-400">Antigravity AI Product Lab</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#help" className="hover:text-gray-400 flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Assumptions & Disclaimers</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
