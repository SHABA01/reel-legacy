/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  RefreshCw,
  HardDrive,
  Settings,
  Activity,
  History,
  CheckCircle2,
  Power,
  ExternalLink,
  Zap,
  Check,
  AlertTriangle,
  Key,
  Globe,
} from 'lucide-react';
import { IntegrationProvider } from './integrationTypes';
import { Button } from '../ui/Button';

interface ServiceDetailModalProps {
  provider: IntegrationProvider | null;
  onClose: () => void;
  onConnect: (provider: IntegrationProvider) => void;
  onDisconnect: (provider: IntegrationProvider) => void;
  onTestConnection: (provider: IntegrationProvider) => void;
}

type ModalTab = 'overview' | 'permissions' | 'sync' | 'storage' | 'activity' | 'advanced';

export function ServiceDetailModal({
  provider,
  onClose,
  onConnect,
  onDisconnect,
  onTestConnection,
}: ServiceDetailModalProps) {
  if (!provider) return null;

  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [syncFreq, setSyncFreq] = useState(provider.syncFrequency || 'Real-time');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');

  const isConnected = provider.status === 'connected';

  return (
    <div
      id="service-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="service-detail-modal-card"
        className="bg-card border border-border rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden text-foreground space-y-0 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border ${provider.iconColor}`}>
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl text-foreground">{provider.name}</h2>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{provider.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Close Details Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 border-b border-border bg-card overflow-x-auto text-xs font-mono">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'permissions', label: 'Permissions Transparency' },
            { id: 'sync', label: 'Sync Options' },
            { id: 'storage', label: 'Storage & Bandwidth' },
            { id: 'activity', label: 'Activity Logs' },
            { id: 'advanced', label: 'Advanced Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ModalTab)}
              className={`py-3 px-3 font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cinema-amber-500 text-cinema-amber-500 bg-cinema-amber-500/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Tab Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 text-xs">
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-foreground">Service Description</h3>
                <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
              </div>

              {/* Account Status Box */}
              <div className="p-4 bg-muted/30 border border-border/60 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-muted-foreground uppercase text-[10px]">Connected Account</span>
                  <span className="font-mono font-semibold text-foreground">{provider.connectedAccount || 'Not Connected'}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/40 font-mono">
                  <span className="text-muted-foreground">Sync Frequency:</span>
                  <span className="text-cinema-amber-500 font-semibold">{provider.syncFrequency || 'Real-time'}</span>
                </div>
                <div className="flex justify-between items-center pt-1 font-mono">
                  <span className="text-muted-foreground">Version SDK:</span>
                  <span className="text-muted-foreground">{provider.version}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-foreground">Key Integration Benefits</h3>
                <ul className="space-y-2">
                  {provider.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-cinema-amber-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: PERMISSIONS TRANSPARENCY */}
          {activeTab === 'permissions' && (
            <div className="space-y-5 text-xs">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
                <span className="font-mono font-bold text-blue-400 uppercase text-[10px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Privacy & Security Commitment
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  ReelLegacy uses strict OAuth 2.0 least-privilege scoping. We only request permissions necessary to execute your story backups and media imports.
                </p>
              </div>

              {/* What We CAN Access */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> What ReelLegacy CAN Access
                </h3>
                <ul className="space-y-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5">
                  {provider.permissionsCanAccess.map((perm, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We CANNOT Access */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-rose-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> What ReelLegacy CANNOT Access
                </h3>
                <ul className="space-y-2 bg-rose-500/5 border border-rose-500/20 rounded-xl p-3.5">
                  {provider.permissionsCannotAccess.map((perm, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* OAuth Scopes */}
              {provider.oauthScopes && (
                <div className="space-y-1.5 font-mono">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">OAuth 2.0 Scopes Granted</span>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.oauthScopes.map((scope, idx) => (
                      <span key={idx} className="bg-muted px-2.5 py-1 rounded border border-border text-xs text-cinema-amber-400">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SYNC OPTIONS */}
          {activeTab === 'sync' && (
            <div className="space-y-5 text-xs">
              <div className="space-y-3 p-4 bg-muted/20 border border-border/60 rounded-xl">
                <h3 className="font-display font-bold text-sm text-foreground">Sync Schedule & Cadence</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  {(['Real-time', 'Hourly', 'Daily', 'Manual'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setSyncFreq(freq)}
                      className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                        syncFreq === freq
                          ? 'bg-cinema-amber-500 text-slate-950 border-cinema-amber-500'
                          : 'bg-muted/60 text-muted-foreground hover:text-foreground border-border'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">Automatic 4K Master Video Backup</h4>
                  <p className="text-xs text-muted-foreground">Upload finished documentary exports silently upon render completion.</p>
                </div>
                <button
                  onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoBackupEnabled ? 'bg-cinema-amber-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoBackupEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: STORAGE & BANDWIDTH */}
          {activeTab === 'storage' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Storage Vault Quota</span>
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Synced: 1.24 GB</span>
                  <span className="text-muted-foreground">Unlimited Quota</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[12%] rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Target Cloud Folder</span>
                <p className="text-foreground font-bold text-xs">/My Drive/ReelLegacy_Archival_Vault/</p>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY LOGS */}
          {activeTab === 'activity' && (
            <div className="space-y-3 text-xs font-mono">
              <h3 className="font-display font-bold text-sm text-foreground">Recent Provider Event Logs</h3>
              <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">✓ Master Video Backup Uploaded</span>
                  <span className="text-muted-foreground">12 mins ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-sans">
                  Grandpa_WWII_Memoir_4K_Master.mp4 (1.2 GB) synchronized cleanly to cloud storage.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: ADVANCED SETTINGS */}
          {activeTab === 'advanced' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-mono font-bold text-muted-foreground uppercase text-[10px] block">
                  Custom Notification Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://hooks.slack.com/services/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-cinema-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-rose-400">Revoke OAuth Credentials</h4>
                  <p className="text-xs text-muted-foreground">Remove stored access tokens and stop background syncs.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDisconnect(provider)}
                  className="cursor-pointer border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
                >
                  Revoke Credentials
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTestConnection(provider)}
            disabled={!isConnected}
            className="cursor-pointer border-border hover:border-emerald-500 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Test Connection
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer border-border text-xs font-semibold"
            >
              Close
            </Button>

            <Button
              variant={isConnected ? 'outline' : 'default'}
              size="sm"
              onClick={() => {
                if (isConnected) {
                  onDisconnect(provider);
                } else {
                  onConnect(provider);
                }
              }}
              className={`cursor-pointer text-xs font-semibold ${
                isConnected
                  ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                  : 'bg-cinema-amber-500 text-slate-950 hover:bg-cinema-amber-400'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect Service'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
