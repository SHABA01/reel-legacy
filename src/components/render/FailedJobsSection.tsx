/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RenderJob } from '../../types/render';
import { Button } from '../ui/Button';
import {
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface FailedJobsSectionProps {
  jobs: RenderJob[];
  onRetry: (id: string) => void;
  onApplyQuickFix: (jobId: string, checkId: string) => void;
  onOpenStory: (storyId: string) => void;
  onInspect: (job: RenderJob) => void;
}

export const FailedJobsSection: React.FC<FailedJobsSectionProps> = ({
  jobs,
  onRetry,
  onApplyQuickFix,
  onOpenStory,
  onInspect,
}) => {
  const failedOrAlertJobs = jobs.filter(
    (j) => j.status === 'failed' || j.status === 'preflight'
  );

  if (failedOrAlertJobs.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-foreground">Zero Render Failures</h4>
        <p className="text-xs text-muted-foreground max-w-md">
          All render jobs and pre-flight validations are running smoothly without errors or blocked pipelines.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="failed-renders-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Failed Renders & Pre-flight Alerts ({failedOrAlertJobs.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Review diagnostic details, why it failed, and apply automated AI quick fixes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {failedOrAlertJobs.map((job) => {
          const isFailed = job.status === 'failed';
          const unresolvedChecks = job.preflightChecks.filter((c) => !c.resolved);

          return (
            <div
              key={job.id}
              className={`p-4 rounded-2xl border transition-all ${
                isFailed
                  ? 'bg-rose-500/5 border-rose-500/30'
                  : 'bg-amber-500/5 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isFailed ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {isFailed ? <XCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[200px]">
                      {job.storyName}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Stage: <span className="font-semibold">{job.currentStage}</span> • {job.resolution}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isFailed
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isFailed ? 'Failed' : 'Pre-flight Alert'}
                </span>
              </div>

              {/* Error or Alert Message */}
              <div className="p-3 rounded-xl bg-background/80 border border-border/80 mb-3 space-y-1.5 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>Why It Failed / Diagnostic Message:</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                  {job.errorDetails ||
                    (unresolvedChecks[0]?.message ?? 'Pre-flight validation checks require action.')}
                </p>
              </div>

              {/* Quick Fix Suggestions if available */}
              {unresolvedChecks.length > 0 && (
                <div className="space-y-2 mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-cinema-amber-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Recommended Fixes:
                  </span>
                  {unresolvedChecks.map((check) => (
                    <div
                      key={check.id}
                      className="p-2.5 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="text-[11px] text-foreground truncate">{check.suggestion || check.message}</span>
                      <Button
                        size="sm"
                        onClick={() => onApplyQuickFix(job.id, check.id)}
                        className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-[10px] h-6 px-2.5 flex-shrink-0"
                      >
                        Auto Fix
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onInspect(job)}
                  className="text-xs h-7 px-2.5"
                >
                  Inspect Logs
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenStory(job.storyId)}
                    className="text-xs h-7 px-2.5 gap-1"
                  >
                    Open Story
                    <ExternalLink className="w-3 h-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onRetry(job.id)}
                    className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs h-7 px-3 gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry Pipeline
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
