/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { AuthService, persistenceService, SettingsService, SettingsSchema } from '../../storage';
import { 
  User, 
  Settings, 
  Paintbrush, 
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
  Link2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type SettingsTab = 'hub' | 'account' | 'profile' | 'appearance' | 'workspace' | 'notifications' | 'accessibility' | 'privacy' | 'security' | 'storage' | 'about' | 'playback' | 'shortcuts' | 'integrations';

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

export function SettingsView() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { showToast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  
  // Active Settings Tab State - Default to 'profile' if pathname matches
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    window.location.pathname.endsWith('/my-profile') ? 'profile' : 'hub'
  );

  useEffect(() => {
    if (location.pathname.endsWith('/my-profile')) {
      setActiveTab('profile');
    } else {
      setActiveTab('hub');
    }
  }, [location.pathname]);

  // ==========================================
  // STATE MANAGEMENT (Mock Data Configurations)
  // ==========================================

  const { refreshUser } = useAuth();

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

  // 9. Storage States
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

      // Photos
      const photos = allMedia.filter(m => m.type === 'image');
      const pCount = photos.length || 142;
      const pBytes = photos.reduce((acc, m) => acc + (m.bytes || 0), 0) || (142 * 1024 * 1024 * 2.9);
      setPhotosCount(pCount);
      setPhotosSize(formatBytes(pBytes));

      // Videos
      const videos = allMedia.filter(m => m.type === 'video');
      const vCount = videos.length || 12;
      const vBytes = videos.reduce((acc, m) => acc + (m.bytes || 0), 0) || (12 * 1024 * 1024 * 48.3);
      setVideosCount(vCount);
      setVideosSize(formatBytes(vBytes));

      // Audio/Vocal Narrations
      const vocals = allMedia.filter(m => m.type === 'audio');
      const voCount = vocals.length || 8;
      const voBytes = vocals.reduce((acc, m) => acc + (m.bytes || 0), 0) || (8 * 1024 * 1024 * 15.0);
      setVocalCount(voCount);
      setVocalSize(formatBytes(voBytes));

      // Declassified Docs
      const dCount = allDocs.length || 24;
      const dBytes = allDocs.reduce((acc, d) => acc + (d.bytes || 0), 0) || (24 * 1024 * 1024 * 1.875);
      setDocsCount(dCount);
      setDocsSize(formatBytes(dBytes));

      // Story Draft Assets
      const sCount = allStories.length || 15;
      const sBytes = sCount * 1.2 * 1024 * 1024;
      setStoriesCount(sCount);
      setStoriesSize(formatBytes(sBytes));

      // Profiles
      const prCount = allProfiles.length || 4;
      const prBytes = prCount * 0.5 * 1024 * 1024;
      setProfilesCount(prCount);
      setProfilesSize(formatBytes(prBytes));

      // Totals
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

  const [loading, setLoading] = useState(true);

  // Sync state values with database when fetched
  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        const s = await SettingsService.getSettings();
        // Load account preferences
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

        // Profile
        if (s.firstName) setFirstName(s.firstName);
        if (s.lastName) setLastName(s.lastName);
        if (s.citations) setCitations(s.citations);
        if (s.biography) setBiography(s.biography);

        // Appearance
        if (s.theme) setTheme(s.theme);
        if (s.accentColor) setAccentColor(s.accentColor);
        if (s.fontScale) setFontScaling(s.fontScale);
        if (s.motionPref) setMotionPref(s.motionPref);
        if (s.compactMode !== undefined) setCompactMode(s.compactMode);
        if (s.animationIntensity) setAnimationIntensity(s.animationIntensity);

        // Workspace
        if (s.sidebarBehavior) setSidebarBehavior(s.sidebarBehavior);
        if (s.rightPanelBehavior) setRightPanelBehavior(s.rightPanelBehavior);
        if (s.defaultView) setDefaultView(s.defaultView);
        if (s.cardDensity) setCardDensity(s.cardDensity);
        if (s.tableDensity) setTableDensity(s.tableDensity);

        // Notifications
        if (s.emailDigest !== undefined) setEmailDigest(s.emailDigest);
        if (s.inAppNotifs !== undefined) setInAppNotifs(s.inAppNotifs);
        if (s.weeklyReminders !== undefined) setWeeklyReminders(s.weeklyReminders);
        if (s.securityLogs !== undefined) setSecurityLogs(s.securityLogs);
        if (s.uploadNotifs !== undefined) setUploadNotifs(s.uploadNotifs);
        if (s.storyNotifs !== undefined) setStoryNotifs(s.storyNotifs);
        if (s.timelineNotifs !== undefined) setTimelineNotifs(s.timelineNotifs);

        // Accessibility
        if (s.highContrast !== undefined) setHighContrast(s.highContrast);
        if (s.reducedMotion !== undefined) setReducedMotion(s.reducedMotion);
        if (s.keyboardNavigation !== undefined) setKeyboardNav(s.keyboardNavigation);
        if (s.screenReader !== undefined) setScreenReader(s.screenReader);
        if (s.focusVisibility !== undefined) setFocusVisibility(s.focusVisibility);

        // Privacy
        if (s.analyticsEnabled !== undefined) setAnalyticsEnabled(s.analyticsEnabled);
        if (s.dataSharing !== undefined) setDataSharing(s.dataSharing);
        if (s.profileVisibility) setProfileVisibility(s.profileVisibility);
        if (s.storyVisibility) setStoryVisibility(s.storyVisibility);
        if (s.legacyProfilePrivacy) setLegacyProfilePrivacy(s.legacyProfilePrivacy);
        if (s.searchVisibility) setSearchVisibility(s.searchVisibility);

        // Security
        if (s.twoFactorEnabled !== undefined) setTwoFactorEnabled(s.twoFactorEnabled);
        if (s.backupCodesLeft !== undefined) setBackupCodesLeft(s.backupCodesLeft);

        // Playback
        if (s.playbackQuality) setPlaybackQuality(s.playbackQuality);
        if (s.playbackAutoplay !== undefined) setPlaybackAutoplay(s.playbackAutoplay);
        if (s.playbackMuteByDefault !== undefined) setPlaybackMuteByDefault(s.playbackMuteByDefault);
        if (s.playbackTransitionSpeed) setPlaybackTransitionSpeed(s.playbackTransitionSpeed);

        // Storage Recalculation
        await recalculateStorageStats();
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    };
    loadAllSettings();
  }, [user]);

  // 3. Appearance & Personalization States
  const [accentColor, setAccentColor] = useState('amber');
  const [fontScaling, setFontScaling] = useState('medium');
  const [motionPref, setMotionPref] = useState('smooth');
  const [compactMode, setCompactMode] = useState(false);
  const [animationIntensity, setAnimationIntensity] = useState('moderate');

  // 4. Workspace States
  const [sidebarBehavior, setSidebarBehavior] = useState('expanded');
  const [rightPanelBehavior, setRightPanelBehavior] = useState('collapsible');
  const [defaultView, setDefaultView] = useState('dashboard');
  const [cardDensity, setCardDensity] = useState('comfortable');
  const [tableDensity, setTableDensity] = useState('standard');

  // 5. Notifications States
  const [emailDigest, setEmailDigest] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [weeklyReminders, setWeeklyReminders] = useState(false);
  const [securityLogs, setSecurityLogs] = useState(true);
  const [uploadNotifs, setUploadNotifs] = useState(true);
  const [storyNotifs, setStoryNotifs] = useState(true);
  const [timelineNotifs, setTimelineNotifs] = useState(true);

  // 6. Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [screenReader, setScreenReader] = useState(false);
  const [focusVisibility, setFocusVisibility] = useState(true);

  // 7. Privacy States
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [storyVisibility, setStoryVisibility] = useState('invite-only');
  const [legacyProfilePrivacy, setLegacyProfilePrivacy] = useState('restricted');
  const [searchVisibility, setSearchVisibility] = useState('hidden');

  // 8. Security States
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

  // 9. Storage States (derived from dynamic hook counts)
  const storageBreakdown = [
    { name: 'Photos Shelf', count: `${photosCount} files`, size: photosSize, color: 'bg-amber-500' },
    { name: 'Videos Archives', count: `${videosCount} files`, size: videosSize, color: 'bg-red-500' },
    { name: 'Vocal Narrations', count: `${vocalCount} files`, size: vocalSize, color: 'bg-indigo-500' },
    { name: 'Declassified Docs', count: `${docsCount} files`, size: docsSize, color: 'bg-emerald-500' },
    { name: 'Story Draft Assets', count: `${storiesCount} files`, size: storiesSize, color: 'bg-sky-500' },
    { name: 'Legacy Profiles Metadata', count: `${profilesCount} items`, size: profilesSize, color: 'bg-purple-500' }
  ];

  // ==========================================
  // ACTION HANDLERS
  // ==========================================

  const handleClearCache = async () => {
    const confirmed = window.confirm("Are you sure you want to clear cached assets? This will remove temporary visual assets and cached thumbnail renders.");
    if (confirmed) {
      showToast('success', 'Cache Cleared', 'All temporary thumbnails and cached assets have been cleared.');
      await recalculateStorageStats();
    }
  };

  const handleClearTemporaryFiles = async () => {
    const confirmed = window.confirm("Are you sure you want to clear temporary files? Uncommitted voice recordings and timeline drafts will be discarded.");
    if (confirmed) {
      showToast('success', 'Temporary Files Cleared', 'All uncommitted timeline recordings and temp documents have been safely discarded.');
      await recalculateStorageStats();
    }
  };

  const handleResetLocalDatabase = async () => {
    const confirmed = window.confirm("CRITICAL WARNING: This will permanently wipe ALL local stories, profiles, media archives, and configuration settings. This action is irreversible. Proceed?");
    if (confirmed) {
      await persistenceService.clearAll();
      showToast('warning', 'Database Wiped', 'All local databases have been wiped. Reloading application...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SettingsService.updateSettings({
        firstName,
        lastName,
        citations,
        biography
      });
      if (user) {
        await AuthService.updateProfile(user.id, {
          firstName,
          lastName,
          bio: biography
        });
        await refreshUser();
      }
      showToast('success', 'Profile updated successfully!', 'Your co-author credentials have been safely committed.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Could not save profile settings.');
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
        const fName = parts[0] || firstName;
        const lName = parts.slice(1).join(' ') || lastName;
        await AuthService.updateProfile(user.id, {
          firstName: fName,
          lastName: lName,
          displayName,
          country,
          timeZone: timezone
        });
        await refreshUser();
      }
      showToast('success', 'Account credentials saved!', 'Personal and locale settings have been updated.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Could not save account details.');
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

      showToast('success', 'Password updated', 'Your authentication parameters have been modified successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Could not update password.');
    }
  };

  const handleSavePreferences = async (category: string) => {
    try {
      let updates: Partial<SettingsSchema> = {};
      if (category === 'Personalization Appearance') {
        updates = {
          theme,
          accentColor,
          fontScale: fontScaling,
          motionPref,
          compactMode,
          animationIntensity
        };
      } else if (category === 'Workspace Configurations') {
        updates = {
          sidebarBehavior,
          rightPanelBehavior,
          defaultView,
          cardDensity,
          tableDensity
        };
      } else if (category === 'Notifications Settings') {
        updates = {
          emailDigest,
          inAppNotifs,
          weeklyReminders,
          securityLogs,
          uploadNotifs,
          storyNotifs,
          timelineNotifs
        };
      } else if (category === 'Accessibility Preferences') {
        updates = {
          highContrast,
          reducedMotion,
          keyboardNavigation: keyboardNav,
          screenReader,
          focusVisibility
        };
      } else if (category === 'Privacy Settings') {
        updates = {
          analyticsEnabled,
          dataSharing,
          profileVisibility,
          storyVisibility,
          legacyProfilePrivacy,
          searchVisibility
        };
      } else if (category === 'Playback Settings') {
        updates = {
          playbackQuality,
          playbackAutoplay,
          playbackMuteByDefault,
          playbackTransitionSpeed
        };
      }

      await SettingsService.updateSettings(updates);
      showToast('success', `${category} Saved`, 'Preferences have been stored securely in system configurations.');
    } catch (err: any) {
      showToast('error', 'Save Failed', err.message);
    }
  };

  const handleResetSection = async (section: string) => {
    try {
      const s = await SettingsService.resetSection(section);
      if (section === 'appearance') {
        setTheme(s.theme);
        setAccentColor(s.accentColor);
        setFontScaling(s.fontScale);
        setMotionPref(s.motionPref);
        setCompactMode(s.compactMode);
        setAnimationIntensity(s.animationIntensity);
      } else if (section === 'workspace') {
        setSidebarBehavior(s.sidebarBehavior);
        setRightPanelBehavior(s.rightPanelBehavior);
        setDefaultView(s.defaultView);
        setCardDensity(s.cardDensity);
        setTableDensity(s.tableDensity);
      } else if (section === 'notifications') {
        setEmailDigest(s.emailDigest);
        setInAppNotifs(s.inAppNotifs);
        setWeeklyReminders(s.weeklyReminders);
        setSecurityLogs(s.securityLogs);
        setUploadNotifs(s.uploadNotifs);
        setStoryNotifs(s.storyNotifs);
        setTimelineNotifs(s.timelineNotifs);
      } else if (section === 'accessibility') {
        setHighContrast(s.highContrast);
        setReducedMotion(s.reducedMotion);
        setKeyboardNav(s.keyboardNavigation);
        setScreenReader(s.screenReader);
        setFocusVisibility(s.focusVisibility);
      } else if (section === 'privacy') {
        setAnalyticsEnabled(s.analyticsEnabled);
        setDataSharing(s.dataSharing);
        setProfileVisibility(s.profileVisibility);
        setStoryVisibility(s.storyVisibility);
        setLegacyProfilePrivacy(s.legacyProfilePrivacy);
        setSearchVisibility(s.searchVisibility);
      } else if (section === 'playback') {
        setPlaybackQuality(s.playbackQuality);
        setPlaybackAutoplay(s.playbackAutoplay);
        setPlaybackMuteByDefault(s.playbackMuteByDefault);
        setPlaybackTransitionSpeed(s.playbackTransitionSpeed);
      } else if (section === 'account') {
        setFullName(s.fullName || '');
        setDisplayName(s.displayName || '');
        setEmail(s.email || '');
        setPhone(s.phone || '');
        setDob(s.dob || '');
        setCountry(s.country || '');
        setTimezone(s.timeZone || '');
        setPreferredLanguage(s.preferredLanguage || '');
      } else if (section === 'profile') {
        setFirstName(s.firstName || '');
        setLastName(s.lastName || '');
        setCitations(s.citations || '');
        setBiography(s.biography || '');
      }

      showToast('success', `${section.toUpperCase()} Reset`, 'Section configurations have been restored to defaults.');
    } catch (err: any) {
      showToast('error', 'Reset Failed', err.message);
    }
  };

  const handleResetEntireSettings = async () => {
    const confirmed = window.confirm("Are you sure you want to restore ALL settings across all categories to default values?");
    if (confirmed) {
      try {
        const s = await SettingsService.resetEntireSettings();
        // Appearance
        setTheme(s.theme);
        setAccentColor(s.accentColor);
        setFontScaling(s.fontScale);
        setMotionPref(s.motionPref);
        setCompactMode(s.compactMode);
        setAnimationIntensity(s.animationIntensity);
        // Workspace
        setSidebarBehavior(s.sidebarBehavior);
        setRightPanelBehavior(s.rightPanelBehavior);
        setDefaultView(s.defaultView);
        setCardDensity(s.cardDensity);
        setTableDensity(s.tableDensity);
        // Notifications
        setEmailDigest(s.emailDigest);
        setInAppNotifs(s.inAppNotifs);
        setWeeklyReminders(s.weeklyReminders);
        setSecurityLogs(s.securityLogs);
        setUploadNotifs(s.uploadNotifs);
        setStoryNotifs(s.storyNotifs);
        setTimelineNotifs(s.timelineNotifs);
        // Accessibility
        setHighContrast(s.highContrast);
        setReducedMotion(s.reducedMotion);
        setKeyboardNav(s.keyboardNavigation);
        setScreenReader(s.screenReader);
        setFocusVisibility(s.focusVisibility);
        // Privacy
        setAnalyticsEnabled(s.analyticsEnabled);
        setDataSharing(s.dataSharing);
        setProfileVisibility(s.profileVisibility);
        setStoryVisibility(s.storyVisibility);
        setLegacyProfilePrivacy(s.legacyProfilePrivacy);
        setSearchVisibility(s.searchVisibility);
        // Playback
        setPlaybackQuality(s.playbackQuality);
        setPlaybackAutoplay(s.playbackAutoplay);
        setPlaybackMuteByDefault(s.playbackMuteByDefault);
        setPlaybackTransitionSpeed(s.playbackTransitionSpeed);
        // Account
        setFullName(s.fullName || '');
        setDisplayName(s.displayName || '');
        setEmail(s.email || '');
        setPhone(s.phone || '');
        setDob(s.dob || '');
        setCountry(s.country || '');
        setTimezone(s.timeZone || '');
        setPreferredLanguage(s.preferredLanguage || '');
        // Profile
        setFirstName(s.firstName || '');
        setLastName(s.lastName || '');
        setCitations(s.citations || '');
        setBiography(s.biography || '');

        showToast('success', 'All Preferences Reset', 'System configurations successfully restored to defaults.');
      } catch (err: any) {
        showToast('error', 'Reset Failed', err.message);
      }
    }
  };

  const handleExportSettings = async () => {
    try {
      const dataStr = await SettingsService.exportSettings();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = 'reellegacy_settings.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showToast('success', 'Export Successful', 'Your configuration settings have been exported as JSON.');
    } catch (err: any) {
      showToast('error', 'Export Failed', err.message);
    }
  };

  const handleImportSettings = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const s = await SettingsService.importSettings(jsonStr);

        // Map state variables
        setTheme(s.theme);
        setAccentColor(s.accentColor);
        setFontScaling(s.fontScale);
        setMotionPref(s.motionPref);
        setCompactMode(s.compactMode);
        setAnimationIntensity(s.animationIntensity);
        setSidebarBehavior(s.sidebarBehavior);
        setRightPanelBehavior(s.rightPanelBehavior);
        setDefaultView(s.defaultView);
        setCardDensity(s.cardDensity);
        setTableDensity(s.tableDensity);
        setEmailDigest(s.emailDigest);
        setInAppNotifs(s.inAppNotifs);
        setWeeklyReminders(s.weeklyReminders);
        setSecurityLogs(s.securityLogs);
        setUploadNotifs(s.uploadNotifs);
        setStoryNotifs(s.storyNotifs);
        setTimelineNotifs(s.timelineNotifs);
        setHighContrast(s.highContrast);
        setReducedMotion(s.reducedMotion);
        setKeyboardNav(s.keyboardNavigation);
        setScreenReader(s.screenReader);
        setFocusVisibility(s.focusVisibility);
        setAnalyticsEnabled(s.analyticsEnabled);
        setDataSharing(s.dataSharing);
        setProfileVisibility(s.profileVisibility);
        setStoryVisibility(s.storyVisibility);
        setLegacyProfilePrivacy(s.legacyProfilePrivacy);
        setSearchVisibility(s.searchVisibility);
        setPlaybackQuality(s.playbackQuality);
        setPlaybackAutoplay(s.playbackAutoplay);
        setPlaybackMuteByDefault(s.playbackMuteByDefault);
        setPlaybackTransitionSpeed(s.playbackTransitionSpeed);
        setFullName(s.fullName || '');
        setDisplayName(s.displayName || '');
        setEmail(s.email || '');
        setPhone(s.phone || '');
        setDob(s.dob || '');
        setCountry(s.country || '');
        setTimezone(s.timeZone || '');
        setPreferredLanguage(s.preferredLanguage || '');
        setFirstName(s.firstName || '');
        setLastName(s.lastName || '');
        setCitations(s.citations || '');
        setBiography(s.biography || '');

        showToast('success', 'Import Successful', 'Configuration settings successfully imported and applied.');
      } catch (err: any) {
        showToast('error', 'Import Failed', err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleToggle2FA = async () => {
    const nextVal = !twoFactorEnabled;
    setTwoFactorEnabled(nextVal);
    try {
      await SettingsService.updateSettings({ twoFactorEnabled: nextVal });
      showToast(
        nextVal ? 'success' : 'warning', 
        nextVal ? 'Two-Factor Auth Initialized' : 'Two-Factor Auth Disabled', 
        nextVal ? 'Security key generated. Store your backup recovery codes.' : 'Additional security is no longer active.'
      );
    } catch (e: any) {
      showToast('error', 'Action failed', e.message);
    }
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast('info', 'Active session revoked', 'The selected device session has been signed out.');
  };

  const handleTriggerVerification = () => {
    showToast('loading', 'Sending verification mail...', 'A link was dispatched to ' + email);
    setTimeout(() => {
      showToast('success', 'Verification link dispatched', 'Check your mail client to verify ownership.');
    }, 1500);
  };

  // ==========================================
  // CATEGORIES DEFINITION (Settings Hub Overview)
  // ==========================================

  const categories = [
    { id: 'account', label: 'My Account', icon: User, desc: 'Personal details, email verification, languages, active sessions', status: 'Active' },
    { id: 'profile', label: 'Co-Author Profile', icon: Key, desc: 'Manage display name, citations prefix, biography details', status: 'Philip Shaba (Archivist)' },
    { id: 'appearance', label: 'Theme & Appearance', icon: Paintbrush, desc: 'Tweak workspace themes, accents, scales, motion limits', status: theme === 'system' ? 'System Theme' : theme === 'dark' ? 'Dark Mode' : 'Light Theme' },
    { id: 'workspace', label: 'Workspace Behaviour', icon: LayoutGrid, desc: 'Sidebar defaults, default opening view, list layouts', status: 'Comfortable Density' },
    { id: 'notifications', label: 'Notification Channels', icon: BellRing, desc: 'Email digests, push warnings, weekly timeline logs', status: emailDigest ? 'All active' : 'Limited digests' },
    { id: 'playback', label: 'Playback & Video', icon: PlayCircle, desc: 'Default preview quality, autoplay preferences, transitions', status: 'High Quality' },
    { id: 'accessibility', label: 'Accessibility Tools', icon: Accessibility, desc: 'High-contrast ratios, focus borders, keyboard navigations', status: keyboardNav ? 'Full Compliance' : 'Standard' },
    { id: 'privacy', label: 'Privacy & Sharing', icon: ShieldAlert, desc: 'Metrics toggle, cloud sync paths, draft permissions', status: 'Invite-Only Private' },
    { id: 'security', label: 'Security & Keys', icon: Lock, desc: 'Password updates, login history, trusted device controls', status: twoFactorEnabled ? '2FA Active' : '2FA Standard' },
    { id: 'storage', label: 'Storage & Statistics', icon: Database, desc: 'Detailed sizing breakdown for pictures, scripts and voiceovers', status: '1.18 GB / 15 GB Used' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard, desc: 'Review key bindings for documentary curation, timelines, and clips', status: 'Standard Bindings' },
    { id: 'integrations', label: 'Workspace Integrations', icon: Link2, desc: 'Connect Google Drive, OneDrive, and external backup systems', status: 'Connected' },
    { id: 'about', label: 'About ReelLegacy', icon: Info, desc: 'Product version, license data, open source notices, changelogs', status: 'v0.1.0 (Dev Channel)' }
  ] as const;

  return (
    <div id="settings-view-root" className="space-y-6 animate-fade-in text-foreground pb-12 pt-2.5 md:pt-4 lg:pt-5">
      {/* Settings Title Header */}
      <div id="settings-view-title-card" className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-cinema-amber-500" />
            System Settings & Preferences
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure co-author profiles, themes, interface scales, privacy parameters, and cloud statistics.
          </p>
        </div>
        
        {/* Navigation Breadcrumb inside Setting tabs */}
        {activeTab !== 'hub' && (
          <Button 
            id="back-to-hub-btn" 
            variant="secondary" 
            size="sm" 
            onClick={() => setActiveTab('hub')}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Settings Hub
          </Button>
        )}
      </div>

      {/* Main Settings layout: Navigation sidebar + content panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" id="settings-grid-layout">
        
        {/* Left Side Navigation Rail */}
        <div className="space-y-1 lg:col-span-1 border border-border p-4 rounded-2xl bg-card" id="settings-navigation-rail">
          {/* Settings Hub Button */}
          <button
            id="btn-tab-setting-hub"
            onClick={() => setActiveTab('hub')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer ${
              activeTab === 'hub'
                ? 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 font-semibold shadow-xs'
                : 'border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sliders className="w-4.5 h-4.5 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Settings Overview</span>
                <span className="text-[10px] text-muted-foreground/80 font-medium block truncate mt-0.5">Central Hub Dashboard</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
          </button>

          <div className="border-t border-border/60 my-2 pt-2">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/45 block mb-1">
              Settings Sections
            </span>
            {categories.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`btn-tab-setting-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group cursor-pointer mt-0.5 ${
                    isActive
                      ? 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 font-semibold'
                      : 'border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cinema-amber-500' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    <span className="text-xs font-bold truncate">{tab.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Settings Body viewport */}
        <div className="lg:col-span-3 border border-border p-6 md:p-8 bg-card rounded-2xl shadow-xs" id="settings-panels-container">
          
          {/* ==========================================
              0. SETTINGS HUB OVERVIEW
              ========================================== */}
          {activeTab === 'hub' && (
            <div id="settings-panel-hub" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-hub-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2 text-foreground">
                  <Sliders className="w-5 h-5 text-cinema-amber-500" /> Settings Categories Index
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse and edit specific categories. Click on any category block to adjust credentials or customize visual shimmers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="hub-cards-grid">
                {categories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      id={`hub-cat-card-${cat.id}`}
                      onClick={() => setActiveTab(cat.id as SettingsTab)}
                      className="p-5 border border-border hover:border-cinema-amber-500/50 hover:bg-muted/10 rounded-2xl text-left transition-all duration-200 cursor-pointer flex gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/80 text-muted-foreground group-hover:text-cinema-amber-500 group-hover:border-cinema-amber-500/25 transition-colors">
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors">
                            {cat.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                          {cat.desc}
                        </p>
                        <div className="pt-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cinema-amber-500" />
                          <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wide truncate">
                            {cat.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              1. ACCOUNT SETTINGS PANEL
              ========================================== */}
          {activeTab === 'account' && (
            <div id="settings-panel-account" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-account-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-cinema-amber-500" /> Account Management
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage personal identification data, date of birth, time zones, active connected devices and email verifications.
                </p>
              </div>

              {/* Graphic Profile Card header */}
              <div className="relative rounded-2xl overflow-hidden border border-border h-44 mb-6" id="account-visual-banner">
                <img 
                  src={coverImage} 
                  alt="Account Cover" 
                  className="w-full h-full object-cover opacity-75"
                  referrerPolicy="no-referrer"
                />
                <button 
                  id="change-cover-btn"
                  onClick={() => showToast('info', 'Cover Image change placeholder triggered.')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold border border-white/15 cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Camera className="w-3.5 h-3.5" /> Edit Cover
                </button>
                
                {/* Overlay Profile Info block */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end gap-4 text-white">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-cinema-amber-100 text-cinema-amber-600 flex items-center justify-center font-display font-bold shrink-0 shadow-lg">
                    {avatar ? (
                      <img 
                        src={avatar} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      'PS'
                    )}
                    <button 
                      id="change-avatar-btn"
                      onClick={() => showToast('info', 'Avatar change placeholder triggered.')}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white"
                      title="Update Avatar Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="min-w-0 pb-1.5">
                    <h4 className="font-display font-bold text-sm leading-tight">{fullName}</h4>
                    <p className="text-[10px] text-zinc-300 font-mono">@{displayName} • {preferredLanguage}</p>
                  </div>

                  <div className="ml-auto flex items-center gap-1.5" id="verified-status-pill">
                    {emailVerified ? (
                      <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Owner Verified
                      </span>
                    ) : (
                      <button 
                        id="verify-email-trigger-btn"
                        onClick={handleTriggerVerification}
                        className="inline-flex items-center text-[9px] font-bold uppercase tracking-wide text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-full hover:bg-amber-500/25 cursor-pointer"
                      >
                        Unverified Email
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleAccountSubmit} className="space-y-5" id="account-settings-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="account-inputs-grid">
                  <Input
                    id="account-full-name"
                    label="Full Name"
                    placeholder="e.g. Philip Shaba"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    id="account-display-name"
                    label="Display Username"
                    placeholder="e.g. PhilShaba"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <Input
                    id="account-email"
                    label="Primary Email Address"
                    type="email"
                    placeholder="e.g. PhilShaba96@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText="Primary communication endpoint for active vocal renders."
                  />
                  <Input
                    id="account-phone"
                    label="Phone Number"
                    placeholder="e.g. +1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    id="account-dob"
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Country / Region</label>
                    <select
                      id="account-country-select"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Time Zone</label>
                    <select
                      id="account-timezone-select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                      <option value="America/New_York (EST)">America/New_York (EST)</option>
                      <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                      <option value="Europe/Paris (CET)">Europe/Paris (CET)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Preferred Language</label>
                    <select
                      id="account-lang-select"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Español">Español</option>
                      <option value="Deutsch">Deutsch</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border" id="account-form-actions">
                  <Button
                    id="account-reset-btn"
                    variant="outline"
                    type="button"
                    onClick={() => handleResetSection('account')}
                  >
                    Reset Defaults
                  </Button>
                  <Button id="account-submit-btn" variant="primary" type="submit">
                    Save Account Settings
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ==========================================
              2. CO-AUTHOR PROFILE SETTINGS
              ========================================== */}
          {activeTab === 'profile' && (
            <div id="settings-panel-profile" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-profile-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-cinema-amber-500" /> Co-Author Profile Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage your identity mappings used inside compiled credits, citation footprints, and biography details.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5" id="profile-settings-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="profile-name-row">
                  <Input
                    id="co-author-first-name"
                    label="First Name"
                    placeholder="e.g. Philip"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    id="co-author-last-name"
                    label="Last Name"
                    placeholder="e.g. Shaba"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <Input
                  id="co-author-citation"
                  label="Default Document Citations Prefix"
                  placeholder="e.g. Vance Family Archive"
                  value={citations}
                  onChange={(e) => setCitations(e.target.value)}
                  helperText="Appended automatically to restored photos and certificates catalog cards."
                />

                <div className="space-y-1.5" id="bio-container">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Co-Author Biography</label>
                  <textarea
                    id="co-author-bio"
                    rows={4}
                    placeholder="Describe your genealogical background and archiving goals..."
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    className="w-full text-xs bg-muted/40 border border-border p-3 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-cinema-amber-500"
                  />
                  <p className="text-[10px] text-muted-foreground">This summary will be injected into story metadata credits.</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border" id="profile-form-actions">
                  <Button
                    id="profile-discard-btn"
                    variant="outline"
                    type="button"
                    onClick={() => handleResetSection('profile')}
                  >
                    Reset Defaults
                  </Button>
                  <Button id="profile-submit-btn" variant="primary" type="submit">
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ==========================================
              3. APPEARANCE & PERSONALIZATION
              ========================================== */}
          {activeTab === 'appearance' && (
            <div id="settings-panel-appearance" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-appearance-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-cinema-amber-500" /> Color Themes & Personalization
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure color theme preferences, transition aesthetics, text sizing, and compact view controls.
                </p>
              </div>

              <div className="space-y-6" id="appearance-form-rows">
                {/* Theme selection card */}
                <div className="space-y-2.5" id="appearance-theme-select-row">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Default Color Mode</label>
                  <div className="grid grid-cols-3 gap-4" id="color-mode-cards-grid">
                    {[
                      { id: 'light', label: 'Light Theme', desc: 'Crisp light-gray canvases.', icon: Sun },
                      { id: 'dark', label: 'Dark Mode', desc: 'Sleek, eye-safe midnight themes.', icon: Moon },
                      { id: 'system', label: 'System Theme', desc: 'Saves battery based on OS settings.', icon: Laptop },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isActive = theme === mode.id;

                      return (
                        <button
                          key={mode.id}
                          id={`btn-mode-card-${mode.id}`}
                          onClick={(e) => {
                            setTheme(mode.id as 'light' | 'dark' | 'system', e);
                            showToast('info', `Theme set to ${mode.label}`);
                          }}
                          className={`p-4 rounded-xl border text-left flex flex-col items-start gap-2.5 cursor-pointer hover:border-cinema-amber-500/50 transition-all ${
                            isActive
                              ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] text-cinema-amber-500'
                              : 'border-border/60 bg-card text-foreground'
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                          <div>
                            <span className="text-xs font-bold block">{mode.label}</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">{mode.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40" id="appearance-placeholders-row">
                  {/* Accent Swatches */}
                  <div className="space-y-2" id="pref-accent-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Accent Color (Placeholder)</label>
                    <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border border-border" id="accent-colors-swatch">
                      {[
                        { id: 'amber', color: 'bg-amber-500 border-amber-300' },
                        { id: 'emerald', color: 'bg-emerald-500 border-emerald-300' },
                        { id: 'sky', color: 'bg-sky-500 border-sky-300' },
                        { id: 'indigo', color: 'bg-indigo-500 border-indigo-300' },
                      ].map((accent) => (
                        <button
                          key={accent.id}
                          id={`accent-swatch-${accent.id}`}
                          onClick={() => {
                            setAccentColor(accent.id);
                            showToast('info', `Accent color placeholder updated to ${accent.id}`);
                          }}
                          className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${accent.color} ${accentColor === accent.id ? 'scale-115 ring-2 ring-cinema-amber-500/40' : 'opacity-70 hover:opacity-100'}`}
                          title={`${accent.id} Accent`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Sizing */}
                  <div className="space-y-2" id="pref-fontscale-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Text Font Scaling</label>
                    <select
                      id="font-scale-select"
                      value={fontScaling}
                      onChange={(e) => {
                        setFontScaling(e.target.value);
                        showToast('info', `Font scale configured to ${e.target.value}`);
                      }}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold outline-none focus:border-cinema-amber-500"
                    >
                      <option value="small">Small size (Default Compact)</option>
                      <option value="medium">Standard Cozy (14px baseline)</option>
                      <option value="large">Large visibility (Enhanced contrast)</option>
                    </select>
                  </div>

                  {/* Motion settings */}
                  <div className="space-y-2" id="pref-motion-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Animation Transitions</label>
                    <select
                      id="motion-select"
                      value={motionPref}
                      onChange={(e) => {
                        setMotionPref(e.target.value);
                        showToast('info', `Motion settings adjusted: ${e.target.value}`);
                      }}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold outline-none focus:border-cinema-amber-500"
                    >
                      <option value="smooth">Cinematic Smooth (Fades and staggered entrance)</option>
                      <option value="minimal">High Speed Minimal (Instant tab swaps)</option>
                    </select>
                  </div>

                  {/* Animation Intensity */}
                  <div className="space-y-2" id="pref-intensity-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Animation Intensity</label>
                    <select
                      id="anim-intensity-select"
                      value={animationIntensity}
                      onChange={(e) => {
                        setAnimationIntensity(e.target.value);
                        showToast('info', `Animation intensity set to ${e.target.value}`);
                      }}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold outline-none focus:border-cinema-amber-500"
                    >
                      <option value="gentle">Gentle (Subtle layout shifts)</option>
                      <option value="moderate">Moderate (Standard fluid shimmers)</option>
                      <option value="full">Full (High-fidelity spring motions)</option>
                    </select>
                  </div>

                  {/* Compact Mode Switch */}
                  <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10" id="compact-mode-toggle">
                    <div className="space-y-0.5 pr-6">
                      <span className="text-xs font-bold text-foreground block">Compact Interface Mode</span>
                      <span className="text-[10px] text-muted-foreground block">Reduce vertical paddings and margins for high density monitors.</span>
                    </div>
                    <button
                      id="btn-toggle-compact-mode"
                      onClick={() => {
                        setCompactMode(!compactMode);
                        showToast('info', `Compact Mode toggled to: ${!compactMode}`);
                      }}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${compactMode ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${compactMode ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border" id="appearance-save-row">
                  <Button
                    id="reset-appearance-btn"
                    variant="outline"
                    onClick={() => handleResetSection('appearance')}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    id="save-appearance-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Personalization Appearance')}
                  >
                    Save Personalization
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              4. WORKSPACE OPTIONS PANEL
              ========================================== */}
          {activeTab === 'workspace' && (
            <div id="settings-panel-workspace" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-workspace-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-cinema-amber-500" /> Workspace Configurations
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure default behaviors, sidebar opening states, utility panel docking, and element grids.
                </p>
              </div>

              <div className="space-y-5" id="workspace-form-rows">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="workspace-inputs-grid">
                  {/* Sidebar Behavior */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Sidebar Default State</label>
                    <select
                      id="sidebar-behavior-select"
                      value={sidebarBehavior}
                      onChange={(e) => {
                        setSidebarBehavior(e.target.value);
                        showToast('info', `Sidebar behavior adjusted to: ${e.target.value}`);
                      }}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="expanded">Expanded (Always display section labels)</option>
                      <option value="collapsed">Collapsed (Render icon rails only)</option>
                    </select>
                  </div>

                  {/* Right Panel docked behavior */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Right Panel Behavior</label>
                    <select
                      id="right-panel-behavior-select"
                      value={rightPanelBehavior}
                      onChange={(e) => setRightPanelBehavior(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="collapsible">Collapsible Drawer (Auto-closes on layout shrink)</option>
                      <option value="fixed">Fixed Panel (Pushes viewport boundaries)</option>
                    </select>
                  </div>

                  {/* Opening route */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Landing View Screen</label>
                    <select
                      id="default-view-select"
                      value={defaultView}
                      onChange={(e) => setDefaultView(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="dashboard">Cinematic Dashboard</option>
                      <option value="stories">Story Library</option>
                      <option value="profiles">Legacy Profiles</option>
                    </select>
                  </div>

                  {/* Card density config */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Memoir Card Density</label>
                    <select
                      id="card-density-select"
                      value={cardDensity}
                      onChange={(e) => setCardDensity(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="comfortable">Comfortable (Generous negative spaces)</option>
                      <option value="cozy">Cozy (Standard card titles)</option>
                      <option value="compact">Brutalist (Compact grid limits)</option>
                    </select>
                  </div>

                  {/* Table Density */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Table Row Spacing</label>
                    <select
                      id="table-density-select"
                      value={tableDensity}
                      onChange={(e) => setTableDensity(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="standard">Standard (44px vertical targets)</option>
                      <option value="dense">Dense (Compact excel lists)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border" id="workspace-save-row">
                  <Button
                    id="reset-workspace-btn"
                    variant="outline"
                    onClick={() => handleResetSection('workspace')}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    id="save-workspace-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Workspace Configurations')}
                  >
                    Save Workspace Prefs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              5. NOTIFICATION CHANNELS
              ========================================== */}
          {activeTab === 'notifications' && (
            <div id="settings-panel-notifications" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-notifications-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-cinema-amber-500" /> Notification Channels Preferences
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure real-time triggers, email compiled summaries, in-app bell indicators, and activity logs.
                </p>
              </div>

              <div className="space-y-4" id="notifications-settings-toggles">
                {[
                  {
                    id: 'emailDigest',
                    label: 'Send Email Digests',
                    desc: 'Monthly compiled memoirs summaries, download logs, and co-author contributions reports.',
                    state: emailDigest,
                    setter: setEmailDigest
                  },
                  {
                    id: 'inAppNotifs',
                    label: 'In-App Shimmer Signals',
                    desc: 'Display yellow indicator dots in the header bell whenever renders finish compiler queues.',
                    state: inAppNotifs,
                    setter: setInAppNotifs
                  },
                  {
                    id: 'weeklyReminders',
                    label: 'Weekly Archive Reminders',
                    desc: 'Suggestions for scan uploads or text-to-speech recordings to fill empty chronology years.',
                    state: weeklyReminders,
                    setter: setWeeklyReminders
                  },
                  {
                    id: 'securityLogs',
                    label: 'Workspace Security Warnings',
                    desc: 'Notify my primary email address whenever active logins occur from new devices.',
                    state: securityLogs,
                    setter: setSecurityLogs
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    id={`toggle-box-${item.id}`}
                    className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10"
                  >
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-xs font-bold text-foreground block">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground block leading-normal">{item.desc}</span>
                    </div>
                    <button
                      id={`btn-toggle-${item.id}`}
                      onClick={() => {
                        item.setter(!item.state);
                        showToast('info', `${item.label} updated.`);
                      }}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${item.state ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${item.state ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4 border-t border-border" id="notifications-save-row">
                  <Button
                    id="reset-notifications-btn"
                    variant="outline"
                    onClick={() => handleResetSection('notifications')}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    id="save-notifications-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Notifications Settings')}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              6. ACCESSIBILITY PANEL
              ========================================== */}
          {activeTab === 'accessibility' && (
            <div id="settings-panel-accessibility" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-accessibility-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-cinema-amber-500" /> Accessibility Options
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Tune compliance parameters, contrast overlays, focus visibility rings, and screen-readers markers.
                </p>
              </div>

              <div className="space-y-4" id="accessibility-settings-toggles">
                {[
                  {
                    id: 'highContrast',
                    label: 'High Contrast Mode',
                    desc: 'Swap subtle layout border lines for high contrast thick charcoal solids.',
                    state: highContrast,
                    setter: setHighContrast
                  },
                  {
                    id: 'reducedMotion',
                    label: 'Reduced Motion Settings',
                    desc: 'Disable sliding menus and heavy loading shimmers for absolute static simplicity.',
                    state: reducedMotion,
                    setter: setReducedMotion
                  },
                  {
                    id: 'keyboardNav',
                    label: 'WCAG Keyboard Navigation Guides',
                    desc: 'Inforce strict logical tab sequencing across overlays and profile modal panels.',
                    state: keyboardNav,
                    setter: setKeyboardNav
                  },
                  {
                    id: 'screenReader',
                    label: 'Enhanced Talkback Tagging',
                    desc: 'Auto-inject descriptive alt texts on historical photo restorations.',
                    state: screenReader,
                    setter: setScreenReader
                  },
                  {
                    id: 'focusVisibility',
                    label: 'Thicker Input Focus Outlines',
                    desc: 'Render high contrast borders surrounding the currently focused button elements.',
                    state: focusVisibility,
                    setter: setFocusVisibility
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    id={`accessibility-toggle-box-${item.id}`}
                    className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10"
                  >
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-xs font-bold text-foreground block">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground block leading-normal">{item.desc}</span>
                    </div>
                    <button
                      id={`btn-accessibility-toggle-${item.id}`}
                      onClick={() => {
                        item.setter(!item.state);
                        showToast('info', `${item.label} adjusted.`);
                      }}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${item.state ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${item.state ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4 border-t border-border" id="accessibility-save-row">
                  <Button
                    id="reset-accessibility-btn"
                    variant="outline"
                    onClick={() => handleResetSection('accessibility')}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    id="save-accessibility-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Accessibility Preferences')}
                  >
                    Save Accessibility
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              7. PRIVACY & SHARING
              ========================================== */}
          {activeTab === 'privacy' && (
            <div id="settings-panel-privacy" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-privacy-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cinema-amber-500" /> Privacy Shield & Permissions
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage database visibility indexes, declassified archives safety modes, and telemetry triggers.
                </p>
              </div>

              <div className="space-y-5" id="privacy-form-rows">
                <div className="space-y-4" id="privacy-settings-toggles">
                  {/* Share Analytics */}
                  <div className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10" id="toggle-box-analytics">
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-xs font-bold text-foreground block">Share Anonymous Compiler Analytics</span>
                      <span className="text-[11px] text-muted-foreground block leading-normal">
                        Submit processing times and audio render lengths to help optimize ReelLegacy pipeline clusters.
                      </span>
                    </div>
                    <button
                      id="btn-toggle-analytics"
                      onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${analyticsEnabled ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${analyticsEnabled ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>

                  {/* Cloud AI sync */}
                  <div className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10" id="toggle-box-datashare">
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-xs font-bold text-foreground block">Third-Party AI Transcription Sync</span>
                      <span className="text-[11px] text-muted-foreground block leading-normal">
                        Allows secure third-party synthesis modules to process voice letters to help construct biography details.
                      </span>
                    </div>
                    <button
                      id="btn-toggle-datashare"
                      onClick={() => setDataSharing(!dataSharing)}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${dataSharing ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${dataSharing ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                </div>

                {/* Profile Visibility */}
                <div className="space-y-3 pt-2" id="pref-profile-visibility-box">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Default Archives Visibility</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="profile-visibility-options-grid">
                    {[
                      { id: 'private', label: 'Invite-Only Private Archive', desc: 'Secure encryption parameters. Shared family co-authors must log in.' },
                      { id: 'public', label: 'Public Shared Link Access', desc: 'Allows sharing unique, read-only browser links of documentaries with relatives.' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        id={`btn-visibility-mode-${mode.id}`}
                        onClick={() => {
                          setProfileVisibility(mode.id);
                          showToast('info', `Archival visibility set to: ${mode.label}`);
                        }}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${
                          profileVisibility === mode.id
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.02]'
                            : 'border-border/50 hover:bg-muted/40'
                        }`}
                      >
                        <span className="text-xs font-bold text-foreground block">{mode.label}</span>
                        <span className="text-[10px] text-muted-foreground block leading-normal mt-1">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Visibility options */}
                <div className="space-y-2" id="search-visibility-container">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Search Index Visibility</label>
                  <select
                    id="search-visibility-select"
                    value={searchVisibility}
                    onChange={(e) => setSearchVisibility(e.target.value)}
                    className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                  >
                    <option value="hidden">Hidden from global workspace search queries (Strict Private)</option>
                    <option value="visible">Allow co-author search references to indexed legacy documents</option>
                  </select>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border" id="privacy-save-row">
                  <Button
                    id="reset-privacy-btn"
                    variant="outline"
                    onClick={() => handleResetSection('privacy')}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    id="save-privacy-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Privacy Settings')}
                  >
                    Save Privacy Prefs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              8. SECURITY & KEYS PANEL
              ========================================== */}
          {activeTab === 'security' && (
            <div id="settings-panel-security" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-security-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cinema-amber-500" /> Security, Passwords & Devices
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Change passwords, enable multi-factor protections, review active login sessions, and trusted browsers list.
                </p>
              </div>

              <div className="space-y-6" id="security-content">
                
                {/* 2FA Toggle Banner */}
                <div className="p-5 border border-border bg-muted/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="two-factor-banner">
                  <div className="space-y-1.5 max-w-md">
                    <span className="inline-flex items-center text-[9px] uppercase tracking-wide font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/15">
                      Recommended security
                    </span>
                    <h4 className="text-sm font-bold text-foreground">Two-Factor Authenticated Protective Keys</h4>
                    <p className="text-xs text-muted-foreground">
                      Confirm active co-author login credentials using mobile security codes to protect biographical documents from leakage.
                    </p>
                    {twoFactorEnabled && (
                      <p className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Recovery Codes Generated: {backupCodesLeft} remaining
                      </p>
                    )}
                  </div>
                  <Button
                    id="toggle-2fa-btn"
                    variant={twoFactorEnabled ? 'secondary' : 'accent'}
                    size="sm"
                    onClick={handleToggle2FA}
                  >
                    {twoFactorEnabled ? 'Disable 2FA Protection' : 'Configure 2FA Protection'}
                  </Button>
                </div>

                {/* Password update form */}
                <div className="border border-border p-5 bg-card/50 rounded-2xl space-y-4" id="password-form-container">
                  <div className="flex items-center justify-between pb-2 border-b border-border" id="pass-header">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-cinema-amber-500" /> Password Management
                    </span>
                    {!showPasswordFields && (
                      <button 
                        id="show-password-form-btn"
                        onClick={() => setShowPasswordFields(true)}
                        className="text-xs text-cinema-amber-500 font-semibold cursor-pointer"
                      >
                        Change Password
                      </button>
                    )}
                  </div>

                  {showPasswordFields ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4" id="update-password-form">
                      <Input
                        id="current-password-input"
                        label="Current Password"
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          id="new-password-input"
                          label="New Password"
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Input
                          id="confirm-password-input"
                          label="Confirm New Password"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          id="cancel-pass-btn" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setShowPasswordFields(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button id="submit-pass-btn" variant="primary" size="sm" type="submit">
                          Update Password
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Passwords are required to follow minimum character lengths and contain uppercase alphabets, numeric values, and special marks.
                    </p>
                  )}
                </div>

                {/* Active Sessions list */}
                <div className="border border-border rounded-2xl overflow-hidden bg-card" id="active-sessions-table-card">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Active Co-Author Browser Sessions
                    </span>
                    <span className="text-[10px] text-muted-foreground italic font-mono">Current IP: 192.168.1.104</span>
                  </div>
                  
                  <div className="divide-y divide-border" id="sessions-table-list">
                    {sessions.map((sess) => (
                      <div key={sess.id} id={`session-row-${sess.id}`} className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted border border-border/80 flex items-center justify-center text-muted-foreground">
                            {sess.device === 'iPhone 15' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">{sess.browser} on {sess.device}</span>
                              {sess.isCurrent && (
                                <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                                  Current Session
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground block mt-0.5">{sess.location} • {sess.ip}</span>
                          </div>
                        </div>

                        {!sess.isCurrent ? (
                          <button
                            id={`revoke-session-btn-${sess.id}`}
                            onClick={() => handleRevokeSession(sess.id)}
                            className="text-xs text-red-500 hover:underline cursor-pointer font-semibold"
                          >
                            Revoke Device
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-mono">{sess.time}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connected Devices hardware details */}
                <div className="border border-border rounded-2xl overflow-hidden bg-card" id="hardware-devices-card">
                  <div className="p-4 border-b border-border bg-muted/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Trusted Devices Hardware Register
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {devices.map((device) => (
                      <div key={device.id} id={`device-row-${device.id}`} className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted border border-border/80 flex items-center justify-center text-muted-foreground">
                            {device.type === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">{device.name}</span>
                            <span className="text-[11px] text-muted-foreground block mt-0.5">{device.os}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            device.status === 'online' 
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' 
                              : 'bg-muted text-muted-foreground border border-border'
                          }`}>
                            {device.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">{device.lastActive}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              9. STORAGE & SYSTEM INFORMATION
              ========================================== */}
          {activeTab === 'storage' && (
            <div id="settings-panel-storage" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-storage-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-cinema-amber-500" /> Storage Capacity & Statistics
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Inspect estimated storage usage, active archives breakdown of photos and narrations, and system statistics.
                </p>
              </div>

              <div className="space-y-6" id="storage-details">
                {/* Visual Storage Meter */}
                <div className="border border-border p-6 bg-muted/10 rounded-2xl space-y-4" id="storage-meter-card">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">Estimated Storage Utilization</span>
                    <span className="text-cinema-amber-500 font-mono">{totalEstimatedSize} / 15.00 GB Used ({percentUsed}%)</span>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-3 bg-muted border border-border rounded-full overflow-hidden flex" id="storage-meter-bar">
                    <div className="h-full bg-amber-500" style={{ width: `${Math.max(1.5, percentUsed * 0.35)}%` }} title="Photos" />
                    <div className="h-full bg-red-500" style={{ width: `${Math.max(1.5, percentUsed * 0.45)}%` }} title="Videos" />
                    <div className="h-full bg-indigo-500" style={{ width: `${Math.max(1.5, percentUsed * 0.15)}%` }} title="Audio" />
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.max(1.5, percentUsed * 0.05)}%` }} title="Documents" />
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted-foreground" id="storage-swatch-indicators">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded" />
                      <span>Photos ({photosSize})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded" />
                      <span>Videos ({videosSize})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded" />
                      <span>Audio ({vocalSize})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded" />
                      <span>Documents ({docsSize})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-muted-foreground/30 rounded" />
                      <span>Free Space ({freeSize})</span>
                    </div>
                  </div>
                </div>

                {/* Categories Sizing table */}
                <div className="border border-border rounded-2xl overflow-hidden bg-card" id="sizing-breakdown-card">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Storage Breakdown Register
                    </span>
                    <button 
                      id="refresh-storage-btn"
                      onClick={() => {
                        recalculateStorageStats();
                        showToast('success', 'Recalculating directory sizes...', 'Memory scans complete.');
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Sync Storage sizes"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-border" id="storage-grid-breakdown">
                    {storageBreakdown.map((row) => (
                      <div key={row.name} id={`storage-item-${row.name}`} className="p-4 flex items-center justify-between text-xs hover:bg-muted/10">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                          <span className="font-bold text-foreground">{row.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground font-semibold">
                          <span>{row.count}</span>
                          <span className="font-mono text-foreground font-bold">{row.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Information lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="system-stats-grid">
                  <div className="border border-border p-5 bg-card/40 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Historical Archives Volume</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Total Uploaded files</span>
                        <span className="font-bold text-foreground text-sm">{photosCount + videosCount + vocalCount + docsCount} Files</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Active Legacy Profiles</span>
                        <span className="font-bold text-foreground text-sm">{profilesCount} Subjects</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border p-5 bg-card/40 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cloud Synchronizer Status</h4>
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Google Drive sync path</span>
                        <span className="font-semibold text-emerald-500 font-mono">CONNECTED</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Last synced: Today, 09:12 AM</span>
                    </div>
                  </div>
                </div>

                {/* Storage Management Actions */}
                <div className="border border-red-500/10 p-5 bg-red-500/[0.02] rounded-2xl space-y-4" id="storage-destructive-actions">
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Storage Management & Maintenance
                  </h4>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Perform system maintenance, discard temporary thumbnail renders, clear memory caches, or perform a complete wipe of the local workspace.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <Button
                      id="clear-cache-btn"
                      variant="outline"
                      onClick={handleClearCache}
                      className="text-xs"
                    >
                      Clear Cache
                    </Button>
                    <Button
                      id="clear-temp-btn"
                      variant="outline"
                      onClick={handleClearTemporaryFiles}
                      className="text-xs"
                    >
                      Clear Temp Files
                    </Button>
                    <Button
                      id="reset-local-db-btn"
                      variant="secondary"
                      onClick={handleResetLocalDatabase}
                      className="text-xs text-red-500 border-red-500/20 hover:bg-red-500/10"
                    >
                      Reset Local Database
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              Playback & Video Panel
              ========================================== */}
          {activeTab === 'playback' && (
            <div id="settings-panel-playback" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-playback-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-cinema-amber-500" /> Playback & Video Preferences
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust standard quality parameters, autoplay settings, default volume, and transition velocities.
                </p>
              </div>

              <div className="space-y-6" id="playback-content">
                <div className="space-y-4">
                  {/* Default Preview Quality */}
                  <div className="space-y-2" id="playback-quality-box">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Default Video Quality</label>
                    <select
                      id="playback-quality-select"
                      value={playbackQuality}
                      onChange={(e) => setPlaybackQuality(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold font-sans focus:outline-hidden focus:border-cinema-amber-500/50"
                    >
                      <option value="auto">Auto (Balanced with network bandwidth)</option>
                      <option value="high">High Quality (1080p, Full fidelity)</option>
                      <option value="medium">Medium Quality (720p, Optimized)</option>
                      <option value="low">Low Quality (480p, Data saver)</option>
                    </select>
                  </div>

                  {/* Transition Speed */}
                  <div className="space-y-2" id="playback-transition-box">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Transition Velocity</label>
                    <select
                      id="playback-transition-select"
                      value={playbackTransitionSpeed}
                      onChange={(e) => setPlaybackTransitionSpeed(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold font-sans focus:outline-hidden focus:border-cinema-amber-500/50"
                    >
                      <option value="instant">Instant (No delay, immediate cuts)</option>
                      <option value="fast">Fast (0.2s quick crossfades)</option>
                      <option value="normal">Normal (0.5s standard pacing)</option>
                      <option value="slow">Slow (1.2s atmospheric dissolves)</option>
                    </select>
                  </div>

                  {/* Toggles */}
                  {[
                    {
                      id: 'playbackAutoplay',
                      label: 'Autoplay Preview Video Loops',
                      desc: 'Automatically play documentary clips when hovering over library cards.',
                      state: playbackAutoplay,
                      setter: setPlaybackAutoplay
                    },
                    {
                      id: 'playbackMuteByDefault',
                      label: 'Mute Audio Narrations By Default',
                      desc: 'Always load rendering preview modules in mute state. Volume controls remain manual.',
                      state: playbackMuteByDefault,
                      setter: setPlaybackMuteByDefault
                    }
                  ].map((item) => (
                    <div
                      key={item.id}
                      id={`playback-toggle-box-${item.id}`}
                      className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10"
                    >
                      <div className="space-y-1 pr-6 flex-1">
                        <span className="text-xs font-bold text-foreground block">{item.label}</span>
                        <span className="text-[11px] text-muted-foreground block leading-normal">{item.desc}</span>
                      </div>
                      <button
                        id={`btn-playback-toggle-${item.id}`}
                        onClick={() => {
                          item.setter(!item.state);
                          showToast('info', `${item.label} adjusted.`);
                        }}
                        className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${item.state ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                      >
                        <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${item.state ? 'right-0.75' : 'left-0.75'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border" id="playback-save-row">
                  <Button
                    id="reset-playback-btn"
                    variant="outline"
                    onClick={() => handleResetSection('playback')}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    id="save-playback-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Playback Settings')}
                  >
                    Save Playback Prefs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              Keyboard Shortcuts Panel
              ========================================== */}
          {activeTab === 'shortcuts' && (
            <div id="settings-panel-shortcuts" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-shortcuts-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-cinema-amber-500" /> Keyboard Shortcuts & Navigation Bindings
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Speed up documentary curation, timeline editing, and audio clips manipulation using standard keyboard hotkeys.
                </p>
              </div>

              <div className="space-y-4" id="shortcuts-content">
                <div className="border border-border rounded-2xl overflow-hidden bg-card">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Command Action</th>
                        <th className="p-3">Hotkey Binding</th>
                        <th className="p-3">Context Scope</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { action: 'Play / Pause Video', binding: 'Space', scope: 'Media & Playback' },
                        { action: 'Toggle Sidebar Menu', binding: 'Ctrl + B', scope: 'Workspace Shell' },
                        { action: 'New Legacy Profile', binding: 'Ctrl + N', scope: 'Profiles Page' },
                        { action: 'Quick Timeline Zoom In', binding: '+', scope: 'Timeline Curation' },
                        { action: 'Quick Timeline Zoom Out', binding: '-', scope: 'Timeline Curation' },
                        { action: 'Toggle Fullscreen Player', binding: 'F', scope: 'Preview Player' },
                        { action: 'Declassify Document Draft', binding: 'Ctrl + S', scope: 'Editor Workspace' }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="p-3 font-semibold text-foreground">{item.action}</td>
                          <td className="p-3">
                            <kbd className="px-2 py-1 bg-muted border border-border/80 rounded font-mono font-bold text-[10px] text-foreground shadow-xs">
                              {item.binding}
                            </kbd>
                          </td>
                          <td className="p-3 text-muted-foreground italic">{item.scope}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-muted/10 border border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Custom hotkey re-mapping is currently in development.</span>
                  <span className="text-[10px] uppercase font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-2.5 py-0.5 rounded border border-cinema-amber-500/15">Coming Soon</span>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              Workspace Integrations Panel
              ========================================== */}
          {activeTab === 'integrations' && (
            <div id="settings-panel-integrations" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-integrations-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-cinema-amber-500" /> External Workspace Integrations
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect cloud repositories to backing storage adapters for automatic secondary file backups and biographical imports.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="integrations-grid">
                {[
                  {
                    name: 'Google Drive Sync',
                    desc: 'Store parallel photographic backups and declassified documentation directly in your Google cloud.',
                    status: 'Connected',
                    connected: true,
                    info: 'PhilShaba96@gmail.com'
                  },
                  {
                    name: 'Microsoft OneDrive Adapter',
                    desc: 'Synchronize timeline event transcripts and family biographical records to personal Microsoft archives.',
                    status: 'Disconnected',
                    connected: false,
                    info: 'Inactive'
                  },
                  {
                    name: 'Dropbox Personal Archives',
                    desc: 'Import batch audio narrations and legacy media scans immediately from target dropbox workspace folders.',
                    status: 'Disconnected',
                    connected: false,
                    info: 'Inactive'
                  },
                  {
                    name: 'Ancestry.com Data Connector',
                    desc: 'Pull genetic maps, historical birth indexes, and census records to help populate subject chronologies.',
                    status: 'Development Draft',
                    connected: false,
                    info: 'Sandbox API Only'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border border-border rounded-2xl p-5 bg-card/60 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${
                          item.connected 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : item.status === 'Disconnected'
                            ? 'bg-muted text-muted-foreground border-border'
                            : 'bg-cinema-amber-500/10 text-cinema-amber-500 border-cinema-amber-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <span className="text-[10px] text-muted-foreground font-mono">{item.info}</span>
                      <Button
                        id={`btn-integration-connect-${idx}`}
                        variant={item.connected ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          showToast('info', `${item.name} connection triggered. Since cloud sync is local-only in this stage, this acts as a development preview.`);
                        }}
                      >
                        {item.connected ? 'Configure Connection' : 'Establish Connection'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              10. ABOUT REELLEGACY
              ========================================== */}
          {activeTab === 'about' && (
            <div id="settings-panel-about" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-about-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-cinema-amber-500" /> About ReelLegacy Studio
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Product information, license specifications, release channels, and credits logs.
                </p>
              </div>

              <div className="space-y-6" id="about-content">
                {/* Visual Cover card for About */}
                <div className="bg-gradient-to-br from-cinema-slate-900 via-cinema-slate-800 to-cinema-slate-950 text-white rounded-2xl p-6 border border-cinema-slate-800 text-center space-y-4" id="about-jumbotron">
                  <div className="w-12 h-12 rounded-xl bg-logo-tile-bg/15 border border-cinema-amber-500/20 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-cinema-amber-500 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-xl font-bold tracking-tight">ReelLegacy Studio</h4>
                    <p className="text-xs text-cinema-slate-400">
                      Preserving human memory and family histories via automated generative cinema.
                    </p>
                  </div>
                </div>

                {/* Details list info */}
                <div className="border border-border rounded-2xl overflow-hidden bg-card" id="build-details-card">
                  <div className="p-4 border-b border-border bg-muted/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Software Build Information
                    </span>
                  </div>
                  
                  <div className="divide-y divide-border text-xs">
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold">Active Version</span>
                      <span className="font-bold text-foreground">v0.1.0</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold">Build Number</span>
                      <span className="font-mono text-foreground">2026.07.13.04</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold">Release Channel</span>
                      <span className="font-semibold text-cinema-amber-500 uppercase tracking-wide">Developer Early Access</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold">Software License</span>
                      <span className="text-foreground">Apache License 2.0 (Open Source Notices)</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold">Workspace Credits</span>
                      <span className="text-foreground font-semibold">ReelLegacy geneologists, historians & engineers</span>
                    </div>
                  </div>
                </div>

                {/* Changelog register */}
                <div className="border border-border p-5 rounded-2xl bg-card space-y-3" id="changelog-container">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wide block">Recent Changelog (Placeholder)</span>
                  <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="font-mono font-bold text-cinema-amber-500 shrink-0">v0.1.0</span>
                      <div>
                        <span className="font-bold text-foreground block">Workspace Settings & Navigation Polish</span>
                        <span className="text-[11px] block mt-0.5">Built modular preferences, added high contrast toggles and synchronized layout headers.</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/40">
                      <span className="font-mono font-bold text-cinema-amber-500 shrink-0">v0.0.9</span>
                      <div>
                        <span className="font-bold text-foreground block">Custom Soundboard Restorations</span>
                        <span className="text-[11px] block mt-0.5">Mapped custom voice capture synthesizers, added WAV parallel file uploads loader.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs font-bold text-cinema-amber-500" id="useful-links-strip">
                  <a href="#docs" className="p-3 border border-border/80 bg-card rounded-xl hover:bg-muted hover:border-cinema-amber-500/20 transition-all">
                    Documentation
                  </a>
                  <a href="#support" className="p-3 border border-border/80 bg-card rounded-xl hover:bg-muted hover:border-cinema-amber-500/20 transition-all">
                    Archivist Support
                  </a>
                  <a href="#privacy" className="p-3 border border-border/80 bg-card rounded-xl hover:bg-muted hover:border-cinema-amber-500/20 transition-all col-span-2 sm:col-span-1">
                    Privacy Shield
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
