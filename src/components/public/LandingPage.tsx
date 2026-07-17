/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("Playback blocked or interrupted:", err);
          setIsPlaying(!isPlaying);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

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
          <div className="flex flex-col gap-12 items-center text-center">
            
            {/* Top Copy */}
            <div className="w-full space-y-6 text-center flex flex-col items-center" id="hero-left-content">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Cinematic Legacy Preservation
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] max-w-5xl mx-auto">
                Your life story, rendered as a{' '}
                <span className="text-cinema-amber-500">
                  Cinematic Legacy.
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
                ReelLegacy is the world's premier AI-assisted biography studio. We synthesize transcripts, historical memorabilia, and voice narrations into magnificent broadcast-quality documentaries. Preserve your family's authentic history or corporate legacy forever.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2" id="hero-cta-buttons">
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
                  variant="secondary"
                  size="lg"
                  onClick={() => handlePageNavigation('features')}
                  leftIcon={<Play className="w-4.5 h-4.5 text-cinema-amber-500 animate-pulse fill-cinema-amber-500" />}
                >
                  Explore Capabilities
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs text-muted-foreground w-full max-w-4xl mx-auto" id="hero-trust-indicators">
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

            {/* Bottom Media / Walkthrough Video Player */}
            <div className="w-full max-w-4xl mx-auto relative pt-4" id="hero-right-media">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-4 space-y-4"
              >
                {/* Visual Video frame */}
                <div className="relative aspect-[21/10] rounded-xl bg-black flex items-center justify-center overflow-hidden border border-cinema-slate-900 group">
                  <video
                    ref={videoRef}
                    src="https://assets.mixkit.co/videos/preview/mixkit-vintage-movie-projector-running-34321-large.mp4"
                    className="absolute inset-0 w-full h-full object-cover"
                    loop
                    playsInline
                    onClick={handlePlayToggle}
                  />
                  
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 transition-all duration-300">
                      <Clapperboard className="w-16 h-16 text-cinema-amber-500/20 absolute group-hover:scale-105 transition-transform duration-500" />
                      <button
                        onClick={handlePlayToggle}
                        id="hero-preview-play-btn"
                        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cinema-amber-500 text-cinema-slate-950 hover:bg-cinema-amber-400 shadow-xl cursor-pointer transform hover:scale-110 transition-all z-20"
                      >
                        <Play className="h-6 w-6 fill-cinema-slate-950 ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Red pulsing animation beside label */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/75 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 z-20">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <span className="font-mono text-[9px] text-white font-bold uppercase tracking-widest">
                      {isPlaying ? "PLAYING DEMO" : "PLATFORM WALKTHROUGH"}
                    </span>
                  </div>

                  {isPlaying && (
                    <button
                      onClick={handlePlayToggle}
                      className="absolute bottom-3 right-3 bg-black/75 hover:bg-black/90 text-white font-mono text-[10px] px-2.5 py-1 rounded border border-white/10 z-20 cursor-pointer"
                    >
                      PAUSE
                    </button>
                  )}
                </div>

                {/* Walkthrough Description */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-muted/40 p-4 rounded-xl border border-border/60 text-left">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-cinema-amber-500" />
                      ReelLegacy Studio Tour & Demo Walkthrough
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Watch a 5-minute preview of the platform showing how to compile family archives, align geographical maps, index voice memos, and generate broadcast-quality video memoirs.
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20">
                      Walkthrough • Under 10 mins
                    </span>
                  </div>
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
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
              The <span className="normal-case font-black">ReelLegacy</span> Philosophy
            </h2>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground block">
              An authentic narrative is the ultimate gift.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify">
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
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                We do not invent stories. Our AI models act as structured research assistants, indexing your original audio transcripts, diary snippets, and letters to produce absolute factual fidelity.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-cinema-ai/15 border border-cinema-ai/20 flex items-center justify-center text-cinema-ai">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground">AI Storytelling Pacing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Applying structural film rules. Our compiler maps your chronology to classic storytelling frameworks: the Hero’s Journey, the Archival Memoir, or the Professional Legacy.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground">Broadcast Quality Finish</h3>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
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
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Four-Step Compilation</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
              How the Archive Compiles
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A fluid synthesis of personal memory files and state-of-the-art cinematic technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative" id="process-steps">
            {/* Step 1 */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 relative text-left" id="step-card-1">
              <div className="font-display text-3xl font-black text-cinema-amber-600 dark:text-cinema-amber-400/40 select-none">
                01
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">Gather Assets</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                  Upload audio memories, scanned letters, military records, journal pages, or photographs using our drag-and-drop dashboard interface.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 relative text-left" id="step-card-2">
              <div className="font-display text-3xl font-black text-cinema-amber-600 dark:text-cinema-amber-400/40 select-none">
                02
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">AI Transcription & Chronology</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                  Our neural systems transcribe recordings, extract pivotal dates, align geographic routes, and assemble a cohesive biographical timeline.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 relative text-left" id="step-card-3">
              <div className="font-display text-3xl font-black text-cinema-amber-600 dark:text-cinema-amber-400/40 select-none">
                03
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">Select Narrator & Theme</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                  Choose from warm, high-fidelity synthetic voices or record personal narration. Select editorial themes that dictate styling, transitions, and pacing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 relative text-left" id="step-card-4">
              <div className="font-display text-3xl font-black text-cinema-amber-600 dark:text-cinema-amber-400/40 select-none">
                04
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">Render and Preserve</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                  The rendering engine exports a fully coordinated MP4 documentary alongside a printed hardcover-ready leather biography PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Documentary & CareerCanvas Integration Section */}
      <section className="py-16 border-t border-border bg-muted/15" id="careercanvas-section">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Full Width Copy */}
          <div className="text-left space-y-5" id="integration-copy">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cinema-ai/10 text-cinema-ai border border-cinema-ai/20">
              <Layers className="w-3.5 h-3.5" /> Career Documentary Specialization
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Resume to Film: The CareerCanvas Integration
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
              Whether you are an aspiring intern, an independent craftsman, a creative pioneer, or an established executive, a traditional CV or resume fails to capture the true depth of your professional journey. Our direct **CareerCanvas Integration** transforms dry job histories into a cinematic chronicle of the value, services, and craft you have contributed to the world.
            </p>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                <span className="text-justify"><strong>Instant Portfolio Import:</strong> Seamlessly load professional histories, project files, patent citations, and public keynotes directly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                <span className="text-justify"><strong>Team Testimonial Voiceovers:</strong> Synthesize co-author recommendations into narrative interview sound bites.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                <span className="text-justify"><strong>Retirement and Career Legacy:</strong> Perfect for high-profile retirement celebrations or archiving organization history.</span>
              </li>
            </ul>
            <div className="pt-4 flex justify-center w-full">
              <Button
                id="learn-types-btn"
                variant="primary"
                size="lg"
                className="w-full sm:w-[210px] justify-center text-center"
                onClick={() => handlePageNavigation('story-types')}
              >
                View
              </Button>
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
              <p className="text-xs text-muted-foreground leading-relaxed italic text-justify">
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
              <p className="text-xs text-muted-foreground leading-relaxed italic text-justify">
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
              <p className="text-xs text-muted-foreground leading-relaxed italic text-justify">
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
                    <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 animate-fade-in text-justify" id={`faq-answer-${idx}`}>
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
    </div>
  );
}
