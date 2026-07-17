/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class MigrationService {
  private static readonly CURRENT_VERSION = 1;

  static async checkAndMigrate(): Promise<void> {
    const versionStr = localStorage.getItem('rl_storage_version');
    const version = versionStr ? parseInt(versionStr) : 0;

    if (version < MigrationService.CURRENT_VERSION) {
      await MigrationService.runMigrations(version, MigrationService.CURRENT_VERSION);
      localStorage.setItem('rl_storage_version', MigrationService.CURRENT_VERSION.toString());
    }
  }

  private static async runMigrations(fromVersion: number, toVersion: number): Promise<void> {
    console.log(`MigrationService: Migrating storage from version ${fromVersion} to ${toVersion}`);
    // Future migrations can be implemented here incrementally
    if (fromVersion === 0) {
      // Setup initial empty structures if not present
      const keys = ['profiles', 'stories', 'media_assets', 'timeline_events', 'collections', 'notifications', 'users', 'sessions'];
      keys.forEach(key => {
        const fullKey = `rl_${key}`;
        if (!localStorage.getItem(fullKey)) {
          localStorage.setItem(fullKey, JSON.stringify([]));
        }
      });
    }
  }
}
