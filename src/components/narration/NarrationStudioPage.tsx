/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mic,
  Sparkles,
  Download,
  Upload,
  User,
  Sliders,
  Play,
  Pause,
  Layers,
  BookOpen,
  Volume2,
  CheckCircle2,
  Activity,
  Plus
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { ReelMediaPlayer } from '../ui/ReelMediaPlayer';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';
import { useOverlay } from '../../context/OverlayContext';
import { useToast } from '../../context/ToastContext';

// Sub-components
import { NarrationDashboard } from './NarrationDashboard';
import { NarrationSidebar } from './NarrationSidebar';
import { NarrationScriptEditor } from './NarrationScriptEditor';
import { WaveformEditor } from './WaveformEditor';
import { NarrationTimeline } from './NarrationTimeline';
import { NarrationInspector } from './NarrationInspector';

// Modals
import { RecordingStudioModal } from './RecordingStudioModal';
import { VoiceLibraryModal } from './VoiceLibraryModal';
import { PronunciationModal } from './PronunciationModal';
import { ExportNarrationModal } from './ExportNarrationModal';

// Services & Types
import { NarrationService } from '../../services/narrationService';
import { VoiceGenerationService } from '../../services/voiceGenerationService';
import { SyncService } from '../../services/syncService';
import { NarrationSegment, VoiceProfile, NarrationVersion, AISuggestion, PronunciationRule } from '../../types/narration';

