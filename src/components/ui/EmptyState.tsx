/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Image, BellOff, Search, Calendar, Layout, Info } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  type?: 'stories' | 'media' | 'notifications' | 'search' | 'timeline' | 'templates' | 'generic';
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  id?: string;
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  id,
}: EmptyStateProps) {
  const generatedId = id || `empty-state-${type}-${Math.random().toString(36).substring(2, 9)}`;

  const config = {
    stories: {
      icon: BookOpen,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
      title: 'No cinematic stories yet',
      description: 'Create your first documentary profile or import a career history to start mapping out scenes.',
    },
    media: {
      icon: Image,
      iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20',
      title: 'Your media shelf is empty',
      description: 'Upload old family photographs, certification documents, or video memories to link with your timeline.',
    },
    notifications: {
      icon: BellOff,
      iconColor: 'text-slate-400 bg-slate-50 dark:bg-slate-900/40',
      title: 'All caught up',
      description: 'No new notifications to show. When rendering completes or collaborative edits occur, they will appear here.',
    },
    search: {
      icon: Search,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
      title: 'No matching records found',
      description: 'Try adjusting your keywords, searching for another scene, or filtering by a different document class.',
    },
    timeline: {
      icon: Calendar,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
      title: 'Chronology is clear',
      description: 'No timeline events have been created for this profile. Tap below to map out the first legacy milestone.',
    },
    templates: {
      icon: Layout,
      iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20',
      title: 'No templates unlocked',
      description: 'Create a custom template or explore the library to apply cinematic themes to your legacy stories.',
    },
    generic: {
      icon: Info,
      iconColor: 'text-cinema-slate-400 bg-cinema-slate-50 dark:bg-cinema-slate-900/40',
      title: 'No record available',
      description: 'There is currently no structured data or assets loaded in this viewport.',
    },
  };

  const activeConfig = config[type] || config.generic;
  const IconComponent = activeConfig.icon;

  const displayTitle = title || activeConfig.title;
  const displayDescription = description || activeConfig.description;

  return (
    <div
      id={generatedId}
      className="p-8 md:p-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center max-w-lg mx-auto bg-card/40 dark:bg-card/10 backdrop-blur-xs"
    >
      <div
        id={`${generatedId}-icon-bg`}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shrink-0 ${activeConfig.iconColor}`}
      >
        <IconComponent id={`${generatedId}-icon`} className="w-7 h-7" />
      </div>
      <h3
        id={`${generatedId}-title`}
        className="font-display text-lg font-semibold tracking-tight text-cinema-slate-800 dark:text-cinema-slate-200 mb-2"
      >
        {displayTitle}
      </h3>
      <p
        id={`${generatedId}-desc`}
        className="text-sm text-cinema-slate-500 dark:text-cinema-slate-400 mb-6 leading-relaxed max-w-sm"
      >
        {displayDescription}
      </p>

      {(primaryActionLabel || secondaryActionLabel) && (
        <div id={`${generatedId}-actions`} className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              id={`${generatedId}-sec-action`}
              variant="secondary"
              size="sm"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
          {primaryActionLabel && onPrimaryAction && (
            <Button
              id={`${generatedId}-prim-action`}
              variant="accent"
              size="sm"
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
