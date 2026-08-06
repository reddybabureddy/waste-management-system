import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchStateAnnotation } from "./state";
import {
  initializerNode,
  financialAnalystNode,
  strategyAnalystNode,
  riskAnalystNode,
  investmentCommitteeNode
} from "./nodes";

/**
 * Construct the Investment Research State Graph.
 * 
 * Flow:
 * 1. START -> Initializer Node (Resolves tickers and sets up background search contexts)
 * 2. Initializer Node splits parallelly into:
 *    - Financial Analyst (Margins, revenues, balance sheet)
 *    - Strategy & Moat Analyst (Porter's dynamics, core economic moats)
 *    - Risk & Sentiment Analyst (Regulatory compliance, recent news)
 * 3. Once ALL three analysts finish their evaluation, the state converges into:
 *    - Investment Committee Node (Debates thesis, assigns confidence, outputs structured JSON)
 * 4. Investment Committee Node -> END
 */
const workflow = new StateGraph(ResearchStateAnnotation)
  .addNode("initializer", initializerNode)
  .addNode("financial_analyst", financialAnalystNode)
  .addNode("strategy_analyst", strategyAnalystNode)
  .addNode("risk_analyst", riskAnalystNode)
  .addNode("investment_committee", investmentCommitteeNode)

  // Define graph connections
  .addEdge(START, "initializer")
  
  // Parallel Fan-out (Map phase)
  .addEdge("initializer", "financial_analyst")
  .addEdge("initializer", "strategy_analyst")
  .addEdge("initializer", "risk_analyst")
  
  // Parallel Fan-in / Synthesis (Reduce phase)
  .addEdge("financial_analyst", "investment_committee")
  .addEdge("strategy_analyst", "investment_committee")
  .addEdge("risk_analyst", "investment_committee")
  
  // Terminate execution
  .addEdge("investment_committee", END);

// Compile the workflow into a runnable graph
export const researchGraph = workflow.compile();
