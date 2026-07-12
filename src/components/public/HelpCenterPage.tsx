/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Camera,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Video,
  FileText,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

interface HelpCenterPageProps {
  setCurrentPage: (page: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export function HelpCenterPage({ setCurrentPage, onOpenAuth }: HelpCenterPageProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const popularQuestions = [
    'How do I invite a family member to co-author a story?',
    'What audio formats are supported in the Narration Studio?',
    'How does the CareerCanvas integration synchronization work?',
    'Is my private personal media used to train AI models?',
    'What is the standard rendering time for a 4K legacy documentary?'
  ];

  const docCategories = [
    {
      id: 'get-started',
      icon: <BookOpen className="w-5 h-5 text-cinema-amber-500" />,
      title: 'Getting Started',
      count: '6 articles',
      desc: 'Learn how to register, initiate your first timeline, and pick the best story type.'
    },
    {
      id: 'creation',
      icon: <Video className="w-5 h-5 text-cinema-amber-500" />,
      title: 'Story Creation Guides',
      count: '12 articles',
      desc: 'Master chapter structure, interview question prompts, and chronology editing.'
    },
    {
      id: 'media',
      icon: <Camera className="w-5 h-5 text-cinema-amber-500" />,
      title: 'Media Vault & Clippings',
      count: '8 articles',
      desc: 'Best practices for scanning old photos, labeling files, and mapping locations.'
    },
    {
      id: 'ai-guides',
      icon: <Sparkles className="w-5 h-5 text-cinema-ai" />,
      title: 'AI Storyteller Guides',
      count: '9 articles',
      desc: 'Configuring synthesized voices, selecting literary styles, and reviewing drafts.'
    },
    {
      id: 'security-privacy',
      icon: <ShieldAlert className="w-5 h-5 text-cinema-amber-500" />,
      title: 'Privacy & Archiving Security',
      count: '5 articles',
      desc: 'Understand data encryption, backup redundant zones, and family export rights.'
    },
    {
      id: 'integration',
      icon: <FileText className="w-5 h-5 text-cinema-ai" />,
      title: 'CareerCanvas & API',
      count: '7 articles',
      desc: 'Step-by-step instructions for porting professional histories and transcripts.'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Simulate finding a matching article
    showToast('info', `Searching for: "${searchQuery}"`, 'We are filtering our help center indexes...');
    
    setTimeout(() => {
      setSearchResults([
        `Archived Guide: Optimizing parameters for "${searchQuery}"`,
        `Frequently Asked Questions regarding "${searchQuery}"`,
        `Advanced tutorials: Integrating "${searchQuery}" into custom scripts`
      ]);
    }, 800);
  };

  const handlePageNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="help-center-page" className="w-full bg-background relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Search / Hero Header Section */}
        <div className="bg-cinema-slate-950 text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 mb-16 border border-cinema-slate-900 shadow-xl">
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              How can we assist your storytelling journey?
            </h1>
            <p className="text-xs sm:text-sm text-cinema-slate-400 max-w-lg mx-auto">
              Search our documentation categories or review popular questions below.
            </p>
          </div>

          {/* Search Form Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center bg-cinema-slate-900 border border-cinema-slate-800 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-cinema-amber-500" id="help-search-form">
            <Search className="w-4 h-4 text-cinema-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) setSearchResults([]);
              }}
              placeholder="Search guides (e.g. transcribing tapes, CareerCanvas, audio formats...)"
              className="w-full text-xs text-white bg-transparent focus:outline-none placeholder:text-cinema-slate-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-cinema-amber-500 text-cinema-slate-950 rounded-lg text-xs font-bold hover:bg-cinema-amber-400 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Search Results Display */}
          {searchResults.length > 0 && (
            <div className="max-w-xl mx-auto p-4 bg-cinema-slate-900/60 border border-cinema-slate-800 rounded-xl text-left space-y-2.5 animate-fade-in" id="search-results-box">
              <span className="text-[9px] font-bold text-cinema-amber-500 uppercase tracking-widest block">Search Results</span>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => showToast('info', 'Article coming soon', 'This specific guide will be compiled in downstream documentation updates.')}
                  className="w-full text-left text-xs font-semibold text-cinema-slate-300 hover:text-white hover:underline block cursor-pointer"
                >
                  {res}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Questions Row */}
        <div className="max-w-4xl mx-auto space-y-4 text-left mb-20" id="popular-questions-box">
          <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4.5 h-4.5 text-cinema-amber-500" /> Popular Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="popular-qs-grid">
            {popularQuestions.map((q, idx) => (
              <button
                key={idx}
                id={`popular-q-${idx}`}
                onClick={() => {
                  showToast('info', 'Frequently Asked Question', `Navigating to documentation matching: "${q}"`);
                  handlePageNavigation('faq');
                }}
                className="p-4 bg-card border border-border rounded-xl text-left hover:border-cinema-amber-500/50 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
                  {q}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cinema-amber-500 transition-colors shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Categories Grid */}
        <div className="max-w-5xl mx-auto space-y-6 text-left mb-20" id="documentation-categories">
          <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
            Documentation Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="categories-grid">
            {docCategories.map((cat) => (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                className="p-6 bg-card border border-border rounded-2xl hover:shadow-sm transition-shadow text-left space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-muted/65 flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold uppercase">
                    {cat.count}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <button
                  onClick={() => showToast('info', `${cat.title} Guides`, 'Full compilation tutorials will launch inside downstream help updates.')}
                  className="text-xs font-semibold text-cinema-amber-600 dark:text-cinema-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Browse Category <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support CTA Shortcut */}
        <div className="max-w-4xl mx-auto p-6 bg-muted/20 border border-border rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left" id="help-support-footer">
          <div className="md:col-span-8 space-y-1.5">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">
              Still have unresolved questions?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our professional legacy archivists are available to guide you. Speak to a live team member for personal writing support, media scanning consultations, or enterprise project setups.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end gap-3" id="help-support-btns">
            <Button
              id="help-contact-btn"
              variant="primary"
              size="sm"
              onClick={() => handlePageNavigation('contact')}
              leftIcon={<Mail className="w-4 h-4" />}
            >
              Contact Support
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
