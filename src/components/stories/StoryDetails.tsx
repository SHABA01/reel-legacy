/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Sparkles,
  Users,
  Film,
  Plus,
  ChevronRight,
  MoreVertical,
  BookOpen,
  Image as ImageIcon,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  Tag,
  CheckCircle,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ExtendedStory } from './mockStoriesData';

interface StoryDetailsProps {
  story: ExtendedStory;
  onBack: () => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onSimulateEdit: (title: string) => void;
}

export function StoryDetails({
  story,
  onBack,
  onDuplicate,
  onArchive,
  onDelete,
  onSimulateEdit
}: StoryDetailsProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'timeline' | 'media' | 'history'>('chapters');

  // Format dates nicely
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div id={`story-details-view-${story.id}`} className="space-y-6 animate-fade-in" style={{ contentVisibility: 'auto' }}>
      
      {/* Back button & Action Row */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4" id="details-action-header-row">
        <Button
          id="btn-details-back"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4 text-foreground" />}
          onClick={onBack}
          className="text-xs border border-border"
        >
          Back to Library
        </Button>

        <div className="flex items-center gap-2" id="details-actions-btn-group">
          <Button
            id={`btn-details-duplicate-${story.id}`}
            variant="ghost"
            size="sm"
            leftIcon={<Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            onClick={() => onDuplicate(story.id)}
            className="text-xs border border-border"
          >
            Duplicate
          </Button>
          <Button
            id={`btn-details-archive-${story.id}`}
            variant="ghost"
            size="sm"
            leftIcon={<Archive className="w-3.5 h-3.5 text-muted-foreground" />}
            onClick={() => onArchive(story.id)}
            className="text-xs border border-border"
          >
            Archive
          </Button>
          <Button
            id={`btn-details-delete-${story.id}`}
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
            onClick={() => onDelete(story.id)}
            className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-border"
          >
            Delete
          </Button>

          <Button
            id={`btn-details-open-studio-${story.id}`}
            variant="accent"
            size="sm"
            rightIcon={<ExternalLink className="w-3.5 h-3.5 text-slate-950" />}
            onClick={() => onSimulateEdit(story.title)}
            className="text-xs"
          >
            Open in Story Studio
          </Button>
        </div>
      </div>

      {/* Main Story Hero Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-md h-72 flex flex-col justify-end" id="story-details-banner-card">
        {/* Banner image with dark overlay */}
        <div className="absolute inset-0">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover grayscale-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
        </div>

        {/* Content overlapping banner */}
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10" id="story-banner-content-body">
          <div className="space-y-2.5 max-w-2xl">
            {/* Category / Type Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-[10px] font-bold font-mono uppercase bg-cinema-amber-500 text-slate-950 px-2.5 py-0.5 rounded">
                {story.category}
              </span>
              <span className={`inline-flex items-center text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${
                story.status === 'Published'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                  : story.status === 'Ready for AI'
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
              }`}>
                {story.status}
              </span>
            </div>

            <h1 className="font-display font-black text-xl md:text-3xl tracking-tight text-white leading-tight">
              {story.title}
            </h1>
            <p className="text-sm text-slate-200 font-semibold tracking-wide">
              {story.subtitle}
            </p>
          </div>

          {/* Core production indicators */}
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded-xl backdrop-blur-sm shrink-0" id="story-production-meta-overlay">
            <div className="text-center">
              <span className="text-[9px] text-slate-400 font-mono block uppercase">Progress</span>
              <strong className="text-base font-black text-cinema-amber-500 font-mono">{story.completionProgress}%</strong>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[9px] text-slate-400 font-mono block uppercase">Est. Runtime</span>
              <strong className="text-sm font-black text-white font-mono">{story.durationEstimate}</strong>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[9px] text-slate-400 font-mono block uppercase">Ready for AI</span>
              <span className={`text-[10px] font-bold block ${story.aiReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                {story.aiReady ? 'YES' : 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="story-details-columns-root">
        {/* Left Column: Story Structure, chapters, previews */}
        <div className="lg:col-span-2 space-y-6" id="story-details-left-column">
          {/* Story description & Summary block */}
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4" id="details-narrative-summary">
            <h3 className="font-display text-sm font-black text-foreground uppercase tracking-wider">
              Narrative Production Summary
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {story.description}
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              {story.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Subview Tabs navigation (Chapters, Timeline, Media, Audit log) */}
          <div className="border-b border-border flex items-center gap-6" id="details-tabs-bar">
            <button
              id="tab-chapters-trigger"
              onClick={() => setActiveTab('chapters')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'chapters'
                  ? 'border-cinema-amber-500 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Narrative Chapters ({story.chapters?.length || 0})
            </button>
            <button
              id="tab-timeline-trigger"
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-cinema-amber-500 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Timeline Chronology ({story.timelineEvents?.length || 0})
            </button>
            <button
              id="tab-media-trigger"
              onClick={() => setActiveTab('media')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'border-cinema-amber-500 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Vault Assets Preview ({story.mediaCount})
            </button>
            <button
              id="tab-history-trigger"
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'border-cinema-amber-500 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              History Log
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-48" id="active-tab-panel-container">
            {activeTab === 'chapters' && (
              <div className="space-y-4" id="chapters-tab-panel">
                {story.chapters && story.chapters.length > 0 ? (
                  story.chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      id={`chapter-preview-row-${ch.id}`}
                      className="p-4 bg-card border border-border rounded-xl flex items-start gap-4 hover:border-cinema-amber-500/20 transition-all shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                        {idx + 1}
                      </div>

                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-xs font-bold text-foreground">
                            {ch.title}
                          </h4>
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {ch.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {ch.summary}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground pt-1">
                          <ImageIcon className="w-3 h-3 text-muted-foreground/60" />
                          <span>{ch.mediaCount} linked assets</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 border border-dashed border-border rounded-2xl text-center space-y-3" id="empty-chapters-state">
                    <p className="text-xs text-muted-foreground font-semibold">
                      No chapters defined for this story draft. Open in Story Studio to generate outline.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4 relative pl-4 border-l border-border ml-2" id="timeline-tab-panel">
                {story.timelineEvents && story.timelineEvents.length > 0 ? (
                  story.timelineEvents.map((ev) => (
                    <div
                      key={ev.id}
                      id={`timeline-preview-item-${ev.id}`}
                      className="relative space-y-1"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cinema-amber-500 border-2 border-card" />

                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs font-black text-cinema-amber-600 dark:text-cinema-amber-400">
                          {ev.year}
                        </span>
                        <h4 className="text-xs font-bold text-foreground">
                          {ev.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-1.5 font-medium">
                        {ev.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 border border-dashed border-border rounded-2xl text-center space-y-3" id="empty-timeline-state">
                    <p className="text-xs text-muted-foreground font-semibold">
                      No matching timeline chronology associated with this draft story.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="media-tab-panel">
                {story.mediaPreviews && story.mediaPreviews.length > 0 ? (
                  story.mediaPreviews.map((m) => (
                    <div
                      key={m.id}
                      id={`media-preview-item-${m.id}`}
                      className="group border border-border bg-card rounded-xl overflow-hidden relative h-32 flex flex-col justify-end shadow-sm"
                    >
                      {m.type === 'image' ? (
                        <img
                          src={m.url}
                          alt={m.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                          <Film className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      
                      <div className="relative p-2 z-10">
                        <span className="text-[9px] font-mono text-slate-300 line-clamp-1">
                          {m.title}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 border border-dashed border-border rounded-2xl text-center space-y-3" id="empty-media-state">
                    <p className="text-xs text-muted-foreground font-semibold">
                      This stage displays a preview of linked media from the workspace. Open Story Studio to attach further documents.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4" id="history-tab-panel">
                {story.recentActivity && story.recentActivity.length > 0 ? (
                  story.recentActivity.map((act) => (
                    <div
                      key={act.id}
                      id={`audit-log-row-${act.id}`}
                      className="p-3 bg-muted/40 border border-border rounded-xl flex items-center justify-between text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-foreground text-xs font-bold leading-none">
                            {act.action}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            By {act.user}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                        {formatDate(act.date)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-12 border border-dashed border-border rounded-2xl text-center space-y-3" id="empty-history-state">
                    <p className="text-xs text-muted-foreground font-semibold">
                      No activity logged on this story project.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar metadata panel */}
        <div className="space-y-6" id="story-details-right-column">
          {/* Associated Profile Card */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4" id="associated-profile-block">
            <h3 className="font-display text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Linked Family Member
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={story.associatedProfilePhoto}
                alt={story.associatedProfileName}
                className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-black text-foreground">
                  {story.associatedProfileName}
                </h4>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  Relationship: {story.associatedProfileRelationship}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              This story utilizes personal timelines, archival memories, and files uploaded to {story.associatedProfileName}’s Legacy Profile.
            </p>
          </div>

          {/* AI script generation readiness checklist */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-4" id="ai-insights-block">
            <h3 className="font-display text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              AI Script Preparation Insights
            </h3>

            {story.aiInsights && story.aiInsights.length > 0 ? (
              <div className="space-y-3" id="insights-bullet-list">
                {story.aiInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold leading-relaxed" id={`insight-item-${idx}`}>
                    <Sparkles className="w-4 h-4 text-cinema-amber-500 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground font-medium">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                No AI insights generated yet. The AI Engine analyzes outline structures once stories are marked Ready for AI.
              </p>
            )}
          </div>

          {/* Detailed Story Metadata card */}
          <div className="p-5 bg-card border border-border rounded-2xl shadow-sm space-y-3" id="story-metadata-card">
            <h3 className="font-display text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Production Metadata
            </h3>

            <div className="flex items-center justify-between text-xs font-semibold border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Project ID</span>
              <span className="font-mono text-[10px] text-foreground">{story.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Media Assets</span>
              <span className="font-mono text-xs text-foreground">{story.mediaCount} files</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Timeline Milestones</span>
              <span className="font-mono text-xs text-foreground">{story.timelineEventCount} events</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Last Edited</span>
              <span className="text-xs text-foreground font-semibold">{formatDate(story.lastEdited)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Last Compilation</span>
              <span className="text-xs text-foreground font-semibold">
                {story.lastGenerated ? formatDate(story.lastGenerated) : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
