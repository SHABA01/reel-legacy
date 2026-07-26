/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { useOverlay } from '../../context/OverlayContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { RenderJob, RenderFilterState, ProductionSettings } from '../../types/render';
import { RenderQueueService } from '../../services/renderQueueService';
import { QueueSummary } from './QueueSummary';
import { RenderQueueSidebar } from './RenderQueueSidebar';
import { RenderQueueTable } from './RenderQueueTable';
import { RenderInspector } from './RenderInspector';
import { NewRenderModal } from './NewRenderModal';
import { OutputProfilesModal } from './OutputProfilesModal';
import { ExportHistoryModal } from './ExportHistoryModal';
import { ProductionSettingsModal } from './ProductionSettingsModal';
import {
  Film,
  Play,
  Pause,
  Plus,
  History,
  Settings,
  ChevronRight,
  HardDrive,
  Cpu,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Zap,
} from 'lucide-react';

export const RenderQueuePage: React.FC = () => {
  const { showToast } = useToast();
  const { navigateToView } = useOverlay();

  const service = useMemo(() => RenderQueueService.getInstance(), []);

  const [jobs, setJobs] = useState<RenderJob[]>(() => service.getJobs());
  const [settings, setSettings] = useState<ProductionSettings>(() => service.getSettings());

  const [filterState, setFilterState] = useState<RenderFilterState>({
    searchQuery: '',
    category: 'all',
    renderType: 'all',
    priority: 'all',
    viewMode: 'table',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selectedJob, setSelectedJob] = useState<RenderJob | null>(() => jobs[0] || null);

  // Modals
  const [newRenderModalOpen, setNewRenderModalOpen] = useState(false);
  const [profilesModalOpen, setProfilesModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = service.subscribe(() => {
      const updated = service.getJobs();
      setJobs(updated);
      setSettings(service.getSettings());

      if (selectedJob) {
        const refreshed = updated.find((j) => j.id === selectedJob.id);
        if (refreshed) setSelectedJob(refreshed);
      }
    });
    return unsubscribe;
  }, [service, selectedJob]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return service.filterJobs(filterState);
  }, [service, filterState, jobs]);

  const stats = useMemo(() => service.getSummaryStats(), [service, jobs]);

  // Handlers
  const handleFilterChange = useCallback((updates: Partial<RenderFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handlePauseJob = useCallback(
    (id: string) => {
      service.pauseJob(id);
      showToast('info', 'Render job paused');
    },
    [service, showToast]
  );

  const handleResumeJob = useCallback(
    (id: string) => {
      service.resumeJob(id);
      showToast('success', 'Render job resumed in pipeline');
    },
    [service, showToast]
  );

  const handleRetryJob = useCallback(
    (id: string) => {
      service.retryJob(id);
      showToast('info', 'Retrying render pipeline from Stage 1');
    },
    [service, showToast]
  );

  const handleCancelJob = useCallback(
    (id: string) => {
      service.cancelJob(id);
      showToast('info', 'Render job cancelled');
    },
    [service, showToast]
  );

  const handleDuplicateJob = useCallback(
    (id: string) => {
      const dup = service.duplicateJob(id);
      if (dup) {
        setSelectedJob(dup);
        showToast('success', `Duplicated render job "${dup.storyName}"`);
      }
    },
    [service, showToast]
  );

  const handleDeleteJob = useCallback(
    (id: string) => {
      service.deleteJob(id);
      if (selectedJob?.id === id) setSelectedJob(null);
      showToast('info', 'Deleted render job record');
    },
    [service, selectedJob, showToast]
  );

  const handleOpenStory = useCallback(
    (storyId: string) => {
      navigateToView('studio');
    },
    [navigateToView]
  );

  const handleApplyQuickFix = useCallback(
    (jobId: string, checkId: string) => {
      const ok = service.applyQuickFix(jobId, checkId);
      if (ok) {
        showToast('success', 'AI Quick Fix applied! Pipeline updated.');
      }
    },
    [service, showToast]
  );

  const handleToggleQueuePause = useCallback(() => {
    if (stats.isQueuePaused) {
      service.resumeQueue();
      showToast('success', 'Production queue resumed');
    } else {
      service.pauseQueue();
      showToast('info', 'Production queue paused');
    }
  }, [service, stats.isQueuePaused, showToast]);

  const handleCreateNewJob = useCallback(
    (jobData: Partial<RenderJob>) => {
      const created = service.createJob(jobData);
      setSelectedJob(created);
      showToast('success', `Created new render job for "${created.storyName}"`);
    },
    [service, showToast]
  );

  return (
    <div className="space-y-5 animate-fade-in pb-12" id="render-queue-page">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <button
          onClick={() => navigateToView('dashboard')}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          Dashboard
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-foreground">Render Queue</span>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Render Queue"
        subtitle="Monitor, manage and export every production job across ReelLegacy."
        rightContent={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleQueuePause}
              className={`text-xs gap-1.5 h-9 ${
                stats.isQueuePaused
                  ? 'border-cinema-amber-500 text-cinema-amber-500'
                  : ''
              }`}
            >
              {stats.isQueuePaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Resume Queue
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause Queue
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryModalOpen(true)}
              className="text-xs gap-1.5 h-9 hidden sm:flex"
            >
              <History className="w-3.5 h-3.5" />
              Export History
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsModalOpen(true)}
              className="text-xs gap-1.5 h-9 hidden md:flex"
            >
              <Settings className="w-3.5 h-3.5" />
              Production Settings
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setNewRenderModalOpen(true)}
              className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-9 shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Render
            </Button>
          </div>
        }
      />

      {/* Queue Summary Grid */}
      <QueueSummary stats={stats} />

      {/* 3-Column Layout: Left Sidebar | Main Table Workspace | Right Context Inspector */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left Sidebar */}
        <RenderQueueSidebar
          activeCategory={filterState.category}
          onSelectCategory={(category) => handleFilterChange({ category })}
          stats={stats}
          onOpenPresets={() => setProfilesModalOpen(true)}
        />

        {/* Main Table Workspace */}
        <main className="flex-1 w-full min-w-0">
          <RenderQueueTable
            jobs={filteredJobs}
            inspectingJobId={selectedJob?.id || null}
            onInspect={setSelectedJob}
            onPause={handlePauseJob}
            onResume={handleResumeJob}
            onRetry={handleRetryJob}
            onCancel={handleCancelJob}
            onDuplicate={handleDuplicateJob}
            onDelete={handleDeleteJob}
            onOpenStory={handleOpenStory}
            onBulkPause={(ids) => ids.forEach(handlePauseJob)}
            onBulkResume={(ids) => ids.forEach(handleResumeJob)}
            onBulkCancel={(ids) => ids.forEach(handleCancelJob)}
            onBulkDelete={(ids) => ids.forEach(handleDeleteJob)}
            onApplyQuickFix={handleApplyQuickFix}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onCreateNewRender={() => setNewRenderModalOpen(true)}
          />
        </main>

        {/* Right Context Panel */}
        <RenderInspector
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onPause={handlePauseJob}
          onResume={handleResumeJob}
          onRetry={handleRetryJob}
          onCancel={handleCancelJob}
          onOpenStory={handleOpenStory}
          onApplyQuickFix={handleApplyQuickFix}
        />
      </div>

      {/* Bottom Status Bar */}
      <footer className="mt-8 pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-card/40 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Cpu className="w-4 h-4 text-cinema-amber-500" />
            <span>
              Active Workers:{' '}
              <strong className="text-foreground">
                {stats.activeWorkers} / {stats.maxParallelWorkers} GPU Slots
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>
              Export Buffer Buffer:{' '}
              <strong className="text-foreground">{stats.storageUsedGB} GB</strong> / 100 GB
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span>
              Cloud Sync:{' '}
              <strong className="text-emerald-400">Connected (3.2 Mbps)</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cinema-amber-500 font-semibold text-[11px] bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2.5 py-1 rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {stats.runningJobs > 0
              ? `Est. Queue Completion: ~${Math.ceil(stats.estimatedQueueFinishTimeSec / 60)} mins`
              : 'Pipeline Idle'}
          </span>
          <span className="text-[11px] text-muted-foreground/70">
            ReelLegacy Encoder v3.8
          </span>
        </div>
      </footer>

      {/* Modals */}
      <NewRenderModal
        isOpen={newRenderModalOpen}
        onClose={() => setNewRenderModalOpen(false)}
        onConfirm={handleCreateNewJob}
      />

      <OutputProfilesModal
        isOpen={profilesModalOpen}
        onClose={() => setProfilesModalOpen(false)}
      />

      <ExportHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        jobs={jobs}
        onDuplicate={handleDuplicateJob}
      />

      <ProductionSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSave={(updates) => {
          service.updateSettings(updates);
          showToast('success', 'Production settings updated');
        }}
      />
    </div>
  );
};
