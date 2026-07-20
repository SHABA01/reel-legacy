/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Grid,
  List,
  Plus,
  Filter,
  Trash2,
  Archive,
  Copy,
  Users,
  BookOpen,
  Heart,
  Calendar,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  X,
  FileText,
  Eye,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmptyState } from '../ui/EmptyState';
import { MetricsGrid, MetricCardProps } from '../ui/MetricsGrid';
import { BulkOperationsBar, BulkAction } from '../ui/BulkOperationsBar';
import { SearchInput } from '../ui/SearchInput';
import { FilterDropdown } from '../ui/FilterDropdown';
import { ViewModeToggle } from '../ui/ViewModeToggle';
import { KebabMenu } from '../ui/KebabMenu';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_PROFILES, ExtendedLegacyProfile } from './mockData';
import { ProfileWizard } from './ProfileWizard';
import { ProfileDetails } from './ProfileDetails';
import { ProfileEdit } from './ProfileEdit';
import { persistenceService, ActivityService } from '../../storage';

export function ProfilesView() {
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();

  // App States
  const [profiles, setProfiles] = useState<ExtendedLegacyProfile[]>(() => {
    // Check if we have cached profiles in localStorage
    const cached = localStorage.getItem('rl_profiles');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const saveToLocal = (newProfiles: ExtendedLegacyProfile[]) => {
    setProfiles(newProfiles);
    persistenceService.profiles.saveAll(newProfiles as any);
    window.dispatchEvent(new Event('reellegacy-data-changed'));
  };

  // Sub-navigation states
  const [activeSubView, setActiveSubView] = useState<'catalog' | 'details' | 'create-wizard' | 'edit'>('catalog');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  // Filtering & UI Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'progress'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Bulk operation states
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Statistics Computations
  const stats = useMemo(() => {
    const total = profiles.length;
    const living = profiles.filter(p => p.lifeStatus === 'living').length;
    const memorial = profiles.filter(p => p.lifeStatus === 'memorial').length;
    const historical = profiles.filter(p => p.lifeStatus === 'historical').length;
    
    // Average story completion progress
    const totalProgress = profiles.reduce((sum, p) => sum + p.storyProgress, 0);
    const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;

    return { total, living, memorial, historical, avgProgress };
  }, [profiles]);

  // Handle Profile selection for detailed overview
  const handleSelectProfile = (id: string) => {
    setSelectedProfileId(id);
    setActiveSubView('details');
  };

  // Action handlers
  const handleEditProfile = (id: string) => {
    setSelectedProfileId(id);
    setActiveSubView('edit');
  };

  const handleDuplicateProfile = (id: string) => {
    const original = profiles.find(p => p.id === id);
    if (!original) return;

    const copy: ExtendedLegacyProfile = {
      ...original,
      id: `profile-${Date.now()}`,
      firstName: `${original.firstName} (Copy)`,
      preferredName: `${original.preferredName} (Copy)`,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      storyProgress: 10, // reset completion progress for copy
    };

    const updated = [copy, ...profiles];
    saveToLocal(updated);
    showToast('success', 'Profile Cloned Successfully', `${original.preferredName} duplicate is ready in sandbox.`);
  };

  const handleDeleteProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;

    const confirmDelete = window.confirm(`Are you absolutely sure you want to permanently delete the Legacy Profile of ${target.preferredName}? This action is irreversible.`);
    if (confirmDelete) {
      const updated = profiles.filter(p => p.id !== id);
      saveToLocal(updated);
      setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
      showToast('error', 'Profile Permanently Deleted', `${target.preferredName} has been purged from workspace.`);
    }
  };

  const handleArchiveProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;

    const updated = profiles.map(p => p.id === id ? { ...p, status: 'archived' as const } : p);
    saveToLocal(updated);
    showToast('info', 'Profile Archived Successfully', `${target.preferredName} has been sent to system storage.`);
  };

  // Bulk actions
  const handleBulkArchive = () => {
    if (selectedRowIds.length === 0) return;
    const updated = profiles.map(p => selectedRowIds.includes(p.id) ? { ...p, status: 'archived' as const } : p);
    saveToLocal(updated);
    showToast('info', 'Profiles Archived', `${selectedRowIds.length} profiles have been archived successfully.`);
    setSelectedRowIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedRowIds.length === 0) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedRowIds.length} selected legacy profiles?`);
    if (confirmDelete) {
      const updated = profiles.filter(p => !selectedRowIds.includes(p.id));
      saveToLocal(updated);
      showToast('error', 'Profiles Deleted', `${selectedRowIds.length} profiles have been removed.`);
      setSelectedRowIds([]);
    }
  };

  // Create wizard finish callback
  const handleCreateWizardSave = (newProfile: ExtendedLegacyProfile) => {
    const updated = [newProfile, ...profiles];
    saveToLocal(updated);
    ActivityService.logActivity(
      'Legacy Profile Created',
      `Legacy profile for ${newProfile.firstName} ${newProfile.lastName} has been successfully registered.`,
      'bg-emerald-500'
    ).catch(err => console.warn('Failed to log profile creation activity', err));
    setActiveSubView('catalog');
  };

  // Edit form save callback
  const handleEditSave = (updatedProfile: ExtendedLegacyProfile) => {
    const updated = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    saveToLocal(updated);
    setActiveSubView('catalog');
  };

  // Filter & Sort Logic
  const filteredAndSortedProfiles = useMemo(() => {
    return profiles
      .filter((p) => {
        const fullName = `${p.firstName} ${p.lastName} ${p.preferredName || ''} ${p.nickname || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.lastName.localeCompare(b.lastName);
        }
        if (sortBy === 'progress') {
          return b.storyProgress - a.storyProgress;
        }
        // Default: Recently updated
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
  }, [profiles, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Find selected profile reference for detail/edit views
  const selectedProfile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId);
  }, [profiles, selectedProfileId]);

  const [isSticky, setIsSticky] = useState(false);

  React.useEffect(() => {
    const viewport = document.getElementById('workspace-viewport');
    if (!viewport) return;

    const handleScroll = () => {
      setIsSticky(viewport.scrollTop > 200);
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="legacy-profiles-module-root" className="space-y-6 animate-fade-in text-foreground pb-12 pt-2.5 md:pt-4 lg:pt-5">
      
      {/* Subview Transition Orchestration */}
      {activeSubView === 'create-wizard' && (
        <ProfileWizard
          onClose={() => setActiveSubView('catalog')}
          onSave={handleCreateWizardSave}
        />
      )}

      {activeSubView === 'details' && selectedProfile && (
        <ProfileDetails
          profile={selectedProfile}
          onBack={() => setActiveSubView('catalog')}
          onEdit={() => setActiveSubView('edit')}
        />
      )}

      {activeSubView === 'edit' && selectedProfile && (
        <ProfileEdit
          profile={selectedProfile}
          onCancel={() => setActiveSubView('catalog')}
          onSave={handleEditSave}
        />
      )}

      {activeSubView === 'catalog' && (
        <div className="space-y-6" id="profiles-catalog-view-root">
          {/* Header Title Card */}
          <div className={`p-6 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300 ${resolvedTheme === 'light' ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-cinema-amber-500/20' : ''}`} id="catalog-header-title-row">
            {/* Subtle background gradient and lighting */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-cinema-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <h2 className="font-display text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                  <Users className="w-5.5 h-5.5 text-cinema-amber-500 animate-pulse" /> Legacy Profiles
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-2xl font-medium">
                  Manage, catalog, and explore biographical archives representing your ancestors and family heritage.
                </p>
              </div>

              <Button
                id="btn-create-profile-trigger"
                variant="accent"
                size="sm"
                leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
                onClick={() => setActiveSubView('create-wizard')}
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold self-start md:self-auto shadow-sm hover:scale-105 transition-all"
              >
                Create Legacy Profile
              </Button>
            </div>
          </div>

          {/* Statistics Dashboard Banner Row */}
          <MetricsGrid
            id="stats-dashboard-banner"
            metrics={[
              {
                id: 'stat-card-total',
                label: 'Total Profiles',
                value: stats.total,
                subValue: 'Active',
                subValueColor: 'text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10',
              },
              {
                id: 'stat-card-living',
                label: 'Living Members',
                value: stats.living,
                subValue: 'Autobios',
                subValueColor: 'text-indigo-500 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10',
              },
              {
                id: 'stat-card-memorial',
                label: 'In Memorial',
                value: stats.memorial,
                subValue: 'Tributes',
                subValueColor: 'text-rose-500 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10',
              },
              {
                id: 'stat-card-historical',
                label: 'Historical',
                value: stats.historical,
                subValue: 'Legends',
                subValueColor: 'text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-mono',
              },
              {
                id: 'stat-card-progress',
                label: 'Avg Story Completion',
                value: `${stats.avgProgress}%`,
                isAccent: true,
                icon: TrendingUp,
                iconClassName: 'text-cinema-amber-500 animate-pulse',
                className: 'col-span-2 md:col-span-1',
              }
            ]}
          />

          {/* Sticky Filtering Control Bar wrapper */}
          <div 
            className={`sticky top-0 z-30 transition-all duration-300 ${
              isSticky 
                ? 'bg-background/95 backdrop-blur-md py-3 border-b border-border/10 shadow-sm' 
                : 'bg-transparent py-3 border-b border-transparent'
            }`} 
            id="profiles-sticky-filters-container"
          >
            {/* Filtering Control Bar */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm transition-all duration-300 ${resolvedTheme === 'light' ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-cinema-amber-500/20' : ''}`} id="controls-panel-container">
              {/* Left side: search input */}
              <SearchInput
                id="search-profiles-input"
                placeholder="Search profile by name, nickname..."
                value={searchQuery}
                onChange={setSearchQuery}
              />

              {/* Middle: Selection filters */}
              <div className="flex flex-wrap items-center gap-3" id="filters-triggers-group">
                {/* Category Filter dropdown */}
                <FilterDropdown
                  id="category-filter-dropdown"
                  label="Cat:"
                  value={categoryFilter}
                  options={[
                    { value: 'all', label: 'All Blueprints' },
                    { value: 'personal', label: 'Personal' },
                    { value: 'autobiography', label: 'Autobiography' },
                    { value: 'memorial', label: 'Memorial' },
                    { value: 'celebration', label: 'Celebration of Life' },
                    { value: 'career', label: 'Career Journey' },
                    { value: 'family-history', label: 'Family History' },
                    { value: 'historical-figure', label: 'Historical Figure' }
                  ]}
                  onChange={setCategoryFilter}
                />

                {/* Status Filter dropdown */}
                <FilterDropdown
                  id="status-filter-dropdown"
                  label="Status:"
                  value={statusFilter}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' },
                    { value: 'archived', label: 'Archived' }
                  ]}
                  onChange={setStatusFilter}
                />

                {/* Sort selector dropdown */}
                <FilterDropdown
                  id="sort-filter-dropdown"
                  label="Sort:"
                  value={sortBy}
                  options={[
                    { value: 'updated', label: 'Recently Updated' },
                    { value: 'name', label: 'Name A–Z' },
                    { value: 'progress', label: 'Completion %' }
                  ]}
                  onChange={(val) => setSortBy(val as any)}
                />
              </div>

              {/* Right side: Single View Mode Toggle */}
              <ViewModeToggle
                id="btn-view-mode-toggle"
                viewMode={viewMode}
                onChange={setViewMode}
                className="shrink-0"
              />
            </div>
          </div>

          {/* Bulk Selection Operations Action Bar */}
          {selectedRowIds.length > 0 && viewMode === 'list' && (
            <BulkOperationsBar
              id="bulk-operations-bar"
              selectedCount={selectedRowIds.length}
              labelText={`${selectedRowIds.length} Selected Profile records`}
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

          {/* RENDER GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6" id="profiles-grid-canvas">
              {filteredAndSortedProfiles.map((p) => {
                const birthYr = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 'N/A';
                const deathYr = p.dateOfDeath ? new Date(p.dateOfDeath).getFullYear() : '';
                const lifeSpan = deathYr ? `${birthYr} – ${deathYr}` : `${birthYr} – Present`;
                
                return (
                  <div
                    key={p.id}
                    id={`profile-grid-card-${p.id}`}
                    className="group border border-border bg-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all h-[300px]"
                  >
                    {/* Cover photo block */}
                    <div className="h-20 w-full relative shrink-0 bg-muted">
                      <img src={p.coverPhoto} alt={`${p.preferredName} cover`} className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Relationship badge top-left overlay */}
                      <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[9px] font-bold bg-black/50 text-white border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {p.relationship}
                      </span>

                      {/* Dropdown menu trigger top-right overlay */}
                      <div className="absolute top-2.5 right-2.5">
                        <KebabMenu
                          id={`profile-${p.id}`}
                          items={[
                            { id: `dropdown-action-view-${p.id}`, label: 'View Profile', onClick: () => handleSelectProfile(p.id), icon: <Eye className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-edit-${p.id}`, label: 'Edit Profile', onClick: () => handleEditProfile(p.id), icon: <FileText className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-clone-${p.id}`, label: 'Duplicate', onClick: () => handleDuplicateProfile(p.id), icon: <Copy className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-archive-${p.id}`, label: 'Archive', onClick: () => handleArchiveProfile(p.id), icon: <Archive className="w-3.5 h-3.5 text-muted-foreground" /> },
                            { id: `dropdown-action-delete-${p.id}`, label: 'Delete', onClick: () => handleDeleteProfile(p.id), isDestructive: true, hasDividerBefore: true, icon: <Trash2 className="w-3.5 h-3.5 text-red-500" /> },
                          ]}
                          dropdownClassName="w-40"
                        />
                      </div>
                    </div>

                    {/* Avatar overlapping cover photo */}
                    <div className="px-4 relative -mt-5 flex items-end justify-between shrink-0" id={`avatar-overlapping-${p.id}`}>
                      <div className="relative w-11 h-11 rounded-full border-2 border-card overflow-hidden bg-muted shadow-sm">
                        <img src={p.profilePhoto} alt={p.preferredName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      
                      {/* Completion progress badge */}
                      <span className="text-[9px] font-bold font-mono text-cinema-amber-700 bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full">
                        {p.storyProgress}% Complete
                      </span>
                    </div>

                    {/* Middle: Details body */}
                    <div className="px-4 py-2.5 flex-grow flex flex-col justify-between min-h-0 overflow-hidden" id={`card-details-middle-${p.id}`}>
                      <div className="min-h-0 overflow-hidden">
                        <h4 className="font-display font-bold text-xs text-foreground truncate group-hover:text-cinema-amber-600 dark:group-hover:text-cinema-amber-400 transition-colors">
                          {p.preferredName}
                        </h4>
                        <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{lifeSpan}</p>
                        
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mt-1.5 font-medium">
                          {p.biographySummary || 'A beautifully catalogued biographical template pending detailed storytelling milestones.'}
                        </p>
                      </div>

                      {/* Stat counters */}
                      <div className="flex items-center gap-4 pt-2 border-t border-border mt-2 shrink-0" id={`card-stats-row-${p.id}`}>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>{p.timelineEventsCount} Milestones</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>{p.mediaCount} Media</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="px-4 py-2 border-t border-sidebar-border bg-sidebar/45 flex items-center justify-between shrink-0" id={`card-footer-action-row-${p.id}`}>
                      <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-1.5 py-0.5 rounded ${
                        p.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {p.status}
                      </span>

                      <Button
                        id={`btn-open-detail-${p.id}`}
                        onClick={() => handleSelectProfile(p.id)}
                        variant="ghost"
                        size="xs"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5 text-foreground" />}
                        className="text-[10px] font-bold hover:bg-muted py-1 h-7"
                      >
                        Explore Legacy
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredAndSortedProfiles.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-4" id="empty-search-grid-state">
                  <EmptyState
                    type="search"
                    title="No Records Match Query"
                    description={`We couldn't locate any legacy archive items matching "${searchQuery}". Try modifying your active categories or text queries.`}
                    primaryActionLabel="Reset All Query Filters"
                    onPrimaryAction={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                  />
                </div>
              )}
            </div>
          )}

          {/* RENDER LIST VIEW TABLE */}
          {viewMode === 'list' && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="profiles-table-container">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="profiles-table">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="p-4 w-10">
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
                      <th className="p-4">Profile Ancestor</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Lifespan Timeline</th>
                      <th className="p-4">Workflow Status</th>
                      <th className="p-4">Story completion</th>
                      <th className="p-4">Vault Assets</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedProfiles.map((p) => {
                      const birthYr = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 'N/A';
                      const deathYr = p.dateOfDeath ? new Date(p.dateOfDeath).getFullYear() : '';
                      const lifeSpan = deathYr ? `${birthYr} – ${deathYr}` : `${birthYr} – Living`;
                      const isChecked = selectedRowIds.includes(p.id);

                      return (
                        <tr
                          key={p.id}
                          id={`profile-table-row-${p.id}`}
                          className={`border-b border-border text-xs hover:bg-muted/40 transition-colors ${isChecked ? 'bg-cinema-amber-500/5' : ''}`}
                        >
                          <td className="p-4">
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
                          <td className="p-4">
                            <button id={`btn-row-name-trigger-${p.id}`} onClick={() => handleSelectProfile(p.id)} className="flex items-center gap-3 cursor-pointer group text-left">
                              <img src={p.profilePhoto} className="w-9 h-9 rounded-full object-cover border border-border" alt={p.preferredName} referrerPolicy="no-referrer" />
                              <div>
                                <h4 className="font-bold text-foreground truncate group-hover:text-cinema-amber-600 dark:group-hover:text-cinema-amber-400 transition-colors">
                                  {p.preferredName}
                                </h4>
                                <span className="text-[10px] text-muted-foreground font-semibold">{p.relationship}</span>
                              </div>
                            </button>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                              {p.category.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-[10px] font-semibold text-foreground/80">{lifeSpan}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                              p.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-cinema-amber-500 rounded-full" style={{ width: `${p.storyProgress}%` }} />
                              </div>
                              <span className="font-mono text-[10px] font-bold text-foreground/75">{p.storyProgress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                              <span title="Timeline events">{p.timelineEventsCount}M</span>
                              <span>•</span>
                              <span title="Uploaded media">{p.mediaCount}P</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button id={`btn-row-explore-${p.id}`} onClick={() => handleSelectProfile(p.id)} variant="ghost" size="xs" className="p-1.5 border border-border">
                                Explore
                              </Button>
                              <Button id={`btn-row-edit-${p.id}`} onClick={() => handleEditProfile(p.id)} variant="ghost" size="xs" className="p-1.5 border border-border">
                                Edit
                              </Button>
                              <Button id={`btn-row-delete-${p.id}`} onClick={() => handleDeleteProfile(p.id)} variant="ghost" size="xs" className="p-1.5 text-red-500 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredAndSortedProfiles.length === 0 && (
                      <tr id="empty-search-table-state">
                        <td colSpan={8} className="py-16">
                          <EmptyState
                            type="search"
                            title="No Records Found"
                            description="We couldn't locate any archives matching your search constraints."
                            primaryActionLabel="Reset All Filters"
                            onPrimaryAction={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
