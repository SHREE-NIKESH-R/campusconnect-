import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg min-w-[280px] max-w-sm"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(16px)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              {toast.type === "success" && (
                <CheckCircle
                  size={18}
                  className="text-green-500 flex-shrink-0"
                />
              )}
              {toast.type === "error" && (
                <XCircle size={18} className="text-red-500 flex-shrink-0" />
              )}
              {toast.type === "info" && (
                <AlertCircle
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                />
              )}
              <p
                className="text-sm font-medium flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                {toast.message}
              </p>
              <button
                onClick={() => remove(toast.id)}
                className="flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.show;
};
