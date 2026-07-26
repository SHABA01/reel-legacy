/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TemplateCategory, StoryTemplate } from '../../types/storyTemplate';
import {
  BookOpen,
  User,
  Heart,
  Award,
  Sparkles,
  Flame,
  Briefcase,
  History,
  Compass,
  FolderKanban,
  Users,
  Bookmark,
  Layers,
  ChevronRight
} from 'lucide-react';

interface TemplateCategoryChipsProps {
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

export const CATEGORIES_WITH_ICONS: Array<{ category: TemplateCategory; icon: React.FC<{ className?: string }> }> = [
  { category: 'All Templates', icon: Layers },
  { category: 'Featured', icon: Sparkles },
  { category: 'Personal Biography', icon: User },
  { category: 'Family Legacy', icon: BookOpen },
  { category: 'Memorial', icon: Heart },
  { category: 'Celebration of Life', icon: Flame },
  { category: 'Wedding Story', icon: Heart },
  { category: 'Love Story', icon: Heart },
  { category: 'Military Service', icon: Award },
  { category: 'Business Legacy', icon: Briefcase },
  { category: 'Historical Figure', icon: History },
  { category: 'Faith Journey', icon: Compass },
  { category: 'Travel Memories', icon: Compass },
  { category: 'Custom Templates', icon: FolderKanban },
  { category: 'Community Templates', icon: Users },
  { category: 'Saved Templates', icon: Bookmark },
];

export const TemplateCategoryChips: React.FC<TemplateCategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
  templates,
  stats,
}) => {
  const getCategoryCount = (category: TemplateCategory): number => {
    if (category === 'All Templates') return stats.total;
    if (category === 'Featured') return templates.filter(t => t.isFeatured).length;
    if (category === 'Custom Templates') return stats.custom;
    if (category === 'Community Templates') return stats.community;
    if (category === 'Saved Templates') return stats.favorites;
    return templates.filter(t => t.category === category).length;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Blueprint Categories
          </span>
          <span className="text-[11px] text-muted-foreground/70">
            ({CATEGORIES_WITH_ICONS.length} Collections)
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
        {CATEGORIES_WITH_ICONS.map(({ category, icon: Icon }) => {
          const count = getCategoryCount(category);
          const isSelected = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cinema-amber-500 text-black font-extrabold shadow-md scale-[1.02]'
                  : 'bg-card/80 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-card hover:border-cinema-amber-500/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-cinema-amber-500'}`} />
              <span className="whitespace-nowrap">{category}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-black/20 text-black'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
