import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FolderOpen,
  HelpCircle,
  Moon,
  OctagonAlert,
  Search,
  Shield,
  Sun,
  ZoomIn,
  BarChart3,
  FileWarning,
  X,
} from "lucide-react";

import { PrivacyLedgerCard } from "@/components/PrivacyLedgerCard";
import { RevisionReport } from "@/components/RevisionReport";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthModalProvider, useAuthModal } from "@/contexts/AuthModalContext";
import { UserModeProvider, useUserMode } from "@/contexts/UserModeContext";
import { getDemoContractResult } from "@/lib/demoData";
import { t } from "@/lib/i18n";
import type { ContractResult } from "@/lib/featherlessAI";
import ChartExplainer from "@/pages/ChartExplainer";
import ContractDecoder from "@/pages/ContractDecoder";
import JargonScanner from "@/pages/JargonScanner";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import QuestionGenerator from "@/pages/QuestionGenerator";

const queryClient = new QueryClient();

const navItems = [
  { titleKey: "nav.decoder", url: "/dashboard", icon: FileText },
  { titleKey: "nav.chart", url: "/dashboard/chart-explainer", icon: BarChart3 },
  { titleKey: "nav.jargon", url: "/dashboard/jargon-scanner", icon: Search },
  { titleKey: "nav.questions", url: "/dashboard/question-generator", icon: HelpCircle },
];



