/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckCircle2,
  HardDrive,
  Globe,
  Mic,
  Sparkles,
  Users,
  Video,
  RefreshCw,
  ShieldCheck,
  Settings,
  Power,
  Activity,
  Lock,
} from 'lucide-react';
import { IntegrationProvider } from './integrationTypes';
import { Button } from '../ui/Button';

interface ConnectedServicesSectionProps {
  providers: IntegrationProvider[];
  onSelectProvider: (provider: IntegrationProvider) => void;
  onDisconnectProvider: (provider: IntegrationProvider) => void;
  onTestConnection: (provider: IntegrationProvider) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HardDrive,
  Globe,
  Mic,
  Sparkles,
  Users,
  Video,
};

export function ConnectedServicesSection({
  providers,
  onSelectProvider,
  onDisconnectProvider,
  onTestConnection,
}: ConnectedServicesSectionProps) {
  const connectedList = providers.filter((p) => p.status === 'connected');

  if (connectedList.length === 0) {
    return (
      <div id="connected-services-section" className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
        <ShieldCheck className="w-8 h-8 text-muted-foreground mx-auto" />
        <h3 className="font-display font-bold text-base text-foreground">No Connected External Services</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Connect your Google Drive, Google Photos, or ElevenLabs voice engine below to start automated backups and voice synthesis.
        </p>
      </div>
    );
  }

  return (
    <div id="connected-services-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ACTIVE CONNECTIONS ({connectedList.length})
            </span>
            <span className="text-xs font-mono text-muted-foreground">Monitored OAuth Sessions</span>
          </div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mt-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Connected Workspace Services
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage account credentials, sync health, granted permissions, and connection probe diagnostics for active integrations.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {connectedList.map((item) => {
          const IconComponent = ICON_MAP[item.iconName] || HardDrive;

          return (
            <div
              key={item.id}
              className="p-5 bg-muted/20 border border-emerald-500/30 rounded-2xl space-y-4 hover:border-emerald-500/50 transition-all"
            >
              {/* Top Row: Provider Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${item.iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-foreground">{item.name}</h3>
                      <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.tagline}</p>
                  </div>
                </div>

                {/* Account info & last sync */}
                <div className="text-right text-xs font-mono space-y-0.5 self-start md:self-auto">
                  <span className="text-foreground font-semibold block">{item.connectedAccount || 'Account Synced'}</span>
                  <span className="text-muted-foreground text-[11px] block">Last Sync: {item.lastSyncTime}</span>
                </div>
              </div>

              {/* Middle Row: Sync Health Bar & Permissions Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Sync Frequency & Storage */}
                <div className="space-y-1.5 p-3 bg-muted/40 rounded-xl border border-border/60">
                  <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Sync Frequency & Storage</span>
                  <div className="flex justify-between font-mono pt-0.5">
                    <span className="text-muted-foreground">Frequency:</span>
                    <strong className="text-foreground">{item.syncFrequency || 'Real-time'}</strong>
                  </div>
                  {item.storageUsedMb !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Vault Usage:</span>
                      <strong className="text-cyan-400">{(item.storageUsedMb / 1024).toFixed(2)} GB</strong>
                    </div>
                  )}
                </div>

                {/* Permissions Granted */}
                <div className="md:col-span-2 space-y-1.5 p-3 bg-muted/40 rounded-xl border border-border/60">
                  <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> Permissions Granted
                  </span>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {item.permissionsCanAccess[0]}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTestConnection(item)}
                    className="cursor-pointer text-xs font-semibold border-border hover:border-emerald-500 text-foreground"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Test Connection
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectProvider(item)}
                    className="cursor-pointer text-xs font-semibold border-border hover:border-cinema-amber-500"
                  >
                    <Settings className="w-3.5 h-3.5 mr-1.5 text-cinema-amber-500" /> Configure Settings
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDisconnectProvider(item)}
                  className="cursor-pointer text-xs font-semibold border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                >
                  <Power className="w-3.5 h-3.5 mr-1.5" /> Disconnect
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
