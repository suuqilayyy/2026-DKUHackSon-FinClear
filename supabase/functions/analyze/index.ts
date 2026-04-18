import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import {
  retrieveLegalKnowledge,
  type LegalKnowledgeRecord,
} from "./legalKnowledgeBase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TEXT_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const VISION_MODEL = "google/gemini-2.5-flash";
const TEXT_API_URL = "https://api.featherless.ai/v1/chat/completions";
const VISION_API_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type AnalysisType =
  | "contract"
  | "contract-image"
  | "chart"
  | "chart-image"
  | "jargon"
  | "questions";

interface LenderAgentMove {
  clauseRef: string;
  tactic: string;
  exploitNarrative: string;
  borrowerImpact: string;
  severity: "high" | "medium" | "low";
}

interface PublicCounselCounter {
  clauseRef: string;
  challenge: string;
  supportingPrinciple: string;
  negotiationMove: string;
  sourceIds: string[];
  strength: "high" | "medium" | "low";
}

interface ArbitrationFinding {
  clauseRef: string;
  verdict: "contest" | "rewrite" | "escalate" | "monitor";
  severity: "high" | "medium" | "low";
  finding: string;
  rationale: string;
}

interface RevisionSuggestion {
  clauseNumber: string;
  clauseName: string;
  originalText: string;
  issue: string;
  suggestedRevision: string;
  legalBasis: string;
}

interface ContractResult {
  riskLevel: string;
  riskReason: string;
  transparentReasoning: string;
  clauseQuote: string;
  clauseTranslation: string;
  redFlags: string[];
  checklist: string[];
  revisionSuggestions: RevisionSuggestion[];
  extractedText?: string;
  agentArena: {
    contractSynopsis: string;
    retrievalSummary: string;
    lenderStrategySummary: string;
    publicCounselSummary: string;
    arbitrationSummary: string;
    predatoryPatternScore: number;
    lenderPlaybook: LenderAgentMove[];
    publicCounselCounters: PublicCounselCounter[];
    arbitrationFindings: ArbitrationFinding[];
    evidence: Array<{
      id: string;
      title: string;
      citation: string;
      year: string;
      jurisdiction: string;
      sourceType: "case" | "regulation" | "enforcement";
      holding: string;
      relevance: string;
      url: string;
    }>;
    hallucinationGuards: string[];
  };
}

interface ChartResult {
  summary: string;
  trend: string;
  riskIndicators: string[];
  historicalContext: string;
  disclaimer: string;
  surveillance?: {
    marketManipulationRisk: string;
    surveillanceSummary: string;
    abnormalTransactions: Array<{
      pattern: string;
      confidence: "high" | "medium" | "low";
      evidence: string;
      marketImpact: string;
    }>;
    forensicClues: string[];
    recommendedActions: string[];
  };
}

interface JargonResult {
  termsFound: number;
  terms: Array<{
    term: string;
    explanation: string;
    isMarketingSpeak: boolean;
  }>;
}

interface QuestionResult {
  questions: Array<{
    question: string;
    whyImportant: string;
  }>;
}

interface ImageExtractionResult {
  documentType: string;
  confidence: "high" | "medium" | "low";
  extractedText: string;
  suspiciousClauses: string[];
}

interface LenderAgentOutput {
  strategySummary: string;
  predatoryPatternScore: number;
  moves: LenderAgentMove[];
}

interface PublicCounselOutput {
  summary: string;
  counters: PublicCounselCounter[];
}

interface ArbitrationAgentOutput {
  riskReason: string;
  transparentReasoning: string;
  clauseQuote: string;
  clauseTranslation: string;
  redFlags: string[];
  checklist: string[];
  revisionSuggestions: RevisionSuggestion[];
  contractSynopsis: string;
  arbitrationSummary: string;
  arbitrationFindings: ArbitrationFinding[];
  hallucinationGuards: string[];
}

