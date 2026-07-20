/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface MetricCardProps {
  id: string;
  label: string;
  value: string | number;
  valueClassName?: string;
  subValue?: string;
  subValueColor?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  isAccent?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface MetricsGridProps {
  id: string;
  metrics: MetricCardProps[];
  className?: string;
}

export function MetricsGrid({ id, metrics, className = '' }: MetricsGridProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${className}`} id={id}>
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        
        // Format values above 999 to '999+' if they are numbers
        const displayValue = typeof metric.value === 'number' && metric.value > 999 
          ? '999+' 
          : metric.value;

        // Custom classes for accent cards versus standard cards
        const cardBgClass = metric.isAccent
          ? 'bg-cinema-amber-500/5 border-cinema-amber-500/10'
          : 'bg-card border-border';

        const labelColorClass = metric.isAccent
          ? 'text-cinema-amber-800 dark:text-cinema-amber-300'
          : 'text-muted-foreground';

        const valueColorClass = metric.valueClassName
          ? metric.valueClassName
          : metric.isAccent
            ? 'text-cinema-amber-600 dark:text-cinema-amber-400'
            : 'text-foreground';

        const hoverBorderColorClass = metric.isAccent
          ? 'hover:border-cinema-amber-500/40'
          : 'hover:border-cinema-amber-500/30';

        const interactiveClasses = metric.onClick 
          ? 'cursor-pointer' 
          : 'cursor-pointer'; // Preserve original cursor-pointer layout design

        return (
          <div
            key={metric.id}
            id={metric.id}
            onClick={metric.onClick}
            className={`p-4 rounded-2xl border flex flex-col justify-between h-24 shadow-sm transition-all duration-300 ${cardBgClass} ${interactiveClasses} ${
              resolvedTheme === 'light' ? `hover:shadow-md hover:-translate-y-1 ${hoverBorderColorClass}` : ''
            } ${metric.className || ''}`}
          >
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${labelColorClass}`}>
              {metric.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`font-display font-black text-2xl ${valueColorClass}`}>
                {displayValue}
              </span>
              {metric.subValue && (
                <span className={`text-[10px] font-bold ${metric.subValueColor || ''}`}>
                  {metric.subValue}
                </span>
              )}
              {IconComponent && (
                <IconComponent className={`w-4 h-4 ${metric.iconClassName || ''}`} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
