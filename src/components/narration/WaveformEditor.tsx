/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scissors,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Volume2,
  Play,
  Pause,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';
import { NarrationSegment, NarrationVersion } from '../../types/narration';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface WaveformEditorProps {
  segment: NarrationSegment | null;
  activeVersion: NarrationVersion | undefined;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
}

export function WaveformEditor({
  segment,
  activeVersion,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek
}: WaveformEditorProps) {
  const { showToast } = useToast();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);

  if (!segment) return null;

  const durationSec = segment.actualDurationSec || segment.speakingDurationEstimateSec || 15;
  const waveformAmplitudes = activeVersion?.waveformData || [0.2, 0.4, 0.7, 0.9, 0.8, 0.5, 0.3, 0.7, 0.85, 0.6, 0.3, 0.2, 0.5, 0.8, 0.4];

  const playheadPct = Math.min(100, Math.max(0, (currentTime / durationSec) * 100));

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = parseFloat((pct * durationSec).toFixed(1));
    onSeek(targetTime);
  };

  return (
    <div className="bg-card/40 border border-border/80 rounded-2xl p-4 space-y-3" id="narration-waveform-editor">
      {/* HEADER & WAVEFORM CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cinema-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
            Waveform Inspector & Subtitle Sync
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            ({activeVersion ? activeVersion.label : 'Take 1'})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
            icon={<ZoomOut className="w-3.5 h-3.5" />}
          />
          <span className="font-mono text-[10px] text-muted-foreground">{Math.round(zoomLevel * 100)}%</span>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setZoomLevel(Math.min(3.0, zoomLevel + 0.3))}
            icon={<ZoomIn className="w-3.5 h-3.5" />}
          />

          <div className="h-4 w-[1px] bg-border mx-1" />

          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`py-1 px-2 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              snapEnabled ? 'bg-cinema-amber-500/20 text-cinema-amber-400 border border-cinema-amber-500/40' : 'text-muted-foreground'
            }`}
          >
            SNAP {snapEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* WAVEFORM CANVAS / VISUAL DISPLAY */}
      <div
        onClick={handleWaveformClick}
        className="relative h-28 bg-black/90 rounded-xl border border-border/80 overflow-hidden cursor-pointer select-none group"
      >
        {/* TIMECODE GRID LINES */}
        <div className="absolute inset-0 flex justify-between px-2 text-[9px] font-mono text-cinema-slate-500 pointer-events-none z-10 pt-1">
          <span>00:00</span>
          <span>{Math.round(durationSec / 2)}s</span>
          <span>{Math.round(durationSec)}s</span>
        </div>

        {/* SUBTITLE TIMING OVERLAY REGIONS */}
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
          {(segment.subtitles || []).map((sub, idx) => {
            const startPct = (sub.startTime / durationSec) * 100;
            const endPct = (sub.endTime / durationSec) * 100;
            const widthPct = Math.max(2, endPct - startPct);

            return (
              <div
                key={sub.id}
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                className={`absolute top-6 bottom-2 rounded border border-cinema-amber-500/30 bg-cinema-amber-500/10 px-1 py-0.5 overflow-hidden transition-all ${
                  selectedSubIndex === idx ? 'border-cinema-amber-400 bg-cinema-amber-500/25 ring-1 ring-cinema-amber-400' : ''
                }`}
              >
                <span className="text-[9px] font-mono font-bold text-cinema-amber-300 truncate block">
                  {sub.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* AMPLITUDE BARS */}
        <div className="absolute inset-x-4 inset-y-6 flex items-center justify-between gap-1 pointer-events-none z-0">
          {waveformAmplitudes.map((amp, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cinema-amber-600 via-cinema-amber-400 to-cinema-amber-300 rounded-full transition-all duration-300 opacity-80 group-hover:opacity-100"
              style={{ height: `${amp * 85}%` }}
            />
          ))}
        </div>

        {/* RED PLAYHEAD BAR */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 shadow-[0_0_8px_rgba(244,63,94,0.9)] pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPct}%` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1 -mt-1 shadow-md" />
        </div>
      </div>

      {/* WAVEFORM FOOTER STATS */}
      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1">
        <span>Subtitles Cues: {(segment.subtitles || []).length}</span>
        <span>Quality Rating: {segment.audioQualityScore}/100</span>
        <span>Music Ducking: {segment.musicDuckingDb} dB</span>
      </div>
    </div>
  );
}
