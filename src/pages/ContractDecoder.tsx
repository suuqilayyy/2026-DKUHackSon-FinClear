import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  Download,
  EyeOff,
  FileEdit,
  ImageIcon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AnalysisConsentDialog } from "@/components/AnalysisConsentDialog";
import { AgentArena } from "@/components/AgentArena";
import { FeaturePageHeader } from "@/components/FeaturePageHeader";
import { RevisionReport } from "@/components/RevisionReport";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { Badge } from "@/components/ui/badge";
import { useUserMode } from "@/contexts/UserModeContext";
import { analyzeContract, analyzeContractImage, type ContractResult } from "@/lib/featherlessAI";
import {
  applyImageRedactions,
  getContractAnalysisProfile,
  type ConsentRecord,
  type ContractInputKind,
  type ImageRedactionArea,
} from "@/lib/privacy";
import { getDemoContractResult, getDemoContractText } from "@/lib/demoData";

type DecoderMode = ContractInputKind;

function createReceiptId() {
  return `receipt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function ContractDecoder() {
  const {
    language,
    analysisMode,
    setAiChecklist,
    setAnalysisMode,
    recordConsent,
    isDemoMode,
    setIsDemoMode,
  } = useUserMode();
  const [mode, setMode] = useState<DecoderMode>("text");
  const [contractText, setContractText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageRedactionAreas, setImageRedactionAreas] = useState<ImageRedactionArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractResult | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<ConsentRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDemoScenario = useCallback(() => {
    const demoText = getDemoContractText(language);
    const demoResult = getDemoContractResult(language);

    setIsDemoMode(true);
    setMode("text");
    setContractText(demoText);
    setResult(demoResult);
    setShowReport(false);
    setImagePreview(null);
    setImageBase64(null);
    setImageRedactionAreas([]);
    setAiChecklist(demoResult.checklist);
  }, [language, setAiChecklist, setIsDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      loadDemoScenario();
    }
  }, [isDemoMode, loadDemoScenario]);

  const copy =
    language === "zh"
      ? {
          title: "合同解码器",
          subtitle: "在发给云端模型前先完成 consent，支持文字自动脱敏与图片手动打码。",
          textMode: "粘贴文字",
          imageMode: "上传图片",
          textPlaceholder: "把合同条款粘贴到这里，我们会先让你确认共享范围，再进行风险分析。",
          uploadTitle: "上传合同图片",
          uploadHint: "支持 PNG / JPG，最大 5MB。脱敏模式下可先在本地框选敏感区域。",
          analyze: "开始隐私审阅",
          analyzing: "正在分析合同",
          risk: "风险评估",
          reasoning: "透明解释",
          clause: "关键条款翻译",
          redFlags: "红旗提示",
          checklist: "签署前检查项",
          privacyReceipt: "本次隐私 receipt",
          modeStandard: "标准",
          modeRedacted: "脱敏",
          report: "生成修订报告",
          export: "打开可打印报告",
          clear: "清除本地会话",
          empty: "粘贴合同文字或上传合同图片，然后先完成 consent 审阅。",
          imageOnly: "请先上传合同图片。",
          imageError: "请上传图片文件。",
          imageSizeError: "图片需小于 5MB。",
          analysisFailed: "分析失败，请稍后重试。",
          sessionCleared: "已清除当前本地会话数据。",
          consentSaved: "Consent receipt 已保存到本机。",
          noSuggestions: "这次分析没有生成修订建议，但你仍然可以导出风险报告。",
          imageBadge: "图片合同",
          textBadge: "文本合同",
        }
      : {
          title: "Contract Decoder",
          subtitle: "Review consent before anything reaches the cloud. Text can be auto-redacted and images can be manually blacked out first.",
          textMode: "Paste Text",
          imageMode: "Upload Image",
          textPlaceholder: "Paste contract language here. We'll show exactly what leaves the device before running risk analysis.",
          uploadTitle: "Upload Contract Image",
          uploadHint: "PNG or JPG, up to 5MB. In redacted mode you can blackout sensitive regions on-device first.",
          analyze: "Review Consent First",
          analyzing: "Analyzing contract",
          risk: "Risk Assessment",
          reasoning: "Transparent Reasoning",
          clause: "Clause Translation",
          redFlags: "Red Flags",
          checklist: "Before You Sign",
          privacyReceipt: "Privacy receipt",
          modeStandard: "Standard",
          modeRedacted: "Redacted",
          report: "Generate Revision Report",
          export: "Open Printable Report",
          clear: "Clear Local Session",
          empty: "Paste contract text or upload an image, then review consent before analysis.",
          imageOnly: "Upload a contract image first.",
          imageError: "Please upload an image file.",
          imageSizeError: "Image must be under 5MB.",
          analysisFailed: "Analysis failed. Please try again.",
          sessionCleared: "Local session data cleared.",
          consentSaved: "Consent receipt saved locally.",
          noSuggestions: "No revision suggestions were generated this time, but you can still open the printable risk report.",
          imageBadge: "Image contract",
          textBadge: "Text contract",
        };

  const handleImageSelection = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(copy.imageError);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(copy.imageSizeError);
      return;
    }

    const base64 = await readImageAsDataUrl(file);
    setMode("image");
    setImagePreview(base64);
    setImageBase64(base64);
    setImageRedactionAreas([]);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageRedactionAreas([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearSession = () => {
    setContractText("");
    removeImage();
    setResult(null);
    setShowReport(false);
    setConsentOpen(false);
    setLastReceipt(null);
    setAiChecklist([]);
    setIsDemoMode(false);
    toast.success(copy.sessionCleared);
  };

  const openConsent = () => {
    if (mode === "text" && !contractText.trim()) {
      return;
    }

    if (mode === "image" && !imageBase64) {
      toast.error(copy.imageOnly);
      return;
    }

    setConsentOpen(true);
  };

  const handleConsentConfirm = async ({
    content,
    processingMode,
    redactionSummary,
  }: {
    content: string;
    processingMode: "standard" | "redacted";
    redactionSummary: string;
    appliedRedactionCount: number;
  }) => {
    setConsentOpen(false);
    setLoading(true);
    setResult(null);

    try {
      let analysisResult: ContractResult;
      const profile = getContractAnalysisProfile(mode);

      if (mode === "image" && imageBase64) {
        const preparedImage =
          processingMode === "redacted"
            ? await applyImageRedactions(imageBase64, imageRedactionAreas)
            : imageBase64;
        analysisResult = await analyzeContractImage(preparedImage);
      } else {
        analysisResult = await analyzeContract(content.trim());
      }

      const receipt: ConsentRecord = {
        id: createReceiptId(),
        createdAt: new Date().toISOString(),
        feature: "contract-decoder",
        inputKind: mode,
        processingMode,
        provider: profile.provider,
        model: profile.model,
        retention: profile.retention,
        dataCategories: profile.dataCategories,
        redactionSummary:
          processingMode === "redacted"
            ? redactionSummary
            : language === "zh"
              ? "未应用脱敏。"
              : "No redactions applied.",
      };

      recordConsent(receipt);
      startTransition(() => {
        setLastReceipt(receipt);
        setResult(analysisResult);
        setShowReport(false);
        setAiChecklist(analysisResult.checklist ?? []);
      });
      toast.success(copy.consentSaved);
    } catch (error) {
      console.error(error);
      toast.error(copy.analysisFailed);
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.riskLevel?.includes("High") || result?.riskLevel?.includes("高")
      ? "bg-red-500 text-white dark:bg-red-500/15 dark:text-red-300"
      : result?.riskLevel?.includes("Medium") || result?.riskLevel?.includes("中")
        ? "bg-amber-500 text-white dark:bg-amber-500/15 dark:text-amber-300"
        : "bg-emerald-500 text-white dark:bg-emerald-500/15 dark:text-emerald-300";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <FeaturePageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        demoDescription={
          language === "zh"
            ? "一键载入掠夺性贷款样例，完整展示 RAG 法律证据、多智能体攻防、仲裁结论和可打印修订报告。"
            : "Load a predatory-loan scenario with the full RAG evidence layer, multi-agent battle, arbitration findings, and printable revision report."
        }
        demoHighlights={
          language === "zh"
            ? ["RAG 法律证据", "放贷方 Agent", "公益律师 Agent", "仲裁 Agent", "打印报告"]
            : ["RAG Evidence", "Lender Agent", "Public Counsel", "Arbitration", "Printable Report"]
        }
        onLaunchDemo={loadDemoScenario}
        demoActive={isDemoMode}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {analysisMode === "redacted" ? copy.modeRedacted : copy.modeStandard}
        </Badge>
        {isDemoMode ? (
          <Badge variant="outline" className="border-slate-300 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            {language === "zh" ? "录屏演示模式已开启" : "Recording demo mode active"}
          </Badge>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            mode === "text"
              ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
          }`}
        >
          <Type className="h-4 w-4" />
          {copy.textMode}
        </button>
        <button
          type="button"
          onClick={() => setMode("image")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            mode === "image"
              ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
          }`}
        >
          <Camera className="h-4 w-4" />
          {copy.imageMode}
        </button>
      </div>

      {mode === "text" ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[#11131A]/80">
          <textarea
            value={contractText}
            onChange={(event) => setContractText(event.target.value)}
            className="min-h-[180px] w-full resize-none bg-transparent text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
            placeholder={copy.textPlaceholder}
          />
        </div>
      ) : (
        <div
          className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/70 p-6 backdrop-blur-xl transition-colors hover:border-primary/40 dark:border-white/10 dark:bg-[#11131A]/80"
          onDrop={(event) => {
            event.preventDefault();
            void handleImageSelection(event.dataTransfer.files?.[0]);
          }}
          onDragOver={(event) => event.preventDefault()}
          onClick={() => {
            if (!imagePreview) {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => {
              void handleImageSelection(event.target.files?.[0]);
            }}
          />

          {imagePreview ? (
            <div className="relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage();
                }}
                className="absolute right-3 top-3 z-10 rounded-full bg-red-500/90 p-2 text-white transition-colors hover:bg-red-500"
              >
                <X className="h-4 w-4" />
              </button>
              <img src={imagePreview} alt="Contract preview" className="w-full max-h-[320px] rounded-[1.75rem] object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-slate-100 dark:bg-white/10">
                <ImageIcon className="h-7 w-7 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{copy.uploadTitle}</p>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{copy.uploadHint}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-blue-500 dark:text-blue-400">
                <Upload className="h-3.5 w-3.5" />
                {analysisMode === "redacted" ? copy.modeRedacted : copy.modeStandard}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openConsent}
          disabled={loading || (mode === "text" ? !contractText.trim() : !imageBase64)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? copy.analyzing : copy.analyze}
        </button>

        <button
          type="button"
          onClick={clearSession}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          <Trash2 className="h-4 w-4" />
          {copy.clear}
        </button>
      </div>

      {lastReceipt && (
        <div className="rounded-[2rem] border border-emerald-200/70 bg-emerald-50/80 p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{copy.privacyReceipt}</p>
              </div>
              <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
                {lastReceipt.provider} · {lastReceipt.model}
              </p>
              <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
                {lastReceipt.redactionSummary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-emerald-200 bg-white/70 text-emerald-700 dark:border-emerald-400/30 dark:bg-transparent dark:text-emerald-200">
                {lastReceipt.processingMode === "redacted" ? copy.modeRedacted : copy.modeStandard}
              </Badge>
              <Badge variant="outline" className="border-emerald-200 bg-white/70 text-emerald-700 dark:border-emerald-400/30 dark:bg-transparent dark:text-emerald-200">
                {lastReceipt.inputKind === "image" ? copy.imageBadge : copy.textBadge}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {loading && <ScanningAnimation />}

      {result ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {result.agentArena ? <AgentArena arena={result.agentArena} /> : null}

          <div className="rounded-[2.5rem] bg-[#FFE4E1]/90 p-8 shadow-xl shadow-[#FFE4E1]/40 backdrop-blur-xl dark:border dark:border-white/10 dark:bg-[#11131A]/80 dark:shadow-none">
            <div className="mb-5 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{copy.risk}</span>
            </div>
            <div className={`mb-5 inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${riskColor}`}>{result.riskLevel}</div>
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{copy.reasoning}</h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.transparentReasoning}</p>
          </div>

          <div className="rounded-[2.5rem] bg-[#E8F3F1]/90 p-8 shadow-xl shadow-[#E8F3F1]/40 backdrop-blur-xl dark:border dark:border-white/10 dark:bg-[#11131A]/80 dark:shadow-none">
            <div className="mb-5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{copy.clause}</span>
            </div>
            <p className="mb-4 text-base font-medium italic leading-relaxed text-slate-800 dark:text-slate-200">
              "{result.clauseQuote}"
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.clauseTranslation}</p>
          </div>

          {result.extractedText ? (
            <div className="md:col-span-2 rounded-[2.5rem] border border-slate-200/80 bg-slate-50/90 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-white/10 dark:bg-[#11131A]/80 dark:shadow-none">
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  OCR Transcript
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {result.extractedText}
              </p>
            </div>
          ) : null}

          {result.redFlags?.length ? (
            <div className="md:col-span-2 rounded-[2.5rem] bg-[#FFF3CD]/90 p-8 shadow-xl shadow-[#FFF3CD]/40 backdrop-blur-xl dark:border dark:border-white/10 dark:bg-[#11131A]/80 dark:shadow-none">
              <div className="mb-5 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{copy.redFlags}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {result.redFlags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-[1.5rem] bg-white/60 p-4 dark:bg-white/5">
                    <span className="text-base text-amber-600 dark:text-amber-300">•</span>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {result.checklist?.length ? (
            <div className="md:col-span-2 rounded-[2.5rem] border border-purple-200 bg-purple-50/80 p-8 shadow-xl shadow-purple-100/40 backdrop-blur-xl dark:border-purple-700/30 dark:bg-purple-900/20 dark:shadow-none">
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                <span className="text-sm font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">{copy.checklist}</span>
              </div>
              <div className="space-y-3">
                {result.checklist.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-[1.5rem] bg-white/70 p-4 dark:bg-white/5">
                    <span className="mt-0.5 text-sm font-bold text-purple-700 dark:text-purple-300">{index + 1}.</span>
                    <p className="text-sm leading-relaxed text-purple-900 dark:text-purple-100">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-purple-200 pt-4 dark:border-purple-700/30">
                <button
                  type="button"
                  onClick={() => {
                    if (!result.revisionSuggestions?.length) {
                      toast.info(copy.noSuggestions);
                    }
                    setShowReport(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-purple-700"
                >
                  <FileEdit className="h-4 w-4" />
                  {copy.report}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-800/30"
                >
                  <Download className="h-4 w-4" />
                  {copy.export}
                </button>
              </div>
            </div>
          ) : null}

          {showReport ? (
            <div className="md:col-span-2">
              <RevisionReport result={result} onClose={() => setShowReport(false)} language={language} />
            </div>
          ) : null}
        </div>
      ) : !loading ? (
        <div className="rounded-2xl bg-slate-50/60 p-8 text-center dark:bg-white/5">
          <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500">{copy.empty}</p>
        </div>
      ) : null}

      <AnalysisConsentDialog
        open={consentOpen}
        onOpenChange={setConsentOpen}
        language={language}
        inputKind={mode}
        draftText={contractText}
        imageSrc={imagePreview}
        imageAreas={imageRedactionAreas}
        onImageAreasChange={setImageRedactionAreas}
        processingMode={analysisMode}
        onProcessingModeChange={setAnalysisMode}
        isSubmitting={loading}
        onConfirm={handleConsentConfirm}
      />
    </div>
  );
}
