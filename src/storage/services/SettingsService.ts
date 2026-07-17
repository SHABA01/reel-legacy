/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { SettingsSchema } from '../schemas/schemas';
import { ActivityService } from './ActivityService';

export class SettingsService {
  /**
   * Retrieves user-configured settings. Fallback is handled in repository.
   */
  static async getSettings(): Promise<SettingsSchema> {
    return persistenceService.settings.getSettings();
  }

  /**
   * Updates user settings. Validates input first, then persists and coordinates UI.
   */
  static async updateSettings(updates: Partial<SettingsSchema>): Promise<SettingsSchema> {
    const validation = this.validate(updates);
    if (!validation.isValid) {
      throw new Error(`Validation error: ${validation.errors.join(', ')}`);
    }

    const current = await persistenceService.settings.getSettings();
    const updated = await persistenceService.settings.updateSettings(updates);

    // Log dynamic activity
    ActivityService.logActivity(
      'Settings Updated',
      'System-wide settings and preferences have been successfully configured.',
      'bg-zinc-500'
    ).catch(err => console.warn('Failed to log settings update activity', err));

    // Dynamic style coordination
    if (updates.theme !== undefined) {
      this.applyTheme(updates.theme);
    }
    this.applyAccessibility(updated);

    return updated;
  }

  /**
   * Resets all configurations to early-access application defaults.
   */
  static async resetEntireSettings(): Promise<SettingsSchema> {
    const updated = await persistenceService.settings.resetEntireSettings();
    this.applyTheme(updated.theme);
    this.applyAccessibility(updated);
    return updated;
  }

  /**
   * Resets a specific category / section of settings.
   */
  static async resetSection(section: string): Promise<SettingsSchema> {
    const updated = await persistenceService.settings.resetSection(section);
    if (section.toLowerCase() === 'appearance') {
      this.applyTheme(updated.theme);
    }
    this.applyAccessibility(updated);
    return updated;
  }

  /**
   * Exports all system preferences to a raw JSON string.
   */
  static async exportSettings(): Promise<string> {
    return persistenceService.settings.exportSettings();
  }

  /**
   * Imports system preferences from a raw JSON string. Validates schema format first.
   */
  static async importSettings(jsonString: string): Promise<SettingsSchema> {
    const updated = await persistenceService.settings.importSettings(jsonString);
    this.applyTheme(updated.theme);
    this.applyAccessibility(updated);
    return updated;
  }

  /**
   * Coordinates live theme styling on the documentElement level.
   */
  static applyTheme(theme: 'light' | 'dark' | 'system') {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    let resolvedTheme: 'light' | 'dark' = 'dark';

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = systemDark ? 'dark' : 'light';
    } else {
      resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    }

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Keep legacy local storage context in sync as a fallback
    localStorage.setItem('reellegacy-theme', theme);
  }

  /**
   * Applies accessibility, scaling, and animation rules to documentElement classes.
   */
  static applyAccessibility(settings: Partial<SettingsSchema>) {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;

    // Apply High Contrast
    if (settings.highContrast !== undefined) {
      if (settings.highContrast) {
        root.classList.add('theme-high-contrast');
      } else {
        root.classList.remove('theme-high-contrast');
      }
    }

    // Apply Reduced Motion
    const reducedMotion = settings.reducedMotion || settings.motionPref === 'reduced';
    if (reducedMotion) {
      root.classList.add('theme-reduced-motion');
    } else {
      root.classList.remove('theme-reduced-motion');
    }

    // Apply Font Scaling class
    if (settings.fontScale) {
      root.classList.remove('font-scale-small', 'font-scale-medium', 'font-scale-large', 'font-scale-xlarge');
      root.classList.add(`font-scale-${settings.fontScale}`);
    }

    // Apply Compact Mode class
    if (settings.compactMode !== undefined) {
      if (settings.compactMode) {
        root.classList.add('compact-mode');
      } else {
        root.classList.remove('compact-mode');
      }
    }
  }

  /**
   * Performs schema constraints checking on preferred properties.
   */
  static validate(settings: Partial<SettingsSchema>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Username / Display Name validations
    if (settings.displayName !== undefined) {
      if (settings.displayName.trim().length < 3) {
        errors.push('Display name must contain at least 3 characters.');
      }
      if (settings.displayName.length > 50) {
        errors.push('Display name cannot exceed 50 characters.');
      }
    }

    // Email validations
    if (settings.email !== undefined && settings.email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(settings.email)) {
        errors.push('Invalid Email structure: Please provide a valid email address.');
      }
    }

    // Co-Author FirstName & LastName
    if (settings.firstName !== undefined && settings.firstName.trim() === '') {
      errors.push('Co-author first name cannot be blank.');
    }
    if (settings.lastName !== undefined && settings.lastName.trim() === '') {
      errors.push('Co-author last name cannot be blank.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
