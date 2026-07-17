/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  PlayCircle, 
  Keyboard, 
  Compass, 
  Wrench, 
  MessageSquare, 
  FileText, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
  Shield
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export interface HelpArticle {
  id: string;
  category: 'getting-started' | 'tutorials' | 'guides' | 'faqs' | 'shortcuts' | 'features' | 'troubleshoot' | 'legal';
  title: string;
  excerpt: string;
  content: string;
  featured?: boolean;
  popular?: boolean;
  recentlyViewed?: boolean;
}

const HELP_ARTICLES: HelpArticle[] = [
  // Getting Started
  {
    id: 'art-1',
    category: 'getting-started',
    title: 'Welcome to ReelLegacy: Core Fundamentals',
    excerpt: 'Learn the foundational workflow of mapping memories, restoring photography, and synthesizing documentary films.',
    content: 'ReelLegacy is designed to preserve human memories via generative film. To begin, follow these simple steps:\n\n1. Create a Legacy Profile for your subject (e.g. Grandma Elizabeth).\n2. Build a Chronological Timeline of critical milestones.\n3. Upload raw photographs and voice recordings into the Media Shelf.\n4. Compose cinematic chapters with the help of the AI Director.',
    featured: true,
  },
  {
    id: 'art-2',
    category: 'getting-started',
    title: 'Setting Up Your Co-Author Workspace',
    excerpt: 'Invite family members or team archivists to review, upload assets, and collaborative edit story drafts.',
    content: 'You can co-author archives by clicking System Settings > Workspace > Collaborative Invites. Set permission roles such as lead archivist, photo restorers or read-only reviewers to keep your drafts completely safe.',
    recentlyViewed: true,
  },
  // Tutorials
  {
    id: 'art-3',
    category: 'tutorials',
    title: 'Tutorial: Restoring Damaged Vintage Photographs',
    excerpt: 'A step-by-step masterclass on utilizing AI photo enhancers to remove scratches and inject high-fidelity colors.',
    content: 'Our media shelf includes specialized deep learning pipelines to colorize, upscale, and de-scratch physical document scans automatically.\n\n1. Upload the scan inside the Media Library.\n2. Tap the "Restore Asset" action button.\n3. Preview the color-mapped rendering side by side with original.\n4. Appoint the restored file into any matching Scene chronology.',
    featured: true,
    popular: true,
  },
  {
    id: 'art-4',
    category: 'tutorials',
    title: 'Drafting Cinematic Vocal Narrations',
    excerpt: 'Learn how to map voiceover scripts to text-to-speech synthesize or upload voice captures.',
    content: 'Voice synthesis supports matching vocal tempos and regional dialects. Inside the Narration Studio, type a text outline or have the AI draft from diaries, and select one of our premium cinematic narrators.',
    popular: true,
  },
  // User Guides
  {
    id: 'art-5',
    category: 'guides',
    title: 'Managing the Cinematic Rendering Queue',
    excerpt: 'An in-depth explanation of compiler nodes, scene durations, and download export settings.',
    content: 'Once scenes have timeline cards, photos, and narration, click Render. Compilation occurs server-side and takes ~5 minutes. You can download mp4 binaries or export draft snippets safely.',
  },
  // FAQs
  {
    id: 'art-6',
    category: 'faqs',
    title: 'FAQ: Is my family database secure and private?',
    excerpt: 'Understand encryption protocols, database visibility boundaries, and public sharing controls.',
    content: 'Yes. ReelLegacy uses enterprise SSL standards and Firestore private schemas. Your archives remain fully private by default. Sharing occurs only if you explicitly toggle profile visibility to public.',
    popular: true,
    recentlyViewed: true,
  },
  {
    id: 'art-7',
    category: 'faqs',
    title: 'FAQ: What document file classes are supported?',
    excerpt: 'Review supported imagery extensions, audio formats, and document size thresholds.',
    content: 'We support PNG, JPEG, WEBP images up to 25MB, MP3 and WAV audio up to 50MB, and PDF, DOCX, TXT document scans up to 15MB.',
  },
  // Keyboard Shortcuts
  {
    id: 'art-8',
    category: 'shortcuts',
    title: 'Keyboard Hotkeys Reference Guide',
    excerpt: 'Accelerate your archiving operations with unified workspace key bindings.',
    content: 'ReelLegacy supports these rapid global key-bindings:\n\n• "/" : Focus Search Palette\n• "Esc" : Close Active Overlays / Modals\n• "Ctrl + S" : Save Active Story Drafts\n• "Ctrl + N" : Trigger New Notification scan\n• "Ctrl + Shift + L" : Toggle Light/Dark Preference theme',
    recentlyViewed: true,
  },
  // Troubleshooting
  {
    id: 'art-9',
    category: 'troubleshoot',
    title: 'Resolving AI Synthesis Safety Rejections',
    excerpt: 'Fixing script generation blocks and safety validator threshold failures.',
    content: 'The AI safety validator blocks text containing offensive terms or high-level military classifications. If synthesis aborts, modify your timeline event summaries to be simpler and exclude sensitive terms.',
  },
  // Legal & Privacy
  {
    id: 'art-legal-rules',
    category: 'legal',
    title: 'Workspace Rules: Code of Conduct & Standards',
    excerpt: 'Review our standards for authentic generative cinema co-authoring and safety outlines.',
    content: 'ReelLegacy provides a premium, safe co-authoring space for historical archiving. All workspace co-authors are expected to adhere strictly to the following rules:\n\n1. Respect Human Authenticity: Do not generate deepfakes or impersonate individuals without documented familial rights or direct consent.\n2. Protect Living Relatives: Keep personal details, private journal letters, and medical scans secure and confidential within your workspace boundary.\n3. Prevent Low-Value Slop: Focus scripts and timeline milestones on genuine, real-life biographical details rather than automated spam.\n4. Secure Invite Keys: Do not distribute workspace collaboration tokens, project credentials, or system credentials to external public domains.',
  },
  {
    id: 'art-legal-privacy',
    category: 'legal',
    title: 'Privacy Shield & User Data Deletion Rights',
    excerpt: 'How we protect uploaded memoir assets, family photography, and offer options to delete them.',
    content: 'ReelLegacy is fully committed to absolute user privacy under GDPR, CCPA, and COPPA frameworks.\n\n### What Data We Collect\n• Account Identity: Basic profile settings, usernames, emails, and permissions.\n• Biographical Metadata: Subject summaries, lineage details, and timeline milestones.\n• Heritage Media: Scanned family photos, voice narrations, letters, and home movies.\n\n### How We Use Your Data\nAll uploaded files are processed privately and used solely to restore vintage pictures, clone subject voices for memoirs, and compile rendering queues. We never sell your personal data or use private assets to train global models.\n\n### Immediate Data Deletion\nYou hold absolute sovereignty over your family records. You can request instant, permanent deletion of specific media files or close your entire workspace at any time. Use the interactive controls below to execute these requests under secure supervision.',
  },
  {
    id: 'art-legal-terms',
    category: 'legal',
    title: 'Terms of Service & Generative Cinema Agreement',
    excerpt: 'Learn about user asset ownership licenses, rendering service limits, and terminations.',
    content: 'By utilizing the ReelLegacy platform, you agree to the following terms and conditions:\n\n1. Complete Asset Ownership: You retain full, exclusive intellectual property ownership and copyrights for any file uploaded to our servers.\n2. Limited Process License: You grant ReelLegacy a restricted, non-transferable license to host, upscale, and synthesize uploaded materials exclusively for your private cinematic renders.\n3. Dedicated Compiler Usage: Cinematic compilation queues are computationally expensive. System capacities and speeds may scale dynamically depending on real-time server loads.\n4. Service Terminations: ReelLegacy reserves the absolute right to suspend or close projects that actively violate our authenticity directives, or generate deceptive visual impersonations.',
  }
];

