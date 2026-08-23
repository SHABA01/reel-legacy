/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Film,
  TrendingUp,
  Calendar,
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle,
  BookOpen,
  CornerDownRight,
  Clock,
  Plus,
  Wand2,
  X,
  Loader2,
  Search,
  ListFilter,
  Layers,
  Star,
  MapPin,
  ArrowUp,
  ArrowDown,
  Edit2,
  Copy,
  RotateCcw,
  Archive,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { EmptyState } from '../../ui/EmptyState';
import { ExtendedStory } from '../mockStoriesData';
import { StoryCharacter, CharactersWorkspace } from '../CharactersWorkspace';
import { StoryScene } from '../ScenesWorkspace';
import { ScriptStudio } from '../scripts/ScriptStudio';

export interface LocalTimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category?: 'Milestone' | 'Birth' | 'Childhood' | 'Education' | 'Graduation' | 'Employment' | 'Promotion' | 'Marriage' | 'Family' | 'Achievement' | 'Award' | 'Travel' | 'Relocation' | 'Retirement' | 'Custom Event';
  importance?: 'High' | 'Medium' | 'Low';
  location?: string;
  associatedMediaIds?: string[];
  associatedPeopleIds?: string[];
  status?: 'Active' | 'Draft' | 'Archived';
}

export interface StoryCastModeProps {
  initialStory: ExtendedStory;
  storyMeta: {
    title: string;
    subtitle: string;
    description: string;
    language: string;
    visibility: string;
    internalNotes: string;
  };
  onMetaChange: (field: string, value: string) => void;
  activeSection: string;
  onNavigateSection: (section: string) => void;
  progressPercentage: number;
  isAIReady: boolean;
  
  // Biography
  biographyText: string;
  onBiographyChange: (text: string) => void;
  biographySummary: string;
  onBiographySummaryChange: (summary: string) => void;
  keyFacts: string[];
  factInput: string;
  onFactInputChange: (val: string) => void;
  onAddFact: () => void;
  onDeleteFact: (idx: number) => void;

  // Timeline
  timelineEvents: LocalTimelineEvent[];
  timelineStats: {
    total: number;
    milestones: number;
    yearsCovered: string;
    recentlyUpdated: any[];
    draft: number;
    archived: number;
  };
  timelineSearchQuery: string;
  onTimelineSearchChange: (query: string) => void;
  timelineCategoryFilter: string;
  onTimelineCategoryChange: (cat: string) => void;
  timelineStatusFilter: string;
  onTimelineStatusChange: (status: string) => void;
  timelineSortOrder: 'asc' | 'desc' | 'title' | 'importance';
  onTimelineSortChange: (sort: 'asc' | 'desc' | 'title' | 'importance') => void;
  timelineViewMode: 'chrono' | 'group-year' | 'group-decade' | 'milestones' | 'multitrack' | 'intelligence' | 'director';
  onTimelineViewModeChange: (mode: any) => void;
  eventsToRender: LocalTimelineEvent[];
  groupedByYear: { [year: string]: LocalTimelineEvent[] };
  groupedByDecade: { [decade: string]: LocalTimelineEvent[] };
  onOpenTimelineModal: (mode: 'create' | 'edit', evt?: LocalTimelineEvent) => void;
  onReorderTimelineEvent: (id: string, direction: 'up' | 'down') => void;
  onToggleMilestoneEvent: (id: string, currentMilestone: boolean) => void;
  onDuplicateTimelineEvent: (evt: LocalTimelineEvent) => void;
  onArchiveTimelineEvent: (id: string) => void;
  onRestoreTimelineEvent: (id: string) => void;
  onDeleteTimelineEvent: (id: string) => void;

  // Characters
  characters: StoryCharacter[];
  onUpdateCharacters: (chars: StoryCharacter[]) => void;

  // Scenes & Media references
  scenes: StoryScene[];
  mediaItems: any[];

  // Inspector & Selection
  selectedInspectorItem: {
    type: 'story' | 'scene' | 'timeline' | 'person' | 'media' | 'document' | 'narration' | 'music' | 'render';
    id: string;
    data: any;
  };
  onSelectInspectorItem: (item: {
    type: 'story' | 'scene' | 'timeline' | 'person' | 'media' | 'document' | 'narration' | 'music' | 'render';
    id: string;
    data: any;
  }) => void;

