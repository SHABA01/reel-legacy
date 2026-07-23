/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOverlay } from '../../context/OverlayContext';
import { ActiveView } from '../../types';
import { useNavigate } from 'react-router-dom';
import { persistenceService } from '../../storage';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  History,
  Image,
  Mic,
  LayoutTemplate,
  Film,
  BarChart3,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<any>;
  category: 'home' | 'storytelling' | 'assets' | 'production' | 'system';
}

export function Sidebar() {
  const {
    activeView,
    sidebarExpanded,
    toggleSidebar,
  } = useOverlay();

  const navigate = useNavigate();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [counts, setCounts] = useState({
    stories: 0,
    profiles: 0,
    timeline: 0,
    media: 0,
    notifications: 0,
  });

  const updateCounts = async () => {
    try {
      const [allStories, allProfiles, timelineCount, mediaCount, unreadNotifs] = await Promise.all([
        persistenceService.stories.getAll(),
        persistenceService.profiles.getAll(),
        persistenceService.timeline.count(),
        persistenceService.media.count(),
        persistenceService.notifications.getUnread().then(notifs => notifs.filter(n => !n.read).length).catch(() => 0)
      ]);
      const activeStoriesCount = allStories.filter(s => s.status !== 'Archived').length;
      const activeProfilesCount = allProfiles.filter((p: any) => p.status !== 'archived').length;

      setCounts({
        stories: activeStoriesCount,
        profiles: activeProfilesCount,
        timeline: timelineCount,
        media: mediaCount,
        notifications: unreadNotifs,
      });
    } catch (err) {
      console.warn('Error fetching sidebar counts:', err);
    }
  };

  useEffect(() => {
    updateCounts();

    const handleUpdate = () => {
      updateCounts();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('storage-activity-updated', handleUpdate);
    window.addEventListener('reellegacy-data-changed', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('storage-activity-updated', handleUpdate);
      window.removeEventListener('reellegacy-data-changed', handleUpdate);
    };
  }, [activeView]);

  const viewPaths: Record<ActiveView, string> = {
    dashboard: '/workspace/dashboard',
    profiles: '/workspace/legacy-profiles',
    stories: '/workspace/story-library',
    studio: '/workspace/story-studio',
    timeline: '/workspace/story-studio',
    media: '/workspace/media-library',
    narration: '/workspace/narration-studio',
    templates: '/workspace/story-templates',
    render: '/workspace/render-queue',
    analytics: '/workspace/studio-analytics',
    integrations: '/workspace/integrations',
    settings: '/workspace/settings',
    search: '/workspace/search',
    notifications: '/workspace/notifications',
    help: '/workspace/help',
  };

  const navigationItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'home' },
    { id: 'profiles', label: 'Legacy Profiles', icon: Users, category: 'storytelling' },
    { id: 'stories', label: 'Story Library', icon: BookOpen, category: 'storytelling' },
    { id: 'studio', label: 'Story Studio', icon: Film, category: 'storytelling' },
    { id: 'media', label: 'Media Library', icon: Image, category: 'assets' },
    { id: 'narration', label: 'Narration Studio', icon: Mic, category: 'assets' },
    { id: 'templates', label: 'Story Templates', icon: LayoutTemplate, category: 'production' },
    { id: 'render', label: 'Render Queue', icon: Film, category: 'production' },
    { id: 'analytics', label: 'Studio Analytics', icon: BarChart3, category: 'system' },
    { id: 'integrations', label: 'Integrations', icon: Link2, category: 'system' },
    { id: 'search', label: 'Global Search', icon: Search, category: 'system' },
    { id: 'notifications', label: 'Notifications', icon: Bell, category: 'system' },
    { id: 'help', label: 'Help Center', icon: HelpCircle, category: 'system' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'system' },
  ];

  const categories = {
    home: 'Overview',
    storytelling: 'Memoirs & Scripts',
    assets: 'Assets shelf',
    production: 'Production',
    system: 'Preferences',
  };

  const handleNavigate = (view: ActiveView) => {
    navigate(viewPaths[view]);
  };

  const handleKeyDown = (e: React.KeyboardEvent, view: ActiveView) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate(view);
    }
  };

  return (
    <aside
      id="app-sidebar"
      className={`relative h-screen flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 z-30 shrink-0 ${
        sidebarExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div 
        id="sidebar-header" 
        className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0 relative overflow-hidden"
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
      >
        {/* Expanded Header State */}
        <div 
          className={`flex items-center gap-2.5 min-w-0 transition-all duration-300 ${
            sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-logo-tile-bg flex items-center justify-center shadow-sm shrink-0">
            <Film className="w-4 h-4 text-cinema-amber-500" />
          </div>
          <span className="font-display font-bold text-base tracking-tight truncate text-sidebar-foreground">
            Reel<span className="text-cinema-amber-500">Legacy</span>
          </span>
        </div>

        {/* Collapse button */}
        <button
          id="sidebar-collapse-btn"
          onClick={toggleSidebar}
          className={`absolute right-4 p-1.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 cursor-pointer shrink-0 ${
            sidebarExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
          }`}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Collapsed Header State with Dynamic hover */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            sidebarExpanded ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <button
            id="sidebar-logo-expand-trigger"
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-xl bg-logo-tile-bg flex items-center justify-center shadow-md cursor-pointer transition-all duration-200 hover:scale-105"
            aria-label="Expand sidebar"
          >
            {isLogoHovered ? (
              <ChevronRight className="w-5 h-5 text-cinema-amber-500 animate-pulse" />
            ) : (
              <Film className="w-5 h-5 text-cinema-amber-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation list */}
      <div id="sidebar-nav" className="flex-1 overflow-y-auto scrollbar-ephemeral px-4 py-6 space-y-6">
        {(Object.keys(categories) as Array<keyof typeof categories>).map((catKey) => {
          const itemsInCat = navigationItems.filter((item) => item.category === catKey);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={catKey} id={`sidebar-category-${catKey}`} className="space-y-1">
              <span
                id={`sidebar-category-${catKey}-header`}
                className={`px-3 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40 block transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  sidebarExpanded ? 'opacity-100 h-4 mt-2 mb-1' : 'opacity-0 h-0 mt-0 mb-0 pointer-events-none'
                }`}
              >
                {categories[catKey]}
              </span>
              <div className="flex flex-col gap-0.5" id={`sidebar-list-${catKey}`}>
                {itemsInCat.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`sidebar-item-${item.id}`}
                      onClick={() => handleNavigate(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group custom-focus cursor-pointer ${
                        isActive
                          ? 'bg-cinema-amber-500 text-cinema-slate-950 font-semibold shadow-sm shadow-amber-500/10'
                          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active Indicator Slide pill */}
                      {isActive && (
                        <motion.div
                          layoutId="active-sidebar-indicator"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-sidebar-foreground rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      <Icon
                        id={`sidebar-item-${item.id}-icon`}
                        className={`w-4.5 h-4.5 shrink-0 transition-transform duration-250 ${
                          isActive
                            ? 'text-cinema-slate-950 scale-105'
                            : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                        }`}
                      />

                      <span 
                        id={`sidebar-item-${item.id}-label`} 
                        className={`truncate transition-all duration-300 origin-left whitespace-nowrap ${
                          sidebarExpanded ? 'opacity-100 max-w-[150px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-4 pointer-events-none'
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Real-time Entity Counts Badge */}
                      {sidebarExpanded && counts[item.id as keyof typeof counts] !== undefined && counts[item.id as keyof typeof counts] > 0 && (
                        <span 
                          id={`sidebar-count-badge-${item.id}`}
                          className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md leading-none ${
                            isActive 
                              ? 'bg-cinema-slate-950 text-cinema-amber-500' 
                              : 'bg-muted-foreground/15 text-muted-foreground'
                          }`}
                        >
                          {counts[item.id as keyof typeof counts] > 999 ? '999+' : counts[item.id as keyof typeof counts]}
                        </span>
                      )}

                      {/* Collapsed notification dot */}
                      {!sidebarExpanded && counts[item.id as keyof typeof counts] !== undefined && counts[item.id as keyof typeof counts] > 0 && (
                        <span 
                          id={`sidebar-collapsed-dot-${item.id}`}
                          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cinema-amber-500" 
                        />
                      )}

                      {/* Tooltip on collapsed state */}
                      {!sidebarExpanded && (
                        <div
                          id={`sidebar-item-${item.id}-tooltip`}
                          className="absolute left-16 scale-0 group-hover:scale-100 bg-sidebar-primary text-sidebar-primary-foreground text-xs px-2.5 py-1.5 rounded-lg shadow-lg transition-transform duration-150 origin-left z-50 pointer-events-none font-semibold whitespace-nowrap"
                        >
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div id="sidebar-footer-container" className="border-t border-sidebar-border shrink-0 bg-sidebar/50 relative overflow-hidden h-20 transition-all duration-300">
        {/* Expanded Footer Overlay */}
        <div 
          className={`absolute inset-0 p-4 space-y-1.5 flex flex-col justify-center transition-all duration-300 ${
            sidebarExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between w-full text-xs font-semibold text-sidebar-foreground/80">
            <span className="font-display">ReelLegacy</span>
            <span className="font-mono text-[9px] text-sidebar-foreground/50 bg-sidebar-accent px-1.5 py-0.5 rounded">v0.1.0</span>
          </div>
          <div id="early-access-badge-container" className="flex items-center justify-between w-full">
            <span className="inline-flex items-center text-[9px] uppercase tracking-wider font-bold text-cinema-amber-700 dark:text-cinema-amber-400 bg-cinema-amber-500/15 dark:bg-cinema-amber-500/10 px-2 py-0.5 rounded-full border border-cinema-amber-500/30 dark:border-cinema-amber-500/20">
              Early Access
            </span>
            <span className="text-[9px] text-sidebar-foreground/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Engine Online
            </span>
          </div>
        </div>

        {/* Collapsed Footer Overlay */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            sidebarExpanded ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Studio Engine Online" />
            <span className="font-mono text-[9px] text-sidebar-foreground/45 bg-sidebar-accent px-2 py-0.5 rounded">v0.1</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
