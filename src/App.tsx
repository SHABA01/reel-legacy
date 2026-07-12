/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OverlayProvider, useOverlay } from './context/OverlayContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AppShell } from './components/layout/AppShell';

// Modular Public Website Components & Pages
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { LandingPage } from './components/public/LandingPage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { StoryTypesPage } from './components/public/StoryTypesPage';
import { AboutPage } from './components/public/AboutPage';
import { HelpCenterPage } from './components/public/HelpCenterPage';
import { ContactPage } from './components/public/ContactPage';
import { FAQPage } from './components/public/FAQPage';
import { PrivacyPage } from './components/public/PrivacyPage';
import { TermsPage } from './components/public/TermsPage';
import { AuthModal } from './components/public/AuthModal';
import { ToastContainer } from './components/ui/ToastContainer';

// Custom UI Primitives
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { Drawer } from './components/ui/Drawer';
import { EmptyState } from './components/ui/EmptyState';
import { ErrorState } from './components/ui/ErrorState';
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonForm,
  LinearLoader,
  CircularLoader,
  AIGenerationLoader,
  MediaUploadLoader,
  RenderLoader,
} from './components/ui/Skeleton';

// Icons
import {
  Sparkles,
  Info,
  Layers,
  AlertCircle,
  CheckCircle2,
  Bell,
  Trash2,
  Terminal,
  Cpu,
  UserCheck,
  FileCode,
  Layout,
} from 'lucide-react';

