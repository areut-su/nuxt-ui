import { useState } from 'react';
import {
  Calendar,
  Check,
  Home,
  Inbox,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  Send,
  Settings,
  Users,
} from 'lucide-react';
import {
  AVATARS,
  NUXT_UI_INBOX,
  REVENUE_SERIES,
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

type UPanel = 'home' | 'markets' | 'inbox' | 'customers-grid' | 'customers-cards' | 'buttons-edit' | 'settings';

interface Props {
  onOpenCommand: () => void;
  onOpenOffcanvas: () => void;
}

export function NuxtUiDashboardPage({ onOpenCommand, onOpenOffcanvas }: Props) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';
  const [panel, setPanel] = useState<UPanel>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [range, setRange] = useState<PeriodRange>('30d');
  const [granularity, setGranularity] = useState<'Daily' | 'Weekly'>('Daily');
  const [messages, setMessages] = useState(NUXT_UI_INBOX);
  const [selectedMsgId, setSelectedMsgId] = useState(NUXT_UI_INBOX[0].id);
  const [replyText, setReplyText] = useState('');
  const [sentReplies, setSentReplies] = useState<Record<string, string[]>>({});
  const [projectTitle, setProjectTitle] = useState('Nuxt UI Dashboard');
  const [webhookUrl, setWebhookUrl] = useState('https://api.nuxt-ui.dev/hooks/billing');

  const unreadCount = messages.filter((m) => m.unread).length;
  const activeMessage = messages.find((m) => m.id === selectedMsgId) ?? messages[0];

  const menuItems: SidebarMenuItem[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      children: [
        { id: 'home', label: 'Overview' },
        { id: 'markets', label: 'Traffic & Markets' },
      ],
    },
    {
      id: 'inbox-group',
      label: 'Communications',
      icon: Inbox,
      children: [{ id: 'inbox', label: 'Support Inbox', badge: unreadCount || undefined }],
    },
    {
      id: 'data-grid',
      label: 'Customers & Grid',
      icon: Users,
      children: [
        { id: 'customers-grid', label: 'Paginated Grid', badge: 24 },
        { id: 'customers-cards', label: 'Card Directory' },
        { id: 'buttons-edit', label: 'Buttons & Edit' },
      ],
    },
    {
      id: 'settings-group',
      label: 'Settings',
      icon: Settings,
      children: [{ id: 'settings', label: 'General & Tokens' }],
    },
  ];

  const handleSelectMessage = (id: string) => {
    setSelectedMsgId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setSentReplies((prev) => ({
      ...prev,
      [activeMessage.id]: [...(prev[activeMessage.id] ?? []), replyText.trim()],
    }));
    setReplyText('');
    toast({
      variant: 'success',
      title: isRu ? 'Ответ отправлен' : 'Reply sent',
      description: `${isRu ? 'Получатель' : 'To'}: ${activeMessage.from}`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-52px)] flex dashboard-themed">
      {/* UDashboardSidebar with Expandable Sub-items */}
      <aside
        className={`shrink-0 border-r flex flex-col justify-between transition-all duration-150 dashboard-sidebar ${
          sidebarCollapsed ? 'w-15 items-center py-3 px-1.5' : 'w-60 p-3'
        }`}
      >
        <div className="space-y-4 w-full">
          <div className={`flex items-center justify-between px-2 py-1 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0"
                style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
              >
                N
              </div>
              {!sidebarCollapsed && <span className="text-sm font-semibold tracking-tight">Nuxt UI</span>}
            </div>
          </div>

          <button
            onClick={onOpenCommand}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs ${
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
            style={{
              borderColor: 'var(--d-sidebar-border)',
              color: 'var(--d-sidebar-muted)',
            }}
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Search...</span>}
            </span>
            {!sidebarCollapsed && (
              <kbd className="font-mono-num text-[10px] px-1 rounded border" style={{ borderColor: 'var(--d-sidebar-border)' }}>
                ⌘K
              </kbd>
            )}
          </button>

          <SidebarTreeNav
            items={menuItems}
            activeId={panel}
            collapsed={sidebarCollapsed}
            onSelect={(id) => setPanel(id as UPanel)}
            defaultOpenGroups={['dashboard', 'inbox-group', 'data-grid']}
          />
        </div>

        <div
          className={`pt-3 border-t flex items-center gap-2.5 w-full ${sidebarCollapsed ? 'justify-center' : 'px-1.5'}`}
          style={{ borderColor: 'var(--d-sidebar-border)' }}
        >
          <AvatarWithFallback src={AVATARS.lead} name="Benjamin Canac" sizeClass="w-7 h-7" />
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">Benjamin Canac</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--d-sidebar-muted)' }}>
                @benjamincanac
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* UDashboardPanel */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-13 px-4 sm:px-6 border-b flex items-center justify-between gap-4 dashboard-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="p-1.5 rounded-md hover:opacity-75"
              aria-label="Toggle UDashboardSidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold capitalize">{panel.replace('-', ' ')}</h1>
          </div>

          <div className="flex items-center gap-2">
            {(panel === 'home' || panel === 'markets') && (
              <div
                className="hidden sm:inline-flex items-center gap-1 p-1 rounded-md border text-xs"
                style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface-muted)' }}
              >
                <Calendar className="w-3.5 h-3.5 ml-1.5 mr-1" style={{ color: 'var(--d-muted)' }} />
                {(['7d', '30d', '90d'] as PeriodRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className="px-2 py-0.5 rounded-sm font-medium transition-colors"
                    style={{
                      backgroundColor: range === r ? 'var(--d-surface)' : 'transparent',
                      color: range === r ? 'var(--d-text)' : 'var(--d-muted)',
                    }}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onOpenOffcanvas}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border hover:opacity-80 whitespace-nowrap"
              style={{ borderColor: 'var(--d-border)' }}
              title="Open Offcanvas / Slideover"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offcanvas</span>
            </button>

            <button
              onClick={() => setPanel('customers-grid')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Customers Grid</span>
            </button>
          </div>
        </header>

        {panel === 'inbox' ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
            <div className="lg:col-span-5 border-r divide-y overflow-y-auto" style={{ borderColor: 'var(--d-border)' }}>
              {messages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMessage(m.id)}
                  className="w-full text-left p-4 transition-colors block"
                  style={{
                    backgroundColor:
                      selectedMsgId === m.id ? 'var(--d-surface-muted)' : 'transparent',
                    borderColor: 'var(--d-border)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs truncate ${m.unread ? 'font-bold' : 'font-medium'}`}>
                        {m.from}
                      </span>
                      {m.unread && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.2 rounded"
                          style={{ backgroundColor: 'var(--d-accent-soft)', color: 'var(--d-primary)' }}
                        >
                          Unread
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono-num shrink-0" style={{ color: 'var(--d-muted)' }}>
                      {m.time}
                    </span>
                  </div>
                  <div className="text-xs font-medium truncate">{m.subject}</div>
                  <div className="text-xs truncate mt-0.5" style={{ color: 'var(--d-muted)' }}>
                    {m.preview}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--d-border)' }}>
                  <div className="flex items-center gap-3">
                    <AvatarWithFallback src={activeMessage.avatar} name={activeMessage.from} sizeClass="w-10 h-10" />
                    <div>
                      <div className="text-sm font-semibold">{activeMessage.from}</div>
                      <div className="text-xs" style={{ color: 'var(--d-muted)' }}>
                        {activeMessage.role}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono-num" style={{ color: 'var(--d-muted)' }}>
                    {activeMessage.time}
                  </span>
                </div>

                <h2 className="text-base font-semibold">{activeMessage.subject}</h2>
                <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'var(--d-text)' }}>
                  {activeMessage.body}
                </p>

                {(sentReplies[activeMessage.id] ?? []).map((rep, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--d-surface-muted)',
                      borderColor: 'var(--d-border)',
                    }}
                  >
                    <div className="font-semibold mb-1 flex items-center gap-1" style={{ color: 'var(--d-primary)' }}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Reply sent just now</span>
                    </div>
                    <p>{rep}</p>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-3 space-y-3" style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium" style={{ color: 'var(--d-muted)' }}>
                    {isRu ? `Ответ для ${activeMessage.from}` : `Reply to ${activeMessage.from}`}
                  </span>
                  <FormLanguageToggle compact />
                </div>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isRu
                      ? `Напишите ответ для ${activeMessage.from}...`
                      : `Reply to ${activeMessage.from}...`
                  }
                  className="w-full text-xs bg-transparent outline-none resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md"
                    style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isRu ? 'Отправить ответ' : 'Send Reply'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : panel === 'customers-grid' ? (
          <div className="p-6">
            <ThemedDataGrid
              key="nuxtui-grid"
              title="Customers Data Grid"
              subtitle="UTable-inspired paginated directory with instant filters and sorting"
              defaultViewMode="table"
            />
          </div>
        ) : panel === 'customers-cards' ? (
          <div className="p-6">
            <ThemedDataGrid
              key="nuxtui-cards"
              title="Customers Card Directory"
              subtitle="UPageGrid card layout with multi-page pagination and region filtering"
              defaultViewMode="cards"
            />
          </div>
        ) : panel === 'buttons-edit' ? (
          <div className="p-6">
            <ThemedActionButtonsPage templateLabel="Nuxt UI Dashboard" />
          </div>
        ) : panel === 'settings' ? (
          <div className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast({
                  variant: 'success',
                  title: isRu ? 'Настройки Nuxt UI сохранены' : 'Nuxt UI settings saved',
                  description: projectTitle,
                });
              }}
              className="max-w-xl p-6 border rounded-lg space-y-4 text-xs"
              style={{
                backgroundColor: 'var(--d-surface)',
                borderColor: 'var(--d-border)',
                borderRadius: 'var(--d-radius)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">
                    {isRu ? 'Настройки и токены Nuxt UI v3' : 'Nuxt UI v3 Semantic Tokens'}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--d-muted)' }}>
                    {isRu
                      ? 'Основные параметры проекта и уведомлений'
                      : 'Primary, neutral, and surface tokens update dynamically when switching themes.'}
                  </p>
                </div>
                <FormLanguageToggle compact />
              </div>

              <label className="block space-y-1.5">
                <span className="font-medium">
                  {isRu ? 'Название проекта' : 'Project Name'}
                </span>
                <input
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)' }}
                />
              </label>

              <label className="block space-y-1.5">
                <span className="font-medium">
                  {isRu ? 'Webhook URL для событий' : 'Event Webhook URL'}
                </span>
                <input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-transparent outline-none font-mono-num"
                  style={{ borderColor: 'var(--d-border)' }}
                />
              </label>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-medium rounded-md hover:opacity-90"
                  style={{ backgroundColor: 'var(--d-primary)', color: 'var(--d-primary-fg)' }}
                >
                  {isRu ? 'Сохранить' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setPanel('customers-grid')}
                  className="px-3.5 py-2 text-xs font-medium rounded-md border"
                  style={{ borderColor: 'var(--d-border)' }}
                >
                  {isRu ? 'Открыть Grid' : 'Explore Paginated Grid'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Customers', val: '1,248', delta: '+12%', positive: true },
                { label: 'Conversions', val: '384', delta: '+8.4%', positive: true },
                { label: 'Revenue', val: range === '7d' ? '$40,470' : range === '30d' ? '$150,400' : '$379,100', delta: '+24.1%', positive: true },
                { label: 'Orders', val: '2,914', delta: '-1.8%', positive: false },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 border rounded-lg"
                  style={{
                    backgroundColor: 'var(--d-surface)',
                    borderColor: 'var(--d-border)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: 'var(--d-muted)' }}>
                    {stat.label}
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-bold font-mono-num">{stat.val}</span>
                    <span
                      className="text-xs font-mono-num font-semibold"
                      style={{ color: stat.positive ? 'var(--d-success)' : 'var(--d-danger)' }}
                    >
                      {stat.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div
                className="lg:col-span-8 p-5 border rounded-lg"
                style={{
                  backgroundColor: 'var(--d-surface)',
                  borderColor: 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold">Revenue</h2>
                    <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                      {granularity} subscription revenue breakdown
                    </p>
                  </div>
                  <div
                    className="inline-flex p-0.5 rounded-md border text-xs"
                    style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface-muted)' }}
                  >
                    {(['Daily', 'Weekly'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGranularity(g)}
                        className="px-2.5 py-1 rounded-sm font-medium"
                        style={{
                          backgroundColor: granularity === g ? 'var(--d-surface)' : 'transparent',
                          color: granularity === g ? 'var(--d-text)' : 'var(--d-muted)',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <InteractiveAreaChart
                  data={REVENUE_SERIES[range]}
                  primaryLabel="MRR"
                  secondaryLabel="ARR/12"
                />
              </div>

              <div
                className="lg:col-span-4 p-5 border rounded-lg space-y-4"
                style={{
                  backgroundColor: 'var(--d-surface)',
                  borderColor: 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Top Markets</h2>
                    <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                      Active workspace distribution
                    </p>
                  </div>
                  <button
                    onClick={() => setPanel('customers-grid')}
                    className="text-xs font-medium underline"
                    style={{ color: 'var(--d-primary)' }}
                  >
                    Grid →
                  </button>
                </div>

                <div className="space-y-3.5">
                  {[
                    { country: 'United States', share: 42 },
                    { country: 'Germany', share: 24 },
                    { country: 'United Kingdom', share: 18 },
                    { country: 'France', share: 10 },
                    { country: 'Singapore', share: 6 },
                  ].map((item) => (
                    <div key={item.country} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{item.country}</span>
                        <span className="font-mono-num font-medium">{item.share}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--d-surface-muted)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.share}%`, backgroundColor: 'var(--d-primary)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
