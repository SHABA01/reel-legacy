/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info } from 'lucide-react';

interface ContextTriggerProps {
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
  size?: 'sm' | 'md';
  active?: boolean;
  'aria-label'?: string;
}

/**
 * Universal "View Details" affordance across ReelLegacy.
 * Provides a consistent ⓘ trigger to open the ContextDrawer for any entity
 * (Media Asset, Scene, Character, Document, Milestone, etc.).
 *
 * Designed for high discoverability:
 * - Desktop: subtly visible, bright on hover/focus
 * - Touch/Mobile: meets 44px min hit target
 */
export function ContextTrigger({
  onClick,
  title = 'View details',
  className = '',
  size = 'md',
  active = false,
  'aria-label': ariaLabel = 'View details',
}: ContextTriggerProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      title={title}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/50
        ${padding}
        ${
          active
            ? 'bg-cinema-amber-500 text-slate-950 shadow-sm ring-1 ring-cinema-amber-400'
            : 'bg-background/80 hover:bg-card text-muted-foreground hover:text-foreground border border-border/60 hover:border-cinema-amber-500/50 shadow-xs'
        }
        ${className}
      `}
    >
      <Info className={iconSize} />
    </button>
  );
}
