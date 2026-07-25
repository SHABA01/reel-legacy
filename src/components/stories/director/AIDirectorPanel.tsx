/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Play,
  X,
  HelpCircle,
  Wand2,
  Film,
  Music,
  Mic,
  Calendar,
  Users,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { useToast } from '../../../context/ToastContext';

export interface DirectorRecommendation {
  id: string;
  category: 'Music' | 'Pacing' | 'Narration' | 'Archive' | 'Continuity' | 'Ending';
  title: string;
  description: string;
  rationale: string;
  impactScore: 'High' | 'Medium' | 'Low';
  sceneId?: string;
}

export interface AIDirectorPanelProps {
  storyTitle?: string;
  onApplyFix?: (rec: DirectorRecommendation) => void;
}

export function AIDirectorPanel({ storyTitle, onApplyFix }: AIDirectorPanelProps) {
  const { showToast } = useToast();

  const [recommendations, setRecommendations] = useState<DirectorRecommendation[]>([
    {
      id: 'rec-1',
      category: 'Music',
      title: 'Missing Soundtrack in Emotional Climax',
      description: 'Scene #3 (1974 Salem Literacy Center Launch) lacks background music during the founder speech.',
      rationale:
        'Acoustic scoring during turning point speeches increases audience emotional engagement by 40%. A warm violin/piano arrangement will amplify the emotional weight of Elizabeth’s quote.',
      impactScore: 'High',
      sceneId: 'sc-3',
    },
    {
      id: 'rec-2',
      category: 'Continuity',
      title: 'Chronology Gap Detected (1966–1972)',
      description: 'No timeline events or archival photos recorded between Holyoke graduation and founding the Literacy Center.',
      rationale:
        'Audience retention dips when narrative gaps exceed 5 years without transition context. AI recommends inserting a 15-second bridge narration describing early marriage years in Salem.',
      impactScore: 'High',
    },
    {
      id: 'rec-3',
      category: 'Narration',
      title: 'Voiceover Pace Exceeds Standard Tempo',
      description: 'Scene #2 narration tempo is 145 WPM (words per minute), exceeding recommended 115 WPM documentary pace.',
      rationale:
        'Slowing voiceover cadence allows viewer time to inspect historical photo details and digest narrative significance.',
      impactScore: 'Medium',
      sceneId: 'sc-2',
    },
    {
      id: 'rec-4',
      category: 'Archive',
      title: 'Missing Childhood Media Assets',
      description: 'Act I has only 1 photo assigned for a 30-second scene duration.',
      rationale:
        'Visual repetition occurs when a single photo remains on screen for longer than 8 seconds. Ken Burns pan/zoom can cushion the gap, but adding 1 second archival photo is optimal.',
      impactScore: 'Medium',
      sceneId: 'sc-1',
    },
  ]);

  // Modal State for Rationale & Preview
  const [explainModal, setExplainModal] = useState<DirectorRecommendation | null>(null);
  const [previewModal, setPreviewModal] = useState<DirectorRecommendation | null>(null);

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Recommendation Dismissed', 'Removed recommendation from active director queue.');
  };

  const handleApplyAuto = (rec: DirectorRecommendation) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== rec.id));
    onApplyFix?.(rec);
    showToast('success', 'AI Director Applied Fix', `Resolved: "${rec.title}"`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 shadow-xl" id="ai-director-panel-root">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cinema-amber-500/15 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              Active AI Film Director
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono">
              Continuous project monitoring • {recommendations.length} Active Insight(s)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/10 text-cinema-amber-400 px-2.5 py-1 rounded-full border border-cinema-amber-500/20">
          HEALTH: {recommendations.length === 0 ? '100% PERFECT' : '92% OPTIMAL'}
        </span>
      </div>

      {/* RECOMMENDATIONS CARDS */}
      {recommendations.length === 0 ? (
        <div className="p-8 border border-dashed border-border rounded-xl bg-card/30 flex flex-col items-center justify-center text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <h5 className="font-display font-bold text-xs text-foreground uppercase">No Production Issues Found</h5>
          <p className="text-xs text-muted-foreground max-w-md">
            Your documentary script, scene timeline, narration pacing, and audio scoring are completely synchronized.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-background border border-border rounded-xl space-y-3 hover:border-cinema-amber-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        rec.impactScore === 'High'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : 'bg-cinema-amber-500/15 text-cinema-amber-400 border-cinema-amber-500/30'
                      }`}
                    >
                      {rec.impactScore} IMPACT
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">• {rec.category}</span>
                  </div>
                  <h5 className="font-display font-bold text-xs text-foreground">{rec.title}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                </div>

                <button
                  onClick={() => handleDismiss(rec.id)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4 ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
                <Button
                  variant="accent"
                  size="xs"
                  leftIcon={<Wand2 className="w-3 h-3 text-slate-950" />}
                  onClick={() => handleApplyAuto(rec)}
                  className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
                >
                  Apply Automatically
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<Play className="w-3 h-3" />}
                  onClick={() => setPreviewModal(rec)}
                  className="border-border hover:bg-muted text-xs"
                >
                  Preview
                </Button>

                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<HelpCircle className="w-3 h-3" />}
                  onClick={() => setExplainModal(rec)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Explain
                </Button>

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleDismiss(rec.id)}
                  className="text-muted-foreground hover:text-red-400 text-xs ml-auto"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPLAIN RATIONALE MODAL */}
      {explainModal && (
        <Modal
          isOpen={true}
          onClose={() => setExplainModal(null)}
          title={`AI Director Rationale: ${explainModal.title}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-cinema-amber-500/10 border border-cinema-amber-500/30 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-cinema-amber-400 uppercase block">
                Filmmaking Principle & Insight
              </span>
              <p className="text-xs text-foreground leading-relaxed">{explainModal.rationale}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setExplainModal(null)}>
                Close
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  handleApplyAuto(explainModal);
                  setExplainModal(null);
                }}
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
              >
                Apply Fix Now
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* PREVIEW MODAL */}
      {previewModal && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewModal(null)}
          title={`Preview Fix: ${previewModal.title}`}
        >
          <div className="space-y-4 text-center">
            <div className="p-8 bg-black/80 border border-border rounded-xl space-y-3 flex flex-col items-center justify-center">
              <Play className="w-10 h-10 text-cinema-amber-500 animate-pulse" />
              <p className="text-xs text-foreground font-mono">Simulating auto-fix for "{previewModal.title}"...</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewModal(null)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  handleApplyAuto(previewModal);
                  setPreviewModal(null);
                }}
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
              >
                Confirm & Apply
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
