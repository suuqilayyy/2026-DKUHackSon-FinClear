import { PlayCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface FeaturePageHeaderProps {
  title: string;
  subtitle: string;
  demoDescription: string;
  demoHighlights: string[];
  onLaunchDemo: () => void;
  demoActive?: boolean;
}

export function FeaturePageHeader({
  title,
  subtitle,
  demoDescription,
  demoHighlights,
  onLaunchDemo,
  demoActive = false,
}: FeaturePageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[2.5rem] border border-white/25 bg-white/35 p-6 shadow-xl shadow-slate-200/20 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0B0F19]/55 dark:shadow-none">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <Sparkles className="h-4 w-4" />
            Demo Ready
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white">{title}</h1>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="max-w-sm rounded-[2rem] bg-slate-950 p-5 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-75">Recording Mode</p>
          <p className="mt-3 text-sm leading-relaxed opacity-90">{demoDescription}</p>
          <button
            type="button"
            onClick={onLaunchDemo}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
          >
            <PlayCircle className="h-4 w-4" />
            {demoActive ? "Reload Demo" : "Load Full Demo"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {demoHighlights.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className="rounded-full border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
