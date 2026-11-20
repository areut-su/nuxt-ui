import { useMemo, useState } from 'react';
import {
  ArrowRightCircle,
  BarChart3,
  Cpu,
  Layout,
  Menu,
  PanelRight,
  PieChart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Table,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  ADMINLTE_ORDERS,
  AVATARS,
  REVENUE_SERIES,
  type PeriodRange,
} from '../../data/mockDashboardData';
import { useFormLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { AvatarWithFallback } from '../shared/AvatarWithFallback';
import { FormLanguageToggle } from '../shared/FormLanguageToggle';
import {
  InteractiveAreaChart,
  InteractiveDonutChart,
  MiniSparkline,
} from '../shared/InteractiveCharts';
import { SidebarTreeNav, type SidebarMenuItem } from '../shared/SidebarTreeNav';
import { ThemedDataGrid } from '../shared/ThemedDataGrid';
import { ThemedOffcanvas } from '../shared/ThemedOffcanvas';

type AdminPage =
  | 'v2'
  | 'v1'
  | 'grid-table'
  | 'grid-cards'
  | 'orders'
  | 'widgets'
  | 'settings';

interface Props {
  onOpenCommand: () => void;
  onOpenOffcanvas: () => void;
}

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Cpu,
    children: [
      { id: 'v2', label: 'Dashboard v2' },
      { id: 'v1', label: 'Dashboard v1' },
    ],
  },
  {
    id: 'data-grid',
    label: 'Tables & Data Grid',
    icon: Table,
    children: [
      { id: 'grid-table', label: 'Paginated Grid', badge: 24 },
      { id: 'grid-cards', label: 'Card Grid View' },
      { id: 'orders', label: 'Latest Orders' },
    ],
  },
  {
    id: 'ui-elements',
    label: 'UI & Layout',
    icon: Layout,
    children: [
      { id: 'widgets', label: 'SmallBox & InfoBox' },
      { id: 'settings', label: 'Control Settings' },
    ],
  },
];

