/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Film,
  Plus,
  Play,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Clock,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Users,
  Shield,
  Heart,
  FileText,
  Activity,
  FolderPlus,
  Wand2,
  ChevronRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StoryWizard } from './StoryWizard';
import { StoryWorkspace } from './StoryWorkspace';
import { ExtendedStory } from './mockStoriesData';
import { persistenceService, StoryService } from '../../storage';
import { useToast } from '../../context/ToastContext';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';

interface StoryTemplatePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  runtime: string;
  icon: React.ComponentType<any>;
  badge: string;
}

const TEMPLATE_PRESETS: StoryTemplatePreset[] = [
  {
    id: 'tpl-living-bio',
    title: 'Living Biography',
    category: 'Biography',
    description: 'Comprehensive life arc covering childhood roots, career milestones, wisdom, and core values.',
    runtime: '12-15 mins',
    icon: BookOpen,
    badge: 'Popular',
  },
  {
    id: 'tpl-veteran-legacy',
    title: 'Veteran & Public Service',
    category: 'Historical Documentary',
    description: 'Honoring military service, civic leadership, bravery medals, and historical deployments.',
    runtime: '8-10 mins',
    icon: Shield,
    badge: 'Honors',
  },
  {
    id: 'tpl-ancestral-roots',
    title: 'Ancestral & Heritage Roots',
    category: 'Family Documentary',
    description: 'Multi-generational genealogy, heirloom archives, emigrant voyages, and family trees.',
    runtime: '15-20 mins',
    icon: Users,
    badge: 'Multi-Gen',
  },
  {
    id: 'tpl-milestone-tribute',
    title: 'Milestone Celebration',
    category: 'Tribute',
    description: 'Focused tribute for 80th birthdays, golden anniversaries, retirement, or legacy galas.',
    runtime: '5-8 mins',
    icon: Heart,
    badge: 'Celebration',
  },
  {
    id: 'tpl-career-retrospective',
    title: 'Career & Craft Retrospective',
    category: 'Career Documentary',
    description: 'Professional trajectory, business leadership, patents, mentorship, and lifelong craft.',
    runtime: '10-12 mins',
    icon: Award,
    badge: 'Professional',
  },
];

