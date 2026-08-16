/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Database,
  Sliders,
  MessageSquare,
  History,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Mic,
  Video,
  Activity,
  Cpu,
  Layers,
  FileText,
  Link2,
  Star,
  BookOpen,
  Play,
  Keyboard,
  Wand2,
  ChevronRight,
} from 'lucide-react';
import { InspectorSelection } from '../../context/InspectorContext';

export interface ContextInspectorProps {
  activeTab: string;
  route: string;
  selection: InspectorSelection;
  showToast: (type: any, message: string, detail?: string) => void;
  // Local state props
  kenBurns: boolean;
  setKenBurns: (val: boolean) => void;
  breathReduction: boolean;
  setBreathReduction: (val: boolean) => void;
  scoreDucking: boolean;
  setScoreDucking: (val: boolean) => void;
  colorizationEnabled: boolean;
  setColorizationEnabled: (val: boolean) => void;
  aiSuperRes: boolean;
  setAiSuperRes: (val: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (val: number) => void;
  voicePitch: number;
  setVoicePitch: (val: number) => void;
  commentInput: string;
  setCommentInput: (val: string) => void;
  commentsList: Array<{ user: string; text: string; time: string }>;
  handleAddComment: () => void;
  activities: any[];
}

export function ContextInspector({
  activeTab,
  route,
  selection,
  showToast,
  kenBurns,
  setKenBurns,
  breathReduction,
  setBreathReduction,
  scoreDucking,
  setScoreDucking,
  colorizationEnabled,
  setColorizationEnabled,
  aiSuperRes,
  setAiSuperRes,
  voiceSpeed,
  setVoiceSpeed,
  voicePitch,
  setVoicePitch,
  commentInput,
  setCommentInput,
  commentsList,
  handleAddComment,
  activities,
}: ContextInspectorProps) {
  return (
    <div id="right-panel-viewport" className="flex-1 overflow-y-auto scrollbar-ephemeral p-5 space-y-5">
      {/* TAB 1: AI DIRECTOR SUGGESTIONS */}
      {activeTab === 'ai-director' && (
        <div id="widget-ai-director" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cinema-amber-500" /> AI Director Analysis
          </h4>

          {selection.type === 'scene' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-cinema-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                  Pacing Recommendation
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  Scene duration is 12 seconds with 45 narration words. Reduce text by 10 words or add a Ken Burns zoom to fill frame visually.
                </p>
              </div>
              <div className="p-3.5 bg-card border border-cinema-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Acoustic Ducking
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  Duck background score volume by -6dB during the narrator's vocal accent in second sentence.
                </p>
              </div>
            </div>
          )}

          {selection.type === 'character' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Biographical Gap
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  No birthplace or military service branch recorded for this profile. Link source records from Media Library to enrich timeline.
                </p>
              </div>
            </div>
          )}

          {selection.type === 'profile' && selection.data && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Story Readiness • {selection.data.storyProgress || 0}%
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {(selection.data.storyProgress || 0) < 50
                    ? 'Biographical chronicle is in draft stage. Use AI Biography Assistant to expand early life narrative.'
                    : 'Rich profile coverage established. Ready for Story Studio narration export.'}
                </p>
              </div>
              <div className="p-3.5 bg-card border border-cinema-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                  Relationship Links
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {selection.data.relationship || 'Relative'} • Linked family members: {(selection.data.parents?.length || 0) + (selection.data.children?.length || 0) + (selection.data.spouse ? 1 : 0)}.
                </p>
              </div>
            </div>
          )}

          {selection.type === 'media' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-cyan-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Restoration Opportunity
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  Detecting black-and-white 1950s portrait. Enable AI Vintage Colorization to restore authentic skin tones for 4K rendering.
                </p>
              </div>
            </div>
          )}

