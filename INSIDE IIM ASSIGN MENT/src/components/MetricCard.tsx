"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="glass p-5 rounded-xl border border-gray-800/80 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all duration-300 group flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
          {label}
        </span>
        <div className="text-xl font-bold text-gray-100 font-sans tracking-tight group-hover:text-white transition-colors">
          {value}
        </div>
      </div>
      {icon && (
        <div className="p-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/20 group-hover:border-indigo-950/50 transition-all duration-300">
          {icon}
        </div>
      )}
    </div>
  );
}
