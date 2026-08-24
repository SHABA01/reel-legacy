/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info } from 'lucide-react';

export interface ContextTriggerProps {
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  active?: boolean;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'subtle' | 'card-overlay' | 'pill';
  'aria-label'?: string;
}

/**
 * Universal "View Details" affordance across ReelLegacy.
 * Provides a standardized, highly recognizable ⓘ affordance to open the ContextDrawer
 * for any inspectable entity (Media Asset, Scene, Character, Profile, Milestone, etc.).
 *
 * Principles:
 * - Clear discoverability on desktop & touch devices
 * - Unambiguous "View details" tooltip and accessible label
 * - Retains availability after ContextDrawer closes so user can reopen anytime
 */
export function ContextTrigger({
  onClick,
  title = 'View details',
  className = '',
  size = 'sm',
  active = false,
  showLabel = false,
  label = 'Details',
  variant = 'default',
  'aria-label': ariaLabel = 'View details',
}: ContextTriggerProps) {
  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  
  // Style presets based on variant
  let variantStyles = 'bg-background/90 hover:bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:border-cinema-amber-500/50 shadow-xs';

  if (active) {
    variantStyles = 'bg-cinema-amber-500 text-slate-950 shadow-sm ring-1 ring-cinema-amber-400 font-semibold';
  } else if (variant === 'card-overlay') {
    variantStyles = 'bg-black/65 backdrop-blur-md text-white/90 hover:bg-cinema-amber-500 hover:text-slate-950 border border-white/15 hover:border-cinema-amber-400 shadow-sm';
  } else if (variant === 'pill') {
    variantStyles = 'bg-cinema-amber-500/10 hover:bg-cinema-amber-500 text-cinema-amber-400 hover:text-slate-950 border border-cinema-amber-500/30 hover:border-cinema-amber-400 font-medium';
  } else if (variant === 'subtle') {
    variantStyles = 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border';
  }

  const padding = showLabel
    ? size === 'xs'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'sm'
      ? 'px-2.5 py-1 text-xs'
      : 'px-3 py-1.5 text-xs'
    : size === 'xs'
    ? 'p-1'
    : size === 'sm'
    ? 'p-1.5'
    : 'p-2';

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
        inline-flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/50 select-none
        ${padding}
        ${variantStyles}
        ${className}
      `}
    >
      <Info className={`${iconSize} shrink-0`} />
      {showLabel && <span className="font-sans font-medium whitespace-nowrap">{label}</span>}
    </button>
  );
}

