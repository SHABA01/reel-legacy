/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Film, CloudUpload, Cpu } from 'lucide-react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  id?: string;
  key?: any;
}

export function Skeleton({ className = '', id }: SkeletonProps) {
  const generatedId = id || `skeleton-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div
      id={generatedId}
      className={`animate-pulse rounded-lg bg-cinema-slate-200 dark:bg-cinema-slate-800 ${className}`}
    />
  );
}

// 1. Skeleton Card
export function SkeletonCard({ id }: { id?: string }) {
  const generatedId = id || `sk-card-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div
      id={generatedId}
      className="p-5 border border-border rounded-xl bg-card flex flex-col gap-4"
    >
      <Skeleton id={`${generatedId}-media`} className="w-full aspect-video rounded-lg" />
      <div className="flex flex-col gap-2" id={`${generatedId}-meta`}>
        <Skeleton id={`${generatedId}-title`} className="w-2/3 h-5" />
        <Skeleton id={`${generatedId}-desc`} className="w-full h-4" />
        <Skeleton id={`${generatedId}-desc-2`} className="w-5/6 h-4" />
      </div>
      <div className="flex justify-between items-center mt-2" id={`${generatedId}-footer`}>
        <Skeleton id={`${generatedId}-author`} className="w-16 h-4" />
        <Skeleton id={`${generatedId}-btn`} className="w-24 h-9 rounded-lg" />
      </div>
    </div>
  );
}

// 2. Skeleton List
export function SkeletonList({ rows = 3, id }: { rows?: number; id?: string }) {
  const generatedId = id || `sk-list-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div id={generatedId} className="flex flex-col gap-3 w-full">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          id={`${generatedId}-row-${idx}`}
          className="p-4 border border-border rounded-xl bg-card flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1" id={`${generatedId}-row-${idx}-left`}>
            <Skeleton id={`${generatedId}-row-${idx}-icon`} className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1" id={`${generatedId}-row-${idx}-text`}>
              <Skeleton id={`${generatedId}-row-${idx}-title`} className="w-1/3 h-4" />
              <Skeleton id={`${generatedId}-row-${idx}-sub`} className="w-1/2 h-3" />
            </div>
          </div>
          <Skeleton id={`${generatedId}-row-${idx}-status`} className="w-16 h-4 rounded" />
          <Skeleton id={`${generatedId}-row-${idx}-action`} className="w-8 h-8 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}

// 3. Skeleton Table
export function SkeletonTable({ rows = 4, cols = 4, id }: { rows?: number; cols?: number; id?: string }) {
  const generatedId = id || `sk-table-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div id={generatedId} className="w-full border border-border rounded-xl bg-card overflow-hidden">
      {/* Table Head */}
      <div className="flex bg-muted/40 px-6 py-4 border-b border-border" id={`${generatedId}-header`}>
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} id={`${generatedId}-th-${idx}`} className="flex-1 h-4 max-w-[120px] mr-4" />
        ))}
      </div>
      {/* Table Body */}
      <div className="flex flex-col" id={`${generatedId}-body`}>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} id={`${generatedId}-tr-${rIdx}`} className="flex px-6 py-4 border-b border-border last:border-b-0 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton key={cIdx} id={`${generatedId}-td-${rIdx}-${cIdx}`} className="flex-1 h-4 max-w-[150px] mr-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Skeleton Form
