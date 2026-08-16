/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useTransition, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useOverlay } from '../../context/OverlayContext';
import { useInspector } from '../../context/InspectorContext';
import { Button } from '../ui/Button';
import { ViewModeToggle } from '../ui/ViewModeToggle';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import {
  SkeletonCard,
  SkeletonList,
} from '../ui/Skeleton';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  WifiOff,
  Mic,
  Camera,
  Compass,
  ListTodo,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { persistenceService, StoryService, ActivityService } from '../../storage';
import {
  MissionOverviewHero,
  ContinueWorkingSection,
  AiRecommendationsSection,
  TodaysTasksSection,
  RecentActivitySection,
  QuickActionsGrid,
  WorkspaceSnapshotGrid,
  SmartStatusWidgets,
} from './MissionControlComponents';

// Define the dashboard state modes for sandbox testing
type DashboardStateMode =
  | 'returning'
  | 'new'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error'
  | 'permission';

export function DashboardView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { openOverlay } = useOverlay();
  const { setSelection, openInspector } = useInspector();

  // Active state for sandbox testing
  const [dashboardMode, setDashboardMode] = useState<DashboardStateMode>('returning');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
        },
        {
          title: 'Scene compilation complete',
          desc: '1984 Reunion Scene #2 frame buffer compiled.',
          time: '12 mins ago',
          iconColor: 'bg-indigo-500',
        },
      ];

      setStats({
        storiesCount: storiesStats.total || 8,
        storiesMax: Math.max(15, storiesStats.total || 8),
        avgProgress: Math.round(storiesStats.avgProgress) || 72,
        mediaCount: mediaCount || 18,
        timelineCount: timelineCount || 12,
        profilesCount: profilesCount || 4,
        profileNames: profileNames.length > 0 ? profileNames : ['Matriarch Elizabeth', 'Grandpa Bob', 'Aunt Clara'],
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
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Lead Biographer';

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

  // Helper to handle selection and open Context Panel
  const handleInspectSelection = (type: any, data: any) => {
    setSelection(type, data);
    openInspector();
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
            <div className="p-6 border border-border bg-card/40 rounded-2xl flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted animate-pulse rounded-lg w-1/4" />
                <div className="h-3 bg-muted animate-pulse rounded-lg w-1/2" />
              </div>
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            <SkeletonList rows={3} />
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE B: EMPTY STATE                                     */}
        {/* ========================================================= */}
        {dashboardMode === 'empty' && (
          <motion.div
            key="empty-dashboard"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            id="empty-dashboard-state"
          >
            <EmptyState
              id="dashboard-empty-card"
              title="No Stories or Memory Items Found"
              description="Your biographical workspace is currently unpopulated. Create your first family profile or start a new narrative chapter to populate your Mission Control."
              primaryActionLabel="Create First Story"
              onPrimaryAction={() => navigate('/workspace/story-studio')}
            />
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE C: OFFLINE DISCONNECTED STATE                       */}
        {/* ========================================================= */}
        {dashboardMode === 'offline' && (
          <motion.div
            key="offline-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-8 bg-card border border-amber-500/30 rounded-2xl text-center space-y-6 shadow-lg"
            id="offline-dashboard-state"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
              <WifiOff className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="font-display font-bold text-xl text-foreground">Offline Vault Operational</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Network connection lost. You are currently operating in local cached sandbox mode. Edits will sync automatically upon reconnection.
              </p>
            </div>
            <Button
              id="btn-sync-offline"
              variant="accent"
              onClick={triggerOnlineSync}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Attempt Cloud Reconnection
            </Button>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE D: ERROR / PIPELINE FAILURE STATE                   */}
        {/* ========================================================= */}
        {dashboardMode === 'error' && (
          <motion.div
            key="error-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            id="error-dashboard-state"
          >
            <ErrorState
              id="dashboard-error-card"
              title="Render Pipeline Interrupted"
              description="A hardware audio frame buffer mismatch occurred in the local GPU sandbox thread while compiling Scene #4."
              onRetry={triggerPipelineReboot}
            />
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE E: MICRO-PERMISSION ACCESS PLACEHOLDER              */}
        {/* ========================================================= */}
        {dashboardMode === 'permission' && (
          <motion.div
            key="permission-state"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            id="permission-dashboard-state"
          >
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
                  <h3 className="font-display font-bold text-base">Narration Microphone Access</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Required to record real-time voiceover audio clips directly inside the Narration Studio.
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
                    Used inside Narration Studio to capture video testimonies or scan physical photos.
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
                    Allows reading large video recordings and writing compiled high-definition MP4 cinematic packages.
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
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border text-foreground relative overflow-hidden shadow-md">
              <div className="relative z-10 max-w-xl space-y-3 text-left">
                <span className="text-[10px] tracking-widest uppercase font-bold text-cinema-amber-500 bg-cinema-amber-500/15 px-2.5 py-1 rounded-full border border-cinema-amber-500/30">
                  Onboarding Wizard Active
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Begin Your Legacy Chronicle, {displayName}!
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Follow our curated biographic milestone roadmap to index photos, draft narratives, and render vintage scenes.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
                <Compass className="w-48 h-48 text-cinema-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 bg-card border border-border rounded-2xl space-y-6 shadow-sm">
                <div className="border-b border-border pb-3 text-left">
                  <h3 className="font-display text-base font-semibold flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-cinema-amber-500" /> Milestone Action Checklist
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete these modular guides to generate your first cinematic chapter. Click to toggle.
                  </p>
                </div>

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
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-muted-foreground'
                        }`}>
                          {step.completed && <CheckCircle2 className="w-4 h-4 fill-current shrink-0" />}
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

              <div className="space-y-6">
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 text-left">
                  <h3 className="font-display text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> AI Director Recommendation
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "Consider creating your first legacy profile for Elizabeth Vance to establish her birth dates, location coordinates, and vintage photos."
                  </p>
                  <Button
                    id="onboarding-companion-btn"
                    variant="accent"
                    size="sm"
                    onClick={() => navigate('/workspace/legacy-profiles')}
                    className="w-full text-xs py-2 font-bold"
                  >
                    Establish First Profile
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STATE G: MISSION CONTROL DASHBOARD (PRIMARY WORKSPACE)     */}
        {/* ========================================================= */}
        {dashboardMode === 'returning' && (
          <motion.div
            key="returning-user"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6 md:space-y-8"
            id="active-mission-control-state"
          >
            {/* 1. HERO MISSION OVERVIEW & KPIS */}
            <MissionOverviewHero
              displayName={displayName}
              onConsultAi={() => openOverlay('ai')}
              onSelectKpi={handleInspectSelection}
            />

            {/* 2. OPERATIONAL WORKSPACE HEADER & VIEW TOGGLE */}
            <div
              id="dashboard-workspace-header"
              className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs text-left"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display font-bold text-base text-foreground">
                    Operational Control Center
                  </h2>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cinema-amber-500 bg-cinema-amber-500/10 px-2.5 py-0.5 rounded-full border border-cinema-amber-500/20">
                    {viewMode === 'grid' ? 'Grid View Active' : 'List View Active'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Real-time active modules, recommendations, and studio health telemetry.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                  View Mode:
                </span>
                <ViewModeToggle
                  id="dashboard-layout-view-toggle"
                  viewMode={viewMode}
                  onChange={(mode) => setViewMode(mode)}
                />
              </div>
            </div>

            {/* 3. MAIN BALANCED RESPONSIVE WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="mission-control-layout-grid">
              {/* Left Column (50% Width) */}
              <div className="space-y-6" id="mission-left-col">
                {/* Continue Active Work */}
                <ContinueWorkingSection
                  viewMode={viewMode}
                  onSelectItem={handleInspectSelection}
                />

                {/* Today's Tasks Section (Lightweight Task Center) */}
                <TodaysTasksSection
                  viewMode={viewMode}
                  onSelectTask={(task) =>
                    handleInspectSelection('task', task)
                  }
                />

                {/* AI Recommendations Section (Actionable AI Advisor) */}
                <AiRecommendationsSection
                  viewMode={viewMode}
                  onSelectRecommendation={(rec) =>
                    handleInspectSelection('recommendation', rec)
                  }
                />

                {/* Workspace Snapshot Grid */}
                <WorkspaceSnapshotGrid
                  viewMode={viewMode}
                  stats={stats}
                  onSelectSnapshot={handleInspectSelection}
                />
              </div>

              {/* Right Column (50% Width) */}
              <div className="space-y-6" id="mission-right-col">
                {/* Quick Actions Shortcuts Grid */}
                <QuickActionsGrid viewMode={viewMode} />

                {/* Operational Studio Health */}
                <SmartStatusWidgets viewMode={viewMode} />

                {/* Operational Activity Stream */}
                <RecentActivitySection
                  viewMode={viewMode}
                  activities={stats.recentActivities}
                  onSelectActivity={(act) =>
                    handleInspectSelection('activity', act)
                  }
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
