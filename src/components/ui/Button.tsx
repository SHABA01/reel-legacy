/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ai' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Generate an ID if not provided to respect HTML ID attribute guidelines
    const generatedId = id || `btn-${variant}-${Math.random().toString(36).substring(2, 9)}`;

    // Semantic colors based on theme
    const baseStyle =
      'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinema-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary:
        'bg-cinema-slate-900 text-white hover:bg-cinema-slate-800 dark:bg-cinema-slate-100 dark:text-cinema-slate-950 dark:hover:bg-cinema-slate-200 border border-transparent',
      secondary:
        'bg-cinema-slate-100 text-cinema-slate-800 hover:bg-cinema-slate-200 dark:bg-cinema-slate-800 dark:text-cinema-slate-200 dark:hover:bg-cinema-slate-700 border border-transparent',
      accent:
        'bg-cinema-amber-500 text-cinema-slate-950 hover:bg-cinema-amber-600 font-semibold shadow-sm border border-transparent',
      ai: 'bg-gradient-to-r from-cinema-ai to-purple-600 text-white hover:opacity-95 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-transparent font-medium',
      danger:
        'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent',
      ghost:
        'bg-transparent text-cinema-slate-600 hover:bg-cinema-slate-100 dark:text-cinema-slate-300 dark:hover:bg-cinema-slate-800/60 border border-transparent',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3 text-base',
    };

    const currentVariant = variants[variant] || variants.primary;
    const currentSize = sizes[size] || sizes.md;

    return (
      <motion.button
        ref={ref}
        id={generatedId}
        disabled={disabled || isLoading}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`${baseStyle} ${currentVariant} ${currentSize} ${className}`}
        {...props}
      >
        {isLoading && (
          <Loader2 id={`${generatedId}-spinner`} className="w-4 h-4 mr-2 animate-spin shrink-0" />
        )}
        {!isLoading && leftIcon && (
          <span id={`${generatedId}-left-icon`} className="mr-2 shrink-0">
            {leftIcon}
          </span>
        )}
        <span id={`${generatedId}-text`}>{children}</span>
        {!isLoading && rightIcon && (
          <span id={`${generatedId}-right-icon`} className="ml-2 shrink-0">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
