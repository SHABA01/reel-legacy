/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useTransition, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useOverlay } from '../../context/OverlayContext';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { FloatingStatsGrid } from '../ui/FloatingStatsGrid';
import {
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
} from '../ui/Skeleton';
import {
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Film,
  Calendar,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Tv,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronRight,
  Plus,
  Play,
  RotateCcw,
  WifiOff,
  Mic,
  Camera,
  Compass,
  MapPin,
  ListTodo,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { persistenceService, StoryService, ActivityService } from '../../storage';
import { ActivityHeatmap } from './ActivityHeatmap';

// Define the dashboard state modes
type DashboardStateMode =
  | 'returning'
  | 'new'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error'
  | 'permission';

export function DashboardView() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { openOverlay } = useOverlay();

  // Active state for sandbox testing
  const [dashboardMode, setDashboardMode] = useState<DashboardStateMode>('returning');
  const [isPending, startTransition] = useTransition();

  const [stats, setStats] = useState({
    storiesCount: 0,
    storiesMax: 15,
    avgProgress: 0,
    mediaCount: 0,
    timelineCount: 0,
    profilesCount: 0,
    profileNames: [] as string[],
    recentActivities: [] as { title: string; desc: string; time: string; iconColor: string }[],
  });

  const loadDashboardData = async () => {
    try {
      // 1. Fetch stories stats
      const storiesStats = await StoryService.getStatistics().catch(() => ({ total: 0, avgProgress: 0 }));
      
      // 2. Fetch media count
      const mediaCount = await persistenceService.media.count().catch(() => 0);
      
      // 3. Fetch timeline count
      const timelineCount = await persistenceService.timeline.count().catch(() => 0);
      
      // 4. Fetch profiles count & names
      const profilesCount = await persistenceService.profiles.count().catch(() => 0);
      const profiles = await persistenceService.profiles.getAll().catch(() => []);
      const profileNames = profiles.map(p => p.preferredName || `${p.firstName} ${p.lastName}`).slice(0, 3);
      
      // 5. Fetch recent activities from ActivityService
      const activities = await ActivityService.getActivities().catch(() => []);
      const formattedActivities = activities.map(act => ({
        title: act.title,
        desc: act.description,
        time: act.relativeTime || 'Just now',
        iconColor: act.iconColor || 'bg-cinema-amber-500',
      })).slice(0, 5);

      const finalActivities = formattedActivities.length > 0 ? formattedActivities : [
        {
          title: 'Welcome to ReelLegacy',
          desc: 'Your localized biographical vault and narrative studio is ready.',
          time: 'Just now',
          iconColor: 'bg-cinema-amber-500',
        },
        {
          title: 'Sandbox environment initialized',
          desc: 'Local browser repositories loaded successfully.',
          time: '5 mins ago',
          iconColor: 'bg-emerald-500',
        }
      ];

      setStats({
        storiesCount: storiesStats.total,
        storiesMax: Math.max(15, storiesStats.total),
        avgProgress: Math.round(storiesStats.avgProgress),
        mediaCount,
        timelineCount,
        profilesCount,
        profileNames,
        recentActivities: finalActivities,
      });
    } catch (err) {
      console.warn('Failed to load dashboard statistics:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('storage-activity-updated', handleUpdate);
    window.addEventListener('reellegacy-data-changed', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('storage-activity-updated', handleUpdate);
      window.removeEventListener('reellegacy-data-changed', handleUpdate);
    };
  }, []);

  // Onboarding Checklist state for "New User" mode
  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 'step-1', label: 'Create your Co-Author Biography Account', completed: true },
    { id: 'step-2', label: 'Establish your first Legacy Family Profile (e.g. Matriarch Elizabeth)', completed: false },
    { id: 'step-3', label: 'Import 5 source memory elements (old letters, vintage photos)', completed: false },
    { id: 'step-4', label: 'Write your first synthetic voice narration script outline', completed: false },
    { id: 'step-5', label: 'Trigger compilation of your initial 3D Ken Burns scene', completed: false },
  ]);

  // Micro-permissions toggles for "Permission Placeholder" mode
  const [permissions, setPermissions] = useState({
    mic: 'prompt', // prompt, granted, denied
    camera: 'prompt',
    storage: 'prompt',
  });

  // Welcome display name helper
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Biographer';

  // Toggle onboarding steps
  const toggleOnboardingStep = (id: string) => {
    setOnboardingSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
    const step = onboardingSteps.find((s) => s.id === id);
    if (step) {
      showToast(
        'success',
        step.completed ? 'Milestone Marked Active' : 'Milestone Completed!',
        `Your onboarding roadmap has been synchronized.`
      );
    }
  };

  // Onboarding progress percentage
  const onboardingProgress = Math.round(
    (onboardingSteps.filter((s) => s.completed).length / onboardingSteps.length) * 100
  );

  // Handle mock permission requests
  const requestPermission = (key: 'mic' | 'camera' | 'storage') => {
    showToast('loading', `Requesting platform access...`, `Prompting user for system permission.`);
    setTimeout(() => {
      setPermissions((prev) => ({ ...prev, [key]: 'granted' }));
      showToast(
        'success',
        `${key === 'mic' ? 'Microphone' : key === 'camera' ? 'Camera' : 'File Vault'} Unlocked`,
        `Platform capability has been registered in security credentials.`
      );
    }, 800);
  };

  // Simulate network recovery in "Offline" mode
  const triggerOnlineSync = () => {
    showToast('loading', 'Scanning cached memories...', 'Uploading offline story vaults to database.');
    setTimeout(() => {
      setDashboardMode('returning');
      showToast('success', 'Workspace Synchronized!', 'Local sandbox changes merged with Cloud Run cloud storage.');
    }, 1500);
  };

  // Reboot pipeline in "Error" mode
  const triggerPipelineReboot = () => {
    showToast('loading', 'Resetting rendering thread...', 'Re-routing frame buffer queues.');
    setTimeout(() => {
      setDashboardMode('returning');
      showToast('success', 'Pipeline Re-compiled Successfully', 'All audio frame alignments matched and verified.');
    }, 1500);
  };

  return (
    <div id="main-dashboard-viewport" className="space-y-8 animate-fade-in text-foreground pb-8 pt-2.5 md:pt-4 lg:pt-5">
      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* STATE A: LOADING SHIMMER STATE                            */}
        {/* ========================================================= */}
        {dashboardMode === 'loading' && (
          <motion.div
            key="loading-shimmers"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-8"
            id="loading-shimmer-state"
          >
            {/* Header shimmer */}
            <div className="p-6 border border-border bg-card/40 rounded-2xl flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted animate-pulse rounded-lg w-1/4" />
                <div className="h-3 bg-muted animate-pulse rounded-lg w-1/2" />
              </div>
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
            </div>

            {/* Stat card shimmers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-card/30 space-y-3">
                  <div className="h-3 bg-muted animate-pulse rounded-lg w-1/3" />
                  <div className="h-6 bg-muted animate-pulse rounded-lg w-1/2" />
                  <div className="h-2 bg-muted animate-pulse rounded-lg w-full" />
                </div>
              ))}
            </div>

            {/* Content grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 border border-border bg-card rounded-2xl">
                  <div className="h-4 bg-muted animate-pulse rounded-lg w-1/3 mb-4" />
                  <SkeletonTable rows={3} cols={3} />
                </div>
                <div className="p-6 border border-border bg-card rounded-2xl">
                  <div className="h-4 bg-muted animate-pulse rounded-lg w-1/3 mb-4" />
                  <SkeletonCard />
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 border border-border bg-card rounded-2xl">
                  <div className="h-4 bg-muted animate-pulse rounded-lg w-1/3 mb-4" />
                  <SkeletonList rows={4} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE B: EMPTY DASHBOARD STATE                            */}
        {/* ========================================================= */}
        {dashboardMode === 'empty' && (
          <motion.div
            key="empty-dashboard"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-8"
            id="empty-dashboard-state"
          >
            {/* Header Banner */}
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-center sm:text-left z-10">
                <h2 className="font-display text-2xl font-black text-foreground">Welcome to your Blank Canvas</h2>
                <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                  Every family legacy begins with a single photograph or written script fragment. Create a legacy profile or upload materials to start compiling memoirs.
                </p>
              </div>
              <Button
                id="empty-create-story-btn"
                variant="accent"
                leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
                onClick={() => {
                  setDashboardMode('new');
                  showToast('info', 'Loaded Onboarding Path', 'Complete the step guidelines to build data.');
                }}
                className="shrink-0"
              >
                Start Onboarding Path
              </Button>
            </div>

            {/* Empty stats mock cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Stories Drafted', val: '0' },
                { title: 'Media Files', val: '0 Files' },
                { title: 'Render Jobs', val: '0' },
                { title: 'Legacy Profiles', val: '0 Profiles' },
              ].map((stat, idx) => (
                <div key={idx} className="p-5 bg-card/40 border border-border rounded-2xl text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-black text-muted-foreground/60">{stat.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmptyState
                type="stories"
                title="No Memoir Drafts Active"
                description="Your workspace currently contains no family biography books, interview scrapbooks, or scripts."
                primaryActionLabel="Write First Script"
                onPrimaryAction={() => showToast('info', 'Routing to Narration Studio...')}
              />
              <EmptyState
                type="media"
                title="No Memory Assets Uploaded"
                description="We haven't indexed any vintage photos, birth certificates, audio voices, or letter files."
                primaryActionLabel="Upload Memory Files"
                onPrimaryAction={() => showToast('info', 'Opening upload panel...')}
              />
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE C: OFFLINE PLACEHOLDER STATE                         */}
        {/* ========================================================= */}
        {dashboardMode === 'offline' && (
          <motion.div
            key="offline-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
            id="offline-dashboard-state"
          >
            {/* Banner Warning */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <WifiOff className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                <div className="space-y-1 text-left">
                  <span className="font-bold text-white block text-sm">Offline Sandbox Cache Mode</span>
                  <p className="leading-relaxed text-[#94a3b8] text-xs">
                    Connection to the server was interrupted. Any memoirs edited, scripts saved, or profile drafts updated will be safely queued inside your local secure sandbox memory and uploaded when network capabilities recover.
                  </p>
                </div>
              </div>
              <Button
                id="btn-sync-offline"
                onClick={triggerOnlineSync}
                variant="primary"
                size="sm"
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold font-mono py-2 shrink-0"
              >
                Simulate Sync Now
              </Button>
            </div>

            {/* Lower opacity preview representing greyed-out dashboard states */}
            <div className="opacity-50 pointer-events-none select-none space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 border bg-card rounded-2xl border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Local Memory Vault</h4>
                  <p className="text-xl font-bold">12 Items Queued</p>
                </div>
                <div className="p-5 border bg-card rounded-2xl border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Pending Assets</h4>
                  <p className="text-xl font-bold">3 Upload Jobs</p>
                </div>
                <div className="p-5 border bg-card rounded-2xl border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Local Draft Status</h4>
                  <p className="text-xl font-bold text-emerald-500">Auto-saved</p>
                </div>
              </div>

              <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground">
                <WifiOff className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-foreground">Interactive Features Paused</p>
                <p className="text-xs max-w-sm mx-auto mt-1">Real-time AI compilation features and voice transcription are paused until online communication with the container is restored.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE D: COMPILATION ERROR STATE                          */}
        {/* ========================================================= */}
        {dashboardMode === 'error' && (
          <motion.div
            key="error-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
            id="error-dashboard-state"
          >
            <ErrorState
              type="render-failure"
              title="Pipeline Compilation Aborted"
              description="A fatal script alignment error occurred during generation: frame timestamps in 'Elizabeth_Wedding_1965' did not match voiceover narration tracks. Rendering pipeline terminated to protect project assets."
              retryActionLabel="Force Pipeline Reboot"
              onRetry={triggerPipelineReboot}
              secondaryActionLabel="Open Diagnostics Console"
              onSecondaryAction={() => showToast('info', 'Opening debug diagnostics console...')}
            />

            {/* Log Trace Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850/60 font-mono text-[11px] text-red-400 space-y-2 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1 text-slate-500 text-[10px]">
                <span className="font-bold flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> DIAGNOSTICS LOG TRACE: JOB_0x7FFA</span>
                <span>FAIL_IN_NODE_5</span>
              </div>
              <p className="text-slate-500">[08:42:11] Init compiling thread on container port 3000...</p>
              <p className="text-slate-500">[08:42:12] Mapped 14 raw vintage photos inside memory buffer.</p>
              <p className="text-[#38bdf8]">[08:42:13] Loading speech synthesis narration track: 'Elizabeth_Bio_Narration.wav' (Duration: 35.8s)</p>
              <p className="text-amber-400">[08:42:14] WARN: Narrative timeline covers 42.0 seconds. 6.2 seconds visual deficit identified.</p>
              <p className="text-red-500 font-bold">[08:42:15] FATAL: Keyframe buffer boundary overrun. Timestamps alignment misaligned. Render core aborted.</p>
              <p className="text-red-500">[08:42:15] exit status 1. Core node crashed.</p>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE E: SYSTEM PERMISSIONS STATE                         */}
        {/* ========================================================= */}
        {dashboardMode === 'permission' && (
          <motion.div
            key="permissions-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            id="permissions-dashboard-state"
          >
            {/* Permission Card 1: Mic */}
            <div className="p-6 bg-card border border-border rounded-2xl flex flex-col justify-between text-left space-y-5">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  permissions.mic === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                }`}>
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Studio Microphone Access</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Required to record real-time biographer narrations, voiceovers, and family interviews directly into active scenes.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  permissions.mic === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                  {permissions.mic === 'granted' ? 'Active / Granted' : 'Pending Access'}
                </span>
                {permissions.mic !== 'granted' && (
                  <Button
                    id="btn-permit-mic"
                    variant="primary"
                    size="sm"
                    onClick={() => requestPermission('mic')}
                  >
                    Grant Access
                  </Button>
                )}
              </div>
            </div>

            {/* Permission Card 2: Camera */}
            <div className="p-6 bg-card border border-border rounded-2xl flex flex-col justify-between text-left space-y-5">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  permissions.camera === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                }`}>
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Live Recording Camera</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Used inside the Narration Studio to capture video testimonies or scan physical historical photos on-screen via webcam.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  permissions.camera === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                  {permissions.camera === 'granted' ? 'Active / Granted' : 'Pending Access'}
                </span>
                {permissions.camera !== 'granted' && (
                  <Button
                    id="btn-permit-camera"
                    variant="primary"
                    size="sm"
                    onClick={() => requestPermission('camera')}
                  >
                    Grant Access
                  </Button>
                )}
              </div>
            </div>

            {/* Permission Card 3: Storage */}
            <div className="p-6 bg-card border border-border rounded-2xl flex flex-col justify-between text-left space-y-5">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  permissions.storage === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                }`}>
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base">Storage Vault Permissions</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Allows reading large vintage video recordings and writing compiled high-definition MP4 cinematic story packages.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  permissions.storage === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                  {permissions.storage === 'granted' ? 'Active / Granted' : 'Pending Access'}
                </span>
                {permissions.storage !== 'granted' && (
                  <Button
                    id="btn-permit-storage"
                    variant="primary"
                    size="sm"
                    onClick={() => requestPermission('storage')}
                  >
                    Grant Access
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE F: NEW USER ONBOARDING PATH                          */}
        {/* ========================================================= */}
        {dashboardMode === 'new' && (
          <motion.div
            key="new-user-onboarding"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-8"
            id="new-user-dashboard-state"
          >
            {/* Welcome Greeting Banner */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#1e293b] to-slate-900 text-white relative overflow-hidden shadow-xl border border-slate-800">
              <div className="relative z-10 max-w-xl space-y-3 text-left">
                <span className="text-[10px] tracking-widest uppercase font-bold text-cinema-amber-400 bg-cinema-amber-500/10 px-2.5 py-1 rounded-full border border-cinema-amber-500/20">
                  Onboarding Wizard Active
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-white">
                  Begin Your Legacy Chronicle, {displayName}!
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Your space is empty, but your family history is rich. Follow our curated biographic milestone roadmap to index photos, draft narratives, and render vintage scenes.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
                <Compass className="w-48 h-48 text-cinema-amber-500 animate-spin-slow" />
              </div>
            </div>

            {/* Checklist Box & Guides */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Checklist Panel */}
              <div className="lg:col-span-2 p-6 bg-card border border-border rounded-2xl space-y-6 shadow-sm">
                <div className="border-b border-border pb-3 text-left">
                  <h3 className="font-display text-base font-semibold flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-cinema-amber-500" /> Milestone Action Checklist
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete these modular guides to generate your first cinematic chapter. Click to toggle.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">Chronicle Setup Progress</span>
                    <span className="font-mono text-cinema-amber-500 font-bold">{onboardingProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/60">
                    <div
                      className="bg-cinema-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${onboardingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Steps items list */}
                <div className="space-y-2.5" id="onboarding-steps-list">
                  {onboardingSteps.map((step) => (
                    <button
                      key={step.id}
                      id={`onboarding-step-row-${step.id}`}
                      onClick={() => toggleOnboardingStep(step.id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        step.completed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground/80'
                          : 'bg-card hover:bg-muted/40 border-border text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-muted-foreground'
                        }`}>
                          {step.completed && <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0 fill-current" />}
                        </div>
                        <span className={`text-xs font-semibold ${step.completed ? 'line-through text-muted-foreground font-medium' : ''}`}>
                          {step.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Quick-Start Guides */}
              <div className="space-y-6">
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 text-left">
                  <h3 className="font-display text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cinema-ai" /> Creative Companion Suggestion
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "I noticed you haven't established your first legacy profile yet. Consider creating one for Elizabeth Vance. Tap the quick action below to map out her birth dates, home address coordinates, and primary vintage photo."
                  </p>
                  <Button
                    id="onboarding-companion-btn"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      showToast('success', 'Profile wizard initiated');
                    }}
                    className="w-full text-xs py-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
                  >
                    Establish First Profile
                  </Button>
                </div>

                {/* Helpful resources */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Helpful Resources</h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <a href="#rules" className="text-cinema-amber-500 hover:underline flex items-center gap-1.5 font-medium">
                        • Understanding Workspace Rules
                      </a>
                    </li>
                    <li>
                      <a href="#scanning" className="text-cinema-amber-500 hover:underline flex items-center gap-1.5 font-medium">
                        • Tips for high-quality vintage photo scanning
                      </a>
                    </li>
                    <li>
                      <a href="#narrating" className="text-cinema-amber-500 hover:underline flex items-center gap-1.5 font-medium">
                        • Recording voiceover on consumer webcams
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE G: RETURNING USER ACTIVE EXPERIENCE (Default)      */}
        {/* ========================================================= */}
        {dashboardMode === 'returning' && (
          <motion.div
            key="returning-user"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-8"
            id="active-returning-state"
          >
            {/* Welcoming Banner with stats snippet */}
            <div className="p-6 md:p-8 rounded-2xl bg-card text-foreground dark:text-white relative overflow-hidden shadow-md border border-border pretty-float-card">
              <div className="relative z-10 max-w-xl space-y-3 text-left" id="welcome-text">
                <span className="text-[10px] tracking-widest uppercase font-bold text-cinema-amber-700 dark:text-cinema-amber-400 bg-cinema-amber-500/15 dark:bg-cinema-amber-500/10 px-2.5 py-1 rounded-full border border-cinema-amber-500/30 dark:border-cinema-amber-500/20">
                  Lead Archivist Account Active
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Welcome back, {displayName}!
                </h2>
                <p className="text-xs md:text-sm text-slate-600 dark:text-cinema-slate-300 leading-relaxed font-semibold">
                  What would you like to do?
                </p>
                <div className="flex gap-2 pt-1.5">
                  <Button
                    id="returning-banner-primary"
                    variant="accent"
                    size="sm"
                    onClick={() => openOverlay('ai')}
                    rightIcon={<Sparkles className="w-3.5 h-3.5 text-slate-950" />}
                    className="text-xs"
                  >
                    Consult AI Director
                  </Button>
                  <Button
                    id="returning-banner-secondary"
                    variant="ghost"
                    size="sm"
                    onClick={() => openOverlay('notifications')}
                    className="text-xs border border-slate-200 dark:border-border text-slate-700 dark:text-cinema-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-muted/30"
                  >
                    Review active tasks
                  </Button>
                </div>
              </div>
              <div className="absolute right-10 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center" id="welcome-graphic">
                <Film className="w-48 h-48 text-cinema-amber-600 dark:text-cinema-amber-500 rotate-12" />
              </div>
            </div>

            {/* 1. Statistic Cards Row */}
            <FloatingStatsGrid
              id="stat-cards-grid"
              stats={[
                {
                  id: 'stat-card-stories',
                  label: 'Stories Drafted',
                  value: `${stats.storiesCount} / ${stats.storiesMax}`,
                  subValue: (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stats.avgProgress}% Avg Progress
                    </span>
                  ),
                  icon: BookOpen,
                  iconBgClass: 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20',
                },
                {
                  id: 'stat-card-media',
                  label: 'Media Shelf',
                  value: `${stats.mediaCount} Files`,
                  subValue: <span className="text-muted-foreground">Audio, video, clipping docs</span>,
                  icon: ImageIcon,
                  iconBgClass: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
                },
                {
                  id: 'stat-card-render',
                  label: 'Timeline Chronology',
                  value: `${stats.timelineCount} Events`,
                  subValue: (
                    <span className="text-indigo-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Historical milestones
                    </span>
                  ),
                  icon: Film,
                  iconBgClass: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
                },
                {
                  id: 'stat-card-profiles',
                  label: 'Legacy Profiles',
                  value: `${stats.profilesCount} Registered`,
                  subValue: (
                    <span className="text-muted-foreground truncate max-w-[150px]">
                      {stats.profileNames.length > 0 ? stats.profileNames.join(', ') : 'No profiles registered'}
                    </span>
                  ),
                  icon: UserCheck,
                  iconBgClass: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
                },
              ]}
            />

            {/* 2. Main Dashboard Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="returning-layout-grid">
              {/* Left & Center Main Column */}
              <div className="lg:col-span-2 space-y-6" id="left-returning-col">
                {/* Continue Editing / Continue Working Card */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-sm text-left pretty-float-card" id="continue-editing-card">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-1">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cinema-amber-500" /> Continue Chronicle Work
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Resume your active biography script templates and chapter outlines.
                      </p>
                    </div>
                    <Button
                      id="view-all-stories-btn"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-cinema-amber-500 hover:text-cinema-amber-600 px-2 cursor-pointer"
                    >
                      All Drafts
                    </Button>
                  </div>

                  {/* Active Drafts Rows */}
                  <div className="space-y-3" id="continue-drafts-list">
                    {[
                      {
                        title: 'The Vance Family Reunion (1984)',
                        type: 'Historical Chapter Outline',
                        time: 'Edited 12 mins ago',
                        progress: 85,
                        color: 'bg-cinema-amber-500',
                      },
                      {
                        title: "Grandpa Bob's Childhood Farmhouse",
                        type: 'Narration Script Card',
                        time: 'Edited 2 hours ago',
                        progress: 42,
                        color: 'bg-indigo-500',
                      },
                      {
                        title: 'Elizabeth Vance: The Early Years',
                        type: 'Legacy Profile Dossier',
                        time: 'Edited Yesterday',
                        progress: 90,
                        color: 'bg-emerald-500',
                      },
                    ].map((draft, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                        id={`continue-draft-${idx}`}
                      >
                        <div className="space-y-1 text-left flex-1 min-w-0">
                          <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase">
                            {draft.type}
                          </span>
                          <p className="text-sm font-bold text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                            {draft.title}
                          </p>
                          <div className="flex items-center gap-3 pt-1">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" /> {draft.time}
                            </span>
                            <span className="text-border text-[10px]">|</span>
                            <div className="flex items-center gap-1.5 flex-1 max-w-[100px] sm:max-w-[120px]">
                              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/40">
                                <div
                                  className={`h-full rounded-full ${draft.color}`}
                                  style={{ width: `${draft.progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono font-bold">{draft.progress}%</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          id={`btn-resume-draft-${idx}`}
                          variant="secondary"
                          size="sm"
                          leftIcon={<Play className="w-3.5 h-3.5 transition-all" />}
                          className="shrink-0 text-xs border resume-btn-style transition-all cursor-pointer"
                        >
                          Resume
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Memory Imports Card */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-sm text-left pretty-float-card" id="recent-media-card">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-1">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-500" /> Recent Memory Imports
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Index sheets, vintage photography folders, and audio scripts imported into active slots.
                      </p>
                    </div>
                    <Button
                      id="view-all-media-btn"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-cinema-amber-500 hover:text-cinema-amber-600 px-2 cursor-pointer"
                    >
                      Media Shelf
                    </Button>
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="recent-media-imports-grid">
                    {[
                      {
                        title: 'farmhouse_clippings.pdf',
                        size: '4.8 MB',
                        type: 'document',
                        thumbText: 'PDF',
                        thumbBg: 'bg-red-500/10 text-red-500 border-red-500/20',
                      },
                      {
                        title: 'wedding_portrait_1965.jpg',
                        size: '12.4 MB',
                        type: 'image',
                        thumbText: 'IMG',
                        thumbBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                      },
                      {
                        title: 'bob_radio_speech.wav',
                        size: '28.1 MB',
                        type: 'audio',
                        thumbText: 'WAV',
                        thumbBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                      },
                      {
                        title: 'family_ reunion_super8.mp4',
                        size: '142.0 MB',
                        type: 'video',
                        thumbText: 'MP4',
                        thumbBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                      },
                    ].map((media, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-border bg-card/60 hover:border-cinema-amber-500/30 rounded-xl transition-all flex flex-col justify-between text-left space-y-3 group cursor-pointer"
                        id={`recent-media-item-${idx}`}
                      >
                        {/* Mock Thumb */}
                        <div className={`w-full aspect-video rounded-lg flex items-center justify-center font-mono font-black text-sm border ${media.thumbBg}`}>
                          {media.thumbText}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[11px] font-bold text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                            {media.title}
                          </p>
                          <p className="text-[9px] text-muted-foreground font-mono">{media.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Templates Library */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-sm text-left pretty-float-card" id="favorite-templates-card">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-1">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-500" /> Premium Biography Blueprints
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Ready-to-use chapter blueprints tailored to structure legacy stories cleanly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="fav-templates-grid">
                    {[
                      {
                        title: 'Military Honor Record',
                        desc: 'Structured with military active duty timelines, medals, service highlights, and veteran speech tracks.',
                        count: '5 Scenes outline',
                        accent: 'border-l-indigo-500',
                      },
                      {
                        title: 'Golden Anniversary Memoir',
                        desc: 'Chronicles marriage, child birth logs, early family homes, wedding clippings, and narrator scripts.',
                        count: '8 Scenes outline',
                        accent: 'border-l-cinema-amber-500',
                      },
                    ].map((temp, idx) => (
                      <div
                        key={idx}
                        className={`p-4 bg-card/50 border border-border border-l-4 rounded-r-xl rounded-l-xs flex flex-col justify-between text-left space-y-3 ${temp.accent} hover:bg-muted/20 transition-colors`}
                        id={`fav-template-item-${idx}`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-foreground">{temp.title}</h4>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {temp.desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1.5">
                          <span>{temp.count}</span>
                          <button
                            id={`btn-apply-template-${idx}`}
                            onClick={() => showToast('success', `${temp.title} applied to outline`)}
                            className="text-cinema-amber-500 hover:underline flex items-center font-bold font-sans cursor-pointer"
                          >
                            Apply Outline <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Utility & Secondary Column */}
              <div className="space-y-6" id="right-returning-col">
                {/* Storage Usage Card */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-5 shadow-sm text-left pretty-float-card" id="storage-usage-card">
                  <div className="border-b border-border pb-3 mb-1">
                    <h3 className="font-display text-sm font-bold text-foreground">Workspace Storage Vault</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Document archives and video render cache allocation.
                    </p>
                  </div>

                  {/* Storage Allocation Progress */}
                  <div className="space-y-3" id="storage-indicator-bars">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Total Allocation Used</span>
                      <span className="font-mono font-bold text-cinema-amber-500">4.2 GB / 10.0 GB</span>
                    </div>
                    {/* Linear Split bar */}
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border flex">
                      <div className="bg-cinema-amber-500 h-full" style={{ width: '21%' }} title="Video Render cache: 2.1 GB" />
                      <div className="bg-indigo-500 h-full" style={{ width: '12%' }} title="Voice Synthesis Audio: 1.2 GB" />
                      <div className="bg-emerald-500 h-full" style={{ width: '9%' }} title="Clipping PDF Documents: 0.9 GB" />
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]" id="storage-legend">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-cinema-amber-500" />
                        <div>
                          <span className="font-bold text-foreground block">Video (2.1G)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <div>
                          <span className="font-bold text-foreground block">Audio (1.2G)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <span className="font-bold text-foreground block">Docs (0.9G)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips & Tutorials Card */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-3 text-left pretty-float-card" id="tips-tutorials-card">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cinema-amber-500" /> Documentary Studio Lessons
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Learn how to apply elegant zooms, control subtitles alignment, or manage co-author cloud roles.
                  </p>
                  <div className="space-y-2 pt-1" id="lessons-list">
                    <a href="#tutorial-zoom" className="group block p-2.5 rounded-lg hover:bg-muted/40 transition-colors border border-border/40 text-xs">
                      <span className="font-semibold block group-hover:text-cinema-amber-500 transition-colors">Lesson 1: The Ken Burns Pan Speed</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Match panning durations with narrative pacing.</p>
                    </a>
                    <a href="#tutorial-audio" className="group block p-2.5 rounded-lg hover:bg-muted/40 transition-colors border border-border/40 text-xs">
                      <span className="font-semibold block group-hover:text-cinema-amber-500 transition-colors">Lesson 2: Vocal Timbre Calibrations</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Set speech accents, pauses, and speech velocity.</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Workspace Contribution Ledger */}
            <ActivityHeatmap />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
