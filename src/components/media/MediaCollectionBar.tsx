/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Camera,
  Film,
  Music,
  FileText,
  Sparkles,
  Star,
  FolderOpen,
  FolderPlus,
  Users,
  Clock,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ChevronDown,
  Plus,
  Filter,
  Check
} from 'lucide-react';
import { ExtendedMediaAsset, MediaCollection, SmartCollectionType } from '../../types/media';
import { MediaLibraryService } from '../../services/mediaLibraryService';

interface MediaCollectionBarProps {
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
}

export function MediaCollectionBar({
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
}: MediaCollectionBarProps) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);

  // Live count helper
  const getCount = (type: SmartCollectionType) => {
    return MediaLibraryService.filterBySmartCollection(assets, type).length;
  };

  // Primary Horizontal Smart Tabs
  const primaryTabs: Array<{
    type: SmartCollectionType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { type: 'all', label: 'All Vault Assets', icon: <Layers className="w-3.5 h-3.5" /> },
    { type: 'photos', label: 'Photos & Stills', icon: <Camera className="w-3.5 h-3.5 text-blue-400" /> },
    { type: 'videos', label: 'Video Footage', icon: <Film className="w-3.5 h-3.5 text-purple-400" /> },
    { type: 'audio', label: 'Voice & Audio', icon: <Music className="w-3.5 h-3.5 text-emerald-400" /> },
    { type: 'documents', label: 'Documents & OCR', icon: <FileText className="w-3.5 h-3.5 text-amber-400" /> },
    { type: 'ai-generated', label: 'AI Generated', icon: <Sparkles className="w-3.5 h-3.5 text-cinema-amber-400" /> },
    { type: 'favorites', label: 'Starred Favorites', icon: <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> }
  ];

  // Secondary Smart Collections in Dropdown
  const secondaryTabs: Array<{
    type: SmartCollectionType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { type: 'portraits', label: 'Portraits & Stills', icon: <Users className="w-3.5 h-3.5 text-indigo-400" /> },
    { type: 'interviews', label: 'Interview Recordings', icon: <Music className="w-3.5 h-3.5 text-teal-400" /> },
    { type: 'drone', label: 'Drone Footage', icon: <Film className="w-3.5 h-3.5 text-rose-400" /> },
    { type: 'historical', label: 'Historical Records', icon: <FileText className="w-3.5 h-3.5 text-amber-500" /> },
    { type: 'unused', label: 'Unused Assets', icon: <Bookmark className="w-3.5 h-3.5 text-slate-400" /> },
    { type: 'ready-for-production', label: 'Ready for Production', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { type: 'needs-review', label: 'Needs Review', icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> },
    { type: 'recently-imported', label: 'Recently Imported', icon: <Clock className="w-3.5 h-3.5 text-sky-400" /> },
    { type: 'trash', label: 'Trash Vault', icon: <Trash2 className="w-3.5 h-3.5 text-red-400" /> }
  ];

  const currentAlbum = collections.find(c => c.id === selectedCollectionId);
  const isSecondaryActive = secondaryTabs.some(t => t.type === activeSmartCollection) && !selectedCollectionId && !selectedStoryId;

  return (
    <div className="bg-card/90 backdrop-blur-md border-b border-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
      {/* LEFT: Horizontal Smart Collection Tabs & Segmented Chips */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full">
        {primaryTabs.map(tab => {
          const isActive = activeSmartCollection === tab.type && !selectedCollectionId && !selectedStoryId;
          const count = getCount(tab.type);

          return (
            <button
              key={tab.type}
              onClick={() => {
                onSelectCollection(null);
                onSelectStoryFolder(null);
                onSelectSmartCollection(tab.type);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-cinema-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-slate-950/20 text-slate-950 font-extrabold' : 'bg-background/60 text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

        {/* More Smart Filter Collections Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer whitespace-nowrap border ${
              isSecondaryActive
                ? 'bg-cinema-amber-500/15 border-cinema-amber-500/50 text-cinema-amber-400 font-bold'
                : 'bg-muted/60 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>More Filters</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isMoreMenuOpen && (
            <div
              className="absolute left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-xl z-50 p-1.5 space-y-0.5"
              onMouseLeave={() => setIsMoreMenuOpen(false)}
            >
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-muted-foreground font-bold">
                Specialized Vault Scopes
              </div>
              {secondaryTabs.map(tab => {
                const isActive = activeSmartCollection === tab.type && !selectedCollectionId && !selectedStoryId;
                const count = getCount(tab.type);

                return (
                  <button
                    key={tab.type}
                    onClick={() => {
                      onSelectCollection(null);
                      onSelectStoryFolder(null);
                      onSelectSmartCollection(tab.type);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-cinema-amber-500/20 text-cinema-amber-300 font-bold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Story Folder Scope & Custom Album Collection Selector */}
      <div className="flex items-center gap-2.5">
        {/* Custom Albums Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAlbumDropdownOpen(!isAlbumDropdownOpen)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer border ${
              selectedCollectionId
                ? 'bg-cinema-amber-500/20 border-cinema-amber-500/50 text-cinema-amber-400 font-bold'
                : 'bg-muted/60 border-border text-foreground hover:bg-muted'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-cinema-amber-400" />
            <span className="truncate max-w-[140px]">
              {currentAlbum ? currentAlbum.name : 'Custom Albums'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isAlbumDropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl z-50 p-2 space-y-1"
              onMouseLeave={() => setIsAlbumDropdownOpen(false)}
            >
              <div className="flex items-center justify-between px-2 py-1 border-b border-border mb-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Custom Vault Albums</span>
                <button
                  onClick={() => {
                    setIsAlbumDropdownOpen(false);
                    onCreateCollectionClick();
                  }}
                  className="text-[10px] text-cinema-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" /> New Album
                </button>
              </div>

              <button
                onClick={() => {
                  onSelectCollection(null);
                  setIsAlbumDropdownOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                  !selectedCollectionId ? 'bg-cinema-amber-500/15 text-cinema-amber-400 font-bold' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                All Albums Scope
              </button>

              {collections.filter(c => !c.isSmart).map(col => (
                <button
                  key={col.id}
                  onClick={() => {
                    onSelectStoryFolder(null);
                    onSelectCollection(col.id);
                    setIsAlbumDropdownOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    selectedCollectionId === col.id
                      ? 'bg-cinema-amber-500/20 text-cinema-amber-300 font-bold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" />
                    <span className="truncate">{col.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded-full">
                    {col.assetCount || 0}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Album Quick Action Button */}
        <button
          onClick={onCreateCollectionClick}
          className="p-1.5 rounded-lg bg-muted/80 border border-border text-muted-foreground hover:text-foreground hover:border-cinema-amber-500/40 transition-colors"
          title="Create New Custom Collection Album"
        >
          <FolderPlus className="w-4 h-4 text-cinema-amber-400" />
        </button>
      </div>
    </div>
  );
}
