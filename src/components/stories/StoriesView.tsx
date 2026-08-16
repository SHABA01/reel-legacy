/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderStoryGenreIcon } from '../../utils/storyGenreUtils';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronDown,
  AlertTriangle,
  Folder,
  Layers,
  Zap,
  Tag,
  Upload,
  BarChart2,
  Download,
  Share2,
  FolderPlus,
  Wand2
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
  STORY_TYPE_ICONS,
  INITIAL_STORIES
} from './mockStoriesData';
import { StoryDetails } from './StoryDetails';
import { StoryWorkspace } from './StoryWorkspace';
import { StoryWizard } from './StoryWizard';
import { persistenceService, StoryService } from '../../storage';
import { useTheme } from '../../context/ThemeContext';
import { useInspector } from '../../context/InspectorContext';

export function StoriesView() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();
  const { setSelection, openInspector } = useInspector();

  // App state
  const [stories, setStories] = useState<ExtendedStory[]>(() => INITIAL_STORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    const handleDataChanged = () => refreshStories();
    window.addEventListener('reellegacy-data-changed', handleDataChanged);
    return () => window.removeEventListener('reellegacy-data-changed', handleDataChanged);
  }, []);

  // Subview & Horizontal Section Controls
  const [activeSubView, setActiveSubView] = useState<'catalog' | 'details' | 'workspace'>('catalog');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'all' | 'collections' | 'recent' | 'favorites' | 'archived' | 'ai-health'>('all');

  // Search & Filters controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [aiReadyFilter, setAiReadyFilter] = useState<string>('all'); // all | yes | no
  const [hasChaptersFilter, setHasChaptersFilter] = useState<string>('all');
  const [hasTimelineFilter, setHasTimelineFilter] = useState<string>('all');
  const [hasMediaFilter, setHasMediaFilter] = useState<string>('all');
  
  // Toggles & Sorting
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'progress' | 'duration'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bulk selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modals
  const [showWizard, setShowWizard] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    storyId?: string;
    storyTitle?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  // Workspace handlers
  const handleCloseWorkspace = useCallback(() => {
    setActiveSubView('catalog');
  }, []);

  const handleSaveWorkspace = useCallback(async (updatedStory: ExtendedStory) => {
    try {
      await StoryService.updateStory(updatedStory.id, updatedStory as any);
      await refreshStories();
      showToast('success', 'Changes Saved', `"${updatedStory.title}" updated successfully.`);
    } catch (error: any) {
      showToast('error', 'Save Failed', error.message || 'Could not save modifications.');
    }
  }, [showToast]);

  // Render stats computed from stories state
  const stats = useMemo(() => {
    const total = stories.length;
    const active = stories.filter(s => s.status !== 'Archived').length;
    const inProgress = stories.filter(s => (s.status === 'In Progress' || s.status === 'Draft') && s.status !== 'Archived').length;
    const archived = stories.filter(s => s.status === 'Archived').length;

    const activeStories = stories.filter(s => s.status !== 'Archived');
    const totalProgress = activeStories.reduce((sum, s) => sum + (s.completionProgress || 0), 0);
    const avgProgress = activeStories.length > 0 ? Math.round(totalProgress / activeStories.length) : 0;

    return { total, active, inProgress, archived, avgProgress };
  }, [stories]);

  // Handle selecting a story card (updates Context Panel & enables drill-down)
  const handleSelectStory = (story: ExtendedStory) => {
    setSelectedStoryId(story.id);
    setSelection('story', story);
    if (openInspector) {
      openInspector();
    }
  };

  const handleOpenDetails = (id: string) => {
    const target = stories.find(s => s.id === id);
    if (target) {
      setSelectedStoryId(id);
      setSelection('story', target);
      setActiveSubView('details');
    }
  };

  const handleSimulateEdit = (idOrTitle: string) => {
    let target = stories.find(s => s.id === idOrTitle);
    if (!target) {
      target = stories.find(s => s.title === idOrTitle);
    }
    if (!target) return;

    navigate(`/workspace/story-studio?id=${target.id}`);
  };

  // Actions
  const handleDuplicateStory = async (id: string) => {
    try {
      const duplicated = await StoryService.duplicateStory(id);
      if (duplicated) {
        await refreshStories();
        showToast('success', 'Story Cloned', `"${duplicated.title}" copy is now ready in your sandbox.`);
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
        `"${target.title}" has been ${isArchived ? 'restored to active workspace' : 'moved to vault archive'}.`
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
        await StoryService.deleteStories(selectedRowIds);
        await refreshStories();
        window.dispatchEvent(new Event('reellegacy-data-changed'));
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
        window.dispatchEvent(new Event('reellegacy-data-changed'));
        setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
        showToast('error', 'Story Deleted', `"${deleteConfirmation.storyTitle}" has been purged.`);
      } catch (error: any) {
        showToast('error', 'Deletion Failed', error.message || 'Could not delete story.');
      }
    }
    setDeleteConfirmation({ isOpen: false });
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
      showToast('info', 'Stories Archived', `${selectedRowIds.length} story projects moved to vaults.`);
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

  // Filtered stories depending on section tab and search/filter states
  const filteredStories = useMemo(() => {
    return stories
      .filter((s) => {
        // Section specific filtering
        if (activeSection === 'favorites' && (!s.favorite && !s.pinned)) return false;
        if (activeSection === 'archived' && s.status !== 'Archived') return false;
        if (activeSection === 'recent') {
          // Keep active stories
          if (s.status === 'Archived') return false;
        }

        // Text matching
        const textToMatch = `${s.title} ${s.subtitle} ${s.associatedProfileName} ${s.description} ${s.tags.join(' ')}`.toLowerCase();
        const matchesSearch = textToMatch.includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;

        // Status filter
        let matchesStatus = true;
        if (activeSection === 'archived' || showArchivedOnly) {
          matchesStatus = s.status === 'Archived';
        } else if (statusFilter !== 'all') {
          matchesStatus = s.status === statusFilter;
        } else {
          matchesStatus = s.status !== 'Archived';
        }

        // AI Ready filter
        let matchesAI = true;
        if (aiReadyFilter === 'yes') matchesAI = s.aiReady === true;
        if (aiReadyFilter === 'no') matchesAI = s.aiReady === false;

        // Chapters / Timeline / Media
        let matchesChapters = hasChaptersFilter !== 'yes' || s.chapterCount > 0;
        let matchesTimeline = hasTimelineFilter !== 'yes' || s.timelineEventCount > 0;
        let matchesMedia = hasMediaFilter !== 'yes' || s.mediaCount > 0;

        // Toggles
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
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
      });
  }, [
    stories,
    activeSection,
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

  // Pagination
  const paginatedStories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStories, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredStories.length / itemsPerPage));

  // Retrieve current selected story reference
  const selectedStory = useMemo(() => {
    return stories.find(s => s.id === selectedStoryId);
  }, [stories, selectedStoryId]);

  // Smart Collections grouped by category
  const smartCollections = useMemo(() => {
    const activeStories = stories.filter(s => s.status !== 'Archived');
    const categoriesMap: Record<string, ExtendedStory[]> = {};

    activeStories.forEach(s => {
      const cat = s.category || 'Personal Memoirs';
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(s);
    });

    return Object.entries(categoriesMap).map(([categoryName, items]) => {
      const avgProg = Math.round(items.reduce((sum, i) => sum + i.completionProgress, 0) / items.length);
      const totalMedia = items.reduce((sum, i) => sum + i.mediaCount, 0);
      return {
        categoryName,
        storyCount: items.length,
        avgProgress: avgProg,
        totalMedia,
        sampleCovers: items.slice(0, 3).map(i => i.coverImage),
      };
    });
  }, [stories]);

  // AI Archive Health Insights
  const aiHealthRecommendations = useMemo(() => {
    const activeStories = stories.filter(s => s.status !== 'Archived');
    const missingNarration = activeStories.filter(s => s.completionProgress > 40 && s.chapterCount > 0);
    const readyForAI = activeStories.filter(s => s.aiReady || s.status === 'Ready for AI');
    const incompleteDrafts = activeStories.filter(s => s.completionProgress < 35);
    const missingMedia = activeStories.filter(s => s.mediaCount === 0);

    return {
      missingNarration,
      readyForAI,
      incompleteDrafts,
      missingMedia,
    };
  }, [stories]);

  const renderTypeIcon = (category: string) => renderStoryGenreIcon(category);

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
      {activeSubView === 'details' && (
        selectedStory ? (
          <StoryDetails
            story={selectedStory}
            onBack={() => setActiveSubView('catalog')}
            onDuplicate={handleDuplicateStory}
            onArchive={handleArchiveStory}
            onDelete={handleDeleteStory}
            onSimulateEdit={handleSimulateEdit}
          />
        ) : (
          <div className="p-8 bg-card border border-border rounded-2xl">
            <EmptyState
              title="Story Record Not Found"
              description="The requested biographical story could not be loaded or was removed."
              actionLabel="Return to Story Library"
              onAction={() => setActiveSubView('catalog')}
            />
          </div>
        )
      )}

      {activeSubView === 'workspace' && (
        selectedStory ? (
          <StoryWorkspace
            story={selectedStory}
            onClose={handleCloseWorkspace}
            onSave={handleSaveWorkspace}
          />
        ) : (
          <div className="p-8 bg-card border border-border rounded-2xl">
            <EmptyState
              title="Story Workspace Not Found"
              description="The requested story project could not be opened in the workspace."
              actionLabel="Return to Story Library"
              onAction={() => setActiveSubView('catalog')}
            />
          </div>
        )
      )}

      {activeSubView === 'catalog' && (
        <div className="space-y-6" id="story-catalog-view-root">
          
          {/* Hero Section */}
          <div
            className={`p-6 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300 ${
              resolvedTheme === 'light' ? 'hover:shadow-md hover:border-cinema-amber-500/20' : ''
            }`}
            id="catalog-header-title-row"
          >
            <div className="absolute right-0 top-0 w-80 h-80 bg-cinema-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500 text-xs font-mono font-bold">
                  <BookOpen className="w-3.5 h-3.5 animate-pulse" />
                  Collection & Archive Workspace
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Story Production Library
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground max-w-2xl font-medium leading-relaxed">
                  Discover, organize, and manage every legacy documentary, biographical memoir, and commemorative story in your personal archive.
                </p>
              </div>

              {/* Quick Hero Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Button
                  id="btn-hero-new-story"
                  onClick={() => setShowWizard(true)}
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-black font-bold shadow-md"
                >
                  New Story
                </Button>
                <Button
                  id="btn-hero-import-story"
                  onClick={() => {
                    showToast('info', 'Import Wizard', 'Select a GEDCOM, JSON, or media archive to import story metadata.');
                  }}
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload className="w-4 h-4" />}
                  className="text-xs font-bold border-border"
                >
                  Import
                </Button>
                <Button
                  id="btn-hero-ai-health"
                  onClick={() => setActiveSection('ai-health')}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}
                  className="text-xs font-bold hover:bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  AI Health
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <MetricsGrid
            id="stories-stats-dashboard"
            metrics={[
              {
                id: 'story-stat-total',
                label: 'Total Stories',
                value: stats.total,
                subValue: 'In Vaults',
                subValueColor: 'text-blue-500 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10',
                onClick: () => { setActiveSection('all'); setShowArchivedOnly(false); setStatusFilter('all'); },
              },
              {
                id: 'story-stat-active',
                label: 'Active Library',
                value: stats.active,
                subValue: 'In Production',
                subValueColor: 'text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10',
                onClick: () => { setActiveSection('all'); setShowArchivedOnly(false); setStatusFilter('all'); },
              },
              {
                id: 'story-stat-progress',
                label: 'In Progress',
                value: stats.inProgress,
                subValue: 'Drafting',
                subValueColor: 'text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10',
                onClick: () => { setActiveSection('all'); setShowArchivedOnly(false); setStatusFilter('In Progress'); },
              },
              {
                id: 'story-stat-archived',
                label: 'Vaulted',
                value: stats.archived,
                subValue: 'Archived',
                subValueColor: 'text-rose-500 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10',
                onClick: () => { setActiveSection('archived'); },
              },
              {
                id: 'story-stat-avg',
                label: 'Avg Completion',
                value: `${stats.avgProgress}%`,
                isAccent: true,
                icon: TrendingUp,
                iconClassName: 'text-cinema-amber-500 animate-pulse',
                className: 'col-span-2 md:col-span-1',
              }
            ]}
          />

          {/* Horizontal Section Navigation Bar */}
          <div className="border-b border-border bg-card/50 backdrop-blur-sm rounded-xl p-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none" id="horizontal-section-nav">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All Stories', icon: Layers, count: stats.active },
                { id: 'collections', label: 'Smart Collections', icon: Folder, count: smartCollections.length },
                { id: 'recent', label: 'Recently Opened', icon: Clock, count: stories.length },
                { id: 'favorites', label: 'Favorites & Pinned', icon: Star, count: stories.filter(s => s.favorite || s.pinned).length },
                { id: 'archived', label: 'Vault Archive', icon: Archive, count: stats.archived },
                { id: 'ai-health', label: 'AI Health', icon: Wand2, badge: 'Insights' },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`section-tab-${tab.id}`}
                    onClick={() => {
                      setActiveSection(tab.id as any);
                      setCurrentPage(1);
                      if (tab.id === 'archived') setShowArchivedOnly(true);
                      else setShowArchivedOnly(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-cinema-amber-500 text-black shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-cinema-amber-500'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-black/20 text-black font-extrabold' : 'bg-muted text-muted-foreground'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                    {tab.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION CONTROLLER CONTENT */}

          {/* SMART COLLECTIONS VIEW */}
          {activeSection === 'collections' && (
            <div className="space-y-6" id="smart-collections-view">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">Smart Collections & Narrative Folders</h3>
                  <p className="text-xs text-muted-foreground">Stories grouped automatically by documentary theme and biographical arc.</p>
                </div>
                <Button
                  id="btn-create-collection"
                  onClick={() => showToast('info', 'Custom Collection', 'Select stories in the main catalog to assign a custom collection tag.')}
                  variant="outline"
                  size="xs"
                  leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  New Collection
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {smartCollections.map(col => (
                  <div
                    key={col.categoryName}
                    id={`collection-card-${col.categoryName}`}
                    onClick={() => {
                      setCategoryFilter(col.categoryName);
                      setActiveSection('all');
                      showToast('info', 'Filter Applied', `Viewing stories in "${col.categoryName}" collection.`);
                    }}
                    className="p-5 bg-card border border-border hover:border-cinema-amber-500/40 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md space-y-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500 rounded-xl">
                        {renderTypeIcon(col.categoryName)}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {col.storyCount} {col.storyCount === 1 ? 'Story' : 'Stories'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-foreground group-hover:text-cinema-amber-500 transition-colors">
                        {col.categoryName}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average completion {col.avgProgress}% • {col.totalMedia} media items linked
                      </p>
                    </div>

                    {/* Sample covers row */}
                    <div className="flex items-center gap-1.5 pt-2">
                      {col.sampleCovers.map((cover, idx) => (
                        <img
                          key={idx}
                          src={cover}
                          alt="Cover thumbnail"
                          className="w-12 h-9 rounded object-cover border border-border"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      {col.sampleCovers.length === 0 && (
                        <div className="text-[10px] text-muted-foreground italic">No stories created yet</div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-bold text-cinema-amber-500 group-hover:translate-x-1 transition-transform">
                      <span>Browse Collection</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI HEALTH & SUGGESTIONS VIEW */}
          {activeSection === 'ai-health' && (
            <div className="space-y-6" id="ai-health-view">
              <div className="p-5 bg-card border border-indigo-500/30 rounded-2xl space-y-2 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  AI Archive Assistant & Quality Health Audit
                </div>
                <h3 className="font-display font-extrabold text-xl text-foreground">
                  AI Story Production Insights
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  Our intelligence engine continuously analyzes your story projects to highlight missing voiceovers, unscripted chapters, and profiles ready for automated story generation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Recommendation 1: AI Script Ready */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Ready for AI Script
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {aiHealthRecommendations.readyForAI.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Stories with structured timelines ready for Gemini narrative script generation.
                  </p>
                  <div className="space-y-2 pt-2">
                    {aiHealthRecommendations.readyForAI.slice(0, 3).map(story => (
                      <div key={story.id} className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{story.title}</p>
                          <span className="text-[10px] text-muted-foreground">{story.completionProgress}% complete</span>
                        </div>
                        <Button
                          id={`btn-ai-generate-${story.id}`}
                          onClick={() => handleSimulateEdit(story.id)}
                          variant="ghost"
                          size="xs"
                          className="text-[10px] font-bold text-cinema-amber-500 border border-cinema-amber-500/20"
                        >
                          Generate Script
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation 2: Needs Narration Voiceover */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" /> Missing Voice Narration
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {aiHealthRecommendations.missingNarration.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drafted stories requiring voiceover audio synthesis in Narration Studio.
                  </p>
                  <div className="space-y-2 pt-2">
                    {aiHealthRecommendations.missingNarration.slice(0, 3).map(story => (
                      <div key={story.id} className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{story.title}</p>
                          <span className="text-[10px] text-muted-foreground">{story.chapterCount} chapters</span>
                        </div>
                        <Button
                          id={`btn-narration-studio-${story.id}`}
                          onClick={() => navigate('/workspace/narration-studio')}
                          variant="ghost"
                          size="xs"
                          className="text-[10px] font-bold text-indigo-400 border border-indigo-500/20"
                        >
                          Open Narration
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation 3: Incomplete Drafts */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Incomplete Drafts
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {aiHealthRecommendations.incompleteDrafts.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Early-stage stories missing media files or key biographical dates.
                  </p>
                  <div className="space-y-2 pt-2">
                    {aiHealthRecommendations.incompleteDrafts.slice(0, 3).map(story => (
                      <div key={story.id} className="p-2.5 bg-muted/40 border border-border rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{story.title}</p>
                          <span className="text-[10px] text-muted-foreground">{story.completionProgress}% drafted</span>
                        </div>
                        <Button
                          id={`btn-expand-draft-${story.id}`}
                          onClick={() => handleOpenDetails(story.id)}
                          variant="ghost"
                          size="xs"
                          className="text-[10px] font-bold text-foreground border border-border"
                        >
                          Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MAIN CATALOG VIEW (FOR 'all', 'recent', 'favorites', 'archived') */}
          {(activeSection === 'all' || activeSection === 'recent' || activeSection === 'favorites' || activeSection === 'archived') && (
            <div className="space-y-5" id="catalog-main-content">
              
              {/* Filter & Search Bar */}
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

              {/* Bulk Selection operations bar */}
              {selectedRowIds.length > 0 && (
                <BulkOperationsBar
                  id="stories-bulk-operations-bar"
                  selectedCount={selectedRowIds.length}
                  itemTypeSingular="Story"
                  itemTypePlural="Stories"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6" id="stories-grid-container">
                  {paginatedStories.map((story) => {
                    const isSelected = selectedStoryId === story.id;
                    return (
                      <div
                        key={story.id}
                        id={`story-grid-card-${story.id}`}
                        onClick={() => handleSelectStory(story)}
                        className={`group border bg-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm h-[310px] transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-cinema-amber-500 ring-2 ring-cinema-amber-500/20'
                            : resolvedTheme === 'light'
                            ? 'border-border hover:shadow-lg hover:-translate-y-1 hover:border-cinema-amber-500/30'
                            : 'border-border hover:border-cinema-amber-500/20'
                        }`}
                      >
                        {/* Cover image & category tag */}
                        <div className="h-24 w-full relative shrink-0 bg-muted">
                          <img
                            src={story.coverImage}
                            alt={`${story.title} cover`}
                            className="w-full h-full object-cover grayscale-10 group-hover:grayscale-0 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                          <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[9px] font-mono font-bold bg-black/70 text-cinema-amber-400 border border-cinema-amber-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {story.category}
                          </span>

                          <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
                            <KebabMenu
                              id={`story-${story.id}`}
                              items={[
                                { id: `dropdown-action-explore-${story.id}`, label: 'Explore Details', onClick: () => handleOpenDetails(story.id), icon: <Eye className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-studio-${story.id}`, label: 'Edit in Studio', onClick: () => handleSimulateEdit(story.title), icon: <Film className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-duplicate-${story.id}`, label: 'Duplicate', onClick: () => handleDuplicateStory(story.id), icon: <Copy className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-archive-${story.id}`, label: story.status === 'Archived' ? 'Unarchive' : 'Archive', onClick: () => handleArchiveStory(story.id), icon: <Archive className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-delete-${story.id}`, label: 'Delete Project', onClick: () => handleDeleteStory(story.id), isDestructive: true, hasDividerBefore: true, icon: <Trash2 className="w-3.5 h-3.5 text-red-500" /> },
                              ]}
                              dropdownClassName="w-44"
                            />
                          </div>
                        </div>

                        {/* Profile avatar overlay details */}
                        <div className="px-4 relative -mt-4 flex items-end justify-between shrink-0" id={`profile-avatar-row-${story.id}`}>
                          <div className="flex items-center gap-2">
                            <img
                              src={story.associatedProfilePhoto}
                              alt={story.associatedProfileName}
                              className="w-8 h-8 rounded-full border-2 border-card object-cover bg-muted shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-[10px] font-bold text-foreground truncate max-w-28 bg-card/80 backdrop-blur-xs rounded px-1.5 py-0.5 border border-border/20">
                              {story.associatedProfileName}
                            </div>
                          </div>
                        </div>

                        {/* Middle body text */}
                        <div className="px-4 py-2 flex-grow flex flex-col justify-between min-h-0 overflow-hidden" id={`card-text-body-${story.id}`}>
                          <div className="min-h-0 overflow-hidden">
                            <h4 className="font-display font-black text-xs text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                              {story.title}
                            </h4>
                            <p className="text-[9px] text-muted-foreground font-semibold leading-tight line-clamp-1 mt-0.5">
                              {story.subtitle}
                            </p>

                            <div className="flex items-center justify-between gap-2 mt-2" id={`story-meta-actions-${story.id}`}>
                              <span className="text-[9px] font-bold font-mono text-cinema-amber-500 bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                                {story.completionProgress}% Complete
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

                          {/* Numeric asset counts */}
                          <div className="flex items-center justify-between pt-2 border-t border-border mt-2 shrink-0" id={`card-numbers-row-${story.id}`}>
                            <div className="flex items-center gap-1 text-[8.5px] font-mono text-muted-foreground">
                              <BookOpen className="w-3 h-3" />
                              <span>{story.chapterCount} Ch</span>
                            </div>
                            <div className="flex items-center gap-1 text-[8.5px] font-mono text-muted-foreground">
                              <ImageIcon className="w-3 h-3" />
                              <span>{story.mediaCount} Media</span>
                            </div>
                            <div className="flex items-center gap-1 text-[8.5px] font-mono text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{story.timelineEventCount} Events</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom action bar */}
                        <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between shrink-0" id={`card-bottom-bar-${story.id}`}>
                          {story.aiReady ? (
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.5 rounded">
                              <Sparkles className="w-2.5 h-2.5 animate-pulse" /> AI READY
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[8px] font-bold font-mono bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                              DRAFT
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <Button
                              id={`btn-open-story-details-${story.id}`}
                              onClick={(e) => { e.stopPropagation(); handleOpenDetails(story.id); }}
                              variant="ghost"
                              size="xs"
                              className="text-[10px] font-bold hover:bg-muted py-1 h-7 text-muted-foreground hover:text-foreground"
                            >
                              Explore
                            </Button>
                            <Button
                              id={`btn-studio-direct-${story.id}`}
                              onClick={(e) => { e.stopPropagation(); handleSimulateEdit(story.title); }}
                              variant="ghost"
                              size="xs"
                              rightIcon={<ChevronRight className="w-3 h-3 text-cinema-amber-500" />}
                              className="text-[10px] font-bold text-cinema-amber-500 hover:bg-cinema-amber-500/10 py-1 h-7"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredStories.length === 0 && (
                    <div className="col-span-full py-16 text-center space-y-4" id="empty-search-grid-state">
                      <EmptyState
                        type="search"
                        title="No Matching Stories Found"
                        description="We couldn't locate any biographical archives matching your search constraints."
                        primaryActionLabel="Reset All Active Filters"
                        onPrimaryAction={handleClearAllFilters}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* LIST VIEW PORTAL TABLE */}
              {viewMode === 'list' && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="stories-table-wrapper">
                  <div className="overflow-y-auto overflow-x-hidden max-h-[550px] relative scrollbar-thin">
                    <table className="w-full text-left border-collapse" id="stories-list-table">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border bg-card">
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
                          <th className="p-4">Legacy Profile</th>
                          <th className="p-4">Narrative Category</th>
                          <th className="p-4">Workflow Status</th>
                          <th className="p-4">Completion Progress</th>
                          <th className="p-4">Linked Assets</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedStories.map((story) => {
                          const isChecked = selectedRowIds.includes(story.id);
                          const isSelected = selectedStoryId === story.id;
                          return (
                            <tr
                              key={story.id}
                              id={`story-table-row-${story.id}`}
                              onClick={() => handleSelectStory(story)}
                              className={`border-b border-border text-xs cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-cinema-amber-500/10'
                                  : isChecked
                                  ? 'bg-cinema-amber-500/5'
                                  : 'hover:bg-muted/40'
                              }`}
                            >
                              <td className="p-4 w-10" onClick={(e) => e.stopPropagation()}>
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
                              <td className="p-4 min-w-0 max-w-[220px]">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={story.coverImage}
                                    className="w-10 h-7 rounded object-cover border border-border shrink-0"
                                    alt={story.title}
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-foreground truncate hover:text-cinema-amber-500">
                                      {story.title}
                                    </h4>
                                    <span className="text-[10px] text-muted-foreground truncate block">
                                      {story.subtitle}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={story.associatedProfilePhoto}
                                    className="w-6 h-6 rounded-full object-cover border border-border shrink-0"
                                    alt={story.associatedProfileName}
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="font-semibold text-foreground/90 truncate max-w-[100px]">
                                    {story.associatedProfileName}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 whitespace-nowrap font-mono text-[10px] font-bold text-muted-foreground uppercase">
                                {story.category}
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                                  story.status === 'Published'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                                }`}>
                                  {story.status}
                                </span>
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                                    <div className="h-full bg-cinema-amber-500 rounded-full" style={{ width: `${story.completionProgress}%` }} />
                                  </div>
                                  <span className="font-mono text-[10px] font-bold text-foreground">
                                    {story.completionProgress}%
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                                {story.chapterCount} Ch • {story.mediaCount} Img • {story.timelineEventCount} Evt
                              </td>
                              <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    id={`btn-row-explore-${story.id}`}
                                    onClick={() => handleOpenDetails(story.id)}
                                    variant="ghost"
                                    size="xs"
                                    className="py-1 px-2 border border-border text-[10px] h-7"
                                  >
                                    Details
                                  </Button>
                                  <Button
                                    id={`btn-row-studio-${story.id}`}
                                    onClick={() => handleSimulateEdit(story.title)}
                                    variant="ghost"
                                    size="xs"
                                    className="py-1 px-2 border border-cinema-amber-500/30 text-[10px] text-cinema-amber-500 h-7"
                                  >
                                    Studio
                                  </Button>
                                  <Button
                                    id={`btn-row-delete-${story.id}`}
                                    onClick={() => handleDeleteStory(story.id)}
                                    variant="ghost"
                                    size="xs"
                                    className="p-1 text-red-500 hover:text-red-400 h-7"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border" id="stories-pagination-bar">
                  <span className="text-xs text-muted-foreground font-mono">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredStories.length)} of {filteredStories.length} stories
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      id="btn-pagination-prev"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="xs"
                      leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                    >
                      Previous
                    </Button>
                    <span className="text-xs font-mono font-bold text-foreground px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      id="btn-pagination-next"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="xs"
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Story Wizard Modal */}
      {showWizard && (
        <StoryWizard
          onClose={() => setShowWizard(false)}
          onSave={async (newStory) => {
            await refreshStories();
            showToast('success', 'Story Created', `"${newStory.title}" is now available in your archive.`);
            setShowWizard(false);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={executeDeleteStory}
        title={deleteConfirmation.isBulk ? 'Delete Selected Stories?' : 'Delete Story Project?'}
        message={
          deleteConfirmation.isBulk
            ? `Are you sure you want to permanently delete ${selectedRowIds.length} story projects? This action cannot be undone.`
            : `Are you sure you want to permanently delete "${deleteConfirmation.storyTitle}"? All scene scripts and linked timelines will be removed.`
        }
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel, Keep"
        isDestructive={true}
      />
    </div>
  );
}
