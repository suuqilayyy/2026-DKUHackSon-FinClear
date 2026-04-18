import { useState, useRef, useEffect, useCallback } from "react";
import { BarChart3, ImageIcon, TrendingDown, Clock, AlertTriangle, Sparkles, Upload, X, Type, Camera, ShieldAlert, Search } from "lucide-react";
import { useUserMode } from "@/contexts/UserModeContext";
import { t } from "@/lib/i18n";
import { analyzeChart, analyzeChartImage, type ChartResult } from "@/lib/featherlessAI";
import { FeaturePageHeader } from "@/components/FeaturePageHeader";
import { getDemoChartImage, getDemoChartResult, getDemoChartText } from "@/lib/demoData";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { toast } from "sonner";

const ChartExplainer = () => {
  const { language, isDemoMode, setIsDemoMode } = useUserMode();
  const [mode, setMode] = useState<"text" | "image">("image");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChartResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDemoScenario = useCallback(() => {
    const demoImage = getDemoChartImage();

    setIsDemoMode(true);
    setMode("image");
    setInputText(getDemoChartText(language));
    setImagePreview(demoImage);
    setImageBase64(demoImage);
    setResult(getDemoChartResult(language));
  }, [language, setIsDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      loadDemoScenario();
    }
  }, [isDemoMode, loadDemoScenario]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(language === "zh" ? "请上传图片文件" : "Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === "zh" ? "图片不能超过5MB" : "Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setMode("image");
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (mode === "text" && !inputText.trim()) return;
    if (mode === "image" && !imageBase64) return;

    setLoading(true);
    setResult(null);
    try {
      let r: ChartResult;
      if (mode === "image" && imageBase64) {
        r = await analyzeChartImage(imageBase64);
      } else {
        r = await analyzeChart(inputText.trim());
      }
      setResult(r);
    } catch (e) {
      console.error(e);
      toast.error(language === "zh" ? "分析遇到问题，请重试" : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const trendColor = result?.trend === "Bearish" ? "text-red-500" : result?.trend === "Bullish" ? "text-emerald-500" : "text-orange-500";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <FeaturePageHeader
        title={t("chart.title", language)}
        subtitle={t("chart.subtitle", language)}
        demoDescription={
          language === "zh"
            ? "一键载入可录屏的异常交易案例，同时展示走势解释、盘口操纵迹象、取证线索和风控行动建议。"
            : "Load a judge-ready abnormal-trading scenario with trend explanation, manipulation cues, forensic clues, and surveillance actions."
        }
        demoHighlights={
          language === "zh"
            ? ["趋势解释", "异常交易识别", "Spoofing / Layering", "取证线索", "风险建议"]
            : ["Trend View", "Abnormal Transactions", "Spoofing / Layering", "Forensics", "Risk Actions"]
        }
        onLaunchDemo={loadDemoScenario}
        demoActive={isDemoMode}
      />

      {/* Mode Toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode("image")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            mode === "image"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg"
              : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
          }`}
        >
          <Camera className="h-4 w-4" />
          {language === "zh" ? "📷 上传图片" : "📷 Upload Image"}
        </button>
        <button
          onClick={() => setMode("text")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            mode === "text"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg"
              : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
          }`}
        >
          <Type className="h-4 w-4" />
          {language === "zh" ? "📝 描述图表" : "📝 Describe Chart"}
        </button>
      </div>

      {/* Image Upload */}
      {mode === "image" && (
        <div
          className="rounded-[2.5rem] dark:rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131A] p-6 transition-colors hover:border-blue-300 dark:hover:border-blue-500/30 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />

          {imagePreview ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute top-2 right-2 z-10 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={imagePreview}
                alt="Chart preview"
                className="w-full max-h-[300px] object-contain rounded-2xl"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-100 dark:bg-white/10">
                <ImageIcon className="h-7 w-7 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {language === "zh" ? "上传图表截图" : "Upload Chart Screenshot"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "zh" ? "拖拽或点击上传（支持 PNG、JPG，最大 5MB）" : "Drag & drop or click to upload (PNG, JPG, max 5MB)"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-500 dark:text-blue-400 font-medium">
                <Upload className="h-3.5 w-3.5" />
                {language === "zh" ? "视觉模型将直接分析图表图片" : "Vision model will analyze the chart image directly"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Input */}
      {mode === "text" && (
        <div className="rounded-[2.5rem] dark:rounded-2xl bg-white/50 dark:bg-[#11131A]/50 p-6 border-2 border-dashed border-slate-200 dark:border-white/10">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full min-h-[150px] bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none focus:outline-none leading-relaxed"
            placeholder={language === "zh" ? "描述您看到的图表内容，例如：这是一张过去6个月的沪深300指数走势图…" : "Describe the chart you're looking at..."}
          />
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading || (mode === "text" ? !inputText.trim() : !imageBase64)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="h-4 w-4" />
        {language === "zh" ? "AI 解读图表" : "Analyze Chart"}
      </button>

      {loading && <ScanningAnimation />}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:row-span-2 rounded-[2.5rem] dark:rounded-2xl bg-purple-100 dark:bg-[#11131A] p-8 shadow-xl shadow-purple-100/40 dark:shadow-none dark:border dark:border-white/10">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-[0.8em] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {t("chart.narrative.label", language)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-4">{result.summary}</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-200 px-4 py-1.5 dark:bg-purple-500/10 dark:border dark:border-purple-500/30">
              <AlertTriangle className="h-3.5 w-3.5 text-purple-700 dark:text-purple-400" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">{result.disclaimer}</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] dark:rounded-2xl bg-orange-100 dark:bg-[#11131A] p-8 shadow-xl shadow-orange-100/40 dark:shadow-none dark:border dark:border-white/10">
            <div className="mb-5 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-[0.8em] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {language === "zh" ? "风险指标" : "Risk Indicators"}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-[1.5rem] bg-white/60 px-4 py-3 dark:bg-white/5">
                <span className="text-sm text-slate-600 dark:text-slate-400">{language === "zh" ? "趋势" : "Trend"}</span>
                <span className={`text-sm font-bold ${trendColor}`}>{result.trend}</span>
              </div>
              {result.riskIndicators.map((indicator, i) => (
                <div key={i} className="flex items-start gap-2 rounded-[1.5rem] bg-white/60 px-4 py-3 dark:bg-white/5">
                  <span className="text-sm mt-0.5">⚠️</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] dark:rounded-2xl bg-blue-100 dark:bg-[#11131A] p-8 shadow-xl shadow-blue-100/40 dark:shadow-none dark:border dark:border-white/10">
            <div className="mb-5 flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-[0.8em] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {t("chart.history.label", language)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.historicalContext}</p>
          </div>

          {result.surveillance ? (
            <div className="md:col-span-2 rounded-[2.5rem] border border-rose-200 bg-rose-50/90 p-8 shadow-xl shadow-rose-100/30 dark:border-rose-500/20 dark:bg-rose-500/10 dark:shadow-none">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-rose-700 dark:text-rose-300" />
                      <span className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-300">
                        {language === "zh" ? "异常交易雷达" : "Abnormal Transaction Radar"}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-rose-900/80 dark:text-rose-100/80">
                      {result.surveillance.surveillanceSummary}
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-600/20">
                    {result.surveillance.marketManipulationRisk}
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  {result.surveillance.abnormalTransactions.map((signal) => (
                    <div key={signal.pattern} className="rounded-[1.75rem] bg-white/75 p-5 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{signal.pattern}</p>
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                          {signal.confidence}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{signal.evidence}</p>
                      <p className="mt-3 text-sm leading-relaxed text-rose-800/80 dark:text-rose-100/80">{signal.marketImpact}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white dark:bg-white dark:text-slate-950">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
                      <Search className="h-4 w-4" />
                      {language === "zh" ? "取证线索" : "Forensic Clues"}
                    </div>
                    <div className="mt-4 space-y-3">
                      {result.surveillance.forensicClues.map((clue) => (
                        <div key={clue} className="rounded-[1.25rem] bg-white/10 px-4 py-3 text-sm leading-relaxed dark:bg-slate-950/5">
                          {clue}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] bg-white/75 p-6 dark:bg-white/5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      <Sparkles className="h-4 w-4" />
                      {language === "zh" ? "建议动作" : "Recommended Actions"}
                    </div>
                    <div className="mt-4 space-y-3">
                      {result.surveillance.recommendedActions.map((action, index) => (
                        <div key={action} className="flex items-start gap-3 rounded-[1.25rem] bg-slate-50 px-4 py-3 dark:bg-white/5">
                          <span className="mt-0.5 text-sm font-bold text-slate-500 dark:text-slate-300">{index + 1}.</span>
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {!result && !loading && (
        <div className="rounded-2xl bg-slate-50/50 dark:bg-white/5 p-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {language === "zh" ? "上传图表图片或描述图表内容，AI 将为您解读" : "Upload a chart image or describe it, and AI will explain it"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChartExplainer;
