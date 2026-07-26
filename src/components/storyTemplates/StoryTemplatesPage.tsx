/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { useOverlay } from '../../context/OverlayContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import {
  StoryTemplate,
  TemplateCategory,
  TemplateFilterState,
  AppliedStoryBlueprint,
} from '../../types/storyTemplate';
import { StoryTemplateService } from '../../services/storyTemplateService';
import { TemplateDiscoveryBar } from './TemplateDiscoveryBar';
import { TemplateCategoryChips } from './TemplateCategoryChips';
import { TemplateHeroShowcase } from './TemplateHeroShowcase';
import { AITemplateMatcher } from './AITemplateMatcher';
import { RecentlyAppliedBlueprints } from './RecentlyAppliedBlueprints';
import { TemplateGrid } from './TemplateGrid';
import { TemplatePreviewInspector } from './TemplatePreviewInspector';
import { TemplateComparisonModal } from './TemplateComparisonModal';
import { ApplyTemplateModal } from './ApplyTemplateModal';
import { TemplateBuilderModal } from './TemplateBuilderModal';
import { ImportTemplateModal } from './ImportTemplateModal';
import {
  Plus,
  Upload,
  Copy,
  Users,
  ChevronRight,
  FolderCheck,
  RefreshCw,
  LayoutGrid,
  Scale,
  X,
  ArrowRight
} from 'lucide-react';

