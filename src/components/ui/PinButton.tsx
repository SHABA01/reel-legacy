/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pin } from 'lucide-react';

interface PinButtonProps {
  id: string;
  isPinned: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function PinButton({
  id,
  isPinned,
  onClick,
  className = '',
}: PinButtonProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
        isPinned
          ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 shadow-sm shadow-indigo-500/5 hover:bg-indigo-500/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
      } ${className}`}
      title={isPinned ? 'Unpin from top' : 'Pin to top'}
    >
      <Pin 
        className={`w-3.5 h-3.5 transition-all duration-200 active:scale-75 ${isPinned ? 'rotate-45 fill-current' : ''}`} 
      />
    </button>
  );
}
