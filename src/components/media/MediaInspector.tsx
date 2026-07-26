/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Info,
  Sparkles,
  Layers,
  Link2,
  Clock,
  History,
  MessageSquare,
  Star,
  Download,
  Share2,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Camera,
  Film,
  Music,
  UserCheck,
  FolderPlus,
  Play,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { ExtendedMediaAsset, AssetVersion } from '../../types/media';
import { AssetAnalysisService } from '../../services/assetAnalysisService';
import { InspectorTagBadges, InspectorActions } from '../stories/InspectorEntityCard';

interface MediaInspectorProps {
  asset: ExtendedMediaAsset | null;
  onClose: () => void;
  onUpdateAsset: (updated: ExtendedMediaAsset) => void;
  onDeleteAsset: (asset: ExtendedMediaAsset) => void;
  stories: Array<{ id: string; title: string }>;
  showToast: (type: 'success' | 'warning' | 'error' | 'info' | 'loading', message: string, description?: string) => void;
}

export function MediaInspector({
  asset,
  onClose,
  onUpdateAsset,
  onDeleteAsset,
  stories,
  showToast
}: MediaInspectorProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metadata' | 'ai' | 'relationships' | 'versions' | 'history'>('overview');
  const [isRestoring, setIsRestoring] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [newComment, setNewComment] = useState('');

  if (!asset) {
    return (
      <aside className="w-80 shrink-0 border-l border-border bg-card/60 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center text-muted-foreground text-xs">
        <Info className="w-8 h-8 text-cinema-amber-500/60 mb-2" />
        <p className="font-mono text-xs uppercase font-bold text-foreground">No Asset Selected</p>
        <p className="mt-1 text-[11px] max-w-[200px]">Click any media item in the vault grid to view metadata and AI tools.</p>
      </aside>
    );
  }

  const analysis = asset.aiAnalysis || AssetAnalysisService.analyzeAsset(asset);
  const relationships = asset.relationships || {
    linkedStoryId: asset.linkedStoryId,
    linkedStoryName: asset.linkedStoryName,
    linkedScenes: [{ id: 'sc-101', title: 'Chapter 1: Family Roots' }],
    linkedCharacters: [{ id: 'char-1', name: 'Grandfather John' }],
    linkedTimelineEvents: [{ id: 'evt-1', title: '1944 Enlistment Day' }],
    linkedNarrationBlocks: [],
    linkedMusicTracks: []
  };

  const handleApplyRestoration = async () => {
    setIsRestoring(true);
    showToast('loading', 'Running AI Neural Restoration...', 'Repairing scratches, color balance, and edge definition.');
    try {
      const result = await AssetAnalysisService.applyRestoration(asset);
      onUpdateAsset(result.updatedAsset);
      showToast('success', 'Restoration Applied', result.message);
    } catch (err: any) {
      showToast('error', 'Restoration Failed', err.message);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleRunTranscription = async () => {
    setIsTranscribing(true);
    showToast('loading', 'Transcribing Audio Stream...', 'Extracting speech transcripts and speaker timestamps.');
    try {
      const result = await AssetAnalysisService.runTranscription(asset);
      onUpdateAsset(result.updatedAsset);
      showToast('success', 'Transcription Complete', result.message);
    } catch (err: any) {
      showToast('error', 'Transcription Failed', err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comments = asset.comments || [];
    const updated = {
      ...asset,
      comments: [
        ...comments,
        {
          id: `cmt-${Date.now()}`,
          author: 'Archivist Lead',
          text: newComment.trim(),
          date: 'Just now'
        }
      ]
    };
    onUpdateAsset(updated);
    setNewComment('');
    showToast('info', 'Comment Added', 'Notes saved to asset audit log.');
  };

  return (
    <aside className="w-80 shrink-0 border-l border-border bg-card/80 backdrop-blur-md flex flex-col h-full overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cinema-amber-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Inspector DAM
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Thumbnail Preview */}
      <div className="relative aspect-video w-full bg-muted/80 overflow-hidden border-b border-border shrink-0">
        <img
          src={asset.thumbnailUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-white font-mono text-[9px] font-bold uppercase">
          {asset.category}
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={() => onUpdateAsset({ ...asset, favorite: !asset.favorite })}
            className="p-1 rounded bg-black/80 text-amber-400 hover:scale-110 transition-transform"
          >
            <Star className={`w-3.5 h-3.5 ${asset.favorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-around border-b border-border bg-muted/40 p-1 text-[10px] font-mono shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2 py-1 rounded transition-colors ${activeTab === 'overview' ? 'bg-cinema-amber-500 text-slate-950 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-2 py-1 rounded transition-colors ${activeTab === 'metadata' ? 'bg-cinema-amber-500 text-slate-950 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Meta
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${activeTab === 'ai' ? 'bg-cinema-amber-500 text-slate-950 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Sparkles className="w-2.5 h-2.5" /> AI
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`px-2 py-1 rounded transition-colors ${activeTab === 'relationships' ? 'bg-cinema-amber-500 text-slate-950 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Links
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-2 py-1 rounded transition-colors ${activeTab === 'versions' ? 'bg-cinema-amber-500 text-slate-950 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Versions
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-foreground text-sm leading-tight">{asset.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{asset.description || 'No caption description specified.'}</p>
            </div>

            <InspectorTagBadges tags={asset.tags} />

            <div className="space-y-1.5 pt-2 border-t border-border text-[11px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Production Readiness</span>
                <span className="font-mono font-bold text-emerald-400">{asset.readinessStatus}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Quality Rating</span>
                <span className="font-mono text-amber-400">{'★'.repeat(asset.qualityRating || 4)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>File Size</span>
                <span className="font-mono">{asset.size}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Upload Date</span>
                <span className="font-mono">{asset.uploadDate}</span>
              </div>
            </div>

            <InspectorActions
              favorite={asset.favorite}
              archived={asset.archived}
              downloadUrl={asset.thumbnailUrl}
              downloadFilename={asset.name}
              onToggleFavorite={() => onUpdateAsset({ ...asset, favorite: !asset.favorite })}
              onToggleArchive={() => onUpdateAsset({ ...asset, archived: !asset.archived })}
              onDelete={() => onDeleteAsset(asset)}
            />
          </div>
        )}

        {/* METADATA TAB */}
        {activeTab === 'metadata' && (
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-muted/60 space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Filename</span>
                <span className="font-mono text-foreground truncate max-w-[140px]">{asset.name}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Resolution</span>
                <span className="font-mono text-foreground">{asset.resolution || '1920x1080 (HD)'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Codec</span>
                <span className="font-mono text-foreground">{asset.codec || 'H.264 / AAC'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>FPS / Rate</span>
                <span className="font-mono text-foreground">{asset.fps || 24} fps</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Duration</span>
                <span className="font-mono text-foreground">{asset.duration || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Storage Vault</span>
                <span className="font-mono text-foreground">{asset.storageProvider || 'Local Vault'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Checksum</span>
                <span className="font-mono text-[9px] text-muted-foreground truncate max-w-[120px]">e9f8a12b9c7d</span>
              </div>
            </div>
          </div>
        )}

        {/* AI ANALYSIS TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-cinema-amber-500/10 border border-cinema-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cinema-amber-400 uppercase text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Vision & Audio Analysis
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cinema-amber-500/20 text-cinema-amber-300 font-bold">
                  Score: {analysis.qualityScore}/100
                </span>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {analysis.sceneDescription}
              </p>

              {analysis.facesDetected > 0 && (
                <div className="pt-2 border-t border-cinema-amber-500/20">
                  <span className="text-muted-foreground font-semibold block mb-1">Faces Detected ({analysis.facesDetected}):</span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.peopleFound.map((p, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.damageDetected && (
                <div className="pt-2 border-t border-rose-500/30 space-y-2">
                  <div className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Damage / Degradation Detected
                  </div>
                  <p className="text-muted-foreground text-[10px]">{analysis.restorationRecommendation}</p>
                  <button
                    onClick={handleApplyRestoration}
                    disabled={isRestoring}
                    className="w-full py-1.5 rounded-lg bg-cinema-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 hover:bg-cinema-amber-400 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {isRestoring ? 'Restoring...' : 'Run AI Restoration'}
                  </button>
                </div>
              )}

              {analysis.ocrText && (
                <div className="pt-2 border-t border-cinema-amber-500/20 space-y-1">
                  <span className="text-muted-foreground font-semibold block">Extracted OCR Text:</span>
                  <p className="p-2 rounded bg-black/40 font-mono text-[10px] text-foreground leading-relaxed">
                    "{analysis.ocrText}"
                  </p>
                </div>
              )}

              {(asset.type === 'audio' || asset.type === 'video') && (
                <div className="pt-2 border-t border-cinema-amber-500/20 space-y-1.5">
                  <span className="text-muted-foreground font-semibold block">Speech Transcript & Audio:</span>
                  {analysis.speechTranscript ? (
                    <p className="p-2 rounded bg-black/40 font-mono text-[10px] text-foreground leading-relaxed">
                      "{analysis.speechTranscript}"
                    </p>
                  ) : (
                    <button
                      onClick={handleRunTranscription}
                      disabled={isTranscribing}
                      className="w-full py-1.5 rounded-lg bg-muted text-foreground font-bold text-xs flex items-center justify-center gap-1 hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cinema-amber-500" /> {isTranscribing ? 'Transcribing...' : 'Run Speech Transcription'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RELATIONSHIPS TAB */}
        {activeTab === 'relationships' && (
          <div className="space-y-3 text-[11px]">
            <div className="space-y-1.5">
              <span className="text-muted-foreground font-mono text-[10px] uppercase font-bold block">Linked Story Scope</span>
              <select
                value={asset.linkedStoryId}
                onChange={(e) => {
                  const s = stories.find(st => st.id === e.target.value);
                  onUpdateAsset({
                    ...asset,
                    linkedStoryId: e.target.value,
                    linkedStoryName: s ? s.title : 'Unlinked Assets'
                  });
                }}
                className="w-full p-1.5 rounded bg-muted border border-border text-foreground font-semibold focus:outline-none"
              >
                <option value="unlinked">Unlinked (General Vault)</option>
                {stories.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/60 space-y-2 border border-border">
              <span className="font-mono text-[10px] font-bold text-cinema-amber-400 uppercase flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Connected Story Elements
              </span>

              <div className="space-y-1">
                <span className="text-muted-foreground font-medium block">Scenes Using This Asset:</span>
                {relationships.linkedScenes.map(sc => (
                  <div key={sc.id} className="p-1.5 rounded bg-black/30 font-mono text-[10px] text-foreground flex items-center justify-between">
                    <span>{sc.title}</span>
                    <span className="text-cinema-amber-400 font-bold">Attached</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <span className="text-muted-foreground font-medium block">Characters Appearing:</span>
                {relationships.linkedCharacters.map(c => (
                  <div key={c.id} className="p-1.5 rounded bg-black/30 font-mono text-[10px] text-foreground flex items-center justify-between">
                    <span>{c.name}</span>
                    <span className="text-emerald-400 font-bold">Tagged</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VERSIONS TAB */}
        {activeTab === 'versions' && (
          <div className="space-y-2 text-[11px]">
            <span className="text-muted-foreground font-mono text-[10px] uppercase font-bold block">Asset Version Tree</span>
            {(asset.versions || [
              {
                id: 'v-orig',
                name: `${asset.name} (Original)`,
                versionType: 'Original',
                thumbnailUrl: asset.thumbnailUrl,
                createdAt: asset.uploadDate,
                fileSize: asset.size,
                isCurrent: true
              }
            ]).map(ver => (
              <div
                key={ver.id}
                className={`p-2 rounded-lg border transition-all flex items-center justify-between ${
                  ver.isCurrent ? 'bg-cinema-amber-500/15 border-cinema-amber-500/40' : 'bg-muted/40 border-border'
                }`}
              >
                <div>
                  <div className="font-semibold text-foreground">{ver.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{ver.versionType} • {ver.fileSize}</div>
                </div>
                {ver.isCurrent ? (
                  <span className="px-1.5 py-0.5 rounded bg-cinema-amber-500 text-slate-950 font-bold font-mono text-[9px]">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      const updatedVersions = (asset.versions || []).map(v => ({ ...v, isCurrent: v.id === ver.id }));
                      onUpdateAsset({ ...asset, versions: updatedVersions });
                    }}
                    className="p-1 rounded text-cinema-amber-400 hover:bg-cinema-amber-500/20 font-mono text-[10px]"
                  >
                    Switch
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