export function AdminLteVuePage({ onOpenCommand, onOpenOffcanvas }: Props) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const [activePage, setActivePage] = useState<AdminPage>('v2');
  const [period, setPeriod] = useState<PeriodRange>('30d');
  const [orderFilter, setOrderFilter] = useState('');
  const [compactTable, setCompactTable] = useState(false);
  const [showFooterStats, setShowFooterStats] = useState(true);

  const filteredOrders = useMemo(() => {
    const q = orderFilter.trim().toLowerCase();
    return ADMINLTE_ORDERS.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.item.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  }, [orderFilter]);

  const pageTitleMap: Record<AdminPage, string> = {
    v2: 'Dashboard v2',
    v1: 'Dashboard v1 — Charts & Analytics',
    'grid-table': 'Paginated Accounts Grid',
    'grid-cards': 'Accounts Card Grid',
    orders: 'Latest Orders & Inventory',
    widgets: 'InfoBox & SmallBox Widgets',
    settings: 'AdminLTE Layout Settings',
  };

  return (
    <div className="min-h-[calc(100vh-52px)] flex font-public dashboard-themed">
      {/* AdminLTE Treeview Sidebar with Expandable Sub-items */}
      <aside
        className={`shrink-0 border-r flex flex-col justify-between transition-all duration-150 dashboard-sidebar ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div>
          <div
            className="h-13 px-4 border-b flex items-center gap-3"
            style={{ borderColor: 'var(--d-sidebar-border)' }}
          >
            <div
              className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs shrink-0"
              style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
            >
              LTE
            </div>
            {!sidebarCollapsed && <span className="font-semibold text-sm tracking-tight">AdminLTE 4 Vue</span>}
          </div>

          <div
            className="px-4 py-3 border-b flex items-center gap-3"
            style={{ borderColor: 'var(--d-sidebar-border)' }}
          >
            <AvatarWithFallback src={AVATARS.director} name="Alexander Pierce" sizeClass="w-8 h-8" />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">Alexander Pierce</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--d-sidebar-muted)' }}>
                  System Administrator
                </div>
              </div>
            )}
          </div>

          <div className="p-2">
            <SidebarTreeNav
              items={MENU_ITEMS}
              activeId={activePage}
              collapsed={sidebarCollapsed}
              onSelect={(id) => setActivePage(id as AdminPage)}
              defaultOpenGroups={['dashboard', 'data-grid']}
            />
          </div>
        </div>

        {!sidebarCollapsed && (
          <div
            className="p-3 text-[11px] border-t"
            style={{ borderColor: 'var(--d-sidebar-border)', color: 'var(--d-sidebar-muted)' }}
          >
            Bootstrap 5.3 · --lte-primary
          </div>
        )}
      </aside>

      {/* Main Content + Optional Control Sidebar */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="h-13 px-4 border-b flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--d-header)',
            borderColor: 'var(--d-border)',
          }}
        >
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="p-1.5 rounded hover:opacity-75"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            <button onClick={() => setActivePage('v2')} className="font-medium hover:underline">
              Home
            </button>
            <button onClick={() => setActivePage('grid-table')} className="opacity-75 hover:opacity-100">
              Data Grid
            </button>
            <button onClick={() => setActivePage('orders')} className="opacity-75 hover:opacity-100">
              Orders
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCommand}
              className="p-1.5 rounded border text-xs flex items-center gap-1.5"
              style={{ borderColor: 'var(--d-border)' }}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={() => setControlOpen(true)}
              className="px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5"
              style={{
                borderColor: 'var(--d-border)',
                backgroundColor: controlOpen ? 'var(--d-primary)' : 'transparent',
                color: controlOpen ? 'var(--d-primary-fg)' : 'inherit',
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isRu ? 'Control Offcanvas' : 'Control Offcanvas'}
              </span>
            </button>

            <button
              onClick={onOpenOffcanvas}
              className="px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5"
              style={{ borderColor: 'var(--d-border)' }}
              title="Open Workspace Offcanvas"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offcanvas</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 min-w-0 p-4 sm:p-5 space-y-5 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-xl font-semibold">{pageTitleMap[activePage]}</h1>
              <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--d-muted)' }}>
                <span>Home</span>
                <span>/</span>
                <span className="font-medium" style={{ color: 'var(--d-text)' }}>
                  {pageTitleMap[activePage]}
                </span>
              </div>
            </div>

            {activePage === 'grid-table' && (
              <ThemedDataGrid
                key="lte-grid-table"
                title="Enterprise Accounts Data Grid"
                subtitle="Bootstrap 5.3 styled table grid with search, plan/region filters, and pagination"
                defaultViewMode="table"
              />
            )}

            {activePage === 'grid-cards' && (
              <ThemedDataGrid
                key="lte-grid-cards"
                title="Accounts Card Grid"
                subtitle="Paginated card grid view for rapid tenant inspection"
                defaultViewMode="cards"
              />
            )}

            {activePage === 'settings' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({
                    variant: 'success',
                    title: isRu ? 'Настройки AdminLTE применены' : 'AdminLTE settings applied',
                  });
                }}
                className="max-w-xl border rounded p-5 space-y-4 text-xs"
                style={{
                  backgroundColor: 'var(--d-surface)',
                  borderColor: 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">
                    {isRu ? 'Управление интерфейсом AdminLTE' : 'AdminLTE Interface Controls'}
                  </h2>
                  <FormLanguageToggle compact />
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>{isRu ? 'Компактная таблица заказов' : 'Compact Orders Table'}</span>
                  <input
                    type="checkbox"
                    checked={compactTable}
                    onChange={(e) => setCompactTable(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>{isRu ? 'Показывать итоговые KPI в отчёте' : 'Show Recap Footer KPIs'}</span>
                  <input
                    type="checkbox"
                    checked={showFooterStats}
                    onChange={(e) => setShowFooterStats(e.target.checked)}
                  />
                </label>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded font-medium hover:opacity-90"
                    style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
                  >
                    {isRu ? 'Применить' : 'Apply Settings'}
                  </button>
                </div>
              </form>
            )}

            {(activePage === 'v2' || activePage === 'v1' || activePage === 'orders' || activePage === 'widgets') && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    {
                      val: '150',
                      label: 'New Orders',
                      bg: 'var(--d-primary)',
                      icon: ShoppingCart,
                      target: 'orders' as const,
                    },
                    {
                      val: '53%',
                      label: 'Bounce Rate',
                      bg: 'var(--d-success)',
                      icon: BarChart3,
                      target: 'v1' as const,
                    },
                    {
                      val: '24',
                      label: 'Paginated Grid Accounts',
                      bg: 'var(--d-warning)',
                      icon: UserPlus,
                      target: 'grid-table' as const,
                    },
                    {
                      val: '65',
                      label: 'Unique Visitors',
                      bg: 'var(--d-danger)',
                      icon: Users,
                      target: 'grid-cards' as const,
                    },
                  ].map((box) => {
                    const Icon = box.icon;
                    const darkText = box.bg === 'var(--d-warning)';
                    return (
                      <div
                        key={box.label}
                        className="rounded overflow-hidden border"
                        style={{
                          backgroundColor: box.bg,
                          borderColor: 'transparent',
                          color: darkText ? '#111827' : '#ffffff',
                          borderRadius: 'var(--d-radius)',
                        }}
                      >
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold font-mono-num">{box.val}</div>
                            <div className="text-xs font-medium mt-1 opacity-90">{box.label}</div>
                          </div>
                          <Icon className="w-10 h-10 opacity-25" />
                        </div>
                        <button
                          onClick={() => setActivePage(box.target)}
                          className="w-full py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-1.5 bg-black/15 hover:bg-black/20 transition-colors"
                        >
                          <span>More info</span>
                          <ArrowRightCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {(activePage === 'v2' || activePage === 'v1') && (
                  <div
                    className="border rounded overflow-hidden"
                    style={{
                      backgroundColor: 'var(--d-surface)',
                      borderColor: 'var(--d-border)',
                      borderRadius: 'var(--d-radius)',
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3"
                      style={{ borderColor: 'var(--d-border)' }}
                    >
                      <h2 className="text-sm font-semibold">Monthly Recap Report</h2>
                      <div className="flex items-center gap-1">
                        {(['7d', '30d', '90d'] as PeriodRange[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className="px-2.5 py-1 text-xs font-medium rounded border"
                            style={{
                              borderColor: 'var(--d-border)',
                              backgroundColor: period === p ? 'var(--d-primary)' : 'transparent',
                              color: period === p ? 'var(--d-primary-fg)' : 'var(--d-muted)',
                            }}
                          >
                            {p.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-8">
                        <InteractiveAreaChart
                          data={REVENUE_SERIES[period]}
                          primaryLabel="Sales"
                          secondaryLabel="Cost"
                        />
                      </div>

                      <div className="lg:col-span-4 space-y-4">
                        <div className="text-xs font-semibold text-center">Goal Completion</div>
                        {[
                          { name: 'Add Products to Cart', count: '160 / 200', pct: 80, color: 'var(--d-primary)' },
                          { name: 'Complete Purchase', count: '310 / 400', pct: 77, color: 'var(--d-danger)' },
                          { name: 'Visit Premium Page', count: '480 / 800', pct: 60, color: 'var(--d-success)' },
                          { name: 'Send Inquiries', count: '250 / 500', pct: 50, color: 'var(--d-warning)' },
                        ].map((goal) => (
                          <div key={goal.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{goal.name}</span>
                              <span className="font-mono-num font-semibold">{goal.count}</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--d-surface-muted)' }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${goal.pct}%`, backgroundColor: goal.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {showFooterStats && (
                      <div
                        className="grid grid-cols-2 sm:grid-cols-4 border-t divide-y sm:divide-y-0 sm:divide-x text-center"
                        style={{ borderColor: 'var(--d-border)' }}
                      >
                        {[
                          { pct: '+17%', val: '$35,210.43', label: 'TOTAL REVENUE', color: 'var(--d-success)' },
                          { pct: '0%', val: '$10,390.90', label: 'TOTAL COST', color: 'var(--d-warning)' },
                          { pct: '+20%', val: '$24,813.53', label: 'TOTAL PROFIT', color: 'var(--d-success)' },
                          { pct: '-18%', val: '1,200', label: 'GOAL COMPLETIONS', color: 'var(--d-danger)' },
                        ].map((f) => (
                          <div key={f.label} className="p-3" style={{ borderColor: 'var(--d-border)' }}>
                            <div className="text-xs font-semibold font-mono-num" style={{ color: f.color }}>
                              {f.pct}
                            </div>
                            <div className="text-sm font-bold font-mono-num mt-0.5">{f.val}</div>
                            <div className="text-[10px] mt-0.5" style={{ color: 'var(--d-muted)' }}>
                              {f.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div
                    className="lg:col-span-7 border rounded overflow-hidden"
                    style={{
                      backgroundColor: 'var(--d-surface)',
                      borderColor: 'var(--d-border)',
                      borderRadius: 'var(--d-radius)',
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      style={{ borderColor: 'var(--d-border)' }}
                    >
                      <h2 className="text-sm font-semibold">Latest Orders</h2>
                      <input
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        placeholder="Filter orders..."
                        className="px-2.5 py-1 text-xs rounded border bg-transparent outline-none"
                        style={{ borderColor: 'var(--d-border)' }}
                      />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead style={{ backgroundColor: 'var(--d-surface-muted)', color: 'var(--d-muted)' }}>
                          <tr className="border-b" style={{ borderColor: 'var(--d-border)' }}>
                            <th className="py-2 px-4 font-semibold">Order ID</th>
                            <th className="py-2 px-4 font-semibold">Item</th>
                            <th className="py-2 px-4 font-semibold">Status</th>
                            <th className="py-2 px-4 font-semibold">Popularity</th>
                            <th className="py-2 px-4 font-semibold text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                          {filteredOrders.map((ord) => (
                            <tr key={ord.orderId}>
                              <td className={`px-4 font-mono-num font-medium ${compactTable ? 'py-1.5' : 'py-2.5'}`} style={{ color: 'var(--d-primary)' }}>
                                {ord.orderId}
                              </td>
                              <td className={`px-4 ${compactTable ? 'py-1.5' : 'py-2.5'}`}>{ord.item}</td>
                              <td className={`px-4 ${compactTable ? 'py-1.5' : 'py-2.5'}`}>
                                <span
                                  className="px-2 py-0.5 rounded text-[11px] font-semibold"
                                  style={{
                                    backgroundColor: 'var(--d-accent-soft)',
                                    color:
                                      ord.status === 'Delivered'
                                        ? 'var(--d-success)'
                                        : ord.status === 'Pending'
                                          ? 'var(--d-warning)'
                                          : 'var(--d-primary)',
                                  }}
                                >
                                  {ord.status}
                                </span>
                              </td>
                              <td className={`px-4 ${compactTable ? 'py-1.5' : 'py-2.5'}`}>
                                <MiniSparkline values={ord.popularity} />
                              </td>
                              <td className={`px-4 text-right font-mono-num font-semibold ${compactTable ? 'py-1.5' : 'py-2.5'}`}>
                                ${ord.total.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    className="lg:col-span-5 border rounded overflow-hidden"
                    style={{
                      backgroundColor: 'var(--d-surface)',
                      borderColor: 'var(--d-border)',
                      borderRadius: 'var(--d-radius)',
                    }}
                  >
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--d-border)' }}>
                      <h2 className="text-sm font-semibold">Browser Usage</h2>
                      <PieChart className="w-4 h-4" style={{ color: 'var(--d-muted)' }} />
                    </div>
                    <div className="p-5">
                      <InteractiveDonutChart
                        slices={[
                          { label: 'Chrome', value: 700, color: 'var(--d-primary)' },
                          { label: 'Edge / Chromium', value: 400, color: 'var(--d-success)' },
                          { label: 'Safari', value: 300, color: 'var(--d-warning)' },
                          { label: 'Firefox', value: 210, color: 'var(--d-danger)' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <ThemedOffcanvas
            open={controlOpen}
            onClose={() => setControlOpen(false)}
            side="right"
            size="sm"
            title={isRu ? 'Настройка AdminLTE (Offcanvas)' : 'Customize AdminLTE (Offcanvas)'}
            subtitle="Bootstrap 5.3 Offcanvas Drawer"
            headerActions={<FormLanguageToggle compact />}
          >
            <div className="space-y-4 text-xs">
              <label
                className="flex items-center justify-between p-3 border cursor-pointer"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              >
                <span>{isRu ? 'Компактная таблица заказов' : 'Compact Orders Table'}</span>
                <input
                  type="checkbox"
                  checked={compactTable}
                  onChange={(e) => {
                    setCompactTable(e.target.checked);
                    toast({
                      variant: 'info',
                      title: isRu ? 'Плотность таблицы обновлена' : 'Table density updated',
                    });
                  }}
                />
              </label>

              <label
                className="flex items-center justify-between p-3 border cursor-pointer"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              >
                <span>{isRu ? 'Показывать итоговые KPI' : 'Show Recap Footer KPIs'}</span>
                <input
                  type="checkbox"
                  checked={showFooterStats}
                  onChange={(e) => {
                    setShowFooterStats(e.target.checked);
                    toast({
                      variant: 'info',
                      title: isRu ? 'Блок KPI обновлён' : 'Recap KPIs toggled',
                    });
                  }}
                />
              </label>

              <label
                className="flex items-center justify-between p-3 border cursor-pointer"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              >
                <span>{isRu ? 'Свернуть левое меню' : 'Collapsed Left Sidebar'}</span>
                <input
                  type="checkbox"
                  checked={sidebarCollapsed}
                  onChange={(e) => setSidebarCollapsed(e.target.checked)}
                />
              </label>
            </div>
          </ThemedOffcanvas>
        </div>
      </div>
    </div>
  );
}
