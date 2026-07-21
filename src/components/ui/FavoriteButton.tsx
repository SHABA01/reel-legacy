/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  id: string;
  isFavorite: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function FavoriteButton({
  id,
  isFavorite,
  onClick,
  className = '',
}: FavoriteButtonProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
        isFavorite
          ? 'text-cinema-amber-500 bg-cinema-amber-500/10 border border-cinema-amber-500/20 shadow-sm shadow-cinema-amber-500/5 hover:bg-cinema-amber-500/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
      } ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star 
        className="w-3.5 h-3.5 transition-transform duration-200 active:scale-75" 
        fill={isFavorite ? 'currentColor' : 'none'} 
      />
    </button>
  );
}
