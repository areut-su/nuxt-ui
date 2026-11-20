import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpDown,
  CheckSquare,
  CreditCard,
  Database,
  DollarSign,
  Download,
  LayoutGrid,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
} from 'lucide-react';
import {
  AVATARS,
  REVENUE_SERIES,
  TRANSACTIONS_DATA,
  type PeriodRange,
  type TransactionRow,
} from '../../data/mockDashboardData';
import { useFormLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { AvatarWithFallback } from '../shared/AvatarWithFallback';
import { FormLanguageToggle } from '../shared/FormLanguageToggle';
import { InteractiveAreaChart, InteractiveBarChart } from '../shared/InteractiveCharts';
import { SidebarTreeNav, type SidebarMenuItem } from '../shared/SidebarTreeNav';
import { ThemedDataGrid } from '../shared/ThemedDataGrid';

type SubPage =
  | 'overview'
  | 'analytics'
  | 'grid-table'
  | 'grid-cards'
  | 'grid-pending'
  | 'tasks'
  | 'settings';

type TopTab = 'overview' | 'reports' | 'exports';

interface Props {
  onOpenCommand: () => void;
  onOpenOffcanvas: () => void;
}

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'analytics', label: 'Revenue Analytics' },
    ],
  },
  {
    id: 'data-grid',
    label: 'Data & Grid',
    icon: Database,
    children: [
      { id: 'grid-table', label: 'Accounts Grid', badge: 24 },
      { id: 'grid-cards', label: 'Card Directory' },
      { id: 'grid-pending', label: 'Pending Review' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: CheckSquare,
    children: [
      { id: 'tasks', label: 'Sprint Tasks' },
      { id: 'settings', label: 'Workspace Settings' },
    ],
  },
];

const PAGE_LABELS: Record<SubPage, { group: string; title: string }> = {
  overview: { group: 'Dashboard', title: 'Overview' },
  analytics: { group: 'Dashboard', title: 'Revenue Analytics' },
  'grid-table': { group: 'Data & Grid', title: 'Accounts Grid (Paginated)' },
  'grid-cards': { group: 'Data & Grid', title: 'Card Directory' },
  'grid-pending': { group: 'Data & Grid', title: 'Pending Review' },
  tasks: { group: 'Operations', title: 'Sprint Tasks' },
  settings: { group: 'Operations', title: 'Workspace Settings' },
};

export function NuxtShadcnAdminPage({ onOpenCommand, onOpenOffcanvas }: Props) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [centeredWidth, setCenteredWidth] = useState(false);
  const [activePage, setActivePage] = useState<SubPage>('overview');
  const [activeTab, setActiveTab] = useState<TopTab>('overview');
  const [period, setPeriod] = useState<PeriodRange>('30d');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TransactionRow['status']>('All');
  const [sortAsc, setSortAsc] = useState(false);
  const [workspaceEmail, setWorkspaceEmail] = useState('ops@nuxtadmin.dev');
  const [autoRenew, setAutoRenew] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 'TSK-104', title: 'Migrate Nuxt 4 server routes to edge runtime', tag: 'Engineering', done: true, priority: 'High' },
    { id: 'TSK-105', title: 'Audit shadcn-vue theme CSS variables for contrast', tag: 'Design', done: false, priority: 'Medium' },
    { id: 'TSK-106', title: 'Configure Stripe webhook idempotency keys', tag: 'Billing', done: false, priority: 'High' },
    { id: 'TSK-107', title: 'Publish Q2 enterprise usage digest', tag: 'Operations', done: true, priority: 'Low' },
  ]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TRANSACTIONS_DATA.filter((row) => {
      const matchesQuery =
        row.customer.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
      return matchesQuery && matchesStatus;
    }).sort((a, b) => (sortAsc ? a.amount - b.amount : b.amount - a.amount));
  }, [search, statusFilter, sortAsc]);

  const chartData = REVENUE_SERIES[period];

  const handleExport = () => {
    toast({
      variant: 'success',
      title: isRu ? 'Отчёт экспортирован' : 'Report exported',
      description: isRu
        ? `Сохранено ${filteredRows.length} записей в revenue-report-${period}.csv`
        : `Exported ${filteredRows.length} records to revenue-report-${period}.csv`,
    });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const crumb = PAGE_LABELS[activePage];

  return (
    <div
      className="min-h-[calc(100vh-52px)] flex p-2 sm:p-3 gap-2 sm:gap-3 dashboard-themed"
      style={{ backgroundColor: 'var(--d-sidebar)' }}
    >
      {/* Collapsible Sidebar with Sub-items */}
      <aside
        className={`shrink-0 flex flex-col justify-between transition-all duration-150 ${
          sidebarOpen ? 'w-60 px-2 py-2' : 'w-14 px-1.5 py-2 items-center'
        }`}
        style={{ color: 'var(--d-sidebar-text)' }}
      >
        <div className="space-y-4 w-full">
          <div className={`flex items-center gap-2.5 px-2 py-1.5 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0"
              style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
            >
              NS
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight truncate">Nuxt Shadcn</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--d-sidebar-muted)' }}>
                  Admin Console
                </div>
              </div>
            )}
          </div>

          <SidebarTreeNav
            items={MENU_ITEMS}
            activeId={activePage}
            collapsed={!sidebarOpen}
            onSelect={(id) => setActivePage(id as SubPage)}
            defaultOpenGroups={['dashboard', 'data-grid', 'operations']}
          />
        </div>

        <div
          className={`flex items-center gap-2.5 px-2 py-2 rounded-lg border w-full ${
            sidebarOpen ? '' : 'justify-center'
          }`}
          style={{
            borderColor: 'var(--d-sidebar-border)',
            backgroundColor: 'var(--d-sidebar-active-bg)',
          }}
        >
          <AvatarWithFallback src={AVATARS.lead} name="Elena Rostova" sizeClass="w-7 h-7" />
          {sidebarOpen && (
            <div className="min-w-0 text-left">
              <div className="text-xs font-medium truncate">Elena Rostova</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--d-sidebar-muted)' }}>
                elena@nuxtadmin.dev
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* SidebarInset Main Container */}
      <main
        className="flex-1 min-w-0 border overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'var(--d-bg)',
          borderColor: 'var(--d-border)',
          borderRadius: 'var(--d-radius)',
        }}
      >
        <header
          className="h-13 px-4 sm:px-6 border-b flex items-center justify-between gap-4 shrink-0"
          style={{ backgroundColor: 'var(--d-header)', borderColor: 'var(--d-border)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-1.5 rounded-md border hover:opacity-80 transition-opacity"
              style={{ borderColor: 'var(--d-border)' }}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <div className="text-xs sm:text-sm flex items-center gap-2 truncate">
              <span style={{ color: 'var(--d-muted)' }}>{crumb.group}</span>
              <span style={{ color: 'var(--d-muted)' }}>/</span>
              <span className="font-medium truncate">{crumb.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCommand}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors"
              style={{
                backgroundColor: 'var(--d-surface-muted)',
                borderColor: 'var(--d-border)',
                color: 'var(--d-muted)',
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="font-mono-num text-[10px] px-1 rounded border" style={{ borderColor: 'var(--d-border)' }}>
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setCenteredWidth((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap"
              style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface)' }}
              title="Toggle Fluid / Centered Layout Width"
            >
              {centeredWidth ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{centeredWidth ? 'Centered' : 'Fluid'}</span>
            </button>

            <button
              onClick={onOpenOffcanvas}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap"
              style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface)' }}
              title="Open Offcanvas Drawer"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offcanvas</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={`mx-auto space-y-6 transition-all ${centeredWidth ? 'max-w-5xl' : 'max-w-full'}`}>
            {activePage === 'grid-table' && (
              <ThemedDataGrid
                key="grid-table"
                title="Accounts & Subscriptions Grid"
                subtitle="Full-page paginated data grid with multi-column filtering, sorting, and bulk export"
                defaultViewMode="table"
              />
            )}

            {activePage === 'grid-cards' && (
              <ThemedDataGrid
                key="grid-cards"
                title="Customer Card Directory"
                subtitle="Responsive card grid layout with live region/plan filters and page navigation"
                defaultViewMode="cards"
              />
            )}

            {activePage === 'grid-pending' && (
              <ThemedDataGrid
                key="grid-pending"
                title="Pending & Verification Queue"
                subtitle="Filtered grid pre-scoped to accounts awaiting onboarding approval"
                defaultViewMode="table"
                defaultStatusFilter="Pending"
              />
            )}

            {activePage === 'tasks' && (
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{ backgroundColor: 'var(--d-surface)', borderColor: 'var(--d-border)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-bold">Sprint Engineering Tasks</h1>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--d-muted)' }}>
                      Click any task row to mark complete or reopen
                    </p>
                  </div>
                  <span className="text-xs font-mono-num" style={{ color: 'var(--d-muted)' }}>
                    {tasks.filter((t) => t.done).length} / {tasks.length} completed
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:opacity-80"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => {}}
                          className="w-4 h-4 accent-current shrink-0"
                        />
                        <span className={`text-sm truncate ${task.done ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs shrink-0" style={{ color: 'var(--d-muted)' }}>
                        <span>{task.tag}</span>
                        <span>·</span>
                        <span className="font-mono-num">{task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePage === 'settings' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({
                    variant: 'success',
                    title: isRu ? 'Настройки сохранены' : 'Settings saved',
                    description: workspaceEmail,
                  });
                }}
                className="max-w-2xl border p-6 space-y-5"
                style={{
                  backgroundColor: 'var(--d-surface)',
                  borderColor: 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-5 h-5" />
                    <div>
                      <h1 className="text-lg font-bold">
                        {isRu ? 'Настройки рабочего пространства' : 'Workspace Settings'}
                      </h1>
                      <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                        {isRu
                          ? 'Контакты биллинга и параметры автоматического продления'
                          : 'Configure billing contacts and container layout defaults'}
                      </p>
                    </div>
                  </div>
                  <FormLanguageToggle compact />
                </div>
                <div className="space-y-4 text-xs">
                  <label className="block space-y-1.5">
                    <span className="font-medium">
                      {isRu ? 'Основной email для уведомлений' : 'Primary Operations Email'}
                    </span>
                    <input
                      type="email"
                      required
                      value={workspaceEmail}
                      onChange={(e) => setWorkspaceEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-transparent outline-none"
                      style={{ borderColor: 'var(--d-border)' }}
                    />
                  </label>
                  <label className="flex items-center justify-between py-2 border-t border-b cursor-pointer" style={{ borderColor: 'var(--d-border)' }}>
                    <span>
                      {isRu
                        ? 'Автоматически повторять списание при просрочке счёта'
                        : 'Automatic invoice retries for Past Due tenants'}
                    </span>
                    <input
                      type="checkbox"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                    />
                  </label>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-medium rounded-md hover:opacity-90"
                      style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
                    >
                      {isRu ? 'Сохранить настройки' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {(activePage === 'overview' || activePage === 'analytics') && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      {activePage === 'analytics' ? 'Revenue Analytics' : 'Dashboard'}
                    </h1>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--d-muted)' }}>
                      Revenue telemetry, active seats, and billing activity
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className="inline-flex p-1 rounded-lg border"
                      style={{ backgroundColor: 'var(--d-surface-muted)', borderColor: 'var(--d-border)' }}
                    >
                      {(['7d', '30d', '90d'] as PeriodRange[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPeriod(p)}
                          className="px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                          style={{
                            backgroundColor: period === p ? 'var(--d-surface)' : 'transparent',
                            color: period === p ? 'var(--d-text)' : 'var(--d-muted)',
                          }}
                        >
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleExport}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                      style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div
                  className="inline-flex p-1 rounded-lg border"
                  style={{ backgroundColor: 'var(--d-surface-muted)', borderColor: 'var(--d-border)' }}
                >
                  {[
                    { id: 'overview' as const, label: 'Overview' },
                    { id: 'reports' as const, label: 'Analytics' },
                    { id: 'exports' as const, label: 'Transactions' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                      style={{
                        backgroundColor: activeTab === t.id ? 'var(--d-surface)' : 'transparent',
                        color: activeTab === t.id ? 'var(--d-text)' : 'var(--d-muted)',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Revenue', val: period === '7d' ? '$40,470' : period === '30d' ? '$150,400' : '$379,100', delta: '+20.1% from last period', icon: DollarSign },
                    { title: 'Subscriptions', val: period === '7d' ? '+642' : period === '30d' ? '+2,350' : '+6,840', delta: '+18.4% from last period', icon: CreditCard },
                    { title: 'Active Seats', val: '12,234', delta: '+19% from last month', icon: Activity },
                    { title: 'API Throughput', val: '573 req/s', delta: '+201 since last hour', icon: Activity },
                  ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                      <div
                        key={kpi.title}
                        className="p-5 border"
                        style={{
                          backgroundColor: 'var(--d-surface)',
                          borderColor: 'var(--d-border)',
                          borderRadius: 'var(--d-radius)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: 'var(--d-muted)' }}>
                            {kpi.title}
                          </span>
                          <Icon className="w-4 h-4" style={{ color: 'var(--d-muted)' }} />
                        </div>
                        <div className="text-2xl font-bold font-mono-num mt-2">{kpi.val}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--d-muted)' }}>
                          {kpi.delta}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(activeTab === 'overview' || activeTab === 'reports' || activePage === 'analytics') && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div
                      className="lg:col-span-7 p-5 border"
                      style={{
                        backgroundColor: 'var(--d-surface)',
                        borderColor: 'var(--d-border)',
                        borderRadius: 'var(--d-radius)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-sm font-semibold">
                            {activeTab === 'reports' || activePage === 'analytics'
                              ? 'Revenue vs Net Trajectory'
                              : 'Revenue Overview'}
                          </h2>
                          <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                            Aggregated billing across {period.toUpperCase()} window
                          </p>
                        </div>
                        <button
                          onClick={() => setActivePage('grid-table')}
                          className="text-xs font-medium underline"
                          style={{ color: 'var(--d-primary)' }}
                        >
                          Open Full Grid →
                        </button>
                      </div>
                      {activeTab === 'reports' || activePage === 'analytics' ? (
                        <InteractiveAreaChart data={chartData} primaryLabel="Gross" secondaryLabel="Net" />
                      ) : (
                        <InteractiveBarChart data={chartData} showSecondary secondaryLabel="Net" />
                      )}
                    </div>

                    <div
                      className="lg:col-span-5 p-5 border"
                      style={{
                        backgroundColor: 'var(--d-surface)',
                        borderColor: 'var(--d-border)',
                        borderRadius: 'var(--d-radius)',
                      }}
                    >
                      <h2 className="text-sm font-semibold">Recent Sales</h2>
                      <p className="text-xs mb-4" style={{ color: 'var(--d-muted)' }}>
                        265 enterprise renewals this month
                      </p>

                      <div className="space-y-4">
                        {[
                          { name: 'Olivia Martin', email: 'olivia.martin@northstar.io', amt: '+$1,999.00', avatar: AVATARS.lead },
                          { name: 'Jackson Lee', email: 'jackson.lee@veloxcloud.dev', amt: '+$490.00', avatar: AVATARS.director },
                          { name: 'Marcus Chen', email: 'm.chen@apexpay.net', amt: '+$3,200.00', avatar: AVATARS.architect },
                          { name: 'Isabella Nguyen', email: 'isabella@meridianhq.com', amt: '+$2,450.00', avatar: undefined },
                          { name: 'William Kim', email: 'will@kinetix-ops.org', amt: '+$99.00', avatar: undefined },
                        ].map((sale) => (
                          <div key={sale.email} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <AvatarWithFallback src={sale.avatar} name={sale.name} sizeClass="w-8 h-8" />
                              <div className="min-w-0">
                                <div className="text-xs font-medium truncate">{sale.name}</div>
                                <div className="text-[11px] truncate" style={{ color: 'var(--d-muted)' }}>
                                  {sale.email}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-semibold font-mono-num shrink-0">{sale.amt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="border overflow-hidden"
                  style={{
                    backgroundColor: 'var(--d-surface)',
                    borderColor: 'var(--d-border)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  <div
                    className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ borderColor: 'var(--d-border)' }}
                  >
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--d-muted)' }} />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter recent invoices..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border bg-transparent outline-none"
                        style={{ borderColor: 'var(--d-border)' }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['All', 'Paid', 'Pending', 'Failed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className="px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap"
                          style={{
                            borderColor: 'var(--d-border)',
                            backgroundColor: statusFilter === st ? 'var(--d-primary)' : 'transparent',
                            color: statusFilter === st ? 'var(--d-primary-fg)' : 'var(--d-muted)',
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead style={{ backgroundColor: 'var(--d-surface-muted)', color: 'var(--d-muted)' }}>
                        <tr className="border-b" style={{ borderColor: 'var(--d-border)' }}>
                          <th className="py-2.5 px-4 font-medium">Invoice</th>
                          <th className="py-2.5 px-4 font-medium">Customer</th>
                          <th className="py-2.5 px-4 font-medium">Plan</th>
                          <th className="py-2.5 px-4 font-medium">Status</th>
                          <th className="py-2.5 px-4 font-medium text-right">
                            <button
                              onClick={() => setSortAsc((v) => !v)}
                              className="inline-flex items-center gap-1 hover:opacity-80"
                            >
                              <span>Amount</span>
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                        {filteredRows.map((row) => (
                          <tr key={row.id}>
                            <td className="py-2.5 px-4 font-mono-num font-medium">{row.id}</td>
                            <td className="py-2.5 px-4">
                              <div className="font-medium">{row.customer}</div>
                              <div className="text-[11px]" style={{ color: 'var(--d-muted)' }}>
                                {row.email}
                              </div>
                            </td>
                            <td className="py-2.5 px-4">{row.plan}</td>
                            <td className="py-2.5 px-4">
                              <span
                                className="font-medium"
                                style={{
                                  color:
                                    row.status === 'Paid'
                                      ? 'var(--d-success)'
                                      : row.status === 'Pending'
                                        ? 'var(--d-warning)'
                                        : 'var(--d-danger)',
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono-num font-semibold">
                              ${row.amount.toLocaleString('en-US')}.00
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
