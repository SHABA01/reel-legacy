/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight,
  X,
  Shield,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  Printer,
  ExternalLink,
  Layers,
  Zap,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertTriangle,
  History,
  LifeBuoy,
  Send,
  CheckSquare,
  Filter,
  Flame,
  Award,
  Sparkle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useInspector } from '../../context/InspectorContext';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { EmptyState } from '../ui/EmptyState';

export interface HelpArticle {
  id: string;
  category: 'getting-started' | 'tutorials' | 'guides' | 'workflows' | 'troubleshoot' | 'faqs' | 'shortcuts' | 'legal' | 'release-notes' | 'support';
  title: string;
  excerpt: string;
  content: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime?: string;
  lastUpdated?: string;
  featured?: boolean;
  popular?: boolean;
  recentlyViewed?: boolean;
  relatedIds?: string[];
  callout?: { title: string; body: string };
  steps?: string[];
}

const POPULAR_SEARCH_CHIPS = [
  'Story Studio',
  '4K Rendering',
  'Narration Studio',
  'Media Library',
  'Legacy Profiles',
  'Keyboard Shortcuts',
  'Google Drive'
];

const HELP_ARTICLES: HelpArticle[] = [
  // Getting Started
  {
    id: 'art-1',
    category: 'getting-started',
    title: 'Welcome to ReelLegacy: Core Archiving Fundamentals',
    excerpt: 'Learn the foundational workflow of mapping memories, restoring photography, and synthesizing documentary films.',
    content: `ReelLegacy is engineered to preserve human biographical heritage through generative cinema. To produce your first heirloom documentary film, follow this foundational progression:

1. **Create a Legacy Profile**: Establish a biographical anchor for your subject (e.g., "Elizabeth Vance 1932–2024").
2. **Build a Chronological Timeline**: Map pivotal life chapters, marriage milestones, and oral history transcripts.
3. **Upload Heritage Media**: Drag and drop physical photo scans, letters, and cassette audio tapes into the Media Library.
4. **Compose Cinematic Chapters**: Use the AI Director to generate script outlines and pair them with restored imagery.
5. **Compile 4K Master Exports**: Queue server-side renders to produce studio-grade MP4 documentary films.`,
    difficulty: 'Beginner',
    readTime: '3 min read',
    lastUpdated: 'July 2026',
    featured: true,
    popular: true,
    callout: {
      title: 'Pro Tip for Archival Quality',
      body: 'Always scan physical photos at 600 DPI or higher. ReelLegacy AI upscale models achieve 4K restoration fidelity best when initial document details are preserved.'
    },
    steps: [
      'Create a Legacy Subject Profile',
      'Add 3 pivotal historical events to Timeline',
      'Upload 5 vintage photographs',
      'Generate initial AI script outline'
    ]
  },
  {
    id: 'art-2',
    category: 'getting-started',
    title: 'Setting Up Your Family Co-Author Workspace',
    excerpt: 'Invite family archivists or team historians to review drafts, upload assets, and collaborate on story scripts.',
    content: `Collaborative archiving keeps family stories complete across generations. You can invite co-authors with defined role permissions:

- **Lead Archivist**: Full administrative rights, workspace settings, and rendering permissions.
- **Photo Restorer**: Access to upload imagery, run restoration models, and organize albums.
- **Script Reviewer**: Comment-only access to review chapter scripts and verify historical accuracy.

To invite co-authors, navigate to **Settings > Workspace > Collaborative Invites** and enter your collaborator's email.`,
    difficulty: 'Beginner',
    readTime: '2 min read',
    lastUpdated: 'June 2026',
    recentlyViewed: true,
    steps: [
      'Navigate to Workspace Settings',
      'Select Co-Author Invites',
      'Specify collaborator email and permission role',
      'Send encrypted invite key'
    ]
  },

  // Tutorials
  {
    id: 'art-3',
    category: 'tutorials',
    title: 'Masterclass: Restoring Damaged Vintage Photographs',
    excerpt: 'A step-by-step tutorial on utilizing deep AI enhancers to remove scratches, restore contrast, and colorize monochrome film.',
    content: `Physical paper photographs suffer from fading, moisture spots, and surface tears over decades. ReelLegacy includes specialized restoration pipelines:

### Step 1: Upload Scan to Media Library
Drag your photo scan into the Media Shelf. Supported formats include high-res PNG, JPEG, and TIFF up to 50MB.

### Step 2: Trigger AI Restoration Pipeline
Click on the asset and tap **Restore & Enhance**. Choose your pipeline options:
- **De-Scratch**: Fills surface cracks and crease marks.
- **4K Upscale**: Re-synthesizes sharpness using deep neural filters.
- **Historical Colorization**: Maps realistic color tones based on period costume datasets.

### Step 3: Verify Side-by-Side Render
Inspect the split-screen before/after comparison to verify historical accuracy before assigning the photo to a Scene.`,
    difficulty: 'Intermediate',
    readTime: '5 min read',
    lastUpdated: 'July 2026',
    featured: true,
    popular: true,
    callout: {
      title: 'Historical Tone Matching',
      body: 'When colorizing photos from the 1940s, select "Period Vintage" palette mode to preserve authentic Kodachrome color signatures.'
    }
  },
  {
    id: 'art-4',
    category: 'tutorials',
    title: 'Synthesizing Neural Voice Narration Studio',
    excerpt: 'Learn how to generate studio-grade vocal narrations using custom voice cloning or regional accent presets.',
    content: `Voiceover brings historical text to life. In Narration Studio, you can generate natural cinematic voiceovers:

1. **Select Vocal Profile**: Choose from pre-trained narrator voices or clone a subject's authentic voice from cassette interviews.
2. **Import Script Text**: Paste diary entries, oral history transcripts, or AI-generated chapter outlines.
3. **Pacing & Tone Tuning**: Adjust narration speed (0.8x - 1.2x), emphasis nodes, and emotional resonance.
4. **Generate Audio Stems**: Render WAV audio stems ready for multi-track timeline alignment.`,
    difficulty: 'Intermediate',
    readTime: '4 min read',
    lastUpdated: 'July 2026',
    popular: true
  },

  // Feature Guides
  {
    id: 'art-5',
    category: 'guides',
    title: 'Deep Dive: Managing the Cinematic Rendering Queue',
    excerpt: 'An in-depth explanation of compiler nodes, scene durations, 4K export presets, and download package binaries.',
    content: `The Render Queue orchestrates server-side video compilation. When you submit a story for rendering:

- **Compilation Nodes**: Our distributed GPU clusters assemble image keyframes, narration stems, background music, and motion transitions into a seamless video file.
- **Export Presets**: Choose between 1080p Web Stream, 4K Master Archive (Pro), or ProRes Master for television projection.
- **Error Recovery**: If an audio stem or image asset fails during render, the Render Queue flags the specific Scene node for quick re-linking.`,
    difficulty: 'Advanced',
    readTime: '6 min read',
    lastUpdated: 'May 2026'
  },
  {
    id: 'art-6',
    category: 'guides',
    title: 'Story Studio: Script Outlining & AI Director',
    excerpt: 'Explore how the AI Director analyzes uploaded letters and timeline milestones to draft cinematic scripts.',
    content: `Story Studio is the central narrative engine of ReelLegacy. It combines human biographical data with AI narrative structure:

- **Chronology Sync**: Automatically arranges scenes based on historical dates.
- **Dialogue Suggestions**: Generates period-accurate voiceover scripts.
- **Visual Cue Pairing**: Suggests uploaded photographs that best fit each narration line.`,
    difficulty: 'Intermediate',
    readTime: '4 min read',
    lastUpdated: 'June 2026',
    popular: true
  },

  // Workflows
  {
    id: 'art-7',
    category: 'workflows',
    title: 'Workflow: Converting Oral Cassette Tapes to 4K Film',
    excerpt: 'End-to-end workflow for taking raw audio recordings and turning them into fully produced films.',
    content: `Transform cassette interview tapes into cinematic documentaries with this 4-step end-to-end workflow:

1. **Audio Import & Clean**: Upload cassette MP3 or WAV files into Narration Studio for automated acoustic noise reduction.
2. **Automated Transcription**: The AI engine converts spoken words into indexed text transcripts.
3. **Story Outline Mapping**: Select key quotes to automatically generate Scene cards in Story Studio.
4. **Visual Pairing & Render**: Pair each quote with restored family photos and trigger 4K rendering.`,
    difficulty: 'Intermediate',
    readTime: '5 min read',
    lastUpdated: 'July 2026'
  },

  // Troubleshooting
  {
    id: 'art-8',
    category: 'troubleshoot',
    title: 'Resolving AI Synthesis & Safety Filter Rejections',
    excerpt: 'Fixing script generation blocks, missing audio stems, and timeline chronology conflict errors.',
    content: `If AI Director script generation or rendering halts, check these common causes:

- **Safety Validator Blocks**: Text containing sensitive military classification terminology or restricted language will trigger automated safety pauses. Simplify script language to biographical facts.
- **Missing Audio Stem**: If 4K export fails at 80%+, verify that all narration audio stems in Scene 3 or 4 are fully rendered and linked.
- **Timeline Date Overlaps**: Conflicting birth/death dates in Legacy Profiles can cause timeline sync errors. Use Timeline Chronology to verify date order.`,
    difficulty: 'Intermediate',
    readTime: '3 min read',
    lastUpdated: 'July 2026'
  },

  // FAQs
  {
    id: 'art-9',
    category: 'faqs',
    title: 'FAQ: Is my family record database completely secure & private?',
    excerpt: 'Understand enterprise encryption standards, access boundaries, and private schema defaults.',
    content: `Yes. All archives in ReelLegacy are private by default under enterprise SSL and encrypted storage schemas.

- **Private Schemas**: Your photos, scripts, and audio recordings are only visible to authenticated members of your workspace.
- **No Global AI Training**: Private assets are never used to train public machine learning models.
- **Granular Sharing**: You control whether to keep stories strictly private, share via encrypted link, or publish to family archives.`,
    difficulty: 'Beginner',
    readTime: '2 min read',
    lastUpdated: 'July 2026',
    popular: true,
    recentlyViewed: true
  },
  {
    id: 'art-10',
    category: 'faqs',
    title: 'FAQ: What file formats and upload size limits are supported?',
    excerpt: 'Review supported imagery extensions, audio formats, video clips, and document size thresholds.',
    content: `ReelLegacy supports the following media formats and upload thresholds:

- **Imagery**: PNG, JPEG, WEBP, TIFF (up to 50 MB per file).
- **Audio Narrations**: MP3, WAV, AAC, M4A (up to 100 MB per file).
- **Documents & Letters**: PDF, TXT, DOCX scans (up to 25 MB per file).
- **Video Clips**: MP4, MOV (up to 500 MB per clip).`,
    difficulty: 'Beginner',
    readTime: '2 min read',
    lastUpdated: 'May 2026'
  },

  // Keyboard Shortcuts
  {
    id: 'art-11',
    category: 'shortcuts',
    title: 'Keyboard Hotkeys & Navigation Reference Guide',
    excerpt: 'Accelerate your archiving operations with unified global key bindings across the entire workspace.',
    content: `Master keyboard hotkeys to navigate ReelLegacy effortlessly:

• **/** : Focus Global Search Palette
• **Esc** : Close Active Overlays, Modals or Reader
• **Ctrl + S** : Save Current Story Draft
• **Ctrl + N** : Quick Notification Check
• **Ctrl + Shift + L** : Toggle Light / Dark Visual Theme
• **Spacebar** : Play / Pause Active Narration Preview`,
    difficulty: 'Beginner',
    readTime: '2 min read',
    lastUpdated: 'July 2026',
    recentlyViewed: true
  },

  // Privacy & Legal
  {
    id: 'art-12',
    category: 'legal',
    title: 'Privacy Shield & User Data Sovereignty Rights',
    excerpt: 'How ReelLegacy protects uploaded heritage assets, family photography, and offers options to execute permanent data deletion.',
    content: `ReelLegacy is fully committed to absolute user privacy and compliance under GDPR, CCPA, and COPPA frameworks.

### What Data We Collect
• **Account Credentials**: Basic profile names, emails, and workspace permissions.
• **Biographical Metadata**: Subject summaries, lineage details, and timeline milestones.
• **Heritage Media**: Scanned family photos, voice narrations, letters, and home movies.

### How We Protect Your Assets
All uploaded files are processed privately and used solely to restore vintage pictures, clone subject voices for memoirs, and compile rendering queues. We never sell your personal data or use private assets to train global models.

### Immediate Data Deletion
You hold absolute sovereignty over your family records. You can request instant, permanent deletion of specific media files or purge your entire workspace at any time using our interactive privacy controls below.`,
    difficulty: 'Beginner',
    readTime: '3 min read',
    lastUpdated: 'July 2026'
  },
  {
    id: 'art-13',
    category: 'legal',
    title: 'Terms of Service & Generative Cinema Agreement',
    excerpt: 'Learn about user asset ownership rights, rendering queue service limits, and workspace co-author rules.',
    content: `By utilizing ReelLegacy, you agree to the following terms and guidelines:

1. **Complete Asset Ownership**: You retain full, exclusive intellectual property ownership for any photo, text, or audio file uploaded to our platform.
2. **Authenticity Directive**: Users agree not to create deepfakes or impersonate individuals without documented familial rights or consent.
3. **Compiler Usage**: Rendering queues are shared computational resources. System speeds scale dynamically depending on real-time server load.`,
    difficulty: 'Beginner',
    readTime: '3 min read',
    lastUpdated: 'July 2026'
  },

  // Release Notes
  {
    id: 'art-14',
    category: 'release-notes',
    title: 'Release Notes: v2.8 "Ecosystem Harmony & Operations Center"',
    excerpt: 'Discover new features including 4K render queue auto-fix, Inspector Panel integration, and Help Center refactor.',
    content: `Version 2.8 introduces major workspace performance and architectural improvements:

- **Help Center Refactor**: Transformed into a Knowledge Hub with interactive learning components and search focus.
- **Operations Center**: Centralized inbox for render queue alerts, AI synthesis notifications, and security logs.
- **Inspector Context Panel**: Instant side-by-side inspection for articles, notifications, and media assets.
- **4K Upscaling Pipeline**: 25% faster photo restoration using optimized neural GPU nodes.`,
    difficulty: 'Beginner',
    readTime: '2 min read',
    lastUpdated: 'July 2026'
  }
];

