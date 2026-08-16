/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InspectorTabDef } from '../../context/inspectorConfig';

export interface ContextTabsProps {
  tabs: InspectorTabDef[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ContextTabs({ tabs, activeTab, onTabChange }: ContextTabsProps) {
  return (
    <div id="right-panel-tabs" className="flex border-b border-border bg-muted/20 px-2 shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-anchor-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2.5 flex justify-center border-b-2 transition-all cursor-pointer ${
              isActive
                ? 'border-cinema-amber-500 text-cinema-amber-500'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            title={tab.label}
          >
            <Icon className="w-4.5 h-4.5" />
          </button>
        );
      })}
    </div>
  );
}
