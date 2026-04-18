import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type AuthView = "sign-in" | "sign-up";

interface AuthModalProps {
  open: boolean;
  view: AuthView;
  onOpenChange: (open: boolean) => void;
  onViewChange: (view: AuthView) => void;
}

const authCopy = {
  "sign-in": {
    subtitle: "Sign in to securely access your contract analysis.",
    primaryLabel: "Sign In",
    switchPrompt: "Don't have an account?",
    switchAction: "Sign up",
    nextView: "sign-up" as const,
  },
  "sign-up": {
    subtitle: "Create your secure workspace to keep every contract review in one place.",
    primaryLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchAction: "Sign in",
    nextView: "sign-in" as const,
  },
};

export function AuthModal({ open, view, onOpenChange, onViewChange }: AuthModalProps) {
  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const currentCopy = authCopy[view];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--foreground)/0.16)] px-4 backdrop-blur-sm animate-in fade-in-0 duration-200 dark:bg-[hsl(var(--background)/0.72)]"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md rounded-[2rem] border border-[hsl(var(--background)/0.55)] bg-[hsl(var(--background)/0.8)] p-8 text-foreground shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 fade-in-0 duration-200 dark:border-[hsl(var(--border)/0.9)] dark:bg-[hsl(var(--card)/0.82)] sm:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close authentication modal"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.55)] text-muted-foreground transition-colors hover:bg-[hsl(var(--accent)/0.5)] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-8 pr-10">
          <h2 id="auth-modal-title" className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to FinClear
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {currentCopy.subtitle}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label htmlFor="auth-email" className="mb-2 block text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[hsl(var(--input)/0.95)] bg-[hsl(var(--background)/0.55)] px-4 py-3 text-foreground outline-none transition focus:border-[hsl(var(--ring)/0.9)] focus:ring-2 focus:ring-[hsl(var(--ring)/0.25)] dark:bg-[hsl(var(--background)/0.18)]"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-2 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={view === "sign-in" ? "current-password" : "new-password"}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[hsl(var(--input)/0.95)] bg-[hsl(var(--background)/0.55)] px-4 py-3 text-foreground outline-none transition focus:border-[hsl(var(--ring)/0.9)] focus:ring-2 focus:ring-[hsl(var(--ring)/0.25)] dark:bg-[hsl(var(--background)/0.18)]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-foreground py-3 font-medium text-background transition-transform hover:scale-[1.01]"
          >
            {currentCopy.primaryLabel}
          </button>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.38)] px-4 py-3 font-medium text-foreground transition-colors hover:bg-[hsl(var(--accent)/0.45)] dark:bg-[hsl(var(--background)/0.12)]"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--background)/0.95)] text-sm font-semibold text-primary shadow-sm">
              G
            </span>
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {currentCopy.switchPrompt}{" "}
          <button
            type="button"
            onClick={() => onViewChange(currentCopy.nextView)}
            className="font-semibold text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            {currentCopy.switchAction}
          </button>
        </p>
      </div>
    </div>,
    document.body,
  );
}