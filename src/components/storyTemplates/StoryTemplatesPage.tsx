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
} from '../../types/storyTemplate';
import { StoryTemplateService } from '../../services/storyTemplateService';
import { TemplateDiscoveryBar } from './TemplateDiscoveryBar';
import { TemplateSidebar } from './TemplateSidebar';
import { TemplateGrid } from './TemplateGrid';
import { TemplatePreviewInspector } from './TemplatePreviewInspector';
import { ApplyTemplateModal } from './ApplyTemplateModal';
import { TemplateBuilderModal } from './TemplateBuilderModal';
import { ImportTemplateModal } from './ImportTemplateModal';
import {
  Plus,
  Upload,
  Copy,
  Users,
  ChevronRight,
  Layers,
  Sparkles,
  Download,
  FolderCheck,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';

export const StoryTemplatesPage: React.FC = () => {
  const { showToast } = useToast();
  const { navigateToView } = useOverlay();

  const service = useMemo(() => StoryTemplateService.getInstance(), []);

  const [templates, setTemplates] = useState<StoryTemplate[]>(() =>
    service.getTemplates()
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

  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(
    () => templates[0] || null
  );

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
    <div className="space-y-5 animate-fade-in pb-12" id="story-templates-page">
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
        subtitle="Choose a professionally designed storytelling blueprint for your documentary. Automatically scaffold acts, chapters, scene camera paths, and interview prompts."
        rightContent={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="text-xs gap-1.5 h-9"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Template
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedTemplate) handleDuplicate(selectedTemplate);
              }}
              disabled={!selectedTemplate}
              className="text-xs gap-1.5 h-9 hidden sm:flex"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange({ category: 'Community Templates' })}
              className="text-xs gap-1.5 h-9 hidden md:flex"
            >
              <Users className="w-3.5 h-3.5" />
              Browse Community
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setBuilderModalOpen(true)}
              className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-9 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </div>
        }
      />

      {/* Discovery & Search Bar */}
      <TemplateDiscoveryBar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        resultCount={filteredTemplates.length}
      />

      {/* Main 3-Column Layout: Left Categories | Main Cards Grid | Right Context Panel */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left Categories Sidebar */}
        <TemplateSidebar
          activeCategory={filterState.category}
          onSelectCategory={handleSelectCategory}
          templates={templates}
          stats={stats}
        />

        {/* Main Grid View */}
        <main className="flex-1 w-full min-w-0">
          <TemplateGrid
            templates={filteredTemplates}
            selectedTemplateId={selectedTemplate?.id || null}
            onSelectTemplate={setSelectedTemplate}
            onUseTemplate={handleOpenApplyModal}
            onDuplicateTemplate={handleDuplicate}
            onToggleFavorite={handleToggleFavorite}
            onCreateTemplate={() => setBuilderModalOpen(true)}
            viewMode={filterState.viewMode}
          />
        </main>

        {/* Right Context Inspector Panel */}
        <TemplatePreviewInspector
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUseTemplate={handleOpenApplyModal}
          onDuplicate={handleDuplicate}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Bottom Status Bar */}
      <footer className="mt-8 pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-card/40 rounded-2xl p-4">
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

      {/* Modals */}
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
