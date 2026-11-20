import { useState } from 'react';
import {
  Bell,
  Check,
  PanelLeft,
  PanelRight,
  Palette,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { GLOBAL_THEME_SCHEMES } from '../../data/stylesRegistry';
import { useFormLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import type { ThemePreset } from '../../types/showcase';
import { FormLanguageToggle } from './FormLanguageToggle';
import { ThemedOffcanvas, type OffcanvasSide } from './ThemedOffcanvas';

interface GlobalOffcanvasDrawerProps {
  open: boolean;
  onClose: () => void;
  activeTheme: ThemePreset;
  onSelectTheme: (themeId: string) => void;
  contextLabel?: string;
}

export function GlobalOffcanvasDrawer({
  open,
  onClose,
  activeTheme,
  onSelectTheme,
  contextLabel,
}: GlobalOffcanvasDrawerProps) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';

  const [side, setSide] = useState<OffcanvasSide>('right');
  const [tab, setTab] = useState<'form' | 'schemes'>('form');

  // Quick offcanvas form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Billing' | 'Access' | 'Infra'>('Billing');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High'>('Normal');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notes, setNotes] = useState('');

  const lightSchemes = GLOBAL_THEME_SCHEMES.filter((t) => !t.isDark);
  const darkSchemes = GLOBAL_THEME_SCHEMES.filter((t) => t.isDark);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = subject.trim() || (isRu ? 'Новая задача' : 'New Request');
    toast({
      variant: 'success',
      title: isRu ? 'Заявка сохранена' : 'Request saved',
      description: isRu
        ? `«${cleanTitle}» (${category} · ${priority}) добавлена в очередь.`
        : `"${cleanTitle}" (${category} · ${priority}) has been queued.`,
    });
    setSubject('');
    setNotes('');
  };

  const triggerToastDemo = (variant: 'success' | 'info' | 'warning' | 'error') => {
    const map = {
      success: {
        title: isRu ? 'Изменения сохранены' : 'Changes saved',
        description: isRu
          ? `Схема «${activeTheme.labelRu}» синхронизирована со всеми модулями.`
          : `Theme "${activeTheme.labelRu}" (${activeTheme.id}) synced across all dashboard panels.`,
      },
      info: {
        title: isRu ? 'Обновление данных' : 'Data synchronized',
        description: isRu
          ? 'Загружено 24 записи аккаунтов с актуальными фильтрами.'
          : 'Loaded 24 account records with active filter state.',
      },
      warning: {
        title: isRu ? 'Проверьте лимиты квоты' : 'Quota threshold reached',
        description: isRu
          ? 'Использовано 85% доступных мест по тарифу Enterprise.'
          : '85% of allocated Enterprise seats are currently assigned.',
      },
      error: {
        title: isRu ? 'Ошибка вебхука' : 'Webhook delivery failed',
        description: isRu
          ? 'Повторная отправка запланирована через 30 секунд.'
          : 'Automatic retry scheduled in 30 seconds.',
      },
    }[variant];

    toast({
      variant,
      title: map.title,
      description: map.description,
    });
  };

  return (
    <ThemedOffcanvas
      open={open}
      onClose={onClose}
      side={side}
      size="md"
      title={isRu ? 'Offcanvas — Панель управления' : 'Offcanvas Workspace Drawer'}
      subtitle={
        contextLabel
          ? `${contextLabel} · ${activeTheme.labelRu}`
          : `${isRu ? 'Схема' : 'Scheme'}: ${activeTheme.labelRu}`
      }
      headerActions={<FormLanguageToggle compact />}
      footer={
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSide('left')}
              className="inline-flex items-center gap-1 px-2.5 py-1 border font-medium transition-colors"
              style={{
                borderColor: side === 'left' ? 'var(--d-primary)' : 'var(--d-border)',
                backgroundColor: side === 'left' ? 'var(--d-accent-soft)' : 'var(--d-surface)',
                color: side === 'left' ? 'var(--d-primary)' : 'var(--d-muted)',
                borderRadius: 'var(--d-radius)',
              }}
            >
              <PanelLeft className="w-3.5 h-3.5" />
              <span>{isRu ? 'Слева' : 'Left'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSide('right')}
              className="inline-flex items-center gap-1 px-2.5 py-1 border font-medium transition-colors"
              style={{
                borderColor: side === 'right' ? 'var(--d-primary)' : 'var(--d-border)',
                backgroundColor: side === 'right' ? 'var(--d-accent-soft)' : 'var(--d-surface)',
                color: side === 'right' ? 'var(--d-primary)' : 'var(--d-muted)',
                borderRadius: 'var(--d-radius)',
              }}
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span>{isRu ? 'Справа' : 'Right'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border font-medium hover:opacity-80"
            style={{
              borderColor: 'var(--d-border)',
              backgroundColor: 'var(--d-surface)',
              borderRadius: 'var(--d-radius)',
            }}
          >
            {isRu ? 'Закрыть' : 'Close'}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Segmented Switch inside Offcanvas */}
        <div
          className="grid grid-cols-2 p-1 border text-xs"
          style={{
            backgroundColor: 'var(--d-surface-muted)',
            borderColor: 'var(--d-border)',
            borderRadius: 'var(--d-radius)',
          }}
        >
          <button
            type="button"
            onClick={() => setTab('form')}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 font-medium transition-colors"
            style={{
              backgroundColor: tab === 'form' ? 'var(--d-surface)' : 'transparent',
              color: tab === 'form' ? 'var(--d-text)' : 'var(--d-muted)',
              borderRadius: 'calc(var(--d-radius) - 2px)',
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isRu ? 'Быстрая форма' : 'Quick Form'}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('schemes')}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 font-medium transition-colors"
            style={{
              backgroundColor: tab === 'schemes' ? 'var(--d-surface)' : 'transparent',
              color: tab === 'schemes' ? 'var(--d-text)' : 'var(--d-muted)',
              borderRadius: 'calc(var(--d-radius) - 2px)',
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isRu ? 'Схемы (14) и Toast' : 'Schemes (14) & Toast'}</span>
          </button>
        </div>

        {tab === 'form' ? (
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {isRu ? 'Создать обращение / задачу' : 'Create Quick Request'}
              </span>
              <span style={{ color: 'var(--d-muted)' }}>
                {isRu ? 'Язык формы:' : 'Form lang:'} {locale.toUpperCase()}
              </span>
            </div>

            <label className="block space-y-1.5">
              <span className="font-medium">{isRu ? 'Заголовок' : 'Title'}</span>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  isRu ? 'Например: Продлить тариф Enterprise' : 'e.g. Renew Enterprise SLA'
                }
                className="w-full px-3 py-2 border bg-transparent outline-none"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="font-medium">{isRu ? 'Категория' : 'Category'}</span>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as 'Billing' | 'Access' | 'Infra')
                  }
                  className="w-full px-2.5 py-2 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="Billing" className="text-slate-900">
                    {isRu ? 'Биллинг' : 'Billing'}
                  </option>
                  <option value="Access" className="text-slate-900">
                    {isRu ? 'Доступы' : 'Access'}
                  </option>
                  <option value="Infra" className="text-slate-900">
                    {isRu ? 'Инфраструктура' : 'Infrastructure'}
                  </option>
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="font-medium">{isRu ? 'Приоритет' : 'Priority'}</span>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as 'Low' | 'Normal' | 'High')
                  }
                  className="w-full px-2.5 py-2 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="Low" className="text-slate-900">
                    {isRu ? 'Низкий' : 'Low'}
                  </option>
                  <option value="Normal" className="text-slate-900">
                    {isRu ? 'Обычный' : 'Normal'}
                  </option>
                  <option value="High" className="text-slate-900">
                    {isRu ? 'Высокий' : 'High'}
                  </option>
                </select>
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="font-medium">{isRu ? 'Комментарий' : 'Notes'}</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isRu
                    ? 'Дополнительные детали по заявке...'
                    : 'Optional context or instructions...'
                }
                className="w-full px-3 py-2 border bg-transparent outline-none resize-none"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              />
            </label>

            <label
              className="flex items-center justify-between py-2.5 px-3 border cursor-pointer"
              style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            >
              <span>
                {isRu ? 'Отправить уведомление на email' : 'Send email confirmation'}
              </span>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
              />
            </label>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSubject('');
                  setNotes('');
                  toast({
                    variant: 'info',
                    title: isRu ? 'Форма очищена' : 'Form cleared',
                  });
                }}
                className="px-3 py-2 border font-medium hover:opacity-80"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              >
                {isRu ? 'Сбросить' : 'Reset'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-medium hover:opacity-90"
                style={{
                  backgroundColor: 'var(--d-primary)',
                  color: 'var(--d-primary-fg)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRu ? 'Отправить' : 'Submit'}</span>
              </button>
            </div>

            {/* Quick Toast Demo Strip right below form */}
            <div className="pt-4 border-t space-y-2.5" style={{ borderColor: 'var(--d-border)' }}>
              <div className="flex items-center gap-1.5 font-semibold">
                <Bell className="w-3.5 h-3.5" />
                <span>{isRu ? 'Проверить Toast-уведомления' : 'Test Toast Notifications'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'success', labelRu: 'Успех (Success)', labelEn: 'Success', color: 'var(--d-success)' },
                    { id: 'info', labelRu: 'Инфо (Info)', labelEn: 'Info', color: 'var(--d-primary)' },
                    { id: 'warning', labelRu: 'Внимание (Warn)', labelEn: 'Warning', color: 'var(--d-warning)' },
                    { id: 'error', labelRu: 'Ошибка (Error)', labelEn: 'Error', color: 'var(--d-danger)' },
                  ] as const
                ).map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => triggerToastDemo(btn.id)}
                    className="px-2.5 py-2 border text-left font-medium hover:opacity-80 transition-opacity"
                    style={{
                      borderColor: 'var(--d-border)',
                      color: btn.color,
                      borderRadius: 'var(--d-radius)',
                    }}
                  >
                    {isRu ? btn.labelRu : btn.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="font-semibold" style={{ color: 'var(--d-muted)' }}>
                {isRu
                  ? `Светлые схемы (${lightSchemes.length})`
                  : `Light Schemes (${lightSchemes.length})`}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {lightSchemes.map((scheme) => {
                  const active = scheme.id === activeTheme.id;
                  return (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => {
                        onSelectTheme(scheme.id);
                        toast({
                          variant: 'info',
                          title: isRu
                            ? `Схема: ${scheme.labelRu}`
                            : `Theme: ${scheme.id}`,
                          description: isRu
                            ? 'Offcanvas и Toast обновлены под выбранную палитру.'
                            : 'Offcanvas and Toast tokens updated immediately.',
                        });
                      }}
                      className="flex items-center justify-between gap-2 px-2.5 py-2 border text-left transition-colors"
                      style={{
                        borderColor: active ? 'var(--d-primary)' : 'var(--d-border)',
                        backgroundColor: active ? 'var(--d-accent-soft)' : 'transparent',
                        borderRadius: 'var(--d-radius)',
                      }}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: scheme.swatch }}
                        />
                        <span className="truncate font-medium">
                          {isRu ? scheme.labelRu : scheme.id}
                        </span>
                      </span>
                      {active && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--d-primary)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold" style={{ color: 'var(--d-muted)' }}>
                {isRu
                  ? `Тёмные схемы (${darkSchemes.length})`
                  : `Dark Schemes (${darkSchemes.length})`}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {darkSchemes.map((scheme) => {
                  const active = scheme.id === activeTheme.id;
                  return (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => {
                        onSelectTheme(scheme.id);
                        toast({
                          variant: 'info',
                          title: isRu
                            ? `Схема: ${scheme.labelRu}`
                            : `Theme: ${scheme.id}`,
                          description: isRu
                            ? 'Offcanvas и Toast обновлены под выбранную палитру.'
                            : 'Offcanvas and Toast tokens updated immediately.',
                        });
                      }}
                      className="flex items-center justify-between gap-2 px-2.5 py-2 border text-left transition-colors"
                      style={{
                        borderColor: active ? 'var(--d-primary)' : 'var(--d-border)',
                        backgroundColor: active ? 'var(--d-accent-soft)' : 'transparent',
                        borderRadius: 'var(--d-radius)',
                      }}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: scheme.swatch }}
                        />
                        <span className="truncate font-medium">
                          {isRu ? scheme.labelRu : scheme.id}
                        </span>
                      </span>
                      {active && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--d-primary)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--d-border)' }}>
              <div className="font-semibold">
                {isRu ? 'Проверка Toast в текущей схеме' : 'Preview Toasts in Active Scheme'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerToastDemo('success')}
                  className="px-2.5 py-1.5 border font-medium hover:opacity-80"
                  style={{
                    borderColor: 'var(--d-border)',
                    color: 'var(--d-success)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  Success Toast
                </button>
                <button
                  type="button"
                  onClick={() => triggerToastDemo('info')}
                  className="px-2.5 py-1.5 border font-medium hover:opacity-80"
                  style={{
                    borderColor: 'var(--d-border)',
                    color: 'var(--d-primary)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  Info Toast
                </button>
                <button
                  type="button"
                  onClick={() => triggerToastDemo('warning')}
                  className="px-2.5 py-1.5 border font-medium hover:opacity-80"
                  style={{
                    borderColor: 'var(--d-border)',
                    color: 'var(--d-warning)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  Warning Toast
                </button>
                <button
                  type="button"
                  onClick={() => triggerToastDemo('error')}
                  className="px-2.5 py-1.5 border font-medium hover:opacity-80"
                  style={{
                    borderColor: 'var(--d-border)',
                    color: 'var(--d-danger)',
                    borderRadius: 'var(--d-radius)',
                  }}
                >
                  Error Toast
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemedOffcanvas>
  );
}
