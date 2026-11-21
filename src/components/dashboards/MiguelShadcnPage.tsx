import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  Database,
  FileSpreadsheet,
  Home,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import {
  AVATARS,
  REVENUE_SERIES,
  TRANSACTIONS_DATA,
  type PeriodRange,
} from '../../data/mockDashboardData';
import { useFormLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { AvatarWithFallback } from '../shared/AvatarWithFallback';
import { FormLanguageToggle } from '../shared/FormLanguageToggle';
import { InteractiveAreaChart } from '../shared/InteractiveCharts';
import { SidebarTreeNav, type SidebarMenuItem } from '../shared/SidebarTreeNav';
import { ThemedActionButtonsPage } from '../shared/ThemedActionButtonsPage';
import { ThemedDataGrid } from '../shared/ThemedDataGrid';

type MiguelPage = 'home' | 'grid-accounts' | 'grid-cards' | 'buttons-edit' | 'team' | 'audit';

interface Props {
  onOpenCommand: () => void;
  onOpenOffcanvas: () => void;
}

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Workspace',
    icon: Home,
    children: [
      { id: 'home', label: 'Executive Overview' },
      { id: 'audit', label: 'Audit & Security' },
    ],
  },
  {
    id: 'data-grid',
    label: 'Directory & Grid',
    icon: Database,
    children: [
      { id: 'grid-accounts', label: 'Customers Grid', badge: 24 },
      { id: 'grid-cards', label: 'Account Cards' },
      { id: 'buttons-edit', label: 'Buttons & Edit' },
    ],
  },
  {
    id: 'access',
    label: 'Team & Billing',
    icon: ShieldCheck,
    children: [{ id: 'team', label: 'Team Permissions' }],
  },
];

