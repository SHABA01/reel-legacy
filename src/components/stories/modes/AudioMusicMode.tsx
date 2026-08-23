/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Check,
  Plus,
  Radio,
  FileAudio,
  Upload,
  Layers,
  Wand2,
  Bookmark,
  ChevronRight,
  Info,
  Clock,
  User,
  AudioLines,
} from 'lucide-react';
import { ExtendedStory } from '../mockStoriesData';
import { StoryCharacter } from '../CharactersWorkspace';
import { StoryScene } from '../ScenesWorkspace';
import { LocalMediaItem } from './ScenesMediaMode';
import { VoiceProfile } from '../../../types/narration';
import { VoiceLibraryModal } from '../../narration/VoiceLibraryModal';

export interface AudioMusicModeProps {
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
  onUpdateStoryMeta?: (updates: any) => void;
  activeSection: string;
  onNavigateSection: (section: string) => void;

  // Scenes with Narration & Soundtrack
  scenes: StoryScene[];
  onUpdateScenes: (scenes: StoryScene[]) => void;

  // Audio / Media items
  mediaItems: LocalMediaItem[];
  characters: StoryCharacter[];

  // Toast notifications
  showToast: (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    description?: string
  ) => void;
}

// Built-in cinematic soundtrack presets for Story Studio
export const SOUNDTRACK_PRESETS = [
  {
    id: 'acoustic-nostalgia',
    title: 'Acoustic Nostalgia',
    genre: 'Acoustic Guitar & Warm Strings',
    mood: 'Warm & Intimate',
    duration: '3m 45s',
    previewUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    description: 'Gentle fingerpicked guitar with soft ambient strings, ideal for childhood memories and family heritage reflections.',
  },
  {
    id: 'orchestral-heritage',
    title: 'Orchestral Heritage',
    genre: 'Cinematic Strings & Piano',
    mood: 'Majestic & Emotional',
    duration: '4m 12s',
    previewUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
    description: 'Sweeping orchestral crescendo and expressive grand piano, crafted for turning points and historic legacy milestones.',
  },
  {
    id: 'golden-hour-piano',
    title: 'Golden Hour Piano',
    genre: 'Solo Grand Piano',
    mood: 'Reflective & Nostalgic',
    duration: '2m 50s',
    previewUrl: 'https://images.unsplash.com/photo-1520523839898-5071282543e2?w=400&q=80',
    description: 'Subtle, delicate piano chords bathed in warm reverb, tailored for intimate portraits and personal reflections.',
  },
  {
    id: 'vintage-folk-ballad',
    title: 'Vintage Folk Ballad',
    genre: 'Americana & Soft Percussion',
    mood: 'Historical Roots & Grit',
    duration: '3m 20s',
    previewUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    description: 'Rustic acoustic melodies with subtle upright bass, fitting for generational origins and journey chapters.',
  },
  {
    id: 'ambient-hope',
    title: 'Ambient Horizon',
    genre: 'Modern Ambient Synth & Cello',
    mood: 'Inspirational & Uplifting',
    duration: '3m 15s',
    previewUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
    description: 'Modern expansive pads with warm solo cello, perfect for future legacy outlooks and closing sequence reflections.',
  },
];

// Default Voice Profiles
export const DEFAULT_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'voice-warm-memoirist',
    name: 'Arthur Vance',
    title: 'Warm Legacy Memoirist',
    category: 'Documentary Narrator',
    gender: 'Male',
    ageGroup: 'Elderly',
    accent: 'North American (Warm Baritone)',
    description: 'Deep, resonant, grandfatherly cadence rich with gravitas and empathetic warmth.',
    speed: 0.95,
    pitch: 0.9,
    stability: 85,
    emotion: 'Warm',
    pauseStyle: 'Dramatic',
    tags: ['Baritone', 'Legacy', 'Memoir', 'Warm'],
  },
  {
    id: 'voice-gentle-biographer',
    name: 'Eleanor Brooks',
    title: 'Gentle Family Biographer',
    category: 'Documentary Narrator',
    gender: 'Female',
    ageGroup: 'Adult',
    accent: 'Transatlantic Gentle',
    description: 'Clear, articulate, compassionate delivery suited for biographical chronicles and heartfelt storytelling.',
    speed: 1.0,
    pitch: 1.0,
    stability: 90,
    emotion: 'Warm',
    pauseStyle: 'Natural',
    tags: ['Articulate', 'Biographer', 'Gentle', 'Storyteller'],
  },
  {
    id: 'voice-historic-chronicler',
    name: 'Julian Sterling',
    title: 'Historical Chronicler',
    category: 'Historical Voice',
    gender: 'Male',
    ageGroup: 'Adult',
    accent: 'British BBC Classic',
    description: 'Authoritative, polished documentary tone delivering historic precision and dramatic pacing.',
    speed: 1.05,
    pitch: 0.95,
    stability: 88,
    emotion: 'Authoritative',
    pauseStyle: 'Cinematic',
    tags: ['Documentary', 'BBC', 'Authoritative', 'Classic'],
  },
];

