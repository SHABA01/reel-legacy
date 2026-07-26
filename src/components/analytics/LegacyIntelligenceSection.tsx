/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Heart, Calendar, Award, Compass, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarChart } from './AnalyticsCharts';

export function LegacyIntelligenceSection() {
  const decadeCoverageData = [
    { label: '1940s', value: 65, subValue: '% Media' },
    { label: '1950s', value: 85, subValue: '% Media' },
    { label: '1960s', value: 92, subValue: '% Media' },
    { label: '1970s', value: 78, subValue: '% Media' },
    { label: '1980s', value: 88, subValue: '% Media' },
    { label: '1990s', value: 95, subValue: '% Media' },
    { label: '2000s', value: 70, subValue: '% Media' },
  ];

  return (
    <div id="legacy-intelligence-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> Legacy Intelligence & Heritage Coverage
          </h2>
          <p className="text-xs text-muted-foreground">
            Biographical completeness, family tree relationship density, emotional narrative depth, and decade coverage.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" /> Emotional Journey Score: 94 / 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Biography Completeness
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-display font-extrabold text-foreground">88%</strong>
            <span className="text-xs font-mono text-emerald-500 font-bold">+12% this month</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[88%] rounded-full" />
          </div>
          <p className="text-[11px] text-muted-foreground">Master profiles contain birth, military, career & heritage logs.</p>
        </div>

        <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Relationship Tree Graph
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-display font-extrabold text-foreground">24 Nodes</strong>
            <span className="text-xs font-mono text-blue-400 font-bold">4 Kinships</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[76%] rounded-full" />
          </div>
          <p className="text-[11px] text-muted-foreground">High interconnection between family profiles & story events.</p>
        </div>

        <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Archive Gap Discovery
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-display font-extrabold text-foreground">1 Decade Gap</strong>
            <span className="text-xs font-mono text-amber-500 font-bold">1940s Needs Photos</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[65%] rounded-full" />
          </div>
          <p className="text-[11px] text-muted-foreground">1940s decade currently has fewer than 10 tagged archival photos.</p>
        </div>
      </div>

      {/* Decade Coverage Chart */}
      <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-500" /> Chronological Decade Asset Density (1940s - 2000s)
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">% Historical Photo & Video Coverage</span>
        </div>
        <BarChart data={decadeCoverageData} height={170} barColor="#f59e0b" />
      </div>
    </div>
  );
}
