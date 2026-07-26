/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Sparkles,
  Plus,
  Search,
  Filter,
  Film,
  Camera,
  Calendar,
  Users,
  Mic,
  Sliders,
  Eye,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Copy,
  CheckCircle,
  Clock,
  Music,
  Video,
  Grid,
  List,
  ArrowRight,
  Layers,
  X,
  Check,
  Tag,
  AlertCircle,
  FileText,
  Play
} from 'lucide-react';
import { calculateSceneStatistics } from '../../utils/storyReadiness';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { SearchInput } from '../ui/SearchInput';
import { FilterDropdown } from '../ui/FilterDropdown';
import { ViewModeToggle } from '../ui/ViewModeToggle';
import { StoryCharacter } from './CharactersWorkspace';

export interface StoryScene {
  id: string;
  storyId: string;
  sceneNumber: number;
  title: string;
  subtitle?: string;
  description: string;
  purpose: string;
  storySegment:
    | 'Opening Sequence'
    | 'Childhood & Roots'
    | 'Career & Breakthrough'
    | 'Life Pivot & Turning Point'
    | 'Legacy & Reflections'
    | 'Closing Outro'
    | 'Custom Sequence';
  type:
    | 'Documentary'
    | 'Interview Cut'
    | 'Photo Montage'
    | 'Archival Spotlight'
    | 'Narrative Chapter'
    | 'Title Card';
  estimatedDuration: string; // e.g. "0m 45s", "1m 30s"
  notes?: string;
  status: 'Draft' | 'Needs Media' | 'Needs Narration' | 'Ready' | 'Locked' | 'Completed';

  // Linked References
  timelineEventIds: string[];
  characterIds: string[];
  primaryCharacterId?: string;
  mediaIds: string[];
  quotes?: string[];

  // Narration
  narrationText: string;
  narrationStatus: 'Draft' | 'Unwritten' | 'Scripted' | 'Synthesized' | 'Recorded';
  assignedVoice: string;
  estimatedReadingTime?: string;

  // Music & Soundtrack
  musicTrack: string;
  musicMood: string;
  musicVolume: number; // 0 - 100
  fadeIn: boolean;
  fadeOut: boolean;

  // Camera Direction & Visuals
  cameraMovement:
    | 'Slow Ken Burns Pan'
    | 'Zoom In'
    | 'Zoom Out'
    | 'Static Frame'
    | 'Tilt Up'
    | 'Pan Right'
    | 'Focus Drift';
  zoomStyle: 'Subtle (1.05x)' | 'Medium (1.15x)' | 'Dramatic (1.30x)';
  panDirection: 'Left to Right' | 'Right to Left' | 'Top to Bottom' | 'Bottom to Top' | 'Center In';
  focusPoint: 'Center' | 'Face Detect' | 'Top Left' | 'Subject Hand';

  // Transitions
  transitionType:
    | 'Cross Dissolve'
    | 'Fade to Black'
    | 'Cut'
    | 'Dip to White'
    | 'Slide Left'
    | 'Slow Hold';
}

interface ScenesWorkspaceProps {
  storyId: string;
  storyTitle: string;
  scenes: StoryScene[];
  onUpdateScenes: (updatedScenes: StoryScene[]) => void;
  timelineEvents?: any[];
  characters?: StoryCharacter[];
  mediaItems?: any[];
  selectedSceneId?: string;
  onSelectScene?: (scene: StoryScene) => void;
  showToast: (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    description?: string
  ) => void;
}

const STORY_SEGMENTS = [
  'Opening Sequence',
  'Childhood & Roots',
  'Career & Breakthrough',
  'Life Pivot & Turning Point',
  'Legacy & Reflections',
  'Closing Outro',
  'Custom Sequence',
] as const;

const SCENE_TYPES = [
  'Documentary',
  'Interview Cut',
  'Photo Montage',
  'Archival Spotlight',
  'Narrative Chapter',
  'Title Card',
] as const;

const SCENE_STATUSES = [
  'Draft',
  'Needs Media',
  'Needs Narration',
  'Ready',
  'Locked',
  'Completed',
] as const;

const VOICE_OPTIONS = [
  'Warm Legacy Memoirist (Deep Male)',
  'Warm Family Biographer (Gentle Female)',
  'Documentary Broadcaster (Classic)',
  'Cinematic Historian (Resonant)',
];

const MUSIC_TRACKS = [
  'Acoustic Nostalgia (Guitar)',
  'Orchestral Heritage (Strings & Piano)',
  'Golden Hour Piano (Solo)',
  'Vintage Folk Ballad (Acoustic)',
  'Ambient Memory (Synthesizer & Felt)',
  'None',
];

const CAMERA_MOVEMENTS = [
  'Slow Ken Burns Pan',
  'Zoom In',
  'Zoom Out',
  'Static Frame',
  'Tilt Up',
  'Pan Right',
  'Focus Drift',] as const;

const TRANSITION_TYPES = [
  'Cross Dissolve',
  'Fade to Black',
  'Cut',
  'Dip to White',
  'Slide Left',
  'Slow Hold',] as const;

