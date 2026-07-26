/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  FileCheck2,
  Wand2
} from 'lucide-react';

interface AITemplateMatcherProps {
  matchedTemplate: StoryTemplate | null;
  onUseTemplate: (template: StoryTemplate) => void;
  onSelectTemplate: (template: StoryTemplate) => void;
}

export const AITemplateMatcher: React.FC<AITemplateMatcherProps> = ({
  matchedTemplate,
  onUseTemplate,
  onSelectTemplate,
}) => {
  if (!matchedTemplate) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cinema-amber-500/30 bg-gradient-to-r from-cinema-amber-500/10 via-amber-500/5 to-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-cinema-amber-500/20 border border-cinema-amber-500/40 flex items-center justify-center text-cinema-amber-500 flex-shrink-0 mt-0.5">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cinema-amber-500 bg-cinema-amber-500/15 border border-cinema-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              98% Story Blueprint Match
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Based on Legacy Profile & Uploaded Media
            </span>
          </div>

          <h3 className="font-display font-bold text-base text-foreground">
            Recommended: <span className="text-cinema-amber-500">{matchedTemplate.name}</span>
          </h3>

          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            AI Director analyzed 14 uploaded archival portraits and 2 audio clips. This template provides the optimal 3-act pacing, Ken Burns camera motions, and voiceover prompts for your story subject.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Scaffolds 3 Acts & 9 Chapters
            </span>
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pre-filled Interview Prompts
            </span>
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Auto Camera Paths
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectTemplate(matchedTemplate)}
          className="text-xs h-9 bg-background/80"
        >
          Inspect Match
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={() => onUseTemplate(matchedTemplate)}
          className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5 h-9 shadow-md"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Apply Match
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
