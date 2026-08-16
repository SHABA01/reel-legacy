/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Mic,
  Sparkles,
  Download,
  Upload,
  User,
  Sliders,
  Play,
  Pause,
  Layers,
  BookOpen,
  Volume2,
  CheckCircle2,
  Activity,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Zap,
  FolderTree,
  Wand2,
  ListOrdered,
  FileText,
  Clock,
  Video,
  Award,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Music,
  Check
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { ReelMediaPlayer } from '../ui/ReelMediaPlayer';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';
import { useOverlay } from '../../context/OverlayContext';
import { useToast } from '../../context/ToastContext';

// Sub-components
import { NarrationDashboard } from './NarrationDashboard';
import { NarrationScriptEditor } from './NarrationScriptEditor';
import { WaveformEditor } from './WaveformEditor';
import { NarrationTimeline } from './NarrationTimeline';
import { NarrationInspector } from './NarrationInspector';

// Modals
import { RecordingStudioModal } from './RecordingStudioModal';
import { VoiceLibraryModal } from './VoiceLibraryModal';
import { PronunciationModal } from './PronunciationModal';
import { ExportNarrationModal } from './ExportNarrationModal';

// Services & Types
import { NarrationService } from '../../services/narrationService';
import { VoiceGenerationService } from '../../services/voiceGenerationService';
import { SyncService } from '../../services/syncService';
import {
  NarrationSegment,
  VoiceProfile,
  NarrationVersion,
  AISuggestion,
  PronunciationRule
} from '../../types/narration';

export type NarrationWorkspaceTab =
  | 'projects'
  | 'library'
  | 'recording'
  | 'ai_voices'
  | 'synchronization'
  | 'processing'
  | 'exports';

