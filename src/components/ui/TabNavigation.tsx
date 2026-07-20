/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabNavigationProps<T extends string> {
  id: string;
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (value: T) => void;
  className?: string;
}

export function TabNavigation<T extends string>({
  id,
  tabs,
  activeTab,
  onChange,
  className = '',
}: TabNavigationProps<T>) {
  return (
    <div
      className={`border-b border-border flex flex-wrap items-center gap-6 ${className}`}
      id={id}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            id={`${id}-tab-${tab.value}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${id}-panel-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinema-amber-500/50 ${
              isActive
                ? 'border-cinema-amber-500 text-cinema-amber-600 dark:text-cinema-amber-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                isActive 
                  ? 'bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