export const StoryTemplatesPage: React.FC = () => {
  const { showToast } = useToast();
  const { navigateToView } = useOverlay();

  const service = useMemo(() => StoryTemplateService.getInstance(), []);

  const [templates, setTemplates] = useState<StoryTemplate[]>(() =>
    service.getTemplates()
  );

  const [appliedBlueprints, setAppliedBlueprints] = useState<AppliedStoryBlueprint[]>(() =>
    service.getAppliedBlueprints()
  );

  const [filterState, setFilterState] = useState<TemplateFilterState>({
    searchQuery: '',
    category: 'All Templates',
    difficulty: 'all',
    duration: 'all',
    style: 'all',
    audience: 'all',
    tab: 'all',
    viewMode: 'grid',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);

  // Comparison State
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  // Modal States
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [builderModalOpen, setBuilderModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [targetTemplateToApply, setTargetTemplateToApply] =
    useState<StoryTemplate | null>(null);

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = service.subscribe(() => {
      const updated = service.getTemplates();
      setTemplates(updated);
      setAppliedBlueprints(service.getAppliedBlueprints());
      if (selectedTemplate) {
        const refreshed = updated.find((t) => t.id === selectedTemplate.id);
        if (refreshed) setSelectedTemplate(refreshed);
      }
    });
    return unsubscribe;
  }, [service, selectedTemplate]);

  // Filtered Templates List
  const filteredTemplates = useMemo(() => {
    return service.filterTemplates(filterState);
  }, [service, filterState, templates]);

  // Featured Templates for Hero
  const featuredTemplates = useMemo(() => {
    const featured = templates.filter((t) => t.isFeatured);
    return featured.length > 0 ? featured : templates.slice(0, 3);
  }, [templates]);

  // AI Matched Template (Default best match)
  const matchedTemplate = useMemo(() => {
    return templates.find((t) => t.id === 'tmpl-military-service') || templates[0] || null;
  }, [templates]);

  // Compared Templates
  const comparedTemplates = useMemo(() => {
    return templates.filter((t) => comparedIds.includes(t.id));
  }, [templates, comparedIds]);

  // Handlers
  const handleFilterChange = useCallback((updates: Partial<TemplateFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSelectCategory = useCallback((category: TemplateCategory) => {
    setFilterState((prev) => ({ ...prev, category }));
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const newFavState = service.toggleFavorite(id);
      showToast(
        'info',
        newFavState ? 'Added to Saved Blueprints' : 'Removed from Saved Blueprints'
      );
    },
    [service, showToast]
  );

  const handleToggleCompare = useCallback((template: StoryTemplate) => {
    setComparedIds((prev) => {
      if (prev.includes(template.id)) {
        return prev.filter((id) => id !== template.id);
      }
      if (prev.length >= 3) {
        showToast('info', 'You can compare up to 3 story blueprints at a time.');
        return prev;
      }
      return [...prev, template.id];
    });
  }, [showToast]);

  const handleDuplicate = useCallback(
    (template: StoryTemplate) => {
      const duplicated = service.duplicateTemplate(template.id);
      if (duplicated) {
        setSelectedTemplate(duplicated);
        showToast('success', `Duplicated "${template.name}" as custom template`);
      }
    },
    [service, showToast]
  );

  const handleOpenApplyModal = useCallback((template: StoryTemplate) => {
    setTargetTemplateToApply(template);
    setApplyModalOpen(true);
  }, []);

  const handleConfirmApply = useCallback(
    (templateId: string, customTitle: string, subjectName: string) => {
      try {
        const applied = service.applyTemplateToStory(
          templateId,
          customTitle,
          subjectName
        );
        showToast(
          'success',
          `Blueprint Scaffolded! Story Studio initialized with ${applied.actCount} acts & ${applied.sceneCount} scenes.`,
          `Applied "${applied.templateName}"`
        );
        setApplyModalOpen(false);
        setSelectedTemplate(null);
        // Navigate to Story Studio Workspace
        navigateToView('studio');
      } catch (err: any) {
        showToast('error', `Failed to apply template: ${err.message}`);
      }
    },
    [service, showToast, navigateToView]
  );

  const stats = useMemo(() => service.getStats(), [service, templates]);

  return (
    <div className="space-y-6 animate-fade-in pb-16" id="story-templates-page">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <button
          onClick={() => navigateToView('dashboard')}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          Dashboard
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-foreground">Story Templates</span>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Story Templates"
        subtitle="Explore and customize professional documentary blueprints. Scaffold acts, chapters, camera paths, interview questions, and AI prompts with one click."
        rightContent={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="text-xs gap-1.5 h-9 bg-card"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Template
            </Button>

            {comparedIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonModalOpen(true)}
                className="text-xs gap-1.5 h-9 bg-cinema-amber-500/10 border-cinema-amber-500/30 text-cinema-amber-500 font-bold"
              >
                <Scale className="w-3.5 h-3.5" />
                Compare ({comparedIds.length})
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={() => setBuilderModalOpen(true)}
              className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-9 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Custom Template
            </Button>
          </div>
        }
      />

      {/* Hero Showcase Carousel */}
      <TemplateHeroShowcase
        featuredTemplates={featuredTemplates}
        onSelectTemplate={setSelectedTemplate}
        onUseTemplate={handleOpenApplyModal}
        onToggleCompare={handleToggleCompare}
        comparedIds={comparedIds}
      />

      {/* Category Chips (Horizontal Bar) */}
      <TemplateCategoryChips
        activeCategory={filterState.category}
        onSelectCategory={handleSelectCategory}
        templates={templates}
        stats={stats}
      />

      {/* Discovery Search & Quick Filter Tabs */}
      <TemplateDiscoveryBar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        resultCount={filteredTemplates.length}
      />

      {/* AI Template Matcher Section */}
      <AITemplateMatcher
        matchedTemplate={matchedTemplate}
        onUseTemplate={handleOpenApplyModal}
        onSelectTemplate={setSelectedTemplate}
      />

      {/* Recently Scaffolded Blueprints */}
      {appliedBlueprints.length > 0 && (
        <RecentlyAppliedBlueprints
          appliedList={appliedBlueprints}
          onResumeStudio={() => navigateToView('studio')}
        />
      )}

      {/* Main Grid View - Spans 100% Width */}
      <main className="w-full min-w-0">
        <TemplateGrid
          templates={filteredTemplates}
          selectedTemplateId={selectedTemplate?.id || null}
          onSelectTemplate={setSelectedTemplate}
          onUseTemplate={handleOpenApplyModal}
          onDuplicateTemplate={handleDuplicate}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          comparedIds={comparedIds}
          onCreateTemplate={() => setBuilderModalOpen(true)}
          viewMode={filterState.viewMode}
        />
      </main>

      {/* Sticky Bottom Comparison Floating Bar */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-md border border-cinema-amber-500/40 rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <div className="w-6 h-6 rounded-full bg-cinema-amber-500 text-black flex items-center justify-center font-extrabold text-[11px]">
              {comparedIds.length}
            </div>
            <span>Blueprints Selected for Comparison</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setComparisonModalOpen(true)}
              className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-8 px-4 rounded-full"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare Side-by-Side
            </Button>

            <button
              type="button"
              onClick={() => setComparedIds([])}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Clear Comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Status & Metadata Bar */}
      <footer className="pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-card/40 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <FolderCheck className="w-4 h-4 text-cinema-amber-500" />
            <span>
              Installed Blueprints: <strong className="text-foreground">{stats.installed}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-cinema-amber-500" />
            <span>
              Community Blueprints: <strong className="text-foreground">{stats.community}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <LayoutGrid className="w-4 h-4 text-cinema-amber-500" />
            <span>
              Custom Blueprints: <strong className="text-foreground">{stats.custom}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cinema-amber-500 font-semibold text-[11px] bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2.5 py-1 rounded-full">
            <RefreshCw className="w-3 h-3" />
            {stats.updatesAvailable} Updates Available
          </span>
          <span className="text-[11px] text-muted-foreground/70">
            ReelLegacy Blueprint Engine v2.4
          </span>
        </div>
      </footer>

      {/* Inspector Slide-over Drawer */}
      {selectedTemplate && (
        <TemplatePreviewInspector
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUseTemplate={handleOpenApplyModal}
          onDuplicate={handleDuplicate}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Modals */}
      <TemplateComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        templates={comparedTemplates}
        onRemoveFromCompare={(id) => setComparedIds((prev) => prev.filter((i) => i !== id))}
        onUseTemplate={handleOpenApplyModal}
        onSelectTemplate={setSelectedTemplate}
      />

      <ApplyTemplateModal
        template={targetTemplateToApply}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onConfirmApply={handleConfirmApply}
      />

      <TemplateBuilderModal
        isOpen={builderModalOpen}
        onClose={() => setBuilderModalOpen(false)}
        onTemplateCreated={(newTmpl) => {
          setSelectedTemplate(newTmpl);
          showToast('success', `Created new story blueprint "${newTmpl.name}"`);
        }}
      />

      <ImportTemplateModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onTemplateImported={(imported) => {
          setSelectedTemplate(imported);
          showToast('success', `Successfully imported "${imported.name}" blueprint`);
        }}
      />
    </div>
  );
};
