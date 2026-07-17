/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Database, Shield, BookOpen, CreditCard } from 'lucide-react';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const faqCategories = [
    {
      id: 'general',
      title: 'General Inquiries',
      icon: <BookOpen className="w-4 h-4 text-cinema-amber-500" />,
      questions: [
        {
          id: 'gen-1',
          q: 'What is ReelLegacy?',
          a: 'ReelLegacy is an AI-assisted biography and corporate archiving platform developed by IdeaCodex Labs. We help users transcribe audio files, organize ancestral photos, structure chronology timelines, and compile high-definition biographical documentaries or hardcover memoir books.'
        },
        {
          id: 'gen-2',
          q: 'Is this an authenticated app or a public portal?',
          a: 'This website is the public informational portal and marketing page of the ReelLegacy product. If you click "Get Started" or "Sign In", you can interact with our simulated registration flow to understand the interface and begin drafting your memory structures.'
        }
      ]
    },
    {
      id: 'documentary',
      title: 'Documentary Creation',
      icon: <HelpCircle className="w-4 h-4 text-cinema-amber-500" />,
      questions: [
        {
          id: 'doc-1',
          q: 'What is the Ken Burns animation style applied to photos?',
          a: 'The Ken Burns effect is a panning and zooming animation technique used in documentary filmmaking to make flat static photographs appear dimensional and fluid. Our rendering compiler automatically applies subtle, professional panning frames synchronized with the timing of your script narration.'
        },
        {
          id: 'doc-2',
          q: 'How long does a documentary take to render?',
          a: 'Typically, a standard 20-minute biography segment is fully compiled and rendered in 4K resolution within 8 to 12 minutes in our high-capacity media clouds. You will receive an email and in-dashboard toast notification once the MP4 export job completes.'
        },
        {
          id: 'doc-3',
          q: 'Can I choose my own soundtrack style?',
          a: 'Yes. Our integrated media catalog offers licensed cinematic background tracks across multiple moods: nostalgic piano, historical orchestral, ambient acoustic, or smart electronic, all pre-mixed for proper volume ducking during voice narrations.'
        }
      ]
    },
    {
      id: 'ai-assistant',
      title: 'AI Storyteller & Synthesis',
      icon: <Sparkles className="w-4 h-4 text-cinema-ai" />,
      questions: [
        {
          id: 'ai-1',
          q: 'Does the AI invent or modify my original memoirs?',
          a: 'No. Our strict structural design patterns ensure the AI functions strictly as a factual indexer and copyeditor. It corrects typographical errors, parses dates, and formats sentences according to your chosen literary style (e.g. Classical Biography, Swiss Minimal), but it never hallucinates or introduces fictional narrative parameters.'
        },
        {
          id: 'ai-2',
          q: 'What is the Biography Generator?',
          a: 'The Biography Generator is a core system that reads unorganized transcripts of grandparent interviews or journal logs, automatically categorizing them into thematic and chronological chapters (e.g., Childhood, Career Breakthroughs, Retrospective Wisdom).'
        },
        {
          id: 'ai-3',
          q: 'Can I record voice tracks in my own voice?',
          a: 'Absolutely. You can use our online Narration Studio to record direct high-fidelity voice-overs, or upload existing home video soundtracks. Alternatively, select one of our professional, warm AI-synthetic narrators to read your structured script.'
        }
      ]
    },
    {
      id: 'careercanvas',
      title: 'CareerCanvas Integration',
      icon: <Database className="w-4 h-4 text-cinema-ai" />,
      questions: [
        {
          id: 'cc-1',
          q: 'How do CareerCanvas and ReelLegacy work together?',
          a: 'Both platforms are designed synergistically by IdeaCodex Labs. CareerCanvas handles professional transcripts, portfolio artifacts, and team citation indexes. ReelLegacy bridges that repository, importing milestones directly into a specialized "Career Documentary" format, making legacy films easy to compile.'
        },
        {
          id: 'cc-2',
          q: 'Do I need a separate account for CareerCanvas?',
          a: 'Yes, but you can link your existing CareerCanvas account with a single click inside the ReelLegacy media settings workspace. This pre-synchronizes credentials and timeline files securely.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Media Vault & Privacy parameters',
      icon: <Shield className="w-4 h-4 text-cinema-amber-500" />,
      questions: [
        {
          id: 'pri-1',
          q: 'Is my personal archive and family media secure?',
          a: 'Security is our core engineering mandate. All uploads, transcriptions, and rendered documentaries are fully encrypted in transit and at rest using enterprise-grade AES-256 protocols. Your files are redundantly backed up across three distinct secure regional zones.'
        },
        {
          id: 'pri-2',
          q: 'Do you use my private audio or scans to train public models?',
          a: 'Absolutely not. ReelLegacy has strict privacy guardrails. No personal audio files, transcripts, letters, photos, or completed documentaries are ever stored outside your personal vault or utilized to train general AI systems.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Pricing & Billing',
      icon: <CreditCard className="w-4 h-4 text-cinema-amber-500" />,
      questions: [
        {
          id: 'bill-1',
          q: 'Is there a free tier for drafting timelines?',
          a: 'Yes! Our baseline tier allows you to build standard chronological timelines, draft unlimited chapter scripts, and upload up to 2GB of media assets. No credit card is required to begin preserving your legacy.'
        },
        {
          id: 'bill-2',
          q: 'What is included in the premium licensing?',
          a: 'Premium licenses unlock professional 4K documentary rendering jobs, unlimited voice narration synthesis hours, CareerCanvas synchronization bridges, and high-quality printed biography booklets.'
        }
      ]
    }
  ];

  return (
    <div id="faq-page" className="w-full bg-background relative py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="faq-header">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
            <HelpCircle className="w-3.5 h-3.5" /> Documentation Repository
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Search our categorized repository to find answers on timeline builders, media formats, rendering clouds, and privacy parameters.
          </p>
        </div>

        {/* Categories accordion sections */}
        <div className="space-y-12 text-left" id="faq-categories-list">
          {faqCategories.map((category) => (
            <div key={category.id} id={`faq-group-${category.id}`} className="space-y-4">
              {/* Category Divider Header */}
              <div className="flex items-center gap-2 border-b border-border pb-2" id={`faq-group-head-${category.id}`}>
                {category.icon}
                <h2 className="font-display text-base font-bold text-foreground">
                  {category.title}
                </h2>
              </div>

              {/* Category Questions List */}
              <div className="space-y-3" id={`faq-group-questions-${category.id}`}>
                {category.questions.map((faq) => {
                  const isOpen = openIndex === faq.id;
                  return (
                    <div
                      key={faq.id}
                      id={`faq-item-${faq.id}`}
                      className="bg-card border border-border rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        id={`faq-trigger-${faq.id}`}
                        className="w-full flex items-center justify-between px-5 py-4 text-xs sm:text-sm font-semibold text-foreground text-left cursor-pointer hover:bg-muted/30"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-cinema-amber-500' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 animate-fade-in text-justify" id={`faq-answer-${faq.id}`}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
