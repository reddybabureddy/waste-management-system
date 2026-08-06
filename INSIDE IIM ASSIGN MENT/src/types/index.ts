export type InvestmentDecision = 'INVEST' | 'PASS';

export interface CompanyInfo {
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  description: string;
}

export interface SectionAnalysis {
  title: string;
  content: string;
  metrics?: Record<string, string | number>;
  bulletPoints: string[];
}

export interface InvestmentReport {
  company: CompanyInfo;
  decision: InvestmentDecision;
  confidenceScore: number; // 0 to 100
  executiveSummary: string;
  financialAnalysis: SectionAnalysis;
  strategicAnalysis: SectionAnalysis;
  riskAnalysis: SectionAnalysis;
  sentimentAnalysis: SectionAnalysis;
  growthDrivers: SectionAnalysis;
  recommendationReasons: string[];
}

/**
 * State representation in our LangGraph workflow.
 * Channels in the graph store these parameters as the state evolves.
 */
export interface ResearchState {
  // Input fields
  companyName: string;
  ticker?: string;

  // Intermediate agent context
  companyInfo?: CompanyInfo;
  searchResults: Array<{ query: string; results: string }>;
  financialData?: {
    ratios?: Record<string, string | number>;
    metricsSummary?: string;
  };

  // Node outputs (Analyst drafts)
  financialAnalysis?: string;
  strategicAnalysis?: string;
  riskAnalysis?: string;

  // Final Synthesis Outputs
  investmentDecision?: InvestmentDecision;
  confidenceScore?: number;
  reasons?: string[];
  executiveSummary?: string;
  
  // Traceability & status streaming
  statusHistory: string[];
  currentStep?: string;
}