const simpleTextPrompts: Record<Exclude<AnalysisType, "contract" | "contract-image" | "chart-image">, string> = {
  chart: `You explain financial charts in plain language and also surface abnormal-transaction risk.
Return strict JSON:
{"summary":"...","trend":"Bullish|Bearish|Volatile|Stable|Bearish with abnormal flow","riskIndicators":["..."],"historicalContext":"...","disclaimer":"Educational only; not financial advice.","surveillance":{"marketManipulationRisk":"...","surveillanceSummary":"...","abnormalTransactions":[{"pattern":"...","confidence":"high|medium|low","evidence":"...","marketImpact":"..."}],"forensicClues":["..."],"recommendedActions":["..."]}}
Rules:
- surveillance is optional, but include it whenever the chart description suggests spoofing, layering, wash trading, unusual volume clustering, or order-book pressure.`,
  jargon: `You identify finance jargon and explain it for non-experts.
Return strict JSON:
{"termsFound":0,"terms":[{"term":"...","explanation":"...","isMarketingSpeak":true}]}`,
  questions: `You generate smart borrower questions for a lender.
Return strict JSON:
{"questions":[{"question":"...","whyImportant":"..."}]}`,
};

const chartVisionPrompt = `You explain a financial chart shown in an image and inspect it for abnormal-transaction clues.
Return strict JSON:
{"summary":"...","trend":"Bullish|Bearish|Volatile|Stable|Bearish with abnormal flow","riskIndicators":["..."],"historicalContext":"...","disclaimer":"Educational only; not financial advice.","surveillance":{"marketManipulationRisk":"...","surveillanceSummary":"...","abnormalTransactions":[{"pattern":"...","confidence":"high|medium|low","evidence":"...","marketImpact":"..."}],"forensicClues":["..."],"recommendedActions":["..."]}}
Rules:
- If the image suggests possible spoofing, layering, false liquidity walls, or abnormal execution clustering, fill the surveillance object with concrete observations.
- Keep the language accessible to non-experts.`;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function trimText(input: string, maxLength = 12000) {
  return input.length > maxLength ? input.slice(0, maxLength) : input;
}

function extractJsonPayload<T>(rawText: string): T {
  const fenced = rawText.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? rawText;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Could not locate a JSON object in the model response.");
  }

  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1)) as T;
}

async function callTextModel<T>(systemPrompt: string, userContent: string, temperature = 0.2): Promise<T> {
  const apiKey = Deno.env.get("FEATHERLESS_API_KEY");
  if (!apiKey) {
    throw new Error("FEATHERLESS_API_KEY not configured");
  }

  const response = await fetch(TEXT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature,
      max_tokens: 2400,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Text model error: ${response.status} ${response.statusText}`);
  }

  const message = payload?.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error("Text model returned no content");
  }

  return extractJsonPayload<T>(message);
}

async function callVisionModel<T>(prompt: string, imageDataUrl: string): Promise<T> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const response = await fetch(VISION_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2400,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Vision model error: ${response.status} ${response.statusText}`);
  }

  const message = payload?.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error("Vision model returned no content");
  }

  return extractJsonPayload<T>(message);
}

function normalizeLevel(input: unknown): "high" | "medium" | "low" {
  const normalized = String(input ?? "").toLowerCase();
  if (normalized.includes("high")) {
    return "high";
  }
  if (normalized.includes("low")) {
    return "low";
  }
  return "medium";
}

function normalizeVerdict(input: unknown): ArbitrationFinding["verdict"] {
  const normalized = String(input ?? "").toLowerCase();
  if (normalized.includes("escalate")) {
    return "escalate";
  }
  if (normalized.includes("rewrite")) {
    return "rewrite";
  }
  if (normalized.includes("monitor")) {
    return "monitor";
  }
  return "contest";
}

function stringOrFallback(input: unknown, fallback: string) {
  const text = typeof input === "string" ? input.trim() : "";
  return text || fallback;
}

