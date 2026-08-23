/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  FileText,
  Plus,
  Archive,
  Search,
  X,
  Eye,
  Trash2,
  Bookmark,
  Edit2,
  Check,
  Wand2,
} from 'lucide-react';
import { ExtendedStory } from '../mockStoriesData';
import { StoryCharacter } from '../CharactersWorkspace';
import { StoryScene, ScenesWorkspace } from '../ScenesWorkspace';
import { DocumentSchema, DocumentService, MediaService } from '../../../storage';
import { Select } from '../../ui/Select';
import { EmptyState } from '../../ui/EmptyState';

export interface LocalMediaItem {
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

export interface ScenesMediaModeProps {
  initialStory: ExtendedStory;
  storyMeta: {
    title: string;
    subtitle: string;
    description: string;
    language: string;
    visibility: string;
    internalNotes: string;
  };
  activeSection: string;
  onNavigateSection: (section: string) => void;

  // Scenes / Storyboard
  scenes: StoryScene[];
  onUpdateScenes: (scenes: StoryScene[]) => void;

  // Media Assets
  mediaItems: LocalMediaItem[];
  onRefreshMedia: () => Promise<void>;
  onToggleFavoriteMedia: (id: string) => void;
  onRenameMedia: (id: string) => void;
  onDeleteMedia: (id: string) => void;

  // Documents Ledger
  documents: DocumentSchema[];
  onRefreshDocuments: () => Promise<void>;
  onToggleFavoriteDocument: (id: string, fav: boolean) => void;
  onArchiveDocument: (id: string) => void;
  onRestoreDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onRenameDocument?: (id: string, newName: string) => void;

  // Cross-Domain Context
  timelineEvents: any[];
  characters: StoryCharacter[];

  // Inspector Selection
  selectedInspectorItem: {
    type: 'story' | 'scene' | 'timeline' | 'person' | 'media' | 'document' | 'narration' | 'music' | 'render';
    id: string;
    data: any;
  };
  onSelectInspectorItem: (item: {
    type: 'story' | 'scene' | 'timeline' | 'person' | 'media' | 'document' | 'narration' | 'music' | 'render';
    id: string;
    data: any;
  }) => void;

  // Notifications
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const ScenesMediaMode: React.FC<ScenesMediaModeProps> = ({
  initialStory,
  storyMeta,
  activeSection,
  onNavigateSection,
  scenes,
  onUpdateScenes,
  mediaItems,
  onRefreshMedia,
  onToggleFavoriteMedia,
  onRenameMedia,
  onDeleteMedia,
  documents,
  onRefreshDocuments,
  onToggleFavoriteDocument,
  onArchiveDocument,
  onRestoreDocument,
  onDeleteDocument,
  timelineEvents,
  characters,
  selectedInspectorItem,
  onSelectInspectorItem,
  showToast,
}) => {
  // 1. MEDIA FILTER & SEARCH STATE
  const [mediaFilter, setMediaFilter] = useState<'All' | 'image' | 'video' | 'audio' | 'document'>('All');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');
  const workspaceFileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesType = mediaFilter === 'All' || item.type === mediaFilter;
      const matchesSearch = item.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(mediaSearchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [mediaItems, mediaFilter, mediaSearchQuery]);

  const handleOpenWorkspaceUpload = () => {
    workspaceFileInputRef.current?.click();
  };

  const handleWorkspaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
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
    await onRefreshMedia();
  };

  // 2. SUPPORTING DOCUMENTS FILTER & SEARCH STATE
  const [documentSearchQuery, setDocumentSearchQuery] = useState<string>('');
  const [documentFilter, setDocumentFilter] = useState<string>('All');
  const [documentSortBy, setDocumentSortBy] = useState<'recently-uploaded' | 'name' | 'size' | 'type'>('recently-uploaded');
  const [showArchivedDocs, setShowArchivedDocs] = useState<boolean>(false);
  const documentsFileInputRef = useRef<HTMLInputElement>(null);

  const [previewDoc, setPreviewDoc] = useState<DocumentSchema | null>(null);
  const [isEditingDoc, setIsEditingDoc] = useState<boolean>(false);
  const [editDisplayName, setEditDisplayName] = useState<string>('');
  const [editDocumentType, setEditDocumentType] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');

