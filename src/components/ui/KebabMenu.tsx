/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MoreVertical, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface KebabMenuItem {
  id: string;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  isDestructive?: boolean;
  disabled?: boolean;
  hasDividerBefore?: boolean;
}

interface KebabMenuProps {
  id: string;
  items: KebabMenuItem[];
  align?: 'left' | 'right';
  className?: string;
  dropdownClassName?: string;
  triggerClassName?: string;
}

export function KebabMenu({
  id,
  items,
  align = 'right',
  className = '',
  dropdownClassName = '',
  triggerClassName = '',
}: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  return (
    <div className={`relative inline-block ${className}`} id={`${id}-kebab-container`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1 rounded-lg bg-black/40 text-white/80 hover:text-white hover:bg-black/60 cursor-pointer backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${triggerClassName}`}
        aria-label="Actions menu"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Transparent click backdrop */}
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Action Dropdown Menu List Overlay */}
          <div
            className={`absolute ${
              align === 'left' ? 'left-0' : 'right-0'
            } mt-1 w-40 bg-card border border-border rounded-xl shadow-lg py-1 z-50 text-left text-xs text-foreground flex flex-col gap-0.5 overflow-hidden ${dropdownClassName}`}
            id={`${id}-dropdown`}
          >
            {items.map((item) => {
              const isDestructive = item.isDestructive;
              const defaultIcon = (
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-colors ${
                    isDestructive ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                />
              );
              const displayIcon = item.icon !== undefined ? item.icon : defaultIcon;

              return (
                <React.Fragment key={item.id}>
                  {item.hasDividerBefore && <div className="border-t border-border my-1" />}
                  <button
                    type="button"
                    id={item.id}
                    disabled={item.disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.disabled) return;
                      item.onClick(e);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-xs font-semibold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      item.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : isDestructive
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    style={{
                      color: item.disabled
                        ? undefined
                        : isDestructive
                        ? undefined
                        : resolvedTheme === 'light'
                        ? '#000000'
                        : undefined,
                    }}
                  >
                    <span className="flex-shrink-0 flex items-center justify-center">
                      {displayIcon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
