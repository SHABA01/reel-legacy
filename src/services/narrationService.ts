/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NarrationSegment,
  VoiceProfile,
  PronunciationRule,
  NarrationProjectStats,
  NarrationVersion,
  AISuggestion,
  SubtitleCue
} from '../types/narration';

export const INITIAL_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'voice-1',
    name: 'Arthur Sterling',
    title: 'Warm Grandfather',
    category: 'Family Member',
    gender: 'Male',
    ageGroup: 'Elderly',
    accent: 'New England Heritage',
    description: 'Resonant, gentle elder voice with subtle coastal cadence and deep emotional warmth.',
    speed: 0.95,
    pitch: 0.92,
    stability: 88,
    emotion: 'Warm',
    pauseStyle: 'Natural',
    tags: ['Grandfather', 'Authentic', 'Heartfelt', 'Storyteller'],
    sampleAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg'
  },
  {
    id: 'voice-2',
    name: 'Eleanor Vance',
    title: 'Gentle Grandmother',
    category: 'Family Member',
    gender: 'Female',
    ageGroup: 'Elderly',
    accent: 'Mid-Atlantic Traditional',
    description: 'Soft-spoken, melodic grandmotherly voice filled with nostalgia and maternal affection.',
    speed: 0.90,
    pitch: 1.05,
    stability: 92,
    emotion: 'Nostalgic',
    pauseStyle: 'Dramatic',
    tags: ['Grandmother', 'Poetic', 'Soft', 'Memoir'],
    sampleAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg'
  },
  {
    id: 'voice-3',
    name: 'David Atten-style',
    title: 'Professional Narrator',
    category: 'Documentary Narrator',
    gender: 'Male',
    ageGroup: 'Adult',
    accent: 'BBC Standard English',
    description: 'Authoritative, captivating cinematic documentary narrator built for historical epics.',
    speed: 1.0,
    pitch: 0.98,
    stability: 96,
    emotion: 'Authoritative',
    pauseStyle: 'Cinematic',
    tags: ['BBC', 'Historical', 'Cinematic', 'Polished'],
    sampleAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg'
  },
  {
    id: 'voice-4',
    name: 'Clara Hughes',
    title: 'Historical Documentary Female',
    category: 'Documentary Narrator',
    gender: 'Female',
    ageGroup: 'Adult',
    accent: 'Transatlantic Classic',
    description: 'Crisp, eloquent female documentary host with immaculate articulation and poise.',
    speed: 1.02,
    pitch: 1.10,
    stability: 94,
    emotion: 'Inspirational',
    pauseStyle: 'Cinematic',
    tags: ['PBS', 'Biography', 'Eloquent', 'Clear'],
    sampleAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg'
  },
  {
    id: 'voice-5',
    name: 'Young Arthur (1950s)',
    title: 'Young Adult Veteran',
    category: 'AI Voice Clone',
    gender: 'Male',
    ageGroup: 'Young Adult',
    accent: 'Boston Urban',
    description: 'Eager, spirited young veteran voice synthesized from vintage cassette letters.',
    speed: 1.05,
    pitch: 1.15,
    stability: 82,
    emotion: 'Dramatic',
    pauseStyle: 'Rapid',
    tags: ['Archival', 'Letters', '1950s', 'Youthful'],
    sampleAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg'
  }
];

export const INITIAL_PRONUNCIATION_RULES: PronunciationRule[] = [
  {
    id: 'pron-1',
    term: 'Kennebunkport',
    phonetic: 'KEN-i-bunk-port',
    preferred: 'KEN-uh-bunk-port',
    alias: 'The Port',
    language: 'English (US)',
    notes: 'Emphasis on first syllable, coastal Maine pronunciation.'
  },
  {
    id: 'pron-2',
    term: 'Holyoke',
    phonetic: 'HOLE-yoke',
    preferred: 'HOLE-yoke',
    alias: 'Mount Holyoke',
    language: 'English (US)',
    notes: 'Long O sound in first syllable.'
  },
  {
    id: 'pron-3',
    term: 'Schowenburg',
    phonetic: 'SKOH-wen-burg',
    preferred: 'SHOW-en-berg',
    alias: 'Ancestral Farm',
    language: 'German-Dutch',
    notes: 'Soft sh- sound per family heritage recording.'
  }
];

