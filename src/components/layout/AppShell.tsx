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
            className="flex-1 overflow-y-auto bg-background/30 p-4 md:p-6 lg:p-8 flex flex-col gap-6"
          >
            {/* Active View Injector */}
            <div id="active-view-wrapper" className="flex-1 flex flex-col min-h-0 w-full max-w-7xl mx-auto">
              {children}
            </div>

            {/* Reusable Future-Ready Sticky Footer */}
            <footer
              id="workspace-footer"
              className="w-full max-w-7xl mx-auto border-t border-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground shrink-0"
            >
              <p id="footer-copyright">© 2026 ReelLegacy. Preserving human memory via generative cinema. All rights reserved.</p>
              <div id="footer-links" className="flex gap-4">
                <a href="#help" className="hover:text-cinema-amber-500 transition-colors">Workspace Rules</a>
                <a href="#privacy" className="hover:text-cinema-amber-500 transition-colors">Privacy Shield</a>
                <a href="#status" className="hover:text-cinema-amber-500 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Studio Engine Online
                </a>
              </div>
            </footer>
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
