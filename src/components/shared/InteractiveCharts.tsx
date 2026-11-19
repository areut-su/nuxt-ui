import { useId, useState } from 'react';
import type { ChartPoint } from '../../data/mockDashboardData';

interface ChartProps {
  data: ChartPoint[];
  height?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  showSecondary?: boolean;
  valuePrefix?: string;
}

export function InteractiveAreaChart({
  data,
  height = 240,
  primaryLabel = 'Revenue',
  secondaryLabel = 'Projected',
  showSecondary = true,
  valuePrefix = '$',
}: ChartProps) {
  const gradId = useId().replace(/:/g, '');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 680;
  const padLeft = 48;
  const padRight = 16;
  const padTop = 18;
  const padBottom = 30;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.primary, showSecondary ? d.secondary : 0)),
    1
  );
  const niceMax = Math.ceil(maxVal / 1000) * 1000;

  const getX = (i: number) =>
    data.length === 1 ? padLeft + chartW / 2 : padLeft + (i / (data.length - 1)) * chartW;
  const getY = (val: number) => padTop + chartH - (val / niceMax) * chartH;

  const buildSmoothPath = (vals: number[]) => {
    if (vals.length === 0) return '';
    const pts = vals.map((v, i) => ({ x: getX(i), y: getY(v) }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const primaryLine = buildSmoothPath(data.map((d) => d.primary));
  const secondaryLine = showSecondary ? buildSmoothPath(data.map((d) => d.secondary)) : '';

  const areaPath =
    primaryLine +
    ` L ${getX(data.length - 1)} ${padTop + chartH} L ${getX(0)} ${padTop + chartH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const activePoint = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={`grad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--d-chart-1)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--d-chart-1)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => {
          const val = Math.round(niceMax * t);
          const y = getY(val);
          return (
            <g key={t}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="var(--d-border)"
                strokeDasharray={t === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--d-muted)"
                className="text-[10px] font-mono-num"
              >
                {val >= 1000 ? `${valuePrefix}${Math.round(val / 1000)}k` : `${valuePrefix}${val}`}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={`url(#grad-${gradId})`} />

        {showSecondary && (
          <path
            d={secondaryLine}
            fill="none"
            stroke="var(--d-chart-2)"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        )}

        <path
          d={primaryLine}
          fill="none"
          stroke="var(--d-chart-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.primary);
          const isHovered = hoverIdx === i;
          return (
            <g key={d.label}>
              <text
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill="var(--d-muted)"
                className="text-[10px]"
              >
                {d.label}
              </text>

              {isHovered && (
                <line
                  x1={x}
                  x2={x}
                  y1={padTop}
                  y2={padTop + chartH}
                  stroke="var(--d-border)"
                  strokeWidth="1"
                />
              )}

              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3}
                fill="var(--d-surface)"
                stroke="var(--d-chart-1)"
                strokeWidth={isHovered ? 2.5 : 2}
              />

              <rect
                x={x - chartW / data.length / 2}
                y={padTop}
                width={chartW / data.length}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIdx(i)}
              />
            </g>
          );
        })}
      </svg>

      {activePoint && hoverIdx !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-md border px-3 py-2 text-xs shadow-sm"
          style={{
            left: `${Math.min(Math.max((hoverIdx / (data.length - 1)) * 75 + 10, 8), 72)}%`,
            backgroundColor: 'var(--d-surface)',
            borderColor: 'var(--d-border)',
            color: 'var(--d-text)',
          }}
        >
          <div className="font-semibold mb-1">{activePoint.label}</div>
          <div className="flex items-center justify-between gap-4 font-mono-num">
            <span style={{ color: 'var(--d-muted)' }}>{primaryLabel}:</span>
            <span className="font-semibold">
              {valuePrefix}
              {activePoint.primary.toLocaleString('en-US')}
            </span>
          </div>
          {showSecondary && (
            <div className="flex items-center justify-between gap-4 font-mono-num mt-0.5">
              <span style={{ color: 'var(--d-muted)' }}>{secondaryLabel}:</span>
              <span>
                {valuePrefix}
                {activePoint.secondary.toLocaleString('en-US')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InteractiveBarChart({
  data,
  height = 240,
  primaryLabel = 'Gross',
  secondaryLabel = 'Net',
  showSecondary = false,
  valuePrefix = '$',
}: ChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 620;
  const padLeft = 46;
  const padRight = 12;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = Math.max(...data.map((d) => Math.max(d.primary, d.secondary)), 1);
  const niceMax = Math.ceil(maxVal / 1000) * 1000;
  const groupW = chartW / data.length;
  const barW = showSecondary ? Math.min(18, groupW * 0.32) : Math.min(34, groupW * 0.54);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const val = Math.round(niceMax * t);
          const y = padTop + chartH - (val / niceMax) * chartH;
          return (
            <g key={t}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="var(--d-border)"
                strokeDasharray={t === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--d-muted)"
                className="text-[10px] font-mono-num"
              >
                {val >= 1000 ? `${valuePrefix}${Math.round(val / 1000)}k` : `${valuePrefix}${val}`}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const cx = padLeft + i * groupW + groupW / 2;
          const h1 = (d.primary / niceMax) * chartH;
          const h2 = (d.secondary / niceMax) * chartH;
          const isHovered = hoverIdx === i;

          return (
            <g
              key={d.label}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
            >
              {isHovered && (
                <rect
                  x={padLeft + i * groupW + 2}
                  y={padTop}
                  width={groupW - 4}
                  height={chartH}
                  rx="4"
                  fill="var(--d-surface-muted)"
                />
              )}

              <rect
                x={showSecondary ? cx - barW - 2 : cx - barW / 2}
                y={padTop + chartH - h1}
                width={barW}
                height={Math.max(h1, 2)}
                rx="4"
                fill="var(--d-chart-1)"
                opacity={hoverIdx === null || isHovered ? 1 : 0.65}
              />

              {showSecondary && (
                <rect
                  x={cx + 2}
                  y={padTop + chartH - h2}
                  width={barW}
                  height={Math.max(h2, 2)}
                  rx="4"
                  fill="var(--d-chart-2)"
                  opacity={hoverIdx === null || isHovered ? 0.85 : 0.5}
                />
              )}

              <text
                x={cx}
                y={height - 6}
                textAnchor="middle"
                fill="var(--d-muted)"
                className="text-[10px]"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hoverIdx !== null && (
        <div
          className="pointer-events-none absolute top-1 right-2 z-10 rounded-md border px-3 py-1.5 text-xs shadow-sm"
          style={{
            backgroundColor: 'var(--d-surface)',
            borderColor: 'var(--d-border)',
            color: 'var(--d-text)',
          }}
        >
          <span className="font-semibold mr-2">{data[hoverIdx].label}:</span>
          <span className="font-mono-num font-semibold">
            {valuePrefix}
            {data[hoverIdx].primary.toLocaleString('en-US')}
          </span>
          {showSecondary && (
            <span className="font-mono-num ml-2" style={{ color: 'var(--d-muted)' }}>
              ({secondaryLabel}: {valuePrefix}
              {data[hoverIdx].secondary.toLocaleString('en-US')})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function InteractiveDonutChart({ slices }: { slices: DonutSlice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-40 h-40 shrink-0">
        <svg viewBox="0 0 150 150" className="w-full h-full -rotate-90">
          {slices.map((slice, idx) => {
            const pct = slice.value / total;
            const dash = pct * circumference;
            const offset = -cumulative * circumference;
            cumulative += pct;
            const isHovered = active === idx;

            return (
              <circle
                key={slice.label}
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? 22 : 18}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-bold font-mono-num">
            {active !== null ? `${Math.round((slices[active].value / total) * 100)}%` : '100%'}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--d-muted)' }}>
            {active !== null ? slices[active].label : 'Total Share'}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {slices.map((slice, idx) => (
          <div
            key={slice.label}
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
            className="flex items-center justify-between text-xs py-1 px-2 rounded cursor-pointer transition-colors"
            style={{
              backgroundColor: active === idx ? 'var(--d-surface-muted)' : 'transparent',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span>{slice.label}</span>
            </div>
            <span className="font-mono-num font-medium">
              {slice.value.toLocaleString('en-US')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MiniSparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 72;
  const h = 22;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke="var(--d-chart-1)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
