import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export type OffcanvasSide = 'right' | 'left';
export type OffcanvasSize = 'sm' | 'md' | 'lg';

interface ThemedOffcanvasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  side?: OffcanvasSide;
  size?: OffcanvasSize;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const SIZE_CLASS: Record<OffcanvasSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
};

export function ThemedOffcanvas({
  open,
  onClose,
  title,
  subtitle,
  side = 'right',
  size = 'md',
  headerActions,
  footer,
  children,
}: ThemedOffcanvasProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isRight = side === 'right';

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ justifyContent: isRight ? 'flex-end' : 'flex-start' }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Offcanvas Panel */}
      <div
        className={`relative z-10 w-full ${SIZE_CLASS[size]} h-full flex flex-col shadow-2xl ${
          isRight ? 'border-l' : 'border-r'
        }`}
        style={{
          backgroundColor: 'var(--d-surface)',
          borderColor: 'var(--d-border)',
          color: 'var(--d-text)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Offcanvas Header */}
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3 shrink-0"
          style={{
            borderColor: 'var(--d-border)',
            backgroundColor: 'var(--d-header)',
          }}
        >
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-snug truncate">{title}</h2>
            {subtitle && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--d-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded border hover:opacity-75 transition-opacity"
              style={{ borderColor: 'var(--d-border)' }}
              aria-label="Close offcanvas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div
            className="px-5 py-3.5 border-t shrink-0"
            style={{
              borderColor: 'var(--d-border)',
              backgroundColor: 'var(--d-surface-muted)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
