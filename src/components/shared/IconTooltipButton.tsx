import type { CSSProperties, ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'bottom';

export type IconButtonTone =
  | 'neutral'
  | 'ghost'
  | 'primary'
  | 'primary-soft'
  | 'success'
  | 'success-outline'
  | 'warning'
  | 'warning-outline'
  | 'danger'
  | 'danger-outline';

interface IconTooltipButtonProps {
  label: string;
  tone?: IconButtonTone;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  placement?: TooltipPlacement;
  align?: 'center' | 'right';
  children: ReactNode;
}

export function IconTooltipButton({
  label,
  tone = 'neutral',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style,
  placement = 'top',
  align = 'center',
  children,
}: IconTooltipButtonProps) {
  const horizClass = align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const arrowHorizClass = align === 'right' ? 'right-2.5' : 'left-1/2 -translate-x-1/2';

  const posClass =
    placement === 'bottom'
      ? `top-full mt-2 ${horizClass}`
      : `bottom-full mb-2 ${horizClass}`;

  const arrowClass =
    placement === 'bottom'
      ? `-top-1 ${arrowHorizClass} rotate-45`
      : `-bottom-1 ${arrowHorizClass} rotate-45`;

  return (
    <span className="relative inline-flex group/tip">
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        aria-label={label}
        className={`d-icon-btn d-btn-${tone} inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        style={style}
      >
        {children}
      </button>

      {/* Instant Styled Hover & Focus Tooltip */}
      <span
        role="tooltip"
        className={`pointer-events-none select-none absolute ${posClass} z-50 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shadow-lg border opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100 group-focus-within/tip:opacity-100 group-focus-within/tip:scale-100 transition-all duration-120`}
        style={{
          backgroundColor: 'var(--d-text)',
          color: 'var(--d-surface)',
          borderColor: 'var(--d-border)',
          borderRadius: 'calc(var(--d-radius) - 2px)',
        }}
      >
        {label}
        <span
          aria-hidden="true"
          className={`absolute w-2 h-2 ${arrowClass}`}
          style={{ backgroundColor: 'var(--d-text)' }}
        />
      </span>
    </span>
  );
}
