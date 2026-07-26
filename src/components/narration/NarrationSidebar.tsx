/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderTree,
  Mic,
  Sparkles,
  ListOrdered,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  ChevronDown,
  Volume2,
  FileText,
  User,
  Plus
} from 'lucide-react';
import { NarrationSegment, VoiceProfile } from '../../types/narration';

interface NarrationSidebarProps {
  segments: NarrationSegment[];
  selectedSegmentId: string | null;
  onSelectSegment: (segmentId: string) => void;
  voiceProfiles: VoiceProfile[];
  onOpenVoiceLibrary: () => void;
  onOpenPronunciationModal: () => void;
}

export function NarrationSidebar({
  segments,
  selectedSegmentId,
  onSelectSegment,
  voiceProfiles,
  onOpenVoiceLibrary,
  onOpenPronunciationModal
}: NarrationSidebarProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'queue' | 'voices' | 'history'>('structure');
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({
    'Act I: Origins & Shoreline': true,
    'Act II: Service & Academia': true
  });

  // Group segments by Act & Chapter
  const groupedActs = React.useMemo(() => {
    const map: Record<string, Record<string, NarrationSegment[]>> = {};

    segments.forEach(seg => {
      const act = seg.actTitle || 'Act I: Story Structure';
      const ch = seg.chapterTitle || 'Chapter 1: Narrative Scenes';

      if (!map[act]) map[act] = {};
      if (!map[act][ch]) map[act][ch] = [];
      map[act][ch].push(seg);
    });

    return map;
  }, [segments]);

  const toggleAct = (act: string) => {
    setExpandedActs(prev => ({ ...prev, [act]: !prev[act] }));
  };

  const pendingSegments = segments.filter(s => s.status === 'Needs Recording' || s.status === 'Draft');

  return (
    <div className="w-80 h-full flex flex-col bg-card/60 border-r border-border/80 text-foreground font-sans select-none" id="narration-sidebar">
      {/* SIDEBAR NAVIGATION TABS */}
      <div className="p-2 border-b border-border/70 flex items-center justify-between gap-1 bg-background/50">
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'structure'
              ? 'bg-cinema-amber-500/15 text-cinema-amber-400 border border-cinema-amber-500/30 font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          title="Story Structure Hierarchy"
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Structure</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer relative ${
            activeTab === 'queue'
              ? 'bg-cinema-amber-500/15 text-cinema-amber-400 border border-cinema-amber-500/30 font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          title="Pending Narration Queue"
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Queue</span>
          {pendingSegments.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {pendingSegments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('voices')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'voices'
              ? 'bg-cinema-amber-500/15 text-cinema-amber-400 border border-cinema-amber-500/30 font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          title="Voice Profiles & Clones"
        >
          <User className="w-3.5 h-3.5" />
          <span>Voices</span>
        </button>
      </div>

      {/* SIDEBAR CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {/* TAB 1: STORY STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              <span>Documentary Scenes</span>
              <span className="font-mono">{segments.length} total</span>
            </div>

            {Object.entries(groupedActs).map(([actTitle, chapters]) => (
              <div key={actTitle} className="space-y-1 bg-background/30 rounded-xl p-2 border border-border/40">
                <button
                  onClick={() => toggleAct(actTitle)}
                  className="w-full flex items-center justify-between text-xs font-bold text-foreground hover:text-cinema-amber-400 transition-colors py-1 px-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {expandedActs[actTitle] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-cinema-amber-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{actTitle}</span>
                  </div>
                </button>

                {expandedActs[actTitle] && (
                  <div className="space-y-2 pt-1 pl-2 border-l border-border/40">
                    {Object.entries(chapters).map(([chapterTitle, sceneSegs]) => (
                      <div key={chapterTitle} className="space-y-1">
                        <div className="text-[10px] font-mono text-cinema-amber-400/80 font-semibold px-1">
                          {chapterTitle}
                        </div>

                        <div className="space-y-1">
                          {sceneSegs.map(seg => {
                            const isSelected = seg.id === selectedSegmentId;
                            const isRecorded = seg.status === 'Recorded' || seg.status === 'Approved' || seg.status === 'AI Generated';

                            return (
                              <button
                                key={seg.id}
                                onClick={() => onSelectSegment(seg.id)}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                                  isSelected
                                    ? 'bg-cinema-amber-500/20 text-cinema-amber-300 border border-cinema-amber-500/40 font-semibold shadow-sm'
                                    : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent'
                                }`}
                              >
                                <div className="space-y-0.5 truncate flex-1">
                                  <div className="truncate font-medium flex items-center gap-1.5">
                                    <FileText className="w-3 h-3 shrink-0 text-cinema-amber-500/70" />
                                    <span className="truncate">{seg.sceneTitle}</span>
                                  </div>
                                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                                    {seg.wordCount} words • ~{seg.speakingDurationEstimateSec}s
                                  </div>
                                </div>

                                <div className="shrink-0 mt-0.5">
                                  {isRecorded ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PENDING QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              <span>Missing Narration Queue</span>
              <span className="font-mono text-rose-400 font-bold">{pendingSegments.length} scenes</span>
            </div>

            {pendingSegments.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-2 border border-dashed border-border/60 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold text-foreground">All Scenes Narrated!</p>
                <p className="text-[10px]">Every documentary scene has active voice audio assigned.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingSegments.map(seg => (
                  <div
                    key={seg.id}
                    onClick={() => onSelectSegment(seg.id)}
                    className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground group-hover:text-rose-400 transition-colors truncate">
                        {seg.sceneTitle}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        Missing
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                      "{seg.text}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                      <span>Est. {seg.speakingDurationEstimateSec}s</span>
                      <span className="text-cinema-amber-400 hover:underline">Click to Record / Generate</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VOICE LIBRARY PREVIEW */}
        {activeTab === 'voices' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              <span>Voice Profiles</span>
              <button
                onClick={onOpenVoiceLibrary}
                className="text-cinema-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Library</span>
              </button>
            </div>

            <div className="space-y-2">
              {voiceProfiles.map(voice => (
                <div
                  key={voice.id}
                  className="p-3 rounded-xl bg-background/50 border border-border/60 hover:border-cinema-amber-500/40 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cinema-amber-400" />
                      <span>{voice.name}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cinema-amber-500/10 text-cinema-amber-300 border border-cinema-amber-500/20">
                      {voice.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {voice.description}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground pt-1">
                    <span>Speed: {voice.speed}x</span>
                    <span>•</span>
                    <span>Emotion: {voice.emotion}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pronunciation Dictionary Trigger */}
            <div className="pt-2">
              <button
                onClick={onOpenPronunciationModal}
                className="w-full py-2 px-3 rounded-xl bg-card border border-cinema-amber-500/30 text-cinema-amber-400 hover:bg-cinema-amber-500/10 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pronunciation Dictionary</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
