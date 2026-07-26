/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export type MediaCategory =
  | 'Family Photo'
  | 'Portrait'
  | 'Childhood'
  | 'Graduation'
  | 'Wedding'
  | 'Career Photo'
  | 'Home Video'
  | 'Interview Recording'
  | 'Drone Footage'
  | 'Voice Recording'
  | 'Music File'
  | 'Resume'
  | 'Certificate'
  | 'Award'
  | 'Letter'
  | 'Historical Document'
  | 'Scanned Letter'
  | 'Newspaper Article';

export type ReadinessStatus =
  | 'Ready'
  | 'Needs Metadata'
  | 'Low Resolution'
  | 'Damaged'
  | 'Missing Rights'
  | 'Missing Story Link'
  | 'Unused'
  | 'Missing Tags'
  | 'Flagged';

export type SmartCollectionType =
  | 'all'
  | 'photos'
  | 'videos'
  | 'audio'
  | 'documents'
  | 'ai-generated'
  | 'portraits'
  | 'landscapes'
  | 'interviews'
  | 'drone'
  | 'historical'
  | 'scanned-letters'
  | 'unused'
  | 'needs-review'
  | 'ready-for-production'
  | 'recently-imported'
  | 'favorites'
  | 'trash';

export interface AssetVersion {
  id: string;
  name: string;
  versionType: 'Original' | 'Edited' | 'Restored' | 'Colour Corrected' | 'AI Enhanced' | 'Upscaled' | 'Compressed';
  thumbnailUrl: string;
  url?: string;
  createdAt: string;
  fileSize: string;
  isCurrent: boolean;
}

export interface AIAnalysisResult {
  facesDetected: number;
  peopleFound: string[];
  emotions: string[];
  objectsDetected: string[];
  sceneDescription: string;
  qualityScore: number; // 1-100
  resolutionQuality: '4K Ultra' | '1080p HD' | '720p HD' | 'SD Standard' | 'Low Res';
  damageDetected: boolean;
  damageTypes?: string[];
  restorationRecommendation?: string;
  ocrText?: string;
  ocrEntities?: string[];
  speechTranscript?: string;
  speakerCount?: number;
  noiseAnalysis?: 'Clean Audio' | 'Minor Hiss' | 'Heavy Background Noise' | 'Wind Distortion';
  historicalLandmarks?: string[];
}

export interface RelationshipGraph {
  linkedStoryId: string;
  linkedStoryName: string;
  linkedScenes: Array<{ id: string; title: string }>;
  linkedCharacters: Array<{ id: string; name: string }>;
  linkedTimelineEvents: Array<{ id: string; title: string }>;
  linkedNarrationBlocks: Array<{ id: string; text: string }>;
  linkedMusicTracks: Array<{ id: string; name: string }>;
}

export interface ExtendedMediaAsset {
  id: string;
  name: string;
  originalFilename?: string;
  type: MediaType;
  category: MediaCategory;
  size: string;
  bytes: number;
  resolution?: string;
  duration?: string;
  fps?: number;
  codec?: string;
  bitrate?: string;
  uploadDate: string;
  captureDate?: string;
  location?: string;
  gps?: { lat: number; lng: number };
  tags: string[];
  people?: string[];
  linkedStoryId: string;
  linkedStoryName: string;
  linkedEvents: string[];
  linkedChapters: string[];
  favorite: boolean;
  archived: boolean;
  readinessStatus: ReadinessStatus;
  thumbnailUrl: string;
  description: string;
  storageProvider?: 'Local Vault' | 'Google Cloud Storage' | 'Encrypted Drive';
  checksum?: string;
  isAiGenerated?: boolean;
  qualityRating?: number; // 1-5 stars
  usageCount?: number;
  aiAnalysis?: AIAnalysisResult;
  relationships?: RelationshipGraph;
  versions?: AssetVersion[];
  comments?: Array<{ id: string; author: string; text: string; date: string }>;
}

export interface MediaCollection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  assetCount: number;
  lastUpdated: string;
  tags: string[];
  isSmart?: boolean;
  smartType?: SmartCollectionType;
}

export interface UploadQueueItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'Queued' | 'Scanning' | 'Uploading' | 'AI Analyzing' | 'Complete' | 'Failed';
  speed?: string;
  error?: string;
  fileType: MediaType;
}
