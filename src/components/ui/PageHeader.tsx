/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, subtitle, rightContent }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card/60 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </div>
  );
}