export function NarrationStudioPage() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { rightPanelOpen, toggleRightPanel } = useOverlay();
  const { showToast } = useToast();

  // State Management from NarrationService
  const [segments, setSegments] = useState<NarrationSegment[]>(() => NarrationService.getSegments());
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>(() => NarrationService.getVoiceProfiles());
  const [pronunciationRules, setPronunciationRules] = useState<PronunciationRule[]>(() => NarrationService.getPronunciationRules());
  const [stats, setStats] = useState(() => NarrationService.getProjectStats());

  // Active Workspace Tab (Studio Workspace Archetype Navigation)
  const [activeTab, setActiveTab] = useState<NarrationWorkspaceTab>('projects');

  // Active selections & transport states
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-1');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(() => {
    const initialSegs = NarrationService.getSegments();
    return initialSegs.length > 0 ? initialSegs[0].id : null;
  });
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => {
    const voices = NarrationService.getVoiceProfiles();
    return voices.length > 0 ? voices[0].id : 'voice-1';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Recording tab state
  const [isLiveRecording, setIsLiveRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Audio Processing tab state
  const [noiseReductionDb, setNoiseReductionDb] = useState<number>(12);
  const [removeSilence, setRemoveSilence] = useState<boolean>(true);
  const [eqPreset, setEqPreset] = useState<string>('Broadcast Warmth');
  const [normalizeLufs, setNormalizeLufs] = useState<number>(-24);

  // Modal visibility states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isVoiceLibraryOpen, setIsVoiceLibraryOpen] = useState(false);
  const [isPronunciationModalOpen, setIsPronunciationModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Available stories options
  const stories = [
    { id: 'story-1', title: 'The Life & Times of John Miller', scenesCount: 4, durationMin: 12.5 },
    { id: 'story-2', title: 'The Pacific Theater 1944', scenesCount: 3, durationMin: 8.2 },
    { id: 'story-3', title: 'The Homestead Years 1952-1968', scenesCount: 5, durationMin: 15.0 }
  ];

  // Load initial data & subscribe
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/workspace/dashboard' },
      { label: 'Narration Studio' }
    ]);

    const initialSegs = NarrationService.getSegments();
    setSegments(initialSegs);
    setVoiceProfiles(NarrationService.getVoiceProfiles());
    setPronunciationRules(NarrationService.getPronunciationRules());
    setStats(NarrationService.getProjectStats());

    if (initialSegs.length > 0 && !selectedSegmentId) {
      setSelectedSegmentId(initialSegs[0].id);
    }

    const unsubscribe = NarrationService.subscribe(() => {
      const updatedSegs = NarrationService.getSegments();
      setSegments(updatedSegs);
      setVoiceProfiles(NarrationService.getVoiceProfiles());
      setPronunciationRules(NarrationService.getPronunciationRules());
      setStats(NarrationService.getProjectStats());
    });

    return () => {
      unsubscribe();
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs]);

  // Derived selected active segment & voice profile
  const activeSegment = useMemo(() => {
    return segments.find(s => s.id === selectedSegmentId) || (segments.length > 0 ? segments[0] : null);
  }, [segments, selectedSegmentId]);

  const activeVoiceProfile = useMemo(() => {
    return voiceProfiles.find(v => v.id === (activeSegment?.activeVoiceId || selectedVoiceId)) || voiceProfiles[0] || null;
  }, [voiceProfiles, activeSegment, selectedVoiceId]);

  const activeVersion = useMemo(() => {
    return activeSegment?.versions.find(v => v.id === activeSegment.activeVersionId);
  }, [activeSegment]);

  // Filtered segments by search
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter(
      s =>
        s.sceneTitle.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        s.actTitle.toLowerCase().includes(q)
    );
  }, [segments, searchQuery]);

  // Playhead scrubber simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          const totalDur = stats.totalDurationMin * 60;
          if (prev >= totalDur) {
            setIsPlaying(false);
            return 0;
          }
          return parseFloat((prev + 0.1 * playbackSpeed).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, stats.totalDurationMin]);

  // Live recording timer simulation
  useEffect(() => {
    let recTimer: NodeJS.Timeout;
    if (isLiveRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(recTimer);
  }, [isLiveRecording]);

  // Handlers
  const handleUpdateScriptText = (segmentId: string, newText: string) => {
    NarrationService.updateSegmentText(segmentId, newText);
    const updated = NarrationService.getSegments().find(s => s.id === segmentId);
    if (updated) SyncService.notifyNarrationChanged(updated);
  };

  const handleSelectVoiceProfile = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    if (selectedSegmentId) {
      NarrationService.assignVoiceProfile(selectedSegmentId, voiceId);
    }
  };

  const handleGenerateAIVoice = async (actionLabel: string = 'AI Synthesis') => {
    if (!activeSegment) return;
    showToast('loading', `Synthesizing AI voice narration for "${activeSegment.sceneTitle}"...`);

    const voice = activeVoiceProfile || voiceProfiles[0];
    const newVer = await VoiceGenerationService.generateVoiceClip(activeSegment.text, voice, actionLabel);

    NarrationService.addVersion(activeSegment.id, newVer);
    showToast('success', 'AI Voice synthesis generated and assigned to scene!');

    const updated = NarrationService.getSegments().find(s => s.id === activeSegment.id);
    if (updated) SyncService.notifyNarrationChanged(updated);
  };

  const handleSaveRecording = (version: NarrationVersion) => {
    if (!activeSegment) return;
    NarrationService.addVersion(activeSegment.id, version);
    showToast('success', 'Recording take saved to narration timeline!');

    const updated = NarrationService.getSegments().find(s => s.id === activeSegment.id);
    if (updated) SyncService.notifyNarrationChanged(updated);
  };

  const handleUpdateVoiceSettings = (speed: number, pitch: number, duckingDb: number) => {
    if (!activeSegment) return;
    NarrationService.updateVoiceSettings(activeSegment.id, speed, pitch, duckingDb);
  };

  const handleApplyAISuggestion = (sug: AISuggestion) => {
    if (!activeSegment) return;
    if (sug.proposedSpeed) {
      handleUpdateVoiceSettings(sug.proposedSpeed, activeVoiceProfile?.pitch || 1.0, activeSegment.musicDuckingDb);
      showToast('success', `Adjusted speaking speed to ${sug.proposedSpeed}x!`);
    } else if (sug.fixAction === 'insert_pause') {
      const newText = activeSegment.text + ' [pause: 1.5s] ';
      handleUpdateScriptText(activeSegment.id, newText);
      showToast('success', 'Inserted breath pause marker!');
    }
  };

  const handleAutoAlignSync = () => {
    showToast('loading', 'AI Synchronizing narration audio with scene visuals...');
    setTimeout(() => {
      showToast('success', 'Narration audio auto-aligned with 98% precision!');
    }, 1000);
  };

  const handleBatchProcessAudio = () => {
    showToast('loading', 'Batch processing project audio: De-noise, LUFS Normalization, Ducking...');
    setTimeout(() => {
      showToast('success', 'Applied audio cleanup stack across all scenes!');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden" id="narration-studio-page">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Narration Studio"
        subtitle="AI Voice Production, Family Voice Recording & Multi-Track Story Synchronization"
        rightContent={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsVoiceLibraryOpen(true)}
              leftIcon={<User className="w-3.5 h-3.5 text-cinema-amber-400" />}
            >
              Voice Library
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRecordModalOpen(true)}
              leftIcon={<Mic className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Record Studio
            </Button>

            <Button
              size="sm"
              variant="cinema"
              onClick={() => handleGenerateAIVoice('AI Voice Synthesis')}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate AI Scene Voice
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Studio Master
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={toggleRightPanel}
              leftIcon={<Sliders className="w-3.5 h-3.5 text-cinema-amber-400" />}
              title="Toggle Narration Inspector"
            >
              Inspector
            </Button>
          </div>
        }
      />

      {/* 2. WORKSPACE HEADER NAVIGATION TABS (No internal left sidebar) */}
      <div className="bg-card/90 border-b border-border px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        {/* TAB BUTTONS */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Voice Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Voice Library</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 text-foreground font-extrabold">
              {voiceProfiles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('recording')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'recording'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recording Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_voices')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_voices'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Voice Generation</span>
          </button>

          <button
            onClick={() => setActiveTab('synchronization')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'synchronization'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Synchronization</span>
          </button>

          <button
            onClick={() => setActiveTab('processing')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'processing'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Audio Processing</span>
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'exports'
                ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Exports</span>
          </button>
        </div>

        {/* WORKSPACE TOOLBAR CONTROLS */}
        <div className="flex items-center gap-2.5">
          {/* Story Selector */}
          <select
            value={selectedStoryId}
            onChange={(e) => setSelectedStoryId(e.target.value)}
            className="bg-muted/80 border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
          >
            {stories.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Quick Scene Selection Jump */}
          <select
            value={selectedSegmentId || ''}
            onChange={(e) => setSelectedSegmentId(e.target.value)}
            className="bg-muted/80 border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer max-w-[160px] truncate"
          >
            {segments.map(seg => (
              <option key={seg.id} value={seg.id}>
                {seg.sceneTitle}
              </option>
            ))}
          </select>

          {/* Autosave Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/40">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Autosaved</span>
          </div>

          {/* Search Narration */}
          <div className="relative w-36 md:w-48">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/60 border border-border/60 rounded-lg pl-8 pr-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-cinema-amber-500"
            />
          </div>

          {/* Playback Speed selector */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-muted/80 border border-border rounded-lg px-2 py-1 text-[11px] font-mono text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
            title="Studio Transport Playback Speed"
          >
            <option value={0.75}>0.75x</option>
            <option value={1.0}>1.0x Speed</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>

          {/* 1-Click AI Sync Quick Action */}
          <Button
            size="xs"
            variant="outline"
            onClick={handleAutoAlignSync}
            leftIcon={<Zap className="w-3 h-3 text-cinema-amber-400" />}
            title="Auto Align Narration to Scene Visuals"
          >
            AI Sync
          </Button>
        </div>
      </div>

      {/* 3. MAIN STUDIO WORKSPACE (CONTENT VIEW + RIGHT CONTEXT PANEL) */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* WORKSPACE VIEW CONTAINER */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* TAB 1: VOICE PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {/* DASHBOARD METRICS BAR */}
              <NarrationDashboard
                stats={stats}
                onQuickAction={(action) => {
                  if (action === 'filter-missing') {
                    showToast('info', 'Filtered view to scenes with missing narration.');
                  }
                }}
              />

              {/* PROJECT SCENE LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cinema-amber-400" />
                    <span>Documentary Story Narration Segments</span>
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">
                    {filteredSegments.length} scenes available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSegments.map(seg => {
                    const isSelected = seg.id === activeSegment?.id;
                    const voice = voiceProfiles.find(v => v.id === seg.activeVoiceId) || voiceProfiles[0];

                    return (
                      <div
                        key={seg.id}
                        onClick={() => setSelectedSegmentId(seg.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cinema-amber-500/15 border-cinema-amber-500 shadow-md font-semibold'
                            : 'bg-card border-border/70 hover:border-cinema-amber-500/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-cinema-amber-400 font-bold truncate">
                              {seg.sceneTitle}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              seg.status === 'Recorded' || seg.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : seg.status === 'AI Generated'
                                ? 'bg-sky-500/20 text-sky-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {seg.status}
                            </span>
                          </div>

                          <p className="text-xs text-foreground line-clamp-2 italic">
                            "{seg.text}"
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Mic className="w-3 h-3 text-cinema-amber-400" />
                            <span>{voice.name}</span>
                          </div>
                          <span>{seg.wordCount} words • ~{seg.speakingDurationEstimateSec}s</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SCRIPT EDITOR & PREVIEW SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                <div className="lg:col-span-2">
                  <NarrationScriptEditor
                    segment={activeSegment}
                    voiceProfile={activeVoiceProfile}
                    onUpdateText={handleUpdateScriptText}
                    onOpenRecordModal={() => setIsRecordModalOpen(true)}
                    onGenerateVoiceClip={handleGenerateAIVoice}
                    onAddVersion={(label, type) => {
                      if (activeSegment) {
                        NarrationService.addVersion(activeSegment.id, {
                          id: `ver-alt-${Date.now()}`,
                          type,
                          label,
                          durationSec: activeSegment.speakingDurationEstimateSec || 12,
                          createdAt: new Date().toISOString(),
                          createdBy: 'Editor Take',
                          audioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg',
                          isSelected: true
                        });
                      }
                    }}
                  />
                </div>

                {/* VISUAL PREVIEW & SUBTITLES */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                    <span>Scene Visual Sync</span>
                    <span className="text-[10px] text-cinema-amber-400 font-mono">
                      {activeSegment ? activeSegment.sceneTitle : 'Preview'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border/80 overflow-hidden bg-black shadow-md">
                    <ReelMediaPlayer
                      src={activeSegment?.mediaAssetUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                      poster="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                      autoPlay={false}
                    />
                  </div>

                  {activeSegment && (
                    <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
                      <div className="text-[9px] font-mono font-bold uppercase text-cinema-amber-400">
                        Live Subtitle Prompter
                      </div>
                      <p className="text-xs font-mono text-foreground font-semibold line-clamp-2">
                        "{activeSegment.text}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VOICE LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* AI VOICE MATCHING ASSISTANT CARD */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cinema-amber-500/15 via-purple-500/10 to-background border border-cinema-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cinema-amber-400" />
                    <h3 className="font-bold text-sm text-foreground">AI Voice Matching Assistant</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cinema-amber-500/20 text-cinema-amber-300 font-bold border border-cinema-amber-500/30">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Based on story context (<span className="text-foreground font-semibold">1944 WWII Navy Officer Memoir</span>), the AI recommends <span className="text-cinema-amber-400 font-bold">Arthur Sterling (Warm Elder Narrator)</span> for maximum emotional resonance.
                </p>
              </div>

              {/* VOICE PROFILES GRID */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>Available Narrator Voice Profiles</span>
                  </h3>
                  <Button
                    size="xs"
                    variant="cinema"
                    onClick={() => setIsVoiceLibraryOpen(true)}
                    leftIcon={<Plus className="w-3 h-3" />}
                  >
                    Add Voice / Clone
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {voiceProfiles.map(voice => {
                    const isSelected = activeVoiceProfile ? voice.id === activeVoiceProfile.id : voice.id === selectedVoiceId;

                    return (
                      <div
                        key={voice.id}
                        onClick={() => handleSelectVoiceProfile(voice.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cinema-amber-500/15 border-cinema-amber-500 shadow-md font-semibold'
                            : 'bg-card border-border/70 hover:border-cinema-amber-500/40'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-cinema-amber-500/20 border border-cinema-amber-500/40 flex items-center justify-center text-cinema-amber-400 font-bold">
                                {voice.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-foreground">{voice.name}</h4>
                                <span className="text-[10px] text-muted-foreground font-mono">{voice.category}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {voice.gender} • {voice.ageGroup}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                            {voice.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                          <span>Speed: {voice.speed}x</span>
                          <span className="text-cinema-amber-400 font-bold">{voice.emotion}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast('info', `Playing voice sample for ${voice.name}`);
                            }}
                            className="p-1 rounded bg-muted hover:bg-cinema-amber-500/20 text-foreground"
                          >
                            <Play className="w-3 h-3 text-cinema-amber-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RECORDING STUDIO */}
          {activeTab === 'recording' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>Studio Microphone Recording Workspace</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Target Scene: <span className="text-cinema-amber-400 font-bold font-mono">{activeSegment?.sceneTitle}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    48kHz Studio Quality
                  </span>
                </div>

                {/* PROMPTER SCRIPT DISPLAY */}
                <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-cinema-amber-400 font-bold">Script Teleprompter</span>
                  <p className="text-sm font-serif text-foreground leading-relaxed">
                    "{activeSegment?.text}"
                  </p>
                </div>

                {/* RECORDING CONTROLS */}
                <div className="flex flex-col items-center justify-center space-y-3 py-4">
                  <div className="text-2xl font-mono font-bold text-foreground">
                    00:00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                  </div>

                  <button
                    onClick={() => setIsLiveRecording(!isLiveRecording)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer ${
                      isLiveRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-500 text-slate-950 hover:scale-105'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>

                  <span className="text-xs text-muted-foreground font-mono">
                    {isLiveRecording ? 'Recording in progress... Click to stop take' : 'Click microphone button to begin studio recording'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI VOICES GENERATION */}
          {activeTab === 'ai_voices' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* LEFT: SCRIPT & EMOTIONAL ASSISTANT */}
                <div className="lg:col-span-2 space-y-4">
                  {/* HISTORICAL PRONUNCIATION ASSISTANT */}
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <div>
                        <h4 className="font-bold text-xs text-foreground">Historical Pronunciation Assistant</h4>
                        <p className="text-[11px] text-muted-foreground">Phonetic rules active for historical names and locations.</p>
                      </div>
                    </div>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setIsPronunciationModalOpen(true)}
                    >
                      Open Dictionary
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
                    <label className="text-xs font-bold text-foreground">Target Narration Script Text</label>
                    <textarea
                      rows={5}
                      value={activeSegment?.text || ''}
                      onChange={(e) => activeSegment && handleUpdateScriptText(activeSegment.id, e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-cinema-amber-500"
                    />

                    <Button
                      variant="cinema"
                      size="sm"
                      onClick={() => handleGenerateAIVoice('AI Generation Take')}
                      leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Synthesize AI Voice Scene Clip
                    </Button>
                  </div>
                </div>

                {/* RIGHT: VOICE CONTROLS */}
                <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3 text-xs">
                  <h4 className="font-bold text-foreground uppercase tracking-wider font-mono text-[11px]">
                    Voice Model Controls
                  </h4>

                  <div className="space-y-2">
                    <label className="text-muted-foreground font-medium">Selected Narrator</label>
                    <div className="p-2.5 rounded-lg bg-background border border-border font-bold text-foreground">
                      {activeVoiceProfile ? `${activeVoiceProfile.name} (${activeVoiceProfile.category})` : 'Arthur Sterling (Family Member)'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-muted-foreground font-medium">Emotion Tone</label>
                    <div className="p-2.5 rounded-lg bg-background border border-border font-bold text-cinema-amber-400">
                      {activeVoiceProfile ? activeVoiceProfile.emotion : 'Warm'} Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYNCHRONIZATION */}
          {activeTab === 'synchronization' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Scene Visual & Audio Alignment Engine</span>
                  </h3>
                  <Button
                    size="xs"
                    variant="cinema"
                    onClick={handleAutoAlignSync}
                    leftIcon={<Zap className="w-3.5 h-3.5" />}
                  >
                    1-Click Auto-Align
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl overflow-hidden bg-black border border-border max-h-56">
                    <ReelMediaPlayer
                      src={activeSegment?.mediaAssetUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                      poster="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                      autoPlay={false}
                    />
                  </div>

                  <div className="space-y-2">
                    {segments.map(seg => (
                      <div key={seg.id} className="p-2.5 rounded-lg bg-background border border-border/60 flex items-center justify-between text-xs font-mono">
                        <span className="truncate">{seg.sceneTitle}</span>
                        <span className="text-emerald-400 font-bold">+0.12s Locked</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIO PROCESSING */}
          {activeTab === 'processing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-4 max-w-2xl mx-auto text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Audio Cleanup & Restoration Suite</span>
                  </h3>
                  <Button
                    size="xs"
                    variant="cinema"
                    onClick={handleBatchProcessAudio}
                    leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                  >
                    Batch Process All Scenes
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>Noise Reduction</span>
                      <span className="font-mono text-cinema-amber-400">-{noiseReductionDb} dB</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={noiseReductionDb}
                      onChange={(e) => setNoiseReductionDb(parseInt(e.target.value))}
                      className="w-full accent-cinema-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">EQ Preset</label>
                    <select
                      value={eqPreset}
                      onChange={(e) => setEqPreset(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg p-2 text-foreground"
                    >
                      <option value="Broadcast Warmth">Broadcast Warmth</option>
                      <option value="Vintage Tape">Vintage Tape</option>
                      <option value="Vocal Clarity">Vocal Clarity</option>
                      <option value="Studio Clean">Studio Clean</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: EXPORTS */}
          {activeTab === 'exports' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4 max-w-xl mx-auto text-xs">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>Export Studio Narration Master Package</span>
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Export full documentary voiceover tracks formatted for film rendering, podcast distributions, or archival storage.
                </p>

                <Button
                  size="md"
                  variant="cinema"
                  className="w-full"
                  onClick={() => setIsExportModalOpen(true)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Configure & Export Narration Master
                </Button>
              </div>
            </div>
          )}

          {/* BOTTOM WAVEFORM EDITOR FOR SELECTED SEGMENT */}
          <WaveformEditor
            segment={activeSegment}
            activeVersion={activeVersion}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            currentTime={currentTime}
            onSeek={(time) => setCurrentTime(time)}
          />
        </div>

        {/* RIGHT CONTEXT PANEL INSPECTOR (Required Context Panel Architecture) */}
        {rightPanelOpen && (
          <div className="w-80 h-full shrink-0">
            <NarrationInspector
              segment={activeSegment}
              voiceProfile={activeVoiceProfile}
              workspaceTab={activeTab}
              stats={stats}
              onUpdateVoiceSettings={handleUpdateVoiceSettings}
              onSelectVersion={(versionId) => {
                if (activeSegment) NarrationService.selectVersion(activeSegment.id, versionId);
              }}
              onApplyAISuggestion={handleApplyAISuggestion}
              onOpenPronunciationModal={() => setIsPronunciationModalOpen(true)}
              onClose={toggleRightPanel}
            />
          </div>
        )}
      </div>

      {/* 4. MULTI-TRACK BOTTOM TIMELINE */}
      <NarrationTimeline
        segments={segments}
        selectedSegmentId={selectedSegmentId}
        onSelectSegment={(id) => setSelectedSegmentId(id)}
        currentTime={currentTime}
        onSeek={(time) => setCurrentTime(time)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* 5. MODALS */}
      <RecordingStudioModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        segment={activeSegment}
        onSaveRecording={handleSaveRecording}
      />

      <VoiceLibraryModal
        isOpen={isVoiceLibraryOpen}
        onClose={() => setIsVoiceLibraryOpen(false)}
        voiceProfiles={voiceProfiles}
        selectedVoiceId={activeSegment?.activeVoiceId || selectedVoiceId}
        onSelectVoice={handleSelectVoiceProfile}
        onAddVoiceProfile={(newVoice) => NarrationService.addVoiceProfile(newVoice)}
      />

      <PronunciationModal
        isOpen={isPronunciationModalOpen}
        onClose={() => setIsPronunciationModalOpen(false)}
        rules={pronunciationRules}
        onAddRule={(rule) => NarrationService.addPronunciationRule(rule)}
      />

      <ExportNarrationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        segments={segments}
      />
    </div>
  );
}
