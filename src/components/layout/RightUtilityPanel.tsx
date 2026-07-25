/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useOverlay } from '../../context/OverlayContext';
import { useToast } from '../../context/ToastContext';
import { useInspector, InspectorSelection } from '../../context/InspectorContext';
import {
  getDynamicInspectorHeader,
  getDynamicInspectorTabs,
  InspectorTabDef,
} from '../../context/inspectorConfig';
import { ActivityService } from '../../storage';
import {
  Sparkles,
  Database,
  Sliders,
  MessageSquare,
  History,
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Mic,
  Video,
  Activity,
  HardDrive,
  Cpu,
  Layers,
  FileText,
  Clock,
  Link2,
  Trash2,
  FolderPlus,
  Star,
  Play,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Wand2,
} from 'lucide-react';

export function RightUtilityPanel() {
  const { rightPanelOpen, setRightPanelOpen } = useOverlay();
  const { route, selection, activeTab, setActiveTab, clearSelection } = useInspector();
  const { showToast } = useToast();

  // Local state toggles for interactive properties
  const [kenBurns, setKenBurns] = useState(true);
  const [breathReduction, setBreathReduction] = useState(true);
  const [scoreDucking, setScoreDucking] = useState(true);
  const [colorizationEnabled, setColorizationEnabled] = useState(false);
  const [aiSuperRes, setAiSuperRes] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState<Array<{ user: string; text: string; time: string }>>([
    {
      user: 'Director AI',
      text: 'Verify voiceover pace matches the 12-second scene duration.',
      time: '10m ago',
    },
    {
      user: 'Aunt Jane',
      text: "The narrator matches Grandpa's local accent wonderfully!",
      time: '1h ago',
    },
  ]);

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const list = await ActivityService.getActivities();
        setActivities(list.slice(0, 8));
      } catch (e) {
        console.warn('Failed to fetch inspector activities:', e);
      }
    };

    fetchActivities();
    window.addEventListener('storage-activity-updated', fetchActivities);
    return () => {
      window.removeEventListener('storage-activity-updated', fetchActivities);
    };
  }, []);

  // Compute dynamic header & tabs from Context Engine
  const headerConfig = useMemo(() => getDynamicInspectorHeader(route, selection), [route, selection]);
  const tabs = useMemo(() => getDynamicInspectorTabs(route, selection), [route, selection]);

  // Ensure active tab is valid for current route/selection
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab, setActiveTab]);

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setCommentsList([
      { user: 'You (Editor)', text: commentInput.trim(), time: 'Just now' },
      ...commentsList,
    ]);
    setCommentInput('');
    showToast('success', 'Editorial Comment Added', 'Note saved to active object thread.');
  };

  return (
    <div
      id="right-utility-panel-container"
      className={`h-[calc(100vh-64px)] border-l border-border bg-card flex flex-col shrink-0 z-20 text-card-foreground transition-all duration-300 relative overflow-hidden ${
        rightPanelOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Collapsed Rail Overlay */}
      <div
        id="right-collapsed-rail"
        className={`absolute inset-0 flex flex-col items-center py-4 gap-4 transition-all duration-300 ${
          rightPanelOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <button
          id="right-panel-expand-btn"
          onClick={() => setRightPanelOpen(true)}
          className="p-1.5 rounded bg-muted border border-border text-muted-foreground hover:text-foreground cursor-pointer transition-transform hover:scale-105 active:scale-95"
          aria-label="Expand Right Context Inspector"
          title="Expand Context Inspector"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-border" />

        <div className="flex flex-col gap-2.5 items-center flex-1 w-full" id="collapsed-widget-anchors">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`collapsed-anchor-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setRightPanelOpen(true);
                }}
                className={`p-2 rounded-lg transition-all group relative cursor-pointer ${
                  isActive
                    ? 'text-cinema-amber-500 bg-cinema-amber-500/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="absolute right-14 scale-0 group-hover:scale-100 bg-popover text-popover-foreground text-[10px] font-semibold px-2 py-1 rounded shadow-lg transition-all whitespace-nowrap origin-right z-50 border border-border">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Content Wrapper */}
      <div
        id="right-expanded-content"
        className={`absolute inset-0 flex flex-col transition-all duration-300 ${
          rightPanelOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Dynamic Context Header */}
        <div id="right-panel-header" className="px-4 py-3 border-b border-border bg-muted/40 shrink-0 space-y-1">
          <div className="flex items-center justify-between">
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                headerConfig.badgeColor || 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30'
              }`}
            >
              {headerConfig.badge}
            </span>
            <div className="flex items-center gap-1">
              {selection.type !== 'none' && (
                <button
                  onClick={clearSelection}
                  className="text-[10px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted border border-border cursor-pointer transition-colors"
                  title="Deselect item"
                >
                  Clear Selection
                </button>
              )}
              <button
                id="right-panel-close-btn"
                onClick={() => setRightPanelOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground custom-focus cursor-pointer"
                aria-label="Collapse Context Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="font-display font-bold text-sm text-foreground truncate">{headerConfig.title}</h3>
          <p className="text-[11px] text-muted-foreground truncate font-medium">{headerConfig.subtitle}</p>
        </div>

        {/* Dynamic Widget Tabs */}
        <div id="right-panel-tabs" className="flex border-b border-border bg-muted/20 px-2 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-anchor-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 flex justify-center border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-cinema-amber-500 text-cinema-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                title={tab.label}
              >
                <Icon className="w-4.5 h-4.5" />
              </button>
            );
          })}
        </div>

        {/* Dynamic Active Tab Viewport */}
        <div id="right-panel-viewport" className="flex-1 overflow-y-auto scrollbar-ephemeral p-5 space-y-5">
          {/* TAB 1: AI DIRECTOR SUGGESTIONS */}
          {activeTab === 'ai-director' && (
            <div id="widget-ai-director" className="space-y-4 animate-fade-in text-left">
              <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cinema-amber-500" /> AI Director Analysis
              </h4>

              {/* Contextual Suggestions based on Route & Selection */}
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

              {selection.type === 'story' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-card border border-cinema-amber-500/30 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                      Production Readiness
                    </span>
                    <p className="text-xs font-semibold text-foreground leading-snug">
                      Story is 85% complete. 2 scenes require oral voiceover synthesis before triggering 4K render queue.
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

              {/* SCENE PROPERTIES */}
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

              {/* CHARACTER PROPERTIES */}
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

              {/* MEDIA ASSET PROPERTIES */}
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

              {/* DEFAULT / NO SELECTION */}
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
        </div>

        {/* Quick Actions / Inspector Mode Footer */}
        <div className="p-3 px-4 border-t border-border bg-muted/30 shrink-0 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span className="uppercase font-bold">Mode: {selection.type.toUpperCase()}</span>
          <span className="capitalize">{route.replace('-', ' ')}</span>
        </div>
      </div>
    </div>
  );
}
