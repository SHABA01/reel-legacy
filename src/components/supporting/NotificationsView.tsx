/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Check,
  Trash2,
  Archive,
  BookOpen,
  User,
  Clock,
  Sparkles,
  Film,
  ShieldAlert,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Info,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Layers,
  Zap,
  Mic,
  Video,
  Database,
  Unlink,
  MessageSquare,
  CheckCircle2,
  X,
  ArrowUpRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useInspector } from '../../context/InspectorContext';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { EmptyState } from '../ui/EmptyState';

export interface NotificationItem {
  id: string;
  category: 'stories' | 'ai' | 'production' | 'profiles' | 'media' | 'system' | 'security' | 'account';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier This Week' | 'Last Week' | 'Older';
  unread: boolean;
  needsAction?: boolean;
  relatedStory?: string;
  relatedProfile?: string;
  targetWorkspace: string;
  targetPath: string;
  actionLabel?: string;
  aiDiagnosis?: string;
  recommendedAction?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-p1',
    category: 'production',
    priority: 'critical',
    title: '4K Render Failed: Audio Track Mismatch',
    description: 'The documentary "The Legacy of Elizabeth Vance (1932-2024)" failed render at 84% due to missing narration stem in Scene 4.',
    time: '10:14 AM',
    dateGroup: 'Today',
    unread: true,
    needsAction: true,
    relatedStory: 'The Legacy of Elizabeth Vance',
    relatedProfile: 'Elizabeth Vance',
    targetWorkspace: 'Render Queue',
    targetPath: '/workspace/render-queue',
    actionLabel: 'Retry Render Job',
    aiDiagnosis: 'Audio stem missing in track 3. Automated fallback synthesizer or re-linking required.',
    recommendedAction: 'Click Retry to re-synthesize missing audio stem and launch 4K export.'
  },
  {
    id: 'notif-p2',
    category: 'ai',
    priority: 'high',
    title: 'AI Screenplay Draft Generated',
    description: 'AI Director generated Scene 2 ("The Farmhouse Era") script outline using 4 oral transcripts.',
    time: '08:30 AM',
    dateGroup: 'Today',
    unread: true,
    needsAction: true,
    relatedStory: 'Memoirs of Kansas Prairie',
    relatedProfile: 'Robert Vance Senior',
    targetWorkspace: 'Story Studio',
    targetPath: '/workspace/story-studio?id=story-1',
    actionLabel: 'Review Screenplay Draft',
    aiDiagnosis: 'Synthesized 1,420 words across 6 dialogue nodes with 98% historical chronology match.',
    recommendedAction: 'Review dialogue pacing in Story Studio before approving voice narration.'
  },
  {
    id: 'notif-p3',
    category: 'ai',
    priority: 'medium',
    title: 'Neural Voice Cloning Complete',
    description: 'Custom voice model "Elizabeth Vance - 1960s Accent" completed training with 99.1% fidelity.',
    time: '07:15 AM',
    dateGroup: 'Today',
    unread: true,
    needsAction: false,
    relatedProfile: 'Elizabeth Vance',
    targetWorkspace: 'Narration Studio',
    targetPath: '/workspace/narration-studio',
    actionLabel: 'Test Neural Voice',
    aiDiagnosis: 'Model trained on 42 minutes of clear archival reel audio.',
    recommendedAction: 'Ready to generate studio narration across all chapters.'
  },
  {
    id: 'notif-p4',
    category: 'stories',
    priority: 'high',
    title: 'Timeline Chronology Conflict Detected',
    description: 'Historical date overlap detected between Scene 2 (1942) and Scene 4 (1939) in "Prairie Days".',
    time: 'Yesterday, 04:15 PM',
    dateGroup: 'Yesterday',
    unread: false,
    needsAction: true,
    relatedStory: 'The Silver Lining of 1972',
    targetWorkspace: 'Timeline Chronology',
    targetPath: '/workspace/timeline-chronology',
    actionLabel: 'Resolve Timeline Conflict',
    aiDiagnosis: 'Chronological inconsistency detected in family record dates.',
    recommendedAction: 'Align event markers in Timeline Chronology.'
  },
  {
    id: 'notif-p5',
    category: 'security',
    priority: 'critical',
    title: 'New Device Authentication Alert',
    description: 'A new session was authenticated from Safari on iOS 17.5 (IP: 192.168.1.108).',
    time: 'Yesterday, 11:02 AM',
    dateGroup: 'Yesterday',
    unread: true,
    needsAction: true,
    targetWorkspace: 'Security Settings',
    targetPath: '/workspace/settings',
    actionLabel: 'Inspect Active Sessions',
    aiDiagnosis: 'Unfamiliar device fingerprint logged.',
    recommendedAction: 'Verify session in Security Settings.'
  },
  {
    id: 'notif-p6',
    category: 'system',
    priority: 'high',
    title: 'Integration Disconnected: Google Drive Archive',
    description: 'OAuth token expired for mapped Google Drive legacy archive. Background auto-sync paused.',
    time: 'Yesterday, 09:12 AM',
    dateGroup: 'Yesterday',
    unread: true,
    needsAction: true,
    targetWorkspace: 'Integrations Hub',
    targetPath: '/workspace/integrations',
    actionLabel: 'Reconnect Cloud Service',
    aiDiagnosis: 'OAuth token refresh failed (code 401).',
    recommendedAction: 'Re-authenticate Google Drive connector in Integrations.'
  },
  {
    id: 'notif-p7',
    category: 'media',
    priority: 'medium',
    title: 'High-Res Restoration & Auto-Colorization Complete',
    description: '15 vintage photographs ("Grandpa Vance Farmhouse 1952") were enhanced to 4K resolution.',
    time: 'Earlier This Week, 02:45 PM',
    dateGroup: 'Earlier This Week',
    unread: false,
    needsAction: false,
    relatedProfile: 'Elizabeth Vance',
    targetWorkspace: 'Media Library',
    targetPath: '/workspace/media-library',
    actionLabel: 'View Restored Media',
    aiDiagnosis: '4K upscale and scratch-removal finished.',
    recommendedAction: 'Inspect colorized photos in Media Library.'
  },
  {
    id: 'notif-p8',
    category: 'profiles',
    priority: 'medium',
    title: 'Oral History Audio Interview Imported',
    description: '45-minute audio cassette tape "Arthur Pendelton WWII Memories" transcribed into text nodes.',
    time: 'Earlier This Week, 11:30 AM',
    dateGroup: 'Earlier This Week',
    unread: false,
    needsAction: false,
    relatedProfile: 'Arthur Pendelton',
    targetWorkspace: 'Legacy Profiles',
    targetPath: '/workspace/legacy-profiles',
    actionLabel: 'Open Profile Record',
    aiDiagnosis: 'Acoustic cleaning applied. Text accuracy 97.4%.',
    recommendedAction: 'Bind transcripts to story chapters.'
  },
  {
    id: 'notif-p9',
    category: 'system',
    priority: 'medium',
    title: 'Cloud Storage Capacity Warning (88%)',
    description: 'Your workspace has used 88 GB of 100 GB allocated cloud storage for media assets.',
    time: 'Last Week, 03:00 PM',
    dateGroup: 'Last Week',
    unread: false,
    needsAction: true,
    targetWorkspace: 'Settings & Storage',
    targetPath: '/workspace/settings',
    actionLabel: 'Manage Storage Tier',
    aiDiagnosis: '4K raw render files occupy 52GB.',
    recommendedAction: 'Archive old render stubs or upgrade storage tier.'
  },
  {
    id: 'notif-p10',
    category: 'stories',
    priority: 'low',
    title: 'Co-Author Review Comment Added',
    description: 'Philip Shaba commented on Scene 1: "Verify the year of the wedding photo overlay."',
    time: 'Last Week, 01:20 PM',
    dateGroup: 'Last Week',
    unread: false,
    needsAction: false,
    relatedStory: 'The Silver Lining of 1972',
    targetWorkspace: 'Story Studio',
    targetPath: '/workspace/story-studio?id=story-1',
    actionLabel: 'Reply to Comment',
    aiDiagnosis: 'Review comment flagged for historical verification.',
    recommendedAction: 'Check photo EXIF metadata.'
  },
  {
    id: 'notif-p11',
    category: 'account',
    priority: 'low',
    title: 'ReelLegacy Pro Subscription Renewed',
    description: 'Your Pro membership renewed successfully for the upcoming billing cycle.',
    time: 'Older, 12:00 AM',
    dateGroup: 'Older',
    unread: false,
    needsAction: false,
    targetWorkspace: 'Account Settings',
    targetPath: '/workspace/settings',
    actionLabel: 'View Billing Invoice',
    aiDiagnosis: 'Automated billing transaction succeeded.',
    recommendedAction: 'Download PDF receipt.'
  }
];

