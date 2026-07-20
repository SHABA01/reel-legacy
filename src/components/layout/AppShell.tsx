/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RightUtilityPanel } from './RightUtilityPanel';
import { SearchOverlay } from '../overlays/SearchOverlay';
import { AIAssistantOverlay } from '../overlays/AIAssistantOverlay';
import { NotificationOverlay } from '../overlays/NotificationOverlay';
import { ToastContainer } from '../ui/ToastContainer';
import { useOverlay } from '../../context/OverlayContext';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarExpanded, rightPanelOpen } = useOverlay();
  
  // Detect collapsed states
  const isBothCollapsed = !sidebarExpanded && !rightPanelOpen;
  const isSidebarCollapsed = !sidebarExpanded;

  return (
    <div id="reellegacy-app-root" className="h-screen w-screen overflow-hidden flex font-sans bg-background text-foreground animate-fade-in">
      {/* Full-Height Navigation Sidebar */}
      <Sidebar />

      {/* Right Content Space: Header + Main Viewport */}
      <div id="app-main-layout" className="flex flex-col flex-1 h-screen overflow-hidden min-w-0">
        {/* Top Header */}
        <Header />

        {/* Workspace body */}
        <div id="workspace-container" className="flex flex-1 min-h-0 w-full relative">
          {/* Dynamic content viewport */}
          <main
            id="workspace-viewport"
            className={`flex-1 overflow-y-auto scrollbar-ephemeral bg-background/30 flex flex-col gap-6 transition-all duration-300 ${
              isBothCollapsed
                ? 'px-1.5 pb-1.5 pt-0 md:px-2 md:pb-2 md:pt-0 lg:px-3 lg:pb-4 lg:pt-0'
                : isSidebarCollapsed
                ? 'px-2 pb-2 pt-0 md:px-3 md:pb-3 md:pt-0 lg:px-4 lg:pb-4.5 lg:pt-0'
                : 'px-2.5 pb-2.5 pt-0 md:px-4 md:pb-4 md:pt-0 lg:px-5 lg:pb-5 lg:pt-0'
            }`}
          >
            {/* Active View Injector */}
            <div
              id="active-view-wrapper"
              className={`flex-1 flex flex-col min-h-0 w-full mx-auto transition-all duration-300 ${
                isBothCollapsed
                  ? 'max-w-[1760px]'
                  : 'max-w-[1440px]'
              }`}
            >
              {children}
            </div>
          </main>

          {/* Right utility panel */}
          <RightUtilityPanel />
        </div>
      </div>

      {/* Global Overlays */}
      <SearchOverlay />
      <AIAssistantOverlay />
      <NotificationOverlay />

      {/* Global Toast Banner Queue */}
      <ToastContainer />
    </div>
  );
}
