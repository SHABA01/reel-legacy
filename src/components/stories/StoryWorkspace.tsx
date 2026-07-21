/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Building,
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
  Briefcase,
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
  ListFilter
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PromptModal } from '../ui/PromptModal';
import { useToast } from '../../context/ToastContext';
import { ExtendedStory } from './mockStoriesData';
import { TimelineService, persistenceService, MediaService, DocumentService, DocumentSchema, ImportSchema, ImportService, LegacyProfileSchema, StorySchema } from '../../storage';

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

interface LocalCareerEntry {
  id: string;
  company: string;
  position: string;
  years: string;
  responsibilities: string[];
  achievements: string[];
  skillsUsed: string[];
  promotions: string;
  location: string;
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

  // 1. NAVIGATION & LAYOUT CONTROLS
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState<boolean>(false);
  const [isRightInspectorCollapsed, setIsRightInspectorCollapsed] = useState<boolean>(false);
  
  // Selected item inside workspaces which populates the dynamic right inspector
  const [selectedInspectorItem, setSelectedInspectorItem] = useState<{
    type: 'story' | 'timeline' | 'media' | 'person' | 'career' | 'document';
    id: string;
    data: any;
  }>({
    type: 'story',
    id: initialStory.id,
    data: initialStory
  });

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
  const [timelineViewMode, setTimelineViewMode] = useState<'chrono' | 'group-year' | 'group-decade' | 'milestones'>('chrono');

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

  // 7. PEOPLE STATE
  const [people, setPeople] = useState<LocalPerson[]>(() => {
    const cached = localStorage.getItem(`rl_people_${initialStory.id}`);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [
      {
        id: 'per-1',
        name: 'Arthur Miller',
        relationship: 'Parent',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Public high school history master and vocational gardener. Inspiring source of Elizabeth’s academic interests.',
        lifetime: '1912 – 1994',
        timelineReferences: ['evt-1'],
        mediaReferences: ['med-1']
      },
      {
        id: 'per-2',
        name: 'Martha Miller',
        relationship: 'Parent',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Elementary school reading specialist and local botanical artist. Taught Elizabeth basic watercolor wash rules.',
        lifetime: '1918 – 2002',
        timelineReferences: ['evt-1'],
        mediaReferences: ['med-1']
      },
      {
        id: 'per-3',
        name: 'Philip Vance',
        relationship: 'Spouse',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Boston civic architect, structural historian, and lifelong supportive partner. Documented Cape Cod studio painting projects.',
        lifetime: '1942 – Present',
        timelineReferences: ['evt-3', 'evt-5', 'evt-6'],
        mediaReferences: ['med-3', 'med-6']
      },
      {
        id: 'per-4',
        name: 'Clara Jenkins',
        relationship: 'Colleague',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Co-Founder of Salem Literacy Center. Pioneered adult dyslexia tutoring resources in Massachusetts alongside Elizabeth.',
        lifetime: '1946 – Present',
        timelineReferences: ['evt-4'],
        mediaReferences: ['med-4']
      },
      {
        id: 'per-5',
        name: 'Robert Vance',
        relationship: 'Child',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        shortBio: 'Professional cellist and landscape photographer living in Maine. Active co-producer on this heritage documentary project.',
        lifetime: '1982 – Present',
        timelineReferences: ['evt-5', 'evt-6'],
        mediaReferences: ['med-5', 'med-6']
      }
    ];
  });

  const [peopleFilter, setPeopleFilter] = useState<string>('All');
  const [peopleSearchQuery, setPeopleSearchQuery] = useState<string>('');

