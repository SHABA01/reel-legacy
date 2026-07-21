/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { FilterDropdown } from './FilterDropdown';
import { ViewModeToggle } from './ViewModeToggle';
import { useTheme } from '../../context/ThemeContext';

interface FilterBarProps {
  id: string;
  // Search state
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  searchPlaceholder?: string;
  
  // Sort state
  sortBy: string;
  sortOptions: { value: string; label: string }[];
  onSortByChange: (val: string) => void;
  
  // View mode state
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  
  // Advanced filter open state
  showAdvancedFilters: boolean;
  onShowAdvancedFiltersChange: (show: boolean) => void;
  hasActiveFilters?: boolean;
  
  // Optional standard micro-indicator checkboxes
  showFavoritesOnly?: boolean;
  onFavoritesOnlyChange?: (val: boolean) => void;
  
  showPinnedOnly?: boolean;
  onPinnedOnlyChange?: (val: boolean) => void;
  
  showArchivedOnly?: boolean;
  onArchivedOnlyChange?: (val: boolean) => void;
  archivedLabel?: string;
  
  // Children to render custom dropdowns/filters inside the expandable panel
  children?: React.ReactNode;
}

export function FilterBar({
  id,
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder = 'Search...',
  sortBy,
  sortOptions,
  onSortByChange,
  viewMode,
  onViewModeChange,
  showAdvancedFilters,
  onShowAdvancedFiltersChange,
  hasActiveFilters = false,
  showFavoritesOnly = false,
  onFavoritesOnlyChange,
  showPinnedOnly = false,
  onPinnedOnlyChange,
  showArchivedOnly = false,
  onArchivedOnlyChange,
  archivedLabel,
  children,
}: FilterBarProps) {
  const { resolvedTheme } = useTheme();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const viewport = document.getElementById('app-shell-viewport');
    if (!viewport) return;
    
    const handleScroll = () => {
      setIsSticky(viewport.scrollTop > 200);
    };
    
    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`sticky top-0 z-30 transition-all duration-300 space-y-3 ${
        isSticky 
          ? 'bg-transparent backdrop-blur-md py-3 -mx-4 px-4 border-b border-border shadow-md' 
          : 'py-1'
      }`}
      id={`${id}-sticky-wrapper`}
    >
      <div 
        className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm transition-all duration-300 ${
          resolvedTheme === 'light' ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-cinema-amber-500/20' : ''
        }`} 
        id={`${id}-main-controls-row`}
      >
        {/* Left side: search input */}
        <SearchInput
          id={`${id}-search-input`}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={onSearchQueryChange}
        />

        {/* Right side: Action dropdowns & toggles */}
        <div className="flex flex-wrap items-center gap-3" id={`${id}-controls-right-side-group`}>
          {/* Expand filters toggle with hover effects */}
          <button
            id={`${id}-btn-toggle-advanced-filters`}
            type="button"
            onClick={() => onShowAdvancedFiltersChange(!showAdvancedFilters)}
            className={`h-10 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer hover:scale-105 hover:shadow-sm ${
              showAdvancedFilters || hasActiveFilters
                ? 'border-cinema-amber-500 bg-cinema-amber-500/5 text-cinema-amber-600 dark:text-cinema-amber-400'
                : 'border-border bg-muted hover:bg-muted/75 text-black dark:text-white'
            }`}
            style={{ color: resolvedTheme === 'light' ? '#000000' : undefined }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-cinema-amber-500 animate-pulse" />
            )}
          </button>

          {/* Custom Sort dropdown */}
          <FilterDropdown
            id={`${id}-sort-select`}
            label="Sort:"
            value={sortBy}
            options={sortOptions}
            onChange={onSortByChange}
          />

          {/* Single View Mode Toggle */}
          <ViewModeToggle
            id={`${id}-btn-view-mode-toggle`}
            viewMode={viewMode}
            onChange={onViewModeChange}
          />
        </div>
      </div>

      {/* Expandable Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div 
          className={`p-5 bg-card border border-border rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in shadow-sm transition-all duration-300 ${
            resolvedTheme === 'light' ? 'hover:shadow-md hover:border-cinema-amber-500/10' : ''
          }`} 
          id={`${id}-advanced-filters-panel`}
        >
          {/* Children: Page-specific dropdowns */}
          {children}

          {/* Micro-indicators Filters & Toggles with elegant hovers */}
          {(onFavoritesOnlyChange || onPinnedOnlyChange || onArchivedOnlyChange) && (
            <div className="flex flex-col justify-end gap-2 text-xs" id={`${id}-quick-toggles-block`}>
              <div className="flex items-center gap-4">
                {onFavoritesOnlyChange && (
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground hover:text-cinema-amber-600 dark:hover:text-cinema-amber-400 transition-colors">
                    <input
                      id={`${id}-favorites-only-checkbox`}
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => onFavoritesOnlyChange(e.target.checked)}
                      className="w-4 h-4 rounded border-border bg-muted cursor-pointer accent-cinema-amber-500"
                    />
                    <span>Favorites Only</span>
                  </label>
                )}

                {onPinnedOnlyChange && (
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground hover:text-cinema-amber-600 dark:hover:text-cinema-amber-400 transition-colors">
                    <input
                      id={`${id}-pinned-only-checkbox`}
                      type="checkbox"
                      checked={showPinnedOnly}
                      onChange={(e) => onPinnedOnlyChange(e.target.checked)}
                      className="w-4 h-4 rounded border-border bg-muted cursor-pointer accent-cinema-amber-500"
                    />
                    <span>Pinned Only</span>
                  </label>
                )}
              </div>

              {onArchivedOnlyChange && (
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground mt-1 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <input
                    id={`${id}-archived-only-checkbox`}
                    type="checkbox"
                    checked={showArchivedOnly}
                    onChange={(e) => onArchivedOnlyChange(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-muted cursor-pointer accent-red-500"
                  />
                  <span className="text-red-500 font-bold">{archivedLabel || 'Show Archived Vault Projects'}</span>
                </label>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
