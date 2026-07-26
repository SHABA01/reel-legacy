/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, HardDrive, Wifi, ShieldCheck, CheckCircle2, Server, Layers } from 'lucide-react';

export function SystemHealthSection() {
  const systemNodes = [
    {
      name: 'Gemini 2.5 Flash API',
      category: 'AI Logic & Scripting',
      status: 'Operational',
      latency: '240 ms',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'GPU Render Cluster (Node A-C)',
      category: '4K H.264 / ProRes Export',
      status: '3/3 Active',
      latency: '0.8x Real-time',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Offline Local IndexedDB Vault',
      category: 'Client Storage Engine',
      status: 'Healthy',
      latency: '2 ms',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Voice Narration Synthesizer',
      category: 'Oral Audio Pipeline',
      status: 'Operational',
      latency: '180 ms',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Archival Search & Vector Index',
      category: 'Media Tagging & Retrieval',
      status: '100% Indexed',
      latency: '12 ms',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Cloud Backup & Sync Service',
      category: 'Remote Replication',
      status: 'In Sync',
      latency: '0 Pending',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div id="system-health-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" /> Infrastructure & System Health Telemetry
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time status of local database vaults, AI processing nodes, export rendering engines, and background indexing.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> All Services Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {systemNodes.map((node, idx) => (
          <div
            key={idx}
            className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2 hover:border-border transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
                {node.category}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${node.statusColor}`}>
                {node.status}
              </span>
            </div>
            <strong className="block text-sm font-display font-bold text-foreground">{node.name}</strong>
            <div className="flex justify-between items-center text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/40">
              <span>Avg Latency:</span>
              <span className="text-foreground font-semibold">{node.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
