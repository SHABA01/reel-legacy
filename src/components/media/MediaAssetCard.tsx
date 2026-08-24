/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Camera,
  Film,
  Music,
  FileText,
  Star,
  Eye,
  CheckCircle2,
  AlertCircle,
  Play,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  Sparkles,
  Link2
} from 'lucide-react';
import { ExtendedMediaAsset } from '../../types/media';
import { ContextTrigger } from '../ui/ContextTrigger';

interface MediaAssetCardProps {
  key?: React.Key;
  asset: ExtendedMediaAsset;
  isSelected: boolean;
  isMultiSelected: boolean;
  onSelect: (asset: ExtendedMediaAsset, e: React.MouseEvent) => void;
  onToggleMultiSelect: (assetId: string) => void;
  onToggleFavorite: (assetId: string) => void;
  onPreview: (asset: ExtendedMediaAsset) => void;
  onRename: (asset: ExtendedMediaAsset) => void;
  onDelete: (asset: ExtendedMediaAsset) => void;
  onInspectDetails?: (asset: ExtendedMediaAsset) => void;
  onQuickTag?: (asset: ExtendedMediaAsset) => void;
  onAddToStory?: (asset: ExtendedMediaAsset) => void;
  viewMode?: 'grid' | 'list';
}

export function MediaAssetCard({
  asset,
  isSelected,
  isMultiSelected,
  onSelect,
  onToggleMultiSelect,
  onToggleFavorite,
  onPreview,
  onRename,
  onDelete,
  onInspectDetails,
  viewMode = 'grid'
}: MediaAssetCardProps) {
  const getMediaTypeIcon = () => {
    switch (asset.type) {
      case 'image':
        return <Camera className="w-3.5 h-3.5 text-blue-400" />;
      case 'video':
        return <Film className="w-3.5 h-3.5 text-purple-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-emerald-400" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (asset.readinessStatus) {
      case 'Ready':
        return (
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Ready
          </span>
        );
      case 'Needs Metadata':
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono text-[9px] font-bold inline-flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" /> Needs Meta
          </span>
        );
      case 'Damaged':
        return (
          <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono text-[9px] font-bold inline-flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Damaged
          </span>
        );
      case 'Low Resolution':
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[9px] font-bold">
            Low Res
          </span>
        );
      case 'Unused':
        return (
          <span className="px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground font-mono text-[9px] font-bold">
            Unused
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[9px]">
            {asset.readinessStatus || 'Unspecified'}
          </span>
        );
    }
  };

  const usageCount =
    asset.usageCount ||
    (asset.relationships
      ? asset.relationships.linkedScenes.length + asset.relationships.linkedTimelineEvents.length
      : 0);

  // LIST VIEW: Canonical Table Row
  if (viewMode === 'list') {
    return (
      <tr
        onClick={(e) => onSelect(asset, e)}
        className={`border-b border-border text-xs hover:bg-muted/40 transition-colors cursor-pointer select-none ${
          isMultiSelected || isSelected ? 'bg-cinema-amber-500/10' : ''
        }`}
      >
        {/* Checkbox */}
        <td className="p-3 w-10" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onToggleMultiSelect(asset.id)}
            className="p-1 text-muted-foreground hover:text-cinema-amber-400 cursor-pointer"
            aria-label={`Select ${asset.name}`}
          >
            {isMultiSelected ? (
              <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground/60" />
            )}
          </button>
        </td>

        {/* Thumbnail Preview */}
        <td className="p-3 w-16">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-muted/80 border border-border shrink-0">
            <img
              src={asset.thumbnailUrl}
              alt={asset.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {asset.type === 'video' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>
        </td>

        {/* Asset Name & Tags */}
        <td className="p-3 min-w-[180px] max-w-[280px]">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground truncate hover:text-cinema-amber-400 transition-colors">
                {asset.name}
              </span>
              {asset.favorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            {asset.tags && asset.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-0.5 truncate">
                {asset.tags.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 rounded bg-muted/80 text-[9px] text-muted-foreground font-mono"
                  >
                    #{t}
                  </span>
                ))}
                {asset.tags.length > 3 && (
                  <span className="text-[9px] text-muted-foreground font-mono">
                    +{asset.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </td>

        {/* Type & Size */}
        <td className="p-3 whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {getMediaTypeIcon()}
            <span className="capitalize font-medium text-foreground">{asset.type}</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="font-mono text-[11px]">{asset.size}</span>
            {asset.duration && (
              <>
                <span className="text-muted-foreground/60">•</span>
                <span className="font-mono text-[11px]">{asset.duration}</span>
              </>
            )}
          </div>
        </td>

        {/* Story Scope */}
        <td className="p-3 whitespace-nowrap">
          {asset.linkedStoryName ? (
            <span className="text-cinema-amber-400 font-mono text-[11px] font-medium bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
              {asset.linkedStoryName}
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-mono text-[11px]">Unlinked</span>
          )}
        </td>

        {/* Usage */}
        <td className="p-3 whitespace-nowrap">
          {usageCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-cinema-amber-500/10 text-cinema-amber-400 border border-cinema-amber-500/20 font-mono text-[10px] inline-flex items-center gap-1">
              <Link2 className="w-3 h-3" /> {usageCount} {usageCount === 1 ? 'use' : 'uses'}
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-mono text-[11px]">0 uses</span>
          )}
        </td>

        {/* Readiness */}
        <td className="p-3 whitespace-nowrap">{getStatusBadge()}</td>

        {/* Actions */}
        <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1.5">
            {/* Primary Details Trigger */}
            {onInspectDetails && (
              <ContextTrigger
                onClick={() => onInspectDetails(asset)}
                size="xs"
                showLabel
                label="Details"
                variant="pill"
                title="View details in context drawer"
              />
            )}

            <button
              type="button"
              onClick={() => onPreview(asset)}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              title="Preview Asset"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(asset.id)}
              className="p-1.5 rounded text-muted-foreground hover:text-amber-400 hover:bg-muted cursor-pointer"
              title="Toggle Favorite"
            >
              <Star className={`w-3.5 h-3.5 ${asset.favorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => onRename(asset)}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              title="Rename"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(asset)}
              className="p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // GRID VIEW (Lightroom / Resolve Media Pool card)
  return (
    <div
      onClick={(e) => onSelect(asset, e)}
      className={`group relative rounded-xl border overflow-hidden transition-all cursor-pointer flex flex-col text-xs ${
        isSelected
          ? 'bg-card border-cinema-amber-500 shadow-lg ring-2 ring-cinema-amber-500/30'
          : 'bg-card/70 border-border hover:border-cinema-amber-500/40 hover:bg-card hover:shadow-md'
      }`}
    >
      {/* Top Banner & Multi-Select Checkbox */}
      <div className="relative aspect-video w-full bg-muted/80 overflow-hidden">
        <img
          src={asset.thumbnailUrl}
          alt={asset.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Badges Top Row */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMultiSelect(asset.id);
            }}
            className="pointer-events-auto p-1 rounded bg-black/60 backdrop-blur-md text-white hover:bg-cinema-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
          >
            {isMultiSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-cinema-amber-400" />
            ) : (
              <Square className="w-3.5 h-3.5 text-white/80" />
            )}
          </button>

          <div className="flex items-center gap-1">
            {getStatusBadge()}

            {/* Universal ⓘ Details Trigger Button */}
            {onInspectDetails && (
              <div className="pointer-events-auto">
                <ContextTrigger
                  onClick={() => onInspectDetails(asset)}
                  size="sm"
                  variant="card-overlay"
                  title="View details"
                />
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(asset.id);
              }}
              className="pointer-events-auto p-1 rounded bg-black/60 backdrop-blur-md text-white hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Star className={`w-3.5 h-3.5 ${asset.favorite ? 'text-amber-400 fill-amber-400' : 'text-white/80'}`} />
            </button>
          </div>
        </div>

        {/* Media Type & Duration / Resolution Overlay Bottom Row */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-mono text-[9px] flex items-center gap-1">
            {getMediaTypeIcon()}
            <span className="capitalize">{asset.type}</span>
          </span>

          {(asset.duration || asset.resolution) && (
            <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white/90 font-mono text-[9px]">
              {asset.duration || asset.resolution}
            </span>
          )}
        </div>

        {/* Video Play Overlay */}
        {asset.type === 'video' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-cinema-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Metadata Details */}
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h4 className="font-semibold text-foreground truncate text-xs group-hover:text-cinema-amber-400 transition-colors">
            {asset.name}
          </h4>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
            <span className="truncate">{asset.category}</span>
            <span className="font-mono">{asset.size}</span>
          </div>

          {asset.linkedStoryName && (
            <p className="text-[10px] font-mono text-cinema-amber-400/90 truncate mt-1">
              Story: {asset.linkedStoryName}
            </p>
          )}
        </div>

        {/* Tags & Quick Action Row */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-1 truncate max-w-[130px]">
            {asset.tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="px-1.5 py-0.2 rounded bg-muted/80 text-[9px] text-muted-foreground font-mono">
                #{t}
              </span>
            ))}
            {asset.tags.length > 2 && (
              <span className="text-[9px] text-muted-foreground font-mono">+{asset.tags.length - 2}</span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(asset);
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              title="Preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRename(asset);
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              title="Rename"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(asset);
              }}
              className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

