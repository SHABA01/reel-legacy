/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  FolderPlus,
  Sparkles,
  HardDrive,
  Layers,
  Search,
  Plus,
  FolderOpen,
  Info,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { PromptModal } from '../ui/PromptModal';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { ReelMediaPlayer } from '../ui/ReelMediaPlayer';
import { MediaUploadLoader } from '../ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { persistenceService, MediaService } from '../../storage';
import { INITIAL_STORIES } from '../stories/mockStoriesData';

import { ExtendedMediaAsset, MediaCollection, SmartCollectionType, UploadQueueItem } from '../../types/media';
import { MediaLibraryService, INITIAL_SMART_COLLECTIONS } from '../../services/mediaLibraryService';
import { AssetAnalysisService } from '../../services/assetAnalysisService';

import { MediaCollectionBar } from './MediaCollectionBar';
import { MediaToolbar } from './MediaToolbar';
import { MediaGrid } from './MediaGrid';
import { MediaInspector } from './MediaInspector';
import { MediaStatusBar } from './MediaStatusBar';
import { MediaBulkActionBar } from './MediaBulkActionBar';

export function MediaLibrary() {
  const { showToast } = useToast();

  // --- STATE ---
  const [assets, setAssets] = useState<ExtendedMediaAsset[]>([]);
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const [stories, setStories] = useState<Array<{ id: string; title: string }>>([]);

  // Selection & Navigation
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Collections & Filtering Scope
  const [activeSmartCollection, setActiveSmartCollection] = useState<SmartCollectionType>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Toolbar Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStoryFilter, setSelectedStoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [grouping, setGrouping] = useState<'none' | 'type' | 'story' | 'category' | 'status'>('none');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<ExtendedMediaAsset | null>(null);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);

  // Delete & Rename Modals
  const [deleteTarget, setDeleteTarget] = useState<ExtendedMediaAsset | null>(null);
  const [renameTarget, setRenameTarget] = useState<ExtendedMediaAsset | null>(null);

  // Upload Queue
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. LOAD DATA ---
  const loadLibraryData = useCallback(async () => {
    try {
      const persisted = await persistenceService.media.getAll();

      // Map to ExtendedMediaAsset
      let extended: ExtendedMediaAsset[] = persisted.map((p: any) => ({
        id: p.id,
        name: p.name,
        originalFilename: p.originalFilename || p.name,
        type: p.type || 'image',
        category: p.category || 'Family Photo',
        size: p.bytes >= 1024 * 1024 ? `${(p.bytes / (1024 * 1024)).toFixed(1)} MB` : `${(p.bytes / 1024).toFixed(1)} KB`,
        bytes: p.bytes || 1024,
        resolution: p.resolution || '1920x1080',
        duration: p.duration,
        uploadDate: p.createdAt ? p.createdAt.split('T')[0] : '2026-07-20',
        tags: p.tags || ['Archival'],
        linkedStoryId: p.legacyProfileId || 'unlinked',
        linkedStoryName: p.legacyProfileId ? 'The Life & Times of John Miller' : 'Unlinked',
        linkedEvents: p.linkedEvents || [],
        linkedChapters: [],
        favorite: p.favorite || false,
        archived: p.archived || false,
        readinessStatus: p.archived ? 'Flagged' : 'Ready',
        thumbnailUrl: p.thumbnailUrl || p.localStorageReference || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
        description: p.description || '',
        qualityRating: 5
      }));

      // If empty, supply rich starter media assets
      if (extended.length === 0) {
        extended = [
          {
            id: 'm-1',
            name: 'john_miller_1944_navy_portrait.png',
            originalFilename: 'john_miller_1944_navy_portrait.png',
            type: 'image',
            category: 'Portrait',
            size: '4.2 MB',
            bytes: 4.2 * 1024 * 1024,
            resolution: '2400x3200 (HD)',
            uploadDate: '2026-07-22',
            tags: ['Navy', 'Uniform', 'Portrait', '1944'],
            people: ['John Miller'],
            linkedStoryId: 'story-1',
            linkedStoryName: 'The Life & Times of John Miller',
            linkedEvents: ['1944 WWII Deployment'],
            linkedChapters: ['Chapter 1: Enlistment'],
            favorite: true,
            archived: false,
            readinessStatus: 'Ready',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            description: 'Original black and white studio portrait taken in San Diego prior to Pacific deployment.',
            qualityRating: 5,
            usageCount: 3
          },
          {
            id: 'm-2',
            name: 'farmhouse_summer_1952_clip.mp4',
            originalFilename: 'farmhouse_summer_1952_clip.mp4',
            type: 'video',
            category: 'Home Video',
            size: '18.4 MB',
            bytes: 18.4 * 1024 * 1024,
            resolution: '1080p 60fps',
            duration: '0m 45s',
            uploadDate: '2026-07-21',
            tags: ['Home Film', '8mm', 'Farmhouse', 'Summer'],
            people: ['Sarah Miller', 'John Miller'],
            linkedStoryId: 'story-1',
            linkedStoryName: 'The Life & Times of John Miller',
            linkedEvents: ['1952 Homestead Purchase'],
            linkedChapters: ['Chapter 2: Building Home'],
            favorite: true,
            archived: false,
            readinessStatus: 'Ready',
            thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            description: 'Digitized 8mm color home footage capturing the original homestead barn construction.',
            qualityRating: 4,
            usageCount: 2
          },
          {
            id: 'm-3',
            name: 'grandpa_interview_audio_tape1.mp3',
            originalFilename: 'grandpa_interview_audio_tape1.mp3',
            type: 'audio',
            category: 'Interview Recording',
            size: '12.1 MB',
            bytes: 12.1 * 1024 * 1024,
            duration: '4m 15s',
            uploadDate: '2026-07-20',
            tags: ['Interview', 'Oral History', 'Voice Note'],
            people: ['John Miller'],
            linkedStoryId: 'story-1',
            linkedStoryName: 'The Life & Times of John Miller',
            linkedEvents: ['Oral History Session'],
            linkedChapters: [],
            favorite: false,
            archived: false,
            readinessStatus: 'Ready',
            thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80',
            description: 'Clear audio interview cassette tape digitized at 320kbps bitrate.',
            qualityRating: 5,
            usageCount: 4
          },
          {
            id: 'm-4',
            name: 'navy_discharge_papers_1946.pdf',
            originalFilename: 'navy_discharge_papers_1946.pdf',
            type: 'document',
            category: 'Historical Document',
            size: '2.8 MB',
            bytes: 2.8 * 1024 * 1024,
            uploadDate: '2026-07-19',
            tags: ['Discharge', 'Military Record', 'OCR'],
            people: ['John Miller'],
            linkedStoryId: 'story-1',
            linkedStoryName: 'The Life & Times of John Miller',
            linkedEvents: ['1946 Honorable Discharge'],
            linkedChapters: [],
            favorite: false,
            archived: false,
            readinessStatus: 'Ready',
            thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
            description: 'Scanned official US Navy honorable discharge record with extracted OCR text layer.',
            qualityRating: 4,
            usageCount: 1
          }
        ];
      }

      setAssets(extended);
      if (extended.length > 0 && !selectedAssetId) {
        setSelectedAssetId(extended[0].id);
      }

      // Load collections
      const cols = await persistenceService.collections.getAll();
      if (cols.length > 0) {
        setCollections(cols as any);
      } else {
        setCollections(INITIAL_SMART_COLLECTIONS);
      }

      // Load stories options
      const storyList = INITIAL_STORIES.map(s => ({ id: s.id, title: s.title }));
      setStories(storyList);
    } catch (err) {
      console.error('Failed to load media library context:', err);
    }
  }, [selectedAssetId]);

  useEffect(() => {
    loadLibraryData();
  }, []);

  // --- 2. COMPUTED FILTERING & SEARCH ---
  const filteredAssets = useMemo(() => {
    let result = assets;

    // Smart collection filter
    if (activeSmartCollection) {
      result = MediaLibraryService.filterBySmartCollection(result, activeSmartCollection);
    }

    // Story Folder / Selected Story Filter
    if (selectedStoryId) {
      result = result.filter(a => a.linkedStoryId === selectedStoryId);
    } else if (selectedStoryFilter !== 'All') {
      result = result.filter(a => a.linkedStoryId === selectedStoryFilter);
    }

    // Custom Album Collection Filter
    if (selectedCollectionId) {
      const col = collections.find(c => c.id === selectedCollectionId);
      if (col && !col.isSmart) {
        result = result.filter(a => a.tags.some(t => col.tags.includes(t)));
      }
    }

    // Media Type Filter
    if (selectedType !== 'All') {
      result = result.filter(a => a.type === selectedType.toLowerCase());
    }

    // Readiness Status Filter
    if (selectedStatusFilter !== 'All') {
      result = result.filter(a => a.readinessStatus === selectedStatusFilter);
    }

    // Global Multi-field Search
    if (searchQuery.trim()) {
      result = MediaLibraryService.searchAssets(result, searchQuery);
    }

    // Sort Order
    return result.slice().sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        comparison = b.bytes - a.bytes;
      } else {
        comparison = new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [
    assets,
    activeSmartCollection,
    selectedStoryId,
    selectedStoryFilter,
    selectedCollectionId,
    collections,
    selectedType,
    selectedStatusFilter,
    searchQuery,
    sortBy,
    sortOrder
  ]);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  const totalBytesUsed = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.bytes || 0), 0);
  }, [assets]);

  // --- 3. HANDLERS ---
  const handleSelectAsset = (asset: ExtendedMediaAsset, e: React.MouseEvent) => {
    if (e.shiftKey) {
      // Toggle multi-selection
      if (selectedAssets.includes(asset.id)) {
        setSelectedAssets(prev => prev.filter(id => id !== asset.id));
      } else {
        setSelectedAssets(prev => [...prev, asset.id]);
      }
    } else {
      setSelectedAssetId(asset.id);
      setIsInspectorOpen(true);
    }
  };

  const handleToggleMultiSelect = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(prev => prev.filter(id => id !== assetId));
    } else {
      setSelectedAssets(prev => [...prev, assetId]);
    }
  };

  const handleSelectAllToggle = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(a => a.id));
    }
  };

  const handleToggleFavorite = async (assetId: string) => {
    setAssets(prev =>
      prev.map(a => {
        if (a.id === assetId) {
          const updatedFav = !a.favorite;
          showToast(
            'info',
            updatedFav ? 'Added to Favorites' : 'Removed from Favorites',
            `Updated favorite status for ${a.name}`
          );
          return { ...a, favorite: updatedFav };
        }
        return a;
      })
    );
  };

  const handleUpdateAsset = (updated: ExtendedMediaAsset) => {
    setAssets(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const handleConfirmRename = (newName: string) => {
    if (!renameTarget || !newName.trim()) return;
    const clean = newName.trim();
    setAssets(prev =>
      prev.map(a => (a.id === renameTarget.id ? { ...a, name: clean } : a))
    );
    showToast('success', 'Asset Renamed', `Renamed asset to "${clean}".`);
    setRenameTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await MediaService.deleteMedia(deleteTarget.id);
      setAssets(prev => prev.filter(a => a.id !== deleteTarget.id));
      if (selectedAssetId === deleteTarget.id) {
        setSelectedAssetId(null);
      }
      setSelectedAssets(prev => prev.filter(id => id !== deleteTarget.id));
      showToast('info', 'Asset Removed', `Deleted "${deleteTarget.name}" from vault.`);
    } catch (err) {
      showToast('error', 'Delete Failed', 'Unable to delete asset from persistence storage.');
    } finally {
      setDeleteTarget(null);
    }
  };

  // --- UPLOAD PIPELINE ---
  const handleUploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    showToast('loading', 'Ingesting Heritage Assets...', `Processing ${files.length} upload queue items.`);

    for (const file of files) {
      const uploadId = `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setUploadQueue(prev => [...prev, { id: uploadId, name: file.name, progress: 20 }]);

      // Simulate step upload progress
      setTimeout(() => {
        setUploadQueue(prev =>
          prev.map(item => (item.id === uploadId ? { ...item, progress: 70 } : item))
        );
      }, 400);

      setTimeout(async () => {
        try {
          const type: 'image' | 'video' | 'audio' | 'document' = file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
            ? 'video'
            : file.type.startsWith('audio/')
            ? 'audio'
            : 'document';

          const newAsset: ExtendedMediaAsset = {
            id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            originalFilename: file.name,
            type,
            category: type === 'image' ? 'Family Photo' : type === 'video' ? 'Home Video' : 'Historical Document',
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            bytes: file.size,
            uploadDate: new Date().toISOString().split('T')[0],
            tags: ['Uploaded', type.toUpperCase()],
            linkedStoryId: 'unlinked',
            linkedStoryName: 'Unlinked Scope',
            linkedEvents: [],
            linkedChapters: [],
            favorite: false,
            archived: false,
            readinessStatus: 'Ready',
            thumbnailUrl: URL.createObjectURL(file),
            description: `User uploaded file ${file.name}.`,
            qualityRating: 5
          };

          setAssets(prev => [newAsset, ...prev]);
          setSelectedAssetId(newAsset.id);

          setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
          showToast('success', 'Upload Complete', `Added "${file.name}" to Heritage Vault.`);
        } catch (err) {
          showToast('error', 'Upload Error', `Failed to upload ${file.name}`);
        }
      }, 900);
    }
  };

  // --- BULK OPERATIONS ---
  const handleBulkAssignStory = () => {
    if (selectedAssets.length === 0) return;
    const targetStory = stories[0];
    if (!targetStory) return;

    setAssets(prev =>
      prev.map(a =>
        selectedAssets.includes(a.id)
          ? { ...a, linkedStoryId: targetStory.id, linkedStoryName: targetStory.title }
          : a
      )
    );
    showToast('success', 'Story Link Complete', `Linked ${selectedAssets.length} assets to "${targetStory.title}".`);
  };

  const handleBulkTag = () => {
    if (selectedAssets.length === 0) return;
    setAssets(prev =>
      prev.map(a =>
        selectedAssets.includes(a.id)
          ? { ...a, tags: Array.from(new Set([...a.tags, 'Archival Tag'])) }
          : a
      )
    );
    showToast('success', 'Bulk Tagging Applied', `Added tag #Archival Tag to ${selectedAssets.length} items.`);
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.length === 0) return;
    for (const id of selectedAssets) {
      await MediaService.deleteMedia(id);
    }
    setAssets(prev => prev.filter(a => !selectedAssets.includes(a.id)));
    setSelectedAssets([]);
    showToast('info', 'Bulk Delete Complete', `Removed ${selectedAssets.length} assets.`);
  };

  const handleBulkAiRestore = () => {
    if (selectedAssets.length === 0) return;
    showToast('loading', 'Running AI Neural Restoration...', `Enhancing ${selectedAssets.length} assets.`);
    setTimeout(() => {
      setAssets(prev =>
        prev.map(a =>
          selectedAssets.includes(a.id)
            ? { ...a, readinessStatus: 'Ready', tags: Array.from(new Set([...a.tags, 'AI Restored'])) }
            : a
        )
      );
      showToast('success', 'AI Restoration Complete', `Enhanced clarity and reduced noise for ${selectedAssets.length} items.`);
    }, 1200);
  };

  const handleBulkAiColorize = () => {
    if (selectedAssets.length === 0) return;
    showToast('loading', 'AI Neural Colorization...', `Applying color algorithms to ${selectedAssets.length} assets.`);
    setTimeout(() => {
      setAssets(prev =>
        prev.map(a =>
          selectedAssets.includes(a.id)
            ? { ...a, tags: Array.from(new Set([...a.tags, 'AI Colorized'])) }
            : a
        )
      );
      showToast('success', 'AI Colorization Complete', `Generated hyper-realistic color maps for ${selectedAssets.length} items.`);
    }, 1200);
  };

  const handleBulkAiUpscale = () => {
    if (selectedAssets.length === 0) return;
    showToast('loading', 'AI 4K Super-Resolution...', `Upscaling ${selectedAssets.length} assets to studio 4K.`);
    setTimeout(() => {
      setAssets(prev =>
        prev.map(a =>
          selectedAssets.includes(a.id)
            ? { ...a, resolution: '3840x2160 (4K UHD)', tags: Array.from(new Set([...a.tags, '4K Upscaled'])) }
            : a
        )
      );
      showToast('success', 'AI Upscale Complete', `Enhanced ${selectedAssets.length} items to 4K Ultra HD.`);
    }, 1200);
  };

  const handleBulkDownload = () => {
    if (selectedAssets.length === 0) return;
    showToast('info', 'Preparing Archive Download', `Bundling ${selectedAssets.length} media assets into ZIP package.`);
  };

  const handleBulkArchive = () => {
    if (selectedAssets.length === 0) return;
    setAssets(prev =>
      prev.map(a =>
        selectedAssets.includes(a.id) ? { ...a, archived: true, readinessStatus: 'Unused' } : a
      )
    );
    showToast('info', 'Assets Archived', `Archived ${selectedAssets.length} items to vault storage.`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedStoryFilter('All');
    setSelectedStatusFilter('All');
    setActiveSmartCollection('all');
    setSelectedStoryId(null);
    setSelectedCollectionId(null);
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground overflow-hidden relative">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Media Library"
        subtitle="Single source of truth for every photo, video, B-roll, document, and audio asset in production."
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStorageModalOpen(true)}
              leftIcon={<HardDrive className="w-4 h-4 text-cinema-amber-500" />}
            >
              Vault Capacity
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Upload Assets
            </Button>
          </div>
        }
      />

      {/* 2. HORIZONTAL COLLECTION SELECTOR BAR (Replaces old left navigation sidebar) */}
      <MediaCollectionBar
        activeSmartCollection={activeSmartCollection}
        onSelectSmartCollection={setActiveSmartCollection}
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        onCreateCollectionClick={() => setIsCreateCollectionOpen(true)}
        stories={stories}
        selectedStoryId={selectedStoryId}
        onSelectStoryFolder={setSelectedStoryId}
        assets={assets}
      />

      {/* 3. SMART FILTER & SEARCH TOOLBAR */}
      <MediaToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStoryFilter={selectedStoryFilter}
        onStoryFilterChange={setSelectedStoryFilter}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={setSelectedStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onToggleSortOrder={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        grouping={grouping}
        onGroupingChange={setGrouping}
        stories={stories}
        selectedCount={selectedAssets.length}
        totalCount={filteredAssets.length}
        onSelectAllToggle={handleSelectAllToggle}
        isAllSelected={selectedAssets.length > 0 && selectedAssets.length === filteredAssets.length}
        onBulkTagClick={handleBulkTag}
        onBulkAssignStoryClick={handleBulkAssignStory}
        onBulkDeleteClick={handleBulkDelete}
        onClearFilters={handleClearFilters}
      />

      {/* 4. MAIN WORKSPACE CONTENT (Dominant Asset Grid/List + Required Context Inspector) */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* DOMINANT ASSET GRID / LIST (Uses 100% of usable width when inspector is closed or right-aligned) */}
        <MediaGrid
          assets={filteredAssets}
          selectedAssetId={selectedAssetId}
          selectedAssets={selectedAssets}
          onSelectAsset={handleSelectAsset}
          onToggleMultiSelect={handleToggleMultiSelect}
          onToggleFavorite={handleToggleFavorite}
          onPreview={(asset) => {
            setPreviewAsset(asset);
            setIsPreviewOpen(true);
          }}
          onRename={(asset) => setRenameTarget(asset)}
          onDelete={(asset) => setDeleteTarget(asset)}
          viewMode={viewMode}
          grouping={grouping}
          onClearFilters={handleClearFilters}
        />

        {/* REQUIRED CONTEXT PANEL (Right Inspector DAM) */}
        {isInspectorOpen && (
          <MediaInspector
            asset={selectedAsset}
            onClose={() => setIsInspectorOpen(false)}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={(asset) => setDeleteTarget(asset)}
            stories={stories}
            showToast={showToast}
          />
        )}
      </div>

      {/* 5. FLOATING CONTEXTUAL BULK ACTION BAR */}
      <MediaBulkActionBar
        selectedCount={selectedAssets.length}
        totalCount={filteredAssets.length}
        isAllSelected={selectedAssets.length > 0 && selectedAssets.length === filteredAssets.length}
        onSelectAllToggle={handleSelectAllToggle}
        onClearSelection={() => setSelectedAssets([])}
        onAddToStory={handleBulkAssignStory}
        onAddToCollection={() => setIsCreateCollectionOpen(true)}
        onAiRestore={handleBulkAiRestore}
        onAiColorize={handleBulkAiColorize}
        onAiUpscale={handleBulkAiUpscale}
        onDownload={handleBulkDownload}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
      />

      {/* 6. BOTTOM STATUS BAR */}
      <MediaStatusBar
        totalAssetsCount={assets.length}
        selectedCount={selectedAssets.length}
        totalBytesUsed={totalBytesUsed}
      />

      {/* --- MODALS & OVERLAYS --- */}

      {/* UPLOAD STUDIO MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Assets to Heritage Vault"
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files) handleUploadFiles(Array.from(e.dataTransfer.files));
            }}
            className="border-2 border-dashed border-cinema-amber-500/40 hover:border-cinema-amber-500 bg-card/60 p-8 rounded-xl text-center space-y-3 cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files) handleUploadFiles(Array.from(e.target.files));
              }}
            />
            <div className="w-12 h-12 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-500 mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Drag and drop heritage files here, or click to browse</p>
              <p className="text-muted-foreground text-[11px] mt-1">Supports High-Res Photos, 4K B-Roll, Audio Tapes (WAV/MP3), and Scanned PDF Documents (Max 50MB per file)</p>
            </div>
          </div>

          {/* Upload Queue Progress */}
          {uploadQueue.length > 0 && (
            <div className="space-y-2 border-t border-border pt-3">
              <span className="font-mono text-[10px] uppercase font-bold text-cinema-amber-400">Upload Pipeline Activity</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {uploadQueue.map(item => (
                  <MediaUploadLoader key={item.id} id={item.id} fileName={item.name} progress={item.progress} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* LIGHTBOX MEDIA PREVIEW MODAL */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewAsset?.name || 'Media Preview'}
        size="xl"
      >
        {previewAsset && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden bg-black/90 max-h-[60vh] flex items-center justify-center border border-border">
              {previewAsset.type === 'video' || previewAsset.type === 'audio' ? (
                <ReelMediaPlayer
                  src={previewAsset.thumbnailUrl}
                  title={previewAsset.name}
                />
              ) : (
                <img
                  src={previewAsset.thumbnailUrl}
                  alt={previewAsset.name}
                  className="max-h-[55vh] object-contain"
                />
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
              <span>{previewAsset.category} • {previewAsset.size}</span>
              <span className="text-cinema-amber-400">Story: {previewAsset.linkedStoryName}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* STORAGE CAPACITY MODAL */}
      <Modal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        title="Vault Storage Capacity"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex justify-between items-center font-mono">
              <span className="text-muted-foreground">Used Vault Storage:</span>
              <span className="font-bold text-foreground font-mono">
                {(totalBytesUsed / (1024 * 1024)).toFixed(1)} MB / 50.0 MB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden border border-border">
              <div
                className="h-full bg-cinema-amber-500"
                style={{ width: `${Math.min(100, (totalBytesUsed / (50 * 1024 * 1024)) * 100)}%` }}
              />
            </div>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            All files are stored locally in your encrypted IndexedDB storage vault and synced across your story studio workspace.
          </p>
        </div>
      </Modal>

      {/* CREATE COLLECTION MODAL */}
      <PromptModal
        isOpen={isCreateCollectionOpen}
        onClose={() => setIsCreateCollectionOpen(false)}
        onConfirm={(name) => {
          if (!name.trim()) return;
          const newCol: MediaCollection = {
            id: `col-${Date.now()}`,
            name: name.trim(),
            description: 'Custom heritage collection album.',
            coverImage: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=300&q=80',
            assetCount: 0,
            lastUpdated: 'Just now',
            tags: [name.trim()]
          };
          setCollections(prev => [...prev, newCol]);
          showToast('success', 'Collection Created', `Created album "${name.trim()}".`);
          setIsCreateCollectionOpen(false);
        }}
        title="Create New Custom Collection"
        message="Enter a name for your new album or collection:"
        placeholder="e.g. WWII Letters & Medals"
      />

      {/* RENAME PROMPT MODAL */}
      <PromptModal
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onConfirm={handleConfirmRename}
        title="Rename Media Asset"
        message={`Enter new display filename for "${renameTarget?.name}":`}
        defaultValue={renameTarget?.name || ''}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Media Asset"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove the asset from the Heritage Vault.`}
        confirmLabel="Delete Asset"
        isDestructive={true}
      />
    </div>
  );
}
