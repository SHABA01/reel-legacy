/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TemplateCategory, StoryTemplate } from '../../types/storyTemplate';
import { TemplateCategoryChips } from './TemplateCategoryChips';

interface TemplateSidebarProps {
  activeCategory: TemplateCategory;
  onSelectCategory: (cat: TemplateCategory) => void;
  templates: StoryTemplate[];
  stats: {
    total: number;
    custom: number;
    community: number;
    favorites: number;
  };
}

export const TemplateSidebar: React.FC<TemplateSidebarProps> = (props) => {
  return <TemplateCategoryChips {...props} />;
};
