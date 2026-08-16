/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  HardDrive,
  Download,
} from 'lucide-react';
import { SyncLogEvent } from './integrationTypes';
import { Button } from '../ui/Button';

interface SyncActivityTimelineProps {
  logs: SyncLogEvent[];
  onClearLogs?: () => void;
  onExportLogs?: () => void;
}

export function SyncActivityTimeline({
  logs,
  onExportLogs,
}: SyncActivityTimelineProps) {
  return (
    <div id="sync-activity-timeline-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              AUDIT LOG STREAM
            </span>
            <span className="text-xs font-mono text-muted-foreground">Real-Time Sync Telemetry</span>
          </div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mt-1">
            <History className="w-5 h-5 text-purple-400" /> Integration Activity & Sync History
          </h2>
          <p className="text-xs text-muted-foreground">
            Historical log of cloud backups, voice synthesis batches, OAuth authentication renewals, and GEDCOM tree imports.
          </p>
        </div>

        {onExportLogs && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportLogs}
            className="cursor-pointer border-border hover:border-cinema-amber-500 text-xs font-semibold shrink-0 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-purple-400" /> Export Sync Logs
          </Button>
        )}
      </div>

      <div className="relative border-l border-border/60 pl-4 space-y-4 ml-2 pt-1 text-xs">
        {logs.map((log) => {
          const isSuccess = log.status === 'success';
          const isWarning = log.status === 'warning';
          const isError = log.status === 'error';

          return (
            <div key={log.id} className="relative space-y-1">
              {/* Timeline Bullet */}
              <span
                className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-card ${
                  isSuccess
                    ? 'bg-emerald-400'
                    : isWarning
                    ? 'bg-amber-500'
                    : isError
                    ? 'bg-rose-500'
                    : 'bg-blue-400'
                }`}
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-foreground">{log.message}</span>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-muted text-muted-foreground border-border">
                    {log.integrationName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{log.timestamp}</span>
              </div>

              {log.details && (
                <p className="text-xs text-muted-foreground leading-relaxed">{log.details}</p>
              )}

              {log.transferredBytes && (
                <div className="text-[10px] font-mono text-muted-foreground pt-0.5">
                  Transferred: <span className="text-foreground font-semibold">{(log.transferredBytes / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
