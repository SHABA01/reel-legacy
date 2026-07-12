/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOverlay } from '../../context/OverlayContext';
import { RightPanelWidget } from '../../types';
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
} from 'lucide-react';

interface WidgetTab {
  id: RightPanelWidget;
  label: string;
  icon: React.ComponentType<any>;
}

export function RightUtilityPanel() {
  const {
    rightPanelOpen,
    setRightPanelOpen,
    activeRightWidget,
    setActiveRightWidget,
    toggleRightPanel,
  } = useOverlay();

  const [kenBurns, setKenBurns] = useState(true);
  const [breathReduction, setBreathReduction] = useState(true);
  const [scoreDucking, setScoreDucking] = useState(true);

  const widgets: WidgetTab[] = [
    { id: 'ai-suggestions', label: 'AI Director', icon: Sparkles },
    { id: 'metadata', label: 'Metadata Schema', icon: Database },
    { id: 'properties', label: 'Scene Props', icon: Sliders },
    { id: 'comments', label: 'Reviews & Edits', icon: MessageSquare },
    { id: 'versions', label: 'Film Versions', icon: History },
  ];

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
          aria-label="Expand Right Utility Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-border" />

        <div className="flex flex-col gap-2.5 items-center flex-1 w-full" id="collapsed-widget-anchors">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            const isActive = activeRightWidget === widget.id;
            return (
              <button
                key={widget.id}
                id={`collapsed-anchor-${widget.id}`}
                onClick={() => {
                  setActiveRightWidget(widget.id);
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
                  {widget.label}
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
        {/* Panel Tab Header */}
        <div id="right-panel-header" className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <span className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Context Inspector
          </span>
          <button
            id="right-panel-close-btn"
            onClick={() => setRightPanelOpen(false)}
            className="p-1 rounded text-muted-foreground hover:text-foreground custom-focus cursor-pointer"
            aria-label="Collapse Right Utility Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Widget Tabs */}
        <div id="right-panel-tabs" className="flex border-b border-border bg-muted/20 px-2 shrink-0">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            const isActive = activeRightWidget === widget.id;
            return (
              <button
                key={widget.id}
                id={`tab-anchor-${widget.id}`}
                onClick={() => setActiveRightWidget(widget.id)}
                className={`flex-1 py-2.5 flex justify-center border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-cinema-amber-500 text-cinema-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                title={widget.label}
              >
                <Icon className="w-4.5 h-4.5" />
              </button>
            );
          })}
        </div>

        {/* Active Widget Viewport */}
        <div id="right-panel-viewport" className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeRightWidget === 'ai-suggestions' && (
            <div id="widget-ai-suggestions" className="space-y-4 animate-fade-in">
              <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cinema-ai" /> AI Director Suggestions
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Analyzing active timeline milestone block for structural cinematic improvements.
              </p>
              <div className="p-3 bg-cinema-ai/5 border border-cinema-ai/20 rounded-xl space-y-2" id="ai-tip-card">
                <span className="text-[10px] uppercase font-bold text-cinema-ai tracking-wider">Scenic Contrast</span>
                <p className="text-xs font-semibold text-foreground/80 leading-snug">
                  "Insert a childhood photograph during the 1954 school assembly segment to amplify the narrative shift."
                </p>
              </div>
              <div className="p-3 bg-cinema-amber-500/5 border border-cinema-amber-500/20 rounded-xl space-y-2" id="ai-voice-card">
                <span className="text-[10px] uppercase font-bold text-cinema-amber-500 tracking-wider">Voice Pacing</span>
                <p className="text-xs font-semibold text-foreground/80 leading-snug">
                  "The current narrator paragraph has 75 words, exceeding the recommended 50-word scene card ceiling. Shorten slightly."
                </p>
              </div>
            </div>
          )}

          {activeRightWidget === 'metadata' && (
            <div id="widget-metadata" className="space-y-4 animate-fade-in">
              <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" /> Story Metadata
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Verify schema properties and source citation assets.
              </p>
              <div className="space-y-3 font-sans text-xs" id="metadata-fields">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground uppercase tracking-wide text-[10px]">Project ID</span>
                  <span className="font-mono text-foreground">rl-memoir-742918</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground uppercase tracking-wide text-[10px]">Source Archive Class</span>
                  <span className="font-semibold text-foreground">Personal Ancestry / Veteran Memoir</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground uppercase tracking-wide text-[10px]">Citations Count</span>
                  <span className="font-semibold text-foreground">14 Verified documents & clippings</span>
                </div>
              </div>
            </div>
          )}

          {activeRightWidget === 'properties' && (
            <div id="widget-properties" className="space-y-4 animate-fade-in">
              <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-muted-foreground" /> Scene Properties
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tune parameters for high-resolution video exports.
              </p>
              <div className="space-y-3 text-xs" id="props-toggles">
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                  <span className="font-semibold text-foreground/80">Auto Pan & Zoom (Ken Burns)</span>
                  <button
                    role="switch"
                    aria-checked={kenBurns}
                    onClick={() => setKenBurns(!kenBurns)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-cinema-amber-500 ${
                      kenBurns ? 'bg-cinema-amber-500' : 'bg-cinema-slate-200 dark:bg-cinema-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        kenBurns ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                  <span className="font-semibold text-foreground/80">Narrator Breath Reduction</span>
                  <button
                    role="switch"
                    aria-checked={breathReduction}
                    onClick={() => setBreathReduction(!breathReduction)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-cinema-amber-500 ${
                      breathReduction ? 'bg-cinema-amber-500' : 'bg-cinema-slate-200 dark:bg-cinema-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        breathReduction ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                  <span className="font-semibold text-foreground/80">Background Score Ducking</span>
                  <button
                    role="switch"
                    aria-checked={scoreDucking}
                    onClick={() => setScoreDucking(!scoreDucking)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-cinema-amber-500 ${
                      scoreDucking ? 'bg-cinema-amber-500' : 'bg-cinema-slate-200 dark:bg-cinema-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        scoreDucking ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightWidget === 'comments' && (
            <div id="widget-comments" className="space-y-4 animate-fade-in">
              <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" /> Collaborate Reviews
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Leave editorial guidelines or scene notes for family co-authors.
              </p>
              <div className="space-y-3" id="comments-list">
                <div className="p-3 border border-border rounded-xl text-xs space-y-1 bg-muted/40">
                  <div className="flex justify-between font-semibold" id="comment-1-user">
                    <span className="text-foreground">Aunt Jane</span>
                    <span className="text-[10px] text-muted-foreground">9:45 AM</span>
                  </div>
                  <p className="text-muted-foreground leading-normal">
                    "The voice generator matches Grandpa's local accent wonderfully! Let's make sure the audio file doesn't volume-clip near the middle."
                  </p>
                </div>
              </div>
              <div className="flex gap-2" id="comment-box">
                <input
                  type="text"
                  placeholder="Add editorial note..."
                  className="flex-1 bg-muted border border-border text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-cinema-amber-500 text-foreground placeholder-muted-foreground"
                />
                <button id="add-comment-btn" className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeRightWidget === 'versions' && (
            <div id="widget-versions" className="space-y-4 animate-fade-in">
              <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" /> Film History
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review prior export cuts or fallback to archived scene script versions.
              </p>
              <div className="space-y-3 font-sans text-xs" id="version-timeline">
                <div className="flex gap-3 relative pb-4" id="v-3">
                  <div className="absolute top-1 bottom-0 left-2 w-px bg-border" />
                  <span className="w-4 h-4 rounded-full bg-cinema-amber-500 flex items-center justify-center text-[10px] text-white shrink-0 font-bold z-10">
                    3
                  </span>
                  <div className="flex-1 min-w-0" id="v-3-details">
                    <p className="font-semibold text-foreground">Revision v1.3.0</p>
                    <p className="text-muted-foreground text-[10px]">Synced voice track + Ducked background score</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Today, 11:20 AM by Phil</p>
                  </div>
                </div>
                <div className="flex gap-3 relative" id="v-2">
                  <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground border border-border shrink-0 font-bold z-10">
                    2
                  </span>
                  <div className="flex-1 min-w-0" id="v-2-details">
                    <p className="font-medium text-muted-foreground">Revision v1.2.0</p>
                    <p className="text-muted-foreground text-[10px]">First synthesis draft - baseline narrator speech</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Yesterday, 4:15 PM by Director AI</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
