/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, HardDrive, CheckCircle2, RefreshCw, Sparkles, Layers } from 'lucide-react';

interface MediaStatusBarProps {
  totalAssetsCount: number;
  selectedCount: number;
  totalBytesUsed: number;
  maxStorageBytes?: number; // 50MB ceiling default
  isSyncing?: boolean;
}

export function MediaStatusBar({
  totalAssetsCount,
  selectedCount,
  totalBytesUsed,
  maxStorageBytes = 50 * 1024 * 1024,
  isSyncing = false
}: MediaStatusBarProps) {
  const formatMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);
  const percentage = Math.min(100, Math.round((totalBytesUsed / maxStorageBytes) * 100));

  return (
    <footer className="h-9 px-4 border-t border-border bg-card/90 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-muted-foreground shrink-0 z-10">
      {/* Left Metric Items */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-foreground font-semibold">
          <Layers className="w-3.5 h-3.5 text-cinema-amber-500" />
          <span>Total Vault:</span>
          <strong className="text-cinema-amber-400 font-bold">{totalAssetsCount}</strong> assets
        </span>

        {selectedCount > 0 && (
          <span className="px-2 py-0.5 rounded bg-cinema-amber-500/15 text-cinema-amber-400 border border-cinema-amber-500/30 font-bold animate-fade-in">
            {selectedCount} selected
          </span>
        )}
      </div>

      {/* Right Metric Items */}
      <div className="flex items-center gap-5">
        {/* Storage Bar */}
        <div className="flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-cinema-amber-500" />
          <span>Vault Storage:</span>
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden border border-border">
            <div
              className={`h-full transition-all duration-300 ${percentage > 90 ? 'bg-red-500' : 'bg-cinema-amber-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-foreground font-bold">
            {formatMb(totalBytesUsed)} MB / {formatMb(maxStorageBytes)} MB ({percentage}%)
          </span>
        </div>

        {/* Sync Status */}
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          {isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cinema-amber-400" />
              <span className="text-cinema-amber-400">Syncing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vault Synced</span>
            </>
          )}
        </span>

        {/* AI Background Processing Status */}
        <span className="flex items-center gap-1 text-cinema-amber-400 font-semibold">
          <Sparkles className="w-3 h-3" /> AI DAM Active
        </span>
      </div>
    </footer>
  );
}
