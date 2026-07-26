/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RenderJob } from '../../types/render';
import { Button } from '../ui/Button';
import {
  Play,
  Pause,
  RotateCcw,
  XCircle,
  ExternalLink,
  Download,
  Info,
  Layers,
  Clock,
  Sparkles,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface RenderJobCardGridProps {
  jobs: RenderJob[];
  inspectingJobId: string | null;
  onInspect: (job: RenderJob) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onOpenStory: (storyId: string) => void;
}

export const RenderJobCardGrid: React.FC<RenderJobCardGridProps> = ({
  jobs,
  inspectingJobId,
  onInspect,
  onPause,
  onResume,
  onRetry,
  onCancel,
  onOpenStory,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="render-jobs-card-grid">
      {jobs.map((job) => {
        const isInspecting = inspectingJobId === job.id;

        return (
          <div
            key={job.id}
            onClick={() => onInspect(job)}
            className={`p-4 rounded-2xl bg-card border cursor-pointer transition-all space-y-3 relative group ${
              isInspecting
                ? 'border-cinema-amber-500 shadow-md ring-1 ring-cinema-amber-500/50'
                : 'border-border hover:border-cinema-amber-500/40'
            }`}
          >
            {/* Card Thumbnail & Status */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black/80">
              <img
                src={
                  job.thumbnailUrl ||
                  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
                }
                alt={job.storyName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-cinema-amber-500 border border-cinema-amber-500/30">
                    {job.resolution} • {job.format}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      job.status === 'running'
                        ? 'bg-cinema-amber-500 text-black'
                        : job.status === 'completed'
                        ? 'bg-emerald-500 text-black'
                        : job.status === 'failed'
                        ? 'bg-rose-500 text-white'
                        : job.status === 'preflight'
                        ? 'bg-amber-500 text-black'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {job.status === 'running' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white">
                      <span>Stage: {job.currentStage}</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full bg-cinema-amber-500 transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Specs */}
            <div>
              <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-cinema-amber-500 transition-colors">
                {job.storyName}
              </h4>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {job.profileName} • Priority: {job.priority.toUpperCase()}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div
              className="flex items-center justify-between pt-2 border-t border-border/60"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => onInspect(job)}
                className="text-xs h-7 px-2.5 gap-1"
              >
                <Info className="w-3 h-3" />
                Inspect
              </Button>

              <div className="flex items-center gap-1.5">
                {job.status === 'running' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPause(job.id)}
                    className="text-xs h-7 px-2.5 gap-1"
                  >
                    <Pause className="w-3 h-3" />
                    Pause
                  </Button>
                )}

                {(job.status === 'paused' || job.status === 'queued') && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onResume(job.id)}
                    className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs h-7 px-2.5 gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Resume
                  </Button>
                )}

                {(job.status === 'failed' || job.status === 'preflight') && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onRetry(job.id)}
                    className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs h-7 px-2.5 gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry
                  </Button>
                )}

                {job.status === 'completed' && job.outputFileUrl && (
                  <a
                    href={job.outputFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 px-2.5 text-xs font-bold gap-1 inline-flex items-center justify-center rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenStory(job.storyId)}
                  className="text-xs h-7 px-2"
                  title="Open Story Studio"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
