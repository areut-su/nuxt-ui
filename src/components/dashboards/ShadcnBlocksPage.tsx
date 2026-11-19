import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Database,
  HelpCircle,
  LayoutDashboard,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
} from 'lucide-react';
import {
  AVATARS,
  BLOCK_DOCUMENTS_DATA,
  REVENUE_SERIES,
  type BlockDocumentRow,
  type PeriodRange,
} from '../../data/mockDashboardData';
import { AvatarWithFallback } from '../shared/AvatarWithFallback';
import { InteractiveAreaChart } from '../shared/InteractiveCharts';
import { SidebarTreeNav, type SidebarMenuItem } from '../shared/SidebarTreeNav';
import { ThemedDataGrid } from '../shared/ThemedDataGrid';

type BlocksPageId = 'dashboard' | 'lifecycle' | 'grid-table' | 'grid-cards' | 'documents' | 'settings';

interface Props {
  onOpenCommand: () => void;
}

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'home-group',
    label: 'Home',
    icon: LayoutDashboard,
    children: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'lifecycle', label: 'Lifecycle & Metrics' },
    ],
  },
  {
    id: 'data-group',
    label: 'Data Blocks',
    icon: Database,
    children: [
      { id: 'grid-table', label: 'Paginated Grid', badge: 24 },
      { id: 'grid-cards', label: 'Card Grid View' },
      { id: 'documents', label: 'Focus Documents' },
    ],
  },
];

