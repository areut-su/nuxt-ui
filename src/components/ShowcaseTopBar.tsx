import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  ExternalLink,
  Palette,
  PanelRight,
  Search,
} from 'lucide-react';
import { DASHBOARD_STYLES, GLOBAL_THEME_SCHEMES } from '../data/stylesRegistry';
import { useFormLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import type { DashboardStyleId, DashboardStyleMeta, ThemePreset } from '../types/showcase';
import { FormLanguageToggle } from './shared/FormLanguageToggle';

interface ShowcaseTopBarProps {
  activeStyle: DashboardStyleMeta;
  activeTheme: ThemePreset;
  onGoHome: () => void;
  onSelectStyle: (id: DashboardStyleId) => void;
  onSelectTheme: (themeId: string) => void;
  onOpenCommand: () => void;
  onOpenOffcanvas: () => void;
}

const QUICK_THEME_IDS = ['light', 'dark', 'blue'];

export function ShowcaseTopBar({
  activeStyle,
  activeTheme,
  onGoHome,
  onSelectStyle,
  onSelectTheme,
  onOpenCommand,
  onOpenOffcanvas,
}: ShowcaseTopBarProps) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';
  const [menuOpen, setMenuOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const isDark = activeTheme.isDark;
  const lightSchemes = GLOBAL_THEME_SCHEMES.filter((t) => !t.isDark);
  const darkSchemes = GLOBAL_THEME_SCHEMES.filter((t) => t.isDark);

  return (
    <div
      className={`sticky top-0 z-40 h-13 px-3 sm:px-5 border-b flex items-center justify-between gap-3 transition-colors duration-150 ${
        isDark
          ? 'bg-slate-950 text-slate-100 border-slate-800'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
    >
      {/* Left: Back to Gallery + Repo Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onGoHome}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-100'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>К витрине</span>
        </button>

        <div className="hidden xl:flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold truncate">{activeStyle.name}</span>
          <a
            href={activeStyle.repoUrl}
            target="_blank"
            rel="noreferrer"
            className={`text-[11px] inline-flex items-center gap-1 shrink-0 ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Открыть оригинальный репозиторий"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Center: Quick Switch Between 5 Dedicated Pages */}
      <div
        className={`hidden lg:flex items-center gap-1 p-1 rounded-lg border overflow-x-auto ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        {DASHBOARD_STYLES.map((st) => {
          const isActive = st.id === activeStyle.id;
          return (
            <button
              key={st.id}
              onClick={() => onSelectStyle(st.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? isDark
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'bg-white text-slate-950 shadow-xs'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
              style={
                isActive && !isDark
                  ? {
                      backgroundColor: activeTheme.tokens.primary,
                      color: activeTheme.tokens.primaryFg,
                    }
                  : undefined
              }
            >
              {st.orderLabel} · {st.name.split(' ')[0]}{' '}
              {st.id === 'shadcn-blocks' ? 'Blocks' : st.id === 'nuxt-ui' ? 'UI' : ''}
            </button>
          );
        })}
      </div>

      {/* Mobile/Tablet Style Selector */}
      <div className="lg:hidden">
        <select
          value={activeStyle.id}
          onChange={(e) => onSelectStyle(e.target.value as DashboardStyleId)}
          className={`border text-xs rounded-md px-2.5 py-1.5 outline-none ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-slate-100 border-slate-200 text-slate-900'
          }`}
          aria-label="Выбор стиля дашборда"
        >
          {DASHBOARD_STYLES.map((st) => (
            <option key={st.id} value={st.id}>
              {st.orderLabel}. {st.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Global Theme Scheme Switcher (Quick 3 + All 14 Popover) */}
      <div className="flex items-center gap-2 shrink-0" ref={popoverRef}>
        <div
          className={`hidden sm:flex items-center gap-1 p-1 rounded-lg border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {QUICK_THEME_IDS.map((qid) => {
            const theme = GLOBAL_THEME_SCHEMES.find((t) => t.id === qid)!;
            const active = theme.id === activeTheme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? isDark
                      ? 'bg-slate-800 text-white ring-1 ring-slate-600'
                      : 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-200'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                }`}
                title={`Общая схема: ${theme.labelRu}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: theme.swatch }}
                />
                <span className="hidden md:inline">{theme.labelRu}</span>
              </button>
            );
          })}
        </div>

        {/* All 14 Global Schemes Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-900'
            }`}
            title="Выбрать общую цветовую схему из 14 вариантов"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
              style={{ backgroundColor: activeTheme.swatch }}
            />
            <Palette className="w-3.5 h-3.5 opacity-70 sm:hidden" />
            <span className="hidden sm:inline">{activeTheme.labelRu}</span>
            <span className={`text-[10px] font-mono-num ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ({GLOBAL_THEME_SCHEMES.length})
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl p-3 space-y-3 z-50 ${
                isDark
                  ? 'border-slate-800 bg-slate-950 text-slate-100'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <div
                className={`flex items-center justify-between px-1 pb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Общая цветовая схема</div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Применяется ко всем 5 стилям одновременно
                  </div>
                </div>
                <span className={`text-[11px] font-mono-num ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {GLOBAL_THEME_SCHEMES.length} тем
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                <div>
                  <div className={`px-1 pb-1 text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Светлые палитры ({lightSchemes.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {lightSchemes.map((theme) => {
                      const active = theme.id === activeTheme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onSelectTheme(theme.id);
                            setMenuOpen(false);
                          }}
                          className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs rounded-lg border text-left transition-colors ${
                            active
                              ? isDark
                                ? 'border-white bg-slate-800 text-white font-medium'
                                : 'border-slate-900 bg-slate-900 text-white font-medium'
                              : isDark
                                ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800'
                                : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                              style={{ backgroundColor: theme.swatch }}
                            />
                            <span className="truncate">{theme.labelRu}</span>
                          </span>
                          {active && <Check className="w-3 h-3 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className={`px-1 pb-1 text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Тёмные палитры ({darkSchemes.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {darkSchemes.map((theme) => {
                      const active = theme.id === activeTheme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onSelectTheme(theme.id);
                            setMenuOpen(false);
                          }}
                          className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs rounded-lg border text-left transition-colors ${
                            active
                              ? isDark
                                ? 'border-white bg-slate-800 text-white font-medium'
                                : 'border-slate-900 bg-slate-900 text-white font-medium'
                              : isDark
                                ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800'
                                : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                              style={{ backgroundColor: theme.swatch }}
                            />
                            <span className="truncate">{theme.labelRu}</span>
                          </span>
                          {active && <Check className="w-3 h-3 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <FormLanguageToggle variant="topbar" isDark={isDark} />

        <button
          onClick={onOpenOffcanvas}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-900'
          }`}
          title={isRu ? 'Открыть боковую панель Offcanvas' : 'Open Offcanvas Drawer'}
        >
          <PanelRight className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Offcanvas</span>
        </button>

        <button
          onClick={() =>
            toast({
              variant: 'success',
              title: isRu
                ? `Toast · ${activeTheme.labelRu}`
                : `Toast · ${activeTheme.id.toUpperCase()}`,
              description: isRu
                ? `Активный шаблон: ${activeStyle.name}. Уведомления работают во всех 14 схемах.`
                : `Active template: ${activeStyle.name}. Toasts adapt to all 14 color schemes.`,
            })
          }
          className={`inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
          }`}
          title={isRu ? 'Показать Toast-уведомление' : 'Trigger Toast Notification'}
          aria-label="Trigger toast notification"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline">Toast</span>
        </button>

        <button
          onClick={onOpenCommand}
          className={`p-1.5 rounded-md border transition-colors ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
          }`}
          title="Быстрый переход (Cmd/Ctrl + K)"
          aria-label="Быстрый поиск"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
