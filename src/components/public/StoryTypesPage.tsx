/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  User,
  Heart,
  Sparkles,
  Award,
  Crown,
  Users,
  Compass,
  Building,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';

interface StoryTypesPageProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export function StoryTypesPage({ onOpenAuth }: StoryTypesPageProps) {
  const storyTypes = [
    {
      id: 'personal-bio',
      title: 'Personal Biography',
      icon: <BookOpen className="w-5 h-5 text-cinema-amber-500" />,
      purpose: 'Record the comprehensive life story of a parent, grandparent, or mentor.',
      useCase: 'Preserve the legacy of family elders before their first-hand memories fade.',
      output: '45-minute documentary film divided into chronologically sequenced chapters + a printed 150-page leather hardcover biography booklet.',
      audience: 'Children, grandchildren, nieces, nephews, and future descendants.',
      badge: 'Most Popular'
    },
    {
      id: 'autobiography',
      title: 'Autobiography / Memoirs',
      icon: <User className="w-5 h-5 text-cinema-amber-500" />,
      purpose: 'Tell your own story, in your own words, reflecting on pivotal moments, lessons learned, and family values.',
      useCase: 'Perfect for retirees or individuals wanting to pass down authentic advice, records, and life choices.',
      output: 'Self-narrated digital audio-book memoir linked to high-resolution photo slides, with custom background musical scoring.',
      audience: 'Family members, close colleagues, and local historical societies.',
      badge: null
    },
    {
      id: 'celebration-of-life',
      title: 'Celebration of Life',
      icon: <Sparkles className="w-5 h-5 text-cinema-amber-500" />,
      purpose: 'Create an uplifting, vibrant narrative celebrating the achievements, humor, and joy of an individual.',
      useCase: 'Often displayed at milestones like 80th birthdays, golden wedding anniversaries, or community retirement dinners.',
      output: 'A visually dynamic, fast-paced 20-minute testimonial film incorporating interviews from multiple family co-authors.',
      audience: 'Anniversary or birthday guests, extended family, and lifelong friends.',
      badge: 'Festive'
    },
    {
      id: 'memorial-doc',
      title: 'Memorial Documentary',
      icon: <Heart className="w-5 h-5 text-cinema-amber-500" />,
      purpose: 'A solemn, deeply respectful archival tribute to a deceased loved one.',
      useCase: 'Commemorate anniversaries of passing or assemble a permanent, comforting family record.',
      output: 'A respectful, nostalgic 30-minute film incorporating historical archival clips, legacy photos, and recorded audio sound bites.',
      audience: 'Close family, relatives, and close friends.',
      badge: 'Solace'
    },
    {
      id: 'career-doc',
      title: 'Career Documentary',
      icon: <Award className="w-5 h-5 text-cinema-ai" />,
      purpose: 'Highlight a lifetime of professional achievement, technical innovations, and corporate milestones.',
      useCase: 'Synthesize portfolios directly from CareerCanvas for executives, scientists, artists, or public officials.',
      output: 'High-definition 30-minute professional documentary suitable for public portfolios, LinkedIn, or corporate archives.',
      audience: 'Industry peers, employers, professional associations, and students.',
      badge: 'CareerCanvas Link'
    },
    {
      id: 'retirement-doc',
      title: 'Retirement Documentary',
      icon: <Crown className="w-5 h-5 text-cinema-ai" />,
      purpose: 'Honour a long-term employee or co-founder leaving the organization.',
      useCase: 'Commissioned by corporate teams to present at formal retirement farewell dinners or annual general meetings.',
      output: 'A warm 15-minute film combining team messages, office archival photos, and lighthearted anecdotes.',
      audience: 'Company staff, board members, clients, and family.',
      badge: 'Corporate'
    },
    {
      id: 'family-legacy',
      title: 'Family Legacy Chronicle',
      icon: <Users className="w-5 h-5 text-cinema-amber-500" />,
      purpose: 'Track a family lineage across multiple generations, tracing migration routes and ancestral roots.',
      useCase: 'Perfect for ancestral genealogists who want to bind historical documents and passenger manifests with modern footage.',
      output: 'A modular, multi-part documentary series focusing on different family branches, accompanied by an interactive digital family tree.',
      audience: 'The entire extended family tree.',
      badge: 'Multigenerational'
    },
    {
      id: 'educational-journey',
      title: 'Educational Journey',
      icon: <Compass className="w-5 h-5 text-cinema-amber-500" />,
      purpose: 'Document academic breakthroughs, research voyages, doctoral pursuits, or high-level academic careers.',
      useCase: 'Perfect for retired professors, Nobel laureates, or researchers compiling their intellectual discoveries.',
      output: 'An educational, highly informative timeline film featuring annotated footnotes, publication snippets, and journal reviews.',
      audience: 'University archives, students, research institutions, and family.',
      badge: null
    },
    {
      id: 'org-history',
      title: 'Organization History',
      icon: <Building className="w-5 h-5 text-cinema-slate-500" />,
      purpose: 'Document the founding, milestones, product pivots, and cultural impact of a company or non-profit.',
      useCase: 'Capture historical breakthroughs for corporate jubilees, annual reports, or permanent brand exhibitions.',
      output: 'A highly structured corporate legacy film and digital timelines museum archive.',
      audience: 'Board members, shareholders, new employees, and the public.',
      badge: 'Future Roadmap'
    }
  ];

