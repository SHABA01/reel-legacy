/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from './Button';
import { WizardStepper, WizardStep } from './WizardStepper';

interface WizardLayoutProps {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  steps: WizardStep[];
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  onBack?: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  isFinalStep: boolean;
  finalStepLabel: string;
  continueLabel?: string;
  children: ReactNode;
  showDraftButton?: boolean;
}

export function WizardLayout({
  id,
  title,
  subtitle,
  icon,
  steps,
  currentStep,
  totalSteps,
  onClose,
  onBack,
  onNext,
  onSaveDraft,
  isFinalStep,
  finalStepLabel,
  continueLabel = 'Continue Workflow',
  children,
  showDraftButton = true,
}: WizardLayoutProps) {
  return (
    <div id={`${id}-backdrop`} className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <motion.div
        id={`${id}-card`}
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-foreground"
      >
        {/* Wizard Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between" id={`${id}-header`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/15 shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-black text-sm text-foreground uppercase tracking-wider truncate">
                {title}
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 truncate">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            id={`${id}-close-btn`}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Stepper Map */}
        <WizardStepper
          id={`${id}-stepper`}
          steps={steps}
          currentStep={currentStep}
          variant="horizontal"
        />

        {/* Wizard Step Content - Scrollable */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6" id={`${id}-step-content-container`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Footer controls */}
        <div className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-between shrink-0" id={`${id}-footer`}>
          <div className="flex items-center gap-2">
            {currentStep > 1 && onBack ? (
              <Button
                id={`${id}-btn-prev`}
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4 text-foreground" />}
                onClick={onBack}
                className="text-xs border border-border font-bold text-foreground cursor-pointer"
              >
                Previous Step
              </Button>
            ) : (
              <Button
                id={`${id}-btn-quit`}
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs border border-border font-bold text-foreground cursor-pointer"
              >
                Cancel Wizard
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showDraftButton && !isFinalStep && onSaveDraft && (
              <Button
                id={`${id}-btn-draft-save`}
                variant="secondary"
                size="sm"
                onClick={onSaveDraft}
                className="text-xs cursor-pointer font-bold"
              >
                Save Draft
              </Button>
            )}

            <Button
              id={`${id}-btn-submit`}
              variant="accent"
              size="sm"
              rightIcon={isFinalStep ? <Check className="w-4 h-4 text-slate-950" /> : <ArrowRight className="w-4 h-4 text-slate-950" />}
              onClick={onNext}
              className="text-xs cursor-pointer font-bold"
            >
              {isFinalStep ? finalStepLabel : continueLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
