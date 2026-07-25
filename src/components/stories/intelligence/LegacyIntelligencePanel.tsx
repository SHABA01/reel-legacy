/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Heart,
  Calendar,
  Sparkles,
  HelpCircle,
  Share2,
  TrendingUp,
  ShieldCheck,
  Award,
  AlertTriangle,
  Search,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Brain,
  Layers,
  MapPin
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export interface LegacyIntelligencePanelProps {
  storyTitle?: string;
  characters?: any[];
  timelineEvents?: any[];
}

export function LegacyIntelligencePanel({
  storyTitle,
  characters = [],
  timelineEvents = [],
}: LegacyIntelligencePanelProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'graph' | 'completeness' | 'accuracy' | 'interviews' | 'emotional'>('graph');

  // Sample Family Relationship Nodes
  const familyNodes = [
    { name: 'Elizabeth Vance', role: 'Protagonist / Subject', relation: 'Self', avatar: '👵' },
    { name: 'Philip Vance', role: 'Spouse (m. 1966)', relation: 'Husband', avatar: '👴' },
    { name: 'Arthur Vance', role: 'Father (1910–1988)', relation: 'Father', avatar: '🧔' },
    { name: 'Evelyn Vance', role: 'Mother (1915–2002)', relation: 'Mother', avatar: '👩' },
    { name: 'Sarah Vance-Miller', role: 'Daughter (b. 1970)', relation: 'Child', avatar: '👩‍🦰' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-6 shadow-xl" id="legacy-intelligence-root">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
              HERITAGE INTELLIGENCE ENGINE
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              CapCut-Exceeding Legacy Analytics
            </span>
          </div>
          <h3 className="font-display text-base font-black text-foreground uppercase tracking-wider mt-1 flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-500" /> Legacy Story Intelligence & Heritage Graph
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Biographical completeness scoring, generational relationship maps, emotional journey curves, and historical accuracy validation.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center gap-1 bg-background border border-border p-1 rounded-xl">
          {[
            { id: 'graph', label: 'Relationship Map', icon: Users },
            { id: 'completeness', label: 'Completeness', icon: ShieldCheck },
            { id: 'accuracy', label: 'Historical Check', icon: Calendar },
            { id: 'interviews', label: 'Interview Generator', icon: MessageSquare },
            { id: 'emotional', label: 'Emotional Journey', icon: TrendingUp },
          ].map((tb) => {
            const Icon = tb.icon;
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: RELATIONSHIP GRAPH */}
      {activeTab === 'graph' && (
        <div className="space-y-4">
          <div className="p-6 bg-background border border-border rounded-xl space-y-4 text-center">
            <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-amber-500" /> Generational Family & Relationship Connection Map
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {familyNodes.map((node, i) => (
                <div
                  key={i}
                  className="p-4 bg-card border border-border rounded-xl space-y-2 text-center hover:border-amber-500/50 transition-all cursor-pointer group"
                  onClick={() => showToast('info', 'Family Node Selected', `${node.name} (${node.relation})`)}
                >
                  <div className="text-3xl">{node.avatar}</div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-foreground group-hover:text-amber-400 transition-colors">
                      {node.name}
                    </h5>
                    <span className="text-[10px] font-mono text-amber-400/90 block font-bold">{node.relation}</span>
                    <span className="text-[10px] text-muted-foreground">{node.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMORY COMPLETENESS SCORE */}
      {activeTab === 'completeness' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Childhood & Youth', score: '90%', status: 'Complete' },
              { label: 'Higher Education', score: '100%', status: 'Complete' },
              { label: 'Career & Salem Center', score: '85%', status: 'Rich' },
              { label: 'Late Years & Retirement', score: '40%', status: 'Gap Detected' },
            ].map((st, i) => (
              <div key={i} className="p-4 bg-background border border-border rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block">{st.label}</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold text-amber-400">{st.score}</span>
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                    {st.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HISTORICAL ACCURACY CHECKER */}
      {activeTab === 'accuracy' && (
        <div className="p-6 bg-background border border-border rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Historical Context & Date Alignment
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              100% Chronology Passed
            </span>
          </div>

          <div className="space-y-3">
            {[
              { date: '1944', event: 'Casco Bay Birth', context: 'Matches WWII Eastern Seaboard maritime record archives.' },
              { date: '1966', event: 'Mount Holyoke Graduation', context: 'Matches Mount Holyoke Commencement Registrar records.' },
              { date: '1974', event: 'Salem Literacy Center Launch', context: 'Matches Salem City Charter non-profit registration filing.' },
            ].map((ev, idx) => (
              <div key={idx} className="p-3 bg-card border border-border rounded-lg flex items-center gap-3 text-xs">
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">{ev.date}</span>
                <div>
                  <span className="font-bold text-foreground block">{ev.event}</span>
                  <span className="text-muted-foreground">{ev.context}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTERVIEW RECOMMENDATION ENGINE */}
      {activeTab === 'interviews' && (
        <div className="p-6 bg-background border border-border rounded-xl space-y-4">
          <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" /> Recommended Family Interview Questions
          </h4>

          <div className="space-y-3">
            {[
              '“What did Elizabeth always say about her parents’ watercolors in the living room?”',
              '“How did Philip and Elizabeth meet in Salem during the autumn of 1966?”',
              '“What was the most rewarding moment during the 30th Anniversary of the Salem Literacy Center?”',
            ].map((q, idx) => (
              <div key={idx} className="p-3 bg-card border border-border rounded-lg flex items-center justify-between text-xs">
                <span className="text-foreground italic">{q}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => showToast('success', 'Question Copied', 'Copied question to interview guide.')}
                  className="text-amber-400 hover:bg-amber-500/10 shrink-0"
                >
                  Copy Question
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EMOTIONAL JOURNEY GRAPH */}
      {activeTab === 'emotional' && (
        <div className="p-6 bg-background border border-border rounded-xl space-y-4 text-center">
          <h4 className="font-display text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" /> Emotional Journey Curve Across Life Arc
          </h4>

          {/* SVG Spline Preview */}
          <div className="h-40 w-full bg-card/60 border border-border rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 100">
              <path
                d="M 10 80 Q 100 20, 200 60 T 350 20 T 490 70"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute bottom-2 left-4 text-[10px] font-mono text-muted-foreground">1944 (Birth)</div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-400 font-bold">1974 (Literacy Center Triumph)</div>
            <div className="absolute bottom-2 right-4 text-[10px] font-mono text-muted-foreground">2011 (Legacy)</div>
          </div>
        </div>
      )}
    </div>
  );
}
