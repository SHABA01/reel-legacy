/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, MessageSquare, CheckCircle2, History, Flame } from 'lucide-react';
import { ActivityHeatmap } from '../dashboard/ActivityHeatmap';

export function CollaborationSection() {
  return (
    <div id="collaboration-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Family Collaboration & Studio Activity Heatmap
          </h2>
          <p className="text-xs text-muted-foreground">
            Contribution frequency across 365 days, editorial review activity, comments, and collaborative story approvals.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> 14 Day Active Streak
          </span>
        </div>
      </div>

      {/* Collaboration Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Active Collaborators</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">5 Family Members</strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">Editors & Reviewers</span>
        </div>
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Editorial Reviews</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">34 Notes Added</strong>
          <span className="text-[10px] text-blue-400 font-mono font-semibold">100% Resolved</span>
        </div>
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Timeline Milestones</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">86 Milestones</strong>
          <span className="text-[10px] text-amber-500 font-mono font-semibold">Chronologically Verified</span>
        </div>
        <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Family Approvals</span>
          <strong className="block font-display text-xl text-foreground font-extrabold">12 Approved</strong>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">Ready for Broadcast</span>
        </div>
      </div>

      {/* Reusable Activity Heatmap */}
      <div className="bg-muted/20 border border-border/60 rounded-xl p-4">
        <ActivityHeatmap />
      </div>
    </div>
  );
}
