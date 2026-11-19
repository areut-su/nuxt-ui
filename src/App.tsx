import { useEffect, useState } from 'react';
import { getGlobalTheme, getStyleMeta } from './data/stylesRegistry';
import { GalleryHome } from './components/GalleryHome';
import { ShowcaseTopBar } from './components/ShowcaseTopBar';
import { CommandPaletteModal } from './components/shared/CommandPaletteModal';
import { NuxtShadcnAdminPage } from './components/dashboards/NuxtShadcnAdminPage';
import { MiguelShadcnPage } from './components/dashboards/MiguelShadcnPage';
import { ShadcnBlocksPage } from './components/dashboards/ShadcnBlocksPage';
import { AdminLteVuePage } from './components/dashboards/AdminLteVuePage';
import { NuxtUiDashboardPage } from './components/dashboards/NuxtUiDashboardPage';
import { themeTokensToStyle, type DashboardStyleId } from './types/showcase';

const VALID_IDS: DashboardStyleId[] = [
  'nuxt-shadcn',
  'miguel-shadcn',
  'shadcn-blocks',
  'adminlte-vue',
  'nuxt-ui',
];

const THEME_STORAGE_KEY = 'adminkit_global_theme';

function parseHashRoute(): DashboardStyleId | null {
  const clean = window.location.hash.replace(/^#\/?/, '').trim();
  if (VALID_IDS.includes(clean as DashboardStyleId)) {
    return clean as DashboardStyleId;
  }
  return null;
}

export default function App() {
  const [activeStyleId, setActiveStyleId] = useState<DashboardStyleId | null>(() =>
    parseHashRoute()
  );
  const [commandOpen, setCommandOpen] = useState(false);

  const [globalThemeId, setGlobalThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, globalThemeId);
    } catch {
      // ignore storage errors in restricted contexts
    }
  }, [globalThemeId]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveStyleId(parseHashRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToStyle = (id: DashboardStyleId) => {
    window.location.hash = `#/${id}`;
    setActiveStyleId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateHome = () => {
    window.location.hash = '#/';
    setActiveStyleId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const activeTheme = getGlobalTheme(globalThemeId);

  if (!activeStyleId) {
    return (
      <>
        <GalleryHome
          globalTheme={activeTheme}
          onSelectGlobalTheme={setGlobalThemeId}
          onOpenStyle={navigateToStyle}
        />
        <CommandPaletteModal
          open={commandOpen}
          onClose={() => setCommandOpen(false)}
          activeStyleId={null}
          activeThemeId={activeTheme.id}
          onSelectStyle={navigateToStyle}
          onSelectTheme={setGlobalThemeId}
          onGoHome={navigateHome}
        />
      </>
    );
  }

  const styleMeta = getStyleMeta(activeStyleId);
  const cssVars = themeTokensToStyle(activeTheme.tokens, styleMeta.radiusToken);

  return (
    <div className="min-h-screen flex flex-col">
      <ShowcaseTopBar
        activeStyle={styleMeta}
        activeTheme={activeTheme}
        onGoHome={navigateHome}
        onSelectStyle={navigateToStyle}
        onSelectTheme={setGlobalThemeId}
        onOpenCommand={() => setCommandOpen(true)}
      />

      <div style={cssVars} className="flex-1 flex flex-col">
        {activeStyleId === 'nuxt-shadcn' && (
          <NuxtShadcnAdminPage onOpenCommand={() => setCommandOpen(true)} />
        )}
        {activeStyleId === 'miguel-shadcn' && (
          <MiguelShadcnPage onOpenCommand={() => setCommandOpen(true)} />
        )}
        {activeStyleId === 'shadcn-blocks' && (
          <ShadcnBlocksPage onOpenCommand={() => setCommandOpen(true)} />
        )}
        {activeStyleId === 'adminlte-vue' && (
          <AdminLteVuePage onOpenCommand={() => setCommandOpen(true)} />
        )}
        {activeStyleId === 'nuxt-ui' && (
          <NuxtUiDashboardPage onOpenCommand={() => setCommandOpen(true)} />
        )}
      </div>

      <CommandPaletteModal
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        activeStyleId={activeStyleId}
        activeThemeId={activeTheme.id}
        onSelectStyle={navigateToStyle}
        onSelectTheme={setGlobalThemeId}
        onGoHome={navigateHome}
      />
    </div>
  );
}
