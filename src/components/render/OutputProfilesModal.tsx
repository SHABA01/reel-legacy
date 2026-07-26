/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OutputProfileService } from '../../services/outputProfileService';
import { OutputProfile, RenderType, RenderResolution, OutputFormat } from '../../types/render';
import { Sliders, Plus, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface OutputProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutputProfilesModal: React.FC<OutputProfilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const service = OutputProfileService.getInstance();
  const [profiles, setProfiles] = useState<OutputProfile[]>(() => service.getProfiles());
  const [isCreating, setIsCreating] = useState(false);

  // New Profile Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RenderType>('documentary');
  const [resolution, setResolution] = useState<RenderResolution>('1080p');
  const [format, setFormat] = useState<OutputFormat>('MP4 (H.264)');
  const [fps, setFps] = useState(30);
  const [bitrate, setBitrate] = useState(25);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    service.addProfile({
      name,
      description,
      type,
      resolution,
      format,
      fps,
      bitrateMbps: bitrate,
      audioBitrateKbps: 320,
    });

    setProfiles(service.getProfiles());
    setIsCreating(false);
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    service.deleteProfile(id);
    setProfiles(service.getProfiles());
  };

  const handleResetDefaults = () => {
    service.resetDefaults();
    setProfiles(service.getProfiles());
  };

  return (
    <Modal
      id="output-profiles-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Export Profiles & Presets"
      size="lg"
    >
      <div className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Manage hardware encoding presets, video resolutions, bitrates, and audio parameters for production exports.
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetDefaults}
              className="text-xs gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsCreating(!isCreating)}
              className="bg-cinema-amber-500 text-black font-bold text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              New Profile
            </Button>
          </div>
        </div>

        {/* Create Profile Sub-form */}
        {isCreating && (
          <form onSubmit={handleCreate} className="p-4 bg-muted/30 border border-cinema-amber-500/30 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-cinema-amber-500 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Create Custom Profile
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="profile-name"
                label="Profile Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 4K Master Broadcast"
                required
              />
              <Input
                id="profile-desc"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High bitrate ProRes preset"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 text-xs bg-background border border-border rounded-xl text-foreground"
                >
                  <option value="documentary">Documentary</option>
                  <option value="trailer">Trailer</option>
                  <option value="vertical_reel">Vertical Reel</option>
                  <option value="audio_podcast">Podcast</option>
                  <option value="memoir_pdf">Memoir PDF</option>
                  <option value="zip_archive">ZIP Archive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="w-full p-2 text-xs bg-background border border-border rounded-xl text-foreground"
                >
                  <option value="1080p">1080p</option>
                  <option value="4K">4K Ultra HD</option>
                  <option value="9:16 HD">9:16 Vertical HD</option>
                  <option value="720p">720p</option>
                  <option value="Audio Only">Audio Only</option>
                  <option value="Print PDF">Print PDF</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full p-2 text-xs bg-background border border-border rounded-xl text-foreground"
                >
                  <option value="MP4 (H.264)">MP4 (H.264)</option>
                  <option value="ProRes 422">ProRes 422</option>
                  <option value="WebM">WebM</option>
                  <option value="MP3">MP3</option>
                  <option value="PDF">PDF</option>
                  <option value="ZIP">ZIP</option>
                </select>
              </div>

              <Input
                id="profile-bitrate"
                label="Bitrate (Mbps)"
                type="number"
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-cinema-amber-500 text-black font-bold">
                Save Profile
              </Button>
            </div>
          </form>
        )}

        {/* Profiles List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2 hover:border-cinema-amber-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    {p.name}
                    {p.isDefault && (
                      <span className="text-[10px] font-bold text-cinema-amber-500 bg-cinema-amber-500/10 px-1.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                    {p.description}
                  </p>
                </div>

                {p.isCustom && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-border/60 text-[10px] font-mono text-muted-foreground">
                <span>Res: <strong className="text-foreground">{p.resolution}</strong></span>
                <span>Fmt: <strong className="text-foreground">{p.format}</strong></span>
                {p.fps > 0 && <span>FPS: <strong className="text-foreground">{p.fps}</strong></span>}
                {p.bitrateMbps > 0 && <span>Bitrate: <strong className="text-foreground">{p.bitrateMbps}Mbps</strong></span>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
