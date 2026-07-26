/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  X,
  Sparkles,
  Clock,
  Layers,
  Star,
  Users,
  Copy,
  ArrowRight,
  Download,
  Music,
  Camera,
  Film,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Palette,
  Gauge,
  UserCheck,
  Wand2
} from 'lucide-react';
import { TemplateImportExportService } from '../../services/templateImportExportService';

interface TemplatePreviewInspectorProps {
  template: StoryTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: StoryTemplate, customTitle?: string, subjectName?: string) => void;
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
    'overview' | 'customization' | 'story_flow' | 'scenes' | 'audio_visual' | 'interview_questions' | 'ai_prompts' | 'versions'
  >('overview');

  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({
    'act-1': true,
  });

  // Customization Options State
  const [customTitle, setCustomTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [colorGrade, setColorGrade] = useState('Warm Sepia & Vintage');
  const [pacing, setPacing] = useState('Reflective & Cinematic');
  const [voiceTone, setVoiceTone] = useState('Warm Reverent');

  useEffect(() => {
    if (template) {
      setCustomTitle(template.name);
      setSubjectName('Grandfather John');
      setColorGrade(template.narrativeBlueprint.visualStyle || 'Warm Sepia & Vintage');
      setPacing('Reflective & Cinematic');
      setVoiceTone(template.narrativeBlueprint.narrationStyle || 'Warm Reverent');
    }
  }, [template]);

  if (!template) return null;

  const toggleActExpand = (actId: string) => {
    setExpandedActs(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handleDownloadJSON = () => {
    TemplateImportExportService.downloadTemplateFile(template);
  };

  const handleConfirmUse = () => {
    onUseTemplate(template, customTitle, subjectName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="relative w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-cinema-amber-500/15 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-500 flex-shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base text-foreground truncate">
                {template.name}
              </h3>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                {template.category} • v{template.version}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavorite(template.id)}
              className={`p-2 rounded-xl border border-border transition-colors cursor-pointer ${
                template.isFavorite ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-muted/50 border-b border-border overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'overview'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('customization')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'customization'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-cinema-amber-500 hover:bg-cinema-amber-500/10'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Customize & Scaffold
          </button>
          <button
            onClick={() => setActiveTab('story_flow')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'story_flow'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Story Flow
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'scenes'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Scenes
          </button>
          <button
            onClick={() => setActiveTab('audio_visual')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'audio_visual'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            AV Style
          </button>
          <button
            onClick={() => setActiveTab('interview_questions')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'interview_questions'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Interview Bank
          </button>
          <button
            onClick={() => setActiveTab('ai_prompts')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'ai_prompts'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            AI Prompts
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'versions'
                ? 'bg-cinema-amber-500 text-black font-extrabold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Versions
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden h-44 bg-muted border border-border">
                <img
                  src={template.coverImage}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                  <span className="font-bold">{template.storyType}</span>
                  <span className="bg-cinema-amber-500 text-black px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">
                    {template.difficulty} Level
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-xs">
                {template.description}
              </p>

              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px] font-medium">Estimated Runtime</span>
                  <span className="font-bold text-foreground text-xs">{template.estimatedRuntime}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-medium">Target Audience</span>
                  <span className="font-bold text-foreground text-xs truncate block">{template.recommendedAudience}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-medium">Author / Studio</span>
                  <span className="font-bold text-foreground text-xs">{template.author}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-medium">AI Director Integration</span>
                  <span className="font-bold text-cinema-amber-500 text-xs">{template.aiCompatibility} AI Support</span>
                </div>
              </div>

              {/* Required Assets */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cinema-amber-500" />
                  Recommended Input Assets
                </h4>
                <ul className="space-y-1.5">
                  {template.narrativeBlueprint.requiredAssets.map((asset, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground text-xs bg-card p-2 rounded-xl border border-border/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{asset}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Production Note */}
              <div className="p-3.5 bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-cinema-amber-500 text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Director Guidance</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.narrativeBlueprint.aiNotes}
                </p>
              </div>
            </div>
          )}

          {/* CUSTOMIZATION TAB */}
          {activeTab === 'customization' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-cinema-amber-500/10 border border-cinema-amber-500/20 rounded-2xl space-y-1">
                <h4 className="font-bold text-cinema-amber-500 text-xs flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4" />
                  Configure Blueprint Defaults
                </h4>
                <p className="text-xs text-muted-foreground">
                  Customize the title, subject name, pacing, and visual style before scaffolding your project in Story Studio.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Documentary Story Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cinema-amber-500"
                    placeholder="e.g., The Life & Legacy of John Smith"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Primary Subject / Family Name
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cinema-amber-500"
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-cinema-amber-500" />
                    Color Grading Palette
                  </label>
                  <select
                    value={colorGrade}
                    onChange={(e) => setColorGrade(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cinema-amber-500"
                  >
                    <option value="Warm Sepia & Vintage">Warm Sepia & Vintage Archival</option>
                    <option value="Golden Hour Cinematic">Golden Hour Cinematic Warmth</option>
                    <option value="Modern High Contrast Clean">Modern High Contrast Clean</option>
                    <option value="Monochrome Film Grain B&W">Monochrome Historic B&W</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cinema-amber-500" />
                    Documentary Pacing
                  </label>
                  <select
                    value={pacing}
                    onChange={(e) => setPacing(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cinema-amber-500"
                  >
                    <option value="Reflective & Cinematic">Reflective & Reflective (Slow, Reverent)</option>
                    <option value="Standard Documentary">Standard TV Documentary (Balanced)</option>
                    <option value="Dynamic Fast Paced">Dynamic Fast-Paced (Modern Short Feature)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cinema-amber-500" />
                    Narration Tone
                  </label>
                  <select
                    value={voiceTone}
                    onChange={(e) => setVoiceTone(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cinema-amber-500"
                  >
                    <option value="Warm Reverent">Warm, Reverent & Reflective</option>
                    <option value="Inspirational Storyteller">Inspirational Storyteller</option>
                    <option value="Solemn Honorable">Solemn & Honorable</option>
                    <option value="Classic Narrator">Classic Master Narrator</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STORY FLOW TAB */}
          {activeTab === 'story_flow' && (
            <div className="space-y-3">
              <div className="p-3 bg-muted/40 rounded-2xl text-xs text-muted-foreground border border-border/60">
                <p className="font-semibold text-foreground mb-0.5">Recommended Structure:</p>
                <p>{template.narrativeBlueprint.recommendedSceneFlow}</p>
              </div>

              {template.narrativeBlueprint.acts.map((act) => {
                const isExpanded = expandedActs[act.id];
                return (
                  <div key={act.id} className="border border-border/80 rounded-2xl overflow-hidden bg-card">
                    <button
                      type="button"
                      onClick={() => toggleActExpand(act.id)}
                      className="w-full p-3.5 bg-muted/30 hover:bg-muted/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-cinema-amber-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <h4 className="font-bold text-foreground text-xs">{act.title}</h4>
                          <span className="text-[10px] text-muted-foreground">
                            {act.durationMinutes} mins • {act.chapters.length} Chapters
                          </span>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3.5 border-t border-border/60 space-y-3 bg-background/50">
                        <p className="text-muted-foreground text-xs italic">
                          {act.description}
                        </p>

                        <div className="space-y-2">
                          {act.chapters.map((chap, cIdx) => (
                            <div key={chap.id} className="p-3 bg-card rounded-xl border border-border/60 space-y-1">
                              <h5 className="font-bold text-foreground text-xs">
                                Chapter {cIdx + 1}: {chap.title}
                              </h5>
                              <p className="text-[11px] text-muted-foreground">
                                Objective: {chap.objective}
                              </p>
                              <div className="text-[10px] text-cinema-amber-500 font-semibold pt-1">
                                {chap.suggestedScenes.length} Suggested Scenes
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
                <div key={scene.id} className="p-3.5 border border-border/80 rounded-2xl space-y-2 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cinema-amber-500 text-xs">
                      Scene {sIdx + 1}: {scene.title}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {scene.suggestedDuration}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {scene.narrativePurpose}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/50">
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
                  Visual & Camera Tone
                </h4>
                <div className="p-3 bg-muted/40 rounded-2xl space-y-1.5 border border-border/60">
                  <span className="block font-semibold text-foreground text-xs">Camera Direction:</span>
                  <p className="text-muted-foreground text-xs">{template.narrativeBlueprint.cameraStyle}</p>
                  <span className="block font-semibold text-foreground text-xs pt-1">Color Grading & Texture:</span>
                  <p className="text-muted-foreground text-xs">{template.narrativeBlueprint.visualStyle}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider text-cinema-amber-500 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  Audio & Narration Style
                </h4>
                <div className="p-3 bg-muted/40 rounded-2xl space-y-1.5 border border-border/60">
                  <span className="block font-semibold text-foreground text-xs">Voiceover Persona:</span>
                  <p className="text-muted-foreground text-xs">{template.narrativeBlueprint.narrationStyle}</p>
                  <span className="block font-semibold text-foreground text-xs pt-1">Score Palette:</span>
                  <p className="text-muted-foreground text-xs">{template.narrativeBlueprint.musicStyle}</p>
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW BANK TAB */}
          {activeTab === 'interview_questions' && (
            <div className="space-y-3">
              {template.narrativeBlueprint.interviewQuestions.map((group, idx) => (
                <div key={idx} className="p-3.5 border border-border/80 rounded-2xl space-y-2 bg-card">
                  <h4 className="font-bold text-cinema-amber-500 text-xs uppercase tracking-wider">
                    {group.category}
                  </h4>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground text-xs">
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
                <div key={idx} className="p-3.5 border border-border/80 rounded-2xl space-y-2 bg-card">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cinema-amber-500" />
                      {pack.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(pack.prompt)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    Purpose: {pack.purpose}
                  </p>
                  <div className="p-2.5 bg-black/80 rounded-xl text-[11px] font-mono text-amber-200/90 whitespace-pre-wrap border border-white/10">
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
                <div key={idx} className="p-3 border border-border/80 rounded-2xl space-y-1 bg-card">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-cinema-amber-500 text-xs">v{v.version}</span>
                    <span className="text-[10px] text-muted-foreground">{v.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{v.changes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/40 space-y-2">
          <Button
            variant="default"
            size="md"
            onClick={handleConfirmUse}
            className="w-full bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold py-3 shadow-lg shadow-cinema-amber-500/20 gap-2 cursor-pointer"
          >
            Scaffold & Open in Story Studio
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(template)}
              className="flex-1 text-xs gap-1.5 py-2"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadJSON}
              className="flex-1 text-xs gap-1.5 py-2"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
