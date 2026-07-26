/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

export function InsightCardsSection() {
  const insights = [
    {
      type: 'positive',
      title: 'Production Velocity Surge (+24%)',
      description: 'Story production increased 24% this week following the integration of automated oral voice alignment.',
      badge: 'EFFICIENCY BOOST',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      borderColor: 'border-emerald-500/30',
    },
    {
      type: 'quality',
      title: 'Acoustic Narration Quality Improvement',
      description: 'Audio clarity and natural inflection scores improved 18% after switching to the Evelyn voice profile.',
      badge: 'AUDIO OPTIMIZATION',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      type: 'warning',
      title: '17 Archival Photos Unassigned',
      description: '17 high-resolution historical photos remain unassigned to chapter milestones in active documentary drafts.',
      badge: 'MEDIA ARCHIVE GAP',
      badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      borderColor: 'border-amber-500/30',
    },
    {
      type: 'readiness',
      title: '3 Stories Ready for 4K Render Queue',
      description: 'Three documentary projects have reached 90%+ completion and are awaiting final export rendering.',
      badge: 'RENDER READY',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      borderColor: 'border-rose-500/30',
    },
    {
      type: 'engagement',
      title: 'Family Collaboration Activity Slowdown',
      description: 'Family review comments have decreased by 30% this month. Consider sharing a review link with relatives.',
      badge: 'COLLABORATION TIP',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
  ];

  return (
    <div id="insight-cards-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cinema-amber-500" /> AI-Generated Telemetry Insights
          </h2>
          <p className="text-xs text-muted-foreground">
            Automated intelligence translating raw production metrics into high-level story and workflow insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 bg-muted/20 border ${item.borderColor} rounded-xl space-y-3 hover:bg-muted/30 transition-all flex flex-col justify-between`}
          >
            <div className="space-y-2">
              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border inline-block ${item.badgeColor}`}>
                {item.badge}
              </span>
              <h3 className="font-display font-bold text-sm text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Confidence: 96%</span>
              <span className="text-cinema-amber-500 font-semibold flex items-center gap-1">
                AI Director <Sparkles className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
