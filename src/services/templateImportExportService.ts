/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoryTemplate } from '../types/storyTemplate';
import { StoryTemplateService } from './storyTemplateService';

export class TemplateImportExportService {
  public static exportTemplateJSON(template: StoryTemplate): string {
    return JSON.stringify(template, null, 2);
  }

  public static downloadTemplateFile(template: StoryTemplate): void {
    const jsonStr = this.exportTemplateJSON(template);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public static importTemplateJSON(jsonString: string): StoryTemplate {
    try {
      const parsed = JSON.parse(jsonString) as StoryTemplate;

      if (!parsed.name || !parsed.narrativeBlueprint || !parsed.narrativeBlueprint.acts) {
        throw new Error('Invalid template format: Missing required fields (name, narrativeBlueprint, acts).');
      }

      const importedTemplate: StoryTemplate = {
        ...parsed,
        id: `tmpl-imported-${Date.now()}`,
        isCustom: true,
        category: 'Custom Templates',
        author: parsed.author ? `${parsed.author} (Imported)` : 'Imported User',
        recentlyUpdated: new Date().toISOString().split('T')[0]
      };

      const service = StoryTemplateService.getInstance();
      return service.saveCustomTemplate(importedTemplate);
    } catch (err: any) {
      throw new Error(`Failed to import story template: ${err.message || 'Invalid JSON format'}`);
    }
  }
}
