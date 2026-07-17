/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, Sparkles, BookOpen, User, Image, ArrowRight, X, Sparkle } from 'lucide-react';
import { useOverlay } from '../../context/OverlayContext';

export function SearchOverlay() {
  const { activeOverlay, closeOverlay, setActiveView } = useOverlay();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = activeOverlay === 'search';

  const openTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeOverlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOverlay]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Date.now() - openTimeRef.current > 150) {
      closeOverlay();
    }
  };

  const recentSearches = [
    'Family archive 1984',
    'Grandpa Bob military timeline',
    'Voiceover audio track scene 2',
  ];

  const suggestedActions = [
    { label: 'Create New Story Profile', icon: BookOpen, color: 'text-amber-500' },
    { label: 'Synthesize Narration Audio', icon: Sparkles, color: 'text-indigo-500' },
    { label: 'Optimize Rendering Queue', icon: Sparkle, color: 'text-emerald-500' },
  ];

  const sampleResults = [
    { type: 'story', title: 'The Silver Lining of 1972', subtitle: 'Biographical Memoir', icon: BookOpen },
    { type: 'profile', title: 'Elizabeth Vance', subtitle: 'Matriarch of the Vance Clan', icon: User },
    { type: 'media', title: 'wedding_portrait_vintage.jpg', subtitle: 'Photo Shelf - Restored High-Res', icon: Image },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="search-overlay-container" className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            id="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Command Palette Card */}
          <motion.div
            id="search-palette"
            initial={{ opacity: 0, scale: 0.97, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-10 flex flex-col max-h-[80vh] text-foreground"
          >
            {/* Header Input */}
            <div id="search-input-wrapper" className="flex items-center px-5 py-4 border-b border-border shrink-0">
              <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
              <input
                ref={inputRef}
                id="search-main-input"
                type="text"
                placeholder="Search stories, legacy profiles, raw media, actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-sm md:text-base text-foreground placeholder-muted-foreground font-sans"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 h-5 select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground mr-3">
                ESC
              </kbd>
              <button
                id="search-close-btn"
                onClick={closeOverlay}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors custom-focus"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div id="search-body" className="flex-1 overflow-y-auto scrollbar-ephemeral p-5 space-y-6">
              {/* Option to Navigate to Advanced Search */}
              <button
                id="search-advanced-link"
                onClick={() => {
                  closeOverlay();
                  setActiveView('search');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-cinema-amber-500/20 bg-cinema-amber-500/5 hover:bg-cinema-amber-500/10 text-cinema-amber-500 transition-colors cursor-pointer text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cinema-amber-500" />
                  <span>Looking for deep filters? Open Advanced Search Page</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cinema-amber-500/80">Open Page</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {query.length === 0 ? (
                <>
                  {/* Recent Searches */}
                  <div id="recent-searches-section" className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </h4>
                    <div className="flex flex-col gap-1" id="recent-list">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          id={`recent-search-${idx}`}
                          onClick={() => setQuery(search)}
                          className="flex items-center text-left text-sm text-foreground/80 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  <div id="suggested-actions-section" className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Suggested Actions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="suggested-grid">
                      {suggestedActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={idx}
                            id={`suggested-action-${idx}`}
                            className="flex items-center text-left text-sm text-foreground/85 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer"
                          >
                            <Icon className={`w-4 h-4 mr-2.5 shrink-0 ${action.color}`} />
                            <span className="truncate">{action.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Dynamic Filtered Placeholder Results */
                <div id="filtered-results-section" className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Found Records
                  </h4>
                  <div className="flex flex-col gap-1" id="filtered-list">
                    {sampleResults
                      .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
                      .map((result, idx) => {
                        const Icon = result.icon;
                        return (
                          <button
                            key={idx}
                            id={`search-result-${idx}`}
                            className="flex items-center justify-between text-left text-sm text-foreground/85 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center min-w-0" id={`search-result-${idx}-info`}>
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3 text-muted-foreground group-hover:text-cinema-amber-500 group-hover:bg-cinema-amber-500/10 border border-border transition-all shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0" id={`search-result-${idx}-titles`}>
                                <p className="font-semibold text-foreground truncate">{result.title}</p>
                                <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-cinema-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        );
                      })}

                    {sampleResults.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                      <div className="py-8 text-center" id="search-not-found">
                        <p className="text-sm text-muted-foreground">
                          No matches for "{query}". Try another search term.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Guidance */}
            <div id="search-footer" className="px-5 py-3 border-t border-border bg-muted/40 text-xs text-muted-foreground shrink-0 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cinema-ai" /> Future AI DeepSearch is active
              </span>
              <span>Use ↑↓ keys to select, ↵ to navigate</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
