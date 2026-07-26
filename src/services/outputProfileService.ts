/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OutputProfile } from '../types/render';

export const DEFAULT_OUTPUT_PROFILES: OutputProfile[] = [
  {
    id: 'profile-1080p-doc',
    name: '1080p Documentary Master',
    description: 'High-bitrate Full HD export optimized for archival cinematic storytelling.',
    type: 'documentary',
    resolution: '1080p',
    format: 'MP4 (H.264)',
    fps: 24,
    bitrateMbps: 20,
    audioBitrateKbps: 320,
    isDefault: true,
  },
  {
    id: 'profile-4k-master',
    name: '4K Ultra Master (ProRes)',
    description: 'Ultra HD 3840x2160 uncompressed archive quality for broadcast & cinema projection.',
    type: 'documentary',
    resolution: '4K',
    format: 'ProRes 422',
    fps: 24,
    bitrateMbps: 150,
    audioBitrateKbps: 320,
  },
  {
    id: 'profile-yt-4k',
    name: 'YouTube 4K Ultra',
    description: 'Optimized 16:9 4K H.264 profile tailored for YouTube standard compression.',
    type: 'documentary',
    resolution: '4K',
    format: 'MP4 (H.264)',
    fps: 30,
    bitrateMbps: 45,
    audioBitrateKbps: 320,
  },
  {
    id: 'profile-insta-reel',
    name: 'Instagram Reel (9:16 HD)',
    description: 'Vertical 1080x1920 short-form video preset with boosted color punch and clear captions.',
    type: 'vertical_reel',
    resolution: '9:16 HD',
    format: 'MP4 (H.264)',
    fps: 30,
    bitrateMbps: 15,
    audioBitrateKbps: 256,
  },
  {
    id: 'profile-tiktok-hd',
    name: 'TikTok HD Reel',
    description: 'Vertical format with burned-in animated subtitles and quick hook audio leveling.',
    type: 'vertical_reel',
    resolution: '9:16 HD',
    format: 'MP4 (H.264)',
    fps: 30,
    bitrateMbps: 12,
    audioBitrateKbps: 256,
  },
  {
    id: 'profile-trailer',
    name: 'Cinema Trailer (1080p)',
    description: 'Fast-paced promo trailer with dynamic audio ducking and high frame rate.',
    type: 'trailer',
    resolution: '1080p',
    format: 'MP4 (H.264)',
    fps: 30,
    bitrateMbps: 25,
    audioBitrateKbps: 320,
  },
  {
    id: 'profile-podcast-mp3',
    name: 'Audio Podcast (MP3 320k)',
    description: 'Mastered stereo audio file with multi-track voice balancing and warmth mastering.',
    type: 'audio_podcast',
    resolution: 'Audio Only',
    format: 'MP3',
    fps: 0,
    bitrateMbps: 0,
    audioBitrateKbps: 320,
  },
  {
    id: 'profile-memoir-pdf',
    name: 'Print Memoir PDF (High-Res)',
    description: '300 DPI print-ready PDF book with transcript, keyframes, and photo archive inserts.',
    type: 'memoir_pdf',
    resolution: 'Print PDF',
    format: 'PDF',
    fps: 0,
    bitrateMbps: 0,
    audioBitrateKbps: 0,
  },
  {
    id: 'profile-zip-archive',
    name: 'Full Studio Production Package (ZIP)',
    description: 'Raw media assets, XML project files, high-res audio stems, and transcript SRT files.',
    type: 'zip_archive',
    resolution: '4K',
    format: 'ZIP',
    fps: 24,
    bitrateMbps: 0,
    audioBitrateKbps: 320,
  },
];

const LOCAL_STORAGE_KEY = 'reel_legacy_output_profiles_v1';

export class OutputProfileService {
  private static instance: OutputProfileService;
  private profiles: OutputProfile[] = [];

  private constructor() {
    this.loadProfiles();
  }

  public static getInstance(): OutputProfileService {
    if (!OutputProfileService.instance) {
      OutputProfileService.instance = new OutputProfileService();
    }
    return OutputProfileService.instance;
  }

  private loadProfiles(): void {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        this.profiles = JSON.parse(saved);
      } else {
        this.profiles = [...DEFAULT_OUTPUT_PROFILES];
        this.saveProfiles();
      }
    } catch {
      this.profiles = [...DEFAULT_OUTPUT_PROFILES];
    }
  }

  private saveProfiles(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.profiles));
    } catch (e) {
      console.warn('Failed to save output profiles to localStorage', e);
    }
  }

  public getProfiles(): OutputProfile[] {
    return [...this.profiles];
  }

  public getProfileById(id: string): OutputProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  public addProfile(profileData: Omit<OutputProfile, 'id' | 'isCustom'>): OutputProfile {
    const newProfile: OutputProfile = {
      ...profileData,
      id: `custom-profile-${Date.now()}`,
      isCustom: true,
    };
    this.profiles.push(newProfile);
    this.saveProfiles();
    return newProfile;
  }

  public updateProfile(id: string, updates: Partial<OutputProfile>): OutputProfile | null {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.profiles[idx] = { ...this.profiles[idx], ...updates };
    this.saveProfiles();
    return this.profiles[idx];
  }

  public deleteProfile(id: string): boolean {
    const initialLength = this.profiles.length;
    this.profiles = this.profiles.filter((p) => p.id !== id || p.isDefault);
    const deleted = this.profiles.length < initialLength;
    if (deleted) this.saveProfiles();
    return deleted;
  }

  public resetDefaults(): void {
    this.profiles = [...DEFAULT_OUTPUT_PROFILES];
    this.saveProfiles();
  }
}
