import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { ThemePreset } from '../types/showcase';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => '',
  dismiss: () => {},
  clearAll: () => {},
});

interface ToastProviderProps {
  children: ReactNode;
  activeTheme: ThemePreset;
  radiusToken?: string;
}

export function ToastProvider({
  children,
  activeTheme,
  radiusToken = '0.5rem',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = {
        ...options,
        id,
        variant: options.variant ?? 'info',
      };

      setToasts((prev) => [...prev.slice(-4), item]);

      const duration = options.durationMs ?? 4200;
      if (duration > 0) {
        const timer = window.setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const tokens = activeTheme.tokens;

  const getVariantMeta = (variant: ToastVariant) => {
    switch (variant) {
      case 'success':
        return { icon: CheckCircle2, accent: tokens.success };
      case 'warning':
        return { icon: AlertTriangle, accent: tokens.warning };
      case 'error':
        return { icon: XCircle, accent: tokens.danger };
      default:
        return { icon: Info, accent: tokens.primary };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss, clearAll }}>
      {children}

      {/* Global Themed Toast Stack */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((item) => {
          const { icon: Icon, accent } = getVariantMeta(item.variant);
          return (
            <div
              key={item.id}
              role="status"
              className="pointer-events-auto border shadow-lg px-3.5 py-3 flex items-start gap-3 transition-all duration-150"
              style={{
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
                color: tokens.text,
                borderRadius: radiusToken,
              }}
            >
              <Icon
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: accent }}
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-xs font-semibold leading-snug">{item.title}</div>
                {item.description && (
                  <div
                    className="text-[11px] leading-relaxed"
                    style={{ color: tokens.textMuted }}
                  >
                    {item.description}
                  </div>
                )}
                {item.action && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        item.action?.onClick();
                        dismiss(item.id);
                      }}
                      className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80"
                      style={{ color: accent }}
                    >
                      {item.action.label}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="p-1 rounded hover:opacity-75 shrink-0"
                style={{ color: tokens.textMuted }}
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
