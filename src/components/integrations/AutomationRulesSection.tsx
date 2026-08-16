/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Sliders,
  Bell,
  HardDrive,
  Mic,
  Users,
} from 'lucide-react';
import { AutomationRule } from './integrationTypes';
import { Button } from '../ui/Button';

interface AutomationRulesSectionProps {
  rules: AutomationRule[];
  onToggleRule: (ruleId: string) => void;
  onRunRule: (rule: AutomationRule) => void;
  onCreateRule: () => void;
}

export function AutomationRulesSection({
  rules,
  onToggleRule,
  onRunRule,
  onCreateRule,
}: AutomationRulesSectionProps) {
  return (
    <div id="automation-rules-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              WORKFLOW AUTOMATIONS
            </span>
            <span className="text-xs font-mono text-muted-foreground">Event Triggers & Pipeline Sync</span>
          </div>
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 mt-1">
            <Zap className="w-5 h-5 text-amber-500" /> Automated Integration Rules
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure automated actions that execute silently in the background when documentary milestones, renders, or narrations finish.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCreateRule}
          className="cursor-pointer border-border hover:border-cinema-amber-500 text-xs font-semibold shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-cinema-amber-500" /> Create Automation Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`border rounded-2xl p-4 sm:p-5 bg-card/60 space-y-3 transition-all ${
              rule.enabled
                ? 'border-amber-500/30 bg-amber-500/5'
                : 'border-border/80 opacity-75'
            }`}
          >
            {/* Header: Title & Toggle */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-amber-500/10 text-amber-500 border-amber-500/20">
                    {rule.category}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Ran {rule.runCount} times</span>
                </div>
                <h3 className="font-display font-bold text-sm text-foreground">{rule.title}</h3>
              </div>

              {/* Enable / Disable Switch */}
              <button
                onClick={() => onToggleRule(rule.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rule.enabled ? 'bg-amber-500' : 'bg-muted'
                }`}
                title={rule.enabled ? 'Disable Automation Rule' : 'Enable Automation Rule'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>

            {/* Event Flow Badge */}
            <div className="p-2.5 bg-muted/40 border border-border/60 rounded-xl flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {rule.triggerEvent}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-cinema-amber-500 shrink-0 mx-2" />
              <span className="text-foreground font-semibold flex items-center gap-1.5 truncate">
                {rule.actionService}
              </span>
            </div>

            {/* Card Footer: Last Run & Run Now Button */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>Last Run: {rule.lastRun || 'Never'}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onRunRule(rule)}
                disabled={!rule.enabled}
                className="cursor-pointer text-xs font-semibold border-border hover:border-amber-500 text-foreground py-1 h-7"
              >
                <Play className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" /> Run Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
