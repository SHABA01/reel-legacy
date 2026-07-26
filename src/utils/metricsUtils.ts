/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductionReadinessMetrics {
  totalScenes: number;
  readyScenes: number;
  narrationCoveragePercent: number;
  mediaAssetsPercent: number;
  overallReadinessPercent: number;
  statusLabel: 'Draft' | 'In Progress' | 'Production Ready' | 'Polished';
}

/**
 * Calculates standard documentary story production readiness percentage metrics.
 */
export function calculateProductionReadiness(scenes: any[] = []): ProductionReadinessMetrics {
  if (!scenes || scenes.length === 0) {
    return {
      totalScenes: 0,
      readyScenes: 0,
      narrationCoveragePercent: 0,
      mediaAssetsPercent: 0,
      overallReadinessPercent: 0,
      statusLabel: 'Draft'
    };
  }

  let readyCount = 0;
  let scenesWithNarration = 0;
  let scenesWithMedia = 0;

  scenes.forEach(s => {
    if (s.status === 'Ready' || s.status === 'Completed' || s.isReady) readyCount++;
    if (s.narrationText || s.audioUrl || (s.narration && s.narration.trim())) scenesWithNarration++;
    if ((s.mediaAssets && s.mediaAssets.length > 0) || s.imageUrl || s.videoUrl) scenesWithMedia++;
  });

  const total = scenes.length;
  const narrationCoveragePercent = Math.round((scenesWithNarration / total) * 100);
  const mediaAssetsPercent = Math.round((scenesWithMedia / total) * 100);
  const sceneStatusPercent = Math.round((readyCount / total) * 100);

  const overallReadinessPercent = Math.round(
    narrationCoveragePercent * 0.4 + mediaAssetsPercent * 0.4 + sceneStatusPercent * 0.2
  );

  let statusLabel: ProductionReadinessMetrics['statusLabel'] = 'Draft';
  if (overallReadinessPercent >= 90) statusLabel = 'Polished';
  else if (overallReadinessPercent >= 75) statusLabel = 'Production Ready';
  else if (overallReadinessPercent >= 30) statusLabel = 'In Progress';

  return {
    totalScenes: total,
    readyScenes: readyCount,
    narrationCoveragePercent,
    mediaAssetsPercent,
    overallReadinessPercent,
    statusLabel
  };
}
