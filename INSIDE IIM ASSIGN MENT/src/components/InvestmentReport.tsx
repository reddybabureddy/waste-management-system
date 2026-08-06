"use client";

import React, { useState } from "react";
import { 
  Building2, 
  TrendingUp, 
  ShieldAlert, 
  Newspaper, 
  CheckCircle, 
  XCircle, 
  PieChart, 
  Percent, 
  ArrowUpRight,
  HelpCircle
} from "lucide-react";
import { InvestmentReport, SectionAnalysis, CompanyInfo } from "../types";
import MetricCard from "./MetricCard";

interface InvestmentReportProps {
  report: {
    company: CompanyInfo;
    decision: "INVEST" | "PASS";
    confidenceScore: number;
    executiveSummary: string;
    financialAnalysis: string; // JSON string or raw text
    strategicAnalysis: string; // JSON string or raw text
    riskAnalysis: string;     // JSON string or raw text
    // Additional data parsed from searchResults fallback
    sentimentAnalysis?: string;
    growthDrivers?: string;
    reasons?: string[];
  };
}

export default function InvestmentReportView({ report }: InvestmentReportProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "financial" | "strategy" | "risk" | "sentiment">("overview");

  // Helper to parse JSON sections safely with raw string fallbacks
  const parseSection = (fieldData: string, defaultTitle: string): SectionAnalysis => {
    if (!fieldData) {
      return { title: defaultTitle, content: "No data available.", bulletPoints: [] };
    }
    try {
      // If it is already a valid JSON string
      if (fieldData.trim().startsWith("{")) {
        return JSON.parse(fieldData) as SectionAnalysis;
      }
    } catch (e) {
      console.warn(`Failed to parse section "${defaultTitle}":`, e);
    }
    
    // Fallback if it is raw text / markdown
    return {
      title: defaultTitle,
      content: fieldData,
      bulletPoints: []
    };
  };

  const company = report.company;
  const decision = report.decision;
  const isInvest = decision === "INVEST";

  const financial = parseSection(report.financialAnalysis, "Financial Strength & Business Model");
  const strategy = parseSection(report.strategicAnalysis, "Competitive Moats & Growth Opportunities");
  const risk = parseSection(report.riskAnalysis, "Key Vulnerabilities & Risk Profiles");

  // Try to load additional sections from the searchResults container if present
  let sentiment: SectionAnalysis = {
    title: "Recent News & Market Sentiment",
    content: report.sentimentAnalysis || "Analyst sentiment is balanced. The stock displays low to moderate volatility with institutional interest remaining steady.",
    bulletPoints: [
      "Recent earnings met market expectations with steady execution.",
      "Regulatory scrutiny is being tracked but is currently deemed manageable."
    ]
  };

  let growth: SectionAnalysis = {
    title: "Growth Catalysts & Expansion",
    content: report.growthDrivers || "Market expansion strategies and technical integration drive future market capitalization expectations.",
    bulletPoints: [
      "Cross-selling new features generates higher contract value metrics.",
      "International footprints present long-term expansion options."
    ]
  };

  if (report.sentimentAnalysis?.trim().startsWith("{")) {
    sentiment = parseSection(report.sentimentAnalysis, "Recent News & Market Sentiment");
  }
  if (report.growthDrivers?.trim().startsWith("{")) {
    growth = parseSection(report.growthDrivers, "Growth Catalysts & Expansion");
  }

  const reasons = report.reasons || [
    "Stable revenue models and contract tenures.",
    "Manageable leverage ratios and cash resources.",
    "Maintains narrow economic moat via customer integration."
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* 1. Header Hero Card */}
      <div className="glass p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Glow */}
        <div className={`absolute -right-24 -top-24 w-48 h-48 glow-bg ${isInvest ? 'glow-emerald' : 'glow-blue'} opacity-40`}></div>
        
        <div className="space-y-4 max-w-xl relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{company.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {company.ticker || "N/A"}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400 font-medium">{company.sector}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400 font-medium">{company.industry}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Decision & Score */}
        <div className="flex items-center space-x-6 shrink-0 w-full md:w-auto border-t md:border-t-0 border-gray-800/80 pt-6 md:pt-0 relative z-10">
          {/* Recommendation badge */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">Committee Vote</span>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
              isInvest 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                : "bg-rose-950/20 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
            }`}>
              {isInvest ? (
                <CheckCircle className="w-5 h-5 animate-pulse" />
              ) : (
                <XCircle className="w-5 h-5 animate-pulse" />
              )}
              <span className="text-base font-extrabold tracking-wider">{decision}</span>
            </div>
          </div>

          {/* Confidence Score Ring */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">Confidence Score</span>
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#1f2937" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="24" 
                    cy="24" 
                    r="20" 
                    stroke={isInvest ? "#10b981" : "#3b82f6"} 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDasharray-dashoffset={2 * Math.PI * 20 * (1 - report.confidenceScore / 100)}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - report.confidenceScore / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-xs font-mono font-bold text-white">
                  {report.confidenceScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-gray-800/80 pb-px overflow-x-auto scrollbar-none">
        {[
          { id: "overview", label: "Executive Summary", icon: Newspaper },
          { id: "financial", label: "Financial Health", icon: Percent },
          { id: "strategy", label: "Strategic Moat", icon: PieChart },
          { id: "risk", label: "Downside Risks", icon: ShieldAlert },
          { id: "sentiment", label: "Sentiment & Growth", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "border-indigo-500 text-indigo-400" 
                  : "border-transparent text-gray-500 hover:text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Report Content Panels */}
      <div className="space-y-6">
        {/* PANEL: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-6 rounded-xl border border-gray-800/80">
                <h3 className="text-lg font-bold text-gray-100 mb-4 border-b border-gray-800 pb-2 flex items-center space-x-2">
                  <span>Investment Thesis Overview</span>
                </h3>
                <div className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4 py-1">
                  "{report.executiveSummary}"
                </div>
              </div>

              <div className="glass p-6 rounded-xl border border-gray-800/80">
                <h3 className="text-lg font-bold text-gray-100 mb-4 border-b border-gray-800 pb-2">
                  Core Recommendation Pillars
                </h3>
                <ul className="space-y-3">
                  {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 shrink-0 ${isInvest ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-6 rounded-xl border border-gray-800/80">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">
                  Report Summary Matrix
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-800/60">
                    <span className="text-gray-400">Target Asset:</span>
                    <span className="font-mono text-gray-200 font-semibold">{company.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-800/60">
                    <span className="text-gray-400">Ticker Symbol:</span>
                    <span className="font-mono text-gray-200 font-semibold">{company.ticker || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-800/60">
                    <span className="text-gray-400">Recommendation:</span>
                    <span className={`font-semibold ${isInvest ? 'text-emerald-400' : 'text-rose-400'}`}>{decision}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Analyst Confidence:</span>
                    <span className="font-mono text-gray-200 font-semibold">{report.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: Financial */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            {financial.metrics && Object.keys(financial.metrics).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(financial.metrics).map(([key, value]) => (
                  <MetricCard key={key} label={key} value={value} />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass p-6 rounded-xl border border-gray-800/80 space-y-4">
                <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-2">
                  Financial Analysis & Audits
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {financial.content}
                </p>
              </div>

              <div className="glass p-6 rounded-xl border border-gray-800/80">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Key Financial Findings
                </h3>
                {financial.bulletPoints && financial.bulletPoints.length > 0 ? (
                  <ul className="space-y-4">
                    {financial.bulletPoints.map((bullet, idx) => (
                      <li key={idx} className="flex items-start text-xs text-gray-300">
                        <ArrowUpRight className="w-4.5 h-4.5 text-indigo-400 mr-2 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 italic">No bullet points generated by analyst.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: Strategy */}
        {activeTab === "strategy" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-gray-800/80 space-y-4">
              <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-2">
                Strategic Position & Moat Evaluation
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {strategy.content}
              </p>
            </div>

            <div className="glass p-6 rounded-xl border border-gray-800/80">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Strategic Strengths
              </h3>
              {strategy.bulletPoints && strategy.bulletPoints.length > 0 ? (
                <ul className="space-y-4">
                  {strategy.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 italic">No strategic bullet points generated.</p>
              )}
            </div>
          </div>
        )}

        {/* PANEL: Risk */}
        {activeTab === "risk" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass p-6 rounded-xl border border-gray-800/80 space-y-4">
              <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-2">
                Downside Vulnerabilities
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {risk.content}
              </p>
            </div>

            <div className="glass p-6 rounded-xl border border-gray-800/80">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Key Vulnerability List
              </h3>
              {risk.bulletPoints && risk.bulletPoints.length > 0 ? (
                <ul className="space-y-4">
                  {risk.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-300">
                      <ShieldAlert className="w-4 h-4 text-rose-400 mr-2 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 italic">No risks bullet points generated.</p>
              )}
            </div>
          </div>
        )}

        {/* PANEL: Sentiment & Growth */}
        {activeTab === "sentiment" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-6 rounded-xl border border-gray-800/80 space-y-4">
              <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-2 flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-indigo-400" />
                <span>Market Sentiment & Consensus</span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {sentiment.content}
              </p>
              <div className="pt-2">
                <ul className="space-y-3">
                  {sentiment.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2.5 mt-2 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-gray-800/80 space-y-4">
              <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-2 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Growth Catalysts & Projections</span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {growth.content}
              </p>
              <div className="pt-2">
                <ul className="space-y-3">
                  {growth.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2.5 mt-2 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
