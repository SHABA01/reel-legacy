/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Scissors,
  Layers,
  ZoomIn,
  ZoomOut,
  Wand2,
  Sparkles,
  Video,
  Mic,
  Music,
  MessageSquare,
  Image as ImageIcon,
  Sparkle,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Zap,
  Maximize2,
  Minimize2,
  Grid
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export interface TimelineClip {
  id: string;
  trackId: 'video' | 'narration' | 'music' | 'effects' | 'subtitles' | 'broll';
  title: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  color: string;
  waveform?: boolean;
}

export interface CapCutTimelineProps {
  storyTitle?: string;
  scenes?: any[];
  onTimeUpdate?: (currentTime: number) => void;
}

export function CapCutTimeline({ storyTitle, scenes = [], onTimeUpdate }: CapCutTimelineProps) {
  const { showToast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(12); // seconds
  const [totalDuration, setTotalDuration] = useState(120); // 2 minutes default
  const [zoomLevel, setZoomLevel] = useState(1.5); // 1x to 5x
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [rippleEditMode, setRippleEditMode] = useState(true);

  // Mute & Lock states per track
  const [trackStates, setTrackStates] = useState<
    Record<string, { muted: boolean; locked: boolean; hidden: boolean }>
  >({
    video: { muted: false, locked: false, hidden: false },
    narration: { muted: false, locked: false, hidden: false },
    music: { muted: false, locked: false, hidden: false },
    effects: { muted: false, locked: false, hidden: false },
    subtitles: { muted: false, locked: false, hidden: false },
    broll: { muted: false, locked: false, hidden: false },
  });

  // Initial Multi-Track Clips
  const [clips, setClips] = useState<TimelineClip[]>([
    {
      id: 'clip-v1',
      trackId: 'video',
      title: 'Scene 1: Childhood Shoreline (1944)',
      startTime: 0,
      duration: 30,
      color: 'bg-cinema-amber-500/80 border-cinema-amber-400',
    },
    {
      id: 'clip-v2',
      trackId: 'video',
      title: 'Scene 2: Mount Holyoke College (1965)',
      startTime: 30,
      duration: 45,
      color: 'bg-cinema-amber-600/80 border-cinema-amber-500',
    },
    {
      id: 'clip-v3',
      trackId: 'video',
      title: 'Scene 3: Salem Literacy Center (1974)',
      startTime: 75,
      duration: 45,
      color: 'bg-cinema-amber-500/80 border-cinema-amber-400',
    },
    {
      id: 'clip-n1',
      trackId: 'narration',
      title: 'VO: Early Life in Portland',
      startTime: 2,
      duration: 25,
      color: 'bg-purple-600/80 border-purple-400',
      waveform: true,
    },
    {
      id: 'clip-n2',
      trackId: 'narration',
      title: 'VO: Academic Journey & Calling',
      startTime: 32,
      duration: 40,
      color: 'bg-purple-600/80 border-purple-400',
      waveform: true,
    },
    {
      id: 'clip-m1',
      trackId: 'music',
      title: 'Acoustic Score: Heritage Winds (30% Vol)',
      startTime: 0,
      duration: 120,
      color: 'bg-indigo-600/70 border-indigo-400',
    },
    {
      id: 'clip-fx1',
      trackId: 'effects',
      title: 'Cross Dissolve (2s)',
      startTime: 28,
      duration: 4,
      color: 'bg-cyan-500/80 border-cyan-300',
    },
    {
      id: 'clip-sub1',
      trackId: 'subtitles',
      title: 'CC: "The salt air of Casco Bay..."',
      startTime: 2,
      duration: 10,
      color: 'bg-emerald-600/80 border-emerald-400',
    },
    {
      id: 'clip-br1',
      trackId: 'broll',
      title: 'B-Roll: Vintage 1940s Casco Bay Photo',
      startTime: 8,
      duration: 12,
      color: 'bg-amber-600/80 border-amber-400',
    },
  ]);

  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-v1');

  // Format time in MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle track mute/lock
  const toggleTrackMute = (trackId: string) => {
    setTrackStates((prev) => ({
      ...prev,
      [trackId]: { ...prev[trackId], muted: !prev[trackId]?.muted },
    }));
  };

  const toggleTrackLock = (trackId: string) => {
    setTrackStates((prev) => ({
      ...prev,
      [trackId]: { ...prev[trackId], locked: !prev[trackId]?.locked },
    }));
  };

  // AI Assistant One-Click Actions
  const handleAITimelineAction = (actionLabel: string, msg: string) => {
    showToast('success', `AI Timeline Assistant`, `${actionLabel}: ${msg}`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-4 shadow-xl select-none" id="capcut-timeline-root">
      {/* TOOLBAR & PLAYBACK CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-4">
        {/* Playback & Timecode */}
        <div className="flex items-center gap-3">
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold rounded-xl"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => setCurrentTime(0)}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <div className="font-mono font-black text-sm bg-background border border-border px-3 py-1 rounded-lg text-cinema-amber-400">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>
        </div>

        {/* AI TIMELINE ASSISTANT BAR */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-cinema-amber-400 bg-cinema-amber-500/10 px-2 py-1 rounded border border-cinema-amber-500/20 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> AI Timeline Tools:
          </span>

          {[
            { label: 'Auto-Align Narration', desc: 'Synchronized voice tracks with scene headers.' },
            { label: 'Auto-Trim Silence', desc: 'Removed 1.4s dead audio spaces.' },
            { label: 'Auto-Cut to Beat', desc: 'Aligned photo transitions to musical tempo.' },
            { label: 'Auto-Place B-Roll', desc: 'Placed 2 archival photos at narration cues.' },
            { label: 'Auto-Balance Audio', desc: 'Ducked background score during voiceover.' },
          ].map((tool, idx) => (
            <button
              key={idx}
              onClick={() => handleAITimelineAction(tool.label, tool.desc)}
              className="px-2.5 py-1 bg-background hover:bg-cinema-amber-500 hover:text-slate-950 text-foreground border border-border/80 hover:border-cinema-amber-500 text-[11px] font-bold rounded-lg transition-all"
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Zoom & Snap Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition-colors ${
              snapEnabled
                ? 'bg-cinema-amber-500/15 text-cinema-amber-400 border-cinema-amber-500/30'
                : 'text-muted-foreground border-border'
            }`}
          >
            SNAP: {snapEnabled ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-lg">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-foreground px-1">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3.0, z + 0.2))}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MULTI-TRACK STACK CONTAINER */}
      <div className="relative border border-border/80 rounded-xl overflow-hidden bg-background/80 flex flex-col min-h-[320px]">
        {/* TIMELINE RULER */}
        <div className="h-8 bg-muted/60 border-b border-border flex items-center pl-44 pr-4 relative overflow-hidden">
          {Array.from({ length: 13 }).map((_, i) => {
            const timeSec = i * 10;
            return (
              <div
                key={i}
                className="absolute text-[9px] font-mono text-muted-foreground border-l border-border/60 pl-1 h-full flex items-end pb-1"
                style={{ left: `${176 + i * 65 * zoomLevel}px` }}
              >
                {formatTime(timeSec)}
              </div>
            );
          })}
        </div>

        {/* PLAYHEAD LINE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cinema-amber-500 z-30 pointer-events-none transition-all duration-100"
          style={{ left: `${176 + (currentTime / totalDuration) * 700 * zoomLevel}px` }}
        >
          <div className="w-3 h-3 bg-cinema-amber-500 rounded-full -translate-x-1.25 -mt-1 shadow-md border border-slate-950" />
        </div>

        {/* TRACK DEFINITIONS */}
        {[
          { id: 'video', label: '📹 Video Track', icon: Video, color: 'text-cinema-amber-400' },
          { id: 'narration', label: '🎙️ Narration Track', icon: Mic, color: 'text-purple-400' },
          { id: 'music', label: '🎵 Music Track', icon: Music, color: 'text-indigo-400' },
          { id: 'effects', label: '✨ Transitions Track', icon: Sparkles, color: 'text-cyan-400' },
          { id: 'subtitles', label: '💬 Subtitles Track', icon: MessageSquare, color: 'text-emerald-400' },
          { id: 'broll', label: '🖼️ Archival B-Roll', icon: ImageIcon, color: 'text-amber-400' },
        ].map((tr) => {
          const trackClips = clips.filter((c) => c.trackId === tr.id);
          const trState = trackStates[tr.id] || { muted: false, locked: false, hidden: false };

          return (
            <div key={tr.id} className="flex border-b border-border/60 min-h-[48px] relative group hover:bg-muted/10">
              {/* TRACK HEADER SIDEBAR */}
              <div className="w-44 bg-card/90 border-r border-border p-2 flex items-center justify-between shrink-0 z-10">
                <span className="font-display text-[11px] font-bold text-foreground truncate">{tr.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleTrackMute(tr.id)}
                    className={`p-1 rounded hover:bg-muted transition-colors ${
                      trState.muted ? 'text-red-400' : 'text-muted-foreground'
                    }`}
                  >
                    {trState.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => toggleTrackLock(tr.id)}
                    className={`p-1 rounded hover:bg-muted transition-colors ${
                      trState.locked ? 'text-cinema-amber-400' : 'text-muted-foreground'
                    }`}
                  >
                    {trState.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* TRACK TIMELINE CANVAS */}
              <div className="flex-1 relative overflow-hidden py-1">
                {trackClips.map((clip) => {
                  const leftPos = (clip.startTime / totalDuration) * 700 * zoomLevel;
                  const widthPos = (clip.duration / totalDuration) * 700 * zoomLevel;
                  const isSelected = selectedClipId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`absolute top-1 bottom-1 rounded-lg border text-[10px] font-medium px-2 flex items-center justify-between truncate transition-all cursor-pointer shadow-sm ${
                        clip.color
                      } ${isSelected ? 'ring-2 ring-white border-white scale-[1.01] z-20' : 'hover:brightness-110'}`}
                      style={{ left: `${leftPos}px`, width: `${widthPos}px` }}
                    >
                      <span className="truncate text-white font-bold">{clip.title}</span>
                      <span className="text-[9px] font-mono text-white/80 shrink-0 ml-1">
                        {clip.duration}s
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
