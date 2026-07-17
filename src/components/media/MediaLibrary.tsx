/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Grid,
  List,
  FolderPlus,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Heart,
  Download,
  Tag,
  Clock,
  MoreVertical,
  ChevronRight,
  Info,
  X,
  Plus,
  Database,
  Film,
  Camera,
  Music,
  FileText,
  Award,
  GraduationCap,
  Briefcase,
  Play,
  Pause,
  Maximize2,
  ZoomIn,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Check,
  AlertTriangle,
  FolderOpen,
  Calendar,
  FileSpreadsheet,
  Link2,
  Activity,
  UserCheck,
  Volume2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../context/ToastContext';
import { INITIAL_STORIES, ExtendedStory } from '../stories/mockStoriesData';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { persistenceService, MediaService } from '../../storage';

// --- STAGE 8 DATA MODELS ---
export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  category: 'Family Photo' | 'Portrait' | 'Childhood' | 'Graduation' | 'Wedding' | 'Career Photo' | 'Home Video' | 'Voice Recording' | 'Music File' | 'Resume' | 'Certificate' | 'Award' | 'Letter' | 'Newspaper Article';
  size: string;
  bytes: number;
  resolution?: string;
  duration?: string;
  uploadDate: string;
  tags: string[];
  linkedStoryId: string;
  linkedStoryName: string;
  linkedEvents: string[];
  linkedChapters: string[];
  favorite: boolean;
  status: 'Ready' | 'Optimizing' | 'Needs Metadata' | 'Flagged';
  thumbnailUrl: string;
  description: string;
  archived: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  assetCount: number;
  lastUpdated: string;
  tags: string[];
}

