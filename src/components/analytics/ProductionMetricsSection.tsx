/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Film, TrendingUp, BarChart2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AreaChart, BarChart } from './AnalyticsCharts';

export function ProductionMetricsSection() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const velocityData = [
    { label: 'Jan', value: 4, secondaryValue: 2 },
    { label: 'Feb', value: 7, secondaryValue: 5 },
    { label: 'Mar', value: 11, secondaryValue: 8 },
    { label: 'Apr', value: 15, secondaryValue: 12 },
    { label: 'May', value: 18, secondaryValue: 14 },
    { label: 'Jun', value: 22, secondaryValue: 19 },
    { label: 'Jul', value: 28, secondaryValue: 24 },
  ];

  const chapterBarData = [
    { label: 'Ch. 1', value: 14, subValue: 'Scenes' },
    { label: 'Ch. 2', value: 18, subValue: 'Scenes' },
    { label: 'Ch. 3', value: 24, subValue: 'Scenes' },
    { label: 'Ch. 4', value: 12, subValue: 'Scenes' },
    { label: 'Ch. 5', value: 20, subValue: 'Scenes' },
    { label: 'Ch. 6', value: 16, subValue: 'Scenes' },
  ];

  return (
    <div id="production-metrics-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-500" /> Production Metrics & Volume
          </h2>
          <p className="text-xs text-muted-foreground">
            Analysis of documentary creation velocity, scene composition, narration audio volume, and export rates.
          </p>
        </div>

        {/* Timeframe Toggle Buttons */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border shrink-0 self-start sm:self-auto">
          {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Stories Completed</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">12 Stories</strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">+25% vs last period</span>
        </div>
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Avg Production Time</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">3.4 Days</strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">-18% faster workflow</span>
        </div>
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Scenes Created</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">104 Scenes</strong>
          <span className="text-[10px] text-amber-500 font-mono font-semibold">8.6 avg / story</span>
        </div>
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Render Exports</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">28 Files</strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">0 Render Failures</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Story Production Velocity Area Chart */}
        <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-500" /> Production Velocity Trend
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Stories Started vs Completed</span>
          </div>
          <AreaChart
            data={velocityData}
            height={200}
            primaryColor="#f59e0b"
            secondaryColor="#3b82f6"
            primaryLabel="Stories Started"
            secondaryLabel="Final Renders"
          />
        </div>

        {/* Chart 2: Scenes Volume per Chapter Bar Chart */}
        <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-400" /> Scenes & Narration per Chapter
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Chapter Structure Breakdown</span>
          </div>
          <BarChart data={chapterBarData} height={180} barColor="#3b82f6" />
        </div>
      </div>
    </div>
  );
}
