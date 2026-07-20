/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  id,
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
}: SearchInputProps) {
  return (
    <div className={`flex items-center gap-2 flex-grow max-w-md relative ${className}`} id={`${id}-wrapper`}>
      <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-10 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/60"
      />
      {value && (
        <button
          id={`${id}-clear`}
          type="button"
          onClick={() => onChange('')}
          className="p-1 rounded-full hover:bg-muted absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
