/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import { OverlayType, ActiveView, RightPanelWidget } from '../types';

interface OverlayContextType {
  activeOverlay: OverlayType;
  openOverlay: (type: OverlayType) => void;
  closeOverlay: () => void;
  toggleOverlay: (type: OverlayType) => void;

  // Active View navigation inside the shell
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Primary Sidebar state
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;

  // Right Utility Panel state
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  activeRightWidget: RightPanelWidget;
  setActiveRightWidget: (widget: RightPanelWidget) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);
  const [activeView, setActiveViewState] = useState<ActiveView>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [activeRightWidget, setActiveRightWidget] = useState<RightPanelWidget>('ai-suggestions');

  const openOverlay = (type: OverlayType) => {
    setActiveOverlay(type);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const toggleOverlay = (type: OverlayType) => {
    setActiveOverlay((prev) => (prev === type ? null : type));
  };

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    // Close overlays when navigating
    setActiveOverlay(null);
  };

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen((prev) => !prev);
  };

  return (
    <OverlayContext.Provider
      value={{
        activeOverlay,
        openOverlay,
        closeOverlay,
        toggleOverlay,
        activeView,
        setActiveView,
        sidebarExpanded,
        setSidebarExpanded,
        toggleSidebar,
        rightPanelOpen,
        setRightPanelOpen,
        toggleRightPanel,
        activeRightWidget,
        setActiveRightWidget,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
