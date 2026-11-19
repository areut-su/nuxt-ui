import type { CSSProperties } from 'react';

export type DashboardStyleId =
  | 'nuxt-shadcn'
  | 'miguel-shadcn'
  | 'shadcn-blocks'
  | 'adminlte-vue'
  | 'nuxt-ui';

export type StyleCategory = 'all' | 'shadcn' | 'bootstrap' | 'nuxt';

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceMuted: string;
  sidebar: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarMuted: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  header: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryFg: string;
  accentSoft: string;
  chart1: string;
  chart2: string;
  chart3: string;
  success: string;
  warning: string;
  danger: string;
  radius: string;
}

export interface ThemePreset {
  id: string;
  labelRu: string;
  modeLabelRu: string;
  swatch: string;
  secondarySwatch: string;
  isDark: boolean;
  tokens: ThemeTokens;
}

export interface DashboardStyleMeta {
  id: DashboardStyleId;
  orderLabel: string;
  name: string;
  repo: string;
  repoUrl: string;
  license: string;
  category: Exclude<StyleCategory, 'all'>;
  ecosystemLabel: string;
  shortDescRu: string;
  architectureRu: string;
  densityRu: string;
  radiusRu: string;
  themingEngineRu: string;
  bestForRu: string;
  highlightsRu: string[];
  radiusToken: string;
}

export function themeTokensToStyle(
  tokens: ThemeTokens,
  radiusOverride?: string
): CSSProperties {
  return {
    '--d-bg': tokens.bg,
    '--d-surface': tokens.surface,
    '--d-surface-muted': tokens.surfaceMuted,
    '--d-sidebar': tokens.sidebar,
    '--d-sidebar-border': tokens.sidebarBorder,
    '--d-sidebar-text': tokens.sidebarText,
    '--d-sidebar-muted': tokens.sidebarMuted,
    '--d-sidebar-active-bg': tokens.sidebarActiveBg,
    '--d-sidebar-active-text': tokens.sidebarActiveText,
    '--d-header': tokens.header,
    '--d-border': tokens.border,
    '--d-text': tokens.text,
    '--d-muted': tokens.textMuted,
    '--d-primary': tokens.primary,
    '--d-primary-fg': tokens.primaryFg,
    '--d-accent-soft': tokens.accentSoft,
    '--d-chart-1': tokens.chart1,
    '--d-chart-2': tokens.chart2,
    '--d-chart-3': tokens.chart3,
    '--d-success': tokens.success,
    '--d-warning': tokens.warning,
    '--d-danger': tokens.danger,
    '--d-radius': radiusOverride ?? tokens.radius,
  } as CSSProperties;
}
