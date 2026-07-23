/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OverlayType, ActiveView, RightPanelWidget } from '../types';

// ==========================================
// 1. Navigation Manager
// ==========================================

export interface NavigationContextType {
  activeView: ActiveView;
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRightPanel: () => void;
  activeRightWidget: RightPanelWidget;
  setActiveRightWidget: React.Dispatch<React.SetStateAction<RightPanelWidget>>;
  navigateToView: (view: ActiveView) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [activeRightWidget, setActiveRightWidget] = useState<RightPanelWidget>('ai-suggestions');

  // Derive activeView directly from route pathname
  const activeView = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/workspace/dashboard')) return 'dashboard';
    if (path.startsWith('/workspace/story-library')) return 'stories';
    if (path.startsWith('/workspace/story-studio')) return 'studio';
    if (path.startsWith('/workspace/legacy-profiles')) return 'profiles';
    if (path.startsWith('/workspace/timeline-chronology')) return 'studio';
    if (path.startsWith('/workspace/media-library')) return 'media';
    if (path.startsWith('/workspace/narration-studio')) return 'narration';
    if (path.startsWith('/workspace/story-templates')) return 'templates';
    if (path.startsWith('/workspace/render-queue')) return 'render';
    if (path.startsWith('/workspace/studio-analytics')) return 'analytics';
    if (path.startsWith('/workspace/integrations')) return 'integrations';
    if (path.startsWith('/workspace/settings')) return 'settings';
    if (path.startsWith('/workspace/notifications')) return 'notifications';
    if (path.startsWith('/workspace/search')) return 'search';
    if (path.startsWith('/workspace/help')) return 'help';
    return 'dashboard';
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded((prev) => !prev);
  }, []);

  const toggleRightPanel = useCallback(() => {
    setRightPanelOpen((prev) => !prev);
  }, []);

  const viewPaths: Record<ActiveView, string> = useMemo(() => ({
    dashboard: '/workspace/dashboard',
    stories: '/workspace/story-library',
    studio: '/workspace/story-studio',
    profiles: '/workspace/legacy-profiles',
    timeline: '/workspace/story-studio',
    media: '/workspace/media-library',
    narration: '/workspace/narration-studio',
    templates: '/workspace/story-templates',
    render: '/workspace/render-queue',
    analytics: '/workspace/studio-analytics',
    integrations: '/workspace/integrations',
    settings: '/workspace/settings',
    notifications: '/workspace/notifications',
    search: '/workspace/search',
    help: '/workspace/help',
  }), []);

  const navigateToView = useCallback((view: ActiveView) => {
    navigate(viewPaths[view]);
  }, [navigate, viewPaths]);

  const value = useMemo(() => ({
    activeView,
    sidebarExpanded,
    setSidebarExpanded,
    toggleSidebar,
    rightPanelOpen,
    setRightPanelOpen,
    toggleRightPanel,
    activeRightWidget,
    setActiveRightWidget,
    navigateToView,
  }), [
    activeView,
    sidebarExpanded,
    toggleSidebar,
    rightPanelOpen,
    toggleRightPanel,
    activeRightWidget,
    navigateToView,
  ]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationManager() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationManager must be used within a NavigationProvider');
  }
  return context;
}

// ==========================================
// 2. Overlay Manager
// ==========================================

export interface OverlayManagerContextType {
  activeOverlay: OverlayType;
  openOverlay: (type: OverlayType) => void;
  closeOverlay: () => void;
  toggleOverlay: (type: OverlayType) => void;
}

const OverlayManagerContext = createContext<OverlayManagerContextType | undefined>(undefined);

export function OverlayManagerProvider({ children }: { children: React.ReactNode }) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  const openOverlay = useCallback((type: OverlayType) => {
    setActiveOverlay(type);
  }, []);

  const closeOverlay = useCallback(() => {
    setActiveOverlay(null);
  }, []);

  const toggleOverlay = useCallback((type: OverlayType) => {
    setActiveOverlay((prev) => (prev === type ? null : type));
  }, []);

  const value = useMemo(() => ({
    activeOverlay,
    openOverlay,
    closeOverlay,
    toggleOverlay,
  }), [activeOverlay, openOverlay, closeOverlay, toggleOverlay]);

  return (
    <OverlayManagerContext.Provider value={value}>
      {children}
    </OverlayManagerContext.Provider>
  );
}

export function useOverlayManager() {
  const context = useContext(OverlayManagerContext);
  if (context === undefined) {
    throw new Error('useOverlayManager must be used within an OverlayManagerProvider');
  }
  return context;
}

// ==========================================
// 3. Modal Manager
// ==========================================

export interface ModalManagerContextType {
  activeModalId: string | null;
  registerModalOpen: (id: string) => void;
  unregisterModalClose: (id: string) => void;
  closeAllModals: () => void;
}

const ModalManagerContext = createContext<ModalManagerContextType | undefined>(undefined);

export function ModalManagerProvider({ children }: { children: React.ReactNode }) {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const registerModalOpen = useCallback((id: string) => {
    setActiveModalId(id);
  }, []);

  const unregisterModalClose = useCallback((id: string) => {
    setActiveModalId((prev) => (prev === id ? null : prev));
  }, []);

  const closeAllModals = useCallback(() => {
    setActiveModalId(null);
  }, []);

  const value = useMemo(() => ({
    activeModalId,
    registerModalOpen,
    unregisterModalClose,
    closeAllModals,
  }), [activeModalId, registerModalOpen, unregisterModalClose, closeAllModals]);

  return (
    <ModalManagerContext.Provider value={value}>
      {children}
    </ModalManagerContext.Provider>
  );
}

