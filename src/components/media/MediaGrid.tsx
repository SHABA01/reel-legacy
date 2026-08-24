/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ExtendedMediaAsset } from '../../types/media';
import { MediaAssetCard } from './MediaAssetCard';
import { EmptyState } from '../ui/EmptyState';
import { ViewModeTransition } from '../ui/ViewModeTransition';
import { Layers } from 'lucide-react';

interface MediaGridProps {
  assets: ExtendedMediaAsset[];
  selectedAssetId: string | null;
  selectedAssets: string[];
  onSelectAsset: (asset: ExtendedMediaAsset, e: React.MouseEvent) => void;
  onToggleMultiSelect: (assetId: string) => void;
  onToggleFavorite: (assetId: string) => void;
  onPreview: (asset: ExtendedMediaAsset) => void;
  onRename: (asset: ExtendedMediaAsset) => void;
  onDelete: (asset: ExtendedMediaAsset) => void;
  onInspectDetails?: (asset: ExtendedMediaAsset) => void;
  viewMode: 'grid' | 'list';
  grouping: 'none' | 'type' | 'story' | 'category' | 'status';
  onClearFilters?: () => void;
}

export function MediaGrid({
  assets,
  selectedAssetId,
  selectedAssets,
  onSelectAsset,
  onToggleMultiSelect,
  onToggleFavorite,
  onPreview,
  onRename,
  onDelete,
  onInspectDetails,
  viewMode,
  grouping,
  onClearFilters
}: MediaGridProps) {
  // Compute grouped structure if grouping is active
  const groupedAssets = useMemo(() => {
    if (grouping === 'none') return { 'All Vault Items': assets };

    const groups: Record<string, ExtendedMediaAsset[]> = {};

    assets.forEach(asset => {
      let key = 'Unassigned';
      if (grouping === 'type') key = `${asset.type.toUpperCase()}S`;
      else if (grouping === 'story') key = asset.linkedStoryName || 'Unlinked Assets';
      else if (grouping === 'category') key = asset.category || 'General';
      else if (grouping === 'status') key = asset.readinessStatus || 'Unspecified';

      if (!groups[key]) groups[key] = [];
      groups[key].push(asset);
    });

    return groups;
  }, [assets, grouping]);

  if (assets.length === 0) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center">
        <EmptyState
          type="media"
          title="No Media Assets Found"
          description="No media assets match your active filter, search query, or collection scope."
          primaryActionLabel="Clear Filters"
          onPrimaryAction={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <ViewModeTransition viewMode={viewMode}>
        <div className="space-y-6">
          {Object.entries(groupedAssets).map(([groupTitle, groupItems]: [string, ExtendedMediaAsset[]]) => {
            const isAllGroupSelected =
              groupItems.length > 0 && groupItems.every(a => selectedAssets.includes(a.id));

            const handleToggleGroupSelection = () => {
              if (isAllGroupSelected) {
                groupItems.forEach(a => {
                  if (selectedAssets.includes(a.id)) {
                    onToggleMultiSelect(a.id);
                  }
                });
              } else {
                groupItems.forEach(a => {
                  if (!selectedAssets.includes(a.id)) {
                    onToggleMultiSelect(a.id);
                  }
                });
              }
            };

            return (
              <div key={groupTitle} className="space-y-3">
                {grouping !== 'none' && (
                  <div className="flex items-center justify-between border-b border-border pb-1.5 pt-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cinema-amber-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> {groupTitle}
                    </h3>
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                      {groupItems.length} items
                    </span>
                  </div>
                )}

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                    {groupItems.map(asset => (
                      <MediaAssetCard
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAssetId === asset.id}
                        isMultiSelected={selectedAssets.includes(asset.id)}
                        onSelect={onSelectAsset}
                        onToggleMultiSelect={onToggleMultiSelect}
                        onToggleFavorite={onToggleFavorite}
                        onPreview={onPreview}
                        onRename={onRename}
                        onDelete={onDelete}
                        onInspectDetails={onInspectDetails}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40 select-none">
                            <th className="p-3 w-10">
                              <input
                                type="checkbox"
                                checked={isAllGroupSelected}
                                onChange={handleToggleGroupSelection}
                                className="w-3.5 h-3.5 rounded border-border bg-muted cursor-pointer"
                                aria-label="Select all in group"
                              />
                            </th>
                            <th className="p-3 w-16">Preview</th>
                            <th className="p-3">Asset</th>
                            <th className="p-3">Type & Size</th>
                            <th className="p-3">Story Scope</th>
                            <th className="p-3">Usage</th>
                            <th className="p-3">Readiness</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupItems.map(asset => (
                            <MediaAssetCard
                              key={asset.id}
                              asset={asset}
                              isSelected={selectedAssetId === asset.id}
                              isMultiSelected={selectedAssets.includes(asset.id)}
                              onSelect={onSelectAsset}
                              onToggleMultiSelect={onToggleMultiSelect}
                              onToggleFavorite={onToggleFavorite}
                              onPreview={onPreview}
                              onRename={onRename}
                              onDelete={onDelete}
                              onInspectDetails={onInspectDetails}
                              viewMode="list"
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ViewModeTransition>
    </div>
  );
}

