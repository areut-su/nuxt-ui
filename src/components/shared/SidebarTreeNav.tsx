import { useState, type ComponentType } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  children?: {
    id: string;
    label: string;
    badge?: string | number;
  }[];
}

interface SidebarTreeNavProps {
  items: SidebarMenuItem[];
  activeId: string;
  collapsed?: boolean;
  onSelect: (id: string) => void;
  defaultOpenGroups?: string[];
}

export function SidebarTreeNav({
  items,
  activeId,
  collapsed = false,
  onSelect,
  defaultOpenGroups = ['dashboard', 'data-grid'],
}: SidebarTreeNavProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const g of defaultOpenGroups) map[g] = true;
    return map;
  });

  const toggleGroup = (item: SidebarMenuItem) => {
    if (collapsed) {
      if (item.children && item.children.length > 0) {
        onSelect(item.children[0].id);
      } else {
        onSelect(item.id);
      }
      return;
    }

    if (!item.children || item.children.length === 0) {
      onSelect(item.id);
      return;
    }

    setOpenGroups((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
  };

  return (
    <nav className="space-y-1 w-full">
      {items.map((item) => {
        const Icon = item.icon;
        const hasChildren = Boolean(item.children && item.children.length > 0);
        const isGroupOpen = Boolean(openGroups[item.id]);
        const isDirectActive = activeId === item.id;
        const isChildActive = Boolean(
          item.children?.some((child) => child.id === activeId)
        );

        return (
          <div key={item.id} className="space-y-0.5">
            <button
              onClick={() => toggleGroup(item)}
              title={item.label}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                collapsed ? 'justify-center' : ''
              }`}
              style={{
                backgroundColor:
                  isDirectActive || (collapsed && isChildActive)
                    ? 'var(--d-sidebar-active-bg)'
                    : 'transparent',
                color:
                  isDirectActive || isChildActive
                    ? 'var(--d-sidebar-active-text)'
                    : 'var(--d-sidebar-text)',
              }}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </span>

              {!collapsed && hasChildren && (
                <span className="opacity-70 shrink-0">
                  {isGroupOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </span>
              )}
            </button>

            {!collapsed && hasChildren && isGroupOpen && (
              <div
                className="ml-4 pl-2.5 border-l space-y-0.5 py-0.5"
                style={{ borderColor: 'var(--d-sidebar-border)' }}
              >
                {item.children!.map((sub) => {
                  const subActive = activeId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelect(sub.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors text-left"
                      style={{
                        backgroundColor: subActive ? 'var(--d-sidebar-active-bg)' : 'transparent',
                        color: subActive
                          ? 'var(--d-sidebar-active-text)'
                          : 'var(--d-sidebar-muted)',
                        fontWeight: subActive ? 600 : 400,
                      }}
                    >
                      <span className="truncate">{sub.label}</span>
                      {sub.badge !== undefined && (
                        <span
                          className="ml-2 px-1.5 py-0.5 text-[10px] font-mono-num font-semibold rounded"
                          style={{
                            backgroundColor: 'var(--d-primary)',
                            color: 'var(--d-primary-fg)',
                          }}
                        >
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
