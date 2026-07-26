/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  RenderJob,
  RenderJobStatus,
  PipelineStage,
  PipelineStageId,
  QueueSummaryStats,
  RenderFilterState,
  ProductionSettings,
} from '../types/render';
import { PreflightValidationService } from './preflightValidationService';

const LOCAL_STORAGE_KEY = 'reel_legacy_render_jobs_v2';
const SETTINGS_STORAGE_KEY = 'reel_legacy_production_settings_v1';

export const PIPELINE_STAGES_TEMPLATE: { id: PipelineStageId; name: string; description: string }[] = [
  { id: 'draft', name: 'Draft Initialization', description: 'Initializing render pipeline & gathering story specs' },
  { id: 'preflight', name: 'Pre-flight Validation', description: 'Checking media resolution, missing scenes & audio levels' },
  { id: 'asset_verification', name: 'Asset Verification', description: 'Verifying media checksums & cloud asset cache' },
  { id: 'ai_story_validation', name: 'AI Story Validation', description: 'Analyzing timeline pacing, scene coherence & keyframe continuity' },
  { id: 'voice_synthesis', name: 'Voice Synthesis & Sync', description: 'Generating family voice clips & alignment tracks' },
  { id: 'subtitle_generation', name: 'Subtitle Generation', description: 'Transcribing dialogue & building burn-in subtitle tracks' },
  { id: 'media_assembly', name: 'Media Assembly', description: 'Assembling high-res video clips & Ken Burns photo motions' },
  { id: 'music_processing', name: 'Music Processing & Mixing', description: 'Applying acoustic mastering, noise reduction & auto-ducking' },
  { id: 'scene_compilation', name: 'Scene Compilation', description: 'Rendering cinematic transitions, titles & visual color grades' },
  { id: 'video_encoding', name: 'Video Encoding', description: 'Multi-pass H.264 / ProRes hardware video encoding' },
  { id: 'quality_validation', name: 'Quality Validation', description: 'Performing automated visual frame & audio distortion checks' },
  { id: 'packaging', name: 'Packaging & Metadata', description: 'Injecting EXIF metadata, chapters & thumbnail generation' },
  { id: 'upload', name: 'Upload & Cloud Sync', description: 'Synchronizing output bundle to family archive cloud storage' },
  { id: 'completed', name: 'Completed & Ready', description: 'Production export complete and ready for distribution' },
];

function generateDefaultStages(currentStageId: PipelineStageId, progressPercentage: number): PipelineStage[] {
  const currentIndex = PIPELINE_STAGES_TEMPLATE.findIndex((s) => s.id === currentStageId);

  return PIPELINE_STAGES_TEMPLATE.map((stage, idx) => {
    let status: PipelineStage['status'] = 'pending';
    let stageProgress = 0;

    if (idx < currentIndex) {
      status = 'completed';
      stageProgress = 100;
    } else if (idx === currentIndex) {
      if (progressPercentage >= 100) {
        status = 'completed';
        stageProgress = 100;
      } else {
        status = 'in_progress';
        stageProgress = Math.min(100, Math.round((progressPercentage % (100 / PIPELINE_STAGES_TEMPLATE.length)) * PIPELINE_STAGES_TEMPLATE.length));
      }
    }

    return {
      id: stage.id,
      name: stage.name,
      description: stage.description,
      status,
      progress: stageProgress,
      durationSec: Math.floor(Math.random() * 25) + 5,
      warnings: [],
      errors: [],
      completedAt: status === 'completed' ? new Date(Date.now() - (14 - idx) * 120000).toISOString() : undefined,
    };
  });
}

