/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RenderJob } from '../../types/render';
import { RenderPipelineView } from './RenderPipelineView';
import { Button } from '../ui/Button';
import { TabNavigation } from '../ui/TabNavigation';
import { ReelMediaPlayer } from '../ui/ReelMediaPlayer';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Download,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Terminal,
  FileText,
  Sliders,
  Copy,
  Info,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface RenderInspectorProps {
  job: RenderJob | null;
  onClose: () => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onOpenStory: (storyId: string) => void;
  onApplyQuickFix: (jobId: string, checkId: string) => void;
}

export const RenderInspector: React.FC<RenderInspectorProps> = ({
  job,
  onClose,
  onPause,
  onResume,
  onRetry,
  onCancel,
  onOpenStory,
  onApplyQuickFix,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'preflight' | 'logs' | 'output'>('pipeline');
  const [logFilter, setLogFilter] = useState('');

  if (!job) return null;

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(job.logs.join('\n'));
    showToast('info', 'Render logs copied to clipboard');
  };

  const tabs = [
    { value: 'pipeline', label: 'Pipeline' },
    {
      value: 'preflight',
      label: `Pre-flight (${job.preflightChecks.filter((c) => !c.resolved).length})`,
    },
    { value: 'logs', label: 'Logs' },
    { value: 'output', label: 'Output' },
  ];

  const filteredLogs = job.logs.filter((l) =>
    l.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <aside
      id="render-job-context-inspector"
      className="w-full lg:w-96 flex-shrink-0 bg-card border border-border rounded-2xl p-4 space-y-4 shadow-lg animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-foreground truncate max-w-[200px]">
              {job.storyName}
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              ID: {job.id}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Preview Thumbnail & Quick Actions */}
      <div className="space-y-3">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black/80 group">
          <img
            src={job.thumbnailUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
            alt={job.storyName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-black/60 text-cinema-amber-500 border border-cinema-amber-500/30">
                {job.resolution} • {job.format}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20">
                {job.priority} Priority
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
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
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {job.status === 'running' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPause(job.id)}
              className="flex-1 text-xs gap-1.5 h-8"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause
            </Button>
          )}

          {(job.status === 'paused' || job.status === 'queued') && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onResume(job.id)}
              className="flex-1 bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-8"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume Render
            </Button>
          )}

          {(job.status === 'failed' || job.status === 'preflight') && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onRetry(job.id)}
              className="flex-1 bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-8"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Pipeline
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenStory(job.storyId)}
            className="text-xs gap-1.5 h-8"
            title="Open Story Workspace"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Studio
          </Button>

          {job.status === 'completed' && job.outputFileUrl && (
            <a
              href={job.outputFileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 h-8 px-3 text-xs font-bold gap-1.5 inline-flex items-center justify-center rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation
        id="render-inspector-tabs"
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab Content */}
      <div className="pt-2">
        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <RenderPipelineView
            stages={job.stages}
            currentStageId={job.currentStage}
            overallProgress={job.progress}
          />
        )}

        {/* Pre-flight & AI Assistant Tab */}
        {activeTab === 'preflight' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-cinema-amber-500 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Production Readiness Analysis</span>
              </div>
              <ul className="space-y-1 text-xs text-foreground/90 pl-1 list-disc list-inside">
                {job.aiSuggestions.map((sugg, i) => (
                  <li key={i}>{sugg}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground">Pre-flight Checks ({job.preflightChecks.length})</h4>
              {job.preflightChecks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No pre-flight warnings detected.</p>
              ) : (
                <div className="space-y-2">
                  {job.preflightChecks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        check.resolved
                          ? 'bg-card/40 border-border/60 opacity-60'
                          : check.severity === 'error'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {check.resolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                          <span className="capitalize">{check.category} Check</span>
                        </div>
                        {check.resolved && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Resolved
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-foreground/90">{check.message}</p>

                      {check.suggestion && (
                        <p className="text-[10px] text-muted-foreground italic">
                          💡 Suggestion: {check.suggestion}
                        </p>
                      )}

                      {!check.resolved && check.quickFixAction && (
                        <div className="pt-1">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => onApplyQuickFix(job.id, check.id)}
                            className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-[11px] gap-1 h-7"
                          >
                            <Zap className="w-3 h-3" />
                            Apply Quick Fix
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                placeholder="Filter logs..."
                className="flex-1 p-1.5 text-xs bg-background border border-border rounded-xl text-foreground"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLogs}
                className="h-8 px-2 text-xs gap-1"
                title="Copy Terminal Logs"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="p-3 bg-black/90 font-mono text-[10px] text-amber-300 rounded-xl border border-border h-64 overflow-y-auto space-y-1">
              {filteredLogs.length === 0 ? (
                <p className="text-muted-foreground">No matching log statements.</p>
              ) : (
                filteredLogs.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </div>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-card/60 border border-border space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cinema-amber-500" />
                Export Details & Checksum
              </h4>

              <div className="space-y-1 text-muted-foreground font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="text-foreground text-right truncate max-w-[180px]">
                    {job.outputDestination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="text-foreground">{job.outputFileSizeMB || 1800} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-foreground">
                    {Math.floor(job.durationSec / 60)}m {job.durationSec % 60}s
                  </span>
                </div>
                {job.checksum && (
                  <div className="pt-1">
                    <span className="block text-[10px] text-muted-foreground">SHA-256 Checksum:</span>
                    <span className="block text-[9px] text-cinema-amber-500/90 truncate font-mono">
                      {job.checksum}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {job.outputFileUrl && (
              <div className="space-y-1">
                <span className="font-bold text-foreground">Video Preview:</span>
                <ReelMediaPlayer
                  src={job.outputFileUrl}
                  poster={job.thumbnailUrl || ''}
                  autoPlay={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
