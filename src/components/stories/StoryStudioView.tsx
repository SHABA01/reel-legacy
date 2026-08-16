/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderStoryGenreIcon } from '../../utils/storyGenreUtils';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Film,
  Plus,
  Play,
  Sparkles,
  BookOpen,
  LayoutTemplate,
  Users,
  Image,
  Mic,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Activity,
  FileText,
  Layers,
  FolderPlus,
  Lightbulb,
  Compass,
  Video,
  Wand2,
  Clock,
  Star,
  Archive,
  Eye,
  Copy,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  BarChart2,
  Tag,
  Grid,
  List,
  Pin,
  TrendingUp,
  Folder,
  Layers2,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StoryWizard } from './StoryWizard';
import { StoryWorkspace } from './StoryWorkspace';
import { ExtendedStory, STORY_TYPES, STORY_STATUSES, INITIAL_STORIES } from './mockStoriesData';
import { persistenceService, StoryService } from '../../storage';
import { useToast } from '../../context/ToastContext';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';
import { useTheme } from '../../context/ThemeContext';
import { useInspector } from '../../context/InspectorContext';
import { MetricsGrid } from '../ui/MetricsGrid';
import { FilterBar } from '../ui/FilterBar';
import { FilterDropdown } from '../ui/FilterDropdown';
import { KebabMenu } from '../ui/KebabMenu';
import { FavoriteButton } from '../ui/FavoriteButton';
import { PinButton } from '../ui/PinButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { EmptyState } from '../ui/EmptyState';

