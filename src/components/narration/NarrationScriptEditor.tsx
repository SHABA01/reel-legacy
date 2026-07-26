/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Mic,
  Clock,
  BookOpen,
  User,
  Tag,
  Zap,
  Wand2,
  Split,
  Merge,
  PauseCircle,
  Volume2,
  Check,
  RotateCcw,
  Sliders,
  Flame,
  Film,
  MessageSquare
} from 'lucide-react';
import { NarrationSegment, VoiceProfile } from '../../types/narration';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { VoiceGenerationService, AIActionType } from '../../services/voiceGenerationService';

interface NarrationScriptEditorProps {
  segment: NarrationSegment | null;
  voiceProfile: VoiceProfile | undefined;
  onUpdateText: (segmentId: string, newText: string) => void;
  onOpenRecordModal: () => void;
  onGenerateVoiceClip: (actionLabel: string) => void;
  onAddVersion: (label: string, type: 'edited' | 'ai_generated' | 'alternative_take') => void;
  onSplitSegment?: () => void;
  onMergeSegment?: () => void;
}

export function NarrationScriptEditor({
  segment,
  voiceProfile,
  onUpdateText,
  onOpenRecordModal,
  onGenerateVoiceClip,
  onAddVersion,
  onSplitSegment,
  onMergeSegment
}: NarrationScriptEditorProps) {
  const { showToast } = useToast();

  const [text, setText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [autosaved, setAutosaved] = useState<boolean>(true);

  useEffect(() => {
    if (segment) {
      setText(segment.text);
      setAutosaved(true);
    }
  }, [segment]);

  if (!segment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-card/20 rounded-2xl border border-dashed border-border/60">
        <FileText className="w-12 h-12 text-cinema-amber-500/40 mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-foreground font-display">No Scene Selected</h3>
        <p className="text-xs max-w-sm mt-1">Select a documentary scene from the left structure tree to write, record, or generate narration.</p>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setAutosaved(false);
    onUpdateText(segment.id, val);

    setTimeout(() => {
      setAutosaved(true);
    }, 800);
  };

  // Modular AI Actions Handler
  const handleAIAction = async (action: AIActionType, label: string) => {
    if (!text.trim()) return;
    setIsAiLoading(true);
    showToast('loading', `Executing AI Studio: ${label}...`);

    try {
      const transformed = await VoiceGenerationService.transformText(text, action, {
        tone: segment.tone,
        sceneTitle: segment.sceneTitle
      });

      setText(transformed);
      onUpdateText(segment.id, transformed);
      showToast('success', `Narration updated with ${label}!`);
    } catch (err) {
      showToast('error', 'AI Transformation failed.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Insert Pause tag
  const handleInsertPause = () => {
    const pauseTag = ' [pause: 1.5s] ';
    const updated = text + pauseTag;
    setText(updated);
    onUpdateText(segment.id, updated);
    showToast('info', 'Inserted 1.5s breath pause into script.');
  };

  return (
    <div className="flex-1 flex flex-col bg-card/40 border border-border/80 rounded-2xl overflow-hidden shadow-sm" id="narration-script-editor">
      {/* 1. EDITOR HEADER & SCENE METADATA */}
      <div className="p-4 border-b border-border/70 bg-background/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cinema-amber-500/15 text-cinema-amber-400 border border-cinema-amber-500/30">
              {segment.chapterTitle}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Scene {segment.sceneOrder}
            </span>
          </div>
          <h3 className="font-display text-base font-bold text-foreground mt-1">
            {segment.sceneTitle}
          </h3>
        </div>

        {/* METRICS & STATUS BADGES */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-cinema-amber-400" />
            <span>Est. ~{segment.speakingDurationEstimateSec}s</span>
          </div>

          <div className="text-muted-foreground">
            <span>{segment.wordCount} words</span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-slate-800 text-cinema-amber-300 text-[10px] font-bold">
            Tone: {segment.tone}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
            {autosaved ? (
              <>
                <Check className="w-3 h-3" />
                <span>Autosaved</span>
              </>
            ) : (
              <span className="text-cinema-amber-400 animate-pulse">Saving...</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. TAGS & REFERENCE BAR */}
      <div className="px-4 py-2 border-b border-border/40 bg-muted/20 flex flex-wrap items-center gap-4 text-xs">
        {segment.characterReferences.length > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3.5 h-3.5 text-cinema-amber-400" />
            <span className="font-semibold text-foreground">Characters:</span>
            {segment.characterReferences.map((char, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px]">
                {char}
              </span>
            ))}
          </div>
        )}

        {segment.pronunciationHints.length > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-foreground">Pronunciation:</span>
            {segment.pronunciationHints.map((hint, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-mono">
                {hint}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. MAIN SCRIPT TEXTAREA */}
      <div className="flex-1 p-4 relative flex flex-col">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Write documentary narration here..."
          className="w-full flex-1 bg-transparent text-foreground font-sans text-sm md:text-base leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/50 custom-scrollbar"
        />

        {/* QUICK SCRIPT TOOLS */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Button
              size="xs"
              variant="outline"
              onClick={handleInsertPause}
              icon={<PauseCircle className="w-3 h-3 text-cinema-amber-400" />}
            >
              Insert Pause (+1.5s)
            </Button>

            {onSplitSegment && (
              <Button
                size="xs"
                variant="outline"
                onClick={onSplitSegment}
                icon={<Split className="w-3 h-3" />}
              >
                Split Narration
              </Button>
            )}

            {onMergeSegment && (
              <Button
                size="xs"
                variant="outline"
                onClick={onMergeSegment}
                icon={<Merge className="w-3 h-3" />}
              >
                Merge Next
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="secondary"
              onClick={onOpenRecordModal}
              icon={<Mic className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Record Voice Studio
            </Button>

            <Button
              size="xs"
              variant="cinema"
              onClick={() => onGenerateVoiceClip('AI Voice Synthesis')}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate AI Voice
            </Button>
          </div>
        </div>
      </div>

      {/* 4. MODULAR AI ACTIONS BAR */}
      <div className="p-3 bg-background/80 border-t border-border/70 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-cinema-slate-400">
          <div className="flex items-center gap-1.5 text-cinema-amber-400">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Modular AI Script Refinements</span>
          </div>
          <span>Active Voice: {voiceProfile ? voiceProfile.name : 'Arthur Sterling'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('rewrite_natural', 'Natural Speech')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            💬 Natural Speech
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('make_cinematic', 'Cinematic BBC')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            🎬 Cinematic BBC
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('make_emotional', 'Emotional Warmth')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            ❤️ Emotional
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('make_conversational', 'Conversational')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            ☕ Fireplace Chat
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('improve_flow', 'Cadence & Flow')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            🌊 Improve Flow
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('shorten', 'Condense 30%')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            ✂️ Shorten
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAIAction('expand', 'Sensory Details')}
            className="py-1 px-2.5 rounded-lg bg-card border border-border/70 hover:border-cinema-amber-500/50 text-xs font-medium text-foreground hover:text-cinema-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            ✨ Expand Details
          </button>
        </div>
      </div>
    </div>
  );
}