export const INITIAL_NARRATION_SEGMENTS: NarrationSegment[] = [
  {
    id: 'seg-101',
    sceneId: 'scene-1',
    actTitle: 'Act I: Origins & Shoreline',
    chapterTitle: 'Chapter 1: Childhood on the Coast',
    sceneTitle: 'Scene 1: Dawn at Kennebunkport (1944)',
    sceneOrder: 1,
    text: 'Every morning before the harbor fog lifted, Arthur stood beside his father on the cobblestone dock, watching the lobster boats slip into the Atlantic haze. The salt air smelled of pine and damp tide.',
    speakingDurationEstimateSec: 18,
    actualDurationSec: 18.5,
    wordCount: 34,
    readingDifficulty: 'Cinematic',
    tone: 'Reflective',
    pronunciationHints: ['Kennebunkport (KEN-uh-bunk-port)'],
    characterReferences: ['Grandpa Arthur', 'Great-Grandfather Thomas'],
    timelineReferences: ['Summer 1944', 'Kennebunkport Dock'],
    activeVoiceId: 'voice-1',
    status: 'Approved',
    versions: [
      {
        id: 'v-101-1',
        type: 'original',
        label: 'Take 1 - Studio Microphone',
        durationSec: 18.5,
        createdAt: '2026-07-24T10:15:00Z',
        createdBy: 'Arthur Sterling',
        isSelected: true,
        waveformData: [0.2, 0.4, 0.8, 0.9, 0.6, 0.3, 0.7, 0.85, 0.5, 0.2, 0.6, 0.9, 0.4, 0.1]
      },
      {
        id: 'v-101-2',
        type: 'ai_generated',
        label: 'AI Synthesis - Cinematic BBC',
        durationSec: 17.8,
        createdAt: '2026-07-25T14:20:00Z',
        createdBy: 'Director AI',
        isSelected: false,
        waveformData: [0.15, 0.35, 0.75, 0.85, 0.55, 0.25, 0.65, 0.8, 0.45, 0.15, 0.55, 0.85, 0.35, 0.1]
      }
    ],
    activeVersionId: 'v-101-1',
    subtitles: [
      { id: 'sub-1', startTime: 0, endTime: 4.5, text: 'Every morning before the harbor fog lifted,' },
      { id: 'sub-2', startTime: 4.5, endTime: 11.2, text: 'Arthur stood beside his father on the cobblestone dock,' },
      { id: 'sub-3', startTime: 11.2, endTime: 18.5, text: 'watching the lobster boats slip into the Atlantic haze.' }
    ],
    audioQualityScore: 94,
    qualityIssues: [],
    musicDuckingDb: -12,
    sceneThumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    lastEdited: '2026-07-25T16:30:00Z'
  },
  {
    id: 'seg-102',
    sceneId: 'scene-2',
    actTitle: 'Act I: Origins & Shoreline',
    chapterTitle: 'Chapter 1: Childhood on the Coast',
    sceneTitle: 'Scene 2: The Old Farmhouse Kitchen',
    sceneOrder: 2,
    text: 'Inside the kitchen, Grandmother Margaret stirred the woodstove kettle. The kitchen was the heart of the house, where three generations gathered to hear ocean stories and shell navy beans.',
    speakingDurationEstimateSec: 16,
    actualDurationSec: 16.0,
    wordCount: 30,
    readingDifficulty: 'Easy',
    tone: 'Warm',
    pronunciationHints: [],
    characterReferences: ['Grandmother Margaret'],
    timelineReferences: ['Fall 1946', 'Farmhouse Kitchen'],
    activeVoiceId: 'voice-2',
    status: 'Recorded',
    versions: [
      {
        id: 'v-102-1',
        type: 'original',
        label: 'Tape Transfer 1982',
        durationSec: 16.0,
        createdAt: '2026-07-23T09:00:00Z',
        createdBy: 'Archive Digitization',
        isSelected: true,
        waveformData: [0.1, 0.3, 0.5, 0.7, 0.6, 0.4, 0.8, 0.9, 0.7, 0.3, 0.2, 0.5, 0.6, 0.2]
      }
    ],
    activeVersionId: 'v-102-1',
    subtitles: [
      { id: 'sub-4', startTime: 0, endTime: 6.0, text: 'Inside the kitchen, Grandmother Margaret stirred the woodstove kettle.' },
      { id: 'sub-5', startTime: 6.0, endTime: 16.0, text: 'The kitchen was the heart of the house, where three generations gathered.' }
    ],
    audioQualityScore: 78,
    qualityIssues: [
      {
        id: 'q-1',
        type: 'noise',
        severity: 'medium',
        description: 'Low-frequency tape hiss detected in background.',
        recommendation: 'Apply AI Spectral De-noise to elevate voice isolation.'
      }
    ],
    musicDuckingDb: -10,
    sceneThumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    lastEdited: '2026-07-24T12:00:00Z'
  },
  {
    id: 'seg-103',
    sceneId: 'scene-3',
    actTitle: 'Act II: Service & Academia',
    chapterTitle: 'Chapter 2: College & Service Years',
    sceneTitle: 'Scene 3: Mount Holyoke Lecture Hall (1965)',
    sceneOrder: 3,
    text: 'When Arthur accepted the chair of European History at Mount Holyoke, he brought an unconventional living-history method to his seminars. Students still talk about his dramatic lectures on European diplomacy.',
    speakingDurationEstimateSec: 21,
    actualDurationSec: 21.0,
    wordCount: 33,
    readingDifficulty: 'Cinematic',
    tone: 'Inspirational',
    pronunciationHints: ['Holyoke (HOLE-yoke)'],
    characterReferences: ['Prof. Arthur Sterling'],
    timelineReferences: ['Autumn 1965', 'Mount Holyoke College'],
    activeVoiceId: 'voice-3',
    status: 'AI Generated',
    versions: [
      {
        id: 'v-103-1',
        type: 'ai_generated',
        label: 'ElevenLabs Studio - Prof Narrator',
        durationSec: 21.0,
        createdAt: '2026-07-26T08:00:00Z',
        createdBy: 'AI Generator',
        isSelected: true,
        waveformData: [0.3, 0.6, 0.8, 0.95, 0.7, 0.4, 0.85, 0.9, 0.6, 0.3, 0.7, 0.8, 0.5, 0.2]
      }
    ],
    activeVersionId: 'v-103-1',
    subtitles: [
      { id: 'sub-6', startTime: 0, endTime: 8.0, text: 'When Arthur accepted the chair of European History at Mount Holyoke,' },
      { id: 'sub-7', startTime: 8.0, endTime: 21.0, text: 'he brought an unconventional living-history method to his seminars.' }
    ],
    audioQualityScore: 98,
    qualityIssues: [],
    musicDuckingDb: -14,
    sceneThumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    lastEdited: '2026-07-26T08:00:00Z'
  },
  {
    id: 'seg-104',
    sceneId: 'scene-4',
    actTitle: 'Act II: Service & Academia',
    chapterTitle: 'Chapter 2: College & Service Years',
    sceneTitle: 'Scene 4: The Golden Anniversary Reunion',
    sceneOrder: 4,
    text: 'Fifty years later, surrounded by fifty-two descendants, Arthur looked across the beach bonfire and smiled. "We built more than memories," he remarked gently. "We built a harbor for everyone who comes after."',
    speakingDurationEstimateSec: 22,
    actualDurationSec: 0,
    wordCount: 35,
    readingDifficulty: 'Moderate',
    tone: 'Solemn',
    pronunciationHints: [],
    characterReferences: ['Grandpa Arthur', 'Family Descendants'],
    timelineReferences: ['Summer 2022', 'Family Reunion Beach'],
    activeVoiceId: 'voice-1',
    status: 'Needs Recording',
    versions: [],
    activeVersionId: '',
    subtitles: [],
    audioQualityScore: 0,
    qualityIssues: [
      {
        id: 'q-2',
        type: 'silence',
        severity: 'high',
        description: 'Scene narration voice clip is currently missing.',
        recommendation: 'Record family voice live or generate AI narration.'
      }
    ],
    musicDuckingDb: -12,
    sceneThumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    lastEdited: '2026-07-25T11:00:00Z'
  }
];

