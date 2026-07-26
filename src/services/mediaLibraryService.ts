/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExtendedMediaAsset, MediaCollection, SmartCollectionType, ReadinessStatus } from '../types/media';
import { persistenceService, MediaService } from '../storage';
import { AssetAnalysisService } from './assetAnalysisService';

export const INITIAL_SMART_COLLECTIONS: MediaCollection[] = [
  {
    id: 'sc-all',
    name: 'All Vault Assets',
    description: 'Master repository of all documentary footage, photos, documents & audio.',
    coverImage: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: 'Just now',
    tags: ['Master', 'All'],
    isSmart: true,
    smartType: 'all'
  },
  {
    id: 'sc-photos',
    name: 'Photos & Stills',
    description: 'High-resolution archival photographs and family portraits.',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: '2 hrs ago',
    tags: ['Photos', 'Images'],
    isSmart: true,
    smartType: 'photos'
  },
  {
    id: 'sc-videos',
    name: 'Video Footage',
    description: 'Digitized home films, interview clips, and historical B-roll.',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: 'Yesterday',
    tags: ['Video', 'Films'],
    isSmart: true,
    smartType: 'videos'
  },
  {
    id: 'sc-audio',
    name: 'Voice & Music Audio',
    description: 'Oral history recordings, interview tapes, and background soundtracks.',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: '3 days ago',
    tags: ['Audio', 'Interviews'],
    isSmart: true,
    smartType: 'audio'
  },
  {
    id: 'sc-documents',
    name: 'Documents & Letters',
    description: 'Scanned letters, military records, diplomas, and news clippings.',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: '4 days ago',
    tags: ['Documents', 'OCR'],
    isSmart: true,
    smartType: 'documents'
  },
  {
    id: 'sc-ai-gen',
    name: 'AI Generated Assets',
    description: 'Synthesized historical restorations and generated concept art.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: '1 hr ago',
    tags: ['AI', 'Restoration'],
    isSmart: true,
    smartType: 'ai-generated'
  },
  {
    id: 'sc-unused',
    name: 'Unused Assets',
    description: 'Assets not yet linked to any story, scene, or timeline event.',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: 'Just now',
    tags: ['Unused', 'Unlinked'],
    isSmart: true,
    smartType: 'unused'
  },
  {
    id: 'sc-ready',
    name: 'Ready for Production',
    description: 'Fully tagged and verified assets approved for final documentary rendering.',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: 'Just now',
    tags: ['Production', 'Verified'],
    isSmart: true,
    smartType: 'ready-for-production'
  },
  {
    id: 'sc-favorites',
    name: 'Starred Favorites',
    description: 'Key landmark assets marked for priority story highlight reels.',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    assetCount: 0,
    lastUpdated: 'Just now',
    tags: ['Starred'],
    isSmart: true,
    smartType: 'favorites'
  }
];