function DashboardView() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'>('md');
  const [modalTitle, setModalTitle] = useState('Workspace Modal Dialog');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPos, setDrawerPos] = useState<'left' | 'right' | 'bottom'>('right');
  const [drawerSize, setDrawerSize] = useState<'sm' | 'md' | 'lg'>('md');

  const triggerToast = (type: 'success' | 'warning' | 'error' | 'info' | 'loading', msg: string, desc?: string) => {
    showToast(type, msg, desc);
  };

  const openModalWithSize = (size: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen', title: string) => {
    setModalSize(size);
    setModalTitle(title);
    setModalOpen(true);
  };

  const openDrawerWithConfig = (position: 'left' | 'right' | 'bottom', size: 'sm' | 'md' | 'lg') => {
    setDrawerPos(position);
    setDrawerSize(size);
    setDrawerOpen(true);
  };

  return (
    <div id="demo-dashboard" className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div id="demo-welcome-banner" className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-cinema-slate-900 dark:to-cinema-slate-950 text-foreground dark:text-white relative overflow-hidden shadow-md dark:shadow-xl border border-border">
        <div className="relative z-10 max-w-xl space-y-3" id="banner-text">
          <span className="text-[10px] tracking-widest uppercase font-bold text-cinema-amber-700 dark:text-cinema-amber-400 bg-cinema-amber-500/15 dark:bg-cinema-amber-500/10 px-2.5 py-1 rounded-full border border-cinema-amber-500/30 dark:border-cinema-amber-500/20">
            Phase 0: Foundation Complete
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            ReelLegacy Application Shell
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-cinema-slate-300 leading-relaxed">
            Every core design token, typography class, semantic colour mapping, toast notifications stack, and layout framework is active. Click sidebar elements to test live workspaces.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center" id="banner-visual">
          <Terminal className="w-48 h-48 text-cinema-amber-600 dark:text-cinema-amber-500" />
        </div>
      </div>

      {/* Grid: Tokens & Component Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-controls-grid">
        {/* Design System Tokens Column */}
        <div id="design-tokens-card" className="p-6 border border-border bg-card rounded-2xl space-y-6 shadow-sm">
          <div className="border-b border-border pb-3" id="tokens-header">
            <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-cinema-amber-500" /> Design Tokens & Typography
            </h3>
            <p className="text-xs text-muted-foreground">
              Reusable typographic classes mapped to DESIGN_SYSTEM.md.
            </p>
          </div>

          {/* Typography Scale */}
          <div className="space-y-4" id="typo-hierarchy-showcase">
            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Heading Hierarchy
            </h4>
            <div className="space-y-2 border-l-2 border-border pl-4" id="typo-headings-list">
              <div>
                <span className="font-mono text-[9px] text-muted-foreground">H1 Display / 3xl</span>
                <p className="font-display text-2xl font-bold tracking-tight text-foreground">Preserving Legacy memoirs</p>
              </div>
              <div>
                <span className="font-mono text-[9px] text-muted-foreground">H2 Section Heading / xl</span>
                <p className="font-display text-xl font-semibold tracking-tight text-foreground">Active Story Workspace</p>
              </div>
              <div>
                <span className="font-mono text-[9px] text-muted-foreground">H3 Card Heading / lg</span>
                <p className="font-display text-lg font-semibold text-foreground">The Vance Family Chronicle</p>
              </div>
              <div>
                <span className="font-mono text-[9px] text-muted-foreground">H4 Small Header / md</span>
                <p className="font-display text-base font-medium text-foreground/90">Scene 2: Restored Photos</p>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mt-4">
              Body & Utility Copy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="typo-utilities-grid">
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="font-mono text-[9px] text-muted-foreground">Body Large</span>
                <p className="text-base text-foreground/80">Detailed narrator script paragraphs.</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="font-mono text-[9px] text-muted-foreground">Body Regular</span>
                <p className="text-sm text-foreground/70">Standard profile captions and reviews.</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="font-mono text-[9px] text-muted-foreground">Label / Caption</span>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CREATOR CREDENTIALS</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="font-mono text-[9px] text-muted-foreground">Mono Metadata</span>
                <p className="font-mono text-xs text-muted-foreground">rl-render-job-0x49F</p>
              </div>
            </div>
          </div>

          {/* Semantic Colour Palette */}
          <div className="space-y-3" id="color-palette-showcase">
            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Semantic Color System
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="palette-grid">
              <div className="p-2.5 rounded-xl border border-border text-center space-y-1 bg-card">
                <div className="w-full h-8 bg-cinema-amber-500 rounded-lg" />
                <span className="text-[10px] font-bold text-foreground/80">Accent Gold</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border text-center space-y-1 bg-card">
                <div className="w-full h-8 bg-cinema-ai rounded-lg" />
                <span className="text-[10px] font-bold text-foreground/80">Director AI</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border text-center space-y-1 bg-card">
                <div className="w-full h-8 bg-emerald-500 rounded-lg" />
                <span className="text-[10px] font-bold text-foreground/80">Success Msg</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border text-center space-y-1 bg-card">
                <div className="w-full h-8 bg-red-500 rounded-lg" />
                <span className="text-[10px] font-bold text-foreground/80">Danger Event</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Overlays & Modals Deck Card */}
        <div id="overlays-and-modals-card" className="p-6 border border-border bg-card rounded-2xl space-y-6 shadow-sm">
          <div className="border-b border-border pb-3" id="overlays-header">
            <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cinema-ai" /> Overlay & Modal Framework
            </h3>
            <p className="text-xs text-muted-foreground">
              Interactive test controls for alerts, modal scales, and sidebar overlays.
            </p>
          </div>

          {/* Toast Triggers */}
          <div className="space-y-2" id="toast-triggers-panel">
            <h4 className="text-xs font-bold uppercase text-cinema-slate-400 dark:text-cinema-slate-500 tracking-wider">
              1. Toast Notifications Queue
            </h4>
            <div className="flex flex-wrap gap-2" id="toast-buttons-row">
              <Button
                id="test-toast-success"
                variant="secondary"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                onClick={() => triggerToast('success', 'Document restorer active', 'Vance wedding photo enhanced successfully.')}
              >
                Success Toast
              </Button>
              <Button
                id="test-toast-warning"
                variant="secondary"
                size="sm"
                leftIcon={<AlertCircle className="w-4 h-4 text-amber-500" />}
                onClick={() => triggerToast('warning', 'Narrator script warning', 'Ken Burns effect has no high-res photo references.')}
              >
                Warning Toast
              </Button>
              <Button
                id="test-toast-error"
                variant="secondary"
                size="sm"
                leftIcon={<AlertCircle className="w-4 h-4 text-red-500" />}
                onClick={() => triggerToast('error', 'Render Pipeline Error', 'Asset encoding timed out.')}
              >
                Error Toast
              </Button>
              <Button
                id="test-toast-loading"
                variant="secondary"
                size="sm"
                onClick={() => triggerToast('loading', 'Syncing story archive', 'Uploading archives to secure database...')}
              >
                Loading Toast
              </Button>
            </div>
          </div>

          {/* Modal Framework triggers */}
          <div className="space-y-2" id="modal-triggers-panel">
            <h4 className="text-xs font-bold uppercase text-cinema-slate-400 dark:text-cinema-slate-500 tracking-wider">
              2. Modal Framework Sizes
            </h4>
            <div className="flex flex-wrap gap-2" id="modal-buttons-row">
              <Button
                id="test-modal-sm"
                variant="primary"
                size="sm"
                onClick={() => openModalWithSize('sm', 'Compact Quick-Create Dialog')}
              >
                Small Modal
              </Button>
              <Button
                id="test-modal-md"
                variant="primary"
                size="sm"
                onClick={() => openModalWithSize('md', 'Medium Storyboard Details')}
              >
                Medium Modal
              </Button>
              <Button
                id="test-modal-lg"
                variant="primary"
                size="sm"
                onClick={() => openModalWithSize('lg', 'Large Chapter Blueprint Editor')}
              >
                Large Modal
              </Button>
              <Button
                id="test-modal-fullscreen"
                variant="accent"
                size="sm"
                onClick={() => openModalWithSize('fullscreen', 'Cinematic Workspace Fullscreen View')}
              >
                Fullscreen Modal
              </Button>
            </div>
          </div>

          {/* Custom Drawer framework triggers */}
          <div className="space-y-2" id="drawer-triggers-panel">
            <h4 className="text-xs font-bold uppercase text-cinema-slate-400 dark:text-cinema-slate-500 tracking-wider">
              3. Flexible Sliding Drawer System
            </h4>
            <div className="flex flex-wrap gap-2" id="drawer-buttons-row">
              <Button
                id="test-drawer-left"
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => openDrawerWithConfig('left', 'sm')}
              >
                Left Drawer (Mobile Nav style)
              </Button>
              <Button
                id="test-drawer-bottom"
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => openDrawerWithConfig('bottom', 'md')}
              >
                Bottom Drawer (Terminal style)
              </Button>
              <Button
                id="test-drawer-right"
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => openDrawerWithConfig('right', 'lg')}
              >
                Right Drawer (Full Asset Deck)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Render Instance */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} size={modalSize}>
        <div id="modal-test-content" className="space-y-4">
          <p className="text-sm text-cinema-slate-600 dark:text-cinema-slate-400 leading-relaxed">
            This modal is powered by the shared <strong>ReelLegacy Modal Framework</strong>, featuring full keyboard focus trap support, Escape key closure listeners, backdrop overlay triggers, and hardware-accelerated spring animations.
          </p>
          <div className="p-4 bg-muted/40 rounded-xl space-y-2" id="modal-token-check">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Cinematic Checklist</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Backdrop blur filter applied</li>
              <li>Auto-centering springs active</li>
              <li>Body scroll lock managed</li>
            </ul>
          </div>
          <div className="flex justify-end gap-2 pt-2" id="modal-footer-actions">
            <Button id="modal-cancel-btn" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Discard
            </Button>
            <Button id="modal-save-btn" variant="accent" size="sm" onClick={() => {
              triggerToast('success', 'Layout state stored successfully');
              setModalOpen(false);
            }}>
              Confirm Structure
            </Button>
          </div>
        </div>
      </Modal>

      {/* Drawer Render Instance */}
      <Drawer
        id="demo-drawer-instance"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`${drawerPos.toUpperCase()} Drawer Workspace`}
        position={drawerPos}
        size={drawerSize}
      >
        <div id="drawer-test-content" className="space-y-4 py-2">
          <p className="text-sm text-cinema-slate-600 dark:text-cinema-slate-400 leading-relaxed">
            You opened a <strong>{drawerSize}</strong> drawer sliding from the <strong>{drawerPos}</strong> margin. Reusable, robust, and responsive-ready.
          </p>
          <SkeletonForm id="drawer-test-form" />
        </div>
      </Drawer>
    </div>
  );
}

