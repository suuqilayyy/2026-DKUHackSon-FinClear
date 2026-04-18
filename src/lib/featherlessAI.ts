import { supabase } from "@/integrations/supabase/client";

export interface RevisionSuggestion {
  clauseNumber: string;
  clauseName: string;
  originalText: string;
  issue: string;
  suggestedRevision: string;
  legalBasis: string;
}

export interface LegalCitation {
  id: string;
  title: string;
  citation: string;
  year: string;
  jurisdiction: string;
  sourceType: "case" | "regulation" | "enforcement";
  holding: string;
  relevance: string;
  url: string;
}

export interface LenderAgentMove {
  clauseRef: string;
  tactic: string;
  exploitNarrative: string;
  borrowerImpact: string;
  severity: "high" | "medium" | "low";
}

export interface PublicCounselCounter {
  clauseRef: string;
  challenge: string;
  supportingPrinciple: string;
  negotiationMove: string;
  sourceIds: string[];
  strength: "high" | "medium" | "low";
}

export interface ArbitrationFinding {
  clauseRef: string;
  verdict: "contest" | "rewrite" | "escalate" | "monitor";
  severity: "high" | "medium" | "low";
  finding: string;
  rationale: string;
}

export interface AgentArenaResult {
  contractSynopsis: string;
  retrievalSummary: string;
  lenderStrategySummary: string;
  publicCounselSummary: string;
  arbitrationSummary: string;
  predatoryPatternScore: number;
  lenderPlaybook: LenderAgentMove[];
  publicCounselCounters: PublicCounselCounter[];
  arbitrationFindings: ArbitrationFinding[];
  evidence: LegalCitation[];
  hallucinationGuards: string[];
}

export interface ContractResult {
  riskLevel: string;
  riskReason: string;
  transparentReasoning: string;
  clauseQuote: string;
  clauseTranslation: string;
  redFlags: string[];
  checklist: string[];
  revisionSuggestions?: RevisionSuggestion[];
  extractedText?: string;
  agentArena?: AgentArenaResult;
}

export interface AbnormalTransactionSignal {
  pattern: string;
  confidence: "high" | "medium" | "low";
  evidence: string;
  marketImpact: string;
}

export interface ChartSurveillanceResult {
  marketManipulationRisk: string;
  surveillanceSummary: string;
  abnormalTransactions: AbnormalTransactionSignal[];
  forensicClues: string[];
  recommendedActions: string[];
}

export interface ChartResult {
  summary: string;
  trend: string;
  riskIndicators: string[];
  historicalContext: string;
  disclaimer: string;
  surveillance?: ChartSurveillanceResult;
}

export interface JargonResult {
  termsFound: number;
  terms: Array<{
    term: string;
    explanation: string;
    isMarketingSpeak: boolean;
  }>;
}

export interface QuestionResult {
  questions: Array<{
    question: string;
    whyImportant: string;
  }>;
}

async function callAnalyze<T>(type: string, content: string): Promise<T> {
  const { data, error } = await supabase.functions.invoke("analyze", {
    body: { type, content },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "API call failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as T;
}

export async function analyzeContract(text: string): Promise<ContractResult> {
  return callAnalyze<ContractResult>("contract", text);
}

export async function analyzeContractImage(base64DataUrl: string): Promise<ContractResult> {
  return callAnalyze<ContractResult>("contract-image", base64DataUrl);
}

export async function analyzeChart(text: string): Promise<ChartResult> {
  return callAnalyze<ChartResult>("chart", text);
}

export async function analyzeChartImage(base64DataUrl: string): Promise<ChartResult> {
  return callAnalyze<ChartResult>("chart-image", base64DataUrl);
}

export async function scanJargon(text: string): Promise<JargonResult> {
  return callAnalyze<JargonResult>("jargon", text);
}

export async function generateQuestions(persona: string, contractType: string, context?: string): Promise<QuestionResult> {
  const content = `我是一名${persona}，正在查看一份${contractType}。${context ? `补充信息：${context}` : ""}\n请生成我应该问的问题清单。`;
  return callAnalyze<QuestionResult>("questions", content);
}
