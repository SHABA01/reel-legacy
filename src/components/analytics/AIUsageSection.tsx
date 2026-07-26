/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Cpu, Zap, MessageSquare, Mic, FileText, CheckCircle2 } from 'lucide-react';
import { DonutChart } from './AnalyticsCharts';

export function AIUsageSection() {
  const aiDistributionSegments = [
    { label: 'Screenplay Auto-Scripting', value: 420, color: '#a855f7' },
    { label: 'Voice Narration Synthesis', value: 310, color: '#f59e0b' },
    { label: 'AI Director Pacing Analysis', value: 180, color: '#3b82f6' },
    { label: 'Archival Photo Colorization', value: 140, color: '#06b6d4' },
  ];

  return (
    <div id="ai-usage-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> AI Usage & Intelligence Telemetry
          </h2>
          <p className="text-xs text-muted-foreground">
            Token consumption, model execution latency, automated narration synthesis, and screenplay generation stats.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> Engine: Gemini 2.5 Flash
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Token Distribution Donut Chart */}
        <div className="bg-muted/20 border border-border/60 rounded-xl p-4 flex flex-col items-center space-y-3">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
            Token Allocation Distribution
          </span>
          <DonutChart
            segments={aiDistributionSegments}
            size={170}
            centerText="1,050"
            centerSubtext="AI Generations"
          />
        </div>

        {/* AI Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Screenplay Drafts
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">99.8% Accuracy</span>
            </div>
            <strong className="text-xl font-display font-bold text-foreground block">142 Screenplays</strong>
            <p className="text-[11px] text-muted-foreground">Generated via Gemini 2.5 Flash story synthesis</p>
          </div>

          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-500" /> Voice Synthesis Batches
              </span>
              <span className="text-xs font-mono font-bold text-amber-500">220 ms latency</span>
            </div>
            <strong className="text-xl font-display font-bold text-foreground block">310 Voice Clips</strong>
            <p className="text-[11px] text-muted-foreground">Neutral, Warm & Local Accent Voice Profiles</p>
          </div>

          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" /> AI Director Suggestions
              </span>
              <span className="text-xs font-mono font-bold text-blue-400">84% Accepted</span>
            </div>
            <strong className="text-xl font-display font-bold text-foreground block">180 Recommendations</strong>
            <p className="text-[11px] text-muted-foreground">Pacing, acoustic ducking & visual pan/zoom tips</p>
          </div>

          <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Photo Restoration
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">140 Enhanced</span>
            </div>
            <strong className="text-xl font-display font-bold text-foreground block">140 High-Res Scans</strong>
            <p className="text-[11px] text-muted-foreground">Vintage portrait colorization & scratch removal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
