import { useState } from 'react';
import { ArrowRight, Check, ExternalLink, Layers, Palette, ShieldCheck } from 'lucide-react';
import { DASHBOARD_STYLES, GLOBAL_THEME_SCHEMES } from '../data/stylesRegistry';
import type { DashboardStyleId, DashboardStyleMeta, StyleCategory, ThemePreset } from '../types/showcase';

interface GalleryHomeProps {
  globalTheme: ThemePreset;
  onSelectGlobalTheme: (themeId: string) => void;
  onOpenStyle: (styleId: DashboardStyleId) => void;
}

function StyleMiniPreview({
  style,
  theme,
}: {
  style: DashboardStyleMeta;
  theme: ThemePreset;
}) {
  const t = theme.tokens;
  const isInset = style.id === 'nuxt-shadcn' || style.id === 'shadcn-blocks';
  const isAdminLte = style.id === 'adminlte-vue';

  return (
    <div
      className="h-52 w-full rounded-lg border overflow-hidden flex transition-colors duration-150 select-none"
      style={{
        backgroundColor: isInset ? t.sidebar : t.bg,
        borderColor: t.border,
        padding: isInset ? '8px' : '0px',
        gap: isInset ? '8px' : '0px',
      }}
    >
      <div
        className="w-16 shrink-0 flex flex-col justify-between p-2"
        style={{
          backgroundColor: t.sidebar,
          borderRight: isInset ? 'none' : `1px solid ${t.sidebarBorder}`,
          borderRadius: isInset ? '6px' : '0px',
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-xs" style={{ backgroundColor: t.primary }} />
            <div className="h-2 w-7 rounded-xs opacity-60" style={{ backgroundColor: t.sidebarText }} />
          </div>
          <div className="space-y-1 pt-1">
            <div className="h-2.5 w-full rounded-xs" style={{ backgroundColor: t.sidebarActiveBg }} />
            <div className="h-2 w-10 rounded-xs opacity-35" style={{ backgroundColor: t.sidebarText }} />
            <div className="h-2 w-9 rounded-xs opacity-35" style={{ backgroundColor: t.sidebarText }} />
            <div className="h-2 w-11 rounded-xs opacity-35" style={{ backgroundColor: t.sidebarText }} />
          </div>
        </div>
        <div className="h-2 w-8 rounded-xs opacity-30" style={{ backgroundColor: t.sidebarText }} />
      </div>

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          backgroundColor: t.bg,
          border: isInset ? `1px solid ${t.border}` : 'none',
          borderRadius: isInset ? '6px' : '0px',
        }}
      >
        <div
          className="h-7 px-3 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: t.header, borderColor: t.border }}
        >
          <div className="h-2 w-16 rounded-xs opacity-50" style={{ backgroundColor: t.text }} />
          <div className="h-3.5 w-10 rounded-xs" style={{ backgroundColor: t.primary }} />
        </div>

        <div className="p-2.5 space-y-2 flex-1 overflow-hidden">
          <div className="grid grid-cols-4 gap-1.5">
            {[t.primary, t.success, t.warning, t.danger].map((col, idx) => (
              <div
                key={idx}
                className="h-9 rounded-sm border p-1.5 flex flex-col justify-between"
                style={{
                  backgroundColor: isAdminLte ? col : t.surface,
                  borderColor: isAdminLte ? 'transparent' : t.border,
                }}
              >
                <div
                  className="h-1.5 w-6 rounded-xs opacity-60"
                  style={{ backgroundColor: isAdminLte ? '#ffffff' : t.textMuted }}
                />
                <div
                  className="h-2 w-8 rounded-xs"
                  style={{ backgroundColor: isAdminLte ? '#ffffff' : t.text }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-1.5 flex-1">
            <div
              className="col-span-8 h-24 rounded-sm border p-2 flex items-end gap-1"
              style={{ backgroundColor: t.surface, borderColor: t.border }}
            >
              {style.id === 'nuxt-shadcn' ? (
                [45, 70, 58, 86, 64, 92, 74, 82].map((h, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-xs"
                    style={{ height: `${h}%`, backgroundColor: idx % 2 === 0 ? t.chart1 : t.chart2 }}
                  />
                ))
              ) : (
                <svg viewBox="0 0 180 60" className="w-full h-full">
                  <path
                    d="M 0 50 Q 30 35 60 40 T 120 20 T 180 12 L 180 60 L 0 60 Z"
                    fill={t.chart1}
                    fillOpacity="0.18"
                  />
                  <path
                    d="M 0 50 Q 30 35 60 40 T 120 20 T 180 12"
                    fill="none"
                    stroke={t.chart1}
                    strokeWidth="2.5"
                  />
                </svg>
              )}
            </div>
            <div
              className="col-span-4 h-24 rounded-sm border p-2 space-y-1.5"
              style={{ backgroundColor: t.surface, borderColor: t.border }}
            >
              {[1, 2, 3, 4].map((row) => (
                <div key={row} className="flex items-center justify-between gap-1">
                  <div className="h-1.5 w-10 rounded-xs opacity-50" style={{ backgroundColor: t.text }} />
                  <div className="h-1.5 w-4 rounded-xs" style={{ backgroundColor: t.primary }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryHome({
  globalTheme,
  onSelectGlobalTheme,
  onOpenStyle,
}: GalleryHomeProps) {
  const [category, setCategory] = useState<StyleCategory>('all');
  const [schemeFilter, setSchemeFilter] = useState<'all' | 'light' | 'dark'>('all');

  const filteredStyles =
    category === 'all'
      ? DASHBOARD_STYLES
      : DASHBOARD_STYLES.filter((s) => s.category === category);

  const visibleSchemes = GLOBAL_THEME_SCHEMES.filter((t) => {
    if (schemeFilter === 'light') return !t.isDark;
    if (schemeFilter === 'dark') return t.isDark;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#/"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
          >
            AdminKit Showcase
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#themes-info" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Общие схемы
            </a>
            <a href="#styles" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Обзор стилей
            </a>
            <a href="#comparison" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Сравнение
            </a>
            <a href="#license" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Лицензия MIT
            </a>
          </nav>

          <button
            onClick={() => onOpenStyle('nuxt-shadcn')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Открыть макет
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>5 дизайн-систем Vue и Nuxt</span>
            <span aria-hidden="true">·</span>
            <span>{GLOBAL_THEME_SCHEMES.length} общих цветовых схем</span>
            <span aria-hidden="true">·</span>
            <span>Боковое меню с подпунктами и Grid с пагинацией</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 text-balance leading-[1.12]">
            Сравните архитектуру пяти админ-дашбордов с единым выбором цветовой схемы
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Выберите общую цветовую схему ниже — она мгновенно применится ко всем пяти макетам
            на витрине и сохранится при переходе на отдельную страницу каждого стиля.
          </p>
        </div>
      </section>

      {/* Global Shared Color Scheme Picker (14 Palettes) */}
      <section id="themes-info" className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center shrink-0"
                style={{ backgroundColor: globalTheme.swatch }}
              >
                <Palette className="w-4 h-4 text-white mix-blend-difference" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Общая цветовая схема: {globalTheme.labelRu} ({globalTheme.modeLabelRu})
                </h2>
                <p className="text-xs text-slate-500">
                  Единый переключатель для всех 5 шаблонов · {GLOBAL_THEME_SCHEMES.length} светлых и тёмных палитр
                </p>
              </div>
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
              {[
                { id: 'all' as const, label: `Все (${GLOBAL_THEME_SCHEMES.length})` },
                { id: 'light' as const, label: 'Светлые (8)' },
                { id: 'dark' as const, label: 'Тёмные (6)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSchemeFilter(f.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    schemeFilter === f.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {visibleSchemes.map((scheme) => {
              const selected = scheme.id === globalTheme.id;
              return (
                <button
                  key={scheme.id}
                  onClick={() => onSelectGlobalTheme(scheme.id)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                    selected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: scheme.swatch }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{scheme.labelRu}</div>
                      <div
                        className={`text-[10px] truncate ${
                          selected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {scheme.isDark ? 'Dark' : 'Light'}
                      </div>
                    </div>
                  </div>
                  {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section id="styles" className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-slate-200/70 rounded-lg">
            {[
              { id: 'all' as const, label: 'Все стили (5)' },
              { id: 'shadcn' as const, label: 'Shadcn / Tailwind (3)' },
              { id: 'bootstrap' as const, label: 'AdminLTE / Bootstrap (1)' },
              { id: 'nuxt' as const, label: 'Nuxt UI v3 (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  category === tab.id
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Все превью сейчас отображаются в схеме <span className="font-semibold text-slate-900">{globalTheme.labelRu}</span>
          </div>
        </div>
      </section>

      {/* 5 Style Preview Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStyles.map((style) => (
            <article
              key={style.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5 transition-colors hover:border-slate-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono-num font-semibold text-slate-700">
                        {style.orderLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{style.license}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{style.ecosystemLabel}</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-950">
                      {style.name}
                    </h2>
                  </div>

                  <a
                    href={style.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 shrink-0"
                  >
                    <span>Repo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Live Synchronized Mini Preview */}
                <StyleMiniPreview style={style} theme={globalTheme} />

                <p className="text-sm text-slate-600 leading-relaxed">{style.shortDescRu}</p>

                <ul className="space-y-1.5 text-xs text-slate-600">
                  {style.highlightsRu.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-900 mt-0.5 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span
                    className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: globalTheme.swatch }}
                  />
                  <span>
                    Активная схема: <strong className="text-slate-900">{globalTheme.labelRu}</strong>
                  </span>
                </div>

                <button
                  onClick={() => onOpenStyle(style.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Открыть страницу</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Architectural Comparison Table */}
      <section id="comparison" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Сравнительная матрица дизайн-систем</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ключевые отличия компоновки, плотности данных и системы темизации
              </p>
            </div>
            <Layers className="w-5 h-5 text-slate-400 shrink-0" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5 font-medium">Шаблон</th>
                  <th className="py-3 px-5 font-medium">Архитектура сетки</th>
                  <th className="py-3 px-5 font-medium">Плотность</th>
                  <th className="py-3 px-5 font-medium">Радиусы</th>
                  <th className="py-3 px-5 font-medium">Система тем</th>
                  <th className="py-3 px-5 font-medium">Оптимально для</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DASHBOARD_STYLES.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      <button
                        onClick={() => onOpenStyle(st.id)}
                        className="hover:underline text-left"
                      >
                        {st.orderLabel}. {st.name}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{st.architectureRu}</td>
                    <td className="py-3.5 px-5 text-slate-600">{st.densityRu}</td>
                    <td className="py-3.5 px-5 font-mono-num text-slate-600">{st.radiusRu}</td>
                    <td className="py-3.5 px-5 text-slate-600">
                      Все {GLOBAL_THEME_SCHEMES.length} общих схем
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{st.bestForRu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div
          id="license"
          className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500"
        >
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Все 5 представленных дизайн-систем распространяются под открытой лицензией MIT.</span>
          </div>
          <div>
            Для быстрого переключения в любом месте нажмите{' '}
            <kbd className="font-mono-num px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50">
              ⌘K
            </kbd>
          </div>
        </div>
      </footer>
    </div>
  );
}
