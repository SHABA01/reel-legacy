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
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../context/ToastContext';
import { ExtendedStory } from './mockStoriesData';

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

  // 5. TIMELINE EVENTS STATE (Mocked with richness)
  const [timelineEvents, setTimelineEvents] = useState<LocalTimelineEvent[]>(() => {
    const cached = localStorage.getItem(`rl_timeline_${initialStory.id}`);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [
      {
        id: 'evt-1',
        year: '1944',
        title: 'Born in Portland, Maine',
        description: 'Elizabeth Vance is born to schoolteacher parents Arthur and Martha Miller during the peak of autumn colors.',
        category: 'Childhood',
        importance: 'High',
        location: 'Mercy Hospital, Portland, ME',
        associatedMediaIds: ['med-1'],
        associatedPeopleIds: ['per-1', 'per-2']
      },
      {
        id: 'evt-2',
        year: '1962',
        title: 'Matriculated at Mount Holyoke College',
        description: 'Enrolls with a double major in Historical Literature and Art History. Begins watercolor work in her free time.',
        category: 'Education',
        importance: 'Medium',
        location: 'South Hadley, MA',
        associatedMediaIds: ['med-2'],
        associatedPeopleIds: []
      },
      {
        id: 'evt-3',
        year: '1966',
        title: 'Married Philip Vance & Relocated',
        description: 'Vows exchanged in Portland, followed by relocation to Salem, MA for Philip’s first architectural residency.',
        category: 'Family',
        importance: 'High',
        location: 'St. John’s Chapel, Portland, ME',
        associatedMediaIds: ['med-3'],
        associatedPeopleIds: ['per-3']
      },
      {
        id: 'evt-4',
        year: '1974',
        title: 'Founded the Salem Literacy Center',
        description: 'Converts a former bakery building into a volunteer-led classroom library. Secures municipal endowment support.',
        category: 'Career',
        importance: 'High',
        location: 'Salem, MA',
        associatedMediaIds: ['med-4'],
        associatedPeopleIds: ['per-4']
      },
      {
        id: 'evt-5',
        year: '1982',
        title: 'Birth of Son Robert Vance',
        description: 'Expands the family household. Continues administrative work at the center part-time.',
        category: 'Family',
        importance: 'Medium',
        location: 'Salem General Hospital',
        associatedMediaIds: ['med-5'],
        associatedPeopleIds: ['per-3', 'per-5']
      },
      {
        id: 'evt-6',
        year: '2008',
        title: 'Massachusetts Educational Service Medal',
        description: 'Formally honored at the State House by the Governor for thirty-four years of continuous civic service.',
        category: 'Milestone',
        importance: 'High',
        location: 'Boston State House',
        associatedMediaIds: ['med-6'],
        associatedPeopleIds: ['per-3', 'per-5']
      }
    ];
  });

  // Modal State for Timeline actions
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [timelineModalMode, setTimelineModalMode] = useState<'create' | 'edit'>('create');
  const [activeTimelineEvent, setActiveTimelineEvent] = useState<Partial<LocalTimelineEvent>>({});

  // 6. MEDIA ITEMS STATE
  const [mediaItems, setMediaItems] = useState<LocalMediaItem[]>(() => {
    const cached = localStorage.getItem(`rl_media_${initialStory.id}`);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [
      {
        id: 'med-1',
        type: 'image',
        category: 'Photo',
        title: 'Elizabeth in Crib, 1944',
        size: '1.4 MB',
        uploadDate: '2026-06-12',
        status: 'Ready',
        tags: ['Infancy', 'Black & White', 'Maine'],
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
        linkedEvents: ['evt-1'],
        linkedChapters: ['ch-w1'],
        favorite: true
      },
      {
        id: 'med-2',
        type: 'image',
        category: 'Photo',
        title: 'Mount Holyoke Campus Portrait, 1965',
        size: '2.8 MB',
        uploadDate: '2026-06-15',
        status: 'Ready',
        tags: ['College', 'Youth', 'Vocal Guide'],
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
        linkedEvents: ['evt-2'],
        linkedChapters: ['ch-w1'],
        favorite: false
      },
      {
        id: 'med-3',
        type: 'image',
        category: 'Photo',
        title: 'Wedding vows on Portland Cliffs',
        size: '4.1 MB',
        uploadDate: '2026-06-15',
        status: 'Ready',
        tags: ['Wedding', 'Vance Couple', 'Maine'],
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
        linkedEvents: ['evt-3'],
        linkedChapters: ['ch-w2'],
        favorite: true
      },
      {
        id: 'med-4',
        type: 'document',
        category: 'Letter',
        title: 'Salem Center Founding Charter',
        size: '12.4 MB',
        uploadDate: '2026-06-18',
        status: 'Ready',
        tags: ['Civic', 'Charter', 'Scan'],
        url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80',
        linkedEvents: ['evt-4'],
        linkedChapters: ['ch-w2'],
        favorite: false
      },
      {
        id: 'med-5',
        type: 'image',
        category: 'Photo',
        title: 'Robert age 2 in Sandbox',
        size: '1.9 MB',
        uploadDate: '2026-06-20',
        status: 'Ready',
        tags: ['Robert', 'Childhood', 'Salem House'],
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
        linkedEvents: ['evt-5'],
        linkedChapters: ['ch-w2'],
        favorite: false
      },
      {
        id: 'med-6',
        type: 'image',
        category: 'Photo',
        title: 'Elizabeth and State Medal award',
        size: '3.6 MB',
        uploadDate: '2026-06-22',
        status: 'Ready',
        tags: ['Honor', 'Award Ceremony', 'Boston'],
        url: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=400&q=80',
        linkedEvents: ['evt-6'],
        linkedChapters: ['ch-w3'],
        favorite: true
      },
      {
        id: 'med-7',
        type: 'video',
        category: 'Clip',
        title: 'Cape Cod Watercolor session video',
        size: '48.9 MB',
        uploadDate: '2026-06-25',
        status: 'Ready',
        tags: ['Art', 'Cape Cod', 'Home Movie'],
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80',
        linkedEvents: [],
        linkedChapters: ['ch-w3'],
        favorite: false
      }
    ];
  });

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
  const [documents, setDocuments] = useState<LocalDocument[]>([
    {
      id: 'doc-1',
      title: 'Massachusetts Lifetime Educational Service Medal',
      category: 'Certificate',
      citationPrefix: 'State Archival Record Vol 4',
      dateStr: '2008-05-14',
      fileSize: '4.2 MB',
      isScanned: true,
      notes: 'State House formal certificate verifying civic contributions.',
      tags: ['Civic Award', 'Salem Center']
    },
    {
      id: 'doc-2',
      title: 'Curriculum Vitae: Elizabeth Vance',
      category: 'Resume',
      citationPrefix: 'Personal Dossier',
      dateStr: '2011-09-01',
      fileSize: '1.1 MB',
      isScanned: false,
      notes: 'Full comprehensive listing of classrooms, publications, and state grants.',
      tags: ['Employment', 'CV']
    },
    {
      id: 'doc-3',
      title: 'Letter of Endorsement from Salem Mayor',
      category: 'Letter',
      citationPrefix: 'Vance Correspondence file 8',
      dateStr: '1974-03-22',
      fileSize: '2.5 MB',
      isScanned: true,
      notes: 'Formal support enabling rent-free zoning for the central facility.',
      tags: ['Zoning', 'Political Support']
    },
    {
      id: 'doc-4',
      title: 'Watercolors Exhibit Catalogue Profile',
      category: 'Article',
      citationPrefix: 'Barnstable Library Press',
      dateStr: '2016-08-10',
      fileSize: '8.7 MB',
      isScanned: true,
      notes: 'Review of the "Spindrift and Dunes" solo Cape Cod art exhibit.',
      tags: ['Cape Cod Exhibit', 'Watercolor Art']
    }
  ]);

  const [documentSearchQuery, setDocumentSearchQuery] = useState<string>('');
  const [documentFilter, setDocumentFilter] = useState<string>('All');

  // Sync to database triggers (Local persistence fallback)
  useEffect(() => {
    localStorage.setItem(`rl_timeline_${initialStory.id}`, JSON.stringify(timelineEvents));
  }, [timelineEvents, initialStory.id]);

  useEffect(() => {
    localStorage.setItem(`rl_media_${initialStory.id}`, JSON.stringify(mediaItems));
  }, [mediaItems, initialStory.id]);

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
        id: `evt-${Date.now()}`,
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

  const handleSaveTimelineEvent = () => {
    if (!activeTimelineEvent.year || !activeTimelineEvent.title || !activeTimelineEvent.description) {
      showToast('warning', 'Missing Details', 'Year, title, and description are required milestones.');
      return;
    }

    if (timelineModalMode === 'create') {
      const newList = [...timelineEvents, activeTimelineEvent as LocalTimelineEvent].sort(
        (a, b) => parseInt(a.year) - parseInt(b.year)
      );
      setTimelineEvents(newList);
      showToast('success', 'Event Created', `"${activeTimelineEvent.title}" added chronologically.`);
    } else {
      const newList = timelineEvents.map(e => e.id === activeTimelineEvent.id ? (activeTimelineEvent as LocalTimelineEvent) : e).sort(
        (a, b) => parseInt(a.year) - parseInt(b.year)
      );
      setTimelineEvents(newList);
      showToast('success', 'Event Updated', `"${activeTimelineEvent.title}" edits preserved.`);
    }
    setSaveStatus('Unsaved Changes');
    setIsTimelineModalOpen(false);
  };

  const handleDeleteTimelineEvent = (id: string) => {
    if (confirm('Permanently remove this chronological event from the story ledger?')) {
      const filtered = timelineEvents.filter(e => e.id !== id);
      setTimelineEvents(filtered);
      showToast('error', 'Event Deleted', 'Chronology point pruned.');
      setSaveStatus('Unsaved Changes');
      if (selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === id) {
        setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
      }
    }
  };

  const handleDuplicateTimelineEvent = (evt: LocalTimelineEvent) => {
    const copy: LocalTimelineEvent = {
      ...evt,
      id: `evt-copy-${Date.now()}`,
      title: `${evt.title} (Copy)`
    };
    const newList = [...timelineEvents, copy].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    setTimelineEvents(newList);
    showToast('success', 'Event Duplicated', 'Cloned milestone added.');
    setSaveStatus('Unsaved Changes');
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
  const handleToggleFavoriteMedia = (id: string) => {
    const updated = mediaItems.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m);
    setMediaItems(updated);
    const item = mediaItems.find(m => m.id === id);
    if (item) {
      showToast(
        'success',
        !item.favorite ? 'Added to Favorites' : 'Removed from Favorites',
        `"${item.title}" favorited status updated.`
      );
    }
    setSaveStatus('Unsaved Changes');
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Permanently disconnect and delete this media file?')) {
      setMediaItems(mediaItems.filter(m => m.id !== id));
      showToast('error', 'Media Disconnected', 'Scanned image files unlinked.');
      setSaveStatus('Unsaved Changes');
      if (selectedInspectorItem.type === 'media' && selectedInspectorItem.id === id) {
        setSelectedInspectorItem({ type: 'story', id: initialStory.id, data: initialStory });
      }
    }
  };

  const handleRenameMedia = (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    if (!item) return;
    const newTitle = prompt('Enter new file metadata title:', item.title);
    if (newTitle && newTitle.trim()) {
      setMediaItems(mediaItems.map(m => m.id === id ? { ...m, title: newTitle.trim() } : m));
      showToast('success', 'File Renamed');
      setSaveStatus('Unsaved Changes');
    }
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
      const matchesSearch = doc.title.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.notes.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.tags.some(t => t.toLowerCase().includes(documentSearchQuery.toLowerCase()));
      const matchesFilter = documentFilter === 'All' || doc.category === documentFilter;
      return matchesSearch && matchesFilter;
    });
  }, [documents, documentSearchQuery, documentFilter]);

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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Narrative Production Language</label>
                      <select
                        id="meta-language"
                        value={storyMeta.language}
                        onChange={(e) => handleMetaChange('language', e.target.value)}
                        className="w-full h-10 px-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-xl cursor-pointer"
                      >
                        <option value="English">English (US Standard)</option>
                        <option value="Spanish">Spanish (Español)</option>
                        <option value="French">French (Français)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Visibility & Archiving</label>
                      <select
                        id="meta-visibility"
                        value={storyMeta.visibility}
                        onChange={(e) => handleMetaChange('visibility', e.target.value)}
                        className="w-full h-10 px-3 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 rounded-xl cursor-pointer"
                      >
                        <option value="Private">Strictly Private (Me Only)</option>
                        <option value="Family">Family Circle (Secured Invite)</option>
                        <option value="Public">Public Link (Unrestricted viewing)</option>
                      </select>
                    </div>
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
                <div className="p-4 bg-card border border-border rounded-2xl flex flex-wrap gap-4 items-center justify-between" id="timeline-toolbar">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold bg-muted text-muted-foreground uppercase px-2 py-0.5 rounded border border-border">
                      {timelineEvents.length} Sequential Events
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">Decade Span: 1944 – 2011</span>
                  </div>

                  {/* Filter elements */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline font-bold">Chronology Sort:</span>
                    <select
                      id="timeline-sort-select"
                      className="h-8 px-2 bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none rounded-lg cursor-pointer"
                      defaultValue="asc"
                    >
                      <option value="asc">Ascending (Oldest First)</option>
                      <option value="desc">Descending (Newest First)</option>
                    </select>
                  </div>
                </div>

                {/* Timeline cards chronological flow */}
                <div className="relative border-l-2 border-border pl-6 ml-4 space-y-8" id="timeline-flow-list">
                  {timelineEvents.map((evt) => {
                    const isSelected = selectedInspectorItem.type === 'timeline' && selectedInspectorItem.id === evt.id;
                    return (
                      <div
                        key={evt.id}
                        id={`timeline-node-${evt.id}`}
                        onClick={() => setSelectedInspectorItem({ type: 'timeline', id: evt.id, data: evt })}
                        className={`group relative p-5 bg-card border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500' 
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        {/* Chronology timeline node circular dot */}
                        <div className={`absolute -left-[31px] top-7 w-4 h-4 rounded-full border-2 transition-all ${
                          isSelected ? 'bg-cinema-amber-500 border-background scale-110' : 'bg-background border-border group-hover:border-muted-foreground/50'
                        }`} />

                        {/* Event details */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
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
                            </div>

                            <h4 className="text-xs font-black text-foreground">{evt.title}</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold max-w-2xl">{evt.description}</p>
                            
                            {evt.location && (
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono pt-1">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span>{evt.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Edit/Delete action bar */}
                          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-muted/40 p-1 rounded-lg border border-border opacity-60 group-hover:opacity-100 transition-opacity">
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

                  <div className="p-1.5 bg-muted rounded-xl border border-border flex items-center gap-1 shrink-0 self-start sm:self-auto">
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

                {/* Grid container of files */}
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
                className="p-6 md:p-8 space-y-6"
                id="pane-career"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cinema-amber-500" /> Career Retrospective & Employment Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Log corporate foundations, promotions, and pedagogical work. Prepared for future smart resume parsing.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <strong className="font-bold text-indigo-400 block uppercase tracking-wider text-[10px]">Resume Import Sandbox Placeholder</strong>
                    <p className="text-indigo-300/80 font-semibold">Bulk upload PDFs or Word documents to auto-populate employment dates and key skills.</p>
                  </div>
                  <Button
                    id="btn-fake-import-resume"
                    variant="ghost"
                    size="xs"
                    onClick={() => showToast('info', 'Resume Parser', 'Resume import engine will compile in the next development stage.')}
                    className="border border-indigo-500/30 hover:bg-indigo-500/5 text-indigo-400 text-xs py-2 px-3 h-auto shrink-0 self-start sm:self-auto"
                  >
                    Import Resume PDF
                  </Button>
                </div>

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
              </motion.div>
            )}

            {/* SUPPORTING DOCUMENTS WORKSPACE */}
            {activeSection === 'documents' && (
              <motion.div
                key="workspace-documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 md:p-8 space-y-6"
                id="pane-documents"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider">
                      Supporting Documents Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Organize scanned letters, diplomas, military records, and physical archives.
                    </p>
                  </div>

                  <div className="p-1.5 bg-muted rounded-xl border border-border flex items-center gap-1 shrink-0 self-start sm:self-auto">
                    {['All', 'Certificate', 'Letter', 'Resume', 'Article'].map(cat => (
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
                </div>

                {/* Table of documents */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" id="documents-table-wrapper">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="documents-ledger-table">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <th className="p-4">Document Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Citations Prefix</th>
                          <th className="p-4">Size</th>
                          <th className="p-4">Scan State</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => {
                          const isSelected = selectedInspectorItem.type === 'document' && selectedInspectorItem.id === doc.id;
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
                                  <span className="font-bold text-foreground block truncate max-w-xs">{doc.title}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="font-mono text-[9px] font-bold bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase">
                                  {doc.category}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-muted-foreground">{doc.citationPrefix}</td>
                              <td className="p-4 font-mono font-bold text-muted-foreground">{doc.fileSize}</td>
                              <td className="p-4">
                                <span className={`text-[9px] font-mono font-bold uppercase ${doc.isScanned ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {doc.isScanned ? 'HIGH-RES SCAN' : 'DIGITAL ONLY'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={(e) => { e.stopPropagation(); showToast('info', 'File Viewer', `Pre-rendering preview for "${doc.title}"...`); }}
                                  className="text-[10px] font-bold border border-border bg-card hover:bg-muted py-1 px-2.5 rounded-lg text-foreground transition-colors cursor-pointer"
                                >
                                  Preview File
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                  <h4 className="font-bold text-foreground text-sm mt-2">{selectedInspectorItem.data.title}</h4>
                  <span className="text-muted-foreground text-[10px] font-mono block mt-1 uppercase font-bold">
                    Class: {selectedInspectorItem.data.category}
                  </span>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Citation Registry Prefix</span>
                  <code className="text-foreground bg-muted p-1.5 rounded block text-[10px] font-mono border border-border">
                    {selectedInspectorItem.data.citationPrefix}
                  </code>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase block">Editorial Notes</span>
                  <p className="text-muted-foreground leading-normal font-semibold">{selectedInspectorItem.data.notes}</p>
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

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Category tag *</label>
                  <select
                    id="modal-category-select"
                    value={activeTimelineEvent.category || 'Milestone'}
                    onChange={(e) => setActiveTimelineEvent({ ...activeTimelineEvent, category: e.target.value as any })}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold cursor-pointer"
                  >
                    <option value="Childhood">Childhood</option>
                    <option value="Education">Education</option>
                    <option value="Career">Career</option>
                    <option value="Family">Family</option>
                    <option value="Milestone">General Milestone</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Historical">Historical Archive</option>
                  </select>
                </div>
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Visual Priority</label>
                  <select
                    id="modal-importance-select"
                    value={activeTimelineEvent.importance || 'Medium'}
                    onChange={(e) => setActiveTimelineEvent({ ...activeTimelineEvent, importance: e.target.value as any })}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-xl focus:outline-none focus:border-cinema-amber-500 font-semibold cursor-pointer"
                  >
                    <option value="High">High (Cinematic highlight)</option>
                    <option value="Medium">Medium (Standard chapter entry)</option>
                    <option value="Low">Low (Background reference)</option>
                  </select>
                </div>
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

    </div>
  );
}