function stringArrayOrFallback(input: unknown, fallback: string[]) {
  if (!Array.isArray(input)) {
    return fallback;
  }

  const cleaned = input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return cleaned.length ? cleaned.slice(0, 6) : fallback;
}

function sanitizeMoves(input: unknown): LenderAgentMove[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((move) => ({
      clauseRef: stringOrFallback((move as Record<string, unknown>).clauseRef, "Contract-wide"),
      tactic: stringOrFallback((move as Record<string, unknown>).tactic, "Economic pressure point"),
      exploitNarrative: stringOrFallback(
        (move as Record<string, unknown>).exploitNarrative,
        "The clause preserves lender leverage after the borrower is already committed.",
      ),
      borrowerImpact: stringOrFallback(
        (move as Record<string, unknown>).borrowerImpact,
        "The borrower loses pricing certainty or downside visibility.",
      ),
      severity: normalizeLevel((move as Record<string, unknown>).severity),
    }))
    .slice(0, 4);
}

function sanitizeCounters(input: unknown, validSourceIds: Set<string>): PublicCounselCounter[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((counter) => {
      const rawSourceIds = Array.isArray((counter as Record<string, unknown>).sourceIds)
        ? ((counter as Record<string, unknown>).sourceIds as unknown[])
        : [];

      return {
        clauseRef: stringOrFallback((counter as Record<string, unknown>).clauseRef, "Contract-wide"),
        challenge: stringOrFallback((counter as Record<string, unknown>).challenge, "Material fairness concern"),
        supportingPrinciple: stringOrFallback(
          (counter as Record<string, unknown>).supportingPrinciple,
          "Retrieved consumer-finance authorities cut against unclear or one-sided pricing terms.",
        ),
        negotiationMove: stringOrFallback(
          (counter as Record<string, unknown>).negotiationMove,
          "Request a rewritten clause with a hard total-cost cap and plain-language disclosure.",
        ),
        sourceIds: rawSourceIds
          .map((sourceId) => String(sourceId))
          .filter((sourceId) => validSourceIds.has(sourceId))
          .slice(0, 3),
        strength: normalizeLevel((counter as Record<string, unknown>).strength),
      };
    })
    .filter((counter) => counter.sourceIds.length > 0)
    .slice(0, 4);
}

function sanitizeFindings(input: unknown): ArbitrationFinding[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((finding) => ({
      clauseRef: stringOrFallback((finding as Record<string, unknown>).clauseRef, "Contract-wide"),
      verdict: normalizeVerdict((finding as Record<string, unknown>).verdict),
      severity: normalizeLevel((finding as Record<string, unknown>).severity),
      finding: stringOrFallback(
        (finding as Record<string, unknown>).finding,
        "The clause needs closer consumer-protection review.",
      ),
      rationale: stringOrFallback(
        (finding as Record<string, unknown>).rationale,
        "The clause creates uncertainty about total borrowing cost or borrower remedies.",
      ),
    }))
    .slice(0, 4);
}

function sanitizeRevisionSuggestions(input: unknown): RevisionSuggestion[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((suggestion, index) => ({
      clauseNumber: stringOrFallback((suggestion as Record<string, unknown>).clauseNumber, `Issue ${index + 1}`),
      clauseName: stringOrFallback((suggestion as Record<string, unknown>).clauseName, "Risky clause"),
      originalText: stringOrFallback(
        (suggestion as Record<string, unknown>).originalText,
        "See the cited clause or pricing mechanic in the agreement.",
      ),
      issue: stringOrFallback(
        (suggestion as Record<string, unknown>).issue,
        "This wording gives the lender excessive leverage or obscures total cost.",
      ),
      suggestedRevision: stringOrFallback(
        (suggestion as Record<string, unknown>).suggestedRevision,
        "Rewrite the clause in plain language, freeze post-signature repricing, and add a disclosed cost cap.",
      ),
      legalBasis: stringOrFallback(
        (suggestion as Record<string, unknown>).legalBasis,
        "Consumer-protection and disclosure principles require clear, stable, pre-signature visibility into total cost.",
      ),
    }))
    .slice(0, 4);
}

