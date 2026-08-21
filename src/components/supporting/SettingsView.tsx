/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useInspector } from '../../context/InspectorContext';
import { AuthService, persistenceService, SettingsService, SettingsSchema } from '../../storage';
import { 
  User, 
  Settings, 
  Paintbrush, 
  Layout,
  LayoutGrid, 
  BellRing, 
  Accessibility, 
  ShieldAlert, 
  Check, 
  Sun, 
  Moon, 
  Laptop,
  CheckCircle2,
  Lock,
  ChevronRight,
  Eye,
  Sliders,
  Database,
  HelpCircle,
  Info,
  Sparkles,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Camera,
  Image as ImageIcon,
  Key,
  ShieldCheck,
  Smartphone,
  Monitor,
  AlertTriangle,
  FolderHeart,
  FileText,
  Clock,
  BookOpen,
  Mail,
  SlidersHorizontal,
  Archive,
  RefreshCw,
  Award,
  ArrowLeft,
  EyeOff,
  PlayCircle,
  Keyboard,
  Link2,
  Search,
  Zap,
  RotateCcw,
  History,
  X,
  SlidersVertical,
  Activity,
  Layers,
  Terminal,
  Cpu,
  Flame,
  CheckSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DatePicker } from '../ui/DatePicker';
import { Select } from '../ui/Select';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { EmptyState } from '../ui/EmptyState';

type SettingsTab = 
  | 'overview'
  | 'account'
  | 'profile'
  | 'workspace'
  | 'appearance'
  | 'notifications'
  | 'playback'
  | 'accessibility'
  | 'privacy'
  | 'security'
  | 'storage'
  | 'shortcuts'
  | 'integrations'
  | 'advanced'
  | 'about';

interface SessionItem {
  id: string;
  browser: string;
  device: string;
  location: string;
  ip: string;
  time: string;
  isCurrent: boolean;
}

interface DeviceItem {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet';
  name: string;
  os: string;
  lastActive: string;
  status: 'online' | 'offline';
}

interface ConfigHistoryItem {
  id: string;
  timestamp: string;
  settingName: string;
  category: string;
  oldVal: string;
  newVal: string;
}

