/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PipelineStage, PipelineStageId } from '../../types/render';
import { CheckCircle2, Clock, AlertCircle, Play, Sparkles, ChevronRight } from 'lucide-react';

interface RenderPipelineViewProps {
  stages: PipelineStage[];
  currentStageId: PipelineStageId;
  overallProgress: number;
}

export const RenderPipelineView: React.FC<RenderPipelineViewProps> = ({
  stages,
  currentStageId,
  overallProgress,
}) => {
  return (
    <div className="space-y-4" id="render-pipeline-stepper">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-foreground">Multi-Stage Production Pipeline</span>
        <span className="font-mono text-cinema-amber-500 font-bold bg-cinema-amber-500/10 px-2 py-0.5 rounded-full border border-cinema-amber-500/20">
          {overallProgress}% Overall
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {stages.map((stage, idx) => {
          const isCurrent = stage.id === currentStageId;
          const isDone = stage.status === 'completed';
          const isWarning = stage.status === 'warning';
          const isFailed = stage.status === 'failed';

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                isCurrent
                  ? 'bg-cinema-amber-500/10 border-cinema-amber-500/40 shadow-sm'
                  : isDone
                  ? 'bg-card/40 border-border/60 text-muted-foreground'
                  : isFailed
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-card/20 border-border/40 text-muted-foreground/60'
              }`}
            >
              <div className="flex-shrink-0 pt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Play className="w-4 h-4 text-cinema-amber-500 fill-current animate-pulse" />
                ) : isFailed ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : isWarning ? (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isCurrent ? 'text-cinema-amber-500' : isDone ? 'text-foreground' : 'text-foreground/80'}`}>
                    {idx + 1}. {stage.name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {stage.durationSec > 0 ? `${stage.durationSec}s` : 'Pending'}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {stage.description}
                </p>

                {isCurrent && (
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-cinema-amber-500 animate-pulse transition-all duration-300"
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
