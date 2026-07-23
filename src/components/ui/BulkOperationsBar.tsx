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
  labelText?: string;
  itemTypeSingular?: string;
  itemTypePlural?: string;
  actions: BulkAction[];
  className?: string;
}

export function BulkOperationsBar({
  id,
  selectedCount,
  labelText,
  itemTypeSingular = 'item',
  itemTypePlural = 'items',
  actions,
  className = '',
}: BulkOperationsBarProps) {
  if (selectedCount === 0) return null;

  const displayLabel = labelText
    ? labelText
    : selectedCount === 1
    ? `1 ${itemTypeSingular} selected for batch processing`
    : `${selectedCount} ${itemTypePlural} selected for batch processing`;

  return (
    <div
      className={`p-3 bg-muted border border-border rounded-xl flex items-center justify-between animate-fade-in ${className}`}
      id={id}
    >
      <span className="text-xs font-semibold text-foreground">
        {displayLabel}
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
