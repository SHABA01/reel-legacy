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
import { RenderQueueTable } from './RenderQueueTable';
import { RenderJobCardGrid } from './RenderJobCardGrid';
import { RenderInspector } from './RenderInspector';
import { FailedJobsSection } from './FailedJobsSection';
import { ScheduledJobsSection } from './ScheduledJobsSection';
import { PublishingTargetsSection } from './PublishingTargetsSection';
import { PerformanceInsightsSection } from './PerformanceInsightsSection';
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
  LayoutGrid,
  ListFilter,
  Layers,
  AlertTriangle,
  Calendar,
  Share2,
  BarChart3,
  Search,
  ArrowUpDown,
  Filter,
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

  // Status Filter Chips config
  const filterChips = [
    { id: 'all', label: 'All Jobs', count: stats.totalJobs, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'running', label: 'Active Renders', count: stats.runningJobs, icon: <Play className="w-3.5 h-3.5 text-cinema-amber-500" /> },
    { id: 'queued', label: 'In Queue', count: stats.queuedJobs, icon: <ListFilter className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'completed', label: 'Completed', count: stats.completedJobs, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'failed', label: 'Failed & Alerts', count: stats.failedJobs, icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'scheduled', label: 'Scheduled', count: stats.scheduledJobs, icon: <Calendar className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'publishing', label: 'Publishing Targets', icon: <Share2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'insights', label: 'Performance Analytics', icon: <BarChart3 className="w-3.5 h-3.5 text-cinema-amber-500" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12" id="render-queue-page">
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
        subtitle="Monitor, control, and export every documentary render pipeline across ReelLegacy."
        rightContent={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleQueuePause}
              className={`text-xs gap-1.5 h-9 ${
                stats.isQueuePaused
                  ? 'border-cinema-amber-500 text-cinema-amber-500 bg-cinema-amber-500/10'
                  : ''
              }`}
            >
              {stats.isQueuePaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-cinema-amber-500" />
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
              onClick={() => setProfilesModalOpen(true)}
              className="text-xs gap-1.5 h-9 hidden sm:flex"
            >
              <Sliders className="w-3.5 h-3.5" />
              Presets & Profiles
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryModalOpen(true)}
              className="text-xs gap-1.5 h-9 hidden md:flex"
            >
              <History className="w-3.5 h-3.5" />
              Export History
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsModalOpen(true)}
              className="text-xs gap-1.5 h-9 hidden lg:flex"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
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

      {/* Pipeline Summary Grid (KPI Cards) */}
      <QueueSummary stats={stats} />

      {/* Horizontal Category & Status Filter Bar (Replaces internal left sidebar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/80">
        {filterChips.map((chip) => {
          const isActive = filterState.category === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => handleFilterChange({ category: chip.id })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cinema-amber-500 text-black shadow-sm font-bold'
                  : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {chip.icon}
              <span>{chip.label}</span>
              {chip.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : 'bg-muted-foreground/15 text-muted-foreground'
                  }`}
                >
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Workspace Area: Main Content + Essential Context Inspector */}
      <div className="flex flex-col lg:flex-row items-start gap-6 min-w-0">
        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          {/* Conditional Rendering based on active category */}
          {filterState.category === 'publishing' ? (
            <PublishingTargetsSection />
          ) : filterState.category === 'insights' ? (
            <PerformanceInsightsSection stats={stats} />
          ) : (
            <>
              {/* Failed Renders Callout if failed or alert jobs exist and category is all/failed */}
              {(filterState.category === 'all' || filterState.category === 'failed') &&
                stats.failedJobs > 0 && (
                  <FailedJobsSection
                    jobs={jobs}
                    onRetry={handleRetryJob}
                    onApplyQuickFix={handleApplyQuickFix}
                    onOpenStory={handleOpenStory}
                    onInspect={setSelectedJob}
                  />
                )}

              {/* Scheduled Renders Section if scheduled jobs exist and category is all/scheduled */}
              {(filterState.category === 'all' || filterState.category === 'scheduled') && (
                <ScheduledJobsSection
                  jobs={jobs}
                  onResume={handleResumeJob}
                  onCancel={handleCancelJob}
                  onInspect={setSelectedJob}
                />
              )}

              {/* View Mode Toggle & Primary Render Jobs List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cinema-amber-500" />
                    Live Render Queue & Active Exports
                  </h3>

                  <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border">
                    <button
                      onClick={() => handleFilterChange({ viewMode: 'table' })}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        filterState.viewMode === 'table'
                          ? 'bg-cinema-amber-500 text-black font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Table View"
                    >
                      <ListFilter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFilterChange({ viewMode: 'cards' })}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        filterState.viewMode === 'cards'
                          ? 'bg-cinema-amber-500 text-black font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Cards View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {filterState.viewMode === 'table' ? (
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
                ) : (
                  <RenderJobCardGrid
                    jobs={filteredJobs}
                    inspectingJobId={selectedJob?.id || null}
                    onInspect={setSelectedJob}
                    onPause={handlePauseJob}
                    onResume={handleResumeJob}
                    onRetry={handleRetryJob}
                    onCancel={handleCancelJob}
                    onOpenStory={handleOpenStory}
                  />
                )}
              </div>
            </>
          )}
        </main>

        {/* Essential Context Inspector (Opens when a job is selected) */}
        {selectedJob && (
          <div className="w-full lg:w-96 flex-shrink-0 sticky top-4">
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
        )}
      </div>

      {/* Bottom Status & Performance Bar */}
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
              Export Buffer:{' '}
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
        onDelete={handleDeleteJob}
        onOpenStory={handleOpenStory}
      />

      <ProductionSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSave={(updated) => {
          service.updateSettings(updated);
          setSettings(updated);
          showToast('success', 'Production settings saved');
        }}
      />
    </div>
  );
};
