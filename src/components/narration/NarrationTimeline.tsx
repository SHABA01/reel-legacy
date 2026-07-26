/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic,
  Video,
  Subtitles,
  Music,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Lock,
  Eye
} from 'lucide-react';
import { NarrationSegment } from '../../types/narration';

interface NarrationTimelineProps {
  segments: NarrationSegment[];
  selectedSegmentId: string | null;
  onSelectSegment: (segmentId: string) => void;
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function NarrationTimeline({
  segments,
  selectedSegmentId,
  onSelectSegment,
  currentTime,
  onSeek,
  isPlaying,
  onTogglePlay
}: NarrationTimelineProps) {
  // Total timeline duration calculation
  const totalDuration = segments.reduce((acc, seg) => acc + (seg.actualDurationSec || seg.speakingDurationEstimateSec || 15), 0);
  const playheadPct = totalDuration > 0 ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100)) : 0;

  return (
    <div className="bg-card/70 border-t border-border/80 p-3 space-y-2 select-none" id="narration-bottom-timeline">
      {/* TIMELINE TRANSPORT CONTROL BAR */}
      <div className="flex items-center justify-between text-xs border-b border-border/60 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-xl bg-cinema-amber-500 text-slate-950 font-bold hover:bg-cinema-amber-400 transition-colors cursor-pointer shadow-md"
            title={isPlaying ? 'Pause' : 'Play Studio Master'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <div className="font-mono text-xs text-foreground font-semibold">
            <span>{formatTimecode(currentTime)}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="text-muted-foreground">{formatTimecode(totalDuration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cinema-amber-400 px-2 py-0.5 rounded bg-cinema-amber-500/10 border border-cinema-amber-500/20">
            Full Project Multi-Track Synchronization
          </span>
        </div>
      </div>

      {/* TRACKS CONTAINER */}
      <div className="space-y-1 relative">
        {/* PLAYHEAD OVERLAY LINE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPct}%` }}
        >
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -ml-1 shadow-md" />
        </div>

        {/* TRACK 1: VIDEO SCENES */}
        <div className="flex items-center gap-2 h-7 bg-background/50 rounded-lg p-1 border border-border/40">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground font-mono">
            <Video className="w-3 h-3 text-cinema-amber-400" />
            <span>Scenes</span>
          </div>

          <div className="flex-1 h-full flex items-center gap-1 relative overflow-hidden">
            {segments.map(seg => {
              const isSelected = seg.id === selectedSegmentId;
              const dur = seg.actualDurationSec || seg.speakingDurationEstimateSec || 15;
              const flexWeight = Math.max(1, Math.round(dur));

              return (
                <div
                  key={`track-scene-${seg.id}`}
                  onClick={() => onSelectSegment(seg.id)}
                  style={{ flex: flexWeight }}
                  className={`h-full rounded px-2 flex items-center justify-between text-[10px] font-mono truncate cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cinema-amber-500/30 text-cinema-amber-300 border border-cinema-amber-400 font-bold'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="truncate">{seg.sceneTitle}</span>
                  <span className="text-[9px] opacity-70">{dur}s</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 2: NARRATION VOICE CLIPS */}
        <div className="flex items-center gap-2 h-8 bg-background/50 rounded-lg p-1 border border-border/40">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground font-mono">
            <Mic className="w-3 h-3 text-emerald-400" />
            <span>Voice</span>
          </div>

          <div className="flex-1 h-full flex items-center gap-1 relative overflow-hidden">
            {segments.map(seg => {
              const isSelected = seg.id === selectedSegmentId;
              const hasAudio = seg.status !== 'Needs Recording' && seg.status !== 'Draft';
              const dur = seg.actualDurationSec || seg.speakingDurationEstimateSec || 15;
              const flexWeight = Math.max(1, Math.round(dur));

              return (
                <div
                  key={`track-voice-${seg.id}`}
                  onClick={() => onSelectSegment(seg.id)}
                  style={{ flex: flexWeight }}
                  className={`h-full rounded px-2 flex items-center justify-between text-[10px] font-mono truncate cursor-pointer transition-all ${
                    hasAudio
                      ? isSelected
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400 font-bold'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-dashed border-rose-500/30'
                  }`}
                >
                  <span className="truncate">{hasAudio ? seg.status : 'Missing Voice'}</span>
                  <span className="text-[9px] opacity-70">{dur}s</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 3: SUBTITLES TRACK */}
        <div className="flex items-center gap-2 h-6 bg-background/50 rounded-lg p-1 border border-border/40">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground font-mono">
            <Subtitles className="w-3 h-3 text-sky-400" />
            <span>Subtitles</span>
          </div>

          <div className="flex-1 h-full flex items-center gap-1 relative overflow-hidden">
            {segments.map(seg => {
              const dur = seg.actualDurationSec || seg.speakingDurationEstimateSec || 15;
              const flexWeight = Math.max(1, Math.round(dur));

              return (
                <div
                  key={`track-sub-${seg.id}`}
                  style={{ flex: flexWeight }}
                  className="h-full rounded bg-sky-500/10 border border-sky-500/20 px-1 flex items-center justify-center text-[9px] font-mono text-sky-300 truncate"
                >
                  {(seg.subtitles || []).length} cues
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimecode(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}
