/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOverlay } from '../../context/OverlayContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  Film,
  Search,
  Plus,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Laptop,
  User,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const {
    activeView,
    toggleOverlay,
    toggleSidebar,
    sidebarExpanded,
    activeOverlay,
    activeModalId,
  } = useOverlay();

  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { showToast } = useToast();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isSearchDisabled = activeModalId !== null || (activeOverlay !== null && activeOverlay !== 'search');
  const isAIDisabled = activeModalId !== null || (activeOverlay !== null && activeOverlay !== 'ai');
  const isNotificationsDisabled = activeModalId !== null || (activeOverlay !== null && activeOverlay !== 'notifications');

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Studio Dashboard';
      case 'stories':
        return 'Story Library';
      case 'profiles':
        return 'Legacy Profiles';
      case 'timeline':
        return 'Timeline Chronology';
      case 'media':
        return 'Media Library';
      case 'narration':
        return 'Narration Studio';
      case 'templates':
        return 'Story Templates';
      case 'render':
        return 'Render Queue';
      case 'analytics':
        return 'Studio Analytics';
      case 'integrations':
        return 'Integrations';
      case 'settings':
        return 'System Settings';
      default:
        return 'ReelLegacy Studio';
    }
  };

  const handleQuickCreate = () => {
    showToast('info', 'Opening Quick Creator Wizard', 'Ready to map out another cinematic chapter draft.');
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 h-16 w-full border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6"
    >
      {/* Left side: Page Title */}
      <div id="header-left" className="flex items-center gap-4 min-w-0">
        {/* Current Page Title */}
        <h1
          id="header-page-title"
          className="font-display font-bold text-base md:text-lg text-foreground truncate"
        >
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Triggers, Search, Themes, Account */}
      <div id="header-right" className="flex items-center gap-2.5">
        {/* Global Search Trigger */}
        <button
          id="trigger-search-btn"
          disabled={isSearchDisabled}
          onClick={(e) => {
            if (isSearchDisabled) return;
            e.stopPropagation();
            e.preventDefault();
            toggleOverlay('search');
          }}
          className={`p-2 rounded-lg transition-colors custom-focus cursor-pointer ${
            isSearchDisabled
              ? 'opacity-40 cursor-not-allowed pointer-events-none text-muted-foreground/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          aria-label="Open global search panel"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* AI Assistant Trigger */}
        <button
          id="trigger-ai-btn"
          disabled={isAIDisabled}
          onClick={(e) => {
            if (isAIDisabled) return;
            e.stopPropagation();
            e.preventDefault();
            toggleOverlay('ai');
          }}
          className={`p-2 rounded-lg transition-colors custom-focus cursor-pointer relative ${
            isAIDisabled
              ? 'opacity-40 cursor-not-allowed pointer-events-none text-cinema-ai/40'
              : 'text-cinema-ai hover:text-indigo-600 hover:bg-cinema-ai/5 dark:text-cinema-ai dark:hover:text-indigo-400 dark:hover:bg-cinema-ai/10'
          }`}
          aria-label="Open AI Director sidebar"
        >
          <Sparkles className="w-5 h-5" />
          {!isAIDisabled && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cinema-ai rounded-full animate-ping" />
          )}
        </button>

        {/* Notification bell trigger */}
        <button
          id="trigger-notifications-btn"
          disabled={isNotificationsDisabled}
          onClick={(e) => {
            if (isNotificationsDisabled) return;
            e.stopPropagation();
            e.preventDefault();
            toggleOverlay('notifications');
          }}
          className={`p-2 rounded-lg transition-colors custom-focus cursor-pointer relative ${
            isNotificationsDisabled
              ? 'opacity-40 cursor-not-allowed pointer-events-none text-muted-foreground/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          aria-label="Open Notifications Center"
        >
          <Bell className="w-5 h-5" />
          {!isNotificationsDisabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cinema-amber-500 rounded-full border border-white dark:border-cinema-slate-900" />
          )}
        </button>

        {/* Theme Toggle Button & Dropdown */}
        <div id="theme-toggle-container" className="relative">
          <button
            id="theme-menu-trigger"
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors custom-focus cursor-pointer"
            aria-label="Select color theme preference"
          >
            {theme === 'system' ? (
              <Laptop className="w-5 h-5" />
            ) : theme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {themeMenuOpen && (
              <>
                {/* Backdrop closer */}
                <div id="theme-menu-backdrop" className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)} />
                <motion.div
                  id="theme-dropdown-menu"
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-1 w-36 bg-white dark:bg-cinema-slate-900 border border-cinema-slate-100 dark:border-cinema-slate-800 rounded-xl shadow-xl z-50 p-1.5"
                >
                  <button
                    id="theme-opt-light"
                    onClick={(e) => {
                      setTheme('light', e);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-cinema-slate-50 text-cinema-amber-500 dark:bg-cinema-slate-850'
                        : 'text-cinema-slate-600 dark:text-cinema-slate-400 hover:bg-cinema-slate-50 dark:hover:bg-cinema-slate-850'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light Mode
                  </button>
                  <button
                    id="theme-opt-dark"
                    onClick={(e) => {
                      setTheme('dark', e);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-cinema-slate-50 text-cinema-amber-500 dark:bg-cinema-slate-850'
                        : 'text-cinema-slate-600 dark:text-cinema-slate-400 hover:bg-cinema-slate-50 dark:hover:bg-cinema-slate-850'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark Mode
                  </button>
                  <button
                    id="theme-opt-system"
                    onClick={(e) => {
                      setTheme('system', e);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'system'
                        ? 'bg-cinema-slate-50 text-cinema-amber-500 dark:bg-cinema-slate-850'
                        : 'text-cinema-slate-600 dark:text-cinema-slate-400 hover:bg-cinema-slate-50 dark:hover:bg-cinema-slate-850'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" /> System Mode
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Dropdown */}
        <div id="user-menu-container" className="relative">
          <button
            id="user-menu-trigger"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors custom-focus cursor-pointer"
            aria-label="Open Account settings menu"
          >
            <div className="w-6 h-6 rounded-full bg-cinema-amber-100 text-cinema-amber-600 flex items-center justify-center font-display font-bold text-xs select-none shrink-0 border border-cinema-amber-200/50">
              PS
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <>
                {/* Backdrop closer */}
                <div id="user-menu-backdrop" className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <motion.div
                  id="user-dropdown-menu"
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-50 p-1.5 flex flex-col text-card-foreground"
                >
                  <div className="px-2.5 py-2 border-b border-border mb-1" id="user-info-snippet">
                    <p className="text-xs font-semibold text-foreground">Philip Shaba</p>
                    <p className="text-[10px] text-muted-foreground truncate">PhilShaba96@gmail.com</p>
                  </div>
                  <button
                    id="user-opt-profile"
                    onClick={() => {
                      showToast('info', 'Viewing Account Profile Settings');
                      setUserMenuOpen(false);
                      navigate('/workspace/settings/my-profile');
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-foreground/80 hover:bg-muted rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" /> My Profile
                  </button>
                  <button
                    id="user-opt-logout"
                    onClick={() => {
                      showToast('warning', 'Session termination requested', 'Logging out safely.');
                      setUserMenuOpen(false);
                      localStorage.removeItem('rl_authenticated');
                      window.location.href = '/';
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