  return (
    <div id="story-types-page" className="w-full bg-background relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="storytypes-header">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
            <BookOpen className="w-3.5 h-3.5 animate-pulse" /> Curated Narrative formats
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Enduring Documentary Formats
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            ReelLegacy maps uncompiled memories into specific, carefully paced cinematic formats. Select a documentary type below to align your script structures, narrator profiles, and styling themes.
          </p>
        </div>

        {/* Story Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="story-types-grid">
          {storyTypes.map((story) => (
            <div
              key={story.id}
              id={`story-card-${story.id}`}
              className="flex flex-col justify-between p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-all relative overflow-hidden"
            >
              {story.badge && (
                <div className="absolute top-3 right-3" id={`badge-${story.id}`}>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                    story.id === 'career-doc' || story.id === 'retirement-doc'
                      ? 'bg-cinema-ai/10 text-cinema-ai border-cinema-ai/20'
                      : 'bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border-cinema-amber-500/20'
                  }`}>
                    {story.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4 text-left">
                {/* Icon header */}
                <div className="w-10 h-10 rounded-xl bg-muted/65 flex items-center justify-center">
                  {story.icon}
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {story.title}
                  </h3>

                  {/* Purpose */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Purpose</span>
                    <p className="text-xs text-foreground/80 leading-relaxed text-justify">
                      {story.purpose}
                    </p>
                  </div>

                  {/* Best Use */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Best Use Case</span>
                    <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                      {story.useCase}
                    </p>
                  </div>

                  {/* Recommended Audience */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Target Audience</span>
                    <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                      {story.audience}
                    </p>
                  </div>

                  {/* Example Output */}
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-cinema-amber-600 dark:text-cinema-amber-400 uppercase tracking-widest block flex items-center gap-1">
                      <Info className="w-3 h-3" /> Rendered Output
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed text-justify">
                      {story.output}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-border/60">
                <Button
                  id={`btn-select-${story.id}`}
                  variant="ghost"
                  className="w-full text-xs font-semibold flex flex-row flex-nowrap items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer border border-transparent bg-cinema-slate-800 text-cinema-slate-50 hover:bg-cinema-slate-700 dark:border-border dark:bg-muted/20 dark:text-foreground dark:hover:bg-muted/40"
                  onClick={() => onOpenAuth('register')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 shrink-0" />}
                >
                  Begin here
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Guidance box */}
        <div className="mt-16 p-6 border border-border bg-muted/15 rounded-2xl max-w-3xl mx-auto flex gap-4 text-left" id="storytypes-info">
          <Info className="w-6 h-6 text-cinema-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Not sure which narrative format fits your goals?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
              Don’t worry. Our **AI Storytelling Assistant** can analyze your initial media imports and interview answers, and recommend the best-suited documentary structure automatically during step two of the creation wizard.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
