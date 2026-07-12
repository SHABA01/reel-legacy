/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftElement, rightElement, className = '', id, ...props }, ref) => {
    const generatedId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5" id={`${generatedId}-container`}>
        {label && (
          <label
            id={`${generatedId}-label`}
            htmlFor={generatedId}
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full" id={`${generatedId}-wrapper`}>
          {leftElement && (
            <div
              id={`${generatedId}-left-element`}
              className="absolute left-3 text-muted-foreground flex items-center justify-center"
            >
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={generatedId}
            className={`w-full bg-card border text-sm font-sans rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cinema-amber-500 focus:border-transparent ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border'
            } ${leftElement ? 'pl-10' : 'pl-3.5'} ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 text-foreground placeholder-muted-foreground/60 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightElement && (
            <div
              id={`${generatedId}-right-element`}
              className="absolute right-3 text-muted-foreground flex items-center justify-center"
            >
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${generatedId}-error`} className="text-xs text-red-500 font-sans mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${generatedId}-helper`} className="text-xs text-muted-foreground font-sans mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
