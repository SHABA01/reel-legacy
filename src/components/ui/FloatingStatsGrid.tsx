/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface FloatingStatItem {
  id: string;
  label: string;
  value: string | number;
  subValue?: React.ReactNode;
  icon: LucideIcon;
  iconBgClass?: string;
  onClick?: () => void;
}

interface FloatingStatsGridProps {
  id: string;
  stats: FloatingStatItem[];
  cols?: string;
  className?: string;
}

export function FloatingStatsGrid({
  id,
  stats,
  cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  className = '',
}: FloatingStatsGridProps) {
  return (
    <div className={`grid ${cols} gap-4 ${className}`} id={id}>
      {stats.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            id={item.id}
            onClick={item.onClick}
            className={`p-5 bg-card border border-border rounded-2xl flex items-center justify-between shadow-xs text-left pretty-float-card transition-all duration-300 ${
              item.onClick ? 'cursor-pointer' : ''
            }`}
          >
            <div className="space-y-1 min-w-0 flex-1 pr-2">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider truncate">
                {item.label}
              </p>
              <p className="text-2xl font-black text-foreground truncate">
                {item.value}
              </p>
              {item.subValue && (
                <div className="text-[10px] truncate">
                  {item.subValue}
                </div>
              )}
            </div>
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              item.iconBgClass || 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20'
            }`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
