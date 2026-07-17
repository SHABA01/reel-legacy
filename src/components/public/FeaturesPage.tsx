/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  History,
  FileCheck2,
  CalendarDays,
  FileVideo,
  Mic,
  Database,
  Compass,
  Laptop,
  CheckCircle2,
  Film,
  Camera,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';

interface FeaturesPageProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export function FeaturesPage({ onOpenAuth }: FeaturesPageProps) {
  const featureCategories = [
    {
      id: 'core-creation',
      title: 'Story Creation & Timeline',
      description: 'Capture personal history with structured, chronologically aligned timelines.',
      features: [
        {
          icon: <BookOpen className="w-5 h-5 text-cinema-amber-500" />,
          title: 'Story Creation Studio',
          description: 'A modular storytelling workspace. Draft chapters, store anecdotes, and link key memories in a distraction-free, elegant writer dashboard.',
          illustration: (
            <div className="space-y-1.5 font-sans" id="feat-ill-story">
              <div className="flex items-center gap-1.5 border-b border-border pb-1">
                <span className="text-[9px] font-mono text-muted-foreground uppercase font-semibold">Active Chapter</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cinema-amber-500" />
              </div>
              <h5 className="text-[11px] font-bold text-foreground">Chapter 1: The Migration West</h5>
              <p className="text-[9px] text-muted-foreground leading-relaxed line-clamp-2">
                "In October 1968, Philip gathered his trunk of journals, bidding farewell to the old village..."
              </p>
            </div>
          )
        },
        {
          icon: <CalendarDays className="w-5 h-5 text-cinema-amber-500" />,
          title: 'Timeline Builder',
          description: 'An interactive, zoomable chronological canvas. Automatically align childhood events, relocations, awards, and wedding milestones into a cohesive visual timeline.',
          illustration: (
            <div className="flex items-center gap-2" id="feat-ill-timeline">
              <div className="flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-cinema-amber-500" />
                <div className="h-8 w-0.5 bg-border" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold">1968</span>
                <p className="text-[10px] font-semibold text-foreground leading-none">Arrived at Port of NY</p>
                <span className="font-mono text-[8px] text-muted-foreground block">1971 • Married Eleanor</span>
              </div>
            </div>
          )
        },
        {
          icon: <Camera className="w-5 h-5 text-cinema-amber-500" />,
          title: 'Media Management',
          description: 'Upload high-resolution scans, historical clippings, and audio tapes. Our media vault organizes assets by decade, geographic coordinates, and featured co-authors.',
          illustration: (
            <div className="grid grid-cols-3 gap-1.5" id="feat-ill-media">
              <div className="aspect-square bg-muted/60 rounded-lg flex items-center justify-center border border-border">
                <Camera className="w-4 h-4 text-muted-foreground/60" />
              </div>
              <div className="aspect-square bg-muted/60 rounded-lg flex items-center justify-center border border-border">
                <Film className="w-4 h-4 text-muted-foreground/60" />
              </div>
              <div className="aspect-square bg-muted/60 rounded-lg flex items-center justify-center border border-border">
                <BookOpen className="w-4 h-4 text-muted-foreground/60" />
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'ai-storytelling',
      title: 'AI Storytelling & Biography',
      description: 'Intelligent synthesis systems that amplify facts into polished literary manuscripts.',
      features: [
        {
          icon: <Sparkles className="w-5 h-5 text-cinema-ai" />,
          title: 'AI Biography Generation',
          description: 'Transform unedited transcripts and oral notes into structured, elegant prose. Choose from editorial vibes such as Swiss/Minimal, Tech/Mono, or Classical Biography.',
          illustration: (
            <div className="space-y-2" id="feat-ill-biogen">
              <div className="flex items-center gap-1.5 bg-cinema-ai/5 border border-cinema-ai/20 p-2 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-cinema-ai animate-spin-slow" />
                <span className="font-mono text-[9px] text-cinema-ai font-bold">Synthesizing Biography...</span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-cinema-ai rounded-full w-4/5 animate-pulse" />
              </div>
            </div>
          )
        },
        {
          icon: <FileCheck2 className="w-5 h-5 text-cinema-ai" />,
          title: 'Resume to Documentary',
          description: 'Convert professional transcripts, portfolio documents, and patents into a narrative documentary story. Celebrate a long career with absolute, polished dignity.',
          illustration: (
            <div className="space-y-1" id="feat-ill-resume">
              <div className="h-3 w-1/2 bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
              <div className="h-3 w-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded flex items-center justify-between px-1.5 text-[8px] font-mono text-cinema-amber-600 dark:text-cinema-amber-400">
                <span>PORTING RESUME TRANSCRIPT</span>
                <span className="animate-pulse">● READY</span>
              </div>
            </div>
          )
        },
        {
          icon: <Database className="w-5 h-5 text-cinema-ai" />,
          title: 'CareerCanvas Integration',
          description: 'Connect directly to your CareerCanvas workspace. Seamlessly load credentials, milestones, and organization histories to build rich Career Documentaries instantly.',
          illustration: (
            <div className="flex items-center gap-2 p-1.5 bg-card border border-border/85 rounded-xl" id="feat-ill-cc">
              <div className="w-6 h-6 rounded-lg bg-cinema-ai/10 flex items-center justify-center text-cinema-ai font-bold text-[9px]">CC</div>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <div className="w-6 h-6 rounded-lg bg-cinema-amber-500/10 flex items-center justify-center text-cinema-amber-500 font-bold text-[9px]">RL</div>
            </div>
          )
        }
      ]
    },
    {
      id: 'rendering-studio',
      title: 'Studio & Film compilation',
      description: 'Immersive media rendering, spatial narration alignment, and professional outputs.',
      features: [
        {
          icon: <Mic className="w-5 h-5 text-purple-500" />,
          title: 'Narration Studio',
          description: 'Record custom stories directly inside our high-fidelity narration portal. Includes automated noise cancellation, voice enhancement, and text-to-speech options.',
          illustration: (
            <div className="space-y-1 text-center" id="feat-ill-narration">
              <div className="flex items-center justify-center gap-1.5">
                <span className="h-4 w-0.5 bg-purple-500 animate-pulse" />
                <span className="h-6 w-0.5 bg-purple-500 animate-pulse" />
                <span className="h-3 w-0.5 bg-purple-500 animate-pulse" />
                <span className="h-5 w-0.5 bg-purple-500 animate-pulse" />
                <span className="h-4 w-0.5 bg-purple-500 animate-pulse" />
              </div>
              <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest block">Mic active</span>
            </div>
          )
        },
        {
          icon: <FileVideo className="w-5 h-5 text-purple-500" />,
          title: 'Documentary Rendering',
          description: 'Our cloud compiler synthesizes static timelines, voice recordings, and animated slides into magnificent, downloadable 4K MP4 videos with custom soundtracks.',
          illustration: (
            <div className="space-y-1.5" id="feat-ill-render">
              <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground">
                <span>EXPORT JOB: 0x4A2</span>
                <span className="text-green-500">92%</span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-[92%]" />
              </div>
            </div>
          )
        },
        {
          icon: <Compass className="w-5 h-5 text-purple-500" />,
          title: 'AI Smart Assistant',
          description: 'Stuck during drafting? Our conversational AI assistant analyzes your current timeline, identifies chronological gaps, and suggests thought-provoking prompts.',
          illustration: (
            <div className="p-2 bg-muted/40 rounded-lg text-[9px] text-muted-foreground leading-relaxed italic" id="feat-ill-assistant">
              "We noticed no entries between 1972 and 1975. Would you like to write about Eleanor's graduation?"
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div id="features-page" className="w-full bg-background relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20" id="features-header">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
            <Layers className="w-3.5 h-3.5 animate-pulse" /> Full Studio Capabilities
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Complete Storytelling Toolset
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            ReelLegacy equips family historians, career veterans, and professional biographers with a seamless, high-performance platform to gather, structure, write, and render enduring personal memories.
          </p>
        </div>

        {/* Feature Categories Rows */}
        <div className="space-y-24" id="feature-categories-container">
          {featureCategories.map((category, index) => (
            <div key={category.id} id={`category-block-${category.id}`} className="space-y-8">
              {/* Category Divider Title */}
              <div className="border-b border-border pb-4 text-left" id={`category-head-${category.id}`}>
                <span className="font-mono text-xs uppercase tracking-widest text-cinema-amber-600 dark:text-cinema-gold font-bold">
                  Module 0{index + 1}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                  {category.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              </div>

              {/* Sub-features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id={`category-features-${category.id}`}>
                {category.features.map((feat, featIdx) => (
                  <div
                    key={featIdx}
                    id={`feat-card-${category.id}-${featIdx}`}
                    className="flex flex-col justify-between bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-6 space-y-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-muted/65 flex items-center justify-center">
                        {feat.icon}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-display text-sm font-bold text-foreground">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                          {feat.description}
                        </p>
                      </div>
                    </div>

                    {/* Feature Illustration visual footer preview */}
                    <div className="px-6 pb-6 pt-2" id={`feat-ill-box-${category.id}-${featIdx}`}>
                      <div className="bg-muted/30 border border-border/40 p-4 rounded-xl min-h-[90px] flex flex-col justify-center">
                        {feat.illustration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Banner */}
        <div
          id="features-cta-banner"
          className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-cinema-slate-950 to-cinema-slate-900 text-white relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl border border-cinema-slate-900"
        >
          {/* Decorative radial gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cinema-amber-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <Film className="w-10 h-10 text-cinema-gold mx-auto animate-spin-slow" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ready to compile your first chapter?
            </h2>
            <p className="text-xs text-cinema-slate-300 leading-relaxed">
              Create an account today to access the writer’s studio, import milestones, upload media clippings, and experiment with custom AI narration voices.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Button
                id="features-bottom-cta"
                variant="accent"
                size="md"
                onClick={() => onOpenAuth('register')}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Access Archival Studio
              </Button>
            </div>
            <p className="text-[10px] text-cinema-slate-500">
              No subscription required for basic timeline drafting and script writing.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
