/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RenderJobStatus =
  | 'draft'
  | 'preflight'
  | 'queued'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'scheduled'
  | 'archived';

export type RenderType =
  | 'documentary'
  | 'trailer'
  | 'vertical_reel'
  | 'audio_podcast'
  | 'memoir_pdf'
  | 'zip_archive'
  | 'subtitle_export'
  | 'transcript_export'
  | 'voice_package'
  | 'image_slideshow';

export type RenderResolution =
  | '720p'
  | '1080p'
  | '4K'
  | '9:16 HD'
  | 'Audio Only'
  | 'Print PDF';

export type OutputFormat =
  | 'MP4 (H.264)'
  | 'ProRes 422'
  | 'WebM'
  | 'MP3'
  | 'WAV'
  | 'PDF'
  | 'ZIP'
  | 'SRT/VTT';

export type PipelineStageId =
  | 'draft'
  | 'preflight'
  | 'asset_verification'
  | 'ai_story_validation'
  | 'voice_synthesis'
  | 'subtitle_generation'
  | 'media_assembly'
  | 'music_processing'
  | 'scene_compilation'
  | 'video_encoding'
  | 'quality_validation'
  | 'packaging'
  | 'upload'
  | 'completed';

export type PipelineStageStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'warning'
  | 'failed'
  | 'skipped';

export interface PipelineStage {
  id: PipelineStageId;
  name: string;
  description: string;
  status: PipelineStageStatus;
  progress: number; // 0 - 100
  durationSec: number;
  warnings: string[];
  errors: string[];
  completedAt?: string;
}

export interface PreflightCheck {
  id: string;
  category: 'scenes' | 'assets' | 'narration' | 'music' | 'subtitles' | 'resolution' | 'storage' | 'timeline';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  quickFixAction?: string; // e.g., 'auto_synthesize', 'fix_aspect_ratio', 'fill_asset'
  resolved: boolean;
}

export interface RenderJob {
  id: string;
  storyId: string;
  storyName: string;
  version: string;
  type: RenderType;
  resolution: RenderResolution;
  format: OutputFormat;
  status: RenderJobStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  progress: number; // 0 - 100
  currentStage: PipelineStageId;
  stages: PipelineStage[];
  preflightChecks: PreflightCheck[];
  startedAt?: string;
  completedAt?: string;
  scheduledFor?: string;
  estimatedTimeRemainingSec?: number;
  durationSec: number; // Duration of final story/video
  renderTimeSec: number; // Elapsed render time
  outputFileSizeMB?: number;
  outputDestination: string;
  outputFileUrl?: string;
  thumbnailUrl?: string;
  assignedTemplate?: string;
  profileName: string;
  logs: string[];
  aiSuggestions: string[];
  createdAt: string;
  checksum?: string;
  tags?: string[];
  errorDetails?: string;
}

export interface OutputProfile {
  id: string;
  name: string;
  description: string;
  type: RenderType;
  resolution: RenderResolution;
  format: OutputFormat;
  fps: number;
  bitrateMbps: number;
  audioBitrateKbps: number;
  isCustom?: boolean;
  isDefault?: boolean;
}

export interface QueueSummaryStats {
  totalJobs: number;
  runningJobs: number;
  queuedJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  scheduledJobs: number;
  averageRenderTimeSec: number;
  storageUsedGB: number;
  pendingAIJobs: number;
  estimatedQueueFinishTimeSec: number;
  successRatePercent: number;
  activeWorkers: number;
  maxParallelWorkers: number;
  isQueuePaused: boolean;
}

export interface RenderFilterState {
  searchQuery: string;
  category: string; // 'all' | 'running' | 'queued' | 'completed' | 'failed' | 'cancelled' | 'scheduled' | 'archived' | 'exports' | 'packages' | 'templates'
  renderType: string; // 'all' or specific RenderType
  priority: string; // 'all' | 'low' | 'normal' | 'high' | 'urgent'
  viewMode: 'table' | 'timeline' | 'cards';
  sortBy: 'createdAt' | 'priority' | 'progress' | 'storyName';
  sortOrder: 'asc' | 'desc';
}

export interface ProductionSettings {
  maxParallelWorkers: number;
  gpuAcceleration: boolean;
  autoCleanupDays: number;
  maxStorageLimitGB: number;
  cloudSyncEnabled: boolean;
  webhookUrl: string;
  defaultOutputProfileId: string;
  autoPreflightCheck: boolean;
  notifyOnCompletion: boolean;
  lowPriorityOvernightOnly: boolean;
}
