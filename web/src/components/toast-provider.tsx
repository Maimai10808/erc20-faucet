"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, OctagonAlert, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      const nextToast: ToastItem = { id, ...toast };

      setToasts((current) => [...current, nextToast]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3600);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            className="pointer-events-auto rounded-2xl border border-black/10 bg-[rgba(255,248,240,0.96)] p-4 shadow-[0_20px_50px_rgba(33,24,16,0.16)] backdrop-blur"
            key={toast.id}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <ToastIcon tone={toast.tone} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[color:var(--ink)]">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                className="rounded-full p-1 text-[color:var(--muted)] transition hover:bg-black/5 hover:text-[color:var(--ink)]"
                onClick={() => removeToast(toast.id)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") {
    return <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" />;
  }

  if (tone === "error") {
    return <OctagonAlert className="h-5 w-5 text-[color:var(--red)]" />;
  }

  return <Info className="h-5 w-5 text-[color:var(--blue)]" />;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
