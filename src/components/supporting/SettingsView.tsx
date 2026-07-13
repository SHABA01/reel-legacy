/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
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
  Sliders
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type SettingsTab = 'profile' | 'appearance' | 'workspace' | 'notifications' | 'accessibility' | 'privacy';

export function SettingsView() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Co-Author Settings Form State
  const [firstName, setFirstName] = useState(user?.firstName || 'Philip');
  const [lastName, setLastName] = useState(user?.lastName || 'Shaba');
  const [email, setEmail] = useState(user?.email || 'PhilShaba96@gmail.com');
  const [citations, setCitations] = useState('');

  // 1. Preferences - Appearance State
  const [accentColor, setAccentColor] = useState('amber');
  const [fontScaling, setFontScaling] = useState('medium');
  const [motionPref, setMotionPref] = useState('smooth');

  // 2. Preferences - Workspace State
  const [sidebarBehavior, setSidebarBehavior] = useState('expanded');
  const [defaultView, setDefaultView] = useState('dashboard');
  const [inspectorBehavior, setInspectorBehavior] = useState('floating');
  const [cardDensity, setCardDensity] = useState('cozy');
  const [tableDensity, setTableDensity] = useState('standard');

  // 3. Preferences - Notifications State
  const [emailDigest, setEmailDigest] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [weeklyReminders, setWeeklyReminders] = useState(false);
  const [activityLogs, setActivityLogs] = useState(true);

  // 4. Preferences - Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [screenReader, setScreenReader] = useState(false);
  const [focusVisibility, setFocusVisibility] = useState(true);

  // 5. Preferences - Privacy State
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('private');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profile updated successfully!', 'Your co-author credentials have been safely committed.');
  };

  const handleSavePreferences = (preferenceCategory: string) => {
    showToast('success', `${preferenceCategory} updated`, 'Preferences stored in memory local configurations.');
  };

  const tabs = [
    { id: 'profile', label: 'Co-Author Profile', icon: User, desc: 'Manage your name, citations, and roles.' },
    { id: 'appearance', label: 'Appearance', icon: Paintbrush, desc: 'Tweak themes, scales, and accents.' },
    { id: 'workspace', label: 'Workspace Options', icon: LayoutGrid, desc: 'Sidebar defaults, density structures.' },
    { id: 'notifications', label: 'Notifications', icon: BellRing, desc: 'Email digests, warnings, reminders.' },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility, desc: 'High-contrast, screen reader tools.' },
    { id: 'privacy', label: 'Privacy & Sharing', icon: ShieldAlert, desc: 'Manage metrics and archive access.' },
  ];

  return (
    <div id="settings-view-root" className="space-y-6 animate-fade-in text-foreground pb-12">
      {/* Title Header */}
      <div id="settings-view-title-card" className="border-b border-border pb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight">System & Preferences Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your co-author workspace identity, theme configurations, accessibility, and visual density.
        </p>
      </div>

      {/* Settings layout: sidebar nav + main forms card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" id="settings-grid-layout">
        {/* Left tabs menu selection rail */}
        <div className="space-y-1 lg:col-span-1 border border-border p-4 rounded-2xl bg-card" id="settings-navigation-rail">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`btn-tab-setting-${tab.id}`}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 font-semibold'
                    : 'border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TabIcon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-cinema-amber-500' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <div className="truncate">
                    <span className="text-xs font-bold block">{tab.label}</span>
                    <span className="text-[10px] text-muted-foreground/80 font-medium block truncate mt-0.5">{tab.desc}</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Right Settings body cards wrapper */}
        <div className="lg:col-span-3 border border-border p-6 md:p-8 bg-card rounded-2xl shadow-xs" id="settings-panels-container">
          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <div id="settings-panel-profile" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-profile-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-cinema-amber-500" /> Co-Author Profile Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Manage your identity mappings used inside compiled credits and citation footprints.</p>
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
                  id="co-author-email"
                  label="Email Address"
                  type="email"
                  placeholder="e.g. phil@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={citations}
                  onChange={(e) => setCitations(e.target.value)}
                  helperText="Appended automatically to restored photos and certificates catalog cards."
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-border" id="profile-form-actions">
                  <Button
                    id="profile-discard-btn"
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      setFirstName(user?.firstName || 'Philip');
                      setLastName(user?.lastName || 'Shaba');
                      setEmail(user?.email || 'PhilShaba96@gmail.com');
                      setCitations('');
                      showToast('info', 'Form input restored.');
                    }}
                  >
                    Discard Changes
                  </Button>
                  <Button id="profile-submit-btn" variant="primary" type="submit">
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* APPEARANCE PANEL */}
          {activeTab === 'appearance' && (
            <div id="settings-panel-appearance" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-appearance-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-cinema-amber-500" /> Color Themes & Appearance
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Configure your workspace palette preferences, transitions, and text sizes.</p>
              </div>

              <div className="space-y-6" id="appearance-form-rows">
                {/* 1. Light/Dark/System Theme Selection */}
                <div className="space-y-2.5" id="appearance-theme-select-row">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Color Mode</label>
                  <div className="grid grid-cols-3 gap-4" id="color-mode-cards-grid">
                    {[
                      { id: 'light', label: 'Light Theme', desc: 'Crisp light-gray canvases.', icon: Sun },
                      { id: 'dark', label: 'Dark Mode', desc: 'Sleek, eye-safe midnight themes.', icon: Moon },
                      { id: 'system', label: 'System Theme', desc: 'Saves battery based on OS preferences.', icon: Laptop },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isActive = theme === mode.id;

                      return (
                        <button
                          key={mode.id}
                          id={`btn-mode-card-${mode.id}`}
                          onClick={(e) => {
                            setTheme(mode.id as 'light' | 'dark' | 'system', e);
                          }}
                          className={`p-4 rounded-xl border text-left flex flex-col items-start gap-2.5 cursor-pointer hover:border-cinema-amber-500/50 transition-colors ${
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

                {/* 2. Future Placeholder Options (Accent Color, Font Scaling, Motion) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40" id="appearance-placeholders-row">
                  {/* Accent Color Preference */}
                  <div className="space-y-2" id="pref-accent-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Accent Accent Color</label>
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
                            showToast('info', `Changed accent color placeholder to ${accent.id}`);
                          }}
                          className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${accent.color} ${accentColor === accent.id ? 'scale-115 ring-2 ring-cinema-amber-500/40' : 'opacity-70 hover:opacity-100'}`}
                          title={`${accent.id} Accent`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Scaling Preference */}
                  <div className="space-y-2" id="pref-fontscale-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Text Font Scaling</label>
                    <select
                      id="font-scale-select"
                      value={fontScaling}
                      onChange={(e) => {
                        setFontScaling(e.target.value);
                        showToast('info', `Font scaling placeholder changed to ${e.target.value}`);
                      }}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold outline-none focus:border-cinema-amber-500"
                    >
                      <option value="small">Small size (Default Compact)</option>
                      <option value="medium">Standard Cozy (14px baseline)</option>
                      <option value="large">Large visibility (Enhanced contrast)</option>
                    </select>
                  </div>

                  {/* Motion Preferences */}
                  <div className="space-y-2 md:col-span-2" id="pref-motion-container">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Animations Transitions</label>
                    <div className="grid grid-cols-2 gap-4" id="motion-preferences-grid">
                      {[
                        { id: 'smooth', label: 'Cinematic Smooth', desc: 'Staggered item entries and fade shimmers.' },
                        { id: 'minimal', label: 'High Speed Minimal', desc: 'No-shimmer, instant tab renderings.' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          id={`btn-motion-${item.id}`}
                          onClick={() => {
                            setMotionPref(item.id);
                            showToast('info', `Motion settings: ${item.label}`);
                          }}
                          className={`p-3 border rounded-xl text-left cursor-pointer transition-colors ${
                            motionPref === item.id 
                              ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.02]' 
                              : 'border-border/50 hover:bg-muted/40'
                          }`}
                        >
                          <span className="text-xs font-bold text-foreground block">{item.label}</span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border" id="appearance-save-row">
                  <Button
                    id="save-appearance-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Appearance Prefs')}
                  >
                    Save Appearance
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* WORKSPACE PANEL */}
          {activeTab === 'workspace' && (
            <div id="settings-panel-workspace" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-workspace-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-cinema-amber-500" /> Workspace Configurations
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Configure default panels, sidebar expansion, and table/grid element densities.</p>
              </div>

              <div className="space-y-5" id="workspace-form-rows">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="workspace-inputs-grid">
                  {/* Sidebar behavior */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sidebar Default State</label>
                    <select
                      id="sidebar-behavior-select"
                      value={sidebarBehavior}
                      onChange={(e) => setSidebarBehavior(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="expanded">Expanded (Always Show Titles)</option>
                      <option value="collapsed">Collapsed (Icon Icons Only)</option>
                    </select>
                  </div>

                  {/* Default opening view */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Dashboard Screen</label>
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

                  {/* Card density setting */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Memoir Card Density</label>
                    <select
                      id="card-density-select"
                      value={cardDensity}
                      onChange={(e) => setCardDensity(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="comfortable">Comfortable (Generous Margins)</option>
                      <option value="cozy">Cozy (Compact Titles)</option>
                      <option value="compact">Brutalist (Extreme Negative Space)</option>
                    </select>
                  </div>

                  {/* Table density setting */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Table Row Spacing</label>
                    <select
                      id="table-density-select"
                      value={tableDensity}
                      onChange={(e) => setTableDensity(e.target.value)}
                      className="w-full text-xs bg-muted/40 border border-border p-2.5 rounded-xl text-foreground font-semibold"
                    >
                      <option value="standard">Standard (44px target sizes)</option>
                      <option value="dense">High density (Excel grids)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border" id="workspace-save-row">
                  <Button
                    id="save-workspace-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Workspace Preferences')}
                  >
                    Save Workspace Prefs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS PANEL */}
          {activeTab === 'notifications' && (
            <div id="settings-panel-notifications" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-notifications-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-cinema-amber-500" /> Notification Channels Preferences
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Configure email alerts, in-app channels, activity logs, and compilation summaries.</p>
              </div>

              <div className="space-y-4" id="notifications-settings-toggles">
                {[
                  {
                    id: 'emailDigest',
                    label: 'Send Email Digests',
                    desc: 'Monthly compiled memoirs reports, download status indicators and co-author logs.',
                    state: emailDigest,
                    setter: setEmailDigest
                  },
                  {
                    id: 'inAppNotifs',
                    label: 'In-App Shimmer Signals',
                    desc: 'Real-time bells flashing inside workspace header on render compile achievements.',
                    state: inAppNotifs,
                    setter: setInAppNotifs
                  },
                  {
                    id: 'weeklyReminders',
                    label: 'Weekly Archive Reminders',
                    desc: 'Polite notifications suggesting additional declassified scans for timeline chronologies.',
                    state: weeklyReminders,
                    setter: setWeeklyReminders
                  },
                  {
                    id: 'activityLogs',
                    label: 'Workspace Security Logs',
                    desc: 'Notify me when co-author logins occur from unfamiliar browsers or devices.',
                    state: activityLogs,
                    setter: setActivityLogs
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
                    {/* Toggle Button */}
                    <button
                      id={`btn-toggle-${item.id}`}
                      onClick={() => {
                        item.setter(!item.state);
                        showToast('info', `${item.label} toggle initialized.`);
                      }}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${item.state ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${item.state ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                ))}

                <div className="flex justify-end pt-4 border-t border-border" id="notifications-save-row">
                  <Button
                    id="save-notifications-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Notifications channels')}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY PANEL */}
          {activeTab === 'accessibility' && (
            <div id="settings-panel-accessibility" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-accessibility-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-cinema-amber-500" /> Accessibility & Navigation
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Configure screen-reader assistance, keyboard focus settings, high-contrast assets.</p>
              </div>

              <div className="space-y-4" id="accessibility-settings-toggles">
                {[
                  {
                    id: 'highContrast',
                    label: 'High Contrast Mode',
                    desc: 'Bypasses subtle grays for pure solid borders and maximum black/white text ratios.',
                    state: highContrast,
                    setter: setHighContrast
                  },
                  {
                    id: 'reducedMotion',
                    label: 'Reduced Motion Settings',
                    desc: 'Disables parallax scrolling, slide-outs, and heavy loading shimmers for static grids.',
                    state: reducedMotion,
                    setter: setReducedMotion
                  },
                  {
                    id: 'keyboardNav',
                    label: 'Enhanced Keyboard Navigation',
                    desc: 'Ensures absolute compliance with WCAG ARIA keyboard mapping across overlays.',
                    state: keyboardNav,
                    setter: setKeyboardNav
                  },
                  {
                    id: 'screenReader',
                    label: 'Screen Reader Assistance Tagging',
                    desc: 'Injects additional visual summaries into raw document scans for browser talkbacks.',
                    state: screenReader,
                    setter: setScreenReader
                  },
                  {
                    id: 'focusVisibility',
                    label: 'Bolder Focus Outlines',
                    desc: 'Always display a high-contrast amber ring around active buttons or dropdown inputs.',
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
                    {/* Toggle Button */}
                    <button
                      id={`btn-accessibility-toggle-${item.id}`}
                      onClick={() => {
                        item.setter(!item.state);
                        showToast('info', `${item.label} configured.`);
                      }}
                      className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${item.state ? 'bg-cinema-amber-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${item.state ? 'right-0.75' : 'left-0.75'}`} />
                    </button>
                  </div>
                ))}

                <div className="flex justify-end pt-4 border-t border-border" id="accessibility-save-row">
                  <Button
                    id="save-accessibility-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Accessibility setups')}
                  >
                    Save Accessibility
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY PANEL */}
          {activeTab === 'privacy' && (
            <div id="settings-panel-privacy" className="space-y-6">
              <div className="border-b border-border pb-4" id="panel-privacy-header">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cinema-amber-500" /> Privacy & Shared Metrics
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Configure analytics triggers, profile draft visibility, and declassified files storage.</p>
              </div>

              <div className="space-y-5" id="privacy-form-rows">
                <div className="space-y-4" id="privacy-settings-toggles">
                  {/* Analytics enabled */}
                  <div className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10" id="toggle-box-analytics">
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-xs font-bold text-foreground block">Share Analytics Metadata</span>
                      <span className="text-[11px] text-muted-foreground block leading-normal">
                        Let ReelLegacy log compiler times, audio rendering durations and active session counts to improve nodes.
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

                  {/* Data sharing */}
                  <div className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/10" id="toggle-box-datashare">
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-xs font-bold text-foreground block">External Cloud Synthesis Sync</span>
                      <span className="text-[11px] text-muted-foreground block leading-normal">
                        Allows third-party AI generators to safely parse transcripts of timeline events to build more descriptive memoirs.
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

                {/* Profile Visibility dropdown */}
                <div className="space-y-2 pt-2" id="pref-profile-visibility-box">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Default Legacy Archive Visibility</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="profile-visibility-options-grid">
                    {[
                      { id: 'private', label: 'Invite-Only Private Archive', desc: 'Secure encryption keys. Co-authors must be explicitly approved via mail.' },
                      { id: 'public', label: 'Public Family Share Link', desc: 'Allows generating an public link to share family films with relatives directly.' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        id={`btn-visibility-mode-${mode.id}`}
                        onClick={() => {
                          setProfileVisibility(mode.id);
                          showToast('info', `Archive default safety mode: ${mode.label}`);
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

                <div className="flex justify-end pt-4 border-t border-border" id="privacy-save-row">
                  <Button
                    id="save-privacy-btn"
                    variant="primary"
                    onClick={() => handleSavePreferences('Privacy and Security setups')}
                  >
                    Save Privacy Prefs
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
