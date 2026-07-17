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
  MoreVertical,
  Users,
  BookOpen,
  Heart,
  Calendar,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../context/ToastContext';
import { INITIAL_PROFILES, ExtendedLegacyProfile } from './mockData';
import { ProfileWizard } from './ProfileWizard';
import { ProfileDetails } from './ProfileDetails';
import { ProfileEdit } from './ProfileEdit';
import { persistenceService, ActivityService } from '../../storage';

export function ProfilesView() {
  const { showToast } = useToast();

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
  
  // Card action dropdown states
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

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
    setActiveDropdownId(null);
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
    setActiveDropdownId(null);
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
    setActiveDropdownId(null);
  };

  const handleArchiveProfile = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;

    const updated = profiles.map(p => p.id === id ? { ...p, status: 'archived' as const } : p);
    saveToLocal(updated);
    showToast('info', 'Profile Archived Successfully', `${target.preferredName} has been sent to system storage.`);
    setActiveDropdownId(null);
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

  return (
    <div id="legacy-profiles-module-root" className="h-full w-full overflow-y-auto px-6 py-6 space-y-6">
      
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4" id="catalog-header-title-row">
            <div>
              <h2 className="font-display text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-cinema-amber-500" /> Legacy Profiles
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage, catalog, and explore biographical archives representing your ancestors and family heritage.
              </p>
            </div>

            <Button
              id="btn-create-profile-trigger"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
              onClick={() => setActiveSubView('create-wizard')}
              className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold self-start md:self-auto shadow-sm"
            >
              Create Legacy Profile
            </Button>
          </div>

          {/* Statistics Dashboard Banner Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="stats-dashboard-banner">
            <div className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between h-24 shadow-sm" id="stat-card-total">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">Total Profiles</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-2xl text-foreground">{stats.total}</span>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">Active</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between h-24 shadow-sm" id="stat-card-living">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">Living Members</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-2xl text-foreground">{stats.living}</span>
                <span className="text-[10px] text-indigo-500 font-bold bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10">Autobios</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between h-24 shadow-sm" id="stat-card-memorial">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">In Memorial</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-2xl text-foreground">{stats.memorial}</span>
                <span className="text-[10px] text-rose-500 font-bold bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">Tributes</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between h-24 shadow-sm" id="stat-card-historical">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">Historical</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-2xl text-foreground">{stats.historical}</span>
                <span className="text-[10px] text-amber-500 font-bold bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 font-mono">Legends</span>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-cinema-amber-500/5 border border-cinema-amber-500/10 flex flex-col justify-between h-24 shadow-sm" id="stat-card-progress">
              <span className="text-[10px] text-cinema-amber-800 dark:text-cinema-amber-300 font-mono uppercase tracking-wider block">Avg Story Completion</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display font-black text-2xl text-cinema-amber-600 dark:text-cinema-amber-400">{stats.avgProgress}%</span>
                <TrendingUp className="w-4 h-4 text-cinema-amber-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Filtering Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-card border border-border rounded-2xl" id="controls-panel-container">
            {/* Left side: search input */}
            <div className="flex items-center gap-2 flex-grow max-w-md relative" id="search-bar-container">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-profiles-input"
                type="text"
                placeholder="Search ancestry by name, nickname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-muted absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Middle: Selection filters */}
            <div className="flex flex-wrap items-center gap-3" id="filters-triggers-group">
              {/* Category Filter dropdown */}
              <div className="flex items-center gap-1 bg-muted px-2.5 py-1.5 rounded-lg border border-border text-xs" id="category-filter-dropdown-block">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Cat:</span>
                <select
                  id="category-filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-foreground font-semibold focus:outline-none focus:ring-0 text-xs border-none p-0 cursor-pointer"
                >
                  <option value="all">All Blueprints</option>
                  <option value="personal">Personal</option>
                  <option value="autobiography">Autobiography</option>
                  <option value="memorial">Memorial</option>
                  <option value="celebration">Celebration of Life</option>
                  <option value="career">Career Journey</option>
                  <option value="family-history">Family History</option>
                  <option value="historical-figure">Historical Figure</option>
                </select>
              </div>

              {/* Status Filter dropdown */}
              <div className="flex items-center gap-1 bg-muted px-2.5 py-1.5 rounded-lg border border-border text-xs" id="status-filter-dropdown-block">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Status:</span>
                <select
                  id="status-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-foreground font-semibold focus:outline-none focus:ring-0 text-xs border-none p-0 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Sort selector dropdown */}
              <div className="flex items-center gap-1 bg-muted px-2.5 py-1.5 rounded-lg border border-border text-xs" id="sort-filter-dropdown-block">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Sort:</span>
                <select
                  id="sort-filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-foreground font-semibold focus:outline-none focus:ring-0 text-xs border-none p-0 cursor-pointer"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="name">Name A–Z</option>
                  <option value="progress">Completion %</option>
                </select>
              </div>
            </div>

            {/* Right side: View toggles (Grid vs List) */}
            <div className="flex items-center border border-border rounded-xl p-0.5" id="view-mode-toggles-block">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cinema-amber-500 text-slate-950 font-black' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-list"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-cinema-amber-500 text-slate-950 font-black' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk Selection Operations Action Bar */}
          {selectedRowIds.length > 0 && viewMode === 'list' && (
            <div className="p-3 bg-muted border border-border rounded-xl flex items-center justify-between animate-fade-in" id="bulk-operations-bar">
              <span className="text-xs font-semibold text-foreground">
                {selectedRowIds.length} Selected Profile records
              </span>

              <div className="flex items-center gap-2">
                <Button
                  id="btn-bulk-archive"
                  variant="ghost"
                  size="sm"
                  leftIcon={<Archive className="w-4 h-4 text-muted-foreground" />}
                  onClick={handleBulkArchive}
                  className="text-xs hover:bg-card border border-border"
                >
                  Archive Selected
                </Button>
                <Button
                  id="btn-bulk-delete"
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                  onClick={handleBulkDelete}
                  className="text-xs hover:bg-card hover:text-red-400 border border-border text-red-500"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* RENDER GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="profiles-grid-canvas">
              {filteredAndSortedProfiles.map((p) => {
                const birthYr = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 'N/A';
                const deathYr = p.dateOfDeath ? new Date(p.dateOfDeath).getFullYear() : '';
                const lifeSpan = deathYr ? `${birthYr} – ${deathYr}` : `${birthYr} – Present`;
                
                return (
                  <div
                    key={p.id}
                    id={`profile-grid-card-${p.id}`}
                    className="group border border-border bg-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all h-[360px]"
                  >
                    {/* Cover photo block */}
                    <div className="h-24 w-full relative shrink-0 bg-muted">
                      <img src={p.coverPhoto} alt={`${p.preferredName} cover`} className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Relationship badge top-left overlay */}
                      <span className="absolute top-3 left-3 inline-flex items-center text-[9px] font-bold bg-black/50 text-white border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {p.relationship}
                      </span>

                      {/* Dropdown menu trigger top-right overlay */}
                      <div className="absolute top-3 right-3">
                        <button
                          id={`dropdown-trigger-${p.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === p.id ? null : p.id);
                          }}
                          className="p-1 rounded-lg bg-black/40 text-white/80 hover:text-white hover:bg-black/60 cursor-pointer backdrop-blur-sm"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Action Dropdown Menu Overlay */}
                        {activeDropdownId === p.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-xl shadow-lg py-1 z-20 text-left" id={`action-dropdown-${p.id}`}>
                            <button
                              id={`dropdown-action-view-${p.id}`}
                              onClick={() => { handleSelectProfile(p.id); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2 text-xs text-foreground hover:bg-muted font-semibold text-left flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> View Profile
                            </button>
                            <button
                              id={`dropdown-action-edit-${p.id}`}
                              onClick={() => handleEditProfile(p.id)}
                              className="w-full px-4 py-2 text-xs text-foreground hover:bg-muted font-semibold text-left flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> Edit Profile
                            </button>
                            <button
                              id={`dropdown-action-clone-${p.id}`}
                              onClick={() => handleDuplicateProfile(p.id)}
                              className="w-full px-4 py-2 text-xs text-foreground hover:bg-muted font-semibold text-left flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> Duplicate
                            </button>
                            <button
                              id={`dropdown-action-archive-${p.id}`}
                              onClick={() => handleArchiveProfile(p.id)}
                              className="w-full px-4 py-2 text-xs text-foreground hover:bg-muted font-semibold text-left flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> Archive
                            </button>
                            <div className="border-t border-border my-1" />
                            <button
                              id={`dropdown-action-delete-${p.id}`}
                              onClick={() => handleDeleteProfile(p.id)}
                              className="w-full px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold text-left flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-red-500" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Avatar overlapping cover photo */}
                    <div className="px-5 relative -mt-6 flex items-end justify-between shrink-0" id={`avatar-overlapping-${p.id}`}>
                      <div className="relative w-14 h-14 rounded-full border-2 border-card overflow-hidden bg-muted shadow-sm">
                        <img src={p.profilePhoto} alt={p.preferredName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      
                      {/* Completion progress badge */}
                      <span className="text-[9px] font-bold font-mono text-cinema-amber-700 bg-cinema-amber-500/10 border border-cinema-amber-500/20 px-2 py-0.5 rounded-full">
                        {p.storyProgress}% Complete
                      </span>
                    </div>

                    {/* Middle: Details body */}
                    <div className="px-5 py-4 flex-grow flex flex-col justify-between" id={`card-details-middle-${p.id}`}>
                      <div>
                        <h4 className="font-display font-bold text-sm text-foreground truncate group-hover:text-cinema-amber-600 dark:group-hover:text-cinema-amber-400 transition-colors">
                          {p.preferredName}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{lifeSpan}</p>
                        
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-2.5 font-medium">
                          {p.biographySummary || 'A beautifully catalogued biographical template pending detailed storytelling milestones.'}
                        </p>
                      </div>

                      {/* Stat counters */}
                      <div className="flex items-center gap-4 pt-3 border-t border-border mt-3" id={`card-stats-row-${p.id}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>{p.timelineEventsCount} Milestones</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>{p.mediaCount} Media</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="px-5 py-3 border-t border-sidebar-border bg-sidebar/45 flex items-center justify-between shrink-0" id={`card-footer-action-row-${p.id}`}>
                      <span className={`inline-flex items-center text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
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
                        className="text-[10px] font-bold hover:bg-muted"
                      >
                        Explore Legacy
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredAndSortedProfiles.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-4" id="empty-search-grid-state">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-cinema-amber-500 mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">No Records Match Query</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                      We couldn't locate any legacy archive items matching "{searchQuery}". Try modifying your active categories or text queries.
                    </p>
                  </div>
                  <Button id="btn-clear-grid-search" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }} variant="secondary" size="sm" className="text-xs">
                    Reset All Query Filters
                  </Button>
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
                        <td colSpan={8} className="py-16 text-center space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-cinema-amber-500 mx-auto mb-3">
                            <Search className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">No Records Found</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                              We couldn't locate any archives matching your search constraints.
                            </p>
                          </div>
                          <Button id="btn-clear-table-search" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }} variant="secondary" size="sm" className="text-xs mt-3">
                            Reset All Filters
                          </Button>
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
