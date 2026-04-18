import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, BookOpen, AlertTriangle } from "lucide-react";
import { useUserMode } from "@/contexts/UserModeContext";
import { FeaturePageHeader } from "@/components/FeaturePageHeader";
import { t } from "@/lib/i18n";
import { scanJargon, type JargonResult } from "@/lib/featherlessAI";
import { getDemoJargonResult, getDemoJargonText } from "@/lib/demoData";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { toast } from "sonner";

const JargonScanner = () => {
  const { language, isDemoMode, setIsDemoMode } = useUserMode();
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JargonResult | null>(null);

  const loadDemoScenario = useCallback(() => {
    setIsDemoMode(true);
    setInputText(getDemoJargonText(language));
    setResult(getDemoJargonResult(language));
  }, [language, setIsDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      loadDemoScenario();
    }
  }, [isDemoMode, loadDemoScenario]);

  const handleScan = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await scanJargon(inputText);
      setResult(r);
    } catch (e) {
      console.error(e);
      toast.error(language === "zh" ? "分析遇到问题，请检查网络连接后重试" : "Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <FeaturePageHeader
        title={t("jargon.title", language)}
        subtitle={t("jargon.subtitle", language)}
        demoDescription={
          language === "zh"
            ? "一键载入营销话术与真实术语混合样本，完整展示术语拆解、误导表达识别和 plain-language 翻译。"
            : "Load a mixed finance-marketing sample that shows term extraction, marketing-speak detection, and plain-language translation."
        }
        demoHighlights={
          language === "zh"
            ? ["术语识别", "营销话术识别", "Plain Language", "风险扫雷"]
            : ["Term Detection", "Marketing Speak", "Plain Language", "Risk Scan"]
        }
        onLaunchDemo={loadDemoScenario}
        demoActive={isDemoMode}
      />

      {/* Input */}
      <div className="rounded-[2.5rem] dark:rounded-2xl bg-white dark:bg-[#11131A] p-6 border border-slate-200 dark:border-white/10">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full min-h-[120px] bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none leading-relaxed"
          placeholder={t("jargon.placeholder", language)}
        />
      </div>

      <button
        onClick={handleScan}
        disabled={loading || !inputText.trim()}
        className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-800/20 transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="h-4 w-4" />
        {t("jargon.scan", language)}
      </button>

      {loading && <ScanningAnimation />}

      {result && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Analysis Summary */}
          <div className="rounded-[2.5rem] dark:rounded-2xl bg-amber-50 dark:bg-[#11131A] p-8 shadow-xl shadow-amber-50/40 dark:shadow-none dark:border dark:border-white/10">
            <div className="mb-5 flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {t("jargon.analysis.label", language)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {language === "zh"
                ? `在您的文本中发现了 ${result.termsFound} 个金融术语。以下是每个术语的大白话解释。`
                : `Found ${result.termsFound} financial terms in your text. Here are plain-language explanations for each.`}
            </p>
            <p className="mt-4 text-xs font-medium text-amber-700 dark:text-amber-400">
              {language === "zh" ? `共发现 ${result.termsFound} 个术语` : `${result.termsFound} terms detected`}
            </p>
          </div>

          {/* Terms Dictionary */}
          <div className="rounded-[2.5rem] dark:rounded-2xl bg-blue-50 dark:bg-[#11131A] p-8 shadow-xl shadow-blue-50/40 dark:shadow-none dark:border dark:border-white/10">
            <div className="mb-5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {t("jargon.dict.label", language)}
              </span>
            </div>
            <div className="space-y-4">
              {result.terms.map((term, i) => (
                <div key={i} className="rounded-[2rem] bg-white/60 p-4 dark:bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{term.term}</p>
                    {term.isMarketingSpeak && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <AlertTriangle className="h-3 w-3" />
                        {language === "zh" ? "营销话术" : "Marketing Speak"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{term.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="rounded-2xl bg-slate-50/50 dark:bg-white/5 p-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {language === "zh" ? "粘贴含金融术语的文本，AI 将为您逐一解释" : "Paste text with financial jargon and AI will explain each term"}
          </p>
        </div>
      )}
    </div>
  );
};

export default JargonScanner;