export const INITIAL_RENDER_JOBS: RenderJob[] = [
  {
    id: 'job-miller-1942',
    storyId: 'story-1',
    storyName: 'The Miller Family Chronicles (1942–1988)',
    version: 'v2.4 (Director Cut)',
    type: 'documentary',
    resolution: '1080p',
    format: 'MP4 (H.264)',
    status: 'running',
    priority: 'high',
    progress: 68,
    currentStage: 'video_encoding',
    stages: generateDefaultStages('video_encoding', 68),
    preflightChecks: PreflightValidationService.runPreflightChecks('The Miller Family Chronicles', 'documentary'),
    startedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    estimatedTimeRemainingSec: 180,
    durationSec: 1420, // 23 mins 40 secs
    renderTimeSec: 840,
    outputFileSizeMB: 2840,
    outputDestination: '/exports/documentaries/miller_family_1942_v2.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    profileName: '1080p Documentary Master',
    assignedTemplate: 'Multi-Generational Heritage',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    logs: [
      '[08:30:12] Pipeline initialized for "The Miller Family Chronicles"',
      '[08:30:15] Pre-flight validation passed with 2 minor warnings',
      '[08:32:40] AI Voice synthesis completed for 18 narration segments',
      '[08:35:10] Subtitle SRT alignment matched 1,240 dialogue words',
      '[08:38:22] Media assembly complete. 48 archival photos & 6 video reels processed',
      '[08:41:05] Audio mastering finished (-14 LUFS target achieved)',
      '[08:44:30] Scene compilation done. Applied warm vintage film color grade',
      '[08:45:00] Hardware H.264 Video Encoder started. Multi-pass encoding frame 14,200 / 34,080',
    ],
    aiSuggestions: [
      'Render speed is optimal. GPU utilization at 84%.',
      'Scene 7 audio ducking automatically attenuated score by -6dB during Grandpa Arthur voiceover.',
    ],
    checksum: 'sha256-a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
    tags: ['Family Heritage', 'World War II', '1080p', 'Master'],
  },
  {
    id: 'job-navy-days',
    storyId: 'story-2',
    storyName: "Grandpa Arthur's Navy Days in the Pacific",
    version: 'v1.1 (Preflight Alert)',
    type: 'documentary',
    resolution: '4K',
    format: 'ProRes 422',
    status: 'preflight',
    priority: 'urgent',
    progress: 15,
    currentStage: 'preflight',
    stages: generateDefaultStages('preflight', 15),
    preflightChecks: [
      {
        id: 'pf-1',
        category: 'assets',
        severity: 'warning',
        message: 'Scene 3 photo "Navy Dock 1944" is low resolution (640x480). 4K upscale recommended.',
        suggestion: 'Apply AI Media Upscaler (4x) to enhance archival details.',
        quickFixAction: 'auto_upscale_media',
        resolved: false,
      },
      {
        id: 'pf-2',
        category: 'music',
        severity: 'warning',
        message: 'Audio clip "Naval Bugle Call" peak level exceeds 0dB clipping limit.',
        suggestion: 'Auto-normalize audio level to -1dB headroom.',
        quickFixAction: 'auto_duck_audio',
        resolved: false,
      },
    ],
    durationSec: 680,
    renderTimeSec: 45,
    outputFileSizeMB: 8200,
    outputDestination: '/exports/archive/grandpa_arthur_navy_4k.mov',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=600&q=80',
    profileName: '4K Ultra Master (ProRes)',
    assignedTemplate: 'Military Honor & Memory',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    logs: [
      '[08:40:00] Job created from Story Studio workspace',
      '[08:40:02] Pre-flight analyzer scanned 8 scenes and 24 media assets',
      '[08:40:05] WARNING: 2 pre-flight checks require user attention or AI auto-fix before proceeding to Voice Synthesis.',
    ],
    aiSuggestions: [
      'Click "Apply Quick Fix" on pre-flight alerts to automatically resolve image resolution and audio peaking before rendering.',
    ],
    tags: ['Pacific Fleet', 'WWII Memoir', '4K ProRes'],
  },
  {
    id: 'job-oak-ridge-trailer',
    storyId: 'story-3',
    storyName: 'Oak Ridge Farm 100th Anniversary Promo Trailer',
    version: 'v1.0',
    type: 'trailer',
    resolution: '1080p',
    format: 'MP4 (H.264)',
    status: 'queued',
    priority: 'normal',
    progress: 0,
    currentStage: 'draft',
    stages: generateDefaultStages('draft', 0),
    preflightChecks: PreflightValidationService.runPreflightChecks('Oak Ridge Farm 100th Anniversary', 'trailer'),
    durationSec: 90, // 1 min 30 secs
    renderTimeSec: 0,
    outputFileSizeMB: 180,
    outputDestination: '/exports/trailers/oak_ridge_trailer_1080p.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    profileName: 'Cinema Trailer (1080p)',
    assignedTemplate: 'Community & Homeland Legacy',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    logs: [
      '[08:42:10] Job queued for processing. Position #1 in background render queue.',
    ],
    aiSuggestions: [
      'Trailer render estimated to take 2 minutes once active job completes.',
    ],
    tags: ['Trailer', 'Homestead', 'Centennial'],
  },
  {
    id: 'job-kennebunkport-65',
    storyId: 'story-4',
    storyName: 'Summer at Kennebunkport (1965)',
    version: 'v3.0 Final',
    type: 'documentary',
    resolution: '1080p',
    format: 'MP4 (H.264)',
    status: 'completed',
    priority: 'normal',
    progress: 100,
    currentStage: 'completed',
    stages: generateDefaultStages('completed', 100),
    preflightChecks: [],
    startedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    durationSec: 940, // 15 mins 40 secs
    renderTimeSec: 320,
    outputFileSizeMB: 1840,
    outputDestination: '/exports/completed/kennebunkport_1965_final.mp4',
    outputFileUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    profileName: '1080p Documentary Master',
    assignedTemplate: 'Vintage Summer Vacation',
    createdAt: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    logs: [
      '[06:30:00] Render started',
      '[06:32:15] Pre-flight validation passed (0 errors, 0 warnings)',
      '[06:33:40] AI Voice synthesis completed',
      '[06:35:10] Scene compilation complete',
      '[06:38:20] Video encoding complete (30 fps 1080p)',
      '[06:39:50] Quality validation passed. Package uploaded to cloud storage.',
      '[06:40:00] RENDER COMPLETED SUCCESSFULLY.',
    ],
    aiSuggestions: [
      'Render completed with 100% fidelity score. Ready for direct streaming or download.',
    ],
    checksum: 'sha256-f9e8d7c6b5a432109876543210fedcba9876543210fedcba9876543210fedcba',
    tags: ['1960s', 'Vacation', 'Archive', 'Completed'],
  },
  {
    id: 'job-vertical-reel-chicago',
    storyId: 'story-5',
    storyName: 'Chicago Industrial Era - Short Highlight Reel',
    version: 'v1.0',
    type: 'vertical_reel',
    resolution: '9:16 HD',
    format: 'MP4 (H.264)',
    status: 'failed',
    priority: 'low',
    progress: 42,
    currentStage: 'media_assembly',
    stages: generateDefaultStages('media_assembly', 42),
    preflightChecks: [
      {
        id: 'pf-fail-1',
        category: 'assets',
        severity: 'error',
        message: 'Missing source video asset: "Chicago_Stockyards_1928_reel.mov" was deleted or unlinked from Media Library.',
        suggestion: 'Relink missing file in Media Library or substitute with archived scan.',
        quickFixAction: 'relink_media_asset',
        resolved: false,
      },
    ],
    durationSec: 45, // 45 secs vertical
    renderTimeSec: 110,
    outputFileSizeMB: 85,
    outputDestination: '/exports/reels/chicago_vertical_reel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=600&q=80',
    profileName: 'Instagram Reel (9:16 HD)',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    logs: [
      '[08:00:00] Job started',
      '[08:01:20] Voice synthesis & subtitles completed',
      '[08:02:40] ERROR: Media Assembly failed. File "Chicago_Stockyards_1928_reel.mov" not found on disk.',
      '[08:02:41] Job status changed to FAILED.',
    ],
    aiSuggestions: [
      'Fix missing asset in Media Library or click "Relink Media" to resolve and retry render.',
    ],
    errorDetails: 'Media asset unlinked during assembly stage.',
    tags: ['Shorts', 'Instagram', 'Failed'],
  },
  {
    id: 'job-clara-memoir-pdf',
    storyId: 'story-6',
    storyName: 'The Legacy of Great-Aunt Clara (1910–2004)',
    version: 'v1.0 (Print Edition)',
    type: 'memoir_pdf',
    resolution: 'Print PDF',
    format: 'PDF',
    status: 'scheduled',
    priority: 'normal',
    progress: 0,
    currentStage: 'draft',
    stages: generateDefaultStages('draft', 0),
    preflightChecks: [],
    durationSec: 0,
    renderTimeSec: 0,
    outputFileSizeMB: 420,
    outputDestination: '/exports/memoirs/aunt_clara_print_memoir.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    profileName: 'Print Memoir PDF (High-Res)',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), // Tonight
    logs: [
      '[07:45:00] Job created and scheduled for overnight batch rendering at 02:00 AM.',
    ],
    aiSuggestions: [
      'Scheduled to run overnight when system GPU load is low.',
    ],
    tags: ['PDF Memoir', 'Book Print', 'Scheduled'],
  },
  {
    id: 'job-heartland-podcast',
    storyId: 'story-7',
    storyName: 'Voices of the Heartland - Episode 03',
    version: 'v1.0 Master',
    type: 'audio_podcast',
    resolution: 'Audio Only',
    format: 'MP3',
    status: 'completed',
    priority: 'normal',
    progress: 100,
    currentStage: 'completed',
    stages: generateDefaultStages('completed', 100),
    preflightChecks: [],
    startedAt: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    durationSec: 1840, // 30 mins 40 secs
    renderTimeSec: 140,
    outputFileSizeMB: 72,
    outputDestination: '/exports/podcasts/voices_heartland_ep3.mp3',
    outputFileUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80',
    profileName: 'Audio Podcast (MP3 320k)',
    createdAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    logs: [
      '[05:00:00] Audio podcast mastering pipeline started',
      '[05:01:30] Multi-track voice balance & noise reduction applied',
      '[05:02:10] Audio exported at 320 kbps MP3.',
    ],
    aiSuggestions: [
      'Podcast mastering achieved crisp voice clarity and balanced background warmth.',
    ],
    checksum: 'sha256-b7891234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    tags: ['Podcast', 'Audio', 'Completed'],
  },
];

