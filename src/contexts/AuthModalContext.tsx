import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AuthModal, type AuthView } from "@/components/AuthModal";

interface AuthModalContextValue {
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("sign-in");

  const openAuthModal = useCallback((nextView: AuthView = "sign-in") => {
    setView(nextView);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openAuthModal,
      closeAuthModal,
    }),
    [closeAuthModal, openAuthModal],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal open={isOpen} view={view} onOpenChange={setIsOpen} onViewChange={setView} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }

  return context;
}