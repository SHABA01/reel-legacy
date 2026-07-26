/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { RenderJob, RenderType, RenderResolution, OutputFormat } from '../../types/render';
import { OutputProfileService } from '../../services/outputProfileService';
import { Film, Sparkles, Clock, Sliders, Calendar } from 'lucide-react';

interface NewRenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobData: Partial<RenderJob>) => void;
}

export const NewRenderModal: React.FC<NewRenderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const profileService = OutputProfileService.getInstance();
  const profiles = profileService.getProfiles();

  const [storyName, setStoryName] = useState('The Miller Family Chronicles');
  const [version, setVersion] = useState('v2.5 (Director Cut)');
  const [type, setType] = useState<RenderType>('documentary');
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || 'profile-1080p-doc');
  const [priority, setPriority] = useState<RenderJob['priority']>('normal');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onConfirm({
      storyName,
      version,
      type,
      resolution: selectedProfile.resolution,
      format: selectedProfile.format,
      priority,
      profileName: selectedProfile.name,
      scheduledFor: isScheduled && scheduleTime ? scheduleTime : undefined,
      status: isScheduled ? 'scheduled' : 'queued',
      durationSec: 1200,
      outputFileSizeMB: 2200,
    });

    onClose();
  };

  return (
    <Modal
      id="new-render-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Production Render"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <p className="text-xs text-muted-foreground">
          Select a story project, configure export resolution & priority, and trigger the ReelLegacy production pipeline.
        </p>

        {/* Story Project & Version */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="new-render-story-name"
            label="Story Title"
            value={storyName}
            onChange={(e) => setStoryName(e.target.value)}
            placeholder="e.g. Miller Family Chronicles"
            required
          />

          <Input
            id="new-render-version"
            label="Version Tag"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. v2.5 Final Cut"
            required
          />
        </div>

        {/* Render Type & Output Profile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Render Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RenderType)}
              className="w-full p-2.5 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
            >
              <option value="documentary">Full Documentary Video</option>
              <option value="trailer">Cinema Trailer / Teaser</option>
              <option value="vertical_reel">9:16 Short Vertical Reel</option>
              <option value="audio_podcast">Audio Podcast (MP3/WAV)</option>
              <option value="memoir_pdf">Print Memoir PDF</option>
              <option value="zip_archive">Full Studio Package (ZIP)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Export Profile Preset
            </label>
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full p-2.5 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.resolution} • {p.format})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profile Details Badge */}
        {selectedProfile && (
          <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>{selectedProfile.name}</span>
              <span className="text-cinema-amber-500 font-mono">
                {selectedProfile.resolution} • {selectedProfile.format}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {selectedProfile.description}
            </p>
          </div>
        )}

        {/* Priority & Scheduling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2.5 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-cinema-amber-500 cursor-pointer"
            >
              <option value="urgent">Urgent (Immediate GPU)</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal Queue</option>
              <option value="low">Low (Overnight / Off-peak)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Schedule Execution
            </label>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="schedule-toggle"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
              />
              <label htmlFor="schedule-toggle" className="text-xs text-foreground font-medium cursor-pointer">
                Run Overnight or Later
              </label>
            </div>
            {isScheduled && (
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full mt-1.5 p-2 text-xs bg-background border border-border rounded-xl text-foreground"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5"
          >
            <Film className="w-4 h-4" />
            Queue Production Render
          </Button>
        </div>
      </form>
    </Modal>
  );
};
