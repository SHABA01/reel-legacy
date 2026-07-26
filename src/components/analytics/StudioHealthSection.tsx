/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Mic,
  Video,
} from 'lucide-react';
import { DonutChart } from './AnalyticsCharts';

export interface StudioHealthProps {
  storiesCount: number;
  readyStoriesCount: number;
  narrationCoveragePercent: number;
  mediaAssetsPercent: number;
  renderSuccessRate: number;
}

export function StudioHealthSection({
  storiesCount = 12,
  readyStoriesCount = 9,
  narrationCoveragePercent = 84,
  mediaAssetsPercent = 91,
  renderSuccessRate = 98,
}: StudioHealthProps) {
  const readinessSegments = [
    { label: 'Production Ready', value: readyStoriesCount, color: '#10b981' },
    { label: 'In Progress', value: Math.max(0, storiesCount - readyStoriesCount - 1), color: '#f59e0b' },
    { label: 'Draft Stage', value: 1, color: '#6366f1' },
  ];

  return (
    <div id="studio-health-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-cinema-amber-500" /> Studio Health & Readiness Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time telemetry measuring story completion, audio coverage, asset restoration, and GPU export health.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Status: Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Donut Chart: Overall Production Readiness */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-4 flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
            Story Portfolio Readiness
          </span>
          <DonutChart
            segments={readinessSegments}
            size={170}
            centerText={`${Math.round((readyStoriesCount / Math.max(storiesCount, 1)) * 100)}%`}
            centerSubtext="Production Ready"
          />
        </div>

        {/* 4 Health Indicator Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Voice Narration Coverage */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice Narration
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">{narrationCoveragePercent}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${narrationCoveragePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
              <span>Oral History Synthesized</span>
              <span className="text-foreground font-semibold">48 / 56 Scenes</span>
            </div>
          </div>

          {/* Card 2: Archival Media Asset Coverage */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Archival Photos & Video
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{mediaAssetsPercent}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${mediaAssetsPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
              <span>Restored & Colorized</span>
              <span className="text-foreground font-semibold">112 / 124 Files</span>
            </div>
          </div>

          {/* Card 3: Render Queue Efficiency */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400" /> 4K Export Pipeline
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">{renderSuccessRate}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${renderSuccessRate}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
              <span>Pass Rate (0 Failures)</span>
              <span className="text-foreground font-semibold">28 Exports</span>
            </div>
          </div>

          {/* Card 4: Local Database Vault */}
          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> Vault Storage Health
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">100% Synced</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 w-full" />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
              <span>Offline IndexedDB Vault</span>
              <span className="text-foreground font-semibold">1.2 GB Indexed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
