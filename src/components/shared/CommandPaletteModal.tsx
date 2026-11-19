import { useEffect, useState } from 'react';
import { ArrowRight, Check, Palette, Search, X } from 'lucide-react';
import { DASHBOARD_STYLES, GLOBAL_THEME_SCHEMES } from '../../data/stylesRegistry';
import type { DashboardStyleId } from '../../types/showcase';

interface CommandPaletteModalProps {
  open: boolean;
  onClose: () => void;
  activeStyleId: DashboardStyleId | null;
  activeThemeId: string;
  onSelectStyle: (id: DashboardStyleId) => void;
  onSelectTheme: (themeId: string) => void;
  onGoHome: () => void;
}

export function CommandPaletteModal({
  open,
  onClose,
  activeStyleId,
  activeThemeId,
  onSelectStyle,
  onSelectTheme,
  onGoHome,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const filteredStyles = DASHBOARD_STYLES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.repo.toLowerCase().includes(q) ||
      s.shortDescRu.toLowerCase().includes(q)
  );

  const filteredThemes = GLOBAL_THEME_SCHEMES.filter(
    (t) =>
      t.labelRu.toLowerCase().includes(q) ||
      t.modeLabelRu.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 backdrop-blur-xs pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Быстрый переход к стилю или общей цветовой схеме..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="Закрыть поиск"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {filteredThemes.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-medium text-slate-500">
                Общая цветовая схема ({filteredThemes.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {filteredThemes.map((theme) => {
                  const isActive = theme.id === activeThemeId;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onSelectTheme(theme.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                        isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: theme.swatch }}
                        />
                        <span className="font-medium truncate">{theme.labelRu}</span>
                      </div>
                      {isActive ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <Palette className="w-3 h-3 opacity-40 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="px-2 py-1 text-[11px] font-medium text-slate-500">
              Страницы дизайн-систем (5 стилей)
            </div>
            <div className="space-y-0.5">
              {filteredStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    onSelectStyle(style.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-100 text-left transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {style.orderLabel}. {style.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{style.repo}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {activeStyleId && (
            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={() => {
                  onGoHome();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-100 text-slate-700"
              >
                <span>Вернуться на главную витрину</span>
                <span className="text-xs text-slate-400">Home</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
