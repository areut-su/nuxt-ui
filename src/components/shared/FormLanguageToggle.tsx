import { Languages } from 'lucide-react';
import { useFormLocale, type FormLocale } from '../../context/LocaleContext';

interface FormLanguageToggleProps {
  variant?: 'themed' | 'topbar';
  isDark?: boolean;
  compact?: boolean;
}

const LOCALES: { id: FormLocale; label: string }[] = [
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' },
];

export function FormLanguageToggle({
  variant = 'themed',
  isDark = false,
  compact = false,
}: FormLanguageToggleProps) {
  const { locale, setLocale } = useFormLocale();

  if (variant === 'topbar') {
    return (
      <div
        className={`inline-flex items-center gap-0.5 p-0.5 rounded-lg border shrink-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
        role="group"
        aria-label={locale === 'ru' ? 'Язык форм' : 'Form language'}
      >
        <Languages
          className={`w-3.5 h-3.5 mx-1.5 shrink-0 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        />
        {LOCALES.map((item) => {
          const active = locale === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setLocale(item.id)}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap ${
                active
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white text-slate-950 shadow-xs'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-0.5 p-0.5 border shrink-0"
      style={{
        backgroundColor: 'var(--d-surface-muted)',
        borderColor: 'var(--d-border)',
        borderRadius: 'var(--d-radius)',
      }}
      role="group"
      aria-label={locale === 'ru' ? 'Переключить язык формы' : 'Switch form language'}
    >
      {!compact && (
        <Languages
          className="w-3.5 h-3.5 mx-1.5 shrink-0"
          style={{ color: 'var(--d-muted)' }}
        />
      )}
      {LOCALES.map((item) => {
        const active = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            className="px-2 py-0.5 text-[11px] font-semibold transition-colors whitespace-nowrap"
            style={{
              backgroundColor: active ? 'var(--d-surface)' : 'transparent',
              color: active ? 'var(--d-text)' : 'var(--d-muted)',
              borderRadius: 'calc(var(--d-radius) - 2px)',
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