const AI_SAMPLE_QUESTIONS = [
  { q: 'How do I create my first heirloom film?', artId: 'art-1' },
  { q: 'How do I restore damaged vintage photos?', artId: 'art-3' },
  { q: 'Why did my 4K render fail?', artId: 'art-8' },
  { q: 'How do I invite family members as co-authors?', artId: 'art-2' },
  { q: 'Is my family record data private?', artId: 'art-9' }
];

export function HelpCenterView() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setSelection, setRightPanelOpen } = useInspector();

  // Primary State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['art-1', 'art-3']);
  const [readArticleIds, setReadArticleIds] = useState<string[]>(['art-1']);

  // AI Assistant Drawer
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // FAQ Accordion Collapsed States
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('art-9');

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
      showToast('error', 'All Media Shelf Assets Deleted', 'Your custom uploaded media shelf has been completely wiped.');
    } else if (deleteModal.type === 'account') {
      localStorage.clear();
      showToast('error', 'Account Purged', 'Your profile and history have been permanently wiped from the ledger.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  // Workspace Nav Tabs Meta
  const navTabs = [
    { id: 'all', label: 'All Knowledge', icon: Layers },
    { id: 'getting-started', label: 'Getting Started', icon: Compass },
    { id: 'tutorials', label: 'Tutorials', icon: PlayCircle },
    { id: 'guides', label: 'Feature Guides', icon: BookOpen },
    { id: 'workflows', label: 'Workflows', icon: Zap },
    { id: 'troubleshoot', label: 'Troubleshooting', icon: Wrench },
    { id: 'faqs', label: 'FAQs', icon: FileText },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'legal', label: 'Privacy & Legal', icon: Shield },
    { id: 'release-notes', label: 'Release Notes', icon: Sparkles },
    { id: 'support', label: 'Contact Support', icon: LifeBuoy }
  ];

  // Filtering Logic
  const filteredArticles = useMemo(() => {
    return HELP_ARTICLES.filter((article) => {
      // Tab Filter
      if (activeTab !== 'all' && article.category !== activeTab) return false;

      // Query Search Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q) ||
          article.content.toLowerCase().includes(q) ||
          (article.category && article.category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [searchQuery, activeTab]);

  const featuredArticles = useMemo(() => HELP_ARTICLES.filter((a) => a.featured), []);
  const popularArticles = useMemo(() => HELP_ARTICLES.filter((a) => a.popular), []);
  const recentArticles = useMemo(() => HELP_ARTICLES.filter((a) => a.recentlyViewed), []);

  const handleOpenArticle = (article: HelpArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveArticle(article);
    if (!readArticleIds.includes(article.id)) {
      setReadArticleIds((prev) => [...prev, article.id]);
    }
    // Connect to Context Panel Inspector
    setSelection('help', article);
    setRightPanelOpen(true);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast('info', bookmarkedIds.includes(id) ? 'Bookmark removed' : 'Article saved to bookmarks');
  };

  const handleAiAsk = (queryText: string) => {
    setAiQuery(queryText);
    showToast('info', 'AI Companion searching documentation...', 'Analyzing ReelLegacy Knowledge Base');
    setTimeout(() => {
      if (queryText.toLowerCase().includes('first') || queryText.toLowerCase().includes('heirloom') || queryText.toLowerCase().includes('create')) {
        setAiAnswer('To create your first film: 1) Create a Subject Legacy Profile, 2) Build a 3-event timeline, 3) Upload photo scans, and 4) Use AI Director in Story Studio to generate scripts.');
      } else if (queryText.toLowerCase().includes('photo') || queryText.toLowerCase().includes('restore') || queryText.toLowerCase().includes('vintage')) {
        setAiAnswer('In Media Library, click any photo scan and select "Restore & Enhance". The AI applies scratch removal, 4K upscaling, and period-accurate colorization.');
      } else if (queryText.toLowerCase().includes('render') || queryText.toLowerCase().includes('fail')) {
        setAiAnswer('Render failures are usually caused by missing audio stems in Scene 3/4 or safety validator blocks. Check Scene audio links in Story Studio or run Auto-Fix in Operations Center.');
      } else {
        setAiAnswer(`Based on ReelLegacy documentation: ${queryText} is fully supported across Story Studio, Narration Studio, and Render Queue. Refer to our step-by-step guides below.`);
      }
    }, 600);
  };

  return (
    <div id="help-center-knowledge-hub" className="space-y-6 animate-fade-in text-foreground pb-16 pt-2 md:pt-4">
      {/* SECTION 1: KNOWLEDGE HUB HERO SECTION (SEARCH-CENTRIC) */}
      <div id="help-hero-banner" className="bg-gradient-to-br from-cinema-slate-900 via-cinema-slate-800 to-cinema-slate-950 text-white rounded-3xl p-6 md:p-10 text-center relative overflow-hidden shadow-xl border border-cinema-slate-800 space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cinema-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cinema-ai/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center text-[10px] uppercase font-mono font-bold tracking-widest text-cinema-amber-400 bg-cinema-amber-500/15 px-3 py-1 rounded-full border border-cinema-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse text-cinema-amber-400" /> ReelLegacy Knowledge Hub
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
              v2.8 Live Docs
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Find answers, learn workflows and master ReelLegacy
          </h1>
          <p className="text-xs md:text-sm text-cinema-slate-300 max-w-xl mx-auto leading-relaxed">
            Your central knowledge companion for generative film editing, voice synthesis, photo restoration, and family archiving.
          </p>

          {/* Search Box Visual Focal Point */}
          <div className="relative max-w-xl mx-auto pt-2" id="hero-search-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-amber-500" />
            <input
              id="input-hero-search-knowledge"
              type="text"
              placeholder="Search guides, tutorials, keyboard hotkeys, FAQs, or rendering fixes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs md:text-sm pl-11 pr-10 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-cinema-slate-400 focus:outline-none focus:border-cinema-amber-500 focus:bg-white/15 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                id="btn-clear-hero-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cinema-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs" id="hero-popular-chips">
            <span className="text-[10px] font-mono uppercase font-bold text-cinema-slate-400 mr-1">Popular:</span>
            {POPULAR_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                id={`chip-search-${chip.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSearchQuery(chip)}
                className="text-[11px] font-medium text-cinema-slate-300 hover:text-white bg-white/5 hover:bg-cinema-amber-500/20 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Progress KPI Banner */}
        <div className="max-w-3xl mx-auto pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-left font-mono" id="hero-learning-stats">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cinema-amber-500/20 border border-cinema-amber-500/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-cinema-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Articles Read</span>
              <span className="text-sm font-bold text-white">{readArticleIds.length} of {HELP_ARTICLES.length}</span>
            </div>
          </div>

          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Saved Guides</span>
              <span className="text-sm font-bold text-white">{bookmarkedIds.length} Bookmarks</span>
            </div>
          </div>

          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Mastery Level</span>
              <span className="text-sm font-bold text-emerald-400">Level 2 Archival</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AI DOCUMENTATION ASSISTANT BANNER */}
      <div id="ai-help-assistant-banner" className="bg-card/80 border border-cinema-ai/30 rounded-2xl p-4 md:p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cinema-ai/20 border border-cinema-ai/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cinema-ai animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold font-display text-foreground flex items-center gap-2">
                AI Knowledge Assistant <span className="text-[9px] font-mono text-cinema-ai bg-cinema-ai/15 px-2 py-0.5 rounded-full">Interactive AI</span>
              </h3>
              <p className="text-xs text-muted-foreground">Ask questions about using Story Studio, Narration Studio, or troubleshooting 4K renders.</p>
            </div>
          </div>

          <Button
            id="btn-trigger-inspector-help"
            variant="outline"
            size="xs"
            onClick={() => {
              setSelection('help', { title: 'Help Center Guidance', category: 'General' });
              setRightPanelOpen(true);
            }}
            className="cursor-pointer border-cinema-ai/40 text-cinema-ai hover:bg-cinema-ai/10 text-xs shrink-0 self-end sm:self-center"
          >
            Open Context Inspector
          </Button>
        </div>

        {/* Sample Questions */}
        <div className="flex flex-wrap items-center gap-2 text-xs" id="ai-sample-questions">
          <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Ask AI:</span>
          {AI_SAMPLE_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              id={`btn-ai-ask-${idx}`}
              onClick={() => handleAiAsk(sq.q)}
              className="text-xs text-foreground/80 hover:text-cinema-amber-500 bg-muted/40 hover:bg-muted p-1.5 px-2.5 rounded-lg border border-border/60 transition-colors cursor-pointer text-left"
            >
              "{sq.q}"
            </button>
          ))}
        </div>

        {/* AI Response Output Box */}
        {aiAnswer && (
          <div id="ai-answer-output-box" className="p-3.5 bg-cinema-ai/10 border border-cinema-ai/30 rounded-xl space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cinema-ai text-[11px] font-mono uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Guidance Response
              </span>
              <button onClick={() => setAiAnswer(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-foreground text-xs leading-relaxed">{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* SECTION 3: POPULAR TOPICS CARDS SECTION */}
      <div id="popular-topics-section" className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cinema-amber-500" /> Popular Archiving Topics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="popular-topics-grid">
          {[
            { id: 'getting-started', label: 'Getting Started', desc: 'Onboarding & Core Steps', icon: Compass, color: 'text-indigo-400' },
            { id: 'story-studio', label: 'Story Studio', desc: 'Scripting & AI Director', icon: BookOpen, color: 'text-amber-400' },
            { id: 'media-library', label: 'Media Shelf', desc: 'Photo Restoration', icon: Layers, color: 'text-sky-400' },
            { id: 'narration-studio', label: 'Narration Studio', desc: 'Voice Synthesis & Stems', icon: Zap, color: 'text-emerald-400' },
            { id: 'rendering', label: '4K Render Queue', desc: 'Export & Compilers', icon: PlayCircle, color: 'text-rose-400' },
            { id: 'shortcuts', label: 'Hotkeys', desc: 'Keyboard Shortcuts', icon: Keyboard, color: 'text-purple-400' }
          ].map((topic) => {
            const TopicIcon = topic.icon;
            return (
              <button
                key={topic.id}
                id={`card-popular-topic-${topic.id}`}
                onClick={() => {
                  if (topic.id === 'story-studio' || topic.id === 'media-library' || topic.id === 'narration-studio' || topic.id === 'rendering') {
                    setActiveTab('guides');
                    setSearchQuery(topic.label);
                  } else {
                    setActiveTab(topic.id);
                  }
                }}
                className="p-3.5 bg-card border border-border/80 hover:border-cinema-amber-500/60 rounded-2xl transition-all cursor-pointer text-left space-y-2 hover:scale-[1.01] shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-muted/60 border border-border flex items-center justify-center shrink-0 group-hover:border-cinema-amber-500/40">
                  <TopicIcon className={`w-4 h-4 ${topic.color}`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors">{topic.label}</h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{topic.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: HORIZONTAL WORKSPACE NAVIGATION (NO INTERNAL LEFT SIDEBAR) */}
      <div id="workspace-navigation-tabs-bar" className="border-b border-border/80 pb-1 pt-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {navTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            const count = HELP_ARTICLES.filter((a) => tab.id === 'all' || a.category === tab.id).length;

            return (
              <button
                key={tab.id}
                id={`workspace-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-cinema-amber-500/20 text-cinema-amber-500 font-bold' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: KNOWLEDGE WORKSPACE CONTENT */}
      <div id="knowledge-workspace-container" className="space-y-6">
        {/* WORKSPACE 1: GETTING STARTED */}
        {activeTab === 'getting-started' && (
          <div id="workspace-getting-started" className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-500/10 via-card to-cinema-amber-500/10 border border-indigo-500/20 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Onboarding Guide
              </span>
              <h2 className="font-display text-lg font-bold text-foreground">Archivist Onboarding Progression</h2>
              <p className="text-xs text-muted-foreground">Follow this 4-step interactive checklist to produce your first studio documentary film.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="onboarding-checklist-cards">
              {[
                { step: '01', title: 'Create Legacy Profile', desc: 'Establish a subject profile record for your family subject.', path: '/workspace/legacy-profiles', status: 'completed' },
                { step: '02', title: 'Build Timeline Milestones', desc: 'Add key birth dates, marriages, and service milestones.', path: '/workspace/timeline-chronology', status: 'completed' },
                { step: '03', title: 'Upload & Restore Photos', desc: 'Upload photo scans to Media Library and run AI restoration.', path: '/workspace/media-library', status: 'active' },
                { step: '04', title: 'Synthesize & Render Film', desc: 'Generate scripts in Story Studio and launch 4K export queue.', path: '/workspace/story-studio', status: 'pending' }
              ].map((st, idx) => (
                <div key={idx} className="p-4 bg-card border border-border/80 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cinema-amber-500">Step {st.step}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        st.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        st.status === 'active' ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {st.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{st.title}</h3>
                    <p className="text-xs text-muted-foreground">{st.desc}</p>
                  </div>

                  <Button
                    id={`btn-onboarding-nav-${idx}`}
                    variant="outline"
                    size="xs"
                    onClick={() => navigate(st.path)}
                    className="cursor-pointer text-xs border-cinema-amber-500/40 text-cinema-amber-500 hover:bg-cinema-amber-500/10 font-bold self-start mt-2"
                  >
                    <span>Launch Module</span> <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKSPACE 2: KEYBOARD SHORTCUTS */}
        {activeTab === 'shortcuts' && (
          <div id="workspace-keyboard-shortcuts" className="space-y-4 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-rose-400" /> Hotkeys & Key Bindings Reference
              </h2>
              <p className="text-xs text-muted-foreground">Speed up archiving operations across Story Studio, Media Library, and Render Queue.</p>
            </div>

            <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs">
              <div className="p-3 bg-muted/40 border-b border-border/80 text-xs font-mono font-bold text-muted-foreground grid grid-cols-3">
                <span>Key Binding</span>
                <span>Action Description</span>
                <span className="text-right">Scope</span>
              </div>
              <div className="divide-y divide-border/40 text-xs">
                {[
                  { key: '/', desc: 'Focus Global Search Palette', scope: 'Global Workspace' },
                  { key: 'Esc', desc: 'Close Overlays & Reader Modals', scope: 'Global Overlays' },
                  { key: 'Ctrl + S', desc: 'Save Active Story Script Draft', scope: 'Story Studio' },
                  { key: 'Ctrl + Shift + L', desc: 'Toggle Light / Dark Preference Theme', scope: 'Global Workspace' },
                  { key: 'Ctrl + N', desc: 'Trigger Operational Feed Scan', scope: 'Operations Center' },
                  { key: 'Spacebar', desc: 'Play / Pause Narration Preview', scope: 'Narration Studio' }
                ].map((hk, idx) => (
                  <div key={idx} className="p-3.5 grid grid-cols-3 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-mono font-bold text-cinema-amber-400 bg-muted/80 px-2 py-1 rounded border border-border/80 w-max text-xs">
                      {hk.key}
                    </span>
                    <span className="font-medium text-foreground">{hk.desc}</span>
                    <span className="text-right font-mono text-muted-foreground text-[11px]">{hk.scope}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 3: PRIVACY & LEGAL */}
        {activeTab === 'legal' && (
          <div id="workspace-privacy-legal" className="space-y-6 animate-fade-in">
            <div className="p-5 bg-card border border-red-500/20 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20 uppercase">
                Privacy Shield & GDPR Sovereignty
              </span>
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" /> Privacy Policy & Interactive Data Deletion Controls
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ReelLegacy operates under strict privacy boundaries. Your uploaded biographical records, photo scans, and voice narrations are private to your workspace and never used for public AI training.
              </p>

              <div className="flex flex-wrap gap-2 pt-2" id="workspace-gdpr-action-buttons">
                <Button
                  id="btn-workspace-delete-media"
                  variant="outline"
                  size="xs"
                  onClick={() => handleTriggerDelete('media')}
                  className="cursor-pointer text-xs border-red-500/40 text-red-500 hover:bg-red-500/10 font-bold"
                >
                  Delete Uploaded Media Shelf
                </Button>
                <Button
                  id="btn-workspace-delete-account"
                  variant="outline"
                  size="xs"
                  onClick={() => handleTriggerDelete('account')}
                  className="cursor-pointer text-xs border-red-500/40 text-red-500 hover:bg-red-500/10 font-bold"
                >
                  Purge Entire Workspace Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 4: CONTACT SUPPORT */}
        {activeTab === 'support' && (
          <div id="workspace-contact-support" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="support-pathways-grid">
              <div className="p-5 bg-card border border-border/80 rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500 flex items-center justify-center mx-auto">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Submit Support Ticket</h3>
                <p className="text-xs text-muted-foreground">Request help from senior archivists or render compiler engineers.</p>
                <Button
                  id="btn-support-ticket"
                  variant="secondary"
                  size="xs"
                  onClick={() => showToast('success', 'Support Ticket Portal Opened', 'Type ticket subject below.')}
                  className="cursor-pointer"
                >
                  Open Ticket Portal
                </Button>
              </div>

              <div className="p-5 bg-card border border-border/80 rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Report System Bug</h3>
                <p className="text-xs text-muted-foreground">Flag technical render errors or missing UI assets directly to dev logs.</p>
                <Button
                  id="btn-report-bug"
                  variant="outline"
                  size="xs"
                  onClick={() => showToast('info', 'Bug Report Drafted', 'System diagnostic logs attached automatically.')}
                  className="cursor-pointer"
                >
                  Report Bug
                </Button>
              </div>

              <div className="p-5 bg-card border border-border/80 rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Live Service Status</h3>
                <p className="text-xs text-muted-foreground">All rendering compiler nodes operational (99.98% uptime).</p>
                <span className="inline-flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  ● Systems Normal
                </span>
              </div>
            </div>
          </div>
        )}

        {/* GENERAL ARTICLE LIST (APPLIES TO ALL WORKSPACES & SEARCH) */}
        <div id="articles-feed-section" className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              {searchQuery ? `Search Results for "${searchQuery}" (${filteredArticles.length})` : `${navTabs.find((t) => t.id === activeTab)?.label} Documentation`}
            </h2>

            {searchQuery && (
              <button
                id="btn-clear-search-feed"
                onClick={() => setSearchQuery('')}
                className="text-xs text-cinema-amber-500 hover:underline font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <EmptyState
              type="search"
              title={`No articles found matching "${searchQuery}"`}
              description="Try adjusting your search terms or select another category tab above."
              primaryActionLabel="Clear Search Filter"
              onPrimaryAction={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="articles-feed-grid">
              {filteredArticles.map((article) => {
                const isBookmarked = bookmarkedIds.includes(article.id);
                const isRead = readArticleIds.includes(article.id);

                return (
                  <div
                    key={article.id}
                    id={`card-article-${article.id}`}
                    onClick={(e) => handleOpenArticle(article, e)}
                    className="p-4 rounded-2xl border border-border/80 hover:border-cinema-amber-500/50 bg-card/60 hover:bg-card transition-all cursor-pointer space-y-3 relative group flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-2">
                      {/* Top Badges Bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30">
                            {article.category}
                          </span>
                          {article.difficulty && (
                            <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {article.difficulty}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isRead && (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Read
                            </span>
                          )}

                          <button
                            id={`btn-bookmark-${article.id}`}
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className={`p-1 rounded-md transition-colors ${
                              isBookmarked ? 'text-cinema-amber-500 bg-cinema-amber-500/10' : 'text-muted-foreground/50 hover:text-foreground'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <h3 className="text-sm font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Bottom Meta */}
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px] font-mono text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cinema-amber-500" /> {article.readTime || '3 min read'}
                      </span>

                      <span className="text-cinema-amber-500 group-hover:underline font-bold flex items-center gap-1">
                        Read Article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: ARTICLE DETAIL READER MODAL */}
      {activeArticle && (
        <div id="help-modal-detail-reader" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveArticle(null)} />
          <div className="bg-card border border-border p-6 rounded-2xl max-w-2xl w-full relative z-10 space-y-5 shadow-2xl text-foreground max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Header Breadcrumbs */}
            <div className="flex justify-between items-center pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span>Knowledge Hub</span>
                <span>/</span>
                <span className="text-cinema-amber-500 font-bold uppercase">{activeArticle.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-reader-bookmark"
                  onClick={(e) => toggleBookmark(activeArticle.id, e)}
                  className={`p-1.5 rounded-lg border border-border transition-colors ${
                    bookmarkedIds.includes(activeArticle.id) ? 'text-cinema-amber-500 bg-cinema-amber-500/10' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  id="btn-close-help-reader"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setActiveArticle(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-4" id="help-reader-body">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">{activeArticle.difficulty || 'Beginner'}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime || '3 min read'}</span>
                  <span>•</span>
                  <span>Updated {activeArticle.lastUpdated || 'July 2026'}</span>
                </div>

                <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                  {activeArticle.title}
                </h2>
                <p className="text-xs text-muted-foreground italic border-l-2 border-cinema-amber-500 pl-3 py-0.5">
                  {activeArticle.excerpt}
                </p>
              </div>

              {/* Pro Tip Callout Box */}
              {activeArticle.callout && (
                <div className="p-3.5 bg-cinema-amber-500/10 border border-cinema-amber-500/30 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-cinema-amber-500 font-mono uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {activeArticle.callout.title}
                  </span>
                  <p className="text-foreground/90 leading-relaxed">{activeArticle.callout.body}</p>
                </div>
              )}

              {/* Main Body */}
              <div className="text-xs md:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap bg-muted/20 p-4 rounded-xl border border-border/40 font-medium">
                {activeArticle.content}
              </div>

              {/* GDPR Deletion Panel inside Legal Articles */}
              {activeArticle.id === 'art-12' && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3" id="help-reader-gdpr-box">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-red-500" /> GDPR & CCPA Deletion Panel
                  </h4>
                  <p className="text-xs text-muted-foreground">
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
                      className="px-3 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-500 text-[10px] uppercase tracking-wider font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Reader Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span>Was this helpful?</span>
                <button
                  onClick={() => showToast('success', 'Thank you for your feedback!')}
                  className="p-1 hover:text-emerald-400 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast('info', 'Feedback noted')}
                  className="p-1 hover:text-rose-400 cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  id="btn-reader-dismiss"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveArticle(null)}
                >
                  Done Reading
                </Button>
                <Button
                  id="btn-reader-inspect"
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    setSelection('help', activeArticle);
                    setRightPanelOpen(true);
                    showToast('info', 'Inspecting article in Context Panel');
                  }}
                >
                  Inspect in Context Panel
                </Button>
              </div>
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