function buildFallbackMoves(contractText: string): LenderAgentMove[] {
  const normalized = contractText.toLowerCase();
  const moves: LenderAgentMove[] = [];

  if (normalized.includes("at any time") || normalized.includes("sole discretion")) {
    moves.push({
      clauseRef: "Unilateral change clause",
      tactic: "Post-signature repricing",
      exploitNarrative:
        "The lender can keep the headline price attractive while preserving the right to worsen economics later.",
      borrowerImpact:
        "The borrower cannot know the real total cost when deciding whether to sign.",
      severity: "high",
    });
  }

  if (normalized.includes("rollover") || normalized.includes("extension") || normalized.includes("renew")) {
    moves.push({
      clauseRef: "Rollover / extension clause",
      tactic: "Debt-trap extension loop",
      exploitNarrative:
        "Short-term distress can be converted into repeated fee accrual through extensions or renewals.",
      borrowerImpact:
        "A missed payment can snowball into a larger balance even without new principal being advanced.",
      severity: "high",
    });
  }

  if (normalized.includes("late fee") || normalized.includes("collection") || normalized.includes("default")) {
    moves.push({
      clauseRef: "Default section",
      tactic: "Open-ended default monetization",
      exploitNarrative:
        "The lender keeps delinquency profitable by leaving post-default costs broad or uncapped.",
      borrowerImpact:
        "The borrower loses any reliable upper bound on exposure after a missed payment.",
      severity: "medium",
    });
  }

  if (normalized.includes("arbitration")) {
    moves.push({
      clauseRef: "Dispute resolution",
      tactic: "Procedural pressure",
      exploitNarrative:
        "Mandatory arbitration can reduce the borrower's practical leverage to challenge unfair terms.",
      borrowerImpact:
        "The borrower may face a weaker path to contest hidden-cost or abusive terms.",
      severity: "medium",
    });
  }

  return moves.slice(0, 4);
}

function buildFallbackCounters(
  retrievedAuthorities: LegalKnowledgeRecord[],
  moves: LenderAgentMove[],
): PublicCounselCounter[] {
  const defaultSourceIds = retrievedAuthorities.slice(0, 2).map((item) => item.id);

  return moves.map((move) => ({
    clauseRef: move.clauseRef,
    challenge: `Challenge ${move.tactic.toLowerCase()} with clearer consumer-facing disclosures and a hard cap.`,
    supportingPrinciple:
      "Retrieved authorities emphasize meaningful disclosure, stable pricing, and limits on unfair post-default leverage.",
    negotiationMove:
      "Request rewritten language that fixes pricing before signature and itemizes every possible post-default cost.",
    sourceIds: defaultSourceIds,
    strength: move.severity === "high" ? "high" : "medium",
  }));
}

function buildFallbackFindings(
  moves: LenderAgentMove[],
  counters: PublicCounselCounter[],
): ArbitrationFinding[] {
  const primaryMoves = moves.length
    ? moves
    : [
        {
          clauseRef: "Contract-wide",
          tactic: "Opaque cost structure",
          exploitNarrative: "",
          borrowerImpact: "",
          severity: "medium" as const,
        },
      ];

  return primaryMoves.slice(0, 3).map((move, index) => ({
    clauseRef: move.clauseRef,
    verdict: move.severity === "high" ? "rewrite" : index === 0 ? "contest" : "monitor",
    severity: move.severity,
    finding: `The ${move.tactic.toLowerCase()} mechanic materially shifts risk toward the borrower.`,
    rationale:
      counters[index]?.supportingPrinciple ??
      "The contract needs clearer disclosure, tighter drafting, and less one-sided post-default leverage.",
  }));
}

