/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InspectorTagBadges, InspectorActions } from './InspectorEntityCard';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  BookOpen,
  Users,
  Film,
  Sparkles,
  Layers,
  FileText,
  Calendar,
  Heart,
  AlertCircle,
  Search,
  Globe,
  Lock,
  Eye,
  Award,
  GraduationCap,
  Gift,
  UploadCloud,
  Palette,
  Wand2,
  Smile,
  Video,
  Camera,
  Mic,
  Sliders,
  CheckSquare,
  HelpCircle,
  Undo2,
  Redo2,
  MessageSquare,
  Share2,
  ExternalLink,
  Link2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  Trash2,
  Copy,
  Edit2,
  Plus,
  FolderOpen,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  CheckCircle,
  Save,
  Loader2,
  Filter,
  RefreshCw,
  CornerDownRight,
  FileSpreadsheet,
  Archive,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Star,
  ListFilter,
  Brain
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PromptModal } from '../ui/PromptModal';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';
import { useInspector } from '../../context/InspectorContext';
import { ExtendedStory } from './mockStoriesData';
import { StoryStudioModeNav, StoryStudioMode, mapSectionToMode } from './StoryStudioModeNav';
import { StoryCastMode } from './modes/StoryCastMode';
import { ScenesMediaMode } from './modes/ScenesMediaMode';
import { AudioMusicMode } from './modes/AudioMusicMode';
import { PreviewExportMode } from './modes/PreviewExportMode';
import { StoryWizard } from './StoryWizard';
import { CharactersWorkspace, StoryCharacter } from './CharactersWorkspace';
import { ScenesWorkspace, StoryScene } from './ScenesWorkspace';
import { PreviewWorkspace } from './PreviewWorkspace';
import { RenderWorkspace } from './RenderWorkspace';
import { ScriptStudio } from './scripts/ScriptStudio';
import { CapCutTimeline } from './timeline/CapCutTimeline';
import { AIDirectorPanel } from './director/AIDirectorPanel';
import { LegacyIntelligencePanel } from './intelligence/LegacyIntelligencePanel';
import { TimelineService, persistenceService, MediaService, DocumentService, DocumentSchema, ImportSchema, ImportService, LegacyProfileSchema, StorySchema, StoryService } from '../../storage';

interface StoryWorkspaceProps {
  story: ExtendedStory;
  onClose: () => void;
  onSave: (updatedStory: ExtendedStory) => void;
}

// Sub-interfaces for detailed workspace state
interface LocalTimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'Childhood' | 'Education' | 'Career' | 'Family' | 'Milestone' | 'Retirement' | 'Historical';
  importance: 'High' | 'Medium' | 'Low';
  location?: string;
  associatedMediaIds: string[];
  associatedPeopleIds: string[];
}

interface LocalMediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  category: 'Photo' | 'Clip' | 'Oral Record' | 'Letter' | 'Certificate' | 'Official';
  title: string;
  size: string;
  uploadDate: string;
  status: 'Ready' | 'Needs Scanning' | 'Flagged';
  tags: string[];
  url: string;
  duration?: string;
  linkedEvents: string[];
  linkedChapters: string[];
  favorite: boolean;
}

interface LocalPerson {
  id: string;
  name: string;
  relationship: 'Parent' | 'Child' | 'Spouse' | 'Sibling' | 'Friend' | 'Colleague' | 'Mentor' | 'Teacher';
  avatar: string;
  shortBio: string;
  lifetime: string;
  timelineReferences: string[];
  mediaReferences: string[];
  email?: string;
}

interface LocalDocument {
  id: string;
  title: string;
  category: 'Resume' | 'Certificate' | 'Letter' | 'Diary' | 'Article' | 'Scanned Record';
  citationPrefix: string;
  dateStr: string;
  fileSize: string;
  isScanned: boolean;
  notes: string;
  tags: string[];
}

