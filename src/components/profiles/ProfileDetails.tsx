/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Heart,
  Sparkles,
  Award,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Clock,
  PlayCircle,
  PlusCircle,
  ShieldAlert,
  ChevronRight,
  Edit,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { TabNavigation } from '../ui/TabNavigation';
import { useToast } from '../../context/ToastContext';
import { ExtendedLegacyProfile } from './mockData';

interface ProfileDetailsProps {
  profile: ExtendedLegacyProfile;
  onBack: () => void;
  onEdit: () => void;
}

export function ProfileDetails({ profile, onBack, onEdit }: ProfileDetailsProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'bio' | 'timeline' | 'media' | 'documents'>('bio');

  // Compute stats or years
  const birthYearNum = profile.dateOfBirth ? new Date(profile.dateOfBirth).getFullYear() : null;
  const deathYearNum = profile.dateOfDeath ? new Date(profile.dateOfDeath).getFullYear() : null;
  const lifespanLabel = deathYearNum 
    ? `${birthYearNum || 'N/A'} – ${deathYearNum}` 
    : birthYearNum 
    ? `Born ${birthYearNum} (Age ${new Date().getFullYear() - birthYearNum})` 
    : 'N/A';

  const handleSimulateAction = (actionTitle: string) => {
    showToast('info', `${actionTitle} Simulated`, 'This feature will be linked to Story Studio / Media Library in downstream sprints.');
  };

  return (
    <div id={`profile-details-${profile.id}`} className="space-y-6 animate-fade-in text-left pb-12">
      {/* Back to Library Navigation */}
      <div className="flex items-center justify-between">
        <Button
          id="btn-back-to-profiles"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4 text-foreground" />}
          onClick={onBack}
          className="text-xs border border-border"
        >
          Back to Legacy Profiles
        </Button>

        <div className="flex items-center gap-2">
          <Button
            id="btn-edit-profile-detail"
            variant="secondary"
            size="sm"
            leftIcon={<Edit className="w-4 h-4 text-foreground" />}
            onClick={onEdit}
            className="text-xs"
          >
            Edit Profile
          </Button>
          <Button
            id="btn-add-timeline-event"
            variant="primary"
            size="sm"
            onClick={() => handleSimulateAction('Add Chronology Event')}
            className="text-xs bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
          >
            Add Timeline Event
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="border border-border bg-card rounded-2xl overflow-hidden relative shadow-sm" id="details-hero-banner">
        {/* Cover Photo */}
        <div className="h-44 md:h-56 w-full relative">
          <img
            id="details-cover-img"
            src={profile.coverPhoto}
            alt={`${profile.preferredName} cover`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          {/* Quick Stats on Cover bottom right */}
          <div className="absolute bottom-4 right-6 hidden md:flex items-center gap-6" id="cover-stats-indicators">
            <div className="text-center">
              <span className="text-[10px] text-white/60 font-mono block uppercase">Timeline Events</span>
              <span className="text-lg font-bold text-cinema-amber-400">{profile.timelineEventsCount}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-white/60 font-mono block uppercase">Media Attachments</span>
              <span className="text-lg font-bold text-cinema-amber-400">{profile.mediaCount}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-white/60 font-mono block uppercase">Document Records</span>
              <span className="text-lg font-bold text-cinema-amber-400">{profile.documentCount}</span>
            </div>
          </div>
        </div>

        {/* Profile Avatar Overlay Box */}
        <div className="p-6 pt-0 relative flex flex-col md:flex-row items-start md:items-end gap-5 -mt-10 md:-mt-12" id="hero-avatar-text-block">
          {/* Profile Photo */}
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-card overflow-hidden shrink-0 bg-muted shadow-md">
            <img
              id="details-profile-img"
              src={profile.profilePhoto}
              alt={profile.preferredName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1.5 flex-grow">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display font-black text-2xl md:text-3xl text-foreground tracking-tight">
                {profile.preferredName}
              </h1>
              
              {/* Relationship Badge */}
              <span className="inline-flex items-center text-[10px] font-bold uppercase bg-cinema-amber-500/10 text-cinema-amber-700 dark:text-cinema-amber-400 border border-cinema-amber-500/30 px-2 py-0.5 rounded-full">
                {profile.relationship}
              </span>

              {/* Status Badge */}
              <span className={`inline-flex items-center text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                profile.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {profile.status}
              </span>
            </div>

            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground/60" /> {lifespanLabel}
              {profile.placeOfBirth && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" /> {profile.placeOfBirth}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: left side details/tabs, right side stats/insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="details-main-grid">
        {/* Left Columns: Tabs & Tab content */}
        <div className="lg:col-span-2 space-y-6" id="details-left-pane">
          {/* Tab Selection */}
          <TabNavigation
            id="details-tabs-bar"
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { value: 'bio', label: 'Biography' },
              { value: 'timeline', label: 'Chronology', count: profile.timelineEventsCount },
              { value: 'media', label: 'Media Gallery', count: profile.mediaCount },
              { value: 'documents', label: 'Documents', count: profile.documentCount },
            ]}
          />

          {/* TAB CONTENT PANEL */}
          <div className="bg-card border border-border rounded-2xl p-6 min-h-[300px]" id="details-tabs-panel">
            {activeTab === 'bio' && (
              <div className="space-y-6" id="tab-bio-content">
                {/* Biography Summary */}
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cinema-amber-500" /> Executive Summary
                  </h3>
                  <div className="text-xs text-muted-foreground leading-relaxed space-y-3 font-medium">
                    <p>{profile.biographySummary || 'No summary registered for this profile yet. Click "Edit Profile" to draft a biographical summary.'}</p>
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" /> Key Attributes & Facts
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" id="quick-facts-box">
                    <div className="p-3 bg-muted/40 rounded-xl border border-border">
                      <span className="text-[10px] text-muted-foreground font-mono block uppercase">Nickname / Alias</span>
                      <p className="font-semibold text-foreground mt-0.5">{profile.nickname || 'None registered'}</p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl border border-border">
                      <span className="text-[10px] text-muted-foreground font-mono block uppercase">Nationality</span>
                      <p className="font-semibold text-foreground mt-0.5">{profile.nationality || 'American'}</p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl border border-border">
                      <span className="text-[10px] text-muted-foreground font-mono block uppercase">Languages Spoken</span>
                      <p className="font-semibold text-foreground mt-0.5">
                        {profile.languages && profile.languages.length > 0 ? profile.languages.join(', ') : 'English'}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl border border-border">
                      <span className="text-[10px] text-muted-foreground font-mono block uppercase">Category Blueprint</span>
                      <p className="font-semibold text-foreground mt-0.5 capitalize">{profile.category.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {profile.tags && profile.tags.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground font-mono block uppercase">Profile Tags</span>
                    <div className="flex flex-wrap gap-1.5" id="details-tags-list">
                      {profile.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-muted border border-border px-2.5 py-0.5 rounded-full text-foreground/80">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6" id="tab-timeline-content">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                    Milestones & Life Events
                  </h3>
                  <Button
                    id="btn-inline-add-timeline"
                    variant="ghost"
                    size="sm"
                    leftIcon={<PlusCircle className="w-4 h-4 text-muted-foreground" />}
                    onClick={() => handleSimulateAction('Add Historical Event')}
                    className="text-[11px] font-bold border border-border px-2.5"
                  >
                    Add Milestone
                  </Button>
                </div>

                {profile.timelinePreviews && profile.timelinePreviews.length > 0 ? (
                  <div className="relative border-l border-border pl-5 ml-2.5 space-y-6 pt-2" id="details-timeline-rail">
                    {profile.timelinePreviews.map((evt, idx) => (
                      <div key={evt.id} className="relative" id={`timeline-event-preview-${evt.id}`}>
                        {/* Circle Bullet */}
                        <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-cinema-amber-500 border-2 border-card ring-2 ring-cinema-amber-500/20" />
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                              {evt.year}
                            </span>
                            {evt.category && (
                              <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase">
                                {evt.category}
                              </span>
                            )}
                          </div>
                          <h4 className="font-display font-bold text-xs text-foreground mt-1">
                            {evt.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {evt.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3" id="timeline-empty-pane">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">No Milestones Added Yet</p>
                      <p className="text-[10px] text-muted-foreground">Draft major accomplishments, marriages, and events.</p>
                    </div>
                    <Button id="btn-empty-timeline-add" onClick={() => handleSimulateAction('Create Milestone')} variant="secondary" size="sm" className="text-[10px]">
                      Add First Milestone
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6" id="tab-media-content">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                    Historic Clippings, Photos & Audio
                  </h3>
                  <Button
                    id="btn-inline-upload-media"
                    variant="ghost"
                    size="sm"
                    leftIcon={<PlusCircle className="w-4 h-4 text-muted-foreground" />}
                    onClick={() => handleSimulateAction('Attach Media Files')}
                    className="text-[11px] font-bold border border-border px-2.5"
                  >
                    Attach Media
                  </Button>
                </div>

                {profile.mediaPreviews && profile.mediaPreviews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="details-media-grid">
                    {profile.mediaPreviews.map((m) => (
                      <div key={m.id} className="p-3 border border-border rounded-xl bg-muted/30 space-y-2 flex flex-col justify-between" id={`media-preview-card-${m.id}`}>
                        {m.type === 'image' ? (
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted relative border border-border">
                            <img src={m.url} className="w-full h-full object-cover" alt={m.title} referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-lg bg-sidebar/60 border border-border flex flex-col items-center justify-center p-3 text-center space-y-1">
                            <PlayCircle className="w-8 h-8 text-indigo-500" />
                            <span className="text-[9px] font-mono text-muted-foreground uppercase">{m.type} Attachment</span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-foreground truncate">{m.title}</h4>
                          <span className="text-[9px] font-mono text-muted-foreground block mt-0.5">{m.size || '3.4 MB'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3" id="media-empty-pane">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Media Box is Empty</p>
                      <p className="text-[10px] text-muted-foreground">Upload and catalogue historical photos and clippings.</p>
                    </div>
                    <Button id="btn-empty-media-upload" onClick={() => handleSimulateAction('Upload Media')} variant="secondary" size="sm" className="text-[10px]">
                      Upload Photos
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6" id="tab-documents-content">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                    Certificates & Scans Archives
                  </h3>
                  <Button
                    id="btn-inline-upload-docs"
                    variant="ghost"
                    size="sm"
                    leftIcon={<PlusCircle className="w-4 h-4 text-muted-foreground" />}
                    onClick={() => handleSimulateAction('Attach Documents')}
                    className="text-[11px] font-bold border border-border px-2.5"
                  >
                    Attach Document
                  </Button>
                </div>

                {profile.documentsPreviews && profile.documentsPreviews.length > 0 ? (
                  <div className="space-y-2" id="details-documents-list">
                    {profile.documentsPreviews.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-3 border border-border bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors" id={`doc-preview-row-${d.id}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{d.title}</h4>
                            <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground mt-0.5">
                              <span>{d.type}</span>
                              <span>•</span>
                              <span>{d.size}</span>
                            </div>
                          </div>
                        </div>

                        <Button id={`btn-open-doc-${d.id}`} onClick={() => handleSimulateAction(`Open ${d.title}`)} variant="ghost" size="sm" className="p-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3" id="docs-empty-pane">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">No Document Scans</p>
                      <p className="text-[10px] text-muted-foreground">Attach marriage licenses, census records, or passports.</p>
                    </div>
                    <Button id="btn-empty-docs-upload" onClick={() => handleSimulateAction('Upload Document')} variant="secondary" size="sm" className="text-[10px]">
                      Attach First Scan
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Insights, Progress, and Family nodes */}
        <div className="space-y-6" id="details-right-pane">
          {/* Progress Tracker Card */}
          <div className="p-5 border border-border bg-card rounded-2xl space-y-4" id="details-progress-card">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground block uppercase">Story Completion Progress</span>
              <div className="flex items-end justify-between mt-1">
                <span className="font-display font-black text-2xl text-foreground">{profile.storyProgress}%</span>
                <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                  Drafting Bio
                </span>
              </div>
            </div>

            {/* Simulated bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-cinema-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${profile.storyProgress}%` }}
              />
            </div>

            <div className="text-[10px] text-muted-foreground leading-relaxed">
              Add more media files or write timeline chapters to advance this legacy profile into a fully structured biography.
            </div>
          </div>

          {/* Family Connections Nodes */}
          <div className="p-5 border border-border bg-card rounded-2xl space-y-4" id="details-family-connections-card">
            <h3 className="font-display font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-400" /> Family Node Links
            </h3>

            <div className="space-y-2.5" id="family-members-list">
              {profile.spouse && (
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/30 border border-border" id="family-member-spouse">
                  <div>
                    <span className="text-[9px] text-muted-foreground block uppercase">Spouse / Partner</span>
                    <span className="font-semibold text-foreground">{profile.spouse}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Linked</span>
                </div>
              )}

              {profile.parents && profile.parents.map((parent, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/30 border border-border" id={`family-member-parent-${idx}`}>
                  <div>
                    <span className="text-[9px] text-muted-foreground block uppercase">Parent</span>
                    <span className="font-semibold text-foreground">{parent}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Linked</span>
                </div>
              ))}

              {profile.children && profile.children.map((child, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/30 border border-border" id={`family-member-child-${idx}`}>
                  <div>
                    <span className="text-[9px] text-muted-foreground block uppercase">Child</span>
                    <span className="font-semibold text-foreground">{child}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Linked</span>
                </div>
              ))}
            </div>

            <Button
              id="btn-link-family-profile"
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-muted-foreground" />}
              onClick={() => handleSimulateAction('Link Family Member Profile')}
              className="w-full text-[11px] font-bold border border-border"
            >
              Link Family Node
            </Button>
          </div>

          {/* AI Narration Suggestions Placeholders */}
          <div className="p-5 border border-border bg-cinema-amber-500/5 rounded-2xl space-y-4" id="details-ai-suggestions-card">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xs text-cinema-amber-800 dark:text-cinema-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cinema-amber-500 animate-pulse" /> AI Director Prompts
              </h3>
              <span className="text-[9px] font-bold font-mono text-cinema-amber-700 bg-cinema-amber-500/10 px-1.5 py-0.5 rounded">
                Omni Flash
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Our AI Director can analyze Elizabeth's background to suggest cinematic narration beats.
            </p>

            <div className="space-y-2" id="ai-suggestion-prompts-stack">
              <button
                id="btn-ai-prompt-1"
                onClick={() => handleSimulateAction('Analyze teaching milestones')}
                className="w-full text-left p-3 rounded-xl bg-card border border-border hover:border-cinema-amber-500/50 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center gap-1 text-[9px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold font-mono uppercase">
                  <span>Literature Chapter</span>
                </div>
                <p className="font-semibold text-foreground">"Fictionalizing the classroom drama in Wellesley..."</p>
              </button>
              <button
                id="btn-ai-prompt-2"
                onClick={() => handleSimulateAction('Analyze watercolor influences')}
                className="w-full text-left p-3 rounded-xl bg-card border border-border hover:border-cinema-amber-500/50 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center gap-1 text-[9px] text-cinema-amber-600 dark:text-cinema-amber-400 font-bold font-mono uppercase">
                  <span>Creative Spotlight</span>
                </div>
                <p className="font-semibold text-foreground">"Pairing her 1988 watercolor coastal exhibition..."</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
