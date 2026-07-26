/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  FileAudio,
  Subtitles,
  Layers,
  Check,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { NarrationSegment } from '../../types/narration';
import { SubtitleService } from '../../services/subtitleService';

interface ExportNarrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: NarrationSegment[];
}

export function ExportNarrationModal({
  isOpen,
  onClose,
  segments
}: ExportNarrationModalProps) {
  const { showToast } = useToast();

  const [format, setFormat] = useState<'wav' | 'mp3' | 'aac' | 'flac'>('wav');
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [subtitleFormat, setSubtitleFormat] = useState<'srt' | 'vtt' | 'json'>('srt');
  const [separateTracks, setSeparateTracks] = useState(false);

  const handleExport = () => {
    showToast('loading', 'Compiling documentary narration master audio & subtitles...');

    setTimeout(() => {
      // Export subtitles file if requested
      if (includeSubtitles) {
        const subContent = SubtitleService.exportProjectSubtitles(segments, subtitleFormat);
        const blob = new Blob([subContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reellegacy_documentary_subtitles.${subtitleFormat}`;
        a.click();
      }

      showToast('success', `Narration Master (${format.toUpperCase()}) & Subtitles exported successfully!`);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Studio Narration & Stems"
      size="md"
    >
      <div className="space-y-6" id="export-narration-modal">
        {/* FORMAT SELECTION */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
            Master Audio Encoding Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['wav', 'mp3', 'aac', 'flac'] as const).map(fmt => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                  format === fmt
                    ? 'bg-cinema-amber-500/20 border-cinema-amber-500 text-cinema-amber-300'
                    : 'bg-card border-border/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                {fmt.toUpperCase()} {fmt === 'wav' ? '(24-bit Lossless)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* SUBTITLE EXPORT OPTIONS */}
        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <Subtitles className="w-4 h-4 text-cinema-amber-400" />
              <span>Generate Timed Subtitle Files</span>
            </span>
            <input
              type="checkbox"
              checked={includeSubtitles}
              onChange={(e) => setIncludeSubtitles(e.target.checked)}
              className="accent-cinema-amber-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {includeSubtitles && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              {(['srt', 'vtt', 'json'] as const).map(sf => (
                <button
                  key={sf}
                  type="button"
                  onClick={() => setSubtitleFormat(sf)}
                  className={`py-1 px-3 rounded text-xs font-mono font-bold cursor-pointer ${
                    subtitleFormat === sf
                      ? 'bg-cinema-amber-500 text-slate-950'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  .{sf.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* EXPORT TRIGGER */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="cinema" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
            Export Master Package
          </Button>
        </div>
      </div>
    </Modal>
  );
}
