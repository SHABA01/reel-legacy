/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  label?: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  id,
  label,
  value,
  options,
  onChange,
  error,
  helperText,
  placeholder = 'Select option...',
  className = '',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-1.5 ${className}`} id={`${id}-container`}>
      {label && (
        <label
          id={`${id}-label`}
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative w-full" id={`${id}-wrapper`}>
        <button
          type="button"
          id={`${id}-trigger`}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full bg-card border text-sm font-sans rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cinema-amber-500 focus:border-transparent text-foreground flex items-center justify-between pl-3.5 pr-10 py-2.5 text-left ${
            disabled ? 'opacity-60 cursor-not-allowed bg-muted' : 'cursor-pointer'
          } ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-border'
          }`}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 absolute right-3" />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 w-full mt-1.5 bg-card border border-border rounded-lg shadow-xl p-1.5 z-50 text-left text-sm max-h-60 overflow-y-auto flex flex-col gap-1"
            id={`${id}-dropdown`}
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left font-medium rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-cinema-amber-500 text-slate-950 font-bold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-slate-950 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-500 font-sans mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-muted-foreground font-sans mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
