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
  Layers
} from 'lucide-react';

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

export const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
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
    <aside className="w-full lg:w-64 flex-shrink-0 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-3 space-y-4 shadow-sm">
      <div className="px-2 pt-1 pb-2 border-b border-border/60">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Blueprint Categories
        </h3>
        <p className="text-[11px] text-muted-foreground/80 mt-0.5">
          Curated documentary frameworks
        </p>
      </div>

      <nav className="space-y-0.5 text-xs">
        {CATEGORIES_WITH_ICONS.map(({ category, icon: Icon }) => {
          const count = getCategoryCount(category);
          const isSelected = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all font-medium cursor-pointer ${
                isSelected
                  ? 'bg-cinema-amber-500/15 text-cinema-amber-500 font-bold border border-cinema-amber-500/30'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-cinema-amber-500' : 'text-muted-foreground'}`} />
                <span className="truncate">{category}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-cinema-amber-500 text-black'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Pro Tip Box */}
      <div className="p-3 bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded-xl space-y-1">
        <div className="flex items-center gap-1.5 text-cinema-amber-500 font-bold text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Production Tip</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Applying a story blueprint scaffolds your Story Studio workspace with pre-configured acts, chapters, and scene camera paths automatically.
        </p>
      </div>
    </aside>
  );
};
