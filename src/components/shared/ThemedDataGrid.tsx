import { useEffect, useMemo, useRef, useState } from 'react';
import {
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
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { EXTENDED_GRID_RECORDS, type GridRecord } from '../../data/mockDashboardData';
import { AvatarWithFallback } from './AvatarWithFallback';

type SortField = 'id' | 'customer' | 'seats' | 'mrr' | 'updatedAt';

interface ThemedDataGridProps {
  title: string;
  subtitle: string;
  defaultViewMode?: 'table' | 'cards';
  defaultStatusFilter?: 'All' | GridRecord['status'];
}

interface SearchableCheckboxSelectProps {
  label: string;
  options: { value: string; sub?: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  searchPlaceholder?: string;
}

function SearchableCheckboxSelect({
  label,
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
          {selected.length > 0 ? ` (${selected.length})` : ': All'}
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
              Select visible ({visibleOptions.length})
            </button>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="hover:underline"
                style={{ color: 'var(--d-muted)' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Checkbox Options List */}
          <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5">
            {visibleOptions.length === 0 ? (
              <div className="py-4 text-center text-xs" style={{ color: 'var(--d-muted)' }}>
                No matching options
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

export function ThemedDataGrid({
  title,
  subtitle,
  defaultViewMode = 'table',
  defaultStatusFilter = 'All',
}: ThemedDataGridProps) {
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
  const [notice, setNotice] = useState<{ text: string; undoRecord?: GridRecord } | null>(null);

  // Edit / Create Modal State
  const [editingRecord, setEditingRecord] = useState<GridRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleDeleteRow = (row: GridRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== row.id));
    setSelectedIds((prev) => prev.filter((id) => id !== row.id));
    setNotice({ text: `Deleted ${row.id} (${row.customer})`, undoRecord: row });
  };

  const handleUndoDelete = () => {
    if (!notice?.undoRecord) return;
    const restored = notice.undoRecord;
    setRecords((prev) => [restored, ...prev]);
    setNotice(null);
  };

  const handleBulkDelete = () => {
    const count = selectedIds.length;
    setRecords((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    setNotice({ text: `Deleted ${count} selected account(s).` });
    setTimeout(() => setNotice(null), 2600);
  };

  const handleExportSelected = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filtered.length;
    setNotice({ text: `Exported ${count} grid records to CSV.` });
    setTimeout(() => setNotice(null), 2400);
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
      setNotice({ text: `Created ${editingRecord.id} (${editingRecord.customer})` });
    } else {
      setRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? editingRecord : r))
      );
      setNotice({ text: `Updated ${editingRecord.id} (${editingRecord.customer})` });
    }
    setEditingRecord(null);
    setIsCreating(false);
    setTimeout(() => setNotice(null), 2500);
  };

  const statusColor = (st: GridRecord['status']) => {
    if (st === 'Active') return 'var(--d-success)';
    if (st === 'Pending') return 'var(--d-warning)';
    return 'var(--d-danger)';
  };

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
              <span>Table</span>
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
              <span>Grid</span>
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
            <span>Export ({selectedIds.length > 0 ? selectedIds.length : filtered.length})</span>
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
            <span>New Account</span>
          </button>
        </div>
      </div>

      {notice && (
        <div
          className="px-4 py-2 text-xs font-medium border flex items-center justify-between gap-3"
          style={{
            backgroundColor: 'var(--d-accent-soft)',
            borderColor: 'var(--d-border)',
            color: 'var(--d-primary)',
            borderRadius: 'var(--d-radius)',
          }}
        >
          <span>{notice.text}</span>
          <div className="flex items-center gap-3">
            {notice.undoRecord && (
              <button
                onClick={handleUndoDelete}
                className="underline font-semibold hover:opacity-80"
              >
                Undo
              </button>
            )}
            <button onClick={() => setNotice(null)} aria-label="Dismiss notice">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

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
              placeholder="Search account, company, country, or ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border bg-transparent outline-none"
              style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
            />
          </div>

          <SearchableCheckboxSelect
            label="Plan"
            searchPlaceholder="Search plans..."
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
            label="Region"
            searchPlaceholder="Search regions..."
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
            label="Country"
            searchPlaceholder="Search country..."
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
              <span>Reset</span>
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
              Status:
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
                    {st}
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
              <span className="font-mono-num font-semibold">{selectedIds.length} selected</span>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1 font-medium hover:underline"
                style={{ color: 'var(--d-danger)' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete selected</span>
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="underline hover:opacity-80"
                style={{ color: 'var(--d-muted)' }}
              >
                Clear
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
          <p className="text-sm font-medium">No accounts match the selected filters</p>
          <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
            Try adjusting your search query, plan checkboxes, or country filter.
          </p>
          <button
            onClick={resetFilters}
            className="px-3.5 py-1.5 text-xs font-medium border"
            style={{ borderColor: 'var(--d-border)', borderRadius: 'var(--d-radius)' }}
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Responsive Card Grid Mode with Edit & Delete */
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
                    <span style={{ color: 'var(--d-muted)' }}>Plan · Country</span>
                    <span className="font-medium">
                      {row.plan} · {row.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--d-muted)' }}>Seats</span>
                    <span className="font-mono-num">{row.seats}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--d-muted)' }}>Status</span>
                    <span className="font-semibold" style={{ color: statusColor(row.status) }}>
                      {row.status}
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
                      onClick={() => {
                        setIsCreating(false);
                        setEditingRecord({ ...row });
                      }}
                      className="p-1.5 rounded border hover:opacity-80"
                      style={{ borderColor: 'var(--d-border)' }}
                      title="Edit account"
                      aria-label={`Edit ${row.customer}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRow(row)}
                      className="p-1.5 rounded border hover:opacity-80"
                      style={{ borderColor: 'var(--d-border)', color: 'var(--d-danger)' }}
                      title="Delete account"
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
        /* Structured Data Table Grid Mode with Edit & Delete */
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
                      <span>Account / Company</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium">Plan</th>
                  <th className="py-2.5 px-3 font-medium">Country</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">
                    <button onClick={() => handleSort('seats')} className="inline-flex items-center gap-1">
                      <span>Seats</span>
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
                      <span>Updated</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">Actions</th>
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
                        <div className="flex items-center gap-2.5">
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
                        </div>
                      </td>
                      <td className="py-2.5 px-3">{row.plan}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--d-muted)' }}>
                        {row.country}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold" style={{ color: statusColor(row.status) }}>
                          {row.status}
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
                            onClick={() => {
                              setIsCreating(false);
                              setEditingRecord({ ...row });
                            }}
                            className="p-1.5 rounded border hover:opacity-80"
                            style={{ borderColor: 'var(--d-border)' }}
                            title="Edit row"
                            aria-label={`Edit ${row.id}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row)}
                            className="p-1.5 rounded border hover:opacity-80"
                            style={{ borderColor: 'var(--d-border)', color: 'var(--d-danger)' }}
                            title="Delete row"
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
            Showing {filtered.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </span>
          <span aria-hidden="true">·</span>
          <label className="inline-flex items-center gap-1.5">
            <span>Rows:</span>
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

      {/* Edit / Create Account Modal */}
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
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--d-border)' }}>
              <div>
                <h2 className="text-base font-bold">
                  {isCreating ? 'New Account' : `Edit ${editingRecord.id}`}
                </h2>
                <p className="text-xs" style={{ color: 'var(--d-muted)' }}>
                  Update subscription tier, status, seats, or monthly billing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="p-1 rounded hover:opacity-75"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-medium">Customer Name</span>
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
                <span className="font-medium">Company</span>
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
                <span className="font-medium">Email</span>
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
                <span className="font-medium">Plan</span>
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
                <span className="font-medium">Status</span>
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
                  <option value="Active" className="text-slate-900">Active</option>
                  <option value="Pending" className="text-slate-900">Pending</option>
                  <option value="Past Due" className="text-slate-900">Past Due</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-medium">Region</span>
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
                <span className="font-medium">Country</span>
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
                <span className="font-medium">Seats</span>
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
                <span className="font-medium">Monthly MRR ($)</span>
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
                Cancel
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
                <span>{isCreating ? 'Create Account' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