export function HelpCenterView() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);

  // Deletion Modal states for GDPR Compliance
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'media' | 'account' | null }>({
    isOpen: false,
    type: null,
  });

  const handleTriggerDelete = (type: 'media' | 'account') => {
    setDeleteModal({ isOpen: true, type });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.type === 'media') {
      localStorage.removeItem('reellegacy_user_assets');
      showToast('error', 'All Media Deleted', 'Your custom uploaded media shelf has been completely wiped.');
    } else if (deleteModal.type === 'account') {
      localStorage.clear();
      showToast('error', 'Account Purged', 'Your profile and history have been permanently wiped from the ledger.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  // Help Categories
  const categories = [
    { id: 'all', label: 'All Help Sections', icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { id: 'getting-started', label: 'Getting Started', icon: Compass, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    { id: 'tutorials', label: 'Tutorials', icon: PlayCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { id: 'guides', label: 'User Guides', icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/20' },
    { id: 'faqs', label: 'FAQs', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
    { id: 'troubleshoot', label: 'Troubleshooting', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/20' },
    { id: 'legal', label: 'Legal & Privacy', icon: Shield, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' }
  ];

  // Filtering Logic
  const filteredArticles = useMemo(() => {
    return HELP_ARTICLES.filter((article) => {
      // Category Filter
      if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;

      // Query Search Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q) ||
          article.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const featuredArticle = useMemo(() => HELP_ARTICLES.find((a) => a.featured), []);
  const popularArticles = useMemo(() => HELP_ARTICLES.filter((a) => a.popular), []);
  const recentArticles = useMemo(() => HELP_ARTICLES.filter((a) => a.recentlyViewed), []);

  return (
    <div id="help-center-view" className="space-y-8 animate-fade-in text-foreground pb-12">
      {/* Search Jumbotron banner */}
      <div id="help-jumbotron" className="bg-gradient-to-br from-cinema-slate-900 via-cinema-slate-800 to-cinema-slate-950 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl border border-cinema-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_100%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold text-cinema-amber-400 bg-cinema-amber-500/10 px-3 py-1 rounded-full border border-cinema-amber-500/20">
            ReelLegacy Academy
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">How can we assist your archiving?</h2>
          <p className="text-sm text-cinema-slate-400">
            Search our user guides, tutorials, keyboard shortcuts, or troubleshoot compilation bottlenecks.
          </p>
          
          <div className="relative max-w-lg mx-auto" id="help-search-box">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-slate-500" />
            <input
              id="help-center-primary-input"
              type="text"
              placeholder="Search guides, FAQs, text-to-speech engines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs md:text-sm pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-cinema-slate-500 focus:outline-none focus:border-cinema-amber-500 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid: Help sections cards */}
      <div className="space-y-3" id="help-sections-block">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 pl-1">
          Explore Support Sections
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="help-categories-grid">
          {categories.slice(1).map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`help-cat-card-${cat.id}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById('articles-feed-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.01] hover:shadow-xs group cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.02]'
                    : 'border-border/60 bg-card hover:border-border'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-border mb-4 ${cat.bg}`}>
                  <CatIcon className={`w-4.5 h-4.5 ${cat.color}`} />
                </div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  {cat.label}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  Comprehensive document walkthroughs, keys & troubleshooting logs.
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Double Column: Highlighted / Recommended + Articles list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="help-content-grid">
        {/* Left column: Featured + Popular side rail */}
        <div className="lg:col-span-1 space-y-6" id="help-siderail">
          {/* Featured article */}
          {featuredArticle && (
            <div className="border border-border/80 rounded-2xl p-6 bg-card space-y-4" id="help-featured-card">
              <span className="inline-flex items-center text-[9px] uppercase tracking-wider font-bold text-cinema-ai bg-cinema-ai/10 px-2 py-0.5 rounded border border-cinema-ai/20">
                <Star className="w-3 h-3 mr-1" /> Featured Guide
              </span>
              <h4 className="font-display text-base font-bold text-foreground">
                {featuredArticle.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <button
                id="btn-read-featured"
                onClick={() => setActiveArticle(featuredArticle)}
                className="text-xs font-bold text-cinema-amber-500 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Popular topics */}
          <div className="border border-border/60 rounded-2xl p-5 bg-card/40 space-y-4" id="help-popular-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Popular Questions
            </h4>
            <div className="space-y-3.5" id="popular-topics-list">
              {popularArticles.map((art) => (
                <button
                  key={art.id}
                  id={`popular-art-${art.id}`}
                  onClick={() => setActiveArticle(art)}
                  className="w-full text-left text-xs font-semibold text-foreground/85 hover:text-cinema-amber-500 transition-colors cursor-pointer line-clamp-2"
                >
                  {art.title}
                </button>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="border border-border/60 rounded-2xl p-5 bg-card/40 space-y-4" id="help-recent-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              Recently Visited
            </h4>
            <div className="space-y-2.5" id="recent-articles-list">
              {recentArticles.map((art) => (
                <button
                  key={art.id}
                  id={`recent-art-${art.id}`}
                  onClick={() => setActiveArticle(art)}
                  className="w-full text-left text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer block truncate"
                >
                  {art.title}
                </button>
              ))}
            </div>
          </div>

          {/* Legal Documents */}
          <div className="border border-border/60 rounded-2xl p-5 bg-card/40 space-y-4" id="help-legal-links-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              Legal & Compliance
            </h4>
            <div className="space-y-2.5" id="legal-articles-list">
              <button
                id="btn-help-privacy"
                onClick={() => {
                  const privacyArt = HELP_ARTICLES.find(a => a.id === 'art-legal-privacy');
                  if (privacyArt) setActiveArticle(privacyArt);
                }}
                className="w-full text-left text-[11px] text-cinema-amber-500 hover:underline transition-colors cursor-pointer block"
              >
                Privacy Policy & Deletion Rights
              </button>
              <button
                id="btn-help-terms"
                onClick={() => {
                  const termsArt = HELP_ARTICLES.find(a => a.id === 'art-legal-terms');
                  if (termsArt) setActiveArticle(termsArt);
                }}
                className="w-full text-left text-[11px] text-cinema-amber-500 hover:underline transition-colors cursor-pointer block"
              >
                Terms of Service & Licensing
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Filterable articles list */}
        <div className="lg:col-span-2 space-y-4Scroll" id="articles-feed-section">
          <div className="flex items-center justify-between border-b border-border/60 pb-3" id="articles-feed-header">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              {selectedCategory === 'all' ? 'All Reference Docs' : `${categories.find((c) => c.id === selectedCategory)?.label} Articles`}
            </h3>
            {selectedCategory !== 'all' && (
              <button
                id="btn-reset-help-cat"
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-cinema-amber-500 hover:underline font-semibold"
              >
                Show All
              </button>
            )}
          </div>

          <div className="space-y-3" id="help-articles-feed">
            {filteredArticles.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground" id="help-search-empty">
                <p className="text-sm font-semibold">No helpful results match "{searchQuery}"</p>
                <p className="text-xs mt-1">Review spelling or browse categories above for answers.</p>
              </div>
            ) : (
              filteredArticles.map((article) => {
                const cat = categories.find((c) => c.id === article.category) || categories[0];
                const CatIcon = cat.icon;

                return (
                  <div
                    key={article.id}
                    id={`article-item-${article.id}`}
                    onClick={() => setActiveArticle(article)}
                    className="p-5 rounded-2xl border border-border/60 hover:border-border bg-card/50 hover:bg-card transition-all cursor-pointer flex gap-4"
                  >
                    <div className={`w-8 h-8 rounded-lg border border-border shrink-0 flex items-center justify-center ${cat.bg}`}>
                      <CatIcon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0" id={`article-item-info-${article.id}`}>
                      <div className="flex items-center justify-between" id={`article-item-header-${article.id}`}>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono">
                          {cat.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Contact Support placeholder footer */}
          <div className="p-6 border border-border bg-card rounded-2xl text-center space-y-4 mt-8" id="contact-support-banner">
            <div className="w-10 h-10 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500 flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Still need guidance?</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Our support team and senior genealogists can help synchronize missing memories or review rendering compiler blocks.
              </p>
            </div>
            <Button
              id="btn-contact-support-ph"
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast('success', 'Ticket Support Draft initialized', 'Type in details on the next portal prompt.');
              }}
            >
              Contact Support Co-Author
            </Button>
          </div>
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <div id="help-modal-detail-reader" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveArticle(null)} />
          <div className="bg-card border border-border p-6 rounded-2xl max-w-lg w-full relative z-10 space-y-5 shadow-2xl text-foreground">
            <div className="flex justify-between items-center pb-3 border-b border-border/60">
              <span className="text-[10px] uppercase font-bold text-cinema-amber-500 font-mono tracking-wider">
                ReelLegacy Academy Library
              </span>
              <button
                id="btn-close-help-reader"
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setActiveArticle(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3" id="help-reader-body">
              <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                {activeArticle.title}
              </h3>
              <p className="text-xs text-muted-foreground italic">
                {activeArticle.excerpt}
              </p>
              <div className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-xl border border-border/40 font-medium">
                {activeArticle.content}
              </div>

              {activeArticle.id === 'art-legal-privacy' && (
                <div className="mt-4 p-4 rounded-xl border border-red-500/10 dark:border-red-500/20 bg-red-500/5 space-y-3 animate-fade-in" id="help-reader-gdpr-box">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-red-500" /> GDPR & CCPA Deletion Panel
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Under the Privacy Shield framework, you retain sovereign rights to erase any personal history and uploaded files stored in your co-author workspace.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1" id="gdpr-action-buttons">
                    <button
                      id="btn-gdpr-delete-media"
                      onClick={() => handleTriggerDelete('media')}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Delete Media Shelf
                    </button>
                    <button
                      id="btn-gdpr-delete-account"
                      onClick={() => handleTriggerDelete('account')}
                      className="px-3 py-2 border border-red-500/20 dark:border-red-500/30 hover:bg-red-500/10 text-red-500 text-[10px] uppercase tracking-wider font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                id="btn-reader-dismiss"
                variant="secondary"
                size="sm"
                onClick={() => setActiveArticle(null)}
              >
                Done Reading
              </Button>
              <Button
                id="btn-reader-helpful"
                variant="accent"
                size="sm"
                onClick={() => {
                  showToast('success', 'Thank you for your feedback!');
                  setActiveArticle(null);
                }}
              >
                This was helpful
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Data Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.type === 'media' ? 'Delete Uploaded Media Shelf?' : 'Permanently Delete Workspace Account?'}
        message={
          deleteModal.type === 'media'
            ? 'This will permanently destroy all custom imagery, voiceover narrations, home films, and historical documents uploaded to your vault. All chronological story chapter associations will be unlinked.'
            : 'This will instantly terminate your ReelLegacy co-author access, and wipe all your custom biography logs, stories, and historical parameters from our system ledger.'
        }
      />
    </div>
  );
}
