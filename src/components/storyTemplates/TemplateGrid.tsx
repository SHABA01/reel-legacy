/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { TemplateCard } from './TemplateCard';
import { EmptyState } from '../ui/EmptyState';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface TemplateGridProps {
  templates: StoryTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: StoryTemplate) => void;
  onUseTemplate: (template: StoryTemplate) => void;
  onDuplicateTemplate: (template: StoryTemplate) => void;
  onToggleFavorite: (id: string) => void;
  onCreateTemplate: () => void;
  viewMode?: 'grid' | 'list';
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onUseTemplate,
  onDuplicateTemplate,
  onToggleFavorite,
  onCreateTemplate,
  viewMode = 'grid',
}) => {
  if (templates.length === 0) {
    return (
      <EmptyState
        id="empty-templates-state"
        type="templates"
        title="No Story Blueprints Found"
        description="We couldn't find any storytelling templates matching your current filter criteria or search query."
        primaryActionLabel="Create Custom Template"
        onPrimaryAction={onCreateTemplate}
      />
    );
  }

  const featured = templates.filter(t => t.isFeatured);

  return (
    <div className="space-y-6">
      {/* Featured AI Recommendation Hero Section if on default view */}
      {featured.length > 0 && (
        <div className="bg-gradient-to-r from-cinema-amber-500/10 via-amber-500/5 to-transparent border border-cinema-amber-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cinema-amber-500/20 text-cinema-amber-500 font-extrabold text-[10px] tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              AI Production Blueprint
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">
              {featured[0].name}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl">
              {featured[0].description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTemplate(featured[0])}
              className="text-xs"
            >
              Inspect Blueprint
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onUseTemplate(featured[0])}
              className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5"
            >
              Use Template
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Grid or List View */}
      <div
        className={
          viewMode === 'list'
            ? 'flex flex-col gap-3'
            : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
        }
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplateId === template.id}
            onSelect={onSelectTemplate}
            onUseTemplate={onUseTemplate}
            onDuplicate={onDuplicateTemplate}
            onToggleFavorite={onToggleFavorite}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};
