/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExtendedMediaAsset } from '../types/media';

export interface DuplicateGroup {
  id: string;
  matchType: 'Exact Match' | 'Near Duplicate' | 'Resolution Variant';
  similarityPercentage: number;
  primaryAsset: ExtendedMediaAsset;
  duplicateAssets: ExtendedMediaAsset[];
  recommendedAction: string;
}

export class DuplicateDetectionService {
  /**
   * Scans a collection of media assets for potential duplicates.
   */
  static findDuplicates(assets: ExtendedMediaAsset[]): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processedIds = new Set<string>();

    for (let i = 0; i < assets.length; i++) {
      const current = assets[i];
      if (processedIds.has(current.id) || current.archived) continue;

      const exactMatches: ExtendedMediaAsset[] = [];
      const nearMatches: ExtendedMediaAsset[] = [];

      for (let j = i + 1; j < assets.length; j++) {
        const candidate = assets[j];
        if (processedIds.has(candidate.id) || candidate.archived) continue;

        // Exact match by name & bytes
        if (
          current.name.toLowerCase() === candidate.name.toLowerCase() &&
          current.bytes === candidate.bytes
        ) {
          exactMatches.push(candidate);
          processedIds.add(candidate.id);
        }
        // Near duplicate: similar name stem or exact size
        else if (
          current.bytes > 0 && current.bytes === candidate.bytes ||
          (current.name.substring(0, 8).toLowerCase() === candidate.name.substring(0, 8).toLowerCase() && current.type === candidate.type)
        ) {
          nearMatches.push(candidate);
          processedIds.add(candidate.id);
        }
      }

      if (exactMatches.length > 0) {
        processedIds.add(current.id);
        groups.push({
          id: `dup-group-${current.id}`,
          matchType: 'Exact Match',
          similarityPercentage: 100,
          primaryAsset: current,
          duplicateAssets: exactMatches,
          recommendedAction: 'Archive redundant copies to preserve vault storage capacity.'
        });
      } else if (nearMatches.length > 0) {
        processedIds.add(current.id);
        groups.push({
          id: `dup-group-${current.id}`,
          matchType: 'Near Duplicate',
          similarityPercentage: 88,
          primaryAsset: current,
          duplicateAssets: nearMatches,
          recommendedAction: 'Merge tags and keep highest resolution version.'
        });
      }
    }

    return groups;
  }
}