export function StoryWorkspace({ story: initialStory, onClose, onSave }: StoryWorkspaceProps) {
  const { showToast } = useToast();

  const [isCreationWizardOpen, setIsCreationWizardOpen] = useState<boolean>(false);

  // Dynamic Workspace delete and rename modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string;
    type: 'document' | 'import' | 'timeline' | 'media';
    title: string;
    message: string;
  }>({
    isOpen: false,
    id: '',
    type: 'document',
    title: '',
    message: '',
  });

  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    id: string;
    type: 'media';
    title: string;
    defaultValue: string;
  }>({
    isOpen: false,
    id: '',
    type: 'media',
    title: '',
    defaultValue: '',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const { setBreadcrumbs } = useBreadcrumbs();

  const modeParam = searchParams.get('mode');
  const initialSectionParam = searchParams.get('section') || searchParams.get('tab');

  const [activeMode, setActiveMode] = useState<StoryStudioMode>(() => {
    if (modeParam && ['story_cast', 'scenes_media', 'audio_music', 'preview_export'].includes(modeParam)) {
      return modeParam as StoryStudioMode;
    }
    if (initialSectionParam) {
      return mapSectionToMode(initialSectionParam);
    }
    return 'story_cast';
  });

  const [activeSection, setActiveSection] = useState<string>(() => {
    if (initialSectionParam) {
      if (initialSectionParam === 'story') return 'info';
      if (initialSectionParam === 'characters') return 'people';
      if (initialSectionParam === 'assets') return 'media';
      return initialSectionParam;
    }
    if (modeParam === 'scenes_media') return 'scenes';
    if (modeParam === 'audio_music') return 'narration';
    if (modeParam === 'preview_export') return 'preview';
    return 'overview';
  });

  // Keep state in sync with URL search params changes (e.g. Browser Back / Forward)
  useEffect(() => {
    const currentMode = searchParams.get('mode');
    const currentSection = searchParams.get('section') || searchParams.get('tab');
    if (currentMode && ['story_cast', 'scenes_media', 'audio_music', 'preview_export'].includes(currentMode)) {
      setActiveMode((prev) => (prev !== currentMode ? (currentMode as StoryStudioMode) : prev));
    } else if (currentSection) {
      const derived = mapSectionToMode(currentSection);
      setActiveMode((prev) => (prev !== derived ? derived : prev));
    }
    if (currentSection) {
      let resolved = currentSection;
      if (currentSection === 'story') resolved = 'info';
      if (currentSection === 'characters') resolved = 'people';
      if (currentSection === 'assets') resolved = 'media';
      setActiveSection((prev) => (prev !== resolved ? resolved : prev));
    }
  }, [searchParams]);

  const handleModeChange = useCallback((newMode: StoryStudioMode) => {
    setActiveMode(newMode);
    let targetSection = 'overview';
    if (newMode === 'story_cast') targetSection = 'overview';
    else if (newMode === 'scenes_media') targetSection = 'scenes';
    else if (newMode === 'audio_music') targetSection = 'narration';
    else if (newMode === 'preview_export') targetSection = 'preview';

    setActiveSection(targetSection);
    setSearchParams({ id: initialStory.id, mode: newMode, section: targetSection });
  }, [initialStory.id, setSearchParams]);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Sync breadcrumbs with active section and story project title
  useEffect(() => {
    const handleBackClick = () => {
      onCloseRef.current?.();
    };

    const modeLabels: Record<StoryStudioMode, string> = {
      story_cast: 'Story & Cast',
      scenes_media: 'Scenes & Media',
      audio_music: 'Audio & Music',
      preview_export: 'Preview & Export',
    };

    const sectionLabelMap: Record<string, string> = {
      overview: 'Overview',
      story: 'Story Info',
      info: 'Story Info',
      biography: 'Biography',
      timeline: 'Chronology',
      scripts: 'Script Blueprint',
      script: 'Script Blueprint',
      characters: 'Characters',
      people: 'Characters',
      assets: 'Media Assets',
      media: 'Media Assets',
      documents: 'Source Documents',
      scenes: 'Scenes',
      narration: 'Narration',
      music: 'Soundtrack & Music',
      preview: 'Live Preview',
      render: 'Render & Export',
    };

    const sectionLabel = sectionLabelMap[activeSection] || 'Overview';
    const modeLabel = modeLabels[activeMode] || 'Story & Cast';

    setBreadcrumbs([
      {
        label: 'Story Studio',
        onClick: handleBackClick,
      },
      {
        label: initialStory.title || 'Untitled Story',
        onClick: () => {
          handleModeChange('story_cast');
        },
      },
      {
        label: modeLabel,
        onClick: () => {
          setSearchParams({ id: initialStory.id, mode: activeMode, section: activeSection });
        },
      },
      ...(activeSection !== 'overview' && activeSection !== 'scenes' && activeSection !== 'narration' && activeSection !== 'preview'
        ? [
            {
              label: sectionLabel,
            },
          ]
        : []),
    ]);
  }, [activeMode, activeSection, initialStory.title, initialStory.id, setBreadcrumbs, setSearchParams, handleModeChange]);

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState<boolean>(false);
  const [isRightInspectorCollapsed, setIsRightInspectorCollapsed] = useState<boolean>(false);
  
  const { setSelection, openInspector, closeInspector, isInspectorOpen } = useInspector();

  // Selected item inside workspaces which populates the dynamic right inspector
  const [selectedInspectorItem, setSelectedInspectorItem] = useState<{
    type: 'story' | 'timeline' | 'media' | 'person' | 'document' | 'import';
    id: string;
    data: any;
  }>({
    type: 'story',
    id: initialStory.id,
    data: initialStory
  });

  // Synchronize selection with global Context Engine
  useEffect(() => {
    if (selectedInspectorItem) {
      const typeMap: Record<string, any> = {
        person: 'character',
        story: 'story',
        timeline: 'timeline',
        media: 'media',
        document: 'document',
        import: 'import',
      };
      const targetType = typeMap[selectedInspectorItem.type] || 'story';
      setSelection(targetType, selectedInspectorItem.data, { id: selectedInspectorItem.id });
    }
  }, [selectedInspectorItem, setSelection]);

  // 2. SAVING & TRANSACTION STATE
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Unsaved Changes' | 'Saving...'>('Saved');
  const [lastSaved, setLastSaved] = useState<string>(() => {
    const time = new Date();
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // 3. EDITABLE LOCAL STATE COPIED FROM INITIAL STORY & RE-COMPUTED OR MERGED
  const [storyMeta, setStoryMeta] = useState({
    title: initialStory.title,
    subtitle: initialStory.subtitle,
    description: initialStory.description,
    language: 'English',
    visibility: 'Private',
    internalNotes: 'No notes logged.'
  });

  // 4. BIOGRAPHY STATE
  const [biographyText, setBiographyText] = useState<string>(() => {
    return localStorage.getItem(`rl_biography_${initialStory.id}`) || 
      `Elizabeth Vance was born in coastal Maine during the early autumn of 1944. Raised by two public school educators, she discovered a lifetime passion for historical literature and watercolor painting at a very young age.\n\nAfter graduating with honors from Mount Holyoke College in 1966, she married Philip Vance and moved to Salem, Massachusetts. There, she established the Salem Literacy Center, guiding over three thousand adult learners over a span of four decades. Her legacy is defined by quiet commitment to education, persistent faith in community collaboration, and her signature vibrant watercolor landscapes.`;
  });
  const [biographySummary, setBiographySummary] = useState<string>(
    'Retired public school administrator, Salem Literacy Center founder, and landscape watercolorist.'
  );
  const [keyFacts, setKeyFacts] = useState<string[]>([
    'Born October 14, 1944 in Portland, Maine',
    'Graduated Magna Cum Laude from Mount Holyoke College (1966)',
    'Established Salem Literacy Center in 1974',
    'Recipient of Massachusetts Lifetime Educational Service Medal (2008)',
    'Retired to Cape Cod in 2011 to paint coastal landscapes'
  ]);
  const [factInput, setFactInput] = useState<string>('');

  // 5. TIMELINE EVENTS STATE (User-created only, persists in storage repository)
  const [timelineEvents, setTimelineEvents] = useState<LocalTimelineEvent[]>([]);
  const [timelineStats, setTimelineStats] = useState({
    total: 0,
    milestones: 0,
    yearsCovered: 'No events',
    recentlyUpdated: [] as any[],
    draft: 0,
    archived: 0
  });

  // Search, Filters and Sort order states
  const [timelineSearchQuery, setTimelineSearchQuery] = useState<string>('');
  const [timelineCategoryFilter, setTimelineCategoryFilter] = useState<string>('All');
  const [timelineStatusFilter, setTimelineStatusFilter] = useState<string>('Active');
  const [timelineSortOrder, setTimelineSortOrder] = useState<'asc' | 'desc' | 'title' | 'importance'>('asc');
  const [timelineViewMode, setTimelineViewMode] = useState<'chrono' | 'group-year' | 'group-decade' | 'milestones' | 'multitrack' | 'intelligence' | 'director'>('multitrack');

  const handleRefreshTimeline = async () => {
    try {
      const events = await persistenceService.timeline.getByStoryId(initialStory.id);
      
      const mapped: LocalTimelineEvent[] = events.map(evt => ({
        id: evt.id,
        year: evt.year,
        title: evt.title,
        description: evt.description,
        category: (evt.category || 'Milestone') as any,
        importance: (evt.importance || 'Medium') as any,
        location: evt.location || '',
        associatedMediaIds: evt.mediaIds || [],
        associatedPeopleIds: evt.peopleInvolved || [],
        status: evt.status || 'Active'
      }));
      
      setTimelineEvents(mapped);
      
      const stats = await TimelineService.getStatistics(undefined, initialStory.id);
      setTimelineStats({
        total: stats.total,
        milestones: stats.milestones,
        yearsCovered: stats.yearsCovered,
        recentlyUpdated: stats.recentlyUpdated,
        draft: stats.draft,
        archived: stats.archived
      });
    } catch (err) {
      console.error('Failed to refresh timeline events', err);
    }
  };

  useEffect(() => {
    handleRefreshTimeline();
  }, [initialStory.id]);

  // Modal State for Timeline actions
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [timelineModalMode, setTimelineModalMode] = useState<'create' | 'edit'>('create');
  const [activeTimelineEvent, setActiveTimelineEvent] = useState<Partial<LocalTimelineEvent>>({});

  const filteredAndSortedEvents = useMemo(() => {
    let list = [...timelineEvents];

    // Search filter
    if (timelineSearchQuery.trim()) {
      const q = timelineSearchQuery.toLowerCase().trim();
      list = list.filter(evt =>
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        (evt.location && evt.location.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (timelineCategoryFilter !== 'All') {
      list = list.filter(evt => evt.category === timelineCategoryFilter);
    }

    // Status filter
    if (timelineStatusFilter === 'Active') {
      list = list.filter(evt => evt.status !== 'Archived');
    } else if (timelineStatusFilter === 'Draft') {
      list = list.filter(evt => evt.status === 'Draft');
    } else if (timelineStatusFilter === 'Archived') {
      list = list.filter(evt => evt.status === 'Archived');
    }

    // Sort
    list.sort((a, b) => {
      if (timelineSortOrder === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (timelineSortOrder === 'importance') {
        const priority = { High: 3, Medium: 2, Low: 1 };
        const pA = priority[a.importance || 'Medium'] || 2;
        const pB = priority[b.importance || 'Medium'] || 2;
        return pB - pA;
      }
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (timelineSortOrder === 'desc') {
        return yearB - yearA;
      }
      return yearA - yearB;
    });

    return list;
  }, [timelineEvents, timelineSearchQuery, timelineCategoryFilter, timelineStatusFilter, timelineSortOrder]);

  const eventsToRender = useMemo(() => {
    let list = [...filteredAndSortedEvents];
    if (timelineViewMode === 'milestones') {
      list = list.filter(evt => evt.category === 'Milestone' || evt.importance === 'High');
    }
    return list;
  }, [filteredAndSortedEvents, timelineViewMode]);

  const groupedByYear = useMemo(() => {
    const groups: { [year: string]: LocalTimelineEvent[] } = {};
    eventsToRender.forEach(evt => {
      const yr = evt.year || 'Unknown';
      if (!groups[yr]) groups[yr] = [];
      groups[yr].push(evt);
    });
    return groups;
  }, [eventsToRender]);

  const groupedByDecade = useMemo(() => {
    const groups: { [decade: string]: LocalTimelineEvent[] } = {};
    eventsToRender.forEach(evt => {
      const yr = parseInt(evt.year);
      let decade = 'Unknown Period';
      if (!isNaN(yr)) {
        const floorDecade = Math.floor(yr / 10) * 10;
        decade = `${floorDecade}s`;
      }
      if (!groups[decade]) groups[decade] = [];
      groups[decade].push(evt);
    });
    return groups;
  }, [eventsToRender]);

  // 6. MEDIA ITEMS STATE
  const [mediaItems, setMediaItems] = useState<LocalMediaItem[]>([]);

  const handleRefreshMedia = async () => {
    try {
      const allAssets = await persistenceService.media.getAll();
      const storyAssets = allAssets.filter((a: any) => a.linkedStoryId === initialStory.id);
      
      const mapped = storyAssets.map(asset => ({
        id: asset.id,
        type: asset.type,
        category: (asset.category === 'Family Photo' || asset.category === 'Portrait' || asset.category === 'Childhood') ? 'Photo' :
                  asset.category === 'Home Video' ? 'Clip' :
                  asset.category === 'Voice Recording' ? 'Oral Record' :
                  asset.category === 'Letter' ? 'Letter' :
                  asset.category === 'Certificate' ? 'Certificate' : 'Official' as const,
        title: asset.name,
        size: asset.size,
        uploadDate: asset.uploadDate,
        status: asset.status === 'Needs Metadata' ? 'Needs Scanning' : asset.status === 'Flagged' ? 'Flagged' : 'Ready' as const,
        tags: asset.tags || [],
        url: asset.thumbnailUrl || 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
        duration: asset.duration,
        linkedEvents: asset.linkedEvents || [],
        linkedChapters: asset.linkedChapters || [],
        favorite: !!asset.favorite
      }));
      setMediaItems(mapped);
    } catch (err) {
      console.error('Failed to load workspace media:', err);
    }
  };

  useEffect(() => {
    handleRefreshMedia();
  }, [initialStory.id]);

  const [mediaFilter, setMediaFilter] = useState<'All' | 'image' | 'video' | 'audio' | 'document'>('All');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');

  // 7. STORY CHARACTERS STATE
  const [characters, setCharacters] = useState<StoryCharacter[]>(() => {
    const cachedChar = localStorage.getItem(`rl_characters_${initialStory.id}`);
    if (cachedChar) {
      try { return JSON.parse(cachedChar); } catch (e) {}
    }
    const cachedPeople = localStorage.getItem(`rl_people_${initialStory.id}`);
    if (cachedPeople) {
      try {
        const parsed = JSON.parse(cachedPeople);
        return parsed.map((p: any) => ({
          id: p.id || `char-${Math.random()}`,
          storyId: initialStory.id,
          legacyProfileId: p.legacyProfileId,
          name: p.name,
          storyRole: p.relationship || 'Family Member',
          relationship: p.relationship || 'Relative',
          importance: p.importance || 'Medium',
          avatar: p.avatar,
          shortBio: p.shortBio || '',
          notes: p.notes || '',
          tags: p.tags || [],
          lifetime: p.lifetime || '',
          status: p.status || 'Active',
          timelineReferences: p.timelineReferences || [],
          mediaReferences: p.mediaReferences || [],
          scenesCount: 1,
          quotesCount: 0,
          narrationSegmentsCount: 1,
          estimatedScreenTime: '4m 00s',
          narrativeWeight: 70
        }));
      } catch (e) {}
    }

    return [
      {
        id: 'char-1',
        storyId: initialStory.id,
        name: 'Arthur Miller',
        storyRole: 'Parent',
        relationship: 'Parent',
        importance: 'High',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Public high school history master and vocational gardener. Inspiring source of Elizabeth’s academic interests.',
        lifetime: '1912 – 1994',
        status: 'Active',
        timelineReferences: ['evt-1'],
        mediaReferences: ['med-1'],
        scenesCount: 2,
        estimatedScreenTime: '5m 30s',
        narrativeWeight: 80
      },
      {
        id: 'char-2',
        storyId: initialStory.id,
        name: 'Martha Miller',
        storyRole: 'Parent',
        relationship: 'Parent',
        importance: 'High',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Elementary school reading specialist and local botanical artist. Taught Elizabeth basic watercolor wash rules.',
        lifetime: '1918 – 2002',
        status: 'Active',
        timelineReferences: ['evt-1'],
        mediaReferences: ['med-1'],
        scenesCount: 2,
        estimatedScreenTime: '4m 45s',
        narrativeWeight: 75
      },
      {
        id: 'char-3',
        storyId: initialStory.id,
        legacyProfileId: 'profile-philip-vance',
        name: 'Philip Vance',
        storyRole: 'Spouse',
        relationship: 'Spouse',
        importance: 'High',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Boston civic architect, structural historian, and lifelong supportive partner. Documented Cape Cod studio painting projects.',
        lifetime: '1942 – Present',
        status: 'Active',
        timelineReferences: ['evt-3', 'evt-5', 'evt-6'],
        mediaReferences: ['med-3', 'med-6'],
        scenesCount: 4,
        estimatedScreenTime: '12m 10s',
        narrativeWeight: 90
      },
      {
        id: 'char-4',
        storyId: initialStory.id,
        name: 'Clara Jenkins',
        storyRole: 'Colleague',
        relationship: 'Colleague',
        importance: 'Medium',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Co-Founder of Salem Literacy Center. Pioneered adult dyslexia tutoring resources in Massachusetts alongside Elizabeth.',
        lifetime: '1946 – Present',
        status: 'Active',
        timelineReferences: ['evt-4'],
        mediaReferences: ['med-4'],
        scenesCount: 2,
        estimatedScreenTime: '3m 15s',
        narrativeWeight: 60
      },
      {
        id: 'char-5',
        storyId: initialStory.id,
        name: 'Robert Vance',
        storyRole: 'Child',
        relationship: 'Child',
        importance: 'Medium',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Professional cellist and landscape photographer living in Maine. Active co-producer on this heritage documentary project.',
        lifetime: '1982 – Present',
        status: 'Active',
        timelineReferences: ['evt-5', 'evt-6'],
        mediaReferences: ['med-5', 'med-6'],
        scenesCount: 3,
        estimatedScreenTime: '6m 20s',
        narrativeWeight: 70
      }
    ];
  });

  // Backward compatibility alias for people
  const people = characters;
  const setPeople = setCharacters;

  const [peopleFilter, setPeopleFilter] = useState<string>('All');
  const [peopleSearchQuery, setPeopleSearchQuery] = useState<string>('');

  // 7. SCENES WORKSPACE STATE
  const [scenes, setScenes] = useState<StoryScene[]>(() => {
    const saved = localStorage.getItem(`rl_scenes_${initialStory.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    return [
      {
        id: 'scene-1',
        storyId: initialStory.id,
        sceneNumber: 1,
        title: 'Prologue: Heritage & Early Foundations',
        subtitle: 'Introduction to family lineage and ancestral roots',
        description: 'Establishes the heritage backdrop, introductory quotes, and ancestral roots before the main journey begins.',
        purpose: 'Set the emotional tone and historical context for the documentary.',
        storySegment: 'Opening Sequence',
        type: 'Title Card',
        estimatedDuration: '0m 45s',
        notes: 'Use historical sepia tone styling with gentle ambient guitar.',
        status: 'Ready',
        timelineEventIds: ['evt-1'],
        characterIds: ['char-1', 'char-2'],
        mediaIds: ['med-1', 'med-2'],
        narrationText: 'Every great story begins with roots. Before the journey unfolded, the foundation was laid by those who came before.',
        narrationStatus: 'Scripted',
        assignedVoice: 'Warm Legacy Memoirist (Deep Male)',
        estimatedReadingTime: '0m 45s',
        musicTrack: 'Orchestral Heritage (Strings & Piano)',
        musicMood: 'Warm & Intimate',
        musicVolume: 70,
        fadeIn: true,
        fadeOut: true,
        cameraMovement: 'Slow Ken Burns Pan',
        zoomStyle: 'Subtle (1.05x)',
        panDirection: 'Left to Right',
        focusPoint: 'Center',
        transitionType: 'Cross Dissolve'
      },
      {
        id: 'scene-2',
        storyId: initialStory.id,
        sceneNumber: 2,
        title: 'Formative Years & Early Mentors',
        subtitle: 'Childhood memories and guiding influences',
        description: 'Explores early childhood milestones, botanical watercolor lessons, and formative schooling.',
        purpose: 'Highlight key childhood figures who inspired Elizabeth’s academic and artistic path.',
        storySegment: 'Childhood & Roots',
        type: 'Documentary',
        estimatedDuration: '1m 30s',
        notes: 'Focus camera pan on vintage childhood family portraits.',
        status: 'Needs Media',
        timelineEventIds: ['evt-2', 'evt-3'],
        characterIds: ['char-1', 'char-2', 'char-3'],
        mediaIds: ['med-2', 'med-3'],
        narrationText: 'Growing up in Salem, early days were filled with curiosity, botanical sketches, and quiet lessons in history.',
        narrationStatus: 'Draft',
        assignedVoice: 'Warm Family Biographer (Gentle Female)',
        estimatedReadingTime: '1m 20s',
        musicTrack: 'Acoustic Nostalgia (Guitar)',
        musicMood: 'Reflective',
        musicVolume: 60,
        fadeIn: true,
        fadeOut: true,
        cameraMovement: 'Zoom In',
        zoomStyle: 'Medium (1.15x)',
        panDirection: 'Center In',
        focusPoint: 'Face Detect',
        transitionType: 'Cross Dissolve'
      },
      {
        id: 'scene-3',
        storyId: initialStory.id,
        sceneNumber: 3,
        title: 'Career Breakthrough & Literacy Center',
        subtitle: 'Founding Salem Literacy Center & adult education pioneer',
        description: 'Highlights the establishment of adult dyslexia tutoring resources and community leadership.',
        purpose: 'Showcase civic contribution and career achievements.',
        storySegment: 'Career & Breakthrough',
        type: 'Interview Cut',
        estimatedDuration: '2m 10s',
        notes: 'Pair soundbite interviews with archival news clippings.',
        status: 'Draft',
        timelineEventIds: ['evt-4'],
        characterIds: ['char-3', 'char-4'],
        mediaIds: ['med-4'],
        narrationText: 'In the heart of Massachusetts, a revolutionary effort took shape—bringing literacy and voice to hundreds.',
        narrationStatus: 'Scripted',
        assignedVoice: 'Documentary Broadcaster (Classic)',
        estimatedReadingTime: '2m 00s',
        musicTrack: 'Orchestral Heritage (Strings & Piano)',
        musicMood: 'Majestic & Emotional',
        musicVolume: 75,
        fadeIn: true,
        fadeOut: true,
        cameraMovement: 'Pan Right',
        zoomStyle: 'Subtle (1.05x)',
        panDirection: 'Left to Right',
        focusPoint: 'Center',
        transitionType: 'Fade to Black'
      },
      {
        id: 'scene-4',
        storyId: initialStory.id,
        sceneNumber: 4,
        title: 'Cape Cod Studio & Personal Turning Point',
        subtitle: 'Architectural history partnership and watercolor studio years',
        description: 'Captures the peaceful Cape Cod painting retreat, family gatherings, and historic preservation.',
        purpose: 'Provide personal depth and artistic serenity.',
        storySegment: 'Life Pivot & Turning Point',
        type: 'Photo Montage',
        estimatedDuration: '1m 45s',
        notes: 'Soft cross dissolve between Cape Cod watercolor paintings.',
        status: 'Ready',
        timelineEventIds: ['evt-5'],
        characterIds: ['char-3', 'char-5'],
        mediaIds: ['med-5'],
        narrationText: 'Between the salt marshes and the quiet studio light of Cape Cod, life found a harmonious balance.',
        narrationStatus: 'Synthesized',
        assignedVoice: 'Warm Legacy Memoirist (Deep Male)',
        estimatedReadingTime: '1m 40s',
        musicTrack: 'Golden Hour Piano (Solo)',
        musicMood: 'Nostalgic',
        musicVolume: 65,
        fadeIn: true,
        fadeOut: true,
        cameraMovement: 'Focus Drift',
        zoomStyle: 'Subtle (1.05x)',
        panDirection: 'Top to Bottom',
        focusPoint: 'Top Left',
        transitionType: 'Cross Dissolve'
      },
      {
        id: 'scene-5',
        storyId: initialStory.id,
        sceneNumber: 5,
        title: 'Epitaph & Lasting Heritage Legacy',
        subtitle: 'Closing summary and family co-producers',
        description: 'Summarizes the enduring influence on future generations, family cellist contributions, and memoir preservation.',
        purpose: 'Deliver an inspiring, high-impact emotional conclusion.',
        storySegment: 'Legacy & Reflections',
        type: 'Archival Spotlight',
        estimatedDuration: '1m 15s',
        notes: 'End with full family portrait and slow fade to dark slate.',
        status: 'Completed',
        timelineEventIds: ['evt-6'],
        characterIds: ['char-1', 'char-2', 'char-3', 'char-4', 'char-5'],
        mediaIds: ['med-6'],
        narrationText: 'The legacy lived on not only in books and paintings, but in the hearts and memories of family.',
        narrationStatus: 'Recorded',
        assignedVoice: 'Warm Legacy Memoirist (Deep Male)',
        estimatedReadingTime: '1m 15s',
        musicTrack: 'Orchestral Heritage (Strings & Piano)',
        musicMood: 'Majestic & Emotional',
        musicVolume: 80,
        fadeIn: true,
        fadeOut: true,
        cameraMovement: 'Slow Ken Burns Pan',
        zoomStyle: 'Dramatic (1.30x)',
        panDirection: 'Center In',
        focusPoint: 'Center',
        transitionType: 'Slow Hold'
      }
    ];
  });

  // 9. DOCUMENTS CATALOGUE STATE
  const [documents, setDocuments] = useState<DocumentSchema[]>([]);
  const [documentSearchQuery, setDocumentSearchQuery] = useState<string>('');
  const [documentFilter, setDocumentFilter] = useState<string>('All');
  const [documentSortBy, setDocumentSortBy] = useState<'recently-uploaded' | 'name' | 'size' | 'type'>('recently-uploaded');
  const [showArchivedDocs, setShowArchivedDocs] = useState<boolean>(false);

  const [previewDoc, setPreviewDoc] = useState<DocumentSchema | null>(null);
  const [isEditingDoc, setIsEditingDoc] = useState<boolean>(false);
  const [editDisplayName, setEditDisplayName] = useState<string>('');
  const [editDocumentType, setEditDocumentType] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');

  const handleOpenDocPreview = (doc: DocumentSchema) => {
    setPreviewDoc(doc);
    setIsEditingDoc(false);
    setEditDisplayName(doc.displayName);
    setEditDocumentType(doc.documentType);
    setEditDescription(doc.description || '');
    setEditTags((doc.tags || []).join(', '));
  };

  const handleSaveDocMetadata = async () => {
    if (!previewDoc) return;
    try {
      const parsedTags = editTags.split(',').map(t => t.trim()).filter(Boolean);
      await DocumentService.updateDocument(previewDoc.id, {
        displayName: editDisplayName,
        documentType: editDocumentType,
        description: editDescription,
        tags: parsedTags
      });
      showToast('success', 'Metadata Updated', 'The document credentials have been saved.');
      await handleRefreshDocuments();
      const updated = await persistenceService.documents.getById(previewDoc.id);
      if (updated) {
        setPreviewDoc(updated);
        if (selectedInspectorItem.type === 'document' && selectedInspectorItem.id === previewDoc.id) {
          setSelectedInspectorItem({ type: 'document', id: previewDoc.id, data: updated });
        }
      }
      setIsEditingDoc(false);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const [isDraggingDoc, setIsDraggingDoc] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDoc(true);
  };

  const handleDragLeave = () => {
    setIsDraggingDoc(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDoc(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setSaveStatus('Saving...');
    const fileList = Array.from(files) as File[];
    for (const file of fileList) {
      try {
        await DocumentService.processUpload(file, {
          profileId: initialStory.associatedProfileId || 'profile-default',
          storyId: initialStory.id,
          ownerId: 'user-1',
          categories: ['Archival']
        });
        showToast('success', 'Document Cataloged', `"${file.name}" integrated in database.`);
      } catch (err: any) {
        showToast('error', 'Upload Blocked', `"${file.name}": ${err.message}`);
      }
    }
    await handleRefreshDocuments();
    setSaveStatus('Saved');
  };

  const handleRefreshDocuments = async () => {
    try {
      const profileId = initialStory.associatedProfileId || 'profile-default';

      // Let's retrieve all documents for this profile using filter
      let results = await persistenceService.documents.filter({
        profileId,
        archived: showArchivedDocs,
        favorite: documentFilter === 'Favorites' ? true : undefined,
        documentType: (documentFilter !== 'All' && documentFilter !== 'Favorites' && documentFilter !== 'Archived') ? documentFilter : undefined
      });

      // Apply query search locally
      if (documentSearchQuery) {
        const query = documentSearchQuery.toLowerCase().trim();
        results = results.filter(doc =>
          doc.displayName.toLowerCase().includes(query) ||
          doc.originalFilename.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query)) ||
          doc.tags.some(t => t.toLowerCase().includes(query)) ||
          doc.categories.some(c => c.toLowerCase().includes(query))
        );
      }

      // Sort
      results = await persistenceService.documents.sort(documentSortBy, results);

      setDocuments(results);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  useEffect(() => {
    handleRefreshDocuments();
  }, [initialStory.associatedProfileId, initialStory.id, documentFilter, documentSortBy, showArchivedDocs, documentSearchQuery]);

  const handleToggleFavoriteDocument = async (id: string, fav: boolean) => {
    try {
      await DocumentService.favoriteDocument(id, fav);
      showToast('success', fav ? 'Added to Favorites' : 'Removed from Favorites');
      await handleRefreshDocuments();
    } catch (err: any) {
      showToast('error', 'Action Failed', err.message);
    }
  };

  const handleArchiveDocument = async (id: string) => {
    try {
      await DocumentService.archiveDocument(id);
      showToast('success', 'Document Archived', 'The file has been moved to the digital archive.');
      await handleRefreshDocuments();
    } catch (err: any) {
      showToast('error', 'Archive Failed', err.message);
    }
  };

  const handleRestoreDocument = async (id: string) => {
    try {
      await DocumentService.restoreDocument(id);
      showToast('success', 'Document Restored', 'The file is now active.');
      await handleRefreshDocuments();
    } catch (err: any) {
      showToast('error', 'Restore Failed', err.message);
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      type: 'document',
      title: 'Delete Document',
      message: 'Are you absolutely sure you want to permanently delete this document? This cannot be undone.',
    });
  };

  const handleRenameDocument = async (id: string, newName: string) => {
    try {
      await DocumentService.renameDocument(id, newName);
      showToast('success', 'Document Renamed');
      await handleRefreshDocuments();
    } catch (err: any) {
      showToast('error', 'Rename Failed', err.message);
    }
  };

  const documentsFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenDocumentUpload = () => {
    documentsFileInputRef.current?.click();
  };

  const handleDocumentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSaveStatus('Saving...');
    const fileList = Array.from(files) as File[];
    for (const file of fileList) {
      try {
        await DocumentService.processUpload(file, {
          profileId: initialStory.associatedProfileId || 'profile-default',
          storyId: initialStory.id,
          ownerId: 'user-1',
          categories: ['Archival']
        });
        showToast('success', 'Document Cataloged', `"${file.name}" integrated in database.`);
      } catch (err: any) {
        showToast('error', 'Upload Blocked', `"${file.name}": ${err.message}`);
      }
    }
    await handleRefreshDocuments();
    setSaveStatus('Saved');
  };

  // ==========================================
  // 10. RESUME & BIOGRAPHY IMPORTS STATE & LOGIC
  // ==========================================
  const [imports, setImports] = useState<ImportSchema[]>([]);
  const [profilesList, setProfilesList] = useState<LegacyProfileSchema[]>([]);
  const [storiesList, setStoriesList] = useState<StorySchema[]>([]);
  const [importSearchQuery, setImportSearchQuery] = useState<string>('');
  const [importFilter, setImportFilter] = useState<string>('All');
  const [importSortBy, setImportSortBy] = useState<'recently-imported' | 'name' | 'size' | 'type'>('recently-imported');
  const [showArchivedImports, setShowArchivedImports] = useState<boolean>(false);

  const [previewImport, setPreviewImport] = useState<ImportSchema | null>(null);
  const [isEditingImport, setIsEditingImport] = useState<boolean>(false);
  const [editImportName, setEditImportName] = useState<string>('');
  const [editImportType, setEditImportType] = useState<string>('');
  const [editImportProfileId, setEditImportProfileId] = useState<string>('');
  const [editImportStoryId, setEditImportStoryId] = useState<string>('');
  const [editImportDesc, setEditImportDesc] = useState<string>('');
  const [editImportTags, setEditImportTags] = useState<string>('');

  const [isDraggingImport, setIsDraggingImport] = useState<boolean>(false);
  const importsFileInputRef = useRef<HTMLInputElement>(null);

  const handleRefreshImports = async () => {
    try {
      const pList = await persistenceService.profiles.getAll();
      const sList = await persistenceService.stories.getAll();
      setProfilesList(pList);
      setStoriesList(sList);

      const profileId = initialStory.associatedProfileId || 'profile-default';

      let results = await persistenceService.imports.filter({
        archived: showArchivedImports,
        favorite: importFilter === 'Favorites' ? true : undefined,
        importType: (importFilter !== 'All' && importFilter !== 'Favorites' && importFilter !== 'Archived') ? importFilter : undefined
      });

      results = results.filter(imp => imp.profileId === profileId);

      if (importSearchQuery) {
        const query = importSearchQuery.toLowerCase().trim();
        results = results.filter(imp =>
          imp.displayName.toLowerCase().includes(query) ||
          imp.originalFilename.toLowerCase().includes(query) ||
          (imp.description && imp.description.toLowerCase().includes(query)) ||
          imp.tags.some(t => t.toLowerCase().includes(query)) ||
          imp.categories.some(c => c.toLowerCase().includes(query))
        );
      }

      results = await persistenceService.imports.sort(importSortBy, results);
      setImports(results);
    } catch (err) {
      console.error('Failed to load imports:', err);
    }
  };

  useEffect(() => {
    handleRefreshImports();
  }, [initialStory.associatedProfileId, initialStory.id, importFilter, importSortBy, showArchivedImports, importSearchQuery]);

  const handleToggleFavoriteImport = async (id: string, fav: boolean) => {
    try {
      await ImportService.favoriteImport(id, fav);
      showToast('success', fav ? 'Pinned as Highlight' : 'Unpinned from Highlights');
      await handleRefreshImports();
    } catch (err: any) {
      showToast('error', 'Action Failed', err.message);
    }
  };

  const handleArchiveImport = async (id: string) => {
    try {
      await ImportService.archiveImport(id);
      showToast('success', 'Import Record Archived', 'The file has been deposited in the archive vault.');
      await handleRefreshImports();
    } catch (err: any) {
      showToast('error', 'Archive Failed', err.message);
    }
  };

  const handleRestoreImport = async (id: string) => {
    try {
      await ImportService.restoreImport(id);
      showToast('success', 'Import Record Restored', 'The file is now active in the ledger workspace.');
      await handleRefreshImports();
    } catch (err: any) {
      showToast('error', 'Restore Failed', err.message);
    }
  };

  const handleDeleteImport = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      type: 'import',
      title: 'Delete Import Record',
      message: 'Are you absolutely sure you want to permanently delete this import record? This will purge all associated base64 local storage data and cannot be undone.',
    });
  };

  const handleOpenImportPreview = (imp: ImportSchema) => {
    setPreviewImport(imp);
    setIsEditingImport(false);
    setEditImportName(imp.displayName);
    setEditImportType(imp.importType);
    setEditImportProfileId(imp.profileId);
    setEditImportStoryId(imp.storyId || '');
    setEditImportDesc(imp.description || '');
    setEditImportTags((imp.tags || []).join(', '));
  };

  const handleSaveImportMetadata = async () => {
    if (!previewImport) return;
    try {
      const parsedTags = editImportTags.split(',').map(t => t.trim()).filter(Boolean);
      await ImportService.updateImport(previewImport.id, {
        displayName: editImportName,
        importType: editImportType,
        profileId: editImportProfileId,
        storyId: editImportStoryId || undefined,
        description: editImportDesc,
        tags: parsedTags
      });
      showToast('success', 'Import Credentials Adjusted', 'Metas and associations successfully synchronized.');
      await handleRefreshImports();
      const updated = await persistenceService.imports.getById(previewImport.id);
      if (updated) {
        setPreviewImport(updated);
      }
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleOpenImportUpload = () => {
    importsFileInputRef.current?.click();
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSaveStatus('Saving...');
    const fileList = Array.from(files) as File[];
    for (const file of fileList) {
      try {
        await ImportService.processUpload(file, {
          profileId: initialStory.associatedProfileId || 'profile-default',
          storyId: initialStory.id,
          ownerId: 'user-1'
        });
        showToast('success', 'Source File Indexed', `"${file.name}" integrated in database.`);
      } catch (err: any) {
        showToast('error', 'Upload Blocked', `"${file.name}": ${err.message}`);
      }
    }
    await handleRefreshImports();
    setSaveStatus('Saved');
  };

  const handleImportDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImport(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setSaveStatus('Saving...');
    const fileList = Array.from(files) as File[];
    for (const file of fileList) {
      try {
        await ImportService.processUpload(file, {
          profileId: initialStory.associatedProfileId || 'profile-default',
          storyId: initialStory.id,
          ownerId: 'user-1'
        });
        showToast('success', 'Source File Indexed', `"${file.name}" integrated in database.`);
      } catch (err: any) {
        showToast('error', 'Upload Blocked', `"${file.name}": ${err.message}`);
      }
    }
    await handleRefreshImports();
    setSaveStatus('Saved');
  };

  // Sync to database triggers (Local persistence fallback)

  useEffect(() => {
    localStorage.setItem(`rl_characters_${initialStory.id}`, JSON.stringify(characters));
    localStorage.setItem(`rl_people_${initialStory.id}`, JSON.stringify(characters));
  }, [characters, initialStory.id]);

  useEffect(() => {
    localStorage.setItem(`rl_scenes_${initialStory.id}`, JSON.stringify(scenes));
  }, [scenes, initialStory.id]);

  // Active sub-sections & Streamlined Top Horizontal Tabs
  const activeModeSubSections = useMemo(() => {
    switch (activeMode) {
      case 'story_cast':
        return [
          { id: 'overview', label: 'Overview', icon: Film },
          { id: 'info', label: 'Story & Tone', icon: BookOpen },
          { id: 'biography', label: 'Biography', icon: FileText },
          { id: 'timeline', label: 'Chronology', icon: Calendar },
          { id: 'scripts', label: 'Scripts', icon: FileText },
          { id: 'people', label: 'Characters', icon: Users },
        ];
      case 'scenes_media':
        return [
          { id: 'scenes', label: 'Storyboard Scenes', icon: Wand2 },
          { id: 'media', label: 'Media Library', icon: Camera },
          { id: 'documents', label: 'Source Documents', icon: FileSpreadsheet },
        ];
      case 'audio_music':
        return [
          { id: 'narration', label: 'Voice Narration', icon: Mic },
          { id: 'music', label: 'Soundtrack & Score', icon: Sliders },
        ];
      case 'preview_export':
        return [
          { id: 'preview', label: 'Interactive Preview', icon: Eye },
          { id: 'render', label: 'Render & Export', icon: Layers },
        ];
      default:
        return [];
    }
  }, [activeMode]);

  // REAL-TIME AUTO SAVE PROCESS
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSavePendingRef = useRef<boolean>(false);

  const saveWorkspaceDataImmediately = useCallback((
    metaToSave = storyMeta,
    bioToSave = biographyText,
    eventsToSave = timelineEvents
  ) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
    autoSavePendingRef.current = false;

    setSaveStatus('Saving...');

    // Save biography text
    localStorage.setItem(`rl_biography_${initialStory.id}`, bioToSave);

    // Reconstruct updated story structure
    const updatedStory: ExtendedStory = {
      ...initialStory,
      title: metaToSave.title,
      subtitle: metaToSave.subtitle,
      description: metaToSave.description,
      tags: [initialStory.category, metaToSave.visibility, 'Workspace'],
      mediaCount: mediaItems.length,
      timelineEventCount: eventsToSave.length,
      lastEdited: new Date().toISOString(),
      timelineEvents: eventsToSave.map(evt => ({
        id: evt.id,
        year: evt.year,
        title: evt.title,
        description: evt.description
      }))
    };

    onSave(updatedStory);
    const time = new Date();
    setLastSaved(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setSaveStatus('Saved');
  }, [initialStory, mediaItems.length, onSave, storyMeta, biographyText, timelineEvents]);

  const scheduleAutoSave = useCallback((
    metaToSave = storyMeta,
    bioToSave = biographyText,
    eventsToSave = timelineEvents
  ) => {
    autoSavePendingRef.current = true;
    setSaveStatus('Saving...');

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveWorkspaceDataImmediately(metaToSave, bioToSave, eventsToSave);
    }, 600);
  }, [saveWorkspaceDataImmediately, storyMeta, biographyText, timelineEvents]);

  // Unmount cleanup to flush pending auto-save immediately
  useEffect(() => {
    return () => {
      if (autoSavePendingRef.current) {
        saveWorkspaceDataImmediately();
      }
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [saveWorkspaceDataImmediately]);

  const triggerAutoSave = (updatedFields?: any) => {
    scheduleAutoSave(storyMeta, biographyText, timelineEvents);
  };

  const handleMetaChange = (field: string, value: string) => {
    const updatedMeta = { ...storyMeta, [field]: value };
    setStoryMeta(updatedMeta);
    setSaveStatus('Unsaved Changes');
    scheduleAutoSave(updatedMeta, biographyText, timelineEvents);
  };

  const handleSaveWorkspaceData = () => {
    saveWorkspaceDataImmediately();
    showToast('success', 'Workspace Saved Successfully', `Story workspace database for "${storyMeta.title}" synced.`);
  };

  const handleCloseAndExit = () => {
    if (autoSavePendingRef.current) {
      saveWorkspaceDataImmediately();
    }
    onClose();
  };

  // TIMELINE ACTIONS
  const handleOpenTimelineModal = (mode: 'create' | 'edit', evt?: LocalTimelineEvent) => {
    setTimelineModalMode(mode);
    if (mode === 'edit' && evt) {
      setActiveTimelineEvent({ ...evt });
    } else {
      setActiveTimelineEvent({
        id: '',
        year: '',
        title: '',
        description: '',
        category: 'Milestone',
        importance: 'Medium',
        associatedMediaIds: [],
        associatedPeopleIds: []
      });
    }
    setIsTimelineModalOpen(true);
  };

  const handleSaveTimelineEvent = async () => {
    if (!activeTimelineEvent.year || !activeTimelineEvent.title || !activeTimelineEvent.description) {
      showToast('warning', 'Missing Details', 'Year, title, and description are required milestones.');
      return;
    }

    try {
      if (timelineModalMode === 'create') {
        await TimelineService.createEvent({
          profileId: initialStory.associatedProfileId || 'profile-default',
          storyId: initialStory.id,
          year: activeTimelineEvent.year,
          title: activeTimelineEvent.title,
          description: activeTimelineEvent.description,
          category: activeTimelineEvent.category || 'Milestone',
          location: activeTimelineEvent.location || '',
          importance: activeTimelineEvent.importance || 'Medium',
          mediaIds: activeTimelineEvent.associatedMediaIds || [],
          peopleInvolved: activeTimelineEvent.associatedPeopleIds || [],
          status: 'Active',
          milestone: activeTimelineEvent.category === 'Milestone' || activeTimelineEvent.importance === 'High'
        });
        showToast('success', 'Event Created', `"${activeTimelineEvent.title}" added chronologically.`);
      } else {
        await TimelineService.updateEvent(activeTimelineEvent.id!, {
          year: activeTimelineEvent.year,
          title: activeTimelineEvent.title,
          description: activeTimelineEvent.description,
          category: activeTimelineEvent.category,
          location: activeTimelineEvent.location,
          importance: activeTimelineEvent.importance,
          mediaIds: activeTimelineEvent.associatedMediaIds,
          peopleInvolved: activeTimelineEvent.associatedPeopleIds
        });
        showToast('success', 'Event Updated', `"${activeTimelineEvent.title}" edits preserved.`);
      }
      await handleRefreshTimeline();
      setIsTimelineModalOpen(false);
    } catch (err: any) {
      showToast('error', 'Operation Failed', err.message || 'Unable to save timeline event.');
    }
  };

  const handleDeleteTimelineEvent = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      type: 'timeline',
      title: 'Delete Timeline Event',
      message: 'Permanently remove this chronological event from the story ledger?',
    });
  };

  const handleDuplicateTimelineEvent = async (evt: LocalTimelineEvent) => {
    try {
      await TimelineService.duplicateEvent(evt.id);
      await handleRefreshTimeline();
      showToast('success', 'Event Duplicated', 'Cloned milestone added.');
    } catch (err: any) {
      showToast('error', 'Duplication Failed', err.message);
    }
  };

  const handleReorderTimelineEvent = async (id: string, direction: 'up' | 'down') => {
    try {
      await TimelineService.reorderEvent(id, direction);
      await handleRefreshTimeline();
      showToast('success', 'Order Updated', `Chronology sequence shifted ${direction}.`);
    } catch (err: any) {
      showToast('error', 'Reorder Failed', err.message);
    }
  };

  const handleArchiveTimelineEvent = async (id: string) => {
    try {
      await TimelineService.archiveEvent(id);
      await handleRefreshTimeline();
      showToast('success', 'Event Archived', 'Event moved to chronology archive.');
    } catch (err: any) {
      showToast('error', 'Archive Failed', err.message);
    }
  };

  const handleRestoreTimelineEvent = async (id: string) => {
    try {
      await TimelineService.restoreEvent(id);
      await handleRefreshTimeline();
      showToast('success', 'Event Restored', 'Event restored to active chronology list.');
    } catch (err: any) {
      showToast('error', 'Restore Failed', err.message);
    }
  };

  const handleToggleMilestoneEvent = async (id: string, currentMilestone: boolean) => {
    try {
      await TimelineService.markMilestone(id, !currentMilestone);
      await handleRefreshTimeline();
      showToast('success', !currentMilestone ? 'Marked Milestone' : 'Unmarked Milestone', 'Milestone priority state saved.');
    } catch (err: any) {
      showToast('error', 'Toggle Failed', err.message);
    }
  };

  // BIOGRAPHY KEY FACTS HANDLERS
  const handleAddFact = () => {
    if (factInput.trim()) {
      setKeyFacts([...keyFacts, factInput.trim()]);
      setFactInput('');
      showToast('success', 'Key Fact Added');
      setSaveStatus('Unsaved Changes');
    }
  };

  const handleDeleteFact = (index: number) => {
    const updated = keyFacts.filter((_, idx) => idx !== index);
    setKeyFacts(updated);
    setSaveStatus('Unsaved Changes');
  };

  // MEDIA ACTIONS
  const handleToggleFavoriteMedia = async (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    if (!item) return;
    try {
      await MediaService.favoriteMedia(id, !item.favorite);
      await handleRefreshMedia();
      showToast(
        'success',
        !item.favorite ? 'Added to Favorites' : 'Removed from Favorites',
        `"${item.title}" favorited status updated.`
      );
      setSaveStatus('Unsaved Changes');
    } catch (err: any) {
      showToast('error', 'Action Failed', err.message);
    }
  };

  const handleDeleteMedia = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      type: 'media',
      title: 'Delete Media',
      message: 'Permanently disconnect and delete this media file?',
    });
  };

  const handleRenameMedia = (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    if (!item) return;
    setRenameModal({
      isOpen: true,
      id,
      type: 'media',
      title: 'Rename Media Metadata',
      defaultValue: item.title,
    });
  };

  const executeWorkspaceDelete = async () => {
    const { id, type } = deleteConfirmation;
    if (!id) return;
    try {
      if (type === 'document') {
        await DocumentService.deleteDocument(id);
        showToast('success', 'Document Purged', 'File permanently deleted.');
        if (selectedInspectorItem.type === 'document' && selectedInspectorItem.id === id) {
          setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
        }
        await handleRefreshDocuments();
      } else if (type === 'import') {
        await ImportService.deleteImport(id);
        showToast('success', 'Import Permanently Deleted', 'Record and storage footprints successfully cleared.');
        if (previewImport && previewImport.id === id) {
          setPreviewImport(null);
        }
        await handleRefreshImports();
      } else if (type === 'timeline') {
        await TimelineService.deleteEvent(id);
        await handleRefreshTimeline();
        showToast('error', 'Event Deleted', 'Chronology point pruned.');
        if (selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === id) {
          setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
        }
      } else if (type === 'media') {
        await MediaService.deleteMedia(id);
        await handleRefreshMedia();
        showToast('error', 'Media Disconnected', 'Scanned image files unlinked.');
        setSaveStatus('Unsaved Changes');
        if (selectedInspectorItem.type === 'media' && selectedInspectorItem.id === id) {
          setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
        }
      }
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    }
    setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const executeWorkspaceRename = async (newName: string) => {
    const { id, type } = renameModal;
    if (!id || !newName.trim()) return;
    try {
      if (type === 'media') {
        await MediaService.renameMedia(id, newName.trim());
        await handleRefreshMedia();
        showToast('success', 'File Renamed');
        setSaveStatus('Unsaved Changes');
      }
    } catch (err: any) {
      showToast('error', 'Rename Failed', err.message);
    }
    setRenameModal(prev => ({ ...prev, isOpen: false }));
  };

  const workspaceFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenWorkspaceUpload = () => {
    workspaceFileInputRef.current?.click();
  };

  const handleWorkspaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setSaveStatus('Saving...');
    const fileList = Array.from(files) as File[];
    for (const file of fileList) {
      try {
        if (file.size > 50 * 1024 * 1024) {
          showToast('error', 'Upload Blocked', `"${file.name}" exceeds 50MB storage limit.`);
          continue;
        }
        if (file.size === 0) {
          showToast('error', 'Upload Blocked', `"${file.name}" is an empty 0-byte file.`);
          continue;
        }

        await MediaService.processUpload(file, {
          profileId: initialStory.associatedProfileId || 'profile-default',
          storyId: initialStory.id,
          category: file.type.startsWith('image/') ? 'Portrait' : 'Family Photo',
          description: `Uploaded for Story Workspace: ${file.name}`
        });
        showToast('success', 'Asset Scanned', `"${file.name}" successfully integrated.`);
      } catch (err: any) {
        showToast('error', 'Upload Failed', `"${file.name}": ${err.message}`);
      }
    }
    await handleRefreshMedia();
    setSaveStatus('Saved');
  };

  // DYNAMIC COMPUTATIONS & STATS
  const isAIReady = useMemo(() => {
    // Requires a Title, subtitle, biography (longer than 100 chars), at least 3 timeline events, and at least 3 media items
    return (
      storyMeta.title.length > 5 &&
      biographyText.length > 150 &&
      timelineEvents.length >= 3 &&
      mediaItems.length >= 3
    );
  }, [storyMeta, biographyText, timelineEvents, mediaItems]);

  const progressPercentage = useMemo(() => {
    let score = 15; // Base story setup
    if (storyMeta.subtitle) score += 10;
    if (storyMeta.description) score += 10;
    if (biographyText.length > 300) score += 20;
    if (timelineEvents.length >= 5) score += 15;
    if (mediaItems.length >= 5) score += 15;
    if (people.length >= 3) score += 10;
    if (documents.length >= 3) score += 5;
    return Math.min(100, score);
  }, [storyMeta, biographyText, timelineEvents, mediaItems, people, documents]);

  // 10. FILTERED WORKSPACE LISTS
  const filteredMedia = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesType = mediaFilter === 'All' || item.type === mediaFilter;
      const matchesSearch = item.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(mediaSearchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [mediaItems, mediaFilter, mediaSearchQuery]);

  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(peopleSearchQuery.toLowerCase()) ||
        p.relationship.toLowerCase().includes(peopleSearchQuery.toLowerCase()) ||
        p.shortBio.toLowerCase().includes(peopleSearchQuery.toLowerCase());
      const matchesFilter = peopleFilter === 'All' || p.relationship === peopleFilter;
      return matchesSearch && matchesFilter;
    });
  }, [people, peopleSearchQuery, peopleFilter]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.displayName.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.tags.some(t => t.toLowerCase().includes(documentSearchQuery.toLowerCase()));
      const matchesFilter = documentFilter === 'All' || documentFilter === 'Favorites' || doc.documentType === documentFilter;
      return matchesSearch && matchesFilter;
    });
  }, [documents, documentSearchQuery, documentFilter]);

  const filteredImports = useMemo(() => {
    let result = imports.filter(item => {
      // Archive filter
      const matchesArchive = showArchivedImports ? item.archived === true : item.archived === false;
      
      // Category filter
      let matchesFilter = true;
      if (importFilter === 'Favorites') {
        matchesFilter = item.favorite === true;
      } else if (importFilter !== 'All') {
        matchesFilter = item.importType === importFilter;
      }
      
      // Search query
      const matchesSearch = !importSearchQuery ||
        item.displayName.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
        item.originalFilename.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(importSearchQuery.toLowerCase()));
        
      return matchesArchive && matchesFilter && matchesSearch;
    });

    // Sorting
    return [...result].sort((a, b) => {
      if (importSortBy === 'name') {
        return a.displayName.localeCompare(b.displayName);
      } else if (importSortBy === 'size') {
        const parseSize = (sz: string) => {
          const val = parseFloat(sz);
          if (sz.toUpperCase().includes('MB')) return val * 1024 * 1024;
          if (sz.toUpperCase().includes('KB')) return val * 1024;
          return val;
        };
        return parseSize(b.fileSize) - parseSize(a.fileSize);
      } else if (importSortBy === 'type') {
        return a.importType.localeCompare(b.importType);
      } else {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });
  }, [imports, importFilter, importSearchQuery, importSortBy, showArchivedImports]);

  return (
    <div className="h-full flex flex-col bg-background text-foreground overflow-hidden font-sans border border-border rounded-2xl shadow-xl" id="story-studio-workspace-container">
      
      {/* 1. TOP HEADER */}
      <div className="px-6 py-4 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0" id="workspace-top-bar">
        <div className="flex items-center gap-4">
          <Button
            id="btn-workspace-back"
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4 text-foreground" />}
            onClick={handleCloseAndExit}
            className="border border-border p-1.5"
            aria-label="Back to Library"
          >
            Back
          </Button>

          <div className="h-8 w-px bg-border hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-cinema-amber-500/15 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/30">
                PROD WORKSPACE
              </span>
              <h2 className="font-display font-black text-sm uppercase tracking-wide text-foreground">
                {storyMeta.title || 'Untitled Biographical Story'}
              </h2>
              <span className={`inline-flex items-center text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                saveStatus === 'Saved' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {saveStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="font-semibold text-cinema-amber-600 dark:text-cinema-amber-400">
                Subject: {initialStory.associatedProfileName}
              </span>
              <span>•</span>
              <span className="font-mono text-[10px]">Autosaved: {lastSaved}</span>
            </div>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-2" id="workspace-header-actions">
          {/* Undo/Redo */}
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border mr-1">
            <button
              onClick={() => showToast('info', 'Undo Action', 'Reverted biography paragraph segment edit.')}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer transition-colors"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('info', 'Redo Action', 'Restored paragraph segment layout changes.')}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer transition-colors"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <Button
            id="btn-workspace-toggle-inspector"
            variant="outline"
            size="xs"
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-cinema-amber-500" />}
            onClick={() => {
              if (isInspectorOpen) {
                closeInspector();
              } else {
                openInspector();
              }
            }}
            className={`border text-xs font-bold transition-colors ${
              isInspectorOpen
                ? 'border-cinema-amber-500/50 bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Context Panel
          </Button>

          <Button
            id="btn-workspace-create-story"
            variant="outline"
            size="xs"
            leftIcon={<Plus className="w-3.5 h-3.5 text-cinema-amber-500" />}
            onClick={() => setIsCreationWizardOpen(true)}
            className="border border-cinema-amber-500/40 text-cinema-amber-600 dark:text-cinema-amber-400 hover:bg-cinema-amber-500/10 text-xs font-bold"
          >
            New Story
          </Button>

          <Button
            id="btn-workspace-save-manual"
            variant="accent"
            size="xs"
            leftIcon={<Save className="w-3.5 h-3.5 text-slate-950" />}
            onClick={handleSaveWorkspaceData}
            className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* 2. MODE NAVIGATION (4 CORE PHASES) */}
      <StoryStudioModeNav activeMode={activeMode} onModeChange={handleModeChange} />

      {/* 2.5 SUB-SECTION TABS FOR ACTIVE MODE */}
      <div id="workspace-sub-tabs-bar" className="bg-muted/40 border-b border-border/80 px-4 md:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar text-xs shrink-0">
        <div className="flex items-center gap-1.5 min-w-max">
          {activeModeSubSections.map((subTab) => {
            const isActive =
              activeSection === subTab.id ||
              (subTab.id === 'story' && (activeSection === 'info' || activeSection === 'biography')) ||
              (subTab.id === 'people' && activeSection === 'characters') ||
              (subTab.id === 'media' && activeSection === 'assets');
            const IconComp = subTab.icon;

            return (
              <button
                key={subTab.id}
                id={`sub-tab-btn-${subTab.id}`}
                onClick={() => {
                  let targetSection = subTab.id;
                  if (subTab.id === 'story') targetSection = 'info';
                  setActiveSection(targetSection);
                  setSearchParams({ id: initialStory.id, mode: activeMode, section: targetSection });

                  // Module Context Panel synchronization
                  if (subTab.id === 'overview' || subTab.id === 'story' || subTab.id === 'info' || subTab.id === 'biography') {
                    setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
                  } else if (subTab.id === 'timeline') {
                    setSelectedInspectorItem({ type: 'timeline', id: timelineEvents[0]?.id || '1', data: timelineEvents[0] || initialStory });
                  } else if (subTab.id === 'scripts') {
                    setSelection('scene', scenes[0] || initialStory);
                  } else if (subTab.id === 'people' || subTab.id === 'characters') {
                    setSelection('character', characters[0] || initialStory);
                  } else if (subTab.id === 'scenes') {
                    setSelection('scene', scenes[0] || initialStory);
                  } else if (subTab.id === 'media' || subTab.id === 'assets') {
                    setSelection('media', mediaItems[0] || initialStory);
                  } else if (subTab.id === 'documents') {
                    setSelectedInspectorItem({ type: 'document', id: documents[0]?.id || '1', data: documents[0] || initialStory });
                  } else if (subTab.id === 'narration') {
                    setSelection('narration', { voiceName: 'Standard Documentary Voice', assignedVoice: 'AI Voiceover' });
                  } else if (subTab.id === 'music') {
                    setSelection('music', { trackTitle: 'Cinematic Heritage Theme', mood: 'Warm' });
                  } else if (subTab.id === 'preview') {
                    setSelection('scene', scenes[0] || initialStory);
                  } else if (subTab.id === 'render') {
                    setSelection('render', { format: '1080p MP4', status: 'Ready' });
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-muted-foreground'}`} />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-muted-foreground shrink-0">
          <span className="font-semibold text-cinema-amber-600 dark:text-cinema-amber-400">
            {activeMode === 'story_cast' && 'Phase 1: Manuscript & Story Foundation'}
            {activeMode === 'scenes_media' && 'Phase 2: Visual Production & Source Ledger'}
            {activeMode === 'audio_music' && 'Phase 3: Narration & Sound Engineering'}
            {activeMode === 'preview_export' && 'Phase 4: Review & Production Export'}
          </span>
        </div>
      </div>

      {/* 3. FULL-WIDTH WORKSPACE CANVAS */}
      <div className="flex-grow flex overflow-hidden relative" id="workspace-panels-mesh">
        {/* PRIMARY WORKSPACE CONTENT (FULL WIDTH) */}
        <main className="flex-grow flex flex-col overflow-y-auto bg-muted/15 w-full min-w-0" id="workspace-primary-scroller">
          
          <AnimatePresence mode="wait">
            
            {/* STORY & CAST MODE SECTIONS (Overview, Info/Story, Biography, Scripts, Timeline, Characters) */}
            {['overview', 'info', 'story', 'biography', 'scripts', 'timeline', 'characters', 'people'].includes(activeSection) && (
              <StoryCastMode
                initialStory={initialStory}
                storyMeta={storyMeta}
                onMetaChange={handleMetaChange}
                activeSection={activeSection === 'story' ? 'info' : activeSection}
                onNavigateSection={(sec) => {
                  const targetSec = sec === 'story' ? 'info' : sec;
                  setActiveSection(targetSec);
                  const newMode = mapSectionToMode(targetSec);
                  setActiveMode(newMode);
                  setSearchParams({ id: initialStory.id, mode: newMode, section: targetSec });
                }}
                progressPercentage={progressPercentage}
                isAIReady={isAIReady}
                biographyText={biographyText}
                onBiographyChange={(val) => {
                  setBiographyText(val);
                  setSaveStatus('Unsaved Changes');
                  triggerAutoSave(val);
                }}
                biographySummary={biographySummary}
                onBiographySummaryChange={(val) => {
                  setBiographySummary(val);
                  setSaveStatus('Unsaved Changes');
                }}
                keyFacts={keyFacts}
                factInput={factInput}
                onFactInputChange={setFactInput}
                onAddFact={handleAddFact}
                onDeleteFact={handleDeleteFact}
                timelineEvents={timelineEvents}
                timelineStats={timelineStats}
                timelineSearchQuery={timelineSearchQuery}
                onTimelineSearchChange={setTimelineSearchQuery}
                timelineCategoryFilter={timelineCategoryFilter}
                onTimelineCategoryChange={setTimelineCategoryFilter}
                timelineStatusFilter={timelineStatusFilter}
                onTimelineStatusChange={setTimelineStatusFilter}
                timelineSortOrder={timelineSortOrder}
                onTimelineSortChange={(val) => setTimelineSortOrder(val)}
                timelineViewMode={timelineViewMode}
                onTimelineViewModeChange={(val) => setTimelineViewMode(val)}
                eventsToRender={eventsToRender}
                groupedByYear={groupedByYear}
                groupedByDecade={groupedByDecade}
                onOpenTimelineModal={handleOpenTimelineModal}
                onReorderTimelineEvent={handleReorderTimelineEvent}
                onToggleMilestoneEvent={handleToggleMilestoneEvent}
                onDuplicateTimelineEvent={handleDuplicateTimelineEvent}
                onArchiveTimelineEvent={handleArchiveTimelineEvent}
                onRestoreTimelineEvent={handleRestoreTimelineEvent}
                onDeleteTimelineEvent={handleDeleteTimelineEvent}
                characters={characters}
                onUpdateCharacters={(updated) => {
                  setCharacters(updated);
                  triggerAutoSave({ characters: updated });
                }}
                scenes={scenes}
                mediaItems={mediaItems}
                selectedInspectorItem={selectedInspectorItem}
                onSelectInspectorItem={setSelectedInspectorItem}
                showToast={showToast}
              />
            )}

            {/* SCENES & MEDIA MODE SECTIONS (Scenes / Storyboard, Media Assets, Supporting Documents) */}
            {['scenes', 'media', 'assets', 'documents'].includes(activeSection) && (
              <ScenesMediaMode
                initialStory={initialStory}
                storyMeta={storyMeta}
                activeSection={activeSection === 'assets' ? 'media' : activeSection}
                onNavigateSection={(sec) => {
                  const targetSec = sec === 'assets' ? 'media' : sec;
                  setActiveSection(targetSec);
                  const newMode = mapSectionToMode(targetSec);
                  setActiveMode(newMode);
                  setSearchParams({ id: initialStory.id, mode: newMode, section: targetSec });
                }}
                scenes={scenes}
                onUpdateScenes={setScenes}
                mediaItems={mediaItems}
                onRefreshMedia={handleRefreshMedia}
                onToggleFavoriteMedia={handleToggleFavoriteMedia}
                onRenameMedia={handleRenameMedia}
                onDeleteMedia={handleDeleteMedia}
                documents={documents}
                onRefreshDocuments={handleRefreshDocuments}
                onToggleFavoriteDocument={handleToggleFavoriteDocument}
                onArchiveDocument={handleArchiveDocument}
                onRestoreDocument={handleRestoreDocument}
                onDeleteDocument={handleDeleteDocument}
                onRenameDocument={handleRenameDocument}
                timelineEvents={timelineEvents}
                characters={characters}
                selectedInspectorItem={selectedInspectorItem}
                onSelectInspectorItem={setSelectedInspectorItem}
                showToast={showToast}
              />
            )}

            {/* AUDIO & MUSIC MODE SECTIONS (Voiceover Narration, Soundtrack & Score) */}
            {['narration', 'music'].includes(activeSection) && (
              <AudioMusicMode
                initialStory={initialStory}
                storyMeta={storyMeta}
                onUpdateStoryMeta={(updates) => {
                  setStoryMeta((prev) => ({ ...prev, ...updates }));
                }}
                activeSection={activeSection}
                onNavigateSection={(sec) => {
                  setActiveSection(sec);
                  const newMode = mapSectionToMode(sec);
                  setActiveMode(newMode);
                  setSearchParams({ id: initialStory.id, mode: newMode, section: sec });
                }}
                scenes={scenes}
                onUpdateScenes={setScenes}
                mediaItems={mediaItems}
                characters={characters}
                showToast={showToast}
              />
            )}

            {/* PREVIEW & EXPORT MODE SECTIONS (Interactive Preview, Production & Render) */}
            {['preview', 'render', 'production', 'templates', 'history', 'review'].includes(activeSection) && (
              <PreviewExportMode
                initialStory={initialStory}
                storyMeta={storyMeta}
                activeSection={activeSection}
                onNavigateSection={(sec) => {
                  setActiveSection(sec);
                  const newMode = mapSectionToMode(sec);
                  setActiveMode(newMode);
                  setSearchParams({ id: initialStory.id, mode: newMode, section: sec });
                }}
                scenes={scenes}
                characters={characters}
                timelineEvents={timelineEvents}
                mediaItems={mediaItems}
                showToast={showToast}
              />
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* 3. BOTTOM WORKSPACE STATUS BAR */}
      <footer className="px-6 py-2.5 border-t border-border bg-muted/40 flex items-center justify-between text-xs font-mono text-muted-foreground shrink-0" id="workspace-status-dock">
        <div className="flex items-center gap-4">
          <span 
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-help"
            title="v0.7.0"
          >
            ReelLegacy Story Studio
          </span>
          <span className="text-border hidden sm:inline">|</span>
          <div 
            className="hidden sm:flex items-center gap-2 hover:text-foreground transition-colors cursor-help"
            title="Cloud sync: ONLINE"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="font-semibold text-[10px] uppercase">Auto-saved</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[10px] uppercase">Compilation readiness:</span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden border border-border/60">
              <div className="h-full bg-cinema-amber-500" style={{ width: `${progressPercentage}%` }} />
            </div>
            <span className="font-black font-mono text-[10px] text-foreground/80">{progressPercentage}%</span>
          </div>
        </div>
      </footer>

      {/* 4. CHRONOLOGY MILESTONE EDITING MODAL */}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden" id="timeline-event-editor-backdrop">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden text-foreground flex flex-col max-h-[85vh] my-auto"
          >
            <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
              <h4 className="font-display font-black text-sm uppercase tracking-wide">
                {timelineModalMode === 'create' ? 'Create Chronology Milestone' : 'Modify Chronology Milestone'}
              </h4>
              <button
                onClick={() => setIsTimelineModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs flex-1 overflow-y-auto scrollbar-ephemeral">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Year point *</label>
                  <input
                    id="modal-year-input"
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 1974"
                    value={activeTimelineEvent.year || ''}
                    onChange={(e) => setActiveTimelineEvent({ ...activeTimelineEvent, year: e.target.value.replace(/\D/g, '') })}
                    className="w-full h-10 px-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 font-mono text-xs font-semibold"
                  />
                </div>

                  <Select
                    id="modal-category-select"
                    label="Category tag *"
                    value={activeTimelineEvent.category || 'Milestone'}
                    onChange={(val) => setActiveTimelineEvent({ ...activeTimelineEvent, category: val as any })}
                    options={[
                      { value: 'Childhood', label: 'Childhood' },
                      { value: 'Education', label: 'Education' },
                      { value: 'Career', label: 'Career' },
                      { value: 'Family', label: 'Family' },
                      { value: 'Milestone', label: 'General Milestone' },
                      { value: 'Retirement', label: 'Retirement' },
                      { value: 'Historical', label: 'Historical Archive' }
                    ]}
                    className="col-span-2"
                  />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Milestone Heading *</label>
                <input
                  id="modal-title-input"
                  type="text"
                  placeholder="e.g. Established Cape Cod Art Studio"
                  value={activeTimelineEvent.title || ''}
                  onChange={(e) => setActiveTimelineEvent({ ...activeTimelineEvent, title: e.target.value })}
                  className="w-full h-10 px-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Event Description *</label>
                <textarea
                  id="modal-description-textarea"
                  rows={4}
                  placeholder="Provide rich details of what took place, the significance, and any lessons..."
                  value={activeTimelineEvent.description || ''}
                  onChange={(e) => setActiveTimelineEvent({ ...activeTimelineEvent, description: e.target.value })}
                  className="w-full p-3 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-xs font-semibold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Geographic Location</label>
                  <input
                    id="modal-location-input"
                    type="text"
                    placeholder="e.g. Salem, MA"
                    value={activeTimelineEvent.location || ''}
                    onChange={(e) => setActiveTimelineEvent({ ...activeTimelineEvent, location: e.target.value })}
                    className="w-full h-10 px-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-xs font-semibold"
                  />
                </div>

                  <Select
                    id="modal-importance-select"
                    label="Visual Priority"
                    value={activeTimelineEvent.importance || 'Medium'}
                    onChange={(val) => setActiveTimelineEvent({ ...activeTimelineEvent, importance: val as any })}
                    dropPosition="top"
                    options={[
                      { value: 'High', label: 'High (Cinematic highlight)' },
                      { value: 'Medium', label: 'Medium (Standard chapter entry)' },
                      { value: 'Low', label: 'Low (Background reference)' }
                    ]}
                  />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border bg-muted/30 flex justify-end gap-2 shrink-0">
              <Button
                id="btn-modal-cancel"
                variant="ghost"
                size="sm"
                onClick={() => setIsTimelineModalOpen(false)}
                className="text-xs"
              >
                Discard
              </Button>
              <Button
                id="btn-modal-save"
                variant="accent"
                size="sm"
                onClick={handleSaveTimelineEvent}
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs"
              >
                Save Milestone
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 5. RESUME & BIOGRAPHY IMPORT PREVIEW & EDIT DIALOG OVERLAY */}
      <AnimatePresence>
        {previewImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in" id="import-explorer-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-background border border-border rounded-3xl overflow-hidden max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
                      {isEditingImport ? 'Adjust Import Metadata' : 'Archival Import Explorer'}
                    </h4>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      Registry Ref: {previewImport.id} • v{previewImport.version}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewImport(null)}
                  className="p-1.5 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: File Preview Screen */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                    Source File Document Frame
                  </span>
                  <div className="border border-border/80 rounded-2xl bg-muted/40 aspect-4/3 w-full relative overflow-hidden flex items-center justify-center p-3">
                    {previewImport.localStorageReference ? (
                      previewImport.mimeType.startsWith('image/') ? (
                        <img
                          src={previewImport.localStorageReference}
                          alt={previewImport.displayName}
                          className="w-full h-full object-contain max-h-[300px] rounded"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <iframe
                          src={previewImport.localStorageReference}
                          title={previewImport.displayName}
                          className="w-full h-full border-0 min-h-[280px] bg-white rounded"
                        />
                      )
                    ) : (
                      <div className="text-center p-6">
                        <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                        <span className="text-xs text-muted-foreground font-semibold block">Preview Unavailable</span>
                        <span className="text-[10px] text-muted-foreground/80 font-medium">Please download file to view contents.</span>
                      </div>
                    )}
                  </div>

                  {/* Technical attributes badge panel */}
                  <div className="bg-muted/35 p-3 rounded-2xl border border-border/60 grid grid-cols-2 gap-3 text-xs font-semibold">
                    <div>
                      <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">MIME TYPE</span>
                      <span className="text-foreground font-mono block truncate">{previewImport.mimeType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">EXTENSION</span>
                      <span className="text-foreground font-mono block uppercase">.{previewImport.extension}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">ORIGINAL NAME</span>
                      <span className="text-foreground block truncate" title={previewImport.originalFilename}>{previewImport.originalFilename}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">FILE SIZE</span>
                      <span className="text-foreground font-mono block">{previewImport.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Information & Metadata Controls */}
                <div className="flex flex-col justify-between h-full space-y-4">
                  {isEditingImport ? (
                    <div className="space-y-4 flex-1">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                        Edit Record Credentials
                      </span>

                      {/* Display Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Display Name *</label>
                        <input
                          type="text"
                          value={editImportName}
                          onChange={(e) => setEditImportName(e.target.value)}
                          className="w-full h-10 px-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-xs font-semibold text-foreground"
                        />
                      </div>

                      {/* Import Type */}
                      <Select
                        id="edit-import-type"
                        label="Import Type *"
                        value={editImportType}
                        onChange={setEditImportType}
                        options={[
                          { value: 'Resume / CV', label: 'Resume / CV' },
                          { value: 'Biography', label: 'Biography' },
                          { value: 'Autobiography', label: 'Autobiography' },
                          { value: 'Memoir', label: 'Memoir' },
                          { value: 'Obituary', label: 'Obituary' },
                          { value: 'Personal Notes', label: 'Personal Notes' },
                          { value: 'Interview Transcript', label: 'Interview Transcript' },
                          { value: 'Journal', label: 'Journal' },
                          { value: 'Letter Collection', label: 'Letter Collection' },
                          { value: 'Custom Document', label: 'Custom Document' }
                        ]}
                      />

                      {/* Associated Legacy Profile */}
                      <Select
                        id="edit-import-profile-id"
                        label="Linked Legacy Profile *"
                        value={editImportProfileId}
                        onChange={setEditImportProfileId}
                        options={profilesList.map(profile => ({
                          value: profile.id,
                          label: `${profile.firstName} ${profile.lastName} (${profile.birthYear} - ${profile.deathYear || 'Present'})`
                        }))}
                      />

                      {/* Associated Story */}
                      <Select
                        id="edit-import-story-id"
                        label="Associated Story"
                        value={editImportStoryId}
                        onChange={setEditImportStoryId}
                        options={[
                          { value: '', label: 'No Story Linkage' },
                          ...storiesList.map(story => ({
                            value: story.id,
                            label: story.title
                          }))
                        ]}
                      />

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Description & Summary</label>
                        <textarea
                          rows={3}
                          value={editImportDesc}
                          onChange={(e) => setEditImportDesc(e.target.value)}
                          className="w-full p-3 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-xs font-semibold resize-none text-foreground"
                          placeholder="Describe the content of this file, dates covered, and notes."
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Search Tags (Comma-separated)</label>
                        <input
                          type="text"
                          value={editImportTags}
                          onChange={(e) => setEditImportTags(e.target.value)}
                          className="w-full h-10 px-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 text-xs font-semibold text-foreground"
                          placeholder="professional, transcripts, awards, 1968"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Display Credentials Title</span>
                        <h3 className="text-base font-black text-foreground uppercase tracking-wide">
                          {previewImport.displayName}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          📁 TYPE: {previewImport.importType}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-2">
                          ⚡ STATUS: {previewImport.importStatus}
                        </span>
                      </div>

                      <div className="border-t border-border pt-3 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Description & Summary</span>
                        <p className="text-muted-foreground text-xs leading-normal font-medium">
                          {previewImport.description || 'No descriptive summary provided.'}
                        </p>
                      </div>

                      <div className="border-t border-border pt-3 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Entity Linkages & Associations</span>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[9px] uppercase font-bold">Legacy Profile</span>
                            <span className="text-foreground font-semibold">
                              {profilesList.find(p => p.id === previewImport.profileId)?.firstName || 'Default Profile'}{' '}
                              {profilesList.find(p => p.id === previewImport.profileId)?.lastName || ''}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[9px] uppercase font-bold">Linked Story</span>
                            <span className="text-foreground font-semibold">
                              {storiesList.find(s => s.id === previewImport.storyId)?.title || 'Unlinked'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {previewImport.tags && previewImport.tags.length > 0 && (
                        <div className="border-t border-border pt-3 space-y-1.5">
                          <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Associated Search Tags</span>
                          <div className="flex flex-wrap gap-1">
                            {previewImport.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-muted border border-border/80 px-2 py-0.5 rounded text-muted-foreground font-bold">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-border pt-3 grid grid-cols-2 gap-3 text-xs font-semibold">
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">INDEXED DATE</span>
                          <span className="text-foreground">{new Date(previewImport.uploadDate).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">LAST SYNCHRONIZED</span>
                          <span className="text-foreground">{new Date(previewImport.lastModified).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="border-t border-border pt-4 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleToggleFavoriteImport(previewImport.id, !previewImport.favorite)}
                        className={`p-2.5 text-xs font-bold border rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                          previewImport.favorite
                            ? 'text-cinema-amber-500 border-cinema-amber-500/25 bg-cinema-amber-500/5 hover:bg-cinema-amber-500/10'
                            : 'border-border bg-card text-foreground hover:bg-muted/50'
                        }`}
                      >
                        ★ {previewImport.favorite ? 'Unfavorite Highlight' : 'Pin as Highlight'}
                      </button>

                      <a
                        href={previewImport.localStorageReference}
                        download={previewImport.originalFilename}
                        className="p-2.5 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1 text-center"
                      >
                        📥 Download Raw Source
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (isEditingImport) {
                            handleSaveImportMetadata();
                            setIsEditingImport(false);
                          } else {
                            setIsEditingImport(true);
                          }
                        }}
                        className="p-2.5 text-xs font-bold bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <Save className="w-4 h-4" />
                        {isEditingImport ? 'Save Configuration' : 'Edit Metas & Linkage'}
                      </button>

                      {isEditingImport ? (
                        <button
                          onClick={() => setIsEditingImport(false)}
                          className="p-2.5 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          Discard Edits
                        </button>
                      ) : (
                        <button
                          onClick={() => previewImport.archived ? handleRestoreImport(previewImport.id) : handleArchiveImport(previewImport.id)}
                          className="p-2.5 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          📁 {previewImport.archived ? 'Activate Import' : 'Deposit to Vault'}
                        </button>
                      )}
                    </div>

                    {!isEditingImport && (
                      <button
                        onClick={() => handleDeleteImport(previewImport.id)}
                        className="w-full p-2.5 text-xs font-bold border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1"
                      >
                        🗑 Permanently Purge & Clear Local Storage Data
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeWorkspaceDelete}
        title={deleteConfirmation.title}
        message={deleteConfirmation.message}
      />

      <PromptModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeWorkspaceRename}
        title={renameModal.title}
        message="Enter new title or label below:"
        defaultValue={renameModal.defaultValue}
        placeholder="Enter value..."
        confirmLabel="Rename"
      />

      {isCreationWizardOpen && (
        <StoryWizard
          onClose={() => setIsCreationWizardOpen(false)}
          onSave={async (newStory) => {
            try {
              await StoryService.createStory(newStory as any);
              window.dispatchEvent(new Event('reellegacy-data-changed'));
              showToast('success', 'Story Project Created', `"${newStory.title}" is saved as a Story Project.`);
              setIsCreationWizardOpen(false);
              onSave(newStory as ExtendedStory);
            } catch (err: any) {
              showToast('error', 'Creation Failed', err.message || 'Could not save new story project.');
            }
          }}
        />
      )}
    </div>
  );
}
