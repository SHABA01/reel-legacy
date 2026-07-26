/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  Play,
  Volume2,
  Check,
  Plus,
  Sliders,
  User,
  Tag,
  Radio
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { VoiceProfile } from '../../types/narration';
import { useToast } from '../../context/ToastContext';

interface VoiceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceProfiles: VoiceProfile[];
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  onAddVoiceProfile: (profile: Omit<VoiceProfile, 'id'>) => void;
}

export function VoiceLibraryModal({
  isOpen,
  onClose,
  voiceProfiles,
  selectedVoiceId,
  onSelectVoice,
  onAddVoiceProfile
}: VoiceLibraryModalProps) {
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form states for new voice profile creation
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VoiceProfile['category']>('AI Voice Clone');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Neutral'>('Male');
  const [newAgeGroup, setNewAgeGroup] = useState<'Child' | 'Young Adult' | 'Adult' | 'Elderly'>('Elderly');
  const [newAccent, setNewAccent] = useState('New England');
  const [newDescription, setNewDescription] = useState('');
  const [newSpeed, setNewSpeed] = useState(1.0);
  const [newPitch, setNewPitch] = useState(1.0);

  const categories = ['All', 'Family Member', 'Documentary Narrator', 'AI Voice Clone', 'Historical Voice'];

  const filteredVoices = activeCategory === 'All'
    ? voiceProfiles
    : voiceProfiles.filter(v => v.category === activeCategory);

  const handlePlaySample = (voice: VoiceProfile) => {
    setPlayingVoiceId(voice.id);
    const audio = new Audio(voice.sampleAudioUrl || 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg');
    audio.play().catch(() => {});
    audio.onended = () => setPlayingVoiceId(null);
    showToast('info', `Playing voice sample for ${voice.name}...`);
  };

  const handleCreateVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddVoiceProfile({
      name: newName,
      title: newTitle || newName,
      category: newCategory,
      gender: newGender,
      ageGroup: newAgeGroup,
      accent: newAccent,
      description: newDescription || 'Custom family voice model synthesized for ReelLegacy.',
      speed: newSpeed,
      pitch: newPitch,
      stability: 90,
      emotion: 'Warm',
      pauseStyle: 'Natural',
      tags: ['Custom', newCategory]
    });

    showToast('success', `Created custom voice profile "${newName}"!`);
    setIsCreatingNew(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Voice Production Library & Voice Clones"
      size="xl"
    >
      <div className="space-y-6" id="voice-library-modal">
        {/* CATEGORY TABS & CREATE TRIGGER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cinema-amber-500/20 text-cinema-amber-300 border border-cinema-amber-500/40 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="cinema"
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            icon={<Plus className="w-4 h-4" />}
          >
            {isCreatingNew ? 'View Library' : 'Create Voice Clone'}
          </Button>
        </div>

        {/* CREATE NEW VOICE FORM */}
        {isCreatingNew ? (
          <form onSubmit={handleCreateVoice} className="p-4 rounded-2xl bg-card border border-cinema-amber-500/30 space-y-4 animate-fade-in">
            <h4 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cinema-amber-400" />
              <span>Clone or Synthesize Custom Voice Model</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Voice Model Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Uncle Raymond (1975 Cassettes)"
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:ring-2 focus:ring-cinema-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Title / Persona</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Warm Family Storyteller"
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:ring-2 focus:ring-cinema-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground"
                >
                  <option value="Family Member">Family Member</option>
                  <option value="Documentary Narrator">Documentary Narrator</option>
                  <option value="AI Voice Clone">AI Voice Clone</option>
                  <option value="Historical Voice">Historical Voice</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Accent / Dialect</label>
                <input
                  type="text"
                  value={newAccent}
                  onChange={(e) => setNewAccent(e.target.value)}
                  placeholder="e.g. New England, Midwestern, BBC English"
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe voice characteristics, timber, cadence, and heritage..."
                className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground h-20 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" type="button" onClick={() => setIsCreatingNew(false)}>
                Cancel
              </Button>
              <Button variant="cinema" type="submit" icon={<Check className="w-4 h-4" />}>
                Save Voice Model
              </Button>
            </div>
          </form>
        ) : (
          /* VOICE CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {filteredVoices.map(voice => {
              const isSelected = voice.id === selectedVoiceId;
              const isPlaying = voice.id === playingVoiceId;

              return (
                <div
                  key={voice.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-cinema-amber-500/15 border-cinema-amber-500 shadow-md ring-1 ring-cinema-amber-500/50'
                      : 'bg-card border-border/70 hover:border-cinema-amber-500/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span>{voice.name}</span>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cinema-amber-500 text-slate-950 font-bold">
                              ACTIVE
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-cinema-amber-400 font-mono">
                          {voice.title}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">
                        {voice.category}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {voice.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <span>Speed: {voice.speed}x</span>
                      <span>•</span>
                      <span>Pitch: {voice.pitch}x</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handlePlaySample(voice)}
                        icon={<Play className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-cinema-amber-400' : ''}`} />}
                      >
                        {isPlaying ? 'Playing Sample...' : 'Listen Sample'}
                      </Button>

                      {!isSelected && (
                        <Button
                          size="xs"
                          variant="cinema"
                          onClick={() => {
                            onSelectVoice(voice.id);
                            showToast('success', `Assigned voice "${voice.name}" to active scene!`);
                            onClose();
                          }}
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Use Voice
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