export function AudioMusicMode({
  initialStory,
  storyMeta,
  onUpdateStoryMeta,
  activeSection,
  onNavigateSection,
  scenes,
  onUpdateScenes,
  mediaItems,
  characters,
  showToast,
}: AudioMusicModeProps) {
  // Voice library and narrator settings
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>(DEFAULT_VOICE_PROFILES);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(DEFAULT_VOICE_PROFILES[0].id);
  const [isVoiceLibraryOpen, setIsVoiceLibraryOpen] = useState(false);
  const [globalSpeechRate, setGlobalSpeechRate] = useState<number>(1.0);
  const [globalEmotion, setGlobalEmotion] = useState<string>('Warm');

  // Soundtrack & audio playback state
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    storyMeta?.soundtrack?.presetId || 'acoustic-nostalgia'
  );
  const [soundtrackVolume, setSoundtrackVolume] = useState<number>(
    storyMeta?.soundtrack?.volume ?? 65
  );
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);

  // Active scene editing in Voiceover pane
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    scenes[0]?.id || ''
  );
  const [isSynthesizingAll, setIsSynthesizingAll] = useState(false);
  const [synthesizingSceneId, setSynthesizingSceneId] = useState<string | null>(null);

  // Filter audio media items from media library
  const audioMediaItems = useMemo(() => {
    return mediaItems.filter((item) => item.type === 'audio' || item.category === 'Oral Record');
  }, [mediaItems]);

  const activeScene = useMemo(() => {
    return scenes.find((s) => s.id === selectedSceneId) || scenes[0];
  }, [scenes, selectedSceneId]);

  const selectedVoice = useMemo(() => {
    return voiceProfiles.find((v) => v.id === selectedVoiceId) || voiceProfiles[0];
  }, [voiceProfiles, selectedVoiceId]);

  // Update a single scene's narration or soundtrack fields
  const handleUpdateActiveScene = (updates: Partial<StoryScene>) => {
    if (!activeScene) return;
    const updatedScenes = scenes.map((s) => (s.id === activeScene.id ? { ...s, ...updates } : s));
    onUpdateScenes(updatedScenes);
  };

  // Synthesize voiceover for a single scene
  const handleSynthesizeSceneVoiceover = (sceneId: string) => {
    setSynthesizingSceneId(sceneId);
    setTimeout(() => {
      const updatedScenes = scenes.map((s) => {
        if (s.id === sceneId) {
          return {
            ...s,
            narrationStatus: 'Synthesized' as const,
            assignedVoice: selectedVoice.name,
            estimatedReadingTime: `${Math.max(5, Math.round((s.narrationText.split(/\s+/).length / 140) * 60))}s`,
          };
        }
        return s;
      });
      onUpdateScenes(updatedScenes);
      setSynthesizingSceneId(null);
      showToast('success', 'Voiceover Synthesized', `Generated voiceover track for Scene with voice "${selectedVoice.name}".`);
    }, 900);
  };

  // Synthesize all scenes
  const handleSynthesizeAllScenes = () => {
    setIsSynthesizingAll(true);
    setTimeout(() => {
      const updatedScenes = scenes.map((s) => ({
        ...s,
        narrationStatus: 'Synthesized' as const,
        assignedVoice: selectedVoice.name,
        estimatedReadingTime: `${Math.max(5, Math.round((s.narrationText.split(/\s+/).length / 140) * 60))}s`,
      }));
      onUpdateScenes(updatedScenes);
      setIsSynthesizingAll(false);
      showToast('success', 'Full Voiceover Synthesized', `Synthesized speech for all ${scenes.length} storyboard scenes.`);
    }, 1400);
  };

  // Select soundtrack preset and synchronize to story metadata
  const handleSelectSoundtrackPreset = (preset: typeof SOUNDTRACK_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    if (onUpdateStoryMeta) {
      onUpdateStoryMeta({
        soundtrack: {
          presetId: preset.id,
          title: preset.title,
          genre: preset.genre,
          mood: preset.mood,
          volume: soundtrackVolume,
        },
      });
    }
    showToast('info', 'Soundtrack Assigned', `Assigned "${preset.title}" as primary cinematic score.`);
  };

  // Select uploaded audio asset from media library as background soundtrack
  const handleSelectUploadedAudioTrack = (media: LocalMediaItem) => {
    setSelectedPresetId(`media-${media.id}`);
    if (onUpdateStoryMeta) {
      onUpdateStoryMeta({
        soundtrack: {
          presetId: `media-${media.id}`,
          title: media.title,
          genre: 'Archival Oral Recording / Audio Track',
          mood: 'Authentic Heritage',
          volume: soundtrackVolume,
          audioUrl: media.url,
        },
      });
    }
    showToast('info', 'Audio Asset Assigned', `Assigned uploaded track "${media.title}" as story score.`);
  };

  return (
    <div className="w-full flex flex-col space-y-6" id="audio-music-mode-container">
      {/* MODE HEADER & SUB-NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <Mic className="w-4 h-4 text-cinema-amber-500" /> Audio & Music Studio
            </h3>
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20">
              MODE 3 OF 4
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure scene-level narration speech, voiceover personas, and cinematic ambient background music.
          </p>
        </div>

        {/* Sub-tab switcher: Voiceover Narration vs Soundtrack & Score */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl shrink-0">
          <button
            onClick={() => onNavigateSection('narration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'narration'
                ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Voiceover Narration ({scenes.length})
          </button>
          <button
            onClick={() => onNavigateSection('music')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'music'
                ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Soundtrack & Score
          </button>
        </div>
      </div>

      {/* 1. VOICEOVER NARRATION SUB-VIEW */}
      {activeSection === 'narration' && (
        <motion.div
          key="section-narration"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6 w-full"
          id="pane-narration-mode"
        >
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-4 rounded-2xl border border-border/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-foreground uppercase tracking-wide">
                  Active Narrator: {selectedVoice.name}
                </h4>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {selectedVoice.title} • {selectedVoice.accent}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsVoiceLibraryOpen(true)}
                className="px-3 py-1.5 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-cinema-amber-500" />
                Change Voice Profile
              </button>

              <button
                onClick={handleSynthesizeAllScenes}
                disabled={isSynthesizingAll || scenes.length === 0}
                className="px-4 py-1.5 bg-cinema-amber-500 hover:bg-cinema-amber-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                {isSynthesizingAll ? 'Synthesizing...' : 'Synthesize All Scenes'}
              </button>
            </div>
          </div>

          {/* Master Two-Column Workspace: Scene Narration List + Scene Voice Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Scene Narration Sequence Selector (4 cols) */}
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h4 className="font-display text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cinema-amber-500" /> Scene Voice Sequence
                </h4>
                <span className="text-[10px] font-mono font-bold text-muted-foreground">
                  {scenes.length} Scenes
                </span>
              </div>

              {scenes.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No scenes created yet. Generate script blueprints in Story & Cast to create storyboard scenes.
                </div>
              ) : (
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {scenes.map((scene, idx) => {
                    const isSelected = (activeScene?.id === scene.id);
                    const wordCount = scene.narrationText ? scene.narrationText.trim().split(/\s+/).length : 0;
                    const hasNarration = Boolean(scene.narrationText && scene.narrationText.trim().length > 0);

                    return (
                      <div
                        key={scene.id}
                        onClick={() => setSelectedSceneId(scene.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cinema-amber-500/10 border-cinema-amber-500 text-foreground ring-1 ring-cinema-amber-500'
                            : 'bg-muted/30 border-border hover:border-muted-foreground/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-cinema-amber-500">
                              #{scene.sceneNumber || idx + 1}
                            </span>
                            <span className="text-xs font-bold truncate max-w-[140px] text-foreground">
                              {scene.title}
                            </span>
                          </div>
                          <span
                            className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                              scene.narrationStatus === 'Synthesized'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : hasNarration
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-muted text-muted-foreground border-border'
                            }`}
                          >
                            {scene.narrationStatus || (hasNarration ? 'Scripted' : 'Draft')}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 italic font-serif">
                          {scene.narrationText ? `"${scene.narrationText}"` : 'No narration scripted yet...'}
                        </p>

                        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground mt-2 pt-1.5 border-t border-border/50">
                          <span>{wordCount} words</span>
                          <span>Est: {scene.estimatedReadingTime || `${Math.max(3, Math.round(wordCount / 2.5))}s`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Active Scene Voiceover Editor (8 cols) */}
            <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-5 space-y-5 shadow-xs">
              {activeScene ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                          SCENE #{activeScene.sceneNumber}
                        </span>
                        <h4 className="font-display font-black text-sm text-foreground uppercase tracking-wide">
                          {activeScene.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Purpose: {activeScene.purpose || activeScene.storySegment || 'Narrative Chapter'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSynthesizeSceneVoiceover(activeScene.id)}
                        disabled={synthesizingSceneId === activeScene.id || !activeScene.narrationText}
                        className="px-3.5 py-1.5 bg-cinema-amber-500 hover:bg-cinema-amber-400 disabled:opacity-50 text-black text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {synthesizingSceneId === activeScene.id ? 'Generating...' : 'Synthesize Scene Audio'}
                      </button>
                    </div>
                  </div>

                  {/* Narration Script Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Scene Spoken Script Text *
                      </label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {activeScene.narrationText?.length || 0} characters • ~{Math.max(1, Math.round((activeScene.narrationText?.split(/\s+/).length || 0) / 2.3))}s speech
                      </span>
                    </div>
                    <textarea
                      value={activeScene.narrationText || ''}
                      onChange={(e) => handleUpdateActiveScene({ narrationText: e.target.value })}
                      rows={5}
                      className="w-full bg-muted/40 border border-border rounded-xl p-3 text-xs font-serif text-foreground focus:outline-none focus:border-cinema-amber-500 leading-relaxed resize-y"
                      placeholder="Write or refine the voiceover narration spoken aloud during this scene..."
                    />
                  </div>

                  {/* Voice Tuning Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                        Assigned Voice Persona
                      </label>
                      <select
                        value={selectedVoiceId}
                        onChange={(e) => {
                          setSelectedVoiceId(e.target.value);
                          const matched = voiceProfiles.find((v) => v.id === e.target.value);
                          if (matched) {
                            handleUpdateActiveScene({ assignedVoice: matched.name });
                          }
                        }}
                        className="w-full h-9 bg-card border border-border rounded-xl px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-cinema-amber-500"
                      >
                        {voiceProfiles.map((vp) => (
                          <option key={vp.id} value={vp.id}>
                            {vp.name} ({vp.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                          Pacing Speed
                        </label>
                        <span className="text-[10px] font-mono font-bold text-cinema-amber-500">{globalSpeechRate}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.75"
                        max="1.35"
                        step="0.05"
                        value={globalSpeechRate}
                        onChange={(e) => setGlobalSpeechRate(parseFloat(e.target.value))}
                        className="w-full accent-cinema-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                        Emotional Inflection
                      </label>
                      <select
                        value={globalEmotion}
                        onChange={(e) => setGlobalEmotion(e.target.value)}
                        className="w-full h-9 bg-card border border-border rounded-xl px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-cinema-amber-500"
                      >
                        <option value="Warm">Warm & Reflective</option>
                        <option value="Solemn">Solemn & Historic</option>
                        <option value="Inspirational">Inspirational & Hopeful</option>
                        <option value="Authoritative">Authoritative & Crisp</option>
                      </select>
                    </div>
                  </div>

                  {/* Audio Status & Audio Player Bar */}
                  <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <AudioLines className="w-4 h-4 text-cinema-amber-500" />
                      <div>
                        <span className="font-bold text-foreground">Status: </span>
                        <span className="font-mono text-cinema-amber-500 font-bold">
                          {activeScene.narrationStatus || 'Scripted'}
                        </span>
                        <span className="text-muted-foreground text-[10px] ml-2">
                          ({selectedVoice.name})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        showToast('info', 'Voiceover Sample', `Playing voice test snippet for "${selectedVoice.name}"...`);
                      }}
                      className="px-3 py-1 bg-card hover:bg-muted border border-border text-foreground font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-cinema-amber-500" />
                      Preview Voice Audio
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  Select a scene on the left to configure narration voice and script lines.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. SOUNDTRACK & SCORE SUB-VIEW */}
      {activeSection === 'music' && (
        <motion.div
          key="section-music"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6 w-full"
          id="pane-music-mode"
        >
          {/* Master Soundtrack Volume & Mix Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl border border-border/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-foreground uppercase tracking-wide">
                  Global Story Soundtrack Balance
                </h4>
                <p className="text-[10px] font-mono text-muted-foreground">
                  Ducking balance: Audio drops when scene narration speaks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72">
              <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={soundtrackVolume}
                onChange={(e) => {
                  const vol = parseInt(e.target.value, 10);
                  setSoundtrackVolume(vol);
                  if (onUpdateStoryMeta) {
                    onUpdateStoryMeta({
                      soundtrack: {
                        ...(storyMeta?.soundtrack || {}),
                        volume: vol,
                      },
                    });
                  }
                }}
                className="w-full accent-cinema-amber-500"
              />
              <span className="text-xs font-mono font-bold text-cinema-amber-500 w-10 text-right">
                {soundtrackVolume}%
              </span>
            </div>
          </div>

          {/* Cinematic Soundtrack Presets Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cinema-amber-500" /> Cinematic Soundtrack Presets
              </h4>
              <span className="text-[10px] font-mono text-muted-foreground">
                Royalty-free mastered for biographical legacy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOUNDTRACK_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const isPlaying = playingPreviewId === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`p-4 bg-card border rounded-2xl flex flex-col justify-between space-y-3 transition-all relative shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500 bg-cinema-amber-500/5'
                        : 'border-border hover:border-muted-foreground/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setPlayingPreviewId(isPlaying ? null : preset.id);
                            showToast(
                              'info',
                              isPlaying ? 'Preview Paused' : 'Previewing Soundtrack',
                              `${isPlaying ? 'Stopped' : 'Playing sample for'} "${preset.title}"`
                            );
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isPlaying
                              ? 'bg-cinema-amber-500 text-black animate-pulse'
                              : 'bg-muted hover:bg-cinema-amber-500/20 text-cinema-amber-500 border border-border'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <h5 className="font-display font-bold text-xs text-foreground">
                            {preset.title}
                          </h5>
                          <span className="text-[9px] font-mono text-cinema-amber-500 font-bold block">
                            {preset.mood}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[8px] font-mono font-bold bg-cinema-amber-500 text-black px-1.5 py-0.5 rounded uppercase">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>{preset.genre}</span>
                      <span>{preset.duration}</span>
                    </div>

                    <button
                      onClick={() => handleSelectSoundtrackPreset(preset)}
                      className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cinema-amber-500 text-black shadow-xs font-black'
                          : 'bg-muted hover:bg-cinema-amber-500 hover:text-black text-foreground border border-border'
                      }`}
                    >
                      {isSelected ? '✓ Assigned as Score' : 'Select Soundtrack'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uploaded Audio Assets from Media Library */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-cinema-amber-500" /> Uploaded Audio & Oral Archives
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Assign recorded oral interviews, personal family audio, or custom music from your media assets.
                </p>
              </div>
              <button
                onClick={() => onNavigateSection('media')}
                className="px-3 py-1.5 bg-card hover:bg-muted text-foreground border border-border text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-cinema-amber-500" />
                Upload New Audio
              </button>
            </div>

            {audioMediaItems.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-2xl text-center bg-card/25">
                <FileAudio className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <h5 className="font-bold text-xs text-foreground uppercase">No Custom Audio Assets Found</h5>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  Upload audio files (.mp3, .wav, .m4a) in the Media Library to use custom background tracks or oral history recordings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {audioMediaItems.map((media) => {
                  const isSelected = selectedPresetId === `media-${media.id}`;
                  return (
                    <div
                      key={media.id}
                      className={`p-3 bg-card border rounded-xl flex items-center justify-between gap-3 ${
                        isSelected ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileAudio className="w-4 h-4 text-cinema-amber-500 shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-foreground block truncate">{media.title}</span>
                          <span className="text-[9px] font-mono text-muted-foreground">{media.size} • {media.uploadDate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectUploadedAudioTrack(media)}
                        className="px-2.5 py-1 bg-muted hover:bg-cinema-amber-500 hover:text-black text-foreground text-[10px] font-bold rounded-lg transition-colors shrink-0"
                      >
                        {isSelected ? '✓ Active' : 'Use Audio'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Voice Library Selector Modal */}
      {isVoiceLibraryOpen && (
        <VoiceLibraryModal
          isOpen={isVoiceLibraryOpen}
          onClose={() => setIsVoiceLibraryOpen(false)}
          voiceProfiles={voiceProfiles}
          selectedVoiceId={selectedVoiceId}
          onSelectVoice={(vId) => {
            setSelectedVoiceId(vId);
            const matched = voiceProfiles.find((v) => v.id === vId);
            if (matched && activeScene) {
              handleUpdateActiveScene({ assignedVoice: matched.name });
            }
          }}
          onAddVoiceProfile={(newProfile) => {
            const createdProfile: VoiceProfile = {
              ...newProfile,
              id: `voice-custom-${Date.now()}`,
            };
            setVoiceProfiles([...voiceProfiles, createdProfile]);
            setSelectedVoiceId(createdProfile.id);
            showToast('success', 'Voice Profile Created', `Added custom voice "${createdProfile.name}".`);
          }}
        />
      )}
    </div>
  );
}
