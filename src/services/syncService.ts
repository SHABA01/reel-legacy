/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NarrationSegment } from '../types/narration';

export interface SyncEventData {
  segmentId: string;
  sceneId: string;
  newDurationSec: number;
  narrationText: string;
  activeVoiceId: string;
  status: string;
  subtitlesCount: number;
}

export class SyncService {
  /**
   * Dispatches global cross-module synchronization event when narration changes
   */
  public static notifyNarrationChanged(segment: NarrationSegment) {
    const data: SyncEventData = {
      segmentId: segment.id,
      sceneId: segment.sceneId,
      newDurationSec: segment.actualDurationSec || segment.speakingDurationEstimateSec || 15,
      narrationText: segment.text,
      activeVoiceId: segment.activeVoiceId,
      status: segment.status,
      subtitlesCount: (segment.subtitles || []).length
    };

    // Dispatch DOM custom events for cross-module synchronization
    window.dispatchEvent(new CustomEvent('reellegacy-story-updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('reellegacy-timeline-updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('reellegacy-music-ducking-updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('reellegacy-render-queue-updated', { detail: data }));
  }

  /**
   * Helper to recalculate recommended score ducking level (dB) based on narration presence
   */
  public static calculateMusicDucking(hasNarration: boolean, voiceVolumePct: number = 100): number {
    if (!hasNarration) return 0; // Full music volume
    const baseDucking = -12; // -12dB default ducking when narration plays
    const volumeFactor = voiceVolumePct / 100;
    return Math.round(baseDucking * volumeFactor);
  }
}
