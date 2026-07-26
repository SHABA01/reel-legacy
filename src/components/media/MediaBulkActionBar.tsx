/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  FolderPlus,
  BookOpen,
  Download,
  Archive,
  Trash2,
  Wand2,
  Palette,
  Maximize2,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

interface MediaBulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAllToggle: () => void;
  onClearSelection: () => void;
  onAddToStory: () => void;
  onAddToCollection: () => void;
  onAiRestore: () => void;
  onAiColorize: () => void;
  onAiUpscale: () => void;
  onDownload: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function MediaBulkActionBar({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAllToggle,
  onClearSelection,
  onAddToStory,
  onAddToCollection,
  onAiRestore,
  onAiColorize,
  onAiUpscale,
  onDownload,
  onArchive,
  onDelete
}: MediaBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 bg-card/95 border border-cinema-amber-500/40 shadow-2xl backdrop-blur-xl px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs text-foreground animate-fade-in max-w-4xl w-[92vw]">
      {/* Count & Select All */}
      <div className="flex items-center gap-2 border-r border-border pr-3">
        <button
          onClick={onSelectAllToggle}
          className="p-1 rounded text-cinema-amber-400 hover:bg-muted/80 flex items-center gap-1.5 font-mono text-xs font-bold"
        >
          <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
          <span>{selectedCount} Selected</span>
        </button>
        <button
          onClick={onClearSelection}
          className="p-1 rounded text-muted-foreground hover:text-foreground"
          title="Deselect all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Contextual Actions */}
      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none py-0.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddToStory}
          leftIcon={<BookOpen className="w-3.5 h-3.5 text-cinema-amber-400" />}
        >
          Add to Story
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onAddToCollection}
          leftIcon={<FolderPlus className="w-3.5 h-3.5 text-blue-400" />}
        >
          Add to Album
        </Button>

        {/* AI Processing Tools */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={onAiRestore}
            className="px-2 py-1 rounded text-[11px] font-medium text-cinema-amber-300 hover:bg-cinema-amber-500/20 flex items-center gap-1"
            title="Repair damaged scans, fix scratches, and reduce noise"
          >
            <Sparkles className="w-3 h-3 text-cinema-amber-400" /> AI Restore
          </button>
          <button
            onClick={onAiColorize}
            className="px-2 py-1 rounded text-[11px] font-medium text-purple-300 hover:bg-purple-500/20 flex items-center gap-1"
            title="Convert black & white historical photos to realistic color"
          >
            <Palette className="w-3 h-3 text-purple-400" /> AI Colorize
          </button>
          <button
            onClick={onAiUpscale}
            className="px-2 py-1 rounded text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1"
            title="Super-resolution upscale to 4K studio quality"
          >
            <Maximize2 className="w-3 h-3 text-emerald-400" /> AI Upscale 4K
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          leftIcon={<Download className="w-3.5 h-3.5 text-muted-foreground" />}
        >
          Download
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onArchive}
          leftIcon={<Archive className="w-3.5 h-3.5 text-muted-foreground" />}
        >
          Archive
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
