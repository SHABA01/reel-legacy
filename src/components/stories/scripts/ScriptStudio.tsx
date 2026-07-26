/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateStoryReadiness } from '../../../utils/storyReadiness';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Sparkles,
  Wand2,
  Calendar,
  Users,
  Film,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  BarChart3,
  History,
  RotateCcw,
  Sliders,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Play,
  Volume2,
  Image as ImageIcon,
  Zap,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Maximize2,
  Minimize2,
  ListFilter,
  Check,
  RefreshCw,
  Search,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Heart
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useToast } from '../../../context/ToastContext';
import { ExtendedStory } from '../mockStoriesData';
import { StoryScene } from '../ScenesWorkspace';
import { StoryCharacter } from '../CharactersWorkspace';

export interface ScriptBlock {
  id: string;
  type: 'scene_header' | 'action' | 'character' | 'dialogue' | 'narration' | 'parenthetical' | 'transition';
  content: string;
  actId: string;
  sceneId?: string;
  speakerId?: string;
  emotionalTone?: 'Nostalgic' | 'Triumphant' | 'Reflective' | 'Somber' | 'Joyful' | 'Solemn';
  notes?: string;
  aiSuggested?: boolean;
}

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  label: string;
  timestamp: string;
  author: 'AI Story Architect' | 'User';
  summary: string;
  blocks: ScriptBlock[];
}

export interface ScriptStudioProps {
  story: ExtendedStory;
  scenes: StoryScene[];
  characters: StoryCharacter[];
  timelineEvents: any[];
  mediaItems: any[];
  onOpenScene?: (sceneId: string) => void;
  onUpdateScript?: (blocks: ScriptBlock[]) => void;
}

