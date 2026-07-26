/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  X,
  Scale,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  Check,
  Star,
  Users,
  Camera,
  Music,
  FileText,
  Trash2
} from 'lucide-react';

interface TemplateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: StoryTemplate[];
  onRemoveFromCompare: (templateId: string) => void;
  onUseTemplate: (template: StoryTemplate) => void;
  onSelectTemplate: (template: StoryTemplate) => void;
}

export const TemplateComparisonModal: React.FC<TemplateComparisonModalProps> = ({
  isOpen,
  onClose,
  templates,
  onRemoveFromCompare,
  onUseTemplate,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cinema-amber-500/15 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-500">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                Side-by-Side Blueprint Comparison
              </h3>
              <p className="text-xs text-muted-foreground">
                Comparing {templates.length} story blueprints to help you choose the best structure for your documentary.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Matrix */}
        <div className="flex-1 overflow-x-auto p-6">
          {templates.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-muted-foreground text-sm">No templates selected for comparison.</p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Back to Explorer
              </Button>
            </div>
          ) : (
            <div
              className="grid gap-6 min-w-[700px]"
              style={{
                gridTemplateColumns: `200px repeat(${templates.length}, minmax(240px, 1fr))`,
              }}
            >
              {/* Row 1: Template Cover & Header */}
              <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground pt-4">
                Story Blueprint
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="space-y-3 bg-muted/20 border border-border/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="relative rounded-xl overflow-hidden aspect-video mb-3">
                      <img src={tmpl.coverImage} alt={tmpl.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemoveFromCompare(tmpl.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-extrabold text-cinema-amber-500 uppercase tracking-wider block">
                      {tmpl.category}
                    </span>
                    <h4 className="font-display font-bold text-base text-foreground mt-0.5">
                      {tmpl.name}
                    </h4>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onUseTemplate(tmpl);
                      }}
                      className="w-full bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1 py-2"
                    >
                      Use Blueprint
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onSelectTemplate(tmpl);
                      }}
                      className="w-full text-xs py-1.5"
                    >
                      Preview Details
                    </Button>
                  </div>
                </div>
              ))}

              {/* Row 2: Runtime */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cinema-amber-500" />
                Estimated Runtime
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs font-bold text-foreground">
                  {tmpl.estimatedRuntime}
                </div>
              ))}

              {/* Row 3: Acts, Chapters, Scenes */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cinema-amber-500" />
                Structure & Counts
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs text-foreground">
                  <strong className="text-cinema-amber-500">{tmpl.actCount} Acts</strong> • {tmpl.chapterCount} Chapters • {tmpl.sceneCount} Scenes
                </div>
              ))}

              {/* Row 4: Difficulty & Rating */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-cinema-amber-500" />
                Difficulty & Rating
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs text-foreground flex items-center gap-2">
                  <span className="bg-muted px-2 py-0.5 rounded text-[11px] font-bold">{tmpl.difficulty}</span>
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    ★ {tmpl.rating ? tmpl.rating.toFixed(1) : '4.9'}
                  </span>
                </div>
              ))}

              {/* Row 5: AI Compatibility */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cinema-amber-500" />
                AI Compatibility
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs font-semibold text-emerald-500">
                  {tmpl.aiCompatibility} AI Support
                </div>
              ))}

              {/* Row 6: Narrative & Voice Style */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cinema-amber-500" />
                Narration Tone
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs text-muted-foreground line-clamp-3">
                  {tmpl.narrativeBlueprint.narrationStyle}
                </div>
              ))}

              {/* Row 7: Music Style */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-cinema-amber-500" />
                Score & Palette
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs text-muted-foreground line-clamp-3">
                  {tmpl.narrativeBlueprint.musicStyle}
                </div>
              ))}

              {/* Row 8: Recommended Audience */}
              <div className="font-semibold text-xs text-muted-foreground py-3 border-t border-border/60 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cinema-amber-500" />
                Target Audience
              </div>
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="py-3 border-t border-border/60 text-xs text-foreground">
                  {tmpl.recommendedAudience}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Tip: You can compare up to 3 templates simultaneously.
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
};
