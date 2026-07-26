/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Parses duration strings like "1m 30s", "45s", "2h 15m", "1:30" into total seconds.
 */
export function parseDurationToSeconds(durationStr: string | number | undefined | null): number {
  if (!durationStr) return 0;
  if (typeof durationStr === 'number') return Math.max(0, durationStr);

  const str = String(durationStr).trim().toLowerCase();

  // Format "MM:SS" or "HH:MM:SS"
  if (str.includes(':')) {
    const parts = str.split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  // Regex matches for "1h 30m 45s", "2m 15s", "45s", etc.
  let totalSeconds = 0;

  const hoursMatch = str.match(/(\d+)\s*h/);
  if (hoursMatch) totalSeconds += parseInt(hoursMatch[1], 10) * 3600;

  const minutesMatch = str.match(/(\d+)\s*m/);
  if (minutesMatch) totalSeconds += parseInt(minutesMatch[1], 10) * 60;

  const secondsMatch = str.match(/(\d+)\s*s/);
  if (secondsMatch) totalSeconds += parseInt(secondsMatch[1], 10);

  // Fallback if raw number string passed "90"
  if (totalSeconds === 0 && !isNaN(Number(str))) {
    totalSeconds = parseInt(str, 10);
  }

  return totalSeconds;
}

/**
 * Formats total seconds into human readable duration strings like "1m 30s" or "45s".
 */
export function formatSecondsToDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0s';

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
