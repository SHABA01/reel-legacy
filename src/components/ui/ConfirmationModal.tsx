/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel, Keep',
  isDestructive = true,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4 py-2" id="confirmation-modal-content">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <h4 className="text-sm font-bold text-foreground">
              Are you absolutely sure?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-red-500 dark:text-red-400 font-bold uppercase tracking-wide flex items-center gap-1 mt-2">
              ⚠️ This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
          <Button
            id="btn-confirm-cancel"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            id="btn-confirm-approve"
            variant={isDestructive ? 'accent' : 'primary'}
            size="sm"
            className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
