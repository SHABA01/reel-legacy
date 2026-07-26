/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOverlay } from './OverlayContext';

export type InspectorSelectionType =
  | 'none'
  | 'story'
  | 'scene'
  | 'character'
  | 'timeline'
  | 'media'
  | 'narration'
  | 'music'
  | 'profile'
  | 'template'
  | 'render'
  | 'career'
  | 'document'
  | 'import'
  | 'setting';

export interface InspectorSelection {
  type: InspectorSelectionType;
  data?: any;
  id?: string | number;
  meta?: any;
}

export interface InspectorContextType {
  route: string;
  selection: InspectorSelection;
  setSelection: (type: InspectorSelectionType, data?: any, meta?: any) => void;
  clearSelection: () => void;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  openInspector: () => void;
  closeInspector: () => void;
  isInspectorOpen: boolean;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { rightPanelOpen, setRightPanelOpen } = useOverlay();

  const [selection, setSelectionState] = useState<InspectorSelection>({ type: 'none' });
  const [activeTab, setActiveTab] = useState<string>('ai-director');

  // Derive route key from pathname
  const route = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/workspace/dashboard')) return 'dashboard';
    if (path.startsWith('/workspace/story-library')) return 'story-library';
    if (path.startsWith('/workspace/story-studio')) {
      const params = new URLSearchParams(location.search);
      if (params.get('id')) return 'story-studio-workspace';
      return 'story-studio-landing';
    }
    if (path.startsWith('/workspace/legacy-profiles')) return 'legacy-profiles';
    if (path.startsWith('/workspace/media-library')) return 'media-library';
    if (path.startsWith('/workspace/narration-studio')) return 'narration-studio';
    if (path.startsWith('/workspace/story-templates')) return 'story-templates';
    if (path.startsWith('/workspace/render-queue')) return 'render-queue';
    if (path.startsWith('/workspace/studio-analytics')) return 'studio-analytics';
    if (path.startsWith('/workspace/settings')) return 'settings';
    return 'dashboard';
  }, [location.pathname, location.search]);

  // Reset selection when route changes significantly
  useEffect(() => {
    setSelectionState({ type: 'none' });
    setActiveTab('ai-director');
  }, [route]);

  const setSelection = useCallback((type: InspectorSelectionType, data?: any, meta?: any) => {
    setSelectionState({ type, data, id: data?.id, meta });
    // Auto open inspector panel when user selects an object
    if (type !== 'none') {
      setRightPanelOpen(true);
    }
  }, [setRightPanelOpen]);

  const clearSelection = useCallback(() => {
    setSelectionState({ type: 'none' });
  }, []);

  const openInspector = useCallback(() => {
    setRightPanelOpen(true);
  }, [setRightPanelOpen]);

  const closeInspector = useCallback(() => {
    setRightPanelOpen(false);
  }, [setRightPanelOpen]);

  const value = useMemo(
    () => ({
      route,
      selection,
      setSelection,
      clearSelection,
      activeTab,
      setActiveTab,
      openInspector,
      closeInspector,
      isInspectorOpen: rightPanelOpen,
    }),
    [
      route,
      selection,
      setSelection,
      clearSelection,
      activeTab,
      setActiveTab,
      openInspector,
      closeInspector,
      rightPanelOpen,
    ]
  );

  return <InspectorContext.Provider value={value}>{children}</InspectorContext.Provider>;
}

export function useInspector() {
  const context = useContext(InspectorContext);
  if (!context) {
    throw new Error('useInspector must be used within an InspectorProvider');
  }
  return context;
}
