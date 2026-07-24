/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Film,
  Camera,
  Users,
  Mic,
  Music,
  Eye,
  RefreshCw,
  Sliders,
  Layers,
  Subtitles,
  Video,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StoryScene } from './ScenesWorkspace';
import { StoryCharacter } from './CharactersWorkspace';

interface PreviewWorkspaceProps {
  storyId: string;
  storyTitle: string;
  scenes: StoryScene[];
  characters?: StoryCharacter[];
  timelineEvents?: any[];
  mediaItems?: any[];
  onNavigateToTab?: (tabId: string) => void;
  showToast: (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    description?: string
  ) => void;
}

export function PreviewWorkspace({
  storyId,
  storyTitle,
  scenes,
  characters = [],
  timelineEvents = [],
  mediaItems = [],
  onNavigateToTab,
  showToast,
}: PreviewWorkspaceProps) {
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [showCameraGuide, setShowCameraGuide] = useState<boolean>(true);

  // Inspector & Validation Drawer toggle
  const [activeInspectorTab, setActiveInspectorTab] = useState<'scene' | 'narration' | 'music' | 'camera' | 'validation'>('scene');

  // Currently Active Scene
  const currentScene: StoryScene | undefined = scenes[activeSceneIndex] || scenes[0];

  // Auto playback simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && scenes.length > 0) {
      timer = setInterval(() => {
        setCurrentTimeSec((prev) => {
          const nextTime = prev + 1 * playbackSpeed;
          // check if we reached end of current scene (approx 10-15s simulation per scene for preview)
          const sceneSimDuration = 12; 
          if (nextTime >= sceneSimDuration) {
            if (activeSceneIndex < scenes.length - 1) {
              setActiveSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              showToast('info', 'Preview Playback Complete', 'Reached end of documentary preview.');
              return 0;
            }
          }
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeSceneIndex, scenes, playbackSpeed, showToast]);

  // Total Estimated Duration Calculation
  const totalRuntimeStats = useMemo(() => {
    let totalSec = 0;
    scenes.forEach((s) => {
      const minMatch = s.estimatedDuration.match(/(\d+)m/);
      const secMatch = s.estimatedDuration.match(/(\d+)s/);
      const m = minMatch ? parseInt(minMatch[1], 10) : 0;
      const sec = secMatch ? parseInt(secMatch[1], 10) : 0;
      totalSec += m * 60 + sec;
    });

    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const timecodeTotal = `00:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}:00`;

    // Current timecode calculation
    let elapsedSecBefore = 0;
    for (let i = 0; i < activeSceneIndex; i++) {
      const s = scenes[i];
      const minMatch = s?.estimatedDuration.match(/(\d+)m/);
      const secMatch = s?.estimatedDuration.match(/(\d+)s/);
      const m = minMatch ? parseInt(minMatch[1], 10) : 0;
      const sec = secMatch ? parseInt(secMatch[1], 10) : 0;
      elapsedSecBefore += m * 60 + sec;
    }
    const currentTotalSec = elapsedSecBefore + Math.floor(currentTimeSec);
    const curMins = Math.floor(currentTotalSec / 60);
    const curSecs = currentTotalSec % 60;
    const timecodeCurrent = `00:${curMins < 10 ? '0' : ''}${curMins}:${curSecs < 10 ? '0' : ''}${curSecs}:${Math.floor((currentTimeSec % 1) * 24)}`;

    return {
      totalSec,
      totalFormatted: `${mins}m ${secs}s`,
      timecodeTotal,
      timecodeCurrent,
      currentTotalSec,
    };
  }, [scenes, activeSceneIndex, currentTimeSec]);

  // Quality Validation Audit Rules
  const validationAudit = useMemo(() => {
    const checks = [
      {
        id: 'scenes-exist',
        title: 'Documentary Scene Structure',
        passed: scenes.length >= 3,
        warning: scenes.length > 0 && scenes.length < 3,
        message: scenes.length >= 3 
          ? `All ${scenes.length} cinematic scenes structured cleanly.` 
          : scenes.length > 0
          ? `Only ${scenes.length} scenes created. Recommend at least 3 for documentary continuity.`
          : 'No scenes found. Create scenes before rendering.',
        targetTab: 'scenes'
      },
      {
        id: 'narration-completeness',
        title: 'Voiceover Script & Narration',
        passed: scenes.length > 0 && scenes.every((s) => s.narrationText.trim().length > 10),
        warning: scenes.some((s) => !s.narrationText.trim()),
        message: scenes.every((s) => s.narrationText.trim().length > 10)
          ? 'Full voiceover scripts present across all scenes.'
          : `${scenes.filter((s) => !s.narrationText.trim()).length} scene(s) missing narration text scripts.`,
        targetTab: 'narration'
      },
      {
        id: 'media-coverage',
        title: 'Visual Assets & Photos',
        passed: scenes.length > 0 && scenes.every((s) => s.mediaIds.length > 0),
        warning: scenes.some((s) => s.mediaIds.length === 0),
        message: scenes.every((s) => s.mediaIds.length > 0)
          ? 'Every scene has linked archival media assets.'
          : `${scenes.filter((s) => s.mediaIds.length === 0).length} scene(s) have no attached media assets.`,
        targetTab: 'assets'
      },
      {
        id: 'character-attribution',
        title: 'Character & Cast Linking',
        passed: characters.length > 0 && scenes.some((s) => s.characterIds.length > 0),
        warning: scenes.some((s) => s.characterIds.length === 0),
        message: scenes.some((s) => s.characterIds.length > 0)
          ? 'Story characters referenced throughout documentary cuts.'
          : 'No characters linked to scenes.',
        targetTab: 'characters'
      },
      {
        id: 'timeline-alignment',
        title: 'Chronological Timeline Alignment',
        passed: timelineEvents.length >= 3,
        warning: timelineEvents.length < 3,
        message: timelineEvents.length >= 3
          ? `${timelineEvents.length} life milestones chronologically anchored.`
          : 'Low timeline density recorded.',
        targetTab: 'timeline'
      }
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const scorePct = Math.round((passedCount / checks.length) * 100);

    return {
      checks,
      scorePct,
      statusLabel: scorePct >= 80 ? 'Production Ready' : scorePct >= 50 ? 'Needs Refinement' : 'Draft Stage'
    };
  }, [scenes, characters, timelineEvents]);

  // Media preview fallback asset for active scene
  const activeMediaUrl = useMemo(() => {
    if (!currentScene) return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
    if (currentScene.mediaIds && currentScene.mediaIds.length > 0) {
      const match = mediaItems.find((m) => m.id === currentScene.mediaIds[0]);
      if (match?.url) return match.url;
    }
    // Contextual fallback based on scene type
    if (currentScene.type === 'Title Card') {
      return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
    }
    if (currentScene.type === 'Photo Montage') {
      return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
  }, [currentScene, mediaItems]);

  const handlePrevScene = () => {
    if (activeSceneIndex > 0) {
      setActiveSceneIndex((prev) => prev - 1);
      setCurrentTimeSec(0);
    }
  };

  const handleNextScene = () => {
    if (activeSceneIndex < scenes.length - 1) {
      setActiveSceneIndex((prev) => prev + 1);
      setCurrentTimeSec(0);
    }
  };

  const handleResetPlayback = () => {
    setActiveSceneIndex(0);
    setCurrentTimeSec(0);
    setIsPlaying(false);
    showToast('info', 'Preview Reset', 'Playback returned to Scene #1.');
  };

  return (
    <div className="space-y-6 w-full" id="preview-workspace-root">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-6 rounded-3xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Program Monitor Quality Assurance
            </span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded uppercase">
              {storyTitle}
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-black text-foreground uppercase tracking-wide flex items-center gap-2.5">
            <Eye className="w-6 h-6 text-cinema-amber-500" /> Production Preview Studio
          </h2>
          <p className="text-xs text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Inspect documentary scene cuts, narration voiceover sync, camera motions, and music alignment before queuing for final render.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              showToast('success', 'Preview Refreshed', 'Re-synced timeline, media assets, and narration cues.');
            }}
            className="px-3.5 py-2.5 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
            id="btn-refresh-preview"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cinema-amber-500" />
            Refresh Preview
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3.5 py-2.5 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isFullscreen ? 'Exit Stage' : 'Cinema Theater'}
          </button>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('render')}
              className="px-5 py-2.5 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs rounded-2xl transition-all shadow-sm flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              Proceed to Render
            </button>
          )}
        </div>
      </div>

      {/* TOP MAIN GRID: CINEMA CANVAS + INSPECTOR SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: PROGRAM MONITOR & PLAYBACK CONTROLS */}
        <div className="lg:col-span-2 space-y-4">
          {/* CINEMATIC MONITOR FRAME */}
          <div className="bg-slate-950 border-2 border-border/80 rounded-3xl overflow-hidden shadow-2xl relative group">
            {/* Top Monitor Bar */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-cinema-amber-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cinema-amber-500 animate-pulse" />
                  Program Preview
                </span>
                <span>•</span>
                <span>Scene #{currentScene?.sceneNumber || 1}: {currentScene?.title || 'Untitled'}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-white font-bold bg-black/50 px-2 py-0.5 rounded border border-white/10">
                  {totalRuntimeStats.timecodeCurrent}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{totalRuntimeStats.timecodeTotal}</span>
              </div>
            </div>

            {/* Video / Photo Render Screen */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeMediaUrl}
                alt={currentScene?.title}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  currentScene?.cameraMovement === 'Zoom In'
                    ? 'scale-110'
                    : currentScene?.cameraMovement === 'Zoom Out'
                    ? 'scale-100'
                    : 'scale-105'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Top Right Scene Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="bg-black/70 backdrop-blur-md text-cinema-amber-400 border border-cinema-amber-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {currentScene?.type || 'Documentary Cut'}
                </span>
                <span className="bg-black/70 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                  {currentScene?.estimatedDuration || '1m 00s'}
                </span>
              </div>

              {/* Camera Movement Direction Guide Overlay */}
              {showCameraGuide && currentScene?.cameraMovement && (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-cinema-amber-400" />
                  Shot: {currentScene.cameraMovement} ({currentScene.zoomStyle || 'Subtle'})
                </div>
              )}

              {/* Floating Caption / Subtitle Overlay */}
              {showCaptions && currentScene?.narrationText && (
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <div className="inline-block bg-black/80 backdrop-blur-md border border-white/15 text-white text-xs md:text-sm font-serif italic px-5 py-2.5 rounded-2xl max-w-2xl shadow-xl leading-relaxed">
                    "{currentScene.narrationText}"
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Playback Control Bar */}
            <div className="p-4 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Play / Skip Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPlayback}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  title="Reset to Start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevScene}
                  disabled={activeSceneIndex === 0}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                  title="Previous Scene"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-cinema-amber-500 hover:bg-cinema-amber-400 text-slate-950 rounded-2xl transition-all shadow-md cursor-pointer font-bold"
                  title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNextScene}
                  disabled={activeSceneIndex === scenes.length - 1}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                  title="Next Scene"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Seek Bar Simulation */}
              <div className="flex-1 w-full max-w-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Scene Progress</span>
                  <span>{Math.floor(currentTimeSec)}s / 12s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={currentTimeSec}
                  onChange={(e) => setCurrentTimeSec(parseFloat(e.target.value))}
                  className="w-full accent-cinema-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Volume, Speed & Overlay Toggles */}
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                {/* Audio Mute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Captions Toggle */}
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                    showCaptions ? 'bg-cinema-amber-500/20 text-cinema-amber-400 border-cinema-amber-500/30' : 'hover:text-white border-transparent'
                  }`}
                  title="Toggle Subtitle Overlay"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {/* Speed Selector */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-slate-800 border border-white/10 text-slate-300 text-[11px] font-mono rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1.0x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>
              </div>
            </div>
          </div>

          {/* VISUAL PRODUCTION TIMELINE TRACKS */}
          <div className="bg-card border border-border p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-cinema-amber-500" /> Multi-Track Production Timeline
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                {scenes.length} Sequence Clips • Read-Only Review
              </span>
            </div>

            {/* TRACK 1: SCENES */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Track 1: Scenes & Shots</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {scenes.map((sc, idx) => {
                  const isActive = idx === activeSceneIndex;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setActiveSceneIndex(idx);
                        setCurrentTimeSec(0);
                      }}
                      className={`px-3 py-2 rounded-xl text-left font-mono text-xs transition-all shrink-0 cursor-pointer border ${
                        isActive
                          ? 'bg-cinema-amber-500 text-slate-950 font-bold border-cinema-amber-500 shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:text-foreground border-border'
                      }`}
                    >
                      <span className="block text-[9px] uppercase font-bold opacity-80">#{sc.sceneNumber}</span>
                      <span className="truncate max-w-[120px] block">{sc.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRACK 2: NARRATION */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Track 2: Voiceover Script</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {scenes.map((sc, idx) => {
                  const hasScript = sc.narrationText.trim().length > 0;
                  const isActive = idx === activeSceneIndex;
                  return (
                    <div
                      key={`nar-${sc.id}`}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all shrink-0 border ${
                        isActive && hasScript
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                          : hasScript
                          ? 'bg-purple-500/10 text-purple-400/80 border-purple-500/20'
                          : 'bg-muted/30 text-muted-foreground/40 border-border'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        {hasScript ? sc.assignedVoice.split(' ')[0] : 'No Script'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRACK 3: MUSIC */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Track 3: Soundtrack</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {scenes.map((sc, idx) => {
                  const isActive = idx === activeSceneIndex;
                  return (
                    <div
                      key={`mus-${sc.id}`}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all shrink-0 border ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                          : 'bg-blue-500/10 text-blue-400/80 border-blue-500/20'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {sc.musicTrack.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: QUALITY VALIDATION & ACTIVE SCENE INSPECTOR */}
        <div className="space-y-6">
          {/* PRODUCTION READINESS SCORE AUDIT CARD */}
          <div className="p-6 bg-card border border-border rounded-3xl space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Quality Audit</span>
                <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Production Readiness
                </h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-mono font-black text-cinema-amber-500">
                  {validationAudit.scorePct}%
                </span>
                <span className="block text-[9px] font-mono font-bold uppercase text-muted-foreground">
                  {validationAudit.statusLabel}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
              <div
                className="bg-cinema-amber-500 h-full transition-all duration-500"
                style={{ width: `${validationAudit.scorePct}%` }}
              />
            </div>

            {/* Audit Checklist Items */}
            <div className="space-y-2.5">
              {validationAudit.checks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-3 bg-muted/40 border border-border/60 rounded-2xl flex items-start gap-3 text-xs"
                >
                  {chk.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : chk.warning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 space-y-0.5">
                    <strong className="text-foreground font-bold block">{chk.title}</strong>
                    <p className="text-[11px] text-muted-foreground font-medium">{chk.message}</p>
                  </div>

                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab(chk.targetTab)}
                      className="text-[10px] font-mono font-bold text-cinema-amber-600 dark:text-cinema-amber-400 hover:underline shrink-0"
                    >
                      Fix
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE SCENE DETAILS INSPECTOR PANEL */}
          {currentScene && (
            <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono font-bold text-cinema-amber-500 uppercase">
                  Scene #{currentScene.sceneNumber} Active Inspector
                </span>
                <span className="text-[10px] font-mono bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground font-bold">
                  {currentScene.estimatedDuration}
                </span>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-foreground">{currentScene.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">{currentScene.description}</p>
              </div>

              <div className="border-t border-border pt-3 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Voiceover Voice:</span>
                  <strong className="text-foreground">{currentScene.assignedVoice.split(' ')[0]}</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Camera Movement:</span>
                  <strong className="text-foreground">{currentScene.cameraMovement}</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Background Score:</span>
                  <strong className="text-foreground">{currentScene.musicTrack.split(' ')[0]}</strong>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('scenes')}
                  className="w-full py-2 bg-muted hover:bg-border text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer uppercase font-mono tracking-wider text-center block mt-2"
                >
                  Edit Scene #{currentScene.sceneNumber} in Scenes Workspace
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
