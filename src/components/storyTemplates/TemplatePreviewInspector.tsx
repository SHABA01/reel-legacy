/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoryTemplate, TemplateAct } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  X,
  Sparkles,
  Clock,
  Clapperboard,
  Layers,
  Star,
  Users,
  Copy,
  ArrowRight,
  Download,
  HelpCircle,
  Music,
  Camera,
  Film,
  ListOrdered,
  History,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { TemplateImportExportService } from '../../services/templateImportExportService';

interface TemplatePreviewInspectorProps {
  template: StoryTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: StoryTemplate) => void;
  onDuplicate: (template: StoryTemplate) => void;
  onToggleFavorite: (id: string) => void;
}

export const TemplatePreviewInspector: React.FC<TemplatePreviewInspectorProps> = ({
  template,
  onClose,
  onUseTemplate,
  onDuplicate,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'story_flow' | 'scenes' | 'audio_visual' | 'interview_questions' | 'ai_prompts' | 'versions'
  >('overview');

  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({
    'act-1': true,
  });

  if (!template) {
    return (
      <aside className="w-full lg:w-96 flex-shrink-0 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 text-center space-y-3 shadow-sm hidden lg:block">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Clapperboard className="w-6 h-6" />
        </div>
        <h4 className="font-display font-bold text-sm text-foreground">Select a Blueprint</h4>
        <p className="text-xs text-muted-foreground">
          Click on any template card to inspect scene breakdowns, interview questions, and AI prompt packs.
        </p>
      </aside>
    );
  }

  const toggleActExpand = (actId: string) => {
    setExpandedActs(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handleDownloadJSON = () => {
    TemplateImportExportService.downloadTemplateFile(template);
  };

  return (
    <aside className="w-full lg:w-96 flex-shrink-0 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl flex flex-col h-[calc(100vh-140px)] sticky top-20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cinema-amber-500/15 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-500">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-foreground truncate max-w-[200px]">
              {template.name}
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
              {template.category} • v{template.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(template.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              template.isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 bg-muted/50 border-b border-border/60 overflow-x-auto text-[11px] font-semibold no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('story_flow')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'story_flow'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Story Flow
        </button>
        <button
          onClick={() => setActiveTab('scenes')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'scenes'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Scenes
        </button>
        <button
          onClick={() => setActiveTab('audio_visual')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'audio_visual'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          AV Style
        </button>
        <button
          onClick={() => setActiveTab('interview_questions')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'interview_questions'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Interview Bank
        </button>
        <button
          onClick={() => setActiveTab('ai_prompts')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'ai_prompts'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          AI Prompts
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'versions'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Versions
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden h-36 bg-muted">
              <img
                src={template.coverImage}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 text-white flex items-center justify-between text-[11px]">
                <span className="font-bold">{template.storyType}</span>
                <span className="bg-cinema-amber-500 text-black px-2 py-0.5 rounded font-extrabold text-[10px]">
                  {template.difficulty}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {template.description}
            </p>

            <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-xl">
              <div>
                <span className="text-muted-foreground block text-[10px]">Estimated Runtime</span>
                <span className="font-bold text-foreground">{template.estimatedRuntime}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Recommended Audience</span>
                <span className="font-bold text-foreground truncate block">{template.recommendedAudience}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Author</span>
                <span className="font-bold text-foreground">{template.author}</span>
              </div>
                <div>
                <span className="text-muted-foreground block text-[10px]">AI Compatibility</span>
                <span className="font-bold text-cinema-amber-500">{template.aiCompatibility} AI Support</span>
              </div>
            </div>

            {/* Required Assets */}
            <div className="space-y-1.5">
              <h4 className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cinema-amber-500" />
                Recommended Input Assets
              </h4>
              <ul className="space-y-1">
                {template.narrativeBlueprint.requiredAssets.map((asset, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{asset}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Production Note */}
            <div className="p-3 bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cinema-amber-500 text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Director Notes</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {template.narrativeBlueprint.aiNotes}
              </p>
            </div>
          </div>
        )}

        {/* STORY FLOW TAB */}
        {activeTab === 'story_flow' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-muted/40 rounded-xl text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground mb-0.5">Recommended Scene Flow:</p>
              <p>{template.narrativeBlueprint.recommendedSceneFlow}</p>
            </div>

            {template.narrativeBlueprint.acts.map((act) => {
              const isExpanded = expandedActs[act.id];
              return (
                <div key={act.id} className="border border-border/80 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleActExpand(act.id)}
                    className="w-full p-3 bg-muted/30 hover:bg-muted/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-cinema-amber-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div>
                        <h4 className="font-bold text-foreground">{act.title}</h4>
                        <span className="text-[10px] text-muted-foreground">
                          {act.durationMinutes} mins • {act.chapters.length} Chapters
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-card border-t border-border/60 space-y-3">
                      <p className="text-muted-foreground text-[11px] italic">
                        {act.description}
                      </p>

                      <div className="space-y-2">
                        {act.chapters.map((chap, cIdx) => (
                          <div key={chap.id} className="p-2.5 bg-muted/30 rounded-lg space-y-1">
                            <h5 className="font-bold text-foreground text-[11px]">
                              Chapter {cIdx + 1}: {chap.title}
                            </h5>
                            <p className="text-[10px] text-muted-foreground">
                              Objective: {chap.objective}
                            </p>
                            <div className="text-[10px] text-cinema-amber-500 font-semibold pt-1">
                              {chap.suggestedScenes.length} Suggested Scenes Blueprint
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SCENES TAB */}
        {activeTab === 'scenes' && (
          <div className="space-y-3">
            {template.narrativeBlueprint.acts.flatMap(a => a.chapters.flatMap(c => c.suggestedScenes)).map((scene, sIdx) => (
              <div key={scene.id} className="p-3 border border-border/80 rounded-xl space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cinema-amber-500 text-[11px]">
                    Scene {sIdx + 1}: {scene.title}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {scene.suggestedDuration}
                  </span>
                </div>

                <p className="text-muted-foreground text-[11px]">
                  {scene.narrativePurpose}
                </p>

                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-muted-foreground border-t border-border/50">
                  <div>
                    <span className="block font-semibold text-foreground">Camera Path:</span>
                    <span>{scene.recommendedCameraMovement}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">Transition:</span>
                    <span>{scene.transitionType}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block font-semibold text-foreground">Music Track:</span>
                    <span>{scene.musicRecommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AV STYLE TAB */}
        {activeTab === 'audio_visual' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-cinema-amber-500 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Visual & Cinematic Tone
              </h4>
              <div className="p-2.5 bg-muted/40 rounded-xl space-y-1">
                <span className="block font-semibold text-foreground">Camera Direction:</span>
                <p className="text-muted-foreground">{template.narrativeBlueprint.cameraStyle}</p>
                <span className="block font-semibold text-foreground pt-1">Color Grading & Texture:</span>
                <p className="text-muted-foreground">{template.narrativeBlueprint.visualStyle}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-cinema-amber-500 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                Audio & Narration Style
              </h4>
              <div className="p-2.5 bg-muted/40 rounded-xl space-y-1">
                <span className="block font-semibold text-foreground">Voiceover Persona:</span>
                <p className="text-muted-foreground">{template.narrativeBlueprint.narrationStyle}</p>
                <span className="block font-semibold text-foreground pt-1">Score Palette:</span>
                <p className="text-muted-foreground">{template.narrativeBlueprint.musicStyle}</p>
              </div>
            </div>

            {/* Recommended Music Suggestions */}
            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-muted-foreground">
                Suggested Music Tracks
              </h4>
              {template.narrativeBlueprint.musicSuggestions.map((m, idx) => (
                <div key={idx} className="p-2.5 border border-border/80 rounded-xl space-y-1 bg-card">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>{m.title}</span>
                    <span className="text-[10px] text-cinema-amber-500">{m.tempo}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {m.genre} • {m.mood}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 italic">
                    Instrumentation: {m.instrumentation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERVIEW BANK TAB */}
        {activeTab === 'interview_questions' && (
          <div className="space-y-3">
            {template.narrativeBlueprint.interviewQuestions.map((group, idx) => (
              <div key={idx} className="p-3 border border-border/80 rounded-xl space-y-2 bg-card">
                <h4 className="font-bold text-cinema-amber-500 text-[11px] uppercase tracking-wider">
                  {group.category}
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground text-[11px]">
                  {group.questions.map((q, qIdx) => (
                    <li key={qIdx} className="leading-relaxed">
                      "{q}"
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* AI PROMPTS TAB */}
        {activeTab === 'ai_prompts' && (
          <div className="space-y-3">
            {template.narrativeBlueprint.aiPromptPacks.map((pack, idx) => (
              <div key={idx} className="p-3 border border-border/80 rounded-xl space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cinema-amber-500" />
                    {pack.title}
                  </h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(pack.prompt)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy Prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Purpose: {pack.purpose}
                </p>
                <div className="p-2 bg-black/60 rounded-lg text-[10px] font-mono text-amber-200/90 whitespace-pre-wrap border border-white/5">
                  {pack.prompt}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VERSIONS TAB */}
        {activeTab === 'versions' && (
          <div className="space-y-2">
            {template.versionHistory.map((v, idx) => (
              <div key={idx} className="p-2.5 border border-border/80 rounded-xl space-y-1 bg-card">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-cinema-amber-500">v{v.version}</span>
                  <span className="text-[10px] text-muted-foreground">{v.date}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{v.changes}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="p-3 border-t border-border/80 bg-muted/40 space-y-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onUseTemplate(template)}
          className="w-full bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold py-2.5 h-10 gap-2 shadow-md cursor-pointer"
        >
          Use Template Blueprint
          <ArrowRight className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(template)}
            className="flex-1 text-xs gap-1.5 py-1.5 h-8"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJSON}
            className="flex-1 text-xs gap-1.5 py-1.5 h-8"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </Button>
        </div>
      </div>
    </aside>
  );
};
