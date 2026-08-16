/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  CheckCircle2,
  HardDrive,
  Sparkles,
  RefreshCw,
  Server,
  Cloud,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface IntegrationHealthOverviewProps {
  connectedCount: number;
  availableCount: number;
  activeSyncsCount: number;
  failedSyncsCount: number;
  lastBackupTime: string;
  storageConnectedGb: number;
  aiProvidersCount: number;
}

export function IntegrationHealthOverview({
  connectedCount,
  availableCount,
  activeSyncsCount,
  failedSyncsCount,
  lastBackupTime,
  storageConnectedGb,
  aiProvidersCount,
}: IntegrationHealthOverviewProps) {
  return (
    <div id="integration-health-overview" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
              ECOSYSTEM TELEMETRY
            </span>
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Status
            </span>
          </div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mt-1">
            <Activity className="w-5 h-5 text-cinema-amber-500" /> Integration Health & Connectivity Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time status of external cloud repositories, AI voice synthesis engines, genealogy search pipelines, and automated backup syncs.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> All Connectors Operational
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Card 1: Connected Services */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <Cloud className="w-3 h-3 text-blue-400" /> Connected
          </span>
          <strong className="block font-display text-xl text-foreground font-extrabold">{connectedCount} Active</strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">Healthy OAuth</span>
        </div>

        {/* Card 2: Available Services */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <Server className="w-3 h-3 text-amber-500" /> Catalog
          </span>
          <strong className="block font-display text-xl text-foreground font-extrabold">{availableCount} Available</strong>
          <span className="text-[10px] text-muted-foreground font-mono">Ready to Connect</span>
        </div>

        {/* Card 3: Active Syncs */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-purple-400 animate-spin-slow" /> Active Syncs
          </span>
          <strong className="block font-display text-xl text-foreground font-extrabold">{activeSyncsCount} Pipelines</strong>
          <span className="text-[10px] text-purple-400 font-mono font-semibold">Background Sync</span>
        </div>

        {/* Card 4: Failed Syncs */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Sync Health
          </span>
          <strong className="block font-display text-xl text-foreground font-extrabold">
            {failedSyncsCount === 0 ? '0 Errors' : `${failedSyncsCount} Failed`}
          </strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">100% Pass Rate</span>
        </div>

        {/* Card 5: Last Backup */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Last Backup
          </span>
          <strong className="block font-display text-sm font-bold text-foreground truncate">{lastBackupTime}</strong>
          <span className="text-[10px] text-cyan-400 font-mono font-semibold">Google Drive Vault</span>
        </div>

        {/* Card 6: Connected Storage */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-sky-400" /> Cloud Storage
          </span>
          <strong className="block font-display text-xl text-foreground font-extrabold">{storageConnectedGb} GB</strong>
          <span className="text-[10px] text-sky-400 font-mono font-semibold">Synced Assets</span>
        </div>

        {/* Card 7: AI Providers */}
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cinema-amber-500" /> AI Providers
          </span>
          <strong className="block font-display text-xl text-foreground font-extrabold">{aiProvidersCount} Active</strong>
          <span className="text-[10px] text-cinema-amber-500 font-mono font-semibold">Gemini + ElevenLabs</span>
        </div>
      </div>
    </div>
  );
}
