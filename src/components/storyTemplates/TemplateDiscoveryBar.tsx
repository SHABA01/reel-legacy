/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SearchInput } from '../ui/SearchInput';
import { ViewModeToggle } from '../ui/ViewModeToggle';
import { TemplateFilterState } from '../../types/storyTemplate';
import { Filter, Sparkles, Flame, Clock, Star, Layers } from 'lucide-react';

interface TemplateDiscoveryBarProps {
  filterState: TemplateFilterState;
  onFilterChange: (updates: Partial<TemplateFilterState>) => void;
  resultCount: number;
}

export const TemplateDiscoveryBar: React.FC<TemplateDiscoveryBarProps> = ({
  filterState,
  onFilterChange,
  resultCount,
}) => {
  return (
    <div className="space-y-3 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-3.5 shadow-sm">
      {/* Top row: Search, Filter selects, View Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <SearchInput
          id="template-search-input"
          placeholder="Search templates by name, act, chapter, tags..."
          value={filterState.searchQuery}
          onChange={(val) => onFilterChange({ searchQuery: val })}
          className="flex-1"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-muted/60 border border-border/70 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-cinema-amber-500" />
            <span className="text-[11px] font-semibold text-muted-foreground">Difficulty:</span>
            <select
              value={filterState.difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value })}
              className="bg-transparent text-[11px] font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <ViewModeToggle
            id="template-view-toggle"
            viewMode={filterState.viewMode}
            onChange={(mode) => onFilterChange({ viewMode: mode })}
          />
        </div>
      </div>

      {/* Bottom row: Quick Filter Tabs (Recently Used, AI Recommended, Featured, All, etc) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onFilterChange({ tab: 'all' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState.tab === 'all'
                ? 'bg-cinema-amber-500 text-black shadow-sm font-bold'
                : 'text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Blueprints
          </button>

          <button
            onClick={() => onFilterChange({ tab: 'featured' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState.tab === 'featured'
                ? 'bg-cinema-amber-500 text-black shadow-sm font-bold'
                : 'text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Featured
          </button>

          <button
            onClick={() => onFilterChange({ tab: 'popular' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState.tab === 'popular'
                ? 'bg-cinema-amber-500 text-black shadow-sm font-bold'
                : 'text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Most Popular
          </button>

          <button
            onClick={() => onFilterChange({ tab: 'ai_recommended' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState.tab === 'ai_recommended'
                ? 'bg-cinema-amber-500 text-black shadow-sm font-bold'
                : 'text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Recommended
          </button>

          <button
            onClick={() => onFilterChange({ tab: 'recently_used' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState.tab === 'recently_used'
                ? 'bg-cinema-amber-500 text-black shadow-sm font-bold'
                : 'text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recently Used
          </button>
        </div>

        <div className="text-[11px] font-medium text-muted-foreground">
          Showing <span className="font-bold text-foreground">{resultCount}</span> storytelling blueprints
        </div>
      </div>
    </div>
  );
};
