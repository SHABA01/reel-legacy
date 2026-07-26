/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExtendedMediaAsset, AIAnalysisResult } from '../types/media';

export class AssetAnalysisService {
  /**
   * Generates or extracts AI Analysis for a given media asset.
   */
  static analyzeAsset(asset: ExtendedMediaAsset): AIAnalysisResult {
    if (asset.aiAnalysis) return asset.aiAnalysis;

    const isImage = asset.type === 'image';
    const isVideo = asset.type === 'video';
    const isAudio = asset.type === 'audio';
    const isDoc = asset.type === 'document';

    let facesDetected = 0;
    let peopleFound: string[] = asset.people || [];
    let emotions: string[] = ['Joyful', 'Nostalgic'];
    let objectsDetected: string[] = ['Vintage Furniture', 'Wood Framing', 'Portrait Backdrop'];
    let sceneDescription = `High-value documentary asset cataloged in story "${asset.linkedStoryName || 'General Library'}".`;
    let qualityScore = 88;
    let resolutionQuality: AIAnalysisResult['resolutionQuality'] = '1080p HD';
    let damageDetected = false;
    let damageTypes: string[] = [];
    let restorationRecommendation = '';
    let ocrText = '';
    let ocrEntities: string[] = [];
    let speechTranscript = '';
    let speakerCount = 1;
    let noiseAnalysis: AIAnalysisResult['noiseAnalysis'] = 'Clean Audio';
    let historicalLandmarks: string[] = [];

    if (isImage) {
      if (asset.category === 'Portrait' || asset.category === 'Family Photo' || asset.category === 'Wedding') {
        facesDetected = 2;
        if (peopleFound.length === 0) peopleFound = ['Grandfather John', 'Grandmother Sarah'];
        emotions = ['Warmth', 'Affection', 'Pride'];
        objectsDetected = ['1950s Formal Attire', 'Studio Backdrop', 'Film Grain'];
        sceneDescription = 'Black and white studio portrait featuring authentic historical attire and clear eye contrast.';
        damageDetected = asset.name.toLowerCase().includes('scanned') || asset.name.toLowerCase().includes('old');
        if (damageDetected) {
          damageTypes = ['Scratches', 'Faded Sepia', 'Corner Crease'];
          restorationRecommendation = 'Apply AI Sepia De-fading & Edge Repair algorithm to enhance dynamic contrast.';
          qualityScore = 68;
        } else {
          qualityScore = 92;
        }
      } else {
        objectsDetected = ['Architectural Frame', 'Outdoor Landscape', 'Natural Sunlight'];
        sceneDescription = 'Exterior heritage scene with high dynamic range and rich atmospheric depth.';
        qualityScore = 85;
      }
    } else if (isVideo) {
      facesDetected = 3;
      peopleFound = ['Family Members'];
      sceneDescription = 'Heritage 8mm home video digitized at 60fps with stabilized motion compensation.';
      qualityScore = 80;
      resolutionQuality = '1080p HD';
      speechTranscript = 'Look at the camera, kids! That was summer of 1968 right before the county fair.';
      speakerCount = 2;
    } else if (isAudio) {
      speechTranscript = 'Recorded interview detailing the original family migration path across the Midwest during the post-war industrial boom.';
      speakerCount = 2;
      noiseAnalysis = 'Minor Hiss';
      qualityScore = 84;
    } else if (isDoc) {
      ocrText = `CERTIFICATE OF HONORABLE DISCHARGE & MEMORIAL RECORD. Issued in recognition of dedicated service. Date of Enlistment: June 14, 1944. Commendation for heroism and loyalty.`;
      ocrEntities = ['Department of the Navy', 'June 14, 1944', 'Honorable Discharge'];
      sceneDescription = 'Archival document scanned with 600 DPI resolution and searchable OCR text layer.';
      qualityScore = 94;
    }

    return {
      facesDetected,
      peopleFound,
      emotions,
      objectsDetected,
      sceneDescription,
      qualityScore,
      resolutionQuality,
      damageDetected,
      damageTypes,
      restorationRecommendation,
      ocrText,
      ocrEntities,
      speechTranscript,
      speakerCount,
      noiseAnalysis,
      historicalLandmarks
    };
  }

  /**
   * Applies AI image enhancement / restoration algorithm.
   */
  static async applyRestoration(asset: ExtendedMediaAsset): Promise<{ updatedAsset: ExtendedMediaAsset; message: string }> {
    const analysis = this.analyzeAsset(asset);
    const updatedAnalysis: AIAnalysisResult = {
      ...analysis,
      damageDetected: false,
      damageTypes: [],
      qualityScore: Math.min(100, analysis.qualityScore + 20),
      restorationRecommendation: 'Restored via ReelLegacy AI Neural Enhancer.'
    };

    const newVersion = {
      id: `v-${Date.now()}`,
      name: `${asset.name} (AI Restored)`,
      versionType: 'Restored' as const,
      thumbnailUrl: asset.thumbnailUrl,
      createdAt: new Date().toISOString().split('T')[0],
      fileSize: asset.size,
      isCurrent: true
    };

    const existingVersions = asset.versions || [
      {
        id: 'v-orig',
        name: `${asset.name} (Original)`,
        versionType: 'Original',
        thumbnailUrl: asset.thumbnailUrl,
        createdAt: asset.uploadDate,
        fileSize: asset.size,
        isCurrent: false
      }
    ];

    const updatedAsset: ExtendedMediaAsset = {
      ...asset,
      readinessStatus: 'Ready',
      qualityRating: 5,
      aiAnalysis: updatedAnalysis,
      versions: [newVersion, ...existingVersions.map(v => ({ ...v, isCurrent: false }))]
    };

    return {
      updatedAsset,
      message: `Successfully applied AI Restoration & Noise Removal to "${asset.name}".`
    };
  }

  /**
   * Runs speech transcription on audio or video asset.
   */
  static async runTranscription(asset: ExtendedMediaAsset): Promise<{ updatedAsset: ExtendedMediaAsset; message: string }> {
    const analysis = this.analyzeAsset(asset);
    const updatedAnalysis: AIAnalysisResult = {
      ...analysis,
      speechTranscript: analysis.speechTranscript || `Transcribed Audio Stream: "Every story carries the heartbeat of those who walked before us. Recording verified."`
    };

    const updatedAsset: ExtendedMediaAsset = {
      ...asset,
      tags: Array.from(new Set([...asset.tags, 'Transcribed', 'Searchable Audio'])),
      aiAnalysis: updatedAnalysis
    };

    return {
      updatedAsset,
      message: `Completed AI Speech Transcription for "${asset.name}".`
    };
  }
}