  const [isDraggingDoc, setIsDraggingDoc] = useState<boolean>(false);

  const filteredDocuments = useMemo(() => {
    let list = documents.filter(doc => {
      const matchesSearch = doc.displayName.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.tags.some(t => t.toLowerCase().includes(documentSearchQuery.toLowerCase()));
      const matchesFilter = documentFilter === 'All' || documentFilter === 'Favorites' || doc.documentType === documentFilter;
      return matchesSearch && matchesFilter;
    });

    return [...list].sort((a, b) => {
      if (documentSortBy === 'name') {
        return a.displayName.localeCompare(b.displayName);
      } else if (documentSortBy === 'size') {
        return (b.fileSize || 0) - (a.fileSize || 0);
      } else if (documentSortBy === 'type') {
        return a.documentType.localeCompare(b.documentType);
      }
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });
  }, [documents, documentSearchQuery, documentFilter, documentSortBy]);

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
      await onRefreshDocuments();
      setPreviewDoc(prev => prev ? {
        ...prev,
        displayName: editDisplayName,
        documentType: editDocumentType,
        description: editDescription,
        tags: parsedTags
      } : null);
      setIsEditingDoc(false);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleOpenDocumentUpload = () => {
    documentsFileInputRef.current?.click();
  };

  const handleDocumentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
    await onRefreshDocuments();
  };

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
    await onRefreshDocuments();
  };

  return (
    <div className="w-full" id="scenes-media-mode-root">
      {/* 1. SCENES / STORYBOARD SECTION */}
      {activeSection === 'scenes' && (
        <motion.div
          key="workspace-scenes"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
          id="pane-scenes"
        >
          <ScenesWorkspace
            storyId={initialStory.id}
            storyTitle={storyMeta.title}
            scenes={scenes}
            onUpdateScenes={onUpdateScenes}
            timelineEvents={timelineEvents}
            characters={characters}
            mediaItems={mediaItems}
            showToast={showToast}
          />
        </motion.div>
      )}

      {/* 2. MEDIA ORGANIZER SECTION */}
      {(activeSection === 'media' || activeSection === 'assets') && (
        <motion.div
          key="workspace-media"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 md:p-8 space-y-6 w-full"
          id="pane-media"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-cinema-amber-500" /> Media Library & Archival Assets
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify portrait quality, tag visual themes, and manage scanned documents, clips, and recordings.
              </p>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl shrink-0">
              <button
                onClick={() => onNavigateSection('media')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30"
              >
                Media Assets ({mediaItems.length})
              </button>
              <button
                onClick={() => onNavigateSection('documents')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
              >
                Supporting Documents ({documents.length})
              </button>
            </div>
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
                    onClick={() => onSelectInspectorItem({ type: 'media', id: media.id, data: media })}
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
                        onClick={(e) => { e.stopPropagation(); onToggleFavoriteMedia(media.id); }}
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
                          onClick={(e) => { e.stopPropagation(); onRenameMedia(media.id); }}
                          className="p-1 hover:text-foreground hover:bg-muted rounded"
                          title="Rename metadata"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteMedia(media.id); }}
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

      {/* 3. SUPPORTING DOCUMENTS SECTION */}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cinema-amber-500" /> Supporting Documents Ledger
                </h3>
                <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-500 px-1.5 py-0.5 rounded border border-cinema-amber-500/20">
                  {documents.length} PERSISTED
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Organize scanned letters, diplomas, military records, and physical archives using local storage. Drag & drop files directly onto this panel.
              </p>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl shrink-0">
              <button
                onClick={() => onNavigateSection('media')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
              >
                Media Assets ({mediaItems.length})
              </button>
              <button
                onClick={() => onNavigateSection('documents')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-cinema-amber-500/15 text-cinema-amber-500 border border-cinema-amber-500/30"
              >
                Supporting Documents ({documents.length})
              </button>
            </div>
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
                          onClick={() => onSelectInspectorItem({ type: 'document', id: doc.id, data: doc })}
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
                                onClick={() => onToggleFavoriteDocument(doc.id, !doc.favorite)}
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
                                onClick={() => onDeleteDocument(doc.id)}
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
                                onClick={() => onToggleFavoriteDocument(previewDoc.id, !previewDoc.favorite)}
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
                                  onDeleteDocument(pId);
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
    </div>
  );
};