export function NotificationsView() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setSelection, setRightPanelOpen } = useInspector();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Workspace Navigation Tabs
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter Dropdowns
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'priority' | 'newest' | 'oldest'>('priority');
  
  // Density view
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(true);

  // Group Collapsed States
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Category Meta Config
  const categoryMeta: Record<string, { icon: React.ComponentType<any>; color: string; bg: string; border: string }> = {
    stories: { icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    ai: { icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    production: { icon: Film, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    profiles: { icon: User, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    media: { icon: SlidersHorizontal, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    system: { icon: Info, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
    security: { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/15', border: 'border-rose-500/40' },
    account: { icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  };

  // KPI Metrics Calculation
  const kpiMetrics = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.unread).length;
    const needsAction = notifications.filter((n) => n.needsAction).length;
    const critical = notifications.filter((n) => n.priority === 'critical' || n.priority === 'high').length;
    return { total, unread, needsAction, critical };
  }, [notifications]);

  // Tab Badge Counts
  const tabCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => n.unread).length,
      action: notifications.filter((n) => n.needsAction).length,
      ai: notifications.filter((n) => n.category === 'ai').length,
      rendering: notifications.filter((n) => n.category === 'production').length,
      stories: notifications.filter((n) => n.category === 'stories').length,
      media: notifications.filter((n) => n.category === 'media').length,
      security: notifications.filter((n) => n.category === 'security').length,
      account: notifications.filter((n) => n.category === 'account').length,
      archived: 0
    };
  }, [notifications]);

  // Filter & Sort Logic
  const filteredNotifications = useMemo(() => {
    let list = notifications.filter((notif) => {
      // Tab Navigation Filter
      if (activeTab === 'unread' && !notif.unread) return false;
      if (activeTab === 'action' && !notif.needsAction) return false;
      if (activeTab === 'ai' && notif.category !== 'ai') return false;
      if (activeTab === 'rendering' && notif.category !== 'production') return false;
      if (activeTab === 'stories' && notif.category !== 'stories') return false;
      if (activeTab === 'media' && notif.category !== 'media') return false;
      if (activeTab === 'security' && notif.category !== 'security') return false;
      if (activeTab === 'account' && notif.category !== 'account') return false;

      // Priority Dropdown Filter
      if (priorityFilter !== 'all' && notif.priority !== priorityFilter) return false;

      // Category Dropdown Filter
      if (categoryFilter !== 'all' && notif.category !== categoryFilter) return false;

      // Date Range Dropdown Filter
      if (dateFilter !== 'all' && notif.dateGroup !== dateFilter) return false;

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          notif.title.toLowerCase().includes(q) ||
          notif.description.toLowerCase().includes(q) ||
          (notif.relatedStory && notif.relatedStory.toLowerCase().includes(q)) ||
          (notif.relatedProfile && notif.relatedProfile.toLowerCase().includes(q)) ||
          notif.targetWorkspace.toLowerCase().includes(q)
        );
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortOrder === 'priority') {
        const pMap = { critical: 4, high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (sortOrder === 'newest') return 0;
      if (sortOrder === 'oldest') return 0;
      return 0;
    });

    return list;
  }, [notifications, activeTab, priorityFilter, categoryFilter, dateFilter, searchQuery, sortOrder]);

  // Chronological Grouping
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {
      'Today': [],
      'Yesterday': [],
      'Earlier This Week': [],
      'Last Week': [],
      'Older': []
    };

    filteredNotifications.forEach((notif) => {
      if (groups[notif.dateGroup]) {
        groups[notif.dateGroup].push(notif);
      } else {
        groups['Older'].push(notif);
      }
    });

    return groups;
  }, [filteredNotifications]);

  // Actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCardClick = (notif: NotificationItem) => {
    setSelection('notifications', notif);
    setRightPanelOpen(true);
  };

  const handleNavigateToWorkspace = (notif: NotificationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (notif.unread) {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)));
    }
    showToast('success', `Opening ${notif.targetWorkspace}`, `Launching ${notif.actionLabel || 'connected module'}...`);
    navigate(notif.targetPath);
  };

  const handleMarkAsRead = (id: string, state: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: state } : n)));
    showToast('info', `Notification marked as ${state ? 'unread' : 'read'}`);
  };

  const handleArchive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    showToast('success', 'Notification archived to operations cold log');
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    showToast('info', 'Notification deleted');
  };

  // Bulk Actions
  const handleBulkMarkRead = () => {
    setNotifications((prev) => prev.map((n) => (selectedIds.includes(n.id) ? { ...n, unread: false } : n)));
    setSelectedIds([]);
    showToast('success', `${selectedIds.length} notifications marked as read`);
  };

  const handleBulkArchive = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    showToast('success', `${selectedIds.length} notifications archived`);
  };

  const handleBulkDelete = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    showToast('info', `${selectedIds.length} notifications removed`);
  };

  const handleBulkRetryFailed = () => {
    showToast('success', 'Retrying Failed Operations', 'Re-submitting failed renders and reconnecting cloud connectors...');
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.priority === 'critical' || n.category === 'production'
            ? { ...n, priority: 'low', unread: false, needsAction: false, title: n.title.replace('Failed', 'Retried & Synced') }
            : n
        )
      );
      setSelectedIds([]);
      showToast('success', 'Operations Recovered', 'Render job resubmitted to Cloud Render Queue.');
    }, 1200);
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  return (
    <div id="notifications-operations-center" className="space-y-6 animate-fade-in text-foreground pb-16 pt-2 md:pt-4">
      {/* SECTION 1: OPERATIONS DASHBOARD HEADER (KPI SUMMARY) */}
      <div id="operations-summary-dashboard" className="bg-card/60 border border-cinema-amber-500/30 rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cinema-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cinema-amber-500 bg-cinema-amber-500/15 px-2.5 py-0.5 rounded-full border border-cinema-amber-500/30 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 animate-pulse" /> Operations Center
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Ecosystem Inbox
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Notifications & Operations Center
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              Central operational triage for ReelLegacy render queues, AI script synthesizers, co-author reviews, and security alerts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center" id="header-global-actions">
            <Button
              id="btn-mark-all-read-top"
              variant="secondary"
              size="sm"
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                showToast('success', 'All notifications marked as read');
              }}
              className="cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Mark All Read</span>
            </Button>

            <Button
              id="btn-refresh-operations-feed"
              variant="outline"
              size="sm"
              onClick={() => {
                showToast('info', 'Synchronizing Operations Feed...', 'Fetching latest cloud render queue and synthesis logs.');
                setTimeout(() => {
                  showToast('success', 'Operations Feed Synchronized');
                }, 600);
              }}
              className="cursor-pointer border-border hover:border-cinema-amber-500"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-cinema-amber-500" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* KPI Compact Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="kpi-summary-cards">
          <div
            id="kpi-card-total"
            onClick={() => setActiveTab('all')}
            className="p-3 bg-card border border-border hover:border-cinema-amber-500/50 rounded-2xl transition-all cursor-pointer space-y-1"
          >
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              Total Inbox
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-bold font-display text-foreground">{kpiMetrics.total}</span>
              <span className="text-[10px] font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-1.5 py-0.5 rounded">All Events</span>
            </div>
          </div>

          <div
            id="kpi-card-unread"
            onClick={() => setActiveTab('unread')}
            className="p-3 bg-card border border-border hover:border-amber-500/50 rounded-2xl transition-all cursor-pointer space-y-1"
          >
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
              Unread
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-bold font-display text-amber-400">{kpiMetrics.unread}</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Requires Read</span>
            </div>
          </div>

          <div
            id="kpi-card-action"
            onClick={() => setActiveTab('action')}
            className="p-3 bg-card border border-border hover:border-indigo-500/50 rounded-2xl transition-all cursor-pointer space-y-1"
          >
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
              Require Action
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-bold font-display text-indigo-400">{kpiMetrics.needsAction}</span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">1-Click Fixes</span>
            </div>
          </div>

          <div
            id="kpi-card-critical"
            onClick={() => {
              setActiveTab('all');
              setPriorityFilter('critical');
            }}
            className="p-3 bg-card border border-rose-500/30 hover:border-rose-500 rounded-2xl transition-all cursor-pointer space-y-1 bg-rose-500/[0.02]"
          >
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
              Critical Alerts
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-bold font-display text-rose-400">{kpiMetrics.critical}</span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded">Urgent</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: EMBEDDED AI OPERATIONS ASSISTANT BANNER */}
      {showAIAssistant && (
        <div id="ai-operations-assistant-banner" className="bg-gradient-to-r from-cinema-ai/15 via-card to-cinema-amber-500/10 border border-cinema-ai/30 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cinema-ai/20 border border-cinema-ai/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cinema-ai animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-foreground font-display">AI Operations Assistant</span>
                <span className="text-[9px] font-mono text-cinema-ai bg-cinema-ai/20 px-2 py-0.5 rounded-full font-bold">Live Monitoring</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Detected <strong className="text-rose-400">1 failed 4K render</strong>, <strong className="text-amber-400">1 disconnected cloud archive</strong>, and <strong className="text-indigo-400">1 timeline chronology overlap</strong> requiring resolution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center" id="ai-assistant-quick-fixes">
            <Button
              id="btn-ai-batch-recover"
              variant="accent"
              size="xs"
              onClick={handleBulkRetryFailed}
              className="cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 mr-1" /> Auto-Fix Issues
            </Button>

            <Button
              id="btn-dismiss-ai-assistant"
              variant="ghost"
              size="xs"
              onClick={() => setShowAIAssistant(false)}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* SECTION 3: WORKSPACE NAVIGATION (HORIZONTAL NAVIGATOR - NO INTERNAL SIDEBAR) */}
      <div id="workspace-navigation-tabs-bar" className="border-b border-border/80 pb-1 pt-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'all', label: 'All Operations', count: tabCounts.all, icon: Layers },
            { id: 'unread', label: 'Unread', count: tabCounts.unread, icon: Bell, badgeColor: 'bg-amber-500/20 text-amber-400' },
            { id: 'action', label: 'Require Action', count: tabCounts.action, icon: Zap, badgeColor: 'bg-indigo-500/20 text-indigo-400' },
            { id: 'ai', label: 'AI Activities', count: tabCounts.ai, icon: Sparkles },
            { id: 'rendering', label: 'Rendering', count: tabCounts.rendering, icon: Film },
            { id: 'stories', label: 'Stories', count: tabCounts.stories, icon: BookOpen },
            { id: 'media', label: 'Media', count: tabCounts.media, icon: SlidersHorizontal },
            { id: 'security', label: 'Security', count: tabCounts.security, icon: ShieldAlert },
            { id: 'account', label: 'Account', count: tabCounts.account, icon: Clock },
            { id: 'archived', label: 'Archived', count: tabCounts.archived, icon: Archive }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;

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
                {tab.count > 0 && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                    tab.badgeColor || (isSelected ? 'bg-cinema-amber-500/20 text-cinema-amber-500' : 'bg-muted text-muted-foreground')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: TOOLBAR */}
      <div id="operations-toolbar-strip" className="bg-card border border-border p-3.5 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-xs">
        {/* Left Search + Select All */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Select All Checkbox */}
          <button
            id="btn-toggle-select-all-toolbar"
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1.5 rounded-lg border border-border/60 hover:bg-muted/40"
          >
            {selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Select All ({filteredNotifications.length})</span>
          </button>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md" id="toolbar-search-box">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="input-operations-search"
              type="text"
              placeholder="Search notifications, stories, rendering jobs or security alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-muted/40 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-cinema-amber-500"
            />
            {searchQuery && (
              <button
                id="btn-clear-search-query"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Dropdown Filters + Bulk Bar */}
        <div className="flex flex-wrap items-center gap-2" id="toolbar-dropdown-filters">
          {selectedIds.length > 0 ? (
            /* BULK ACTIONS STRIP */
            <div className="flex items-center gap-1.5 bg-cinema-amber-500/10 border border-cinema-amber-500/30 p-1 rounded-xl" id="bulk-actions-toolbar">
              <span className="text-xs font-bold text-cinema-amber-500 px-2 font-mono">
                {selectedIds.length} Selected
              </span>
              <Button id="bulk-act-read" variant="ghost" size="xs" onClick={handleBulkMarkRead} className="text-xs">
                <Check className="w-3.5 h-3.5 mr-1" /> Mark Read
              </Button>
              <Button id="bulk-act-archive" variant="ghost" size="xs" onClick={handleBulkArchive} className="text-xs text-sky-400">
                <Archive className="w-3.5 h-3.5 mr-1" /> Archive
              </Button>
              <Button id="bulk-act-retry" variant="ghost" size="xs" onClick={handleBulkRetryFailed} className="text-xs text-emerald-400">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry
              </Button>
              <Button id="bulk-act-delete" variant="ghost" size="xs" onClick={handleBulkDelete} className="text-xs text-rose-400">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          ) : (
            /* STANDARD FILTER DROPDOWNS */
            <>
              {/* Priority Select */}
              <div className="w-36">
                <Select
                  id="select-toolbar-priority"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  options={[
                    { value: 'all', label: 'All Priorities' },
                    { value: 'critical', label: '🔴 Critical' },
                    { value: 'high', label: '🟠 High' },
                    { value: 'medium', label: '🟡 Medium' },
                    { value: 'low', label: '🟢 Low' }
                  ]}
                />
              </div>

              {/* Category Select */}
              <div className="w-36">
                <Select
                  id="select-toolbar-category"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { value: 'all', label: 'All Modules' },
                    { value: 'production', label: 'Film Rendering' },
                    { value: 'ai', label: 'AI Director' },
                    { value: 'stories', label: 'Stories Studio' },
                    { value: 'media', label: 'Media Library' },
                    { value: 'security', label: 'Security' },
                    { value: 'system', label: 'System' },
                    { value: 'account', label: 'Account' }
                  ]}
                />
              </div>

              {/* Date Select */}
              <div className="w-36">
                <Select
                  id="select-toolbar-date"
                  value={dateFilter}
                  onChange={setDateFilter}
                  options={[
                    { value: 'all', label: 'All Time' },
                    { value: 'Today', label: 'Today' },
                    { value: 'Yesterday', label: 'Yesterday' },
                    { value: 'Earlier This Week', label: 'This Week' },
                    { value: 'Last Week', label: 'Last Week' },
                    { value: 'Older', label: 'Older' }
                  ]}
                />
              </div>

              {/* Sort Order */}
              <div className="w-36">
                <Select
                  id="select-toolbar-sort"
                  value={sortOrder}
                  onChange={(v: any) => setSortOrder(v)}
                  options={[
                    { value: 'priority', label: 'Sort: Priority First' },
                    { value: 'newest', label: 'Sort: Newest First' },
                    { value: 'oldest', label: 'Sort: Oldest First' }
                  ]}
                />
              </div>

              {/* Reset Filters */}
              {(priorityFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || searchQuery !== '') && (
                <Button
                  id="btn-clear-all-toolbar-filters"
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setDateFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-cinema-amber-500 hover:underline font-semibold text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* SECTION 5: NOTIFICATION FEED LIST (GROUPED CHRONOLOGICALLY) */}
      <div id="operations-notifications-feed" className="space-y-6">
        {filteredNotifications.length === 0 ? (
          <EmptyState
            type="notifications"
            title="No matching operational updates"
            description="Adjust your search query or dropdown filters to inspect other chronological event logs."
            primaryActionLabel="Reset Filters"
            onPrimaryAction={() => {
              setActiveTab('all');
              setPriorityFilter('all');
              setCategoryFilter('all');
              setDateFilter('all');
              setSearchQuery('');
            }}
          />
        ) : (
          (Object.keys(groupedNotifications) as Array<'Today' | 'Yesterday' | 'Earlier This Week' | 'Last Week' | 'Older'>).map((groupName) => {
            const list = groupedNotifications[groupName];
            if (!list || list.length === 0) return null;
            const isCollapsed = collapsedGroups[groupName];

            return (
              <div key={groupName} id={`group-section-${groupName.replace(/\s+/g, '-').toLowerCase()}`} className="space-y-3">
                {/* Collapsible Group Header */}
                <button
                  id={`btn-toggle-group-${groupName.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => toggleGroupCollapse(groupName)}
                  className="flex items-center justify-between w-full text-left py-1 px-2 group cursor-pointer border-b border-border/40 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-4 h-4 text-cinema-amber-500 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                      {groupName}
                    </span>
                    <span className="text-[10px] font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                      {list.length} {list.length === 1 ? 'event' : 'events'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground">
                    {isCollapsed ? 'Click to expand' : 'Click to collapse'}
                  </span>
                </button>

                {/* Group Feed Cards */}
                {!isCollapsed && (
                  <div className="space-y-2.5" id={`group-list-cards-${groupName}`}>
                    {list.map((notif) => {
                      const meta = categoryMeta[notif.category] || categoryMeta.system;
                      const CategoryIcon = meta.icon;
                      const isSelected = selectedIds.includes(notif.id);

                      return (
                        <div
                          key={notif.id}
                          id={`card-notif-item-${notif.id}`}
                          onClick={() => handleCardClick(notif)}
                          className={`p-3.5 md:p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 bg-card/70 hover:bg-card cursor-pointer relative group ${
                            notif.unread
                              ? 'border-cinema-amber-500/30 shadow-xs shadow-cinema-amber-500/5'
                              : 'border-border/60 hover:border-border'
                          } ${
                            notif.priority === 'critical'
                              ? 'border-rose-500/50 bg-rose-500/[0.02] shadow-xs shadow-rose-500/10'
                              : ''
                          } ${
                            isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03]' : ''
                          }`}
                        >
                          {/* Checkbox Selector */}
                          <button
                            id={`check-notif-${notif.id}`}
                            onClick={(e) => toggleSelectOne(notif.id, e)}
                            className="mt-1 cursor-pointer shrink-0 text-muted-foreground/50 hover:text-foreground"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>

                          {/* Category Channel Icon */}
                          <div
                            id={`icon-notif-${notif.id}`}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.bg} ${meta.border} shadow-inner`}
                          >
                            <CategoryIcon className={`w-5 h-5 ${meta.color}`} />
                          </div>

                          {/* Center Content Body */}
                          <div className="flex-1 min-w-0 space-y-1.5" id={`body-notif-${notif.id}`}>
                            {/* Title Bar + Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`text-xs md:text-sm leading-snug text-foreground ${notif.unread ? 'font-bold' : 'font-semibold'}`}>
                                  {notif.title}
                                </h3>

                                {/* Priority Badge */}
                                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                                  notif.priority === 'critical'
                                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                                    : notif.priority === 'high'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    : notif.priority === 'medium'
                                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                }`}>
                                  {notif.priority}
                                </span>

                                {/* Target Module Badge */}
                                <span className="text-[10px] font-mono font-semibold text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                                  {notif.targetWorkspace}
                                </span>
                              </div>

                              <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-auto">
                                {notif.time}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {notif.description}
                            </p>

                            {/* Connected Model Badges */}
                            {(notif.relatedStory || notif.relatedProfile) && (
                              <div className="flex flex-wrap items-center gap-2 pt-1" id={`related-models-${notif.id}`}>
                                {notif.relatedStory && (
                                  <span className="inline-flex items-center text-[10px] font-semibold text-cinema-amber-400 bg-cinema-amber-500/10 px-2 py-0.5 rounded-md border border-cinema-amber-500/20">
                                    <BookOpen className="w-3 h-3 mr-1" /> {notif.relatedStory}
                                  </span>
                                )}
                                {notif.relatedProfile && (
                                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                    <User className="w-3 h-3 mr-1" /> {notif.relatedProfile}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Interactive Quick Actions Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 text-[11px] font-bold text-muted-foreground" id={`actions-bar-${notif.id}`}>
                              {/* Left Deep-Link Action Button */}
                              <Button
                                id={`btn-deep-link-${notif.id}`}
                                variant="outline"
                                size="xs"
                                onClick={(e) => handleNavigateToWorkspace(notif, e)}
                                className="cursor-pointer text-xs border-cinema-amber-500/40 text-cinema-amber-500 hover:bg-cinema-amber-500/10 font-bold"
                              >
                                <span>{notif.actionLabel || `Open ${notif.targetWorkspace}`}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                              </Button>

                              {/* Right Secondary Actions */}
                              <div className="flex items-center gap-3">
                                <button
                                  id={`btn-mark-read-${notif.id}`}
                                  onClick={(e) => handleMarkAsRead(notif.id, !notif.unread, e)}
                                  className="hover:text-foreground cursor-pointer flex items-center gap-1"
                                >
                                  {notif.unread ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                                  <span>{notif.unread ? 'Mark Read' : 'Unread'}</span>
                                </button>
                                <span>•</span>
                                <button
                                  id={`btn-archive-${notif.id}`}
                                  onClick={(e) => handleArchive(notif.id, e)}
                                  className="hover:text-sky-400 cursor-pointer flex items-center gap-1"
                                >
                                  <Archive className="w-3 h-3" /> Archive
                                </button>
                                <span>•</span>
                                <button
                                  id={`btn-delete-${notif.id}`}
                                  onClick={(e) => handleDelete(notif.id, e)}
                                  className="hover:text-rose-400 cursor-pointer flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Unread Indicator Dot */}
                          {notif.unread && (
                            <span className="absolute top-4 right-4 w-2 h-2 bg-cinema-amber-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SECTION 6: FOOTER SUMMARY & PAGINATION */}
      <div id="operations-footer-bar" className="border-t border-border/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
        <span>Showing {filteredNotifications.length} of {notifications.length} operational event logs</span>

        <div className="flex items-center gap-2">
          <Button
            id="btn-operations-prev"
            variant="ghost"
            size="xs"
            disabled
          >
            Previous
          </Button>
          <Button
            id="btn-operations-next"
            variant="ghost"
            size="xs"
            onClick={() => {
              showToast('info', 'Loading Cold Archives...', 'Retrieving historical event nodes from operations database.');
            }}
          >
            Load Older Event Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
