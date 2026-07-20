/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface BulkOperationsBarProps {
  id: string;
  selectedCount: number;
  labelText: string;
  actions: BulkAction[];
  className?: string;
}

export function BulkOperationsBar({
  id,
  selectedCount,
  labelText,
  actions,
  className = '',
}: BulkOperationsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`p-3 bg-muted border border-border rounded-xl flex items-center justify-between animate-fade-in ${className}`}
      id={id}
    >
      <span className="text-xs font-semibold text-foreground">
        {labelText}
      </span>

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            id={action.id}
            variant="ghost"
            size="sm"
            leftIcon={action.icon}
            onClick={action.onClick}
            className={`text-xs border border-border ${action.className || ''}`}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