export function useModalManager() {
  const context = useContext(ModalManagerContext);
  if (context === undefined) {
    throw new Error('useModalManager must be used within a ModalManagerProvider');
  }
  return context;
}

// ==========================================
// 4. UI Orchestrator
// ==========================================

export interface UIOrchestratorContextType {
  orchestrateOpenOverlay: (type: OverlayType) => void;
  orchestrateCloseOverlay: () => void;
  orchestrateToggleOverlay: (type: OverlayType) => void;
  orchestrateRegisterModalOpen: (id: string) => boolean;
  orchestrateUnregisterModalClose: (id: string) => void;
  orchestrateNavigate: (view: ActiveView) => void;
}

const UIOrchestratorContext = createContext<UIOrchestratorContextType | undefined>(undefined);

export function UIOrchestratorProvider({ children }: { children: React.ReactNode }) {
  const navigation = useNavigationManager();
  const overlay = useOverlayManager();
  const modal = useModalManager();
  const location = useLocation();

  const orchestrateOpenOverlay = useCallback((type: OverlayType) => {
    // If a modal is open, we block overlays
    if (modal.activeModalId !== null) {
      return;
    }
    overlay.openOverlay(type);
  }, [overlay.openOverlay, modal.activeModalId]);

  const orchestrateCloseOverlay = useCallback(() => {
    overlay.closeOverlay();
  }, [overlay.closeOverlay]);

  const orchestrateToggleOverlay = useCallback((type: OverlayType) => {
    // If a modal is open, we block overlays
    if (modal.activeModalId !== null) {
      return;
    }
    overlay.toggleOverlay(type);
  }, [overlay.toggleOverlay, modal.activeModalId]);

  const orchestrateRegisterModalOpen = useCallback((id: string): boolean => {
    // If any overlay is open, block modal opening
    if (overlay.activeOverlay !== null) {
      return false;
    }
    // If another modal is open, block modal opening
    if (modal.activeModalId !== null && modal.activeModalId !== id) {
      return false;
    }
    modal.registerModalOpen(id);
    return true;
  }, [overlay.activeOverlay, modal.activeModalId, modal.registerModalOpen]);

  const orchestrateUnregisterModalClose = useCallback((id: string) => {
    modal.unregisterModalClose(id);
  }, [modal.unregisterModalClose]);

  const orchestrateNavigate = useCallback((view: ActiveView) => {
    navigation.navigateToView(view);
    // Overlays and modals close automatically on navigation event via orchestration
    overlay.closeOverlay();
    modal.closeAllModals();
  }, [navigation.navigateToView, overlay.closeOverlay, modal.closeAllModals]);

  // Coordinated side-effects: Automatically close overlays/modals when route changes
  useEffect(() => {
    overlay.closeOverlay();
    modal.closeAllModals();
  }, [location.pathname, overlay.closeOverlay, modal.closeAllModals]);

  const value = useMemo(() => ({
    orchestrateOpenOverlay,
    orchestrateCloseOverlay,
    orchestrateToggleOverlay,
    orchestrateRegisterModalOpen,
    orchestrateUnregisterModalClose,
    orchestrateNavigate,
  }), [
    orchestrateOpenOverlay,
    orchestrateCloseOverlay,
    orchestrateToggleOverlay,
    orchestrateRegisterModalOpen,
    orchestrateUnregisterModalClose,
    orchestrateNavigate,
  ]);

  return (
    <UIOrchestratorContext.Provider value={value}>
      {children}
    </UIOrchestratorContext.Provider>
  );
}

export function useUIOrchestrator() {
  const context = useContext(UIOrchestratorContext);
  if (context === undefined) {
    throw new Error('useUIOrchestrator must be used within a UIOrchestratorProvider');
  }
  return context;
}

// ==========================================
// 5. Unified Facade & Top-Level Provider
// ==========================================

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <OverlayManagerProvider>
        <ModalManagerProvider>
          <UIOrchestratorProvider>
            {children}
          </UIOrchestratorProvider>
        </ModalManagerProvider>
      </OverlayManagerProvider>
    </NavigationProvider>
  );
}

/**
 * Unified selector hook for existing consumers to access UI state.
 * Implements the facade pattern to keep imports simple and fully backward-compatible.
 */
export function useOverlay() {
  const navigation = useNavigationManager();
  const overlay = useOverlayManager();
  const modal = useModalManager();
  const orchestrator = useUIOrchestrator();

  return useMemo(() => ({
    // Overlay (Coordinated)
    activeOverlay: overlay.activeOverlay,
    openOverlay: orchestrator.orchestrateOpenOverlay,
    closeOverlay: orchestrator.orchestrateCloseOverlay,
    toggleOverlay: orchestrator.orchestrateToggleOverlay,

    // Modals (Coordinated)
    activeModalId: modal.activeModalId,
    registerModalOpen: orchestrator.orchestrateRegisterModalOpen,
    unregisterModalClose: orchestrator.orchestrateUnregisterModalClose,

    // Navigation & View (Derived & Coordinated)
    activeView: navigation.activeView,
    setActiveView: orchestrator.orchestrateNavigate,

    // Sidebar
    sidebarExpanded: navigation.sidebarExpanded,
    setSidebarExpanded: navigation.setSidebarExpanded,
    toggleSidebar: navigation.toggleSidebar,

    // Right Utility Panel
    rightPanelOpen: navigation.rightPanelOpen,
    setRightPanelOpen: navigation.setRightPanelOpen,
    toggleRightPanel: navigation.toggleRightPanel,
    activeRightWidget: navigation.activeRightWidget,
    setActiveRightWidget: navigation.setActiveRightWidget,
  }), [navigation, overlay, modal, orchestrator]);
}
