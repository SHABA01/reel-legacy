/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Award,
  FileText,
  Video,
  Mic,
  Calendar,
  Zap,
  FolderKanban,
  Building2,
  Activity,
  AlertCircle,
  Clock,
  ChevronRight,
  Settings,
  Unlink,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

export function IdeaCodexEcosystemSection() {
  const { showToast } = useToast();

  // Connection & Sync States
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 mins ago');
  const [activeTab, setActiveTab] = useState<'capabilities' | 'ai-generation' | 'sync-health' | 'workflow' | 'deep-links'>('capabilities');

  const connectedAccount = 'dr.vance@ideacodex.com';
  const importedCount = 18;

  const handleSyncNow = () => {
    setIsSyncing(true);
    showToast('info', 'CareerCanvas Sync Triggered', 'Pulling updated career milestones, certifications, and media portfolio...');
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      showToast('success', 'CareerCanvas Sync Complete', 'Successfully imported 2 new career milestones and 1 updated biography record.');
    }, 1500);
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      showToast('info', 'Disconnected CareerCanvas', 'First-party CareerCanvas integration paused.');
    } else {
      setIsConnected(true);
      showToast('success', 'Connected to CareerCanvas', 'First-party IdeaCodex OAuth session initialized. Background sync enabled.');
    }
  };

  const handleAIGenerateStory = (storyType: string) => {
    showToast('success', `Generating ${storyType}`, 'Sending CareerCanvas portfolio nodes to ReelLegacy Story Engine...');
  };

  const handleDeepLink = (actionName: string) => {
    showToast('info', `Deep Link: ${actionName}`, 'Opening target module inside IdeaCodex ecosystem...');
  };

  return (
    <div id="ideacodex-ecosystem-section" className="space-y-6 bg-card/40 border border-cinema-amber-500/30 rounded-3xl p-5 md:p-7 shadow-lg relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cinema-amber-500/10 via-cinema-ai/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5" id="ecosystem-header-banner">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cinema-amber-500 bg-cinema-amber-500/15 px-3 py-0.5 rounded-full border border-cinema-amber-500/30 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 animate-pulse" /> IdeaCodex Ecosystem
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">
              First-Party Priority
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            IdeaCodex Ecosystem Integrations
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Native first-party applications integrated directly into ReelLegacy for deep workflow automation, vector story synthesis, and career memory preservation.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="p-2.5 bg-muted/50 border border-border rounded-xl text-right">
            <span className="text-[10px] text-muted-foreground block">Active Suite Sync</span>
            <strong className="text-cinema-amber-500 font-bold">CareerCanvas Online</strong>
          </div>
        </div>
      </div>

      {/* FEATURED INTEGRATION CARD: CareerCanvas */}
      <div id="careercanvas-featured-card" className="bg-card border border-cinema-amber-500/40 rounded-2xl p-5 md:p-6 shadow-md space-y-6 relative">
        {/* Top Card Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cinema-amber-500/20 via-cinema-amber-500/10 to-transparent border border-cinema-amber-500/50 flex items-center justify-center shrink-0 shadow-inner">
              <Briefcase className="w-7 h-7 text-cinema-amber-500" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-display text-lg font-bold text-foreground">CareerCanvas</h3>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isConnected
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  {isConnected ? '✓ Connected & Active' : 'Disconnected'}
                </span>
                <span className="text-[10px] font-mono text-cinema-ai bg-cinema-ai/10 px-2 py-0.5 rounded border border-cinema-ai/20 font-bold">
                  AI Vector Pipeline
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Intelligent professional history, portfolio, and biographical story generator.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-muted-foreground pt-0.5">
                <span>Account: <strong className="text-foreground">{connectedAccount}</strong></span>
                <span>•</span>
                <span>Last Sync: <strong className="text-cinema-amber-500">{lastSyncTime}</strong></span>
                <span>•</span>
                <span>Imported Records: <strong className="text-cyan-400">{importedCount} Milestones</strong></span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center" id="careercanvas-action-buttons">
            <Button
              id="btn-careercanvas-sync"
              variant="accent"
              size="sm"
              disabled={!isConnected || isSyncing}
              onClick={handleSyncNow}
              className="cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Sync Now'}</span>
            </Button>

            <Button
              id="btn-careercanvas-configure"
              variant="outline"
              size="sm"
              disabled={!isConnected}
              onClick={() => showToast('info', 'Configure CareerCanvas', 'Opening integration settings and auto-sync frequencies.')}
              className="cursor-pointer border-border hover:border-cinema-amber-500"
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              <span>Configure</span>
            </Button>

            <Button
              id="btn-careercanvas-view-memories"
              variant="outline"
              size="sm"
              disabled={!isConnected}
              onClick={() => showToast('success', 'View Imported Memories', `Displaying ${importedCount} career portfolio nodes.`)}
              className="cursor-pointer border-border hover:border-cinema-amber-500"
            >
              <FolderKanban className="w-3.5 h-3.5 mr-1.5 text-cinema-amber-500" />
              <span>View Memories</span>
            </Button>

            <Button
              id="btn-careercanvas-toggle-connect"
              variant={isConnected ? 'outline' : 'default'}
              size="sm"
              onClick={handleToggleConnection}
              className={`cursor-pointer ${
                isConnected ? 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10' : 'bg-cinema-amber-500 text-slate-950 font-bold'
              }`}
            >
              {isConnected ? <Unlink className="w-3.5 h-3.5 mr-1.5" /> : <LinkIcon className="w-3.5 h-3.5 mr-1.5" />}
              <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
            </Button>
          </div>
        </div>

        {/* Feature Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto no-scrollbar" id="careercanvas-sub-tabs">
          {[
            { id: 'capabilities', label: 'Capabilities', icon: CheckCircle2 },
            { id: 'ai-generation', label: 'AI Story Generation', icon: Sparkles },
            { id: 'sync-health', label: 'Sync Intelligence', icon: Activity },
            { id: 'workflow', label: 'Suggested Workflow', icon: Zap },
            { id: 'deep-links', label: 'Deep Linking', icon: ExternalLink }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-careercanvas-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CAPABILITIES CHECKLIST */}
        {activeTab === 'capabilities' && (
          <div id="careercanvas-capabilities-grid" className="space-y-3 animate-fade-in">
            <p className="text-xs text-muted-foreground font-medium">
              When connected, ReelLegacy automatically ingests and categorizes all professional assets from CareerCanvas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
              {[
                { title: 'Import Professional Timeline', icon: Calendar },
                { title: 'Import Education History', icon: GraduationCap },
                { title: 'Import Certifications', icon: Award },
                { title: 'Import Work Experience', icon: Building2 },
                { title: 'Import Achievements', icon: Award },
                { title: 'Import Uploaded Photos', icon: FileText },
                { title: 'Import Uploaded Videos', icon: Video },
                { title: 'Import Biography Content', icon: FileText },
                { title: 'Import Project Portfolio', icon: FolderKanban },
                { title: 'Import Official Documents', icon: FileText },
                { title: 'Import AI-Generated Summaries', icon: Sparkles },
                { title: 'Import Recorded Presentations', icon: Video },
                { title: 'Import Interview Recordings', icon: Mic },
                { title: 'Auto-Sync Future Updates', icon: RefreshCw }
              ].map((cap, i) => {
                const CapIcon = cap.icon;
                return (
                  <div
                    key={i}
                    className="p-2.5 bg-muted/40 border border-border/60 rounded-xl flex items-center gap-2.5 text-foreground hover:border-cinema-amber-500/40 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-[11px]">{cap.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: AI STORY GENERATION */}
        {activeTab === 'ai-generation' && (
          <div id="careercanvas-ai-generation-panel" className="space-y-3 animate-fade-in">
            <p className="text-xs text-muted-foreground font-medium">
              Transform CareerCanvas professional history into cinematic, narrated ReelLegacy documentaries and timeline memoirs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { title: 'Professional Documentary', desc: 'Full career arc documentary with narration and photos.', type: 'Professional Documentary' },
                { title: 'Retirement Tribute', desc: 'Celebrate decades of service with milestone highlights.', type: 'Retirement Tribute' },
                { title: 'Graduation Memoir', desc: 'Academic journey and early career foundation story.', type: 'Graduation Documentary' },
                { title: 'Portfolio Timeline Events', desc: 'Convert major projects directly into story milestones.', type: 'Portfolio Milestones' },
                { title: 'Interview Prompts', desc: 'AI-generated oral history prompts from work history.', type: 'Interview Prompts' },
                { title: 'Biography Narration', desc: 'Synthesize audio narration directly from bio text.', type: 'Biography Narration' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-muted/40 border border-border rounded-xl space-y-2 hover:border-cinema-amber-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cinema-ai" /> {item.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIGenerateStory(item.type)}
                    className="mt-2 text-[10px] w-full border-border hover:border-cinema-amber-500 text-cinema-amber-500"
                  >
                    <span>Generate Story Node</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SYNC INTELLIGENCE */}
        {activeTab === 'sync-health' && (
          <div id="careercanvas-sync-health-panel" className="space-y-3 animate-fade-in font-mono text-xs">
            <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Synchronization Health Monitor
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                  HEALTHY (0 CONFLICTS)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Portfolio Ingested:</span>
                  <strong className="text-foreground">18 Records</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Last Successful Sync:</span>
                  <strong className="text-cinema-amber-500">{lastSyncTime}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">New Achievements:</span>
                  <strong className="text-emerald-400">2 Detected</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Biography Status:</span>
                  <strong className="text-cyan-400">Up to date</strong>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Vector Indexing Progress:</span>
                  <span className="text-emerald-400 font-bold">100% Synced</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUGGESTED WORKFLOW VISUAL */}
        {activeTab === 'workflow' && (
          <div id="careercanvas-workflow-panel" className="space-y-3 animate-fade-in">
            <p className="text-xs text-muted-foreground font-medium">
              Recommended end-to-end pipeline from CareerCanvas raw assets to finished cinematic documentary:
            </p>
            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center text-xs">
                {[
                  { step: '1', title: 'CareerCanvas', desc: 'Connect Account' },
                  { step: '2', title: 'Import History', desc: 'Sync Milestones' },
                  { step: '3', title: 'Legacy Profile', desc: 'Generate Bio Node' },
                  { step: '4', title: 'Timeline', desc: 'Map Career Points' },
                  { step: '5', title: 'Script', desc: 'AI Script Synthesis' },
                  { step: '6', title: 'Narration', desc: 'Voice Bed Generator' },
                  { step: '7', title: 'Render', desc: '4K Documentary' }
                ].map((s, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex-1 p-2 bg-card border border-border/80 rounded-xl space-y-1 w-full md:w-auto">
                      <span className="text-[9px] font-mono font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-1.5 py-0.5 rounded">
                        STEP {s.step}
                      </span>
                      <h5 className="font-bold text-foreground text-xs">{s.title}</h5>
                      <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                    </div>
                    {idx < 6 && (
                      <ChevronRight className="w-4 h-4 text-cinema-amber-500/60 hidden md:block shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEEP LINKING */}
        {activeTab === 'deep-links' && (
          <div id="careercanvas-deep-links-panel" className="space-y-3 animate-fade-in">
            <p className="text-xs text-muted-foreground font-medium">
              One-click deep links directly into the CareerCanvas suite application:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                'Open CareerCanvas Profile',
                'View Imported Projects',
                'Refresh Career History',
                'Open Portfolio',
                'Update Biography'
              ].map((linkName) => (
                <button
                  key={linkName}
                  id={`btn-deeplink-${linkName.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleDeepLink(linkName)}
                  className="p-3 bg-muted/40 hover:bg-muted border border-border hover:border-cinema-amber-500/50 rounded-xl transition-all flex items-center justify-between text-xs font-semibold text-foreground hover:text-cinema-amber-500 cursor-pointer"
                >
                  <span>{linkName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FUTURE IDEACODEX INTEGRATIONS (Coming Soon Placeholders) */}
      <div id="future-ideacodex-integrations" className="space-y-3 pt-2">
        <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-cinema-amber-500" /> Future IdeaCodex Suite Applications
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* IdeaCodex */}
          <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl space-y-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" /> IdeaCodex
              </span>
              <span className="text-[9px] font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20 font-bold">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Central Knowledge Graph Engine & Family Memory Vector Indexer.
            </p>
          </div>

          {/* WealthWave */}
          <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl space-y-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> WealthWave
              </span>
              <span className="text-[9px] font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20 font-bold">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Family Asset, Estate Legacy Trust & Historic Property Tracker.
            </p>
          </div>

          {/* Future IdeaCodex Suite */}
          <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl space-y-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cinema-ai" /> IdeaCodex Studio
              </span>
              <span className="text-[9px] font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20 font-bold">
                In Development
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Suite ecosystem tools for automated genealogical mapping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
