/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
  Layers,
  X,
  ChevronDown,
  Star,
  Sparkles
} from 'lucide-react';
import { SearchInput } from '../ui/SearchInput';
import { ViewModeToggle } from '../ui/ViewModeToggle';

interface MediaToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStoryFilter: string;
  onStoryFilterChange: (storyId: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isFavoriteFilter: boolean;
  onToggleFavoriteFilter: () => void;
  isAiGeneratedFilter: boolean;
  onToggleAiGeneratedFilter: () => void;
  sortBy: 'name' | 'date' | 'size';
  onSortByChange: (sort: 'name' | 'date' | 'size') => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  grouping: 'none' | 'type' | 'story' | 'category' | 'status';
  onGroupingChange: (grouping: 'none' | 'type' | 'story' | 'category' | 'status') => void;
  stories: Array<{ id: string; title: string }>;
  selectedCount: number;
  totalCount: number;
  onSelectAllToggle: () => void;
  isAllSelected: boolean;
  onClearFilters?: () => void;
}

export function MediaToolbar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStoryFilter,
  onStoryFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  isFavoriteFilter,
  onToggleFavoriteFilter,
  isAiGeneratedFilter,
  onToggleAiGeneratedFilter,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
  grouping,
  onGroupingChange,
  stories,
  selectedCount,
  totalCount,
  onSelectAllToggle,
  isAllSelected,
  onClearFilters
}: MediaToolbarProps) {
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  // Toggle type pill: clicking active pill returns to 'All', clicking 'All' sets 'All'
  const handleTypeClick = (type: string) => {
    if (type === 'All' || selectedType === type) {
      onTypeChange('All');
    } else {
      onTypeChange(type);
    }
  };

  const hasSecondaryFilters =
    selectedStoryFilter !== 'All' ||
    selectedStatusFilter !== 'All' ||
    isFavoriteFilter ||
    isAiGeneratedFilter;

  const activeSecondaryCount = [
    selectedStoryFilter !== 'All',
    selectedStatusFilter !== 'All',
    isFavoriteFilter,
    isAiGeneratedFilter
  ].filter(Boolean).length;

  return (
    <div className="bg-card/80 backdrop-blur-md border-b border-border p-3 space-y-2.5 shrink-0">
      {/* ROW 1: PRIMARY SEARCH, STABLE TYPE FILTER & MORE FILTERS POPOVER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Input - Fixed/Responsive Boundary */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <SearchInput
            id="media-vault-search"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search filenames, captions, OCR, tags, people..."
          />
        </div>

        {/* Stable Controls Group */}
        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          {/* Stable Segmented Type Control (Toggle-to-All) */}
          <div className="flex items-center gap-0.5 bg-muted/60 p-1 rounded-lg border border-border shrink-0">
            {[
              { id: 'All', label: 'All' },
              { id: 'Image', label: 'Images' },
              { id: 'Video', label: 'Videos' },
              { id: 'Audio', label: 'Audio' },
              { id: 'Document', label: 'Docs' }
            ].map(t => {
              const isSelected =
                t.id === 'All'
                  ? selectedType === 'All' || !selectedType
                  : selectedType === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeClick(t.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs font-medium select-none ${
                    isSelected
                      ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* More Filters Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreFiltersOpen(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasSecondaryFilters || isMoreFiltersOpen
                  ? 'bg-cinema-amber-500/15 border-cinema-amber-500/40 text-cinema-amber-500 font-semibold'
                  : 'bg-muted/60 border-border text-foreground hover:bg-muted'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>More Filters</span>
              {activeSecondaryCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cinema-amber-500 text-slate-950 font-mono text-[9px] font-bold flex items-center justify-center">
                  {activeSecondaryCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${isMoreFiltersOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Popover Menu */}
            {isMoreFiltersOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-card border border-border rounded-xl shadow-xl z-30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-mono text-[11px] font-bold uppercase text-foreground">Secondary Facets</span>
                  <button
                    type="button"
                    onClick={() => setIsMoreFiltersOpen(false)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Story Scope Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Story Scope</label>
                  <select
                    value={selectedStoryFilter}
                    onChange={e => onStoryFilterChange(e.target.value)}
                    className="w-full bg-muted/70 border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-cinema-amber-500"
                  >
                    <option value="All">All Stories Scope</option>
                    {stories.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Readiness Status Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Production Readiness</label>
                  <select
                    value={selectedStatusFilter}
                    onChange={e => onStatusFilterChange(e.target.value)}
                    className="w-full bg-muted/70 border border-border rounded-lg px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-cinema-amber-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Ready">Ready for Production</option>
                    <option value="Needs Metadata">Needs Metadata</option>
                    <option value="Low Resolution">Low Resolution</option>
                    <option value="Damaged">Damaged / Restorable</option>
                    <option value="Unused">Unused</option>
                  </select>
                </div>

                {/* Toggle Facets: Starred & AI Generated */}
                <div className="pt-2 border-t border-border space-y-2">
                  <button
                    type="button"
                    onClick={onToggleFavoriteFilter}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isFavoriteFilter
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 font-semibold'
                        : 'bg-muted/40 border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${isFavoriteFilter ? 'fill-amber-500 text-amber-500' : ''}`} />
                      Starred Favorites Only
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isFavoriteFilter ? 'bg-amber-500' : 'bg-transparent'}`} />
                  </button>

                  <button
                    type="button"
                    onClick={onToggleAiGeneratedFilter}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isAiGeneratedFilter
                        ? 'bg-cinema-amber-500/10 border-cinema-amber-500/40 text-cinema-amber-500 font-semibold'
                        : 'bg-muted/40 border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cinema-amber-500" />
                      AI Generated Only
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isAiGeneratedFilter ? 'bg-cinema-amber-500' : 'bg-transparent'}`} />
                  </button>
                </div>

                {/* Clear secondary filters if any active */}
                {hasSecondaryFilters && onClearFilters && (
                  <div className="pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        onClearFilters();
                        setIsMoreFiltersOpen(false);
                      }}
                      className="w-full py-1.5 text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer font-medium"
                    >
                      <X className="w-3.5 h-3.5" /> Reset Secondary Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: SELECTION, SORTING, GROUPING & VIEW TOGGLE */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-border/40">
        <div className="flex items-center gap-4">
          {/* Multi-Select Toggle */}
          <button
            type="button"
            onClick={onSelectAllToggle}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-mono text-[11px] cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground" />
            )}
            <span>
              {selectedCount > 0 ? `${selectedCount} selected` : 'Select All'}
            </span>
          </button>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as any)}
              className="bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground hover:bg-muted focus:outline-none cursor-pointer"
            >
              <option value="date">Upload Date</option>
              <option value="name">Name</option>
              <option value="size">File Size</option>
            </select>
            <button
              type="button"
              onClick={onToggleSortOrder}
              className="p-1 hover:bg-muted rounded text-foreground font-mono text-[10px] uppercase cursor-pointer"
              title="Toggle Ascending/Descending"
            >
              {sortOrder}
            </button>
          </div>

          {/* Grouping */}
          <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            <span>Group:</span>
            <select
              value={grouping}
              onChange={e => onGroupingChange(e.target.value as any)}
              className="bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground hover:bg-muted focus:outline-none cursor-pointer"
            >
              <option value="none">None</option>
              <option value="type">Media Type</option>
              <option value="story">Linked Story</option>
              <option value="category">Category</option>
              <option value="status">Readiness</option>
            </select>
          </div>
        </div>

        {/* Canonical View Toggle */}
        <div className="flex items-center gap-2">
          <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}
