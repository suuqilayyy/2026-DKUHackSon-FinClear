import { useState } from "react";
import { Sun, Moon, FolderOpen, ClipboardCheck } from "lucide-react";
import { useUserMode } from "@/contexts/UserModeContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const checklistItems = [
  "What is the maximum my interest rate can increase to?",
  "Are there any fees for paying off my loan early?",
  "What happens if I miss a payment — is there a grace period?",
];

export function RightPanel() {
  const { isDark, setTheme } = useUserMode();
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const toggleCheck = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const completedCount = checked.filter(Boolean).length;

  return (
    <div className="flex flex-col h-full p-6">
      {/* Profile & Theme Toggle */}
      <div className="pb-6 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold text-sm">
                U
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Hi, Investor</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Free Plan</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* My Library */}
      <div className="py-6 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">My Library</h3>
        </div>
        <div className="space-y-3">
          {["Personal Loan Agreement", "Credit Card Terms", "Mortgage Draft"].map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                <FolderOpen className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{doc}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{i === 0 ? "Analyzed" : "Draft"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Storage Used</span>
            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">3 / 10</span>
          </div>
          <Progress value={30} className="h-1.5" />
        </div>
      </div>

      {/* Before You Sign Checklist */}
      <div className="py-6 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Before You Sign</h3>
        </div>
        <div className="space-y-3">
          {checklistItems.map((item, i) => (
            <label
              key={i}
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => toggleCheck(i)}
            >
              <Checkbox
                checked={checked[i]}
                className="mt-0.5 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className={`text-xs leading-relaxed transition-all ${checked[i] ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-primary/5 dark:bg-primary/10">
          <p className="text-[10px] text-primary font-medium">{completedCount}/3 questions reviewed</p>
        </div>
      </div>
    </div>
  );
}
