/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoryTemplate } from '../types/storyTemplate';
import { StoryTemplateService } from './storyTemplateService';

export interface RecommendationResult {
  recommendedTemplate: StoryTemplate;
  alternativeTemplates: StoryTemplate[];
  recommendationReason: string;
  missingSectionsSuggestion: string[];
  estimatedProductionEffort: {
    estimatedDays: number;
    recommendedAssetCount: number;
    suggestedInterviewHours: number;
    complexityLevel: 'Low' | 'Moderate' | 'High';
  };
}

export class TemplateRecommendationService {
  private static instance = new TemplateRecommendationService();

  public static getInstance(): TemplateRecommendationService {
    return TemplateRecommendationService.instance;
  }

  public getRecommendationsForContext(
    promptOrTopic: string,
    targetAudience?: string
  ): RecommendationResult {
    const service = StoryTemplateService.getInstance();
    const templates = service.getTemplates();

    const topicLower = promptOrTopic.toLowerCase();

    let primaryMatch = templates.find(t => t.id === 'tmpl-life-story') || templates[0];

    if (topicLower.includes('memorial') || topicLower.includes('funeral') || topicLower.includes('remembrance') || topicLower.includes('tribute')) {
      primaryMatch = templates.find(t => t.id === 'tmpl-celebration-life') || primaryMatch;
    } else if (topicLower.includes('military') || topicLower.includes('veteran') || topicLower.includes('army') || topicLower.includes('navy')) {
      primaryMatch = templates.find(t => t.id === 'tmpl-military-service') || primaryMatch;
    } else if (topicLower.includes('business') || topicLower.includes('founder') || topicLower.includes('company') || topicLower.includes('startup')) {
      primaryMatch = templates.find(t => t.id === 'tmpl-business-founder') || primaryMatch;
    } else if (topicLower.includes('wedding') || topicLower.includes('love') || topicLower.includes('romance') || topicLower.includes('marriage')) {
      primaryMatch = templates.find(t => t.id === 'tmpl-love-wedding') || primaryMatch;
    }

    const alternatives = templates.filter(t => t.id !== primaryMatch.id).slice(0, 3);

    return {
      recommendedTemplate: primaryMatch,
      alternativeTemplates: alternatives,
      recommendationReason: `Based on your search query "${promptOrTopic}", the "${primaryMatch.name}" blueprint provides the exact scene structure, camera pacing, and interview prompts suited for this narrative type.`,
      missingSectionsSuggestion: [
        'Consider recording an intimate audio voiceover prologue before scanning archival photos.',
        'Ensure at least 3 high resolution milestone portraits are added to Act II.',
        'Include a final blessing or message to grandchildren in Act III.'
      ],
      estimatedProductionEffort: {
        estimatedDays: primaryMatch.difficulty === 'Beginner' ? 3 : primaryMatch.difficulty === 'Intermediate' ? 7 : 14,
        recommendedAssetCount: primaryMatch.sceneCount * 2,
        suggestedInterviewHours: primaryMatch.actCount * 0.75,
        complexityLevel: primaryMatch.difficulty === 'Beginner' ? 'Low' : primaryMatch.difficulty === 'Intermediate' ? 'Moderate' : 'High'
      }
    };
  }
}
