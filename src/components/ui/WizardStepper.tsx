/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check } from 'lucide-react';

export interface WizardStep {
  number: number;
  title: string;
  description?: string;
}

interface WizardStepperProps {
  id: string;
  steps: WizardStep[];
  currentStep: number;
  variant?: 'vertical' | 'horizontal';
  className?: string;
}

export function WizardStepper({
  id,
  steps,
  currentStep,
  variant = 'horizontal',
  className = '',
}: WizardStepperProps) {
  const totalSteps = steps.length;
  const percentDone = Math.round((currentStep / totalSteps) * 100);

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`} id={id}>
        {steps.map((step) => {
          const isPassed = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="flex items-start gap-3 text-xs"
              id={`${id}-step-${step.number}`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all mt-0.5 shrink-0 ${
                  isPassed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isActive
                    ? 'bg-cinema-amber-500 border-cinema-amber-500 text-slate-950 font-black'
                    : 'border-muted-foreground/30 text-muted-foreground/60'
                }`}
              >
                {isPassed ? (
                  <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                ) : (
                  step.number
                )}
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-cinema-amber-500 font-bold'
                      : isPassed
                      ? 'text-foreground/70'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-[10px] text-muted-foreground/60 leading-tight">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (used in headers)
  return (
    <div
      className={`bg-muted/15 border-b border-border px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${className}`}
      id={id}
    >
      <div className="flex items-center gap-2 text-muted-foreground font-semibold font-mono text-[10px]">
        <span className="bg-cinema-amber-500/10 text-cinema-amber-500 px-2 py-0.5 rounded font-black border border-cinema-amber-500/20">
          STEP {currentStep} OF {totalSteps}
        </span>
        <span>•</span>
        <span className="text-foreground uppercase tracking-wider font-bold">
          {steps[currentStep - 1]?.title || ''}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full md:w-64">
        <div
          className="flex-grow h-2 bg-muted rounded-full overflow-hidden"
          id={`${id}-bar-container`}
        >
          <div
            id={`${id}-bar-fill`}
            className="h-full bg-cinema-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${percentDone}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground font-black whitespace-nowrap">
          {percentDone}% Done
        </span>
      </div>
    </div>
  );
}
