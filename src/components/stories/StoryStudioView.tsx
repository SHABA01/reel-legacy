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
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StoryWizard } from './StoryWizard';
import { StoryWorkspace } from './StoryWorkspace';
import { ExtendedStory } from './mockStoriesData';
import { persistenceService, StoryService } from '../../storage';
import { useToast } from '../../context/ToastContext';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';

export function StoryStudioView() {
  const { showToast } = useToast();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedStoryId = searchParams.get('id');

  const [stories, setStories] = useState<ExtendedStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardTemplateCategory, setWizardTemplateCategory] = useState<string | undefined>(undefined);

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
    } catch (err: any) {
      console.error('Failed to save story in Story Studio:', err);
    }
  }, []);

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
          onClose={handleCloseWorkspace}
          onSave={handleSaveWorkspace}
        />
      </div>
    );
  }

  // ENTRY STATE 1: Story Studio Landing Workspace (Creative Launchpad)
  return (
    <div className="space-y-8 animate-fade-in pt-2.5 md:pt-4 lg:pt-5 pb-16" id="story-studio-landing">
      {/* 1. HERO SECTION */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-cinema-slate-900 via-cinema-slate-950 to-cinema-slate-900 border border-cinema-slate-800 rounded-3xl text-white shadow-xl relative overflow-hidden" id="studio-landing-header">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cinema-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-amber-500/15 border border-cinema-amber-500/30 text-cinema-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 animate-pulse text-cinema-amber-500" />
              Creative Studio Launchpad
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              Story Studio
            </h2>
            <p className="text-xs md:text-sm text-cinema-slate-300 leading-relaxed font-medium">
              Your creative workspace for building cinematic legacy documentaries. Create, edit, refine, and prepare stories for rendering.
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
            className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer self-start lg:self-center"
          >
            Create Story
          </Button>
        </div>
      </div>

      {/* 2. CONTINUE RECENT STORY SECTION */}
      <div id="studio-continue-recent-container" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cinema-amber-500" /> Continue Recent Story
          </h3>
          {recentStory && (
            <span className="text-xs font-mono text-muted-foreground">
              Last modified: {new Date(recentStory.lastEdited).toLocaleDateString()}
            </span>
          )}
        </div>

        {recentStory ? (
          <div className="p-5 md:p-6 bg-card border border-cinema-amber-500/40 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-cinema-amber-500/70 transition-all">
            <div className="flex items-center gap-5 min-w-0 w-full md:w-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border border-border relative bg-muted shadow-inner">
                {recentStory.coverImage ? (
                  <img
                    src={recentStory.coverImage}
                    alt={recentStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cinema-amber-500 bg-cinema-amber-500/10">
                    {renderStoryGenreIcon(recentStory.category, 'w-8 h-8 text-cinema-amber-500')}
                  </div>
                )}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-cinema-amber-400 font-bold">
                  {recentStory.category}
                </div>
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-cinema-amber-600 dark:text-cinema-amber-400">
                    Subject: {recentStory.associatedProfileName}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                    Draft Status: {recentStory.status}
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-foreground truncate">
                  {recentStory.title}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {recentStory.subtitle || recentStory.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 font-mono flex-wrap">
                  <span>Est. Runtime: {recentStory.durationEstimate}</span>
                  <span>•</span>
                  <span>Completion: {recentStory.completionProgress}%</span>
                </div>
              </div>
            </div>

            <Button
              id="btn-studio-continue-recent"
              variant="accent"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              onClick={() => setSearchParams({ id: recentStory.id })}
              className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold shadow-md w-full md:w-auto shrink-0 cursor-pointer"
            >
              Continue in Studio
            </Button>
          </div>
        ) : (
          <div className="p-8 bg-card border border-border rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 flex items-center justify-center mx-auto">
              <Film className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">No recent story projects</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Launch your first documentary story project to begin compiling biography chapters, timelines, media, and voice narration.
            </p>
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
              onClick={() => setIsWizardOpen(true)}
              className="bg-cinema-amber-500 text-slate-950 font-bold cursor-pointer"
            >
              Create Story
            </Button>
          </div>
        )}
      </div>

      {/* 3. QUICK ACCESS NAVIGATION SHORTCUTS */}
      <div id="studio-quick-access-section" className="space-y-4 pt-2">
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Compass className="w-4 h-4 text-cinema-amber-500" /> Quick Access
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Direct shortcuts to production tools and asset management workspaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" id="studio-quick-access-grid">
          {/* Shortcut 1: Story Library */}
          <div
            id="quick-access-story-library"
            className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 w-fit">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  Story Library
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Manage, organize, archive, and search story projects.
                </p>
              </div>
            </div>
            <Button
              id="btn-goto-story-library"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/workspace/story-library')}
              className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold transition-all cursor-pointer mt-2"
            >
              View Story Library
            </Button>
          </div>

          {/* Shortcut 2: Story Templates */}
          <div
            id="quick-access-story-templates"
            className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 w-fit">
                <LayoutTemplate className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  Story Templates
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Browse reusable documentary templates.
                </p>
              </div>
            </div>
            <Button
              id="btn-goto-story-templates"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/workspace/story-templates')}
              className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold transition-all cursor-pointer mt-2"
            >
              Browse Templates
            </Button>
          </div>

          {/* Shortcut 3: Legacy Profiles */}
          <div
            id="quick-access-legacy-profiles"
            className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 w-fit">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  Legacy Profiles
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Manage biography records and source data.
                </p>
              </div>
            </div>
            <Button
              id="btn-goto-legacy-profiles"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/workspace/legacy-profiles')}
              className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold transition-all cursor-pointer mt-2"
            >
              Open Legacy Profiles
            </Button>
          </div>

          {/* Shortcut 4: Media Library */}
          <div
            id="quick-access-media-library"
            className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 w-fit">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  Media Library
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Browse reusable photos, videos, scans, and documents.
                </p>
              </div>
            </div>
            <Button
              id="btn-goto-media-library"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/workspace/media-library')}
              className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold transition-all cursor-pointer mt-2"
            >
              Open Media Library
            </Button>
          </div>

          {/* Shortcut 5: Narration Studio */}
          <div
            id="quick-access-narration-studio"
            className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 w-fit">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  Narration Studio
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Manage AI voices, narration assets, and voice profiles.
                </p>
              </div>
            </div>
            <Button
              id="btn-goto-narration-studio"
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/workspace/narration-studio')}
              className="w-full border-border hover:border-cinema-amber-500 hover:text-cinema-amber-500 text-xs font-bold transition-all cursor-pointer mt-2"
            >
              Open Narration Studio
            </Button>
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY FEED */}
      <div id="studio-activity-section" className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-cinema-amber-500" /> Recent Studio Activity
        </h3>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3" id="studio-activity-feed">
          {[
            {
              id: 'act-1',
              action: 'Story Project Saved',
              detail: 'Biography and timeline milestones synced in Story Studio Workspace.',
              timestamp: '10 minutes ago',
              icon: FileText,
            },
            {
              id: 'act-2',
              action: 'Media Asset Linked',
              detail: 'Historical photo asset linked to chapter timeline sequence.',
              timestamp: '1 hour ago',
              icon: Layers,
            },
            {
              id: 'act-3',
              action: 'New Story Initialized',
              detail: 'Draft created using Living Biography documentary template.',
              timestamp: '3 hours ago',
              icon: FolderPlus,
            },
            {
              id: 'act-4',
              action: 'Narration Track Synthesized',
              detail: 'Chapter 2 oral history voiceover rendered with AI audio model.',
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

      {/* 5. TIPS & INSPIRATION SECTION */}
      <div id="studio-tips-section" className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cinema-amber-500" /> Tips & Inspiration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="studio-tips-grid">
          <div className="p-4 bg-card border border-border rounded-2xl space-y-2 relative overflow-hidden group hover:border-cinema-amber-500/40 transition-all">
            <div className="flex items-center gap-2 text-cinema-amber-500 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Documentary Storytelling</span>
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">
              Structuring Narrative Arcs
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Combine chronological milestones with thematic chapters to balance historical timelines and emotional core moments.
            </p>
          </div>

          <div className="p-4 bg-card border border-border rounded-2xl space-y-2 relative overflow-hidden group hover:border-cinema-amber-500/40 transition-all">
            <div className="flex items-center gap-2 text-cinema-amber-500 text-xs font-mono font-bold">
              <Video className="w-3.5 h-3.5" />
              <span>Media Restoration</span>
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">
              Archival Asset Scanning
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload 300+ DPI scans for vintage family portraits to enable automatic Ken Burns pan-and-zoom motion effects in rendering.
            </p>
          </div>

          <div className="p-4 bg-card border border-border rounded-2xl space-y-2 relative overflow-hidden group hover:border-cinema-amber-500/40 transition-all">
            <div className="flex items-center gap-2 text-cinema-amber-500 text-xs font-mono font-bold">
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Voice Narration</span>
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">
              Authentic Voice Synthesis
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Utilize oral history transcripts in the Narration Studio to generate natural, warmth-infused vocal tracks for chapters.
            </p>
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
    </div>
  );
}