export function ScriptStudio({
  story,
  scenes,
  characters,
  timelineEvents,
  mediaItems,
  onOpenScene,
  onUpdateScript,
}: ScriptStudioProps) {
  const { showToast } = useToast();

  // Active Sub-Tab: 'editor' | 'architect' | 'analyzer' | 'versions'
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'architect' | 'analyzer' | 'versions'>('editor');

  // Initial screenplay blocks initialized from story timeline and characters
  const [blocks, setBlocks] = useState<ScriptBlock[]>(() => [
    {
      id: 'blk-1',
      type: 'scene_header',
      actId: 'act-1',
      sceneId: scenes[0]?.id || 'sc-1',
      content: 'EXT. PORTLAND COASTLINE - MAINE - DAY (1944)',
    },
    {
      id: 'blk-2',
      type: 'narration',
      actId: 'act-1',
      sceneId: scenes[0]?.id || 'sc-1',
      emotionalTone: 'Nostalgic',
      content:
        'The salt air of Casco Bay defined Elizabeth Vance’s early childhood. Born into an era of world turmoil, her home was filled with watercolor canvases, classical records, and open books.',
    },
    {
      id: 'blk-3',
      type: 'action',
      actId: 'act-1',
      sceneId: scenes[0]?.id || 'sc-1',
      content:
        'Archival photograph fades in: A young girl in a yellow woolen coat standing near the rocky shore, holding a leather sketchbook.',
    },
    {
      id: 'blk-4',
      type: 'scene_header',
      actId: 'act-2',
      sceneId: scenes[1]?.id || 'sc-2',
      content: 'INT. MOUNT HOLYOKE COLLEGE - LIBRARY - EVENING (1965)',
    },
    {
      id: 'blk-5',
      type: 'narration',
      actId: 'act-2',
      sceneId: scenes[1]?.id || 'sc-2',
      emotionalTone: 'Reflective',
      content:
        'College wasn’t merely a degree—it was where her passion for literacy crystallized into a lifelong mission.',
    },
    {
      id: 'blk-6',
      type: 'character',
      actId: 'act-2',
      sceneId: scenes[1]?.id || 'sc-2',
      content: 'ELIZABETH VANCE (VOICEOVER)',
    },
    {
      id: 'blk-7',
      type: 'dialogue',
      actId: 'act-2',
      sceneId: scenes[1]?.id || 'sc-2',
      emotionalTone: 'Inspirational',
      content:
        '“If you teach one person to read, you don’t just open a book for them—you hand them the key to their own voice.”',
    },
    {
      id: 'blk-8',
      type: 'scene_header',
      actId: 'act-3',
      sceneId: scenes[2]?.id || 'sc-3',
      content: 'INT. SALEM LITERACY CENTER - AFTERNOON (1974)',
    },
    {
      id: 'blk-9',
      type: 'narration',
      actId: 'act-3',
      sceneId: scenes[2]?.id || 'sc-3',
      emotionalTone: 'Triumphant',
      content:
        'In 1974, with two volunteers and a rented basement on Essex Street, Elizabeth founded the Salem Literacy Center.',
    },
  ]);

  // Version History state
  const [versions, setVersions] = useState<ScriptVersion[]>([
    {
      id: 'v-1',
      versionNumber: 1,
      label: 'Initial Timeline Blueprint',
      timestamp: 'Today at 09:15 AM',
      author: 'AI Story Architect',
      summary: 'Generated 3-act narrative script from 5 chronological milestones.',
      blocks: blocks,
    },
  ]);
  const [selectedCompareVersion, setSelectedCompareVersion] = useState<ScriptVersion | null>(null);

  // Selected block for floating AI rewrite
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(blocks[1].id);
  const selectedBlock = useMemo(() => blocks.find((b) => b.id === selectedBlockId), [blocks, selectedBlockId]);

  // Expanded Acts in Narrative Structure Tree
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({
    'act-1': true,
    'act-2': true,
    'act-3': true,
  });

  // Calculate Story Readiness metrics
  const readinessMetrics = useMemo(() => {
    const narrationCount = blocks.filter((b) => b.type === 'narration' || b.type === 'dialogue').length;
    return calculateStoryReadiness({
      timelineEventsCount: timelineEvents.length,
      charactersCount: characters.length,
      scenesCount: scenes.length,
      mediaItemsCount: mediaItems.length,
      narrationBlocksCount: narrationCount,
    });
  }, [timelineEvents.length, characters.length, scenes.length, mediaItems.length, blocks]);

  // AI Rewrite Handler for selected paragraph
  const handleAIRewrite = (preset: string) => {
    if (!selectedBlockId) return;

    let modifiedText = selectedBlock?.content || '';
    if (preset === 'Rewrite') {
      modifiedText = `${modifiedText} (Refined for natural pacing and documentary warmth.)`;
    } else if (preset === 'Expand') {
      modifiedText = `${modifiedText} She remembered the scent of rain on dry pine needles and the distant foghorn of Portland Head Light echoing across the bay.`;
    } else if (preset === 'Condense') {
      modifiedText = modifiedText.split('.')[0] + '.';
    } else if (preset === 'More Emotional') {
      modifiedText = `With profound tenderness, ${modifiedText.toLowerCase()}`;
    } else if (preset === 'More Cinematic') {
      modifiedText = `CAMERA SLOW PAN: ${modifiedText}`;
    } else if (preset === 'More Historical') {
      modifiedText = `${modifiedText} Set against the economic revival of post-war New England in 1944.`;
    }

    setBlocks((prev) =>
      prev.map((b) => (b.id === selectedBlockId ? { ...b, content: modifiedText, aiSuggested: true } : b))
    );
    showToast('success', 'AI Paragraph Applied', `Applied "${preset}" transformation to selected block.`);
  };

  // AI Architect Generation Trigger
  const handleGenerateArchitectType = (typeLabel: string) => {
    const newBlock: ScriptBlock = {
      id: `blk-${Date.now()}`,
      type: 'narration',
      actId: 'act-2',
      emotionalTone: 'Reflective',
      content: `[AI ${typeLabel}]: Generated narrative beat emphasizing character resilience, family unity, and long-term legacy impact.`,
      aiSuggested: true,
    };
    setBlocks((prev) => [...prev, newBlock]);

    // Save as new version
    const newVersion: ScriptVersion = {
      id: `v-${versions.length + 1}`,
      versionNumber: versions.length + 1,
      label: `Added ${typeLabel}`,
      timestamp: 'Just now',
      author: 'AI Story Architect',
      summary: `Independent generation of ${typeLabel} added to narrative tree.`,
      blocks: [...blocks, newBlock],
    };
    setVersions((prev) => [newVersion, ...prev]);

    showToast('success', `${typeLabel} Generated`, `Added new ${typeLabel.toLowerCase()} segment into screenplay draft.`);
  };

  return (
    <div className="space-y-6 w-full" id="script-studio-root">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-cinema-amber-500/15 text-cinema-amber-400 px-2.5 py-0.5 rounded border border-cinema-amber-500/30 uppercase tracking-wider">
              NARRATIVE INTELLIGENCE CENTER
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {blocks.length} Script Blocks • {versions.length} Version(s)
            </span>
          </div>
          <h3 className="font-display text-lg font-black text-foreground uppercase tracking-wider mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cinema-amber-500" /> AI Screenplay & Narrative Architect
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Transform chronological milestones, family oral history notes, and character profiles into an Oscar-worthy documentary screenplay.
          </p>
        </div>

        {/* SUB-TAB NAVIGATOR */}
        <div className="flex items-center gap-1 bg-card/80 border border-border p-1 rounded-xl">
          {[
            { id: 'editor', label: 'Screenplay Studio', icon: Edit3 },
            { id: 'architect', label: 'AI Architect', icon: Wand2 },
            { id: 'analyzer', label: 'Quality Analyzer', icon: ShieldCheck },
            { id: 'versions', label: 'Version History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cinema-amber-500 text-slate-950 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STORY READINESS DASHBOARD */}
      <div className="p-4 bg-card/60 border border-border/90 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cinema-amber-500" />
            <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
              Documentary Readiness Index
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-cinema-amber-400 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
            {readinessMetrics.overall}% Production Ready
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Timeline Events', percent: readinessMetrics.timelinePercent, color: 'bg-emerald-500' },
            { label: 'Cast Profiles', percent: readinessMetrics.characterPercent, color: 'bg-amber-500' },
            { label: 'Scene Outlines', percent: readinessMetrics.scenesPercent, color: 'bg-cinema-amber-500' },
            { label: 'Media Assets', percent: readinessMetrics.mediaPercent, color: 'bg-cyan-500' },
            { label: 'Narration Cues', percent: readinessMetrics.narrationPercent, color: 'bg-purple-500' },
          ].map((m, i) => (
            <div key={i} className="p-2.5 bg-background/60 border border-border/60 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">{m.label}</span>
                <span className="font-mono font-bold text-foreground">{m.percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${m.color} transition-all duration-500`} style={{ width: `${m.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: SCREENPLAY STUDIO & AI REWRITE */}
      {activeSubTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: NARRATIVE STRUCTURE TREE */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cinema-amber-500" /> Narrative Structure
              </h4>
              <Button
                variant="ghost"
                size="xs"
                leftIcon={<Plus className="w-3 h-3" />}
                onClick={() => showToast('info', 'New Act Added', 'Added Act IV: Legacy & Reflection.')}
              >
                Add Act
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { id: 'act-1', title: 'Act I: Origins & Childhood (1944–1960)', scenesCount: 2, tone: 'Nostalgic' },
                { id: 'act-2', title: 'Act II: Education & Calling (1961–1973)', scenesCount: 2, tone: 'Reflective' },
                { id: 'act-3', title: 'Act III: Salem Literacy Center (1974–2010)', scenesCount: 3, tone: 'Triumphant' },
              ].map((act) => {
                const isExpanded = expandedActs[act.id];
                const actBlocks = blocks.filter((b) => b.actId === act.id);

                return (
                  <div key={act.id} className="border border-border/70 rounded-xl overflow-hidden bg-background/50">
                    <button
                      onClick={() => setExpandedActs((prev) => ({ ...prev, [act.id]: !prev[act.id] }))}
                      className="w-full p-3 flex items-center justify-between bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 cursor-grab" />
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-cinema-amber-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-display text-xs font-bold text-foreground">{act.title}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-cinema-amber-500/10 text-cinema-amber-400 px-2 py-0.5 rounded border border-cinema-amber-500/20">
                        {actBlocks.length} Blocks
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="p-2 space-y-1.5 border-t border-border/50">
                        {actBlocks.map((blk) => (
                          <div
                            key={blk.id}
                            onClick={() => setSelectedBlockId(blk.id)}
                            className={`p-2 rounded-lg text-xs transition-all cursor-pointer border flex items-center justify-between ${
                              selectedBlockId === blk.id
                                ? 'bg-cinema-amber-500/15 border-cinema-amber-500/40 text-foreground font-medium'
                                : 'bg-card/40 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-mono text-[10px] text-cinema-amber-500 uppercase mr-1">
                                [{blk.type}]
                              </span>
                              <span>{blk.content}</span>
                            </div>
                            {blk.aiSuggested && <Sparkles className="w-3 h-3 text-cinema-amber-500 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* SMART SCENE CARDS PREVIEW */}
            <div className="border-t border-border pt-3 space-y-2">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                Linked Scene Outlines ({scenes.length})
              </span>
              {scenes.map((sc) => (
                <div
                  key={sc.id}
                  className="p-2.5 bg-card border border-border rounded-xl space-y-1.5 hover:border-cinema-amber-500/50 transition-all cursor-pointer"
                  onClick={() => onOpenScene?.(sc.id)}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">
                      Scene #{sc.sceneNumber}: {sc.title}
                    </span>
                    <span className="text-[10px] font-mono text-cinema-amber-400 font-bold">{sc.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="bg-muted px-1.5 py-0.5 rounded">{sc.storySegment}</span>
                    <span>• {sc.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SCREENPLAY EDITOR & FLOATING AI REWRITE TOOLBAR */}
          <div className="lg:col-span-8 space-y-4">
            {/* FLOATING AI REWRITE TOOLBAR */}
            {selectedBlock && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-card border-2 border-cinema-amber-500/40 rounded-2xl shadow-xl space-y-2 bg-gradient-to-r from-cinema-amber-500/5 to-transparent"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cinema-amber-500 animate-pulse" />
                    <span className="font-bold text-foreground uppercase tracking-wider">
                      AI Writing Assistant Active
                    </span>
                    <span className="text-[10px] font-mono bg-cinema-amber-500/20 text-cinema-amber-400 px-2 py-0.5 rounded border border-cinema-amber-500/30">
                      Block ID: {selectedBlock.id}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Click transform preset to edit block</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    'Rewrite',
                    'Expand',
                    'Condense',
                    'More Emotional',
                    'More Cinematic',
                    'More Historical',
                    'More Inspirational',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAIRewrite(preset)}
                      className="px-2.5 py-1 bg-background hover:bg-cinema-amber-500 hover:text-slate-950 text-foreground border border-border hover:border-cinema-amber-500 text-[11px] font-bold rounded-lg transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SCREENPLAY CANVAS */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px] shadow-inner font-mono text-sm space-y-4 leading-relaxed">
              {blocks.map((blk) => (
                <div
                  key={blk.id}
                  onClick={() => setSelectedBlockId(blk.id)}
                  className={`p-3 rounded-xl transition-all cursor-pointer relative group ${
                    selectedBlockId === blk.id
                      ? 'bg-cinema-amber-500/10 border-l-4 border-cinema-amber-500 pl-4 text-foreground'
                      : 'hover:bg-muted/30 text-foreground/90'
                  }`}
                >
                  {blk.type === 'scene_header' && (
                    <div className="font-black text-cinema-amber-400 uppercase tracking-widest text-sm pb-1">
                      {blk.content}
                    </div>
                  )}

                  {blk.type === 'narration' && (
                    <div className="pl-4 border-l-2 border-indigo-500/40 text-foreground italic">
                      <span className="not-italic text-[10px] uppercase font-bold text-indigo-400 block mb-0.5">
                        [NARRATOR VOICEOVER • {blk.emotionalTone || 'Warm'}]
                      </span>
                      “{blk.content}”
                    </div>
                  )}

                  {blk.type === 'action' && (
                    <div className="text-muted-foreground text-xs leading-normal">{blk.content}</div>
                  )}

                  {blk.type === 'character' && (
                    <div className="text-center font-bold text-amber-400 uppercase tracking-wider text-xs pt-2">
                      {blk.content}
                    </div>
                  )}

                  {blk.type === 'dialogue' && (
                    <div className="max-w-md mx-auto text-center text-foreground italic text-xs">
                      “{blk.content}”
                    </div>
                  )}

                  {blk.aiSuggested && (
                    <span className="absolute top-2 right-2 text-[9px] font-sans font-bold bg-cinema-amber-500/20 text-cinema-amber-400 px-1.5 py-0.5 rounded border border-cinema-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Draft
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI STORY ARCHITECT */}
      {activeSubTab === 'architect' && (
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-cinema-amber-500" /> Modular AI Generation Matrix
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generate specialized narrative elements independently without overwriting existing screenplay text.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { title: 'Full Screenplay', badge: '3-Act', desc: 'Complete 3-act narrative with dialogue and voiceover cues.' },
                { title: 'Documentary Voice Narration', badge: 'Audio Cues', desc: 'Warm, resonant narrator scripts mapped to photo reveals.' },
                { title: 'Family Interview Questions', badge: 'Q&A Guide', desc: 'Thoughtful prompt questions tailored for living relatives.' },
                { title: 'Scene Summaries', badge: 'Director Notes', desc: 'Concise scene objectives and visual storytelling beats.' },
                { title: 'Chapter Outlines', badge: 'eBook & Film', desc: 'Structural summaries for book publication and video chapters.' },
                { title: 'Emotional Beats', badge: 'Pacing', desc: 'Emotional arc milestones and dramatic climax descriptions.' },
                { title: 'B-Roll Suggestions', badge: 'Visual Archive', desc: 'Recommended archival photos, news clips, and historical assets.' },
                { title: 'Transition Narration', badge: 'Flow', desc: 'Smooth bridge sentences connecting major life decades.' },
                { title: 'Flashback Sequences', badge: 'Cinematic', desc: 'Nostalgic memory sequences with ambient soundscapes.' },
                { title: 'Epilogue & Closing Tribute', badge: 'Tribute', desc: 'Heartfelt legacy conclusion celebrating lifetime impact.' },
                { title: 'Documentary Teaser Trailer', badge: '60s Short', desc: 'High-energy, emotional trailer script for family sharing.' },
                { title: 'Memorial Speech Draft', badge: 'Address', desc: 'Respectful, beautiful tribute presentation for family gatherings.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-background border border-border/80 rounded-xl space-y-3 hover:border-cinema-amber-500/60 transition-all cursor-pointer group"
                  onClick={() => handleGenerateArchitectType(item.title)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold bg-cinema-amber-500/10 text-cinema-amber-400 px-2 py-0.5 rounded border border-cinema-amber-500/20 uppercase">
                      {item.badge}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cinema-amber-500 transition-colors" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-foreground group-hover:text-cinema-amber-500 transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                    className="w-full justify-between text-cinema-amber-400 group-hover:bg-cinema-amber-500/10"
                  >
                    Generate {item.title}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: NARRATIVE QUALITY ANALYZER */}
      {activeSubTab === 'analyzer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Narrative Pacing', score: '92/100', status: 'Optimal', icon: Zap, color: 'text-emerald-400' },
              { label: 'Emotional Resonance', score: '88/100', scoreLabel: 'High', icon: Heart, color: 'text-cinema-amber-400' },
              { label: 'Chronology Continuity', score: '95/100', scoreLabel: 'Verified', icon: Calendar, color: 'text-cyan-400' },
              { label: 'Cast Consistency', score: '90/100', scoreLabel: 'Aligned', icon: Users, color: 'text-purple-400' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-4 bg-card border border-border rounded-2xl flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center ${st.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase block font-bold">
                      {st.label}
                    </span>
                    <span className="text-sm font-bold text-foreground font-mono">{st.score}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cinema-amber-500" /> Actionable Narrative Recommendations
            </h4>

            <div className="space-y-3">
              {[
                {
                  type: 'Pacing',
                  title: 'Act II Narration Speed',
                  desc: 'The transition from Holyoke College to founding the Literacy Center happens rapidly in 2 sentences. Consider expanding 1 paragraph detailing her initial struggles.',
                  action: 'Expand Act II Narration',
                },
                {
                  type: 'Emotional Arc',
                  title: 'Climax Music Alignment',
                  desc: 'The 1974 Salem Literacy Center opening represents a major life triumph. Ensure backing acoustic score builds in intensity.',
                  action: 'Align Music Cue',
                },
                {
                  type: 'B-Roll Coverage',
                  title: 'Archival Photo Gap (1966–1972)',
                  desc: 'No archival media linked between college graduation and literacy center launch. AI recommends searching for vintage newspaper clippings.',
                  action: 'Search Archive Assets',
                },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-background border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold bg-cinema-amber-500/10 text-cinema-amber-400 px-2 py-0.5 rounded border border-cinema-amber-500/20 uppercase">
                        {rec.type}
                      </span>
                      <h5 className="font-display text-xs font-bold text-foreground">{rec.title}</h5>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-2xl">{rec.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => showToast('success', 'Recommendation Applied', `Applied: ${rec.action}`)}
                    className="border-cinema-amber-500/40 text-cinema-amber-400 hover:bg-cinema-amber-500/10 shrink-0"
                  >
                    {rec.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SCRIPT VERSION HISTORY */}
      {activeSubTab === 'versions' && (
        <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-cinema-amber-500" /> Screenplay Version Control
            </h4>
            <span className="text-xs text-muted-foreground">{versions.length} Total Saved Snapshot(s)</span>
          </div>

          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="p-4 bg-background border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cinema-amber-400 font-mono">
                      v{ver.versionNumber}.0
                    </span>
                    <span className="font-display text-xs font-bold text-foreground">{ver.label}</span>
                    <span className="text-[10px] text-muted-foreground">• {ver.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ver.summary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    leftIcon={<Eye className="w-3 h-3" />}
                    onClick={() => {
                      setSelectedCompareVersion(ver);
                      showToast('info', 'Version Inspector Loaded', `Viewing version ${ver.versionNumber}`);
                    }}
                  >
                    Compare
                  </Button>
                  <Button
                    variant="accent"
                    size="xs"
                    leftIcon={<RotateCcw className="w-3 h-3 text-slate-950" />}
                    onClick={() => {
                      setBlocks(ver.blocks);
                      showToast('success', 'Script Restored', `Restored Screenplay Version v${ver.versionNumber}.0`);
                    }}
                    className="bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
