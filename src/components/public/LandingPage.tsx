/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Film,
  Layers,
  History,
  TrendingUp,
  Award,
  Video,
  Database,
  Quote,
  ChevronDown,
  Play,
  Heart,
  Mic,
  Clapperboard,
  FileCheck2
} from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export function LandingPage({ setCurrentPage, onOpenAuth }: LandingPageProps) {
  // Mini FAQ Accordion Local State for the Landing Page
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handlePageNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="landing-page" className="w-full relative overflow-hidden bg-background">
      {/* Background Ambience / Subtle Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cinema-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] right-10 w-[600px] h-[600px] bg-cinema-ai/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28" id="hero-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left" id="hero-left-content">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Cinematic Legacy Preservation
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Your life story, rendered as a{' '}
                <span className="text-cinema-amber-500">
                  Cinematic Legacy.
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                ReelLegacy is the world's premier AI-assisted biography studio. We synthesize transcripts, historical memorabilia, and voice narrations into magnificent broadcast-quality documentaries. Preserve your family's authentic history or corporate legacy forever.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2" id="hero-cta-buttons">
                <Button
                  id="hero-getstarted-btn"
                  variant="accent"
                  size="lg"
                  onClick={() => onOpenAuth('register')}
                  rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
                >
                  Create Your Story Free
                </Button>
                <Button
                  id="hero-features-btn"
                  variant="ghost"
                  size="lg"
                  onClick={() => handlePageNavigation('features')}
                  leftIcon={<Play className="w-4.5 h-4.5 text-cinema-amber-500 animate-pulse fill-cinema-amber-500" />}
                >
                  Explore Capabilities
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-border flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-muted-foreground" id="hero-trust-indicators">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">100% Secure</span> Family Archives
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">AI Assisted</span> Human Crafted Finish
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Exportable</span> 4K Broadcast Quality
                </div>
              </div>
            </div>

            {/* Right Media / Showcase Placeholder */}
            <div className="lg:col-span-5 relative" id="hero-right-media">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-4 space-y-4"
              >
                {/* Visual Video frame placeholder */}
                <div className="relative aspect-video rounded-xl bg-cinema-slate-950 flex items-center justify-center overflow-hidden border border-cinema-slate-900 group">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cinema-slate-900 via-cinema-slate-950 to-black opacity-90" />
                  <Clapperboard className="w-16 h-16 text-cinema-amber-500/20 absolute group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Dynamic overlay label */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-[9px] text-white font-bold uppercase tracking-wider">
                      LEGACYPREVIEW.MP4
                    </span>
                  </div>

                  <div className="relative z-10 text-center space-y-2 p-4">
                    <button
                      onClick={() => onOpenAuth('register')}
                      id="hero-preview-play-btn"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cinema-amber-500 text-cinema-slate-950 hover:bg-cinema-amber-400 shadow-lg cursor-pointer transform hover:scale-105 transition-all"
                    >
                      <Play className="h-5 w-5 fill-cinema-slate-950" />
                    </button>
                    <p className="text-[11px] text-cinema-slate-400 font-medium">
                      Press to witness a sample rendering
                    </p>
                  </div>
                </div>

                {/* Sub-cards showing active rendering status */}
                <div className="space-y-3 bg-muted/35 p-3 rounded-xl border border-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cinema-amber-500" /> AI Script Generation
                    </span>
                    <span className="font-mono text-cinema-amber-600 dark:text-cinema-amber-400 font-bold">
                      Completed
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-cinema-amber-500 rounded-full w-full" />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    "Synthesizing Grandma’s 1964 transcripts and journal annotations..."
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Introduction & Value Proposition */}
      <section className="py-16 border-t border-border bg-muted/20" id="intro-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-widest text-cinema-amber-600 dark:text-cinema-amber-400">
              The ReelLegacy Philosophy
            </h2>
            <p className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
              An authentic narrative is the ultimate gift.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every family has records, letters, and albums locked away in drawers, and every professional has monumental chapters of experiences forgotten in transcripts. ReelLegacy gathers these disjointed timelines and applies professional documentary pacing, cinematic music, and historical context, crafting a structured documentary archive that lives forever.
            </p>
          </div>

          {/* Value Prop Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12" id="value-props-grid">
            <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/15 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground">Enduring Authenticity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We do not invent stories. Our AI models act as structured research assistants, indexing your original audio transcripts, diary snippets, and letters to produce absolute factual fidelity.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-cinema-ai/15 border border-cinema-ai/20 flex items-center justify-center text-cinema-ai">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground">AI Storytelling Pacing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Applying structural film rules. Our compiler maps your chronology to classic storytelling frameworks: the Hero’s Journey, the Archival Memoir, or the Professional Legacy.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground">Broadcast Quality Finish</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every rendered package features synchronized voice-narration tracks, contextual historical illustrations, elegant maps grounding, and immersive Ken Burns image zooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Process Steps */}
      <section className="py-16 border-t border-border" id="process-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Four-Step Compilation</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How the Archive Compiles
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A fluid synthesis of personal memory files and state-of-the-art cinematic technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative" id="process-steps">
            {/* Step 1 */}
            <div className="space-y-4 relative p-4" id="step-card-1">
              <div className="absolute top-4 left-4 font-display text-5xl font-black text-muted/30 select-none">01</div>
              <div className="space-y-2 pt-6">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">Gather Assets</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload audio memories, scanned letters, military records, journal pages, or photographs using our drag-and-drop dashboard interface.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative p-4" id="step-card-2">
              <div className="absolute top-4 left-4 font-display text-5xl font-black text-muted/30 select-none">02</div>
              <div className="space-y-2 pt-6">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">AI Transcription & Chronology</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our neural systems transcribe recordings, extract pivotal dates, align geographic routes, and assemble a cohesive biographical timeline.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative p-4" id="step-card-3">
              <div className="absolute top-4 left-4 font-display text-5xl font-black text-muted/30 select-none">03</div>
              <div className="space-y-2 pt-6">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">Select Narrator & Theme</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose from warm, high-fidelity synthetic voices or record personal narration. Select editorial themes that dictate styling, transitions, and pacing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 relative p-4" id="step-card-4">
              <div className="absolute top-4 left-4 font-display text-5xl font-black text-muted/30 select-none">04</div>
              <div className="space-y-2 pt-6">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">Render and Preserve</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The rendering engine exports a fully coordinated MP4 documentary alongside a printed hardcover-ready leather biography PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Documentary & CareerCanvas Integration Section */}
      <section className="py-16 border-t border-border bg-muted/15" id="careercanvas-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual indicator for integration */}
            <div className="lg:col-span-5 order-2 lg:order-1" id="integration-visual">
              <div className="p-6 bg-card border border-border rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cinema-ai/5 rounded-full filter blur-xl" />
                <div className="flex items-center justify-between border-b border-border/80 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-cinema-ai animate-pulse" />
                    <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                      CAREERCANVAS BRIDGE ACTIVE
                    </span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-muted/45 rounded-xl border border-border/40 space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-cinema-ai flex items-center gap-1">
                      <Award className="w-3 h-3" /> Transferred Milestone
                    </span>
                    <h4 className="text-xs font-bold text-foreground">
                      Senior Executive Director at IdeaCodex Labs (2018–2026)
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Ported with full transcripts, key project documents, and team citations intact.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/45 rounded-xl border border-border/40 space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-cinema-amber-500 flex items-center gap-1">
                      <Video className="w-3 h-3" /> Rendered Scene Segment
                    </span>
                    <h4 className="text-xs font-semibold text-foreground">
                      Chapter 4: Scaling the Labs (Audio Scene)
                    </h4>
                    <p className="text-[10px] text-muted-foreground italic">
                      "Philip's vision catalyzed twenty cinematic products within Phase 0..."
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-center">
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-cinema-amber-500" /> Secured connection via CareerCanvas API
                  </span>
                </div>
              </div>
            </div>

            {/* Left/Main Copy */}
            <div className="lg:col-span-7 text-left space-y-5 order-1 lg:order-2" id="integration-copy">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cinema-ai/10 text-cinema-ai border border-cinema-ai/20">
                <Layers className="w-3.5 h-3.5" /> Career Documentary Specialization
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Resume to Film: The CareerCanvas Integration
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                For executives, researchers, and public figures, a traditional CV or resume fails to capture the true magnitude of a life's work. Our direct **CareerCanvas Integration** bridges this gap:
              </p>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                  <span><strong>Instant Portfolio Import:</strong> Seamlessly load professional histories, project files, patent citations, and public keynotes directly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                  <span><strong>Team Testimonial Voiceovers:</strong> Synthesize co-author recommendations into narrative interview sound bites.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                  <span><strong>Retirement and Career Legacy:</strong> Perfect for high-profile retirement celebrations or archiving organization history.</span>
                </li>
              </ul>
              <div className="pt-2 flex gap-3">
                <Button
                  id="learn-types-btn"
                  variant="primary"
                  size="sm"
                  onClick={() => handlePageNavigation('story-types')}
                >
                  View Career Documentary Types
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-border" id="testimonials-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Loved by Legacy Curators
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              What families and archivists say about preserving stories with ReelLegacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left" id="testimonials-grid">
            {/* Testimonial 1 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-4 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-muted/20" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "We had dozens of old cassette tapes of my grandfather talking about his time as a country doctor in Ireland. ReelLegacy transcribed them perfectly and generated a breathtaking legacy film. We played it at his 90th birthday and there wasn't a dry eye in the room."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-cinema-amber-500/20 flex items-center justify-center text-xs font-bold text-cinema-amber-600">
                  MH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Meredith Heaney</h4>
                  <span className="text-[10px] text-muted-foreground">Family Archivist</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-4 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-muted/20" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "When our founding CEO retired after 35 years of growth, a simple silver clock wasn't enough. We imported his career timeline from CareerCanvas and let ReelLegacy compile an organization history documentary. It is absolute broadcast quality. Truly incredible."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-cinema-ai/20 flex items-center justify-center text-xs font-bold text-cinema-ai">
                  DW
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">David Vance</h4>
                  <span className="text-[10px] text-muted-foreground">VP of Corporate Communications</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-4 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-muted/20" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "I wanted to record my autobiography for my grandchildren. Using the step-by-step interview guide, I felt so at ease. The AI structured my stories into beautiful chapters, mapping my migration from Poland in the 1970s. This is my life's masterpiece."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-600">
                  ZK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Zofia Kaczmarek</h4>
                  <span className="text-[10px] text-muted-foreground">Autobiography Creator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Mini FAQ Accordion */}
      <section className="py-16 border-t border-border bg-muted/10" id="landing-faqs">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Curator Questions Answered
            </h2>
            <p className="text-xs text-muted-foreground">
              A brief glance at our core parameters. To read our full documentation, visit the FAQ page.
            </p>
          </div>

          <div className="space-y-3 text-left" id="mini-faq-accordion">
            {[
              {
                q: "What file types can I upload?",
                a: "ReelLegacy supports all standard photo formats (PNG, JPG, TIFF), documents (PDF, DOCX, TXT), and audio recordings (MP3, WAV, M4A, AAC). We can handle historical clipping files and handwritten letters via advanced OCR processing."
              },
              {
                q: "Who owns the intellectual property of the rendered film?",
                a: "You do. Absolutely. ReelLegacy and IdeaCodex Labs claim zero ownership or rights over your uploaded materials, transcripts, synthesized text, or final rendered video assets. Your story belongs purely to your family or organization."
              },
              {
                q: "Can I use my own voice for the documentary narration?",
                a: "Yes. You can record voice tracks directly inside our online Narration Studio, or upload personal voice memos. Alternatively, choose from our premium, highly expressive AI-synthetic narrators optimized for biography pacing."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  id={`faq-item-${idx}`}
                  className="bg-card border border-border rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    id={`faq-trigger-${idx}`}
                    className="w-full flex items-center justify-between px-5 py-4 text-xs sm:text-sm font-semibold text-foreground text-left cursor-pointer hover:bg-muted/30"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-cinema-amber-500' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 animate-fade-in" id={`faq-answer-${idx}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Button
              id="view-all-faqs"
              variant="ghost"
              size="sm"
              onClick={() => handlePageNavigation('faq')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Read Full FAQ Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Final Call To Action (CTA) */}
      <section className="py-20 relative bg-cinema-slate-950 text-white border-t border-cinema-slate-900" id="final-cta">
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-slate-950 via-cinema-slate-900 to-black opacity-95" />
        {/* Cinematic film grains background mock overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cinema-amber-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Film className="w-12 h-12 text-cinema-amber-500 mx-auto animate-spin-slow" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Preserve Your Cinematic Memoir Today.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-cinema-slate-300 max-w-2xl mx-auto leading-relaxed">
            Do not let priceless timelines and oral memories disappear. Join thousands of family historians, veterans, and companies preserving legacies with authentic, modern craftsmanship.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4" id="final-cta-buttons">
            <Button
              id="final-cta-register"
              variant="accent"
              size="lg"
              onClick={() => onOpenAuth('register')}
              rightIcon={<Sparkles className="w-4.5 h-4.5" />}
            >
              Begin Your Journey Free
            </Button>
            <Button
              id="final-cta-contact"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
              onClick={() => handlePageNavigation('contact')}
            >
              Speak with a Biographer
            </Button>
          </div>
          <p className="text-[11px] text-cinema-slate-500">
            No credit card required. AES-256 secure storage. Exportable anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