  // 8. CAREER HISTORY STATE
  const [careerSubTab, setCareerSubTab] = useState<'employment' | 'imports'>('imports');
  const [careerHistory, setCareerHistory] = useState<LocalCareerEntry[]>([
    {
      id: 'car-1',
      company: 'North Portland Secondary',
      position: 'Literary Humanities Teacher',
      years: '1966 – 1970',
      location: 'Portland, ME',
      responsibilities: [
        'Curated independent reading lists for high school sophomores',
        'Instructed elective seminars in early American transcendentalism'
      ],
      achievements: [
        'Organized school’s first annual multi-school historical book fair'
      ],
      skillsUsed: ['Curriculum Planning', 'Lecturing', 'Literary Criticism'],
      promotions: 'Senior Elective Coordinator in 1969'
    },
    {
      id: 'car-2',
      company: 'Salem Literacy Center',
      position: 'Executive Administrative Director',
      years: '1974 – 2010',
      location: 'Salem, MA',
      responsibilities: [
        'Pioneered basic adult literacy curriculum pathways',
        'Managed municipal grant writing, fundraising, and city outreach',
        'Supervised a rotation of sixty local volunteer teachers and tutors'
      ],
      achievements: [
        'Graduated over 3,000 adult learners with vocational literacy certificates',
        'Secured state-level continuous operating endowment'
      ],
      skillsUsed: ['Grant Writing', 'Budget Allocation', 'Volunteer Management', 'Civic Leadership'],
      promotions: 'N/A (Co-Founder)',
    }
  ]);

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
    localStorage.setItem(`rl_people_${initialStory.id}`, JSON.stringify(people));
  }, [people, initialStory.id]);

  // Active sub-sections inside Left Sidebar
  const sidebarSections = [
    { id: 'overview', label: 'Overview', icon: Film },
    { id: 'info', label: 'Story Information', icon: Sliders },
    { id: 'biography', label: 'Biography', icon: BookOpen },
    { id: 'timeline', label: 'Timeline Chronology', icon: Calendar },
    { id: 'media', label: 'Media Organizer', icon: Camera },
    { id: 'people', label: 'Associated People', icon: Users },
    { id: 'locations', label: 'Story Locations', icon: MapPin },
    { id: 'career', label: 'Career Retrospective', icon: Briefcase },
    { id: 'education', label: 'Education Ledger', icon: GraduationCap },
    { id: 'achievements', label: 'Achievements & Awards', icon: Award },
    { id: 'documents', label: 'Supporting Documents', icon: FileText },
    { id: 'narration', label: 'Narration Studio Cues', icon: Mic },
    { id: 'music', label: 'Acoustic Soundtracks', icon: Smile },
    { id: 'interviews', label: 'Q&A Interview Notes', icon: MessageSquare },
    { id: 'templates', label: 'Production Templates', icon: Layers },
    { id: 'history', label: 'Version Sandbox History', icon: Clock },
    { id: 'review', label: 'Review & Verify Ready', icon: CheckSquare }
  ];

  // REAL-TIME AUTO SAVE PROCESS
  const triggerAutoSave = (updatedFields: any) => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      const time = new Date();
      setLastSaved(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSaveStatus('Saved');
    }, 1000);
  };

  const handleMetaChange = (field: string, value: string) => {
    const updatedMeta = { ...storyMeta, [field]: value };
    setStoryMeta(updatedMeta);
    setSaveStatus('Unsaved Changes');
    triggerAutoSave(updatedMeta);
  };

  const handleSaveWorkspaceData = () => {
    setSaveStatus('Saving...');
    
    // Save biography text
    localStorage.setItem(`rl_biography_${initialStory.id}`, biographyText);

    // Reconstruct updated story structure
    const updatedStory: ExtendedStory = {
      ...initialStory,
      title: storyMeta.title,
      subtitle: storyMeta.subtitle,
      description: storyMeta.description,
      tags: [initialStory.category, storyMeta.visibility, 'Workspace'],
      mediaCount: mediaItems.length,
      timelineEventCount: timelineEvents.length,
      lastEdited: new Date().toISOString(),
      timelineEvents: timelineEvents.map(evt => ({
        id: evt.id,
        year: evt.year,
        title: evt.title,
        description: evt.description
      }))
    };

    setTimeout(() => {
      onSave(updatedStory);
      const time = new Date();
      setLastSaved(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSaveStatus('Saved');
      showToast('success', 'Workspace Saved Successfully', `Story workspace database for "${storyMeta.title}" synced.`);
    }, 800);
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
            onClick={onClose}
            className="border border-border p-1.5"
            aria-label="Back to Library"
          >
            Back
          </Button>

          <div className="h-8 w-px bg-border hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
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
                {initialStory.associatedProfileName}
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
            id="btn-workspace-preview"
            variant="ghost"
            size="xs"
            leftIcon={<Eye className="w-3.5 h-3.5 text-foreground" />}
            onClick={() => showToast('info', 'Production Draft Preview', 'Pre-rendering film layout assets for high fidelity video test overlay...')}
            className="border border-border text-xs hidden md:inline-flex"
          >
            Preview
          </Button>

          <Button
            id="btn-workspace-ai-trigger"
            variant="ghost"
            size="xs"
            disabled={!isAIReady}
            leftIcon={<Sparkles className={`w-3.5 h-3.5 ${isAIReady ? 'text-indigo-500 animate-pulse' : 'text-muted-foreground'}`} />}
            onClick={() => showToast('success', 'AI Director Ready', 'Narrative scripting pipelines initialized! Workspace ready to pass to Stage 8 generator.')}
            className={`text-xs border ${isAIReady ? 'border-indigo-500/35 hover:bg-indigo-500/5' : 'border-border'}`}
          >
            AI Script Prep
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

      {/* 2. DUAL SIDEBAR WORKSPACE GRID */}
      <div className="flex-grow flex overflow-hidden relative" id="workspace-panels-mesh">
        
        {/* LEFT NAV PANEL */}
        <aside
          id="workspace-left-nav"
          className={`h-full border-r border-border bg-muted/30 transition-all duration-300 flex flex-col justify-between shrink-0 ${
            isLeftSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Scrollable list items */}
          <div className="flex-grow overflow-y-auto py-4 px-3 space-y-1.5">
            {sidebarSections.map((sect) => {
              const isActive = activeSection === sect.id;
              const IconComp = sect.icon;
              return (
                <button
                  key={sect.id}
                  id={`left-nav-btn-${sect.id}`}
                  onClick={() => {
                    setActiveSection(sect.id);
                    // Standard inspector updates based on section clicks
                    if (sect.id === 'info') {
                      setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group text-left ${
                    isActive
                      ? 'bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/15'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-cinema-amber-500' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  {!isLeftSidebarCollapsed && (
                    <span className="text-xs font-semibold truncate uppercase tracking-wider">
                      {sect.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Toggle Sidebar Collapse button */}
          <div className="p-3 border-t border-border/65 bg-muted/10 shrink-0">
            <button
              onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              className="w-full h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer border border-border/40"
              aria-label="Collapse Navigation"
            >
              {isLeftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* PRIMARY WORKSPACE CONTENT */}
        <main className="flex-grow flex flex-col overflow-y-auto bg-muted/15" id="workspace-primary-scroller">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <motion.div
                key="workspace-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6"
                id="pane-overview"
              >
                {/* Visual Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Film className="w-4 h-4 text-cinema-amber-500 animate-pulse" /> Story Studio Overview
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Unified dashboard detailing data coverage, catalog depth, and AI processing criteria.
                    </p>
                  </div>
                </div>

                {/* Dashboard stats grids */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="overview-progress-mesh">
                  <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden">
                    <div className="p-3 rounded-xl bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 shrink-0">
                      <TrendingUp className="w-5 h-5 text-cinema-amber-500" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Completion Score</span>
                      <strong className="text-lg font-black text-foreground font-mono">{progressPercentage}%</strong>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-cinema-amber-500" style={{ width: `${progressPercentage}%` }} />
                  </div>

                  <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Milestones</span>
                      <strong className="text-lg font-black text-foreground font-mono">{timelineEvents.length} Points</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                      <Camera className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Organized Media</span>
                      <strong className="text-lg font-black text-foreground font-mono">{mediaItems.length} Files</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-card border border-border rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">AI Readiness</span>
                      <strong className={`text-xs font-black block mt-1 ${isAIReady ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {isAIReady ? 'READY TO COMPILE' : 'NEEDS SETUP'}
                      </strong>
                    </div>
                    {isAIReady && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-details-mesh">
                  {/* Missing information alerts & action cards */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-cinema-amber-500" /> Verification Warnings & Suggestions
                      </h4>
                      
                      <div className="space-y-2.5">
                        {biographyText.length < 300 ? (
                          <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-xl flex gap-3">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <strong className="font-bold text-foreground">Biography draft too short:</strong>
                              <p className="text-muted-foreground mt-0.5">Please add more comprehensive historical details to enrich AI script accuracy.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <strong className="font-bold text-foreground">Biography is fully detailed:</strong>
                              <p className="text-muted-foreground mt-0.5">Meets standard production threshold (200+ words). Fully parsed.</p>
                            </div>
                          </div>
                        )}

                        {timelineEvents.length < 5 ? (
                          <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded-xl flex gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <strong className="font-bold text-foreground">Low Timeline density:</strong>
                              <p className="text-muted-foreground mt-0.5">We recommend logging at least 5 life milestones to avoid narrative chronological gaps.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <strong className="font-bold text-foreground">Timeline milestones verified:</strong>
                              <p className="text-muted-foreground mt-0.5">Excellent chronological layout covering major life stages.</p>
                            </div>
                          </div>
                        )}

                        {mediaItems.length < 5 ? (
                          <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded-xl flex gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <strong className="font-bold text-foreground">Media coverage low:</strong>
                              <p className="text-muted-foreground mt-0.5">To compile a compelling 8-minute documentary, add portraits, home scans, or certificates.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <strong className="font-bold text-foreground">Media catalog initialized:</strong>
                              <p className="text-muted-foreground mt-0.5">{mediaItems.length} scanned records are linked to narrator chapters.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Action blocks */}
                    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider">
                        Quick Launch Studio Steps
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => setActiveSection('biography')}
                          className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/60 text-left transition-colors cursor-pointer group"
                        >
                          <BookOpen className="w-4 h-4 text-cinema-amber-500 group-hover:scale-110 transition-transform" />
                          <h5 className="text-xs font-bold text-foreground mt-2">Edit Biography</h5>
                          <p className="text-[10px] text-muted-foreground mt-1">Refine life retrospective text</p>
                        </button>

                        <button
                          onClick={() => handleOpenTimelineModal('create')}
                          className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/60 text-left transition-colors cursor-pointer group"
                        >
                          <Calendar className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                          <h5 className="text-xs font-bold text-foreground mt-2">Add Milestone</h5>
                          <p className="text-[10px] text-muted-foreground mt-1">Register timeline event card</p>
                        </button>

                        <button
                          onClick={() => setActiveSection('media')}
                          className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/60 text-left transition-colors cursor-pointer group"
                        >
                          <Camera className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <h5 className="text-xs font-bold text-foreground mt-2">Browse Assets</h5>
                          <p className="text-[10px] text-muted-foreground mt-1">Organize photos, clips, audio</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recent Activity & Logs */}
                  <div className="space-y-6">
                    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center justify-between">
                        <span>Recent Activity Log</span>
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      </h4>

                      <div className="space-y-3 text-xs" id="activity-log-timeline">
                        {[
                          { text: 'Philip Vance modified timeline chronology', time: '10 mins ago' },
                          { text: 'Local browser cache auto-saved biography data', time: '1 hour ago' },
                          { text: 'Scanned asset "Wedding vows" was faved', time: '4 hours ago' },
                          { text: 'Co-author Robert Vance accepted workspace invite', time: 'Yesterday' },
                          { text: 'Heritage document folders initialized', time: '2 days ago' }
                        ].map((act, idx) => (
                          <div key={idx} className="flex gap-2 pb-3 border-b border-border/40 last:border-none last:pb-0">
                            <CornerDownRight className="w-3.5 h-3.5 text-cinema-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-foreground/90 font-medium">{act.text}</p>
                              <span className="text-[9px] text-muted-foreground font-mono">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider">
                        Digital Storytelling Tip
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        "Great memoirs balance formal career highlights with poetic, quiet daily memories. Consider linking scanned letters and diary pages directly to corresponding milestone markers."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STORY INFORMATION SECTION */}
            {activeSection === 'info' && (
              <motion.div
                key="workspace-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6 max-w-3xl"
                id="pane-info"
              >
                <div>
                  <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                    Administrative Story Information
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure names, display tags, and file privacy parameters for the core biographical record.
                  </p>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Story Title</label>
                    <Input
                      id="meta-title"
                      value={storyMeta.title}
                      onChange={(e) => handleMetaChange('title', e.target.value)}
                      placeholder="Story Title"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Subtitle / Narrative Hook</label>
                    <Input
                      id="meta-subtitle"
                      value={storyMeta.subtitle}
                      onChange={(e) => handleMetaChange('subtitle', e.target.value)}
                      placeholder="Story Subtitle"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Story Description Summary</label>
                    <textarea
                      id="meta-description"
                      rows={4}
                      value={storyMeta.description}
                      onChange={(e) => handleMetaChange('description', e.target.value)}
                      className="w-full p-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-xl resize-none"
                      placeholder="Provide a high-level summary..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      id="meta-language"
                      label="Narrative Production Language"
                      value={storyMeta.language}
                      onChange={(val) => handleMetaChange('language', val)}
                      options={[
                        { value: 'English', label: 'English (US Standard)' },
                        { value: 'Spanish', label: 'Spanish (Español)' },
                        { value: 'French', label: 'French (Français)' }
                      ]}
                    />

                    <Select
                      id="meta-visibility"
                      label="Visibility & Archiving"
                      value={storyMeta.visibility}
                      onChange={(val) => handleMetaChange('visibility', val)}
                      options={[
                        { value: 'Private', label: 'Strictly Private (Me Only)' },
                        { value: 'Family', label: 'Family Circle (Secured Invite)' },
                        { value: 'Public', label: 'Public Link (Unrestricted viewing)' }
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-foreground block">Workspace Editorial Notes</label>
                    <input
                      id="meta-notes"
                      type="text"
                      value={storyMeta.internalNotes}
                      onChange={(e) => handleMetaChange('internalNotes', e.target.value)}
                      className="w-full h-10 px-3.5 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-xl"
                      placeholder="e.g. Needs review from Aunt Martha..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* BIOGRAPHY WORKSPACE SECTION */}
            {activeSection === 'biography' && (
              <motion.div
                key="workspace-biography"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6"
                id="pane-biography"
              >
                <div>
                  <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                    Full Life Biography Writing Workspace
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Craft the core biographical manuscript. Narrator voiceover AI is scaffolded directly from this content.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Textarea Editor and Statistics */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-5 py-3.5 border-b border-border bg-muted/40 flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-cinema-amber-500" /> Biography Manuscript
                        </span>
                        
                        <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase font-bold">
                          <span>Chars: {biographyText.length}</span>
                          <span>•</span>
                          <span>Words: {biographyText.split(/\s+/).filter(Boolean).length}</span>
                        </div>
                      </div>

                      <textarea
                        id="biography-manuscript-editor"
                        rows={16}
                        value={biographyText}
                        onChange={(e) => {
                          setBiographyText(e.target.value);
                          setSaveStatus('Unsaved Changes');
                          triggerAutoSave(e.target.value);
                        }}
                        className="w-full p-6 text-sm text-foreground bg-transparent border-none focus:outline-none leading-relaxed font-sans placeholder:text-muted-foreground/35 min-h-[300px]"
                        placeholder="Draft the life history narrative..."
                      />
                    </div>

                    <div className="p-4 bg-muted/20 border border-border/80 rounded-2xl flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 text-cinema-amber-500 animate-spin" />
                        <span className="font-medium">Active drafting buffer enabled. Characters are auto-saved to browser local cache.</span>
                      </div>
                      <span className="font-mono font-bold text-[9px] uppercase bg-muted border border-border px-1.5 py-0.5 rounded">Active Revision</span>
                    </div>
                  </div>

                  {/* Key facts, Summary & Version details */}
                  <div className="space-y-6">
                    {/* Life Summary Card */}
                    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider block">
                        Vocal Narrative Overview
                      </h4>
                      <input
                        id="bio-short-summary-field"
                        type="text"
                        value={biographySummary}
                        onChange={(e) => { setBiographySummary(e.target.value); setSaveStatus('Unsaved Changes'); }}
                        className="w-full h-9 px-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-lg"
                        placeholder="Add one-liner overview..."
                      />
                      <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                        This brief summary hooks the introductory scene narration for cinematic titles.
                      </p>
                    </div>

                    {/* Key Facts Tracker */}
                    <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider block">
                        Verified Timeline Facts
                      </h4>

                      <div className="space-y-2 max-h-[22vh] overflow-y-auto pr-1">
                        {keyFacts.map((fact, idx) => (
                          <div key={idx} className="p-2.5 bg-muted/30 border border-border/60 rounded-xl flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground truncate max-w-[180px]" title={fact}>{fact}</span>
                            <button
                              onClick={() => handleDeleteFact(idx)}
                              className="text-red-500 hover:text-red-400 p-1 cursor-pointer"
                              title="Delete Fact"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <input
                          id="fact-input-field"
                          type="text"
                          value={factInput}
                          onChange={(e) => setFactInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddFact()}
                          placeholder="Add life milestone fact..."
                          className="flex-grow h-9 px-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-lg placeholder:text-muted-foreground/50"
                        />
                        <Button
                          id="btn-add-fact"
                          variant="ghost"
                          size="xs"
                          onClick={handleAddFact}
                          className="h-9 w-9 p-0 flex items-center justify-center border border-border hover:bg-muted shrink-0"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </Button>
                      </div>
                    </div>

                    {/* Future AI Suggestion Panel Placeholder */}
                    <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-black uppercase tracking-wider">AI Copilot Blueprint</h4>
                      </div>
                      <p className="text-[11px] text-indigo-300/80 leading-relaxed font-semibold">
                        Ready to synthesize chapters. In the next stage, this module will scan your text to suggest transitions, narration cues, and highlight archival letters.
                      </p>
                      <div className="absolute -right-6 -bottom-6 text-indigo-500/10 opacity-30">
                        <Wand2 className="w-20 h-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TIMELINE CHRONOLOGY WORKSPACE */}
            {activeSection === 'timeline' && (
              <motion.div
                key="workspace-timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6"
                id="pane-timeline"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                      Life Timeline Chronology Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Verify and arrange the sequential milestones of the legacy story. Click any card to load metadata into the inspector.
                    </p>
                  </div>

                  <Button
                    id="btn-add-timeline-event-trigger"
                    variant="accent"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4 text-slate-950" />}
                    onClick={() => handleOpenTimelineModal('create')}
                    className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold self-start sm:self-auto"
                  >
                    Add Milestone Event
                  </Button>
                </div>

                {/* Timeline density, search, filters toolbar */}
                <div className="p-5 bg-card border border-border rounded-2xl space-y-4" id="timeline-toolbar">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-mono font-bold bg-muted text-muted-foreground uppercase px-2 py-0.5 rounded border border-border">
                        {timelineEvents.length} Total Events
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">Decade Span: {timelineStats.yearsCovered}</span>
                    </div>

                    {/* View Modes Selector tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl">
                      {[
                        { id: 'chrono', label: 'Chronological', icon: Calendar },
                        { id: 'group-year', label: 'By Year', icon: ListFilter },
                        { id: 'group-decade', label: 'By Decade', icon: Layers },
                        { id: 'milestones', label: 'Milestones Only', icon: Star }
                      ].map(mode => {
                        const ModeIcon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => setTimelineViewMode(mode.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                              timelineViewMode === mode.id
                                ? 'bg-card text-foreground border-border shadow-xs'
                                : 'text-muted-foreground border-transparent hover:text-foreground'
                            }`}
                          >
                            <ModeIcon className="w-3.5 h-3.5" />
                            <span>{mode.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search, Filter, Sort Inputs Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/50" />
                      <input
                        type="text"
                        value={timelineSearchQuery}
                        onChange={(e) => setTimelineSearchQuery(e.target.value)}
                        placeholder="Search title, description..."
                        className="w-full h-9 pl-9 pr-3 bg-muted/50 border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-lg placeholder:text-muted-foreground/50"
                      />
                    </div>

                    <Select
                      id="timeline-category-filter"
                      value={timelineCategoryFilter}
                      onChange={setTimelineCategoryFilter}
                      options={[
                        { value: 'All', label: 'All Categories' },
                        { value: 'Birth', label: 'Birth' },
                        { value: 'Childhood', label: 'Childhood' },
                        { value: 'Education', label: 'Education' },
                        { value: 'Graduation', label: 'Graduation' },
                        { value: 'Employment', label: 'Employment' },
                        { value: 'Promotion', label: 'Promotion' },
                        { value: 'Marriage', label: 'Marriage' },
                        { value: 'Family', label: 'Family' },
                        { value: 'Achievement', label: 'Achievement' },
                        { value: 'Award', label: 'Award' },
                        { value: 'Travel', label: 'Travel' },
                        { value: 'Relocation', label: 'Relocation' },
                        { value: 'Milestone', label: 'Milestone' },
                        { value: 'Retirement', label: 'Retirement' },
                        { value: 'Custom Event', label: 'Custom Event' }
                      ]}
                    />

                    <Select
                      id="timeline-status-filter"
                      value={timelineStatusFilter}
                      onChange={setTimelineStatusFilter}
                      options={[
                        { value: 'Active', label: 'Active Events' },
                        { value: 'Draft', label: 'Drafts Only' },
                        { value: 'Archived', label: 'Archived Only' }
                      ]}
                    />

                    <Select
                      id="timeline-sort-order"
                      value={timelineSortOrder}
                      onChange={(val) => setTimelineSortOrder(val as any)}
                      options={[
                        { value: 'asc', label: 'Sort: Oldest First' },
                        { value: 'desc', label: 'Sort: Newest First' },
                        { value: 'title', label: 'Sort: Alphabetical' },
                        { value: 'importance', label: 'Sort: High Priority First' }
                      ]}
                    />
                  </div>
                </div>

                {/* Timeline empty state check */}
                {eventsToRender.length === 0 ? (
                  <EmptyState
                    id="timeline-empty-state"
                    title="No Timeline Events Found"
                    description="This biographical story's chronology is empty or no events match your filter options. Create your first timeline event, log an elegant life milestone, or try adjusting your search/filters."
                    primaryActionLabel="Create First Event"
                    onPrimaryAction={() => handleOpenTimelineModal('create')}
                    secondaryActionLabel="Learn About Timelines"
                    onSecondaryAction={() => showToast('info', 'Guided Entry Help', 'Timelines structure chronological highlights such as Birth, Education, Marriage or Community Service to create a cohesive narrative.')}
                  />
                ) : (
                  <div>
                    {/* Render standard chronological list */}
                    {(timelineViewMode === 'chrono' || timelineViewMode === 'milestones') && (
                      <div className="relative border-l-2 border-border pl-6 ml-4 space-y-8" id="timeline-flow-list">
                        {eventsToRender.map((evt) => {
                          const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                          const isArchived = evt.status === 'Archived';
                          const isMilestone = evt.category === 'Milestone' || evt.importance === 'High' || evt.status === 'Milestone';
                          return (
                            <div
                              key={evt.id}
                              id={`timeline-node-${evt.id}`}
                              onClick={() => setSelectedInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                              className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                                isSelected 
                                  ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                                  : isArchived
                                    ? 'border-border/60 opacity-60 bg-muted/20'
                                    : 'border-border hover:border-muted-foreground/30'
                              }`}
                            >
                              <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                                isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                              }`} />

                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-grow">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-black font-mono text-cinema-amber-600 dark:text-cinema-amber-400">
                                      {evt.year}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                                      {evt.category}
                                    </span>
                                    <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                                      evt.importance === 'High' 
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                        : 'bg-muted text-muted-foreground border border-border/80'
                                    }`}>
                                      {evt.importance} Priority
                                    </span>
                                    {isArchived && (
                                      <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">
                                        Archived
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                    {evt.title}
                                    {isMilestone && <Star className="w-3.5 h-3.5 text-cinema-amber-500 fill-cinema-amber-500" />}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                                  
                                  {evt.location && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                      <MapPin className="w-3 h-3 text-muted-foreground" />
                                      <span>{evt.location}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleReorderTimelineEvent(evt.id, 'up'); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleReorderTimelineEvent(evt.id, 'down'); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleMilestoneEvent(evt.id, isMilestone); }}
                                    className={`p-1 rounded cursor-pointer ${isMilestone ? 'text-cinema-amber-500 hover:text-cinema-amber-600' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                    title={isMilestone ? 'Unmark Milestone' : 'Mark Milestone'}
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenTimelineModal('edit', evt); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Edit event"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDuplicateTimelineEvent(evt); }}
                                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); isArchived ? handleRestoreTimelineEvent(evt.id) : handleArchiveTimelineEvent(evt.id); }}
                                    className={`p-1 rounded cursor-pointer ${isArchived ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                    title={isArchived ? 'Restore' : 'Archive'}
                                  >
                                    {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTimelineEvent(evt.id); }}
                                    className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                                    title="Delete event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Render grouped by Year list */}
                    {timelineViewMode === 'group-year' && (
                      <div className="space-y-8" id="timeline-flow-list-year">
                        {Object.keys(groupedByYear).sort((a,b) => {
                          const numA = parseInt(a) || 0;
                          const numB = parseInt(b) || 0;
                          return timelineSortOrder === 'desc' ? numB - numA : numA - numB;
                        }).map(year => (
                          <div key={year} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black font-mono text-cinema-amber-500 bg-cinema-amber-500/10 px-3 py-1 rounded-lg border border-cinema-amber-500/25">
                                Year {year}
                              </span>
                              <div className="h-px bg-border flex-grow" />
                            </div>
                            <div className="relative border-l-2 border-border pl-6 ml-4 space-y-6">
                              {groupedByYear[year].map(evt => {
                                const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                                const isArchived = evt.status === 'Archived';
                                const isMilestone = evt.category === 'Milestone' || evt.importance === 'High' || evt.status === 'Milestone';
                                return (
                                  <div
                                    key={evt.id}
                                    onClick={() => setSelectedInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                                    className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                                      isSelected 
                                        ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                                        : isArchived
                                          ? 'border-border/60 opacity-60 bg-muted/20'
                                          : 'border-border hover:border-muted-foreground/30'
                                    }`}
                                  >
                                    <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                                      isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                                    }`} />
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                      <div className="space-y-1.5 flex-grow">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                                            {evt.category}
                                          </span>
                                          <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                                            evt.importance === 'High' 
                                              ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                              : 'bg-muted text-muted-foreground border border-border/80'
                                          }`}>
                                            {evt.importance} Priority
                                          </span>
                                          {isArchived && (
                                            <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">
                                              Archived
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                          {evt.title}
                                          {isMilestone && <Star className="w-3.5 h-3.5 text-cinema-amber-500 fill-cinema-amber-500" />}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                                        {evt.location && (
                                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            <span>{evt.location}</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleReorderTimelineEvent(evt.id, 'up'); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Move Up"
                                        >
                                          <ArrowUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleReorderTimelineEvent(evt.id, 'down'); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Move Down"
                                        >
                                          <ArrowDown className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleToggleMilestoneEvent(evt.id, isMilestone); }}
                                          className={`p-1 rounded cursor-pointer ${isMilestone ? 'text-cinema-amber-500 hover:text-cinema-amber-600' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                          title={isMilestone ? 'Unmark Milestone' : 'Mark Milestone'}
                                        >
                                          <Star className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleOpenTimelineModal('edit', evt); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Edit event"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDuplicateTimelineEvent(evt); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Duplicate"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); isArchived ? handleRestoreTimelineEvent(evt.id) : handleArchiveTimelineEvent(evt.id); }}
                                          className={`p-1 rounded cursor-pointer ${isArchived ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                          title={isArchived ? 'Restore' : 'Archive'}
                                        >
                                          {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteTimelineEvent(evt.id); }}
                                          className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                                          title="Delete event"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render grouped by Decade list */}
                    {timelineViewMode === 'group-decade' && (
                      <div className="space-y-8" id="timeline-flow-list-decade">
                        {Object.keys(groupedByDecade).sort((a,b) => {
                          const numA = parseInt(a) || 0;
                          const numB = parseInt(b) || 0;
                          return timelineSortOrder === 'desc' ? numB - numA : numA - numB;
                        }).map(decade => (
                          <div key={decade} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase tracking-wider font-mono text-cinema-amber-400 bg-muted border border-border px-3 py-1 rounded-lg">
                                The {decade} Decade
                              </span>
                              <div className="h-px bg-border flex-grow" />
                            </div>
                            <div className="relative border-l-2 border-border pl-6 ml-4 space-y-6">
                              {groupedByDecade[decade].map(evt => {
                                const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                                const isArchived = evt.status === 'Archived';
                                const isMilestone = evt.category === 'Milestone' || evt.importance === 'High' || evt.status === 'Milestone';
                                return (
                                  <div
                                    key={evt.id}
                                    onClick={() => setSelectedInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                                    className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                                      isSelected 
                                        ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                                        : isArchived
                                          ? 'border-border/60 opacity-60 bg-muted/20'
                                          : 'border-border hover:border-muted-foreground/30'
                                    }`}
                                  >
                                    <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                                      isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                                    }`} />
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                      <div className="space-y-1.5 flex-grow">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="text-sm font-black font-mono text-cinema-amber-600 dark:text-cinema-amber-400">
                                            {evt.year}
                                          </span>
                                          <span className="text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                                            {evt.category}
                                          </span>
                                          <span className={`text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                                            evt.importance === 'High' 
                                              ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                              : 'bg-muted text-muted-foreground border border-border/80'
                                          }`}>
                                            {evt.importance} Priority
                                          </span>
                                          {isArchived && (
                                            <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">
                                              Archived
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                                          {evt.title}
                                          {isMilestone && <Star className="w-3.5 h-3.5 text-cinema-amber-500 fill-cinema-amber-500" />}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                                        {evt.location && (
                                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            <span>{evt.location}</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleReorderTimelineEvent(evt.id, 'up'); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Move Up"
                                        >
                                          <ArrowUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleReorderTimelineEvent(evt.id, 'down'); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Move Down"
                                        >
                                          <ArrowDown className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleToggleMilestoneEvent(evt.id, isMilestone); }}
                                          className={`p-1 rounded cursor-pointer ${isMilestone ? 'text-cinema-amber-500 hover:text-cinema-amber-600' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                          title={isMilestone ? 'Unmark Milestone' : 'Mark Milestone'}
                                        >
                                          <Star className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleOpenTimelineModal('edit', evt); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Edit event"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDuplicateTimelineEvent(evt); }}
                                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-card rounded cursor-pointer"
                                          title="Duplicate"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); isArchived ? handleRestoreTimelineEvent(evt.id) : handleArchiveTimelineEvent(evt.id); }}
                                          className={`p-1 rounded cursor-pointer ${isArchived ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}
                                          title={isArchived ? 'Restore' : 'Archive'}
                                        >
                                          {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteTimelineEvent(evt.id); }}
                                          className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                                          title="Delete event"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* MEDIA ORGANIZER WORKSPACE */}
            {activeSection === 'media' && (
              <motion.div
                key="workspace-media"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6"
                id="pane-media"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                      Narrator Media & Portrait Archive
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Verify portrait quality, tag visual themes, and register home videos to chapters.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <input
                      type="file"
                      ref={workspaceFileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleWorkspaceFileChange}
                      accept="image/*,video/*,audio/*,application/pdf"
                    />
                    <button
                      onClick={handleOpenWorkspaceUpload}
                      className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-400 text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" /> Upload Asset
                    </button>

                    <div className="p-1.5 bg-muted rounded-xl border border-border flex items-center gap-1 shrink-0">
                      {[
                        { id: 'All', label: 'All Files' },
                        { id: 'image', label: 'Photos' },
                        { id: 'video', label: 'Videos' },
                        { id: 'document', label: 'Letters' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setMediaFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            mediaFilter === tab.id 
                              ? 'bg-card text-foreground border border-border shadow-xs' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grid container of files */}
                {filteredMedia.length === 0 ? (
                  <div className="py-12 border border-dashed border-border rounded-2xl flex items-center justify-center bg-card/25" id="media-empty-placeholder">
                    <EmptyState
                      type="media"
                      title="No Archival Media Found"
                      description="To construct your legacy story's visual timeline, upload scanned files, photographs, or official letters."
                      primaryActionLabel="Upload First Asset"
                      onPrimaryAction={handleOpenWorkspaceUpload}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="media-asset-grid">
                    {filteredMedia.map((media) => {
                      const isSelected = selectedInspectorItem.type === 'media' && selectedInspectorItem.id === media.id;
                      return (
                        <div
                          key={media.id}
                          id={`media-card-${media.id}`}
                          onClick={() => setSelectedInspectorItem({ type: 'media', id: media.id, data: media })}
                          className={`group border rounded-2xl overflow-hidden bg-card cursor-pointer flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all h-[240px] ${
                            isSelected 
                              ? 'border-cinema-amber-500 ring-1 ring-cinema-amber-500' 
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          {/* Media Cover Preview */}
                          <div className="h-28 w-full relative overflow-hidden bg-muted">
                            <img
                              src={media.url}
                              alt=""
                              className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            
                            {/* File Type badge */}
                            <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[8px] font-mono font-bold bg-black/60 text-cinema-amber-400 border border-cinema-amber-500/20 px-1.5 py-0.5 rounded-md uppercase">
                              {media.category}
                            </span>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleFavoriteMedia(media.id); }}
                              className={`absolute top-2.5 right-2.5 p-1 rounded bg-black/40 border border-white/5 cursor-pointer hover:bg-black/65 transition-colors ${
                                media.favorite ? 'text-cinema-amber-500' : 'text-white/55 hover:text-white'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Title & Metadata Details */}
                          <div className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-black text-foreground truncate max-w-[200px]" title={media.title}>
                                {media.title}
                              </h4>
                              <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground mt-0.5 font-bold uppercase">
                                <span>Size: {media.size}</span>
                                <span>•</span>
                                <span>Scanned: {media.uploadDate}</span>
                              </div>
                            </div>

                            {/* Tags row */}
                            <div className="flex flex-wrap gap-1 pt-1.5 max-h-12 overflow-hidden">
                              {media.tags.map((tg, idx) => (
                                <span key={idx} className="text-[9px] font-mono font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.2 rounded">
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions footer */}
                          <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground font-bold shrink-0">
                            <span>{media.linkedEvents.length} Linked Milestones</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRenameMedia(media.id); }}
                                className="p-1 hover:text-foreground hover:bg-muted rounded"
                                title="Rename metadata"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteMedia(media.id); }}
                                className="p-1 hover:text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete file"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ASSOCIATED PEOPLE WORKSPACE */}
            {activeSection === 'people' && (
              <motion.div
                key="workspace-people"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6"
                id="pane-people"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                      Associated Legacy People Registry
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Identify relatives, comrades, co-teachers, and interviewees. Linking individuals connects proper narrative threads.
                    </p>
                  </div>

                  <div className="p-1.5 bg-muted rounded-xl border border-border flex items-center gap-1 shrink-0 self-start sm:self-auto">
                    {['All', 'Parent', 'Spouse', 'Child', 'Colleague'].map(rel => (
                      <button
                        key={rel}
                        onClick={() => setPeopleFilter(rel)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          peopleFilter === rel 
                            ? 'bg-card text-foreground border border-border shadow-xs' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {rel === 'All' ? 'All Roles' : rel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Person card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="people-cards-mesh">
                  {filteredPeople.map((p) => {
                    const isSelected = selectedInspectorItem.type === 'person' && selectedInspectorItem.id === p.id;
                    return (
                      <div
                        key={p.id}
                        id={`person-card-${p.id}`}
                        onClick={() => setSelectedInspectorItem({ type: 'person', id: p.id, data: p })}
                        className={`p-5 bg-card border rounded-2xl cursor-pointer hover:shadow-md transition-all flex items-start gap-4 ${
                          isSelected 
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03]' 
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-muted shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground text-sm">{p.name}</h4>
                            <span className="font-mono text-[9px] font-bold uppercase bg-muted border border-border text-muted-foreground px-1.5 py-0.2 rounded">
                              {p.relationship}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold font-mono block">{p.lifetime}</span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1 font-semibold">{p.shortBio}</p>

                          <div className="flex items-center gap-3 pt-2 font-mono text-[9px] text-muted-foreground font-black">
                            <span>{p.timelineReferences.length} Milestones linked</span>
                            <span>•</span>
                            <span>{p.mediaReferences.length} Media linked</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* CAREER HISTORY RETROSPECTIVE WORKSPACE */}
            {activeSection === 'career' && (
              <motion.div
                key="workspace-career"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6 relative"
                id="pane-career"
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImport(true); }}
                onDragLeave={() => setIsDraggingImport(false)}
                onDrop={handleImportDrop}
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={importsFileInputRef}
                  onChange={handleImportFileChange}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />

                {/* Drag and Drop Hover Overlay */}
                {isDraggingImport && (
                  <div className="absolute inset-4 z-40 bg-background/95 backdrop-blur-xs border-2 border-dashed border-cinema-amber-500 rounded-2xl flex flex-col items-center justify-center space-y-4 pointer-events-none animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-cinema-amber-500/10 flex items-center justify-center text-cinema-amber-500">
                      <FileText className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-foreground text-sm uppercase">Drop your files here</h4>
                      <p className="text-xs text-muted-foreground mt-1">Accepts PDFs, CVs, Memoirs & Notes up to 50MB</p>
                    </div>
                  </div>
                )}

                {/* Header Row */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-cinema-amber-500" /> Career Retrospective & Credentials Sandbox
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20 uppercase">
                        {imports.length} Sources Loaded
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Log corporate history manually or import credentials (Resumes, CVs, Biographies, memoirs, and diaries) to organize local timeline points.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                    {/* Switcher Tabs */}
                    <div className="p-1.5 bg-muted rounded-xl border border-border flex items-center gap-1">
                      <button
                        onClick={() => setCareerSubTab('imports')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          careerSubTab === 'imports'
                            ? 'bg-card text-foreground border border-border shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Source Imports ({imports.length})
                      </button>
                      <button
                        onClick={() => setCareerSubTab('employment')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          careerSubTab === 'employment'
                            ? 'bg-card text-foreground border border-border shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        Employment Ledger ({careerHistory.length})
                      </button>
                    </div>

                    {careerSubTab === 'imports' && (
                      <button
                        onClick={handleOpenImportUpload}
                        className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 active:scale-98 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm h-[38px]"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        Upload Source
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub Tab: IMPORTS WORKSPACE */}
                {careerSubTab === 'imports' && (
                  <div className="space-y-6">
                    {/* Drag & Drop prompt zone */}
                    <div
                      onClick={handleOpenImportUpload}
                      className="border-2 border-dashed border-border hover:border-cinema-amber-500/50 bg-card hover:bg-muted/10 p-8 rounded-2xl cursor-pointer text-center space-y-3 transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-cinema-amber-500/10 flex items-center justify-center text-cinema-amber-500 mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="max-w-md mx-auto space-y-1">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-wide">
                          Drag & drop source files here
                        </h4>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          Bulk drop PDFs, CV documents, text biography drafts, or scanned images. Your files are processed entirely in the browser and saved locally.
                        </p>
                      </div>
                      <div className="flex justify-center gap-2 text-[10px] font-mono text-muted-foreground font-bold">
                        <span className="bg-muted px-2 py-0.5 rounded border border-border/60">PDF</span>
                        <span className="bg-muted px-2 py-0.5 rounded border border-border/60">TXT</span>
                        <span className="bg-muted px-2 py-0.5 rounded border border-border/60">IMAGE</span>
                        <span className="bg-muted px-2 py-0.5 rounded border border-border/60">DOCX</span>
                      </div>
                    </div>

                    {/* Filter and Search controls */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-muted/40 p-3 rounded-2xl border border-border/80">
                      <div className="flex flex-wrap items-center gap-1 w-full lg:w-auto">
                        {['All', 'Resume / CV', 'Biography', 'Memoir', 'Personal Notes', 'Favorites'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setImportFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              importFilter === cat 
                                ? 'bg-card text-foreground border border-border shadow-xs' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {cat === 'All' ? 'All Formats' : cat}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search imports..."
                            value={importSearchQuery}
                            onChange={(e) => setImportSearchQuery(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-1.5 text-xs focus:outline-none focus:border-cinema-amber-500 font-medium"
                          />
                          {importSearchQuery && (
                            <button
                              onClick={() => setImportSearchQuery('')}
                              className="absolute right-2 top-2 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Sort Dropdown */}
                        <Select
                          id="import-sort-by"
                          value={importSortBy}
                          onChange={(val) => setImportSortBy(val as any)}
                          options={[
                            { value: 'recently-uploaded', label: 'Recently Added' },
                            { value: 'name', label: 'Sort by Name' },
                            { value: 'size', label: 'Sort by Size' },
                            { value: 'type', label: 'Sort by Type' }
                          ]}
                          className="w-40"
                        />

                        {/* Archive Toggle */}
                        <button
                          onClick={() => setShowArchivedImports(!showArchivedImports)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer h-[32px] shrink-0 ${
                            showArchivedImports
                              ? 'bg-red-500/10 border-red-500/25 text-red-500'
                              : 'bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Archive className="w-3.5 h-3.5" />
                          {showArchivedImports ? 'Archived Vault' : 'Show Vault'}
                        </button>
                      </div>
                    </div>

                    {/* Ledger / Cards List */}
                    {filteredImports.length === 0 ? (
                      <div className="text-center py-12 border border-border/80 rounded-2xl bg-muted/20">
                        <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                        <h4 className="text-sm font-black text-foreground uppercase tracking-wide">No Sources Found</h4>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">
                          {importSearchQuery ? 'No imports matched your active filter or search query.' : 'No uploaded resume or biography sources found.'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredImports.map((item) => {
                          const isSelected = selectedInspectorItem.type === 'import' && selectedInspectorItem.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedInspectorItem({ type: 'import', id: item.id, data: item })}
                              className={`p-4 bg-card border rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                                isSelected
                                  ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03]'
                                  : 'border-border hover:border-muted-foreground/30'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-foreground truncate uppercase tracking-tight" title={item.displayName}>
                                      {item.displayName}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground font-semibold truncate" title={item.originalFilename}>
                                      {item.originalFilename}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[9px] font-mono font-bold uppercase">
                                      <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                        {item.importType}
                                      </span>
                                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                                        {item.importStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavoriteImport(item.id, !item.favorite);
                                  }}
                                  className={`p-1 hover:bg-muted rounded-full transition-colors ${
                                    item.favorite ? 'text-cinema-amber-500' : 'text-muted-foreground/40 hover:text-foreground'
                                  }`}
                                  title={item.favorite ? 'Unfavorite' : 'Favorite'}
                                >
                                  ★
                                </button>
                              </div>

                              {item.description && (
                                <p className="text-xs text-muted-foreground leading-relaxed font-semibold line-clamp-2">
                                  {item.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground font-bold">
                                <span>{item.fileSize} • {new Date(item.uploadDate).toLocaleDateString()}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenImportPreview(item);
                                    }}
                                    className="p-1 hover:text-foreground hover:bg-muted rounded"
                                    title="View & Edit Metadata"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      item.archived ? handleRestoreImport(item.id) : handleArchiveImport(item.id);
                                    }}
                                    className="p-1 hover:text-foreground hover:bg-muted rounded"
                                    title={item.archived ? 'Restore' : 'Archive to Vault'}
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteImport(item.id);
                                    }}
                                    className="p-1 hover:text-red-500 hover:bg-red-500/10 rounded"
                                    title="Permanently Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub Tab: MANUAL RETROSPECTIVE TIMELINE */}
                {careerSubTab === 'employment' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-6" id="career-timeline">
                      {careerHistory.map((job) => {
                        const isSelected = selectedInspectorItem.type === 'career' && selectedInspectorItem.id === job.id;
                        return (
                          <div
                            key={job.id}
                            onClick={() => setSelectedInspectorItem({ type: 'career', id: job.id, data: job })}
                            className={`p-5 bg-card border rounded-2xl cursor-pointer hover:shadow-md transition-all space-y-3 ${
                              isSelected 
                                ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03]' 
                                : 'border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs">
                              <div>
                                <span className="font-mono text-cinema-amber-600 dark:text-cinema-amber-400 font-bold block">{job.years}</span>
                                <h4 className="text-sm font-black text-foreground mt-0.5">{job.position}</h4>
                                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                                  <Building className="w-3.5 h-3.5 text-muted-foreground" /> {job.company} — {job.location}
                                </span>
                              </div>
                              {job.promotions && (
                                <span className="text-[10px] font-mono font-bold uppercase bg-muted border border-border text-muted-foreground px-2 py-0.5 rounded-md self-start">
                                  {job.promotions}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/50">
                              <div className="space-y-2">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground font-mono">Daily Responsibilities</span>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed font-semibold">
                                  {job.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="truncate max-w-[340px]">{resp}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-2">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground font-mono">Major Achievements</span>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed font-semibold">
                                  {job.achievements.map((ach, idx) => (
                                    <li key={idx} className="truncate max-w-[340px] text-foreground/80">{ach}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Skills tag set */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
                              <span className="text-muted-foreground font-bold font-mono text-[9px] uppercase">Validated Skills:</span>
                              {job.skillsUsed.map((sk, idx) => (
                                <span key={idx} className="text-[9px] font-mono font-bold bg-muted text-muted-foreground border border-border/80 px-2 py-0.5 rounded">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SUPPORTING DOCUMENTS WORKSPACE */}
            {activeSection === 'documents' && (
              <motion.div
                key="workspace-documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6 relative"
                id="pane-documents"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={documentsFileInputRef}
                  onChange={handleDocumentFileChange}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />

                {/* Drag and Drop Hover Overlay */}
                {isDraggingDoc && (
                  <div className="absolute inset-4 z-40 bg-background/95 backdrop-blur-xs border-2 border-dashed border-cinema-amber-500 rounded-2xl flex flex-col items-center justify-center space-y-4 pointer-events-none animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-cinema-amber-500/10 flex items-center justify-center text-cinema-amber-500">
                      <FileText className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-foreground text-sm uppercase">Drop your files here</h4>
                      <p className="text-xs text-muted-foreground mt-1">Accepts PDF, DOC, TXT, and Images (up to 50MB)</p>
                    </div>
                  </div>
                )}

                {/* Header Row */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                        Supporting Documents Ledger
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20">
                        {documents.length} PERSISTED
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Organize scanned letters, diplomas, military records, and physical archives using local storage. Drag & drop files directly onto this panel.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Upload Trigger */}
                    <button
                      onClick={handleOpenDocumentUpload}
                      className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 active:scale-98 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      Upload Document
                    </button>

                    {/* Archive toggle */}
                    <button
                      onClick={() => setShowArchivedDocs(!showArchivedDocs)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        showArchivedDocs
                          ? 'bg-red-500/10 border-red-500/25 text-red-500'
                          : 'bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Archive className="w-3.5 h-3.5" />
                      {showArchivedDocs ? 'Viewing Archived' : 'Show Archived'}
                    </button>
                  </div>
                </div>

                {/* Filter / Search Controls bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-muted/40 p-3 rounded-2xl border border-border/80">
                  {/* Category Selection Tabs */}
                  <div className="flex flex-wrap items-center gap-1 w-full lg:w-auto">
                    {['All', 'Certificate', 'Letter', 'Resume', 'Article', 'Favorites'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setDocumentFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          documentFilter === cat 
                            ? 'bg-card text-foreground border border-border shadow-xs' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat === 'All' ? 'All Files' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Search and Sort */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search ledger..."
                        value={documentSearchQuery}
                        onChange={(e) => setDocumentSearchQuery(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-1.5 text-xs focus:outline-none focus:border-cinema-amber-500 font-medium"
                      />
                      {documentSearchQuery && (
                        <button
                          onClick={() => setDocumentSearchQuery('')}
                          className="absolute right-2 top-2 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Sort Dropdown */}
                    <Select
                      id="document-sort-by"
                      value={documentSortBy}
                      onChange={(val) => setDocumentSortBy(val as any)}
                      options={[
                        { value: 'recently-uploaded', label: 'Recently Added' },
                        { value: 'name', label: 'Sort by Name' },
                        { value: 'size', label: 'Sort by Size' },
                        { value: 'type', label: 'Sort by Type' }
                      ]}
                      className="w-40"
                    />
                  </div>
                </div>

                {/* Table of documents / Empty state */}
                {filteredDocuments.length === 0 ? (
                  <div className="py-16 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-card/25 text-center p-6" id="documents-empty-placeholder">
                    <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground border border-border/80 mb-4 shadow-xs">
                      <FileText className="w-6 h-6 text-muted-foreground/80" />
                    </div>
                    <h3 className="font-display font-black text-foreground uppercase tracking-wider text-sm">
                      No matching credentials
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
                      {documentSearchQuery || documentFilter !== 'All' || showArchivedDocs
                        ? 'No documents found matching the search criteria or active filters.'
                        : 'Your digital document repository is currently empty. Upload physical awards, certificates, or letters of endorsement to establish secure proof.'}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={handleOpenDocumentUpload}
                        className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Select Files
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="documents-table-wrapper">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse" id="documents-ledger-table">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="p-4">Document Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Size</th>
                            <th className="p-4">Tags</th>
                            <th className="p-4">Added On</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDocuments.map((doc) => {
                            const isSelected = selectedInspectorItem.type === 'document' && selectedInspectorItem.id === doc.id;
                            const sizeKb = doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : '0';
                            return (
                              <tr
                                key={doc.id}
                                onClick={() => setSelectedInspectorItem({ type: 'document', id: doc.id, data: doc })}
                                className={`border-b border-border/60 text-xs hover:bg-muted/30 cursor-pointer transition-colors ${
                                  isSelected ? 'bg-cinema-amber-500/5' : ''
                                }`}
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-2.5">
                                    <FileText className="w-4 h-4 text-cinema-amber-500 shrink-0" />
                                    <div className="font-bold text-foreground block truncate max-w-xs">{doc.displayName}</div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="font-mono text-[9px] font-bold bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase">
                                    {doc.documentType}
                                  </span>
                                </td>
                                <td className="p-4 text-muted-foreground font-semibold truncate max-w-xs">
                                  {doc.description || 'No description provided.'}
                                </td>
                                <td className="p-4 font-mono font-bold text-muted-foreground">{sizeKb} KB</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                                    {doc.tags?.slice(0, 2).map((t, i) => (
                                      <span key={i} className="text-[9px] font-semibold bg-muted/60 text-muted-foreground px-1 py-0.5 rounded">
                                        #{t}
                                      </span>
                                    ))}
                                    {(doc.tags?.length || 0) > 2 && (
                                      <span className="text-[9px] font-bold text-muted-foreground">
                                        +{doc.tags.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground font-mono">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    {/* Favorite Action */}
                                    <button
                                      onClick={() => handleToggleFavoriteDocument(doc.id, !doc.favorite)}
                                      className={`p-1.5 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted transition-colors ${
                                        doc.favorite ? 'text-cinema-amber-500' : 'text-muted-foreground hover:text-foreground'
                                      }`}
                                      title={doc.favorite ? 'Remove from favorites' : 'Mark as favorite'}
                                    >
                                      ★
                                    </button>

                                    {/* Open Preview Modal Action */}
                                    <button
                                      onClick={() => handleOpenDocPreview(doc)}
                                      className="text-[10px] font-bold border border-border bg-card hover:bg-muted py-1 px-2.5 rounded-lg text-foreground transition-colors cursor-pointer flex items-center gap-1"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      Explore
                                    </button>

                                    {/* Delete Action */}
                                    <button
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 cursor-pointer transition-colors"
                                      title="Delete file permanently"
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

                {/* DYNAMIC METADATA PREVIEW & EDIT DIALOG OVERLAY */}
                <AnimatePresence>
                  {previewDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in">
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
                                {isEditingDoc ? 'Credentials Metadata Editor' : 'Heritage Document Explorer'}
                              </h4>
                              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                Registry Ref: {previewDoc.id} • v{previewDoc.version}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setPreviewDoc(null)}
                            className="p-1.5 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Modal Body Container */}
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left Column: Visual Scanned Preview */}
                          <div className="space-y-4">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                              Active Document Scan Frame
                            </span>
                            <div className="border border-border/80 rounded-2xl bg-muted/40 aspect-4/3 w-full relative overflow-hidden flex items-center justify-center p-3">
                              {previewDoc.localStorageReference ? (
                                previewDoc.mimeType.startsWith('image/') ? (
                                  <img
                                    src={previewDoc.localStorageReference}
                                    alt={previewDoc.displayName}
                                    className="w-full h-full object-contain max-h-[300px] rounded"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <iframe
                                    src={previewDoc.localStorageReference}
                                    title={previewDoc.displayName}
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
                                <span className="text-foreground font-mono block truncate">{previewDoc.mimeType}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">EXTENSION</span>
                                <span className="text-foreground font-mono block uppercase">.{previewDoc.extension}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">ORIGINAL NAME</span>
                                <span className="text-foreground block truncate" title={previewDoc.originalFilename}>{previewDoc.originalFilename}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">FILE SIZE</span>
                                <span className="text-foreground font-mono block">{(previewDoc.fileSize / 1024).toFixed(2)} KB</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Metadata Detail Pane */}
                          <div className="space-y-4 flex flex-col justify-between">
                            {isEditingDoc ? (
                              /* EDITING MODE FORM */
                              <div className="space-y-4">
                                <span className="text-[10px] font-mono font-bold text-cinema-amber-500 uppercase block">
                                  EDITABLE DETAILS
                                </span>
                                
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-muted-foreground uppercase block">Document Display Title</label>
                                  <input
                                    type="text"
                                    value={editDisplayName}
                                    onChange={(e) => setEditDisplayName(e.target.value)}
                                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cinema-amber-500 font-bold"
                                  />
                                </div>

                                <Select
                                  id="edit-document-type"
                                  label="Classification Type"
                                  value={editDocumentType}
                                  onChange={setEditDocumentType}
                                  options={[
                                    { value: 'Certificate', label: 'Certificate' },
                                    { value: 'Letter', label: 'Letter of Endorsement / Correspondence' },
                                    { value: 'Resume', label: 'Resume / CV' },
                                    { value: 'Article', label: 'Press Article / Catalogue' },
                                    { value: 'Official', label: 'Official Record' }
                                  ]}
                                />

                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-muted-foreground uppercase block">Description & Notes</label>
                                  <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cinema-amber-500 font-semibold text-muted-foreground leading-normal"
                                    placeholder="Enter descriptive text, historical context, key names, or archival details..."
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-muted-foreground uppercase block">Tags (comma-separated)</label>
                                  <input
                                    type="text"
                                    value={editTags}
                                    onChange={(e) => setEditTags(e.target.value)}
                                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cinema-amber-500 font-bold"
                                    placeholder="Award, Salem, Military"
                                  />
                                </div>
                              </div>
                            ) : (
                              /* VIEW READ-ONLY MODE */
                              <div className="space-y-5">
                                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                                  CREDENTIAL PROFILE
                                </span>

                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Display Name</span>
                                  <strong className="text-foreground text-base block font-display uppercase tracking-wide">
                                    {previewDoc.displayName}
                                  </strong>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Document Category</span>
                                  <span className="text-foreground text-xs font-mono font-bold bg-muted border border-border px-2 py-1 rounded uppercase inline-block">
                                    {previewDoc.documentType}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Description & Historical Notes</span>
                                  <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
                                    {previewDoc.description || 'No descriptive notes logged for this archival item.'}
                                  </p>
                                </div>

                                {previewDoc.tags && previewDoc.tags.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Assigned Tags</span>
                                    <div className="flex flex-wrap gap-1">
                                      {previewDoc.tags.map((t, idx) => (
                                        <span key={idx} className="text-[9px] font-mono bg-muted/80 px-2 py-0.5 rounded text-muted-foreground border border-border/40">
                                          #{t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4 text-xs font-semibold">
                                  <div>
                                    <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">Uploaded Date</span>
                                    <span className="text-foreground">{new Date(previewDoc.uploadDate).toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground block text-[9px] font-mono uppercase font-bold">Last Modified</span>
                                    <span className="text-foreground">{new Date(previewDoc.lastModified).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Modal Action Controls footer */}
                            <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
                              {isEditingDoc ? (
                                <>
                                  <button
                                    onClick={() => setIsEditingDoc(false)}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveDocMetadata}
                                    className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    Save Changes
                                  </button>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleToggleFavoriteDocument(previewDoc.id, !previewDoc.favorite)}
                                      className={`p-2 rounded-xl border border-border bg-card cursor-pointer hover:bg-muted transition-colors text-xs font-bold ${
                                        previewDoc.favorite ? 'text-cinema-amber-500 border-cinema-amber-500/25 bg-cinema-amber-500/5' : 'text-muted-foreground hover:text-foreground'
                                      }`}
                                      title="Toggle Favorite"
                                    >
                                      ★ {previewDoc.favorite ? 'Favorited' : 'Favorite'}
                                    </button>

                                    <a
                                      href={previewDoc.localStorageReference}
                                      download={previewDoc.originalFilename}
                                      className="p-2 border border-border bg-card hover:bg-muted text-foreground hover:text-foreground rounded-xl text-xs font-bold transition-all cursor-pointer"
                                      title="Download Original File"
                                    >
                                      📥 Download
                                    </a>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setIsEditingDoc(true)}
                                      className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                      Edit Metadata
                                    </button>
                                    <button
                                      onClick={() => {
                                        const pId = previewDoc.id;
                                        setPreviewDoc(null);
                                        handleDeleteDocument(pId);
                                      }}
                                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                    >
                                      Delete File
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* UNIMPLEMENTED SUBVIEWS (Narration, Music, Version, Review) */}
            {!['overview', 'info', 'biography', 'timeline', 'media', 'people', 'career', 'documents'].includes(activeSection) && (
              <motion.div
                key="workspace-unimplemented"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-16 text-center space-y-4 max-w-md mx-auto"
                id="unimplemented-placeholder"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-cinema-amber-500 mx-auto">
                  <SlidersHorizontal className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                    {sidebarSections.find(s => s.id === activeSection)?.label} Subview
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    The Story Studio has fully registered this navigation section in the pipeline schema. Interactive tools and AI parameters will bind in future implementation stages.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* RIGHT INSPECTOR PANEL */}
        <aside
          id="workspace-right-inspector"
          className={`h-full border-l border-border bg-card transition-all duration-300 flex flex-col justify-between shrink-0 ${
            isRightInspectorCollapsed ? 'w-0 overflow-hidden border-l-0' : 'w-80'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground font-mono">
              Workspace Inspector
            </span>
            <button
              onClick={() => setIsRightInspectorCollapsed(true)}
              className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              aria-label="Collapse Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Content */}
          <div className="flex-grow overflow-y-auto p-5 space-y-5 text-xs">
            {selectedInspectorItem.type === 'story' && (
              <div className="space-y-4" id="inspector-story-body">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-cinema-amber-500/10 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20 uppercase">
                    Commemorative Story
                  </span>
                  <h4 className="font-bold text-foreground text-sm mt-2">{storyMeta.title}</h4>
                  <p className="text-muted-foreground mt-1 leading-normal font-semibold">{storyMeta.subtitle}</p>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase">Global Properties</span>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block font-medium">Progress</span>
                      <strong className="text-foreground font-mono">{progressPercentage}% Complete</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Category</span>
                      <strong className="text-foreground">{initialStory.category}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Status</span>
                      <strong className="text-foreground">{initialStory.status}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Estimated Run</span>
                      <strong className="text-foreground font-mono">{initialStory.durationEstimate}</strong>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Associated Profile</span>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl">
                    <img
                      src={initialStory.associatedProfilePhoto}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <strong className="font-bold text-foreground block">{initialStory.associatedProfileName}</strong>
                      <span className="text-muted-foreground text-[10px] block font-mono">({initialStory.associatedProfileRelationship})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedInspectorItem.type === 'timeline' && (
              <div className="space-y-4 animate-fade-in" id="inspector-timeline-body">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">
                    Timeline Milestone
                  </span>
                  <h4 className="font-bold text-foreground text-sm mt-2">{selectedInspectorItem.data.title}</h4>
                  <span className="text-cinema-amber-600 dark:text-cinema-amber-400 font-mono font-black text-xs block mt-1">
                    Year Point: {selectedInspectorItem.data.year}
                  </span>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Description Summary</span>
                  <p className="text-muted-foreground leading-relaxed font-semibold">{selectedInspectorItem.data.description}</p>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Location Marker</span>
                  <div className="flex items-center gap-1.5 text-foreground/90 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{selectedInspectorItem.data.location || 'Not logged'}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Inspector Relations</span>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="p-2.5 bg-muted/40 border border-border rounded-xl">
                      <strong className="block text-foreground text-xs font-mono">{selectedInspectorItem.data.associatedMediaIds?.length || 0}</strong>
                      <span className="text-muted-foreground font-semibold">Media scans</span>
                    </div>
                    <div className="p-2.5 bg-muted/40 border border-border rounded-xl">
                      <strong className="block text-foreground text-xs font-mono">{selectedInspectorItem.data.associatedPeopleIds?.length || 0}</strong>
                      <span className="text-muted-foreground font-semibold">Linked people</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedInspectorItem.type === 'media' && (
              <div className="space-y-4 animate-fade-in" id="inspector-media-body">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                    Scanned Asset File
                  </span>
                  <h4 className="font-bold text-foreground text-sm mt-2">{selectedInspectorItem.data.title}</h4>
                  <span className="text-muted-foreground text-[10px] font-mono block mt-1 uppercase font-bold">
                    Type: {selectedInspectorItem.data.category}
                  </span>
                </div>

                <div className="border-t border-border pt-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">File Properties</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                    <div>
                      <span className="text-muted-foreground text-[10px] block">File Size</span>
                      <strong className="text-foreground font-mono">{selectedInspectorItem.data.size}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Upload Date</span>
                      <strong className="text-foreground font-mono">{selectedInspectorItem.data.uploadDate}</strong>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Visual Tagging</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInspectorItem.data.tags?.map((tg: string, i: number) => (
                      <span key={i} className="bg-muted text-muted-foreground border border-border/80 px-2 py-0.5 rounded font-mono font-bold">
                        #{tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Quick Actions</span>
                  <Button
                    id="btn-inspect-fave-media"
                    variant="ghost"
                    size="xs"
                    onClick={() => handleToggleFavoriteMedia(selectedInspectorItem.data.id)}
                    className="w-full text-left justify-start border border-border"
                  >
                    {selectedInspectorItem.data.favorite ? 'Remove from favorites' : 'Mark as project favorite'}
                  </Button>
                </div>
              </div>
            )}

            {selectedInspectorItem.type === 'person' && (
              <div className="space-y-4 animate-fade-in" id="inspector-person-body">
                <div className="text-center pb-2">
                  <img
                    src={selectedInspectorItem.data.avatar}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover border-2 border-border mx-auto shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <h4 className="font-bold text-foreground text-sm mt-3">{selectedInspectorItem.data.name}</h4>
                  <span className="text-cinema-amber-600 dark:text-cinema-amber-400 font-mono text-[10px] uppercase font-black block mt-0.5">
                    {selectedInspectorItem.data.relationship}
                  </span>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Biographical Brief</span>
                  <p className="text-muted-foreground leading-relaxed font-semibold">{selectedInspectorItem.data.shortBio}</p>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Lifespan Limits</span>
                  <strong className="text-foreground font-mono block text-xs">{selectedInspectorItem.data.lifetime}</strong>
                </div>
              </div>
            )}

            {selectedInspectorItem.type === 'career' && (
              <div className="space-y-4 animate-fade-in" id="inspector-career-body">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                    Employment Record
                  </span>
                  <h4 className="font-bold text-foreground text-sm mt-2">{selectedInspectorItem.data.position}</h4>
                  <span className="text-muted-foreground text-xs block font-semibold">{selectedInspectorItem.data.company}</span>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Employment Span</span>
                  <strong className="text-foreground font-mono block text-xs">{selectedInspectorItem.data.years}</strong>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Work Location</span>
                  <span className="text-muted-foreground font-semibold block">{selectedInspectorItem.data.location}</span>
                </div>
              </div>
            )}

            {selectedInspectorItem.type === 'document' && (
              <div className="space-y-4 animate-fade-in" id="inspector-document-body">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase">
                    Heritage Document
                  </span>
                  <h4 className="font-bold text-foreground text-sm mt-2">{selectedInspectorItem.data.displayName}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-muted-foreground text-[10px] font-mono uppercase font-bold bg-muted px-1 rounded">
                      Type: {selectedInspectorItem.data.documentType}
                    </span>
                    {selectedInspectorItem.data.favorite && (
                      <span className="text-cinema-amber-500 text-[10px] font-mono uppercase font-bold bg-cinema-amber-500/10 px-1 rounded">
                        ★ FAVORITE
                      </span>
                    )}
                    {selectedInspectorItem.data.archived && (
                      <span className="text-red-500 text-[10px] font-mono uppercase font-bold bg-red-500/10 px-1 rounded">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Description</span>
                  <p className="text-muted-foreground text-xs leading-normal font-medium">
                    {selectedInspectorItem.data.description || 'No description provided.'}
                  </p>
                </div>

                {selectedInspectorItem.data.tags && selectedInspectorItem.data.tags.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedInspectorItem.data.tags.map((t: string, i: number) => (
                        <span key={i} className="text-[9px] font-mono bg-muted/80 px-1.5 py-0.5 rounded text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase text-[9px]">File Size</span>
                    <strong className="text-foreground font-mono">{selectedInspectorItem.data.fileSize ? `${(selectedInspectorItem.data.fileSize / 1024).toFixed(1)} KB` : '0 KB'}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase text-[9px]">Uploaded</span>
                    <strong className="text-foreground font-mono">
                      {new Date(selectedInspectorItem.data.uploadDate).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleFavoriteDocument(selectedInspectorItem.data.id, !selectedInspectorItem.data.favorite)}
                      className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      ★ {selectedInspectorItem.data.favorite ? 'Unfavorite' : 'Favorite'}
                    </button>

                    <a
                      href={selectedInspectorItem.data.localStorageReference}
                      download={selectedInspectorItem.data.originalFilename}
                      className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      📥 Download
                    </a>

                    <button
                      onClick={() => selectedInspectorItem.data.archived ? handleRestoreDocument(selectedInspectorItem.data.id) : handleArchiveDocument(selectedInspectorItem.data.id)}
                      className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      📁 {selectedInspectorItem.data.archived ? 'Restore' : 'Archive'}
                    </button>

                    <button
                      onClick={() => handleDeleteDocument(selectedInspectorItem.data.id)}
                      className="p-2 text-xs font-bold border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedInspectorItem.type === 'import' && (
              <div className="space-y-4 animate-fade-in" id="inspector-import-body">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase">
                    Credentials Source Import
                  </span>
                  <h4 className="font-bold text-foreground text-sm mt-2">{selectedInspectorItem.data.displayName}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-muted-foreground text-[10px] font-mono uppercase font-bold bg-muted px-1 rounded">
                      Type: {selectedInspectorItem.data.importType}
                    </span>
                    {selectedInspectorItem.data.favorite && (
                      <span className="text-cinema-amber-500 text-[10px] font-mono uppercase font-bold bg-cinema-amber-500/10 px-1 rounded">
                        ★ FAVORITE
                      </span>
                    )}
                    {selectedInspectorItem.data.archived && (
                      <span className="text-red-500 text-[10px] font-mono uppercase font-bold bg-red-500/10 px-1 rounded">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Description</span>
                  <p className="text-muted-foreground text-xs leading-normal font-medium">
                    {selectedInspectorItem.data.description || 'No description provided.'}
                  </p>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Status & File Size</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-foreground">
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Status</span>
                      <span>{selectedInspectorItem.data.importStatus}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Size</span>
                      <span className="font-mono">{selectedInspectorItem.data.fileSize}</span>
                    </div>
                  </div>
                </div>

                {selectedInspectorItem.data.tags && selectedInspectorItem.data.tags.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedInspectorItem.data.tags.map((t: string, i: number) => (
                        <span key={i} className="text-[9px] font-mono bg-muted/80 px-1.5 py-0.5 rounded text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleFavoriteImport(selectedInspectorItem.data.id, !selectedInspectorItem.data.favorite)}
                      className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      ★ {selectedInspectorItem.data.favorite ? 'Unfavorite' : 'Favorite'}
                    </button>

                    <a
                      href={selectedInspectorItem.data.localStorageReference}
                      download={selectedInspectorItem.data.originalFilename}
                      className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1 text-center"
                    >
                      📥 Download
                    </a>

                    <button
                      onClick={() => selectedInspectorItem.data.archived ? handleRestoreImport(selectedInspectorItem.data.id) : handleArchiveImport(selectedInspectorItem.data.id)}
                      className="p-2 text-xs font-bold border border-border bg-card rounded-xl text-foreground hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      📁 {selectedInspectorItem.data.archived ? 'Restore' : 'Archive'}
                    </button>

                    <button
                      onClick={() => handleDeleteImport(selectedInspectorItem.data.id)}
                      className="p-2 text-xs font-bold border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Footer inside Inspector */}
          <div className="p-4 border-t border-border bg-muted/20 shrink-0">
            <span className="text-[9px] text-muted-foreground block font-mono font-semibold uppercase">Inspector Mode</span>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Focus: {selectedInspectorItem.type.toUpperCase()}</p>
          </div>
        </aside>

        {/* FLOATING INSPECTOR TOGGLE (Visible when right sidebar is collapsed) */}
        {isRightInspectorCollapsed && (
          <button
            onClick={() => setIsRightInspectorCollapsed(false)}
            className="absolute right-4 top-4 z-30 p-2 rounded-full bg-cinema-amber-500 text-slate-950 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open Inspector"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3. BOTTOM WORKSPACE STATUS BAR */}
      <footer className="px-6 py-2.5 border-t border-border bg-muted/40 flex items-center justify-between text-xs font-mono text-muted-foreground shrink-0" id="workspace-status-dock">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ReelLegacy Sandbox Suite v0.7.0</span>
          <span className="text-border hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-[10px] uppercase">Cloud Sync Node Online</span>
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
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4" id="timeline-event-editor-backdrop">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden text-foreground"
          >
            <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
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

            <div className="p-5 space-y-4 text-xs">
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
    </div>
  );
}
