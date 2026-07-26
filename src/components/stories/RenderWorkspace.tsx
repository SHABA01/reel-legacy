/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseDurationToSeconds } from '../../utils/durationUtils';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Wand2,
  Film,
  Video,
  Mic,
  Music,
  FileText,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  HardDrive,
  Download,
  Share2,
  FolderPlus,
  Bookmark,
  RefreshCw,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  X,
  Volume2,
  Subtitles,
  Camera,
  Globe,
  Save,
  Trash2,
  ListPlus,
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import { StoryScene } from './ScenesWorkspace';
import { StoryCharacter } from './CharactersWorkspace';

export interface RenderConfig {
  presetId: string;
  presetName: string;
  outputFormat: 'video' | 'audio' | 'pdf' | 'archive';
  resolution: '720p' | '1080p' | '1440p' | '4k';
  frameRate: '24' | '30' | '60';
  aspectRatio: '16:9' | '9:16' | '1:1';
  bitrateQuality: 'standard' | 'high' | 'ultra';
  narrationVoice: string;
  narrationLanguage: string;
  narrationStyle: string;
  narrationSpeed: number;
  selectedMusicTrack: string;
  musicVolume: number;
  fadeIn: boolean;
  fadeOut: boolean;
  audioDucking: boolean;
  enableSubtitles: boolean;
  subtitleMode: 'burned-in' | 'separate-srt';
  subtitleFontSize: 'small' | 'medium' | 'large';
  subtitlePosition: 'bottom' | 'lower-third' | 'top';
  subtitleStyle: 'black-box' | 'yellow-text' | 'white-shadow';
  enableCameraMotion: boolean;
  cameraMotionStyle: 'ken-burns' | 'slow-pan' | 'dynamic-zoom' | 'focus-tracking';
  cameraSmoothness: 'ultra-smooth' | 'standard' | 'dramatic';
  exportDestination: 'download' | 'library' | 'cloud' | 'drive' | 'dropbox';
}

interface SavedPreset {
  id: string;
  name: string;
  description: string;
  config: RenderConfig;
  isCustom?: boolean;
}

interface RenderWorkspaceProps {
  storyId: string;
  storyTitle: string;
  scenes?: StoryScene[];
  characters?: StoryCharacter[];
  timelineEvents?: any[];
  mediaItems?: any[];
  onNavigateToQueue?: () => void;
  showToast: (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    description?: string
  ) => void;
}

const DEFAULT_CONFIG: RenderConfig = {
  presetId: 'documentary',
  presetName: 'Cinematic Documentary',
  outputFormat: 'video',
  resolution: '1080p',
  frameRate: '24',
  aspectRatio: '16:9',
  bitrateQuality: 'high',
  narrationVoice: 'Warm Legacy Memoirist (Deep Male)',
  narrationLanguage: 'English (US)',
  narrationStyle: 'Reflective & Intimate',
  narrationSpeed: 1.0,
  selectedMusicTrack: 'Orchestral Heritage (Strings & Piano)',
  musicVolume: 65,
  fadeIn: true,
  fadeOut: true,
  audioDucking: true,
  enableSubtitles: true,
  subtitleMode: 'burned-in',
  subtitleFontSize: 'medium',
  subtitlePosition: 'bottom',
  subtitleStyle: 'black-box',
  enableCameraMotion: true,
  cameraMotionStyle: 'ken-burns',
  cameraSmoothness: 'ultra-smooth',
  exportDestination: 'download',
};

