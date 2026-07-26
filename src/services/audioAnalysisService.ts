/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioQualityIssue, NarrationSegment, AISuggestion } from '../types/narration';

export class AudioAnalysisService {
  /**
   * Analyzes a narration recording or audio clip and returns quality metrics and issues
   */
  public static analyzeSegment(segment: NarrationSegment): {
    score: number;
    issues: AudioQualityIssue[];
    suggestions: AISuggestion[];
  } {
    const issues: AudioQualityIssue[] = [];
    const suggestions: AISuggestion[] = [];

    // Check 1: Missing recording
    if (segment.status === 'Needs Recording' || !segment.activeVersionId) {
      issues.push({
        id: `iss-missing-${segment.id}`,
        type: 'silence',
        severity: 'high',
        description: 'Scene narration voice clip is currently missing.',
        recommendation: 'Record family voice in studio or generate AI narration.'
      });

      suggestions.push({
        id: `sug-gen-${segment.id}`,
        segmentId: segment.id,
        type: 'missing',
        title: 'Missing Voiceover',
        message: `Scene "${segment.sceneTitle}" has no narration audio.`,
        explanation: 'Documentary scenes require voiceover to synchronize visual assets and timeline transitions.',
        fixLabel: 'Generate AI Voice',
        fixAction: 'rewrite'
      });

      return { score: 0, issues, suggestions };
    }

    // Check 2: Word count and pace analysis
    const wordCount = segment.wordCount || segment.text.split(/\s+/).length;
    const duration = segment.actualDurationSec || segment.speakingDurationEstimateSec || 10;
    const wordsPerSec = wordCount / Math.max(1, duration);

    if (wordsPerSec > 3.2) {
      issues.push({
        id: `iss-pace-fast-${segment.id}`,
        type: 'inconsistent',
        severity: 'medium',
        description: `Speaking rate is too fast (${wordsPerSec.toFixed(1)} words/sec). Target is 2.2 - 2.6 WPS.`,
        recommendation: 'Pace down delivery by 15% or expand scene duration in Story Studio.'
      });

      suggestions.push({
        id: `sug-slow-${segment.id}`,
        segmentId: segment.id,
        type: 'pacing',
        title: 'Speaking Speed Warning',
        message: 'Narration cadence feels rushed for cinematic viewing.',
        explanation: 'Fast voiceover leaves insufficient time for viewers to absorb archival photographs.',
        fixLabel: 'Slow Down Voice (0.88x)',
        fixAction: 'adjust_speed',
        proposedSpeed: 0.88
      });
    }

    // Check 3: Sentence complexity & length
    const sentences = segment.text.split(/[.!?]+/).filter(Boolean);
    const avgWordsPerSentence = wordCount / Math.max(1, sentences.length);

    if (avgWordsPerSentence > 22) {
      issues.push({
        id: `iss-len-${segment.id}`,
        type: 'breathing',
        severity: 'low',
        description: 'Sentences are long without natural breathing pauses.',
        recommendation: 'Split complex sentence into two shorter, impact-filled statements.'
      });

      suggestions.push({
        id: `sug-split-${segment.id}`,
        segmentId: segment.id,
        type: 'wording',
        title: 'Sentence Too Long',
        message: 'High breath requirement detected for single take.',
        explanation: 'Shorter sentences improve listener comprehension and voice recording ease.',
        fixLabel: 'Insert Breath Pause',
        fixAction: 'insert_pause'
      });
    }

    // Check 4: Simulated noise & echo check based on version label
    const activeVer = segment.versions.find(v => v.id === segment.activeVersionId);
    if (activeVer && activeVer.label.toLowerCase().includes('tape')) {
      issues.push({
        id: `iss-tape-${segment.id}`,
        type: 'noise',
        severity: 'medium',
        description: 'Legacy tape hiss detected in vintage recording.',
        recommendation: 'Enable AI Spectral De-noise in Inspector Audio settings.'
      });
    }

    const score = Math.max(40, 100 - issues.length * 12);

    return { score, issues, suggestions };
  }
}
