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

  // Active modal/drawer tracking
  activeModalId: string | null;
  registerModalOpen: (id: string) => boolean;
  unregisterModalClose: (id: string) => void;

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
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [activeView, setActiveViewState] = useState<ActiveView>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [activeRightWidget, setActiveRightWidget] = useState<RightPanelWidget>('ai-suggestions');

  const openOverlay = (type: OverlayType) => {
    if (activeModalId !== null) {
      return;
    }
    setActiveOverlay((prev) => {
      if (prev !== null && prev !== type) {
        return prev;
      }
      return type;
    });
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const toggleOverlay = (type: OverlayType) => {
    if (activeModalId !== null) {
      return;
    }
    setActiveOverlay((prev) => {
      if (prev !== null && prev !== type) {
        return prev;
      }
      return prev === type ? null : type;
    });
  };

  const registerModalOpen = (id: string) => {
    // If any overlay is open, block modal opening
    if (activeOverlay !== null) {
      return false;
    }
    // If another modal is open, block modal opening
    if (activeModalId !== null && activeModalId !== id) {
      return false;
    }
    setActiveModalId(id);
    return true;
  };

  const unregisterModalClose = (id: string) => {
    setActiveModalId((prev) => (prev === id ? null : prev));
  };

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    // Close overlays and modals when navigating
    setActiveOverlay(null);
    setActiveModalId(null);
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
        activeModalId,
        registerModalOpen,
        unregisterModalClose,
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
