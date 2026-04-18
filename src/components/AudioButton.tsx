import { useState, useRef, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { useUserMode } from "@/contexts/UserModeContext";

const dialectsCn = [
  { label: "普通话 (Mandarin)", code: "zh" },
  { label: "粤语 (Cantonese)", code: "yue" },
  { label: "四川话 (Sichuanese)", code: "sc" },
];

const dialectsEn = [
  { label: "English (US)", code: "en-us" },
  { label: "English (UK)", code: "en-uk" },
];

export function AudioButton() {
  const { language, highClarity } = useUserMode();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Only visible in High Clarity Mode
  if (!highClarity) return null;

  const dialects = language === "zh" ? dialectsCn : dialectsEn;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        title={language === "zh" ? "朗读 (方言支持)" : "Read aloud"}
        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
      >
        <Volume2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xl bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/10 shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
          {dialects.map((d) => (
            <button
              key={d.code}
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              🔊 {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
