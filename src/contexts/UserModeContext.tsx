import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ConsentRecord, ProcessingMode } from "@/lib/privacy";

export type ThemeMode = "light" | "dark";
export type Language = "en" | "zh";

interface StoredPrivacyState {
  version: 1;
  analysisMode: ProcessingMode;
  consentLedger: ConsentRecord[];
}

const PRIVACY_STORAGE_KEY = "finclear:privacy-state:v1";

function readStoredPrivacyState(): StoredPrivacyState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredPrivacyState>;
    if (parsed.version !== 1) {
      return null;
    }

    return {
      version: 1,
      analysisMode: parsed.analysisMode === "standard" ? "standard" : "redacted",
      consentLedger: Array.isArray(parsed.consentLedger) ? parsed.consentLedger : [],
    };
  } catch (error) {
    console.warn("Failed to read privacy preferences", error);
    return null;
  }
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  highClarity: boolean;
  setHighClarity: (v: boolean) => void;
  fontScale: number;
  setFontScale: (v: number) => void;
  aiChecklist: string[];
  setAiChecklist: (items: string[]) => void;
  analysisMode: ProcessingMode;
  setAnalysisMode: (mode: ProcessingMode) => void;
  consentLedger: ConsentRecord[];
  recordConsent: (record: ConsentRecord) => void;
  clearConsentLedger: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const storedPrivacyState = useMemo(() => readStoredPrivacyState(), []);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<Language>("en");
  const [highClarity, setHighClarity] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [aiChecklist, setAiChecklist] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<ProcessingMode>(storedPrivacyState?.analysisMode ?? "redacted");
  const [consentLedger, setConsentLedger] = useState<ConsentRecord[]>(storedPrivacyState?.consentLedger ?? []);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (highClarity) {
      document.documentElement.style.fontSize = `${fontScale * 100}%`;
    } else {
      document.documentElement.style.fontSize = "";
    }
  }, [highClarity, fontScale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const payload: StoredPrivacyState = {
      version: 1,
      analysisMode,
      consentLedger,
    };

    window.localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(payload));
  }, [analysisMode, consentLedger]);

  const recordConsent = (record: ConsentRecord) => {
    setConsentLedger((current) => [record, ...current].slice(0, 25));
  };

  const clearConsentLedger = () => {
    setConsentLedger([]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark: theme === "dark",
        language,
        setLanguage,
        highClarity,
        setHighClarity,
        fontScale,
        setFontScale,
        aiChecklist,
        setAiChecklist,
        analysisMode,
        setAnalysisMode,
        consentLedger,
        recordConsent,
        clearConsentLedger,
        isDemoMode,
        setIsDemoMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useUserMode must be used within UserModeProvider");
  return context;
}
