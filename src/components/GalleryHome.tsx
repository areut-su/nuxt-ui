import { useState } from 'react';
import { ArrowRight, Bell, Check, ExternalLink, Layers, Palette, PanelRight, ShieldCheck } from 'lucide-react';
import { DASHBOARD_STYLES, GLOBAL_THEME_SCHEMES } from '../data/stylesRegistry';
import { useToast } from '../context/ToastContext';
import type { DashboardStyleId, DashboardStyleMeta, StyleCategory, ThemePreset } from '../types/showcase';

interface GalleryHomeProps {
  globalTheme: ThemePreset;
  onSelectGlobalTheme: (themeId: string) => void;
  onOpenStyle: (styleId: DashboardStyleId) => void;
  onOpenOffcanvas: () => void;
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
  onOpenOffcanvas,
}: GalleryHomeProps) {
  const { toast } = useToast();
  const [category, setCategory] = useState<StyleCategory>('all');
  const [schemeFilter, setSchemeFilter] = useState<'all' | 'light' | 'dark'>('all');
  const [matrixSort, setMatrixSort] = useState<'order' | 'bundle' | 'memory'>('order');

  const filteredStyles =
    category === 'all'
      ? DASHBOARD_STYLES
      : DASHBOARD_STYLES.filter((s) => s.category === category);

  const sortedMatrixStyles = [...DASHBOARD_STYLES].sort((a, b) => {
    if (matrixSort === 'bundle') return a.bundleSizeKb - b.bundleSizeKb;
    if (matrixSort === 'memory') return a.memoryUsageMb - b.memoryUsageMb;
    return Number(a.orderLabel) - Number(b.orderLabel);
  });

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

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={onOpenOffcanvas}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 transition-colors whitespace-nowrap"
              >
                <PanelRight className="w-3.5 h-3.5" />
                <span>Offcanvas</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  toast({
                    variant: 'success',
                    title: `Toast · ${globalTheme.labelRu}`,
                    description: 'Уведомления и Offcanvas работают во всех 14 цветовых схемах.',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 transition-colors whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Toast</span>
              </button>

              <div className="inline-flex p-1 bg-slate-100 rounded-lg">
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

      {/* Architectural & Performance Comparison Table */}
      <section id="comparison" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                <h2 className="text-lg font-bold text-slate-950">
                  Сравнительная матрица дизайн-систем
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Количество подключаемых библиотек, ориентировочный размер бандла (JS + CSS gzip) и потребление памяти (RAM / JS Heap)
              </p>
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-lg self-start md:self-auto">
              {[
                { id: 'order' as const, label: 'По порядку' },
                { id: 'bundle' as const, label: 'Меньше бандл' },
                { id: 'memory' as const, label: 'Меньше памяти' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMatrixSort(opt.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    matrixSort === opt.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-medium">Шаблон и лицензия</th>
                  <th className="py-3 px-4 font-medium">Библиотеки (зависимости)</th>
                  <th className="py-3 px-4 font-medium">Размер бандла (gzip)</th>
                  <th className="py-3 px-4 font-medium">Память (RAM / Heap)</th>
                  <th className="py-3 px-4 font-medium">Архитектура и радиусы</th>
                  <th className="py-3 px-4 font-medium">Оценка для Nuxt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedMatrixStyles.map((st) => {
                  const bundlePct = Math.min(100, Math.round((st.bundleSizeKb / 190) * 100));
                  const memPct = Math.min(100, Math.round((st.memoryUsageMb / 65) * 100));
                  const toneColor =
                    st.footprintTone === 'optimal'
                      ? 'text-emerald-700'
                      : st.footprintTone === 'light'
                        ? 'text-sky-700'
                        : st.footprintTone === 'medium'
                          ? 'text-amber-700'
                          : 'text-rose-700';
                  const barColor =
                    st.footprintTone === 'optimal'
                      ? 'bg-emerald-500'
                      : st.footprintTone === 'light'
                        ? 'bg-sky-500'
                        : st.footprintTone === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-rose-500';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors align-top">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onOpenStyle(st.id)}
                          className="font-semibold text-slate-900 hover:underline text-left block"
                        >
                          {st.orderLabel}. {st.name}
                        </button>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-medium text-emerald-700">MIT</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-44">{st.repo}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-60">
                        <div className="font-semibold text-slate-900 font-mono-num">
                          {st.dependenciesCountRu}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {st.dependenciesListRu}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono-num font-semibold text-slate-900">
                          {st.bundleSizeRu}
                        </div>
                        <div className="mt-1.5 w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${bundlePct}%` }} />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono-num font-semibold text-slate-900">
                          {st.memoryUsageRu}
                        </div>
                        <div className="mt-1.5 w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${memPct}%` }} />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{st.architectureRu}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono-num">
                          {st.densityRu} · {st.radiusRu}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className={`font-semibold ${toneColor}`}>{st.footprintLabelRu}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{st.bestForRu}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>
              Оценки приведены для production-сборки Nuxt 3/4 (JS + CSS gzip, Chrome JS Heap на типовом экране с графиком и таблицей).
            </span>
            <span className="font-mono-num shrink-0">
              Общих схем: {GLOBAL_THEME_SCHEMES.length} · Лицензия: MIT
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div
          id="license"
          className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500"
        >
          <div className="flex flex-wrap items-center gap-3 text-slate-700 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Лицензия MIT · Все 5 дизайн-систем свободны для коммерческого использования</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a
              href="https://github.com/areut-su/nuxt-ui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-950 underline-offset-2 hover:underline"
            >
              <span>github.com/areut-su/nuxt-ui</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            Быстрый переход:{' '}
            <kbd className="font-mono-num px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50">
              ⌘K
            </kbd>
          </div>
        </div>
      </footer>
    </div>
  );
}
