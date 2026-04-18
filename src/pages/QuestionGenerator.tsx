import { useState, useEffect, useCallback } from "react";
import { HelpCircle, Plus, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserMode } from "@/contexts/UserModeContext";
import { FeaturePageHeader } from "@/components/FeaturePageHeader";
import { t } from "@/lib/i18n";
import { generateQuestions, type QuestionResult } from "@/lib/featherlessAI";
import { getDemoQuestionResult, getDemoQuestionContext } from "@/lib/demoData";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { toast } from "sonner";

const personaKeys = [
  "Retiree", "Student", "Freelancer", "Employee", "Small Business Owner",
  "Homemaker", "Farmer", "Migrant Worker", "Civil Servant", "Other",
];
const contractKeys = [
  "Wealth Management", "Personal Loan", "Insurance Policy", "Mortgage",
  "Credit Card", "Auto Loan", "Education Loan", "Deposit Agreement",
  "Fund Investment", "Pension Plan", "Other",
];

const QuestionGenerator = () => {
  const { language, aiChecklist, setAiChecklist, isDemoMode, setIsDemoMode } = useUserMode();
  const [persona, setPersona] = useState("Retiree");
  const [contractType, setContractType] = useState("Wealth Management");
  const [customPersona, setCustomPersona] = useState("");
  const [customContract, setCustomContract] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuestionResult | null>(null);

  const loadDemoScenario = useCallback(() => {
    setIsDemoMode(true);
    setPersona("Employee");
    setContractType("Personal Loan");
    setContext(getDemoQuestionContext(language));
    setResult(getDemoQuestionResult(language));
  }, [language, setIsDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      loadDemoScenario();
    }
  }, [isDemoMode, loadDemoScenario]);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const personaLabel = persona === "Other"
        ? (customPersona || t("persona.Other", language))
        : t(`persona.${persona}`, language);
      const contractLabel = contractType === "Other"
        ? (customContract || t("contract.Other", language))
        : t(`contract.${contractType}`, language);
      const r = await generateQuestions(personaLabel, contractLabel, context);
      setResult(r);
    } catch (e) {
      console.error(e);
      toast.error(language === "zh" ? "生成遇到问题，请检查网络连接后重试" : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <FeaturePageHeader
        title={t("qg.title", language)}
        subtitle={t("qg.subtitle", language)}
        demoDescription={
          language === "zh"
            ? "一键载入高风险贷款访谈场景，展示角色化提问、隐藏费用追问和一键加入签约前清单。"
            : "Load a risky-loan interview scenario with persona-based questions, hidden-fee follow-ups, and one-click checklist transfer."
        }
        demoHighlights={
          language === "zh"
            ? ["角色化提问", "隐藏费用追问", "谈判问题清单", "加入签约前清单"]
            : ["Persona Framing", "Hidden Fee Follow-ups", "Negotiation Questions", "Checklist Transfer"]
        }
        onLaunchDemo={loadDemoScenario}
        demoActive={isDemoMode}
      />

      {/* Mad Libs */}
      <div className="rounded-[2.5rem] dark:rounded-2xl bg-slate-50 dark:bg-[#11131A] p-8 md:p-10 shadow-xl shadow-slate-100/40 dark:shadow-none dark:border dark:border-white/10">
        <p className="text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-y-4">
          {t("qg.iam", language)}{" "}
          <Select value={persona} onValueChange={setPersona}>
            <SelectTrigger className="inline-flex items-center bg-white/80 dark:bg-[#11131A]/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 rounded-2xl px-5 py-2 mx-2 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm h-auto w-auto gap-2 text-sm font-semibold [&>svg]:opacity-100 [&>svg]:h-5 [&>svg]:w-5">
              <SelectValue>{t(`persona.${persona}`, language)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-72">
              {personaKeys.map((p) => (
                <SelectItem key={p} value={p} className="text-base py-2.5 cursor-pointer">
                  {t(`persona.${p}`, language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{" "}
          {persona === "Other" && (
            <input
              type="text"
              value={customPersona}
              onChange={(e) => setCustomPersona(e.target.value)}
              placeholder={t("qg.customPersona", language)}
              className="inline-flex bg-white/80 dark:bg-[#11131A]/80 backdrop-blur-sm border-2 border-dashed border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-2xl px-5 py-2 mx-2 text-sm font-semibold focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all w-48 placeholder:text-blue-300 dark:placeholder:text-blue-700"
            />
          )}
          {t("qg.reviewing", language)}{" "}
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger className="inline-flex items-center bg-white/80 dark:bg-[#11131A]/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 rounded-2xl px-5 py-2 mx-2 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm h-auto w-auto gap-2 text-sm font-semibold [&>svg]:opacity-100 [&>svg]:h-5 [&>svg]:w-5">
              <SelectValue>{t(`contract.${contractType}`, language)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-72">
              {contractKeys.map((c) => (
                <SelectItem key={c} value={c} className="text-base py-2.5 cursor-pointer">
                  {t(`contract.${c}`, language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {contractType === "Other" && (
            <input
              type="text"
              value={customContract}
              onChange={(e) => setCustomContract(e.target.value)}
              placeholder={t("qg.customContract", language)}
              className="inline-flex bg-white/80 dark:bg-[#11131A]/80 backdrop-blur-sm border-2 border-dashed border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-2xl px-5 py-2 mx-2 text-sm font-semibold focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all w-48 placeholder:text-blue-300 dark:placeholder:text-blue-700"
            />
          )}
          .
        </p>

        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="bg-transparent border-b border-slate-300 dark:border-white/20 w-full py-4 mt-8 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
          placeholder={t("qg.placeholder", language)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-slate-900 dark:bg-white px-8 py-4 text-sm font-semibold text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10 transition-colors hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="h-5 w-5" />
          {t("qg.generate", language)}
        </button>
      </div>

      {loading && <ScanningAnimation />}

      {/* AI-generated Questions */}
      {result && (
        <div className="rounded-[2.5rem] dark:rounded-2xl bg-emerald-50 dark:bg-[#11131A] p-8 shadow-xl shadow-emerald-50/40 dark:shadow-none dark:border dark:border-white/10">
          <div className="mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              {t("qg.recommended", language)}
            </span>
          </div>

          <div className="space-y-4">
            {result.questions.map((q, i) => (
              <div key={i} className="rounded-[2rem] bg-white/60 p-5 dark:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{q.question}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{q.whyImportant}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!aiChecklist.includes(q.question)) {
                        setAiChecklist([...aiChecklist, q.question]);
                        toast.success(language === "zh" ? "已加入签署前检查清单" : "Added to checklist");
                      } else {
                        toast.info(language === "zh" ? "该问题已在清单中" : "Already in checklist");
                      }
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {aiChecklist.includes(q.question) ? (language === "zh" ? "已添加" : "Added") : t("qg.addchecklist", language)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="rounded-2xl bg-slate-50/50 dark:bg-white/5 p-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {language === "zh" ? "选择您的身份和合同类型，AI 将生成您应该问的问题" : "Select your persona and contract type, AI will generate questions you should ask"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
