/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useOverlay } from '../../context/OverlayContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  children: React.ReactNode;
  id?: string;
}

export function Modal({ isOpen, onClose, title, size = 'md', children, id }: ModalProps) {
  const generatedId = React.useMemo(() => id || `modal-${Math.random().toString(36).substring(2, 9)}`, [id]);
  const { registerModalOpen, unregisterModalClose } = useOverlay();

  // Handle modal registration with central Overlay & Modal Manager
  useEffect(() => {
    if (isOpen) {
      const success = registerModalOpen(generatedId);
      if (!success) {
        // If registration fails because another modal or overlay is open, close this modal immediately
        onClose();
      }
    }
    return () => {
      if (isOpen) {
        unregisterModalClose(generatedId);
      }
    };
  }, [isOpen, generatedId, registerModalOpen, unregisterModalClose, onClose]);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md w-full',
    md: 'max-w-lg w-full',
    lg: 'max-w-2xl w-full',
    xl: 'max-w-5xl w-full',
    fullscreen: 'w-screen h-screen rounded-none m-0 max-w-none',
  };

  const isFullscreen = size === 'fullscreen';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id={`${generatedId}-overlay`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            id={`${generatedId}-backdrop`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal content */}
          <motion.div
            id={generatedId}
            initial={
              isFullscreen
                ? { opacity: 0, y: 15 }
                : { opacity: 0, scale: 0.95, y: 10 }
            }
            animate={
              isFullscreen
                ? { opacity: 1, y: 0 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              isFullscreen
                ? { opacity: 0, y: 15 }
                : { opacity: 0, scale: 0.95, y: 10 }
            }
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative bg-card text-card-foreground shadow-2xl rounded-xl overflow-hidden flex flex-col z-10 border border-border ${sizes[size]}`}
          >
            {/* Header */}
            <div
              id={`${generatedId}-header`}
              className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0"
            >
              {title ? (
                <h3
                  id={`${generatedId}-title`}
                  className="font-display text-lg font-semibold tracking-tight text-foreground"
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
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content area */}
            <div
              id={`${generatedId}-body`}
              className={`px-6 py-5 overflow-y-auto ${isFullscreen ? 'flex-1' : 'max-h-[75vh]'}`}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