export const DEFAULT_PRODUCTION_SETTINGS: ProductionSettings = {
  maxParallelWorkers: 2,
  gpuAcceleration: true,
  autoCleanupDays: 30,
  maxStorageLimitGB: 100,
  cloudSyncEnabled: true,
  webhookUrl: 'https://api.reellegacy.app/v1/webhooks/renders',
  defaultOutputProfileId: 'profile-1080p-doc',
  autoPreflightCheck: true,
  notifyOnCompletion: true,
  lowPriorityOvernightOnly: false,
};

type QueueListener = () => void;

export class RenderQueueService {
  private static instance: RenderQueueService;
  private jobs: RenderJob[] = [];
  private settings: ProductionSettings = DEFAULT_PRODUCTION_SETTINGS;
  private isQueuePaused: boolean = false;
  private listeners: QueueListener[] = [];
  private tickerTimer: any = null;

  private constructor() {
    this.loadData();
    this.startTicker();
  }

  public static getInstance(): RenderQueueService {
    if (!RenderQueueService.instance) {
      RenderQueueService.instance = new RenderQueueService();
    }
    return RenderQueueService.instance;
  }

  private loadData(): void {
    try {
      const savedJobs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedJobs) {
        this.jobs = JSON.parse(savedJobs);
      } else {
        this.jobs = [...INITIAL_RENDER_JOBS];
        this.saveData();
      }

      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch {
      this.jobs = [...INITIAL_RENDER_JOBS];
      this.settings = DEFAULT_PRODUCTION_SETTINGS;
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.jobs));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save render queue state to localStorage', e);
    }
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.saveData();
    this.listeners.forEach((l) => l());
  }

  // Automated background simulation ticker
  private startTicker(): void {
    if (this.tickerTimer) clearInterval(this.tickerTimer);

    this.tickerTimer = setInterval(() => {
      if (this.isQueuePaused) return;

      let changed = false;

      // Check if any job is currently running
      const runningJobs = this.jobs.filter((j) => j.status === 'running');

      // If running jobs count is less than maxParallelWorkers, auto start highest priority queued job
      if (runningJobs.length < this.settings.maxParallelWorkers) {
        const queuedJob = this.jobs.find((j) => j.status === 'queued');
        if (queuedJob) {
          queuedJob.status = 'running';
          queuedJob.startedAt = queuedJob.startedAt || new Date().toISOString();
          queuedJob.logs.push(`[${new Date().toLocaleTimeString()}] Pipeline started from queue.`);
          changed = true;
        }
      }

      // Progress active running jobs
      for (const job of this.jobs) {
        if (job.status === 'running') {
          job.progress = Math.min(100, job.progress + Math.floor(Math.random() * 3) + 1);
          job.renderTimeSec += 3;

          if (job.estimatedTimeRemainingSec && job.estimatedTimeRemainingSec > 0) {
            job.estimatedTimeRemainingSec = Math.max(0, job.estimatedTimeRemainingSec - 3);
          }

          // Advance stages based on progress percentage
          const stageIndex = Math.min(
            PIPELINE_STAGES_TEMPLATE.length - 1,
            Math.floor((job.progress / 100) * PIPELINE_STAGES_TEMPLATE.length)
          );
          const newStage = PIPELINE_STAGES_TEMPLATE[stageIndex];

          if (job.currentStage !== newStage.id) {
            job.currentStage = newStage.id;
            job.logs.push(
              `[${new Date().toLocaleTimeString()}] Stage update: ${newStage.name} (${job.progress}%)`
            );
          }

          job.stages = generateDefaultStages(job.currentStage, job.progress);

          // Complete job if progress hits 100
          if (job.progress >= 100) {
            job.status = 'completed';
            job.currentStage = 'completed';
            job.completedAt = new Date().toISOString();
            job.estimatedTimeRemainingSec = 0;
            job.outputFileUrl = job.outputFileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
            job.checksum = job.checksum || `sha256-${Date.now().toString(16)}abc123456789`;
            job.logs.push(`[${new Date().toLocaleTimeString()}] RENDER COMPLETED SUCCESSFULLY.`);
          }

          changed = true;
        }
      }

      if (changed) {
        this.notify();
      }
    }, 3000);
  }

  // Data Getters
  public getJobs(): RenderJob[] {
    return [...this.jobs];
  }

  public getJobById(id: string): RenderJob | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  public getSettings(): ProductionSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<ProductionSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.notify();
  }

  public getSummaryStats(): QueueSummaryStats {
    const totalJobs = this.jobs.length;
    const runningJobs = this.jobs.filter((j) => j.status === 'running').length;
    const queuedJobs = this.jobs.filter((j) => j.status === 'queued').length;
    const completedJobs = this.jobs.filter((j) => j.status === 'completed').length;
    const failedJobs = this.jobs.filter((j) => j.status === 'failed').length;
    const cancelledJobs = this.jobs.filter((j) => j.status === 'cancelled').length;
    const scheduledJobs = this.jobs.filter((j) => j.status === 'scheduled').length;

    const completedWithTime = this.jobs.filter((j) => j.status === 'completed' && j.renderTimeSec > 0);
    const totalRenderTime = completedWithTime.reduce((acc, j) => acc + j.renderTimeSec, 0);
    const averageRenderTimeSec = completedWithTime.length ? Math.round(totalRenderTime / completedWithTime.length) : 240;

    const storageUsedGB = Math.round(
      this.jobs.reduce((acc, j) => acc + (j.outputFileSizeMB || 200), 0) / 1024 * 10
    ) / 10;

    const pendingAIJobs = this.jobs.filter(
      (j) => j.status === 'running' || j.status === 'queued' || j.status === 'preflight'
    ).length;

    const estimatedQueueFinishTimeSec = runningJobs * 180 + queuedJobs * 240;
    const successRatePercent = totalJobs ? Math.round((completedJobs / (completedJobs + failedJobs || 1)) * 100) : 100;

    return {
      totalJobs,
      runningJobs,
      queuedJobs,
      completedJobs,
      failedJobs,
      cancelledJobs,
      scheduledJobs,
      averageRenderTimeSec,
      storageUsedGB,
      pendingAIJobs,
      estimatedQueueFinishTimeSec,
      successRatePercent,
      activeWorkers: runningJobs,
      maxParallelWorkers: this.settings.maxParallelWorkers,
      isQueuePaused: this.isQueuePaused,
    };
  }

  // Filtering
  public filterJobs(filterState: RenderFilterState): RenderJob[] {
    let result = [...this.jobs];

    // Status / Category Filter
    if (filterState.category && filterState.category !== 'all') {
      if (filterState.category === 'exports') {
        result = result.filter((j) => j.status === 'completed');
      } else if (filterState.category === 'packages') {
        result = result.filter((j) => j.type === 'zip_archive' || j.type === 'voice_package');
      } else {
        result = result.filter((j) => j.status === filterState.category);
      }
    }

    // Render Type Filter
    if (filterState.renderType && filterState.renderType !== 'all') {
      result = result.filter((j) => j.type === filterState.renderType);
    }

    // Priority Filter
    if (filterState.priority && filterState.priority !== 'all') {
      result = result.filter((j) => j.priority === filterState.priority);
    }

    // Search Query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.storyName.toLowerCase().includes(q) ||
          j.profileName.toLowerCase().includes(q) ||
          j.format.toLowerCase().includes(q) ||
          j.resolution.toLowerCase().includes(q) ||
          j.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (filterState.sortBy === 'priority') {
        const order = { urgent: 4, high: 3, normal: 2, low: 1 };
        const diff = order[b.priority] - order[a.priority];
        return filterState.sortOrder === 'desc' ? diff : -diff;
      }
      if (filterState.sortBy === 'progress') {
        const diff = b.progress - a.progress;
        return filterState.sortOrder === 'desc' ? diff : -diff;
      }
      if (filterState.sortBy === 'storyName') {
        return filterState.sortOrder === 'desc'
          ? b.storyName.localeCompare(a.storyName)
          : a.storyName.localeCompare(b.storyName);
      }
      // Default: createdAt
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return filterState.sortOrder === 'desc' ? diff : -diff;
    });

    return result;
  }

  // Job Actions
  public createJob(data: Partial<RenderJob>): RenderJob {
    const checks = PreflightValidationService.runPreflightChecks(
      data.storyName || 'New Documentary Render',
      data.type || 'documentary'
    );

    const hasErrors = checks.some((c) => c.severity === 'error');
    const initialStatus: RenderJobStatus = hasErrors
      ? 'preflight'
      : data.status || 'queued';

    const newJob: RenderJob = {
      id: `job-${Date.now()}`,
      storyId: data.storyId || `story-${Date.now()}`,
      storyName: data.storyName || 'Untitled Documentary Project',
      version: data.version || 'v1.0',
      type: data.type || 'documentary',
      resolution: data.resolution || '1080p',
      format: data.format || 'MP4 (H.264)',
      status: initialStatus,
      priority: data.priority || 'normal',
      progress: initialStatus === 'running' ? 5 : 0,
      currentStage: initialStatus === 'running' ? 'asset_verification' : 'draft',
      stages: generateDefaultStages(initialStatus === 'running' ? 'asset_verification' : 'draft', 0),
      preflightChecks: checks,
      startedAt: initialStatus === 'running' ? new Date().toISOString() : undefined,
      scheduledFor: data.scheduledFor,
      estimatedTimeRemainingSec: 300,
      durationSec: data.durationSec || 600,
      renderTimeSec: 0,
      outputFileSizeMB: data.outputFileSizeMB || 1200,
      outputDestination: data.outputDestination || `/exports/renders/${(data.storyName || 'render').toLowerCase().replace(/\s+/g, '_')}.mp4`,
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      profileName: data.profileName || '1080p Documentary Master',
      assignedTemplate: data.assignedTemplate || 'Custom Studio Scaffold',
      createdAt: new Date().toISOString(),
      logs: [
        `[${new Date().toLocaleTimeString()}] Production render job created.`,
        `[${new Date().toLocaleTimeString()}] Pre-flight analysis executed: ${checks.length} checks performed.`,
      ],
      aiSuggestions: [
        'Pre-flight verified project metadata and timeline references.',
      ],
      tags: data.tags || ['New Render', 'Custom'],
    };

    this.jobs.unshift(newJob);
    this.notify();
    return newJob;
  }

  public pauseJob(id: string): boolean {
    const job = this.getJobById(id);
    if (job && (job.status === 'running' || job.status === 'queued')) {
      job.status = 'paused';
      job.logs.push(`[${new Date().toLocaleTimeString()}] Render job paused by user.`);
      this.notify();
      return true;
    }
    return false;
  }

  public resumeJob(id: string): boolean {
    const job = this.getJobById(id);
    if (job && (job.status === 'paused' || job.status === 'queued' || job.status === 'scheduled')) {
      job.status = 'running';
      job.startedAt = job.startedAt || new Date().toISOString();
      job.logs.push(`[${new Date().toLocaleTimeString()}] Render job resumed.`);
      this.notify();
      return true;
    }
    return false;
  }

  public retryJob(id: string): boolean {
    const job = this.getJobById(id);
    if (job) {
      job.status = 'running';
      job.progress = 10;
      job.currentStage = 'preflight';
      job.stages = generateDefaultStages('preflight', 10);
      job.startedAt = new Date().toISOString();
      job.logs.push(`[${new Date().toLocaleTimeString()}] Retrying render pipeline from Stage 1 (Pre-flight).`);
      this.notify();
      return true;
    }
    return false;
  }

  public cancelJob(id: string): boolean {
    const job = this.getJobById(id);
    if (job && job.status !== 'completed') {
      job.status = 'cancelled';
      job.logs.push(`[${new Date().toLocaleTimeString()}] Job cancelled.`);
      this.notify();
      return true;
    }
    return false;
  }

  public duplicateJob(id: string): RenderJob | null {
    const source = this.getJobById(id);
    if (!source) return null;

    const duplicated = this.createJob({
      storyId: source.storyId,
      storyName: `${source.storyName} (Copy)`,
      version: `${source.version} - Copy`,
      type: source.type,
      resolution: source.resolution,
      format: source.format,
      priority: source.priority,
      durationSec: source.durationSec,
      outputFileSizeMB: source.outputFileSizeMB,
      profileName: source.profileName,
      assignedTemplate: source.assignedTemplate,
      thumbnailUrl: source.thumbnailUrl,
      tags: source.tags,
    });

    return duplicated;
  }

  public deleteJob(id: string): boolean {
    const len = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    if (this.jobs.length < len) {
      this.notify();
      return true;
    }
    return false;
  }

  public setPriority(id: string, priority: RenderJob['priority']): boolean {
    const job = this.getJobById(id);
    if (job) {
      job.priority = priority;
      job.logs.push(`[${new Date().toLocaleTimeString()}] Priority updated to ${priority.toUpperCase()}.`);
      this.notify();
      return true;
    }
    return false;
  }

  public pauseQueue(): void {
    this.isQueuePaused = true;
    this.notify();
  }

  public resumeQueue(): void {
    this.isQueuePaused = false;
    this.notify();
  }

  public applyQuickFix(jobId: string, checkId: string): boolean {
    const job = this.getJobById(jobId);
    if (!job) return false;

    const check = job.preflightChecks.find((c) => c.id === checkId);
    if (check) {
      check.resolved = true;
      job.logs.push(
        `[${new Date().toLocaleTimeString()}] AI Production Assistant executed quick fix for: "${check.message}"`
      );
      job.aiSuggestions.push(`Quick fix applied: ${check.suggestion || 'Resolved pre-flight issue'}`);

      // If all errors resolved, allow job to proceed to queued or running
      const remainingErrors = job.preflightChecks.some((c) => !c.resolved && c.severity === 'error');
      if (!remainingErrors && job.status === 'preflight') {
        job.status = 'queued';
        job.logs.push(`[${new Date().toLocaleTimeString()}] Pre-flight validation passed after AI quick fixes. Moved to Queue.`);
      }

      this.notify();
      return true;
    }
    return false;
  }

  public clearCompleted(): number {
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.status !== 'completed' && j.status !== 'cancelled');
    const removedCount = initialLen - this.jobs.length;
    if (removedCount > 0) this.notify();
    return removedCount;
  }
}
