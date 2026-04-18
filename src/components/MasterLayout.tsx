import { AlertTriangle } from "lucide-react";
import { IconSidebar } from "@/components/IconSidebar";
import { RightPanel } from "@/components/RightPanel";

interface MasterLayoutProps {
  children: React.ReactNode;
}

export function MasterLayout({ children }: MasterLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#050505]">
      {/* Column 1: Icon Sidebar */}
      <aside className="w-24 h-full flex flex-col items-center py-8 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#090A0F] shrink-0">
        <IconSidebar />
      </aside>

      {/* Column 2: Main Workspace */}
      <main className="flex-1 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="p-6 md:p-8 lg:p-10">
          {children}
        </div>
        <footer className="border-t border-border/40 dark:border-white/5 bg-white/80 dark:bg-[#090A0F]/80 backdrop-blur-sm px-6 py-3">
          <div className="flex items-start gap-3 max-w-3xl">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>Disclaimer:</strong> FinClear is a risk translator, not an investment advisor.
            </p>
          </div>
        </footer>
      </main>

      {/* Column 3: Right Panel */}
      <aside className="w-[350px] h-full overflow-y-auto border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#090A0F] shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <RightPanel />
      </aside>
    </div>
  );
}