export class NarrationService {
  private static instance = new NarrationService();

  private segments: NarrationSegment[] = [...INITIAL_NARRATION_SEGMENTS];
  private voiceProfiles: VoiceProfile[] = [...INITIAL_VOICE_PROFILES];
  private pronunciationRules: PronunciationRule[] = [...INITIAL_PRONUNCIATION_RULES];
  private listeners: Array<() => void> = [];

  public static getInstance(): NarrationService {
    return NarrationService.instance;
  }

  public static getSegments(): NarrationSegment[] {
    return NarrationService.instance.getSegments();
  }

  public static getSegmentById(id: string): NarrationSegment | undefined {
    return NarrationService.instance.getSegmentById(id);
  }

  public static getVoiceProfiles(): VoiceProfile[] {
    return NarrationService.instance.getVoiceProfiles();
  }

  public static getVoiceById(id: string): VoiceProfile | undefined {
    return NarrationService.instance.getVoiceById(id);
  }

  public static getPronunciationRules(): PronunciationRule[] {
    return NarrationService.instance.getPronunciationRules();
  }

  public static getProjectStats(): NarrationProjectStats {
    return NarrationService.instance.getStats();
  }

  public static updateSegmentText(segmentId: string, text: string): NarrationSegment | undefined {
    return NarrationService.instance.updateSegmentText(segmentId, text);
  }

