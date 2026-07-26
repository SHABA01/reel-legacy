import React from 'react';
import { Link2 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface InspectorTagBadgesProps {
  tags?: string[];
}

export function InspectorTagBadges({ tags }: InspectorTagBadgesProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="border-t border-border pt-3 space-y-1.5">
      <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Tags</span>
      <div className="flex flex-wrap gap-1">
        {tags.map((t, i) => (
          <span key={i} className="text-[9px] font-mono bg-muted/80 px-1.5 py-0.5 rounded text-muted-foreground">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface InspectorActionsProps {
  favorite?: boolean;
  archived?: boolean;
  downloadUrl?: string;
  downloadFilename?: string;
  onToggleFavorite?: () => void;
  onToggleArchive?: () => void;
  onDelete?: () => void;
}

export function InspectorActions({
  favorite,
  archived,
  downloadUrl,
  downloadFilename,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
}: InspectorActionsProps) {
  return (
    <div className="border-t border-border pt-4 space-y-2">
      <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Actions</span>
      <div className="grid grid-cols-2 gap-2">
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
          >
            ★ {favorite ? 'Unfavorite' : 'Favorite'}
          </button>
        )}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadFilename || 'download'}
            className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1 text-center"
          >
            📥 Download
          </a>
        )}

        {onToggleArchive && (
          <button
            onClick={onToggleArchive}
            className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
          >
            📁 {archived ? 'Restore' : 'Archive'}
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-xs font-bold border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1"
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}