function RightRail() {
  const {
    aiChecklist,
    analysisMode,
    fontScale,
    highClarity,
    isDemoMode,
    isDark,
    language,
    setFontScale,
    setHighClarity,
    setIsDemoMode,
    setLanguage,
    setTheme,
  } = useUserMode();
  const { openAuthModal } = useAuthModal();
  const [checked, setChecked] = useState<boolean[]>([]);

  const defaultChecklist = useMemo(
    () => [t("checklist.0", language), t("checklist.1", language), t("checklist.2", language)],
    [language],
  );
  const checklistItems = useMemo(
    () => (aiChecklist.length ? aiChecklist : defaultChecklist),
    [aiChecklist, defaultChecklist],
  );

  useEffect(() => {
    setChecked(checklistItems.map(() => false));
  }, [checklistItems]);

  const completedCount = checked.filter(Boolean).length;
  const savedContracts = [t("saved.0", language), t("saved.1", language), t("saved.2", language)];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-white">
            HI
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Hi, Investor</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {analysisMode === "redacted"
                ? language === "zh"
                  ? "默认使用脱敏模式"
                  : "Defaulting to redacted mode"
                : language === "zh"
                  ? "默认使用标准模式"
                  : "Defaulting to standard mode"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 rounded-full bg-slate-100 p-0.5 dark:bg-white/10">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              language === "en"
                ? "bg-white text-slate-800 shadow-sm dark:bg-white/20 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("zh")}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              language === "zh"
                ? "bg-white text-slate-800 shadow-sm dark:bg-white/20 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            中文
          </button>
        </div>
      </div>

      {isDemoMode ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            Demo Mode
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
            {language === "zh"
              ? "当前页面会自动载入评委可直接观看的完整演示素材。"
              : "Each feature page can now load a full judge-facing demo scenario on demand."}
          </p>
          <button
            type="button"
            onClick={() => setIsDemoMode(false)}
            className="mt-3 inline-flex rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
          >
            {language === "zh" ? "退出演示模式" : "Exit Demo Mode"}
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-semibold text-slate-800 dark:text-white">{t("highclarity", language)}</span>
          </div>
          <button
            type="button"
            onClick={() => setHighClarity(!highClarity)}
            className={`relative h-6 w-11 rounded-full transition-colors ${highClarity ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
          >
            <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${highClarity ? "translate-x-5" : ""}`} />
          </button>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">{t("highclarity.sub", language)}</p>

        {highClarity ? (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t("fontsize", language)}</span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{Math.round(fontScale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">A</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={fontScale}
                onChange={(event) => setFontScale(parseFloat(event.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-500 dark:bg-white/10"
              />
              <span className="text-base font-bold text-slate-400 dark:text-slate-500">A</span>
            </div>
          </div>
        ) : null}
      </div>

      <PrivacyLedgerCard />

      <button
        type="button"
        onClick={() => openAuthModal("sign-in")}
        className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.34)] px-4 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-[hsl(var(--background)/0.5)] dark:bg-[hsl(var(--background)/0.12)]"
      >
        {t("signin", language)}
      </button>

      <div className="rounded-[2rem] bg-white p-5 shadow-sm dark:border dark:border-white/10 dark:bg-[#11131A]">
        <div className="mb-4 flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{t("saved", language)}</h3>
        </div>

        <div className="flex flex-col gap-3">
          {savedContracts.map((item, index) => (
            <div key={item} className="flex items-center justify-between rounded-[1.25rem] bg-white px-4 py-3 dark:bg-white/5">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{index === 0 ? t("saved.analyzed", language) : t("saved.draft", language)}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-5 shadow-xl shadow-slate-200/40 dark:border dark:border-white/10 dark:bg-[#11131A] dark:shadow-none">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-white">{t("checklist", language)}</h3>
        </div>

        <div className="flex flex-col gap-4">
          {checklistItems.map((item, index) => (
            <label key={`${item}-${index}`} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={checked[index] ?? false}
                onChange={() =>
                  setChecked((current) => current.map((value, currentIndex) => (currentIndex === index ? !value : value)))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 dark:border-slate-600 dark:bg-transparent"
              />
              <span className={`text-sm leading-relaxed ${checked[index] ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                {item}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out"
              style={{ width: `${checklistItems.length ? (completedCount / checklistItems.length) * 100 : 0}%` }}
            />
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {completedCount === checklistItems.length && checklistItems.length
              ? t("allset", language)
              : `${completedCount} / ${checklistItems.length} ${t("completed", language)}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftSidebar() {
  const [showPredatoryModal, setShowPredatoryModal] = useState(false);
  const [showPredatoryReport, setShowPredatoryReport] = useState(false);
  const { language } = useUserMode();

  return (
    <>
      <div className="flex h-full flex-col gap-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white transition-transform group-hover:scale-105 dark:bg-white dark:text-slate-900">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-800 dark:text-white">FinClear</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowPredatoryModal(true)}
          className="rounded-xl border border-red-300/50 bg-red-100/60 px-3 py-2.5 text-left text-xs font-bold text-red-700 transition-colors hover:bg-red-200/70 dark:border-red-700/50 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/50"
        >
          {t("simulate", language)}
        </button>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.titleKey}
              to={item.url}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/50 text-slate-900 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-white/30 dark:text-slate-400 dark:hover:bg-white/5"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{t(item.titleKey, language)}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {showPredatoryModal && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/40 backdrop-blur-md" onClick={() => setShowPredatoryModal(false)}>
          <div
            className="relative mx-4 w-full max-w-lg rounded-[2rem] border-2 border-red-500/50 bg-red-50/95 p-10 shadow-[0_0_50px_rgba(239,68,68,0.2)] dark:bg-[#1A0505]/95"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPredatoryModal(false)}
              className="absolute right-4 top-4 text-red-400 transition-colors hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-100 dark:border-red-800/50 dark:bg-red-900/30">
                <OctagonAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-3xl font-bold text-red-600 dark:text-red-400">{t("predatory.title", language)}</h2>
            <p className="mb-6 text-center text-sm leading-relaxed text-red-800/80 dark:text-red-300/80">{t("predatory.body", language)}</p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPredatoryModal(false);
                  setShowPredatoryReport(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-colors hover:bg-red-700"
              >
                <FileWarning className="h-4 w-4" />
                {t("predatory.report", language)}
              </button>
              <button
                type="button"
                onClick={() => setShowPredatoryModal(false)}
                className="w-full rounded-full py-3 text-sm font-medium text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {t("predatory.dismiss", language)}
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {showPredatoryReport ? (
        <RevisionReport
          result={getDemoContractResult(language)}
          onClose={() => setShowPredatoryReport(false)}
          language={language}
          variant="regulator"
        />
      ) : null}
    </>
  );
}

function Resizer({ onResize }: { onResize: (delta: number) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onResize(e.movementX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, onResize]);

  return (
    <div
      onMouseDown={() => setIsDragging(true)}
      className="w-3 flex-shrink-0 cursor-col-resize hover:bg-black/10 dark:hover:bg-white/10 mx-1 rounded-[2rem] transition-colors active:bg-slate-300 dark:active:bg-slate-700/50"
    />
  );
}

function DashboardShell() {
  const { fontScale, highClarity, isDark, language } = useUserMode();
  const bgImage = isDark ? "/bg-dark.jpg" : "/bg-light.jpg";
  const fontFamily = language === "zh" ? "'Noto Sans SC', sans-serif" : undefined;
  const glassPanel = "bg-white/20 backdrop-blur-2xl border border-white/20 dark:bg-[#0B0F19]/40 dark:border-white/5";

  const [leftWidth, setLeftWidth] = useState(240);
  const [rightWidth, setRightWidth] = useState(320);

  const handleLeftResize = useCallback((delta: number) => {
    setLeftWidth((w) => Math.max(180, Math.min(480, w + delta)));
  }, []);

  const handleRightResize = useCallback((delta: number) => {
    setRightWidth((w) => Math.max(260, Math.min(500, w - delta)));
  }, []);

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundImage: `url('${bgImage}')`, backgroundPosition: "center", backgroundSize: "cover", fontFamily }}
    >
      <div className="absolute inset-0 z-[1] bg-white/20 dark:bg-black/40" />

      <div className="relative z-10 flex h-full gap-2 p-4">
        <aside style={{ width: leftWidth }} className={`h-full shrink-0 overflow-y-auto rounded-[2rem] p-6 ${glassPanel}`}>
          <LeftSidebar />
        </aside>

        <Resizer onResize={handleLeftResize} />

        <main
          className={`h-full flex-1 overflow-y-auto rounded-[2rem] p-6 transition-all duration-200 ${glassPanel}`}
        >
          <Routes>
            <Route index element={<ContractDecoder />} />
            <Route path="chart-explainer" element={<ChartExplainer />} />
            <Route path="jargon-scanner" element={<JargonScanner />} />
            <Route path="question-generator" element={<QuestionGenerator />} />
          </Routes>
        </main>

        <Resizer onResize={handleRightResize} />

        <aside style={{ width: rightWidth }} className={`h-full shrink-0 overflow-y-auto rounded-[2rem] p-6 ${glassPanel}`}>
          <RightRail />
        </aside>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserModeProvider>
          <AuthModalProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard/*" element={<DashboardShell />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthModalProvider>
        </UserModeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
