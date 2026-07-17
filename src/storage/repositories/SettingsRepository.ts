/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StorageAdapter } from '../adapters/StorageAdapter';
import { SettingsSchema } from '../schemas/schemas';

export class SettingsRepository {
  private adapter: StorageAdapter;
  private storageKey = 'settings';

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  getDefaultSettings(): SettingsSchema {
    let initialTheme: 'light' | 'dark' | 'system' = 'light';
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('reellegacy-theme');
        if (saved === 'dark' || saved === 'light' || saved === 'system') {
          initialTheme = saved as any;
        }
      }
    } catch (e) {}

    return {
      id: 'global-settings',
      theme: initialTheme,
      accentColor: 'amber',
      fontScale: 'medium',
      motionPref: 'smooth',
      compactMode: false,
      animationIntensity: 'moderate',
      
      // Workspace Behavior
      sidebarBehavior: 'expanded',
      rightPanelBehavior: 'collapsible',
      defaultView: 'dashboard',
      cardDensity: 'comfortable',
      tableDensity: 'standard',

      // Notification Preferences
      notificationsEnabled: true,
      inAppNotifs: true,
      emailDigest: true,
      weeklyReminders: false,
      securityLogs: true,
      uploadNotifs: true,
      storyNotifs: true,
      timelineNotifs: true,

      // Playback Preferences
      playbackQuality: 'high',
      playbackAutoplay: false,
      playbackMuteByDefault: true,
      playbackTransitionSpeed: 'normal',

      // Upload Preferences
      uploadAutoOptimize: true,
      uploadMaxResolution: '1080p',

      // Accessibility Preferences
      highContrast: false,
      reducedMotion: false,
      largerText: false,
      keyboardNavigation: true,
      screenReader: false,
      focusVisibility: true,
      density: 'comfortable',

      // Privacy Preferences
      analyticsEnabled: true,
      dataSharing: false,
      profileVisibility: 'private',
      storyVisibility: 'invite-only',
      legacyProfilePrivacy: 'restricted',
      searchVisibility: 'hidden',
      consentPreferences: true,

      // Security Preferences
      twoFactorEnabled: false,
      backupCodesLeft: 8,

      // Account Preferences
      fullName: 'Philip Shaba',
      displayName: 'PhilShaba',
      email: 'PhilShaba96@gmail.com',
      phone: '+1 (555) 019-2831',
      dob: '1996-04-12',
      country: 'United States',
      timeZone: 'America/Los_Angeles (PST)',
      preferredLanguage: 'English (US)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1200',
      emailVerified: true,

      // Co-Author Profile
      firstName: 'Philip',
      lastName: 'Shaba',
      citations: 'Vance Family Archive',
      biography: 'Lead Archivist and Family Historian focusing on Kansas homestead chronologies and mid-century family memoirs.',

      autoSave: true,
      marketingConsent: false,
      archivingPreferences: 'high-quality',
      version: 'v0.1.0',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1
    };
  }

  async getSettings(): Promise<SettingsSchema> {
    const settings = await this.adapter.getItem<SettingsSchema>(this.storageKey);
    if (settings) return settings;

    const defaultSettings = this.getDefaultSettings();
    await this.adapter.setItem(this.storageKey, defaultSettings);
    return defaultSettings;
  }

  async updateSettings(updates: Partial<SettingsSchema>): Promise<SettingsSchema> {
    const current = await this.getSettings();
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.adapter.setItem(this.storageKey, updated);
    return updated;
  }

  async resetEntireSettings(): Promise<SettingsSchema> {
    const defaultSettings = this.getDefaultSettings();
    defaultSettings.updatedAt = new Date().toISOString();
    await this.adapter.setItem(this.storageKey, defaultSettings);
    return defaultSettings;
  }

  async resetSection(section: string): Promise<SettingsSchema> {
    const current = await this.getSettings();
    const defaults = this.getDefaultSettings();
    let updates: Partial<SettingsSchema> = {};

    switch (section.toLowerCase()) {
      case 'appearance':
        updates = {
          theme: defaults.theme,
          accentColor: defaults.accentColor,
          fontScale: defaults.fontScale,
          motionPref: defaults.motionPref,
          compactMode: defaults.compactMode,
          animationIntensity: defaults.animationIntensity
        };
        break;
      case 'workspace':
        updates = {
          sidebarBehavior: defaults.sidebarBehavior,
          rightPanelBehavior: defaults.rightPanelBehavior,
          defaultView: defaults.defaultView,
          cardDensity: defaults.cardDensity,
          tableDensity: defaults.tableDensity
        };
        break;
      case 'notifications':
        updates = {
          notificationsEnabled: defaults.notificationsEnabled,
          inAppNotifs: defaults.inAppNotifs,
          emailDigest: defaults.emailDigest,
          weeklyReminders: defaults.weeklyReminders,
          securityLogs: defaults.securityLogs,
          uploadNotifs: defaults.uploadNotifs,
          storyNotifs: defaults.storyNotifs,
          timelineNotifs: defaults.timelineNotifs
        };
        break;
      case 'playback':
        updates = {
          playbackQuality: defaults.playbackQuality,
          playbackAutoplay: defaults.playbackAutoplay,
          playbackMuteByDefault: defaults.playbackMuteByDefault,
          playbackTransitionSpeed: defaults.playbackTransitionSpeed
        };
        break;
      case 'accessibility':
        updates = {
          highContrast: defaults.highContrast,
          reducedMotion: defaults.reducedMotion,
          largerText: defaults.largerText,
          keyboardNavigation: defaults.keyboardNavigation,
          screenReader: defaults.screenReader,
          focusVisibility: defaults.focusVisibility,
          density: defaults.density
        };
        break;
      case 'privacy':
        updates = {
          analyticsEnabled: defaults.analyticsEnabled,
          dataSharing: defaults.dataSharing,
          profileVisibility: defaults.profileVisibility,
          storyVisibility: defaults.storyVisibility,
          legacyProfilePrivacy: defaults.legacyProfilePrivacy,
          searchVisibility: defaults.searchVisibility,
          consentPreferences: defaults.consentPreferences
        };
        break;
      case 'security':
        updates = {
          twoFactorEnabled: defaults.twoFactorEnabled,
          backupCodesLeft: defaults.backupCodesLeft
        };
        break;
      case 'account':
        updates = {
          fullName: defaults.fullName,
          displayName: defaults.displayName,
          email: defaults.email,
          phone: defaults.phone,
          dob: defaults.dob,
          country: defaults.country,
          timeZone: defaults.timeZone,
          preferredLanguage: defaults.preferredLanguage,
          avatar: defaults.avatar,
          coverImage: defaults.coverImage,
          emailVerified: defaults.emailVerified
        };
        break;
      case 'profile':
        updates = {
          firstName: defaults.firstName,
          lastName: defaults.lastName,
          citations: defaults.citations,
          biography: defaults.biography
        };
        break;
    }

    return this.updateSettings(updates);
  }

  async exportSettings(): Promise<string> {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  async importSettings(jsonString: string): Promise<SettingsSchema> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        // Sanity checks
        const defaults = this.getDefaultSettings();
        const merged = { ...defaults, ...parsed, id: 'global-settings', updatedAt: new Date().toISOString() };
        await this.adapter.setItem(this.storageKey, merged);
        return merged;
      }
      throw new Error('Invalid settings JSON object');
    } catch (e: any) {
      throw new Error(`Settings import failed: ${e.message}`);
    }
  }
}