function StoriesView() {
  const { showToast } = useToast();
  return (
    <div id="demo-stories" className="space-y-8 animate-fade-in">
      <div id="stories-title-card" className="border-b border-border pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-cinema-slate-900 dark:text-white">Empty State Presets Showcase</h2>
        <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400">
          Consistent layouts shown when records or media libraries contain no user-uploaded materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="empty-states-grid">
        <EmptyState
          type="stories"
          primaryActionLabel="Create First Draft"
          onPrimaryAction={() => showToast('success', 'Opening profile wizard')}
        />
        <EmptyState
          type="media"
          primaryActionLabel="Open Upload Drawer"
          onPrimaryAction={() => showToast('info', 'Opening Media upload deck')}
        />
        <EmptyState
          type="search"
          title="No Matching Archives Found"
          description="We couldn't locate any veteran records or document catalogs matching your query."
          primaryActionLabel="Clear Search Text"
          onPrimaryAction={() => showToast('info', 'Resetting search query')}
        />
        <EmptyState
          type="timeline"
          primaryActionLabel="Add History Event"
          onPrimaryAction={() => showToast('success', 'Prompting milestone drawer')}
        />
      </div>
    </div>
  );
}

function MediaView() {
  return (
    <div id="demo-media" className="space-y-8 animate-fade-in">
      <div id="media-title-card" className="border-b border-border pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-cinema-slate-900 dark:text-white">Loading Skeletons Catalogue</h2>
        <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400">
          Premium shimmer indicator grids rendered during file uploads, metadata lookups, and compilation.
        </p>
      </div>

      <div className="space-y-8" id="skeletons-stack">
        {/* Skeleton Card Grid */}
        <div className="space-y-3" id="skeleton-cards-block">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-slate-400 dark:text-cinema-slate-500">1. Story & Media Cards Shimmer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="skeleton-cards-grid">
            <SkeletonCard id="sk-card-instance-1" />
            <SkeletonCard id="sk-card-instance-2" />
            <SkeletonCard id="sk-card-instance-3" />
          </div>
        </div>

        {/* Skeleton list & table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="skeleton-lists-block">
          <div className="space-y-3" id="skeleton-list-box">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-slate-400 dark:text-cinema-slate-500">2. Row List Shimmer</h3>
            <SkeletonList rows={3} id="skeleton-list-instance" />
          </div>
          <div className="space-y-3" id="skeleton-table-box">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-slate-400 dark:text-cinema-slate-500">3. Grid Table Shimmer</h3>
            <SkeletonTable rows={3} cols={3} id="skeleton-table-instance" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NarrationView() {
  return (
    <div id="demo-narration" className="space-y-8 animate-fade-in">
      <div id="narration-title-card" className="border-b border-border pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-cinema-slate-900 dark:text-white">Specialized Studio Loaders</h2>
        <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400">
          Custom interactive loading feedback components for critical, long-running AI creation and documentary rendering workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start" id="loaders-grid">
        {/* AI Director Writer */}
        <div className="space-y-3" id="loader-ai-box">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-slate-400 dark:text-cinema-slate-500">1. AI Synthesis Progress</h3>
          <AIGenerationLoader id="ai-generator-loader-instance" />
        </div>

        {/* Video Render Progress */}
        <div className="space-y-3" id="loader-render-box">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-slate-400 dark:text-cinema-slate-500">2. Film Render compilation</h3>
          <RenderLoader id="video-render-loader-instance" />
        </div>

        {/* File upload panel */}
        <div className="space-y-3" id="loader-upload-box">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-slate-400 dark:text-cinema-slate-500">3. Parallel uploads</h3>
          <div className="space-y-3" id="uploads-list">
            <MediaUploadLoader fileName="veteran_clippings_1952.pdf" progress={85} id="up-loader-1" />
            <MediaUploadLoader fileName="voiceover_narration_v2.wav" progress={38} id="up-loader-2" />
            <MediaUploadLoader fileName="grandpa_farmhouse_highres.png" progress={100} id="up-loader-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderView() {
  const { showToast } = useToast();
  return (
    <div id="demo-render" className="space-y-8 animate-fade-in">
      <div id="render-title-card" className="border-b border-border pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-cinema-slate-900 dark:text-white">Error Components Catalogue</h2>
        <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400">
          Standardized visual layouts for error feedback pages and permission alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="errors-grid">
        <ErrorState
          type="404"
          onRetry={() => showToast('info', 'Re-routing story catalog...')}
          retryActionLabel="Re-Route Page"
        />
        <ErrorState
          type="500"
          onRetry={() => showToast('loading', 'Resetting compiling node pipeline...')}
          retryActionLabel="Restart Compiler"
        />
        <ErrorState
          type="ai-failure"
          onRetry={() => showToast('info', 'Re-synthesizing AI narration script...')}
          retryActionLabel="Re-Synthesize Card"
        />
        <ErrorState
          type="render-failure"
          onRetry={() => showToast('loading', 'Re-allocating rendering cache')}
          retryActionLabel="Re-Render Project"
        />
      </div>
    </div>
  );
}

function SettingsView() {
  const { showToast } = useToast();
  return (
    <div id="demo-settings" className="space-y-8 animate-fade-in">
      <div id="settings-title-card" className="border-b border-border pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-cinema-slate-900 dark:text-white">Interactive Settings Forms Formats</h2>
        <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400">
          Clean, composable inputs, labels, tooltips, and action sets.
        </p>
      </div>

      <div className="p-6 md:p-8 border border-border bg-card rounded-2xl max-w-2xl mx-auto shadow-sm" id="form-container">
        <h3 className="font-display text-base font-semibold text-foreground mb-5 pb-3 border-b border-border flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cinema-amber-500" /> Co-Author Profile Settings
        </h3>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5" id="settings-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="form-inputs-row">
            <Input
              id="co-author-first-name"
              label="First Name"
              placeholder="e.g. Philip"
              defaultValue="Philip"
            />
            <Input
              id="co-author-last-name"
              label="Last Name"
              placeholder="e.g. Shaba"
              defaultValue="Shaba"
            />
          </div>

          <Input
            id="co-author-email"
            label="Email Address"
            type="email"
            placeholder="e.g. phil@example.com"
            defaultValue="PhilShaba96@gmail.com"
            helperText="We send rendering completion triggers and billing reports to this email."
          />

          <Input
            id="co-author-company"
            label="Co-Author Workspace Role"
            defaultValue="Lead Archivist / Family Historian"
            disabled
            helperText="Workspace role is controlled by ReelLegacy project creator."
          />

          <Input
            id="co-author-citation"
            label="Default Document Citations Prefix"
            placeholder="e.g. Vance Family Archive"
            error="Required field. Unverified document mapping may fail compiling scripts."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border" id="form-actions-row">
            <Button id="settings-discard-btn" variant="ghost" type="button" onClick={() => showToast('info', 'Form input cleared.')}>
              Discard Changes
            </Button>
            <Button id="settings-submit-btn" variant="primary" type="submit" onClick={() => showToast('success', 'Profile updated successfully!')}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RenderActiveView() {
  const { activeView } = useOverlay();

  switch (activeView) {
    case 'dashboard':
      return <DashboardView />;
    case 'stories':
      return <StoriesView />;
    case 'media':
      return <MediaView />;
    case 'narration':
      return <NarrationView />;
    case 'render':
      return <RenderView />;
    case 'settings':
      return <SettingsView />;
    default:
      return (
        <div id="unsupported-view-placeholder" className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-cinema-amber-500 mx-auto">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-cinema-slate-800 dark:text-cinema-slate-200 uppercase tracking-wide">
              Future Page Placeholder
            </h3>
            <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400 max-w-md mx-auto mt-1">
              The application shell recognizes this view. Feature-specific business logic and panels will be linked in downstream sprints.
            </p>
          </div>
        </div>
      );
  }
}

function PublicLayoutContent({
  currentPage,
  setCurrentPage,
  authModalOpen,
  setAuthModalOpen,
  authTab,
  handleOpenAuth,
  handleAuthSuccess,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authTab: 'login' | 'register';
  handleOpenAuth: (tab: 'login' | 'register') => void;
  handleAuthSuccess: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-fade-in relative">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenAuth={handleOpenAuth}
      />
      
      <main className="flex-grow">
        <RenderPublicPage
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenAuth={handleOpenAuth}
        />
      </main>

      <Footer setCurrentPage={setCurrentPage} />
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
        onSuccess={handleAuthSuccess}
      />

      {/* Public toast container rendering */}
      <ToastContainer />
    </div>
  );
}

function RenderPublicPage({
  currentPage,
  setCurrentPage,
  onOpenAuth,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}) {
  switch (currentPage) {
    case 'home':
      return <LandingPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
    case 'features':
      return <FeaturesPage onOpenAuth={onOpenAuth} />;
    case 'story-types':
      return <StoryTypesPage onOpenAuth={onOpenAuth} />;
    case 'about':
      return <AboutPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
    case 'help':
      return <HelpCenterPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
    case 'contact':
      return <ContactPage setCurrentPage={setCurrentPage} />;
    case 'faq':
      return <FAQPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'terms':
      return <TermsPage />;
    default:
      return <LandingPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
  }
}

function WorkspaceLayout() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AppShell>
        <RenderActiveView />
      </AppShell>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rl_authenticated') === 'true';
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const { activeView, setActiveView } = useOverlay();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('rl_authenticated', 'true');
    setAuthModalOpen(false);
    
    // Check if there was a pending redirect
    const pendingRedirect = localStorage.getItem('rl_redirect_after_auth');
    if (pendingRedirect) {
      localStorage.removeItem('rl_redirect_after_auth');
      navigate(pendingRedirect);
    } else {
      navigate('/workspace/dashboard');
    }
  };

  // Synchronize route paths with the Sidebar activeView
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/workspace/dashboard')) {
      setActiveView('dashboard');
    } else if (path.startsWith('/workspace/story-library')) {
      setActiveView('stories');
    } else if (path.startsWith('/workspace/legacy-profiles')) {
      setActiveView('profiles');
    } else if (path.startsWith('/workspace/timeline-chronology')) {
      setActiveView('timeline');
    } else if (path.startsWith('/workspace/media-library')) {
      setActiveView('media');
    } else if (path.startsWith('/workspace/narration-studio')) {
      setActiveView('narration');
    } else if (path.startsWith('/workspace/story-templates')) {
      setActiveView('templates');
    } else if (path.startsWith('/workspace/render-queue')) {
      setActiveView('render');
    } else if (path.startsWith('/workspace/studio-analytics')) {
      setActiveView('analytics');
    } else if (path.startsWith('/workspace/integrations')) {
      setActiveView('integrations');
    } else if (path.startsWith('/workspace/settings')) {
      setActiveView('settings');
    }
  }, [location.pathname, setActiveView]);

  // Protect the workspace routes
  useEffect(() => {
    if (location.pathname.startsWith('/workspace') && !isAuthenticated) {
      // Store the path they tried to visit
      localStorage.setItem('rl_redirect_after_auth', location.pathname);
      navigate('/');
      setAuthTab('login');
      setAuthModalOpen(true);
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicLayoutContent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            authModalOpen={authModalOpen}
            setAuthModalOpen={setAuthModalOpen}
            authTab={authTab}
            handleOpenAuth={handleOpenAuth}
            handleAuthSuccess={handleAuthSuccess}
          />
        }
      />

      {/* Workspace Pages (Protected) */}
      <Route
        path="/workspace/dashboard"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/story-library"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/legacy-profiles"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/timeline-chronology"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/media-library"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/narration-studio"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/story-templates"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/render-queue"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/studio-analytics"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/integrations"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/settings"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />
      <Route
        path="/workspace/settings/my-profile"
        element={isAuthenticated ? <WorkspaceLayout /> : <div className="min-h-screen bg-background" />}
      />

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <OverlayProvider>
            <AppContent />
          </OverlayProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

