"use client";

import React from "react";
import { Loader2, CheckCircle2, Circle, TrendingUp, AlertTriangle } from "lucide-react";

interface Step {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "completed" | "error";
}

interface LoadingStateProps {
  steps: Step[];
  logs: string[];
}

export default function LoadingState({ steps, logs }: LoadingStateProps) {
  const activeStep = steps.find((s) => s.status === "running");

  return (
    <div className="w-full max-w-2xl mx-auto glass p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-32 h-32 glow-bg glow-blue opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 glow-bg glow-indigo opacity-50"></div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <TrendingUp className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100">AI Analyst Panel Convening</h3>
            <p className="text-sm text-gray-400">Evaluating investment factors in parallel...</p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6 mb-8">
          {steps.map((step) => {
            const isIdle = step.status === "idle";
            const isRunning = step.status === "running";
            const isCompleted = step.status === "completed";
            const isError = step.status === "error";

            return (
              <div
                key={step.id}
                className={`flex items-start space-x-4 transition-all duration-300 ${
                  isRunning ? "opacity-100 scale-[1.01]" : isIdle ? "opacity-40" : "opacity-85"
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/20" />
                  )}
                  {isRunning && (
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  )}
                  {isIdle && (
                    <Circle className="w-5 h-5 text-gray-500" />
                  )}
                  {isError && (
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isRunning
                          ? "text-indigo-400"
                          : isCompleted
                          ? "text-gray-200"
                          : isError
                          ? "text-rose-400"
                          : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                    {isRunning && (
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-mono animate-pulse">
                        Active Node
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Logs Stream console */}
        <div className="border border-gray-800/80 bg-gray-950/60 rounded-xl p-4 font-mono text-[11px] text-gray-400 h-36 overflow-y-auto shadow-inner">
          <div className="flex items-center space-x-2 border-b border-gray-900 pb-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-sans font-semibold ml-2">
              Analyst Stream Logs
            </span>
          </div>
          
          <div className="space-y-1.5 scroll-smooth">
            {logs.length === 0 ? (
              <span className="text-gray-600 italic">Waiting for agents to initiate nodes...</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-indigo-500 mr-2 shrink-0">&gt;</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
