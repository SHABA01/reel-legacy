/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Sparkles, ArrowRight, Film, CheckCircle2, Layers } from 'lucide-react';

interface ApplyTemplateModalProps {
  template: StoryTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApply: (templateId: string, customTitle: string, subjectName: string) => void;
}

export const ApplyTemplateModal: React.FC<ApplyTemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  onConfirmApply,
}) => {
  if (!template) return null;

  const [storyTitle, setStoryTitle] = useState(`${template.name} Documentary`);
  const [subjectName, setSubjectName] = useState('Grandpa Arthur Miller');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim()) return;
    onConfirmApply(template.id, storyTitle.trim(), subjectName.trim());
  };

  return (
    <Modal
      id="apply-template-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={`Scaffold Documentary: ${template.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <p className="text-xs text-muted-foreground">
          Apply this story blueprint to populate Story Studio with pre-configured acts, chapters, scene camera paths, interview questions, and narration placeholders.
        </p>
        <div className="flex items-center gap-3 p-3 bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded-xl">
          <img
            src={template.coverImage}
            alt={template.name}
            className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="space-y-0.5 text-xs">
            <h4 className="font-bold text-foreground">{template.name}</h4>
            <p className="text-muted-foreground">
              {template.actCount} Acts • {template.chapterCount} Chapters • {template.sceneCount} Scenes
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            id="scaffold-story-title"
            label="Documentary Title"
            placeholder="e.g. Life and Legacy of Arthur Miller"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            required
          />

          <Input
            id="scaffold-subject-name"
            label="Legacy Subject Name"
            placeholder="e.g. Arthur Miller"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
        </div>

        {/* Blueprint Scaffold Preview checklist */}
        <div className="p-3 bg-muted/40 rounded-xl space-y-2 text-xs">
          <h5 className="font-bold text-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-cinema-amber-500" />
            Automatic Workspace Setup Included
          </h5>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{template.actCount} Structural Acts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{template.chapterCount} Chapter Milestones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{template.sceneCount} Camera Scenes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Interview Questions Bank</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Narration Script AI Prompts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Music Score Suggestions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
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
            Launch Story Studio
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};
