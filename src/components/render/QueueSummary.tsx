/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QueueSummaryStats } from '../../types/render';
import {
  Layers,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Cpu,
  TrendingUp,
  Pause,
  Zap,
} from 'lucide-react';

interface QueueSummaryProps {
  stats: QueueSummaryStats;
}

export const QueueSummary: React.FC<QueueSummaryProps> = ({ stats }) => {
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m`;
    }
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div
      id="render-queue-summary-grid"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
    >
      {/* Running Jobs */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cinema-amber-500/10 to-amber-500/5 border border-cinema-amber-500/20 space-y-1">
        <div className="flex items-center justify-between text-xs text-cinema-amber-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            Active Rendering
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cinema-amber-500/20 font-bold">
            {stats.activeWorkers}/{stats.maxParallelWorkers} Workers
          </span>
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-2xl font-black tracking-tight text-foreground">
            {stats.runningJobs}
          </span>
          <span className="text-xs text-muted-foreground">
            in progress
          </span>
        </div>
      </div>

      {/* Queued Jobs */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            In Queue
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {stats.scheduledJobs} Scheduled
          </span>
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {stats.queuedJobs}
          </span>
          <span className="text-xs text-muted-foreground">jobs waiting</span>
        </div>
      </div>

      {/* Completed Jobs */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-emerald-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
            {stats.successRatePercent}% Rate
          </span>
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {stats.completedJobs}
          </span>
          <span className="text-xs text-muted-foreground">exports ready</span>
        </div>
      </div>

      {/* Failed / Preflight Alerts */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-rose-400 font-medium">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed / Alerts
          </span>
          {stats.failedJobs > 0 && (
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
              Action Req.
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {stats.failedJobs}
          </span>
          <span className="text-xs text-muted-foreground">failed renders</span>
        </div>
      </div>

      {/* Avg Render Time */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cinema-amber-500" />
            Avg Render Speed
          </span>
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {formatTime(stats.averageRenderTimeSec)}
          </span>
          <span className="text-xs text-muted-foreground">per story</span>
        </div>
      </div>

      {/* Storage Used */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            Storage Consumed
          </span>
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {stats.storageUsedGB} GB
          </span>
          <span className="text-xs text-muted-foreground">export buffer</span>
        </div>
      </div>
    </div>
  );
};
