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

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
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
            className="flex-1 overflow-y-auto scrollbar-ephemeral bg-background/30 p-4 md:p-6 lg:p-8 flex flex-col gap-6"
          >
            {/* Active View Injector */}
            <div id="active-view-wrapper" className="flex-1 flex flex-col min-h-0 w-full max-w-7xl mx-auto">
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
