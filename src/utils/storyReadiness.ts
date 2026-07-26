import { parseDurationToSeconds } from './durationUtils';

export interface SceneLike {
  id?: string;
  estimatedDuration?: string;
  narrationText?: string;
  narrationStatus?: string;
  mediaIds?: string[];
  status?: string;
}

export interface SceneStatisticsResult {
  totalScenes: number;
  totalSeconds: number;
  totalRuntimeFormatted: string;
  avgSeconds: number;
  avgFormatted: string;
  narratedCount: number;
  narratedPct: number;
  mediaCount: number;
  mediaPct: number;
  readyCount: number;
  readyPct: number;
}

export function calculateSceneStatistics(scenes: SceneLike[]): SceneStatisticsResult {
  const totalScenes = scenes.length;
  let totalSeconds = 0;

  scenes.forEach((s) => {
    totalSeconds += parseDurationToSeconds(s.estimatedDuration);
  });

  const totalMinutes = Math.floor(totalSeconds / 60);
  const remSec = totalSeconds % 60;
  const totalRuntimeFormatted = `${totalMinutes}m ${remSec < 10 ? '0' : ''}${remSec}s`;
  const avgSeconds = totalScenes > 0 ? Math.round(totalSeconds / totalScenes) : 0;
  const avgFormatted = `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s`;

  const narratedCount = scenes.filter(
    (s) => (s.narrationText && s.narrationText.trim().length > 0) || s.narrationStatus === 'Synthesized'
  ).length;
  const mediaCount = scenes.filter((s) => s.mediaIds && s.mediaIds.length > 0).length;
  const readyCount = scenes.filter(
    (s) => s.status === 'Ready' || s.status === 'Locked' || s.status === 'Completed'
  ).length;

  return {
    totalScenes,
    totalSeconds,
    totalRuntimeFormatted,
    avgSeconds,
    avgFormatted,
    narratedCount,
    narratedPct: totalScenes > 0 ? Math.round((narratedCount / totalScenes) * 100) : 0,
    mediaCount,
    mediaPct: totalScenes > 0 ? Math.round((mediaCount / totalScenes) * 100) : 0,
    readyCount,
    readyPct: totalScenes > 0 ? Math.round((readyCount / totalScenes) * 100) : 0,
  };
}

export interface StoryReadinessOptions {
  timelineEventsCount?: number;
  charactersCount?: number;
  scenesCount?: number;
  mediaItemsCount?: number;
  narrationBlocksCount?: number;
}

export function calculateStoryReadiness(options: StoryReadinessOptions) {
  const {
    timelineEventsCount = 0,
    charactersCount = 0,
    scenesCount = 0,
    mediaItemsCount = 0,
    narrationBlocksCount = 0,
  } = options;

  const timelinePercent = Math.min(100, Math.round((timelineEventsCount / 5) * 100));
  const characterPercent = Math.min(100, Math.round((charactersCount / 3) * 100));
  const scenesPercent = Math.min(100, Math.round((scenesCount / 4) * 100));
  const mediaPercent = Math.min(100, Math.round((mediaItemsCount / 6) * 100));
  const narrationPercent = Math.min(100, Math.round((narrationBlocksCount / 5) * 100));

  const overall = Math.round(
    (timelinePercent + characterPercent + scenesPercent + mediaPercent + narrationPercent) / 5
  );

  return {
    overall,
    timelinePercent,
    characterPercent,
    scenesPercent,
    mediaPercent,
    narrationPercent,
  };
}