export class MediaLibraryService {
  /**
   * Filters assets by Smart Collection logic.
   */
  static filterBySmartCollection(assets: ExtendedMediaAsset[], smartType: SmartCollectionType): ExtendedMediaAsset[] {
    const active = assets.filter(a => smartType === 'trash' ? a.archived : !a.archived);

    switch (smartType) {
      case 'all':
        return active;
      case 'photos':
        return active.filter(a => a.type === 'image');
      case 'videos':
        return active.filter(a => a.type === 'video');
      case 'audio':
        return active.filter(a => a.type === 'audio');
      case 'documents':
        return active.filter(a => a.type === 'document');
      case 'ai-generated':
        return active.filter(a => a.isAiGenerated || a.tags.some(t => t.toLowerCase().includes('ai')));
      case 'portraits':
        return active.filter(a => a.category === 'Portrait' || a.category === 'Childhood');
      case 'landscapes':
        return active.filter(a => a.category === 'Family Photo' || a.category === 'Wedding');
      case 'interviews':
        return active.filter(a => a.category === 'Interview Recording' || a.tags.some(t => t.toLowerCase().includes('interview')));
      case 'drone':
        return active.filter(a => a.category === 'Drone Footage' || a.tags.some(t => t.toLowerCase().includes('drone')));
      case 'historical':
        return active.filter(a => a.category === 'Historical Document' || a.tags.some(t => t.toLowerCase().includes('historical')));
      case 'scanned-letters':
        return active.filter(a => a.category === 'Letter' || a.category === 'Scanned Letter');
      case 'unused':
        return active.filter(a => (!a.linkedStoryId || a.linkedStoryId === 'unlinked') && (!a.relationships || (a.relationships.linkedScenes.length === 0 && a.relationships.linkedTimelineEvents.length === 0)));
      case 'needs-review':
        return active.filter(a => a.readinessStatus === 'Needs Metadata' || a.readinessStatus === 'Low Resolution' || a.readinessStatus === 'Missing Tags');
      case 'ready-for-production':
        return active.filter(a => a.readinessStatus === 'Ready');
      case 'recently-imported':
        return active.slice().sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).slice(0, 10);
      case 'favorites':
        return active.filter(a => a.favorite);
      case 'trash':
        return assets.filter(a => a.archived);
      default:
        return active;
    }
  }

  /**
   * Multi-faceted global search implementation.
   * Searches filename, caption, OCR text, speech transcript, tags, people, location, story, year, event, and AI descriptions.
   */
  static searchAssets(assets: ExtendedMediaAsset[], query: string): ExtendedMediaAsset[] {
    if (!query || !query.trim()) return assets;
    const q = query.toLowerCase().trim();

    return assets.filter(asset => {
      const nameMatch = asset.name.toLowerCase().includes(q) || (asset.originalFilename && asset.originalFilename.toLowerCase().includes(q));
      const descMatch = asset.description && asset.description.toLowerCase().includes(q);
      const tagMatch = asset.tags.some(t => t.toLowerCase().includes(q));
      const storyMatch = asset.linkedStoryName && asset.linkedStoryName.toLowerCase().includes(q);
      const locationMatch = asset.location && asset.location.toLowerCase().includes(q);
      const peopleMatch = asset.people && asset.people.some(p => p.toLowerCase().includes(q));
      const eventMatch = asset.linkedEvents && asset.linkedEvents.some(e => e.toLowerCase().includes(q));

      const analysis = asset.aiAnalysis || AssetAnalysisService.analyzeAsset(asset);
      const ocrMatch = analysis.ocrText && analysis.ocrText.toLowerCase().includes(q);
      const transcriptMatch = analysis.speechTranscript && analysis.speechTranscript.toLowerCase().includes(q);
      const aiDescMatch = analysis.sceneDescription && analysis.sceneDescription.toLowerCase().includes(q);
      const entityMatch = analysis.ocrEntities && analysis.ocrEntities.some(e => e.toLowerCase().includes(q));

      return (
        nameMatch ||
        descMatch ||
        tagMatch ||
        storyMatch ||
        locationMatch ||
        peopleMatch ||
        eventMatch ||
        ocrMatch ||
        transcriptMatch ||
        aiDescMatch ||
        entityMatch
      );
    });
  }

  /**
   * Bulk tag addition.
   */
  static async bulkAddTag(assetIds: string[], tag: string, assets: ExtendedMediaAsset[]): Promise<ExtendedMediaAsset[]> {
    const cleanTag = tag.trim();
    if (!cleanTag) return assets;

    const updatedList = assets.map(asset => {
      if (assetIds.includes(asset.id)) {
        const newTags = Array.from(new Set([...asset.tags, cleanTag]));
        return { ...asset, tags: newTags };
      }
      return asset;
    });

    for (const id of assetIds) {
      try {
        const item = updatedList.find(a => a.id === id);
        if (item) {
          await MediaService.updateMedia(id, { tags: item.tags });
        }
      } catch (err) {
        console.error('Failed to update asset tag in storage:', id, err);
      }
    }

    return updatedList;
  }

  /**
   * Bulk assign story link.
   */
  static async bulkAssignStory(assetIds: string[], storyId: string, storyName: string, assets: ExtendedMediaAsset[]): Promise<ExtendedMediaAsset[]> {
    const updatedList = assets.map(asset => {
      if (assetIds.includes(asset.id)) {
        return {
          ...asset,
          linkedStoryId: storyId,
          linkedStoryName: storyName,
          readinessStatus: asset.readinessStatus === 'Missing Story Link' ? ('Ready' as ReadinessStatus) : asset.readinessStatus
        };
      }
      return asset;
    });

    for (const id of assetIds) {
      try {
        await MediaService.updateMedia(id, { legacyProfileId: storyId });
      } catch (err) {
        console.error('Failed to link story in storage:', id, err);
      }
    }

    return updatedList;
  }
}
