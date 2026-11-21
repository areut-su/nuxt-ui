import { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  PanelRight,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';
import { useFormLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { FormLanguageToggle } from './FormLanguageToggle';
import { IconTooltipButton } from './IconTooltipButton';
import { ThemedOffcanvas } from './ThemedOffcanvas';

interface EditableEntity {
  id: string;
  title: string;
  category: 'Billing' | 'Access' | 'Content' | 'API';
  owner: string;
  status: 'Published' | 'Draft' | 'Archived';
  locked: boolean;
  amount: number;
  notes: string;
  updatedAt: string;
}

const INITIAL_ITEMS: EditableEntity[] = [
  {
    id: 'DOC-201',
    title: 'Enterprise SLA Contract 2026',
    category: 'Billing',
    owner: 'Elena Rostova',
    status: 'Published',
    locked: false,
    amount: 4200,
    notes: 'Annual enterprise renewal terms with 99.95% uptime SLA.',
    updatedAt: '2026-05-30',
  },
  {
    id: 'DOC-202',
    title: 'SAML 2.0 SSO Policy Matrix',
    category: 'Access',
    owner: 'Jackson Lee',
    status: 'Draft',
    locked: false,
    amount: 0,
    notes: 'Role mapping specification for Okta and Azure AD workspaces.',
    updatedAt: '2026-05-29',
  },
  {
    id: 'DOC-203',
    title: 'Webhook Signing Rotation Guide',
    category: 'API',
    owner: 'Marcus Chen',
    status: 'Published',
    locked: true,
    amount: 950,
    notes: 'Zero-downtime secret rotation procedure for production webhooks.',
    updatedAt: '2026-05-28',
  },
  {
    id: 'DOC-204',
    title: 'Q2 Customer Onboarding Playbook',
    category: 'Content',
    owner: 'Olivia Martin',
    status: 'Archived',
    locked: false,
    amount: 1490,
    notes: 'Superseded by Q3 automated onboarding checklist.',
    updatedAt: '2026-05-24',
  },
];

interface ThemedActionButtonsPageProps {
  templateLabel: string;
}

export function ThemedActionButtonsPage({ templateLabel }: ThemedActionButtonsPageProps) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';

  const [items, setItems] = useState<EditableEntity[]>(INITIAL_ITEMS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_ITEMS[0].id);
  const [draft, setDraft] = useState<EditableEntity>({ ...INITIAL_ITEMS[0] });
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [deleteTarget, setDeleteTarget] = useState<EditableEntity | null>(null);
  const [inspectItem, setInspectItem] = useState<EditableEntity | null>(null);

  const boxSizeClass =
    buttonSize === 'sm' ? 'w-8 h-8' : buttonSize === 'lg' ? 'w-11 h-11' : 'w-9 h-9';

  const iconSizeClass =
    buttonSize === 'sm' ? 'w-3.5 h-3.5' : buttonSize === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const selectForEdit = (item: EditableEntity) => {
    setIsCreating(false);
    setSelectedId(item.id);
    setDraft({ ...item });
  };

  const startCreate = () => {
    const nextNum = 205 + items.length;
    const blank: EditableEntity = {
      id: `DOC-${nextNum}`,
      title: '',
      category: 'Billing',
      owner: 'Elena Rostova',
      status: 'Draft',
      locked: false,
      amount: 500,
      notes: '',
      updatedAt: '2026-05-30',
    };
    setIsCreating(true);
    setSelectedId(blank.id);
    setDraft(blank);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.title.trim()) {
      toast({
        variant: 'warning',
        title: isRu ? 'Укажите название записи' : 'Title is required',
      });
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      const finalRecord: EditableEntity = {
        ...draft,
        updatedAt: '2026-05-30',
      };

      if (isCreating) {
        setItems((prev) => [finalRecord, ...prev]);
        setIsCreating(false);
        toast({
          variant: 'success',
          title: isRu ? `Создано: ${finalRecord.id}` : `Created: ${finalRecord.id}`,
          description: finalRecord.title,
        });
      } else {
        setItems((prev) => prev.map((it) => (it.id === finalRecord.id ? finalRecord : it)));
        toast({
          variant: 'success',
          title: isRu ? `Сохранено: ${finalRecord.id}` : `Saved: ${finalRecord.id}`,
          description: finalRecord.title,
        });
      }
      setDraft(finalRecord);
      setSelectedId(finalRecord.id);
      setSaving(false);
    }, 350);
  };

  const handleTogglePublish = (item: EditableEntity) => {
    const nextStatus: EditableEntity['status'] =
      item.status === 'Published' ? 'Draft' : 'Published';

    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: nextStatus } : it))
    );
    if (draft.id === item.id) {
      setDraft((prev) => ({ ...prev, status: nextStatus }));
    }
    if (inspectItem?.id === item.id) {
      setInspectItem((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }

    toast({
      variant: nextStatus === 'Published' ? 'success' : 'warning',
      title:
        nextStatus === 'Published'
          ? isRu
            ? `Опубликовано: ${item.id}`
            : `Published: ${item.id}`
          : isRu
            ? `Снято с публикации: ${item.id}`
            : `Unpublished (Draft): ${item.id}`,
      description: item.title,
    });
  };

  const handleDuplicate = (item: EditableEntity) => {
    const copyId = `DOC-${210 + items.length}`;
    const cloned: EditableEntity = {
      ...item,
      id: copyId,
      title: `${item.title} (${isRu ? 'копия' : 'Copy'})`,
      status: 'Draft',
      locked: false,
    };
    setItems((prev) => [cloned, ...prev]);
    selectForEdit(cloned);
    toast({
      variant: 'info',
      title: isRu ? `Дублировано как ${copyId}` : `Duplicated as ${copyId}`,
      description: cloned.title,
    });
  };

  const handleToggleLock = (item: EditableEntity) => {
    const nextLocked = !item.locked;
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, locked: nextLocked } : it))
    );
    if (draft.id === item.id) {
      setDraft((prev) => ({ ...prev, locked: nextLocked }));
    }
    if (inspectItem?.id === item.id) {
      setInspectItem((prev) => (prev ? { ...prev, locked: nextLocked } : null));
    }
    toast({
      variant: nextLocked ? 'error' : 'info',
      title: nextLocked
        ? isRu
          ? `Заблокировано: ${item.id}`
          : `Locked: ${item.id}`
        : isRu
          ? `Разблокировано: ${item.id}`
          : `Unlocked: ${item.id}`,
      description: item.title,
    });
  };

  const handleArchive = (item: EditableEntity) => {
    const nextStatus = item.status === 'Archived' ? 'Published' : 'Archived';
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: nextStatus } : it))
    );
    if (draft.id === item.id) {
      setDraft((prev) => ({ ...prev, status: nextStatus }));
    }
    if (inspectItem?.id === item.id) {
      setInspectItem((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    toast({
      variant: nextStatus === 'Archived' ? 'warning' : 'success',
      title:
        nextStatus === 'Archived'
          ? isRu
            ? `В архиве: ${item.id}`
            : `Archived: ${item.id}`
          : isRu
            ? `Восстановлено из архива: ${item.id}`
            : `Restored from archive: ${item.id}`,
    });
  };

  const executeConfirmedDelete = () => {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== removed.id);
      if (selectedId === removed.id && next.length > 0) {
        setSelectedId(next[0].id);
        setDraft({ ...next[0] });
        setIsCreating(false);
      }
      return next;
    });
    if (inspectItem?.id === removed.id) setInspectItem(null);
    setDeleteTarget(null);

    toast({
      variant: 'warning',
      title: isRu ? `Удалено: ${removed.id}` : `Deleted: ${removed.id}`,
      description: removed.title,
      durationMs: 6000,
      action: {
        label: isRu ? 'Отменить' : 'Undo',
        onClick: () => {
          setItems((prev) => [removed, ...prev]);
          selectForEdit(removed);
          toast({
            variant: 'success',
            title: isRu ? `Восстановлено: ${removed.id}` : `Restored: ${removed.id}`,
          });
        },
      },
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      toast({
        variant: 'info',
        title: isRu ? 'Список обновлён' : 'List refreshed',
        description: `${items.length} ${isRu ? 'записей актуально' : 'records up to date'}`,
      });
    }, 350);
  };

  const statusLabel = (st: EditableEntity['status']) => {
    if (!isRu) return st;
    if (st === 'Published') return 'Опубликован';
    if (st === 'Draft') return 'Черновик';
    return 'В архиве';
  };

  const statusColor = (st: EditableEntity['status']) => {
    if (st === 'Published') return 'var(--d-success)';
    if (st === 'Draft') return 'var(--d-warning)';
    return 'var(--d-muted)';
  };

  const isDraftPublished = draft.status === 'Published';
  const isDraftArchived = draft.status === 'Archived';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {isRu ? 'Кнопки действий (значки + подпись при наведении)' : 'Icon Action Buttons & Record Editor'}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--d-muted)' }}>
            {isRu
              ? `Тематическая подсветка при наведении, переключение цвета/значка публикации и блокировки (${templateLabel})`
              : `Theme-aware hover highlights with stateful publish/lock icon & color toggles (${templateLabel})`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FormLanguageToggle />

          <div
            className="inline-flex p-0.5 border text-xs"
            style={{
              backgroundColor: 'var(--d-surface-muted)',
              borderColor: 'var(--d-border)',
              borderRadius: 'var(--d-radius)',
            }}
            role="group"
            aria-label={isRu ? 'Размер кнопок' : 'Button size'}
          >
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setButtonSize(sz)}
                className="px-2 py-1 text-[11px] font-semibold uppercase transition-colors cursor-pointer"
                style={{
                  backgroundColor: buttonSize === sz ? 'var(--d-surface)' : 'transparent',
                  color: buttonSize === sz ? 'var(--d-text)' : 'var(--d-muted)',
                  borderRadius: 'calc(var(--d-radius) - 2px)',
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Icon-Only Action Buttons with Themed Hover & Stateful Toggles */}
      <section
        className="p-5 border space-y-4"
        style={{
          backgroundColor: 'var(--d-surface)',
          borderColor: 'var(--d-border)',
          borderRadius: 'var(--d-radius)',
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b"
          style={{ borderColor: 'var(--d-border)' }}
        >
          <div>
            <h2 className="text-sm font-semibold">
              {isRu ? 'Панель кнопок-значков' : 'Icon-Only Action Toolbar'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
              {isRu
                ? 'Наведите для подсветки и подсказки · «Опубликовать», «Заблокировать» и «Архивировать» меняют цвет и значок'
                : 'Hover for themed highlight & tooltip · Publish, Lock, and Archive dynamically toggle color & icon'}
            </p>
          </div>
          <span className="text-xs font-mono-num" style={{ color: 'var(--d-muted)' }}>
            {draft.id} · {statusLabel(draft.status)}
            {draft.locked ? (isRu ? ' · Заблокировано' : ' · Locked') : ''}
          </span>
        </div>

        {/* Row 1: Primary, Semantic & Stateful Toggle Icon Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <IconTooltipButton
            tone="primary"
            label={isRu ? 'Создать запись' : 'Create record'}
            onClick={startCreate}
            className={boxSizeClass}
          >
            <Plus className={iconSizeClass} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="primary-soft"
            label={isRu ? 'Редактировать' : 'Edit'}
            onClick={() => {
              const found = items.find((i) => i.id === selectedId);
              if (found) selectForEdit(found);
              toast({
                variant: 'info',
                title: isRu ? `Редактирование ${draft.id}` : `Editing ${draft.id}`,
                description: isRu
                  ? 'Форма редактирования ниже готова к изменению.'
                  : 'Edit form below is focused.',
              });
            }}
            className={boxSizeClass}
          >
            <Pencil className={iconSizeClass} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="success-outline"
            label={isRu ? 'Сохранить' : 'Save'}
            disabled={saving || draft.locked}
            onClick={() => handleSave()}
            className={boxSizeClass}
          >
            {saving ? (
              <Loader2 className={`${iconSizeClass} animate-spin`} />
            ) : (
              <Save className={iconSizeClass} />
            )}
          </IconTooltipButton>

          {/* Stateful Toggle: Publish <-> Unpublish (Green Globe <-> Amber EyeOff) */}
          <IconTooltipButton
            tone={isDraftPublished ? 'success' : 'warning-outline'}
            label={
              isDraftPublished
                ? isRu
                  ? 'Опубликовано · Нажмите, чтобы снять с публикации'
                  : 'Published · Click to unpublish'
                : isRu
                  ? 'Черновик · Нажмите, чтобы опубликовать'
                  : 'Unpublished · Click to publish'
            }
            disabled={saving || draft.locked || isCreating}
            onClick={() => handleTogglePublish(draft)}
            className={boxSizeClass}
          >
            {isDraftPublished ? (
              <Globe className={iconSizeClass} />
            ) : (
              <EyeOff className={iconSizeClass} />
            )}
          </IconTooltipButton>

          {/* Stateful Toggle: Lock <-> Unlock (Red Lock <-> Neutral Unlock) */}
          <IconTooltipButton
            tone={draft.locked ? 'danger' : 'neutral'}
            label={
              draft.locked
                ? isRu
                  ? 'Заблокировано · Нажмите, чтобы разблокировать'
                  : 'Locked · Click to unlock'
                : isRu
                  ? 'Разблокировано · Нажмите, чтобы заблокировать'
                  : 'Unlocked · Click to lock'
            }
            disabled={isCreating}
            onClick={() => handleToggleLock(draft)}
            className={boxSizeClass}
          >
            {draft.locked ? (
              <Lock className={iconSizeClass} />
            ) : (
              <Unlock className={iconSizeClass} />
            )}
          </IconTooltipButton>

          {/* Stateful Toggle: Archive <-> Restore (Amber Filled <-> Amber Outline) */}
          <IconTooltipButton
            tone={isDraftArchived ? 'warning' : 'warning-outline'}
            label={
              isDraftArchived
                ? isRu
                  ? 'В архиве · Вернуть из архива'
                  : 'Archived · Click to restore'
                : isRu
                  ? 'Архивировать'
                  : 'Archive'
            }
            disabled={isCreating}
            onClick={() => handleArchive(draft)}
            className={boxSizeClass}
          >
            {isDraftArchived ? (
              <ArchiveRestore className={iconSizeClass} />
            ) : (
              <Archive className={iconSizeClass} />
            )}
          </IconTooltipButton>

          <IconTooltipButton
            tone="neutral"
            label={isRu ? 'Дублировать' : 'Duplicate'}
            onClick={() => handleDuplicate(draft)}
            className={boxSizeClass}
          >
            <Copy className={iconSizeClass} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="neutral"
            label={isRu ? 'Просмотр (Offcanvas)' : 'Preview (Offcanvas)'}
            onClick={() => setInspectItem(draft)}
            className={boxSizeClass}
          >
            <Eye className={iconSizeClass} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="neutral"
            label={isRu ? 'Экспорт JSON' : 'Export JSON'}
            onClick={() =>
              toast({
                variant: 'info',
                title: isRu ? 'Экспорт выполнен' : 'Export completed',
                description: `${draft.id}.json`,
              })
            }
            className={boxSizeClass}
          >
            <Download className={iconSizeClass} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="neutral"
            label={isRu ? 'Печать' : 'Print'}
            onClick={() =>
              toast({
                variant: 'info',
                title: isRu ? 'Отправлено на печать' : 'Sent to print queue',
                description: draft.title || draft.id,
              })
            }
            className={boxSizeClass}
          >
            <Printer className={iconSizeClass} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="ghost"
            label={isRu ? 'Обновить список' : 'Refresh list'}
            onClick={handleRefresh}
            className={boxSizeClass}
          >
            <RefreshCw className={`${iconSizeClass} ${refreshing ? 'animate-spin' : ''}`} />
          </IconTooltipButton>

          <IconTooltipButton
            tone="danger"
            label={isRu ? 'Удалить' : 'Delete'}
            disabled={isCreating}
            onClick={() => setDeleteTarget(draft)}
            className={boxSizeClass}
          >
            <Trash2 className={iconSizeClass} />
          </IconTooltipButton>
        </div>

        {/* Row 2: Compact Icon Button Group + Disabled State */}
        <div
          className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--d-border)' }}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span style={{ color: 'var(--d-muted)' }}>
              {isRu ? 'Группа значков:' : 'Icon group:'}
            </span>
            <div className="inline-flex items-center gap-1">
              <IconTooltipButton
                tone="neutral"
                label={isRu ? 'Редактировать' : 'Edit'}
                onClick={() => handleSave()}
                className="w-8 h-8"
              >
                <Pencil className="w-3.5 h-3.5" />
              </IconTooltipButton>
              <IconTooltipButton
                tone={isDraftPublished ? 'success' : 'warning-outline'}
                label={
                  isDraftPublished
                    ? isRu
                      ? 'Снять с публикации'
                      : 'Unpublish'
                    : isRu
                      ? 'Опубликовать'
                      : 'Publish'
                }
                disabled={draft.locked || isCreating}
                onClick={() => handleTogglePublish(draft)}
                className="w-8 h-8"
              >
                {isDraftPublished ? (
                  <Globe className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </IconTooltipButton>
              <IconTooltipButton
                tone={draft.locked ? 'danger' : 'neutral'}
                label={
                  draft.locked
                    ? isRu
                      ? 'Разблокировать'
                      : 'Unlock'
                    : isRu
                      ? 'Заблокировать'
                      : 'Lock'
                }
                disabled={isCreating}
                onClick={() => handleToggleLock(draft)}
                className="w-8 h-8"
              >
                {draft.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </IconTooltipButton>
              <IconTooltipButton
                tone="neutral"
                label={isRu ? 'Открыть в Offcanvas' : 'Open in Offcanvas'}
                onClick={() => setInspectItem(draft)}
                className="w-8 h-8"
              >
                <PanelRight className="w-3.5 h-3.5" />
              </IconTooltipButton>
              <IconTooltipButton
                tone="danger-outline"
                label={isRu ? 'Удалить' : 'Delete'}
                disabled={isCreating}
                onClick={() => setDeleteTarget(draft)}
                className="w-8 h-8"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </IconTooltipButton>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--d-muted)' }}>
              {isRu ? 'Неактивная:' : 'Disabled:'}
            </span>
            <IconTooltipButton
              tone="neutral"
              label={isRu ? 'Отправка недоступна' : 'Send disabled'}
              disabled
              className="w-8 h-8"
            >
              <Send className="w-3.5 h-3.5" />
            </IconTooltipButton>
          </div>
        </div>
      </section>

      {/* Section 2: Split View — Table with Stateful Icon-Only Row Actions + Live Edit Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Editable Records Table */}
        <div
          className="xl:col-span-7 border"
          style={{
            backgroundColor: 'var(--d-surface)',
            borderColor: 'var(--d-border)',
            borderRadius: 'var(--d-radius)',
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between gap-3"
            style={{ borderColor: 'var(--d-border)' }}
          >
            <div>
              <h2 className="text-sm font-semibold">
                {isRu ? 'Записи со значками действий' : 'Records with Icon Actions'}
              </h2>
              <p className="text-[11px]" style={{ color: 'var(--d-muted)' }}>
                {isRu
                  ? 'Кликайте значки публикации и замка в строках — цвет и иконка сразу меняются'
                  : 'Click Publish or Lock icons per row to toggle state, color, and icon immediately'}
              </p>
            </div>
            <IconTooltipButton
              tone="primary"
              label={isRu ? 'Создать новую запись' : 'Create new record'}
              onClick={startCreate}
              className="w-8 h-8 shrink-0"
            >
              <Plus className="w-4 h-4" />
            </IconTooltipButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead style={{ backgroundColor: 'var(--d-surface-muted)', color: 'var(--d-muted)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--d-border)' }}>
                  <th className="py-2.5 px-3 font-medium">ID</th>
                  <th className="py-2.5 px-3 font-medium">{isRu ? 'Название' : 'Title'}</th>
                  <th className="py-2.5 px-3 font-medium">{isRu ? 'Статус' : 'Status'}</th>
                  <th className="py-2.5 px-3 font-medium text-right">
                    {isRu ? 'Сумма' : 'Amount'}
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">
                    {isRu ? 'Действия' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                {items.map((item, idx) => {
                  const isActive = !isCreating && item.id === selectedId;
                  const isPublished = item.status === 'Published';
                  const tipPlace = idx === 0 ? 'bottom' : 'top';
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: isActive ? 'var(--d-accent-soft)' : 'transparent',
                      }}
                    >
                      <td className="py-2.5 px-3 font-mono-num font-medium whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium flex items-center gap-1.5">
                          <span className="truncate max-w-40">{item.title}</span>
                          {item.locked && (
                            <Lock className="w-3 h-3 shrink-0" style={{ color: 'var(--d-danger)' }} />
                          )}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--d-muted)' }}>
                          {item.category} · {item.owner}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-semibold" style={{ color: statusColor(item.status) }}>
                          {statusLabel(item.status)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-num font-semibold whitespace-nowrap">
                        ${item.amount.toLocaleString('en-US')}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <IconTooltipButton
                            tone={isActive ? 'primary' : 'neutral'}
                            label={isRu ? 'Редактировать' : 'Edit'}
                            placement={tipPlace}
                            onClick={() => selectForEdit(item)}
                            className="w-7 h-7"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </IconTooltipButton>

                          <IconTooltipButton
                            tone={isPublished ? 'success' : 'warning-outline'}
                            label={
                              isPublished
                                ? isRu
                                  ? 'Опубликовано · Снять с публикации'
                                  : 'Published · Unpublish'
                                : isRu
                                  ? 'Не опубликовано · Опубликовать'
                                  : 'Unpublished · Publish'
                            }
                            disabled={item.locked}
                            placement={tipPlace}
                            onClick={() => handleTogglePublish(item)}
                            className="w-7 h-7"
                          >
                            {isPublished ? (
                              <Globe className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </IconTooltipButton>

                          <IconTooltipButton
                            tone={item.locked ? 'danger' : 'neutral'}
                            label={
                              item.locked
                                ? isRu
                                  ? 'Заблокировано · Разблокировать'
                                  : 'Locked · Unlock'
                                : isRu
                                  ? 'Открыто · Заблокировать'
                                  : 'Unlocked · Lock'
                            }
                            placement={tipPlace}
                            onClick={() => handleToggleLock(item)}
                            className="w-7 h-7"
                          >
                            {item.locked ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </IconTooltipButton>

                          <IconTooltipButton
                            tone="neutral"
                            label={isRu ? 'Просмотр в Offcanvas' : 'Inspect in Offcanvas'}
                            placement={tipPlace}
                            onClick={() => setInspectItem(item)}
                            className="w-7 h-7"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </IconTooltipButton>

                          <IconTooltipButton
                            tone="neutral"
                            label={isRu ? 'Дублировать' : 'Duplicate'}
                            placement={tipPlace}
                            onClick={() => handleDuplicate(item)}
                            className="w-7 h-7"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </IconTooltipButton>

                          <IconTooltipButton
                            tone="danger-outline"
                            label={isRu ? 'Удалить' : 'Delete'}
                            placement={tipPlace}
                            align="right"
                            onClick={() => setDeleteTarget(item)}
                            className="w-7 h-7"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </IconTooltipButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Edit Form Panel */}
        <form
          onSubmit={(e) => handleSave(e)}
          className="xl:col-span-5 border p-5 space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--d-surface)',
            borderColor: 'var(--d-border)',
            borderRadius: 'var(--d-radius)',
          }}
        >
          <div
            className="pb-3 border-b flex items-start justify-between gap-2"
            style={{ borderColor: 'var(--d-border)' }}
          >
            <div>
              <h2 className="text-sm font-bold">
                {isCreating
                  ? isRu
                    ? `Создание записи (${draft.id})`
                    : `Create Record (${draft.id})`
                  : isRu
                    ? `Редактирование ${draft.id}`
                    : `Editing ${draft.id}`}
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--d-muted)' }}>
                {draft.locked
                  ? isRu
                    ? 'Запись заблокирована — нажмите красный значок замка'
                    : 'Record is locked — click the red lock icon to unlock'
                  : isRu
                    ? 'Измените поля и нажмите значок сохранения внизу'
                    : 'Update fields and click the save icon below'}
              </p>
            </div>
            <FormLanguageToggle compact />
          </div>

          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="font-medium">{isRu ? 'Название' : 'Title'}</span>
              <input
                required
                disabled={draft.locked}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder={isRu ? 'Введите название документа...' : 'Enter record title...'}
                className="w-full px-3 py-2 border bg-transparent outline-none disabled:opacity-50"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-medium">{isRu ? 'Категория' : 'Category'}</span>
                <select
                  disabled={draft.locked}
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      category: e.target.value as EditableEntity['category'],
                    })
                  }
                  className="w-full px-2.5 py-2 border bg-transparent outline-none disabled:opacity-50"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="Billing" className="text-slate-900">Billing</option>
                  <option value="Access" className="text-slate-900">Access</option>
                  <option value="Content" className="text-slate-900">Content</option>
                  <option value="API" className="text-slate-900">API</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="font-medium">{isRu ? 'Статус' : 'Status'}</span>
                <select
                  disabled={draft.locked}
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      status: e.target.value as EditableEntity['status'],
                    })
                  }
                  className="w-full px-2.5 py-2 border bg-transparent outline-none disabled:opacity-50"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="Published" className="text-slate-900">{statusLabel('Published')}</option>
                  <option value="Draft" className="text-slate-900">{statusLabel('Draft')}</option>
                  <option value="Archived" className="text-slate-900">{statusLabel('Archived')}</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-medium">{isRu ? 'Ответственный' : 'Owner'}</span>
                <input
                  disabled={draft.locked}
                  value={draft.owner}
                  onChange={(e) => setDraft({ ...draft, owner: e.target.value })}
                  className="w-full px-3 py-2 border bg-transparent outline-none disabled:opacity-50"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>

              <label className="block space-y-1">
                <span className="font-medium">{isRu ? 'Бюджет ($)' : 'Amount ($)'}</span>
                <input
                  type="number"
                  min={0}
                  disabled={draft.locked}
                  value={draft.amount}
                  onChange={(e) =>
                    setDraft({ ...draft, amount: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border bg-transparent outline-none font-mono-num disabled:opacity-50"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="font-medium">{isRu ? 'Примечание' : 'Notes'}</span>
              <textarea
                rows={3}
                disabled={draft.locked}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                className="w-full px-3 py-2 border bg-transparent outline-none resize-none disabled:opacity-50"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              />
            </label>
          </div>

          {/* Form Icon-Only Action Buttons Bar */}
          <div
            className="pt-3 border-t flex items-center justify-between gap-2"
            style={{ borderColor: 'var(--d-border)' }}
          >
            <div className="flex items-center gap-1.5">
              <IconTooltipButton
                tone="neutral"
                label={isRu ? 'Сбросить изменения' : 'Reset changes'}
                onClick={() => {
                  const orig = items.find((i) => i.id === selectedId);
                  if (orig) {
                    setDraft({ ...orig });
                    setIsCreating(false);
                  } else if (items[0]) {
                    selectForEdit(items[0]);
                  }
                  toast({
                    variant: 'info',
                    title: isRu ? 'Изменения сброшены' : 'Changes reverted',
                  });
                }}
                className="w-9 h-9"
              >
                <RotateCcw className="w-4 h-4" />
              </IconTooltipButton>

              {!isCreating && (
                <IconTooltipButton
                  tone="danger-outline"
                  label={isRu ? 'Удалить запись' : 'Delete record'}
                  onClick={() => setDeleteTarget(draft)}
                  className="w-9 h-9"
                >
                  <Trash2 className="w-4 h-4" />
                </IconTooltipButton>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {!isCreating && (
                <IconTooltipButton
                  tone={draft.locked ? 'danger' : 'neutral'}
                  label={
                    draft.locked
                      ? isRu
                        ? 'Разблокировать'
                        : 'Unlock'
                      : isRu
                        ? 'Заблокировать'
                        : 'Lock'
                  }
                  onClick={() => handleToggleLock(draft)}
                  className="w-9 h-9"
                >
                  {draft.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </IconTooltipButton>
              )}

              {!isCreating && (
                <IconTooltipButton
                  tone={isDraftPublished ? 'success' : 'warning-outline'}
                  label={
                    isDraftPublished
                      ? isRu
                        ? 'Снять с публикации'
                        : 'Unpublish'
                      : isRu
                        ? 'Опубликовать'
                        : 'Publish'
                  }
                  disabled={saving || draft.locked}
                  onClick={() => handleTogglePublish(draft)}
                  className="w-9 h-9"
                >
                  {isDraftPublished ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </IconTooltipButton>
              )}

              <IconTooltipButton
                type="submit"
                tone="primary"
                label={
                  isCreating
                    ? isRu
                      ? 'Создать запись'
                      : 'Create record'
                    : isRu
                      ? 'Сохранить изменения'
                      : 'Save changes'
                }
                disabled={saving || draft.locked}
                className="w-9 h-9"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </IconTooltipButton>
            </div>
          </div>
        </form>
      </div>

      {/* Offcanvas Record Preview */}
      <ThemedOffcanvas
        open={Boolean(inspectItem)}
        onClose={() => setInspectItem(null)}
        title={inspectItem ? `${inspectItem.id} · ${inspectItem.title}` : ''}
        subtitle={inspectItem ? `${inspectItem.category} · ${inspectItem.owner}` : undefined}
        headerActions={<FormLanguageToggle compact />}
        footer={
          inspectItem && (
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <IconTooltipButton
                  tone="danger-outline"
                  label={isRu ? 'Удалить' : 'Delete'}
                  onClick={() => setDeleteTarget(inspectItem)}
                  className="w-9 h-9"
                >
                  <Trash2 className="w-4 h-4" />
                </IconTooltipButton>
                <IconTooltipButton
                  tone={inspectItem.locked ? 'danger' : 'neutral'}
                  label={
                    inspectItem.locked
                      ? isRu
                        ? 'Разблокировать'
                        : 'Unlock'
                      : isRu
                        ? 'Заблокировать'
                        : 'Lock'
                  }
                  onClick={() => handleToggleLock(inspectItem)}
                  className="w-9 h-9"
                >
                  {inspectItem.locked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </IconTooltipButton>
              </div>
              <div className="flex items-center gap-1.5">
                <IconTooltipButton
                  tone={inspectItem.status === 'Published' ? 'success' : 'warning-outline'}
                  label={
                    inspectItem.status === 'Published'
                      ? isRu
                        ? 'Снять с публикации'
                        : 'Unpublish'
                      : isRu
                        ? 'Опубликовать'
                        : 'Publish'
                  }
                  disabled={inspectItem.locked}
                  onClick={() => handleTogglePublish(inspectItem)}
                  className="w-9 h-9"
                >
                  {inspectItem.status === 'Published' ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </IconTooltipButton>
                <IconTooltipButton
                  tone="primary"
                  label={isRu ? 'Редактировать' : 'Edit record'}
                  onClick={() => {
                    selectForEdit(inspectItem);
                    setInspectItem(null);
                  }}
                  className="w-9 h-9"
                >
                  <Pencil className="w-4 h-4" />
                </IconTooltipButton>
              </div>
            </div>
          )
        }
      >
        {inspectItem && (
          <div className="space-y-4 text-xs">
            <div className="divide-y border-t border-b" style={{ borderColor: 'var(--d-border)' }}>
              {[
                { k: 'ID', v: inspectItem.id, mono: true },
                { k: isRu ? 'Статус' : 'Status', v: statusLabel(inspectItem.status) },
                {
                  k: isRu ? 'Блокировка' : 'Lock State',
                  v: inspectItem.locked
                    ? isRu
                      ? 'Заблокировано'
                      : 'Locked'
                    : isRu
                      ? 'Открыто'
                      : 'Unlocked',
                },
                { k: isRu ? 'Категория' : 'Category', v: inspectItem.category },
                { k: isRu ? 'Ответственный' : 'Owner', v: inspectItem.owner },
                {
                  k: isRu ? 'Бюджет' : 'Amount',
                  v: `$${inspectItem.amount.toLocaleString('en-US')}`,
                  mono: true,
                },
                { k: isRu ? 'Обновлён' : 'Updated', v: inspectItem.updatedAt, mono: true },
              ].map((row) => (
                <div key={row.k} className="py-2.5 flex items-center justify-between gap-3">
                  <span style={{ color: 'var(--d-muted)' }}>{row.k}</span>
                  <span className={`font-medium ${row.mono ? 'font-mono-num' : ''}`}>{row.v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="font-semibold">{isRu ? 'Примечание' : 'Notes'}</div>
              <p className="leading-relaxed" style={{ color: 'var(--d-muted)' }}>
                {inspectItem.notes || (isRu ? 'Нет описания' : 'No notes provided')}
              </p>
            </div>
          </div>
        )}
      </ThemedOffcanvas>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          onClick={() => setDeleteTarget(null)}
          role="alertdialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border shadow-2xl p-5 space-y-4"
            style={{
              backgroundColor: 'var(--d-surface)',
              borderColor: 'var(--d-border)',
              color: 'var(--d-text)',
              borderRadius: 'var(--d-radius)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--d-surface-muted)', color: 'var(--d-danger)' }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">
                    {isRu ? 'Подтверждение удаления' : 'Confirm Deletion'}
                  </h2>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--d-muted)' }}>
                    {isRu
                      ? `Удалить запись ${deleteTarget.id} («${deleteTarget.title}»)? После удаления её можно восстановить через кнопку «Отменить» в Toast.`
                      : `Delete record ${deleteTarget.id} ("${deleteTarget.title}")? You can undo via the Toast notification.`}
                  </p>
                </div>
              </div>
              <FormLanguageToggle compact />
            </div>

            <div
              className="pt-3 border-t flex items-center justify-end gap-2"
              style={{ borderColor: 'var(--d-border)' }}
            >
              <IconTooltipButton
                tone="neutral"
                label={isRu ? 'Отмена' : 'Cancel'}
                onClick={() => setDeleteTarget(null)}
                className="w-9 h-9"
              >
                <X className="w-4 h-4" />
              </IconTooltipButton>
              <IconTooltipButton
                tone="danger"
                label={isRu ? 'Подтвердить удаление' : 'Confirm delete'}
                onClick={executeConfirmedDelete}
                className="w-9 h-9"
              >
                <Trash2 className="w-4 h-4" />
              </IconTooltipButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
