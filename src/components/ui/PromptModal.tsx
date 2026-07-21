/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Edit3 } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function PromptModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = 'Enter value...',
  defaultValue = '',
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
}: PromptModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4 py-2" id="prompt-modal-form">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 border border-cinema-amber-500/20">
            <Edit3 className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 min-w-0 flex-grow">
            <h4 className="text-sm font-bold text-foreground">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="px-1">
          <Input
            id="prompt-modal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
          <Button
            id="btn-prompt-cancel"
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            id="btn-prompt-submit"
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputValue.trim()}
            className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold disabled:opacity-50"
          >
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
