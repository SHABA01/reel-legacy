/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from '../ui/Button';
import {
  Share2,
  HardDrive,
  Cloud,
  Download,
  Link,
  CheckCircle2,
  Lock,
  Globe,
  Youtube,
  Tv,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const PublishingTargetsSection: React.FC = () => {
  const destinations = [
    {
      id: 'local_download',
      name: 'Local Workstation Download',
      type: 'Direct File',
      status: 'Ready',
      icon: <Download className="w-5 h-5 text-cinema-amber-500" />,
      description: 'Export directly to local disk array in H.264 / ProRes 422.',
      stats: 'Instant Download',
      isDefault: true,
    },
    {
      id: 'family_vault',
      name: 'Family Vault Cloud Archive',
      type: 'Private Cloud Storage',
      status: 'Connected',
      icon: <HardDrive className="w-5 h-5 text-purple-400" />,
      description: 'High-durability encrypted archive for future generations.',
      stats: '84.2 GB / 100 GB Free',
      isDefault: true,
    },
    {
      id: 'private_share',
      name: 'Private Family Stream Link',
      type: 'Secure Web Link',
      status: 'Active',
      icon: <Link className="w-5 h-5 text-blue-400" />,
      description: 'Passcode-protected streaming link with password control.',
      stats: '12 Active Links',
      isDefault: false,
    },
    {
      id: 'google_drive',
      name: 'Google Drive Backup',
      type: 'Cloud Sync',
      status: 'Connected',
      icon: <Cloud className="w-5 h-5 text-emerald-400" />,
      description: 'Auto-sync master MP4 & subtitle SRT packages to Drive.',
      stats: 'Auto-Sync Enabled',
      isDefault: false,
    },
    {
      id: 'vimeo_youtube',
      name: 'YouTube & Vimeo Direct Publish',
      type: 'Public / Unlisted Video',
      status: 'Configured',
      icon: <Youtube className="w-5 h-5 text-rose-400" />,
      description: 'Push finished documentary cuts with auto-generated chapters.',
      stats: '4 Videos Exported',
      isDefault: false,
    },
    {
      id: 'cold_archive',
      name: 'Glacier Long-Term Preservation',
      type: 'Cold Vault',
      status: 'Available',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      description: 'Multi-region checksum preservation for master RAW assets.',
      stats: 'Zero Loss SLA',
      isDefault: false,
    },
  ];

  return (
    <div className="space-y-4" id="publishing-targets-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Export Publishing Targets & Destinations
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure target vaults, cloud sync backups, streaming links, and distribution channels.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="p-4 rounded-2xl bg-card border border-border hover:border-cinema-amber-500/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-muted/60 border border-border">
                  {dest.icon}
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {dest.status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground">{dest.name}</h4>
                <p className="text-[10px] text-cinema-amber-500 font-medium">{dest.type}</p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {dest.description}
              </p>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                {dest.stats}
              </span>

              <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                Configure
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
