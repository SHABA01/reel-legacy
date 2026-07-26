/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Activity,
  History,
  FileText,
  Volume2,
  Check,
  RotateCcw,
  AlertCircle,
  Wand2,
  BookOpen,
  X,
  Play,
  Layers,
  Subtitles,
  Trash2
} from 'lucide-react';
import { NarrationSegment, VoiceProfile, AISuggestion, AudioQualityIssue } from '../../types/narration';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { AudioAnalysisService } from '../../services/audioAnalysisService';

interface NarrationInspectorProps {
  segment: NarrationSegment | null;
  voiceProfile: VoiceProfile | undefined;
  onUpdateVoiceSettings: (speed: number, pitch: number, duckingDb: number) => void;
  onSelectVersion: (versionId: string) => void;
  onApplyAISuggestion: (sug: AISuggestion) => void;
  onOpenPronunciationModal: () => void;
}

export function NarrationInspector({
  segment,
  voiceProfile,
  onUpdateVoiceSettings,
  onSelectVersion,
  onApplyAISuggestion,
  onOpenPronunciationModal
}: NarrationInspectorProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'voice' | 'suggestions' | 'quality' | 'versions' | 'subtitles'>('voice');

  // Slider local states
  const [speed, setSpeed] = useState(voiceProfile?.speed || 1.0);
  const [pitch, setPitch] = useState(voiceProfile?.pitch || 1.0);
  const [duckingDb, setDuckingDb] = useState(segment?.musicDuckingDb || -12);

  if (!segment) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
        <p>Select a narration segment to view context properties and AI suggestions.</p>
      </div>
    );
  }

  // Perform continuous audio quality analysis
  const { score, issues, suggestions } = AudioAnalysisService.analyzeSegment(segment);

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
    onUpdateVoiceSettings(val, pitch, duckingDb);
  };

  const handlePitchChange = (val: number) => {
    setPitch(val);
    onUpdateVoiceSettings(speed, val, duckingDb);
  };

  const handleDuckingChange = (val: number) => {
    setDuckingDb(val);
    onUpdateVoiceSettings(speed, pitch, val);
  };

  return (
    <div className="h-full flex flex-col bg-card/70 border-l border-border/80 text-foreground select-none" id="narration-inspector">
      {/* INSPECTOR HEADER TABS */}
      <div className="p-2 border-b border-border/70 flex items-center justify-between gap-1 bg-background/50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('voice')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-cinema-amber-500/20 text-cinema-amber-400 border border-cinema-amber-500/40 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Voice</span>
        </button>

        <button
          onClick={() => setActiveTab('suggestions')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer relative ${
            activeTab === 'suggestions'
              ? 'bg-cinema-amber-500/20 text-cinema-amber-400 border border-cinema-amber-500/40 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cinema-amber-400" />
          <span>AI Refine</span>
          {suggestions.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-cinema-amber-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
              {suggestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'quality'
              ? 'bg-cinema-amber-500/20 text-cinema-amber-400 border border-cinema-amber-500/40 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Acoustics</span>
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'versions'
              ? 'bg-cinema-amber-500/20 text-cinema-amber-400 border border-cinema-amber-500/40 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Takes ({segment.versions.length})</span>
        </button>
      </div>

      {/* INSPECTOR TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* TAB 1: VOICE & DUCKING SETTINGS */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cinema-amber-400">
                Assigned Voice Profile
              </div>
              <div className="font-bold text-sm text-foreground">
                {voiceProfile ? voiceProfile.name : 'Arthur Sterling'}
              </div>
              <p className="text-xs text-muted-foreground">
                {voiceProfile ? voiceProfile.description : 'Warm elder voice model'}
              </p>
            </div>

            {/* SLIDERS */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>Speaking Speed</span>
                  <span className="font-mono text-cinema-amber-400">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.05"
                  value={speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full accent-cinema-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>Voice Pitch</span>
                  <span className="font-mono text-cinema-amber-400">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                  className="w-full accent-cinema-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-border/40">
                <div className="flex justify-between text-xs font-bold text-foreground">
                  <span>Music Ducking Priority</span>
                  <span className="font-mono text-cinema-amber-400">{duckingDb} dB</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Automatically reduces background score volume while voiceover plays.
                </p>
                <input
                  type="range"
                  min="-24"
                  max="0"
                  step="1"
                  value={duckingDb}
                  onChange={(e) => handleDuckingChange(parseInt(e.target.value))}
                  className="w-full accent-cinema-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onOpenPronunciationModal}
              icon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Manage Pronunciation Dictionary
            </Button>
          </div>
        )}

        {/* TAB 2: AI SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Continuous Script & Cadence Analysis
            </div>

            {suggestions.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl space-y-1">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-foreground">Script Perfectly Optimized!</p>
                <p className="text-[10px]">No pacing, breath, or pronunciation warnings detected.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map(sug => (
                  <div
                    key={sug.id}
                    className="p-3 rounded-xl bg-card border border-cinema-amber-500/30 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-cinema-amber-400">
                      <span>{sug.title}</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>

                    <p className="text-xs text-foreground font-medium">
                      {sug.message}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {sug.explanation}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <Button
                        size="xs"
                        variant="cinema"
                        onClick={() => onApplyAISuggestion(sug)}
                      >
                        {sug.fixLabel}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACOUSTICS QUALITY */}
        {activeTab === 'quality' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-background/50 border border-border/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">Acoustic Score</div>
                <div className="text-lg font-display font-bold text-foreground">{score} / 100</div>
              </div>
              <Activity className="w-6 h-6 text-purple-400" />
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Detected Acoustic Conditions
              </div>

              {issues.length === 0 ? (
                <p className="text-xs text-muted-foreground">Studio grade acoustics confirmed.</p>
              ) : (
                issues.map(iss => (
                  <div key={iss.id} className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{iss.type.toUpperCase()}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        iss.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-cinema-amber-500/20 text-cinema-amber-300'
                      }`}>
                        {iss.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{iss.description}</p>
                    <p className="text-[10px] text-cinema-amber-400 italic">Rec: {iss.recommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: VERSION HISTORY */}
        {activeTab === 'versions' && (
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Audio Take Versions
            </div>

            {segment.versions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No audio takes recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {segment.versions.map(ver => (
                  <div
                    key={ver.id}
                    onClick={() => onSelectVersion(ver.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      ver.isSelected
                        ? 'bg-cinema-amber-500/20 border-cinema-amber-500 font-bold'
                        : 'bg-card border-border/60 hover:border-cinema-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-foreground">
                      <span>{ver.label}</span>
                      {ver.isSelected && <Check className="w-3.5 h-3.5 text-cinema-amber-400" />}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Duration: {ver.durationSec}s</span>
                      <span>{ver.createdBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