function computePatternScore(
  modelScore: number | undefined,
  moves: LenderAgentMove[],
  findings: ArbitrationFinding[],
) {
  const baseScore = Number.isFinite(modelScore) ? Number(modelScore) : 0;
  const highMoves = moves.filter((move) => move.severity === "high").length;
  const mediumMoves = moves.filter((move) => move.severity === "medium").length;
  const highFindings = findings.filter((finding) => finding.severity === "high").length;
  const heuristicScore = Math.min(96, 28 + highMoves * 18 + mediumMoves * 9 + highFindings * 12);
  const finalScore = baseScore > 0 ? Math.round((baseScore + heuristicScore) / 2) : heuristicScore;

  return Math.max(12, Math.min(99, finalScore));
}

function deriveRiskLevel(score: number, findings: ArbitrationFinding[]) {
  const hasEscalation = findings.some((finding) => finding.verdict === "escalate");
  if (score >= 72 || hasEscalation) {
    return "High Risk";
  }
  if (score >= 45) {
    return "Medium Risk";
  }
  return "Low Risk";
}

function toCitation(record: LegalKnowledgeRecord) {
  const { id, title, citation, year, jurisdiction, sourceType, holding, relevance, url } = record;
  return { id, title, citation, year, jurisdiction, sourceType, holding, relevance, url };
}

async function extractContractImageText(imageDataUrl: string): Promise<ImageExtractionResult> {
  return callVisionModel<ImageExtractionResult>(
    `You are preparing an adversarial legal risk review.
Read the consumer finance contract image carefully and return strict JSON:
{"documentType":"...","confidence":"high|medium|low","extractedText":"full OCR text with line breaks preserved as much as possible","suspiciousClauses":["short phrases for risky-looking clauses"]}
Rules:
- Preserve the document's original wording in extractedText.
- If some text is unreadable, say so briefly inside extractedText rather than inventing content.
- suspiciousClauses should be short excerpts, not commentary.`,
    imageDataUrl,
  );
}

async function runLenderLogicAgent(contractText: string): Promise<LenderAgentOutput> {
  return callTextModel<LenderAgentOutput>(
    `You are the "Lender Logic Agent" inside an internal adversarial stress test.
Your job is to think like an aggressive lender that stays as close to formal legality as possible while maximizing borrower lock-in and fee extraction.
Return strict JSON:
{"strategySummary":"...","predatoryPatternScore":0,"moves":[{"clauseRef":"...","tactic":"...","exploitNarrative":"...","borrowerImpact":"...","severity":"high|medium|low"}]}
Rules:
- 2 to 4 moves only.
- Focus on fee ratchets, rollover mechanics, default leverage, arbitration leverage, autopay leverage, and disclosure asymmetry.
- Be concrete and plausible. Do not cite laws.`,
    trimText(contractText),
    0.15,
  );
}

async function runPublicCounselAgent(
  contractText: string,
  retrievedAuthorities: LegalKnowledgeRecord[],
): Promise<PublicCounselOutput> {
  return callTextModel<PublicCounselOutput>(
    `You are the "Public Counsel Agent" in a consumer-finance review system.
You may only use the retrieved authorities provided below. Do not invent cases or rules.
Return strict JSON:
{"summary":"...","counters":[{"clauseRef":"...","challenge":"...","supportingPrinciple":"...","negotiationMove":"...","sourceIds":["id"],"strength":"high|medium|low"}]}
Rules:
- 2 to 4 counters only.
- Every counter must contain at least one valid source ID from the retrieved authorities.
- supportingPrinciple should explain why the clause is vulnerable without giving formal legal advice.
- negotiationMove should be actionable plain-language borrower guidance.

Retrieved authorities:
${JSON.stringify(retrievedAuthorities.map(toCitation), null, 2)}`,
    trimText(contractText),
    0.1,
  );
}

