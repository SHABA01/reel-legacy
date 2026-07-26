/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RenderJob, RenderFilterState } from '../../types/render';
import { RenderJobRow } from './RenderJobRow';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { BulkOperationsBar } from '../ui/BulkOperationsBar';
import {
  Play,
  Pause,
  RotateCcw,
  XCircle,
  Trash2,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Filter,
  CheckSquare,
} from 'lucide-react';

interface RenderQueueTableProps {
  jobs: RenderJob[];
  inspectingJobId: string | null;
  onInspect: (job: RenderJob) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenStory: (storyId: string) => void;
  onBulkPause: (ids: string[]) => void;
  onBulkResume: (ids: string[]) => void;
  onBulkCancel: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
  onApplyQuickFix?: (jobId: string, checkId: string) => void;
  filterState: RenderFilterState;
  onFilterChange: (updates: Partial<RenderFilterState>) => void;
  onCreateNewRender: () => void;
}

export const RenderQueueTable: React.FC<RenderQueueTableProps> = ({
  jobs,
  inspectingJobId,
  onInspect,
  onPause,
  onResume,
  onRetry,
  onCancel,
  onDuplicate,
  onDelete,
  onOpenStory,
  onBulkPause,
  onBulkResume,
  onBulkCancel,
  onBulkDelete,
  filterState,
  onFilterChange,
  onCreateNewRender,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(jobs.map((j) => j.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = jobs.length > 0 && selectedIds.length === jobs.length;

  return (
    <div className="space-y-4" id="render-queue-table-workspace">
      {/* Table Header Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border border-border/80">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by story, format, or tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-background/80 border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterState.renderType}
              onChange={(e) => onFilterChange({ renderType: e.target.value })}
              className="py-1.5 px-3 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
            >
              <option value="all">All Output Types</option>
              <option value="documentary">Documentary Video</option>
              <option value="trailer">Trailer / Teaser</option>
              <option value="vertical_reel">9:16 Vertical Reel</option>
              <option value="audio_podcast">Audio Podcast</option>
              <option value="memoir_pdf">Print Memoir PDF</option>
              <option value="zip_archive">Full ZIP Package</option>
            </select>

            <select
              value={filterState.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="py-1.5 px-3 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium hidden sm:inline">Sort:</span>
          <select
            value={filterState.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="py-1.5 px-3 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
          >
            <option value="createdAt">Creation Date</option>
            <option value="priority">Priority</option>
            <option value="progress">Render Progress</option>
            <option value="storyName">Story Name</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onFilterChange({
                sortOrder: filterState.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="h-8 px-2"
            title="Toggle Order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {selectedIds.length > 0 && (
        <BulkOperationsBar
          id="render-queue-bulk-bar"
          selectedCount={selectedIds.length}
          actions={[
            {
              id: 'bulk-resume',
              label: 'Resume Selected',
              icon: <Play className="w-3.5 h-3.5" />,
              onClick: () => {
                onBulkResume(selectedIds);
                setSelectedIds([]);
              },
            },
            {
              id: 'bulk-pause',
              label: 'Pause Selected',
              icon: <Pause className="w-3.5 h-3.5" />,
              onClick: () => {
                onBulkPause(selectedIds);
                setSelectedIds([]);
              },
            },
            {
              id: 'bulk-cancel',
              label: 'Cancel Selected',
              icon: <XCircle className="w-3.5 h-3.5" />,
              onClick: () => {
                onBulkCancel(selectedIds);
                setSelectedIds([]);
              },
            },
            {
              id: 'bulk-delete',
              label: 'Delete Selected',
              icon: <Trash2 className="w-3.5 h-3.5" />,
              className: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30',
              onClick: () => {
                onBulkDelete(selectedIds);
                setSelectedIds([]);
              },
            },
          ]}
        />
      )}

      {/* Main Jobs Table */}
      {jobs.length === 0 ? (
        <EmptyState
          id="render-queue-empty"
          type="generic"
          title="No Production Jobs Found"
          description="There are no documentary render jobs matching your selected filter or search terms."
          primaryActionLabel="Start New Render"
          onPrimaryAction={onCreateNewRender}
        />
      ) : (
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/60 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 min-w-[240px]">Documentary Story</th>
                <th className="p-3 min-w-[160px]">Pipeline Status</th>
                <th className="p-3 min-w-[180px]">Progress & Speed</th>
                <th className="p-3">Profile / Format</th>
                <th className="p-3 text-center">Priority</th>
                <th className="p-3">Destination</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <RenderJobRow
                  key={job.id}
                  job={job}
                  isSelected={selectedIds.includes(job.id)}
                  isInspectSelected={inspectingJobId === job.id}
                  onToggleSelect={handleToggleSelect}
                  onInspect={onInspect}
                  onPause={onPause}
                  onResume={onResume}
                  onRetry={onRetry}
                  onCancel={onCancel}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onOpenStory={onOpenStory}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
