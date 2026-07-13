/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sun, Moon, Laptop, Film, Sparkles, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export function Navbar({ currentPage, setCurrentPage, onOpenAuth }: NavbarProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const toggleTheme = (e: React.MouseEvent) => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, e);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'story-types', label: 'Story Types' },
    { id: 'about', label: 'About' },
    { id: 'help', label: 'Help Center' },
    { id: 'contact', label: 'Contact' },
    { id: 'faq', label: 'FAQs' },
  ];

  const handleLinkClick = (id: string) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getThemeItemClass = (itemTheme: string) => {
    const isActive = theme === itemTheme;
    const base = "w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-left transition-all duration-200 cursor-pointer border";
    
    if (resolvedTheme === 'light') {
      if (isActive) {
        return `${base} border-cinema-amber-500/20 bg-cinema-amber-500/10 text-cinema-amber-500`;
      } else {
        return `${base} border-transparent text-black hover:bg-cinema-amber-500/10 hover:border-cinema-amber-500/20 hover:text-cinema-amber-500`;
      }
    } else {
      // dark mode
      if (isActive) {
        return `${base} border-cinema-amber-500/20 bg-cinema-amber-500/10 text-cinema-amber-500`;
      } else {
        return `${base} border-transparent text-cinema-slate-400 hover:bg-cinema-amber-500/10 hover:border-cinema-amber-500/20 hover:text-cinema-amber-500`;
      }
    }
  };

  return (
    <>
      <header
        id="public-navbar"
        className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLinkClick('home')}
              className="group flex items-center gap-2 text-left cursor-pointer"
              id="nav-logo-btn"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-logo-tile-bg transition-all group-hover:scale-105 shadow-sm">
                <Film className="h-5 w-5 text-cinema-amber-500 animate-spin-slow" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Reel<span className="text-cinema-amber-500">Legacy</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2" id="desktop-nav-links">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-cinema-amber-500 bg-cinema-amber-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute bottom-1 left-3 right-3 h-0.5 bg-cinema-amber-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3" id="desktop-actions">
            {/* Theme Dropdown Menu */}
            <div id="desktop-theme-container" className="relative inline-block">
              <button
                id="desktop-theme-trigger"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors custom-focus cursor-pointer"
                aria-label="Select color theme preference"
              >
                {theme === 'system' ? (
                  <Laptop className="h-4.5 w-4.5 text-cinema-amber-500" />
                ) : theme === 'dark' ? (
                  <Moon className="h-4.5 w-4.5 text-cinema-amber-500" />
                ) : (
                  <Sun className="h-4.5 w-4.5 text-cinema-amber-500" />
                )}
              </button>

              <AnimatePresence>
                {themeMenuOpen && (
                  <>
                    {/* Backdrop closer */}
                    <div id="public-theme-backdrop" className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)} />
                    <motion.div
                      id="public-theme-dropdown"
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className={`absolute left-1/2 -translate-x-1/2 mt-1 w-36 rounded-xl shadow-xl z-50 p-1.5 border ${
                        resolvedTheme === 'light' 
                          ? 'bg-[#ffffff] border-neutral-200' 
                          : 'bg-cinema-slate-900 border-cinema-slate-800'
                      }`}
                    >
                      <button
                        id="theme-opt-light"
                        onClick={(e) => {
                          setTheme('light', e);
                          setThemeMenuOpen(false);
                        }}
                        className={getThemeItemClass('light')}
                      >
                        <Sun className="w-3.5 h-3.5" /> Light Mode
                      </button>
                      <button
                        id="theme-opt-dark"
                        onClick={(e) => {
                          setTheme('dark', e);
                          setThemeMenuOpen(false);
                        }}
                        className={getThemeItemClass('dark')}
                      >
                        <Moon className="w-3.5 h-3.5" /> Dark Mode
                      </button>
                      <button
                        id="theme-opt-system"
                        onClick={(e) => {
                          setTheme('system', e);
                          setThemeMenuOpen(false);
                        }}
                        className={getThemeItemClass('system')}
                      >
                        <Laptop className="w-3.5 h-3.5" /> System Mode
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <Button
                id="navbar-dashboard-btn"
                variant="accent"
                size="sm"
                onClick={() => navigate('/workspace/dashboard')}
                rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
                className="text-xs animate-fade-in"
              >
                Go to Studio
              </Button>
            ) : (
              <>
                <button
                  id="navbar-signin-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                >
                  Sign In
                </button>

                <Button
                  id="navbar-getstarted-btn"
                  variant="accent"
                  size="sm"
                  onClick={() => onOpenAuth('register')}
                  rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
                  className="text-xs"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions Overlay Trigger */}
          <div className="flex items-center gap-2 md:hidden" id="mobile-nav-triggers">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="mobile-theme-toggle"
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle visual theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4.5 w-4.5 text-cinema-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden" id="mobile-menu-drawer">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto bg-card px-6 py-6 border-l border-border shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-logo-tile-bg shadow-sm">
                      <Film className="h-4.5 w-4.5 text-cinema-amber-500 animate-spin-slow" />
                    </div>
                    <span className="font-display text-md font-bold text-foreground">
                      Reel<span className="text-cinema-amber-500">Legacy</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    id="close-mobile-menu-btn"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Links */}
                <nav className="flex flex-col space-y-1.5" id="mobile-nav-list">
                  {navLinks.map((link) => {
                    const isActive = currentPage === link.id;
                    return (
                      <button
                        key={link.id}
                        id={`mob-link-${link.id}`}
                        onClick={() => handleLinkClick(link.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'text-cinema-amber-500 bg-cinema-amber-500/10 border-l-3 border-cinema-amber-500'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        }`}
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Actions Bottom Section */}
              <div className="space-y-4 pt-6 border-t border-border/60">
                {isAuthenticated ? (
                  <Button
                    id="mobile-dashboard-btn"
                    variant="accent"
                    className="w-full justify-center text-sm font-semibold py-2.5 rounded-xl"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/workspace/dashboard');
                    }}
                    rightIcon={<ArrowUpRight className="h-4 w-4" />}
                  >
                    Go to Studio
                  </Button>
                ) : (
                  <>
                    <button
                      id="mobile-signin-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                    <Button
                      id="mobile-getstarted-btn"
                      variant="accent"
                      className="w-full justify-center text-sm font-semibold py-2.5 rounded-xl"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('register');
                      }}
                      rightIcon={<Sparkles className="h-4 w-4" />}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
