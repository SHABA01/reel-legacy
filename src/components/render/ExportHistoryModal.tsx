/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RenderJob } from '../../types/render';
import { Download, Film, Search, Copy, CheckCircle2, Calendar } from 'lucide-react';

interface ExportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: RenderJob[];
  onDuplicate: (id: string) => void;
}

export const ExportHistoryModal: React.FC<ExportHistoryModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onDuplicate,
}) => {
  const [search, setSearch] = useState('');

  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const filtered = completedJobs.filter((j) =>
    j.storyName.toLowerCase().includes(search.toLowerCase()) ||
    j.profileName.toLowerCase().includes(search.toLowerCase()) ||
    j.format.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      id="export-history-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Production Export History"
      size="lg"
    >
      <div className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Search, download, and review checksums for all historical documentary renders and packages.
          </p>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter exports..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-xl text-foreground"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 border border-dashed border-border rounded-2xl">
            No completed export history matches your query.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="p-3.5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black/60 overflow-hidden border border-border flex-shrink-0">
                    <img
                      src={job.thumbnailUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
                      alt={job.storyName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-xs text-foreground truncate">
                      {job.storyName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-mono">
                      <span className="text-cinema-amber-500 font-bold">{job.version}</span>
                      <span>•</span>
                      <span>{job.resolution}</span>
                      <span>•</span>
                      <span>{job.format}</span>
                      <span>•</span>
                      <span>{job.outputFileSizeMB || 1800} MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDuplicate(job.id)}
                    className="text-xs h-8 gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Re-render
                  </Button>

                  {job.outputFileUrl && (
                    <a
                      href={job.outputFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-8 px-3 text-xs font-bold gap-1.5 inline-flex items-center rounded-xl bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Close History
          </Button>
        </div>
      </div>
    </Modal>
  );
};
