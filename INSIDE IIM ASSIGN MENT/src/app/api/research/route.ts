import { NextRequest } from "next/server";
import { researchGraph } from "@/lib/agent/graph";

// Force Node.js runtime for LangChain and network capabilities
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { companyName } = await req.json();

    if (!companyName || typeof companyName !== "string") {
      return new Response(JSON.stringify({ error: "Company name is required and must be a string." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    });

    const encoder = new TextEncoder();

    // Create a ReadableStream to stream Server-Sent Events (SSE)
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          console.log(`[API Route] Starting research stream for: ${companyName}`);
          
          sendEvent("status", {
            node: "start",
            message: `Initiating investment research pipeline for "${companyName}"...`,
          });

          // Run the compiled LangGraph and stream the state updates
          const graphStream = await researchGraph.stream(
            {
              companyName,
              searchResults: [],
              statusHistory: [],
            },
            {
              streamMode: "updates",
            }
          );

          for await (const update of graphStream) {
            // update has keys matching node names, e.g., { initializer: { ... } }
            const nodeName = Object.keys(update)[0];
            const nodeOutput = (update as any)[nodeName];

            let message = `Step completed: ${nodeName}`;
            
            // Map node completions to human-readable updates
            if (nodeName === "initializer") {
              message = `Resolved stock profile and identified ticker symbol: ${nodeOutput.ticker || "N/A"}`;
            } else if (nodeName === "financial_analyst") {
              message = "Financial Analyst completed audits on balance sheets, debt ratios, and income channels.";
            } else if (nodeName === "strategy_analyst") {
              message = "Strategy & Moat Analyst completed Porter's industry forces and moat strength analysis.";
            } else if (nodeName === "risk_analyst") {
              message = "Risk Analyst identified core operational regulatory risks and compiled news sentiment.";
            } else if (nodeName === "investment_committee") {
              message = "Investment Committee finalized the decision and compiled the research report.";
            }

            console.log(`[API Stream] Node: ${nodeName} completed.`);

            sendEvent("status", {
              node: nodeName,
              message,
              // We pass partial results so the frontend can display metrics/ratios early
              data: {
                ticker: nodeOutput.ticker,
                companyInfo: nodeOutput.companyInfo,
                investmentDecision: nodeOutput.investmentDecision,
                confidenceScore: nodeOutput.confidenceScore,
                reasons: nodeOutput.reasons,
                executiveSummary: nodeOutput.executiveSummary,
                // Pass report drafts if available
                financialAnalysis: nodeOutput.financialAnalysis,
                strategicAnalysis: nodeOutput.strategicAnalysis,
                riskAnalysis: nodeOutput.riskAnalysis,
                searchResults: nodeOutput.searchResults,
              },
            });
          }

          sendEvent("complete", {
            message: "Research completed successfully.",
          });
          controller.close();
        } catch (error: any) {
          console.error("[API Stream Error] Graph runner crashed:", error);
          sendEvent("error", {
            message: error?.message || "An internal error occurred during agent execution.",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, { headers });
  } catch (error: any) {
    console.error("[API Endpoint Error] Bad request parsing:", error);
    return new Response(JSON.stringify({ error: "Failed to parse request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
