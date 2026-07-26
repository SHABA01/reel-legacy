/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QueueSummaryStats } from '../../types/render';
import {
  List,
  Play,
  Layers,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  Archive,
  Download,
  Package,
  Sliders,
  Folder,
} from 'lucide-react';

interface RenderQueueSidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  stats: QueueSummaryStats;
  onOpenPresets: () => void;
}

export const RenderQueueSidebar: React.FC<RenderQueueSidebarProps> = ({
  activeCategory,
  onSelectCategory,
  stats,
  onOpenPresets,
}) => {
  const categories = [
    { id: 'all', label: 'All Renders', icon: List, count: stats.totalJobs },
    { id: 'running', label: 'Active Rendering', icon: Play, count: stats.runningJobs, highlight: true },
    { id: 'queued', label: 'In Queue', icon: Layers, count: stats.queuedJobs },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats.completedJobs },
    { id: 'failed', label: 'Failed / Preflight', icon: AlertCircle, count: stats.failedJobs, error: stats.failedJobs > 0 },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, count: stats.cancelledJobs },
    { id: 'scheduled', label: 'Scheduled', icon: Calendar, count: stats.scheduledJobs },
    { id: 'exports', label: 'Exported Files', icon: Download, count: stats.completedJobs },
    { id: 'packages', label: 'Full Packages', icon: Package, count: 2 },
  ];

  return (
    <aside
      id="render-queue-sidebar"
      className="w-full lg:w-64 flex-shrink-0 bg-card/60 border border-border/80 rounded-2xl p-3.5 space-y-4"
    >
      <div className="flex items-center justify-between px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <span>Pipeline Queue Views</span>
      </div>

      <nav className="space-y-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-cinema-amber-500 text-black font-bold shadow-sm'
                  : 'hover:bg-muted/60 text-foreground/80 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-black'
                      : cat.error
                      ? 'text-rose-400'
                      : cat.highlight
                      ? 'text-cinema-amber-500'
                      : 'text-muted-foreground'
                  }`}
                />
                <span>{cat.label}</span>
              </div>

              {typeof cat.count === 'number' && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : cat.error
                      ? 'bg-rose-500/15 text-rose-400'
                      : 'bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-3 border-t border-border/80 space-y-2">
        <div className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Presets & Configuration
        </div>

        <button
          onClick={onOpenPresets}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-cinema-amber-500" />
            <span>Export Profiles</span>
          </div>
          <span className="text-[10px] bg-cinema-amber-500/10 text-cinema-amber-500 px-2 py-0.5 rounded-full font-bold">
            9 Presets
          </span>
        </button>
      </div>
    </aside>
  );
};
