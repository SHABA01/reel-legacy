/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { InspectorSelection } from '../../context/InspectorContext';

export interface ContextPanelHeaderProps {
  headerConfig: {
    badge: string;
    badgeColor?: string;
    title: string;
    subtitle: string;
  };
  selection: InspectorSelection;
  onClearSelection: () => void;
  onClose: () => void;
}

export function ContextPanelHeader({
  headerConfig,
  selection,
  onClearSelection,
  onClose,
}: ContextPanelHeaderProps) {
  return (
    <div id="right-panel-header" className="px-4 py-3 border-b border-border bg-muted/40 shrink-0 space-y-1 text-left">
      <div className="flex items-center justify-between">
        <span
          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
            headerConfig.badgeColor || 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30'
          }`}
        >
          {headerConfig.badge}
        </span>
        <div className="flex items-center gap-1">
          {selection.type !== 'none' && (
            <button
              onClick={onClearSelection}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted border border-border cursor-pointer transition-colors"
              title="Deselect item"
            >
              Clear Selection
            </button>
          )}
          <button
            id="right-panel-close-btn"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground custom-focus cursor-pointer"
            aria-label="Collapse Context Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-display font-bold text-sm text-foreground truncate">{headerConfig.title}</h3>
      <p className="text-[11px] text-muted-foreground truncate font-medium">{headerConfig.subtitle}</p>
    </div>
  );
}