  public static assignVoiceProfile(segmentId: string, voiceId: string): NarrationSegment | undefined {
    return NarrationService.instance.updateSegmentVoice(segmentId, voiceId);
  }

  public static updateVoiceSettings(segmentId: string, speed: number, pitch: number, duckingDb: number): NarrationSegment | undefined {
    const seg = NarrationService.instance.getSegmentById(segmentId);
    if (!seg) return undefined;
    seg.musicDuckingDb = duckingDb;
    const voice = NarrationService.instance.getVoiceById(seg.activeVoiceId);
    if (voice) {
      voice.speed = speed;
      voice.pitch = pitch;
    }
    NarrationService.instance.notify();
    return seg;
  }

  public static addVersion(segmentId: string, version: NarrationVersion): NarrationSegment | undefined {
    return NarrationService.instance.addVersionToSegment(segmentId, version);
  }

  public static selectVersion(segmentId: string, versionId: string): NarrationSegment | undefined {
    return NarrationService.instance.selectVersion(segmentId, versionId);
  }

  public static addPronunciationRule(rule: Omit<PronunciationRule, 'id'>): PronunciationRule {
    return NarrationService.instance.addPronunciationRule(rule);
  }

  public static addVoiceProfile(profile: Omit<VoiceProfile, 'id'>): VoiceProfile {
    return NarrationService.instance.addVoiceProfile(profile);
  }

  public static subscribe(listener: () => void): () => void {
    return NarrationService.instance.subscribe(listener);
  }

  public getSegments(): NarrationSegment[] {
    return this.segments;
  }

  public getSegmentById(id: string): NarrationSegment | undefined {
    return this.segments.find(s => s.id === id);
  }

  public getVoiceProfiles(): VoiceProfile[] {
    return this.voiceProfiles;
  }

  public getVoiceById(id: string): VoiceProfile | undefined {
    return this.voiceProfiles.find(v => v.id === id);
  }

  public getPronunciationRules(): PronunciationRule[] {
    return this.pronunciationRules;
  }

  public getStats(): NarrationProjectStats {
    const scenesTotal = this.segments.length;
    const scenesNarrated = this.segments.filter(s => s.status === 'Approved' || s.status === 'Recorded' || s.status === 'AI Generated' || s.status === 'Synced').length;
    const scenesMissing = this.segments.filter(s => s.status === 'Needs Recording' || s.status === 'Draft').length;

    let recordedSec = 0;
    let aiSec = 0;

    this.segments.forEach(s => {
      if (s.status === 'Recorded' || s.status === 'Approved') recordedSec += s.actualDurationSec || s.speakingDurationEstimateSec;
      if (s.status === 'AI Generated') aiSec += s.actualDurationSec || s.speakingDurationEstimateSec;
    });

    const recordedMinutes = parseFloat((recordedSec / 60).toFixed(1));
    const generatedAiMinutes = parseFloat((aiSec / 60).toFixed(1));
    const estimatedRemainingMin = parseFloat((scenesMissing * 20 / 60).toFixed(1));

    const overallProgress = scenesTotal > 0 ? Math.round((scenesNarrated / scenesTotal) * 100) : 0;
    const totalQualityScores = this.segments.filter(s => s.audioQualityScore > 0).map(s => s.audioQualityScore);
    const voiceQualityScore = totalQualityScores.length > 0
      ? Math.round(totalQualityScores.reduce((a, b) => a + b, 0) / totalQualityScores.length)
      : 85;

    const readinessScore = Math.round((overallProgress * 0.6) + (voiceQualityScore * 0.4));

    return {
      overallProgress,
      scenesTotal,
      scenesNarrated,
      scenesMissing,
      recordedMinutes,
      generatedAiMinutes,
      estimatedRemainingMin,
      voiceQualityScore,
      readinessScore
    };
  }

