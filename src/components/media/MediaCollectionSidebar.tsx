/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Sparkles,
  Camera,
  Film,
  Music,
  FileText,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Share2,
  Users,
  ChevronRight,
  ChevronDown,
  Layers,
  FileCheck,
  Bookmark
} from 'lucide-react';
import { ExtendedMediaAsset, MediaCollection, SmartCollectionType } from '../../types/media';
import { MediaLibraryService } from '../../services/mediaLibraryService';

interface MediaCollectionSidebarProps {
  activeSmartCollection: SmartCollectionType;
  onSelectSmartCollection: (type: SmartCollectionType) => void;
  collections: MediaCollection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onCreateCollectionClick: () => void;
  stories: Array<{ id: string; title: string }>;
  selectedStoryId: string | null;
  onSelectStoryFolder: (storyId: string | null) => void;
  assets: ExtendedMediaAsset[];
  isCollapsed?: boolean;
}

export function MediaCollectionSidebar({
  activeSmartCollection,
  onSelectSmartCollection,
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollectionClick,
  stories,
  selectedStoryId,
  onSelectStoryFolder,
  assets
}: MediaCollectionSidebarProps) {
  const [smartExpanded, setSmartExpanded] = useState(true);
  const [storiesExpanded, setStoriesExpanded] = useState(true);
  const [albumsExpanded, setAlbumsExpanded] = useState(true);

  // Calculate live badge counts for each smart collection
  const getCount = (type: SmartCollectionType) => {
    return MediaLibraryService.filterBySmartCollection(assets, type).length;
  };

  const smartCollectionsList: Array<{
    type: SmartCollectionType;
    label: string;
    icon: React.ReactNode;
    color?: string;
  }> = [
    { type: 'all', label: 'All Vault Assets', icon: <Layers className="w-4 h-4" /> },
    { type: 'photos', label: 'Photos & Stills', icon: <Camera className="w-4 h-4 text-blue-400" /> },
    { type: 'videos', label: 'Video Footage', icon: <Film className="w-4 h-4 text-purple-400" /> },
    { type: 'audio', label: 'Voice & Music', icon: <Music className="w-4 h-4 text-emerald-400" /> },
    { type: 'documents', label: 'Documents & OCR', icon: <FileText className="w-4 h-4 text-amber-400" /> },
    { type: 'ai-generated', label: 'AI Generated', icon: <Sparkles className="w-4 h-4 text-cinema-amber-400" /> },
    { type: 'portraits', label: 'Portraits & Stills', icon: <Users className="w-4 h-4 text-indigo-400" /> },
    { type: 'interviews', label: 'Interview Recordings', icon: <Music className="w-4 h-4 text-teal-400" /> },
    { type: 'drone', label: 'Drone Footage', icon: <Film className="w-4 h-4 text-rose-400" /> },
    { type: 'historical', label: 'Historical Records', icon: <FileCheck className="w-4 h-4 text-amber-500" /> },
    { type: 'unused', label: 'Unused Assets', icon: <Bookmark className="w-4 h-4 text-slate-400" /> },
    { type: 'ready-for-production', label: 'Ready for Production', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
    { type: 'needs-review', label: 'Needs Review', icon: <AlertCircle className="w-4 h-4 text-amber-400" /> },
    { type: 'recently-imported', label: 'Recently Imported', icon: <Clock className="w-4 h-4 text-sky-400" /> },
    { type: 'favorites', label: 'Starred Favorites', icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" /> },
    { type: 'trash', label: 'Trash Vault', icon: <Trash2 className="w-4 h-4 text-red-400" /> }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur-md flex flex-col h-full overflow-hidden text-xs">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-cinema-amber-500" /> Collections DAM
        </span>
        <button
          onClick={onCreateCollectionClick}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors flex items-center gap-1"
          title="Create New Collection"
        >
          <FolderPlus className="w-3.5 h-3.5 text-cinema-amber-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* 1. SMART COLLECTIONS */}
        <div className="space-y-1">
          <button
            onClick={() => setSmartExpanded(!smartExpanded)}
            className="w-full px-2 py-1 flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors font-mono uppercase text-[10px] font-bold"
          >
            <span>Smart Collections</span>
            {smartExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {smartExpanded && (
            <div className="space-y-0.5 pl-1">
              {smartCollectionsList.map(item => {
                const count = getCount(item.type);
                const isActive = activeSmartCollection === item.type && !selectedCollectionId && !selectedStoryId;

                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      onSelectCollection(null);
                      onSelectStoryFolder(null);
                      onSelectSmartCollection(item.type);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-cinema-amber-500/15 text-cinema-amber-400 font-semibold border border-cinema-amber-500/30 shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-cinema-amber-500/20 text-cinema-amber-300' : 'bg-muted/80 text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. STORY FOLDERS */}
        <div className="space-y-1">
          <button
            onClick={() => setStoriesExpanded(!storiesExpanded)}
            className="w-full px-2 py-1 flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors font-mono uppercase text-[10px] font-bold"
          >
            <span>Story Folders</span>
            {storiesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {storiesExpanded && (
            <div className="space-y-0.5 pl-1">
              <button
                onClick={() => onSelectStoryFolder(null)}
                className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                  !selectedStoryId && selectedCollectionId === null && activeSmartCollection === 'all'
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="w-3.5 h-3.5 text-cinema-amber-500/70" />
                  <span className="truncate">All Stories Scope</span>
                </div>
              </button>

              {stories.map(story => {
                const count = assets.filter(a => a.linkedStoryId === story.id && !a.archived).length;
                const isActive = selectedStoryId === story.id;

                return (
                  <button
                    key={story.id}
                    onClick={() => {
                      onSelectCollection(null);
                      onSelectStoryFolder(story.id);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-cinema-amber-500/15 text-cinema-amber-400 font-semibold border border-cinema-amber-500/30'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-cinema-amber-400' : 'text-amber-500/80'}`} />
                      <span className="truncate">{story.title}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-muted/80 text-muted-foreground">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. CUSTOM ALBUMS & COLLECTIONS */}
        <div className="space-y-1">
          <div className="px-2 py-1 flex items-center justify-between">
            <button
              onClick={() => setAlbumsExpanded(!albumsExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors font-mono uppercase text-[10px] font-bold flex items-center gap-1"
            >
              <span>Custom Albums</span>
              {albumsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            <button
              onClick={onCreateCollectionClick}
              className="text-[10px] text-cinema-amber-500 hover:underline font-mono"
            >
              + New
            </button>
          </div>

          {albumsExpanded && (
            <div className="space-y-0.5 pl-1">
              {collections.map(col => {
                const isActive = selectedCollectionId === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      onSelectStoryFolder(null);
                      onSelectCollection(col.id);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-cinema-amber-500/15 text-cinema-amber-400 font-semibold border border-cinema-amber-500/30'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FolderOpen className="w-3.5 h-3.5 text-cinema-amber-500" />
                      <span className="truncate">{col.name}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-muted/80 text-muted-foreground">
                      {col.assetCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
