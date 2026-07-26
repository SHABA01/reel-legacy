/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lightbulb, ArrowRight, BookOpen, Users, Mic, HardDrive, Video } from 'lucide-react';
import { useOverlay } from '../../context/OverlayContext';
import { Button } from '../ui/Button';

export function RecommendationsSection() {
  const { setActiveView } = useOverlay();

  const recs = [
    {
      id: 'continue-story',
      title: 'Continue Active Story: Grandpa WWII Memoir',
      desc: '2 scenes pending oral narration audio render before triggering export.',
      targetView: 'stories',
      actionText: 'Open Story Studio',
      icon: BookOpen,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'complete-profile',
      title: 'Complete Legacy Profile: Aunt Evelyn',
      desc: 'Birthplace and early career milestones missing from family tree graph.',
      targetView: 'profiles',
      actionText: 'Edit Legacy Profile',
      icon: Users,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'narration-synthesis',
      title: 'Batch Synthesize Voice for Chapter 4',
      desc: '14 script sentences parsed and ready for Evelyn voice audio synthesis.',
      targetView: 'narration',
      actionText: 'Synthesize Audio',
      icon: Mic,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'assign-media',
      title: 'Assign 17 Photos to 1940s Timeline',
      desc: 'Unassigned archival photo scans detected in Media Library.',
      targetView: 'media',
      actionText: 'Review Media Archives',
      icon: HardDrive,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'render-export',
      title: 'Queue 4K Export for 3 Completed Stories',
      desc: 'Projects have passed all preflight validation checks.',
      targetView: 'render',
      actionText: 'View Render Queue',
      icon: Video,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div id="recommendations-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Actionable Recommendations & Next Steps
          </h2>
          <p className="text-xs text-muted-foreground">
            Prioritized actions suggested by the AI Director to unblock production and optimize heritage story quality.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recs.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="p-4 bg-muted/20 border border-border/60 hover:border-cinema-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border shrink-0 ${rec.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm text-foreground">{rec.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.desc}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView(rec.targetView as any)}
                className="shrink-0 text-xs font-semibold cursor-pointer border-border hover:border-cinema-amber-500"
              >
                {rec.actionText} <ArrowRight className="w-3.5 h-3.5 ml-1 text-cinema-amber-500" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