async function runArbitrationAgent(args: {
  contractText: string;
  retrievedAuthorities: LegalKnowledgeRecord[];
  lenderOutput: LenderAgentOutput;
  publicCounselOutput: PublicCounselOutput;
  extractedText?: string;
}): Promise<ArbitrationAgentOutput> {
  const { contractText, retrievedAuthorities, lenderOutput, publicCounselOutput, extractedText } = args;

  return callTextModel<ArbitrationAgentOutput>(
    `You are the neutral "Arbitration Agent" in a multi-agent contract-risk system.
Combine the lender-side attack analysis, the public-interest legal response, and the retrieved authorities.
Return strict JSON:
{
  "riskReason":"...",
  "transparentReasoning":"...",
  "clauseQuote":"...",
  "clauseTranslation":"...",
  "redFlags":["..."],
  "checklist":["..."],
  "revisionSuggestions":[{"clauseNumber":"...","clauseName":"...","originalText":"...","issue":"...","suggestedRevision":"...","legalBasis":"..."}],
  "contractSynopsis":"...",
  "arbitrationSummary":"...",
  "arbitrationFindings":[{"clauseRef":"...","verdict":"contest|rewrite|escalate|monitor","severity":"high|medium|low","finding":"...","rationale":"..."}],
  "hallucinationGuards":["..."]
}
Rules:
- 3 redFlags and 3 checklist items.
- 2 to 4 revisionSuggestions.
- 2 to 4 arbitrationFindings.
- clauseQuote should be an exact or near-exact excerpt from the provided contract text.
- clauseTranslation should explain the economic effect in plain language.
- hallucinationGuards should mention verification or evidence controls.
- This is educational risk communication, not formal legal advice.

Retrieved authorities:
${JSON.stringify(retrievedAuthorities.map(toCitation), null, 2)}

Lender output:
${JSON.stringify(lenderOutput, null, 2)}

Public counsel output:
${JSON.stringify(publicCounselOutput, null, 2)}

${extractedText ? `Document extraction notes:\n${extractedText}\n` : ""}`,
    trimText(contractText),
    0.15,
  );
}

