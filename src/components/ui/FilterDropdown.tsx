/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  id: string;
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
  dropdownClassName?: string;
  triggerClassName?: string;
  align?: 'left' | 'right';
  maxHeight?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export function FilterDropdown({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
  dropdownClassName = '',
  triggerClassName = '',
  align = 'right',
  maxHeight = 'max-h-60',
  placeholder = '',
  fullWidth = false,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || value);

  return (
    <div
      className={`relative h-10 ${fullWidth ? 'w-full' : ''} ${className}`}
      id={`${id}-container`}
    >
      <div
        className={`flex items-center gap-1.5 bg-muted px-3 py-2 rounded-xl border border-border text-xs h-10 w-full ${triggerClassName}`}
        id={`${id}-wrapper`}
      >
        {label && (
          <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">
            {label}
          </span>
        )}
        <button
          type="button"
          id={`${id}-trigger`}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-transparent text-foreground font-semibold focus:outline-none text-xs border-none p-0 cursor-pointer flex items-center justify-between gap-1 hover:text-cinema-amber-600 dark:hover:text-cinema-amber-400 transition-colors w-full text-left"
          style={{ color: resolvedTheme === 'light' ? '#000000' : undefined }}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        </button>
      </div>

      {isOpen && (
        <>
          {/* Transparent click backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Options Dropdown menu */}
          <div
            className={`absolute top-full ${
              align === 'left' ? 'left-0' : 'right-0'
            } ${
              fullWidth ? 'w-full' : 'min-w-[12rem]'
            } mt-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-lg p-1.5 z-50 text-left text-xs text-black dark:text-white flex flex-col gap-1 overflow-y-auto ${maxHeight} ${dropdownClassName}`}
            id={`${id}-dropdown`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left font-semibold rounded-lg transition-colors flex items-center justify-between ${
                  value === option.value
                    ? 'bg-cinema-amber-500 text-slate-950 font-bold'
                    : 'text-black dark:text-slate-100 hover:bg-cinema-amber-500 hover:text-slate-950'
                }`}
                style={{
                  color:
                    value === option.value
                      ? undefined
                      : resolvedTheme === 'light'
                      ? '#000000'
                      : undefined,
                }}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
