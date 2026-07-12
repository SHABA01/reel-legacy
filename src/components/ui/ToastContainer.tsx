/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Loader2, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-cinema-ai shrink-0" />,
    loading: <Loader2 className="w-5 h-5 text-cinema-amber-500 animate-spin shrink-0" />,
  };

  const ringColors = {
    success: 'border-emerald-100 dark:border-emerald-950/30',
    warning: 'border-amber-100 dark:border-amber-950/30',
    error: 'border-red-100 dark:border-red-950/30',
    info: 'border-indigo-100 dark:border-indigo-950/30',
    loading: 'border-cinema-amber-100/40 dark:border-cinema-amber-950/20',
  };

  return (
    <div
      id="toast-notifications-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            layout
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto w-full bg-white dark:bg-cinema-slate-900 border ${
              ringColors[toast.type]
            } p-4 rounded-xl shadow-2xl flex gap-3 items-start relative overflow-hidden`}
          >
            {/* Left status icon */}
            <div id={`toast-${toast.id}-icon`}>
              {icons[toast.type]}
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0" id={`toast-${toast.id}-content`}>
              <p
                id={`toast-${toast.id}-message`}
                className="text-xs font-semibold text-cinema-slate-900 dark:text-white leading-normal"
              >
                {toast.message}
              </p>
              {toast.description && (
                <p
                  id={`toast-${toast.id}-desc`}
                  className="text-[11px] text-cinema-slate-500 dark:text-cinema-slate-400 mt-1 leading-relaxed"
                >
                  {toast.description}
                </p>
              )}
            </div>

            {/* Manual Dismiss */}
            <button
              id={`toast-${toast.id}-dismiss-btn`}
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded text-cinema-slate-400 hover:text-cinema-slate-600 dark:text-cinema-slate-500 dark:hover:text-cinema-slate-300 transition-colors custom-focus shrink-0 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
