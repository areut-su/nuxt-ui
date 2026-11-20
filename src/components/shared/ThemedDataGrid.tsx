import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  LayoutGrid,
  List,
  PanelRight,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { EXTENDED_GRID_RECORDS, type GridRecord } from '../../data/mockDashboardData';
import { useFormLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { AvatarWithFallback } from './AvatarWithFallback';
import { FormLanguageToggle } from './FormLanguageToggle';
import { ThemedOffcanvas } from './ThemedOffcanvas';

type SortField = 'id' | 'customer' | 'seats' | 'mrr' | 'updatedAt';

type DeleteTarget =
  | { type: 'single'; record: GridRecord }
  | { type: 'bulk'; count: number }
  | null;

interface ThemedDataGridProps {
  title: string;
  subtitle: string;
  defaultViewMode?: 'table' | 'cards';
  defaultStatusFilter?: 'All' | GridRecord['status'];
}

interface SearchableCheckboxSelectProps {
  label: string;
  allLabel: string;
  selectVisibleLabel: string;
  clearLabel: string;
  noOptionsLabel: string;
  options: { value: string; sub?: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  searchPlaceholder?: string;
}

function SearchableCheckboxSelect({
  label,
  allLabel,
  selectVisibleLabel,
  clearLabel,
  noOptionsLabel,
  options,
  selected,
  onChange,
  searchPlaceholder = 'Search...',
}: SearchableCheckboxSelectProps) {
  const [open, setOpen] = useState(false);
  const [innerQuery, setInnerQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setInnerQuery('');
      return;
    }
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const q = innerQuery.trim().toLowerCase();
  const visibleOptions = options.filter(
    (opt) =>
      opt.value.toLowerCase().includes(q) ||
      (opt.sub && opt.sub.toLowerCase().includes(q))
  );

  const toggleValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((x) => x !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap"
        style={{
          backgroundColor: selected.length > 0 ? 'var(--d-accent-soft)' : 'var(--d-surface)',
          borderColor: selected.length > 0 ? 'var(--d-primary)' : 'var(--d-border)',
          color: selected.length > 0 ? 'var(--d-primary)' : 'var(--d-text)',
          borderRadius: 'var(--d-radius)',
        }}
      >
        <span>
          {label}
          {selected.length > 0 ? ` (${selected.length})` : `: ${allLabel}`}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute left-0 mt-1.5 w-64 border shadow-xl z-40 overflow-hidden"
          style={{
            backgroundColor: 'var(--d-surface)',
            borderColor: 'var(--d-border)',
            color: 'var(--d-text)',
            borderRadius: 'var(--d-radius)',
          }}
        >
          {/* Search Input inside Select */}
          <div className="p-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--d-border)' }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--d-muted)' }} />
            <input
              autoFocus
              value={innerQuery}
              onChange={(e) => setInnerQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full text-xs bg-transparent outline-none"
            />
            {innerQuery && (
              <button
                type="button"
                onClick={() => setInnerQuery('')}
                className="p-0.5 hover:opacity-70"
                aria-label="Clear option search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Select All / Clear */}
          <div
            className="px-2.5 py-1.5 border-b flex items-center justify-between text-[11px]"
            style={{ borderColor: 'var(--d-border)', backgroundColor: 'var(--d-surface-muted)' }}
          >
            <button
              type="button"
              onClick={() => onChange(visibleOptions.map((o) => o.value))}
              className="font-medium hover:underline"
              style={{ color: 'var(--d-primary)' }}
            >
              {selectVisibleLabel} ({visibleOptions.length})
            </button>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="hover:underline"
                style={{ color: 'var(--d-muted)' }}
              >
                {clearLabel}
              </button>
            )}
          </div>

          {/* Checkbox Options List */}
          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5">
            {visibleOptions.length === 0 ? (
              <div className="py-4 text-center text-xs" style={{ color: 'var(--d-muted)' }}>
                {noOptionsLabel}
              </div>
            ) : (
              visibleOptions.map((opt) => {
                const checked = selected.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 text-xs rounded cursor-pointer transition-colors"
                    style={{
                      backgroundColor: checked ? 'var(--d-surface-muted)' : 'transparent',
                    }}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleValue(opt.value)}
                        className="w-3.5 h-3.5 accent-current shrink-0"
                      />
                      <span className="truncate font-medium">{opt.value}</span>
                    </span>
                    {opt.sub && (
                      <span className="text-[10px] shrink-0" style={{ color: 'var(--d-muted)' }}>
                        {opt.sub}
                      </span>
                    )}
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const STATUS_LABELS_RU: Record<GridRecord['status'], string> = {
  Active: 'Активен',
  Pending: 'Ожидает',
  'Past Due': 'Просрочен',
};

export function ThemedDataGrid({
  title,
  subtitle,
  defaultViewMode = 'table',
  defaultStatusFilter = 'All',
}: ThemedDataGridProps) {
  const { locale } = useFormLocale();
  const { toast } = useToast();
  const isRu = locale === 'ru';

  const t = useMemo(
    () => ({
      table: isRu ? 'Таблица' : 'Table',
      grid: isRu ? 'Карточки' : 'Grid',
      export: isRu ? 'Экспорт' : 'Export',
      newAccount: isRu ? 'Новый аккаунт' : 'New Account',
      searchPlaceholder: isRu
        ? 'Поиск по аккаунту, компании, стране или ID...'
        : 'Search account, company, country, or ID...',
      all: isRu ? 'Все' : 'All',
      selectVisible: isRu ? 'Выбрать видимые' : 'Select visible',
      clear: isRu ? 'Сбросить' : 'Clear',
      noOptions: isRu ? 'Ничего не найдено' : 'No matching options',
      plan: isRu ? 'Тариф' : 'Plan',
      searchPlans: isRu ? 'Поиск тарифа...' : 'Search plans...',
      region: isRu ? 'Регион' : 'Region',
      searchRegions: isRu ? 'Поиск региона...' : 'Search regions...',
      country: isRu ? 'Страна' : 'Country',
      searchCountry: isRu ? 'Поиск страны...' : 'Search country...',
      reset: isRu ? 'Сброс' : 'Reset',
      status: isRu ? 'Статус' : 'Status',
      selected: isRu ? 'выбрано' : 'selected',
      deleteSelected: isRu ? 'Удалить выбранные' : 'Delete selected',
      emptyTitle: isRu ? 'Нет аккаунтов по выбранным фильтрам' : 'No accounts match the selected filters',
      emptyDesc: isRu
        ? 'Измените поисковый запрос, чекбоксы статусов или фильтр по стране.'
        : 'Try adjusting your search query, plan checkboxes, or country filter.',
      resetAllFilters: isRu ? 'Сбросить все фильтры' : 'Reset All Filters',
      colAccount: isRu ? 'Аккаунт / Компания' : 'Account / Company',
      colSeats: isRu ? 'Места' : 'Seats',
      colUpdated: isRu ? 'Обновлён' : 'Updated',
      colActions: isRu ? 'Действия' : 'Actions',
      showing: isRu ? 'Показано' : 'Showing',
      of: isRu ? 'из' : 'of',
      rows: isRu ? 'Строк:' : 'Rows:',
      undo: isRu ? 'Отменить' : 'Undo',
      // Edit / Create Modal
      createTitle: isRu ? 'Новый аккаунт' : 'New Account',
      editTitle: isRu ? 'Редактирование' : 'Edit',
      modalDesc: isRu
        ? 'Измените тариф, статус, количество мест или ежемесячный MRR'
        : 'Update subscription tier, status, seats, or monthly billing',
      fieldCustomer: isRu ? 'Имя клиента' : 'Customer Name',
      fieldCompany: isRu ? 'Компания' : 'Company',
      fieldEmail: 'Email',
      fieldPlan: isRu ? 'Тариф' : 'Plan',
      fieldStatus: isRu ? 'Статус' : 'Status',
      fieldRegion: isRu ? 'Регион' : 'Region',
      fieldCountry: isRu ? 'Страна' : 'Country',
      fieldSeats: isRu ? 'Места (Seats)' : 'Seats',
      fieldMrr: isRu ? 'Ежемесячный MRR ($)' : 'Monthly MRR ($)',
      cancel: isRu ? 'Отмена' : 'Cancel',
      createBtn: isRu ? 'Создать аккаунт' : 'Create Account',
      saveBtn: isRu ? 'Сохранить' : 'Save Changes',
      // Delete Confirmation Modal
      deleteConfirmTitle: isRu ? 'Подтверждение удаления' : 'Confirm Deletion',
      deleteSingleDesc: (row: GridRecord) =>
        isRu
          ? `Вы действительно хотите удалить аккаунт ${row.id} (${row.customer} — ${row.company})? Запись будет убрана из таблицы.`
          : `Are you sure you want to delete account ${row.id} (${row.customer} — ${row.company})? This record will be removed from the grid.`,
      deleteBulkDesc: (count: number) =>
        isRu
          ? `Вы действительно хотите удалить выбранные аккаунты (${count} шт.)? Это действие удалит все отмеченные строки.`
          : `Are you sure you want to delete ${count} selected account(s)? All checked rows will be removed.`,
      deleteBtn: isRu ? 'Удалить' : 'Delete',
      deleteBulkBtn: (count: number) =>
        isRu ? `Удалить (${count})` : `Delete (${count})`,
      // Inspector Offcanvas
      inspectTitle: isRu ? 'Карточка аккаунта (Offcanvas)' : 'Account Details (Offcanvas)',
      editAction: isRu ? 'Редактировать' : 'Edit',
      deleteAction: isRu ? 'Удалить' : 'Delete',
      inspectAction: isRu ? 'Открыть в Offcanvas' : 'Inspect in Offcanvas',
      annualArr: isRu ? 'Годовой ARR' : 'Estimated ARR',
      billingCycle: isRu ? 'Расчётный цикл' : 'Billing Cycle',
      monthly: isRu ? 'Ежемесячно' : 'Monthly',
    }),
    [isRu]
  );

  const [records, setRecords] = useState<GridRecord[]>(EXTENDED_GRID_RECORDS);
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<GridRecord['status'][]>(
    defaultStatusFilter === 'All' ? [] : [defaultStatusFilter]
  );
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [highMrrOnly, setHighMrrOnly] = useState(false);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>(defaultViewMode);
  const [sortField, setSortField] = useState<SortField>('mrr');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Edit / Create Modal State
  const [editingRecord, setEditingRecord] = useState<GridRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  // Row Inspector Offcanvas State
  const [inspectRecord, setInspectRecord] = useState<GridRecord | null>(null);

  // Escape key closes modals
  useEffect(() => {
    if (!editingRecord && !deleteTarget) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteTarget) setDeleteTarget(null);
        else if (editingRecord) setEditingRecord(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editingRecord, deleteTarget]);

  const countryOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of records) {
      map.set(r.country, r.region);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([country, region]) => ({ value: country, sub: region }));
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((row) => {
        const hitSearch =
          !q ||
          row.id.toLowerCase().includes(q) ||
          row.customer.toLowerCase().includes(q) ||
          row.company.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.country.toLowerCase().includes(q);
        const hitStatus =
          selectedStatuses.length === 0 || selectedStatuses.includes(row.status);
        const hitPlan = selectedPlans.length === 0 || selectedPlans.includes(row.plan);
        const hitCountry =
          selectedCountries.length === 0 || selectedCountries.includes(row.country);
        const hitRegion =
          selectedRegions.length === 0 || selectedRegions.includes(row.region);
        const hitMrr = !highMrrOnly || row.mrr >= 1000;
        return hitSearch && hitStatus && hitPlan && hitCountry && hitRegion && hitMrr;
      })
      .sort((a, b) => {
        const dir = sortAsc ? 1 : -1;
        if (sortField === 'seats') return (a.seats - b.seats) * dir;
        if (sortField === 'mrr') return (a.mrr - b.mrr) * dir;
        if (sortField === 'customer') return a.customer.localeCompare(b.customer) * dir;
        if (sortField === 'updatedAt') return a.updatedAt.localeCompare(b.updatedAt) * dir;
        return a.id.localeCompare(b.id) * dir;
      });
  }, [
    records,
    search,
    selectedStatuses,
    selectedPlans,
    selectedCountries,
    selectedRegions,
    highMrrOnly,
    sortField,
    sortAsc,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedRows = filtered.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters =
    search !== '' ||
    selectedStatuses.length > 0 ||
    selectedPlans.length > 0 ||
    selectedCountries.length > 0 ||
    selectedRegions.length > 0 ||
    highMrrOnly;

  const resetFilters = () => {
    setSearch('');
    setSelectedStatuses([]);
    setSelectedPlans([]);
    setSelectedCountries([]);
    setSelectedRegions([]);
    setHighMrrOnly(false);
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((v) => !v);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const toggleSelectAllPage = () => {
    const pageIds = pagedRows.map((r) => r.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleStatusCheckbox = (st: GridRecord['status']) => {
    setSelectedStatuses((prev) =>
      prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
    );
    setPage(1);
  };

  const requestDeleteRow = (row: GridRecord) => {
    setDeleteTarget({ type: 'single', record: row });
  };

  const requestBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget({ type: 'bulk', count: selectedIds.length });
  };

  const executeConfirmedDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'single') {
      const removed = deleteTarget.record;
      setRecords((prev) => prev.filter((r) => r.id !== removed.id));
      setSelectedIds((prev) => prev.filter((id) => id !== removed.id));
      if (inspectRecord?.id === removed.id) {
        setInspectRecord(null);
      }
      setDeleteTarget(null);

      toast({
        variant: 'warning',
        title: isRu ? `Удалён ${removed.id}` : `Deleted ${removed.id}`,
        description: `${removed.customer} · ${removed.company}`,
        durationMs: 6000,
        action: {
          label: t.undo,
          onClick: () => {
            setRecords((prev) => [removed, ...prev]);
            toast({
              variant: 'success',
              title: isRu ? `Восстановлен ${removed.id}` : `Restored ${removed.id}`,
              description: removed.customer,
            });
          },
        },
      });
    } else {
      const count = selectedIds.length;
      const idsToDelete = new Set(selectedIds);
      const removedList = records.filter((r) => idsToDelete.has(r.id));
      setRecords((prev) => prev.filter((r) => !idsToDelete.has(r.id)));
      setSelectedIds([]);
      if (inspectRecord && idsToDelete.has(inspectRecord.id)) {
        setInspectRecord(null);
      }
      setDeleteTarget(null);

      toast({
        variant: 'warning',
        title: isRu ? `Удалено записей: ${count}` : `Deleted ${count} account(s)`,
        description: isRu
          ? 'Выбранные строки удалены из таблицы.'
          : 'Selected rows were removed from the grid.',
        durationMs: 6000,
        action: {
          label: t.undo,
          onClick: () => {
            setRecords((prev) => [...removedList, ...prev]);
            toast({
              variant: 'success',
              title: isRu ? `Восстановлено записей: ${count}` : `Restored ${count} account(s)`,
            });
          },
        },
      });
    }
  };

  const handleExportSelected = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filtered.length;
    toast({
      variant: 'success',
      title: isRu ? 'Экспорт CSV выполнен' : 'CSV Export Ready',
      description: isRu
        ? `Выгружено ${count} записей аккаунтов.`
        : `Exported ${count} grid records to CSV.`,
    });
  };

  const openCreateModal = () => {
    const nextNum = 1025 + records.length;
    setIsCreating(true);
    setEditingRecord({
      id: `ACC-${nextNum}`,
      customer: '',
      company: '',
      email: '',
      plan: 'Growth',
      status: 'Active',
      region: 'North America',
      country: 'United States',
      seats: 15,
      mrr: 490,
      updatedAt: '2026-05-30',
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    if (!editingRecord.customer.trim()) return;

    if (isCreating) {
      setRecords((prev) => [editingRecord, ...prev]);
      toast({
        variant: 'success',
        title: isRu ? `Создан ${editingRecord.id}` : `Created ${editingRecord.id}`,
        description: `${editingRecord.customer} · ${editingRecord.company}`,
      });
    } else {
      setRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? editingRecord : r))
      );
      if (inspectRecord?.id === editingRecord.id) {
        setInspectRecord(editingRecord);
      }
      toast({
        variant: 'success',
        title: isRu ? `Обновлён ${editingRecord.id}` : `Updated ${editingRecord.id}`,
        description: `${editingRecord.customer} · $${editingRecord.mrr.toLocaleString('en-US')}/mo`,
      });
    }
    setEditingRecord(null);
    setIsCreating(false);
  };

  const statusColor = (st: GridRecord['status']) => {
    if (st === 'Active') return 'var(--d-success)';
    if (st === 'Pending') return 'var(--d-warning)';
    return 'var(--d-danger)';
  };

  const formatStatus = (st: GridRecord['status']) => (isRu ? STATUS_LABELS_RU[st] : st);

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--d-muted)' }}>
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FormLanguageToggle />

          <div
            className="inline-flex p-1 border"
            style={{
              backgroundColor: 'var(--d-surface-muted)',
              borderColor: 'var(--d-border)',
              borderRadius: 'var(--d-radius)',
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors"
              style={{
                backgroundColor: viewMode === 'table' ? 'var(--d-surface)' : 'transparent',
                color: viewMode === 'table' ? 'var(--d-text)' : 'var(--d-muted)',
              }}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t.table}</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors"
              style={{
                backgroundColor: viewMode === 'cards' ? 'var(--d-surface)' : 'transparent',
                color: viewMode === 'cards' ? 'var(--d-text)' : 'var(--d-muted)',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.grid}</span>
            </button>
          </div>

          <button
            onClick={handleExportSelected}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{
              backgroundColor: 'var(--d-surface)',
              borderColor: 'var(--d-border)',
              color: 'var(--d-text)',
              borderRadius: 'var(--d-radius)',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {t.export} ({selectedIds.length > 0 ? selectedIds.length : filtered.length})
            </span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{
              backgroundColor: 'var(--d-primary)',
              color: 'var(--d-primary-fg)',
              borderRadius: 'var(--d-radius)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newAccount}</span>
          </button>
        </div>
      </div>

      {/* Multi-Filter Toolbar with Searchable Checkbox Selects + Inline Checkboxes */}
      <div
        className="p-3.5 border space-y-3"
        style={{
          backgroundColor: 'var(--d-surface)',
          borderColor: 'var(--d-border)',
          borderRadius: 'var(--d-radius)',
        }}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-52">
            <Search
              className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--d-muted)' }}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs border bg-transparent outline-none"
              style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            />
          </div>

          <SearchableCheckboxSelect
            label={t.plan}
            allLabel={t.all}
            selectVisibleLabel={t.selectVisible}
            clearLabel={t.clear}
            noOptionsLabel={t.noOptions}
            searchPlaceholder={t.searchPlans}
            options={[
              { value: 'Enterprise', sub: 'Custom SLA' },
              { value: 'Growth', sub: 'Team' },
              { value: 'Starter', sub: 'Self-serve' },
            ]}
            selected={selectedPlans}
            onChange={(next) => {
              setSelectedPlans(next);
              setPage(1);
            }}
          />

          <SearchableCheckboxSelect
            label={t.region}
            allLabel={t.all}
            selectVisibleLabel={t.selectVisible}
            clearLabel={t.clear}
            noOptionsLabel={t.noOptions}
            searchPlaceholder={t.searchRegions}
            options={[
              { value: 'North America', sub: 'US · CA' },
              { value: 'Europe', sub: 'EU · UK' },
              { value: 'APAC', sub: 'SG · JP · AU' },
            ]}
            selected={selectedRegions}
            onChange={(next) => {
              setSelectedRegions(next);
              setPage(1);
            }}
          />

          <SearchableCheckboxSelect
            label={t.country}
            allLabel={t.all}
            selectVisibleLabel={t.selectVisible}
            clearLabel={t.clear}
            noOptionsLabel={t.noOptions}
            searchPlaceholder={t.searchCountry}
            options={countryOptions}
            selected={selectedCountries}
            onChange={(next) => {
              setSelectedCountries(next);
              setPage(1);
            }}
          />

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border hover:opacity-80"
              style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.reset}</span>
            </button>
          )}
        </div>

        {/* Inline Checkbox Filters + Bulk Actions */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs"
          style={{ borderColor: 'var(--d-border)' }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium" style={{ color: 'var(--d-muted)' }}>
              {t.status}:
            </span>
            {(['Active', 'Pending', 'Past Due'] as const).map((st) => {
              const checked = selectedStatuses.includes(st);
              return (
                <label key={st} className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleStatusCheckbox(st)}
                    className="w-3.5 h-3.5 accent-current"
                  />
                  <span className="font-medium" style={{ color: checked ? statusColor(st) : 'var(--d-text)' }}>
                    {formatStatus(st)}
                  </span>
                </label>
              );
            })}

            <span className="h-3.5 w-px hidden sm:inline-block" style={{ backgroundColor: 'var(--d-border)' }} />

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highMrrOnly}
                onChange={(e) => {
                  setHighMrrOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-3.5 h-3.5 accent-current"
              />
              <span>MRR ≥ $1,000</span>
            </label>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-mono-num font-semibold">
                {selectedIds.length} {t.selected}
              </span>
              <button
                onClick={requestBulkDelete}
                className="inline-flex items-center gap-1 font-medium hover:underline"
                style={{ color: 'var(--d-danger)' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteSelected}</span>
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="underline hover:opacity-80"
                style={{ color: 'var(--d-muted)' }}
              >
                {t.clear}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {pagedRows.length === 0 ? (
        <div
          className="p-10 border text-center space-y-3"
          style={{
            backgroundColor: 'var(--d-surface)',
            borderColor: 'var(--d-border)',
            borderRadius: 'var(--d-radius)',
          }}
        >
          <p className="text-sm font-medium">{t.emptyTitle}</p>
          <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
            {t.emptyDesc}
          </p>
          <button
            onClick={resetFilters}
            className="px-3.5 py-1.5 text-xs font-medium border"
            style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
          >
            {t.resetAllFilters}
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Responsive Card Grid Mode with Offcanvas Inspect, Edit & Delete Confirmation */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pagedRows.map((row) => {
            const isSelected = selectedIds.includes(row.id);
            return (
              <div
                key={row.id}
                className="p-4 border flex flex-col justify-between gap-3 transition-colors"
                style={{
                  backgroundColor: 'var(--d-surface)',
                  borderColor: isSelected ? 'var(--d-primary)' : 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AvatarWithFallback src={row.avatar} name={row.customer} sizeClass="w-8 h-8" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{row.customer}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--d-muted)' }}>
                        {row.company}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRow(row.id)}
                    aria-label={`Select ${row.customer}`}
                  />
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t" style={{ borderColor: 'var(--d-border)' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--d-muted)' }}>
                      {t.plan} · {t.country}
                    </span>
                    <span className="font-medium">
                      {row.plan} · {row.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--d-muted)' }}>{t.colSeats}</span>
                    <span className="font-mono-num">{row.seats}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--d-muted)' }}>{t.status}</span>
                    <span className="font-semibold" style={{ color: statusColor(row.status) }}>
                      {formatStatus(row.status)}
                    </span>
                  </div>
                </div>

                <div
                  className="pt-2 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: 'var(--d-border)' }}
                >
                  <div>
                    <span className="font-mono-num font-bold text-sm">
                      ${row.mrr.toLocaleString('en-US')}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setInspectRecord(row)}
                      className="p-1.5 rounded border hover:opacity-80"
                      style={{ borderColor: 'var(--d-border)' }}
                      title={t.inspectAction}
                      aria-label={`Inspect ${row.customer}`}
                    >
                      <PanelRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setEditingRecord({ ...row });
                      }}
                      className="p-1.5 rounded border hover:opacity-80"
                      style={{ borderColor: 'var(--d-border)' }}
                      title={t.editAction}
                      aria-label={`Edit ${row.customer}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => requestDeleteRow(row)}
                      className="p-1.5 rounded border hover:opacity-80"
                      style={{ borderColor: 'var(--d-border)', color: 'var(--d-danger)' }}
                      title={t.deleteAction}
                      aria-label={`Delete ${row.customer}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Structured Data Table Grid Mode with Offcanvas Inspect, Edit & Delete Confirmation */
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
                  <th className="py-2.5 px-3 w-9">
                    <input
                      type="checkbox"
                      checked={
                        pagedRows.length > 0 &&
                        pagedRows.every((r) => selectedIds.includes(r.id))
                      }
                      onChange={toggleSelectAllPage}
                      aria-label="Select all rows on page"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <button onClick={() => handleSort('id')} className="inline-flex items-center gap-1">
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium">
                    <button
                      onClick={() => handleSort('customer')}
                      className="inline-flex items-center gap-1"
                    >
                      <span>{t.colAccount}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium">{t.plan}</th>
                  <th className="py-2.5 px-3 font-medium">{t.country}</th>
                  <th className="py-2.5 px-3 font-medium">{t.status}</th>
                  <th className="py-2.5 px-3 font-medium text-right">
                    <button onClick={() => handleSort('seats')} className="inline-flex items-center gap-1">
                      <span>{t.colSeats}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">
                    <button onClick={() => handleSort('mrr')} className="inline-flex items-center gap-1">
                      <span>MRR</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">
                    <button
                      onClick={() => handleSort('updatedAt')}
                      className="inline-flex items-center gap-1"
                    >
                      <span>{t.colUpdated}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--d-border)' }}>
                {pagedRows.map((row) => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: isSelected ? 'var(--d-surface-muted)' : 'transparent',
                      }}
                    >
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Select ${row.id}`}
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono-num font-medium">{row.id}</td>
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => setInspectRecord(row)}
                          className="flex items-center gap-2.5 text-left hover:opacity-80"
                        >
                          <AvatarWithFallback
                            src={row.avatar}
                            name={row.customer}
                            sizeClass="w-7 h-7"
                          />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{row.customer}</div>
                            <div className="text-[11px] truncate" style={{ color: 'var(--d-muted)' }}>
                              {row.company} · {row.email}
                            </div>
                          </div>
                        </button>
                      </td>
                      <td className="py-2.5 px-3">{row.plan}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--d-muted)' }}>
                        {row.country}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold" style={{ color: statusColor(row.status) }}>
                          {formatStatus(row.status)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-num">{row.seats}</td>
                      <td className="py-2.5 px-3 text-right font-mono-num font-semibold">
                        ${row.mrr.toLocaleString('en-US')}
                      </td>
                      <td
                        className="py-2.5 px-3 text-right font-mono-num"
                        style={{ color: 'var(--d-muted)' }}
                      >
                        {row.updatedAt}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setInspectRecord(row)}
                            className="p-1.5 rounded border hover:opacity-80"
                            style={{ borderColor: 'var(--d-border)' }}
                            title={t.inspectAction}
                            aria-label={`Inspect ${row.id}`}
                          >
                            <PanelRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsCreating(false);
                              setEditingRecord({ ...row });
                            }}
                            className="p-1.5 rounded border hover:opacity-80"
                            style={{ borderColor: 'var(--d-border)' }}
                            title={t.editAction}
                            aria-label={`Edit ${row.id}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => requestDeleteRow(row)}
                            className="p-1.5 rounded border hover:opacity-80"
                            style={{ borderColor: 'var(--d-border)', color: 'var(--d-danger)' }}
                            title={t.deleteAction}
                            aria-label={`Delete ${row.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Pagination Footer */}
      <div
        className="px-4 py-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--d-surface)',
          borderColor: 'var(--d-border)',
          borderRadius: 'var(--d-radius)',
        }}
      >
        <div className="flex items-center gap-3" style={{ color: 'var(--d-muted)' }}>
          <span className="font-mono-num">
            {t.showing} {filtered.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + pageSize, filtered.length)} {t.of} {filtered.length}
          </span>
          <span aria-hidden="true">·</span>
          <label className="inline-flex items-center gap-1.5">
            <span>{t.rows}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 border bg-transparent outline-none font-mono-num"
              style={{
                borderColor: 'var(--d-border)',
                color: 'var(--d-text)',
                borderRadius: 'var(--d-radius)',
              }}
            >
              <option value={5} className="text-slate-900">5</option>
              <option value={8} className="text-slate-900">8</option>
              <option value={12} className="text-slate-900">12</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={safePage <= 1}
            className="p-1.5 border disabled:opacity-40 hover:opacity-80"
            style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            aria-label="First page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="p-1.5 border disabled:opacity-40 hover:opacity-80"
            style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className="min-w-7 h-7 px-2 border font-mono-num font-medium transition-colors"
              style={{
                borderColor: num === safePage ? 'var(--d-primary)' : 'var(--d-border)',
                backgroundColor: num === safePage ? 'var(--d-primary)' : 'transparent',
                color: num === safePage ? 'var(--d-primary-fg)' : 'var(--d-text)',
                borderRadius: 'var(--d-radius)',
              }}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="p-1.5 border disabled:opacity-40 hover:opacity-80"
            style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={safePage >= totalPages}
            className="p-1.5 border disabled:opacity-40 hover:opacity-80"
            style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            aria-label="Last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Record Inspector Offcanvas Drawer */}
      <ThemedOffcanvas
        open={Boolean(inspectRecord)}
        onClose={() => setInspectRecord(null)}
        title={inspectRecord ? `${inspectRecord.id} · ${inspectRecord.customer}` : t.inspectTitle}
        subtitle={inspectRecord ? `${inspectRecord.company} · ${inspectRecord.email}` : undefined}
        headerActions={<FormLanguageToggle compact />}
        footer={
          inspectRecord && (
            <div className="flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => requestDeleteRow(inspectRecord)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-medium hover:opacity-80"
                style={{
                  borderColor: 'var(--d-danger)',
                  color: 'var(--d-danger)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.deleteAction}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingRecord({ ...inspectRecord });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-medium hover:opacity-90"
                style={{
                  backgroundColor: 'var(--d-primary)',
                  color: 'var(--d-primary-fg)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{t.editAction}</span>
              </button>
            </div>
          )
        }
      >
        {inspectRecord && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--d-border)' }}>
              <AvatarWithFallback
                src={inspectRecord.avatar}
                name={inspectRecord.customer}
                sizeClass="w-11 h-11"
              />
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{inspectRecord.customer}</div>
                <div className="truncate" style={{ color: 'var(--d-muted)' }}>
                  {inspectRecord.company} · {inspectRecord.email}
                </div>
                <div className="mt-1 font-semibold" style={{ color: statusColor(inspectRecord.status) }}>
                  {formatStatus(inspectRecord.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3 border"
                style={{
                  backgroundColor: 'var(--d-surface-muted)',
                  borderColor: 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div style={{ color: 'var(--d-muted)' }}>MRR</div>
                <div className="text-lg font-bold font-mono-num mt-1">
                  ${inspectRecord.mrr.toLocaleString('en-US')}
                </div>
              </div>
              <div
                className="p-3 border"
                style={{
                  backgroundColor: 'var(--d-surface-muted)',
                  borderColor: 'var(--d-border)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <div style={{ color: 'var(--d-muted)' }}>{t.annualArr}</div>
                <div className="text-lg font-bold font-mono-num mt-1">
                  ${(inspectRecord.mrr * 12).toLocaleString('en-US')}
                </div>
              </div>
            </div>

            <div className="divide-y border-t border-b" style={{ borderColor: 'var(--d-border)' }}>
              {[
                { k: 'ID', v: inspectRecord.id, mono: true },
                { k: t.plan, v: inspectRecord.plan },
                { k: t.region, v: inspectRecord.region },
                { k: t.country, v: inspectRecord.country },
                { k: t.colSeats, v: String(inspectRecord.seats), mono: true },
                { k: t.billingCycle, v: t.monthly },
                { k: t.colUpdated, v: inspectRecord.updatedAt, mono: true },
              ].map((item) => (
                <div key={item.k} className="py-2.5 flex items-center justify-between gap-3">
                  <span style={{ color: 'var(--d-muted)' }}>{item.k}</span>
                  <span className={`font-medium ${item.mono ? 'font-mono-num' : ''}`}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ThemedOffcanvas>

      {/* Edit / Create Account Modal with RU/EN Switcher */}
      {editingRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setEditingRecord(null)}
        >
          <form
            onSubmit={handleSaveModal}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg border shadow-2xl p-5 space-y-4"
            style={{
              backgroundColor: 'var(--d-surface)',
              borderColor: 'var(--d-border)',
              color: 'var(--d-text)',
              borderRadius: 'var(--d-radius)',
            }}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--d-border)' }}>
              <div>
                <h2 className="text-base font-bold">
                  {isCreating ? t.createTitle : `${t.editTitle} ${editingRecord.id}`}
                </h2>
                <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                  {t.modalDesc}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <FormLanguageToggle compact />
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="p-1 rounded hover:opacity-75"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-medium">{t.fieldCustomer}</span>
                <input
                  required
                  value={editingRecord.customer}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, customer: e.target.value })
                  }
                  placeholder="Jane Doe"
                  className="w-full px-3 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldCompany}</span>
                <input
                  required
                  value={editingRecord.company}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, company: e.target.value })
                  }
                  placeholder="Acme Inc."
                  className="w-full px-3 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="font-medium">{t.fieldEmail}</span>
                <input
                  type="email"
                  required
                  value={editingRecord.email}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, email: e.target.value })
                  }
                  placeholder="jane@acme.io"
                  className="w-full px-3 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldPlan}</span>
                <select
                  value={editingRecord.plan}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      plan: e.target.value as GridRecord['plan'],
                    })
                  }
                  className="w-full px-2.5 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="Enterprise" className="text-slate-900">Enterprise</option>
                  <option value="Growth" className="text-slate-900">Growth</option>
                  <option value="Starter" className="text-slate-900">Starter</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldStatus}</span>
                <select
                  value={editingRecord.status}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      status: e.target.value as GridRecord['status'],
                    })
                  }
                  className="w-full px-2.5 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="Active" className="text-slate-900">{formatStatus('Active')}</option>
                  <option value="Pending" className="text-slate-900">{formatStatus('Pending')}</option>
                  <option value="Past Due" className="text-slate-900">{formatStatus('Past Due')}</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldRegion}</span>
                <select
                  value={editingRecord.region}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      region: e.target.value as GridRecord['region'],
                    })
                  }
                  className="w-full px-2.5 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                >
                  <option value="North America" className="text-slate-900">North America</option>
                  <option value="Europe" className="text-slate-900">Europe</option>
                  <option value="APAC" className="text-slate-900">APAC</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldCountry}</span>
                <input
                  value={editingRecord.country}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, country: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border bg-transparent outline-none"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldSeats}</span>
                <input
                  type="number"
                  min={1}
                  value={editingRecord.seats}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, seats: Number(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-1.5 border bg-transparent outline-none font-mono-num"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>

              <label className="space-y-1">
                <span className="font-medium">{t.fieldMrr}</span>
                <input
                  type="number"
                  min={0}
                  value={editingRecord.mrr}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, mrr: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 border bg-transparent outline-none font-mono-num"
                  style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
                />
              </label>
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--d-border)' }}>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-3.5 py-1.5 text-xs font-medium border"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: 'var(--d-primary)',
                  color: 'var(--d-primary-fg)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isCreating ? t.createBtn : t.saveBtn}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal (Single & Bulk) with RU/EN Switcher */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          onClick={() => setDeleteTarget(null)}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-heading"
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
                  style={{
                    backgroundColor: 'var(--d-surface-muted)',
                    color: 'var(--d-danger)',
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="delete-confirm-heading" className="text-sm font-bold">
                    {t.deleteConfirmTitle}
                  </h2>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--d-muted)' }}>
                    {deleteTarget.type === 'single'
                      ? t.deleteSingleDesc(deleteTarget.record)
                      : t.deleteBulkDesc(deleteTarget.count)}
                  </p>
                </div>
              </div>
              <FormLanguageToggle compact />
            </div>

            <div
              className="pt-3 border-t flex items-center justify-end gap-2"
              style={{ borderColor: 'var(--d-border)' }}
            >
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 text-xs font-medium border hover:opacity-80"
                style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={executeConfirmedDelete}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                style={{
                  backgroundColor: 'var(--d-danger)',
                  borderRadius: 'var(--d-radius)',
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {deleteTarget.type === 'single'
                    ? t.deleteBtn
                    : t.deleteBulkBtn(deleteTarget.count)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