export function ShadcnBlocksPage({ onOpenCommand }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState<BlocksPageId>('dashboard');
  const [range, setRange] = useState<PeriodRange>('90d');
  const [tableTab, setTableTab] = useState<'all' | BlockDocumentRow['tab']>('all');
  const [docs, setDocs] = useState(BLOCK_DOCUMENTS_DATA);
  const [docSearch, setDocSearch] = useState('');
  const [quickCreated, setQuickCreated] = useState(false);

  const visibleDocs = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    return docs.filter((d) => {
      const tabOk = tableTab === 'all' || d.tab === tableTab;
      const qOk =
        d.header.toLowerCase().includes(q) ||
        d.reviewer.toLowerCase().includes(q) ||
        d.sectionType.toLowerCase().includes(q);
      return tabOk && qOk;
    });
  }, [docs, tableTab, docSearch]);

  const handleQuickCreate = () => {
    const nextId = docs.length + 1;
    setDocs((prev) => [
      {
        id: nextId,
        header: `New Architecture Spec #${nextId}`,
        sectionType: 'Technical content',
        status: 'In Process',
        target: 20,
        limit: 12,
        reviewer: 'Eddie Lake',
        tab: 'outline',
      },
      ...prev,
    ]);
    setQuickCreated(true);
    setTimeout(() => setQuickCreated(false), 2000);
  };

  const toggleDocStatus = (id: number) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Done' ? 'In Process' : 'Done' } : d
      )
    );
  };

  return (
    <div
      className="min-h-[calc(100vh-52px)] flex p-2 sm:p-3 gap-2 dashboard-themed"
      style={{ backgroundColor: 'var(--d-sidebar)' }}
    >
      {/* AppSidebar with Nested Sub-items */}
      <aside
        className={`shrink-0 flex flex-col justify-between transition-all duration-150 ${
          collapsed ? 'w-14 px-1.5 py-2 items-center' : 'w-60 px-2.5 py-2'
        }`}
        style={{ color: 'var(--d-sidebar-text)' }}
      >
        <div className="space-y-4 w-full">
          <div className={`flex items-center gap-2 px-2 py-1 ${collapsed ? 'justify-center' : ''}`}>
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
            >
              A
            </div>
            {!collapsed && <span className="text-sm font-semibold tracking-tight">Acme Inc.</span>}
          </div>

          <button
            onClick={handleQuickCreate}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-90 ${
              collapsed ? 'justify-center' : ''
            }`}
            style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Quick Create</span>}
          </button>

          <SidebarTreeNav
            items={MENU_ITEMS}
            activeId={activeNav}
            collapsed={collapsed}
            onSelect={(id) => setActiveNav(id as BlocksPageId)}
            defaultOpenGroups={['home-group', 'data-group']}
          />
        </div>

        {/* NavSecondary + NavUser */}
        <div className="space-y-2 w-full">
          <div className="space-y-1">
            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md ${
                collapsed ? 'justify-center' : ''
              }`}
              style={{
                backgroundColor: activeNav === 'settings' ? 'var(--d-sidebar-active-bg)' : 'transparent',
              }}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </button>
            <button
              onClick={onOpenCommand}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Get Help</span>}
            </button>
          </div>

          <div
            className={`pt-2 border-t flex items-center gap-2.5 px-1.5 ${collapsed ? 'justify-center' : ''}`}
            style={{ borderColor: 'var(--d-sidebar-border)' }}
          >
            <AvatarWithFallback src={AVATARS.architect} name="shadcn user" sizeClass="w-7 h-7" />
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">shadcn</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--d-sidebar-muted)' }}>
                  m@example.com
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* SidebarInset */}
      <main
        className="flex-1 min-w-0 border overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'var(--d-bg)',
          borderColor: 'var(--d-border)',
          borderRadius: 'var(--d-radius)',
        }}
      >
        <header
          className="h-12 px-4 sm:px-6 border-b flex items-center justify-between gap-4"
          style={{ backgroundColor: 'var(--d-header)', borderColor: 'var(--d-border)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-1.5 rounded-md hover:opacity-75"
              aria-label="Toggle AppSidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <span className="h-4 w-px" style={{ backgroundColor: 'var(--d-border)' }} />
            <h1 className="text-sm font-medium capitalize">{activeNav.replace('-', ' ')} · Block 01</h1>
          </div>

          {quickCreated && (
            <span className="text-xs font-medium" style={{ color: 'var(--d-success)' }}>
              Added new row via Quick Create
            </span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeNav === 'grid-table' && (
            <ThemedDataGrid
              key="blocks-grid-table"
              title="Paginated Block Data Grid"
              subtitle="Official shadcn-vue block table with search, status/plan/region filters, and pagination"
              defaultViewMode="table"
            />
          )}

          {activeNav === 'grid-cards' && (
            <ThemedDataGrid
              key="blocks-grid-cards"
              title="Paginated Block Card Grid"
              subtitle="Multi-column card layout powered by the same filterable dataset"
              defaultViewMode="cards"
            />
          )}

          {activeNav === 'settings' && (
            <div
              className="max-w-xl p-6 border space-y-4"
              style={{
                backgroundColor: 'var(--d-surface)',
                borderColor: 'var(--d-border)',
                borderRadius: 'var(--d-radius)',
              }}
            >
              <h2 className="text-base font-semibold">Block 01 Preferences</h2>
              <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                SidebarInset, CSS OKLCH tokens, and Reka UI primitive settings.
              </p>
              <button
                onClick={() => setActiveNav('grid-table')}
                className="px-3.5 py-2 text-xs font-medium rounded-md"
                style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
              >
                Open Paginated Grid
              </button>
            </div>
          )}

          {(activeNav === 'dashboard' || activeNav === 'lifecycle' || activeNav === 'documents') && (
            <>
              {activeNav !== 'documents' && (
                <>
                  {/* SectionCards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Total Revenue',
                        val: '$1,250.00',
                        trend: '+12.5%',
                        up: true,
                        foot: 'Trending up this month',
                        sub: 'Visitors for the last 6 months',
                      },
                      {
                        label: 'New Customers',
                        val: '1,234',
                        trend: '-20%',
                        up: false,
                        foot: 'Down 20% this period',
                        sub: 'Acquisition needs attention',
                      },
                      {
                        label: 'Active Accounts',
                        val: '45,678',
                        trend: '+12.5%',
                        up: true,
                        foot: 'Strong user retention',
                        sub: 'Engagement exceed targets',
                      },
                      {
                        label: 'Growth Rate',
                        val: '4.5%',
                        trend: '+4.5%',
                        up: true,
                        foot: 'Steady performance',
                        sub: 'Meets growth projections',
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="p-5 border flex flex-col justify-between"
                        style={{
                          backgroundColor: 'var(--d-surface)',
                          borderColor: 'var(--d-border)',
                          borderRadius: 'var(--d-radius)',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs" style={{ color: 'var(--d-muted)' }}>
                              {card.label}
                            </span>
                            <span
                              className="px-2 py-0.5 text-[11px] font-mono-num rounded-md border"
                              style={{
                                borderColor: 'var(--d-border)',
                                color: card.up ? 'var(--d-success)' : 'var(--d-danger)',
                              }}
                            >
                              {card.trend}
                            </span>
                          </div>
                          <div className="text-2xl font-semibold font-mono-num mt-2">{card.val}</div>
                        </div>
                        <div className="mt-4 pt-2 text-xs">
                          <div className="font-medium">{card.foot}</div>
                          <div style={{ color: 'var(--d-muted)' }}>{card.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ChartAreaInteractive */}
                  <div
                    className="p-5 border"
                    style={{
                      backgroundColor: 'var(--d-surface)',
                      borderColor: 'var(--d-border)',
                      borderRadius: 'var(--d-radius)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-sm font-semibold">Total Visitors</h2>
                        <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                          Total for the selected time window (Desktop & Mobile)
                        </p>
                      </div>
                      <div
                        className="inline-flex p-1 rounded-lg border"
                        style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface-muted)' }}
                      >
                        {[
                          { id: '90d' as const, label: 'Last 3 months' },
                          { id: '30d' as const, label: 'Last 30 days' },
                          { id: '7d' as const, label: 'Last 7 days' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setRange(opt.id)}
                            className="px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                            style={{
                              backgroundColor: range === opt.id ? 'var(--d-surface)' : 'transparent',
                              color: range === opt.id ? 'var(--d-text)' : 'var(--d-muted)',
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <InteractiveAreaChart
                      data={REVENUE_SERIES[range]}
                      primaryLabel="Desktop"
                      secondaryLabel="Mobile"
                      valuePrefix=""
                    />
                  </div>
                </>
              )}

              {/* DataTable with Tabs */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className="inline-flex p-1 rounded-lg border overflow-x-auto"
                    style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface-muted)' }}
                  >
                    {[
                      { id: 'all' as const, label: 'Outline' },
                      { id: 'performance' as const, label: 'Past Performance' },
                      { id: 'personnel' as const, label: 'Key Personnel' },
                      { id: 'documents' as const, label: 'Focus Documents' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setTableTab(tab.id)}
                        className="px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
                        style={{
                          backgroundColor: tableTab === tab.id ? 'var(--d-surface)' : 'transparent',
                          color: tableTab === tab.id ? 'var(--d-text)' : 'var(--d-muted)',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--d-muted)' }} />
                    <input
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder="Filter sections or reviewer..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border bg-transparent outline-none"
                      style={{ borderColor: 'var(--d-border)' }}
                    />
                  </div>
                </div>

                <div
                  className="border overflow-hidden"
                  style={{
                    backgroundColor: 'var(--d-surface)',
                    borderColor: 'var(--d-border)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead style={{ backgroundColor: 'var(--d-surface-muted)', color: 'var(--d-muted)' }}>
                        <tr className="border-b" style={{ borderColor: 'var(--d-border)' }}>
                          <th className="py-2.5 px-4 font-medium">Header</th>
                          <th className="py-2.5 px-4 font-medium">Section Type</th>
                          <th className="py-2.5 px-4 font-medium">Status (Click to toggle)</th>
                          <th className="py-2.5 px-4 font-medium text-right">Target</th>
                          <th className="py-2.5 px-4 font-medium text-right">Limit</th>
                          <th className="py-2.5 px-4 font-medium">Reviewer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                        {visibleDocs.map((row) => (
                          <tr key={row.id}>
                            <td className="py-2.5 px-4 font-medium">{row.header}</td>
                            <td className="py-2.5 px-4" style={{ color: 'var(--d-muted)' }}>
                              {row.sectionType}
                            </td>
                            <td className="py-2.5 px-4">
                              <button
                                onClick={() => toggleDocStatus(row.id)}
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium hover:opacity-80"
                                style={{ borderColor: 'var(--d-border)' }}
                              >
                                {row.status === 'Done' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--d-success)' }} />
                                ) : (
                                  <Clock className="w-3.5 h-3.5" style={{ color: 'var(--d-warning)' }} />
                                )}
                                <span>{row.status}</span>
                              </button>
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono-num">{row.target}</td>
                            <td className="py-2.5 px-4 text-right font-mono-num">{row.limit}</td>
                            <td className="py-2.5 px-4">{row.reviewer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