const PREBUILT_PRESETS: SavedPreset[] = [
  {
    id: 'documentary',
    name: 'Cinematic Documentary',
    description: '4K/1080p 16:9 full-length feature with Ken Burns motions & voiceover.',
    config: {
      ...DEFAULT_CONFIG,
      presetId: 'documentary',
      presetName: 'Cinematic Documentary',
      resolution: '1080p',
      frameRate: '24',
      aspectRatio: '16:9',
      bitrateQuality: 'high',
    },
  },
  {
    id: 'memorial-tribute',
    name: 'Memorial Tribute',
    description: 'Gentle pacing, warm acoustic score, soft transitions & burned-in captions.',
    config: {
      ...DEFAULT_CONFIG,
      presetId: 'memorial-tribute',
      presetName: 'Memorial Tribute',
      resolution: '1080p',
      frameRate: '24',
      aspectRatio: '16:9',
      bitrateQuality: 'high',
      selectedMusicTrack: 'Golden Hour Piano (Solo)',
      narrationStyle: 'Warm & Respectful',
      cameraMotionStyle: 'slow-pan',
    },
  },
  {
    id: 'social-short',
    name: 'Mobile Social Short',
    description: '9:16 vertical short optimized for mobile sharing with high-visibility captions.',
    config: {
      ...DEFAULT_CONFIG,
      presetId: 'social-short',
      presetName: 'Mobile Social Short',
      resolution: '1080p',
      frameRate: '30',
      aspectRatio: '9:16',
      bitrateQuality: 'standard',
      subtitleFontSize: 'large',
      subtitleStyle: 'yellow-text',
    },
  },
  {
    id: 'audio-memoir',
    name: 'Audio Podcast Memoir',
    description: 'Broadcast-quality audio export with ambient score mix and vocal enhancement.',
    config: {
      ...DEFAULT_CONFIG,
      presetId: 'audio-memoir',
      presetName: 'Audio Podcast Memoir',
      outputFormat: 'audio',
      bitrateQuality: 'ultra',
    },
  },
  {
    id: 'printable-pdf',
    name: 'Printable Memoir Package',
    description: 'Full-color PDF eBook chapter compilation with archival photos and transcripts.',
    config: {
      ...DEFAULT_CONFIG,
      presetId: 'printable-pdf',
      presetName: 'Printable Memoir Package',
      outputFormat: 'pdf',
    },
  },
];

