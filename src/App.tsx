import { useEffect, useState } from 'react';
import { getGlobalTheme, getStyleMeta } from './data/stylesRegistry';
import { LocaleProvider } from './context/LocaleContext';
import { ToastProvider } from './context/ToastContext';
import { GalleryHome } from './components/GalleryHome';
import { ShowcaseTopBar } from './components/ShowcaseTopBar';
import { CommandPaletteModal } from './components/shared/CommandPaletteModal';
import { GlobalOffcanvasDrawer } from './components/shared/GlobalOffcanvasDrawer';
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
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

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
  const styleMeta = activeStyleId ? getStyleMeta(activeStyleId) : null;
  const radiusToken = styleMeta ? styleMeta.radiusToken : '0.5rem';
  const cssVars = themeTokensToStyle(activeTheme.tokens, radiusToken);

  return (
    <LocaleProvider>
      <ToastProvider activeTheme={activeTheme} radiusToken={radiusToken}>
        {!activeStyleId || !styleMeta ? (
          <>
            <GalleryHome
              globalTheme={activeTheme}
              onSelectGlobalTheme={setGlobalThemeId}
              onOpenStyle={navigateToStyle}
              onOpenOffcanvas={() => setOffcanvasOpen(true)}
            />
            <div style={cssVars}>
              <GlobalOffcanvasDrawer
                open={offcanvasOpen}
                onClose={() => setOffcanvasOpen(false)}
                activeTheme={activeTheme}
                onSelectTheme={setGlobalThemeId}
                contextLabel="AdminKit Showcase"
              />
            </div>
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
        ) : (
          <div className="min-h-screen flex flex-col">
            <ShowcaseTopBar
              activeStyle={styleMeta}
              activeTheme={activeTheme}
              onGoHome={navigateHome}
              onSelectStyle={navigateToStyle}
              onSelectTheme={setGlobalThemeId}
              onOpenCommand={() => setCommandOpen(true)}
              onOpenOffcanvas={() => setOffcanvasOpen(true)}
            />

            <div style={cssVars} className="flex-1 flex flex-col">
              {activeStyleId === 'nuxt-shadcn' && (
                <NuxtShadcnAdminPage
                  onOpenCommand={() => setCommandOpen(true)}
                  onOpenOffcanvas={() => setOffcanvasOpen(true)}
                />
              )}
              {activeStyleId === 'miguel-shadcn' && (
                <MiguelShadcnPage
                  onOpenCommand={() => setCommandOpen(true)}
                  onOpenOffcanvas={() => setOffcanvasOpen(true)}
                />
              )}
              {activeStyleId === 'shadcn-blocks' && (
                <ShadcnBlocksPage
                  onOpenCommand={() => setCommandOpen(true)}
                  onOpenOffcanvas={() => setOffcanvasOpen(true)}
                />
              )}
              {activeStyleId === 'adminlte-vue' && (
                <AdminLteVuePage
                  onOpenCommand={() => setCommandOpen(true)}
                  onOpenOffcanvas={() => setOffcanvasOpen(true)}
                />
              )}
              {activeStyleId === 'nuxt-ui' && (
                <NuxtUiDashboardPage
                  onOpenCommand={() => setCommandOpen(true)}
                  onOpenOffcanvas={() => setOffcanvasOpen(true)}
                />
              )}

              <GlobalOffcanvasDrawer
                open={offcanvasOpen}
                onClose={() => setOffcanvasOpen(false)}
                activeTheme={activeTheme}
                onSelectTheme={setGlobalThemeId}
                contextLabel={styleMeta.name}
              />
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
        )}
      </ToastProvider>
    </LocaleProvider>
  );
}
