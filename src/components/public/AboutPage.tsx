/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Heart,
  Eye,
  Milestone,
  History,
  Building,
  Award,
  Users,
  Compass,
  ArrowRight,
  Target
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export function AboutPage({ setCurrentPage, onOpenAuth }: AboutPageProps) {
  const handlePageNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const corporateStats = [
    { label: 'Archived Memoirs', value: '0' },
    { label: 'Factual Accuracy', value: '0%' },
    { label: 'Documentary Hours Rendered', value: '0' },
    { label: 'ReelLegacy launch', value: 'Phase 0' }
  ];

  return (
    <div id="about-page" className="w-full bg-background relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="about-header">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Our Mission & Philosophy
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            ReelLegacy exists to help people preserve, communicate, and celebrate meaningful stories through authentic, AI-assisted cinematic storytelling.
          </p>
        </div>

        {/* Brand Mission, Vision, and Core values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20" id="about-core-pillars">
          <div className="p-6 bg-card border border-border rounded-2xl text-left space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/15 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground">Our Mission</h3>
            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
              To bridge the gap between traditional biography writing and high-fidelity modern filmmaking. We make legacy preservation accessible, factually pristine, and deeply moving for everyone.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl text-left space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/15 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground">Our Vision</h3>
            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
              A world where no personal breakthrough, ancestral migration, or career milestone is lost to history. We envision every family and team maintaining an enduring, interactive digital documentary museum.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl text-left space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/15 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground">Our Philosophy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
              Story First. The technology must quietly disappear behind the narrative. We value absolute factual fidelity above all else, ensuring we never invent, simulate, or exaggerate personal memories.
            </p>
          </div>
        </div>

        {/* Split Section: The Story Behind ReelLegacy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20" id="about-story-behind">
          <div className="space-y-5 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cinema-amber-600 dark:text-cinema-gold">
              Origin Chronicles
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              The Story Behind the Product
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
              ReelLegacy was born from a simple realization at IdeaCodex Labs: while we possess incredible tools to track our code, optimize our databases, and generate our synthetic graphics, the human archives of our families and organizations are scattered, fragile, and expiring.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
              Our founders wanted to preserve the cassette tapes of their grandparents talking about wartime migrations and farm lives in the early 20th century. Traditional transcription tools stripped out the emotional inflections, and static scrapbooks lacked the dynamic pacing of cinema. We designed ReelLegacy as a modular studio that brings the standards of professional documentary filmmaking directly to personal archiving.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-muted/20 border border-border rounded-3xl relative overflow-hidden" id="about-story-visual">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cinema-amber-500/5 rounded-full filter blur-xl" />
            <div className="space-y-4 text-left">
              <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">
                Our Architectural Grounding
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                By integrating structured timelines with our proprietary AI Storyteller, we allow the system to cross-reference multiple historical documents simultaneously, ensuring zero factual hallucinatory errors.
              </p>
              {/* Visual mini-timeline */}
              <div className="max-h-40 overflow-y-auto pr-2 space-y-4 pt-2 scrollbar-thin border-l-2 border-cinema-amber-500/30 pl-4">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-cinema-amber-500" />
                  <span className="font-mono text-[9px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold block">JULY 2024</span>
                  <p className="text-[11px] font-semibold text-foreground text-justify">ReelLegacy Conceptual Design & Architecture</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-cinema-amber-500" />
                  <span className="font-mono text-[9px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold block">OCTOBER 2024</span>
                  <p className="text-[11px] font-semibold text-foreground text-justify">Multi-decade Timeline Engine Completed</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-cinema-amber-500" />
                  <span className="font-mono text-[9px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold block">JANUARY 2025</span>
                  <p className="text-[11px] font-semibold text-foreground text-justify">ReelLegacy Private Alpha & Transcription Studio</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-cinema-amber-500" />
                  <span className="font-mono text-[9px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold block">MAY 2025</span>
                  <p className="text-[11px] font-semibold text-foreground text-justify">Narration Synthesis & Ken Burns Renderer Alpha</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-muted-foreground" />
                  <span className="font-mono text-[9px] text-muted-foreground font-bold block">JANUARY 2026</span>
                  <p className="text-[11px] font-semibold text-foreground/80 text-justify">Public Beta Release & CareerCanvas Sync</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Stats Showcase */}
        <div className="p-8 bg-cinema-slate-950 text-white rounded-3xl mb-20 border border-cinema-slate-900" id="about-stats-panel">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center" id="stats-grid">
            {corporateStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-cinema-amber-500">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-cinema-slate-400 font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The CareerCanvas Connection & Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="about-ecosystem-connection">
          <div className="p-6 md:p-8 border border-border bg-card rounded-3xl relative order-2 lg:order-1 text-left" id="ecosystem-box">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cinema-ai" /> The IdeaCodex Ecosystem
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              ReelLegacy forms a core pillar of the **IdeaCodex Labs** suite alongside **CareerCanvas**:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 space-y-1">
                <span className="font-mono text-[8px] text-cinema-ai font-bold uppercase tracking-wider block">CareerCanvas</span>
                <p className="text-xs text-foreground/90 font-medium">Professional transcript, milestone, and portfolio management.</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 space-y-1">
                <span className="font-mono text-[8px] text-cinema-amber-500 font-bold uppercase tracking-wider block">ReelLegacy</span>
                <p className="text-xs text-foreground/90 font-medium">Translating transcripts into broadcast-quality cinematic timelines.</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 text-left order-1 lg:order-2" id="ecosystem-copy">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cinema-ai">
              Synergistic Workflows
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Deep CareerCanvas Integration
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We believe a life's work is multi-dimensional. By linking directly with CareerCanvas accounts, ReelLegacy enables professionals to instantly transition from a structured, professional record of certifications and positions to a richly-narrated, cinematic documentary.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This cross-platform architecture ensures that as you compile and update your career portfolio in CareerCanvas, the underlying transcripts and citation parameters are pre-synchronized, waiting to be compiled into a broadcast-ready legacy film in ReelLegacy at the press of a button.
            </p>
            <div className="pt-2 flex gap-3">
              <Button
                id="about-contact-btn"
                variant="primary"
                size="sm"
                onClick={() => handlePageNavigation('contact')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Get in Touch with our Team
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
