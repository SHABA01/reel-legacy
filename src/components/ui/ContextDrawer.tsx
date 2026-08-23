/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  children: React.ReactNode;
  widthClass?: string; // default w-full sm:w-[420px] md:w-[460px]
  ariaLabel?: string;
}

export function ContextDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  icon,
  headerActions,
  footerActions,
  children,
  widthClass = 'w-full sm:w-[420px] md:w-[460px]',
  ariaLabel = 'Details Drawer',
}: ContextDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" aria-label={ariaLabel}>
          {/* Backdrop with click-outside dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative z-10 ${widthClass} h-full bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col overflow-hidden`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between shrink-0 gap-3 bg-muted/20">
              <div className="flex items-center gap-2.5 min-w-0">
                {icon && <span className="text-cinema-amber-500 shrink-0">{icon}</span>}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold text-foreground truncate tracking-tight">
                      {title}
                    </h3>
                    {badge && (
                      <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20 shrink-0">
                        {badge}
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-sans">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {headerActions}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {children}
            </div>

            {/* Optional Footer */}
            {footerActions && (
              <div className="px-5 py-3.5 border-t border-border/80 bg-muted/30 shrink-0 flex items-center justify-between gap-3">
                {footerActions}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
