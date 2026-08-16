/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IntegrationProvider, AutomationRule, SyncLogEvent } from './integrationTypes';

export const INITIAL_INTEGRATIONS: IntegrationProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    tagline: 'Automated 4K Documentary & Raw Media Vault Backup',
    description: 'Synchronize documentary exports, audio master tapes, and declassified manuscript backups directly to your secure Google Cloud folder.',
    category: 'Cloud Storage',
    iconName: 'HardDrive',
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    status: 'connected',
    isRecommended: true,
    connectedAccount: 'PhilShaba96@gmail.com',
    lastSyncTime: '12 mins ago',
    syncFrequency: 'Real-time',
    storageUsedMb: 1240,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 1,
    rating: 4.9,
    benefits: [
      'Automatic secondary backup for every rendered 4K video file',
      'Seamless multi-device access for family collaborators',
      'AES-256 encrypted archival storage'
    ],
    features: ['Auto-Upload Renders', 'Documentary Draft Sync', 'Subfolder Folder Organization', 'PDF Transcript Mirroring'],
    permissionsCanAccess: [
      'Create and manage ReelLegacy backup folder in Google Drive',
      'Upload exported .mp4, .wav, and .pdf documents',
      'Read files created specifically by the ReelLegacy app'
    ],
    permissionsCannotAccess: [
      'Cannot view, edit, or delete personal files outside the ReelLegacy folder',
      'Cannot access Gmail, Google Calendar, or Contacts',
      'Cannot read external user spreadsheets'
    ],
    oauthScopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    version: 'v2.4.1'
  },
  {
    id: 'google-photos',
    name: 'Google Photos',
    tagline: 'Archival Family Album Sync & Restoration Ingest',
    description: 'Import high-resolution historical photos directly into the ReelLegacy Media Library for AI colorization and Ken Burns scene animation.',
    category: 'Media Libraries',
    iconName: 'Globe',
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    status: 'connected',
    isRecommended: true,
    connectedAccount: 'PhilShaba96@gmail.com',
    lastSyncTime: '1 hour ago',
    syncFrequency: 'Daily',
    storageUsedMb: 850,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 2,
    rating: 4.8,
    benefits: [
      'Direct import from Google Photos family albums',
      'EXIF metadata parsing for automatic date timeline placement',
      'High-dynamic-range photo enhancement pipeline'
    ],
    features: ['Album Selector', 'Face Grouping Mapping', 'Metadata Auto-Tagging', 'Resolution Preflight Inspection'],
    permissionsCanAccess: [
      'Read photos and albums explicitly selected for family stories',
      'Download high-resolution image assets for video rendering'
    ],
    permissionsCannotAccess: [
      'Cannot view unselected private photo albums',
      'Cannot delete or modify original photos in Google Photos'
    ],
    oauthScopes: [
      'https://www.googleapis.com/auth/photoslibrary.readonly'
    ],
    version: 'v1.8.0'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice Engine',
    tagline: 'Hyper-Realistic Neural Voice Narration & Accent Clone',
    description: 'Synthesize custom oral histories using hyper-realistic voice profiles or clone a beloved relative’s voice from audio recordings.',
    category: 'AI Providers',
    iconName: 'Mic',
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    status: 'connected',
    isRecommended: true,
    connectedAccount: 'API Key Active (Premium Tier)',
    lastSyncTime: '30 mins ago',
    syncFrequency: 'Real-time',
    storageUsedMb: 320,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 1,
    rating: 4.95,
    benefits: [
      'Studio-grade oral history voice synthesis',
      'Custom voice cloning from vintage tape cassette recordings',
      'Granular control over stability, clarity, and emotion'
    ],
    features: ['Custom Voice Models', 'Low Latency Audio Streaming', 'Multiple Accent Profiles', 'Automatic Pacing Alignment'],
    permissionsCanAccess: [
      'Send screenplay narration text to ElevenLabs synthesis API',
      'Receive synthesized audio waveforms (.wav / .mp3)'
    ],
    permissionsCannotAccess: [
      'Cannot access stored voice models of other accounts',
      'Cannot modify voice cloning settings without explicit owner confirmation'
    ],
    oauthScopes: ['api_key_v1'],
    version: 'v3.1.2'
  },
  {
    id: 'gemini-ai',
    name: 'Google Gemini 2.5 Flash',
    tagline: 'Documentary Screenplay Scripting & Director Intelligence',
    description: 'Built-in AI director powering story outline expansion, transcript parsing, archival photo captioning, and pacing recommendations.',
    category: 'AI Providers',
    iconName: 'Sparkles',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    status: 'connected',
    isRecommended: true,
    connectedAccount: 'Google Cloud System Token',
    lastSyncTime: 'Active (Real-time)',
    syncFrequency: 'Real-time',
    setupDifficulty: 'Easy',
    setupTimeMinutes: 0,
    rating: 5.0,
    benefits: [
      'Native full-stack integration with zero setup required',
      'Sub-second screenplay generation and scene breakdown',
      'Multimodal analysis of scanned historical documents'
    ],
    features: ['Auto-Scripting', 'Historical Fact Verification', 'Scene Pacing Engine', 'Multimodal OCR'],
    permissionsCanAccess: [
      'Process text prompts and historical notes for story creation',
      'Analyze image captions for timeline placement'
    ],
    permissionsCannotAccess: [
      'Cannot train public models on private family story data',
      'Cannot store unencrypted prompt history'
    ],
    oauthScopes: ['internal_service_token'],
    version: 'Gemini 2.5 Flash'
  },
  {
    id: 'dropbox',
    name: 'Dropbox Personal Archives',
    tagline: 'Batch Audio Narration & Raw Media Folder Import',
    description: 'Import batch oral history cassette digitizations and raw camera footage directly from target Dropbox workspace folders.',
    category: 'Cloud Storage',
    iconName: 'HardDrive',
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    status: 'disconnected',
    isRecommended: true,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 2,
    rating: 4.7,
    benefits: [
      'Selective folder sync for oral history cassettes',
      'Fast delta uploads for large video footage files',
      'Automatic conflict resolution during multi-user editing'
    ],
    features: ['Folder Watcher', 'Automatic RAW conversion', 'Media Metadata Parser', 'Batch Audio Ingestion'],
    permissionsCanAccess: [
      'Read files in selected ReelLegacy Dropbox folder',
      'Write documentary export archives'
    ],
    permissionsCannotAccess: [
      'Cannot read personal Dropbox files outside designated folder'
    ],
    oauthScopes: ['files.content.read', 'files.content.write'],
    version: 'v2.1.0'
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive Adapter',
    tagline: 'Biographical Transcripts & Document Archives Sync',
    description: 'Synchronize timeline event transcripts, military discharge records, and biographical records to personal Microsoft cloud archives.',
    category: 'Cloud Storage',
    iconName: 'HardDrive',
    iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    status: 'disconnected',
    isRecommended: true,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 2,
    rating: 4.6,
    benefits: [
      'Direct integration with Microsoft Word transcripts',
      'Automatic document OCR indexing',
      'Enterprise-grade security'
    ],
    features: ['Word Document Import', 'OneDrive Vault Sync', 'Version History Backup'],
    permissionsCanAccess: [
      'Read documents in ReelLegacy app folder',
      'Save exported PDF transcripts'
    ],
    permissionsCannotAccess: [
      'Cannot view personal Outlook or Teams data'
    ],
    oauthScopes: ['Files.ReadWrite.AppFolder'],
    version: 'v1.4.0'
  },
  {
    id: 'ancestry',
    name: 'Ancestry.com Data Connector',
    tagline: 'GEDCOM Genealogy Import & Census Record Mapping',
    description: 'Import genetic family maps, birth indexes, census logs, and historical immigration documents to build rich biographical profiles.',
    category: 'Genealogy',
    iconName: 'Users',
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    status: 'disconnected',
    isRecommended: true,
    setupDifficulty: 'Moderate',
    setupTimeMinutes: 4,
    rating: 4.85,
    benefits: [
      'Import complete family trees via GEDCOM standard',
      'Automatic historical event cross-verification',
      'Instant biographical timeline generation'
    ],
    features: ['GEDCOM 5.5 Import', 'Census Record Mapping', 'Kinship Graph Visualizer', 'Immigration Log Sync'],
    permissionsCanAccess: [
      'Read family tree profile names and dates',
      'Download attached historical record scans'
    ],
    permissionsCannotAccess: [
      'Cannot alter Ancestry.com online family trees',
      'Cannot share tree data publicly'
    ],
    oauthScopes: ['tree_read', 'records_read'],
    version: 'v1.1.0'
  },
  {
    id: 'familysearch',
    name: 'FamilySearch Open Tree',
    tagline: 'Global Historical Archive Search & Public Record Link',
    description: 'Connect with the world’s largest free genealogical database to discover historic photos, military records, and baptismal logs.',
    category: 'Genealogy',
    iconName: 'Globe',
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    status: 'disconnected',
    isRecommended: true,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 3,
    rating: 4.75,
    benefits: [
      'Access millions of free public domain records',
      'Automatic ancestor record matching',
      'Community historical photo discovery'
    ],
    features: ['Person Identifier Sync', 'Memory Asset Import', 'Source Citation Generator'],
    permissionsCanAccess: [
      'Search public FamilySearch ancestral records',
      'Link historical record citations to story timeline'
    ],
    permissionsCannotAccess: [
      'Cannot modify FamilySearch shared community tree'
    ],
    oauthScopes: ['familysearch_read'],
    version: 'v2.0.1'
  },
  {
    id: 'vimeo',
    name: 'Vimeo Pro Broadcast',
    tagline: 'Private High-Bitrate Family Premiere Streaming',
    description: 'Publish finished 4K documentaries to private password-protected Vimeo showcase galleries for high-fidelity family viewing on Smart TVs.',
    category: 'Video Platforms',
    iconName: 'Video',
    iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    status: 'disconnected',
    isRecommended: true,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 2,
    rating: 4.9,
    benefits: [
      'Zero-compression 4K HDR video streaming',
      'Custom password protection for family privacy',
      'Apple TV & Smart TV Vimeo app playback'
    ],
    features: ['4K Direct Upload', 'Password Showcase', 'Subtitle Track Injection', 'Embed Code Generation'],
    permissionsCanAccess: [
      'Upload video exports to designated Vimeo account',
      'Create private showcases for family members'
    ],
    permissionsCannotAccess: [
      'Cannot delete or modify existing Vimeo videos'
    ],
    oauthScopes: ['upload', 'edit'],
    version: 'v3.0.0'
  },
  {
    id: 'youtube',
    name: 'YouTube Studio Private Link',
    tagline: 'Unlisted Family Legacy Video Publishing',
    description: 'Publish documentary chapters directly as unlisted or private YouTube videos for easy sharing across family smart TV devices and mobile phones.',
    category: 'Video Platforms',
    iconName: 'Video',
    iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
    status: 'disconnected',
    isRecommended: true,
    setupDifficulty: 'Easy',
    setupTimeMinutes: 2,
    rating: 4.8,
    benefits: [
      'Instant playback on any mobile device, tablet, or TV',
      'Automatic closed captioning and multitalent audio tracks',
      'Unlisted privacy controls'
    ],
    features: ['Direct Export to YouTube', 'Thumbnail Generation', 'Chapter Marker Injection'],
    permissionsCanAccess: [
      'Upload unlisted video content to designated channel',
      'Inject chapter timecodes in video descriptions'
    ],
    permissionsCannotAccess: [
      'Cannot view or manage public YouTube channel settings'
    ],
    oauthScopes: ['https://www.googleapis.com/auth/youtube.upload'],
    version: 'v2.1.0'
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud Enterprise SDK',
    tagline: 'Custom Storage Bucket & High-Throughput GPU Rendering',
    description: 'Connect enterprise GCP service accounts for custom Cloud Storage buckets and dedicated Cloud Run rendering clusters.',
    category: 'Developer APIs',
    iconName: 'Cpu',
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    status: 'disconnected',
    setupDifficulty: 'Advanced',
    setupTimeMinutes: 10,
    rating: 4.9,
    benefits: [
      'Unlimited scalable storage with GCS multi-region persistence',
      'Dedicated GPU node provisioning for ultra-fast 4K renders',
      'Custom encryption key (CMEK) support'
    ],
    features: ['Service Account JSON Upload', 'Cloud Storage Bucket Mapping', 'GPU Engine Scaling'],
    permissionsCanAccess: [
      'Read/Write target GCS storage buckets',
      'Invoke dedicated render API endpoints'
    ],
    permissionsCannotAccess: [
      'Cannot modify other GCP project billing or IAM rules'
    ],
    oauthScopes: ['service_account_json'],
    version: 'v4.0.0'
  },
  {
    id: 'slack',
    name: 'Slack Family Workspace',
    tagline: 'Editorial Review & Render Completion Notifications',
    description: 'Receive real-time notifications in family Slack channels when new story chapters are ready for review or when 4K renders finish exporting.',
    category: 'Communication',
    iconName: 'Radio',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    status: 'disconnected',
    setupDifficulty: 'Easy',
    setupTimeMinutes: 2,
    rating: 4.7,
    benefits: [
      'Instant alerts when relatives leave review comments',
      'Render completion preview clips sent directly to channel',
      'Automated milestone updates'
    ],
    features: ['Webhook Notifications', 'Interactive Review Buttons', 'Export Summary Cards'],
    permissionsCanAccess: [
      'Post notification cards to designated Slack channel'
    ],
    permissionsCannotAccess: [
      'Cannot read private channel messages or direct messages'
    ],
    oauthScopes: ['incoming-webhook'],
    version: 'v1.2.0'
  },
  {
    id: 'zapier',
    name: 'Zapier Workflow Engine',
    tagline: 'Custom Trigger Automation & 5,000+ App Connections',
    description: 'Build custom automated triggers connecting ReelLegacy events with Notion, Airtable, Google Sheets, or custom webhooks.',
    category: 'Automation',
    iconName: 'Zap',
    iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    status: 'disconnected',
    setupDifficulty: 'Moderate',
    setupTimeMinutes: 5,
    rating: 4.85,
    benefits: [
      'Connect ReelLegacy to over 5,000 third-party apps',
      'Trigger custom workflows on story creation or milestone completion',
      'No-code automation builder'
    ],
    features: ['Webhook Trigger', 'Action Dispatcher', 'Payload Customizer'],
    permissionsCanAccess: [
      'Receive outbound ReelLegacy event webhooks'
    ],
    permissionsCannotAccess: [
      'Cannot execute arbitrary internal app logic'
    ],
    oauthScopes: ['webhook_read'],
    version: 'v2.2.0'
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    title: 'Auto-Backup Completed 4K Renders',
    description: 'When a documentary 4K render finishes exporting → Automatically upload the master .mp4 to Google Drive.',
    triggerEvent: '4K Export Completed',
    actionService: 'Google Drive',
    actionServiceId: 'google-drive',
    enabled: true,
    lastRun: '15 mins ago',
    runCount: 28,
    category: 'Backup'
  },
  {
    id: 'rule-2',
    title: 'Archive Completed Profiles',
    description: 'When a Legacy Profile reaches 100% completion → Generate PDF document bundle and sync to Google Drive.',
    triggerEvent: 'Profile Reaches 100%',
    actionService: 'Google Drive',
    actionServiceId: 'google-drive',
    enabled: true,
    lastRun: '2 days ago',
    runCount: 8,
    category: 'Genealogy'
  },
  {
    id: 'rule-3',
    title: 'Auto-Generate Narration Subtitles',
    description: 'When ElevenLabs voice synthesis completes → Automatically produce WebVTT subtitle track for scene timeline.',
    triggerEvent: 'Voice Synthesis Finished',
    actionService: 'ElevenLabs Voice Engine',
    actionServiceId: 'elevenlabs',
    enabled: true,
    lastRun: '1 hour ago',
    runCount: 42,
    category: 'Narration'
  },
  {
    id: 'rule-4',
    title: 'Import New Photos from Google Photos Album',
    description: 'When new images are added to "Family History Scans" album in Google Photos → Import and tag automatically.',
    triggerEvent: 'New Album Item Added',
    actionService: 'Google Photos',
    actionServiceId: 'google-photos',
    enabled: false,
    lastRun: 'Never',
    runCount: 0,
    category: 'Backup'
  },
  {
    id: 'rule-5',
    title: 'Notify Collaborators on Render Completion',
    description: 'When a documentary chapter completes exporting → Send email/app notifications to all family story editors.',
    triggerEvent: 'Chapter Export Finished',
    actionService: 'Google Drive',
    actionServiceId: 'google-drive',
    enabled: true,
    lastRun: '15 mins ago',
    runCount: 12,
    category: 'Notification'
  }
];

