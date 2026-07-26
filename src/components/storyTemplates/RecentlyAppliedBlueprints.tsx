/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppliedStoryBlueprint } from '../../types/storyTemplate';
import { Button } from '../ui/Button';
import {
  Clock,
  Clapperboard,
  ArrowRight,
  FolderCheck,
  Sparkles
} from 'lucide-react';

interface RecentlyAppliedBlueprintsProps {
  appliedList: AppliedStoryBlueprint[];
  onResumeStudio: () => void;
}

export const RecentlyAppliedBlueprints: React.FC<RecentlyAppliedBlueprintsProps> = ({
  appliedList,
  onResumeStudio,
}) => {
  if (!appliedList || appliedList.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-cinema-amber-500" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Recently Scaffolded Stories
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground/80 font-medium">
          {appliedList.length} Active Workspace Scaffolds
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {appliedList.slice(0, 3).map((blueprint, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl flex flex-col justify-between space-y-3 hover:border-cinema-amber-500/50 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="font-semibold text-cinema-amber-500 uppercase tracking-wider">
                  {blueprint.templateName}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {new Date(blueprint.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h4 className="font-display font-bold text-sm text-foreground line-clamp-1">
                {blueprint.storyTitle}
              </h4>

              <p className="text-[11px] text-muted-foreground">
                Subject: <strong className="text-foreground">{blueprint.profileName}</strong>
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                {blueprint.status}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={onResumeStudio}
                className="text-[11px] h-7 px-2.5 gap-1 font-bold"
              >
                Open Studio
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
