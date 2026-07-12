/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right' | 'bottom';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
  size = 'md',
  id,
}: DrawerProps) {
  const generatedId = id || `drawer-${Math.random().toString(36).substring(2, 9)}`;

  const openTimeRef = React.useRef<number>(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      openTimeRef.current = Date.now();
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: position === 'bottom' ? 'h-[30vh]' : 'w-72',
    md: position === 'bottom' ? 'h-[50vh]' : 'w-96 md:w-[450px]',
    lg: position === 'bottom' ? 'h-[75vh]' : 'w-96 md:w-[600px]',
    xl: position === 'bottom' ? 'h-[90vh]' : 'w-screen md:w-[800px]',
  };

  const animationVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 bottom-0 h-full border-r';
      case 'bottom':
        return 'bottom-0 left-0 right-0 w-full border-t';
      case 'right':
      default:
        return 'right-0 top-0 bottom-0 h-full border-l';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id={`${generatedId}-overlay`}
          className="fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <motion.div
            id={`${generatedId}-backdrop`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (Date.now() - openTimeRef.current > 150) {
                onClose();
              }
            }}
            className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            id={generatedId}
            variants={animationVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className={`fixed bg-card text-foreground shadow-2xl flex flex-col z-10 border-border ${getPositionClasses()} ${sizes[size]}`}
          >
            {/* Header */}
            <div
              id={`${generatedId}-header`}
              className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0"
            >
              {title ? (
                <h3
                  id={`${generatedId}-title`}
                  className="font-display text-base font-semibold tracking-tight text-foreground"
                >
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                id={`${generatedId}-close-button`}
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors custom-focus"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div
              id={`${generatedId}-body`}
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
