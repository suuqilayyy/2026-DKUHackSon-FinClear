import {
  AlertTriangle,
  ArrowUpRight,
  BookText,
  BrainCircuit,
  Gavel,
  Scale,
  ShieldAlert,
  Siren,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  AgentArenaResult,
  ArbitrationFinding,
  LenderAgentMove,
  LegalCitation,
  PublicCounselCounter,
} from "@/lib/featherlessAI";

interface AgentArenaProps {
  arena: AgentArenaResult;
}

function getSeverityTone(level: "high" | "medium" | "low") {
  if (level === "high") {
    return "border-red-200 bg-red-50 text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100";
  }

  if (level === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100";
}

function getVerdictTone(verdict: ArbitrationFinding["verdict"]) {
  if (verdict === "escalate") {
    return "bg-red-500 text-white dark:bg-red-500/20 dark:text-red-100";
  }

  if (verdict === "rewrite") {
    return "bg-amber-500 text-white dark:bg-amber-500/20 dark:text-amber-100";
  }

  if (verdict === "contest") {
    return "bg-slate-900 text-white dark:bg-white dark:text-slate-900";
  }

  return "bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-100";
}

function MoveCard({ move }: { move: LenderAgentMove }) {
  return (
    <div className={`rounded-[1.75rem] border p-5 ${getSeverityTone(move.severity)}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em]">{move.clauseRef}</p>
        <Badge variant="outline" className="border-current/20 bg-white/50 text-current dark:bg-transparent">
          {move.severity}
        </Badge>
      </div>
      <h4 className="mt-3 text-base font-semibold">{move.tactic}</h4>
      <p className="mt-2 text-sm leading-relaxed opacity-90">{move.exploitNarrative}</p>
      <p className="mt-4 text-sm leading-relaxed opacity-80">{move.borrowerImpact}</p>
    </div>
  );
}

function CounterCard({
  counter,
  evidenceMap,
}: {
  counter: PublicCounselCounter;
  evidenceMap: Map<string, LegalCitation>;
}) {
  return (
    <div className={`rounded-[1.75rem] border p-5 ${getSeverityTone(counter.strength)}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em]">{counter.clauseRef}</p>
        <Badge variant="outline" className="border-current/20 bg-white/50 text-current dark:bg-transparent">
          {counter.strength}
        </Badge>
      </div>
      <h4 className="mt-3 text-base font-semibold">{counter.challenge}</h4>
      <p className="mt-2 text-sm leading-relaxed opacity-90">{counter.supportingPrinciple}</p>
      <p className="mt-4 text-sm leading-relaxed opacity-80">{counter.negotiationMove}</p>
      {counter.sourceIds.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {counter.sourceIds
            .map((sourceId) => evidenceMap.get(sourceId))
            .filter((citation): citation is LegalCitation => Boolean(citation))
            .map((citation) => (
              <Badge
                key={citation.id}
                variant="outline"
                className="border-current/20 bg-white/60 text-[11px] text-current dark:bg-transparent"
              >
                {citation.title}
              </Badge>
            ))}
        </div>
      ) : null}
    </div>
  );
}

export function AgentArena({ arena }: AgentArenaProps) {
  const evidenceMap = new Map(arena.evidence.map((citation) => [citation.id, citation]));
  const scoreWidth = Math.max(8, Math.min(100, arena.predatoryPatternScore));

  return (
    <section className="md:col-span-2 rounded-[2.75rem] border border-slate-200/70 bg-white/80 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-[#11131A]/80 dark:shadow-none">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              <BrainCircuit className="h-4 w-4" />
              Adversarial Stress Test
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Multi-agent contract arena with RAG-grounded legal pushback
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {arena.contractSynopsis}
            </p>
          </div>

          <div className="min-w-[240px] rounded-[1.75rem] bg-slate-950 px-5 py-4 text-white shadow-lg dark:bg-white dark:text-slate-950">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">
                Predatory Pattern Score
              </span>
              <span className="text-2xl font-bold">{arena.predatoryPatternScore}</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20 dark:bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-400 transition-[width] duration-700 dark:bg-slate-950"
                style={{ width: `${scoreWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_1.05fr_0.9fr]">
          <div className="rounded-[2rem] bg-[#FFE6E2]/85 p-6 dark:bg-red-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Siren className="h-4 w-4" />
              Lender Logic Agent
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {arena.lenderStrategySummary}
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#E8F4EF]/90 p-6 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <ShieldAlert className="h-4 w-4" />
              Public Counsel Agent
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {arena.publicCounselSummary}
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#EEF2FF]/90 p-6 dark:bg-blue-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Scale className="h-4 w-4" />
              Arbitration Agent
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {arena.arbitrationSummary}
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <AlertTriangle className="h-4 w-4" />
              Attack Surface
            </div>
            <div className="grid gap-4">
              {arena.lenderPlaybook.map((move, index) => (
                <MoveCard key={`${move.clauseRef}-${index}`} move={move} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Gavel className="h-4 w-4" />
              Legal Countermoves
            </div>
            <div className="grid gap-4">
              {arena.publicCounselCounters.map((counter, index) => (
                <CounterCard key={`${counter.clauseRef}-${index}`} counter={counter} evidenceMap={evidenceMap} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] bg-slate-50 p-6 dark:bg-white/5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Scale className="h-4 w-4" />
              Arbitration Findings
            </div>
            <div className="mt-5 space-y-4">
              {arena.arbitrationFindings.map((finding, index) => (
                <div
                  key={`${finding.clauseRef}-${index}`}
                  className={`rounded-[1.5rem] border p-4 ${getSeverityTone(finding.severity)}`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold">{finding.clauseRef}</p>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getVerdictTone(finding.verdict)}`}>
                      {finding.verdict}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{finding.finding}</p>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{finding.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] bg-[#F7F3EA] p-6 dark:bg-amber-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                <BookText className="h-4 w-4" />
                Retrieved Evidence
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {arena.retrievalSummary}
              </p>
              <div className="mt-5 space-y-3">
                {arena.evidence.map((citation) => (
                  <a
                    key={citation.id}
                    href={citation.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-4 transition-colors hover:border-slate-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{citation.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                          {citation.sourceType} • {citation.jurisdiction} • {citation.year}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{citation.holding}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{citation.relevance}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] opacity-80">
                <BrainCircuit className="h-4 w-4" />
                Hallucination Guards
              </div>
              <div className="mt-4 space-y-3">
                {arena.hallucinationGuards.map((guard, index) => (
                  <div
                    key={`${guard}-${index}`}
                    className="rounded-[1.25rem] bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90 dark:bg-slate-950/5 dark:text-slate-800"
                  >
                    {guard}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