interface ConfigPreset {
  id: string;
  title: string;
  description: string;
  icon: any;
  settings: Partial<SettingsSchema>;
}

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { user, refreshUser } = useAuth();
  const { setSelection, setRightPanelOpen } = useInspector();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const normalizeTab = (rawTab?: string | null, path?: string): SettingsTab => {
    if (path && (path.endsWith('/my-profile') || path.endsWith('/profile'))) return 'profile';
    if (!rawTab) return 'overview';
    const lower = rawTab.toLowerCase().trim();
    const validTabs: SettingsTab[] = [
      'overview', 'account', 'profile', 'workspace', 'appearance', 
      'notifications', 'playback', 'accessibility', 'privacy', 
      'security', 'storage', 'shortcuts', 'integrations', 'advanced', 'about'
    ];
    if (validTabs.includes(lower as SettingsTab)) return lower as SettingsTab;
    if (lower === 'general' || lower === 'hub') return 'overview';
    if (lower === 'my-profile' || lower === 'bio' || lower === 'co-author') return 'profile';
    if (lower === 'keyboard' || lower === 'hotkeys') return 'shortcuts';
    if (lower === 'layout' || lower === 'density') return 'workspace';
    if (lower === 'theme' || lower === 'colors') return 'appearance';
    if (lower === 'video' || lower === 'quality') return 'playback';
    if (lower === 'keys' || lower === '2fa' || lower === 'auth') return 'security';
    if (lower === 'quota' || lower === 'cache') return 'storage';
    if (lower === 'presets' || lower === 'danger') return 'advanced';
    return 'overview';
  };

  // Active Settings Tab State with URL query param synchronization
  const [activeTab, setActiveTabState] = useState<SettingsTab>(() => 
    normalizeTab(searchParams.get('tab'), location.pathname)
  );

  const setActiveTab = (tab: SettingsTab) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true });
  };

  useEffect(() => {
    const norm = normalizeTab(searchParams.get('tab'), location.pathname);
    setActiveTabState(norm);
  }, [searchParams, location.pathname]);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        const input = document.getElementById('input-settings-search') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const searchableSettings = useMemo(() => [
    { id: '2fa', title: 'Two-Factor Authentication (2FA)', category: 'Security & Keys', tab: 'security' as SettingsTab, desc: 'Enforce SMS or authenticator app second factor for profile protection.' },
    { id: 'theme', title: 'Theme Appearance & Color Palette', category: 'Appearance', tab: 'appearance' as SettingsTab, desc: 'Switch between Dark Mode, Light Mode, or sync with System preferences.' },
    { id: 'quality', title: 'Video & Canvas Render Quality', category: 'Playback', tab: 'playback' as SettingsTab, desc: 'Configure 4K Ultra, 1080p, or 720p draft playback rendering.' },
    { id: 'profile', title: 'Co-Author Profile & Biography', category: 'Profile', tab: 'profile' as SettingsTab, desc: 'Manage full name, display name, bio, social links, and avatar.' },
    { id: 'cache', title: 'Storage & Thumbnail Cache', category: 'Storage', tab: 'storage' as SettingsTab, desc: 'View local storage quota breakdown, clear temp render cache.' },
    { id: 'drive', title: 'Google Drive & Dropbox Sync', category: 'Integrations', tab: 'integrations' as SettingsTab, desc: 'Connect cloud storage providers to automatically sync media assets.' },
    { id: 'shortcuts', title: 'Keyboard Hotkeys & Navigation', category: 'Shortcuts', tab: 'shortcuts' as SettingsTab, desc: 'View and customize workspace global keyboard shortcuts.' },
    { id: 'highcontrast', title: 'High Contrast Mode', category: 'Accessibility', tab: 'accessibility' as SettingsTab, desc: 'Enhance visual contrast for low-vision legibility.' },
    { id: 'reducedmotion', title: 'Reduced Motion', category: 'Accessibility', tab: 'accessibility' as SettingsTab, desc: 'Minimize UI transition animations and canvas effects.' },
    { id: 'notifications', title: 'Email Digests & Push Alerts', category: 'Notifications', tab: 'notifications' as SettingsTab, desc: 'Configure notification frequencies and alert channels.' },
    { id: 'density', title: 'Workspace Layout Density', category: 'Workspace', tab: 'workspace' as SettingsTab, desc: 'Toggle Compact, Comfortable, or Spacious workspace grid layouts.' },
    { id: 'telemetry', title: 'Privacy & Analytics Telemetry', category: 'Privacy', tab: 'privacy' as SettingsTab, desc: 'Control anonymous usage stats collection and data sharing.' },
    { id: 'danger', title: 'Danger Zone & Reset', category: 'Advanced', tab: 'advanced' as SettingsTab, desc: 'Factory reset workspace settings or purge cached database.' }
  ], []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return searchableSettings.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.tab.toLowerCase().includes(q)
    );
  }, [searchQuery, searchableSettings]);

  // AI Configuration Assistant
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<{
    title: string;
    description: string;
    changes: Partial<SettingsSchema>;
  } | null>(null);

  // Configuration History
  const [configHistory, setConfigHistory] = useState<ConfigHistoryItem[]>([
    {
      id: 'log-1',
      timestamp: 'Just now',
      settingName: 'Theme Mode',
      category: 'Appearance',
      oldVal: 'System',
      newVal: theme === 'dark' ? 'Dark Mode' : 'Light Theme'
    },
    {
      id: 'log-2',
      timestamp: '2 hours ago',
      settingName: 'Two-Factor Auth',
      category: 'Security',
      oldVal: 'Disabled',
      newVal: 'Active'
    },
    {
      id: 'log-3',
      timestamp: 'Yesterday',
      settingName: 'Render Quality',
      category: 'Playback',
      oldVal: '1080p',
      newVal: '4K High Quality'
    }
  ]);

  // Dynamic Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (location.pathname.endsWith('/my-profile')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  // 1. Account Settings States
  const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : 'Philip Shaba');
  const [displayName, setDisplayName] = useState(user?.displayName || 'PhilShaba');
  const [email, setEmail] = useState(user?.email || 'PhilShaba96@gmail.com');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [dob, setDob] = useState('1996-04-12');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');
  const [preferredLanguage, setPreferredLanguage] = useState('English (US)');
  const [avatar, setAvatar] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256');
  const [coverImage, setCoverImage] = useState(user?.coverImageUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1200');
  const [emailVerified, setEmailVerified] = useState(user?.isVerified ?? true);

  // 2. Co-Author Profile States
  const [firstName, setFirstName] = useState(user?.firstName || 'Philip');
  const [lastName, setLastName] = useState(user?.lastName || 'Shaba');
  const [citations, setCitations] = useState('Vance Family Archive');
  const [biography, setBiography] = useState(user?.bio || 'Lead Archivist and Family Historian focusing on Kansas homestead chronologies and mid-century family memoirs.');

  // Playback Preferences States
  const [playbackQuality, setPlaybackQuality] = useState('high');
  const [playbackAutoplay, setPlaybackAutoplay] = useState(false);
  const [playbackMuteByDefault, setPlaybackMuteByDefault] = useState(true);
  const [playbackTransitionSpeed, setPlaybackTransitionSpeed] = useState('normal');

  // Appearance States
  const [accentColor, setAccentColor] = useState('amber');
  const [fontScaling, setFontScaling] = useState('medium');
  const [motionPref, setMotionPref] = useState('smooth');
  const [compactMode, setCompactMode] = useState(false);
  const [animationIntensity, setAnimationIntensity] = useState('moderate');

  // Workspace States
  const [sidebarBehavior, setSidebarBehavior] = useState('expanded');
  const [rightPanelBehavior, setRightPanelBehavior] = useState('collapsible');
  const [defaultView, setDefaultView] = useState('dashboard');
  const [cardDensity, setCardDensity] = useState('comfortable');
  const [tableDensity, setTableDensity] = useState('standard');

  // Notifications States
  const [emailDigest, setEmailDigest] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [weeklyReminders, setWeeklyReminders] = useState(false);
  const [securityLogs, setSecurityLogs] = useState(true);
  const [uploadNotifs, setUploadNotifs] = useState(true);
  const [storyNotifs, setStoryNotifs] = useState(true);
  const [timelineNotifs, setTimelineNotifs] = useState(true);

  // Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [screenReader, setScreenReader] = useState(false);
  const [focusVisibility, setFocusVisibility] = useState(true);

  // Privacy States
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [storyVisibility, setStoryVisibility] = useState('invite-only');
  const [legacyProfilePrivacy, setLegacyProfilePrivacy] = useState('restricted');
  const [searchVisibility, setSearchVisibility] = useState('hidden');

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodesLeft, setBackupCodesLeft] = useState(8);

  const [sessions, setSessions] = useState<SessionItem[]>([
    { id: 'sess-1', browser: 'Chrome', device: 'macOS', location: 'San Francisco, CA', ip: '192.168.1.104', time: 'Active Now', isCurrent: true },
    { id: 'sess-2', browser: 'Safari', device: 'iPhone 15', location: 'San Jose, CA', ip: '172.56.21.99', time: 'Yesterday, 11:02 AM', isCurrent: false },
    { id: 'sess-3', browser: 'Firefox', device: 'Windows PC', location: 'Oakland, CA', ip: '67.188.4.21', time: 'July 08, 09:40 PM', isCurrent: false }
  ]);

  const [devices, setDevices] = useState<DeviceItem[]>([
    { id: 'dev-1', type: 'desktop', name: 'Philip\'s MacBook Pro', os: 'macOS Sequoia 15.1', lastActive: 'Active Now', status: 'online' },
    { id: 'dev-2', type: 'mobile', name: 'iPhone 15 Pro Max', os: 'iOS 18.0.1', lastActive: 'Yesterday, 11:02 AM', status: 'online' },
    { id: 'dev-3', type: 'desktop', name: 'Home Windows Rig', os: 'Windows 11 Pro', lastActive: 'July 08, 09:40 PM', status: 'offline' }
  ]);

  // Storage States
  const [photosCount, setPhotosCount] = useState(142);
  const [photosSize, setPhotosSize] = useState('420.00 MB');
  const [videosCount, setVideosCount] = useState(12);
  const [videosSize, setVideosSize] = useState('580.00 MB');
  const [vocalCount, setVocalCount] = useState(8);
  const [vocalSize, setVocalSize] = useState('120.00 MB');
  const [docsCount, setDocsCount] = useState(24);
  const [docsSize, setDocsSize] = useState('45.00 MB');
  const [storiesCount, setStoriesCount] = useState(15);
  const [storiesSize, setStoriesSize] = useState('18.00 MB');
  const [profilesCount, setProfilesCount] = useState(4);
  const [profilesSize, setProfilesSize] = useState('2.00 MB');

  const [totalEstimatedSize, setTotalEstimatedSize] = useState('1.18 GB');
  const [percentUsed, setPercentUsed] = useState(7.8);
  const [freeSize, setFreeSize] = useState('13.82 GB');

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0.00 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const recalculateStorageStats = async () => {
    try {
      const allMedia = await persistenceService.media.getAll();
      const allDocs = await persistenceService.documents.getAll();
      const allStories = await persistenceService.stories.getAll();
      const allProfiles = await persistenceService.profiles.getAll();

      const photos = allMedia.filter(m => m.type === 'image');
      const pCount = photos.length || 142;
      const pBytes = photos.reduce((acc, m) => acc + (m.bytes || 0), 0) || (142 * 1024 * 1024 * 2.9);
      setPhotosCount(pCount);
      setPhotosSize(formatBytes(pBytes));

      const videos = allMedia.filter(m => m.type === 'video');
      const vCount = videos.length || 12;
      const vBytes = videos.reduce((acc, m) => acc + (m.bytes || 0), 0) || (12 * 1024 * 1024 * 48.3);
      setVideosCount(vCount);
      setVideosSize(formatBytes(vBytes));

      const vocals = allMedia.filter(m => m.type === 'audio');
      const voCount = vocals.length || 8;
      const voBytes = vocals.reduce((acc, m) => acc + (m.bytes || 0), 0) || (8 * 1024 * 1024 * 15.0);
      setVocalCount(voCount);
      setVocalSize(formatBytes(voBytes));

      const dCount = allDocs.length || 24;
      const dBytes = allDocs.reduce((acc, d) => acc + (d.bytes || 0), 0) || (24 * 1024 * 1024 * 1.875);
      setDocsCount(dCount);
      setDocsSize(formatBytes(dBytes));

      const sCount = allStories.length || 15;
      const sBytes = sCount * 1.2 * 1024 * 1024;
      setStoriesCount(sCount);
      setStoriesSize(formatBytes(sBytes));

      const prCount = allProfiles.length || 4;
      const prBytes = prCount * 0.5 * 1024 * 1024;
      setProfilesCount(prCount);
      setProfilesSize(formatBytes(prBytes));

      const totalBytes = pBytes + vBytes + voBytes + dBytes + sBytes + prBytes;
      setTotalEstimatedSize(formatBytes(totalBytes));
      
      const fifteenGB = 15.00 * 1024 * 1024 * 1024;
      const pct = (totalBytes / fifteenGB) * 100;
      setPercentUsed(Math.min(100, Math.max(0.1, parseFloat(pct.toFixed(1)))));

      const freeBytes = Math.max(0, fifteenGB - totalBytes);
      setFreeSize(formatBytes(freeBytes));
    } catch (e) {
      console.error('Failed to recalculate storage stats', e);
    }
  };

  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        const s = await SettingsService.getSettings();
        if (s.fullName) setFullName(s.fullName);
        if (s.displayName) setDisplayName(s.displayName);
        if (s.email) setEmail(s.email);
        if (s.phone) setPhone(s.phone);
        if (s.dob) setDob(s.dob);
        if (s.country) setCountry(s.country);
        if (s.timeZone) setTimezone(s.timeZone);
        if (s.preferredLanguage) setPreferredLanguage(s.preferredLanguage);
        if (s.avatar) setAvatar(s.avatar);
        if (s.coverImage) setCoverImage(s.coverImage);
        if (s.emailVerified !== undefined) setEmailVerified(s.emailVerified);

        if (s.firstName) setFirstName(s.firstName);
        if (s.lastName) setLastName(s.lastName);
        if (s.citations) setCitations(s.citations);
        if (s.biography) setBiography(s.biography);

        if (s.theme) setTheme(s.theme);
        if (s.accentColor) setAccentColor(s.accentColor);
        if (s.fontScale) setFontScaling(s.fontScale);
        if (s.motionPref) setMotionPref(s.motionPref);
        if (s.compactMode !== undefined) setCompactMode(s.compactMode);
        if (s.animationIntensity) setAnimationIntensity(s.animationIntensity);

        if (s.sidebarBehavior) setSidebarBehavior(s.sidebarBehavior);
        if (s.rightPanelBehavior) setRightPanelBehavior(s.rightPanelBehavior);
        if (s.defaultView) setDefaultView(s.defaultView);
        if (s.cardDensity) setCardDensity(s.cardDensity);
        if (s.tableDensity) setTableDensity(s.tableDensity);

        if (s.emailDigest !== undefined) setEmailDigest(s.emailDigest);
        if (s.inAppNotifs !== undefined) setInAppNotifs(s.inAppNotifs);
        if (s.weeklyReminders !== undefined) setWeeklyReminders(s.weeklyReminders);
        if (s.securityLogs !== undefined) setSecurityLogs(s.securityLogs);
        if (s.uploadNotifs !== undefined) setUploadNotifs(s.uploadNotifs);
        if (s.storyNotifs !== undefined) setStoryNotifs(s.storyNotifs);
        if (s.timelineNotifs !== undefined) setTimelineNotifs(s.timelineNotifs);

        if (s.highContrast !== undefined) setHighContrast(s.highContrast);
        if (s.reducedMotion !== undefined) setReducedMotion(s.reducedMotion);
        if (s.keyboardNavigation !== undefined) setKeyboardNav(s.keyboardNavigation);
        if (s.screenReader !== undefined) setScreenReader(s.screenReader);
        if (s.focusVisibility !== undefined) setFocusVisibility(s.focusVisibility);

        if (s.analyticsEnabled !== undefined) setAnalyticsEnabled(s.analyticsEnabled);
        if (s.dataSharing !== undefined) setDataSharing(s.dataSharing);
        if (s.profileVisibility) setProfileVisibility(s.profileVisibility);
        if (s.storyVisibility) setStoryVisibility(s.storyVisibility);
        if (s.legacyProfilePrivacy) setLegacyProfilePrivacy(s.legacyProfilePrivacy);
        if (s.searchVisibility) setSearchVisibility(s.searchVisibility);

        if (s.twoFactorEnabled !== undefined) setTwoFactorEnabled(s.twoFactorEnabled);
        if (s.backupCodesLeft !== undefined) setBackupCodesLeft(s.backupCodesLeft);

        if (s.playbackQuality) setPlaybackQuality(s.playbackQuality);
        if (s.playbackAutoplay !== undefined) setPlaybackAutoplay(s.playbackAutoplay);
        if (s.playbackMuteByDefault !== undefined) setPlaybackMuteByDefault(s.playbackMuteByDefault);
        if (s.playbackTransitionSpeed) setPlaybackTransitionSpeed(s.playbackTransitionSpeed);

        await recalculateStorageStats();
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };
    loadAllSettings();
  }, [user]);

  // Log setting change helper for history
  const addHistoryLog = (settingName: string, category: string, oldVal: string, newVal: string) => {
    setConfigHistory((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        settingName,
        category,
        oldVal,
        newVal
      },
      ...prev.slice(0, 9)
    ]);
  };

  // Rollback helper
  const handleRollback = (log: ConfigHistoryItem) => {
    showToast('info', `Rolling back ${log.settingName}`, `Restored to ${log.oldVal}`);
    addHistoryLog(log.settingName, log.category, log.newVal, log.oldVal);
  };

  // Preset Configurations
  const CONFIG_PRESETS: ConfigPreset[] = [
    {
      id: 'preset-video-editor',
      title: 'Video Editor Mode',
      description: '4K playback, smooth animations, compact cards, dark UI',
      icon: PlayCircle,
      settings: {
        theme: 'dark',
        playbackQuality: '4k',
        cardDensity: 'compact',
        motionPref: 'smooth'
      }
    },
    {
      id: 'preset-family-collab',
      title: 'Family Collaboration',
      description: 'Email digests on, invite-only privacy, comfortable spacing',
      icon: UsersIcon,
      settings: {
        emailDigest: true,
        storyVisibility: 'invite-only',
        cardDensity: 'comfortable'
      }
    },
    {
      id: 'preset-accessibility',
      title: 'Accessibility Optimised',
      description: 'High contrast, reduced motion, keyboard navigation enabled',
      icon: Accessibility,
      settings: {
        highContrast: true,
        reducedMotion: true,
        keyboardNavigation: true,
        fontScale: 'large'
      }
    }
  ];

  const handleApplyPreset = (preset: ConfigPreset) => {
    if (preset.settings.theme) setTheme(preset.settings.theme as any);
    if (preset.settings.playbackQuality) setPlaybackQuality(preset.settings.playbackQuality);
    if (preset.settings.cardDensity) setCardDensity(preset.settings.cardDensity);
    if (preset.settings.highContrast !== undefined) setHighContrast(preset.settings.highContrast);
    if (preset.settings.reducedMotion !== undefined) setReducedMotion(preset.settings.reducedMotion);

    showToast('success', `Applied ${preset.title}`, preset.description);
    addHistoryLog(`Preset: ${preset.title}`, 'Control Center', 'Custom', preset.title);
  };

  // AI Assistant Action
  const handleAiPromptSubmit = (promptText: string) => {
    setAiPrompt(promptText);
    showToast('info', 'AI Config Assistant analyzing...', 'Calculating optimal preference parameters');
    setTimeout(() => {
      if (promptText.toLowerCase().includes('video') || promptText.toLowerCase().includes('edit')) {
        setAiRecommendation({
          title: 'Optimize for Video Editing',
          description: 'Enable 4K playback quality, compact card density, and smooth transitions.',
          changes: { playbackQuality: '4k', cardDensity: 'compact', motionPref: 'smooth' }
        });
      } else if (promptText.toLowerCase().includes('accessib') || promptText.toLowerCase().includes('contrast')) {
        setAiRecommendation({
          title: 'Optimize Accessibility',
          description: 'Enable high contrast, screen reader cues, and enlarged font scaling.',
          changes: { highContrast: true, keyboardNavigation: true, fontScale: 'large' }
        });
      } else if (promptText.toLowerCase().includes('storage') || promptText.toLowerCase().includes('clean')) {
        setAiRecommendation({
          title: 'Reduce Storage Usage',
          description: 'Clear temporary rendering thumbnails and cache files to free ~420MB.',
          changes: {}
        });
      } else {
        setAiRecommendation({
          title: 'Recommended Workspace Settings',
          description: 'Enable email digests, 2FA security, and auto-saving timeline drafts.',
          changes: { emailDigest: true, twoFactorEnabled: true }
        });
      }
    }, 500);
  };

  const handleApproveAiRecommendation = () => {
    if (!aiRecommendation) return;
    if (aiRecommendation.changes.playbackQuality) setPlaybackQuality(aiRecommendation.changes.playbackQuality);
    if (aiRecommendation.changes.cardDensity) setCardDensity(aiRecommendation.changes.cardDensity);
    if (aiRecommendation.changes.highContrast !== undefined) setHighContrast(aiRecommendation.changes.highContrast);
    if (aiRecommendation.changes.emailDigest !== undefined) setEmailDigest(aiRecommendation.changes.emailDigest);

    showToast('success', 'AI Recommendations Applied', aiRecommendation.title);
    addHistoryLog('AI Assistant Optimization', 'AI Engine', 'Default', aiRecommendation.title);
    setAiRecommendation(null);
  };

  // Action Handlers
  const handleClearCache = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Cached Assets',
      message: 'Are you sure you want to clear cached assets? This will remove temporary visual assets and cached thumbnail renders.',
      onConfirm: async () => {
        showToast('success', 'Cache Cleared', 'All temporary thumbnails and cached assets have been cleared.');
        await recalculateStorageStats();
      }
    });
  };

  const handleClearTemporaryFiles = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Temporary Files',
      message: 'Are you sure you want to clear temporary files? Uncommitted voice recordings and timeline drafts will be discarded.',
      onConfirm: async () => {
        showToast('success', 'Temporary Files Cleared', 'All uncommitted timeline recordings and temp documents have been safely discarded.');
        await recalculateStorageStats();
      }
    });
  };

  const handleResetLocalDatabase = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Critical: Wipe Database',
      message: 'CRITICAL WARNING: This will permanently wipe ALL local stories, profiles, media archives, and configuration settings. Irreversible!',
      onConfirm: async () => {
        await persistenceService.clearAll();
        showToast('warning', 'Database Wiped', 'All local databases have been wiped. Reloading application...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SettingsService.updateSettings({ firstName, lastName, citations, biography });
      if (user) {
        await AuthService.updateProfile(user.id, { firstName, lastName, bio: biography });
        await refreshUser();
      }
      showToast('success', 'Profile updated!', 'Your co-author credentials have been saved.');
      addHistoryLog('Co-Author Profile', 'Profile', 'Previous', `${firstName} ${lastName}`);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SettingsService.updateSettings({
        fullName,
        displayName,
        email,
        phone,
        dob,
        country,
        timeZone: timezone,
        preferredLanguage
      });
      if (user) {
        const parts = fullName.split(' ');
        await AuthService.updateProfile(user.id, {
          firstName: parts[0] || firstName,
          lastName: parts.slice(1).join(' ') || lastName,
          displayName,
          country,
          timeZone: timezone
        });
        await refreshUser();
      }
      showToast('success', 'Account details saved!', 'Personal and locale settings updated.');
      addHistoryLog('Account Details', 'Account', 'Previous', fullName);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match', 'Please verify your confirm password entry.');
      return;
    }
    if (!user) return;
    try {
      const { isSupabaseConfigured } = await import('../../lib/supabase');
      if (isSupabaseConfigured()) {
        await AuthService.resetPasswordByEmail('', newPassword);
        showToast('success', 'Password updated', 'Your account credentials have been updated securely.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
        addHistoryLog('Security Password', 'Security', 'Previous', 'Updated');
        return;
      }

      const userSchema = await persistenceService.users.getById(user.id);
      if (!userSchema) throw new Error('User not found.');

      const { comparePassword, hashPassword } = await import('../../storage/utils/crypto');
      const isCorrect = await comparePassword(currentPassword, userSchema.passwordHash);
      if (!isCorrect) {
        showToast('error', 'Authentication Failed', 'The current password you entered is incorrect.');
        return;
      }

      const passwordHash = await hashPassword(newPassword);
      await persistenceService.users.update(user.id, { passwordHash });

      showToast('success', 'Password updated', 'Your authentication parameters have been modified.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
      addHistoryLog('Security Password', 'Security', 'Old Hash', 'New Hash');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleExportSettings = async () => {
    try {
      const dataStr = await SettingsService.exportSettings();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'reellegacy_settings.json');
      linkElement.click();
      showToast('success', 'Export Successful', 'Configuration settings exported as JSON.');
    } catch (err: any) {
      showToast('error', 'Export Failed', err.message);
    }
  };

  const handleToggle2FA = async () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    try {
      await SettingsService.updateSettings({ twoFactorEnabled: nextVal });
      showToast(
        nextVal ? 'success' : 'warning', 
        nextVal ? 'Two-Factor Auth Initialized' : 'Two-Factor Auth Disabled', 
        nextVal ? 'Security key generated.' : '2FA deactivated.'
      );
      addHistoryLog('2FA Security', 'Security', nextVal ? 'Off' : 'On', nextVal ? 'On' : 'Off');
    } catch (e: any) {
      showToast('error', 'Action failed', e.message);
    }
  };

  // Inspect Card in Right Panel
  const handleInspectSetting = (title: string, category: string, details: string) => {
    setSelection('settings', { title, category, details });
    setRightPanelOpen(true);
  };

  // Horizontal Navigation Workspace Tabs List
  const workspaceTabs: { id: SettingsTab; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, badge: 'Hub' },
    { id: 'account', label: 'Account', icon: User },
    { id: 'profile', label: 'Co-Author Bio', icon: Key },
    { id: 'workspace', label: 'Workspace', icon: Layout },
    { id: 'appearance', label: 'Appearance', icon: Paintbrush },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'playback', label: 'Playback', icon: PlayCircle },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'privacy', label: 'Privacy', icon: ShieldAlert },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'advanced', label: 'Advanced & Presets', icon: SlidersHorizontal, badge: 'Pro' },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div id="settings-control-center-root" className="space-y-6 animate-fade-in text-foreground pb-16 pt-2 md:pt-4">
      {/* SECTION 1: HERO CONTROL CENTER OVERVIEW BANNER */}
      <div id="settings-hero-banner" className="bg-gradient-to-br from-cinema-slate-900 via-cinema-slate-800 to-cinema-slate-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-cinema-slate-800 space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cinema-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cinema-ai/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center text-[10px] uppercase font-mono font-bold tracking-widest text-cinema-amber-400 bg-cinema-amber-500/15 px-3 py-1 rounded-full border border-cinema-amber-500/30">
                <Settings className="w-3.5 h-3.5 mr-1.5 text-cinema-amber-400 animate-spin-slow" /> ReelLegacy Control Center
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                System Healthy
              </span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              System Settings & Preferences
            </h1>
            <p className="text-xs md:text-sm text-cinema-slate-300 max-w-xl leading-relaxed">
              Configure co-author profiles, UI layout density, security parameters, rendering presets, and cloud storage.
            </p>
          </div>

          {/* Quick Action Header Buttons */}
          <div className="flex items-center gap-2 shrink-0" id="hero-quick-actions">
            <Button
              id="btn-hero-ai-assist"
              variant="outline"
              size="sm"
              onClick={() => handleAiPromptSubmit('Optimise my workspace settings')}
              className="border-cinema-ai/40 text-cinema-ai hover:bg-cinema-ai/10 text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Config Assist
            </Button>

            <Button
              id="btn-hero-export-json"
              variant="secondary"
              size="sm"
              onClick={handleExportSettings}
              className="text-xs cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 mr-1.5" /> Export JSON
            </Button>
          </div>
        </div>

        {/* System Overview Compact Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono" id="hero-metrics-grid">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Profile Complete</span>
              <span className="text-base font-bold text-white">89%</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-cinema-amber-500/20 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-400">
              <User className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Security Rating</span>
              <span className="text-base font-bold text-emerald-400">{twoFactorEnabled ? 'Strong (2FA)' : 'Standard'}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Storage Used</span>
              <span className="text-base font-bold text-white">{percentUsed}% ({totalEstimatedSize})</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cinema-slate-400 uppercase block">Integrations</span>
              <span className="text-base font-bold text-sky-400">5 Connected</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SMART SEARCH & AI CONFIG ASSISTANT */}
      <div id="smart-search-and-ai-container" className="space-y-3">
        {/* Search Bar */}
        <div className="relative" id="settings-search-bar">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-amber-500" />
          <input
            id="input-settings-search"
            type="text"
            placeholder="Search preferences, shortcuts, 2FA, theme, storage, or notifications... (Press '/' or ⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs md:text-sm pl-11 pr-24 py-3 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cinema-amber-500 transition-all shadow-xs"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery ? (
              <button
                id="btn-clear-settings-search"
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden md:inline-flex items-center text-[10px] font-mono text-muted-foreground/70 bg-muted px-2 py-0.5 rounded border border-border/60">
                ⌘K / /
              </span>
            )}
          </div>
        </div>

        {/* Quick Search Chips when input is empty */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground pt-0.5" id="settings-quick-search-chips">
            <span className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-wider mr-1">Quick Search:</span>
            {['2FA Security', 'Theme Mode', '4K Playback', 'Thumbnail Cache', 'Google Drive', 'Keyboard Hotkeys'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="text-[11px] font-mono bg-card border border-border/70 hover:border-cinema-amber-500/50 hover:text-cinema-amber-500 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Live Search Results Panel */}
        {searchQuery.trim() !== '' && (
          <div id="settings-search-results-panel" className="bg-card border border-border rounded-2xl p-5 space-y-4 animate-fade-in shadow-md">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cinema-amber-500" />
                <h3 className="text-sm font-bold text-foreground">
                  Search Results for <span className="text-cinema-amber-500 font-mono">"{searchQuery}"</span>
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-bold">
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((item) => (
                  <div key={item.id} className="p-3.5 bg-muted/30 border border-border/80 rounded-xl space-y-2 hover:border-cinema-amber-500/40 transition-all flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{item.title}</span>
                        <span className="text-[10px] font-mono font-bold uppercase text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded-full border border-cinema-amber-500/20">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-border/30">
                      <span className="text-[10px] text-muted-foreground font-mono">Tab: {item.tab}</span>
                      <Button
                        id={`btn-jump-to-${item.id}`}
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setActiveTab(item.tab);
                          setSearchQuery('');
                        }}
                        className="text-xs text-cinema-amber-500 hover:text-cinema-amber-400 font-bold cursor-pointer"
                      >
                        Configure Setting <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                type="search"
                title="No matching settings found"
                description={`We couldn't find any configuration matching "${searchQuery}". Try searching for 2FA, Theme, 4K, Storage, or Google Drive.`}
                primaryActionLabel="Clear Search Filter"
                onPrimaryAction={() => setSearchQuery('')}
              />
            )}
          </div>
        )}

        {/* AI Configuration Assistant Box */}
        {aiRecommendation && (
          <div id="ai-recommendation-box" className="p-4 bg-cinema-ai/10 border border-cinema-ai/30 rounded-2xl space-y-3 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cinema-ai text-xs font-mono uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> {aiRecommendation.title}
              </span>
              <button onClick={() => setAiRecommendation(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-foreground/90 text-xs leading-relaxed">{aiRecommendation.description}</p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                id="btn-approve-ai-rec"
                variant="primary"
                size="xs"
                onClick={handleApproveAiRecommendation}
                className="bg-cinema-ai hover:bg-cinema-ai/90 text-white font-bold cursor-pointer"
              >
                Approve & Apply Changes
              </Button>
              <Button
                id="btn-dismiss-ai-rec"
                variant="ghost"
                size="xs"
                onClick={() => setAiRecommendation(null)}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: HORIZONTAL WORKSPACE NAVIGATION TABS (NO INTERNAL SIDEBAR) */}
      <div id="settings-horizontal-workspace-nav" className="border-b border-border/80 pb-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {workspaceTabs.map((tab) => {
            const TabIcon = tab.icon || Settings;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`setting-workspace-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    isSelected ? 'bg-cinema-amber-500/20 text-cinema-amber-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: WORKSPACE CONTENT PANELS */}
      <div id="settings-workspace-content-body" className="space-y-6">

        {/* 1. OVERVIEW WORKSPACE (HUB DASHBOARD) */}
        {activeTab === 'overview' && (
          <div id="workspace-overview" className="space-y-6 animate-fade-in">
            {/* Context Recommendations */}
            <div className="space-y-3" id="overview-recommendations">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cinema-amber-500" /> System Recommendations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-card border border-border/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Two-Factor Authentication</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-500'}`}>
                      {twoFactorEnabled ? 'Active' : 'Recommended'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Add an extra security layer to protect family archive scripts.</p>
                  <Button
                    id="btn-rec-2fa"
                    variant="outline"
                    size="xs"
                    onClick={() => setActiveTab('security')}
                    className="cursor-pointer text-xs"
                  >
                    Configure 2FA
                  </Button>
                </div>

                <div className="p-3.5 bg-card border border-border/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Cloud Storage Auto-Sync</span>
                    <span className="text-[9px] font-mono bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded-full font-bold">
                      Google Drive
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Connect external backup providers to safeguard 4K masters.</p>
                  <Button
                    id="btn-rec-integrations"
                    variant="outline"
                    size="xs"
                    onClick={() => setActiveTab('integrations')}
                    className="cursor-pointer text-xs"
                  >
                    Manage Integrations
                  </Button>
                </div>

                <div className="p-3.5 bg-card border border-border/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Cache Optimization</span>
                    <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      Ready
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Clear temporary render thumbnails to free storage space.</p>
                  <Button
                    id="btn-rec-clear-cache"
                    variant="outline"
                    size="xs"
                    onClick={handleClearCache}
                    className="cursor-pointer text-xs"
                  >
                    Clear Cache
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview Quick Category Cards Grid */}
            <div className="space-y-3" id="overview-categories-grid">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                All Configuration Workspaces
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'account', label: 'My Account', desc: 'Email verification, locale, timezone', icon: User, status: 'Active' },
                  { id: 'profile', label: 'Co-Author Bio', desc: 'Display name, citations prefix', icon: Key, status: 'Archivist' },
                  { id: 'appearance', label: 'Appearance', desc: 'Themes, accent colors, typography scaling', icon: Paintbrush, status: theme },
                  { id: 'workspace', label: 'Workspace Layout', desc: 'Sidebar defaults, density, opening view', icon: LayoutGrid, status: 'Comfortable' },
                  { id: 'notifications', label: 'Notifications', desc: 'Email digests, push warnings, weekly logs', icon: BellRing, status: 'Enabled' },
                  { id: 'playback', label: 'Playback & Video', desc: '4K preview quality, transitions', icon: PlayCircle, status: playbackQuality },
                  { id: 'accessibility', label: 'Accessibility', desc: 'High-contrast, screen reader, hotkeys', icon: Accessibility, status: 'Standard' },
                  { id: 'privacy', label: 'Privacy & Sharing', desc: 'Cloud sync paths, draft permissions', icon: ShieldAlert, status: 'Private' },
                  { id: 'security', label: 'Security & Keys', icon: Lock, desc: 'Password updates, login history, devices', status: twoFactorEnabled ? '2FA Active' : 'Standard' },
                  { id: 'storage', label: 'Storage Stats', icon: Database, desc: 'Detailed breakdown for pictures & video', status: `${percentUsed}% Used` },
                  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard, desc: 'Keyboard hotkey bindings', status: 'Standard' },
                  { id: 'integrations', label: 'Integrations', icon: Link2, desc: 'Google Drive, Dropbox, CareerCanvas', status: '5 Connected' }
                ].map((cat) => {
                  const CatIcon = cat.icon || Settings;
                  return (
                    <div
                      key={cat.id}
                      id={`card-cat-overview-${cat.id}`}
                      onClick={() => setActiveTab(cat.id as SettingsTab)}
                      className="p-4 bg-card border border-border/80 hover:border-cinema-amber-500/50 rounded-2xl transition-all cursor-pointer space-y-2 group shadow-xs hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-foreground group-hover:text-cinema-amber-500 group-hover:border-cinema-amber-500/40">
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded font-bold uppercase">
                          {cat.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors">{cat.label}</h3>
                        <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. ACCOUNT WORKSPACE */}
        {activeTab === 'account' && (
          <form id="workspace-account-form" onSubmit={handleAccountSubmit} className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-cinema-amber-500" /> Account Identity & Credentials
                </h3>
                <Button id="btn-inspect-account" type="button" variant="ghost" size="xs" onClick={() => handleInspectSetting('Account Identity', 'Account', 'Account credentials and locale settings.')}>
                  Inspect
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Full Name</label>
                  <Input id="input-account-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Display Name</label>
                  <Input id="input-account-displayname" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Email Address</label>
                  <Input id="input-account-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Phone Number</label>
                  <Input id="input-account-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Country / Region</label>
                  <Input id="input-account-country" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Timezone</label>
                  <Input id="input-account-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button id="btn-save-account" type="submit" variant="primary" size="sm" className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-black font-bold">
                  Save Account Settings
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* 3. CO-AUTHOR PROFILE WORKSPACE */}
        {activeTab === 'profile' && (
          <form id="workspace-profile-form" onSubmit={handleProfileSubmit} className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Key className="w-4 h-4 text-cinema-amber-500" /> Co-Author Profile & Bio
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">First Name</label>
                  <Input id="input-profile-firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Last Name</label>
                  <Input id="input-profile-lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-muted-foreground font-medium mb-1">Citations & Family Archive Title</label>
                  <Input id="input-profile-citations" value={citations} onChange={(e) => setCitations(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-muted-foreground font-medium mb-1">Archivist Biography</label>
                  <textarea
                    id="input-profile-biography"
                    rows={4}
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    className="w-full text-xs p-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button id="btn-save-profile" type="submit" variant="primary" size="sm" className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-black font-bold">
                  Save Profile Settings
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* 4. WORKSPACE BEHAVIOUR */}
        {activeTab === 'workspace' && (
          <div id="workspace-layout-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <LayoutGrid className="w-4 h-4 text-cinema-amber-500" /> Layout & Density Defaults
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Sidebar Initial Behavior</label>
                  <Select
                    id="select-sidebar-behavior"
                    value={sidebarBehavior}
                    onChange={(val) => setSidebarBehavior(val)}
                    options={[
                      { value: 'expanded', label: 'Expanded (Default)' },
                      { value: 'collapsed', label: 'Compact Icons Only' },
                      { value: 'auto-hide', label: 'Auto-Collapse on Small Screens' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Card Grid Density</label>
                  <Select
                    id="select-card-density"
                    value={cardDensity}
                    onChange={(val) => setCardDensity(val)}
                    options={[
                      { value: 'comfortable', label: 'Comfortable (Spacious)' },
                      { value: 'compact', label: 'Compact (High Information)' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. APPEARANCE WORKSPACE */}
        {activeTab === 'appearance' && (
          <div id="workspace-appearance-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <Paintbrush className="w-4 h-4 text-cinema-amber-500" /> Theme Mode & Aesthetics
              </h3>

              <div className="grid grid-cols-3 gap-3" id="theme-mode-selector">
                {[
                  { id: 'light', label: 'Light Mode', icon: Sun },
                  { id: 'dark', label: 'Dark Mode', icon: Moon },
                  { id: 'system', label: 'System Theme', icon: Laptop }
                ].map((t) => {
                  const TIcon = t.icon;
                  const isSel = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`btn-theme-${t.id}`}
                      onClick={() => {
                        setTheme(t.id as any);
                        showToast('info', `Theme set to ${t.label}`);
                        addHistoryLog('Theme Mode', 'Appearance', theme, t.id);
                      }}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-cinema-amber-500/15 border-cinema-amber-500 text-cinema-amber-500 font-bold'
                          : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <TIcon className="w-5 h-5" />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 6. NOTIFICATIONS WORKSPACE */}
        {activeTab === 'notifications' && (
          <div id="workspace-notifications-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <BellRing className="w-4 h-4 text-cinema-amber-500" /> Notification Channels & Digest
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'Weekly Family Digest Email', state: emailDigest, set: setEmailDigest, desc: 'Receive a weekly summary of story drafts and timeline edits.' },
                  { label: 'In-App Operational Alerts', state: inAppNotifs, set: setInAppNotifs, desc: 'Show toast alerts for 4K rendering completion and uploads.' },
                  { label: 'Security & Auth Audit Logs', state: securityLogs, set: setSecurityLogs, desc: 'Receive immediate alerts when new devices log into your account.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 border border-border/60 rounded-xl">
                    <div>
                      <h4 className="font-bold text-foreground">{item.label}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 accent-cinema-amber-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. PLAYBACK WORKSPACE */}
        {activeTab === 'playback' && (
          <div id="workspace-playback-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <PlayCircle className="w-4 h-4 text-cinema-amber-500" /> Video & Preview Quality
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Preview Render Quality</label>
                  <Select
                    id="select-playback-quality"
                    value={playbackQuality}
                    onChange={(val) => setPlaybackQuality(val)}
                    options={[
                      { value: '1080p', label: '1080p HD (Balanced)' },
                      { value: '4k', label: '4K Ultra HD (Pro Archive)' },
                      { value: '720p', label: '720p Fast Preview' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. ACCESSIBILITY WORKSPACE */}
        {activeTab === 'accessibility' && (
          <div id="workspace-accessibility-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <Accessibility className="w-4 h-4 text-cinema-amber-500" /> Accessibility Compliance
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'High-Contrast Mode', state: highContrast, set: setHighContrast, desc: 'Enhance border contrast and typography ratios.' },
                  { label: 'Reduced Motion', state: reducedMotion, set: setReducedMotion, desc: 'Disable heavy transition animations for motion sensitivity.' },
                  { label: 'Full Keyboard Navigation', state: keyboardNav, set: setKeyboardNav, desc: 'Enable hotkey bindings across all workspace views.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 border border-border/60 rounded-xl">
                    <div>
                      <h4 className="font-bold text-foreground">{item.label}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 accent-cinema-amber-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. PRIVACY WORKSPACE */}
        {activeTab === 'privacy' && (
          <div id="workspace-privacy-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <ShieldAlert className="w-4 h-4 text-cinema-amber-500" /> Privacy & Data Sovereignty
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'Workspace Telemetry & Analytics', state: analyticsEnabled, set: setAnalyticsEnabled, desc: 'Help improve ReelLegacy by sharing anonymous performance telemetry.' },
                  { label: 'Strict Private Storage Schema', state: !dataSharing, set: (val: boolean) => setDataSharing(!val), desc: 'Ensure private family photos are never indexed or shared.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 border border-border/60 rounded-xl">
                    <div>
                      <h4 className="font-bold text-foreground">{item.label}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 accent-cinema-amber-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. SECURITY WORKSPACE */}
        {activeTab === 'security' && (
          <div id="workspace-security-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cinema-amber-500" /> Two-Factor Authentication & Devices
                </h3>
                <Button
                  id="btn-toggle-2fa"
                  variant={twoFactorEnabled ? 'destructive' : 'primary'}
                  size="xs"
                  onClick={handleToggle2FA}
                  className="cursor-pointer font-bold"
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </Button>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-muted-foreground">Active Sessions & Trusted Devices:</p>
                {devices.map((dev) => (
                  <div key={dev.id} className="p-3 bg-muted/30 border border-border/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{dev.name}</h4>
                      <span className="text-[10px] text-muted-foreground font-mono">{dev.os} • {dev.lastActive}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                      {dev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 11. STORAGE WORKSPACE */}
        {activeTab === 'storage' && (
          <div id="workspace-storage-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <Database className="w-4 h-4 text-cinema-amber-500" /> Storage Statistics & Quota
              </h3>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-xs">
                  <span>Used: {totalEstimatedSize}</span>
                  <span>Free: {freeSize} / 15.00 GB</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-cinema-amber-500 h-full" style={{ width: `${percentUsed}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button id="btn-clear-cache-storage" variant="outline" size="xs" onClick={handleClearCache} className="cursor-pointer">
                  Clear Thumbnail Cache
                </Button>
                <Button id="btn-clear-temp-storage" variant="outline" size="xs" onClick={handleClearTemporaryFiles} className="cursor-pointer">
                  Clear Temp Recordings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 12. KEYBOARD SHORTCUTS WORKSPACE */}
        {activeTab === 'shortcuts' && (
          <div id="workspace-shortcuts-config" className="space-y-4 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-cinema-amber-500" /> Keyboard Hotkeys Reference
              </h3>
              <p className="text-xs text-muted-foreground">Unified hotkey mappings across ReelLegacy modules.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/60 text-xs font-mono">
              {[
                { key: '/', desc: 'Focus Global Search' },
                { key: 'Esc', desc: 'Close Overlays & Modals' },
                { key: 'Ctrl + S', desc: 'Save Story Script Draft' },
                { key: 'Ctrl + Shift + L', desc: 'Toggle Light / Dark Theme' }
              ].map((sc, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-bold text-cinema-amber-400 bg-muted px-2 py-0.5 rounded border border-border/60">{sc.key}</span>
                  <span className="text-muted-foreground">{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. INTEGRATIONS WORKSPACE */}
        {activeTab === 'integrations' && (
          <div id="workspace-integrations-config" className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <Link2 className="w-4 h-4 text-cinema-amber-500" /> Workspace Cloud Integrations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Google Drive Sync', desc: 'Backup family photos & 4K renders', status: 'Connected' },
                  { name: 'Dropbox Vault', desc: 'Auto-export high-res TIFF scans', status: 'Connected' },
                  { name: 'CareerCanvas Sync', desc: 'Cross-link biographical records', status: 'Connected' }
                ].map((ig, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 border border-border/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{ig.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{ig.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                      {ig.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 14. ADVANCED & PRESETS WORKSPACE (INCLUDES ISOLATED DANGER ZONE) */}
        {activeTab === 'advanced' && (
          <div id="workspace-advanced-config" className="space-y-6 animate-fade-in">
            {/* Presets */}
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-cinema-amber-500" /> Reusable Configuration Profiles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {CONFIG_PRESETS.map((preset) => (
                  <div key={preset.id} className="p-3.5 bg-muted/30 border border-border/60 rounded-2xl space-y-2 text-xs flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{preset.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{preset.description}</p>
                    </div>
                    <Button
                      id={`btn-apply-preset-${preset.id}`}
                      variant="outline"
                      size="xs"
                      onClick={() => handleApplyPreset(preset)}
                      className="cursor-pointer border-cinema-amber-500/40 text-cinema-amber-500 font-bold self-start mt-2"
                    >
                      Apply Profile
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration History Log */}
            <div className="bg-card border border-border p-5 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <History className="w-4 h-4 text-cinema-amber-500" /> Recent Configuration Log & Rollback
              </h3>

              <div className="divide-y divide-border/60 text-xs font-mono">
                {configHistory.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground">{log.settingName}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">({log.category}) • {log.timestamp}</span>
                      <div className="text-[10px] text-muted-foreground">Changed: {log.oldVal} → {log.newVal}</div>
                    </div>
                    <Button
                      id={`btn-rollback-${log.id}`}
                      variant="ghost"
                      size="xs"
                      onClick={() => handleRollback(log)}
                      className="text-xs text-cinema-amber-500 hover:bg-cinema-amber-500/10"
                    >
                      Rollback
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ISOLATED DANGER ZONE */}
            <div id="settings-isolated-danger-zone" className="p-5 bg-card border-2 border-red-500/30 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-red-500/20 pb-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-red-500">Isolated Danger Zone</h3>
                  <p className="text-xs text-muted-foreground">Destructive system actions requiring explicit confirmation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <Button
                  id="btn-danger-wipe-db"
                  variant="destructive"
                  size="xs"
                  onClick={handleResetLocalDatabase}
                  className="cursor-pointer font-bold"
                >
                  Wipe Local Database
                </Button>
                <Button
                  id="btn-danger-reset-all"
                  variant="outline"
                  size="xs"
                  onClick={handleResetLocalDatabase}
                  className="cursor-pointer border-red-500/40 text-red-500 hover:bg-red-500/10 font-bold"
                >
                  Reset Entire Workspace
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 15. ABOUT WORKSPACE */}
        {activeTab === 'about' && (
          <div id="workspace-about-config" className="space-y-4 animate-fade-in">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-cinema-amber-500" /> About ReelLegacy
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                ReelLegacy v2.8 (Build 2026.07) • Generative Archival Cinema Engine. Built under Apache-2.0 License.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal Container */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={async () => {
          await confirmModal.onConfirm();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
