/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  FolderPlus,
  Trash2,
  Archive,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { SearchInput } from '../ui/SearchInput';
import { ViewModeToggle } from '../ui/ViewModeToggle';
import { Button } from '../ui/Button';

interface MediaToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStoryFilter: string;
  onStoryFilterChange: (storyId: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
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
  onBulkTagClick?: () => void;
  onBulkAssignStoryClick?: () => void;
  onBulkArchiveClick?: () => void;
  onBulkDeleteClick?: () => void;
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
  onBulkTagClick,
  onBulkAssignStoryClick,
  onBulkArchiveClick,
  onBulkDeleteClick,
  onClearFilters
}: MediaToolbarProps) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedType !== 'All' ||
    selectedStoryFilter !== 'All' ||
    selectedStatusFilter !== 'All';

  return (
    <div className="bg-card/80 backdrop-blur-md border-b border-border p-3 space-y-3 shrink-0">
      {/* TOP ROW: Search & Primary Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex-1 min-w-[240px] max-w-md">
          <SearchInput
            id="media-vault-search"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search filenames, captions, OCR text, transcripts, tags, locations, people..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Media Type Filter */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            {['All', 'Image', 'Video', 'Audio', 'Document'].map(t => (
              <button
                key={t}
                onClick={() => onTypeChange(t)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedType === t
                    ? 'bg-cinema-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Story Filter */}
          <select
            value={selectedStoryFilter}
            onChange={e => onStoryFilterChange(e.target.value)}
            className="bg-muted/60 border border-border rounded-lg px-2.5 py-1.5 text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-cinema-amber-500"
          >
            <option value="All">All Stories Scope</option>
            {stories.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Readiness Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => onStatusFilterChange(e.target.value)}
            className="bg-muted/60 border border-border rounded-lg px-2.5 py-1.5 text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-cinema-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Ready">Ready for Production</option>
            <option value="Needs Metadata">Needs Metadata</option>
            <option value="Low Resolution">Low Resolution</option>
            <option value="Damaged">Damaged / Restorable</option>
            <option value="Unused">Unused</option>
          </select>

          {/* Clear Filters */}
          {isFiltered && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-1 transition-colors"
              title="Reset search and filters"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: Grouping, Sorting, ViewMode & Bulk Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-border/50">
        <div className="flex items-center gap-3">
          {/* Select All Checkbox Toggle */}
          <button
            onClick={onSelectAllToggle}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-mono text-[11px]"
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

          {/* Grouping Selector */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            <span>Group by:</span>
            <select
              value={grouping}
              onChange={e => onGroupingChange(e.target.value as any)}
              className="bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground hover:bg-muted focus:outline-none"
            >
              <option value="none">None</option>
              <option value="type">Media Type</option>
              <option value="story">Linked Story</option>
              <option value="category">Category</option>
              <option value="status">Readiness Status</option>
            </select>
          </div>

          {/* Sorting Selector */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as any)}
              className="bg-muted/60 border border-border rounded px-2 py-0.5 text-foreground hover:bg-muted focus:outline-none"
            >
              <option value="date">Upload Date</option>
              <option value="name">Name</option>
              <option value="size">File Size</option>
            </select>
            <button
              onClick={onToggleSortOrder}
              className="p-1 hover:bg-muted rounded text-foreground font-mono text-[10px] uppercase"
              title="Toggle Ascending/Descending"
            >
              {sortOrder}
            </button>
          </div>
        </div>

        {/* BULK ACTIONS TOOLBAR OR VIEW MODE TOGGLE */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <div className="flex items-center gap-1.5 bg-cinema-amber-500/10 border border-cinema-amber-500/30 px-2 py-1 rounded-lg animate-fade-in">
              <button
                onClick={onBulkTagClick}
                className="px-2 py-0.5 rounded text-cinema-amber-400 hover:bg-cinema-amber-500/20 font-medium flex items-center gap-1"
              >
                <Tag className="w-3 h-3" /> Tag
              </button>
              <button
                onClick={onBulkAssignStoryClick}
                className="px-2 py-0.5 rounded text-cinema-amber-400 hover:bg-cinema-amber-500/20 font-medium flex items-center gap-1"
              >
                <FolderPlus className="w-3 h-3" /> Assign Story
              </button>
              <button
                onClick={onBulkArchiveClick}
                className="px-2 py-0.5 rounded text-cinema-amber-400 hover:bg-cinema-amber-500/20 font-medium flex items-center gap-1"
              >
                <Archive className="w-3 h-3" /> Archive
              </button>
              <button
                onClick={onBulkDeleteClick}
                className="px-2 py-0.5 rounded text-red-400 hover:bg-red-500/20 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}

          <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}
