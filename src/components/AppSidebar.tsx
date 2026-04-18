import { FileText, BarChart3, Search, HelpCircle, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Contract Decoder", url: "/", icon: FileText },
  { title: "Chart Explainer", url: "/chart-explainer", icon: BarChart3 },
  { title: "Jargon Scanner", url: "/jargon-scanner", icon: Search },
  { title: "Question Generator", url: "/question-generator", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 dark:border-white/5 bg-white dark:bg-[#090A0F]">
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                FinClear
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 tracking-wide uppercase">AI Risk Translator</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 mt-2 dark:text-slate-400">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      activeClassName="bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-semibold"
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            FinClear is a risk translator, not an investment advisor.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