  public updateSegmentText(segmentId: string, text: string): NarrationSegment | undefined {
    const seg = this.segments.find(s => s.id === segmentId);
    if (!seg) return undefined;

    seg.text = text;
    seg.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    seg.speakingDurationEstimateSec = Math.max(3, Math.round(seg.wordCount / 2.3));
    seg.lastEdited = new Date().toISOString();

    // Auto update subtitles
    this.recalculateSubtitles(seg);

    this.notify();
    return seg;
  }

  public updateSegmentVoice(segmentId: string, voiceId: string): NarrationSegment | undefined {
    const seg = this.segments.find(s => s.id === segmentId);
    if (!seg) return undefined;
    seg.activeVoiceId = voiceId;
    seg.lastEdited = new Date().toISOString();
    this.notify();
    return seg;
  }

  public addVersionToSegment(segmentId: string, version: NarrationVersion): NarrationSegment | undefined {
    const seg = this.segments.find(s => s.id === segmentId);
    if (!seg) return undefined;

    // Deselect previous versions
    seg.versions.forEach(v => v.isSelected = false);
    version.isSelected = true;

    seg.versions.unshift(version);
    seg.activeVersionId = version.id;
    seg.actualDurationSec = version.durationSec;
    seg.status = version.type === 'ai_generated' ? 'AI Generated' : 'Recorded';
    seg.audioQualityScore = 92;
    seg.lastEdited = new Date().toISOString();

    this.recalculateSubtitles(seg);
    this.notify();
    return seg;
  }

  public selectVersion(segmentId: string, versionId: string): NarrationSegment | undefined {
    const seg = this.segments.find(s => s.id === segmentId);
    if (!seg) return undefined;

    const targetVer = seg.versions.find(v => v.id === versionId);
    if (!targetVer) return undefined;

    seg.versions.forEach(v => v.isSelected = (v.id === versionId));
    seg.activeVersionId = versionId;
    seg.actualDurationSec = targetVer.durationSec;
    seg.lastEdited = new Date().toISOString();

    this.recalculateSubtitles(seg);
    this.notify();
    return seg;
  }

  public addPronunciationRule(rule: Omit<PronunciationRule, 'id'>): PronunciationRule {
    const newRule: PronunciationRule = {
      id: `pron-${Date.now()}`,
      ...rule
    };
    this.pronunciationRules.push(newRule);
    this.notify();
    return newRule;
  }

  public addVoiceProfile(profile: Omit<VoiceProfile, 'id'>): VoiceProfile {
    const newProf: VoiceProfile = {
      id: `voice-${Date.now()}`,
      ...profile
    };
    this.voiceProfiles.push(newProf);
    this.notify();
    return newProf;
  }

  private recalculateSubtitles(seg: NarrationSegment) {
    if (!seg.text) {
      seg.subtitles = [];
      return;
    }
    const sentences = seg.text.match(/[^.!?]+[.!?]+/g) || [seg.text];
    const durationSec = seg.actualDurationSec || seg.speakingDurationEstimateSec || 15;
    const perSec = durationSec / Math.max(1, sentences.length);

    seg.subtitles = sentences.map((sent, idx) => ({
      id: `sub-${seg.id}-${idx}`,
      startTime: parseFloat((idx * perSec).toFixed(1)),
      endTime: parseFloat(((idx + 1) * perSec).toFixed(1)),
      text: sent.trim()
    }));
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
    window.dispatchEvent(new CustomEvent('narration-updated'));
  }
}

export const narrationService = new NarrationService();
