/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoryTemplate, TemplateCategory, TemplateDifficulty } from '../../types/storyTemplate';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Layers, Sparkles, Music, Camera, BookOpen } from 'lucide-react';
import { StoryTemplateService } from '../../services/storyTemplateService';

interface TemplateBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: StoryTemplate) => void;
  initialTemplate?: StoryTemplate | null;
}

export const TemplateBuilderModal: React.FC<TemplateBuilderModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
  initialTemplate,
}) => {
  const [name, setName] = useState(initialTemplate?.name || '');
  const [description, setDescription] = useState(
    initialTemplate?.description || ''
  );
  const [category, setCategory] = useState<TemplateCategory>(
    initialTemplate?.category || 'Custom Templates'
  );
  const [difficulty, setDifficulty] = useState<TemplateDifficulty>(
    initialTemplate?.difficulty || 'Intermediate'
  );
  const [estimatedRuntime, setEstimatedRuntime] = useState(
    initialTemplate?.estimatedRuntime || '15 - 25 mins'
  );
  const [coverImage, setCoverImage] = useState(
    initialTemplate?.coverImage ||
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  );
  const [narrationStyle, setNarrationStyle] = useState(
    initialTemplate?.narrativeBlueprint?.narrationStyle ||
      'Warm, reflective, emotional voiceover.'
  );
  const [musicStyle, setMusicStyle] = useState(
    initialTemplate?.narrativeBlueprint?.musicStyle ||
      'Acoustic piano and soft cello ensemble.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTemplate: StoryTemplate = {
      id: initialTemplate?.id || `tmpl-custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom documentary storytelling blueprint.',
      coverImage: coverImage.trim(),
      category: category,
      difficulty: difficulty,
      estimatedRuntime: estimatedRuntime.trim(),
      actCount: initialTemplate?.actCount || 3,
      chapterCount: initialTemplate?.chapterCount || 6,
      sceneCount: initialTemplate?.sceneCount || 15,
      storyType: 'Custom Documentary',
      recommendedAudience: 'Family & Custom Audience',
      popularity: 80,
      aiCompatibility: 'Full',
      recentlyUpdated: new Date().toISOString().split('T')[0],
      isCustom: true,
      author: 'You (Custom Blueprint)',
      version: '1.0.0',
      versionHistory: [
        {
          version: '1.0.0',
          date: new Date().toISOString().split('T')[0],
          changes: 'Custom template creation in Blueprint Studio.'
        }
      ],
      tags: ['Custom', 'Blueprint', category],
      narrativeBlueprint: {
        narrationStyle: narrationStyle.trim(),
        musicStyle: musicStyle.trim(),
        cameraStyle: 'Smooth slow Ken Burns motion graphics and intimate close-ups.',
        visualStyle: 'Warm neutral cinema color grading with soft grain overlay.',
        recommendedSceneFlow: '3-Act structure with thematic chapters and closing epilogue.',
        acts: initialTemplate?.narrativeBlueprint?.acts || [
          {
            id: 'act-1',
            actNumber: 1,
            title: 'Act I: Introduction & Early Beginnings',
            description: 'Establish roots, birth, and early life.',
            durationMinutes: 5,
            chapters: [
              {
                id: 'chap-1',
                title: 'Chapter 1: Beginnings',
                objective: 'Introduce subject and hometown.',
                suggestedScenes: [
                  {
                    id: 'sc-c1',
                    title: 'Scene 1: Opening Portrait',
                    narrativePurpose: 'Show main portrait with voiceover intro.',
                    suggestedDuration: '02:00',
                    recommendedCameraMovement: 'Slow push in',
                    suggestedAssets: ['Main photo'],
                    narrationObjective: 'Introduce the subjects origin.',
                    musicRecommendation: 'Piano Track 1',
                    transitionType: 'Dissolve'
                  }
                ]
              }
            ]
          }
        ],
        interviewQuestions: initialTemplate?.narrativeBlueprint?.interviewQuestions || [
          {
            category: 'Custom Interview Prompts',
            questions: ['What memory defines your life journey best?']
          }
        ],
        aiPromptPacks: initialTemplate?.narrativeBlueprint?.aiPromptPacks || [
          {
            title: 'Custom Script Prompt',
            purpose: 'Draft narration based on outline.',
            prompt: `Write a documentary voiceover script for ${name.trim() || 'this film'}.`
          }
        ],
        musicSuggestions: initialTemplate?.narrativeBlueprint?.musicSuggestions || [
          {
            title: 'Reflective Harmony',
            genre: 'Cinematic Piano',
            mood: 'Nostalgic',
            tempo: '75 BPM',
            instrumentation: 'Piano & Strings',
            transitionStyle: 'Fade'
          }
        ],
        requiredAssets: ['Milestone photographs', 'Voice recording'],
        aiNotes: 'User generated narrative blueprint.'
      }
    };

    const saved = StoryTemplateService.getInstance().saveCustomTemplate(newTemplate);
    onTemplateCreated(saved);
    onClose();
  };

  return (
    <Modal
      id="template-builder-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Narrative Blueprint"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 max-h-[75vh] overflow-y-auto pr-1">
        <p className="text-xs text-muted-foreground">
          Design a reusable documentary storytelling framework with custom acts, scene flow, camera style, and interview prompts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="template-builder-name"
            label="Template Name"
            placeholder="e.g. Immigrant Journey Legacy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TemplateCategory)}
              className="w-full h-10 px-3 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500"
            >
              <option value="Personal Biography">Personal Biography</option>
              <option value="Family Legacy">Family Legacy</option>
              <option value="Memorial">Memorial</option>
              <option value="Celebration of Life">Celebration of Life</option>
              <option value="Wedding Story">Wedding Story</option>
              <option value="Love Story">Love Story</option>
              <option value="Military Service">Military Service</option>
              <option value="Business Legacy">Business Legacy</option>
              <option value="Historical Figure">Historical Figure</option>
              <option value="Custom Templates">Custom Templates</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief description of the storytelling framework and recommended usage..."
            className="w-full p-3 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:outline-none focus:border-cinema-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            id="builder-runtime"
            label="Estimated Runtime"
            placeholder="e.g. 15 - 20 mins"
            value={estimatedRuntime}
            onChange={(e) => setEstimatedRuntime(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as TemplateDifficulty)}
              className="w-full h-10 px-3 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <Input
            id="builder-cover-url"
            label="Cover Image URL"
            placeholder="https://images.unsplash.com/..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
          <Input
            id="builder-narration-style"
            label="Voiceover & Narration Style"
            placeholder="e.g. Warm, intimate, reflective tone"
            value={narrationStyle}
            onChange={(e) => setNarrationStyle(e.target.value)}
          />

          <Input
            id="builder-music-style"
            label="Music & Score Direction"
            placeholder="e.g. Acoustic piano, cello, 75 BPM"
            value={musicStyle}
            onChange={(e) => setMusicStyle(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Save Blueprint to Library
          </Button>
        </div>
      </form>
    </Modal>
  );
};
