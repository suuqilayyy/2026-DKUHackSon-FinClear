import { Link, useNavigate } from "react-router-dom";
import { useUserMode } from "@/contexts/UserModeContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { Shield, FileText, BarChart3, Search, Sun, Moon, ArrowRight, Lightbulb, Lock, Sparkles, HelpCircle } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, setTheme, setIsDemoMode } = useUserMode();
  const { openAuthModal } = useAuthModal();
  const bgImage = isDark ? "/bg-dark.jpg" : "/bg-light.jpg";

  const launchDemo = (path = "/dashboard") => {
    setIsDemoMode(true);
    navigate(path);
  };

  const featureCards = [
    { icon: FileText, title: "Contract Decoder", desc: "Plain-language risk analysis", path: "/dashboard" },
    { icon: BarChart3, title: "Chart Explainer", desc: "Trend plus abnormal transaction radar", path: "/dashboard/chart-explainer" },
    { icon: Search, title: "Jargon Scanner", desc: "Detect real terms vs marketing speak", path: "/dashboard/jargon-scanner" },
    { icon: HelpCircle, title: "Question Generator", desc: "Negotiation questions before signing", path: "/dashboard/question-generator" },
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundImage: `url('${bgImage}')`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/10 dark:from-black/60 dark:to-black/30" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-white dark:bg-white dark:text-slate-900">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">FinClear</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-slate-700 transition-colors hover:bg-white/30 dark:text-white dark:hover:bg-white/10"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("sign-in")}
            className="inline-flex items-center rounded-full border border-[hsl(var(--background)/0.6)] bg-[hsl(var(--background)/0.18)] px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-[hsl(var(--background)/0.28)]"
          >
            Sign In
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-md text-slate-800 transition-colors hover:bg-white/30 dark:text-white dark:hover:bg-white/10"
          >
            Go to Workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col lg:flex-row items-start lg:items-center px-8 lg:px-12 pb-16">
        <div className="flex-1 pt-12 lg:pt-0">
          <h1 className="text-7xl lg:text-9xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            Clarity in
            <br />
            Every Contract.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-700 dark:text-slate-300">
            AI-powered financial translation with redacted uploads, explicit consent receipts, and plain-language risk analysis before you sign.
          </p>

          {/* Quick Action Bar */}
          <div className="mt-12 flex flex-col sm:flex-row max-w-3xl items-center gap-4">
            <div className="flex w-full flex-1 items-center gap-2 rounded-full border border-white/30 bg-white/40 p-2 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/40">
              <input
                type="text"
                placeholder="Paste a confusing financial term here..."
                className="flex-1 bg-transparent px-6 py-3 text-base text-slate-800 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-slate-400"
              />
              <Link
                to="/dashboard"
                className="shrink-0 rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Decode Now
              </Link>
            </div>
            
            <button
              type="button"
              onClick={() => {
                launchDemo("/dashboard");
              }}
              className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.6)]"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <Sparkles className="h-5 w-5" />
              Hackathon Demo
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="relative mt-16 lg:mt-0 grid w-full gap-4 lg:w-[360px] shrink-0">
          {featureCards.map((card, i) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/20 bg-white/30 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B0F19]/50"
              style={{ marginRight: i % 2 === 0 ? "1.5rem" : 0 }}
            >
              <card.icon className="mb-3 h-5 w-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">{card.title}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{card.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={card.path}
                  className="inline-flex items-center rounded-full border border-white/30 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Open
                </Link>
                <button
                  type="button"
                  onClick={() => launchDemo(card.path)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <section className="relative z-10 bg-white dark:bg-[#050505] px-8 lg:px-12 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Finance shouldn't be<br />a black box.
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mb-16 leading-relaxed">
            We built FinClear because millions of people sign financial contracts they don't fully understand.
            Our AI translates complex legalese and market data into plain language while showing what data is shared, with which model, and under which consent mode — so you can make informed
            decisions with confidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Radical Honesty",
                desc: "No hidden agendas. We highlight the risks others bury in the fine print, giving you a clear picture before you commit.",
              },
              {
                icon: Shield,
                title: "Your Personal Advocate",
                desc: "Think of us as the financially-savvy friend you always wished you had — translating jargon and watching your back.",
              },
              {
                icon: Lock,
                title: "Ironclad Privacy",
                desc: "Redacted mode masks sensitive fields on-device first, then records a local consent receipt showing which provider and model processed the analysis.",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="group pt-6 border-t border-slate-200 dark:border-white/10">
                <pillar.icon className="h-6 w-6 mb-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