export function ScenesWorkspace({
  storyId,
  storyTitle,
  scenes,
  onUpdateScenes,
  timelineEvents = [],
  characters = [],
  mediaItems = [],
  selectedSceneId,
  onSelectScene,
  showToast,
}: ScenesWorkspaceProps) {
  // State variables
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [segmentFilter, setSegmentFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [editingScene, setEditingScene] = useState<StoryScene | null>(null);
  const [detailTab, setDetailTab] = useState<
    'general' | 'timeline' | 'characters' | 'media' | 'narration' | 'music' | 'camera'
  >('general');

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    sceneId: string;
    sceneTitle: string;
  }>({
    isOpen: false,
    sceneId: '',
    sceneTitle: '',
  });

  // Form State for Manual Creation
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSegment, setNewSegment] = useState<StoryScene['storySegment']>('Opening Sequence');
  const [newType, setNewType] = useState<StoryScene['type']>('Documentary');
  const [newDuration, setNewDuration] = useState<string>('1m 00s');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newPurpose, setNewPurpose] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newSelectedEvents, setNewSelectedEvents] = useState<string[]>([]);
  const [newSelectedCharacters, setNewSelectedCharacters] = useState<string[]>([]);
  const [newSelectedMedia, setNewSelectedMedia] = useState<string[]>([]);

  // Filtered Scenes
  const filteredScenes = useMemo(() => {
    return scenes.filter((scene) => {
      const matchesSearch =
        scene.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scene.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scene.notes && scene.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        scene.narrationText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scene.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || scene.status === statusFilter;
      const matchesSegment = segmentFilter === 'All' || scene.storySegment === segmentFilter;

      return matchesSearch && matchesStatus && matchesSegment;
    });
  }, [scenes, searchQuery, statusFilter, segmentFilter]);

  // Scene Statistics
  const statistics = useMemo(() => calculateSceneStatistics(scenes), [scenes]);

  // Actions
  const handleOpenCreateModal = () => {
    setNewTitle('');
    setNewSegment('Opening Sequence');
    setNewType('Documentary');
    setNewDuration('1m 00s');
    setNewDescription('');
    setNewPurpose('');
    setNewNotes('');
    setNewSelectedEvents(timelineEvents.length > 0 ? [timelineEvents[0].id] : []);
    setNewSelectedCharacters(characters.length > 0 ? [characters[0].id] : []);
    setNewSelectedMedia(mediaItems.length > 0 ? [mediaItems[0].id] : []);
    setIsCreateModalOpen(true);
  };

  const handleCreateSceneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('warning', 'Scene Title Required', 'Please provide a title for the new scene.');
      return;
    }

    const newScene: StoryScene = {
      id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      storyId,
      sceneNumber: scenes.length + 1,
      title: newTitle.trim(),
      description: newDescription.trim() || 'A vital documentary segment capturing life milestones.',
      purpose: newPurpose.trim() || 'Establish narrative momentum for the story chapter.',
      storySegment: newSegment,
      type: newType,
      estimatedDuration: newDuration.trim() || '1m 00s',
      notes: newNotes.trim(),
      status: 'Draft',
      timelineEventIds: newSelectedEvents,
      characterIds: newSelectedCharacters,
      mediaIds: newSelectedMedia,
      narrationText: newDescription.trim() ? `In this chapter, ${newDescription.trim()}` : '',
      narrationStatus: 'Draft',
      assignedVoice: VOICE_OPTIONS[0],
      estimatedReadingTime: newDuration,
      musicTrack: MUSIC_TRACKS[0],
      musicMood: 'Warm & Intimate',
      musicVolume: 65,
      fadeIn: true,
      fadeOut: true,
      cameraMovement: 'Slow Ken Burns Pan',
      zoomStyle: 'Subtle (1.05x)',
      panDirection: 'Left to Right',
      focusPoint: 'Center',
      transitionType: 'Cross Dissolve',
    };

    const updated = [...scenes, newScene];
    onUpdateScenes(updated);
    setIsCreateModalOpen(false);
    showToast('success', 'Scene Created', `"${newScene.title}" has been added to Scene #${newScene.sceneNumber}.`);
  };

  const handleAiGenerateScenes = () => {
    setIsAiGenerating(true);
    showToast('info', 'AI Director Analyzing', 'Mapping story milestones into documentary scene cuts...');

    setTimeout(() => {
      const generatedScenes: StoryScene[] = [
        {
          id: `scene-ai-1-${Date.now()}`,
          storyId,
          sceneNumber: 1,
          title: `Prologue: Heritage & Early Foundations`,
          subtitle: `Introduction to the family lineage and ancestral roots`,
          description: `Establishes the heritage backdrop, introductory quotes, and ancestral roots before the main journey begins.`,
          purpose: `Set the emotional tone and historical context for ${storyTitle}.`,
          storySegment: 'Opening Sequence',
          type: 'Title Card',
          estimatedDuration: '0m 45s',
          notes: 'Use historical sepia tone styling with gentle ambient guitar.',
          status: 'Ready',
          timelineEventIds: timelineEvents.slice(0, 1).map((e) => e.id),
          characterIds: characters.slice(0, 2).map((c) => c.id),
          mediaIds: mediaItems.slice(0, 2).map((m) => m.id),
          narrationText: `Every great story begins with roots. Before the journey unfolded, the foundation was laid by those who came before.`,
          narrationStatus: 'Scripted',
          assignedVoice: VOICE_OPTIONS[0],
          estimatedReadingTime: '0m 45s',
          musicTrack: MUSIC_TRACKS[1],
          musicMood: 'Warm & Intimate',
          musicVolume: 70,
          fadeIn: true,
          fadeOut: true,
          cameraMovement: 'Slow Ken Burns Pan',
          zoomStyle: 'Subtle (1.05x)',
          panDirection: 'Left to Right',
          focusPoint: 'Center',
          transitionType: 'Cross Dissolve',
        },
        {
          id: `scene-ai-2-${Date.now()}`,
          storyId,
          sceneNumber: 2,
          title: `Formative Years & Early Mentors`,
          subtitle: `Childhood memories and guiding influences`,
          description: `Explores early childhood milestones, botanical watercolor lessons, and formative schooling in Massachusetts.`,
          purpose: `Highlight key childhood figures who inspired Elizabeth's academic and artistic path.`,
          storySegment: 'Childhood & Roots',
          type: 'Documentary',
          estimatedDuration: '1m 30s',
          notes: 'Focus camera pan on vintage childhood family portraits.',
          status: 'Needs Media',
          timelineEventIds: timelineEvents.slice(1, 3).map((e) => e.id),
          characterIds: characters.slice(0, 3).map((c) => c.id),
          mediaIds: mediaItems.slice(1, 3).map((m) => m.id),
          narrationText: `Growing up in Salem, early days were filled with curiosity, botanical sketches, and quiet lessons in history that shaped a lifelong passion.`,
          narrationStatus: 'Draft',
          assignedVoice: VOICE_OPTIONS[1],
          estimatedReadingTime: '1m 20s',
          musicTrack: MUSIC_TRACKS[0],
          musicMood: 'Reflective',
          musicVolume: 60,
          fadeIn: true,
          fadeOut: true,
          cameraMovement: 'Zoom In',
          zoomStyle: 'Medium (1.15x)',
          panDirection: 'Center In',
          focusPoint: 'Face Detect',
          transitionType: 'Cross Dissolve',
        },
        {
          id: `scene-ai-3-${Date.now()}`,
          storyId,
          sceneNumber: 3,
          title: `Career Breakthrough & Literacy Center`,
          subtitle: `Founding Salem Literacy Center & adult education pioneer`,
          description: `Highlights the establishment of adult dyslexia tutoring resources and community leadership.`,
          purpose: `Showcase civic contribution and career achievements.`,
          storySegment: 'Career & Breakthrough',
          type: 'Interview Cut',
          estimatedDuration: '2m 10s',
          notes: 'Pair soundbite interviews with archival news clippings.',
          status: 'Draft',
          timelineEventIds: timelineEvents.slice(2, 5).map((e) => e.id),
          characterIds: characters.slice(2, 5).map((c) => c.id),
          mediaIds: mediaItems.slice(2, 5).map((m) => m.id),
          narrationText: `In the heart of Massachusetts, a revolutionary effort took shape—bringing literacy, confidence, and voice to hundreds of adult learners.`,
          narrationStatus: 'Scripted',
          assignedVoice: VOICE_OPTIONS[2],
          estimatedReadingTime: '2m 00s',
          musicTrack: MUSIC_TRACKS[1],
          musicMood: 'Majestic & Emotional',
          musicVolume: 75,
          fadeIn: true,
          fadeOut: true,
          cameraMovement: 'Pan Right',
          zoomStyle: 'Subtle (1.05x)',
          panDirection: 'Left to Right',
          focusPoint: 'Center',
          transitionType: 'Fade to Black',
        },
        {
          id: `scene-ai-4-${Date.now()}`,
          storyId,
          sceneNumber: 4,
          title: `Cape Cod Studio & Personal Turning Point`,
          subtitle: `Architectural history partnership and watercolor studio years`,
          description: `Captures the peaceful Cape Cod painting retreat, family gatherings, and structural historic preservation.`,
          purpose: `Provide personal depth and artistic serenity.`,
          storySegment: 'Life Pivot & Turning Point',
          type: 'Photo Montage',
          estimatedDuration: '1m 45s',
          notes: 'Soft cross dissolve between Cape Cod watercolor paintings.',
          status: 'Ready',
          timelineEventIds: timelineEvents.slice(4, 6).map((e) => e.id),
          characterIds: characters.slice(2, 4).map((c) => c.id),
          mediaIds: mediaItems.slice(3, 6).map((m) => m.id),
          narrationText: `Between the salt marshes and the quiet studio light of Cape Cod, life found a harmonious balance of art, family, and reflection.`,
          narrationStatus: 'Synthesized',
          assignedVoice: VOICE_OPTIONS[0],
          estimatedReadingTime: '1m 40s',
          musicTrack: MUSIC_TRACKS[2],
          musicMood: 'Nostalgic',
          musicVolume: 65,
          fadeIn: true,
          fadeOut: true,
          cameraMovement: 'Focus Drift',
          zoomStyle: 'Subtle (1.05x)',
          panDirection: 'Top to Bottom',
          focusPoint: 'Top Left',
          transitionType: 'Cross Dissolve',
        },
        {
          id: `scene-ai-5-${Date.now()}`,
          storyId,
          sceneNumber: 5,
          title: `Epitaph & Lasting Heritage Legacy`,
          subtitle: `Closing summary and family co-producers`,
          description: `Summarizes the enduring influence on future generations, family cellist contributions, and memoir preservation.`,
          purpose: `Deliver an inspiring, high-impact emotional conclusion.`,
          storySegment: 'Legacy & Reflections',
          type: 'Archival Spotlight',
          estimatedDuration: '1m 15s',
          notes: 'End with full family portrait and slow fade to dark slate.',
          status: 'Completed',
          timelineEventIds: timelineEvents.slice(5).map((e) => e.id),
          characterIds: characters.map((c) => c.id),
          mediaIds: mediaItems.slice(4).map((m) => m.id),
          narrationText: `The legacy lived on not only in books and paintings, but in the hearts and memories of family, students, and community.`,
          narrationStatus: 'Recorded',
          assignedVoice: VOICE_OPTIONS[0],
          estimatedReadingTime: '1m 15s',
          musicTrack: MUSIC_TRACKS[1],
          musicMood: 'Majestic & Emotional',
          musicVolume: 80,
          fadeIn: true,
          fadeOut: true,
          cameraMovement: 'Slow Ken Burns Pan',
          zoomStyle: 'Dramatic (1.30x)',
          panDirection: 'Center In',
          focusPoint: 'Center',
          transitionType: 'Slow Hold',
        },
      ];

      onUpdateScenes(generatedScenes);
      setIsAiGenerating(false);
      setIsAiModalOpen(false);
      showToast('success', 'AI Scene Sequence Generated', `5 cinematic scenes assembled for "${storyTitle}".`);
    }, 1200);
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;

    const newScenes = [...scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIndex];
    newScenes[targetIndex] = temp;

    // Recalculate scene numbers
    const reordered = newScenes.map((s, idx) => ({
      ...s,
      sceneNumber: idx + 1,
    }));

    onUpdateScenes(reordered);
    showToast('info', 'Scene Reordered', `Scene "${temp.title}" moved to position #${targetIndex + 1}.`);
  };

  const handleDuplicateScene = (scene: StoryScene) => {
    const dup: StoryScene = {
      ...scene,
      id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${scene.title} (Copy)`,
      sceneNumber: scenes.length + 1,
      status: 'Draft',
    };
    const updated = [...scenes, dup];
    onUpdateScenes(updated);
    showToast('success', 'Scene Duplicated', `Created copy as Scene #${dup.sceneNumber}.`);
  };

  const handleDeleteConfirm = () => {
    const updated = scenes
      .filter((s) => s.id !== deleteConfirmation.sceneId)
      .map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));

    onUpdateScenes(updated);
    if (editingScene && editingScene.id === deleteConfirmation.sceneId) {
      setEditingScene(null);
    }
    setDeleteConfirmation({ isOpen: false, sceneId: '', sceneTitle: '' });
    showToast('success', 'Scene Removed', 'Scene was permanently deleted from this Story Project.');
  };

  const handleSaveSceneEdits = () => {
    if (!editingScene) return;
    const updated = scenes.map((s) => (s.id === editingScene.id ? editingScene : s));
    onUpdateScenes(updated);
    showToast('success', 'Scene Saved', `Updated configuration for "${editingScene.title}".`);
  };

  const toggleEventAttachment = (eventId: string) => {
    if (!editingScene) return;
    const exists = editingScene.timelineEventIds.includes(eventId);
    const updatedEvents = exists
      ? editingScene.timelineEventIds.filter((id) => id !== eventId)
      : [...editingScene.timelineEventIds, eventId];

    setEditingScene({ ...editingScene, timelineEventIds: updatedEvents });
  };

  const toggleCharacterAttachment = (characterId: string) => {
    if (!editingScene) return;
    const exists = editingScene.characterIds.includes(characterId);
    const updatedChars = exists
      ? editingScene.characterIds.filter((id) => id !== characterId)
      : [...editingScene.characterIds, characterId];

    setEditingScene({ ...editingScene, characterIds: updatedChars });
  };

  const toggleMediaAttachment = (mediaId: string) => {
    if (!editingScene) return;
    const exists = editingScene.mediaIds.includes(mediaId);
    const updatedMedia = exists
      ? editingScene.mediaIds.filter((id) => id !== mediaId)
      : [...editingScene.mediaIds, mediaId];

    setEditingScene({ ...editingScene, mediaIds: updatedMedia });
  };

  return (
    <div className="space-y-6 w-full" id="scenes-workspace-root">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-6 rounded-3xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Documentary Production Studio
            </span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded uppercase">
              {storyTitle}
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-black text-foreground uppercase tracking-wide flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-cinema-amber-500" /> Cinematic Scenes Workspace
          </h2>
          <p className="text-xs text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Break down raw life events into cinematic documentary sequences, camera moves, and synthesized voiceover cues.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 bg-card hover:bg-muted border border-cinema-amber-500/40 hover:border-cinema-amber-500 text-cinema-amber-600 dark:text-cinema-amber-400 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
            id="btn-ai-generate-scenes"
          >
            <Sparkles className="w-4 h-4 text-cinema-amber-500" />
            AI Scene Builder
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs rounded-2xl transition-all shadow-sm flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            id="btn-add-new-scene"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Create Scene
          </button>
        </div>
      </div>

      {/* STORY PRODUCTION METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Total Scenes</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-mono font-bold text-foreground">{statistics.totalScenes}</strong>
            <Film className="w-3.5 h-3.5 text-cinema-amber-500" />
          </div>
        </div>

        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Total Runtime</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-mono font-bold text-foreground">{statistics.totalRuntimeFormatted}</strong>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>

        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Avg Scene Length</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-mono font-bold text-foreground">{statistics.avgFormatted}</strong>
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Narrated</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-mono font-bold text-foreground">{statistics.narratedPct}%</strong>
            <Mic className="w-3.5 h-3.5 text-purple-400" />
          </div>
        </div>

        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Media Linked</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-mono font-bold text-foreground">{statistics.mediaPct}%</strong>
            <Camera className="w-3.5 h-3.5 text-pink-400" />
          </div>
        </div>

        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">Ready for Render</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-mono font-bold text-foreground">{statistics.readyPct}%</strong>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* TOOLBAR: SEARCH, FILTERS & VIEW MODE */}
      <div className="p-4 bg-card border border-border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search & Filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          <SearchInput
            id="scenes-search-input"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search scene title, purpose, script text, notes..."
          />

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <FilterDropdown
              id="scenes-status-filter"
              label="Status:"
              value={statusFilter}
              options={[
                { value: 'All', label: 'All Statuses' },
                ...SCENE_STATUSES.map((st) => ({ value: st, label: st })),
              ]}
              onChange={setStatusFilter}
            />

            <FilterDropdown
              id="scenes-segment-filter"
              label="Segment:"
              value={segmentFilter}
              options={[
                { value: 'All', label: 'All Story Segments' },
                ...STORY_SEGMENTS.map((seg) => ({ value: seg, label: seg })),
              ]}
              onChange={setSegmentFilter}
            />
          </div>
        </div>

        {/* View Mode & Reorder Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              isReorderMode
                ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500 shadow-xs'
                : 'bg-muted/60 text-muted-foreground border-border hover:text-foreground'
            }`}
            title="Enable Scene Sequence Reorder Controls"
          >
            <Layers className="w-3.5 h-3.5" />
            {isReorderMode ? 'Reorder Active' : 'Reorder Sequence'}
          </button>

          <ViewModeToggle
            id="scenes-view-mode-toggle"
            viewMode={viewMode}
            onChange={setViewMode}
          />
        </div>
      </div>

      {/* SCENE SEQUENCE DISPLAY */}
      {filteredScenes.length === 0 ? (
        <div className="py-16 border border-dashed border-border rounded-3xl bg-card/25 text-center p-6 flex flex-col items-center justify-center">
          <EmptyState
            type="stories"
            title="No Cinematic Scenes Found"
            description="Scenes are the building blocks of every ReelLegacy documentary. Break down milestones, characters, and voiceover into vivid film cuts."
            primaryActionLabel="Create First Scene"
            onPrimaryAction={handleOpenCreateModal}
            secondaryActionLabel="AI Generate Scenes"
            onSecondaryAction={() => setIsAiModalOpen(true)}
          />
        </div>
      ) : viewMode === 'list' ? (
        /* SEQUENCE LIST VIEW */
        <div className="space-y-4" id="scenes-sequence-list">
          {filteredScenes.map((scene, index) => {
            const isSelected = selectedSceneId === scene.id;
            const isEditingThis = editingScene?.id === scene.id;

            return (
              <motion.div
                key={scene.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 bg-card border rounded-2xl transition-all space-y-4 ${
                  isSelected || isEditingThis
                    ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] shadow-md'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                {/* Top Row: Scene Number, Title, Status, Duration, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/30 text-cinema-amber-600 dark:text-cinema-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      #{scene.sceneNumber}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-base text-foreground">
                          {scene.title}
                        </h3>
                        <span className="text-[9px] font-mono font-bold uppercase bg-muted border border-border text-muted-foreground px-2 py-0.5 rounded">
                          {scene.storySegment}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20 px-2 py-0.5 rounded">
                          {scene.type}
                        </span>
                      </div>
                      {scene.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5 italic">
                          {scene.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status, Duration & Reorder/Edit buttons */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border ${
                        scene.status === 'Ready' || scene.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : scene.status === 'Needs Media'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          : scene.status === 'Needs Narration'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {scene.status}
                    </span>

                    <span className="text-xs font-mono font-bold text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cinema-amber-500" />
                      {scene.estimatedDuration}
                    </span>

                    {/* Reorder Up/Down */}
                    {isReorderMode && (
                      <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-lg border border-border">
                        <button
                          onClick={() => handleMoveScene(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-card rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Up in Sequence"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveScene(index, 'down')}
                          disabled={index === scenes.length - 1}
                          className="p-1 hover:bg-card rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Down in Sequence"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Edit & Action Buttons */}
                    <button
                      onClick={() => {
                        setEditingScene(scene);
                        if (onSelectScene) onSelectScene(scene);
                      }}
                      className="px-3 py-1.5 bg-muted hover:bg-cinema-amber-500 hover:text-slate-950 text-foreground text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Configure
                    </button>

                    <button
                      onClick={() => handleDuplicateScene(scene)}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Scene"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirmation({
                          isOpen: true,
                          sceneId: scene.id,
                          sceneTitle: scene.title,
                        })
                      }
                      className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete Scene"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Row: Description & Script snippet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                      Scene Description & Purpose
                    </span>
                    <p className="text-muted-foreground leading-relaxed font-semibold">
                      {scene.description}
                    </p>
                    <p className="text-[11px] text-cinema-amber-600 dark:text-cinema-amber-400 font-medium italic">
                      Purpose: {scene.purpose}
                    </p>
                  </div>

                  <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Mic className="w-3 h-3 text-purple-400" /> Script / Voiceover Cue
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold">
                        {scene.narrationStatus}
                      </span>
                    </div>
                    <p className="text-foreground italic font-medium line-clamp-2">
                      "{scene.narrationText || 'No voiceover script added yet.'}"
                    </p>
                  </div>
                </div>

                {/* Footer Badges: Linked Milestones, Characters, Media, Camera, Music */}
                <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground font-mono">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-foreground font-bold">
                      <Calendar className="w-3.5 h-3.5 text-cinema-amber-500" />
                      {scene.timelineEventIds.length} Milestones
                    </span>

                    <span className="flex items-center gap-1.5 text-foreground font-bold">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {scene.characterIds.length} Characters
                    </span>

                    <span className="flex items-center gap-1.5 text-foreground font-bold">
                      <Camera className="w-3.5 h-3.5 text-pink-400" />
                      {scene.mediaIds.length} Media Assets
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-muted px-2 py-0.5 rounded border border-border text-[10px] font-bold text-foreground">
                      Shot: {scene.cameraMovement}
                    </span>
                    <span className="bg-muted px-2 py-0.5 rounded border border-border text-[10px] font-bold text-foreground">
                      Score: {scene.musicTrack}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* STORYBOARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="scenes-grid-view">
          {filteredScenes.map((scene) => {
            return (
              <div
                key={scene.id}
                onClick={() => {
                  setEditingScene(scene);
                  if (onSelectScene) onSelectScene(scene);
                }}
                className="p-5 bg-card border border-border hover:border-cinema-amber-500/50 rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-cinema-amber-500 uppercase tracking-wider">
                      Scene #{scene.sceneNumber}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-muted border border-border text-muted-foreground px-2 py-0.5 rounded">
                      {scene.estimatedDuration}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-foreground line-clamp-1">
                    {scene.title}
                  </h4>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {scene.description}
                  </p>
                </div>

                <div className="p-2.5 bg-muted/40 border border-border/60 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase block">
                    Voiceover Cue
                  </span>
                  <p className="text-[11px] text-foreground italic line-clamp-2">
                    "{scene.narrationText || 'No voiceover script added.'}"
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{scene.timelineEventIds.length} Events</span>
                  <span>{scene.characterIds.length} Characters</span>
                  <span>{scene.mediaIds.length} Assets</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED SCENE PRODUCTION INSPECTOR / DRAWER MODAL */}
      <AnimatePresence>
        {editingScene && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-background border border-border rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-500 font-mono font-bold">
                    #{editingScene.sceneNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base uppercase tracking-wide flex items-center gap-2">
                      Configure Scene: {editingScene.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Ref: {editingScene.id} • Segment: {editingScene.storySegment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveSceneEdits}
                    className="px-4 py-2 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer uppercase"
                  >
                    Save Scene
                  </button>
                  <button
                    onClick={() => setEditingScene(null)}
                    className="p-2 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Tabs in Modal */}
              <div className="px-6 pt-3 bg-muted/30 border-b border-border flex items-center gap-2 overflow-x-auto custom-scrollbar">
                {[
                  { id: 'general', label: 'General & Notes', icon: FileText },
                  { id: 'timeline', label: `Milestones (${editingScene.timelineEventIds.length})`, icon: Calendar },
                  { id: 'characters', label: `Characters (${editingScene.characterIds.length})`, icon: Users },
                  { id: 'media', label: `Media (${editingScene.mediaIds.length})`, icon: Camera },
                  { id: 'narration', label: 'Script & Voice', icon: Mic },
                  { id: 'music', label: 'Music Score', icon: Music },
                  { id: 'camera', label: 'Camera Direction', icon: Video },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setDetailTab(t.id as any)}
                      className={`px-3 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                        detailTab === t.id
                          ? 'border-cinema-amber-500 text-cinema-amber-600 dark:text-cinema-amber-400'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* TAB 1: GENERAL & NOTES */}
                {detailTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Scene Title</label>
                        <input
                          type="text"
                          value={editingScene.title}
                          onChange={(e) => setEditingScene({ ...editingScene, title: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Subtitle / Tagline</label>
                        <input
                          type="text"
                          value={editingScene.subtitle || ''}
                          onChange={(e) => setEditingScene({ ...editingScene, subtitle: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-cinema-amber-500"
                          placeholder="e.g. Early Salem childhood and family roots"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Story Segment</label>
                        <select
                          value={editingScene.storySegment}
                          onChange={(e) => setEditingScene({ ...editingScene, storySegment: e.target.value as any })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {STORY_SEGMENTS.map((seg) => (
                            <option key={seg} value={seg}>
                              {seg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Scene Type</label>
                        <select
                          value={editingScene.type}
                          onChange={(e) => setEditingScene({ ...editingScene, type: e.target.value as any })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {SCENE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Production Status</label>
                        <select
                          value={editingScene.status}
                          onChange={(e) => setEditingScene({ ...editingScene, status: e.target.value as any })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {SCENE_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Estimated Duration</label>
                        <input
                          type="text"
                          value={editingScene.estimatedDuration}
                          onChange={(e) => setEditingScene({ ...editingScene, estimatedDuration: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-cinema-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Scene Description</label>
                      <textarea
                        value={editingScene.description}
                        onChange={(e) => setEditingScene({ ...editingScene, description: e.target.value })}
                        rows={3}
                        className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-cinema-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Narrative Purpose</label>
                      <input
                        type="text"
                        value={editingScene.purpose}
                        onChange={(e) => setEditingScene({ ...editingScene, purpose: e.target.value })}
                        className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-cinema-amber-500"
                        placeholder="Why is this scene included in the documentary?"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Production Notes</label>
                      <textarea
                        value={editingScene.notes || ''}
                        onChange={(e) => setEditingScene({ ...editingScene, notes: e.target.value })}
                        rows={2}
                        className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-mono text-muted-foreground focus:outline-none focus:border-cinema-amber-500"
                        placeholder="Internal director cues or notes..."
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: LINKED TIMELINE MILESTONES */}
                {detailTab === 'timeline' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Attach chronological timeline events that occur during this documentary scene.
                    </p>

                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                      {timelineEvents.map((evt) => {
                        const isAttached = editingScene.timelineEventIds.includes(evt.id);
                        return (
                          <div
                            key={evt.id}
                            onClick={() => toggleEventAttachment(evt.id)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                              isAttached
                                ? 'bg-cinema-amber-500/10 border-cinema-amber-500'
                                : 'bg-card border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-bold text-cinema-amber-500">
                                {evt.year}
                              </span>
                              <div>
                                <h4 className="font-bold text-xs text-foreground">{evt.title}</h4>
                                <p className="text-[11px] text-muted-foreground line-clamp-1">{evt.description}</p>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                isAttached
                                  ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500'
                                  : 'border-border'
                              }`}
                            >
                              {isAttached && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}

                      {timelineEvents.length === 0 && (
                        <div className="text-center py-8 text-xs text-muted-foreground">
                          No timeline events found in this Story Project. Add events in Timeline Workspace first.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: LINKED CHARACTERS */}
                {detailTab === 'characters' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Select Story Characters who participate, appear, or are referenced in this scene.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                      {characters.map((char) => {
                        const isAttached = editingScene.characterIds.includes(char.id);
                        const isPrimary = editingScene.primaryCharacterId === char.id;

                        return (
                          <div
                            key={char.id}
                            onClick={() => toggleCharacterAttachment(char.id)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isAttached
                                ? 'bg-cinema-amber-500/10 border-cinema-amber-500'
                                : 'bg-card border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={char.avatar}
                                alt={char.name}
                                className="w-9 h-9 rounded-full object-cover border border-border"
                              />
                              <div>
                                <h4 className="font-bold text-xs text-foreground">{char.name}</h4>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {char.storyRole || char.relationship}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isAttached && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingScene({ ...editingScene, primaryCharacterId: char.id });
                                  }}
                                  className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border ${
                                    isPrimary
                                      ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500'
                                      : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                                  }`}
                                >
                                  {isPrimary ? 'Primary Subject' : 'Set Primary'}
                                </button>
                              )}

                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                  isAttached
                                    ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500'
                                    : 'border-border'
                                }`}
                              >
                                {isAttached && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {characters.length === 0 && (
                        <div className="col-span-full text-center py-8 text-xs text-muted-foreground">
                          No characters found. Add story characters in Characters Workspace first.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: LINKED MEDIA ASSETS */}
                {detailTab === 'media' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Select photos, scans, and documents to feature visually during this scene.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                      {mediaItems.map((med) => {
                        const isAttached = editingScene.mediaIds.includes(med.id);

                        return (
                          <div
                            key={med.id}
                            onClick={() => toggleMediaAttachment(med.id)}
                            className={`p-2 border rounded-xl cursor-pointer transition-all space-y-2 relative ${
                              isAttached
                                ? 'bg-cinema-amber-500/10 border-cinema-amber-500'
                                : 'bg-card border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                              <img src={med.url} alt="" className="w-full h-full object-cover" />
                              <div
                                className={`absolute top-1 right-1 w-4 h-4 rounded flex items-center justify-center border ${
                                  isAttached
                                    ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500'
                                    : 'bg-background/80 border-border'
                                }`}
                              >
                                {isAttached && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-foreground truncate block">
                              {med.title || med.displayName || med.id}
                            </span>
                          </div>
                        );
                      })}

                      {mediaItems.length === 0 && (
                        <div className="col-span-full text-center py-8 text-xs text-muted-foreground">
                          No media items uploaded. Add assets in Assets Workspace first.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: NARRATION SCRIPT & VOICE */}
                {detailTab === 'narration' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                        Voiceover Script Text
                      </label>
                      <textarea
                        value={editingScene.narrationText}
                        onChange={(e) => setEditingScene({ ...editingScene, narrationText: e.target.value })}
                        rows={5}
                        className="w-full bg-card border border-border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-cinema-amber-500 leading-relaxed"
                        placeholder="Enter spoken narration text for this documentary scene..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Assigned Voice Persona
                        </label>
                        <select
                          value={editingScene.assignedVoice}
                          onChange={(e) => setEditingScene({ ...editingScene, assignedVoice: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {VOICE_OPTIONS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Narration Status
                        </label>
                        <select
                          value={editingScene.narrationStatus}
                          onChange={(e) =>
                            setEditingScene({ ...editingScene, narrationStatus: e.target.value as any })
                          }
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Unwritten">Unwritten</option>
                          <option value="Scripted">Scripted</option>
                          <option value="Synthesized">Synthesized</option>
                          <option value="Recorded">Recorded</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: MUSIC SCORE */}
                {detailTab === 'music' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Background Soundtrack
                        </label>
                        <select
                          value={editingScene.musicTrack}
                          onChange={(e) => setEditingScene({ ...editingScene, musicTrack: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {MUSIC_TRACKS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Music Mood
                        </label>
                        <input
                          type="text"
                          value={editingScene.musicMood}
                          onChange={(e) => setEditingScene({ ...editingScene, musicMood: e.target.value })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-cinema-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">
                          Music Volume Level ({editingScene.musicVolume}%)
                        </label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingScene.musicVolume}
                        onChange={(e) =>
                          setEditingScene({ ...editingScene, musicVolume: parseInt(e.target.value, 10) })
                        }
                        className="w-full accent-cinema-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                        <input
                          type="checkbox"
                          checked={editingScene.fadeIn}
                          onChange={(e) => setEditingScene({ ...editingScene, fadeIn: e.target.checked })}
                          className="rounded text-cinema-amber-500 focus:ring-cinema-amber-500"
                        />
                        Fade In Audio Track
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                        <input
                          type="checkbox"
                          checked={editingScene.fadeOut}
                          onChange={(e) => setEditingScene({ ...editingScene, fadeOut: e.target.checked })}
                          className="rounded text-cinema-amber-500 focus:ring-cinema-amber-500"
                        />
                        Fade Out Audio Track
                      </label>
                    </div>
                  </div>
                )}

                {/* TAB 7: CAMERA DIRECTION */}
                {detailTab === 'camera' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Camera Movement / Shot Type
                        </label>
                        <select
                          value={editingScene.cameraMovement}
                          onChange={(e) =>
                            setEditingScene({ ...editingScene, cameraMovement: e.target.value as any })
                          }
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {CAMERA_MOVEMENTS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Transition Effect
                        </label>
                        <select
                          value={editingScene.transitionType}
                          onChange={(e) =>
                            setEditingScene({ ...editingScene, transitionType: e.target.value as any })
                          }
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          {TRANSITION_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Zoom Level
                        </label>
                        <select
                          value={editingScene.zoomStyle}
                          onChange={(e) => setEditingScene({ ...editingScene, zoomStyle: e.target.value as any })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          <option value="Subtle (1.05x)">Subtle (1.05x)</option>
                          <option value="Medium (1.15x)">Medium (1.15x)</option>
                          <option value="Dramatic (1.30x)">Dramatic (1.30x)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                          Focus Target
                        </label>
                        <select
                          value={editingScene.focusPoint}
                          onChange={(e) => setEditingScene({ ...editingScene, focusPoint: e.target.value as any })}
                          className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
                        >
                          <option value="Center">Center Frame</option>
                          <option value="Face Detect">Subject Face</option>
                          <option value="Top Left">Top Left Archival Text</option>
                          <option value="Subject Hand">Hand Written Notes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE SCENE MANUAL MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Story Scene"
      >
        <form onSubmit={handleCreateSceneSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
              Scene Title *
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Salem High School & Early History Class"
              className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                Story Segment
              </label>
              <select
                value={newSegment}
                onChange={(e) => setNewSegment(e.target.value as any)}
                className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
              >
                {STORY_SEGMENTS.map((seg) => (
                  <option key={seg} value={seg}>
                    {seg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                Scene Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-cinema-amber-500"
              >
                {SCENE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
              Estimated Duration
            </label>
            <input
              type="text"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              placeholder="1m 00s"
              className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-cinema-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
              Scene Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              placeholder="Describe what happens visually and narratively during this scene..."
              className="w-full bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-cinema-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Scene
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI GENERATE SCENES MODAL */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="AI Scene Sequence Generator"
      >
        <div className="space-y-4">
          <div className="p-4 bg-cinema-amber-500/10 border border-cinema-amber-500/30 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cinema-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-foreground">Automated Scene Structure Analysis</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ReelLegacy's AI Director will analyze the story title, {timelineEvents.length} timeline milestones, and {characters.length} characters to construct an optimal 5-part documentary scene breakdown.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border">
            <span className="block font-bold text-foreground uppercase text-[10px]">Planned Sequence Pipeline:</span>
            <ul className="space-y-1 list-disc list-inside">
              <li>Scene 1: Prologue: Heritage & Ancestral Roots</li>
              <li>Scene 2: Formative Years & Early Mentors</li>
              <li>Scene 3: Career Breakthrough & Literacy Leadership</li>
              <li>Scene 4: Cape Cod Studio & Life Pivot</li>
              <li>Scene 5: Epitaph & Lasting Heritage Legacy</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAiModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAiGenerateScenes} disabled={isAiGenerating}>
              {isAiGenerating ? 'Generating...' : 'Assemble 5-Scene Sequence'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, sceneId: '', sceneTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Documentary Scene"
        message={`Are you sure you want to delete "${deleteConfirmation.sceneTitle}" from this Story Project? Scene sequence numbers will be automatically updated.`}
        confirmLabel="Delete Scene"
        isDestructive={true}
      />
    </div>
  );
}