export function RenderWorkspace({
  storyId,
  storyTitle,
  scenes = [],
  characters = [],
  timelineEvents = [],
  mediaItems = [],
  onNavigateToQueue,
  showToast,
}: RenderWorkspaceProps) {
  // Load initial render configuration from localStorage
  const [config, setConfig] = useState<RenderConfig>(() => {
    const saved = localStorage.getItem(`rl_render_config_${storyId}`);
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_CONFIG;
  });

  // Custom user presets stored in localStorage
  const [userPresets, setUserPresets] = useState<SavedPreset[]>(() => {
    const saved = localStorage.getItem(`rl_user_presets_${storyId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Modal / UI states
  const [showSavePresetModal, setShowSavePresetModal] = useState<boolean>(false);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetDesc, setNewPresetDesc] = useState<string>('');
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState<boolean>(false);
  const [submittedJobId, setSubmittedJobId] = useState<string>('');

  // Save config changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem(`rl_render_config_${storyId}`, JSON.stringify(config));
  }, [config, storyId]);

  // Save user custom presets to localStorage
  useEffect(() => {
    localStorage.setItem(`rl_user_presets_${storyId}`, JSON.stringify(userPresets));
  }, [userPresets, storyId]);

  // Production Readiness Audit
  const readinessAudit = useMemo(() => {
    const items = [
      {
        label: 'Story Metadata & Overview',
        passed: Boolean(storyTitle && storyTitle.trim().length > 0),
        detail: storyTitle ? `Title: "${storyTitle}"` : 'Missing story title',
      },
      {
        label: 'Timeline Milestones',
        passed: timelineEvents.length >= 2,
        detail: `${timelineEvents.length} life milestones chronologically anchored`,
      },
      {
        label: 'Character Connections',
        passed: characters.length > 0,
        detail: `${characters.length} family profiles linked`,
      },
      {
        label: 'Media Coverage',
        passed: mediaItems.length > 0,
        detail: `${mediaItems.length} archival photos & media files uploaded`,
      },
      {
        label: 'Cinematic Scenes Breakdown',
        passed: scenes.length >= 3,
        detail: `${scenes.length} structured story scenes created`,
      },
      {
        label: 'Narration Script Coverage',
        passed: scenes.length > 0 && scenes.every((s) => s.narrationText && s.narrationText.trim().length > 5),
        detail: scenes.every((s) => s.narrationText && s.narrationText.trim().length > 5)
          ? 'Narration scripts written for all scenes'
          : `${scenes.filter((s) => !s.narrationText || s.narrationText.trim().length <= 5).length} scene(s) missing scripts`,
      },
      {
        label: 'Background Music Assignment',
        passed: Boolean(config.selectedMusicTrack),
        detail: `Track: "${config.selectedMusicTrack}"`,
      },
    ];

    const passedCount = items.filter((i) => i.passed).length;
    const score = Math.round((passedCount / items.length) * 100);

    return {
      items,
      passedCount,
      totalCount: items.length,
      score,
      isReady: score >= 70,
    };
  }, [storyTitle, timelineEvents, characters, mediaItems, scenes, config.selectedMusicTrack]);

  // Estimated Production Stats
  const estimatedStats = useMemo(() => {
    // Total Runtime
    let totalSec = 0;
    scenes.forEach((s) => {
      totalSec += parseDurationToSeconds(s.estimatedDuration);
    });
    if (totalSec === 0) totalSec = 300; // fallback 5 mins

    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const runtimeStr = `${mins}m ${secs}s`;

    // Render Time multiplier based on resolution & bitrate
    let renderTimeMult = 0.4;
    if (config.resolution === '4k') renderTimeMult = 1.2;
    else if (config.resolution === '1440p') renderTimeMult = 0.8;
    else if (config.resolution === '1080p') renderTimeMult = 0.5;

    const estRenderSec = Math.round(totalSec * renderTimeMult);
    const estRenderMins = Math.floor(estRenderSec / 60);
    const estRenderSecsRemainder = estRenderSec % 60;
    const estRenderStr = `~${estRenderMins}m ${estRenderSecsRemainder}s`;

    // File Size calculation (approximate)
    let mbPerMin = 35;
    if (config.resolution === '4k') mbPerMin = 150;
    else if (config.resolution === '1440p') mbPerMin = 75;
    else if (config.resolution === '1080p') mbPerMin = 45;
    if (config.bitrateQuality === 'ultra') mbPerMin *= 1.5;
    if (config.outputFormat === 'audio') mbPerMin = 3;
    if (config.outputFormat === 'pdf') mbPerMin = 12;

    const estSizeMB = Math.round((totalSec / 60) * mbPerMin);

    return {
      runtimeStr,
      estRenderStr,
      estSizeMB,
      sceneCount: scenes.length,
      mediaCount: mediaItems.length,
      characterCount: characters.length,
    };
  }, [scenes, mediaItems, characters, config.resolution, config.bitrateQuality, config.outputFormat]);

  // Preset Handlers
  const handleApplyPreset = (preset: SavedPreset) => {
    setConfig(preset.config);
    showToast('info', 'Preset Applied', `Loaded configuration preset: "${preset.name}".`);
  };

  const handleSaveCustomPreset = () => {
    if (!newPresetName.trim()) {
      showToast('warning', 'Name Required', 'Please enter a name for your custom preset.');
      return;
    }
    const newPreset: SavedPreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || 'Custom user production configuration.',
      config: {
        ...config,
        presetId: `custom-${Date.now()}`,
        presetName: newPresetName.trim(),
      },
      isCustom: true,
    };

    setUserPresets((prev) => [...prev, newPreset]);
    setShowSavePresetModal(false);
    setNewPresetName('');
    setNewPresetDesc('');
    showToast('success', 'Preset Saved', `Custom preset "${newPreset.name}" has been saved.`);
  };

  const handleDeleteUserPreset = (presetId: string, name: string) => {
    setUserPresets((prev) => prev.filter((p) => p.id !== presetId));
    showToast('info', 'Preset Deleted', `Removed custom preset "${name}".`);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    showToast('info', 'Configuration Reset', 'Restored default recommended render settings.');
  };

  // Submit to Render Queue
  const handleSubmitToQueue = () => {
    const jobId = `job-${Date.now().toString().slice(-6)}`;
    const newJob = {
      id: jobId,
      storyId,
      storyTitle,
      config,
      stats: estimatedStats,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    // Save job into global render queue storage
    const existingQueueStr = localStorage.getItem('rl_render_queue');
    let existingQueue = [];
    if (existingQueueStr) {
      try {
        existingQueue = JSON.parse(existingQueueStr);
      } catch (e) {}
    }
    existingQueue.unshift(newJob);
    localStorage.setItem('rl_render_queue', JSON.stringify(existingQueue));

    setSubmittedJobId(jobId);
    setShowSubmissionSuccess(true);
    showToast('success', 'Submitted to Render Queue!', `Job ${jobId} added to production render pipeline.`);
  };

  return (
    <div className="space-y-6 w-full" id="render-workspace-root">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-6 rounded-3xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Export Configuration Studio
            </span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded uppercase">
              {storyTitle}
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-black text-foreground uppercase tracking-wide flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cinema-amber-500" /> Render Workspace
          </h2>
          <p className="text-xs text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Configure resolution, narration, soundtrack audio ducking, burned-in subtitles, and camera motion settings before dispatching your story project to the Render Queue.
          </p>
        </div>

        {/* Top Header Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              showToast('info', 'Project Validation Complete', `Production score: ${readinessAudit.score}%. ${readinessAudit.passedCount} of ${readinessAudit.totalCount} audit rules passed.`);
            }}
            className="px-3.5 py-2.5 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Validate Project
          </button>

          <button
            onClick={() => setShowSavePresetModal(true)}
            className="px-3.5 py-2.5 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <Bookmark className="w-3.5 h-3.5 text-cinema-amber-500" />
            Save Preset
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* SUCCESS SUBMISSION BANNER */}
      {showSubmissionSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shrink-0 font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Job #{submittedJobId} Queued
                </span>
                <span className="text-xs text-muted-foreground">• Ready for Processing</span>
              </div>
              <h3 className="font-display font-bold text-base text-foreground">
                Story Sent to Global Render Queue
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Your render configuration and pipeline instructions have been saved. You can monitor cluster rendering progress in the Render Queue dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setShowSubmissionSuccess(false)}
              className="px-4 py-2 bg-muted hover:bg-border text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer font-mono uppercase"
            >
              Keep Editing
            </button>
            {onNavigateToQueue && (
              <button
                onClick={onNavigateToQueue}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                Go to Render Queue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* SECTION 1: PRODUCTION READINESS SUMMARY */}
      <div className="p-6 bg-card border border-border rounded-3xl space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
              Pre-Flight Validation
            </span>
            <h3 className="font-display font-bold text-base text-foreground uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Production Readiness Summary
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-mono font-black text-cinema-amber-500">
                {readinessAudit.score}%
              </span>
              <span className="block text-[9px] font-mono font-bold uppercase text-muted-foreground">
                {readinessAudit.isReady ? 'Production Ready' : 'Incomplete'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-cinema-amber-500/20 border-t-cinema-amber-500 flex items-center justify-center font-mono text-xs font-bold text-foreground">
              {readinessAudit.passedCount}/{readinessAudit.totalCount}
            </div>
          </div>
        </div>

        {/* Audit Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {readinessAudit.items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 border rounded-2xl flex items-start gap-3 transition-all text-xs ${
                item.passed
                  ? 'bg-muted/30 border-border/80'
                  : 'bg-amber-500/5 border-amber-500/30'
              }`}
            >
              {item.passed ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-foreground block">{item.label}</span>
                <span className="text-[11px] text-muted-foreground font-medium block leading-tight">
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: RENDER PRESETS / PRODUCTION PRESETS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cinema-amber-500" /> Production Presets
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
            Select standard or custom presets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...PREBUILT_PRESETS, ...userPresets].map((preset) => {
            const isSelected = config.presetId === preset.id || config.presetName === preset.name;
            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-5 bg-card border rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-3 hover:shadow-md relative ${
                  isSelected
                    ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500 bg-cinema-amber-500/[0.03]'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground font-display uppercase tracking-wide">
                      {preset.name}
                    </span>
                    {preset.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUserPreset(preset.id, preset.name);
                        }}
                        className="text-muted-foreground hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className="text-muted-foreground uppercase">
                    {preset.config.resolution} • {preset.config.aspectRatio} • {preset.config.outputFormat}
                  </span>
                  <span className={isSelected ? 'text-cinema-amber-500' : 'text-muted-foreground'}>
                    {isSelected ? 'ACTIVE ✓' : 'LOAD'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: DETAILED CONFIGURATION PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: FORMAT & VIDEO SETTINGS */}
        <div className="space-y-6">
          {/* OUTPUT FORMAT & RESOLUTION */}
          <div className="p-6 bg-card border border-border rounded-3xl space-y-5 shadow-xs">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <Video className="w-4 h-4 text-cinema-amber-500" /> Video & Format Configuration
            </h3>

            {/* Output Format Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                Output Format Target
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'video', label: 'Documentary Video (.mp4)', icon: Film },
                  { id: 'audio', label: 'Audio Podcast (.mp3)', icon: Mic },
                  { id: 'pdf', label: 'Printable Memoir (.pdf)', icon: FileText },
                  { id: 'archive', label: 'Archive Zip Package (.zip)', icon: HardDrive },
                ].map((fmt) => {
                  const IconC = fmt.icon;
                  const isSel = config.outputFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setConfig({ ...config, outputFormat: fmt.id as any })}
                      className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                        isSel
                          ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500 shadow-xs'
                          : 'bg-muted/40 text-muted-foreground hover:text-foreground border-border'
                      }`}
                    >
                      <IconC className="w-4 h-4 shrink-0" />
                      <span className="truncate">{fmt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                Video Resolution
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '720p', label: '720p HD' },
                  { id: '1080p', label: '1080p Full HD' },
                  { id: '1440p', label: '1440p 2K' },
                  { id: '4k', label: '4K Ultra HD' },
                ].map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setConfig({ ...config, resolution: res.id as any })}
                    className={`py-2 px-1 text-center font-mono text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      config.resolution === res.id
                        ? 'bg-cinema-amber-500/20 text-cinema-amber-500 border-cinema-amber-500'
                        : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate & Aspect Ratio Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                  Frame Rate
                </label>
                <select
                  value={config.frameRate}
                  onChange={(e) => setConfig({ ...config, frameRate: e.target.value as any })}
                  className="w-full bg-muted border border-border text-foreground text-xs font-mono font-bold rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="24">24 fps (Cinematic Film)</option>
                  <option value="30">30 fps (Broadcast Standard)</option>
                  <option value="60">60 fps (Ultra Smooth)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                  Aspect Ratio
                </label>
                <select
                  value={config.aspectRatio}
                  onChange={(e) => setConfig({ ...config, aspectRatio: e.target.value as any })}
                  className="w-full bg-muted border border-border text-foreground text-xs font-mono font-bold rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="16:9">16:9 (Landscape / TV)</option>
                  <option value="9:16">9:16 (Vertical Mobile)</option>
                  <option value="1:1">1:1 (Square Social)</option>
                </select>
              </div>
            </div>

            {/* Bitrate Quality */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                Bitrate Encoding Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard (12 Mbps)' },
                  { id: 'high', label: 'High (24 Mbps)' },
                  { id: 'ultra', label: 'ProRes / Ultra (50 Mbps)' },
                ].map((bq) => (
                  <button
                    key={bq.id}
                    onClick={() => setConfig({ ...config, bitrateQuality: bq.id as any })}
                    className={`p-2 text-center text-[11px] font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      config.bitrateQuality === bq.id
                        ? 'bg-cinema-amber-500/20 text-cinema-amber-500 border-cinema-amber-500'
                        : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {bq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CAMERA MOTION SETTINGS */}
          <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-cinema-amber-500" /> Camera Motion Engine
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={config.enableCameraMotion}
                  onChange={(e) => setConfig({ ...config, enableCameraMotion: e.target.checked })}
                  className="accent-cinema-amber-500 rounded"
                />
                Enable Ken Burns
              </label>
            </div>

            {config.enableCameraMotion && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="font-mono font-bold text-muted-foreground uppercase block">
                    Pan & Zoom Animation Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'ken-burns', label: 'Classic Ken Burns' },
                      { id: 'slow-pan', label: 'Gentle Slow Pan' },
                      { id: 'dynamic-zoom', label: 'Dynamic Zoom In/Out' },
                      { id: 'focus-tracking', label: 'Face Detect Focus' },
                    ].map((ms) => (
                      <button
                        key={ms.id}
                        onClick={() => setConfig({ ...config, cameraMotionStyle: ms.id as any })}
                        className={`p-2.5 rounded-xl border font-mono text-left font-bold transition-all cursor-pointer ${
                          config.cameraMotionStyle === ms.id
                            ? 'bg-cinema-amber-500/20 text-cinema-amber-500 border-cinema-amber-500'
                            : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {ms.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono font-bold text-muted-foreground uppercase block">
                    Motion Easing & Smoothness
                  </label>
                  <select
                    value={config.cameraSmoothness}
                    onChange={(e) => setConfig({ ...config, cameraSmoothness: e.target.value as any })}
                    className="w-full bg-muted border border-border text-foreground font-mono font-bold rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="ultra-smooth">Ultra-Smooth (Documentary Standard)</option>
                    <option value="standard">Standard Linear</option>
                    <option value="dramatic">Dramatic Fast Zoom</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AUDIO, SUBTITLES & EXPORT DESTINATION */}
        <div className="space-y-6">
          {/* NARRATION & MUSIC AUDIO CONFIGURATION */}
          <div className="p-6 bg-card border border-border rounded-3xl space-y-5 shadow-xs">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <Volume2 className="w-4 h-4 text-cinema-amber-500" /> Narration & Soundtrack Mix
            </h3>

            {/* Selected Voiceover */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                Assigned Voiceover Narrator
              </label>
              <select
                value={config.narrationVoice}
                onChange={(e) => setConfig({ ...config, narrationVoice: e.target.value })}
                className="w-full bg-muted border border-border text-foreground text-xs font-bold rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Warm Legacy Memoirist (Deep Male)">Warm Legacy Memoirist (Deep Male)</option>
                <option value="Gentle Family Biographer (Soft Female)">Gentle Family Biographer (Soft Female)</option>
                <option value="Classic Broadcaster (Authoritative)">Classic Broadcaster (Authoritative)</option>
                <option value="Nostalgic Storyteller (Warm Tone)">Nostalgic Storyteller (Warm Tone)</option>
              </select>
            </div>

            {/* Music Track & Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  Background Score Track
                </label>
                <span className="text-xs font-mono font-bold text-cinema-amber-500">
                  {config.musicVolume}% Vol
                </span>
              </div>
              <select
                value={config.selectedMusicTrack}
                onChange={(e) => setConfig({ ...config, selectedMusicTrack: e.target.value })}
                className="w-full bg-muted border border-border text-foreground text-xs font-bold rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Orchestral Heritage (Strings & Piano)">Orchestral Heritage (Strings & Piano)</option>
                <option value="Acoustic Nostalgia (Guitar)">Acoustic Nostalgia (Guitar)</option>
                <option value="Golden Hour Piano (Solo)">Golden Hour Piano (Solo)</option>
                <option value="Cinematic Ambient Waves">Cinematic Ambient Waves</option>
              </select>

              {/* Volume Slider & Ducking Toggle */}
              <div className="space-y-2 pt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.musicVolume}
                  onChange={(e) => setConfig({ ...config, musicVolume: parseInt(e.target.value, 10) })}
                  className="w-full accent-cinema-amber-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                    <input
                      type="checkbox"
                      checked={config.audioDucking}
                      onChange={(e) => setConfig({ ...config, audioDucking: e.target.checked })}
                      className="accent-cinema-amber-500 rounded"
                    />
                    Smart Audio Ducking
                  </label>
                  <span className="text-[10px] text-muted-foreground">Lower music during voiceover</span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBTITLE CONFIGURATION */}
          <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-cinema-amber-500" /> Subtitles & Captions
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={config.enableSubtitles}
                  onChange={(e) => setConfig({ ...config, enableSubtitles: e.target.checked })}
                  className="accent-cinema-amber-500 rounded"
                />
                Include Captions
              </label>
            </div>

            {config.enableSubtitles && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-mono font-bold text-muted-foreground uppercase block">
                      Caption Delivery Mode
                    </label>
                    <select
                      value={config.subtitleMode}
                      onChange={(e) => setConfig({ ...config, subtitleMode: e.target.value as any })}
                      className="w-full bg-muted border border-border text-foreground font-mono font-bold rounded-xl p-2 focus:outline-none"
                    >
                      <option value="burned-in">Burned-In Open Captions</option>
                      <option value="separate-srt">Export Separate .SRT File</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono font-bold text-muted-foreground uppercase block">
                      Caption Position
                    </label>
                    <select
                      value={config.subtitlePosition}
                      onChange={(e) => setConfig({ ...config, subtitlePosition: e.target.value as any })}
                      className="w-full bg-muted border border-border text-foreground font-mono font-bold rounded-xl p-2 focus:outline-none"
                    >
                      <option value="bottom">Bottom Center</option>
                      <option value="lower-third">Lower Third Box</option>
                      <option value="top">Top Overlay</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold text-muted-foreground uppercase block">
                    Caption Visual Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'black-box', label: 'Black Box Pad' },
                      { id: 'yellow-text', label: 'Yellow High-Vis' },
                      { id: 'white-shadow', label: 'White Shadow' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setConfig({ ...config, subtitleStyle: st.id as any })}
                        className={`p-2 rounded-xl border font-mono text-center font-bold transition-all cursor-pointer ${
                          config.subtitleStyle === st.id
                            ? 'bg-cinema-amber-500/20 text-cinema-amber-500 border-cinema-amber-500'
                            : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EXPORT DESTINATION */}
          <div className="p-6 bg-card border border-border rounded-3xl space-y-3 shadow-xs">
            <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <FolderPlus className="w-4 h-4 text-cinema-amber-500" /> Export Destination Target
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
              {[
                { id: 'download', label: 'Direct Download (.mp4)' },
                { id: 'library', label: 'ReelLegacy Cloud Vault' },
                { id: 'drive', label: 'Google Drive (OAuth)' },
                { id: 'dropbox', label: 'Dropbox Sync' },
              ].map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setConfig({ ...config, exportDestination: dest.id as any })}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    config.exportDestination === dest.id
                      ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500 shadow-xs'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground border-border'
                  }`}
                >
                  {dest.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: ESTIMATED PRODUCTION INFO & PRIMARY SUBMIT ACTION */}
      <div className="p-6 bg-card border border-border rounded-3xl space-y-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
              Execution Estimate
            </span>
            <h3 className="font-display font-bold text-base text-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-cinema-amber-500" /> Estimated Production Metrics
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="bg-muted px-3 py-1.5 rounded-xl border border-border">
              <span className="text-muted-foreground">Est. Runtime: </span>
              <strong className="text-foreground font-bold">{estimatedStats.runtimeStr}</strong>
            </div>

            <div className="bg-muted px-3 py-1.5 rounded-xl border border-border">
              <span className="text-muted-foreground">Est. Render Time: </span>
              <strong className="text-cinema-amber-500 font-bold">{estimatedStats.estRenderStr}</strong>
            </div>

            <div className="bg-muted px-3 py-1.5 rounded-xl border border-border">
              <span className="text-muted-foreground">Est. File Size: </span>
              <strong className="text-foreground font-bold">~{estimatedStats.estSizeMB} MB</strong>
            </div>
          </div>
        </div>

        {/* Primary Submit Button Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-foreground">Ready to Dispatch Render Job</h4>
            <p className="text-[11px] text-muted-foreground font-medium">
              Submitting saves your export preset configuration and registers job #{`job-${Date.now().toString().slice(-6)}`} in the processing queue.
            </p>
          </div>

          <button
            onClick={handleSubmitToQueue}
            className="w-full sm:w-auto px-8 py-3.5 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider shrink-0"
            id="btn-submit-to-render-queue"
          >
            <Zap className="w-5 h-5 fill-current" />
            Submit to Render Queue
          </button>
        </div>
      </div>

      {/* SAVE PRESET MODAL */}
      <AnimatePresence>
        {showSavePresetModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display font-bold text-base text-foreground uppercase tracking-wide flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-cinema-amber-500" /> Save Render Preset
                </h3>
                <button
                  onClick={() => setShowSavePresetModal(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground font-medium">
                Save your current resolution, voiceover, score, and motion settings as a reusable production preset.
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                    Preset Name
                  </label>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="e.g., Ultra 4K Memorial Master"
                    className="w-full bg-muted border border-border text-foreground text-xs rounded-xl p-2.5 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-muted-foreground uppercase block">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newPresetDesc}
                    onChange={(e) => setNewPresetDesc(e.target.value)}
                    placeholder="Brief summary of preset choices..."
                    rows={2}
                    className="w-full bg-muted border border-border text-foreground text-xs rounded-xl p-2.5 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setShowSavePresetModal(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground hover:text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomPreset}
                  className="px-5 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  Save Preset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
