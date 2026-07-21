/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Grid,
  List,
  Plus,
  Filter,
  SlidersHorizontal,
  Trash2,
  Archive,
  Copy,
  BookOpen,
  Heart,
  Calendar,
  ChevronRight,
  TrendingUp,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Award,
  Pin,
  Film,
  Star,
  Clock,
  ChevronLeft,
  Briefcase,
  Users,
  Globe,
  GraduationCap,
  Wine,
  Gift,
  Eye,
  CheckSquare,
  Square,
  Check,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../ui/EmptyState';
import { MetricsGrid } from '../ui/MetricsGrid';
import { FilterBar } from '../ui/FilterBar';
import { FilterDropdown } from '../ui/FilterDropdown';
import { BulkOperationsBar, BulkAction } from '../ui/BulkOperationsBar';
import { KebabMenu } from '../ui/KebabMenu';
import { FavoriteButton } from '../ui/FavoriteButton';
import { PinButton } from '../ui/PinButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PromptModal } from '../ui/PromptModal';
import {
  ExtendedStory,
  STORY_TYPES,
  STORY_STATUSES,
  STORY_TYPE_ICONS
} from './mockStoriesData';
import { StoryWizard } from './StoryWizard';
import { StoryDetails } from './StoryDetails';
import { StoryWorkspace } from './StoryWorkspace';
import { persistenceService, StoryService } from '../../storage';
import { useTheme } from '../../context/ThemeContext';

