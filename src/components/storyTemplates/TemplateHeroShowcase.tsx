/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  CheckCircle2,
  Scale
} from 'lucide-react';

interface TemplateHeroShowcaseProps {
  featuredTemplates: StoryTemplate[];
  onSelectTemplate: (template: StoryTemplate) => void;
  onUseTemplate: (template: StoryTemplate) => void;
  onToggleCompare: (template: StoryTemplate) => void;
  comparedIds: string[];
}

export const TemplateHeroShowcase: React.FC<TemplateHeroShowcaseProps> = ({
  featuredTemplates,
  onSelectTemplate,
  onUseTemplate,
  onToggleCompare,
  comparedIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!featuredTemplates || featuredTemplates.length === 0) return null;

  const current = featuredTemplates[currentIndex] || featuredTemplates[0];
  const isCompared = comparedIds.includes(current.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTemplates.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredTemplates.length) % featuredTemplates.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cinema-amber-500/30 bg-gradient-to-br from-card via-card/90 to-cinema-amber-950/20 shadow-xl">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.coverImage}
          alt={current.name}
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-card/40" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Information */}
        <div className="flex-1 space-y-4 max-w-2xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-cinema-amber-500 text-black text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              Spotlight Blueprint
            </span>
            <span className="bg-muted/80 backdrop-blur-md text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border">
              {current.category}
            </span>
            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
              {current.aiCompatibility} AI Director Support
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {current.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {current.description}
            </p>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-background/60 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Runtime</span>
              <span className="text-xs font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-cinema-amber-500" />
                {current.estimatedRuntime}
              </span>
            </div>

            <div className="bg-background/60 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Structure</span>
              <span className="text-xs font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-cinema-amber-500" />
                {current.actCount} Acts • {current.chapterCount} Ch.
              </span>
            </div>

            <div className="bg-background/60 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Level</span>
              <span className="text-xs font-bold text-foreground block mt-0.5">
                {current.difficulty}
              </span>
            </div>

            <div className="bg-background/60 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Rating</span>
              <span className="text-xs font-bold text-cinema-amber-500 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-cinema-amber-500" />
                {current.rating ? current.rating.toFixed(1) : '4.9'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="default"
              size="md"
              onClick={() => onUseTemplate(current)}
              className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold gap-2 px-6 shadow-lg shadow-cinema-amber-500/20"
            >
              Use This Blueprint
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => onSelectTemplate(current)}
              className="gap-2 bg-background/80 hover:bg-background"
            >
              <Eye className="w-4 h-4 text-cinema-amber-500" />
              Preview Details
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => onToggleCompare(current)}
              className={`gap-1.5 text-xs ${
                isCompared
                  ? 'bg-cinema-amber-500/20 text-cinema-amber-500 font-bold border border-cinema-amber-500/40'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              {isCompared ? 'In Comparison' : '+ Compare'}
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Card Preview with Controls */}
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card aspect-[4/3]">
            <img
              src={current.coverImage}
              alt={current.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-1">
              <span className="text-[10px] text-cinema-amber-400 uppercase font-bold tracking-wider block">
                Recommended Audience
              </span>
              <p className="font-semibold line-clamp-1">{current.recommendedAudience}</p>
            </div>
          </div>

          {/* Carousel Controls */}
          {featuredTemplates.length > 1 && (
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                {featuredTemplates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-6 bg-cinema-amber-500' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                    title={`Go to template ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-xl border border-border bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Previous Spotlight"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-xl border border-border bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Next Spotlight"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
