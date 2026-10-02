import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastKind = "success" | "info" | "error";
interface ToastItem { id: number; kind: ToastKind; message: string }
interface ToastApi {
  success: (m: string) => void;
  info: (m: string) => void;
  error: (m: string) => void;
  /** Use for buttons whose backend feature is planned but not built yet. */
  notImplemented: (feature: string, phase: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
const ICON: Record<ToastKind, string> = { success: "✓", info: "ℹ", error: "!" };
let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextId++;
    setItems((cur) => [...cur, { id, kind, message }]);
    setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 3000);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      info: (m) => push("info", m),
      error: (m) => push("error", m),
      notImplemented: (feature, phase) => push("info", `${feature} is not implemented yet (planned for Phase ${phase}).`),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="toast">
            <span className="tico" style={t.kind === "error" ? { color: "var(--danger)" } : undefined}>{ICON[t.kind]}</span> {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
