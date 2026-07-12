/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, WifiOff, ShieldAlert, FileX, Cpu, Film, HelpCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  type?: '404' | '403' | '500' | 'network' | 'offline' | 'permission' | 'ai-failure' | 'render-failure' | 'unknown';
  title?: string;
  description?: string;
  retryActionLabel?: string;
  onRetry?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  id?: string;
}

export function ErrorState({
  type = 'unknown',
  title,
  description,
  retryActionLabel = 'Retry Action',
  onRetry,
  secondaryActionLabel,
  onSecondaryAction,
  id,
}: ErrorStateProps) {
  const generatedId = id || `error-state-${type}-${Math.random().toString(36).substring(2, 9)}`;

  const config = {
    '404': {
      icon: FileX,
      iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20',
      title: 'Scene Not Found (404)',
      description: 'The requested biography asset or workspace view has been archived or does not exist.',
    },
    '403': {
      icon: ShieldAlert,
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20',
      title: 'Restricted Access (403)',
      description: 'You do not have administrative permissions to review this profile draft.',
    },
    '500': {
      icon: AlertCircle,
      iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20',
      title: 'Internal Server Error (500)',
      description: 'An unexpected crash occurred inside our documentary compilation pipeline. We have flagged this event.',
    },
    'network': {
      icon: WifiOff,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
      title: 'Connection Disrupted',
      description: 'Unable to communicate with the ReelLegacy cloud servers. Please check your ethernet connection.',
    },
    'offline': {
      icon: WifiOff,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
      title: 'You are currently offline',
      description: 'Story drafts will be synchronized with the database as soon as network services recover.',
    },
    'permission': {
      icon: ShieldAlert,
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20',
      title: 'Permission Denied',
      description: 'Access token expired or unauthorized workspace role. Reach out to the owner of this story archive.',
    },
    'ai-failure': {
      icon: Cpu,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
      title: 'AI Script Synthesis Failed',
      description: 'The AI model was unable to parse the legacy context or generated a response that failed safety validation.',
    },
    'render-failure': {
      icon: Film,
      iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20',
      title: 'Cinematic Rendering Failed',
      description: 'Compilation aborted: photo encoding error or narration track sync mismatch in Scene 4.',
    },
    'unknown': {
      icon: HelpCircle,
      iconColor: 'text-cinema-slate-400 bg-cinema-slate-50 dark:bg-cinema-slate-900/40',
      title: 'An unexpected error occurred',
      description: 'A structural error prevents this page from compiling properly.',
    },
  };

  const activeConfig = config[type] || config.unknown;
  const IconComponent = activeConfig.icon;

  const displayTitle = title || activeConfig.title;
  const displayDescription = description || activeConfig.description;

  return (
    <div
      id={generatedId}
      className="p-8 md:p-12 border border-red-100 dark:border-red-950/40 rounded-2xl flex flex-col items-center justify-center text-center max-w-lg mx-auto bg-red-50/10 dark:bg-red-950/5 backdrop-blur-xs shadow-sm"
    >
      <div
        id={`${generatedId}-icon-bg`}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shrink-0 ${activeConfig.iconColor}`}
      >
        <IconComponent id={`${generatedId}-icon`} className="w-7 h-7" />
      </div>
      <h3
        id={`${generatedId}-title`}
        className="font-display text-lg font-semibold tracking-tight text-red-900 dark:text-red-400 mb-2"
      >
        {displayTitle}
      </h3>
      <p
        id={`${generatedId}-desc`}
        className="text-sm text-cinema-slate-500 dark:text-cinema-slate-400 mb-6 leading-relaxed max-w-sm"
      >
        {displayDescription}
      </p>

      {(onRetry || secondaryActionLabel) && (
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
          {onRetry && (
            <Button
              id={`${generatedId}-prim-action`}
              variant="danger"
              size="sm"
              onClick={onRetry}
            >
              {retryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
