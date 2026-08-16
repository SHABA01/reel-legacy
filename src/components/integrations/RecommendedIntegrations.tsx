/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  HardDrive,
  Globe,
  Mic,
  Users,
  Video,
  Check,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { IntegrationProvider } from './integrationTypes';
import { Button } from '../ui/Button';

interface RecommendedIntegrationsProps {
  providers: IntegrationProvider[];
  onSelectProvider: (provider: IntegrationProvider) => void;
  onConnectProvider: (provider: IntegrationProvider) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HardDrive,
  Globe,
  Mic,
  Sparkles,
  Users,
  Video,
};

export function RecommendedIntegrations({
  providers,
  onSelectProvider,
  onConnectProvider,
}: RecommendedIntegrationsProps) {
  const recommendedList = providers.filter((p) => p.isRecommended);

  return (
    <div id="recommended-integrations-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cinema-amber-500 bg-cinema-amber-500/10 px-2 py-0.5 rounded border border-cinema-amber-500/20">
              FEATURED CONNECTORS
            </span>
            <span className="text-xs font-mono text-muted-foreground">Tailored for Heritage Storytelling</span>
          </div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mt-1">
            <Sparkles className="w-5 h-5 text-cinema-amber-500" /> Recommended Storytelling Integrations
          </h2>
          <p className="text-xs text-muted-foreground">
            Connect high-impact cloud storage repositories, neural voice synthesizers, and genealogical archives to elevate documentary output.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedList.map((item) => {
          const IconComponent = ICON_MAP[item.iconName] || HardDrive;
          const isConnected = item.status === 'connected';

          return (
            <div
              key={item.id}
              className={`border rounded-2xl p-5 bg-card/60 flex flex-col justify-between gap-4 hover:border-cinema-amber-500/50 transition-all duration-200 ${
                isConnected
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-border hover:bg-muted/20'
              }`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${item.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.category}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Available'}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.tagline}
                </p>

                {/* Key Benefits List */}
                <ul className="space-y-1.5 pt-1">
                  {item.benefits.map((b, idx) => (
                    <li key={idx} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cinema-amber-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted/60 border border-border">
                    {item.setupDifficulty}
                  </span>
                  <span>{item.setupTimeMinutes} min setup</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectProvider(item)}
                    className="cursor-pointer text-xs font-semibold border-border hover:border-cinema-amber-500 px-2.5"
                  >
                    Details
                  </Button>

                  <Button
                    variant={isConnected ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => onConnectProvider(item)}
                    className={`cursor-pointer text-xs font-semibold ${
                      isConnected
                        ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        : 'bg-cinema-amber-500 text-slate-950 hover:bg-cinema-amber-400'
                    }`}
                  >
                    {isConnected ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
