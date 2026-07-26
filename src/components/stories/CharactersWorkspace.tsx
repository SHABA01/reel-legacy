/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Link2,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Grid,
  List,
  Sparkles,
  Star,
  Clock,
  Film,
  Camera,
  Calendar,
  X,
  ChevronRight,
  Check,
  BookOpen,
  Tag,
  BarChart2,
  UserCheck,
  Info,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { SearchInput } from '../ui/SearchInput';
import { ViewModeToggle } from '../ui/ViewModeToggle';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { persistenceService } from '../../storage';
import { INITIAL_PROFILES, ExtendedLegacyProfile } from '../profiles/mockData';

export interface CharacterRelationship {
  characterId: string;
  characterName: string;
  relationType: string;
}

export interface StoryCharacter {
  id: string;
  storyId: string;
  legacyProfileId?: string;
  name: string;
  storyRole: string; // e.g. Main Subject, Parent, Spouse, Child, Sibling, Friend, Colleague, Mentor, Community Member, Historical Figure, Interviewee, Narrator
  relationship: string; // e.g. Parent, Spouse, Child, Sibling, Friend, Colleague, Mentor, Relative, Historical Connection
  importance: 'High' | 'Medium' | 'Low';
  avatar: string;
  shortBio: string;
  notes?: string;
  tags?: string[];
  lifetime?: string; // e.g. 1912 – 1994
  status: 'Active' | 'Draft' | 'Archived';
  relationships?: CharacterRelationship[];
  timelineReferences: string[];
  mediaReferences: string[];
  scenesCount?: number;
  quotesCount?: number;
  narrationSegmentsCount?: number;
  estimatedScreenTime?: string;
  narrativeWeight?: number; // 0 - 100
}

interface CharactersWorkspaceProps {
  storyId: string;
  storyTitle: string;
  characters: StoryCharacter[];
  onUpdateCharacters: (updatedCharacters: StoryCharacter[]) => void;
  timelineEvents?: any[];
  mediaItems?: any[];
  onSelectCharacter?: (character: StoryCharacter) => void;
  selectedCharacterId?: string;
  showToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
];

