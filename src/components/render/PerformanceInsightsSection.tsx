/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QueueSummaryStats } from '../../types/render';
import {
  Zap,
  Clock,
  Cpu,
  HardDrive,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';

interface PerformanceInsightsSectionProps {
  stats: QueueSummaryStats;
}

export const PerformanceInsightsSection: React.FC<PerformanceInsightsSectionProps> = ({
  stats,
}) => {
  const stageDistribution = [
    { name: 'Video Encoding (H.264/ProRes)', percent: 42, color: 'bg-cinema-amber-500' },
    { name: 'Voice Synthesis & Alignment', percent: 24, color: 'bg-blue-400' },
    { name: 'Media Assembly & Ken Burns', percent: 18, color: 'bg-purple-400' },
    { name: 'Music Processing & Auto-Ducking', percent: 11, color: 'bg-emerald-400' },
    { name: 'Packaging & Metadata', percent: 5, color: 'bg-muted-foreground' },
  ];

  return (
    <div className="space-y-4" id="performance-insights-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Encoder & Pipeline Performance Insights
            </h3>
            <p className="text-xs text-muted-foreground">
              Hardware utilization, stage time distribution, and pipeline bottleneck analytics.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Render Speed */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-cinema-amber-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              Avg Render Velocity
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              1.8x Realtime
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-foreground">
            {Math.ceil(stats.averageRenderTimeSec / 60)} mins
          </p>
          <p className="text-[11px] text-muted-foreground">
            Average export speed for standard 20-minute documentary cuts.
          </p>
        </div>

        {/* GPU Efficiency */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              GPU Acceleration
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-bold">
              NVENC Active
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-foreground">
            88% Load
          </p>
          <p className="text-[11px] text-muted-foreground">
            {stats.activeWorkers} of {stats.maxParallelWorkers} worker threads encoding in parallel.
          </p>
        </div>

        {/* Storage Buffer */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4" />
              Export Buffer Buffer
            </span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-bold">
              100 GB Max
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-foreground">
            {stats.storageUsedGB} GB
          </p>
          <p className="text-[11px] text-muted-foreground">
            {100 - stats.storageUsedGB} GB remaining before automatic buffer cleanup.
          </p>
        </div>

        {/* Success Rate */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Pipeline Reliability
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              High
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-foreground">
            {stats.successRatePercent}%
          </p>
          <p className="text-[11px] text-muted-foreground">
            Pre-flight validation prevented 14 potential render failures this month.
          </p>
        </div>
      </div>

      {/* Stage Distribution Breakdown */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cinema-amber-500" />
          Pipeline Stage Execution Time Distribution
        </h4>

        <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
          {stageDistribution.map((item, idx) => (
            <div
              key={idx}
              className={`h-full ${item.color} transition-all`}
              style={{ width: `${item.percent}%` }}
              title={`${item.name}: ${item.percent}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {stageDistribution.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <div className="truncate">
                <span className="font-bold text-foreground">{item.percent}%</span>{' '}
                <span className="text-muted-foreground text-[11px] truncate">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
