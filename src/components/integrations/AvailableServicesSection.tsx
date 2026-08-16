/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  HardDrive,
  Globe,
  Mic,
  Sparkles,
  Users,
  Video,
  Radio,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { IntegrationProvider, IntegrationCategory } from './integrationTypes';
import { Button } from '../ui/Button';

interface AvailableServicesSectionProps {
  providers: IntegrationProvider[];
  onSelectProvider: (provider: IntegrationProvider) => void;
  onConnectProvider: (provider: IntegrationProvider) => void;
}

const CATEGORIES: IntegrationCategory[] = [
  'All',
  'Cloud Storage',
  'AI Providers',
  'Genealogy',
  'Media Libraries',
  'Video Platforms',
  'Communication',
  'Automation',
  'Developer APIs',
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HardDrive,
  Globe,
  Mic,
  Sparkles,
  Users,
  Video,
  Radio,
  Zap,
  Cpu,
};

export function AvailableServicesSection({
  providers,
  onSelectProvider,
  onConnectProvider,
}: AvailableServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // Exclude already connected
      if (p.status === 'connected') return false;

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [providers, selectedCategory, searchQuery]);

  return (
    <div id="available-services-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              SERVICE CATALOG ({filteredProviders.length})
            </span>
            <span className="text-xs font-mono text-muted-foreground">Discover & Connect</span>
          </div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mt-1">
            <Layers className="w-5 h-5 text-blue-400" /> Available External Connectors
          </h2>
          <p className="text-xs text-muted-foreground">
            Explore cloud storage adapters, genealogy databases, communication bots, and developer APIs ready for activation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search connectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cinema-amber-500"
          />
        </div>
      </div>

      {/* Lightweight Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cinema-amber-500 text-slate-950 shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filteredProviders.length === 0 ? (
        <div className="p-8 text-center bg-muted/20 border border-border/60 rounded-xl space-y-2">
          <Filter className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">No integrations match your search filters.</p>
          <p className="text-xs text-muted-foreground">Try selecting "All" or clearing the search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((item) => {
            const IconComponent = ICON_MAP[item.iconName] || HardDrive;

            return (
              <div
                key={item.id}
                className="border border-border/80 rounded-2xl p-5 bg-card/60 flex flex-col justify-between gap-4 hover:border-blue-500/50 hover:bg-muted/20 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${item.iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-foreground">{item.name}</h3>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.category}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-muted text-muted-foreground border-border">
                      {item.setupDifficulty}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ~{item.setupTimeMinutes} min setup
                  </span>

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
                      variant="default"
                      size="sm"
                      onClick={() => onConnectProvider(item)}
                      className="cursor-pointer text-xs font-semibold bg-cinema-amber-500 text-slate-950 hover:bg-cinema-amber-400"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
