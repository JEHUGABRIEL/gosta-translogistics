"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  tone: ToastTone;
  message: string;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TONES: Record<
  ToastTone,
  { icon: ReactNode; className: string }
> = {
  success: {
    icon: <CheckCircle2 size={17} />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  error: {
    icon: <AlertCircle size={17} />,
    className: "border-red-200 bg-red-50 text-red-900",
  },
  info: {
    icon: <Info size={17} />,
    className: "border-[var(--line)] bg-[var(--surface)] text-[var(--navy-deep)]",
  },
};

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (tone: ToastTone, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, tone, message }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => notify("success", message),
      error: (message) => notify("error", message),
      info: (message) => notify("info", message),
    }),
    [notify]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl ${TONES[toast.tone].className}`}
          >
            <span className="mt-0.5 shrink-0">{TONES[toast.tone].icon}</span>
            <p className="flex-1 text-[13.5px] leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Fermer la notification"
              className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAdminToast doit être utilisé dans AdminToastProvider.");
  }
  return context;
}
