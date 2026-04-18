import { FileText, BarChart3, Search, HelpCircle, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Contract Decoder", url: "/", icon: FileText },
  { title: "Chart Explainer", url: "/chart-explainer", icon: BarChart3 },
  { title: "Jargon Scanner", url: "/jargon-scanner", icon: Search },
  { title: "Question Generator", url: "/question-generator", icon: HelpCircle },
];

export function IconSidebar() {
  return (
    <>
      {/* Logo */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-8">
        <Shield className="h-6 w-6 text-primary-foreground" />
      </div>

      {/* Nav Icons */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => (
          <Tooltip key={item.title} delayDuration={0}>
            <TooltipTrigger asChild>
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 dark:bg-primary/20 text-primary"
                      : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </>
  );
}
