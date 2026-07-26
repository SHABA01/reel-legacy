/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { TemplateCard } from './TemplateCard';
import { EmptyState } from '../ui/EmptyState';

interface TemplateGridProps {
  templates: StoryTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: StoryTemplate) => void;
  onUseTemplate: (template: StoryTemplate) => void;
  onDuplicateTemplate: (template: StoryTemplate) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare?: (template: StoryTemplate) => void;
  comparedIds?: string[];
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
  onToggleCompare,
  comparedIds = [],
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

  return (
    <div
      className={
        viewMode === 'list'
          ? 'flex flex-col gap-3'
          : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
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
          onToggleCompare={onToggleCompare}
          isCompared={comparedIds.includes(template.id)}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};
