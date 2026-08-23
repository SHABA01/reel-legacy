/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Film,
  Download,
  Share2,
  Sliders,
  Sparkles,
  Layers,
  MonitorPlay,
  Video,
} from 'lucide-react';
import { PreviewWorkspace } from '../PreviewWorkspace';
import { RenderWorkspace } from '../RenderWorkspace';
import { ExtendedStory } from '../mockStoriesData';
import { StoryCharacter } from '../CharactersWorkspace';
import { StoryScene } from '../ScenesWorkspace';
import { LocalMediaItem } from './ScenesMediaMode';
import { LocalTimelineEvent } from './StoryCastMode';

export interface PreviewExportModeProps {
  initialStory: ExtendedStory;
  storyMeta: {
    title: string;
    subtitle: string;
    description: string;
    language: string;
    visibility: string;
    internalNotes: string;
    soundtrack?: {
      presetId?: string;
      title?: string;
      genre?: string;
      mood?: string;
      volume?: number;
      audioUrl?: string;
    };
  };
  activeSection: string;
  onNavigateSection: (section: string) => void;

  // Shared Domain State
  scenes: StoryScene[];
  characters: StoryCharacter[];
  timelineEvents: LocalTimelineEvent[];
  mediaItems: LocalMediaItem[];

  // Toast / notifications
  showToast: (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    description?: string
  ) => void;
}

export function PreviewExportMode({
  initialStory,
  storyMeta,
  activeSection,
  onNavigateSection,
  scenes,
  characters,
  timelineEvents,
  mediaItems,
  showToast,
}: PreviewExportModeProps) {
  return (
    <div className="w-full flex flex-col space-y-6" id="preview-export-mode-container">
      {/* MODE HEADER & SUB-NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <MonitorPlay className="w-4 h-4 text-cinema-amber-500" /> Preview & Production Studio
            </h3>
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20">
              MODE 4 OF 4
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test real-time reel playback, inspect multi-track timing cues, and compile high-definition master cinema renders.
          </p>
        </div>

        {/* Sub-tab switcher: Interactive Preview vs Production & Render */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl shrink-0">
          <button
            onClick={() => onNavigateSection('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'preview'
                ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Interactive Preview
          </button>
          <button
            onClick={() => onNavigateSection('render')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              ['render', 'production', 'templates', 'history', 'review'].includes(activeSection)
                ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Export & Master Render
          </button>
        </div>
      </div>

      {/* 1. INTERACTIVE PREVIEW SUB-VIEW */}
      {activeSection === 'preview' && (
        <motion.div
          key="section-preview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
          id="pane-preview-mode"
        >
          <PreviewWorkspace
            storyId={initialStory.id}
            storyTitle={storyMeta.title || initialStory.title}
            scenes={scenes}
            characters={characters}
            timelineEvents={timelineEvents}
            mediaItems={mediaItems}
            onNavigateToTab={(tabId) => onNavigateSection(tabId)}
            showToast={showToast}
          />
        </motion.div>
      )}

      {/* 2. PRODUCTION & MASTER RENDER SUB-VIEW */}
      {['render', 'production', 'templates', 'history', 'review'].includes(activeSection) && (
        <motion.div
          key="section-render"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
          id="pane-render-mode"
        >
          <RenderWorkspace
            storyId={initialStory.id}
            storyTitle={storyMeta.title || initialStory.title}
            scenes={scenes}
            characters={characters}
            timelineEvents={timelineEvents}
            mediaItems={mediaItems}
            onNavigateToQueue={() => {
              showToast('info', 'Render Queue', 'Opening global production render queue...');
            }}
            showToast={showToast}
          />
        </motion.div>
      )}
    </div>
  );
}