  // Global Toasts / State
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const StoryCastMode: React.FC<StoryCastModeProps> = ({
  initialStory,
  storyMeta,
  onMetaChange,
  activeSection,
  onNavigateSection,
  progressPercentage,
  isAIReady,
  biographyText,
  onBiographyChange,
  biographySummary,
  onBiographySummaryChange,
  keyFacts,
  factInput,
  onFactInputChange,
  onAddFact,
  onDeleteFact,
  timelineEvents,
  timelineStats,
  timelineSearchQuery,
  onTimelineSearchChange,
  timelineCategoryFilter,
  onTimelineCategoryChange,
  timelineStatusFilter,
  onTimelineStatusChange,
  timelineSortOrder,
  onTimelineSortChange,
  timelineViewMode,
  onTimelineViewModeChange,
  eventsToRender,
  groupedByYear,
  groupedByDecade,
  onOpenTimelineModal,
  onReorderTimelineEvent,
  onToggleMilestoneEvent,
  onDuplicateTimelineEvent,
  onArchiveTimelineEvent,
  onRestoreTimelineEvent,
  onDeleteTimelineEvent,
  characters,
  onUpdateCharacters,
  scenes,
  mediaItems,
  selectedInspectorItem,
  onSelectInspectorItem,
  showToast,
}) => {
  return (
    <>
      {/* 1. OVERVIEW SECTION */}
      {activeSection === 'overview' && (
        <motion.div
          key="workspace-overview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 md:p-8 space-y-6"
          id="pane-overview"
        >
          {/* Visual Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-cinema-amber-500 animate-pulse" /> Story Studio Overview
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unified dashboard detailing data coverage, catalog depth, and AI processing criteria.
              </p>
            </div>
          </div>

          {/* Dashboard stats grids */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="overview-progress-mesh">
            <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="p-3 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 shrink-0">
                <TrendingUp className="w-5 h-5 text-cinema-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Completion Score</span>
                <strong className="text-lg font-black text-foreground font-mono">{progressPercentage}%</strong>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-cinema-amber-500" style={{ width: `${progressPercentage}%` }} />
            </div>

            <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Milestones</span>
                <strong className="text-lg font-black text-foreground font-mono">{timelineEvents.length} Points</strong>
              </div>
            </div>

            <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                <Camera className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Organized Media</span>
                <strong className="text-lg font-black text-foreground font-mono">{mediaItems.length} Files</strong>
              </div>
            </div>

            <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">AI Readiness</span>
                <strong className={`text-xs font-black block mt-1 ${isAIReady ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isAIReady ? 'READY TO COMPILE' : 'NEEDS SETUP'}
                </strong>
              </div>
              {isAIReady && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-details-mesh">
            {/* Missing information alerts & action cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-cinema-amber-500" /> Verification Warnings & Suggestions
                </h4>
                
                <div className="space-y-2.5">
                  {biographyText.length < 300 ? (
                    <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold text-foreground">Biography draft too short:</strong>
                        <p className="text-muted-foreground mt-0.5">Please add more comprehensive historical details to enrich AI script accuracy.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold text-foreground">Biography is fully detailed:</strong>
                        <p className="text-muted-foreground mt-0.5">Meets standard production threshold (200+ words). Fully parsed.</p>
                      </div>
                    </div>
                  )}

                  {timelineEvents.length < 5 ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold text-foreground">Low Timeline density:</strong>
                        <p className="text-muted-foreground mt-0.5">We recommend logging at least 5 life milestones to avoid narrative chronological gaps.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold text-foreground">Timeline milestones verified:</strong>
                        <p className="text-muted-foreground mt-0.5">Excellent chronological layout covering major life stages.</p>
                      </div>
                    </div>
                  )}

                  {mediaItems.length < 5 ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold text-foreground">Media coverage low:</strong>
                        <p className="text-muted-foreground mt-0.5">To compile a compelling 8-minute documentary, add portraits, home scans, or certificates.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold text-foreground">Media catalog initialized:</strong>
                        <p className="text-muted-foreground mt-0.5">{mediaItems.length} scanned records are linked to narrator chapters.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Action blocks */}
              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-foreground tracking-wider">
                  Quick Launch Studio Steps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => onNavigateSection('biography')}
                    className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/60 text-left transition-colors cursor-pointer group"
                  >
                    <BookOpen className="w-4 h-4 text-cinema-amber-500 group-hover:scale-110 transition-transform" />
                    <h5 className="text-xs font-bold text-foreground mt-2">Edit Biography</h5>
                    <p className="text-[10px] text-muted-foreground mt-1">Refine life retrospective text</p>
                  </button>

                  <button
                    onClick={() => onOpenTimelineModal('create')}
                    className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/60 text-left transition-colors cursor-pointer group"
                  >
                    <Calendar className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <h5 className="text-xs font-bold text-foreground mt-2">Add Milestone</h5>
                    <p className="text-[10px] text-muted-foreground mt-1">Register timeline event card</p>
                  </button>

                  <button
                    onClick={() => onNavigateSection('people')}
                    className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/60 text-left transition-colors cursor-pointer group"
                  >
                    <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <h5 className="text-xs font-bold text-foreground mt-2">Manage Cast</h5>
                    <p className="text-[10px] text-muted-foreground mt-1">Characters & family members</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activity & Logs */}
            <div className="space-y-6">
              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center justify-between">
                  <span>Recent Activity Log</span>
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                </h4>

                <div className="space-y-3 text-xs" id="activity-log-timeline">
                  {[
                    { text: 'Chronology & milestone catalog refreshed', time: 'Just now' },
                    { text: 'Auto-save buffer synchronized with local storage', time: '10 mins ago' },
                    { text: 'Biographical manuscript checkpoint saved', time: '1 hour ago' },
                    { text: 'Cast & characters relationship ledger updated', time: 'Yesterday' }
                  ].map((act, idx) => (
                    <div key={idx} className="flex gap-2 pb-3 border-b border-border/40 last:border-none last:pb-0">
                      <CornerDownRight className="w-3.5 h-3.5 text-cinema-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-foreground/90 font-medium">{act.text}</p>
                        <span className="text-[9px] text-muted-foreground font-mono">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-foreground tracking-wider">
                  Digital Storytelling Tip
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  "Great memoirs balance formal career highlights with poetic, quiet daily memories. Consider linking scanned letters and diary pages directly to corresponding milestone markers."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. STORY INFORMATION SECTION */}
      {activeSection === 'info' && (
        <motion.div
          key="workspace-info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 md:p-8 space-y-6 w-full"
          id="pane-info"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cinema-amber-500" /> Story Information & Biography
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure story metadata, tone parameters, and edit full life manuscript narrative text.
              </p>
            </div>

            {/* Inner sub-tab switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl shrink-0">
              <button
                onClick={() => onNavigateSection('info')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30"
              >
                Administrative Metadata
              </button>
              <button
                onClick={() => onNavigateSection('biography')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
              >
                Biography Manuscript
              </button>
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Story Title</label>
              <Input
                id="meta-title"
                value={storyMeta.title}
                onChange={(e) => onMetaChange('title', e.target.value)}
                placeholder="Story Title"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Subtitle / Narrative Hook</label>
              <Input
                id="meta-subtitle"
                value={storyMeta.subtitle}
                onChange={(e) => onMetaChange('subtitle', e.target.value)}
                placeholder="Story Subtitle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Story Description Summary</label>
              <textarea
                id="meta-description"
                rows={4}
                value={storyMeta.description}
                onChange={(e) => onMetaChange('description', e.target.value)}
                className="w-full p-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-xl resize-none"
                placeholder="Provide a high-level summary..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="meta-language"
                label="Narrative Production Language"
                value={storyMeta.language}
                onChange={(val) => onMetaChange('language', val)}
                options={[
                  { value: 'English', label: 'English (US Standard)' },
                  { value: 'Spanish', label: 'Spanish (Español)' },
                  { value: 'French', label: 'French (Français)' }
                ]}
              />

              <Select
                id="meta-visibility"
                label="Visibility & Archiving"
                value={storyMeta.visibility}
                onChange={(val) => onMetaChange('visibility', val)}
                options={[
                  { value: 'Private', label: 'Strictly Private (Me Only)' },
                  { value: 'Family', label: 'Family Circle (Secured Invite)' },
                  { value: 'Public', label: 'Public Link (Unrestricted viewing)' }
                ]}
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-foreground block">Workspace Editorial Notes</label>
              <input
                id="meta-notes"
                type="text"
                value={storyMeta.internalNotes}
                onChange={(e) => onMetaChange('internalNotes', e.target.value)}
                className="w-full h-10 px-3.5 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-xl"
                placeholder="e.g. Needs review from Aunt Martha..."
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. BIOGRAPHY WORKSPACE SECTION */}
      {activeSection === 'biography' && (
        <motion.div
          key="workspace-biography"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 md:p-8 space-y-6"
          id="pane-biography"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cinema-amber-500" /> Full Life Biography Writing Workspace
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Craft the core biographical manuscript. Narrator voiceover AI is scaffolded directly from this content.
              </p>
            </div>

            {/* Inner sub-tab switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl shrink-0">
              <button
                onClick={() => onNavigateSection('info')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
              >
                Administrative Metadata
              </button>
              <button
                onClick={() => onNavigateSection('biography')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30"
              >
                Biography Manuscript
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Textarea Editor and Statistics */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-border bg-muted/40 flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cinema-amber-500" /> Biography Manuscript
                  </span>
                  
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Chars: {biographyText.length}</span>
                    <span>•</span>
                    <span>Words: {biographyText.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                </div>

                <textarea
                  id="biography-manuscript-editor"
                  rows={16}
                  value={biographyText}
                  onChange={(e) => onBiographyChange(e.target.value)}
                  className="w-full p-6 text-sm text-foreground bg-transparent border-none focus:outline-none leading-relaxed font-sans placeholder:text-muted-foreground/35 min-h-[300px]"
                  placeholder="Draft the life history narrative..."
                />
              </div>

              <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-cinema-amber-500 animate-spin" />
                  <span className="font-medium">Active drafting buffer enabled. Characters are auto-saved to browser local cache.</span>
                </div>
                <span className="font-mono font-bold text-[9px] uppercase bg-muted border border-border px-1.5 py-0.5 rounded">Active Revision</span>
              </div>
            </div>

            {/* Key facts, Summary & Version details */}
            <div className="space-y-6">
              {/* Life Summary Card */}
              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-foreground tracking-wider block">
                  Vocal Narrative Overview
                </h4>
                <input
                  id="bio-short-summary-field"
                  type="text"
                  value={biographySummary}
                  onChange={(e) => onBiographySummaryChange(e.target.value)}
                  className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-lg"
                  placeholder="Add one-liner overview..."
                />
                <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                  This brief summary hooks the introductory scene narration for cinematic titles.
                </p>
              </div>

              {/* Key Facts Tracker */}
              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase text-foreground tracking-wider block">
                  Verified Timeline Facts
                </h4>

                <div className="space-y-2 max-h-[22vh] overflow-y-auto pr-1">
                  {keyFacts.map((fact, idx) => (
                    <div key={idx} className="p-2.5 bg-muted/30 border border-border/60 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground truncate max-w-[180px]" title={fact}>{fact}</span>
                      <button
                        onClick={() => onDeleteFact(idx)}
                        className="text-red-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Fact"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5 pt-1">
                  <input
                    id="fact-input-field"
                    type="text"
                    value={factInput}
                    onChange={(e) => onFactInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onAddFact()}
                    placeholder="Add life milestone fact..."
                    className="flex-grow h-9 px-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-lg placeholder:text-muted-foreground/50"
                  />
                  <Button
                    id="btn-add-fact"
                    variant="ghost"
                    size="xs"
                    onClick={onAddFact}
                    className="h-9 w-9 p-0 flex items-center justify-center border border-border hover:bg-muted shrink-0"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </Button>
                </div>
              </div>

              {/* AI Suggestion Panel */}
              <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider">AI Copilot Blueprint</h4>
                </div>
                <p className="text-[11px] text-indigo-300/80 leading-relaxed font-semibold">
                  Ready to synthesize chapters. In the next stage, this module will scan your text to suggest transitions, narration cues, and highlight archival letters.
                </p>
                <div className="absolute -right-6 -bottom-6 text-indigo-500/10 opacity-30">
                  <Wand2 className="w-20 h-20" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. AI SCRIPT PREP & NARRATIVE BLUEPRINT */}
      {activeSection === 'scripts' && (
        <motion.div
          key="workspace-scripts"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 md:p-8 space-y-6 w-full"
          id="pane-scripts"
        >
          <ScriptStudio
            story={initialStory}
            scenes={scenes}
            characters={characters}
            timelineEvents={timelineEvents}
            mediaItems={mediaItems}
            onOpenScene={(sceneId) => {
              onNavigateSection('scenes');
            }}
            onUpdateScript={(blocks) => {
              // Trigger autosave via parent notification
            }}
          />
        </motion.div>
      )}

      {/* 5. TIMELINE CHRONOLOGY WORKSPACE */}
      {activeSection === 'timeline' && (
        <motion.div
          key="workspace-timeline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 md:p-8 space-y-6"
          id="pane-timeline"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                Life Timeline Chronology Ledger
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify and arrange the sequential milestones of the legacy story. Click any card to load metadata into the inspector.
              </p>
            </div>

            <Button
              id="btn-add-timeline-event-trigger"
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
              onClick={() => onOpenTimelineModal('create')}
              className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold self-start sm:self-auto"
            >
              Add Milestone Event
            </Button>
          </div>

          {/* Timeline density, search, filters toolbar */}
          <div className="p-5 bg-card border border-border rounded-2xl space-y-4" id="timeline-toolbar">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-mono font-bold bg-muted text-muted-foreground uppercase px-2 py-0.5 rounded border border-border">
                  {timelineEvents.length} Total Events
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Decade Span: {timelineStats.yearsCovered}</span>
              </div>

              {/* View Modes Selector tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl">
                {[
                  { id: 'chrono', label: 'Chronological', icon: Calendar },
                  { id: 'group-year', label: 'By Year', icon: ListFilter },
                  { id: 'group-decade', label: 'By Decade', icon: Layers },
                ].map(mode => {
                  const ModeIcon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => onTimelineViewModeChange(mode.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        timelineViewMode === mode.id
                          ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500 shadow-sm font-black'
                          : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <ModeIcon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search, Filter, Sort Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/50" />
                <input
                  type="text"
                  value={timelineSearchQuery}
                  onChange={(e) => onTimelineSearchChange(e.target.value)}
                  placeholder="Search title, description..."
                  className="w-full h-9 pl-9 pr-3 bg-muted/50 border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-lg placeholder:text-muted-foreground/50"
                />
              </div>

              <Select
                id="timeline-category-filter"
                value={timelineCategoryFilter}
                onChange={onTimelineCategoryChange}
                options={[
                  { value: 'All', label: 'All Categories' },
                  { value: 'Birth', label: 'Birth' },
                  { value: 'Childhood', label: 'Childhood' },
                  { value: 'Education', label: 'Education' },
                  { value: 'Graduation', label: 'Graduation' },
                  { value: 'Employment', label: 'Employment' },
                  { value: 'Promotion', label: 'Promotion' },
                  { value: 'Marriage', label: 'Marriage' },
                  { value: 'Family', label: 'Family' },
                  { value: 'Achievement', label: 'Achievement' },
                  { value: 'Award', label: 'Award' },
                  { value: 'Travel', label: 'Travel' },
                  { value: 'Relocation', label: 'Relocation' },
                  { value: 'Milestone', label: 'Milestone' },
                  { value: 'Retirement', label: 'Retirement' },
                  { value: 'Custom Event', label: 'Custom Event' }
                ]}
              />

              <Select
                id="timeline-status-filter"
                value={timelineStatusFilter}
                onChange={onTimelineStatusChange}
                options={[
                  { value: 'Active', label: 'Active Events' },
                  { value: 'Draft', label: 'Drafts Only' },
                  { value: 'Archived', label: 'Archived Only' }
                ]}
              />

              <Select
                id="timeline-sort-order"
                value={timelineSortOrder}
                onChange={(val) => onTimelineSortChange(val as any)}
                options={[
                  { value: 'asc', label: 'Sort: Oldest First' },
                  { value: 'desc', label: 'Sort: Newest First' },
                  { value: 'title', label: 'Sort: Alphabetical' },
                  { value: 'importance', label: 'Sort: High Priority First' }
                ]}
              />
            </div>
          </div>

          {/* Timeline empty state check */}
          {eventsToRender.length === 0 ? (
            <EmptyState
              id="timeline-empty-state"
              title="No Timeline Events for this Story Project"
              description="Begin documenting this Story Project by adding key life milestones, dates, and historical events. Your project's timeline helps structure the narrative for scripting, narration, and video production."
              primaryActionLabel="Add First Milestone Event"
              onPrimaryAction={() => onOpenTimelineModal('create')}
              secondaryActionLabel="Learn About Timelines"
              onSecondaryAction={() => showToast('info', 'Guided Entry Help', 'Timelines structure chronological highlights such as Birth, Education, Marriage or Community Service to create a cohesive narrative.')}
            />
          ) : (
            <div>
              {/* Render standard chronological list */}
              {(timelineViewMode === 'chrono' || timelineViewMode === 'milestones' || timelineViewMode === 'multitrack' || timelineViewMode === 'intelligence' || timelineViewMode === 'director') && (
                <div className="relative border-l-2 border-border pl-6 ml-4 space-y-8" id="timeline-flow-list">
                  {eventsToRender.map((evt) => {
                    const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                    const isArchived = evt.status === 'Archived';
                    const isMilestone = evt.category === 'Milestone' || evt.importance === 'High' || evt.status === 'Milestone';
                    return (
                      <div
                        key={evt.id}
                        id={`timeline-node-${evt.id}`}
                        onClick={() => onSelectInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                        className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                            : isArchived
                              ? 'border-border/60 opacity-60 bg-muted/20'
                              : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                          isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                        }`} />

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-grow">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-black font-mono text-cinema-amber-600 dark:text-cinema-amber-400">
                                {evt.year}
                              </span>
                              <span className="text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                                {evt.category}
                              </span>
                              <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                                evt.importance === 'High' 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                  : 'bg-muted text-muted-foreground border border-border/80'
                              }`}>
                                {evt.importance} Priority
                              </span>
                              {isArchived && (
                                <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">
                                  Archived
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                              {evt.title}
                              {isMilestone && <Star className="w-3.5 h-3.5 text-cinema-amber-500 fill-cinema-amber-500" />}
                            </h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                            
                            {evt.location && (
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span>{evt.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); onReorderTimelineEvent(evt.id, 'up'); }}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onReorderTimelineEvent(evt.id, 'down'); }}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onToggleMilestoneEvent(evt.id, isMilestone); }}
                              className={`p-1 rounded cursor-pointer ${isMilestone ? 'text-cinema-amber-500 hover:text-cinema-amber-600' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                              title={isMilestone ? 'Unmark Milestone' : 'Mark Milestone'}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onOpenTimelineModal('edit', evt); }}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                              title="Edit event"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDuplicateTimelineEvent(evt); }}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); isArchived ? onRestoreTimelineEvent(evt.id) : onArchiveTimelineEvent(evt.id); }}
                              className={`p-1 rounded cursor-pointer ${isArchived ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                              title={isArchived ? 'Restore' : 'Archive'}
                            >
                              {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteTimelineEvent(evt.id); }}
                              className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                              title="Delete event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Render grouped by Year list */}
              {timelineViewMode === 'group-year' && (
                <div className="space-y-8" id="timeline-flow-list-year">
                  {Object.keys(groupedByYear).sort((a,b) => {
                    const numA = parseInt(a) || 0;
                    const numB = parseInt(b) || 0;
                    return timelineSortOrder === 'desc' ? numB - numA : numA - numB;
                  }).map(year => (
                    <div key={year} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-3 py-1 rounded-lg border border-cinema-amber-500/25">
                          Year {year}
                        </span>
                        <div className="h-px bg-border flex-grow" />
                      </div>
                      <div className="relative border-l-2 border-border pl-6 ml-4 space-y-6">
                        {groupedByYear[year].map(evt => {
                          const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                          const isArchived = evt.status === 'Archived';
                          const isMilestone = evt.category === 'Milestone' || evt.importance === 'High' || evt.status === 'Milestone';
                          return (
                            <div
                              key={evt.id}
                              onClick={() => onSelectInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                              className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                                isSelected 
                                  ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                                  : isArchived
                                    ? 'border-border/60 opacity-60 bg-muted/20'
                                    : 'border-border hover:border-muted-foreground/30'
                              }`}
                            >
                              <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                                isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                              }`} />
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-grow">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                                      {evt.category}
                                    </span>
                                    <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                                      evt.importance === 'High' 
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                        : 'bg-muted text-muted-foreground border border-border/80'
                                    }`}>
                                      {evt.importance} Priority
                                    </span>
                                    {isArchived && (
                                      <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">
                                        Archived
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                    {evt.title}
                                    {isMilestone && <Star className="w-3.5 h-3.5 text-cinema-amber-500 fill-cinema-amber-500" />}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                                  {evt.location && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                      <MapPin className="w-3 h-3 text-muted-foreground" />
                                      <span>{evt.location}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onReorderTimelineEvent(evt.id, 'up'); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onReorderTimelineEvent(evt.id, 'down'); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onToggleMilestoneEvent(evt.id, isMilestone); }}
                                    className={`p-1 rounded cursor-pointer ${isMilestone ? 'text-cinema-amber-500 hover:text-cinema-amber-600' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                    title={isMilestone ? 'Unmark Milestone' : 'Mark Milestone'}
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onOpenTimelineModal('edit', evt); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Edit event"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDuplicateTimelineEvent(evt); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); isArchived ? onRestoreTimelineEvent(evt.id) : onArchiveTimelineEvent(evt.id); }}
                                    className={`p-1 rounded cursor-pointer ${isArchived ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                    title={isArchived ? 'Restore' : 'Archive'}
                                  >
                                    {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteTimelineEvent(evt.id); }}
                                    className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                                    title="Delete event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Render grouped by Decade list */}
              {timelineViewMode === 'group-decade' && (
                <div className="space-y-8" id="timeline-flow-list-decade">
                  {Object.keys(groupedByDecade).sort((a,b) => {
                    const numA = parseInt(a) || 0;
                    const numB = parseInt(b) || 0;
                    return timelineSortOrder === 'desc' ? numB - numA : numA - numB;
                  }).map(decade => (
                    <div key={decade} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black uppercase tracking-wider font-mono text-cinema-amber-400 bg-muted border border-border px-3 py-1 rounded-lg">
                          The {decade} Decade
                        </span>
                        <div className="h-px bg-border flex-grow" />
                      </div>
                      <div className="relative border-l-2 border-border pl-6 ml-4 space-y-6">
                        {groupedByDecade[decade].map(evt => {
                          const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                          const isArchived = evt.status === 'Archived';
                          const isMilestone = evt.category === 'Milestone' || evt.importance === 'High' || evt.status === 'Milestone';
                          return (
                            <div
                              key={evt.id}
                              onClick={() => onSelectInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                              className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                                isSelected 
                                  ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                                  : isArchived
                                    ? 'border-border/60 opacity-60 bg-muted/20'
                                    : 'border-border hover:border-muted-foreground/30'
                              }`}
                            >
                              <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                                isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                              }`} />
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-grow">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-black font-mono text-cinema-amber-600 dark:text-cinema-amber-400">
                                      {evt.year}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                                      {evt.category}
                                    </span>
                                    <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                                      evt.importance === 'High' 
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                        : 'bg-muted text-muted-foreground border border-border/80'
                                    }`}>
                                      {evt.importance} Priority
                                    </span>
                                    {isArchived && (
                                      <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">
                                        Archived
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                    {evt.title}
                                    {isMilestone && <Star className="w-3.5 h-3.5 text-cinema-amber-500 fill-cinema-amber-500" />}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                                  {evt.location && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                      <MapPin className="w-3 h-3 text-muted-foreground" />
                                      <span>{evt.location}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onReorderTimelineEvent(evt.id, 'up'); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onReorderTimelineEvent(evt.id, 'down'); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onToggleMilestoneEvent(evt.id, isMilestone); }}
                                    className={`p-1 rounded cursor-pointer ${isMilestone ? 'text-cinema-amber-500 hover:text-cinema-amber-600' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                    title={isMilestone ? 'Unmark Milestone' : 'Mark Milestone'}
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onOpenTimelineModal('edit', evt); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Edit event"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDuplicateTimelineEvent(evt); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); isArchived ? onRestoreTimelineEvent(evt.id) : onArchiveTimelineEvent(evt.id); }}
                                    className={`p-1 rounded cursor-pointer ${isArchived ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                    title={isArchived ? 'Restore' : 'Archive'}
                                  >
                                    {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteTimelineEvent(evt.id); }}
                                    className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                                    title="Delete event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* 6. CHARACTERS & CAST WORKSPACE */}
      {(activeSection === 'characters' || activeSection === 'people') && (
        <motion.div
          key="workspace-characters"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
          id="pane-characters"
        >
          <CharactersWorkspace
            storyId={initialStory.id}
            storyTitle={storyMeta.title || initialStory.title}
            characters={characters}
            onUpdateCharacters={onUpdateCharacters}
            timelineEvents={timelineEvents}
            mediaItems={mediaItems}
            selectedCharacterId={selectedInspectorItem.type === 'person' ? selectedInspectorItem.id : undefined}
            onSelectCharacter={(char) => {
              onSelectInspectorItem({
                type: 'person',
                id: char.id,
                data: char,
              });
            }}
            showToast={showToast}
          />
        </motion.div>
      )}
    </>
  );
};
