/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Mic,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Activity,
  Award,
  Zap,
  Volume2
} from 'lucide-react';
import { NarrationProjectStats } from '../../types/narration';

interface NarrationDashboardProps {
  stats: NarrationProjectStats;
  onQuickAction?: (action: string) => void;
}

export function NarrationDashboard({ stats, onQuickAction }: NarrationDashboardProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6" id="narration-dashboard-grid">
      {/* 1. Narration Completion */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-cinema-amber-500/40 transition-all shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cinema-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Completion</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-cinema-amber-500" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-foreground">
            {stats.overallProgress}%
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cinema-amber-600 to-cinema-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">
          {stats.scenesNarrated} / {stats.scenesTotal} scenes ready
        </p>
      </div>

      {/* 2. Recording Progress */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-cinema-amber-500/40 transition-all shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cinema-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Recorded</span>
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-foreground">
            {stats.recordedMinutes} <span className="text-xs font-normal text-muted-foreground">min</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 mt-1">
            Studio & Tape Takes
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Live family recordings</p>
      </div>

      {/* 3. AI Voice Coverage */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-cinema-amber-500/40 transition-all shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cinema-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">AI Voice</span>
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-foreground">
            {stats.generatedAiMinutes} <span className="text-xs font-normal text-muted-foreground">min</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-400 mt-1">
            Synthetic Clones
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">High-fidelity voice models</p>
      </div>

      {/* 4. Scene Synchronization */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-cinema-amber-500/40 transition-all shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cinema-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Sync Status</span>
          <Layers className="w-3.5 h-3.5 text-cinema-amber-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-foreground">
            100%
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-cinema-amber-400 mt-1">
            Auto Locked
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Linked to Story Studio</p>
      </div>

      {/* 5. Missing Voice Segments */}
      <div
        onClick={() => onQuickAction && onQuickAction('filter-missing')}
        className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-rose-500/50 cursor-pointer transition-all shadow-sm flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-cinema-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Missing</span>
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-rose-400">
            {stats.scenesMissing} <span className="text-xs font-normal text-muted-foreground">scenes</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-400/90 mt-1">
            Action required
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Est. ~{stats.estimatedRemainingMin}m remaining</p>
      </div>

      {/* 6. Audio Quality */}
      <div className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-cinema-amber-500/40 transition-all shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cinema-slate-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Audio Quality</span>
          <Activity className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-foreground">
            {stats.voiceQualityScore}/100
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-400 mt-1">
            Acoustic Rating
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">De-noise & ducking active</p>
      </div>

      {/* 7. Readiness Score */}
      <div className="p-3.5 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/30 hover:border-cinema-amber-500/60 transition-all shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cinema-amber-400">
          <span className="text-[10px] font-bold uppercase tracking-wider">Film Readiness</span>
          <Award className="w-3.5 h-3.5 text-cinema-amber-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-display font-bold text-cinema-amber-400">
            {stats.readinessScore}%
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-cinema-amber-300 mt-1">
            {stats.readinessScore >= 80 ? 'Master Ready' : 'In Production'}
          </span>
        </div>
        <p className="text-[10px] text-cinema-amber-200/70 mt-1.5 font-mono">Render queue score</p>
      </div>
    </div>
  );
}
