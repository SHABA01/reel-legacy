/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

// --- SPARKLINE ---
export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({ data, color = '#f59e0b', height = 32, width = 120 }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={`sparkline-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sparkline-grad-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- AREA CHART ---
export interface AreaChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function AreaChart({
  data,
  height = 220,
  primaryColor = '#f59e0b',
  secondaryColor = '#3b82f6',
  primaryLabel = 'Primary Metric',
  secondaryLabel,
}: AreaChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = 600; // viewBox SVG scale
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.value, d.secondaryValue ?? 0]),
    10
  );

  const getX = (idx: number) => padding.left + (idx / Math.max(data.length - 1, 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxVal) * innerHeight;

  const primaryPoints = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const primaryPath = `M ${primaryPoints.join(' L ')}`;
  const primaryArea = `M ${getX(0)},${padding.top + innerHeight} L ${primaryPoints.join(
    ' L '
  )} L ${getX(data.length - 1)},${padding.top + innerHeight} Z`;

  let secondaryPath = '';
  let secondaryArea = '';
  if (secondaryLabel) {
    const secPoints = data.map((d, i) => `${getX(i)},${getY(d.secondaryValue || 0)}`);
    secondaryPath = `M ${secPoints.join(' L ')}`;
    secondaryArea = `M ${getX(0)},${padding.top + innerHeight} L ${secPoints.join(
      ' L '
    )} L ${getX(data.length - 1)},${padding.top + innerHeight} Z`;
  }

  // Y-axis grid ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => Math.round(maxVal * ratio));

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-end gap-4 mb-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span className="text-foreground font-medium">{primaryLabel}</span>
        </div>
        {secondaryLabel && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
            <span className="text-foreground font-medium">{secondaryLabel}</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="area-grad-primary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.02" />
          </linearGradient>
          {secondaryLabel && (
            <linearGradient id="area-grad-sec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.0" />
            </linearGradient>
          )}
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((val, idx) => {
          const y = getY(val);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Secondary Fill & Path */}
        {secondaryLabel && (
          <>
            <path d={secondaryArea} fill="url(#area-grad-sec)" />
            <path
              d={secondaryPath}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </>
        )}

        {/* Primary Fill & Path */}
        <path d={primaryArea} fill="url(#area-grad-primary)" />
        <path
          d={primaryPath}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis Labels & Hover Interaction */}
        {data.map((d, idx) => {
          const x = getX(idx);
          const y1 = getY(d.value);
          const isHovered = hoverIdx === idx;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              {/* Invisible touch/hover target column */}
              <rect
                x={x - innerWidth / (data.length * 2)}
                y={padding.top}
                width={innerWidth / data.length}
                height={innerHeight}
                fill="transparent"
              />

              {/* Hover vertical guide line */}
              {isHovered && (
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + innerHeight}
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* Data Point Dot */}
              <circle
                cx={x}
                cy={y1}
                r={isHovered ? 5.5 : 3.5}
                fill={primaryColor}
                stroke="var(--color-card, #0f172a)"
                strokeWidth="2"
                className="transition-all duration-150"
              />

              {/* X Label */}
              <text
                x={x}
                y={chartHeight - 8}
                textAnchor="middle"
                className={`text-[10px] font-mono transition-colors ${
                  isHovered ? 'fill-foreground font-bold' : 'fill-muted-foreground'
                }`}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoverIdx !== null && data[hoverIdx] && (
        <div
          className="absolute z-20 bg-popover/95 backdrop-blur border border-border text-popover-foreground px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
          style={{
            left: `${((padding.left + (hoverIdx / Math.max(data.length - 1, 1)) * (600 - padding.left - padding.right)) / 600) * 100}%`,
            top: `${(getY(data[hoverIdx].value) / height) * 100}%`,
          }}
        >
          <div className="font-bold border-b border-border/50 pb-1 mb-1 text-foreground">
            {data[hoverIdx].label}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{primaryLabel}:</span>
            <span className="font-bold text-amber-500">{data[hoverIdx].value}</span>
          </div>
          {secondaryLabel && data[hoverIdx].secondaryValue !== undefined && (
            <div className="flex items-center justify-between gap-4 mt-0.5">
              <span className="text-muted-foreground">{secondaryLabel}:</span>
              <span className="font-bold text-blue-400">{data[hoverIdx].secondaryValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- BAR CHART ---
export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
  subValue?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  barColor?: string;
}

export function BarChart({ data, height = 200, barColor = '#f59e0b' }: BarChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex items-end justify-between gap-2 pt-6 pb-2" style={{ height: `${height}px` }}>
      {data.map((item, idx) => {
        const heightPercent = Math.max(Math.round((item.value / maxVal) * 100), 4);
        const isHovered = hoverIdx === idx;
        const color = item.color || barColor;

        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {/* Tooltip */}
            {isHovered && (
              <div className="absolute -top-10 z-20 bg-popover text-popover-foreground border border-border text-[11px] font-mono px-2 py-1 rounded shadow-md whitespace-nowrap animate-fade-in">
                <strong>{item.label}:</strong> {item.value} {item.subValue || ''}
              </div>
            )}

            {/* Bar Fill Container */}
            <div className="w-full bg-muted/40 rounded-t-lg overflow-hidden flex flex-col justify-end h-full max-w-[48px]">
              <div
                className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  opacity: isHovered ? 1 : 0.85,
                }}
              />
            </div>

            {/* X-axis Label */}
            <span
              className={`mt-2 text-[10px] font-mono transition-colors truncate max-w-full ${
                isHovered ? 'text-foreground font-bold' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- DONUT / PROGRESS RING CHART ---
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  centerText?: string;
  centerSubtext?: string;
}

export function DonutChart({
  segments,
  size = 180,
  centerText = '100%',
  centerSubtext = 'Total Coverage',
}: DonutChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* SVG Ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
          {/* Track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted/40"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {segments.map((seg, idx) => {
            const percent = seg.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = hoverIdx === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
          <span className="font-display font-extrabold text-xl sm:text-2xl text-foreground tracking-tight">
            {hoverIdx !== null ? `${Math.round((segments[hoverIdx].value / total) * 100)}%` : centerText}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold line-clamp-1">
            {hoverIdx !== null ? segments[hoverIdx].label : centerSubtext}
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className="flex flex-col gap-2 w-full max-w-xs text-xs font-mono">
        {segments.map((seg, idx) => {
          const percent = Math.round((seg.value / total) * 100);
          const isHovered = hoverIdx === idx;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-muted border-border font-bold scale-[1.02]'
                  : 'bg-muted/30 border-transparent hover:bg-muted/50'
              }`}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-foreground truncate">{seg.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-muted-foreground">{seg.value}</span>
                <span className="text-foreground font-bold">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
