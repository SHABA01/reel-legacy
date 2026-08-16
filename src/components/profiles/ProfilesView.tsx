/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Sparkles,
  Search,
  Grid,
  List,
  Heart,
  Pin,
  Trash2,
  Archive,
  ChevronRight,
  Copy,
  FileText,
  Calendar,
  Image as ImageIcon,
  Network,
  Activity,
  AlertTriangle,
  TrendingUp,
  Brain,
  CheckCircle2,
  Wand2,
  UserPlus,
  TreePine,
  ArrowUpRight,
  Download,
  Filter,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

import { Button } from '../ui/Button';
import { MetricsGrid } from '../ui/MetricsGrid';
import { FilterBar } from '../ui/FilterBar';
import { FilterDropdown } from '../ui/FilterDropdown';
import { BulkOperationsBar } from '../ui/BulkOperationsBar';
import { EmptyState } from '../ui/EmptyState';
import { KebabMenu } from '../ui/KebabMenu';
import { FavoriteButton } from '../ui/FavoriteButton';
import { PinButton } from '../ui/PinButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { TabNavigation } from '../ui/TabNavigation';

import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useInspector } from '../../context/InspectorContext';
import { persistenceService, ActivityService } from '../../storage';

import { ExtendedLegacyProfile, INITIAL_PROFILES } from './mockData';
import { ProfileWizard } from './ProfileWizard';
import { ProfileDetails } from './ProfileDetails';
import { ProfileEdit } from './ProfileEdit';

type NavTab = 'catalog' | 'relationships' | 'health' | 'highlights';