export function StoriesView() {
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();

  // App state
  const [stories, setStories] = useState<ExtendedStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshStories = async () => {
    try {
      const fetched = await persistenceService.stories.getAll();
      setStories(fetched as any);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStories();
  }, []);

  // Subview controls
  const [activeSubView, setActiveSubView] = useState<'catalog' | 'details' | 'create-wizard' | 'workspace'>('catalog');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Search & Filters controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [aiReadyFilter, setAiReadyFilter] = useState<string>('all'); // all | yes | no
  const [hasChaptersFilter, setHasChaptersFilter] = useState<string>('all'); // all | yes
  const [hasTimelineFilter, setHasTimelineFilter] = useState<string>('all'); // all | yes
  const [hasMediaFilter, setHasMediaFilter] = useState<string>('all'); // all | yes
  
  // Favorites / Pinned / Archived toggles
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Filter Drawer / Panel expansion
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'progress' | 'duration'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bulk operation lists
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modals state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    storyId?: string;
    storyTitle?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    storyId?: string;
    storyTitle?: string;
  }>({ isOpen: false });



  // Render stats computed from stories state
  const stats = useMemo(() => {
    const total = stories.filter(s => s.status !== 'Archived').length;
    const readyForAI = stories.filter(s => s.aiReady && s.status !== 'Archived').length;
    const inProgress = stories.filter(s => s.status === 'In Progress').length;
    const published = stories.filter(s => s.status === 'Published').length;

    // Average story compilation progress
    const activeStories = stories.filter(s => s.status !== 'Archived');
    const totalProgress = activeStories.reduce((sum, s) => sum + s.completionProgress, 0);
    const avgProgress = activeStories.length > 0 ? Math.round(totalProgress / activeStories.length) : 0;

    return { total, readyForAI, inProgress, published, avgProgress };
  }, [stories]);

  // Handle opening subviews
  const handleSelectStory = (id: string) => {
    setSelectedStoryId(id);
    setActiveSubView('details');
  };

  const handleSimulateEdit = (idOrTitle: string) => {
    let target = stories.find(s => s.id === idOrTitle);
    if (!target) {
      target = stories.find(s => s.title === idOrTitle);
    }
    if (!target) return;

    setSelectedStoryId(target.id);
    setActiveSubView('workspace');
    showToast(
      'success',
      'Opening Story Studio',
      `Initializing narrative assets & archives for "${target.title}".`
    );
  };

  // Actions for stories
  const handleDuplicateStory = async (id: string) => {
    try {
      const duplicated = await StoryService.duplicateStory(id);
      if (duplicated) {
        await refreshStories();
        showToast('success', 'Story Project Cloned', `"${duplicated.title}" copy is now ready in your sandbox.`);
      }
    } catch (error: any) {
      showToast('error', 'Duplication Failed', error.message || 'Could not clone the story.');
    }
  };

  const handleArchiveStory = async (id: string) => {
    const target = stories.find(s => s.id === id);
    if (!target) return;

    const isArchived = target.status === 'Archived';
    try {
      if (isArchived) {
        await StoryService.restoreStory(id);
      } else {
        await StoryService.archiveStory(id);
      }
      await refreshStories();
      showToast(
        'info',
        isArchived ? 'Story Unarchived' : 'Story Archived Successfully',
        `"${target.title}" has been ${isArchived ? 'restored to active workspace' : 'moved to system archive vaults'}.`
      );
    } catch (error: any) {
      showToast('error', 'Operation Failed', error.message || 'Could not alter archive status.');
    }
  };

  const handleDeleteStory = async (id: string) => {
    const target = stories.find(s => s.id === id);
    if (!target) return;

    setDeleteConfirmation({
      isOpen: true,
      storyId: id,
      storyTitle: target.title,
      isBulk: false,
    });
  };

  const executeDeleteStory = async () => {
    if (deleteConfirmation.isBulk) {
      try {
        for (const id of selectedRowIds) {
          await StoryService.deleteStory(id);
        }
        await refreshStories();
        showToast('error', 'Stories Deleted', `${selectedRowIds.length} stories have been permanently purged.`);
        setSelectedRowIds([]);
      } catch (error: any) {
        showToast('error', 'Bulk Deletion Failed', error.message || 'Could not delete some stories.');
      }
    } else if (deleteConfirmation.storyId) {
      const id = deleteConfirmation.storyId;
      try {
        await StoryService.deleteStory(id);
        await refreshStories();
        setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
        showToast('error', 'Story Permanently Deleted', `"${deleteConfirmation.storyTitle}" has been purged from system memory.`);
      } catch (error: any) {
        showToast('error', 'Deletion Failed', error.message || 'Could not delete story.');
      }
    }
    setDeleteConfirmation({ isOpen: false });
  };

  const handleRenameStory = async (id: string) => {
    const target = stories.find(s => s.id === id);
    if (!target) return;

    setRenameModal({
      isOpen: true,
      storyId: id,
      storyTitle: target.title,
    });
  };

  const executeRenameStory = async (newTitle: string) => {
    if (!renameModal.storyId) return;
    try {
      await StoryService.updateStory(renameModal.storyId, { title: newTitle.trim() });
      await refreshStories();
      showToast('success', 'Story Renamed', `Project is now titled "${newTitle.trim()}".`);
    } catch (error: any) {
      showToast('error', 'Rename Failed', error.message || 'Could not rename story.');
    }
    setRenameModal({ isOpen: false });
  };

  const handleTogglePin = async (id: string) => {
    const target = stories.find(s => s.id === id);
    if (!target) return;

    try {
      await StoryService.pinStory(id, !target.pinned);
      await refreshStories();
      showToast(
        'info',
        target.pinned ? 'Story Unpinned' : 'Story Pinned to Top',
        `"${target.title}" has been ${target.pinned ? 'unpinned from' : 'pinned to'} the top shelf.`
      );
    } catch (error: any) {
      showToast('error', 'Operation Failed', error.message || 'Could not pin story.');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const target = stories.find(s => s.id === id);
    if (!target) return;

    try {
      await StoryService.favoriteStory(id, !target.favorite);
      await refreshStories();
      showToast(
        'success',
        target.favorite ? 'Removed from Favorites' : 'Added to Favorites',
        `"${target.title}" ${target.favorite ? 'removed from' : 'added to'} favorites list.`
      );
    } catch (error: any) {
      showToast('error', 'Operation Failed', error.message || 'Could not favorite story.');
    }
  };

  // Bulk actions
  const handleBulkArchive = async () => {
    if (selectedRowIds.length === 0) return;
    try {
      for (const id of selectedRowIds) {
        await StoryService.archiveStory(id);
      }
      await refreshStories();
      showToast('info', 'Stories Archived', `${selectedRowIds.length} story projects have been moved to vaults.`);
      setSelectedRowIds([]);
    } catch (error: any) {
      showToast('error', 'Bulk Archive Failed', error.message || 'Could not archive some stories.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowIds.length === 0) return;
    setDeleteConfirmation({
      isOpen: true,
      isBulk: true,
    });
  };

  // Create wizard save callback
  const handleWizardSave = async (newStory: ExtendedStory) => {
    try {
      // In F4, the wizard outputs a complete Story schema. We can save it via createStory.
      await StoryService.createStory(newStory as any);
      await refreshStories();
      setActiveSubView('catalog');
      showToast('success', 'Story Created', `"${newStory.title}" is now ready in your production library.`);
    } catch (error: any) {
      showToast('error', 'Creation Failed', error.message || 'Could not save new story.');
    }
  };

  // Clear query filters helper
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setAiReadyFilter('all');
    setHasChaptersFilter('all');
    setHasTimelineFilter('all');
    setHasMediaFilter('all');
    setShowFavoritesOnly(false);
    setShowPinnedOnly(false);
    setShowArchivedOnly(false);
    setCurrentPage(1);
    showToast('info', 'Filters Cleared', 'Reset all search constraints.');
  };

  // Multi-dimensional Advanced Filtering and Sorting logic
  const filteredStories = useMemo(() => {
    return stories
      .filter((s) => {
        // Search text matching Title, Subtitle, or associated profile name
        const textToMatch = `${s.title} ${s.subtitle} ${s.associatedProfileName} ${s.description} ${s.tags.join(' ')}`.toLowerCase();
        const matchesSearch = textToMatch.includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;

        // Status filter (or archive filter)
        let matchesStatus = true;
        if (showArchivedOnly) {
          matchesStatus = s.status === 'Archived';
        } else if (statusFilter !== 'all') {
          matchesStatus = s.status === statusFilter;
        } else {
          // If status filter is 'all' and not searching archived explicitly, hide archived from default workspace
          matchesStatus = s.status !== 'Archived';
        }

        // AI Ready filter
        let matchesAI = true;
        if (aiReadyFilter === 'yes') matchesAI = s.aiReady === true;
        if (aiReadyFilter === 'no') matchesAI = s.aiReady === false;

        // Chapters filter
        let matchesChapters = true;
        if (hasChaptersFilter === 'yes') matchesChapters = s.chapterCount > 0;

        // Timeline filter
        let matchesTimeline = true;
        if (hasTimelineFilter === 'yes') matchesTimeline = s.timelineEventCount > 0;

        // Media filter
        let matchesMedia = true;
        if (hasMediaFilter === 'yes') matchesMedia = s.mediaCount > 0;

        // Favorites / Pinned filters
        const matchesFav = !showFavoritesOnly || s.favorite === true;
        const matchesPinned = !showPinnedOnly || s.pinned === true;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesAI &&
          matchesChapters &&
          matchesTimeline &&
          matchesMedia &&
          matchesFav &&
          matchesPinned
        );
      })
      .sort((a, b) => {
        // Pinned stories always float to top if sorting isn't overriding completely
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'progress') {
          return b.completionProgress - a.completionProgress;
        }
        if (sortBy === 'duration') {
          const parseDur = (d: string) => parseInt(d) || 0;
          return parseDur(b.durationEstimate) - parseDur(a.durationEstimate);
        }
        // Default recently edited
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
      });
  }, [
    stories,
    searchQuery,
    categoryFilter,
    statusFilter,
    aiReadyFilter,
    hasChaptersFilter,
    hasTimelineFilter,
    hasMediaFilter,
    showFavoritesOnly,
    showPinnedOnly,
    showArchivedOnly,
    sortBy
  ]);

  // Pagination slicing
  const paginatedStories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStories, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredStories.length / itemsPerPage));

  // Retrieve current selected story reference
  const selectedStory = useMemo(() => {
    return stories.find(s => s.id === selectedStoryId);
  }, [stories, selectedStoryId]);

  // Helper for type icon lookup
  const renderTypeIcon = (category: string) => {
    const iconName = STORY_TYPE_ICONS[category] || 'BookOpen';
    // Dynamically render Lucide components based on string lookup to match design systems
    switch (iconName) {
      case 'User': return <BookOpen className="w-4 h-4 text-cinema-amber-500" />;
      case 'Heart': return <Heart className="w-4 h-4 text-cinema-amber-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-cinema-amber-500" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-cinema-amber-500" />;
      case 'Users': return <Users className="w-4 h-4 text-cinema-amber-500" />;
      case 'Globe': return <Globe className="w-4 h-4 text-cinema-amber-500" />;
      case 'Calendar': return <Calendar className="w-4 h-4 text-cinema-amber-500" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-cinema-amber-500" />;
      case 'Wine': return <Wine className="w-4 h-4 text-cinema-amber-500" />;
      case 'Gift': return <Gift className="w-4 h-4 text-cinema-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-cinema-amber-500" />;
    }
  };



  return (
    <div
      id="story-library-module-root"
      className={
        activeSubView === 'workspace'
          ? 'h-full w-full flex flex-col pt-0 pb-0 gap-0 space-y-0'
          : 'space-y-6 animate-fade-in text-foreground pb-12 pt-2.5 md:pt-4 lg:pt-5'
      }
    >
      
      {/* Subview router orchestration */}
      {activeSubView === 'create-wizard' && (
        <StoryWizard
          onClose={() => setActiveSubView('catalog')}
          onSave={handleWizardSave}
        />
      )}

      {activeSubView === 'details' && selectedStory && (
        <StoryDetails
          story={selectedStory}
          onBack={() => setActiveSubView('catalog')}
          onDuplicate={handleDuplicateStory}
          onArchive={handleArchiveStory}
          onDelete={handleDeleteStory}
          onSimulateEdit={handleSimulateEdit}
        />
      )}

      {activeSubView === 'workspace' && selectedStory && (
        <StoryWorkspace
          story={selectedStory}
          onClose={() => setActiveSubView('catalog')}
          onSave={async (updatedStory) => {
            try {
              await StoryService.updateStory(updatedStory.id, updatedStory as any);
              await refreshStories();
              showToast('success', 'Changes Saved', `"${updatedStory.title}" updated successfully.`);
            } catch (error: any) {
              showToast('error', 'Save Failed', error.message || 'Could not save modifications.');
            }
          }}
        />
      )}

      {activeSubView === 'catalog' && (
        <div className="space-y-6" id="story-catalog-view-root">
          
          {/* Page Header Card */}
          <div className={`p-6 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300 ${resolvedTheme === 'light' ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-cinema-amber-500/20' : ''}`} id="catalog-header-title-row">
            {/* Subtle background gradient and lighting */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-cinema-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <h2 className="font-display text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                  <Film className="w-5.5 h-5.5 text-cinema-amber-500 animate-pulse" /> Story Production Library
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-2xl font-medium">
                  Organize, filter, structure, and prepare collaborative documentary projects for your legacy ancestors.
                </p>
              </div>

              <Button
                id="btn-create-story-trigger"
                variant="accent"
                size="sm"
                leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
                onClick={() => setActiveSubView('create-wizard')}
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold self-start md:self-auto shadow-sm hover:scale-105 transition-all"
              >
                Create New Story
              </Button>
            </div>
          </div>

          {/* Story Statistics Board row - with custom float-hover cards */}
          <MetricsGrid
            id="stories-stats-dashboard"
            metrics={[
              {
                id: 'story-stat-total',
                label: 'Total Stories',
                value: stats.total,
                subValue: 'Active',
                subValueColor: 'text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10',
              },
              {
                id: 'story-stat-ready',
                label: 'Ready for AI',
                value: stats.readyForAI,
                valueClassName: 'text-indigo-500', // support text-indigo-500 if we want, or just rely on default
                subValue: 'Scripts',
                subValueColor: 'text-indigo-500 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10',
              },
              {
                id: 'story-stat-progress',
                label: 'In Progress',
                value: stats.inProgress,
                subValue: 'Drafting',
                subValueColor: 'text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10',
              },
              {
                id: 'story-stat-published',
                label: 'Completed',
                value: stats.published,
                subValue: 'Released',
                subValueColor: 'text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10',
              },
              {
                id: 'story-stat-avg',
                label: 'Avg Completion Progress',
                value: `${stats.avgProgress}%`,
                isAccent: true,
                icon: TrendingUp,
                iconClassName: 'text-cinema-amber-500 animate-pulse',
                className: 'col-span-2 md:col-span-1',
              }
            ]}
          />

            <FilterBar
              id="stories-filter-bar"
              searchQuery={searchQuery}
              onSearchQueryChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
              searchPlaceholder="Search production titles, tags, summaries..."
              sortBy={sortBy}
              sortOptions={[
                { value: 'updated', label: 'Recently Updated' },
                { value: 'name', label: 'Story Title A–Z' },
                { value: 'progress', label: 'Completion %' },
                { value: 'duration', label: 'Runtime Duration' }
              ]}
              onSortByChange={(val) => { setSortBy(val as any); setCurrentPage(1); }}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showAdvancedFilters={showAdvancedFilters}
              onShowAdvancedFiltersChange={setShowAdvancedFilters}
              hasActiveFilters={categoryFilter !== 'all' || statusFilter !== 'all' || aiReadyFilter !== 'all'}
              showFavoritesOnly={showFavoritesOnly}
              onFavoritesOnlyChange={(val) => { setShowFavoritesOnly(val); setCurrentPage(1); }}
              showPinnedOnly={showPinnedOnly}
              onPinnedOnlyChange={(val) => { setShowPinnedOnly(val); setCurrentPage(1); }}
              showArchivedOnly={showArchivedOnly}
              onArchivedOnlyChange={(val) => { setShowArchivedOnly(val); setCurrentPage(1); }}
              archivedLabel="Show Archived Vault Projects"
            >
              {/* Category Filter Dropdown */}
              <div className="space-y-1.5 relative" id="category-filter-dropdown-wrapper">
                <label className="text-[10px] font-bold text-black dark:text-muted-foreground uppercase tracking-wider block font-mono" style={{ color: resolvedTheme === 'light' ? '#000000' : undefined }}>
                  Story Type
                </label>
                <FilterDropdown
                  id="advanced-category-dropdown"
                  value={categoryFilter}
                  options={[
                    { value: 'all', label: 'All Narrative Styles' },
                    ...STORY_TYPES.map(type => ({ value: type, label: type }))
                  ]}
                  onChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}
                  fullWidth
                  align="left"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="space-y-1.5 relative" id="status-filter-dropdown-wrapper">
                <label className="text-[10px] font-bold text-black dark:text-muted-foreground uppercase tracking-wider block font-mono" style={{ color: resolvedTheme === 'light' ? '#000000' : undefined }}>
                  Workflow Status
                </label>
                <FilterDropdown
                  id="advanced-status-dropdown"
                  value={statusFilter}
                  options={[
                    { value: 'all', label: 'All Stages' },
                    ...STORY_STATUSES.map(status => ({ value: status, label: status }))
                  ]}
                  onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                  fullWidth
                  align="left"
                />
              </div>

              {/* AI Ready Filter Dropdown */}
              <div className="space-y-1.5 relative" id="ai-ready-filter-dropdown-wrapper">
                <label className="text-[10px] font-bold text-black dark:text-muted-foreground uppercase tracking-wider block font-mono" style={{ color: resolvedTheme === 'light' ? '#000000' : undefined }}>
                  AI Script Ready
                </label>
                <FilterDropdown
                  id="advanced-ai-ready-dropdown"
                  value={aiReadyFilter}
                  options={[
                    { value: 'all', label: 'All Projects' },
                    { value: 'yes', label: 'Ready for AI script' },
                    { value: 'no', label: 'Needs configuration' }
                  ]}
                  onChange={(val) => { setAiReadyFilter(val); setCurrentPage(1); }}
                  fullWidth
                  align="left"
                />
              </div>
            </FilterBar>

          {/* Bulk Selection actions bar for List/Table view */}
          {selectedRowIds.length > 0 && viewMode === 'list' && (
            <BulkOperationsBar
              id="stories-bulk-operations-bar"
              selectedCount={selectedRowIds.length}
              labelText={`${selectedRowIds.length} Stories selected for batch processing`}
              actions={[
                {
                  id: 'btn-bulk-archive-stories',
                  label: 'Archive Selected',
                  icon: <Archive className="w-4 h-4 text-muted-foreground" />,
                  onClick: handleBulkArchive,
                  className: 'hover:bg-card',
                },
                {
                  id: 'btn-bulk-delete-stories',
                  label: 'Delete Selected',
                  icon: <Trash2 className="w-4 h-4 text-red-500" />,
                  onClick: handleBulkDelete,
                  className: 'text-red-500 hover:bg-card hover:text-red-400',
                },
              ]}
            />
          )}

                    {/* GRID VIEW PORTAL */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6" id="stories-grid-container" style={{ contentVisibility: 'auto' }}>
              {paginatedStories.map((story) => {
                const birthYr = 'N/A';
                return (
                  <div
                    key={story.id}
                    id={`story-grid-card-${story.id}`}
                    onClick={() => handleSelectStory(story.id)}
                    className={`group border border-border bg-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm h-[300px] transition-all duration-300 cursor-pointer ${
                      resolvedTheme === 'light'
                        ? 'hover:shadow-lg hover:-translate-y-1 hover:border-cinema-amber-500/30'
                        : 'hover:border-cinema-amber-500/20'
                    }`}
                  >
                    {/* Story Cover Block */}
                    <div className="h-20 w-full relative shrink-0 bg-muted">
                      <img
                        src={story.coverImage}
                        alt={`${story.title} cover`}
                        className="w-full h-full object-cover grayscale-10 group-hover:grayscale-0 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Floating Category Tag overlay */}
                      <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[9px] font-mono font-bold bg-black/60 text-cinema-amber-400 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {story.category}
                      </span>

                      {/* Dropdown Action list trigger */}
                      <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
                        <KebabMenu
                          id={`story-${story.id}`}
                          items={[
                            { id: `dropdown-action-studio-${story.id}`, label: 'Story Studio', onClick: () => handleSimulateEdit(story.title), icon: <Film className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-rename-${story.id}`, label: 'Rename Project', onClick: () => handleRenameStory(story.id), icon: <FileText className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-duplicate-${story.id}`, label: 'Duplicate', onClick: () => handleDuplicateStory(story.id), icon: <Copy className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-archive-${story.id}`, label: story.status === 'Archived' ? 'Unarchive' : 'Archive', onClick: () => handleArchiveStory(story.id), icon: <Archive className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-delete-${story.id}`, label: 'Delete Project', onClick: () => handleDeleteStory(story.id), isDestructive: true, hasDividerBefore: true, icon: <Trash2 className="w-3.5 h-3.5 text-red-500" /> },
                          ]}
                          dropdownClassName="w-44"
                        />
                      </div>
                    </div>

                    {/* Profile avatar overlay details */}
                    <div className="px-4 relative -mt-4.5 flex items-end justify-between shrink-0" id={`profile-avatar-row-${story.id}`}>
                      <div className="flex items-center gap-2">
                        <img
                          src={story.associatedProfilePhoto}
                          alt={story.associatedProfileName}
                          className="w-8 h-8 rounded-full border-2 border-card object-cover bg-muted shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-[10px] font-bold text-foreground truncate max-w-24 bg-card/65 backdrop-blur-xs rounded px-1 border border-border/10">
                          {story.associatedProfileName}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details text */}
                    <div className="px-4 py-2 flex-grow flex flex-col justify-between min-h-0 overflow-hidden" id={`card-text-body-${story.id}`}>
                      <div className="min-h-0 overflow-hidden">
                        <h4 className="font-display font-black text-xs text-foreground truncate group-hover:text-cinema-amber-600 dark:group-hover:text-cinema-amber-400 transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-[9px] text-muted-foreground font-semibold leading-tight line-clamp-1 mt-0.5">
                          {story.subtitle}
                        </p>

                        {/* Inline progress, favorite, and pin indicators */}
                        <div className="flex items-center justify-between gap-2 mt-2.5" id={`story-meta-actions-${story.id}`}>
                          <span className="text-[9px] font-bold font-mono text-cinema-amber-700 bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                            {story.completionProgress}% Drafted
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <FavoriteButton
                              id={`btn-toggle-favorite-${story.id}`}
                              isFavorite={story.favorite}
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(story.id); }}
                            />
                            <PinButton
                              id={`btn-toggle-pin-${story.id}`}
                              isPinned={story.pinned}
                              onClick={(e) => { e.stopPropagation(); handleTogglePin(story.id); }}
                            />
                          </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mt-2 font-medium">
                          {story.description}
                        </p>
                      </div>

                      {/* Numeric indicators */}
                      <div className="flex items-center justify-between pt-2 border-t border-border mt-2 shrink-0" id={`card-numbers-row-${story.id}`}>
                        <div className="flex items-center gap-1 text-[8.5px] font-mono text-muted-foreground">
                          <BookOpen className="w-3 h-3" />
                          <span>{story.chapterCount} Ch</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8.5px] font-mono text-muted-foreground">
                          <ImageIcon className="w-3 h-3" />
                          <span>{story.mediaCount} Img</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8.5px] font-mono text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{story.timelineEventCount} Mlst</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom footer button bar */}
                    <div className="px-4 py-2 border-t border-sidebar-border bg-sidebar/45 flex items-center justify-between shrink-0" id={`card-bottom-bar-${story.id}`}>
                      {/* AI Ready Badge */}
                      {story.aiReady ? (
                        <span className="inline-flex items-center gap-1 text-[8px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.5 rounded">
                          <Sparkles className="w-2.5 h-2.5 animate-pulse" /> AI READY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[8px] font-bold font-mono bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                          DRAFT
                        </span>
                      )}

                      <Button
                        id={`btn-open-story-details-${story.id}`}
                        onClick={() => handleSelectStory(story.id)}
                        variant="ghost"
                        size="xs"
                        rightIcon={<ChevronRight className="w-3 h-3 text-foreground" />}
                        className="text-[10px] font-bold hover:bg-muted py-1 h-7"
                      >
                        Explore Project
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredStories.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-4" id="empty-search-grid-state">
                  <EmptyState
                    type="search"
                    title="No Matching Story Projects Found"
                    description="We couldn't locate any biographical archives matching your search constraints. Try adjusting category or toggle constraints."
                    primaryActionLabel="Reset All Active Filters"
                    onPrimaryAction={handleClearAllFilters}
                  />
                </div>
              )}
            </div>
          )}

          {/* LIST VIEW PORTAL TABLE */}
          {viewMode === 'list' && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="stories-table-wrapper" style={{ contentVisibility: 'auto' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="stories-list-table">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="p-4 w-10">
                        <input
                          id="bulk-all-stories-select-checkbox"
                          type="checkbox"
                          checked={selectedRowIds.length === paginatedStories.length && paginatedStories.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRowIds(paginatedStories.map(s => s.id));
                            } else {
                              setSelectedRowIds([]);
                            }
                          }}
                          className="w-3.5 h-3.5 rounded border-border bg-muted cursor-pointer"
                        />
                      </th>
                      <th className="p-4">Commemorative Story</th>
                      <th className="p-4">Profile Link</th>
                      <th className="p-4">Style</th>
                      <th className="p-4">Stage Status</th>
                      <th className="p-4">Draft Progress</th>
                      <th className="p-4">Linked Assets</th>
                      <th className="p-4 text-right">Production Suite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStories.map((story) => {
                      const isChecked = selectedRowIds.includes(story.id);
                      return (
                        <tr
                          key={story.id}
                          id={`story-table-row-${story.id}`}
                          className={`border-b border-border text-xs hover:bg-muted/40 transition-colors ${isChecked ? 'bg-cinema-amber-500/5' : ''}`}
                        >
                          <td className="p-4">
                            <input
                              id={`select-story-checkbox-${story.id}`}
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRowIds(prev => [...prev, story.id]);
                                } else {
                                  setSelectedRowIds(prev => prev.filter(rowId => rowId !== story.id));
                                }
                              }}
                              className="w-3.5 h-3.5 rounded border-border bg-muted cursor-pointer"
                            />
                          </td>
                          <td className="p-4">
                            <button
                              id={`btn-row-story-trigger-${story.id}`}
                              onClick={() => handleSelectStory(story.id)}
                              className="flex items-center gap-3 cursor-pointer group text-left"
                            >
                              <img
                                src={story.coverImage}
                                className="w-12 h-9 rounded object-cover border border-border shrink-0"
                                alt={story.title}
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="font-bold text-foreground truncate max-w-sm group-hover:text-cinema-amber-600 dark:group-hover:text-cinema-amber-400 transition-colors">
                                  {story.title}
                                </h4>
                                <span className="text-[10px] text-muted-foreground leading-normal font-semibold line-clamp-1">
                                  {story.subtitle}
                                </span>
                              </div>
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <img
                                src={story.associatedProfilePhoto}
                                className="w-6 h-6 rounded-full object-cover border border-border"
                                alt={story.associatedProfileName}
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-semibold text-foreground/80">
                                {story.associatedProfileName}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                              {renderTypeIcon(story.category)}
                              <span>{story.category}</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                              story.status === 'Published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                            }`}>
                              {story.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cinema-amber-500 rounded-full" style={{ width: `${story.completionProgress}%` }} />
                              </div>
                              <span className="font-mono text-[10px] font-bold text-foreground/75">
                                {story.completionProgress}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                              <span title="Chapters">{story.chapterCount}C</span>
                              <span>•</span>
                              <span title="Media files">{story.mediaCount}M</span>
                              <span>•</span>
                              <span title="Timeline events">{story.timelineEventCount}E</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                id={`btn-row-explore-${story.id}`}
                                onClick={() => handleSelectStory(story.id)}
                                variant="ghost"
                                size="xs"
                                className="p-1.5 border border-border text-xs"
                              >
                                Explore
                              </Button>
                              <Button
                                id={`btn-row-studio-${story.id}`}
                                onClick={() => handleSimulateEdit(story.title)}
                                variant="ghost"
                                size="xs"
                                className="p-1.5 border border-border text-xs text-cinema-amber-600 dark:text-cinema-amber-400"
                              >
                                Studio
                              </Button>
                              <Button
                                id={`btn-row-delete-${story.id}`}
                                onClick={() => handleDeleteStory(story.id)}
                                variant="ghost"
                                size="xs"
                                className="p-1.5 text-red-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredStories.length === 0 && (
                      <tr id="empty-search-table-state">
                        <td colSpan={8} className="py-16 text-center">
                          <EmptyState
                            type="search"
                            title="No Story Projects Found"
                            description="We couldn't locate any archives matching your search constraints."
                            primaryActionLabel="Reset All Active Filters"
                            onPrimaryAction={handleClearAllFilters}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGINATION PANEL FOOTER */}
          {filteredStories.length > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-4 bg-card/10 px-2" id="stories-pagination-bar">
              <span className="text-[10px] text-muted-foreground font-semibold font-mono uppercase tracking-wider">
                Showing {(currentPage - 1) * itemsPerPage + 1} – {Math.min(currentPage * itemsPerPage, filteredStories.length)} of {filteredStories.length} projects
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  id="btn-pagination-prev"
                  variant="ghost"
                  size="xs"
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5 text-foreground" />}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 border border-border"
                >
                  Prev
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pg = idx + 1;
                    return (
                      <button
                        key={pg}
                        id={`btn-pagination-page-${pg}`}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          currentPage === pg
                            ? 'bg-cinema-amber-500 text-slate-950 font-black'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>

                <Button
                  id="btn-pagination-next"
                  variant="ghost"
                  size="xs"
                  rightIcon={<ChevronRight className="w-3.5 h-3.5 text-foreground" />}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-border"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={executeDeleteStory}
        title={deleteConfirmation.isBulk ? 'Bulk Delete Stories' : 'Delete Story Project'}
        message={
          deleteConfirmation.isBulk
            ? `Are you absolutely sure you want to permanently delete ${selectedRowIds.length} selected story projects? This action is completely irreversible and will purge all narrative materials.`
            : `Are you absolutely sure you want to permanently delete "${deleteConfirmation.storyTitle}"? This will dissolve all chapters, narrative drafts, and references.`
        }
      />

      <PromptModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false })}
        onConfirm={executeRenameStory}
        title="Rename Story Project"
        message="Enter a new title for this storytelling narrative record:"
        defaultValue={renameModal.storyTitle}
        placeholder="e.g. Life of Arthur"
        confirmLabel="Rename Project"
      />
    </div>
  );
}