export function MiguelShadcnPage({ onOpenCommand, onOpenOffcanvas }: Props) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';
  const [workspace, setWorkspace] = useState<'Acme Corp' | 'Nordic Labs'>('Acme Corp');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState<MiguelPage>('home');
  const [period, setPeriod] = useState<PeriodRange>('30d');
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'All' | 'Enterprise' | 'Growth' | 'Starter'>('All');
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({
    'Olivia Martin': 'Owner',
    'Jackson Lee': 'Admin',
    'Marcus Chen': 'Developer',
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRANSACTIONS_DATA.filter((r) => {
      const hit =
        r.customer.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      const planOk = planFilter === 'All' || r.plan === planFilter;
      return hit && planOk;
    });
  }, [query, planFilter]);

  return (
    <div className="min-h-[calc(100vh-52px)] flex dashboard-themed">
      {/* Flush Left Sidebar with Expandable Sub-items */}
      <aside
        className={`shrink-0 border-r hidden md:flex flex-col justify-between transition-all duration-150 dashboard-sidebar ${
          sidebarCollapsed ? 'w-16 p-2 items-center' : 'w-64 p-4'
        }`}
      >
        <div className="space-y-5 w-full">
          <button
            onClick={() => setWorkspace((w) => (w === 'Acme Corp' ? 'Nordic Labs' : 'Acme Corp'))}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
              sidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            style={{
              borderColor: 'var(--d-sidebar-border)',
              backgroundColor: 'var(--d-sidebar-active-bg)',
              color: 'var(--d-sidebar-active-text)',
            }}
            title="Switch Workspace"
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{workspace}</span>}
            </span>
            {!sidebarCollapsed && <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />}
          </button>

          <SidebarTreeNav
            items={MENU_ITEMS}
            activeId={activeNav}
            collapsed={sidebarCollapsed}
            onSelect={(id) => setActiveNav(id as MiguelPage)}
            defaultOpenGroups={['dashboard', 'data-grid', 'access']}
          />
        </div>

        <div
          className={`pt-4 border-t text-xs flex items-center gap-2.5 w-full ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          style={{ borderColor: 'var(--d-sidebar-border)' }}
        >
          <AvatarWithFallback src={AVATARS.director} name="Jackson Lee" sizeClass="w-8 h-8" />
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="font-medium truncate">Jackson Lee</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--d-sidebar-muted)' }}>
                Workspace Owner
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 px-4 sm:px-6 border-b flex items-center justify-between gap-4 dashboard-header">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="hidden md:inline-flex p-1.5 rounded-md border hover:opacity-80"
              style={{ borderColor: 'var(--d-border)' }}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold truncate">{workspace}</span>
            <span style={{ color: 'var(--d-muted)' }}>/</span>
            <span className="text-xs capitalize truncate" style={{ color: 'var(--d-muted)' }}>
              {activeNav.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCommand}
              className="flex items-center justify-between gap-8 px-3 py-1.5 text-xs rounded-md border w-44 sm:w-64 transition-colors"
              style={{
                borderColor: 'var(--d-border)',
                backgroundColor: 'var(--d-surface-muted)',
                color: 'var(--d-muted)',
              }}
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>Quick command...</span>
              </span>
              <kbd className="font-mono-num text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--d-border)' }}>
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onOpenOffcanvas}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium hover:opacity-80 whitespace-nowrap"
              style={{ borderColor: 'var(--d-border)' }}
              aria-label="Open Offcanvas Drawer"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offcanvas</span>
            </button>

            <button
              onClick={() => setActiveNav('team')}
              className="p-2 rounded-md border hover:opacity-80"
              style={{ borderColor: 'var(--d-border)' }}
              aria-label="Workspace settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
          {activeNav === 'grid-accounts' && (
            <ThemedDataGrid
              key="miguel-grid"
              title={`${workspace} — Customer Accounts Grid`}
              subtitle="Paginated customer directory with region, tier, and payment status filters"
              defaultViewMode="table"
            />
          )}

          {activeNav === 'grid-cards' && (
            <ThemedDataGrid
              key="miguel-cards"
              title={`${workspace} — Account Cards Grid`}
              subtitle="Paginated responsive card grid view with multi-criteria filtering"
              defaultViewMode="cards"
            />
          )}

          {activeNav === 'buttons-edit' && (
            <ThemedActionButtonsPage templateLabel="Miguel Shadcn Dashboard" />
          )}

          {activeNav === 'audit' && (
            <div
              className="border rounded-lg p-5 space-y-4"
              style={{ backgroundColor: 'var(--d-surface)', borderColor: 'var(--d-border)' }}
            >
              <h1 className="text-lg font-bold">Security & Audit Events</h1>
              <div className="divide-y text-xs" style={{ borderColor: 'var(--d-border)' }}>
                {[
                  { time: '2026-05-29 14:12', actor: 'Olivia Martin', event: 'Updated SAML 2.0 Identity Provider certificate' },
                  { time: '2026-05-29 11:40', actor: 'Jackson Lee', event: 'Exported May 2026 Enterprise billing ledger' },
                  { time: '2026-05-28 19:05', actor: 'Marcus Chen', event: 'Rotated webhook signing secret for staging' },
                  { time: '2026-05-28 09:30', actor: 'System', event: 'Completed automated SOC2 daily snapshot verification' },
                ].map((ev) => (
                  <div key={ev.time} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold">{ev.actor}</span>
                      <span className="mx-2" style={{ color: 'var(--d-muted)' }}>·</span>
                      <span>{ev.event}</span>
                    </div>
                    <span className="font-mono-num" style={{ color: 'var(--d-muted)' }}>{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeNav === 'home' || activeNav === 'team') && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    {activeNav === 'team' ? 'Team & Access Control' : `${workspace} — Executive Overview`}
                  </h1>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--d-muted)' }}>
                    Radix-styled minimalist workspace with live filterable metrics
                  </p>
                </div>

                <div className="inline-flex rounded-md border p-0.5" style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface-muted)' }}>
                  {(['7d', '30d', '90d'] as PeriodRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setPeriod(range)}
                      className="px-3 py-1 text-xs font-medium rounded-sm transition-colors"
                      style={{
                        backgroundColor: period === range ? 'var(--d-surface)' : 'transparent',
                        color: period === range ? 'var(--d-text)' : 'var(--d-muted)',
                      }}
                    >
                      {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border divide-y sm:divide-y-0 sm:divide-x rounded-lg overflow-hidden" style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface)' }}>
                {[
                  { label: 'Net MRR', val: workspace === 'Acme Corp' ? '$84,290' : '$51,840', delta: '+14.2%' },
                  { label: 'Active Tenants', val: workspace === 'Acme Corp' ? '1,428' : '892', delta: '+6.8%' },
                  { label: 'Churn Rate', val: '1.18%', delta: '-0.3%' },
                  { label: 'Avg. Contract', val: '$1,840', delta: '+9.4%' },
                ].map((item) => (
                  <div key={item.label} className="p-4" style={{ borderColor: 'var(--d-border)' }}>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--d-muted)' }}>
                      <span>{item.label}</span>
                      <span className="inline-flex items-center gap-0.5 font-mono-num" style={{ color: 'var(--d-success)' }}>
                        {item.delta}
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-mono-num mt-1.5">{item.val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div
                  className="lg:col-span-8 p-5 border rounded-lg"
                  style={{ backgroundColor: 'var(--d-surface)', borderColor: 'var(--d-border)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-semibold">Recurring Revenue vs Expansion</h2>
                      <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                        Hover any data point to inspect exact daily totals
                      </p>
                    </div>
                    <FileSpreadsheet className="w-4 h-4" style={{ color: 'var(--d-muted)' }} />
                  </div>
                  <InteractiveAreaChart data={REVENUE_SERIES[period]} primaryLabel="MRR" secondaryLabel="Expansion" />
                </div>

                <div
                  className="lg:col-span-4 p-5 border rounded-lg flex flex-col justify-between"
                  style={{ backgroundColor: 'var(--d-surface)', borderColor: 'var(--d-border)' }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <h2 className="text-sm font-semibold">
                          {isRu ? 'Права команды' : 'Team Permissions'}
                        </h2>
                        <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                          {isRu ? 'Изменяйте роли участников на лету' : 'Change member roles inline'}
                        </p>
                      </div>
                      <FormLanguageToggle compact />
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { name: 'Olivia Martin', email: 'olivia@acme.io', avatar: AVATARS.lead },
                        { name: 'Jackson Lee', email: 'jackson@acme.io', avatar: AVATARS.director },
                        { name: 'Marcus Chen', email: 'marcus@acme.io', avatar: AVATARS.architect },
                      ].map((member) => (
                        <div key={member.name} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <AvatarWithFallback src={member.avatar} name={member.name} sizeClass="w-8 h-8" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate">{member.name}</div>
                              <div className="text-[11px] truncate" style={{ color: 'var(--d-muted)' }}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                          <select
                            value={teamRoles[member.name]}
                            onChange={(e) => {
                              const nextRole = e.target.value;
                              setTeamRoles((prev) => ({ ...prev, [member.name]: nextRole }));
                              toast({
                                variant: 'success',
                                title: isRu ? 'Роль обновлена' : 'Role updated',
                                description: `${member.name} → ${nextRole}`,
                              });
                            }}
                            className="text-xs px-2 py-1 rounded border bg-transparent outline-none"
                            style={{ borderColor: 'var(--d-border)' }}
                          >
                            <option value="Owner" className="text-slate-900">Owner</option>
                            <option value="Admin" className="text-slate-900">Admin</option>
                            <option value="Developer" className="text-slate-900">Developer</option>
                            <option value="Viewer" className="text-slate-900">Viewer</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="mt-5 pt-3 border-t text-xs flex items-center justify-between"
                    style={{ borderColor: 'var(--d-border)', color: 'var(--d-muted)' }}
                  >
                    <span>SSO Enforcement</span>
                    <button
                      onClick={() => setActiveNav('grid-accounts')}
                      className="font-medium underline"
                      style={{ color: 'var(--d-primary)' }}
                    >
                      View Paginated Grid →
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="border rounded-lg overflow-hidden"
                style={{ backgroundColor: 'var(--d-surface)', borderColor: 'var(--d-border)' }}
              >
                <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: 'var(--d-border)' }}>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter recent invoices..."
                    className="px-3 py-1.5 text-xs rounded-md border bg-transparent outline-none sm:w-72"
                    style={{ borderColor: 'var(--d-border)' }}
                  />
                  <div className="flex items-center gap-1.5">
                    {(['All', 'Enterprise', 'Growth', 'Starter'] as const).map((pl) => (
                      <button
                        key={pl}
                        onClick={() => setPlanFilter(pl)}
                        className="px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap"
                        style={{
                          borderColor: 'var(--d-border)',
                          backgroundColor: planFilter === pl ? 'var(--d-primary)' : 'transparent',
                          color: planFilter === pl ? 'var(--d-primary-fg)' : 'var(--d-muted)',
                        }}
                      >
                        {pl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead style={{ backgroundColor: 'var(--d-surface-muted)', color: 'var(--d-muted)' }}>
                      <tr className="border-b" style={{ borderColor: 'var(--d-border)' }}>
                        <th className="py-2.5 px-4 font-medium">ID</th>
                        <th className="py-2.5 px-4 font-medium">Account</th>
                        <th className="py-2.5 px-4 font-medium">Region</th>
                        <th className="py-2.5 px-4 font-medium">Tier</th>
                        <th className="py-2.5 px-4 font-medium">Date</th>
                        <th className="py-2.5 px-4 font-medium text-right">Billed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                      {rows.map((r) => (
                        <tr key={r.id}>
                          <td className="py-2.5 px-4 font-mono-num">{r.id}</td>
                          <td className="py-2.5 px-4 font-medium">{r.customer}</td>
                          <td className="py-2.5 px-4" style={{ color: 'var(--d-muted)' }}>{r.region}</td>
                          <td className="py-2.5 px-4">{r.plan}</td>
                          <td className="py-2.5 px-4 font-mono-num" style={{ color: 'var(--d-muted)' }}>{r.date}</td>
                          <td className="py-2.5 px-4 text-right font-mono-num font-semibold">
                            ${r.amount.toLocaleString('en-US')}
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
    </div>
  );
}
