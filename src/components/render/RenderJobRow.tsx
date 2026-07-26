/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RenderJob, RenderType } from '../../types/render';
import { Button } from '../ui/Button';
import { KebabMenu } from '../ui/KebabMenu';
import {
  Play,
  Pause,
  RotateCcw,
  XCircle,
  Film,
  Download,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Video,
  FileText,
  Volume2,
  Package,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface RenderJobRowProps {
  job: RenderJob;
  isSelected: boolean;
  isInspectSelected: boolean;
  onToggleSelect: (id: string) => void;
  onInspect: (job: RenderJob) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenStory: (storyId: string) => void;
  onApplyQuickFix?: (jobId: string, checkId: string) => void;
}

export const RenderJobRow: React.FC<RenderJobRowProps> = ({
  job,
  isSelected,
  isInspectSelected,
  onToggleSelect,
  onInspect,
  onPause,
  onResume,
  onRetry,
  onCancel,
  onDuplicate,
  onDelete,
  onOpenStory,
}) => {
  const getRenderTypeIcon = (type: RenderType) => {
    switch (type) {
      case 'documentary':
      case 'trailer':
        return Film;
      case 'vertical_reel':
        return Video;
      case 'audio_podcast':
      case 'voice_package':
        return Volume2;
      case 'memoir_pdf':
      case 'transcript_export':
        return FileText;
      case 'zip_archive':
        return Package;
      default:
        return Film;
    }
  };

  const getStatusBadge = () => {
    switch (job.status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30">
            <Play className="w-3 h-3 fill-current animate-pulse" />
            Rendering ({job.progress}%)
          </span>
        );
      case 'preflight':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            Pre-flight Alert
          </span>
        );
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            In Queue
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border">
            <Pause className="w-3 h-3" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Calendar className="w-3 h-3" />
            Scheduled
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    switch (job.priority) {
      case 'urgent':
        return <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">URGENT</span>;
      case 'high':
        return <span className="text-[10px] font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded-full border border-cinema-amber-500/20">HIGH</span>;
      case 'normal':
        return <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">NORMAL</span>;
      case 'low':
        return <span className="text-[10px] font-medium text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full">LOW</span>;
    }
  };

  const TypeIcon = getRenderTypeIcon(job.type);

  const kebabItems = [
    {
      id: 'inspect',
      label: 'Inspect Render Job',
      icon: <Info className="w-3.5 h-3.5" />,
      onClick: () => onInspect(job),
    },
    {
      id: 'open-story',
      label: 'Open Story in Studio',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      onClick: () => onOpenStory(job.storyId),
    },
    {
      id: 'duplicate',
      label: 'Duplicate Render Job',
      icon: <Film className="w-3.5 h-3.5" />,
      onClick: () => onDuplicate(job.id),
    },
    {
      id: 'delete',
      label: 'Delete Job History',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
      onClick: () => onDelete(job.id),
      danger: true,
    },
  ];

  return (
    <tr
      className={`border-b border-border/60 hover:bg-muted/40 transition-colors group cursor-pointer ${
        isInspectSelected ? 'bg-cinema-amber-500/5 border-l-4 border-l-cinema-amber-500' : ''
      }`}
      onClick={(e) => {
        // Prevent trigger if clicking on buttons or checkboxes
        if (
          (e.target as HTMLElement).closest('button') ||
          (e.target as HTMLElement).closest('input')
        ) {
          return;
        }
        onInspect(job);
      }}
    >
      {/* Checkbox Select */}
      <td className="p-3 w-10 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(job.id)}
          className="rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
        />
      </td>

      {/* Story Name & Thumbnail */}
      <td className="p-3 min-w-[240px]">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/60 border border-border/80 flex-shrink-0">
            <img
              src={job.thumbnailUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
              alt={job.storyName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <TypeIcon className="absolute bottom-1 right-1 w-3.5 h-3.5 text-cinema-amber-500" />
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-foreground truncate hover:text-cinema-amber-500 transition-colors">
                {job.storyName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono text-cinema-amber-500/90 font-medium">{job.version}</span>
              <span>•</span>
              <span>{job.profileName}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Status & Stage */}
      <td className="p-3 min-w-[160px]">
        <div className="space-y-1">
          {getStatusBadge()}
          <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
            {job.stages.find((s) => s.id === job.currentStage)?.name || 'Initializing'}
          </div>
        </div>
      </td>

      {/* Progress & Time Remaining */}
      <td className="p-3 min-w-[180px]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-bold text-foreground">{job.progress}%</span>
            <span className="text-muted-foreground text-[10px]">
              {job.status === 'running' && job.estimatedTimeRemainingSec !== undefined
                ? `~${Math.ceil(job.estimatedTimeRemainingSec / 60)}m left`
                : job.status === 'completed'
                ? `Done (${Math.ceil(job.renderTimeSec / 60)}m)`
                : ''}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                job.status === 'completed'
                  ? 'bg-emerald-500'
                  : job.status === 'failed'
                  ? 'bg-rose-500'
                  : job.status === 'running'
                  ? 'bg-cinema-amber-500 animate-pulse'
                  : 'bg-muted-foreground/30'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      </td>

      {/* Render Format & Resolution */}
      <td className="p-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">{job.resolution}</span>
          <p className="text-[10px] text-muted-foreground">{job.format}</p>
        </div>
      </td>

      {/* Priority */}
      <td className="p-3 text-center">{getPriorityBadge()}</td>

      {/* Output Destination */}
      <td className="p-3 text-xs max-w-[160px] truncate text-muted-foreground font-mono text-[10px]">
        {job.outputDestination}
      </td>

      {/* Actions */}
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {job.status === 'running' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPause(job.id)}
              className="h-7 px-2 text-[11px] gap-1"
              title="Pause Render"
            >
              <Pause className="w-3 h-3" />
            </Button>
          )}

          {(job.status === 'paused' || job.status === 'queued' || job.status === 'scheduled') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResume(job.id)}
              className="h-7 px-2 text-[11px] gap-1 text-cinema-amber-500 hover:text-cinema-amber-400"
              title="Resume Render"
            >
              <Play className="w-3 h-3 fill-current" />
            </Button>
          )}

          {(job.status === 'failed' || job.status === 'preflight') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRetry(job.id)}
              className="h-7 px-2 text-[11px] gap-1 text-cinema-amber-500"
              title="Retry Pipeline"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}

          {job.status === 'completed' && job.outputFileUrl && (
            <a
              href={job.outputFileUrl}
              target="_blank"
              rel="noreferrer"
              className="h-7 px-2 text-[11px] gap-1 font-bold inline-flex items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
            >
              <Download className="w-3 h-3" />
            </a>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onInspect(job)}
            className="h-7 px-2 text-[11px] gap-1"
            title="Inspect Details"
          >
            <Info className="w-3 h-3" />
          </Button>

          <KebabMenu id={`job-kebab-${job.id}`} items={kebabItems} />
        </div>
      </td>
    </tr>
  );
};
