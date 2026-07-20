/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { List, Grid } from 'lucide-react';

interface ViewModeToggleProps {
  id?: string;
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

export function ViewModeToggle({
  id = 'btn-view-mode-toggle',
  viewMode,
  onChange,
  className = '',
}: ViewModeToggleProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => onChange(viewMode === 'grid' ? 'list' : 'grid')}
      className={`h-10 w-10 border border-border rounded-xl flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer hover:scale-105 hover:shadow-sm ${className}`}
      title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
      aria-label="Toggle View Mode"
    >
      {viewMode === 'grid' ? (
        <List className="w-4 h-4 text-cinema-amber-500" />
      ) : (
        <Grid className="w-4 h-4 text-cinema-amber-500" />
      )}
    </button>
  );
}