export function ProfilesView() {
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();
  const { setSelection, openInspector } = useInspector();

  // Primary Sub-View Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('catalog');

  // Active view workflow state
  const [activeSubView, setActiveSubView] = useState<'overview' | 'details' | 'create-wizard' | 'edit'>('overview');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>('profile-elizabeth-vance');

  // Profiles State
  const [profiles, setProfiles] = useState<ExtendedLegacyProfile[]>(() => INITIAL_PROFILES);
  const [isLoading, setIsLoading] = useState(false);

  // Search, Filter & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'progress'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Bulk Selection State
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Deletion Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    profileId?: string;
    profileName?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  // Initial Load from Persistence
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const fetched = await persistenceService.profiles.getAll();
        if (fetched && fetched.length > 0) {
          setProfiles(fetched as unknown as ExtendedLegacyProfile[]);
        } else {
          // Initialize default mock data if empty
          await persistenceService.profiles.saveAll(INITIAL_PROFILES as any);
          setProfiles(INITIAL_PROFILES);
        }
      } catch (err) {
        console.warn('Failed loading legacy profiles from persistence', err);
        setProfiles(INITIAL_PROFILES);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Save changes to local persistence
  const saveToLocal = (newProfiles: ExtendedLegacyProfile[]) => {
    setProfiles(newProfiles);
    persistenceService.profiles.saveAll(newProfiles as any);
  };

  // Selection Handler - Populates Global Context Panel & Sets Active Selection
  const handleSelectProfile = (id: string, autoOpenInspector = true) => {
    setSelectedProfileId(id);
    const target = profiles.find(p => p.id === id);
    if (target) {
      setSelection('profile', target);
      if (autoOpenInspector) {
        openInspector();
      }
    }
  };

  // Double click or explicit explore opens detail subview
  const handleExploreProfile = (id: string) => {
    handleSelectProfile(id, false);
    setActiveSubView('details');
  };

  const handleEditProfile = (id: string) => {
    setSelectedProfileId(id);
    setActiveSubView('edit');
  };

  const handleDuplicateProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;
    const cloned: ExtendedLegacyProfile = {
      ...target,
      id: `profile-${Date.now()}`,
      preferredName: `${target.preferredName || target.firstName} (Copy)`,
      status: 'draft',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      pinned: false,
      favorite: false
    };
    const updated = [cloned, ...profiles];
    saveToLocal(updated);
    showToast('success', 'Profile Cloned', `Created duplicate record for ${target.preferredName}.`);
  };

  const handleArchiveProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;
    const updated = profiles.map(p => p.id === id ? { ...p, status: 'archived' as const } : p);
    saveToLocal(updated);
    showToast('info', 'Profile Vaulted', `${target.preferredName} has been archived.`);
  };

  const handleDeleteProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;
    setDeleteConfirmation({
      isOpen: true,
      profileId: id,
      profileName: target.preferredName || `${target.firstName} ${target.lastName}`,
    });
  };

  const handleBulkArchive = () => {
    if (selectedRowIds.length === 0) return;
    const updated = profiles.map(p => selectedRowIds.includes(p.id) ? { ...p, status: 'archived' as const } : p);
    saveToLocal(updated);
    showToast('info', 'Bulk Vault Completed', `${selectedRowIds.length} profiles archived.`);
    setSelectedRowIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedRowIds.length === 0) return;
    setDeleteConfirmation({
      isOpen: true,
      isBulk: true,
    });
  };

  const executeDelete = () => {
    if (deleteConfirmation.isBulk) {
      const updated = profiles.filter(p => !selectedRowIds.includes(p.id));
      saveToLocal(updated);
      showToast('error', 'Profiles Deleted', `${selectedRowIds.length} profiles removed.`);
      setSelectedRowIds([]);
    } else if (deleteConfirmation.profileId) {
      const id = deleteConfirmation.profileId;
      const target = profiles.find(p => p.id === id);
      if (target) {
        const updated = profiles.filter(p => p.id !== id);
        saveToLocal(updated);
        setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
        showToast('error', 'Profile Deleted', `${target.preferredName} removed from workspace.`);
      }
    }
    setDeleteConfirmation({ isOpen: false });
  };

  const handleCreateWizardSave = (newProfile: ExtendedLegacyProfile) => {
    const updated = [newProfile, ...profiles];
    saveToLocal(updated);
    ActivityService.logActivity(
      'Legacy Profile Created',
      `Legacy profile for ${newProfile.firstName} ${newProfile.lastName} registered.`,
      'bg-emerald-500'
    ).catch(err => console.warn('Failed logging activity', err));
    setActiveSubView('overview');
    handleSelectProfile(newProfile.id);
  };

  const handleEditSave = (updatedProfile: ExtendedLegacyProfile) => {
    const updated = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    saveToLocal(updated);
    setActiveSubView('overview');
    handleSelectProfile(updatedProfile.id);
  };

  const handleToggleFavorite = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;
    const nextFav = !target.favorite;
    const updated = profiles.map(p => p.id === id ? { ...p, favorite: nextFav } : p);
    saveToLocal(updated);
    showToast(
      nextFav ? 'success' : 'info',
      nextFav ? 'Added to Favorites' : 'Removed from Favorites',
      `"${target.preferredName || target.firstName}" updated.`
    );
  };

  const handleTogglePin = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;
    const nextPinned = !target.pinned;
    const updated = profiles.map(p => p.id === id ? { ...p, pinned: nextPinned } : p);
    saveToLocal(updated);
    showToast(
      'success',
      nextPinned ? 'Profile Pinned' : 'Profile Unpinned',
      `"${target.preferredName || target.firstName}" updated.`
    );
  };

  // Filter & Sort Logic
  const filteredAndSortedProfiles = useMemo(() => {
    return profiles
      .filter((p) => {
        const fullName = `${p.firstName} ${p.lastName} ${p.preferredName || ''} ${p.nickname || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || (p.relationship || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        
        let matchesStatus = true;
        if (showArchivedOnly) {
          matchesStatus = p.status === 'archived';
        } else if (statusFilter !== 'all') {
          matchesStatus = p.status === statusFilter;
        } else {
          matchesStatus = p.status !== 'archived';
        }

        const matchesFav = !showFavoritesOnly || p.favorite === true;
        const matchesPinned = !showPinnedOnly || p.pinned === true;

        return matchesSearch && matchesCategory && matchesStatus && matchesFav && matchesPinned;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === 'name') {
          return a.lastName.localeCompare(b.lastName);
        }
        if (sortBy === 'progress') {
          return b.storyProgress - a.storyProgress;
        }
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
  }, [profiles, searchQuery, categoryFilter, statusFilter, sortBy, showFavoritesOnly, showPinnedOnly, showArchivedOnly]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = profiles.length;
    const active = profiles.filter(p => p.status !== 'archived').length;
    const living = profiles.filter(p => p.lifeStatus === 'living').length;
    const memorial = profiles.filter(p => p.lifeStatus === 'memorial').length;
    const archived = profiles.filter(p => p.status === 'archived').length;
    const totalProgress = profiles.reduce((acc, p) => acc + (p.storyProgress || 0), 0);
    const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;
    const incomplete = profiles.filter(p => (p.storyProgress || 0) < 50).length;
    const readyForStudio = profiles.filter(p => (p.storyProgress || 0) >= 80).length;

    return { total, active, living, memorial, archived, avgProgress, incomplete, readyForStudio };
  }, [profiles]);

  // Find selected profile reference
  const selectedProfile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId);
  }, [profiles, selectedProfileId]);

  // AI Health Groups
  const aiHealthData = useMemo(() => {
    const missingBio = profiles.filter(p => !p.biographySummary || p.biographySummary.length < 50);
    const missingPhotos = profiles.filter(p => p.mediaCount === 0);
    const missingTimeline = profiles.filter(p => p.timelineEventsCount === 0);
    const missingRelations = profiles.filter(p => (!p.parents || p.parents.length === 0) && (!p.children || p.children.length === 0) && !p.spouse);
    return { missingBio, missingPhotos, missingTimeline, missingRelations };
  }, [profiles]);

  // Grouped Relationship Clusters
  const relationshipClusters = useMemo(() => {
    const parents = profiles.filter(p => p.relationship.toLowerCase().includes('parent') || p.relationship.toLowerCase().includes('mother') || p.relationship.toLowerCase().includes('father') || p.relationship.toLowerCase().includes('grand'));
    const spouse = profiles.filter(p => p.relationship.toLowerCase().includes('spouse') || p.relationship.toLowerCase().includes('wife') || p.relationship.toLowerCase().includes('husband') || p.relationship.toLowerCase().includes('partner'));
    const children = profiles.filter(p => p.relationship.toLowerCase().includes('child') || p.relationship.toLowerCase().includes('son') || p.relationship.toLowerCase().includes('daughter'));
    const siblings = profiles.filter(p => p.relationship.toLowerCase().includes('brother') || p.relationship.toLowerCase().includes('sister') || p.relationship.toLowerCase().includes('sibling'));
    const others = profiles.filter(p => !parents.includes(p) && !spouse.includes(p) && !children.includes(p) && !siblings.includes(p));

    return [
      { id: 'ancestors', title: 'Parents & Ancestors', items: parents, icon: TreePine, badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      { id: 'spouse', title: 'Spouses & Partners', items: spouse, icon: Heart, badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
      { id: 'descendants', title: 'Children & Descendants', items: children, icon: Users, badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      { id: 'siblings', title: 'Siblings & Extended Relatives', items: siblings, icon: Network, badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      { id: 'extended', title: 'Friends, Mentors & Historical Figures', items: others, icon: Sparkles, badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20' }
    ];
  }, [profiles]);

  return (
    <div id="legacy-profiles-module-root" className="space-y-6 animate-fade-in text-foreground pb-12 pt-2.5 md:pt-4 lg:pt-5">
      
      {/* Subview Flow: Create Wizard */}
      {activeSubView === 'create-wizard' && (
        <ProfileWizard
          onClose={() => setActiveSubView('overview')}
          onSave={handleCreateWizardSave}
        />
      )}

      {/* Subview Flow: Full Detail View */}
      {activeSubView === 'details' && (
        selectedProfile ? (
          <ProfileDetails
            profile={selectedProfile}
            onBack={() => setActiveSubView('overview')}
            onEdit={() => setActiveSubView('edit')}
          />
        ) : (
          <div className="p-8 bg-card border border-border rounded-2xl">
            <EmptyState
              title="Legacy Profile Not Found"
              description="The requested biographical record could not be loaded or was removed."
              actionLabel="Return to Profiles Catalog"
              onAction={() => setActiveSubView('overview')}
            />
          </div>
        )
      )}

      {/* Subview Flow: Edit View */}
      {activeSubView === 'edit' && (
        selectedProfile ? (
          <ProfileEdit
            profile={selectedProfile}
            onCancel={() => setActiveSubView('overview')}
            onSave={handleEditSave}
          />
        ) : (
          <div className="p-8 bg-card border border-border rounded-2xl">
            <EmptyState
              title="Legacy Profile Not Found"
              description="The requested biographical record could not be loaded for editing."
              actionLabel="Return to Profiles Catalog"
              onAction={() => setActiveSubView('overview')}
            />
          </div>
        )
      )}

      {/* Primary Overview Workspace */}
      {activeSubView === 'overview' && (
        <div className="space-y-6" id="profiles-workspace-root">
          
          {/* Mission Control Hero Header Banner */}
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden transition-all" id="profiles-hero-header">
            <div className="absolute -right-10 -top-10 w-72 h-72 bg-cinema-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cinema-amber-500 bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Collection & Relationship Workspace
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground">
                  Legacy Profiles
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Manage, organize, and enrich the biographic records, family relationships, and historical stories of your ancestors and relatives.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
                <Button
                  id="btn-import-profiles"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4 text-muted-foreground" />}
                  onClick={() => showToast('info', 'GEDCOM Import', 'Importing family tree records...')}
                  className="text-xs border border-border"
                >
                  Import Tree
                </Button>
                <Button
                  id="btn-ai-generate-profile"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Wand2 className="w-4 h-4 text-purple-400" />}
                  onClick={() => showToast('success', 'AI Generation Ready', 'Select a relative to auto-synthesize biography.')}
                  className="text-xs border border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10"
                >
                  AI Generate
                </Button>
                <Button
                  id="btn-create-profile-trigger"
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
                  onClick={() => setActiveSubView('create-wizard')}
                  className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold shadow-md hover:scale-[1.02] transition-all"
                >
                  Create Legacy Profile
                </Button>
              </div>
            </div>

            {/* Quick Metrics Stats Bar */}
            <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4" id="hero-quick-metrics">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Total Profiles</span>
                <p className="text-lg font-bold font-display text-foreground">{stats.total}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Living Members</span>
                <p className="text-lg font-bold font-display text-emerald-500">{stats.living}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Memorial Records</span>
                <p className="text-lg font-bold font-display text-amber-500">{stats.memorial}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Studio Ready (&gt;80%)</span>
                <p className="text-lg font-bold font-display text-cinema-amber-500">{stats.readyForStudio}</p>
              </div>
              <div className="space-y-0.5 col-span-2 sm:col-span-4 lg:col-span-1">
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Avg Completion</span>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold font-display text-cinema-amber-500">{stats.avgProgress}%</p>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[80px]">
                    <div className="h-full bg-cinema-amber-500 rounded-full" style={{ width: `${stats.avgProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Horizontal Navigation Archetype (Replaces nested sidebars) */}
          <div className="flex items-center justify-between border-b border-border pb-0" id="profiles-horizontal-nav-bar">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0">
              <button
                id="nav-tab-catalog"
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'catalog'
                    ? 'border-cinema-amber-500 text-cinema-amber-500 bg-cinema-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="w-4 h-4" /> Profile Catalog ({profiles.length})
              </button>

              <button
                id="nav-tab-relationships"
                onClick={() => setActiveTab('relationships')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'relationships'
                    ? 'border-cinema-amber-500 text-cinema-amber-500 bg-cinema-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Network className="w-4 h-4" /> Relationship Map
              </button>

              <button
                id="nav-tab-health"
                onClick={() => setActiveTab('health')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'health'
                    ? 'border-cinema-amber-500 text-cinema-amber-500 bg-cinema-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Brain className="w-4 h-4" /> AI Profile Health
                {stats.incomplete > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-500 rounded-full font-bold">
                    {stats.incomplete} Needs Bio
                  </span>
                )}
              </button>

              <button
                id="nav-tab-highlights"
                onClick={() => setActiveTab('highlights')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'highlights'
                    ? 'border-cinema-amber-500 text-cinema-amber-500 bg-cinema-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className="w-4 h-4" /> Favorites &amp; Pinned
              </button>
            </div>
          </div>

          {/* TAB 1: CATALOG VIEW (COLLECTION ARCHETYPE) */}
          {activeTab === 'catalog' && (
            <div className="space-y-6 animate-fade-in" id="tab-content-catalog">
              
              {/* Filtering Control Bar */}
              <FilterBar
                id="profiles-filter-bar"
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                searchPlaceholder="Search profile by name, nickname, or relationship..."
                sortBy={sortBy}
                sortOptions={[
                  { value: 'updated', label: 'Recently Updated' },
                  { value: 'name', label: 'Name A–Z' },
                  { value: 'progress', label: 'Completion %' }
                ]}
                onSortByChange={(val) => setSortBy(val as any)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showAdvancedFilters={showAdvancedFilters}
                onShowAdvancedFiltersChange={setShowAdvancedFilters}
                hasActiveFilters={categoryFilter !== 'all' || statusFilter !== 'all'}
                showFavoritesOnly={showFavoritesOnly}
                onFavoritesOnlyChange={setShowFavoritesOnly}
                showPinnedOnly={showPinnedOnly}
                onPinnedOnlyChange={setShowPinnedOnly}
                showArchivedOnly={showArchivedOnly}
                onArchivedOnlyChange={setShowArchivedOnly}
                archivedLabel="Show Archived Profiles"
              >
                {/* Advanced Category Dropdown */}
                <div className="space-y-1.5 relative" id="profiles-category-filter-dropdown-wrapper">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block font-mono">
                    Profile Category
                  </label>
                  <FilterDropdown
                    id="advanced-category-dropdown"
                    value={categoryFilter}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'personal', label: 'Personal' },
                      { value: 'autobiography', label: 'Autobiography' },
                      { value: 'memorial', label: 'Memorial' },
                      { value: 'celebration', label: 'Celebration of Life' },
                      { value: 'career', label: 'Career Journey' },
                      { value: 'family-history', label: 'Family History' },
                      { value: 'historical-figure', label: 'Historical Figure' }
                    ]}
                    onChange={setCategoryFilter}
                    fullWidth
                    align="left"
                  />
                </div>

                {/* Advanced Status Dropdown */}
                <div className="space-y-1.5 relative" id="profiles-status-filter-dropdown-wrapper">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block font-mono">
                    Workflow Status
                  </label>
                  <FilterDropdown
                    id="advanced-status-dropdown"
                    value={statusFilter}
                    options={[
                      { value: 'all', label: 'All Statuses' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'published', label: 'Published' },
                      { value: 'archived', label: 'Archived' }
                    ]}
                    onChange={setStatusFilter}
                    fullWidth
                    align="left"
                  />
                </div>
              </FilterBar>

              {/* Bulk Operations Action Bar */}
              {selectedRowIds.length > 0 && viewMode === 'list' && (
                <BulkOperationsBar
                  id="bulk-operations-bar"
                  selectedCount={selectedRowIds.length}
                  itemTypeSingular="Profile"
                  itemTypePlural="Profiles"
                  actions={[
                    {
                      id: 'btn-bulk-archive',
                      label: 'Archive Selected',
                      icon: <Archive className="w-4 h-4 text-muted-foreground" />,
                      onClick: handleBulkArchive,
                      className: 'hover:bg-card',
                    },
                    {
                      id: 'btn-bulk-delete',
                      label: 'Delete Selected',
                      icon: <Trash2 className="w-4 h-4 text-red-500" />,
                      onClick: handleBulkDelete,
                      className: 'hover:bg-card hover:text-red-400 text-red-500',
                    },
                  ]}
                />
              )}

              {/* GRID VIEW */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6" id="profiles-grid-canvas">
                  {filteredAndSortedProfiles.map((p) => {
                    const birthYr = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 'N/A';
                    const deathYr = p.dateOfDeath ? new Date(p.dateOfDeath).getFullYear() : '';
                    const lifeSpan = deathYr ? `${birthYr} – ${deathYr}` : `${birthYr} – Living`;
                    const isSelected = selectedProfileId === p.id;

                    return (
                      <div
                        key={p.id}
                        id={`profile-grid-card-${p.id}`}
                        onClick={() => handleSelectProfile(p.id)}
                        onDoubleClick={() => handleExploreProfile(p.id)}
                        className={`group border bg-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all h-[310px] cursor-pointer ${
                          isSelected ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500/30' : 'border-border'
                        }`}
                      >
                        {/* Cover photo block */}
                        <div className="h-20 w-full relative shrink-0 bg-muted">
                          <img src={p.coverPhoto} alt={`${p.preferredName} cover`} className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Relationship badge */}
                          <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[9px] font-bold bg-black/60 text-white border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {p.relationship}
                          </span>

                          {/* Kebab Menu */}
                          <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
                            <KebabMenu
                              id={`profile-${p.id}`}
                              items={[
                                { id: `dropdown-action-explore-${p.id}`, label: 'Explore Profile', onClick: () => handleExploreProfile(p.id), icon: <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-edit-${p.id}`, label: 'Edit Profile', onClick: () => handleEditProfile(p.id), icon: <FileText className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-clone-${p.id}`, label: 'Duplicate', onClick: () => handleDuplicateProfile(p.id), icon: <Copy className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-archive-${p.id}`, label: 'Archive', onClick: () => handleArchiveProfile(p.id), icon: <Archive className="w-3.5 h-3.5 text-muted-foreground" /> },
                                { id: `dropdown-action-delete-${p.id}`, label: 'Delete', onClick: () => handleDeleteProfile(p.id), isDestructive: true, hasDividerBefore: true, icon: <Trash2 className="w-3.5 h-3.5 text-red-500" /> },
                              ]}
                              dropdownClassName="w-40"
                            />
                          </div>
                        </div>

                        {/* Overlapping Avatar */}
                        <div className="px-4 relative -mt-5 flex items-end justify-between shrink-0" id={`avatar-overlapping-${p.id}`}>
                          <div className="relative w-11 h-11 rounded-full border-2 border-card overflow-hidden bg-muted shadow-sm">
                            <img src={p.profilePhoto} alt={p.preferredName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex items-center gap-1">
                            <FavoriteButton
                              id={`btn-toggle-favorite-${p.id}`}
                              isFavorite={!!p.favorite}
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(p.id); }}
                            />
                            <PinButton
                              id={`btn-toggle-pin-${p.id}`}
                              isPinned={!!p.pinned}
                              onClick={(e) => { e.stopPropagation(); handleTogglePin(p.id); }}
                            />
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="px-4 py-2 flex-grow flex flex-col justify-between min-h-0 overflow-hidden" id={`card-details-middle-${p.id}`}>
                          <div className="min-h-0 overflow-hidden space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-display font-bold text-xs text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                                {p.preferredName || `${p.firstName} ${p.lastName}`}
                              </h4>
                            </div>
                            <p className="text-[9px] text-muted-foreground font-mono">{lifeSpan}</p>
                            
                            {/* Progress bar */}
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[9px] font-mono">
                                <span className="text-muted-foreground font-semibold">Story Readiness</span>
                                <span className="font-bold text-cinema-amber-500">{p.storyProgress}%</span>
                              </div>
                              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cinema-amber-500 rounded-full" style={{ width: `${p.storyProgress}%` }} />
                              </div>
                            </div>
                            
                            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed font-medium pt-1">
                              {p.biographySummary || 'Biographical chronicle registered in workspace repository.'}
                            </p>
                          </div>

                          {/* Stat counters */}
                          <div className="flex items-center justify-between pt-2 border-t border-border mt-2 shrink-0 text-[9px] font-mono text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground/60" />
                              <span>{p.timelineEventsCount} Milestones</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-muted-foreground/60" />
                              <span>{p.mediaCount} Media</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between shrink-0" id={`card-footer-action-row-${p.id}`}>
                          <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-1.5 py-0.5 rounded ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {p.status}
                          </span>

                          <Button
                            id={`btn-open-detail-${p.id}`}
                            onClick={(e) => { e.stopPropagation(); handleExploreProfile(p.id); }}
                            variant="ghost"
                            size="xs"
                            rightIcon={<ChevronRight className="w-3.5 h-3.5 text-foreground" />}
                            className="text-[10px] font-bold hover:bg-muted py-1 h-7"
                          >
                            Explore Profile
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredAndSortedProfiles.length === 0 && (
                    <div className="col-span-full py-16 text-center space-y-4" id="empty-search-grid-state">
                      <EmptyState
                        type="search"
                        title="No Legacy Records Found"
                        description={`No profiles found matching "${searchQuery}". Try modifying your active categories or text query.`}
                        primaryActionLabel="Reset All Query Filters"
                        onPrimaryAction={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); setShowArchivedOnly(false); }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* LIST VIEW TABLE */}
              {viewMode === 'list' && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="profiles-table-container">
                  <div className="overflow-y-auto overflow-x-hidden max-h-[550px] relative scrollbar-thin">
                    <table className="w-full text-left border-collapse" id="profiles-table">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
                          <th className="sticky top-0 bg-card z-20 p-4 w-10 border-b border-border">
                            <input
                              id="bulk-all-select-checkbox"
                              type="checkbox"
                              checked={selectedRowIds.length === filteredAndSortedProfiles.length && filteredAndSortedProfiles.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRowIds(filteredAndSortedProfiles.map(p => p.id));
                                } else {
                                  setSelectedRowIds([]);
                                }
                              }}
                              className="w-3.5 h-3.5 rounded border-border bg-muted cursor-pointer"
                            />
                          </th>
                          <th className="sticky top-0 bg-card z-20 p-4 border-b border-border">Ancestor Profile</th>
                          <th className="sticky top-0 bg-card z-20 p-4 border-b border-border">Relationship</th>
                          <th className="sticky top-0 bg-card z-20 p-4 border-b border-border">Lifespan</th>
                          <th className="sticky top-0 bg-card z-20 p-4 border-b border-border">Status</th>
                          <th className="sticky top-0 bg-card z-20 p-4 border-b border-border">Story Progress</th>
                          <th className="sticky top-0 bg-card z-20 p-4 border-b border-border">Assets</th>
                          <th className="sticky top-0 bg-card z-20 p-4 text-right border-b border-border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedProfiles.map((p) => {
                          const birthYr = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 'N/A';
                          const deathYr = p.dateOfDeath ? new Date(p.dateOfDeath).getFullYear() : '';
                          const lifeSpan = deathYr ? `${birthYr} – ${deathYr}` : `${birthYr} – Living`;
                          const isChecked = selectedRowIds.includes(p.id);
                          const isSelected = selectedProfileId === p.id;

                          return (
                            <tr
                              key={p.id}
                              id={`profile-table-row-${p.id}`}
                              onClick={() => handleSelectProfile(p.id)}
                              className={`border-b border-border text-xs hover:bg-muted/40 transition-colors cursor-pointer ${
                                isChecked || isSelected ? 'bg-cinema-amber-500/5' : ''
                              }`}
                            >
                              <td className="p-4 w-10" onClick={(e) => e.stopPropagation()}>
                                <input
                                  id={`select-checkbox-${p.id}`}
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedRowIds(prev => [...prev, p.id]);
                                    } else {
                                      setSelectedRowIds(prev => prev.filter(rowId => rowId !== p.id));
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded border-border bg-muted cursor-pointer"
                                />
                              </td>
                              <td className="p-4 min-w-0 max-w-[200px]">
                                <div className="flex items-center gap-3">
                                  <img src={p.profilePhoto} className="w-8 h-8 rounded-full object-cover border border-border shrink-0" alt={p.preferredName} referrerPolicy="no-referrer" />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-foreground truncate hover:text-cinema-amber-500 transition-colors">
                                      {p.preferredName || `${p.firstName} ${p.lastName}`}
                                    </h4>
                                    <span className="text-[10px] text-muted-foreground font-mono capitalize block">{p.category.replace('-', ' ')}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <span className="font-mono text-[10px] font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                                  {p.relationship}
                                </span>
                              </td>
                              <td className="p-4 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                                {lifeSpan}
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                                  p.status === 'published'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                                    <div className="h-full bg-cinema-amber-500 rounded-full" style={{ width: `${p.storyProgress}%` }} />
                                  </div>
                                  <span className="font-mono text-[10px] font-bold text-foreground">{p.storyProgress}%</span>
                                </div>
                              </td>
                              <td className="p-4 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                                {p.timelineEventsCount} Milestones • {p.mediaCount} Media
                              </td>
                              <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  <Button id={`btn-row-explore-${p.id}`} onClick={() => handleExploreProfile(p.id)} variant="ghost" size="xs" className="py-1 px-2 border border-border text-[10px] h-7">
                                    Explore
                                  </Button>
                                  <Button id={`btn-row-edit-${p.id}`} onClick={() => handleEditProfile(p.id)} variant="ghost" size="xs" className="py-1 px-2 border border-border text-[10px] h-7">
                                    Edit
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RELATIONSHIP MAP (RELATIONSHIP ARCHETYPE) */}
          {activeTab === 'relationships' && (
            <div className="space-y-6 animate-fade-in" id="tab-content-relationships">
              <div className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                    <Network className="w-4 h-4 text-cinema-amber-500" /> Family Relationship Map
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Explore family connections grouped by generation and role. Click any node to inspect details in the Context Inspector.
                  </p>
                </div>
                <Button
                  id="btn-auto-link-tree"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-cinema-amber-500" />}
                  onClick={() => showToast('success', 'Family Links Analyzed', 'AI verified 14 inter-family relationship nodes.')}
                  className="text-xs shrink-0 self-start sm:self-auto"
                >
                  AI Verify Connections
                </Button>
              </div>

              {/* Relationship Clusters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="relationship-clusters-grid">
                {relationshipClusters.map((cluster) => {
                  const Icon = cluster.icon;
                  return (
                    <div key={cluster.id} className="p-5 bg-card border border-border rounded-2xl space-y-4 shadow-sm" id={`cluster-${cluster.id}`}>
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border ${cluster.badgeColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-foreground">{cluster.title}</h4>
                            <span className="text-[10px] font-mono text-muted-foreground">{cluster.items.length} Registered Nodes</span>
                          </div>
                        </div>
                      </div>

                      {cluster.items.length > 0 ? (
                        <div className="space-y-2.5">
                          {cluster.items.map((p) => (
                            <div
                              key={p.id}
                              id={`rel-node-${p.id}`}
                              onClick={() => handleSelectProfile(p.id)}
                              className={`p-3 bg-muted/30 hover:bg-muted/60 border rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                selectedProfileId === p.id ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500/20' : 'border-border'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img src={p.profilePhoto} alt={p.preferredName} className="w-9 h-9 rounded-full object-cover border border-border shrink-0" referrerPolicy="no-referrer" />
                                <div className="min-w-0">
                                  <h5 className="font-bold text-xs text-foreground truncate">{p.preferredName || `${p.firstName} ${p.lastName}`}</h5>
                                  <p className="text-[10px] font-mono text-cinema-amber-500 font-bold uppercase">{p.relationship}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-mono text-muted-foreground bg-card border border-border px-2 py-0.5 rounded-full">
                                  {p.storyProgress}%
                                </span>
                                <Button
                                  id={`btn-explore-rel-${p.id}`}
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => { e.stopPropagation(); handleExploreProfile(p.id); }}
                                  className="h-7 px-2 text-[10px]"
                                >
                                  Inspect
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center border border-dashed border-border rounded-xl">
                          <p className="text-xs text-muted-foreground">No relative records catalogued in this branch.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI PROFILE HEALTH (ACTIONABLE AI ARCHETYPE) */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-fade-in" id="tab-content-health">
              <div className="p-5 bg-card border border-border rounded-2xl space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" /> AI Archive Health &amp; Completeness Monitor
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Automated analysis detecting missing biographical summaries, photos, timeline milestones, and family relationships.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Workspace Score</span>
                      <strong className="text-lg font-display font-bold text-foreground">{stats.avgProgress}% Complete</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Audit Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="ai-health-audit-grid">
                
                {/* Missing Biography Audit */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-4" id="health-card-missing-bio">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <h4 className="font-display font-bold text-sm text-foreground">Incomplete Biographies ({aiHealthData.missingBio.length})</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                      Needs Expansion
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {aiHealthData.missingBio.slice(0, 4).map((p) => (
                      <div key={p.id} className="p-3 bg-muted/30 border border-border rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.profilePhoto} className="w-8 h-8 rounded-full object-cover shrink-0" alt={p.preferredName} referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-foreground truncate">{p.preferredName}</h5>
                            <span className="text-[10px] font-mono text-muted-foreground">{p.storyProgress}% Progress</span>
                          </div>
                        </div>

                        <Button
                          id={`btn-ai-gen-bio-${p.id}`}
                          variant="secondary"
                          size="xs"
                          leftIcon={<Wand2 className="w-3 h-3 text-purple-400" />}
                          onClick={() => showToast('success', 'AI Bio Generator Triggered', `Synthesizing chronicle for ${p.preferredName}...`)}
                          className="text-[10px] border-purple-500/30 text-purple-400"
                        >
                          Generate Bio
                        </Button>
                      </div>
                    ))}
                    {aiHealthData.missingBio.length === 0 && (
                      <div className="p-4 text-center text-xs text-emerald-500 font-medium">
                        All profiles have detailed biographical chronicles!
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Photos Audit */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-4" id="health-card-missing-photos">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-display font-bold text-sm text-foreground">Missing Visual Media ({aiHealthData.missingPhotos.length})</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                      0 Photos
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {aiHealthData.missingPhotos.slice(0, 4).map((p) => (
                      <div key={p.id} className="p-3 bg-muted/30 border border-border rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.profilePhoto} className="w-8 h-8 rounded-full object-cover shrink-0" alt={p.preferredName} referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-foreground truncate">{p.preferredName}</h5>
                            <span className="text-[10px] font-mono text-muted-foreground">{p.relationship}</span>
                          </div>
                        </div>

                        <Button
                          id={`btn-scan-photos-${p.id}`}
                          variant="secondary"
                          size="xs"
                          leftIcon={<Search className="w-3 h-3 text-cyan-400" />}
                          onClick={() => showToast('info', 'Media Library Scanned', `Found 3 potential photo matches for ${p.preferredName}.`)}
                          className="text-[10px] border-cyan-500/30 text-cyan-400"
                        >
                          Scan Archive
                        </Button>
                      </div>
                    ))}
                    {aiHealthData.missingPhotos.length === 0 && (
                      <div className="p-4 text-center text-xs text-emerald-500 font-medium">
                        All profiles have visual assets linked!
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Timeline Audit */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-4" id="health-card-missing-timeline">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cinema-amber-500" />
                      <h4 className="font-display font-bold text-sm text-foreground">Timeline Milestones Gap ({aiHealthData.missingTimeline.length})</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                      0 Milestones
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {aiHealthData.missingTimeline.slice(0, 4).map((p) => (
                      <div key={p.id} className="p-3 bg-muted/30 border border-border rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.profilePhoto} className="w-8 h-8 rounded-full object-cover shrink-0" alt={p.preferredName} referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-foreground truncate">{p.preferredName}</h5>
                            <span className="text-[10px] font-mono text-muted-foreground">{p.relationship}</span>
                          </div>
                        </div>

                        <Button
                          id={`btn-suggest-timeline-${p.id}`}
                          variant="secondary"
                          size="xs"
                          leftIcon={<Plus className="w-3 h-3 text-cinema-amber-500" />}
                          onClick={() => showToast('success', 'Chronology Event Added', `Linked birth and education milestones for ${p.preferredName}.`)}
                          className="text-[10px] border-cinema-amber-500/30 text-cinema-amber-500"
                        >
                          Add Milestones
                        </Button>
                      </div>
                    ))}
                    {aiHealthData.missingTimeline.length === 0 && (
                      <div className="p-4 text-center text-xs text-emerald-500 font-medium">
                        All profiles contain chronology events!
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Relationships Audit */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-4" id="health-card-missing-relations">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-rose-500" />
                      <h4 className="font-display font-bold text-sm text-foreground">Unlinked Family Tree Nodes ({aiHealthData.missingRelations.length})</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                      No Parents/Children
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {aiHealthData.missingRelations.slice(0, 4).map((p) => (
                      <div key={p.id} className="p-3 bg-muted/30 border border-border rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.profilePhoto} className="w-8 h-8 rounded-full object-cover shrink-0" alt={p.preferredName} referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-foreground truncate">{p.preferredName}</h5>
                            <span className="text-[10px] font-mono text-muted-foreground">{p.relationship}</span>
                          </div>
                        </div>

                        <Button
                          id={`btn-link-tree-${p.id}`}
                          variant="secondary"
                          size="xs"
                          leftIcon={<TreePine className="w-3 h-3 text-emerald-500" />}
                          onClick={() => handleEditProfile(p.id)}
                          className="text-[10px] border-emerald-500/30 text-emerald-500"
                        >
                          Link Relative
                        </Button>
                      </div>
                    ))}
                    {aiHealthData.missingRelations.length === 0 && (
                      <div className="p-4 text-center text-xs text-emerald-500 font-medium">
                        All profiles have connected family tree links!
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: FAVORITES & PINNED */}
          {activeTab === 'highlights' && (
            <div className="space-y-6 animate-fade-in" id="tab-content-highlights">
              <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" /> Family Highlights &amp; Pinned Ancestors
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quick reference cards for featured ancestors and active story focus profiles.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="highlights-grid">
                {profiles.filter(p => p.favorite || p.pinned).map((p) => (
                  <div
                    key={p.id}
                    id={`highlight-card-${p.id}`}
                    onClick={() => handleSelectProfile(p.id)}
                    className="p-4 bg-card border border-border rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-cinema-amber-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.profilePhoto} alt={p.preferredName} className="w-12 h-12 rounded-full object-cover border-2 border-cinema-amber-500/30 shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-sm text-foreground truncate">{p.preferredName}</h4>
                          {p.favorite && <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />}
                          {p.pinned && <Pin className="w-3 h-3 text-cinema-amber-500 fill-cinema-amber-500 shrink-0" />}
                        </div>
                        <span className="text-[10px] font-mono text-cinema-amber-500 font-bold uppercase">{p.relationship}</span>
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-muted-foreground">
                          <span>{p.storyProgress}% Ready</span>
                          <span>•</span>
                          <span>{p.timelineEventsCount} Milestones</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      id={`btn-explore-highlight-${p.id}`}
                      variant="ghost"
                      size="xs"
                      onClick={(e) => { e.stopPropagation(); handleExploreProfile(p.id); }}
                      className="h-8 text-[10px] font-bold"
                    >
                      Explore
                    </Button>
                  </div>
                ))}

                {profiles.filter(p => p.favorite || p.pinned).length === 0 && (
                  <div className="col-span-full py-12 text-center text-xs text-muted-foreground space-y-2">
                    <p>No favorite or pinned profiles marked yet.</p>
                    <p className="text-[10px]">Click the heart or pin icon on any profile card in the catalog to add it here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Confirmation Modal for Delete Actions */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={executeDelete}
        title={
          deleteConfirmation.isBulk
            ? (selectedRowIds.length === 1 ? 'Delete Selected Profile' : 'Bulk Delete Profiles')
            : 'Delete Legacy Profile'
        }
        message={(() => {
          if (deleteConfirmation.isBulk) {
            const count = selectedRowIds.length;
            return `Are you sure you want to permanently delete ${count} selected legacy profile(s)? This action cannot be undone.`;
          }
          return `Are you sure you want to delete the profile "${deleteConfirmation.profileName}"? This action cannot be undone.`;
        })()}
      />
    </div>
  );
}
