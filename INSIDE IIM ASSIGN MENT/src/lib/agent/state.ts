import { Annotation } from "@langchain/langgraph";
import { CompanyInfo, InvestmentDecision } from "../../types";

/**
 * Define the channels (state variables) and reducers of our LangGraph workflow.
 * Reducers specify how state updates are merged (e.g. appending to history instead of replacing it).
 */
export const ResearchStateAnnotation = Annotation.Root({
  // Inputs
  companyName: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  ticker: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),

  // Intermediate metadata
  companyInfo: Annotation<CompanyInfo | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  searchResults: Annotation<Array<{ query: string; results: string }>>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  financialData: Annotation<{ ratios?: Record<string, string | number>; summary?: string } | undefined>({
    reducer: (x, y) => (y ? { ...x, ...y } : x),
  }),

  // Analyst node outputs
  financialAnalysis: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  strategicAnalysis: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  riskAnalysis: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),

  // Synthesis node outputs
  investmentDecision: Annotation<InvestmentDecision | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  confidenceScore: Annotation<number | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  reasons: Annotation<string[] | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  executiveSummary: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),

  // Streaming & logging state
  statusHistory: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  currentStep: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),
});

// Create a type from the Annotation schema for node typings
export type ResearchStateType = typeof ResearchStateAnnotation.State;
