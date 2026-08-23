/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ViewModeTransitionProps {
  viewMode: 'grid' | 'list';
  children: React.ReactNode;
  className?: string;
}

/**
 * Standardized motion wrapper for smooth Grid <-> List view transitions.
 * Preserves page-specific column schemas, table headers, and item layouts
 * while applying uniform, performant layout animation physics.
 */
export function ViewModeTransition({
  viewMode,
  children,
  className = '',
}: ViewModeTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
