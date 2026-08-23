/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Film, Mic, Play, Check } from 'lucide-react';

export type StoryStudioMode = 'story_cast' | 'scenes_media' | 'audio_music' | 'preview_export';

export interface StoryStudioModeItem {
  id: StoryStudioMode;
  stepNumber: number;
  label: string;
  shortLabel: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STORY_STUDIO_MODES: StoryStudioModeItem[] = [
  {
    id: 'story_cast',
    stepNumber: 1,
    label: 'Story & Cast',
    shortLabel: 'Story & Cast',
    tagline: 'Synopsis, biography, milestones & script blueprint',
    icon: BookOpen,
  },
  {
    id: 'scenes_media',
    stepNumber: 2,
    label: 'Scenes & Media',
    shortLabel: 'Scenes & Media',
    tagline: 'Storyboard sequence, visual assets & source ledger',
    icon: Film,
  },
  {
    id: 'audio_music',
    stepNumber: 3,
    label: 'Audio & Music',
    shortLabel: 'Audio & Music',
    tagline: 'Scene voiceover narration & mood soundtrack',
    icon: Mic,
  },
  {
    id: 'preview_export',
    stepNumber: 4,
    label: 'Preview & Export',
    shortLabel: 'Preview & Export',
    tagline: 'Interactive reel player & video render packaging',
    icon: Play,
  },
];

export function mapSectionToMode(section: string | null | undefined): StoryStudioMode {
  if (!section) return 'story_cast';
  switch (section) {
    case 'overview':
    case 'story':
    case 'info':
    case 'biography':
    case 'timeline':
    case 'scripts':
    case 'script':
    case 'characters':
    case 'people':
      return 'story_cast';
    case 'assets':
    case 'media':
    case 'documents':
    case 'scenes':
      return 'scenes_media';
    case 'narration':
    case 'music':
      return 'audio_music';
    case 'preview':
    case 'render':
    case 'production':
      return 'preview_export';
    case 'story_cast':
    case 'scenes_media':
    case 'audio_music':
    case 'preview_export':
      return section as StoryStudioMode;
    default:
      return 'story_cast';
  }
}

export interface StoryStudioModeNavProps {
  activeMode: StoryStudioMode;
  onModeChange: (mode: StoryStudioMode) => void;
  className?: string;
}

export function StoryStudioModeNav({
  activeMode,
  onModeChange,
  className = '',
}: StoryStudioModeNavProps) {
  const activeIndex = STORY_STUDIO_MODES.findIndex((m) => m.id === activeMode);

  return (
    <nav
      id="story-studio-mode-nav"
      aria-label="Story Studio Modes"
      className={`bg-card/95 backdrop-blur-md border-b border-border px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar shrink-0 z-10 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-max">
        {STORY_STUDIO_MODES.map((mode, idx) => {
          const isActive = activeMode === mode.id;
          const isCompleted = idx < activeIndex;
          const IconComp = mode.icon;

          return (
            <button
              key={mode.id}
              id={`mode-nav-btn-${mode.id}`}
              onClick={() => onModeChange(mode.id)}
              className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                isActive
                  ? 'bg-cinema-amber-500/15 text-cinema-amber-600 dark:text-cinema-amber-400 border-cinema-amber-500/40 shadow-xs font-black'
                  : isCompleted
                  ? 'bg-muted/40 text-foreground border-border/80 hover:bg-muted/70'
                  : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
              }`}
              title={mode.tagline}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-black shrink-0 transition-colors ${
                  isActive
                    ? 'bg-cinema-amber-500 text-slate-950 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-muted text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : mode.stepNumber}
              </div>

              <div className="flex items-center gap-1.5 text-left">
                <IconComp
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? 'text-cinema-amber-500'
                      : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  }`}
                />
                <span className="uppercase tracking-wider font-display text-[11px] whitespace-nowrap">
                  {mode.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
