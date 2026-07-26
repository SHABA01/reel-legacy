/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Check,
  Search,
  Volume2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PronunciationRule } from '../../types/narration';
import { useToast } from '../../context/ToastContext';

interface PronunciationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: PronunciationRule[];
  onAddRule: (rule: Omit<PronunciationRule, 'id'>) => void;
}

export function PronunciationModal({
  isOpen,
  onClose,
  rules,
  onAddRule
}: PronunciationModalProps) {
  const { showToast } = useToast();

  const [term, setTerm] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [preferred, setPreferred] = useState('');
  const [alias, setAlias] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !preferred.trim()) return;

    onAddRule({
      term,
      phonetic: phonetic || term,
      preferred,
      alias,
      language: 'English (US)',
      notes
    });

    showToast('success', `Added pronunciation rule for "${term}"`);
    setTerm('');
    setPhonetic('');
    setPreferred('');
    setAlias('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pronunciation Dictionary & Phonetics"
      size="lg"
    >
      <div className="space-y-6" id="pronunciation-modal">
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-card border border-cinema-amber-500/30 space-y-3">
          <h4 className="text-xs font-bold text-cinema-amber-400 uppercase tracking-wider font-mono">
            Add Custom Phonetic Override
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-foreground">Term / Name</label>
              <input
                type="text"
                required
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Kennebunkport"
                className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground">Preferred Pronunciation</label>
              <input
                type="text"
                required
                value={preferred}
                onChange={(e) => setPreferred(e.target.value)}
                placeholder="e.g. KEN-uh-bunk-port"
                className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-foreground">Phonetic Spelling / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Emphasis on first syllable per family heritage"
              className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button size="xs" variant="cinema" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Rule
            </Button>
          </div>
        </form>

        {/* RULES LIST */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Active Dictionary Rules ({rules.length})
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {rules.map(rule => (
              <div key={rule.id} className="p-3 rounded-xl bg-background/50 border border-border flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-foreground">{rule.term}</span>
                  <span className="mx-2 text-cinema-amber-400 font-mono">→ {rule.preferred}</span>
                  {rule.notes && <p className="text-[10px] text-muted-foreground mt-0.5">{rule.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