export function CharactersWorkspace({
  storyId,
  storyTitle,
  characters,
  onUpdateCharacters,
  timelineEvents = [],
  mediaItems = [],
  onSelectCharacter,
  selectedCharacterId,
  showToast,
}: CharactersWorkspaceProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [importanceFilter, setImportanceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [featureFilter, setFeatureFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'reference' | 'create'>('reference');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditingCharacter, setActiveEditingCharacter] = useState<Partial<StoryCharacter> | null>(null);

  // Master Legacy Profiles state for reference
  const [masterProfiles, setMasterProfiles] = useState<ExtendedLegacyProfile[]>([]);
  const [masterProfileSearch, setMasterProfileSearch] = useState('');

  // Delete confirmation hook
  const deleteConfirmation = useDeleteConfirmation<StoryCharacter>();

  // Load master profiles when modal opens
  useEffect(() => {
    async function loadMasterProfiles() {
      try {
        const stored = await persistenceService.profiles.getAll();
        if (stored && stored.length > 0) {
          setMasterProfiles(stored as any);
        } else {
          setMasterProfiles(INITIAL_PROFILES);
        }
      } catch (err) {
        setMasterProfiles(INITIAL_PROFILES);
      }
    }
    loadMasterProfiles();
  }, [isAddModalOpen]);

  // Form State for Create Story-only Character
  const [newCharForm, setNewCharForm] = useState<Partial<StoryCharacter>>({
    name: '',
    storyRole: 'Family Member',
    relationship: 'Relative',
    importance: 'Medium',
    lifetime: '',
    avatar: PRESET_AVATARS[0],
    shortBio: '',
    notes: '',
    tags: [],
    status: 'Active',
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Handle Create Character Submit
  const handleCreateStoryCharacter = () => {
    if (!newCharForm.name?.trim()) {
      showToast('error', 'Validation Error', 'Character display name is required.');
      return;
    }

    const createdChar: StoryCharacter = {
      id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      storyId,
      name: newCharForm.name.trim(),
      storyRole: newCharForm.storyRole || 'Family Member',
      relationship: newCharForm.relationship || 'Relative',
      importance: (newCharForm.importance as any) || 'Medium',
      avatar: newCharForm.avatar || PRESET_AVATARS[0],
      shortBio: newCharForm.shortBio || 'Participant in this documentary story.',
      notes: newCharForm.notes || '',
      tags: newCharForm.tags || [],
      lifetime: newCharForm.lifetime || '',
      status: (newCharForm.status as any) || 'Active',
      relationships: [],
      timelineReferences: [],
      mediaReferences: [],
      scenesCount: 1,
      quotesCount: 0,
      narrationSegmentsCount: 1,
      estimatedScreenTime: '3m 30s',
      narrativeWeight: 60,
    };

    const updated = [...characters, createdChar];
    onUpdateCharacters(updated);
    setIsAddModalOpen(false);
    showToast('success', 'Story Character Created', `Added "${createdChar.name}" to this Story Project.`);

    // Reset form
    setNewCharForm({
      name: '',
      storyRole: 'Family Member',
      relationship: 'Relative',
      importance: 'Medium',
      lifetime: '',
      avatar: PRESET_AVATARS[0],
      shortBio: '',
      notes: '',
      tags: [],
      status: 'Active',
    });
  };

  // Handle Reference Existing Legacy Profile
  const handleReferenceLegacyProfile = (profile: ExtendedLegacyProfile) => {
    // Check if already referenced
    const alreadyExists = characters.find(
      (c) => c.legacyProfileId === profile.id || c.name.toLowerCase() === `${profile.firstName} ${profile.lastName}`.toLowerCase()
    );

    if (alreadyExists) {
      showToast('warning', 'Already Referenced', `"${profile.firstName} ${profile.lastName}" is already in this Story Project.`);
      return;
    }

    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const createdChar: StoryCharacter = {
      id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      storyId,
      legacyProfileId: profile.id,
      name: fullName,
      storyRole: profile.relationship || 'Main Subject',
      relationship: profile.relationship || 'Self',
      importance: 'High',
      avatar: profile.profilePhoto || PRESET_AVATARS[0],
      shortBio: profile.biographySummary || `${fullName} is referenced from the Master Legacy Profile database.`,
      notes: `Referenced from master profile ${profile.id}`,
      tags: profile.tags || ['Master Profile Linked'],
      lifetime: profile.dateOfBirth ? `${profile.dateOfBirth.slice(0, 4)} – ${profile.dateOfDeath ? profile.dateOfDeath.slice(0, 4) : 'Present'}` : '',
      status: 'Active',
      relationships: [],
      timelineReferences: [],
      mediaReferences: [],
      scenesCount: profile.timelineEventsCount || 2,
      quotesCount: 1,
      narrationSegmentsCount: 2,
      estimatedScreenTime: '8m 15s',
      narrativeWeight: 85,
    };

    const updated = [...characters, createdChar];
    onUpdateCharacters(updated);
    setIsAddModalOpen(false);
    showToast('success', 'Legacy Profile Referenced', `Successfully linked "${fullName}" to this Story Project.`);
  };

  // Handle Edit Character Save
  const handleSaveEditedCharacter = () => {
    if (!activeEditingCharacter?.id || !activeEditingCharacter.name?.trim()) {
      showToast('error', 'Validation Error', 'Character name cannot be blank.');
      return;
    }

    const updated = characters.map((c) =>
      c.id === activeEditingCharacter.id ? ({ ...c, ...activeEditingCharacter } as StoryCharacter) : c
    );

    onUpdateCharacters(updated);
    setIsEditModalOpen(false);
    setActiveEditingCharacter(null);
    showToast('success', 'Character Updated', 'Story character details saved successfully.');
  };

  // Handle Delete Character
  const handleConfirmDeleteCharacter = () => {
    if (!deleteConfirmation.item) return;

    const updated = characters.filter((c) => c.id !== deleteConfirmation.item?.id);
    onUpdateCharacters(updated);
    showToast('info', 'Character Removed', `Removed "${deleteConfirmation.item.name}" from this Story Project.`);

    deleteConfirmation.closeDelete();
  };

  // Filtered master profiles for reference tab
  const filteredMasterProfiles = useMemo(() => {
    const q = masterProfileSearch.toLowerCase().trim();
    if (!q) return masterProfiles;
    return masterProfiles.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        (p.relationship && p.relationship.toLowerCase().includes(q)) ||
        (p.biographySummary && p.biographySummary.toLowerCase().includes(q))
    );
  }, [masterProfiles, masterProfileSearch]);

  // Filtered and sorted characters list
  const filteredCharacters = useMemo(() => {
    let list = [...characters];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.storyRole.toLowerCase().includes(q) ||
          c.relationship.toLowerCase().includes(q) ||
          c.shortBio.toLowerCase().includes(q) ||
          c.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Role filter
    if (roleFilter !== 'All') {
      if (roleFilter === 'Family') {
        list = list.filter((c) => ['Parent', 'Spouse', 'Child', 'Sibling', 'Relative', 'Family Member'].includes(c.storyRole) || ['Parent', 'Spouse', 'Child', 'Sibling'].includes(c.relationship));
      } else {
        list = list.filter((c) => c.storyRole === roleFilter || c.relationship === roleFilter);
      }
    }

    // Importance filter
    if (importanceFilter !== 'All') {
      list = list.filter((c) => c.importance === importanceFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter((c) => c.status === statusFilter);
    }

    // Feature filter
    if (featureFilter === 'Has Timeline Events') {
      list = list.filter((c) => (c.timelineReferences?.length || 0) > 0);
    } else if (featureFilter === 'Has Media') {
      list = list.filter((c) => (c.mediaReferences?.length || 0) > 0);
    } else if (featureFilter === 'Has Scenes') {
      list = list.filter((c) => (c.scenesCount || 0) > 0);
    }

    return list;
  }, [characters, searchQuery, roleFilter, importanceFilter, statusFilter, featureFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6 w-full" id="pane-characters">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="w-5 h-5 text-cinema-amber-500" /> Story Characters Workspace
            </h3>
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-2 py-0.5 rounded border border-cinema-amber-500/30 uppercase">
              {characters.length} CHARACTERS
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Manage everyone participating in this documentary project. Characters reference master Legacy Profiles or exist as story-specific participants without modifying the master profile database.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setAddModalTab('reference');
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 bg-muted hover:bg-card border border-border text-foreground font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            id="btn-reference-legacy-profile"
          >
            <Link2 className="w-4 h-4 text-cinema-amber-500" />
            Reference Legacy Profile
          </button>
          <button
            onClick={() => {
              setAddModalTab('create');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
            id="btn-add-story-character"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Character
          </button>
        </div>
      </div>

      {/* TOOLBAR & FILTERS BAR */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-muted/40 p-3 rounded-2xl border border-border/80">
        {/* Search Input */}
        <SearchInput
          id="characters-search-input"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search characters by name, role, tags..."
          className="w-full lg:w-72"
        />

        {/* Dropdown Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {/* Role Filter */}
          <Select
            id="filter-character-role"
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'Main Subject', label: 'Main Subject' },
              { value: 'Family', label: 'Family Members' },
              { value: 'Parent', label: 'Parents' },
              { value: 'Spouse', label: 'Spouse' },
              { value: 'Child', label: 'Children' },
              { value: 'Colleague', label: 'Colleagues' },
              { value: 'Friend', label: 'Friends' },
              { value: 'Interviewee', label: 'Interviewees' },
              { value: 'Narrator', label: 'Narrators' },
            ]}
            className="w-36"
          />

          {/* Importance Filter */}
          <Select
            id="filter-character-importance"
            value={importanceFilter}
            onChange={(val) => setImportanceFilter(val)}
            options={[
              { value: 'All', label: 'All Importance' },
              { value: 'High', label: 'High Weight' },
              { value: 'Medium', label: 'Medium Weight' },
              { value: 'Low', label: 'Low Weight' },
            ]}
            className="w-36"
          />

          {/* Status Filter */}
          <Select
            id="filter-character-status"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active Story' },
              { value: 'Draft', label: 'Draft / Planned' },
              { value: 'Archived', label: 'Archived' },
            ]}
            className="w-32"
          />

          {/* View Mode Toggle */}
          <ViewModeToggle
            id="characters-view-mode-toggle"
            viewMode={viewMode}
            onChange={setViewMode}
          />
        </div>
      </div>

      {/* CHARACTER CARDS LIST / GRID */}
      {filteredCharacters.length === 0 ? (
        <div className="py-16 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-card/25 text-center p-6" id="characters-empty-placeholder">
          <EmptyState
            type="stories"
            title="No Story Characters Found"
            description="Story Characters organize everyone involved in this documentary project—from family members and friends to historical figures and interviewees."
            primaryActionLabel="Reference Legacy Profile"
            onPrimaryAction={() => {
              setAddModalTab('reference');
              setIsAddModalOpen(true);
            }}
            secondaryActionLabel="Create Story Character"
            onSecondaryAction={() => {
              setAddModalTab('create');
              setIsAddModalOpen(true);
            }}
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="characters-grid-mesh">
          {filteredCharacters.map((char) => {
            const isSelected = selectedCharacterId === char.id;
            const isMasterLinked = !!char.legacyProfileId;

            return (
              <div
                key={char.id}
                id={`character-card-${char.id}`}
                onClick={() => onSelectCharacter && onSelectCharacter(char)}
                className={`group p-5 bg-card border rounded-2xl cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isSelected
                    ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500 bg-cinema-amber-500/[0.03]'
                    : 'border-border hover:border-cinema-amber-500/40'
                }`}
              >
                {/* Top Badge Overlay */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-muted shadow-sm group-hover:border-cinema-amber-500 transition-colors"
                        referrerPolicy="no-referrer"
                      />
                      {isMasterLinked && (
                        <div
                          className="absolute -bottom-1 -right-1 p-1 bg-cinema-amber-500 text-black rounded-full border border-background shadow-xs"
                          title="Master Legacy Profile Linked"
                        >
                          <Link2 className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                        {char.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className="text-[9px] font-mono font-bold uppercase bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30 px-1.5 py-0.2 rounded">
                          {char.storyRole}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase bg-muted text-muted-foreground border border-border px-1.5 py-0.2 rounded">
                          {char.relationship}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Importance Badge */}
                  <span
                    className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      char.importance === 'High'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : char.importance === 'Medium'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {char.importance} Priority
                  </span>
                </div>

                {/* Short Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold line-clamp-2">
                  {char.shortBio}
                </p>

                {/* Narrative Metrics Bar */}
                <div className="pt-3 border-t border-border/60 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-muted-foreground font-bold">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cinema-amber-500" />
                      <span>{char.timelineReferences?.length || 0} Milestones</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-blue-400" />
                      <span>{char.mediaReferences?.length || 0} Photos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Film className="w-3 h-3 text-emerald-400" />
                      <span>{char.scenesCount || 1} Scenes</span>
                    </div>
                  </div>

                  {/* Narrative Weight Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                      <span className="text-muted-foreground uppercase">Narrative Screen Weight</span>
                      <span className="text-cinema-amber-500">{char.narrativeWeight || 65}%</span>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="bg-cinema-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${char.narrativeWeight || 65}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 text-xs border-t border-border/40 text-muted-foreground">
                  <span className="text-[10px] font-mono font-semibold">
                    {char.lifetime ? `Lifespan: ${char.lifetime}` : 'Story Participant'}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setActiveEditingCharacter(char);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1 hover:text-foreground hover:bg-muted rounded transition-colors"
                      title="Edit Story Character"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        deleteConfirmation.requestDelete(
                          char,
                          'Remove Story Character',
                          `Are you sure you want to remove "${char.name}" from this Story Project? This action removes the character from this story without deleting any master Legacy Profile.`
                        )
                      }
                      className="p-1 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove Character"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="characters-table-wrapper">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="characters-table">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  <th className="p-4">Character Name</th>
                  <th className="p-4">Story Role</th>
                  <th className="p-4">Relationship</th>
                  <th className="p-4">Importance</th>
                  <th className="p-4">Milestones</th>
                  <th className="p-4">Media</th>
                  <th className="p-4">Master Profile</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharacters.map((char) => {
                  const isSelected = selectedCharacterId === char.id;
                  return (
                    <tr
                      key={char.id}
                      onClick={() => onSelectCharacter && onSelectCharacter(char)}
                      className={`border-b border-border/60 text-xs hover:bg-muted/30 cursor-pointer transition-colors ${
                        isSelected ? 'bg-cinema-amber-500/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={char.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-foreground block">{char.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{char.lifetime || 'Participant'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30 px-2 py-0.5 rounded">
                          {char.storyRole}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground font-semibold">{char.relationship}</td>
                      <td className="p-4">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                            char.importance === 'High'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : char.importance === 'Medium'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {char.importance}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-muted-foreground">{char.timelineReferences?.length || 0}</td>
                      <td className="p-4 font-mono font-bold text-muted-foreground">{char.mediaReferences?.length || 0}</td>
                      <td className="p-4">
                        {char.legacyProfileId ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <Link2 className="w-3 h-3" /> Linked
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-muted-foreground">Story Only</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setActiveEditingCharacter(char);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1 hover:text-foreground hover:bg-muted rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              deleteConfirmation.requestDelete(
                                char,
                                'Remove Story Character',
                                `Are you sure you want to remove "${char.name}" from this Story Project? This action removes the character from this story without deleting any master Legacy Profile.`
                              )
                            }
                            className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* ADD CHARACTER MODAL (Option 1: Reference Legacy Profile, Option 2: Create Story-Only) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Character to Story Project"
        size="lg"
      >
        <div className="space-y-5">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setAddModalTab('reference')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                addModalTab === 'reference'
                  ? 'border-cinema-amber-500 text-cinema-amber-500 font-black'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Link2 className="w-4 h-4" /> Option 1: Reference Legacy Profile (Recommended)
            </button>
            <button
              onClick={() => setAddModalTab('create')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                addModalTab === 'create'
                  ? 'border-cinema-amber-500 text-cinema-amber-500 font-black'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Option 2: Create Story-Only Character
            </button>
          </div>

          {/* TAB 1: REFERENCE LEGACY PROFILE */}
          {addModalTab === 'reference' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reference an existing profile from ReelLegacy's master database. The profile will be linked to this documentary project without modifying its master record.
              </p>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search master profiles..."
                  value={masterProfileSearch}
                  onChange={(e) => setMasterProfileSearch(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-cinema-amber-500 font-medium"
                />
              </div>

              {/* Profiles Grid */}
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredMasterProfiles.map((p) => {
                  const isAlreadyReferenced = characters.some(
                    (c) => c.legacyProfileId === p.id || c.name.toLowerCase() === `${p.firstName} ${p.lastName}`.toLowerCase()
                  );

                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-card border border-border hover:border-cinema-amber-500/50 rounded-xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.profilePhoto}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-border"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-foreground">
                            {p.firstName} {p.lastName}
                          </h5>
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            {p.relationship} • {p.category}
                          </span>
                        </div>
                      </div>

                      {isAlreadyReferenced ? (
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-1 rounded border border-border flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500" /> Already Added
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReferenceLegacyProfile(p)}
                          className="px-3 py-1.5 bg-cinema-amber-500 hover:bg-cinema-amber-400 text-black font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Reference
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE STORY-ONLY CHARACTER */}
          {addModalTab === 'create' && (
            <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1 custom-scrollbar">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create a participant or historical figure specific to this story project. Useful for interviewees, community members, or historical figures who do not require a full master profile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clara Jenkins"
                    value={newCharForm.name || ''}
                    onChange={(e) => setNewCharForm({ ...newCharForm, name: e.target.value })}
                    className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                  />
                </div>

                {/* Story Role */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Story Role</label>
                  <select
                    value={newCharForm.storyRole || 'Family Member'}
                    onChange={(e) => setNewCharForm({ ...newCharForm, storyRole: e.target.value })}
                    className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                  >
                    <option value="Main Subject">Main Subject</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Community Member">Community Member</option>
                    <option value="Historical Figure">Historical Figure</option>
                    <option value="Interviewee">Interviewee</option>
                    <option value="Narrator">Narrator</option>
                  </select>
                </div>

                {/* Relationship to Main Subject */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Relationship to Main Subject</label>
                  <select
                    value={newCharForm.relationship || 'Relative'}
                    onChange={(e) => setNewCharForm({ ...newCharForm, relationship: e.target.value })}
                    className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                  >
                    <option value="Self">Self / Main Subject</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Relative">Relative</option>
                    <option value="Historical Connection">Historical Connection</option>
                  </select>
                </div>

                {/* Importance */}
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Story Narrative Importance</label>
                  <select
                    value={newCharForm.importance || 'Medium'}
                    onChange={(e) => setNewCharForm({ ...newCharForm, importance: e.target.value as any })}
                    className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                  >
                    <option value="High">High (Key Screen Time)</option>
                    <option value="Medium">Medium (Supporting Role)</option>
                    <option value="Low">Low (Background / Mention)</option>
                  </select>
                </div>

                {/* Lifespan */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-foreground block mb-1">Lifespan / Dates (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1912 – 1994 or 1982 – Present"
                    value={newCharForm.lifetime || ''}
                    onChange={(e) => setNewCharForm({ ...newCharForm, lifetime: e.target.value })}
                    className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                  />
                </div>

                {/* Preset Avatars */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-foreground block">Select Avatar Image</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_AVATARS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt=""
                        onClick={() => setNewCharForm({ ...newCharForm, avatar: url })}
                        className={`w-10 h-10 rounded-full object-cover border-2 cursor-pointer transition-all ${
                          newCharForm.avatar === url ? 'border-cinema-amber-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>

                {/* Short Biography */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-foreground block mb-1">Short Story Biography</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of who this person is and their relevance to this story..."
                    value={newCharForm.shortBio || ''}
                    onChange={(e) => setNewCharForm({ ...newCharForm, shortBio: e.target.value })}
                    className="w-full p-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <button
                  onClick={handleCreateStoryCharacter}
                  className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-400 text-black font-bold text-xs rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  Create Story Character
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* EDIT CHARACTER DETAILS MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={activeEditingCharacter ? `Edit Story Character: ${activeEditingCharacter.name}` : 'Edit Character'}
        size="lg"
      >
        {activeEditingCharacter && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Display Name</label>
                <input
                  type="text"
                  value={activeEditingCharacter.name || ''}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, name: e.target.value })}
                  className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Story Role</label>
                <input
                  type="text"
                  value={activeEditingCharacter.storyRole || ''}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, storyRole: e.target.value })}
                  className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Relationship to Main Subject</label>
                <input
                  type="text"
                  value={activeEditingCharacter.relationship || ''}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, relationship: e.target.value })}
                  className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Narrative Importance</label>
                <select
                  value={activeEditingCharacter.importance || 'Medium'}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, importance: e.target.value as any })}
                  className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">Lifespan / Dates</label>
                <input
                  type="text"
                  value={activeEditingCharacter.lifetime || ''}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, lifetime: e.target.value })}
                  className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">Short Story Biography</label>
                <textarea
                  rows={3}
                  value={activeEditingCharacter.shortBio || ''}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, shortBio: e.target.value })}
                  className="w-full p-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">Story Notes (Internal)</label>
                <textarea
                  rows={2}
                  value={activeEditingCharacter.notes || ''}
                  onChange={(e) => setActiveEditingCharacter({ ...activeEditingCharacter, notes: e.target.value })}
                  className="w-full p-3 bg-muted border border-border text-foreground text-xs rounded-xl focus:outline-none focus:border-cinema-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <button
                onClick={handleSaveEditedCharacter}
                className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-400 text-black font-bold text-xs rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRMATION MODAL FOR DELETION */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.closeDelete}
        onConfirm={handleConfirmDeleteCharacter}
        title={deleteConfirmation.title}
        message={deleteConfirmation.message}
        confirmLabel="Remove Character"
        isDestructive={true}
      />
    </div>
  );
}
