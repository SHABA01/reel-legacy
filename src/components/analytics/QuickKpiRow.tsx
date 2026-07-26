/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Users,
  HardDrive,
  Cpu,
  Video,
  Sparkles,
  FileText,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Sparkline } from './AnalyticsCharts';

export interface QuickKpiData {
  storiesCount: number;
  profilesCount: number;
  assetsCount: number;
  storageUsedGb: number;
  storageLimitGb: number;
  activeRenders: number;
  aiCreditsPercent: number;
  generatedScriptsCount: number;
}

interface QuickKpiRowProps {
  data: QuickKpiData;
  onKpiClick?: (kpiKey: string) => void;
}

export function QuickKpiRow({ data, onKpiClick }: QuickKpiRowProps) {
  const kpis = [
    {
      key: 'stories',
      label: 'Active Stories',
      value: data.storiesCount,
      subtext: '+2 created this week',
      trend: '+15%',
      icon: BookOpen,
      iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      sparkline: [12, 14, 13, 15, 18, 17, data.storiesCount || 20],
      sparklineColor: '#f59e0b',
    },
    {
      key: 'profiles',
      label: 'Legacy Profiles',
      value: data.profilesCount,
      subtext: '4 family archives',
      trend: '+8%',
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      sparkline: [4, 5, 5, 6, 7, 8, data.profilesCount || 9],
      sparklineColor: '#3b82f6',
    },
    {
      key: 'assets',
      label: 'Archival Media',
      value: data.assetsCount,
      subtext: 'Photos & Audio',
      trend: '+24%',
      icon: HardDrive,
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      sparkline: [32, 45, 60, 75, 88, 110, data.assetsCount || 124],
      sparklineColor: '#06b6d4',
    },
    {
      key: 'storage',
      label: 'Storage Capacity',
      value: `${data.storageUsedGb.toFixed(1)} GB`,
      subtext: `of ${data.storageLimitGb} GB Vault`,
      trend: '8% Used',
      icon: Cpu,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      sparkline: [0.8, 0.9, 1.0, 1.1, 1.15, 1.2, data.storageUsedGb || 1.2],
      sparklineColor: '#10b981',
    },
    {
      key: 'renders',
      label: 'Render Queue',
      value: data.activeRenders > 0 ? `${data.activeRenders} Active` : 'Idle Ready',
      subtext: '4K GPU Pipeline',
      trend: '99.4% Pass',
      icon: Video,
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      sparkline: [2, 1, 3, 2, 0, 1, data.activeRenders],
      sparklineColor: '#f43f5e',
    },
    {
      key: 'ai-quota',
      label: 'AI Token Quota',
      value: `${data.aiCreditsPercent}%`,
      subtext: 'Gemini 2.5 Flash',
      trend: 'High Speed',
      icon: Sparkles,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      sparkline: [100, 98, 96, 95, 93, 92, data.aiCreditsPercent || 92],
      sparklineColor: '#a855f7',
    },
    {
      key: 'scripts',
      label: 'Generated Scripts',
      value: data.generatedScriptsCount,
      subtext: 'Doc Screenplays',
      trend: '+12%',
      icon: FileText,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      sparkline: [5, 8, 10, 12, 15, 18, data.generatedScriptsCount || 22],
      sparklineColor: '#6366f1',
    },
  ];

  return (
    <div id="quick-kpi-row" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.key}
            id={`kpi-card-${kpi.key}`}
            onClick={() => onKpiClick && onKpiClick(kpi.key)}
            className="p-3.5 bg-card/90 hover:bg-card border border-border/80 hover:border-cinema-amber-500/50 rounded-xl shadow-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className={`p-1.5 rounded-lg border ${kpi.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {kpi.trend}
              </span>
            </div>

            <div className="space-y-0.5 mb-2">
              <span className="text-[11px] font-semibold text-muted-foreground block truncate">
                {kpi.label}
              </span>
              <strong className="font-display font-extrabold text-lg sm:text-xl text-foreground tracking-tight block">
                {kpi.value}
              </strong>
              <span className="text-[10px] text-muted-foreground/80 block font-mono truncate">
                {kpi.subtext}
              </span>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <Sparkline data={kpi.sparkline} color={kpi.sparklineColor} height={20} width={70} />
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cinema-amber-500 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