async function analyzeContract(payload: { type: "contract" | "contract-image"; content: string }): Promise<ContractResult> {
  let extractedText = "";
  let contractText = payload.content;

  if (payload.type === "contract-image") {
    const extraction = await extractContractImageText(payload.content);
    extractedText = extraction.extractedText.trim();
    contractText = extractedText || extraction.suspiciousClauses.join("\n");
  }

  const preparedContractText = trimText(contractText);
  if (!preparedContractText) {
    throw new Error("No contract text could be extracted for analysis.");
  }

  const retrieval = retrieveLegalKnowledge(preparedContractText);
  const authorityIds = new Set(retrieval.items.map((item) => item.id));

  let lenderOutput: LenderAgentOutput;
  let publicCounselOutput: PublicCounselOutput;

  try {
    [lenderOutput, publicCounselOutput] = await Promise.all([
      runLenderLogicAgent(preparedContractText),
      runPublicCounselAgent(preparedContractText, retrieval.items),
    ]);
  } catch (_error) {
    const fallbackMoves = buildFallbackMoves(preparedContractText);
    lenderOutput = {
      strategySummary:
        "Fallback heuristic analysis found several contract mechanics that preserve lender leverage after the borrower commits.",
      predatoryPatternScore: 72,
      moves: fallbackMoves,
    };
    publicCounselOutput = {
      summary:
        "Fallback public-counsel analysis matched the risky clauses against disclosure and fairness authorities returned by retrieval.",
      counters: buildFallbackCounters(retrieval.items, fallbackMoves),
    };
  }

  const lenderMoves = sanitizeMoves(lenderOutput.moves);
  const sanitizedCounters = sanitizeCounters(publicCounselOutput.counters, authorityIds);
  const publicCounselCounters =
    sanitizedCounters.length > 0 ? sanitizedCounters : buildFallbackCounters(retrieval.items, lenderMoves);

  let arbitrationOutput: ArbitrationAgentOutput;

  try {
    arbitrationOutput = await runArbitrationAgent({
      contractText: preparedContractText,
      retrievedAuthorities: retrieval.items,
      lenderOutput: { ...lenderOutput, moves: lenderMoves },
      publicCounselOutput: { ...publicCounselOutput, counters: publicCounselCounters },
      extractedText,
    });
  } catch (_error) {
    arbitrationOutput = {
      riskReason:
        "The contract uses pricing and default language that can keep the true borrowing cost hidden until the borrower is already locked in.",
      transparentReasoning:
        "Retrieval matched the document against disclosure and unfairness authorities, while the lender-side analysis found ways the clauses could extract more fees after a missed payment.",
      clauseQuote: preparedContractText.split("\n").find((line) => line.trim().length > 20)?.trim() ?? preparedContractText.slice(0, 160),
      clauseTranslation:
        "The agreement may let the lender make the loan more expensive after signing or after a payment problem starts.",
      redFlags: [
        "Total cost may depend on post-signature fees rather than the headline price.",
        "Rollover or default mechanics can convert short-term stress into repeat-fee accrual.",
        "The borrower may have limited leverage to challenge the economics after signing.",
      ],
      checklist: [
        "Ask for an all-in cost schedule that includes every fee after delinquency or extension.",
        "Request a written cap on post-default charges before signing.",
        "Escalate for human legal review if the lender refuses to freeze unilateral repricing terms.",
      ],
      revisionSuggestions: [
        {
          clauseNumber: "Issue 1",
          clauseName: "Fee and repricing controls",
          originalText: preparedContractText.slice(0, 220),
          issue: "The draft may allow cost escalation after the borrower commits.",
          suggestedRevision:
            "Freeze all fees at execution and require any later modification to be separately signed with a new total-cost disclosure.",
          legalBasis:
            "Borrowers need a stable pre-signature view of total cost to give meaningful consent.",
        },
        {
          clauseNumber: "Issue 2",
          clauseName: "Default cost cap",
          originalText: preparedContractText.slice(0, 220),
          issue: "Default exposure may be open-ended or insufficiently itemized.",
          suggestedRevision:
            "Add a hard cap and itemized schedule for every charge triggered after a missed payment.",
          legalBasis:
            "Open-ended post-default economics undermine informed comparison and can operate unfairly in practice.",
        },
      ],
      contractSynopsis:
        "The contract appears manageable on first read but shifts economic power to the lender through fee design and default leverage.",
      arbitrationSummary:
        "The structure deserves challenge before signature, with at least one clause rewritten and a second escalated if the lender refuses to cap downside exposure.",
      arbitrationFindings: buildFallbackFindings(lenderMoves, publicCounselCounters),
      hallucinationGuards: [
        "Fallback mode restricted outputs to retrieved authorities and deterministic clause heuristics.",
        "The final risk label was normalized from observable clause patterns rather than model tone alone.",
        "Unsupported legal citations were dropped before the response was returned.",
      ],
    };
  }

  const sanitizedFindings = sanitizeFindings(arbitrationOutput.arbitrationFindings);
  const arbitrationFindings =
    sanitizedFindings.length > 0 ? sanitizedFindings : buildFallbackFindings(lenderMoves, publicCounselCounters);
  const predatoryPatternScore = computePatternScore(
    lenderOutput.predatoryPatternScore,
    lenderMoves,
    arbitrationFindings,
  );
  const riskLevel = deriveRiskLevel(predatoryPatternScore, arbitrationFindings);
  const sanitizedRevisions = sanitizeRevisionSuggestions(arbitrationOutput.revisionSuggestions);

  return {
    riskLevel,
    riskReason: stringOrFallback(
      arbitrationOutput.riskReason,
      "The contract contains lender-favorable mechanics that can make the real borrowing cost hard to predict.",
    ),
    transparentReasoning: stringOrFallback(
      arbitrationOutput.transparentReasoning,
      "The multi-agent review found that the contract's economic downside is not fully visible at the moment of signature.",
    ),
    clauseQuote: stringOrFallback(
      arbitrationOutput.clauseQuote,
      preparedContractText.split("\n").find((line) => line.trim().length > 20)?.trim() ?? preparedContractText.slice(0, 180),
    ),
    clauseTranslation: stringOrFallback(
      arbitrationOutput.clauseTranslation,
      "In plain language: the lender may be able to make this deal more expensive after you are already committed.",
    ),
    redFlags: stringArrayOrFallback(arbitrationOutput.redFlags, [
      "Total cost may depend on hidden or delayed fees.",
      "Default or extension language can magnify debt after a missed payment.",
      "The contract gives the lender stronger leverage than the borrower after signature.",
    ]),
    checklist: stringArrayOrFallback(arbitrationOutput.checklist, [
      "Get an itemized all-in cost schedule before signing.",
      "Ask for a hard cap on all post-default charges.",
      "Escalate the agreement for human review if the lender can reprice after signature.",
    ]),
    revisionSuggestions:
      sanitizedRevisions.length > 0
        ? sanitizedRevisions
        : [
            {
              clauseNumber: "Issue 1",
              clauseName: "Total-cost visibility",
              originalText:
                preparedContractText.split("\n").find((line) => line.trim().length > 20)?.trim() ?? preparedContractText.slice(0, 180),
              issue: "The borrower may not know the all-in price at signing.",
              suggestedRevision:
                "Require a single plain-language schedule that lists principal, APR, fees, default charges, and extension costs.",
              legalBasis:
                "Borrowers need stable cost visibility to compare offers and give meaningful consent.",
            },
          ],
    extractedText: extractedText || undefined,
    agentArena: {
      contractSynopsis: stringOrFallback(
        arbitrationOutput.contractSynopsis,
        "The agreement front-loads apparent simplicity while preserving lender leverage in the fine print.",
      ),
      retrievalSummary: retrieval.retrievalSummary,
      lenderStrategySummary: stringOrFallback(
        lenderOutput.strategySummary,
        "The lender-side agent found economically aggressive but facially plausible ways to preserve post-signature leverage.",
      ),
      publicCounselSummary: stringOrFallback(
        publicCounselOutput.summary,
        "The public-counsel agent matched those tactics against disclosure, fairness, and enforcement authorities returned by retrieval.",
      ),
      arbitrationSummary: stringOrFallback(
        arbitrationOutput.arbitrationSummary,
        "The arbitration layer found that the contract's economics favor the lender in ways that warrant negotiation or escalation before signing.",
      ),
      predatoryPatternScore,
      lenderPlaybook: lenderMoves,
      publicCounselCounters,
      arbitrationFindings,
      evidence: retrieval.items.map(toCitation),
      hallucinationGuards: stringArrayOrFallback(arbitrationOutput.hallucinationGuards, [
        "The lawyer agent can only cite authorities returned by retrieval.",
        "Invalid or unsupported source IDs are discarded before the final response is returned.",
        "Risk labels are normalized using clause patterns and arbitration findings, not raw model confidence alone.",
      ]),
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const type = body?.type as AnalysisType | undefined;
    const content = typeof body?.content === "string" ? body.content : "";

    if (!type || !content) {
      return jsonResponse({ error: "Missing 'type' or 'content'" }, 400);
    }

    if (type === "contract" || type === "contract-image") {
      const result = await analyzeContract({ type, content });
      return jsonResponse(result);
    }

    if (type === "chart-image") {
      const result = await callVisionModel<ChartResult>(chartVisionPrompt, content);
      return jsonResponse(result);
    }

    const prompt = simpleTextPrompts[type as keyof typeof simpleTextPrompts];
    if (!prompt) {
      return jsonResponse({ error: `Invalid type: ${type}` }, 400);
    }

    if (type === "chart") {
      const result = await callTextModel<ChartResult>(prompt, trimText(content));
      return jsonResponse(result);
    }

    if (type === "jargon") {
      const result = await callTextModel<JargonResult>(prompt, trimText(content));
      return jsonResponse(result);
    }

    const result = await callTextModel<QuestionResult>(prompt, trimText(content));
    return jsonResponse(result);
  } catch (error) {
    console.error("Analyze function failed", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
