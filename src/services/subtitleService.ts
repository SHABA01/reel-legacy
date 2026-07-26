/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubtitleCue, NarrationSegment } from '../types/narration';

export class SubtitleService {
  /**
   * Generates SRT formatted string from subtitle cues
   */
  public static exportSRT(cues: SubtitleCue[]): string {
    return cues
      .map((cue, idx) => {
        const startStr = this.formatTimecodeSRT(cue.startTime);
        const endStr = this.formatTimecodeSRT(cue.endTime);
        return `${idx + 1}\n${startStr} --> ${endStr}\n${cue.text}\n`;
      })
      .join('\n');
  }

  /**
   * Generates WebVTT formatted string from subtitle cues
   */
  public static exportVTT(cues: SubtitleCue[]): string {
    const body = cues
      .map((cue, idx) => {
        const startStr = this.formatTimecodeVTT(cue.startTime);
        const endStr = this.formatTimecodeVTT(cue.endTime);
        return `${idx + 1}\n${startStr} --> ${endStr}\n${cue.text}\n`;
      })
      .join('\n');

    return `WEBVTT - ReelLegacy Documentary Subtitles\n\n${body}`;
  }

  /**
   * Exports compiled documentary subtitles across all scenes
   */
  public static exportProjectSubtitles(segments: NarrationSegment[], format: 'srt' | 'vtt' | 'json'): string {
    let accumulatedTime = 0;
    const allCues: SubtitleCue[] = [];

    segments.forEach(seg => {
      const segDuration = seg.actualDurationSec || seg.speakingDurationEstimateSec || 15;
      (seg.subtitles || []).forEach((cue, idx) => {
        allCues.push({
          id: `proj-sub-${seg.id}-${idx}`,
          startTime: parseFloat((accumulatedTime + cue.startTime).toFixed(2)),
          endTime: parseFloat((accumulatedTime + cue.endTime).toFixed(2)),
          text: cue.text
        });
      });
      accumulatedTime += segDuration + 1.5; // Include scene gap
    });

    if (format === 'srt') return this.exportSRT(allCues);
    if (format === 'vtt') return this.exportVTT(allCues);
    return JSON.stringify(allCues, null, 2);
  }

  private static formatTimecodeSRT(seconds: number): string {
    const pad = (num: number, size: number = 2) => String(num).padStart(size, '0');
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
  }

  private static formatTimecodeVTT(seconds: number): string {
    return this.formatTimecodeSRT(seconds).replace(',', '.');
  }
}
