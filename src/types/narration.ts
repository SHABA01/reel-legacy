/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VoiceProfile {
  id: string;
  name: string;
  title: string;
  category: 'Family Member' | 'Documentary Narrator' | 'AI Voice Clone' | 'Historical Voice';
  avatar?: string;
  gender: 'Male' | 'Female' | 'Neutral';
  ageGroup: 'Child' | 'Young Adult' | 'Adult' | 'Elderly';
  accent: string;
  description: string;
  speed: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 1.5
  stability: number; // 0 - 100
  emotion: 'Warm' | 'Solemn' | 'Nostalgic' | 'Dramatic' | 'Authoritative' | 'Inspirational' | 'Calm';
  pauseStyle: 'Natural' | 'Dramatic' | 'Rapid' | 'Cinematic';
  tags: string[];
  sampleAudioUrl?: string;
}

export interface SubtitleCue {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

export type VersionType = 'original' | 'edited' | 'enhanced' | 'ai_generated' | 'alternative_take';

export interface NarrationVersion {
  id: string;
  type: VersionType;
  label: string;
  audioUrl?: string;
  durationSec: number;
  createdAt: string;
  createdBy: string;
  waveformData?: number[]; // Normalized height amplitudes 0.0 - 1.0
  isSelected: boolean;
  notes?: string;
}

export type AudioIssueSeverity = 'low' | 'medium' | 'high';

export interface AudioQualityIssue {
  id: string;
  type: 'noise' | 'echo' | 'clipping' | 'breathing' | 'silence' | 'pops' | 'low_volume' | 'inconsistent' | 'music_bleed';
  severity: AudioIssueSeverity;
  description: string;
  recommendation: string;
}

export interface AISuggestion {
  id: string;
  segmentId: string;
  type: 'pacing' | 'wording' | 'pronunciation' | 'emotion' | 'silence' | 'missing' | 'transition';
  title: string;
  message: string;
  explanation: string;
  fixLabel: string;
  fixAction: 'rewrite' | 'adjust_speed' | 'insert_pause' | 'apply_pronunciation' | 'split_sentence';
  proposedText?: string;
  proposedSpeed?: number;
}

export interface PronunciationRule {
  id: string;
  term: string;
  phonetic: string;
  preferred: string;
  alias?: string;
  language: string;
  notes?: string;
}

export type NarrationStatus = 'Draft' | 'Needs Recording' | 'Recorded' | 'AI Generated' | 'Synced' | 'Approved';

export interface NarrationSegment {
  id: string;
  sceneId: string;
  actTitle: string;
  chapterTitle: string;
  sceneTitle: string;
  sceneOrder: number;
  text: string;
  speakingDurationEstimateSec: number;
  actualDurationSec: number;
  wordCount: number;
  readingDifficulty: 'Easy' | 'Moderate' | 'Cinematic' | 'Dense';
  tone: 'Warm' | 'Reflective' | 'Dramatic' | 'Solemn' | 'Inspirational' | 'Conversational';
  pronunciationHints: string[];
  characterReferences: string[];
  timelineReferences: string[];
  activeVoiceId: string;
  status: NarrationStatus;
  versions: NarrationVersion[];
  activeVersionId: string;
  subtitles: SubtitleCue[];
  audioQualityScore: number; // 0 - 100
  qualityIssues: AudioQualityIssue[];
  musicDuckingDb: number;
  sceneThumbnailUrl?: string;
  waveformAmplitudes?: number[];
  lastEdited: string;
}

export interface NarrationProjectStats {
  overallProgress: number; // percentage
  scenesTotal: number;
  scenesNarrated: number;
  scenesMissing: number;
  recordedMinutes: number;
  generatedAiMinutes: number;
  estimatedRemainingMin: number;
  voiceQualityScore: number;
  readinessScore: number;
}

export interface RecordingSession {
  isRecording: boolean;
  isPaused: boolean;
  durationSec: number;
  audioLevels: number[];
  micDevice: string;
  gain: number;
}

export interface ExportSettings {
  format: 'wav' | 'mp3' | 'aac' | 'flac';
  sampleRate: 44100 | 48000;
  bitrate: 192 | 256 | 320;
  includeSubtitles: boolean;
  subtitleFormat: 'srt' | 'vtt' | 'json';
  separateTracks: boolean;
  applyDucking: boolean;
}