export function NarrationStudioPage() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { rightPanelOpen, toggleRightPanel } = useOverlay();
  const { showToast } = useToast();

  // State Management from NarrationService
  const [segments, setSegments] = useState<NarrationSegment[]>([]);
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([]);
  const [pronunciationRules, setPronunciationRules] = useState<PronunciationRule[]>([]);
  const [stats, setStats] = useState(NarrationService.getProjectStats());

  // Active selections & transport states
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice-arthur');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Modal visibility states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isVoiceLibraryOpen, setIsVoiceLibraryOpen] = useState(false);
  const [isPronunciationModalOpen, setIsPronunciationModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load initial data and subscribe to updates
  useEffect(() => {
    // Set breadcrumbs
    setBreadcrumbs([
      { label: 'Dashboard', path: '/workspace/dashboard' },
      { label: 'Narration Studio' }
    ]);

    const initialSegs = NarrationService.getSegments();
    setSegments(initialSegs);
    setVoiceProfiles(NarrationService.getVoiceProfiles());
    setPronunciationRules(NarrationService.getPronunciationRules());
    setStats(NarrationService.getProjectStats());

    if (initialSegs.length > 0 && !selectedSegmentId) {
      setSelectedSegmentId(initialSegs[0].id);
    }

    // Subscribe to narration service listener updates
    const unsubscribe = NarrationService.subscribe(() => {
      const updatedSegs = NarrationService.getSegments();
      setSegments(updatedSegs);
      setVoiceProfiles(NarrationService.getVoiceProfiles());
      setPronunciationRules(NarrationService.getPronunciationRules());
      setStats(NarrationService.getProjectStats());
    });

    return () => {
      unsubscribe();
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs]);

  // Derived selected active segment & voice profile
  const activeSegment = segments.find(s => s.id === selectedSegmentId) || null;
  const activeVoiceProfile = voiceProfiles.find(v => v.id === (activeSegment?.activeVoiceId || selectedVoiceId));
  const activeVersion = activeSegment?.versions.find(v => v.id === activeSegment.activeVersionId);

  // Playhead scrubber timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          const totalDur = stats.totalDurationMin * 60;
          if (prev >= totalDur) {
            setIsPlaying(false);
            return 0;
          }
          return parseFloat((prev + 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stats.totalDurationMin]);

  // Handle Script Text Update
  const handleUpdateScriptText = (segmentId: string, newText: string) => {
    NarrationService.updateSegmentText(segmentId, newText);
    const updated = NarrationService.getSegments().find(s => s.id === segmentId);
    if (updated) SyncService.notifyNarrationChanged(updated);
  };

  // Handle Voice Profile Selection
  const handleSelectVoiceProfile = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    if (selectedSegmentId) {
      NarrationService.assignVoiceProfile(selectedSegmentId, voiceId);
    }
  };

  // Handle AI Voice Generation
  const handleGenerateAIVoice = async (actionLabel: string = 'AI Synthesis') => {
    if (!activeSegment) return;
    showToast('loading', `Synthesizing AI voice narration for "${activeSegment.sceneTitle}"...`);

    const voice = activeVoiceProfile || voiceProfiles[0];
    const newVer = await VoiceGenerationService.generateVoiceClip(activeSegment.text, voice, actionLabel);

    NarrationService.addVersion(activeSegment.id, newVer);
    showToast('success', 'AI Voice synthesis generated and assigned to scene!');

    const updated = NarrationService.getSegments().find(s => s.id === activeSegment.id);
    if (updated) SyncService.notifyNarrationChanged(updated);
  };

  // Handle Save Studio Take Recording
  const handleSaveRecording = (version: NarrationVersion) => {
    if (!activeSegment) return;
    NarrationService.addVersion(activeSegment.id, version);
    showToast('success', 'Recording take saved to narration timeline!');

    const updated = NarrationService.getSegments().find(s => s.id === activeSegment.id);
    if (updated) SyncService.notifyNarrationChanged(updated);
  };

  // Handle Voice Settings (Speed, Pitch, Ducking)
  const handleUpdateVoiceSettings = (speed: number, pitch: number, duckingDb: number) => {
    if (!activeSegment) return;
    NarrationService.updateVoiceSettings(activeSegment.id, speed, pitch, duckingDb);
  };

  // Apply AI Suggestion
  const handleApplyAISuggestion = (sug: AISuggestion) => {
    if (!activeSegment) return;
    if (sug.proposedSpeed) {
      handleUpdateVoiceSettings(sug.proposedSpeed, activeVoiceProfile?.pitch || 1.0, activeSegment.musicDuckingDb);
      showToast('success', `Adjusted speaking speed to ${sug.proposedSpeed}x!`);
    } else if (sug.fixAction === 'insert_pause') {
      const newText = activeSegment.text + ' [pause: 1.5s] ';
      handleUpdateScriptText(activeSegment.id, newText);
      showToast('success', 'Inserted breath pause marker!');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden" id="narration-studio-page">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Narration Studio"
        subtitle="AI Voice Production, Family Voice Recording & Multi-Track Story Synchronization"
        rightContent={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsVoiceLibraryOpen(true)}
              icon={<User className="w-3.5 h-3.5 text-cinema-amber-400" />}
            >
              Voice Library
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRecordModalOpen(true)}
              icon={<Mic className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Record Studio
            </Button>

            <Button
              size="sm"
              variant="cinema"
              onClick={() => handleGenerateAIVoice('AI Voice Synthesis')}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate AI Scene Voice
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export Studio Master
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={toggleRightPanel}
              icon={<Sliders className="w-3.5 h-3.5 text-cinema-amber-400" />}
              title="Toggle Narration Inspector"
            >
              Inspector
            </Button>
          </div>
        }
      />

      {/* 2. DASHBOARD METRICS BAR */}
      <div className="px-6 pt-4 shrink-0">
        <NarrationDashboard
          stats={stats}
          onQuickAction={(action) => {
            if (action === 'filter-missing') {
              showToast('info', 'Filtered queue to missing voice segments.');
            }
          }}
        />
      </div>

      {/* 3. MAIN WORKSPACE (LEFT SIDEBAR + CENTER EDITOR/PREVIEW + RIGHT INSPECTOR) */}
      <div className="flex-1 flex overflow-hidden border-t border-border/80">
        {/* LEFT SIDEBAR */}
        <NarrationSidebar
          segments={segments}
          selectedSegmentId={selectedSegmentId}
          onSelectSegment={(id) => setSelectedSegmentId(id)}
          voiceProfiles={voiceProfiles}
          onOpenVoiceLibrary={() => setIsVoiceLibraryOpen(true)}
          onOpenPronunciationModal={() => setIsPronunciationModalOpen(true)}
        />

        {/* CENTER WORKSPACE */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* TOP SPLIT: SCRIPT EDITOR & MEDIA PLAYER PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[380px]">
            {/* SCRIPT EDITOR (2/3 WIDTH ON DESKTOP) */}
            <div className="lg:col-span-2 flex flex-col">
              <NarrationScriptEditor
                segment={activeSegment}
                voiceProfile={activeVoiceProfile}
                onUpdateText={handleUpdateScriptText}
                onOpenRecordModal={() => setIsRecordModalOpen(true)}
                onGenerateVoiceClip={handleGenerateAIVoice}
                onAddVersion={(label, type) => {
                  if (activeSegment) {
                    NarrationService.addVersion(activeSegment.id, {
                      id: `ver-alt-${Date.now()}`,
                      type,
                      label,
                      durationSec: activeSegment.speakingDurationEstimateSec || 12,
                      createdAt: new Date().toISOString(),
                      createdBy: 'Editor Take',
                      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg',
                      isSelected: true
                    });
                  }
                }}
              />
            </div>

            {/* REEL MEDIA PLAYER PREVIEW (1/3 WIDTH ON DESKTOP) */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                <span>Scene Visual Sync</span>
                <span className="text-[10px] text-cinema-amber-400 font-mono">
                  {activeSegment ? activeSegment.sceneTitle : 'Preview'}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 overflow-hidden bg-black shadow-md">
                <ReelMediaPlayer
                  src={activeSegment?.mediaAssetUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                  poster="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                  autoPlay={false}
                />
              </div>

              {/* ACTIVE SUBTITLE PROMPTER PREVIEW */}
              {activeSegment && (
                <div className="p-3 rounded-xl bg-card border border-border/60 text-center space-y-1">
                  <div className="text-[9px] font-mono font-bold uppercase text-cinema-amber-400">
                    Live Subtitle Prompter
                  </div>
                  <p className="text-xs font-mono text-foreground font-semibold line-clamp-2">
                    "{activeSegment.text}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM WAVEFORM EDITOR */}
          <WaveformEditor
            segment={activeSegment}
            activeVersion={activeVersion}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            currentTime={currentTime}
            onSeek={(time) => setCurrentTime(time)}
          />
        </div>

        {/* RIGHT CONTEXT PANEL INSPECTOR */}
        {rightPanelOpen && (
          <div className="w-80 h-full shrink-0">
            <NarrationInspector
              segment={activeSegment}
              voiceProfile={activeVoiceProfile}
              onUpdateVoiceSettings={handleUpdateVoiceSettings}
              onSelectVersion={(versionId) => {
                if (activeSegment) NarrationService.selectVersion(activeSegment.id, versionId);
              }}
              onApplyAISuggestion={handleApplyAISuggestion}
              onOpenPronunciationModal={() => setIsPronunciationModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* 4. MULTI-TRACK BOTTOM TIMELINE */}
      <NarrationTimeline
        segments={segments}
        selectedSegmentId={selectedSegmentId}
        onSelectSegment={(id) => setSelectedSegmentId(id)}
        currentTime={currentTime}
        onSeek={(time) => setCurrentTime(time)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* 5. MODALS */}
      <RecordingStudioModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        segment={activeSegment}
        onSaveRecording={handleSaveRecording}
      />

      <VoiceLibraryModal
        isOpen={isVoiceLibraryOpen}
        onClose={() => setIsVoiceLibraryOpen(false)}
        voiceProfiles={voiceProfiles}
        selectedVoiceId={activeSegment?.activeVoiceId || selectedVoiceId}
        onSelectVoice={handleSelectVoiceProfile}
        onAddVoiceProfile={(newVoice) => NarrationService.addVoiceProfile(newVoice)}
      />

      <PronunciationModal
        isOpen={isPronunciationModalOpen}
        onClose={() => setIsPronunciationModalOpen(false)}
        rules={pronunciationRules}
        onAddRule={(rule) => NarrationService.addPronunciationRule(rule)}
      />

      <ExportNarrationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        segments={segments}
      />
    </div>
  );
}