export function MediaLibrary() {
  const { showToast } = useToast();

  // Delete approval modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'single' | 'bulk' | 'collection' | null; name?: string } | null>(null);

  // --- 1. CORE LIBRARY STATES ---
  const [activeTab, setActiveTab] = useState<'all' | 'collections' | 'upload' | 'readiness'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('asset-1');
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  
  // --- Search & Filters ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStoryFilter, setSelectedStoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- Previews & Modals ---
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState<boolean>(false);
  const [newCollectionData, setNewCollectionData] = useState({ name: '', description: '', cover: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=300&q=80' });

  // --- 2. CORE LIBRARY PERSISTENT STATE ---
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  // --- 3. COLLECTIONS PERSISTENT STATE ---
  const [collections, setCollections] = useState<Collection[]>([]);

  const handleRefreshLibrary = async () => {
    try {
      const allAssets = await persistenceService.media.getAll();
      setAssets(allAssets as any);
      
      const allCols = await persistenceService.collections.getAll();
      setCollections(allCols as any);
    } catch (err) {
      console.error('Failed to load library data:', err);
    }
  };

  useEffect(() => {
    handleRefreshLibrary();
  }, []);

  // --- 4. UPLOAD QUEUE SIMULATOR STATE ---
  const [uploadQueue, setUploadQueue] = useState<Array<{
    id: string;
    name: string;
    size: string;
    progress: number;
    status: 'Queued' | 'Scanning' | 'Uploading' | 'Complete' | 'Failed';
    speed?: string;
    error?: string;
    fileType: 'image' | 'video' | 'audio' | 'document';
  }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenUploadDialog = () => {
    fileInputRef.current?.click();
  };

  const uploadMultipleFiles = async (files: File[]) => {
    for (const file of files) {
      const uploadId = `uq-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      try {
        if (file.size > 50 * 1024 * 1024) {
          showToast('error', 'Upload Blocked', `"${file.name}" exceeds the 50MB storage limit.`);
          continue;
        }
        if (file.size === 0) {
          showToast('error', 'Upload Blocked', `"${file.name}" is an empty 0-byte file.`);
          continue;
        }

        let fileType: 'image' | 'video' | 'audio' | 'document' = 'document';
        if (file.type.startsWith('image/')) fileType = 'image';
        else if (file.type.startsWith('video/')) fileType = 'video';
        else if (file.type.startsWith('audio/')) fileType = 'audio';

        // Add to simulated queue list
        const newItem = {
          id: uploadId,
          name: file.name,
          size: file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`,
          progress: 10,
          status: 'Uploading' as const,
          speed: '1.2 MB/s',
          fileType
        };
        setUploadQueue(prev => [newItem, ...prev]);

        // Simulate local progress ticker for high-fidelity UI
        for (let progress = 30; progress <= 90; progress += 30) {
          await new Promise(resolve => setTimeout(resolve, 150));
          setUploadQueue(prev => prev.map(item => item.id === uploadId ? { ...item, progress } : item));
        }

        // Real conversion and persistence using MediaService
        await MediaService.processUpload(file, {
          profileId: 'profile-1', // Default profile for global media library
          category: file.type.startsWith('image/') ? 'Portrait' : 'Family Photo',
          description: `Uploaded: ${file.name}`
        });

        // Update queue item status to Complete
        setUploadQueue(prev => prev.map(item => item.id === uploadId ? { ...item, progress: 100, status: 'Complete', speed: undefined } : item));
        showToast('success', 'Upload Complete', `"${file.name}" cataloged successfully.`);
      } catch (err: any) {
        setUploadQueue(prev => prev.map(item => item.id === uploadId ? { ...item, status: 'Failed', error: err.message || 'Duplicate file or validation issue.' } : item));
        showToast('error', 'Upload Failed', `"${file.name}": ${err.message}`);
      }
    }
    await handleRefreshLibrary();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadMultipleFiles(Array.from(files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await uploadMultipleFiles(Array.from(files));
    }
  };

  // --- 5. INTERACTIVE COMPUTATIONS & FILTERS ---
  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || assets[0] || null;
  }, [assets, selectedAssetId]);

  const storageStats = useMemo(() => {
    const totalBytesUsed = assets.reduce((acc, curr) => acc + curr.bytes, 0);
    const quotaBytes = 10 * 1024 * 1024 * 1024; // 10 GB
    const percentage = (totalBytesUsed / quotaBytes) * 100;
    
    // Break down by type
    const breakdown = {
      image: { count: 0, size: 0 },
      video: { count: 0, size: 0 },
      audio: { count: 0, size: 0 },
      document: { count: 0, size: 0 }
    };
    assets.forEach(a => {
      if (breakdown[a.type]) {
        breakdown[a.type].count++;
        breakdown[a.type].size += a.bytes;
      }
    });

    return {
      usedFormatted: `${(totalBytesUsed / (1024 * 1024)).toFixed(1)} MB`,
      totalFormatted: `10.0 GB`,
      percentage: Math.min(100, parseFloat(percentage.toFixed(2))),
      breakdown
    };
  }, [assets]);

  // Combined Advanced Filtering & Searching
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // 1. Text Search Query (File Name, Tags, Connected Story name, Description)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        asset.name.toLowerCase().includes(q) ||
        asset.tags.some(t => t.toLowerCase().includes(q)) ||
        asset.linkedStoryName.toLowerCase().includes(q) ||
        asset.description.toLowerCase().includes(q);

      // 2. Type Filter
      const matchesType = selectedType === 'All' || asset.type === selectedType;

      // 3. Category Filter
      const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;

      // 4. Story Filter
      const matchesStory = selectedStoryFilter === 'All' || asset.linkedStoryId === selectedStoryFilter;

      // 5. Status Filter
      const matchesStatus = selectedStatusFilter === 'All' || asset.status === selectedStatusFilter;

      return matchesSearch && matchesType && matchesCategory && matchesStory && matchesStatus;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      } else if (sortBy === 'size') {
        comparison = a.bytes - b.bytes;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [assets, searchQuery, selectedType, selectedCategory, selectedStoryFilter, selectedStatusFilter, sortBy, sortOrder]);

  // Production Readiness Logic
  const readinessMetrics = useMemo(() => {
    // Audit current database relative to required categories
    const results = {
      hasPortrait: assets.some(a => a.category === 'Portrait'),
      hasChildhood: assets.some(a => a.category === 'Childhood'),
      hasGraduation: assets.some(a => a.category === 'Graduation'),
      hasWedding: assets.some(a => a.category === 'Wedding'),
      hasHomeVideo: assets.some(a => a.type === 'video'),
      hasVoiceRecording: assets.some(a => a.category === 'Voice Recording'),
      hasResume: assets.some(a => a.category === 'Resume'),
      hasCertificates: assets.some(a => a.category === 'Certificate'),
      hasAwards: assets.some(a => a.category === 'Award'),
      hasStoryAssocs: assets.filter(a => a.linkedStoryId).length
    };

    let checkPointsPassed = 0;
    const checklistItems = [
      { id: 'p1', label: 'Biographical Portrait Scan', passed: results.hasPortrait, desc: 'Requires at least 1 portrait photo for face modeling & AI enhancements.' },
      { id: 'p2', label: 'Early Life/Childhood Archives', passed: results.hasChildhood, desc: 'At least 1 photo covering school, parent, or childhood era.' },
      { id: 'p3', label: 'Significant Ceremony Record (Grad/Wedding)', passed: results.hasGraduation || results.hasWedding, desc: 'Visual markers covering graduation caps, family marriages, or certificates.' },
      { id: 'p4', label: 'Digitized Home Footage (MP4)', passed: results.hasHomeVideo, desc: 'Requires video files for background overlay B-Roll.' },
      { id: 'p5', label: 'Original Voices or Oral History (MP3/WAV)', passed: results.hasVoiceRecording, desc: 'Required for custom voice cloning/timbre match calibration.' },
      { id: 'p6', label: 'Professional Ledger (Resume/CV)', passed: results.hasResume, desc: 'Scanned CV text feeds career scripting milestones.' },
      { id: 'p7', label: 'Linked Story Allocations', passed: results.hasStoryAssocs >= 8, desc: 'Requires at least 8 individual assets associated with Chapters.' }
    ];

    checklistItems.forEach(item => {
      if (item.passed) checkPointsPassed++;
    });

    const finalScore = Math.round((checkPointsPassed / checklistItems.length) * 100);

    return {
      checklistItems,
      finalScore,
      results,
      isExcellent: finalScore >= 80,
      isAcceptable: finalScore >= 50 && finalScore < 80,
      isCritical: finalScore < 50
    };
  }, [assets]);

  // --- 6. ACTIONS HANDLERS ---
  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = assets.find(a => a.id === id);
    if (!target) return;
    try {
      await MediaService.favoriteMedia(id, !target.favorite);
      await handleRefreshLibrary();
      showToast(
        'success',
        !target.favorite ? 'Asset Favorited' : 'Removed from Favorites',
        `"${target.name}" status updated in dynamic categories.`
      );
    } catch (err: any) {
      showToast('error', 'Toggle Favorite Failed', err.message);
    }
  };

  const handleDeleteAsset = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const asset = assets.find(a => a.id === id);
    setDeleteTarget({ id, type: 'single', name: asset?.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'single') {
        await MediaService.deleteMedia(deleteTarget.id);
        await handleRefreshLibrary();
        showToast('error', 'Asset Deleted', `"${deleteTarget.name}" removed from library database.`);
      } else if (deleteTarget.type === 'bulk') {
        for (const id of selectedAssets) {
          await MediaService.deleteMedia(id);
        }
        await handleRefreshLibrary();
        setSelectedAssets([]);
        showToast('error', 'Bulk Delete Completed', 'Selected items unlinked from library index.');
      } else if (deleteTarget.type === 'collection') {
        await persistenceService.collections.delete(deleteTarget.id);
        const allCols = await persistenceService.collections.getAll();
        setCollections(allCols as any);
        showToast('error', 'Collection Deleted', `"${deleteTarget.name}" album pruned.`);
      }
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    }

    setDeleteTarget(null);
  };

  const handleRenameAsset = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = assets.find(a => a.id === id);
    if (!target) return;
    const newName = prompt('Enter new filename with extension:', target.name);
    if (newName && newName.trim()) {
      try {
        await MediaService.renameMedia(id, newName.trim());
        await handleRefreshLibrary();
        showToast('success', 'Filename Saved', `Asset renamed to "${newName.trim()}".`);
      } catch (err: any) {
        showToast('error', 'Rename Failed', err.message);
      }
    }
  };

  const handleBulkFavorite = async () => {
    if (selectedAssets.length === 0) return;
    try {
      for (const id of selectedAssets) {
        await MediaService.favoriteMedia(id, true);
      }
      await handleRefreshLibrary();
      showToast('success', 'Bulk Action Successful', `Marked ${selectedAssets.length} assets as favorites.`);
      setSelectedAssets([]);
    } catch (err: any) {
      showToast('error', 'Bulk Favorite Failed', err.message);
    }
  };

  const handleBulkDelete = () => {
    if (selectedAssets.length === 0) return;
    setDeleteTarget({ id: 'bulk', type: 'bulk', name: `${selectedAssets.length} selected assets` });
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionData.name.trim()) {
      showToast('warning', 'Missing Details', 'Collection name is a required field.');
      return;
    }
    const newCol = {
      id: `col-${Date.now()}`,
      name: newCollectionData.name,
      description: newCollectionData.description || 'No description supplied.',
      coverImage: newCollectionData.cover,
      assetCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      tags: ['Custom Set']
    };
    try {
      await persistenceService.collections.create(newCol as any);
      const allCols = await persistenceService.collections.getAll();
      setCollections(allCols as any);
      setIsCreateCollectionOpen(false);
      setNewCollectionData({ name: '', description: '', cover: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=300&q=80' });
      showToast('success', 'Collection Created', `"${newCol.name}" added to Albums list.`);
    } catch (err: any) {
      showToast('error', 'Create Collection Failed', err.message);
    }
  };

  const handleRemoveCollection = (id: string) => {
    const col = collections.find(c => c.id === id);
    setDeleteTarget({ id, type: 'collection', name: col?.name });
  };

  const handleToggleSelectAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter(i => i !== id));
    } else {
      setSelectedAssets([...selectedAssets, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(a => a.id));
    }
  };

  // Simulated Mock uploads speed & queue ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setUploadQueue(prev => {
        let hasActive = false;
        const next = prev.map(item => {
          if (item.status === 'Uploading') {
            hasActive = true;
            const newProgress = Math.min(100, item.progress + Math.floor(Math.random() * 15) + 5);
            return {
              ...item,
              progress: newProgress,
              status: newProgress === 100 ? 'Complete' : 'Uploading',
              speed: newProgress === 100 ? undefined : `${(Math.random() * 2 + 1).toFixed(1)} MB/s`
            };
          }
          if (item.status === 'Queued' && !hasActive) {
            hasActive = true; // start next in line
            return { ...item, status: 'Uploading', progress: 5 };
          }
          return item;
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const handleClearFinishedQueue = () => {
    setUploadQueue(prev => prev.filter(item => item.status !== 'Complete' && item.status !== 'Failed'));
    showToast('info', 'Queue Cleared', 'Completed uploads removed from processing logs.');
  };

  // Helper categories mapping
  const mediaCategories = [
    'All', 'Childhood', 'Portrait', 'Graduation', 'Wedding', 'Career Photo', 
    'Home Video', 'Voice Recording', 'Music File', 'Resume', 'Certificate', 'Award', 'Letter', 'Newspaper Article'
  ];

  return (
    <div className="h-full flex flex-col bg-background text-foreground" id="media-library-core-container">
      
      {/* 1. TOP UTILITY STATUS BAR */}
      <div className="px-6 py-4 border-b border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0" id="media-library-header">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-sm uppercase tracking-wide text-foreground">
              Heritage Assets & Media Director
            </h2>
            <span className="inline-flex items-center text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/15 rounded">
              STAGE 8 FOUNDATION
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Store, categorize, and verify original visual & vocal files for chronological documentary rendering.
          </p>
        </div>

        {/* Storage Summary Dashboard bar */}
        <div className="flex items-center gap-4 bg-muted/40 px-4 py-2 rounded-xl border border-border/60 max-w-sm" id="header-storage-widget">
          <div className="p-2 bg-cinema-amber-500/10 text-cinema-amber-500 rounded-lg border border-cinema-amber-500/15 hidden sm:block">
            <Database className="w-4 h-4 text-cinema-amber-500" />
          </div>
          <div className="text-xs flex-grow min-w-[140px]">
            <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground mb-1">
              <span>Cloud Vault Used</span>
              <strong>{storageStats.usedFormatted} / {storageStats.totalFormatted}</strong>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-cinema-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${storageStats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-TABS INTERACTIVE SHIELD */}
      <div className="px-6 py-2 border-b border-border bg-card/65 flex flex-wrap items-center justify-between gap-2 shrink-0" id="library-tabs-rail">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All Heritage Assets', icon: Camera },
            { id: 'collections', label: 'Collections & Albums', icon: FolderOpen },
            { id: 'upload', label: 'Upload Studio Vault', icon: Upload },
            { id: 'readiness', label: 'Production Readiness Audit', icon: CheckCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'readiness') {
                    showToast('loading', 'Auditing Story Coverage', 'Scanning assets directory for optimal face modeling parameters...');
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border border-transparent ${
                  isTabActive
                    ? 'bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-cinema-amber-500' : 'text-muted-foreground'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View switching options & controls */}
        {activeTab === 'all' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid Layout"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Table Layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. CORE SUB-SECTION MESH */}
      <div className="flex-grow flex overflow-hidden relative" id="library-workspace-panels-mesh">
        
        {/* VIEW 1: ALL HERITAGE ASSETS */}
        {activeTab === 'all' && (
          <div className="flex-grow flex flex-col min-w-0" id="pane-all-media">
            
            {/* SEARCH AND FILTERS BOX */}
            <div className="p-4 bg-muted/20 border-b border-border flex flex-col gap-3 shrink-0" id="assets-search-filter-box">
              <div className="flex flex-col md:flex-row gap-3">
                
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    id="asset-library-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search file name, metadata, tags, stories..."
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-card border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-cinema-amber-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Type filters row dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-card border border-border rounded-xl focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audios</option>
                    <option value="document">Documents</option>
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-card border border-border rounded-xl focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {mediaCategories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStoryFilter}
                    onChange={(e) => setSelectedStoryFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-card border border-border rounded-xl focus:outline-none max-w-[160px]"
                  >
                    <option value="All">All Stories</option>
                    <option value="story-elizabeth-legacy">Elizabeth Legacy</option>
                    <option value="story-bob-military">Grandpa Bob</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-card border border-border rounded-xl focus:outline-none"
                  >
                    <option value="date">Date Uploaded</option>
                    <option value="name">File Name</option>
                    <option value="size">Size</option>
                  </select>

                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                    title={`Sorting order: ${sortOrder}`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bulk actions ribbon (Visible when multi-assets are selected) */}
              <AnimatePresence>
                {selectedAssets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-cinema-amber-500/10 border border-cinema-amber-500/15 p-2 rounded-xl flex items-center justify-between"
                    id="bulk-actions-toolbar"
                  >
                    <div className="flex items-center gap-2 pl-2">
                      <span className="text-[10px] font-mono font-bold text-cinema-amber-600 dark:text-cinema-amber-400">
                        {selectedAssets.length} ASSETS SELECTED
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        id="btn-bulk-fav"
                        variant="ghost"
                        size="xs"
                        leftIcon={<Heart className="w-3.5 h-3.5" />}
                        onClick={handleBulkFavorite}
                        className="text-[10px] py-1 border border-cinema-amber-500/25"
                      >
                        Favorite All
                      </Button>
                      <Button
                        id="btn-bulk-delete"
                        variant="ghost"
                        size="xs"
                        leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                        onClick={handleBulkDelete}
                        className="text-[10px] py-1 text-red-500 hover:bg-red-500/10 border border-red-500/20"
                      >
                        Delete All
                      </Button>
                      <button
                        onClick={() => setSelectedAssets([])}
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground px-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MAIN DATA SCROLLER OR GRID VIEW */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6" id="assets-list-scroller">
              
              {filteredAssets.length === 0 ? (
                <div className="py-20 text-center space-y-4 max-w-sm mx-auto" id="all-assets-empty">
                  <div className="w-12 h-12 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto text-muted-foreground">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">No Assets Matched Criteria</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Try adjusting tags, selecting different formats, or checking search parameters.
                    </p>
                  </div>
                  <Button 
                    id="btn-reset-filters" 
                    variant="ghost" 
                    size="xs" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('All');
                      setSelectedCategory('All');
                      setSelectedStoryFilter('All');
                      setSelectedStatusFilter('All');
                    }}
                    className="border border-border text-xs"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                
                // GRID VIEW
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="asset-cards-grid">
                  {filteredAssets.map(asset => {
                    const isSelected = selectedAssets.includes(asset.id);
                    const isCurrent = selectedAssetId === asset.id;
                    return (
                      <div
                        key={asset.id}
                        id={`asset-card-${asset.id}`}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`group relative bg-card border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md flex flex-col h-full ${
                          isCurrent 
                            ? 'ring-1 ring-cinema-amber-500 border-cinema-amber-500 bg-cinema-amber-500/[0.01]' 
                            : 'border-border'
                        }`}
                      >
                        {/* Thumbnail view */}
                        <div className="aspect-[4/3] bg-muted relative overflow-hidden shrink-0">
                          <img
                            src={asset.thumbnailUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                            <span className="text-[10px] font-mono text-white tracking-wide bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur">
                              {asset.resolution || asset.duration || 'Archive Document'}
                            </span>
                          </div>

                          {/* Top bar overlays */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            {/* Checkbox selector for multiselect */}
                            <button
                              onClick={(e) => handleToggleSelectAsset(asset.id, e)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-cinema-amber-500 border-cinema-amber-500 text-slate-950' 
                                  : 'bg-black/40 border-white/40 text-transparent hover:border-white'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>

                            <span className="inline-flex items-center text-[8px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-900/75 text-cinema-amber-400 border border-cinema-amber-500/10 backdrop-blur">
                              {asset.category}
                            </span>
                          </div>

                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <button
                              onClick={(e) => handleToggleFavorite(asset.id, e)}
                              className={`p-1 rounded-md cursor-pointer backdrop-blur transition-all ${
                                asset.favorite 
                                  ? 'bg-rose-500/15 border border-rose-500/20 text-rose-500' 
                                  : 'bg-black/40 border border-white/20 text-white/70 hover:text-white'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${asset.favorite ? 'fill-rose-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Title details */}
                        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                          <div>
                            <h4 className="text-xs font-black truncate text-foreground group-hover:text-cinema-amber-500 transition-colors uppercase tracking-wide">
                              {asset.name}
                            </h4>
                            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                              {asset.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
                            <span className="font-mono text-muted-foreground">{asset.size}</span>
                            <span className="text-muted-foreground truncate max-w-[120px] font-semibold text-right flex items-center gap-1">
                              <Link2 className="w-2.5 h-2.5 text-muted-foreground inline" />
                              {asset.linkedStoryName.replace('The Literary Legacy of ', '').replace('Bob Vance: ', '')}
                            </span>
                          </div>
                        </div>

                        {/* Action layer */}
                        <div className="px-4 py-2 bg-muted/20 border-t border-border/40 flex items-center justify-end gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewAsset(asset);
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                            title="Fullscreen Preview"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleRenameAsset(asset.id, e)}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                            title="Rename"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAsset(asset.id, e)}
                            className="p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                
                // LIST VIEW (Data Table)
                <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm" id="assets-table-box">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="assets-data-table">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          <th className="py-3 px-4 w-12 text-center">
                            <button
                              onClick={handleToggleSelectAll}
                              className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                                selectedAssets.length === filteredAssets.length && filteredAssets.length > 0
                                  ? 'bg-cinema-amber-500 border-cinema-amber-500 text-slate-950' 
                                  : 'bg-card border-border text-transparent hover:border-muted-foreground'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </button>
                          </th>
                          <th className="py-3 px-4 w-16 text-center">Preview</th>
                          <th className="py-3 px-4">Filename</th>
                          <th className="py-3 px-4">Format</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Linked Story</th>
                          <th className="py-3 px-4 text-right">Size</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssets.map(asset => {
                          const isSelected = selectedAssets.includes(asset.id);
                          const isCurrent = selectedAssetId === asset.id;
                          return (
                            <tr
                              key={asset.id}
                              id={`table-row-${asset.id}`}
                              onClick={() => setSelectedAssetId(asset.id)}
                              className={`border-b border-border/50 text-xs transition-colors hover:bg-muted/30 cursor-pointer ${
                                isCurrent ? 'bg-cinema-amber-500/[0.02]' : ''
                              }`}
                            >
                              <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => handleToggleSelectAsset(asset.id, e)}
                                  className={`w-4 h-4 rounded-md flex items-center justify-center border mx-auto transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-cinema-amber-500 border-cinema-amber-500 text-slate-950' 
                                      : 'bg-card border-border text-transparent hover:border-muted-foreground'
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </button>
                              </td>
                              <td className="py-2 px-4 text-center">
                                <div className="w-10 h-8 rounded overflow-hidden bg-muted mx-auto border border-border">
                                  <img 
                                    src={asset.thumbnailUrl} 
                                    alt="thumb" 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-4 font-semibold text-foreground max-w-[200px] truncate">
                                {asset.name}
                              </td>
                              <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground uppercase">
                                {asset.type}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                <span className="inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 bg-muted rounded border border-border">
                                  {asset.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground max-w-[150px] truncate font-semibold">
                                {asset.linkedStoryName.replace('The Literary Legacy of ', '').replace('Bob Vance: ', '')}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                                {asset.size}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  asset.status === 'Ready' 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                }`}>
                                  {asset.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => setPreviewAsset(asset)}
                                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Fullscreen Preview"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleFavorite(asset.id)}
                                    className={`p-1 hover:bg-muted rounded cursor-pointer ${asset.favorite ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'}`}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${asset.favorite ? 'fill-rose-500' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => handleRenameAsset(asset.id)}
                                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                  >
                                    <Tag className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAsset(asset.id)}
                                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
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
            </div>
          </div>
        )}

        {/* VIEW 2: COLLECTIONS & ALBUMS */}
        {activeTab === 'collections' && (
          <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6" id="pane-collections">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-foreground">
                  Custom Thematic Collections
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cluster assets together by themes, timelines, or family lineages to organize Downstream movie chapter flows.
                </p>
              </div>

              <Button
                id="btn-create-collection"
                variant="primary"
                size="xs"
                leftIcon={<FolderPlus className="w-3.5 h-3.5 text-slate-950" />}
                onClick={() => setIsCreateCollectionOpen(true)}
                className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
              >
                Create Collection
              </Button>
            </div>

            {/* Grid of collections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="collections-grid">
              {collections.map(col => (
                <div
                  key={col.id}
                  id={`collection-card-${col.id}`}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Photo Cover */}
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden shrink-0">
                    <img
                      src={col.coverImage}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/70 text-white font-mono text-[10px] backdrop-blur font-bold">
                      {col.assetCount} Assets Linked
                    </div>
                    <button
                      onClick={() => handleRemoveCollection(col.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-red-500/20 text-white hover:text-red-500 transition-all cursor-pointer backdrop-blur"
                      title="Prune Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body text details */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground group-hover:text-cinema-amber-500 transition-colors">
                        {col.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-3">
                        {col.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-mono">Sync Date: {col.lastUpdated}</span>
                      <div className="flex gap-1">
                        {col.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-muted-foreground font-mono uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: UPLOAD STUDIO VAULT */}
        {activeTab === 'upload' && (
          <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6" id="pane-upload">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Layout Zone Header */}
              <div>
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cinema-amber-500" /> Digital File Upload Portal
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Simulate scanning, metadata parsing, and duplicate analysis checks of newly digitized archival records.
                </p>
              </div>

              {/* DND Drag Zone Placeholder */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <div 
                id="upload-dropzone"
                onClick={handleOpenUploadDialog}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="p-8 border-2 border-dashed border-border hover:border-cinema-amber-500/60 bg-card/40 rounded-2xl text-center space-y-4 cursor-pointer transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-cinema-amber-500/10 text-cinema-amber-500 flex items-center justify-center mx-auto border border-cinema-amber-500/20">
                  <Upload className="w-5 h-5 text-cinema-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Drag and Drop scanned records, photos or audio files here
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                    Supports high-resolution TIFF, JPEG, PNG formats for photos; MP4, MOV for home clips; WAV, MP3 for audios; PDF, DOCX for resume portfolios. Max 200MB per file.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground font-mono uppercase">
                  <span>OR CLICK TO BROWSE LOCAL SYSTEM</span>
                </div>
              </div>

              {/* Queue List */}
              <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Upload & Processing Pipeline
                  </h4>
                  <button
                    onClick={handleClearFinishedQueue}
                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted px-2.5 py-1 rounded transition-colors cursor-pointer border border-border/60"
                  >
                    Clear Finished Logs
                  </button>
                </div>

                <div className="space-y-3" id="simulated-upload-queue-list">
                  {uploadQueue.map(item => (
                    <div
                      key={item.id}
                      id={`queue-item-${item.id}`}
                      className="p-3 bg-muted/40 rounded-xl border border-border/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-grow min-w-0">
                        {/* Custom icon */}
                        <div className={`p-2 rounded-lg border ${
                          item.status === 'Failed' 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                            : item.status === 'Complete' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-cinema-amber-500/10 text-cinema-amber-500 border-cinema-amber-500/20'
                        }`}>
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>

                        <div className="text-xs flex-grow min-w-0">
                          <h5 className="font-semibold text-foreground truncate uppercase text-[10px]">
                            {item.name}
                          </h5>
                          
                          {/* Progress indicators */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-grow h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  item.status === 'Failed' 
                                    ? 'bg-red-500' 
                                    : item.status === 'Complete' 
                                      ? 'bg-emerald-500' 
                                      : 'bg-cinema-amber-500'
                                }`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-[9px] text-muted-foreground w-8 text-right shrink-0">
                              {item.progress}%
                            </span>
                          </div>

                          {/* Failure notes or sub-details */}
                          {item.error && (
                            <span className="text-[9px] font-medium text-red-500 block mt-1">
                              {item.error}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status label right side */}
                      <div className="text-right shrink-0">
                        <span className="font-mono text-[9px] text-muted-foreground block">{item.size}</span>
                        {item.speed && (
                          <span className="font-mono text-[8px] text-cinema-amber-500 block mt-0.5">{item.speed}</span>
                        )}
                        <span className={`inline-flex items-center text-[8px] font-bold uppercase px-1.5 py-0.5 rounded mt-1.5 ${
                          item.status === 'Complete' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15' 
                            : item.status === 'Failed'
                              ? 'bg-red-500/10 text-red-500 border border-red-500/15'
                              : 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/15'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PRODUCTION READINESS AUDIT */}
        {activeTab === 'readiness' && (
          <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6" id="pane-readiness">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Gauge section */}
              <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6">
                
                {/* Score Dial Representation */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted/40"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - readinessMetrics.finalScore / 100)}
                      className="text-cinema-amber-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-foreground font-mono">{readinessMetrics.finalScore}%</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono">READY</span>
                  </div>
                </div>

                {/* Audit overview text */}
                <div className="space-y-2 text-center md:text-left flex-grow">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h3 className="font-display text-sm font-black uppercase tracking-wider text-foreground">
                      Cinematic Production Grade
                    </h3>
                    {readinessMetrics.isExcellent && (
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase">
                        EXCELLENT
                      </span>
                    )}
                    {readinessMetrics.isAcceptable && (
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase">
                        ACCEPTABLE
                      </span>
                    )}
                    {readinessMetrics.isCritical && (
                      <span className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase">
                        CRITICAL GAP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    This compliance scanner grades your assets before passing metadata to the Downstream AI scriptwriter and film compiler. Having high-res photos and original audio tracks reduces synthetic video distortion.
                  </p>
                  
                  {readinessMetrics.isExcellent ? (
                    <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex gap-2 items-center text-[11px] text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Perfect. You have balanced photos, voice registers, and PDF ledgers. Stage 9 rendering is fully optimized.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl flex gap-2 items-center text-[11px] text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                      <span>Upload additional childhood photos and at least 1 voice snippet to maximize compilation precision.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Checklist details */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/20">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Required Asset Checklist Audit
                  </h4>
                </div>
                <div className="divide-y divide-border/60">
                  {readinessMetrics.checklistItems.map(item => (
                    <div key={item.id} className="p-4 flex items-start gap-4 transition-colors hover:bg-muted/10">
                      <div className="mt-0.5">
                        {item.passed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs flex-grow">
                        <div className="flex items-center justify-between">
                          <strong className={`font-semibold ${item.passed ? 'text-foreground' : 'text-amber-500'}`}>
                            {item.label}
                          </strong>
                          <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                            item.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {item.passed ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-[11px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informative advice */}
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl flex gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-semibold text-foreground">AI face remodeling calibration alert</strong>
                  <p className="text-muted-foreground mt-0.5">
                    We suggest portrait files with continuous, single-source light. Blurry, low-resolution images may cause facial glitches in downstream render compilation suites.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* RIGHT INSPECTOR SIDEBAR */}
        {!isInspectorCollapsed && selectedAsset && activeTab === 'all' && (
          <aside
            id="media-inspector-panel"
            className="w-80 border-l border-border bg-card overflow-y-auto hidden lg:flex flex-col h-full shrink-0"
          >
            {/* Inspector Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 shrink-0">
              <span className="text-[10px] font-mono font-black uppercase text-foreground tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cinema-amber-500" /> FILE INSPECTOR
              </span>
              <button
                onClick={() => setIsInspectorCollapsed(true)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all cursor-pointer"
                title="Hide Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Large Preview */}
            <div className="p-4 bg-muted/40 border-b border-border text-center relative flex-shrink-0">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border shadow-inner relative flex items-center justify-center">
                <img
                  src={selectedAsset.thumbnailUrl}
                  alt={selectedAsset.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Specific overlay player indicators */}
                {selectedAsset.type === 'video' && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-cinema-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                )}
                {selectedAsset.type === 'audio' && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-3">
                    <Volume2 className="w-8 h-8 text-cinema-amber-500 animate-pulse" />
                  </div>
                )}
              </div>
              
              <Button
                id="inspector-btn-fullscreen"
                variant="ghost"
                size="xs"
                leftIcon={<Maximize2 className="w-3 h-3" />}
                onClick={() => setPreviewAsset(selectedAsset)}
                className="mt-3 text-[10px] py-1 border border-border"
              >
                Fullscreen Preview
              </Button>
            </div>

            {/* METADATA FORM/DETAILS */}
            <div className="p-5 flex-grow space-y-5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Filename</label>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground break-all uppercase text-[11px] block">{selectedAsset.name}</span>
                  <button 
                    onClick={() => handleRenameAsset(selectedAsset.id)} 
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Format</span>
                  <strong className="text-foreground font-semibold uppercase">{selectedAsset.type}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Size</span>
                  <strong className="text-foreground font-mono">{selectedAsset.size}</strong>
                </div>
              </div>

              {selectedAsset.resolution && (
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Resolution</span>
                  <strong className="text-foreground font-mono">{selectedAsset.resolution}</strong>
                </div>
              )}

              {selectedAsset.duration && (
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Duration</span>
                  <strong className="text-foreground font-mono">{selectedAsset.duration}</strong>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Associated Story</span>
                <span className="text-foreground font-semibold flex items-center gap-1 mt-0.5">
                  <Bookmark className="w-3 h-3 text-cinema-amber-500" />
                  {selectedAsset.linkedStoryName}
                </span>
              </div>

              {selectedAsset.linkedEvents.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Linked Milestones</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAsset.linkedEvents.map(evt => (
                      <span key={evt} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-semibold uppercase">
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Description Notes</span>
                <p className="text-muted-foreground mt-1 leading-relaxed text-[11px]">
                  {selectedAsset.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedAsset.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspector Footer Actions */}
            <div className="p-4 border-t border-border bg-muted/10 shrink-0 space-y-2">
              <Button
                id="inspector-btn-fav"
                variant="ghost"
                size="sm"
                leftIcon={<Heart className={`w-3.5 h-3.5 ${selectedAsset.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />}
                onClick={() => handleToggleFavorite(selectedAsset.id)}
                className="w-full text-xs py-1.5"
              >
                {selectedAsset.favorite ? 'Remove Favorite' : 'Mark as Favorite'}
              </Button>
              <Button
                id="inspector-btn-delete"
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="w-full text-xs text-red-500 hover:bg-red-500/10 py-1.5"
              >
                Delete File Reference
              </Button>
            </div>
          </aside>
        )}
      </div>

      {/* --- FLOATING ACCORDION DRAWERS / MODALS --- */}

      {/* MODAL 1: CREATE COLLECTION MODAL */}
      <AnimatePresence>
        {isCreateCollectionOpen && (
          <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" id="create-collection-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4"
              id="create-collection-modal"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Create Album Collection</h3>
                <button
                  onClick={() => setIsCreateCollectionOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-4">
                <Input
                  id="new-collection-name"
                  label="Collection Name"
                  placeholder="e.g. Grandma High School Letters"
                  value={newCollectionData.name}
                  onChange={(e) => setNewCollectionData({ ...newCollectionData, name: e.target.value })}
                />

                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Description Notes</label>
                  <textarea
                    id="new-collection-description"
                    placeholder="Provide short structural metadata on this asset collection..."
                    value={newCollectionData.description}
                    onChange={(e) => setNewCollectionData({ ...newCollectionData, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-muted/30 border border-border rounded-xl focus:outline-none h-20"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Simulated Cover Image</label>
                  <select
                    value={newCollectionData.cover}
                    onChange={(e) => setNewCollectionData({ ...newCollectionData, cover: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-xl focus:outline-none"
                  >
                    <option value="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80">Portrait Portrait</option>
                    <option value="https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=300&q=80">Salem Classroom</option>
                    <option value="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=300&q=80">Watercolors Session</option>
                    <option value="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80">Bob Uniform</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    id="btn-close-collection"
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setIsCreateCollectionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="btn-save-collection"
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
                  >
                    Create Set
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: FULLSCREEN EXPERIENCE PREVIEW MODAL */}
      <AnimatePresence>
        {previewAsset && (
          <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 backdrop-blur-md p-4" id="fullscreen-experience-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
              id="fullscreen-preview-card"
            >
              {/* Left Column: Huge visual frame */}
              <div className="flex-grow bg-slate-900 flex flex-col items-center justify-center p-6 relative">
                
                {/* Specific format views */}
                {previewAsset.type === 'image' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={previewAsset.thumbnailUrl}
                      alt={previewAsset.name}
                      className="max-h-[50vh] md:max-h-[60vh] object-contain rounded-lg transition-transform duration-300 shadow-xl"
                      style={{ transform: `scale(${zoomLevel})` }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Zoom placeholder */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-lg border border-white/10 backdrop-blur">
                      <button
                        onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
                        className="p-1 text-white hover:bg-white/15 rounded cursor-pointer"
                        title="Zoom Out"
                      >
                        <X className="w-3 h-3 rotate-45" />
                      </button>
                      <span className="font-mono text-[9px] text-white px-1">{(zoomLevel * 100).toFixed(0)}%</span>
                      <button
                        onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                        className="p-1 text-white hover:bg-white/15 rounded cursor-pointer"
                        title="Zoom In"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {previewAsset.type === 'video' && (
                  <div className="w-full max-w-xl aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative flex flex-col justify-end p-4">
                    <img 
                      src={previewAsset.thumbnailUrl} 
                      alt="frame" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Centered play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 rounded-full bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center shadow-lg transform active:scale-95 transition-all cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-1" />}
                      </button>
                    </div>

                    {/* Timeline markers placeholder */}
                    <div className="w-full space-y-2 bg-slate-950/70 p-3 rounded-lg backdrop-blur relative z-10">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
                        <span>{isPlaying ? '00:15' : '00:00'}</span>
                        <div className="flex gap-2">
                          <span className="text-cinema-amber-400">● Marker Intro (1940s)</span>
                          <span className="text-slate-400">● Marker School (1950s)</span>
                        </div>
                        <span>{previewAsset.duration}</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cinema-amber-500 rounded-full" 
                          style={{ width: isPlaying ? '15%' : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {previewAsset.type === 'audio' && (
                  <div className="w-full max-w-md bg-slate-950/60 p-6 rounded-2xl border border-white/10 text-center space-y-6 relative">
                    <div className="mx-auto w-16 h-16 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500">
                      <Music className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-white font-mono tracking-wide truncate">
                        {previewAsset.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                        Oral Voice Recording File • Mono 44kHz
                      </p>
                    </div>

                    {/* Simulated Waveform lines representation */}
                    <div className="h-10 flex items-center justify-center gap-1">
                      {[12, 24, 18, 32, 14, 8, 22, 40, 28, 16, 36, 12, 18, 24, 30, 10, 16, 28, 14, 22, 8, 18].map((val, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 bg-cinema-amber-500 rounded-full transition-all duration-300"
                          style={{ 
                            height: isPlaying ? `${val + Math.floor(Math.random() * 15)}%` : `${val * 0.4}%`,
                            opacity: idx % 2 === 0 ? 0.9 : 0.6
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 rounded-full bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center shadow-lg cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                      </button>
                      <span className="font-mono text-[10px] text-slate-400">
                        {isPlaying ? '00:08' : '00:00'} / {previewAsset.duration}
                      </span>
                    </div>
                  </div>
                )}

                {previewAsset.type === 'document' && (
                  <div className="w-full max-w-lg bg-card border border-border p-6 rounded-2xl shadow-xl space-y-4 text-left">
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase text-foreground truncate">{previewAsset.name}</h4>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold">
                          PDF Document Vault Entry ({previewAsset.size})
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-xl border border-border/80 space-y-3 font-serif leading-relaxed text-muted-foreground text-[11px]">
                      <h5 className="font-sans font-bold text-foreground text-xs uppercase tracking-wider">{previewAsset.category} Metadata Preview</h5>
                      <p>
                        "This archival record is digitially indexed for voiceover generation scripts. All transcript records are parsed by natural language processors to confirm dates, municipal offices, and graduation accolades."
                      </p>
                      <p className="border-t border-border/60 pt-2 font-mono text-[9px] text-muted-foreground leading-normal">
                        Notes: {previewAsset.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {previewAsset.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-muted rounded font-mono text-[9px] text-muted-foreground border border-border">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Close */}
                <button
                  onClick={() => {
                    setPreviewAsset(null);
                    setIsPlaying(false);
                    setZoomLevel(1);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-all cursor-pointer border border-white/10"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Right Column: Full Metadata & Info Details */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-card p-5 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-5">
                  <div className="pb-3 border-b border-border">
                    <span className="text-[9px] font-mono font-black uppercase text-cinema-amber-500 block">ASSET ARCHIVE PROFILE</span>
                    <h3 className="font-display font-black text-xs uppercase tracking-wide text-foreground mt-0.5 truncate">{previewAsset.name}</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Document Category</span>
                      <strong className="text-foreground uppercase text-[11px] block mt-0.5">{previewAsset.category}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Linked Story</span>
                      <strong className="text-foreground font-semibold block mt-0.5 truncate">{previewAsset.linkedStoryName}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Tags Ledger</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {previewAsset.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-muted text-[10px] text-muted-foreground font-mono rounded border border-border uppercase">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">Archive Description</span>
                      <p className="text-muted-foreground mt-1 leading-normal text-[11px] font-serif">
                        {previewAsset.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-6 space-y-2">
                  <Button
                    id="preview-btn-download"
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => showToast('success', 'File Downloading', 'Downloading physical source image file to browser...')}
                    className="w-full text-xs"
                  >
                    Download Original
                  </Button>
                  <Button
                    id="preview-btn-fav"
                    variant="primary"
                    size="sm"
                    leftIcon={<Heart className={`w-3.5 h-3.5 ${previewAsset.favorite ? 'fill-slate-950' : ''}`} />}
                    onClick={() => handleToggleFavorite(previewAsset.id)}
                    className="w-full bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold text-xs"
                  >
                    {previewAsset.favorite ? 'Unfavorite File' : 'Add to Favorites'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget?.type === 'single'
            ? 'Delete Memoir Asset?'
            : deleteTarget?.type === 'bulk'
            ? 'Delete Selected Assets?'
            : 'Delete Album Collection?'
        }
        message={
          deleteTarget?.type === 'single'
            ? `Are you sure you want to permanently delete "${deleteTarget?.name || ''}" from your vault? All chapter and timeline scene connections will be destroyed.`
            : deleteTarget?.type === 'bulk'
            ? `Are you sure you want to permanently delete all ${deleteTarget?.name || ''} from your vault? All chapter and timeline scene connections will be destroyed.`
            : `Are you sure you want to permanently delete the collection "${deleteTarget?.name || ''}"? This deletes the album organization wrapper but will NOT delete any individual files within it.`
        }
      />
    </div>
  );
}
