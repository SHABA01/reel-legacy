/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  Clock,
  Clapperboard,
  Layers,
  Sparkles,
  Star,
  Users,
  Copy,
  ArrowRight,
  Eye,
  CheckCircle2,
  Flame
} from 'lucide-react';

interface TemplateCardProps {
  template: StoryTemplate;
  isSelected: boolean;
  onSelect: (template: StoryTemplate) => void;
  onUseTemplate: (template: StoryTemplate) => void;
  onDuplicate: (template: StoryTemplate) => void;
  onToggleFavorite: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onUseTemplate,
  onDuplicate,
  onToggleFavorite,
  viewMode = 'grid',
}) => {
  const isListView = viewMode === 'list';

  return (
    <div
      onClick={() => onSelect(template)}
      className={`group relative flex ${
        isListView ? 'flex-col sm:flex-row items-stretch' : 'flex-col'
      } bg-card border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected
          ? 'border-cinema-amber-500 shadow-md ring-2 ring-cinema-amber-500/20'
          : 'border-border/80 hover:border-cinema-amber-500/50'
      }`}
    >
      {/* Cover Image Container */}
      <div
        className={`relative overflow-hidden bg-muted ${
          isListView ? 'w-full sm:w-56 h-40 sm:h-auto flex-shrink-0' : 'w-full h-44'
        }`}
      >
        <img
          src={template.coverImage}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {template.isFeatured && (
              <span className="bg-cinema-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            {template.isPopular && (
              <span className="bg-amber-500/90 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3" />
                Popular
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
              {template.difficulty}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(template.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              template.isFavorite
                ? 'bg-amber-500 text-black'
                : 'bg-black/40 text-white hover:bg-black/70'
            }`}
            title="Toggle Favorite"
          >
            <Star className={`w-3.5 h-3.5 ${template.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Metadata on Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-medium">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-cinema-amber-400" />
            {template.estimatedRuntime}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3 text-cinema-amber-400" />
            {template.aiCompatibility} AI
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span className="font-bold uppercase tracking-wider text-cinema-amber-500">
              {template.category}
            </span>
            {template.rating && (
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{template.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <h3 className="font-display font-bold text-base text-foreground group-hover:text-cinema-amber-500 transition-colors line-clamp-1">
            {template.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Technical Stats Pills */}
        <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-border/60 text-center text-[10px] text-muted-foreground bg-muted/30 rounded-xl">
          <div>
            <span className="block font-bold text-foreground text-xs">{template.actCount}</span>
            <span>Acts</span>
          </div>
          <div>
            <span className="block font-bold text-foreground text-xs">{template.chapterCount}</span>
            <span>Chapters</span>
          </div>
          <div>
            <span className="block font-bold text-foreground text-xs">{template.sceneCount}</span>
            <span>Scenes</span>
          </div>
        </div>

        {/* Audience & Tags */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 truncate max-w-[180px]">
            <Users className="w-3 h-3 text-cinema-amber-500 flex-shrink-0" />
            <span className="truncate">{template.recommendedAudience}</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/70">
            v{template.version}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}
            className="flex-1 text-xs gap-1 py-1.5 h-8"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUseTemplate(template);
            }}
            className="flex-1 text-xs gap-1 py-1.5 h-8 bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold"
          >
            Use Template
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(template);
            }}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            title="Duplicate Blueprint"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
