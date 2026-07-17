/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';

export class SearchService {
  static async searchAll(query: string): Promise<{
    profiles: any[];
    stories: any[];
    timeline: any[];
    media: any[];
    documents: any[];
    imports: any[];
  }> {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      return { profiles: [], stories: [], timeline: [], media: [], documents: [], imports: [] };
    }

    const [profiles, stories, timeline, media, documents, imports] = await Promise.all([
      persistenceService.profiles.search(cleanQuery),
      persistenceService.stories.search(cleanQuery),
      persistenceService.timeline.search(cleanQuery),
      persistenceService.media.search(cleanQuery),
      persistenceService.documents.search(cleanQuery),
      persistenceService.imports.search(cleanQuery)
    ]);

    return {
      profiles,
      stories,
      timeline,
      media,
      documents,
      imports
    };
  }
}