export function SkeletonForm({ id }: { id?: string }) {
  const generatedId = id || `sk-form-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div id={generatedId} className="flex flex-col gap-5 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id={`${generatedId}-inputs`}>
        <div className="flex flex-col gap-2" id={`${generatedId}-group-1`}>
          <Skeleton id={`${generatedId}-label-1`} className="w-16 h-3" />
          <Skeleton id={`${generatedId}-input-1`} className="w-full h-10" />
        </div>
        <div className="flex flex-col gap-2" id={`${generatedId}-group-2`}>
          <Skeleton id={`${generatedId}-label-2`} className="w-20 h-3" />
          <Skeleton id={`${generatedId}-input-2`} className="w-full h-10" />
        </div>
      </div>
      <div className="flex flex-col gap-2" id={`${generatedId}-group-text`}>
        <Skeleton id={`${generatedId}-label-text`} className="w-28 h-3" />
        <Skeleton id={`${generatedId}-input-text`} className="w-full h-24" />
      </div>
      <div className="flex justify-end gap-3" id={`${generatedId}-actions`}>
        <Skeleton id={`${generatedId}-cancel`} className="w-20 h-10" />
        <Skeleton id={`${generatedId}-submit`} className="w-32 h-10" />
      </div>
    </div>
  );
}

// 5. Linear Loader
export function LinearLoader({ value, label, id }: { value?: number; label?: string; id?: string }) {
  const generatedId = id || `linear-loader-${Math.random().toString(36).substring(2, 9)}`;
  const displayVal = value !== undefined ? Math.min(100, Math.max(0, value)) : undefined;

  return (
    <div id={generatedId} className="w-full flex flex-col gap-2">
      {label && (
        <div className="flex justify-between items-center text-xs font-medium text-cinema-slate-500 dark:text-cinema-slate-400" id={`${generatedId}-header`}>
          <span id={`${generatedId}-label`}>{label}</span>
          {displayVal !== undefined && <span id={`${generatedId}-percentage`}>{displayVal}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-cinema-slate-100 dark:bg-cinema-slate-800 rounded-full overflow-hidden relative" id={`${generatedId}-bar`}>
        {displayVal !== undefined ? (
          <div
            id={`${generatedId}-progress`}
            className="h-full bg-cinema-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${displayVal}%` }}
          />
        ) : (
          <div
            id={`${generatedId}-indeterminate`}
            className="h-full bg-cinema-amber-500 rounded-full animate-[shimmer_1.5s_infinite]"
            style={{
              width: '40%',
              position: 'absolute',
              animation: 'indeterminate 1.5s infinite linear',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes indeterminate {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}

// 6. Circular Loader
export function CircularLoader({ size = 'md', className = '', id }: { size?: 'sm' | 'md' | 'lg'; className?: string; id?: string }) {
  const generatedId = id || `circular-loader-${Math.random().toString(36).substring(2, 9)}`;
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      id={generatedId}
      className={`animate-spin rounded-full border-solid border-t-cinema-amber-500 border-cinema-slate-200 dark:border-cinema-slate-800 ${sizes[size]} ${className}`}
    />
  );
}

// 7. Specialized AI Generation Loader
export function AIGenerationLoader({ title = 'AI is writing your story...', description = 'Analyzing legacy context and mapping out documentary flow.', id }: { title?: string; description?: string; id?: string }) {
  const generatedId = id || `ai-loader-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div
      id={generatedId}
      className="p-8 border border-border rounded-2xl bg-gradient-to-br from-card to-muted/20 flex flex-col items-center text-center gap-5 shadow-lg max-w-md mx-auto"
    >
      <div id={`${generatedId}-visual`} className="relative w-16 h-16 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-cinema-ai">
        <Sparkles className="w-8 h-8 animate-pulse shrink-0" />
        <div className="absolute inset-0 rounded-2xl border border-cinema-ai/30 animate-ping" />
      </div>
      <div className="flex flex-col gap-2" id={`${generatedId}-text`}>
        <h4 id={`${generatedId}-title`} className="font-display font-semibold text-base text-cinema-slate-900 dark:text-cinema-slate-100 flex items-center justify-center gap-2">
          <Cpu className="w-4 h-4 animate-spin shrink-0 text-cinema-ai" /> {title}
        </h4>
        <p id={`${generatedId}-desc`} className="text-sm text-cinema-slate-500 dark:text-cinema-slate-400">
          {description}
        </p>
      </div>
      <LinearLoader id={`${generatedId}-bar`} />
    </div>
  );
}

// 8. Specialized Media Upload Loader
export function MediaUploadLoader({ fileName = 'family_photos_1984.zip', progress = 42, id }: { fileName?: string; progress?: number; id?: string }) {
  const generatedId = id || `upload-loader-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div
      id={generatedId}
      className="p-6 border border-border rounded-xl bg-card flex items-center gap-4 w-full"
    >
      <div id={`${generatedId}-visual`} className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-cinema-amber-600">
        <CloudUpload className="w-6 h-6 animate-bounce" />
      </div>
      <div className="flex-1 flex flex-col gap-2" id={`${generatedId}-progress-group`}>
        <div className="flex justify-between items-center" id={`${generatedId}-header`}>
          <span id={`${generatedId}-filename`} className="text-sm font-medium truncate max-w-[200px] text-cinema-slate-800 dark:text-cinema-slate-200">
            {fileName}
          </span>
          <span id={`${generatedId}-percent`} className="text-xs font-semibold text-cinema-amber-600">{progress}%</span>
        </div>
        <LinearLoader id={`${generatedId}-bar`} value={progress} />
      </div>
    </div>
  );
}

// 9. Specialized Render Loader
export function RenderLoader({ id }: { id?: string }) {
  const generatedId = id || `render-loader-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div
      id={generatedId}
      className="p-8 border border-border rounded-2xl bg-gradient-to-br from-card to-muted/20 shadow-xl max-w-lg mx-auto flex flex-col gap-6"
    >
      <div className="flex items-center gap-4" id={`${generatedId}-top`}>
        <div id={`${generatedId}-visual`} className="w-14 h-14 rounded-2xl bg-cinema-amber-50 dark:bg-cinema-amber-950/40 flex items-center justify-center text-cinema-amber-500 shrink-0">
          <Film className="w-7 h-7 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
        </div>
        <div className="flex flex-col gap-1" id={`${generatedId}-text`}>
          <h4 id={`${generatedId}-title`} className="font-display font-semibold text-base text-cinema-slate-900 dark:text-cinema-slate-100">
            Rendering Film Project
          </h4>
          <p id={`${generatedId}-desc`} className="text-xs text-cinema-slate-400 dark:text-cinema-slate-500">
            Stitching high-resolution photos, syncing voice narration script, and mixing background score.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2" id={`${generatedId}-stats`}>
        <div className="flex justify-between text-xs font-medium text-cinema-slate-500 dark:text-cinema-slate-400" id={`${generatedId}-stat-header`}>
          <span>Exporting: Full HD (1080p, 24fps)</span>
          <span>Processing Scene 3 of 8...</span>
        </div>
        <LinearLoader id={`${generatedId}-bar`} value={38} />
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 text-center text-xs text-muted-foreground" id={`${generatedId}-meta`}>
        <div className="flex flex-col gap-0.5" id={`${generatedId}-meta-col-1`}>
          <span className="font-mono text-cinema-slate-400">FPS</span>
          <span className="font-semibold text-cinema-slate-800 dark:text-cinema-slate-200">24.2</span>
        </div>
        <div className="flex flex-col gap-0.5" id={`${generatedId}-meta-col-2`}>
          <span className="font-mono text-cinema-slate-400">TIME ELAPSED</span>
          <span className="font-semibold text-cinema-slate-800 dark:text-cinema-slate-200">01:45</span>
        </div>
        <div className="flex flex-col gap-0.5" id={`${generatedId}-meta-col-3`}>
          <span className="font-mono text-cinema-slate-400">EST. REMAINING</span>
          <span className="font-semibold text-cinema-slate-800 dark:text-cinema-slate-200">~03:10</span>
        </div>
      </div>
    </div>
  );
}
