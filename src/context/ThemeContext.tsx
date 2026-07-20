/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode, event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reellegacy-theme') as ThemeMode;
      return saved || 'light';
    }
    return 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reellegacy-theme') as ThemeMode;
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
      if (saved === 'system' || !saved) {
        try {
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          return systemDark ? 'dark' : 'light';
        } catch (e) {
          return 'light';
        }
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      let activeTheme: 'light' | 'dark' = 'light';

      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeTheme = systemDark ? 'dark' : 'light';
      } else {
        activeTheme = theme === 'dark' ? 'dark' : 'light';
      }

      setResolvedTheme(activeTheme);

      if (activeTheme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();
    localStorage.setItem('reellegacy-theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  useEffect(() => {
    // Enable transitions after initial mount & paint
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transitions');
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const setTheme = (newTheme: ThemeMode, event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => {
    // Determine target resolved theme
    let targetResolved: 'light' | 'dark' = 'light';
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      targetResolved = systemDark ? 'dark' : 'light';
    } else {
      targetResolved = newTheme === 'dark' ? 'dark' : 'light';
    }

    const isThemeChanged = targetResolved !== resolvedTheme;

    if (isThemeChanged && typeof document !== 'undefined' && (document as any).startViewTransition) {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event) {
        x = event.clientX;
        y = event.clientY;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const root = document.documentElement;
      root.style.setProperty('--theme-ripple-x', `${x}px`);
      root.style.setProperty('--theme-ripple-y', `${y}px`);
      root.style.setProperty('--theme-ripple-radius', `${endRadius}px`);

      // Temporarily disable all normal transition states so only the snapshot transition is visible
      root.classList.add('no-transitions');

      (document as any).startViewTransition(() => {
        if (targetResolved === 'dark') {
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }

        setThemeState(newTheme);
        setResolvedTheme(targetResolved);
        localStorage.setItem('reellegacy-theme', newTheme);
      });

      // Safely re-enable transition rules
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.remove('no-transitions');
        });
      });
    } else {
      const root = document.documentElement;
      if (isThemeChanged) {
        root.classList.add('no-transitions');
      }

      if (targetResolved === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      setThemeState(newTheme);
      setResolvedTheme(targetResolved);
      localStorage.setItem('reellegacy-theme', newTheme);

      if (isThemeChanged) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            root.classList.remove('no-transitions');
          });
        });
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