export function StoryStudioView() {
  const { showToast } = useToast();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { resolvedTheme } = useTheme();
  const { setSelection, openInspector } = useInspector();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedStoryId = searchParams.get('id');

  // Primary state
  const [stories, setStories] = useState<ExtendedStory[]>(() => INITIAL_STORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardTemplateCategory, setWizardTemplateCategory] = useState<string | undefined>(undefined);

  // Filter & Navigation controls
  const [activeSection, setActiveSection] = useState<'all' | 'active' | 'drafts' | 'recent' | 'pinned' | 'archived' | 'templates' | 'ai-health'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'progress' | 'duration'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Selected story for Inspector Context Panel
  const [selectedStoryForContext, setSelectedStoryForContext] = useState<string | null>(null);

  // Delete modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    storyId?: string;
    storyTitle?: string;
  }>({ isOpen: false });

  // Load story catalog from persistence
  const loadStories = async () => {
    setIsLoading(true);
    try {
      const allStories = await persistenceService.stories.getAll();
      setStories(allStories as ExtendedStory[]);
    } catch (err) {
      console.error('Failed to load stories in Story Studio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();

    const handleDataChanged = () => loadStories();
    window.addEventListener('reellegacy-data-changed', handleDataChanged);
    return () => window.removeEventListener('reellegacy-data-changed', handleDataChanged);
  }, []);

  // Find active loaded story if `id` is present in searchParams
  const activeStory = useMemo(() => {
    if (!selectedStoryId) return null;
    return stories.find((s) => s.id === selectedStoryId) || null;
  }, [selectedStoryId, stories]);

  // Stable navigation & save handlers for workspace
  const handleCloseWorkspace = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handleSaveWorkspace = useCallback(async (updatedStory: ExtendedStory) => {
    try {
      await StoryService.updateStory(updatedStory.id, updatedStory as any);
      await loadStories();
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      showToast('success', 'Changes Saved', `"${updatedStory.title}" updated successfully.`);
    } catch (err: any) {
      showToast('error', 'Save Failed', err.message || 'Could not save modifications.');
    }
  }, [showToast]);

  // Manage breadcrumbs when no active story workspace is loaded
  useEffect(() => {
    if (!activeStory) {
      setBreadcrumbs(null);
    }
    return () => {
      setBreadcrumbs(null);
    };
  }, [activeStory, setBreadcrumbs]);

  // Handle wizard save callback
  const handleWizardSave = async (newStory: ExtendedStory) => {
    try {
      await StoryService.createStory(newStory as any);
      await loadStories();
      setIsWizardOpen(false);
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      showToast('success', 'Story Project Created', `"${newStory.title}" is saved and loaded in Story Studio.`);
      setSearchParams({ id: newStory.id });
    } catch (err: any) {
      showToast('error', 'Creation Failed', err.message || 'Could not save new story project.');
    }
  };

  // Select story to populate Global Context Panel
  const handleSelectStoryForContext = (story: ExtendedStory) => {
    setSelectedStoryForContext(story.id);
    setSelection('story', story);
    if (openInspector) {
      openInspector();
    }
  };

  // Launch into workspace editor
  const handleLaunchWorkspace = (id: string) => {
    setSearchParams({ id });
  };

  // Action helpers
  const handleDuplicateStory = async (id: string) => {
    try {
      const duplicated = await StoryService.duplicateStory(id);
      if (duplicated) {
        await loadStories();
        showToast('success', 'Story Duplicated', `"${duplicated.title}" copy generated.`);
      }
    } catch (error: any) {
      showToast('error', 'Duplication Failed', error.message || 'Could not clone project.');
    }
  };

  const handleArchiveStory = async (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (!target) return;

    const isArchived = target.status === 'Archived';
    try {
      if (isArchived) {
        await StoryService.restoreStory(id);
      } else {
        await StoryService.archiveStory(id);
      }
      await loadStories();
      showToast(
        'info',
        isArchived ? 'Restored to Active' : 'Moved to Vault Archive',
        `"${target.title}" status updated.`
      );
    } catch (error: any) {
      showToast('error', 'Archive Failed', error.message || 'Could not update archive state.');
    }
  };

  const handleDeleteStory = (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (!target) return;
    setDeleteConfirmation({
      isOpen: true,
      storyId: id,
      storyTitle: target.title,
    });
  };

  const executeDeleteStory = async () => {
    if (!deleteConfirmation.storyId) return;
    try {
      await StoryService.deleteStory(deleteConfirmation.storyId);
      await loadStories();
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      showToast('error', 'Production Deleted', `"${deleteConfirmation.storyTitle}" removed.`);
    } catch (error: any) {
      showToast('error', 'Deletion Failed', error.message || 'Could not delete project.');
    } finally {
      setDeleteConfirmation({ isOpen: false });
    }
  };

  const handleTogglePin = async (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (!target) return;
    try {
      await StoryService.pinStory(id, !target.pinned);
      await loadStories();
      showToast('info', target.pinned ? 'Unpinned' : 'Pinned to Top Shelf', `"${target.title}" status updated.`);
    } catch (error: any) {
      showToast('error', 'Pin Failed', error.message || 'Could not update pin state.');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (!target) return;
    try {
      await StoryService.favoriteStory(id, !target.favorite);
      await loadStories();
      showToast('success', target.favorite ? 'Removed Favorite' : 'Added Favorite', `"${target.title}" updated.`);
    } catch (error: any) {
      showToast('error', 'Favorite Failed', error.message || 'Could not update favorite state.');
    }
  };

  // Hero metrics calculation
  const metrics = useMemo(() => {
    const total = stories.length;
    const active = stories.filter((s) => s.status !== 'Archived').length;
    const drafts = stories.filter((s) => (s.status === 'Draft' || s.status === 'In Progress') && s.status !== 'Archived').length;
    const completed = stories.filter((s) => s.status === 'Published' || s.completionProgress >= 90).length;
    const rendering = stories.filter((s) => s.status === 'Rendering' || s.status === 'Ready for AI').length;

    return { total, active, drafts, completed, rendering };
  }, [stories]);

  // Recent Story for Spotlight Banner
  const recentStory = useMemo(() => {
    if (stories.length === 0) return null;
    const sorted = [...stories]
      .filter((s) => s.status !== 'Archived')
      .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
    return sorted[0] || null;
  }, [stories]);

  // Filtered stories catalog
  const filteredStories = useMemo(() => {
    return stories
      .filter((s) => {
        // Section tabs
        if (activeSection === 'active' && s.status === 'Archived') return false;
        if (activeSection === 'drafts' && s.status !== 'Draft' && s.status !== 'In Progress') return false;
        if (activeSection === 'recent' && s.status === 'Archived') return false;
        if (activeSection === 'pinned' && !s.pinned) return false;
        if (activeSection === 'archived' && s.status !== 'Archived') return false;

        // Text search
        const textToMatch = `${s.title} ${s.subtitle} ${s.associatedProfileName} ${s.description} ${s.tags?.join(' ')}`.toLowerCase();
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

        // Toggles
        const matchesFav = !showFavoritesOnly || s.favorite === true;
        const matchesPinned = !showPinnedOnly || s.pinned === true;

        return matchesSearch && matchesCategory && matchesStatus && matchesFav && matchesPinned;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'progress') return b.completionProgress - a.completionProgress;
        if (sortBy === 'duration') return parseInt(b.durationEstimate) - parseInt(a.durationEstimate);
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
      });
  }, [
    stories,
    activeSection,
    searchQuery,
    categoryFilter,
    statusFilter,
    showFavoritesOnly,
    showPinnedOnly,
    showArchivedOnly,
    sortBy,
  ]);

  // Templates catalog definition
  const templateBlueprints = [
    {
      id: 'tpl-living-bio',
      title: 'Living Biography & Oral History',
      category: 'Autobiography',
      description: 'Capture personal life stories, childhood memories, career turning points, and wisdom for future generations.',
      recommendedDuration: '15–20 mins',
      chaptersCount: 6,
      icon: Users,
    },
    {
      id: 'tpl-military-legacy',
      title: 'Military Service & Honor Roll',
      category: 'Historical Figure',
      description: 'Document enlistment, deployments, awards, combat missions, and lifelong service comrades.',
      recommendedDuration: '12–15 mins',
      chaptersCount: 5,
      icon: Film,
    },
    {
      id: 'tpl-career-calling',
      title: 'Career, Trade & Entrepreneurship',
      category: 'Career',
      description: 'Highlight professional milestones, company foundations, patents, mentorship, and industry contributions.',
      recommendedDuration: '10–12 mins',
      chaptersCount: 4,
      icon: Briefcase,
    },
    {
      id: 'tpl-memorial-tribute',
      title: 'Memorial Tribute & Celebration of Life',
      category: 'Memorial',
      description: 'Commemorate beloved ancestors with eulogy narration, family gallery reels, and ancestral history.',
      recommendedDuration: '8–10 mins',
      chaptersCount: 4,
      icon: Star,
    },
  ];

  // ENTRY STATE 2: Story Studio Workspace with active story loaded
  if (selectedStoryId) {
    if (activeStory) {
      return (
        <div className="h-full w-full flex flex-col overflow-hidden" id="story-studio-active-workspace">
          <StoryWorkspace
            story={activeStory}
            onClose={handleCloseWorkspace}
            onSave={handleSaveWorkspace}
          />
        </div>
      );
    }
    
    if (!isLoading) {
      return (
        <div className="p-8 bg-card border border-border rounded-2xl my-6">
          <EmptyState
            title="Story Project Not Found"
            description="The requested story could not be loaded or may have been deleted from your workspace."
            actionLabel="Return to Story Studio Lobby"
            onAction={handleCloseWorkspace}
          />
        </div>
      );
    }
  }

  // ENTRY STATE 1: Story Studio Landing (Production Lobby / Creative Launchpad)
  return (
    <div className="space-y-6 animate-fade-in text-foreground pt-2.5 md:pt-4 lg:pt-5 pb-16" id="story-studio-landing">
      
      {/* 1. HERO PRODUCTION OVERVIEW BANNER */}
      <div
        className="p-6 md:p-8 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300"
        id="studio-landing-header"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-cinema-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500 text-xs font-mono font-bold">
              <Film className="w-3.5 h-3.5 animate-pulse" />
              Production Studio Lobby
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight text-foreground">
              Story Studio
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
              Your cinematic production workspace. Organize active documentaries, prepare narration scripts, organize scenes, and launch into the Studio Editor.
            </p>
          </div>

          {/* Hero Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              id="btn-studio-create-primary"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-black font-bold" />}
              onClick={() => {
                setWizardTemplateCategory(undefined);
                setIsWizardOpen(true);
              }}
              className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-black font-bold shadow-md cursor-pointer"
            >
              New Story
            </Button>
            <Button
              id="btn-studio-import"
              variant="outline"
              size="sm"
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => showToast('info', 'Import Production', 'Select a story script file or project archive to import.')}
              className="text-xs font-bold border-border"
            >
              Import
            </Button>
            {recentStory && (
              <Button
                id="btn-studio-open-recent"
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4 text-cinema-amber-500" />}
                onClick={() => handleLaunchWorkspace(recentStory.id)}
                className="text-xs font-bold border border-cinema-amber-500/20 text-cinema-amber-500 hover:bg-cinema-amber-500/10"
              >
                Continue Last Session
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PRODUCTION DASHBOARD METRICS */}
      <MetricsGrid
        id="studio-landing-stats-grid"
        metrics={[
          {
            id: 'stat-total-productions',
            label: 'Total Productions',
            value: metrics.total,
            subValue: 'In Catalog',
            subValueColor: 'text-blue-500 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10',
            onClick: () => setActiveSection('all'),
          },
          {
            id: 'stat-active-productions',
            label: 'Active Workspace',
            value: metrics.active,
            subValue: 'In Production',
            subValueColor: 'text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10',
            onClick: () => setActiveSection('active'),
          },
          {
            id: 'stat-draft-productions',
            label: 'Drafts & Planning',
            value: metrics.drafts,
            subValue: 'Scripting',
            subValueColor: 'text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10',
            onClick: () => setActiveSection('drafts'),
          },
          {
            id: 'stat-rendering-productions',
            label: 'Ready / Rendering',
            value: metrics.rendering,
            subValue: 'Queue',
            subValueColor: 'text-indigo-500 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10',
            onClick: () => setActiveSection('ai-health'),
          },
          {
            id: 'stat-completed-productions',
            label: 'Completed Films',
            value: metrics.completed,
            isAccent: true,
            icon: TrendingUp,
            iconClassName: 'text-cinema-amber-500',
            className: 'col-span-2 md:col-span-1',
          }
        ]}
      />

      {/* 3. HORIZONTAL SECTION NAVIGATION */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm rounded-xl p-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none" id="horizontal-studio-nav">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All Productions', icon: Layers, count: metrics.total },
            { id: 'active', label: 'Active Studio', icon: Film, count: metrics.active },
            { id: 'drafts', label: 'Drafts & Scripts', icon: FileText, count: metrics.drafts },
            { id: 'recent', label: 'Recently Opened', icon: Clock, count: stories.length },
            { id: 'pinned', label: 'Pinned Shelf', icon: Pin, count: stories.filter((s) => s.pinned).length },
            { id: 'archived', label: 'Vault Archive', icon: Archive, count: stories.filter((s) => s.status === 'Archived').length },
            { id: 'templates', label: 'Documentary Blueprints', icon: LayoutTemplate, count: templateBlueprints.length },
            { id: 'ai-health', label: 'AI Health Audit', icon: Wand2, badge: 'Insights' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                id={`studio-nav-tab-${tab.id}`}
                onClick={() => {
                  setActiveSection(tab.id as any);
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

      {/* 4. CONTINUE RECENT SPOTLIGHT BANNER (WHEN NOT IN SPECIAL TABS) */}
      {recentStory && activeSection !== 'templates' && activeSection !== 'ai-health' && (
        <div id="studio-continue-recent-spotlight" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
              <RotateCcw className="w-3.5 h-3.5 text-cinema-amber-500" /> Continue Where You Left Off
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              Last modified {new Date(recentStory.lastEdited).toLocaleDateString()}
            </span>
          </div>

          <div className="p-5 bg-card border border-cinema-amber-500/40 hover:border-cinema-amber-500/70 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 transition-all group">
            <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border border-border relative bg-muted shadow-inner">
                {recentStory.coverImage ? (
                  <img
                    src={recentStory.coverImage}
                    alt={recentStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cinema-amber-500 bg-cinema-amber-500/10">
                    {renderStoryGenreIcon(recentStory.category, 'w-6 h-6 text-cinema-amber-500')}
                  </div>
                )}
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-cinema-amber-400 font-bold">
                  {recentStory.category}
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="font-bold text-cinema-amber-500">
                    Subject: {recentStory.associatedProfileName}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                    {recentStory.status}
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                  {recentStory.title}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {recentStory.subtitle || recentStory.description}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                  <span>Runtime: {recentStory.durationEstimate}</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-bold">{recentStory.completionProgress}% Drafted</span>
                </div>
              </div>
            </div>

            <Button
              id="btn-spotlight-launch-studio"
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4 text-black font-bold" />}
              onClick={() => handleLaunchWorkspace(recentStory.id)}
              className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-black font-bold shadow-md w-full md:w-auto shrink-0 cursor-pointer"
            >
              Launch Studio Workspace
            </Button>
          </div>
        </div>
      )}

      {/* 5. TEMPLATES TAB SECTION */}
      {activeSection === 'templates' && (
        <div className="space-y-6" id="templates-section-view">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">Documentary Blueprints & Templates</h3>
              <p className="text-xs text-muted-foreground">Pre-structured narrative frameworks with guided interview prompts and chapter pacing.</p>
            </div>
            <Button
              id="btn-templates-browse-full"
              onClick={() => navigate('/workspace/story-templates')}
              variant="outline"
              size="xs"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              Full Template Library
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {templateBlueprints.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <div
                  key={tpl.id}
                  id={`template-blueprint-card-${tpl.id}`}
                  className="p-5 bg-card border border-border hover:border-cinema-amber-500/40 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {tpl.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground group-hover:text-cinema-amber-500 transition-colors">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>{tpl.chaptersCount} Structured Chapters</span>
                      <span>{tpl.recommendedDuration}</span>
                    </div>

                    <Button
                      id={`btn-apply-template-${tpl.id}`}
                      onClick={() => {
                        setWizardTemplateCategory(tpl.category);
                        setIsWizardOpen(true);
                      }}
                      variant="outline"
                      size="xs"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold"
                    >
                      Use Blueprint
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. AI HEALTH & RECOMMENDATIONS SECTION */}
      {activeSection === 'ai-health' && (
        <div className="space-y-6" id="ai-health-section-view">
          <div className="p-5 bg-card border border-indigo-500/30 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI Production Audit Engine
            </div>
            <h3 className="font-display font-extrabold text-xl text-foreground">
              Production Health & Automated Suggestions
            </h3>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Real-time audit of script completeness, voice narration availability, timeline milestones, and media attachment quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Script Ready
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {stories.filter((s) => s.aiReady || s.status === 'Ready for AI').length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Stories with structured outline ready for Gemini script polish and narration synthesis.
              </p>
            </div>

            <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> Voice Narration Needed
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {stories.filter((s) => s.chapterCount > 0 && s.completionProgress > 30).length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Drafted stories ready for oral history voice recording or synthetic voice over dubbing.
              </p>
            </div>

            <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Incomplete Timelines
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {stories.filter((s) => s.timelineEventCount === 0).length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Early story drafts lacking chronological event markers and historical dates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. MAIN CATALOG SECTION (FOR ALL, ACTIVE, DRAFTS, RECENT, PINNED, ARCHIVED) */}
      {activeSection !== 'templates' && activeSection !== 'ai-health' && (
        <div className="space-y-5" id="main-studio-catalog">
          
          {/* Filter & Search Bar */}
          <FilterBar
            id="studio-filter-bar"
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            searchPlaceholder="Search production titles, subjects, tags..."
            sortBy={sortBy}
            sortOptions={[
              { value: 'updated', label: 'Recently Edited' },
              { value: 'name', label: 'Production Title A–Z' },
              { value: 'progress', label: 'Completion %' },
              { value: 'duration', label: 'Runtime Duration' }
            ]}
            onSortByChange={(val) => setSortBy(val as any)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showAdvancedFilters={showAdvancedFilters}
            onShowAdvancedFiltersChange={setShowAdvancedFilters}
            hasActiveFilters={categoryFilter !== 'all' || statusFilter !== 'all'}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesOnlyChange={setShowFavoritesOnly}
            showPinnedOnly={showPinnedOnly}
            onPinnedOnlyChange={setShowPinnedOnly}
            showArchivedOnly={showArchivedOnly}
            onArchivedOnlyChange={setShowArchivedOnly}
            archivedLabel="Vault Projects"
          >
            {/* Category Filter */}
            <div className="space-y-1.5 relative" id="studio-category-filter-wrapper">
              <label className="text-[10px] font-bold uppercase tracking-wider block font-mono text-muted-foreground">
                Documentary Genre
              </label>
              <FilterDropdown
                id="studio-category-dropdown"
                value={categoryFilter}
                options={[
                  { value: 'all', label: 'All Genres' },
                  ...STORY_TYPES.map((type) => ({ value: type, label: type }))
                ]}
                onChange={setCategoryFilter}
                fullWidth
                align="left"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5 relative" id="studio-status-filter-wrapper">
              <label className="text-[10px] font-bold uppercase tracking-wider block font-mono text-muted-foreground">
                Production Stage
              </label>
              <FilterDropdown
                id="studio-status-dropdown"
                value={statusFilter}
                options={[
                  { value: 'all', label: 'All Stages' },
                  ...STORY_STATUSES.map((st) => ({ value: st, label: st }))
                ]}
                onChange={setStatusFilter}
                fullWidth
                align="left"
              />
            </div>
          </FilterBar>

          {/* Catalog Empty State */}
          {filteredStories.length === 0 && (
            <EmptyState
              id="empty-state-studio-catalog"
              type="search"
              title="No story productions found"
              description="No story projects match your current filter settings. Reset your search parameters or initialize a new project."
              primaryActionLabel="Create Story"
              onPrimaryAction={() => setIsWizardOpen(true)}
              secondaryActionLabel="Reset Filters"
              onSecondaryAction={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setShowFavoritesOnly(false);
                setShowPinnedOnly(false);
                setShowArchivedOnly(false);
              }}
            />
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && filteredStories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6" id="studio-grid-view">
              {filteredStories.map((story) => {
                const isSelected = selectedStoryForContext === story.id;
                return (
                  <div
                    key={story.id}
                    id={`studio-card-${story.id}`}
                    onClick={() => handleSelectStoryForContext(story)}
                    className={`group border bg-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm h-[310px] transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-cinema-amber-500 ring-2 ring-cinema-amber-500/20'
                        : 'border-border hover:border-cinema-amber-500/30 hover:shadow-md'
                    }`}
                  >
                    {/* Cover Header */}
                    <div className="h-24 w-full relative shrink-0 bg-muted">
                      <img
                        src={story.coverImage}
                        alt={`${story.title} cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[9px] font-mono font-bold bg-black/70 text-cinema-amber-400 border border-cinema-amber-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {story.category}
                      </span>

                      <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
                        <KebabMenu
                          id={`kebab-studio-${story.id}`}
                          items={[
                            {
                              id: `action-edit-studio-${story.id}`,
                              label: 'Edit in Studio',
                              onClick: () => handleLaunchWorkspace(story.id),
                              icon: <Film className="w-3.5 h-3.5 text-cinema-amber-500" />,
                            },
                            {
                              id: `action-duplicate-studio-${story.id}`,
                              label: 'Duplicate',
                              onClick: () => handleDuplicateStory(story.id),
                              icon: <Copy className="w-3.5 h-3.5 text-muted-foreground" />,
                            },
                            {
                              id: `action-archive-studio-${story.id}`,
                              label: story.status === 'Archived' ? 'Unarchive' : 'Archive',
                              onClick: () => handleArchiveStory(story.id),
                              icon: <Archive className="w-3.5 h-3.5 text-muted-foreground" />,
                            },
                            {
                              id: `action-delete-studio-${story.id}`,
                              label: 'Delete Project',
                              onClick: () => handleDeleteStory(story.id),
                              isDestructive: true,
                              hasDividerBefore: true,
                              icon: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
                            },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Associated Profile Subject Badge */}
                    <div className="px-4 relative -mt-4 flex items-end justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <img
                          src={story.associatedProfilePhoto}
                          alt={story.associatedProfileName}
                          className="w-8 h-8 rounded-full border-2 border-card object-cover bg-muted shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-bold text-foreground truncate max-w-28 bg-card/80 backdrop-blur-xs rounded px-1.5 py-0.5 border border-border/20">
                          {story.associatedProfileName}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Text */}
                    <div className="px-4 py-2 flex-grow flex flex-col justify-between min-h-0 overflow-hidden">
                      <div className="min-h-0 overflow-hidden">
                        <h4 className="font-display font-black text-xs text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-[9px] text-muted-foreground font-semibold leading-tight line-clamp-1 mt-0.5">
                          {story.subtitle}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="text-[9px] font-bold font-mono text-cinema-amber-500 bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                            {story.completionProgress}% Complete
                          </span>
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <FavoriteButton
                              id={`fav-studio-${story.id}`}
                              isFavorite={story.favorite}
                              onClick={() => handleToggleFavorite(story.id)}
                            />
                            <PinButton
                              id={`pin-studio-${story.id}`}
                              isPinned={story.pinned}
                              onClick={() => handleTogglePin(story.id)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-1 mt-2 overflow-hidden">
                        <div
                          className="bg-cinema-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${story.completionProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Footer Launch Action */}
                    <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground">
                        <span className="capitalize text-foreground font-bold">{story.status}</span>
                        <span>•</span>
                        <span>{story.durationEstimate}</span>
                      </div>

                      <Button
                        id={`btn-card-launch-${story.id}`}
                        variant="ghost"
                        size="xs"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchWorkspace(story.id);
                        }}
                        className="text-xs font-bold text-cinema-amber-500 hover:bg-cinema-amber-500/10 cursor-pointer"
                      >
                        Edit Studio
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && filteredStories.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border shadow-sm" id="studio-list-view">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  id={`studio-list-row-${story.id}`}
                  onClick={() => handleSelectStoryForContext(story)}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-14 h-10 rounded-lg object-cover border border-border shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-foreground truncate hover:text-cinema-amber-500">
                          {story.title}
                        </h4>
                        <span className="text-[9px] font-mono uppercase bg-muted text-muted-foreground px-2 py-0.2 rounded shrink-0">
                          {story.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        Subject: {story.associatedProfileName} • Est: {story.durationEstimate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right font-mono text-xs hidden sm:block">
                      <span className="text-emerald-500 font-bold block">{story.completionProgress}%</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{story.status}</span>
                    </div>

                    <Button
                      id={`btn-list-launch-${story.id}`}
                      variant="primary"
                      size="xs"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 text-black" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchWorkspace(story.id);
                      }}
                      className="bg-cinema-amber-500 text-black font-bold"
                    >
                      Open Editor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. QUICK ACCESS TOOL SHORTCUTS & ACTIVITY FEED */}
      <div id="studio-activity-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-border">
        {/* Activity Feed Column */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-cinema-amber-500" /> Recent Production Studio Activity
          </h3>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-2.5">
            {[
              {
                id: 'act-1',
                action: 'Story Studio Project Saved',
                detail: 'Biographical milestones and timeline events synced to repository.',
                timestamp: '10 mins ago',
                icon: FileText,
              },
              {
                id: 'act-2',
                action: 'Archival Photo Asset Linked',
                detail: 'Historical portrait image attached to chapter timeline.',
                timestamp: '1 hour ago',
                icon: Layers,
              },
              {
                id: 'act-3',
                action: 'New Story Initialized',
                detail: 'Draft created using Living Biography documentary blueprint.',
                timestamp: '3 hours ago',
                icon: FolderPlus,
              },
              {
                id: 'act-4',
                action: 'Voice Narration Synthesized',
                detail: 'Chapter 2 oral history voice track generated in Narration Studio.',
                timestamp: 'Yesterday',
                icon: Mic,
              },
            ].map((act) => {
              const ActIcon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500 shrink-0 mt-0.5">
                    <ActIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">{act.action}</span>
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0">{act.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate">{act.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Access Tool Shortcuts Column */}
        <div className="space-y-3">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
            <Compass className="w-4 h-4 text-cinema-amber-500" /> Production Shortcuts
          </h3>

          <div className="space-y-2.5">
            <div
              onClick={() => navigate('/workspace/story-library')}
              className="p-3 bg-card border border-border hover:border-cinema-amber-500/40 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h5 className="font-bold text-xs text-foreground group-hover:text-cinema-amber-500 transition-colors">Story Library</h5>
                  <p className="text-[10px] text-muted-foreground">Collection & Archive</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>

            <div
              onClick={() => navigate('/workspace/narration-studio')}
              className="p-3 bg-card border border-border hover:border-cinema-amber-500/40 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
                  <Mic className="w-4 h-4" />
                </span>
                <div>
                  <h5 className="font-bold text-xs text-foreground group-hover:text-cinema-amber-500 transition-colors">Narration Studio</h5>
                  <p className="text-[10px] text-muted-foreground">AI Voice Synthesis</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>

            <div
              onClick={() => navigate('/workspace/media-library')}
              className="p-3 bg-card border border-border hover:border-cinema-amber-500/40 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
                  <Image className="w-4 h-4" />
                </span>
                <div>
                  <h5 className="font-bold text-xs text-foreground group-hover:text-cinema-amber-500 transition-colors">Media Library</h5>
                  <p className="text-[10px] text-muted-foreground">Archival Photos & Scans</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* STORY CREATION WIZARD MODAL */}
      {isWizardOpen && (
        <StoryWizard
          onClose={() => setIsWizardOpen(false)}
          onSave={handleWizardSave}
          initialCategory={wizardTemplateCategory}
        />
      )}

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={executeDeleteStory}
        title="Delete Story Production?"
        message={`Are you sure you want to permanently delete "${deleteConfirmation.storyTitle}"? All timeline milestones and scene scripts will be removed.`}
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel, Keep"
        isDestructive={true}
      />
    </div>
  );
}
