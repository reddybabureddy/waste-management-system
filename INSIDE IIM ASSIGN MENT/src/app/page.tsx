"use client";

import React, { useState, useEffect } from "react";
import { Search, History, HelpCircle, ArrowRight, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingState from "@/components/LoadingState";
import InvestmentReportView from "@/components/InvestmentReport";

interface Step {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "completed" | "error";
}

const initialSteps: Step[] = [
  {
    id: "init",
    name: "Resolving Stock Symbol",
    description: "Orchestrator node identifying ticker symbol and sector details...",
    status: "idle",
  },
  {
    id: "financial",
    name: "Financial Margins & Ratios Audit",
    description: "Financial analyst fetching SEC details and generating reports...",
    status: "idle",
  },
  {
    id: "strategy",
    name: "Competitive Moats Evaluation",
    description: "Strategy analyst executing competitor and barrier assessments...",
    status: "idle",
  },
  {
    id: "risk",
    name: "Risks & Sentiment Scan",
    description: "Risk analyst reading negative news filings and public sentiment...",
    status: "idle",
  },
  {
    id: "committee",
    name: "Investment Committee Consensus",
    description: "Synthesizing individual reports and formatting final JSON report...",
    status: "idle",
  },
];

export default function Home() {
  const [companyInput, setCompanyInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history from localStorage if in client browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem("research_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        // Load the first one if history exists
        if (parsed.length > 0) {
          setReport(parsed[0]);
        }
      }
    } catch (e) {
      console.warn("Failed to load history from local storage:", e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newReport: any) => {
    setHistory((prev) => {
      // Filter out duplicate name
      const filtered = prev.filter(
        (h) => h.company.name.toLowerCase() !== newReport.company.name.toLowerCase()
      );
      const updated = [newReport, ...filtered].slice(0, 5); // Keep last 5
      try {
        localStorage.setItem("research_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to write history to local storage:", e);
      }
      return updated;
    });
  };

  const handleResearch = async (name: string) => {
    if (!name.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setLogs([]);
    
    // Set all steps to idle, first to running
    setSteps(
      initialSteps.map((s, idx) => ({
        ...s,
        status: idx === 0 ? "running" : "idle",
      }))
    );

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: name }),
      });

      if (!response.ok) {
        throw new Error(`Server returned code: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to open Server-Sent Events stream.");
      }

      const decoder = new TextDecoder();
      let partialLine = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split("\n\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          // SSE parsing
          const eventMatch = line.match(/^event:\s*(.+)$/m);
          const dataMatch = line.match(/^data:\s*(.+)$/m);

          if (dataMatch) {
            const eventType = eventMatch ? eventMatch[1] : "message";
            const data = JSON.parse(dataMatch[1]);

            if (eventType === "status") {
              // Add message to streaming log terminal
              setLogs((prev) => [...prev, data.message]);

              // Advance steps status in the stepper component
              const completedNode = data.node;
              setSteps((prevSteps) =>
                prevSteps.map((step) => {
                  // Complete the step corresponding to completed node
                  if (completedNode === "initializer" && step.id === "init") {
                    return { ...step, status: "completed" };
                  }
                  if (completedNode === "initializer" && step.id === "financial") {
                    return { ...step, status: "running" };
                  }

                  if (completedNode === "financial_analyst" && step.id === "financial") {
                    return { ...step, status: "completed" };
                  }
                  if (completedNode === "financial_analyst" && step.id === "strategy") {
                    return { ...step, status: "running" };
                  }

                  if (completedNode === "strategy_analyst" && step.id === "strategy") {
                    return { ...step, status: "completed" };
                  }
                  if (completedNode === "strategy_analyst" && step.id === "risk") {
                    return { ...step, status: "running" };
                  }

                  if (completedNode === "risk_analyst" && step.id === "risk") {
                    return { ...step, status: "completed" };
                  }
                  if (completedNode === "risk_analyst" && step.id === "committee") {
                    return { ...step, status: "running" };
                  }

                  if (completedNode === "investment_committee" && step.id === "committee") {
                    return { ...step, status: "completed" };
                  }

                  return step;
                })
              );

              // If final committee compiles, process data and create final object
              if (completedNode === "investment_committee") {
                const info = data.data;

                // Safely extract optional secondary sections from search results wrapper
                let sentimentText = "";
                let growthText = "";
                try {
                  const secondaryData = info.searchResults?.find(
                    (r: any) => r.query === "sentiment_and_growth_sections"
                  );
                  if (secondaryData) {
                    const parsed = JSON.parse(secondaryData.results);
                    sentimentText = JSON.stringify(parsed.sentimentAnalysis);
                    growthText = JSON.stringify(parsed.growthDrivers);
                  }
                } catch (e) {
                  console.warn("Secondary section extraction failed:", e);
                }

                const fullReport = {
                  company: info.companyInfo,
                  decision: info.investmentDecision,
                  confidenceScore: info.confidenceScore,
                  executiveSummary: info.executiveSummary,
                  financialAnalysis: info.financialAnalysis,
                  strategicAnalysis: info.strategicAnalysis,
                  riskAnalysis: info.riskAnalysis,
                  sentimentAnalysis: sentimentText || undefined,
                  growthDrivers: growthText || undefined,
                  reasons: info.reasons,
                };

                setReport(fullReport);
                saveToHistory(fullReport);
              }
            } else if (eventType === "error") {
              setError(data.message);
              setIsAnalyzing(false);
              setSteps((prev) =>
                prev.map((s) => (s.status === "running" ? { ...s, status: "error" } : s))
              );
            } else if (eventType === "complete") {
              setIsAnalyzing(false);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("SSE stream reader failed:", err);
      setError(err.message || "A network transport error occurred.");
      setIsAnalyzing(false);
      setSteps((prev) =>
        prev.map((s) => (s.status === "running" ? { ...s, status: "error" } : s))
      );
    }
  };

  const selectHistoryItem = (item: any) => {
    setReport(item);
    setCompanyInput("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        {/* Top Control Panel: Search Console */}
        <div className="glass p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Input & Action */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="Enter Company Name to Analyze (e.g. Apple, Tesla, Nvidia)..."
                disabled={isAnalyzing}
                className="w-full pl-12 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleResearch(companyInput);
                }}
              />
            </div>

            {/* Run Button */}
            <button
              onClick={() => handleResearch(companyInput)}
              disabled={isAnalyzing || !companyInput.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-700 disabled:border-indigo-950/30 text-white text-sm font-semibold rounded-xl border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] transition cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:cursor-not-allowed"
            >
              <span>Analyze Target</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick Selection candidates */}
          <div className="flex items-center flex-wrap gap-2.5 mt-4">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mr-1">
              Sample Targets:
            </span>
            {["Apple Inc.", "Tesla Inc.", "Microsoft Corp.", "Nvidia Corp."].map((name) => (
              <button
                key={name}
                onClick={() => {
                  setCompanyInput(name);
                  handleResearch(name);
                }}
                disabled={isAnalyzing}
                className="text-xs bg-gray-900 hover:bg-gray-800 hover:text-white text-gray-400 border border-gray-850 px-3 py-1 rounded-full cursor-pointer transition disabled:opacity-50"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: History & Pipeline overview */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* History Card */}
            <div className="glass p-5 rounded-xl border border-gray-800">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-4 flex items-center space-x-2">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Research Ledger</span>
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">
                  No previous companies analyzed. Reports will accumulate here.
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((h, idx) => {
                    const isSelected = report && report.company.name === h.company.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectHistoryItem(h)}
                        disabled={isAnalyzing}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-300"
                            : "bg-gray-900/35 border-gray-850 hover:bg-gray-900 text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        <div className="space-y-0.5 truncate mr-2">
                          <div className="font-semibold truncate">{h.company.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{h.company.ticker}</div>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded shrink-0 ${
                          h.decision === "INVEST" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {h.decision}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Architecture Card */}
            <div className="glass p-5 rounded-xl border border-gray-800 space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Agent Architecture</span>
              </h3>
              <div className="text-[11px] text-gray-400 space-y-3 leading-relaxed">
                <p>
                  This terminal delegates research to a **Multi-Agent Map-Reduce Graph** using LangGraph.js:
                </p>
                <ul className="space-y-2 pl-2 border-l border-gray-800">
                  <li>
                    <strong className="text-gray-300">Financial Analyst:</strong> Checks revenues, balance sheets, and key ratios.
                  </li>
                  <li>
                    <strong className="text-gray-300">Strategy Analyst:</strong> Checks moat size and competitor dynamics.
                  </li>
                  <li>
                    <strong className="text-gray-300">Risk Analyst:</strong> Checks lawsuits, regulators, and sentiment indices.
                  </li>
                  <li>
                    <strong className="text-gray-300">Investment Committee:</strong> Debates reports and synthesizes final reports.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Streaming Status Loader OR Compiled Report Output */}
          <div className="xl:col-span-3">
            {isAnalyzing && (
              <div className="py-8">
                <LoadingState steps={steps} logs={logs} />
              </div>
            )}

            {!isAnalyzing && error && (
              <div className="glass p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-300 flex items-start space-x-4 max-w-2xl mx-auto my-8">
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-200">Terminal Pipeline Error</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {!isAnalyzing && !error && report && (
              <InvestmentReportView report={report} />
            )}

            {!isAnalyzing && !error && !report && (
              <div className="glass p-12 rounded-2xl border border-gray-800 text-center max-w-2xl mx-auto my-8 relative overflow-hidden flex flex-col items-center justify-center space-y-6">
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 glow-bg glow-indigo opacity-30"></div>
                
                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 relative z-10 animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                
                <div className="space-y-2 relative z-10 max-w-md">
                  <h3 className="text-lg font-bold text-gray-100">Ready to Initiate Audits</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Provide a company name above or click one of our preset sample targets. The terminal will spin up a multi-agent consensus graph to evaluate financial health, moats, and vulnerabilities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
