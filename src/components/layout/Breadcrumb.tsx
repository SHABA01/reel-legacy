/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs, BreadcrumbItem } from '../../context/BreadcrumbContext';

const ROUTE_NAME_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  'story-library': 'Story Library',
  'story-studio': 'Story Studio',
  'legacy-profiles': 'Legacy Profiles',
  'timeline-chronology': 'Timeline Chronology',
  'media-library': 'Media Library',
  'narration-studio': 'Narration Studio',
  'story-templates': 'Story Templates',
  'render-queue': 'Render Queue',
  'studio-analytics': 'Studio Analytics',
  integrations: 'Integrations',
  settings: 'System Settings',
  'my-profile': 'My Profile',
  notifications: 'Notification Center',
  search: 'Advanced Search',
  help: 'Help Center',
};

export function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const { customBreadcrumbs } = useBreadcrumbs();

  // If custom breadcrumbs are provided by active page/workspace, use them
  if (customBreadcrumbs && customBreadcrumbs.length > 0) {
    return (
      <nav id="app-breadcrumb-nav" aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
        {customBreadcrumbs.map((item: BreadcrumbItem, index: number) => {
          const isLast = index === customBreadcrumbs.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 select-none" />
              )}
              {isLast ? (
                <span
                  id={`breadcrumb-item-active`}
                  className="font-display font-bold text-sm md:text-base text-foreground truncate select-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  id={`breadcrumb-item-${index}`}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className="font-display font-medium text-xs md:text-sm text-muted-foreground/75 hover:text-foreground transition-colors truncate max-w-[140px] md:max-w-[200px] cursor-pointer select-none"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  // Otherwise, automatically derive breadcrumb items from location pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  // Example pathSegments: ['workspace', 'story-library'] or ['workspace', 'settings', 'my-profile']
  
  const workspaceSegments = pathSegments[0] === 'workspace' ? pathSegments.slice(1) : pathSegments;

  if (workspaceSegments.length === 0) {
    return (
      <span className="font-display font-bold text-base md:text-lg text-foreground truncate select-none">
        Dashboard
      </span>
    );
  }

  // Top-level single item (e.g., ['story-library'])
  if (workspaceSegments.length === 1) {
    const rawSeg = workspaceSegments[0];
    const pageName = ROUTE_NAME_MAP[rawSeg] || rawSeg.replace(/-/g, ' ');
    return (
      <span id="breadcrumb-title-single" className="font-display font-bold text-base md:text-lg text-foreground truncate select-none">
        {pageName}
      </span>
    );
  }

  // Multi-segment nested route (e.g., ['settings', 'my-profile'])
  const generatedCrumbs: BreadcrumbItem[] = [];
  let currentPath = '/workspace';

  workspaceSegments.forEach((seg, idx) => {
    currentPath += `/${seg}`;
    const label = ROUTE_NAME_MAP[seg] || seg.replace(/-/g, ' ');
    const isLast = idx === workspaceSegments.length - 1;

    generatedCrumbs.push({
      label,
      path: isLast ? undefined : currentPath,
    });
  });

  return (
    <nav id="app-breadcrumb-nav" aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
      {generatedCrumbs.map((item, index) => {
        const isLast = index === generatedCrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 select-none" />
            )}
            {isLast ? (
              <span
                id={`breadcrumb-gen-active`}
                className="font-display font-bold text-sm md:text-base text-foreground truncate select-none"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                id={`breadcrumb-gen-${index}`}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className="font-display font-medium text-xs md:text-sm text-muted-foreground/75 hover:text-foreground transition-colors truncate max-w-[140px] md:max-w-[200px] cursor-pointer select-none"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