          {selection.type === 'narration' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-purple-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Voice Tone Match
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  Narrator speaking speed is 138 WPM (Optimal). Breath reduction is active for zero audio clipping.
                </p>
              </div>
            </div>
          )}

          {selection.type === 'task' && selection.data && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Task Priority: {selection.data.priority || 'Medium'}
                </span>
                <h5 className="text-xs font-bold text-foreground">{selection.data.title || selection.data.label}</h5>
                <p className="text-xs text-muted-foreground leading-snug">
                  Status: {selection.data.dueStatus || 'Pending'} • Workspace Target: {selection.data.targetWorkspace || 'Studio'}
                </p>
              </div>
            </div>
          )}

          {selection.type === 'recommendation' && selection.data && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-purple-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Priority: {selection.data.priority || 'Medium'}
                </span>
                <h5 className="text-xs font-bold text-foreground">{selection.data.title}</h5>
                <p className="text-xs text-muted-foreground leading-snug">
                  {selection.data.reason}
                </p>
              </div>
            </div>
          )}

          {selection.type === 'story' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-cinema-amber-500/30 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                  Production Readiness
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  Story is {selection.data?.progress || 85}% complete. Ready for timeline review or voiceover synthesis in Narration Studio.
                </p>
              </div>
            </div>
          )}

          {selection.type === 'none' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-card border border-border rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Studio Intelligence
                </span>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  All background render nodes operational. Select any scene, character, media asset, or voice profile to inspect tailored AI suggestions.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROPERTIES & CONTROLS */}
      {activeTab === 'properties' && (
        <div id="widget-properties" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cinema-amber-500" /> Object Properties
          </h4>

          {selection.type === 'scene' && selection.data && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Scene Title</span>
                <input
                  type="text"
                  defaultValue={selection.data.title || 'Untitled Scene'}
                  className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                  <span className="font-semibold text-foreground">Ken Burns Auto Pan/Zoom</span>
                  <button
                    role="switch"
                    aria-checked={kenBurns}
                    onClick={() => setKenBurns(!kenBurns)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      kenBurns ? 'bg-cinema-amber-500' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        kenBurns ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                  <span className="font-semibold text-foreground">Breath Reduction</span>
                  <button
                    role="switch"
                    aria-checked={breathReduction}
                    onClick={() => setBreathReduction(!breathReduction)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      breathReduction ? 'bg-cinema-amber-500' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        breathReduction ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                  <span className="font-semibold text-foreground">Score Audio Ducking</span>
                  <button
                    role="switch"
                    aria-checked={scoreDucking}
                    onClick={() => setScoreDucking(!scoreDucking)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      scoreDucking ? 'bg-cinema-amber-500' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        scoreDucking ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {selection.type === 'character' && selection.data && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-muted/40 border border-border rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Story Role</span>
                <strong className="block text-foreground text-sm font-display font-bold">
                  {selection.data.storyRole || selection.data.relationship || 'Supporting Relative'}
                </strong>
              </div>

              {selection.data.shortBio && (
                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Bio Summary</span>
                  <p className="text-muted-foreground leading-relaxed">{selection.data.shortBio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                <div className="p-2.5 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">
                    {selection.data.timelineReferences?.length || 2}
                  </strong>
                  <span className="text-muted-foreground font-semibold">Milestones</span>
                </div>
                <div className="p-2.5 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">
                    {selection.data.mediaReferences?.length || 4}
                  </strong>
                  <span className="text-muted-foreground font-semibold">Media Files</span>
                </div>
              </div>
            </div>
          )}

          {selection.type === 'profile' && selection.data && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                {selection.data.profilePhoto && (
                  <img
                    src={selection.data.profilePhoto}
                    alt={selection.data.preferredName || selection.data.firstName}
                    className="w-12 h-12 rounded-full object-cover border border-cinema-amber-500/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h5 className="font-display font-bold text-foreground text-sm truncate">
                    {selection.data.preferredName || `${selection.data.firstName || ''} ${selection.data.lastName || ''}`}
                  </h5>
                  <p className="text-[10px] font-mono text-cinema-amber-500 font-bold uppercase truncate">
                    {selection.data.relationship || 'Legacy Ancestor'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Category:</span>
                  <strong className="text-foreground capitalize">{selection.data.category || 'Personal'}</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Status:</span>
                  <strong className="text-foreground uppercase">{selection.data.status || 'Draft'}</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Story Progress:</span>
                  <strong className="text-cinema-amber-500 font-bold">{selection.data.storyProgress || 0}%</strong>
                </div>
              </div>

              {selection.data.biographySummary && (
                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Biography Preview</span>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">{selection.data.biographySummary}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">{selection.data.timelineEventsCount || 0}</strong>
                  <span className="text-muted-foreground font-semibold">Events</span>
                </div>
                <div className="p-2 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">{selection.data.mediaCount || 0}</strong>
                  <span className="text-muted-foreground font-semibold">Media</span>
                </div>
                <div className="p-2 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">{selection.data.documentCount || 0}</strong>
                  <span className="text-muted-foreground font-semibold">Docs</span>
                </div>
              </div>
            </div>
          )}

          {selection.type === 'story' && selection.data && (
            <div className="space-y-4 text-xs">
              {selection.data.coverImage && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border bg-black relative shadow-inner">
                  <img
                    src={selection.data.coverImage}
                    alt={selection.data.title || 'Story cover'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 text-[9px] font-mono font-bold uppercase bg-black/70 text-cinema-amber-400 px-2 py-0.5 rounded border border-cinema-amber-500/30">
                    {selection.data.category || 'Story'}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted/40 border border-border rounded-xl">
                {selection.data.associatedProfilePhoto && (
                  <img
                    src={selection.data.associatedProfilePhoto}
                    alt={selection.data.associatedProfileName || 'Profile'}
                    className="w-10 h-10 rounded-full object-cover border border-cinema-amber-500/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h5 className="font-display font-bold text-foreground text-sm truncate">
                    {selection.data.title || 'Untitled Story'}
                  </h5>
                  <p className="text-[10px] text-muted-foreground font-semibold truncate">
                    {selection.data.subtitle || selection.data.associatedProfileName || 'Commemorative Story'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Category:</span>
                  <strong className="text-foreground capitalize">{selection.data.category || 'Biography'}</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Status:</span>
                  <strong className="text-cinema-amber-500 uppercase">{selection.data.status || 'Draft'}</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Completion:</span>
                  <strong className="text-emerald-500 font-bold">{selection.data.completionProgress || selection.data.progress || 0}%</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Est. Runtime:</span>
                  <strong className="text-foreground">{selection.data.durationEstimate || '10 mins'}</strong>
                </div>
              </div>

              {selection.data.description && (
                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Story Description</span>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">{selection.data.description}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">{selection.data.chapterCount || 0}</strong>
                  <span className="text-muted-foreground font-semibold">Chapters</span>
                </div>
                <div className="p-2 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">{selection.data.mediaCount || 0}</strong>
                  <span className="text-muted-foreground font-semibold">Media</span>
                </div>
                <div className="p-2 bg-muted/40 border border-border rounded-xl">
                  <strong className="block text-foreground text-xs font-mono">{selection.data.timelineEventCount || 0}</strong>
                  <span className="text-muted-foreground font-semibold">Events</span>
                </div>
              </div>
            </div>
          )}

          {selection.type === 'media' && selection.data && (
            <div className="space-y-4 text-xs">
              {selection.data.thumbnailUrl && (
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black relative shadow-inner">
                  <img
                    src={selection.data.thumbnailUrl}
                    alt={selection.data.displayName || 'Asset'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-2 font-mono">
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Type:</span>
                  <strong className="text-foreground">{selection.data.mediaType || 'Image Scan'}</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">Resolution:</span>
                  <strong className="text-foreground">{selection.data.dimensions || '2400 x 1800 px'}</strong>
                </div>
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted-foreground">File Size:</span>
                  <strong className="text-foreground">{selection.data.fileSize || '3.4 MB'}</strong>
                </div>
              </div>
            </div>
          )}

          {selection.type === 'none' && (
            <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3 text-xs">
              <span className="font-bold text-foreground block">Global Studio Controls</span>
              <p className="text-muted-foreground leading-relaxed">
                Select a scene, media file, voice profile, or story card to view and modify contextual properties.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESTORATION (FOR MEDIA) */}
      {activeTab === 'restoration' && (
        <div id="widget-restoration" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> AI Photo Restoration
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
              <div>
                <strong className="block text-foreground font-bold">Vintage Colorization</strong>
                <span className="text-[10px] text-muted-foreground">AI skin tone & clothing restoration</span>
              </div>
              <button
                role="switch"
                aria-checked={colorizationEnabled}
                onClick={() => {
                  setColorizationEnabled(!colorizationEnabled);
                  showToast('info', 'Colorization Model Toggled');
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  colorizationEnabled ? 'bg-cyan-500' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    colorizationEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
              <div>
                <strong className="block text-foreground font-bold">4X Super Resolution</strong>
                <span className="text-[10px] text-muted-foreground">Upscale scan to 4K archival clarity</span>
              </div>
              <button
                role="switch"
                aria-checked={aiSuperRes}
                onClick={() => {
                  setAiSuperRes(!aiSuperRes);
                  showToast('info', 'Super Resolution Toggled');
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  aiSuperRes ? 'bg-cyan-500' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    aiSuperRes ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => showToast('success', 'Restoration Render Enqueued', 'Processing AI image enhancement...')}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md mt-2"
            >
              <Wand2 className="w-4 h-4" /> Run AI Restoration Pipeline
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIO / VOICE TUNING */}
      {activeTab === 'audio' && (
        <div id="widget-audio-tuning" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-400" /> Voice Synthesis Parameters
          </h4>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Reading Speed:</span>
                <strong className="text-foreground">{voiceSpeed.toFixed(1)}x</strong>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Pitch Tuning:</span>
                <strong className="text-foreground">{voicePitch.toFixed(1)}x</strong>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => showToast('info', 'Synthesizing Audio Preview...')}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md mt-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Preview Vocal Output
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: RENDER SPECS */}
      {activeTab === 'render-job' && (
        <div id="widget-render-specs" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Video className="w-4 h-4 text-rose-400" /> 4K Render Pipeline Specs
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Output Quality:</span>
                <strong className="text-foreground">4K UHD (3840x2160)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Bitrate:</span>
                <strong className="text-foreground">18.5 Mbps H.265</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frame Rate:</span>
                <strong className="text-foreground">60 FPS Cinematic</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audio Track:</span>
                <strong className="text-foreground">AAC 320 kbps Stereo</strong>
              </div>
            </div>

            <button
              onClick={() => showToast('success', 'Export Job Initialized', 'Job sent to Cloud GPU node.')}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Play className="w-4 h-4 fill-white" /> Trigger 4K Video Render
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: METADATA & CITATIONS */}
      {activeTab === 'metadata' && (
        <div id="widget-metadata" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" /> Contextual Schema & Citations
          </h4>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex flex-col gap-1 p-2.5 bg-muted/30 border border-border rounded-xl">
              <span className="text-muted-foreground uppercase font-mono text-[9px]">Active Route</span>
              <span className="font-mono font-bold text-foreground uppercase">{route}</span>
            </div>

            <div className="flex flex-col gap-1 p-2.5 bg-muted/30 border border-border rounded-xl">
              <span className="text-muted-foreground uppercase font-mono text-[9px]">Focus Object</span>
              <span className="font-mono font-bold text-foreground uppercase">{selection.type}</span>
            </div>

            {selection.data?.id && (
              <div className="flex flex-col gap-1 p-2.5 bg-muted/30 border border-border rounded-xl">
                <span className="text-muted-foreground uppercase font-mono text-[9px]">Object ID</span>
                <span className="font-mono text-foreground truncate">{selection.data.id}</span>
              </div>
            )}

            <div className="flex flex-col gap-1 p-2.5 bg-muted/30 border border-border rounded-xl">
              <span className="text-muted-foreground uppercase font-mono text-[9px]">Source Citations</span>
              <span className="font-semibold text-foreground">14 Verified archives & documents</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWS & EDITORIAL COMMENTS */}
      {activeTab === 'comments' && (
        <div id="widget-comments" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cinema-amber-500" /> Editorial Thread
          </h4>

          <div className="space-y-3" id="comments-list">
            {commentsList.map((c, idx) => (
              <div key={idx} className="p-3 border border-border rounded-xl text-xs space-y-1 bg-card">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">{c.user}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{c.time}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add editorial review note..."
              className="flex-1 bg-muted border border-border text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-cinema-amber-500 text-foreground placeholder-muted-foreground"
            />
            <button
              onClick={handleAddComment}
              className="p-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <div id="widget-activity" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" /> Context Revision Activity
          </h4>

          {activities.length > 0 ? (
            <div className="relative border-l border-border pl-4 space-y-4 ml-1.5 pt-1">
              {activities.map((act, idx) => (
                <div key={act.id || idx} className="relative space-y-0.5 text-xs">
                  <span className="absolute -left-[21.5px] top-1 w-2 h-2 rounded-full bg-cinema-amber-500 border border-card" />
                  <h5 className="font-bold text-foreground">{act.title}</h5>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{act.desc || act.description}</p>
                  <span className="text-[9px] font-mono text-muted-foreground/60 block">{act.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No registered revisions yet.</p>
          )}
        </div>
      )}

      {/* TAB 9: READINESS / VALIDATION */}
      {activeTab === 'validation' && (
        <div id="widget-validation" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Production Readiness
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-card border border-border rounded-xl space-y-1">
              <div className="flex justify-between font-bold">
                <span>Overall Readiness</span>
                <span className="text-emerald-500 font-mono">88%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[88%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All chapter milestones linked to date timeline</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Master Legacy Profile associated</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>2 scenes pending final narration audio render</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div id="widget-telemetry" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> Studio Telemetry & Load
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Token Quota:</span>
                <strong className="text-emerald-400">92% Available</strong>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cloud Storage:</span>
                <strong className="text-cinema-amber-400">1.2 GB / 15.0 GB</strong>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-cinema-amber-500 w-[12%]" />
              </div>
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Render Engine:</span>
                <strong className="text-emerald-400">GPU Cluster Ready</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDIO ANALYTICS TAB: AI INSIGHTS */}
      {activeTab === 'ai-insights' && (
        <div id="widget-ai-insights" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cinema-amber-500" /> AI Trend Explanations
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-card border border-cinema-amber-500/30 rounded-xl space-y-2">
              <span className="text-[9px] font-mono font-bold uppercase text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                Production Velocity Surge
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                Story production increased 24% this week following the integration of automated voice alignment.
              </p>
            </div>
            <div className="p-3 bg-card border border-blue-500/30 rounded-xl space-y-2">
              <span className="text-[9px] font-mono font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Acoustic Optimization
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                Narration quality scores improved 18% after switching to the Evelyn voice profile.
              </p>
            </div>
            <div className="p-3 bg-card border border-amber-500/30 rounded-xl space-y-2">
              <span className="text-[9px] font-mono font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Archive Gap Alert
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                17 historical photo assets remain unassigned to chapter timelines in active stories.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STUDIO ANALYTICS TAB: METRIC DETAILS */}
      {activeTab === 'metric-details' && (
        <div id="widget-metric-details" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Selected Metric Breakdown
          </h4>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Calculation Methodology</span>
              <p className="text-foreground text-[11px] leading-relaxed font-sans">
                Readiness is calculated as a weighted average: Narration Coverage (40%) + Media Coverage (40%) + Scene Status (20%).
              </p>
            </div>
            <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Historical Benchmarks</span>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">30-Day Average:</span>
                <strong className="text-foreground">82.4%</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Previous Month:</span>
                <strong className="text-foreground">71.0%</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Delta Growth:</span>
                <strong className="text-emerald-400">+11.4%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDIO ANALYTICS TAB: SYSTEM STATUS */}
      {activeTab === 'system-status' && (
        <div id="widget-system-status" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> Infrastructure Telemetry
          </h4>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between">
              <span className="text-muted-foreground">Gemini AI Service:</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Operational</span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between">
              <span className="text-muted-foreground">Render Worker Nodes:</span>
              <span className="text-cinema-amber-400 font-bold bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">3 / 4 Active</span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between">
              <span className="text-muted-foreground">Local IndexedDB Vault:</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Healthy</span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between">
              <span className="text-muted-foreground">Sync Engine Queue:</span>
              <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">0 Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* STUDIO ANALYTICS TAB: ACTIVITY TIMELINE */}
      {activeTab === 'activity-timeline' && (
        <div id="widget-activity-timeline" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" /> Telemetry Event Log
          </h4>
          <div className="relative border-l border-border pl-4 space-y-3 ml-1.5 pt-1 text-xs">
            <div className="relative space-y-0.5">
              <span className="absolute -left-[21.5px] top-1 w-2 h-2 rounded-full bg-emerald-400 border border-card" />
              <h5 className="font-bold text-foreground">Completed 4K Render Export</h5>
              <p className="text-[11px] text-muted-foreground">"Grandpa World War II Memories" exported in 12m 40s.</p>
              <span className="text-[9px] font-mono text-muted-foreground/60 block">15m ago</span>
            </div>
            <div className="relative space-y-0.5">
              <span className="absolute -left-[21.5px] top-1 w-2 h-2 rounded-full bg-cinema-amber-500 border border-card" />
              <h5 className="font-bold text-foreground">Voice Synthesis Batch Completed</h5>
              <p className="text-[11px] text-muted-foreground">Generated 14 audio clips for Chapter 3.</p>
              <span className="text-[9px] font-mono text-muted-foreground/60 block">1h ago</span>
            </div>
            <div className="relative space-y-0.5">
              <span className="absolute -left-[21.5px] top-1 w-2 h-2 rounded-full bg-blue-400 border border-card" />
              <h5 className="font-bold text-foreground">Media Assets Uploaded</h5>
              <p className="text-[11px] text-muted-foreground">12 scanned archival photos ingested and indexed.</p>
              <span className="text-[9px] font-mono text-muted-foreground/60 block">3h ago</span>
            </div>
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB: SERVICE DETAILS */}
      {activeTab === 'service-details' && (
        <div id="widget-service-details" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-400" /> Provider Profile & Status
          </h4>
          <div className="space-y-3 text-xs">
            {selection.type === 'integration' && selection.data ? (
              <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">{selection.data.name}</span>
                  <span className="text-emerald-400 uppercase font-mono text-[10px]">{selection.data.status}</span>
                </div>
                <p className="text-muted-foreground text-[11px]">{selection.data.description}</p>
                <div className="pt-2 border-t border-border/40 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-foreground">{selection.data.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SDK Version:</span>
                    <span className="text-foreground">{selection.data.version || 'v2.0'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2 text-muted-foreground">
                <p>Select any connector from the Integration Hub to inspect its live state and specs here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB: SYNC STATUS */}
      {activeTab === 'sync-status' && (
        <div id="widget-sync-status" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Pipeline Sync Metrics
          </h4>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 bg-muted/40 border border-border rounded-xl space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Background Sync Queue:</span>
                <strong className="text-emerald-400">Idle (Ready)</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Last Sync Completed:</span>
                <strong className="text-foreground">12m ago</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Transferred Bandwidth:</span>
                <strong className="text-cyan-400">1.24 GB</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB: PERMISSIONS */}
      {activeTab === 'permissions' && (
        <div id="widget-permissions" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cinema-amber-500" /> OAuth Scope & Security
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
              <span className="font-mono font-bold text-emerald-400 uppercase text-[10px]">OAuth 2.0 Token Vault</span>
              <p className="text-[11px] text-muted-foreground">
                Credentials encrypted via AES-256 in browser key store.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH INSPECTOR: RESULT DETAILS */}
      {activeTab === 'result-details' && (
        <div id="widget-result-details" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-cinema-amber-500" /> Result Metadata & Specs
          </h4>
          <div className="space-y-3 text-xs">
            {selection.data ? (
              <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-foreground text-sm">{selection.data.title || selection.data.name}</span>
                  <span className="text-cinema-amber-500 font-mono text-[10px] uppercase font-bold bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20 shrink-0">
                    {selection.data.type || selection.type}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">{selection.data.subtitle || selection.data.description || 'No description provided.'}</p>
                <div className="pt-2 border-t border-border/40 font-mono text-[10px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date / Milestone:</span>
                    <span className="text-foreground">{selection.data.date || 'Restored'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-emerald-400 font-bold">{selection.data.status || 'Active'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence Score:</span>
                    <span className="text-cyan-400 font-bold">{selection.data.confidence || 98}% Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Record ID:</span>
                    <span className="text-foreground font-mono">{selection.data.id || 'res-node'}</span>
                  </div>
                </div>
                {selection.data.meta && (
                  <div className="p-2 bg-background/60 rounded-lg text-[10px] text-muted-foreground font-mono">
                    {selection.data.meta}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">No Result Selected</p>
                <p className="text-[11px]">Click any card in the Intelligence Discovery Hub to inspect its metadata here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH INSPECTOR: RELATIONSHIPS */}
      {activeTab === 'relationships' && (
        <div id="widget-relationships" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Connected Knowledge Graph
          </h4>
          <div className="space-y-3 text-xs">
            {selection.data ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-[11px]">
                  Entities linked to <strong className="text-foreground">{selection.data.title || selection.data.name}</strong> across the ReelLegacy archive:
                </p>
                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-semibold border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Linked Story Memoirs:</span>
                    <span className="text-cinema-amber-500 font-mono">2 Stories</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-semibold border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Family Profiles:</span>
                    <span className="text-emerald-400 font-mono">4 People</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-semibold border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Timeline Milestones:</span>
                    <span className="text-indigo-400 font-mono">3 Events</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-semibold">
                    <span className="text-muted-foreground">Archival Media & Docs:</span>
                    <span className="text-cyan-400 font-mono">8 Files</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Knowledge Graph Idle</p>
                <p className="text-[11px]">Select a search result to inspect its interconnected memories and family relationships.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH INSPECTOR: QUICK ACTIONS */}
      {activeTab === 'quick-actions' && (
        <div id="widget-quick-actions" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-cinema-amber-500" /> Action Shortcuts
          </h4>
          <div className="space-y-2 text-xs">
            {selection.data ? (
              <div className="space-y-2">
                <button
                  id="action-btn-navigate"
                  onClick={() => showToast('success', `Navigating to ${selection.data.title || selection.data.name}`)}
                  className="w-full text-left p-2.5 bg-card border border-border hover:border-cinema-amber-500/50 rounded-xl transition-all font-semibold flex items-center justify-between text-foreground hover:text-cinema-amber-500 cursor-pointer"
                >
                  <span>Open in Studio Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  id="action-btn-timeline"
                  onClick={() => showToast('info', 'Locating event in Timeline Chronology')}
                  className="w-full text-left p-2.5 bg-card border border-border hover:border-cinema-amber-500/50 rounded-xl transition-all font-semibold flex items-center justify-between text-foreground hover:text-cinema-amber-500 cursor-pointer"
                >
                  <span>Locate in Timeline</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  id="action-btn-bookmark"
                  onClick={() => showToast('success', 'Record bookmarked to saved items')}
                  className="w-full text-left p-2.5 bg-card border border-border hover:border-cinema-amber-500/50 rounded-xl transition-all font-semibold flex items-center justify-between text-foreground hover:text-cinema-amber-500 cursor-pointer"
                >
                  <span>Bookmark Record</span>
                  <Star className="w-4 h-4 text-cinema-amber-500" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Select a Record</p>
                <p className="text-[11px]">Select a search result to trigger quick workspace actions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OPERATIONS INSPECTOR: NOTIF DETAILS */}
      {activeTab === 'notif-details' && (
        <div id="widget-notif-details" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-cinema-amber-500" /> Event Details & Specs
          </h4>
          <div className="space-y-3 text-xs">
            {selection.data ? (
              <div className="p-3.5 bg-muted/40 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-foreground text-sm">{selection.data.title}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                    selection.data.priority === 'high' || selection.data.priority === 'critical'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : selection.data.priority === 'medium'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {selection.data.priority || 'medium'} priority
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] bg-background/60 p-2.5 rounded-lg border border-border/40">
                  {selection.data.description}
                </p>
                <div className="pt-2 border-t border-border/40 font-mono text-[10px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source Category:</span>
                    <span className="text-cinema-amber-500 font-bold uppercase">{selection.data.category || 'system'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="text-foreground">{selection.data.time || selection.data.dateGroup || 'Recent'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Read Status:</span>
                    <span className={selection.data.unread ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {selection.data.unread ? 'Unread / Requires Attention' : 'Acknowledged & Read'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event ID:</span>
                    <span className="text-foreground font-mono">{selection.data.id || 'evt-node'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">No Event Selected</p>
                <p className="text-[11px]">Click any notification card in the Operations Center to inspect its details here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OPERATIONS INSPECTOR: AFFECTED ENTITY / STORY */}
      {activeTab === 'affected-story' && (
        <div id="widget-affected-story" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cinema-amber-500" /> Affected Entity & Workspace
          </h4>
          <div className="space-y-3 text-xs">
            {selection.data ? (
              <div className="space-y-2.5">
                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block font-bold">Originating Context</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Related Memoir:</span>
                    <strong className="text-cinema-amber-500 font-semibold">{selection.data.relatedStory || 'Vance Family Saga'}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Related Profile:</span>
                    <strong className="text-emerald-400 font-semibold">{selection.data.relatedProfile || 'Elizabeth Vance'}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Target Workspace:</span>
                    <strong className="text-indigo-400 font-semibold">{selection.data.targetWorkspace || 'Story Studio'}</strong>
                  </div>
                </div>

                <div className="p-3 bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded-xl space-y-1.5">
                  <span className="font-bold text-cinema-amber-500 text-[10px] uppercase tracking-wider block">Deep Link Ready</span>
                  <p className="text-[11px] text-foreground/90">
                    Opening this notification will launch directly into the originating workspace with pre-populated parameters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Select a Notification</p>
                <p className="text-[11px]">Select an event to inspect its connected stories and profiles.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OPERATIONS INSPECTOR: AI DIAGNOSIS */}
      {activeTab === 'ai-explanation' && (
        <div id="widget-ai-explanation" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cinema-ai animate-pulse" /> AI Operational Diagnosis
          </h4>
          <div className="space-y-3 text-xs">
            {selection.data ? (
              <div className="space-y-2.5">
                <div className="p-3 bg-cinema-ai/10 border border-cinema-ai/20 rounded-xl space-y-1.5">
                  <span className="font-bold text-cinema-ai uppercase text-[10px] tracking-wide block">
                    Root Cause Analysis
                  </span>
                  <p className="text-[11px] text-foreground/90 leading-relaxed">
                    {selection.data.aiDiagnosis || `Event "${selection.data.title}" was triggered automatically by background pipeline orchestration. System confidence is 99.2%. No blocking errors detected.`}
                  </p>
                </div>

                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recommended Action:</span>
                    <strong className="text-emerald-400">{selection.data.recommendedAction || 'No user intervention required'}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border/40">
                    <span className="text-muted-foreground">Automation Status:</span>
                    <strong className="text-cyan-400">Auto-Resolved</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">AI Operations Standby</p>
                <p className="text-[11px]">Select a notification to generate AI root-cause diagnosis and automated recommendations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KNOWLEDGE HUB: ARTICLE OUTLINE */}
      {activeTab === 'article-outline' && (
        <div id="widget-article-outline" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-cinema-amber-500" /> Article Outline & Structure
          </h4>
          {selection.data ? (
            <div className="space-y-3">
              <div className="p-3 bg-card border border-border rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-cinema-amber-500">
                  {selection.data.category || 'Article'}
                </span>
                <h5 className="text-xs font-bold text-foreground">{selection.data.title}</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{selection.data.excerpt}</p>
              </div>
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Key Learning Sections</span>
                <div className="space-y-1 pl-2 border-l-2 border-cinema-amber-500/30 text-[11px] text-foreground/80">
                  <p>• Overview & Fundamentals</p>
                  <p>• Step-by-Step Execution</p>
                  <p>• Best Practices & Tips</p>
                  <p>• Common Edge Cases</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Select an Article</p>
              <p className="text-[11px]">Click any documentation card to view its section outline and metadata.</p>
            </div>
          )}
        </div>
      )}

      {/* KNOWLEDGE HUB: RELATED GUIDES */}
      {activeTab === 'related-docs' && (
        <div id="widget-related-docs" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Recommended Learning
          </h4>
          <div className="space-y-2 text-xs">
            {[
              { title: 'Creating Your First Legacy Profile', cat: 'Getting Started', time: '3 min read' },
              { title: 'Restoring Scanned Photographs with AI', cat: 'Tutorials', time: '5 min read' },
              { title: 'Exporting 4K Film Master Packages', cat: 'Rendering', time: '4 min read' },
              { title: 'Collaborative Family Archiving Rules', cat: 'Security & Legal', time: '2 min read' }
            ].map((doc, idx) => (
              <div key={idx} className="p-2.5 bg-card border border-border/80 hover:border-cinema-amber-500/50 rounded-xl space-y-1 cursor-pointer transition-colors">
                <span className="text-[9px] font-mono text-cinema-amber-500 uppercase font-bold">{doc.cat}</span>
                <h5 className="text-xs font-bold text-foreground leading-snug">{doc.title}</h5>
                <span className="text-[10px] text-muted-foreground font-mono">{doc.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KNOWLEDGE HUB: AI COMPANION */}
      {activeTab === 'ai-learning' && (
        <div id="widget-ai-learning" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cinema-ai" /> AI Knowledge Assistant
          </h4>
          <div className="p-3 bg-cinema-ai/10 border border-cinema-ai/30 rounded-2xl space-y-2 text-xs">
            <span className="text-[10px] font-mono font-bold text-cinema-ai uppercase">Intelligent Tutor</span>
            <p className="text-[11px] text-foreground/90 leading-relaxed">
              I can guide you through setting up voice synthesis models, resolving timeline chronology conflicts, or optimizing 4K render settings.
            </p>
          </div>
        </div>
      )}

      {/* KNOWLEDGE HUB: SHORTCUTS REFERENCE */}
      {activeTab === 'shortcuts-ref' && (
        <div id="widget-shortcuts-ref" className="space-y-4 animate-fade-in text-left">
          <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-rose-400" /> Hotkeys Reference
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { key: '/', desc: 'Focus Search Bar' },
              { key: 'Esc', desc: 'Close Reader / Overlay' },
              { key: 'Ctrl + S', desc: 'Save Story Draft' },
              { key: 'Ctrl + Shift + L', desc: 'Toggle Light/Dark' }
            ].map((sc, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted/40 border border-border rounded-lg">
                <span className="font-bold text-cinema-amber-400">{sc.key}</span>
                <span className="text-[10px] text-muted-foreground">{sc.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