export const INITIAL_SYNC_LOGS: SyncLogEvent[] = [
  {
    id: 'log-1',
    integrationId: 'google-drive',
    integrationName: 'Google Drive',
    timestamp: '12 mins ago',
    status: 'success',
    message: 'Master Video Export Backup Uploaded',
    details: 'Grandpa_WWII_Memoir_4K_Master.mp4 (1.2 GB) successfully synchronized to ReelLegacy/Backups.',
    transferredBytes: 1288490188
  },
  {
    id: 'log-2',
    integrationId: 'elevenlabs',
    integrationName: 'ElevenLabs',
    timestamp: '45 mins ago',
    status: 'success',
    message: 'Voice Synthesis Batch Completed',
    details: '14 audio narration clips synthesized for Chapter 3 using Evelyn profile. Latency: 210 ms.',
    transferredBytes: 15420000
  },
  {
    id: 'log-3',
    integrationId: 'google-photos',
    integrationName: 'Google Photos',
    timestamp: '1 hour ago',
    status: 'success',
    message: '12 Archival Photos Imported',
    details: 'Successfully ingested 12 high-resolution scans from album "1940s Vintage Photos". EXIF dates parsed.',
    transferredBytes: 48000000
  },
  {
    id: 'log-4',
    integrationId: 'dropbox',
    integrationName: 'Dropbox',
    timestamp: '3 hours ago',
    status: 'info',
    message: 'Connection Test Passed',
    details: 'Dropbox sandbox API connection verified. Ready for user activation.',
  },
  {
    id: 'log-5',
    integrationId: 'google-drive',
    integrationName: 'Google Drive',
    timestamp: 'Yesterday at 4:15 PM',
    status: 'success',
    message: 'Legacy Profile PDF Transcripts Synced',
    details: '8 biographical profile summaries exported to PDF and synchronized.',
    transferredBytes: 12400000
  }
];