export function StoryStudioView() {
  const { showToast } = useToast();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedStoryId = searchParams.get('id');

  const [stories, setStories] = useState<ExtendedStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardTemplateCategory, setWizardTemplateCategory] = useState<string | undefined>(undefined);

  // Search & Filter state for landing workspace
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

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

  // Manage breadcrumbs based on entry state
  useEffect(() => {
    if (activeStory) {
      setBreadcrumbs([
        {
          label: 'Story Studio',
          onClick: () => {
            setSearchParams({});
          },
        },
        {
          label: activeStory.title,
        },
      ]);
    } else {
      setBreadcrumbs(null);
    }

    return () => {
      setBreadcrumbs(null);
    };
  }, [activeStory, setBreadcrumbs, setSearchParams]);

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

  // Filtered stories list for landing workspace
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.associatedProfileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Drafts' && story.status === 'Draft') ||
        (statusFilter === 'In Progress' && (story.status === 'In Progress' || story.status === 'Review')) ||
        (statusFilter === 'Completed' && story.status === 'Published');

      return matchesSearch && matchesStatus && story.status !== 'Archived';
    });
  }, [stories, searchQuery, statusFilter]);

  // Most recent story for "Continue Recent Story" hero banner
  const recentStory = useMemo(() => {
    if (stories.length === 0) return null;
    const sorted = [...stories]
      .filter((s) => s.status !== 'Archived')
      .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
    return sorted[0] || null;
  }, [stories]);

  // ENTRY STATE 2: Story Studio Workspace with active story loaded
  if (activeStory) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden" id="story-studio-active-workspace">
        <StoryWorkspace
          story={activeStory}
          onClose={() => {
            setSearchParams({});
          }}
          onSave={async (updatedStory) => {
            try {
              await StoryService.updateStory(updatedStory.id, updatedStory as any);
              await loadStories();
              window.dispatchEvent(new Event('reellegacy-data-changed'));
            } catch (err: any) {
              console.error('Failed to save story in Story Studio:', err);
            }
          }}
        />
      </div>
    );
  }

  // ENTRY STATE 1: Story Studio Landing Workspace
  return (
    <div className="space-y-8 animate-fade-in pt-2.5 md:pt-4 lg:pt-5 pb-16" id="story-studio-landing">
      {/* 1. STUDIO LANDING HEADER */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-cinema-slate-900 via-cinema-slate-950 to-cinema-slate-900 border border-cinema-slate-800 rounded-3xl text-white shadow-xl relative overflow-hidden" id="studio-landing-header">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cinema-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-amber-500/15 border border-cinema-amber-500/30 text-cinema-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 animate-pulse text-cinema-amber-500" />
              Production Workspace
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              Story Studio
            </h2>
            <p className="text-xs md:text-sm text-cinema-slate-300 leading-relaxed font-medium">
              The primary creative workspace for ReelLegacy. Create, structure, refine, and prepare cinematic story projects for documentary rendering.
            </p>
          </div>

          <Button
            id="btn-studio-create-primary"
            variant="accent"
            size="md"
            leftIcon={<Plus className="w-4 h-4 text-slate-950 font-bold" />}
            onClick={() => {
              setWizardTemplateCategory(undefined);
              setIsWizardOpen(true);
            }}
            className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer"
          >
            Create New Story
          </Button>
        </div>
      </div>

      {/* 2. CONTINUE RECENT STORY SECTION */}
      {recentStory && (
        <div id="studio-continue-recent-container" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-cinema-amber-500" /> Continue Recent Story
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              Last modified: {new Date(recentStory.lastEdited).toLocaleDateString()}
            </span>
          </div>

          <div className="p-5 md:p-6 bg-card border border-cinema-amber-500/30 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-cinema-amber-500/60 transition-all">
            <div className="flex items-center gap-5 min-w-0 w-full md:w-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border border-border relative bg-muted">
                {recentStory.coverImage ? (
                  <img
                    src={recentStory.coverImage}
                    alt={recentStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cinema-amber-500 bg-cinema-amber-500/10">
                    <Film className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-cinema-amber-400 font-bold">
                  {recentStory.category}
                </div>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-cinema-amber-600 dark:text-cinema-amber-400">
                    Subject: {recentStory.associatedProfileName}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                    {recentStory.status}
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-foreground truncate">
                  {recentStory.title}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {recentStory.subtitle || recentStory.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 font-mono">
                  <span>Est. Runtime: {recentStory.durationEstimate}</span>
                  <span>•</span>
                  <span>Completion: {recentStory.completionProgress}%</span>
                </div>
              </div>
            </div>

            <Button
              id="btn-studio-continue-recent"
              variant="accent"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              onClick={() => setSearchParams({ id: recentStory.id })}
              className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold shadow-md w-full md:w-auto shrink-0 cursor-pointer"
            >
              Continue in Studio
            </Button>
          </div>
        </div>
      )}

      {/* 3. RECENT STORY PROJECTS */}
      <div id="studio-projects-section" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <FolderPlus className="w-4.5 h-4.5 text-cinema-amber-500" /> Story Projects Library
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any active documentary project to edit chapters, biography, timeline, and media in Studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
              {['All', 'In Progress', 'Drafts', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-card text-foreground shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-48 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="studio-stories-grid">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                id={`studio-story-card-${story.id}`}
                className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
                      {story.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {story.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-foreground group-hover:text-cinema-amber-500 transition-colors line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {story.subtitle || story.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80 truncate max-w-[140px]">
                      {story.associatedProfileName}
                    </span>
                    <span className="font-mono text-[10px] shrink-0">
                      Progress {story.completionProgress}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cinema-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${story.completionProgress}%` }}
                    />
                  </div>

                  <Button
                    id={`btn-open-studio-${story.id}`}
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    onClick={() => setSearchParams({ id: story.id })}
                    className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold transition-all cursor-pointer"
                  >
                    Edit in Studio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-3">
            <Film className="w-8 h-8 text-muted-foreground mx-auto" />
            <h4 className="font-display font-bold text-sm text-foreground">No story projects match filter</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create a new story project to start editing in Story Studio.
            </p>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
              className="mt-2 bg-cinema-amber-500 text-slate-950 font-bold"
            >
              Create New Story
            </Button>
          </div>
        )}
      </div>

      {/* 4. AVAILABLE STORY TEMPLATES */}
      <div id="studio-templates-section" className="space-y-4 pt-4 border-t border-border">
        <div>
          <h3 className="font-display text-base font-bold text-foreground tracking-tight flex items-center gap-2">
            <Wand2 className="w-4.5 h-4.5 text-cinema-amber-500" /> Available Story Templates
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Launch a structured story project with pre-configured narrative arcs, chapter outlines, and AI script prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="studio-templates-grid">
          {TEMPLATE_PRESETS.map((tpl) => {
            const IconComponent = tpl.icon;
            return (
              <div
                key={tpl.id}
                id={`template-card-${tpl.id}`}
                className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/40 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {tpl.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-foreground group-hover:text-cinema-amber-500 transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Category: {tpl.category}</span>
                    <span>Rec. Runtime: {tpl.runtime}</span>
                  </div>

                  <Button
                    id={`btn-use-template-${tpl.id}`}
                    variant="ghost"
                    size="sm"
                    rightIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setWizardTemplateCategory(tpl.category);
                      setIsWizardOpen(true);
                    }}
                    className="w-full border border-cinema-amber-500/30 text-cinema-amber-600 dark:text-cinema-amber-400 hover:bg-cinema-amber-500/10 text-xs font-bold transition-all cursor-pointer"
                  >
                    Start with Template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. RECENT ACTIVITY FEED */}
      <div id="studio-activity-section" className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-display text-base font-bold text-foreground tracking-tight flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-cinema-amber-500" /> Recent Studio Activity
        </h3>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3" id="studio-activity-feed">
          {[
            {
              id: 'act-1',
              action: 'Story Project Saved',
              detail: 'Biography and timeline milestones updated for "thythththt (Copy)".',
              timestamp: '10 minutes ago',
              icon: FileText,
            },
            {
              id: 'act-2',
              action: 'Media Unlinked',
              detail: 'Historical photo asset unlinked from chapter sequence.',
              timestamp: '1 hour ago',
              icon: Layers,
            },
            {
              id: 'act-3',
              action: 'New Story Initialized',
              detail: 'Draft created using Living Biography template.',
              timestamp: '3 hours ago',
              icon: FolderPlus,
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

      {/* STORY CREATION WIZARD MODAL */}
      {isWizardOpen && (
        <StoryWizard
          onClose={() => setIsWizardOpen(false)}
          onSave={handleWizardSave}
          initialCategory={wizardTemplateCategory}
        />
      )}
    </div>
  );
}
