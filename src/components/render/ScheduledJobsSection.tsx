/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RenderJob } from '../../types/render';
import { Button } from '../ui/Button';
import {
  Calendar,
  Clock,
  Play,
  XCircle,
  Film,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

interface ScheduledJobsSectionProps {
  jobs: RenderJob[];
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onInspect: (job: RenderJob) => void;
}

export const ScheduledJobsSection: React.FC<ScheduledJobsSectionProps> = ({
  jobs,
  onResume,
  onCancel,
  onInspect,
}) => {
  const scheduledJobs = jobs.filter((j) => j.status === 'scheduled');

  if (scheduledJobs.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-foreground">No Scheduled Renders</h4>
        <p className="text-xs text-muted-foreground max-w-md">
          Schedule batch exports overnight or queue jobs to render automatically after narration approval.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="scheduled-renders-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Scheduled Renders ({scheduledJobs.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Renders queued for future batch processing, overnight render slots, or trigger events.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduledJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 rounded-2xl bg-card border border-border hover:border-blue-500/40 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Scheduled
                </span>
                <h4 className="text-xs font-bold text-foreground line-clamp-1">
                  {job.storyName}
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                {job.resolution}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-background border border-border/80 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Scheduled Time:</span>
              </div>
              <p className="text-[11px] text-foreground font-mono pl-5">
                {job.scheduledFor
                  ? new Date(job.scheduledFor).toLocaleString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Overnight Batch Slot'}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
              <span className="text-[10px] truncate max-w-[150px]">
                Preset: {job.profileName}
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancel(job.id)}
                  className="text-xs h-7 px-2 text-rose-400 hover:text-rose-300"
                  title="Cancel Schedule"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </Button>

                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onResume(job.id)}
                  className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs h-7 px-2.5 gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Run Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
