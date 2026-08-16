/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import {
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Film,
  Calendar,
  Layers,
  Clock,
  ArrowRight,
  Cpu,
  CheckCircle2,
  ChevronRight,
  Plus,
  Play,
  Mic,
  ListTodo,
  Zap,
  HardDrive,
  Video,
  Link2,
  Sliders,
  UserPlus,
  UserCheck,
} from 'lucide-react';

/* ==================================================================== */
/* 1. HERO MISSION OVERVIEW COMPONENT                                   */
/* ==================================================================== */
export interface MissionOverviewHeroProps {
  displayName: string;
  onConsultAi: () => void;
  onSelectKpi: (type: string, data: any) => void;
}

export function MissionOverviewHero({
  displayName,
  onConsultAi,
  onSelectKpi,
}: MissionOverviewHeroProps) {
  const navigate = useNavigate();

  const kpis = [
    {
      id: 'kpi-stories',
      label: 'Stories in Progress',
      value: '8 Active',
      subtext: '3 ready for render',
      icon: BookOpen,
      badge: 'STORY STUDIO',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      route: '/workspace/story-library',
      selectionType: 'widget',
      selectionData: { title: 'Stories in Progress', subtitle: '8 Active Stories • 3 ready for export' },
    },
    {
      id: 'kpi-tasks',
      label: 'Pending Tasks',
      value: '5 Action Items',
      subtext: '2 high priority due today',
      icon: ListTodo,
      badge: 'ACTION CENTER',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      route: '/workspace/notifications',
      selectionType: 'widget',
      selectionData: { title: 'Pending Tasks', subtitle: '5 Action Items • 2 urgent' },
    },
    {
      id: 'kpi-renders',
      label: 'Rendering Jobs',
      value: '2 Pipeline Nodes',
      subtext: '4K video compilation active',
      icon: Video,
      badge: 'RENDER QUEUE',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      route: '/workspace/render-queue',
      selectionType: 'widget',
      selectionData: { title: 'Rendering Jobs', subtitle: '2 Jobs queued/rendering in 4K' },
    },
    {
      id: 'kpi-ai',
      label: 'AI Director Suggestions',
      value: '7 Recommendations',
      subtext: 'Audio, photo & gap advice',
      icon: Sparkles,
      badge: 'AI ADVISOR',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      route: '/workspace/studio-analytics',
      selectionType: 'widget',
      selectionData: { title: 'AI Director Suggestions', subtitle: '7 Intelligent optimization suggestions' },
    },
  ];

  return (
    <div id="mission-overview-hero" className="space-y-4">
      {/* Welcome Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-card text-foreground relative overflow-hidden shadow-sm border border-border">
        <div className="relative z-10 max-w-2xl space-y-2.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase font-bold text-cinema-amber-500 bg-cinema-amber-500/15 px-2.5 py-0.5 rounded-full border border-cinema-amber-500/30">
              Operational Mission Control
            </span>
            <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              System Online
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Good Day, {displayName}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
            Continue building your family's legacy. Here is your operational workspace status and real-time studio mission parameters.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button
              id="hero-consult-ai-btn"
              variant="accent"
              size="sm"
              onClick={onConsultAi}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="text-xs font-bold whitespace-nowrap"
            >
              Consult AI Director
            </Button>
            <Button
              id="hero-create-story-btn"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/workspace/story-studio')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs font-medium whitespace-nowrap"
            >
              Create New Story
            </Button>
            <Button
              id="hero-upload-media-btn"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/workspace/media-library')}
              leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
              className="text-xs font-medium border border-border bg-muted/50 hover:bg-muted text-foreground whitespace-nowrap"
            >
              Upload Assets
            </Button>
          </div>
        </div>
        <div className="absolute right-6 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Film className="w-44 h-44 text-cinema-amber-500 rotate-12" />
        </div>
      </div>

      {/* Mission KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" id="mission-kpis-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              id={kpi.id}
              onClick={() => {
                onSelectKpi(kpi.selectionType, kpi.selectionData);
              }}
              className="p-4 rounded-xl bg-card border border-border hover:border-cinema-amber-500/40 transition-all cursor-pointer group text-left space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
                <div className="p-1.5 rounded-lg bg-muted text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{kpi.label}</p>
                <p className="text-base sm:text-lg font-display font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors">
                  {kpi.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.subtext}</p>
              </div>
              <div className="pt-1 flex items-center justify-between text-[10px] text-cinema-amber-500 font-semibold border-t border-border/50">
                <span>Inspect Details</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* 2. CONTINUE WORKING SECTION                                          */
/* ==================================================================== */
export interface ContinueWorkingSectionProps {
  viewMode: 'grid' | 'list';
  onSelectItem: (type: string, data: any) => void;
}

export function ContinueWorkingSection({ viewMode, onSelectItem }: ContinueWorkingSectionProps) {
  const navigate = useNavigate();

  const activeWorkItems = [
    {
      id: 'draft-1',
      type: 'story',
      title: 'The Vance Family Reunion (1984)',
      category: 'Historical Chapter Outline',
      time: 'Edited 12 mins ago',
      progress: 85,
      color: 'bg-cinema-amber-500',
      route: '/workspace/story-studio',
      data: { id: 's1', title: 'The Vance Family Reunion (1984)', type: 'Historical Chapter', progress: 85, status: 'Drafting' },
    },
    {
      id: 'draft-2',
      type: 'narration',
      title: "Grandpa Bob's Childhood Farmhouse",
      category: 'Narration Voice Script',
      time: 'Edited 2 hours ago',
      progress: 42,
      color: 'bg-purple-500',
      route: '/workspace/narration-studio',
      data: { id: 's2', title: "Grandpa Bob's Childhood Farmhouse", type: 'Narration Script', progress: 42, status: 'Voice Tuning' },
    },
    {
      id: 'draft-3',
      type: 'profile',
      title: 'Elizabeth Vance: The Early Years',
      category: 'Legacy Profile Dossier',
      time: 'Edited Yesterday',
      progress: 90,
      color: 'bg-emerald-500',
      route: '/workspace/legacy-profiles',
      data: { id: 'p1', title: 'Elizabeth Vance: The Early Years', type: 'Legacy Profile', progress: 90, status: 'Biography Review' },
    },
    {
      id: 'draft-4',
      type: 'render',
      title: '1965 Wedding Anniversary Retrospective',
      category: '4K Render Pipeline Node',
      time: 'Rendering Active (65%)',
      progress: 65,
      color: 'bg-rose-500',
      route: '/workspace/render-queue',
      data: { id: 'r1', title: '1965 Wedding Anniversary Retrospective', type: '4K Video Render', progress: 65, status: 'Compiling Frame Buffer' },
    },
  ];

  return (
    <div id="continue-working-section" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="min-w-0 pr-2">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 truncate">
            <Clock className="w-4 h-4 text-cinema-amber-500 shrink-0" /> Continue Active Work
          </h3>
          <p className="text-[11px] text-muted-foreground truncate">
            Resume active biography outlines, scripts, and render jobs.
          </p>
        </div>
        <Button
          id="btn-view-all-work"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/workspace/story-library')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="text-xs text-cinema-amber-500 hover:text-cinema-amber-600 px-2.5 shrink-0 whitespace-nowrap"
        >
          View Stories
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="continue-work-items-grid">
          {activeWorkItems.map((item) => (
            <div
              key={item.id}
              id={`continue-item-${item.id}`}
              onClick={() => onSelectItem(item.type, item.data)}
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 hover:border-cinema-amber-500/30 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
            >
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider truncate">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cinema-amber-500 shrink-0">
                    {item.progress}%
                  </span>
                </div>
                <p className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-cinema-amber-500 transition-colors">
                  {item.title}
                </p>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/40 mt-1">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground font-mono truncate flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cinema-amber-500 shrink-0" /> {item.time}
                </span>
                <Button
                  id={`btn-resume-${item.id}`}
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(item.route);
                  }}
                  leftIcon={<Play className="w-3 h-3" />}
                  className="shrink-0 text-xs py-1 px-2.5 font-semibold cursor-pointer border border-border hover:border-cinema-amber-500/50 whitespace-nowrap inline-flex items-center gap-1"
                >
                  Resume
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5" id="continue-work-items-list">
          {activeWorkItems.map((item) => (
            <div
              key={item.id}
              id={`continue-item-${item.id}`}
              onClick={() => onSelectItem(item.type, item.data)}
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 hover:border-cinema-amber-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="space-y-1 text-left flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-cinema-amber-500 shrink-0" /> {item.time}
                  </span>
                </div>
                <p className="text-xs font-bold text-foreground truncate group-hover:text-cinema-amber-500 transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/40 max-w-[140px]">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold">{item.progress}%</span>
                </div>
              </div>

              <Button
                id={`btn-resume-${item.id}`}
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.route);
                }}
                leftIcon={<Play className="w-3 h-3" />}
                className="shrink-0 text-xs py-1 px-3 font-semibold cursor-pointer border border-border hover:border-cinema-amber-500/50 whitespace-nowrap inline-flex items-center gap-1"
              >
                Resume
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* 3. AI RECOMMENDATIONS SECTION (ACTIONABLE AI ADVISOR)               */
/* ==================================================================== */
export interface AiRecommendationsSectionProps {
  viewMode: 'grid' | 'list';
  onSelectRecommendation: (rec: any) => void;
}

export function AiRecommendationsSection({
  viewMode,
  onSelectRecommendation,
}: AiRecommendationsSectionProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const recommendations = [
    {
      id: 'rec-1',
      title: 'Missing Childhood Photos for Elizabeth Vance',
      reason: 'Visual gap detected in 1950s chapter. Upload vintage photos to enrich automatic Ken Burns 3D scene compilation.',
      priority: 'High',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      actionLabel: 'Upload Photos',
      route: '/workspace/media-library',
      icon: ImageIcon,
    },
    {
      id: 'rec-2',
      title: 'Narration Incomplete in Scene #12',
      reason: 'Narration script text length exceeds current 12s voice track duration. Synthesize updated voiceover to match scene pacing.',
      priority: 'Medium',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionLabel: 'Synthesize Voice',
      route: '/workspace/narration-studio',
      icon: Mic,
    },
    {
      id: 'rec-3',
      title: 'Chronology Gap Detected (1968 - 1972)',
      reason: 'Historical timeline has a 4-year void. Add military service or marriage milestones to balance chapter chronology.',
      priority: 'Medium',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionLabel: 'Add Milestone',
      route: '/workspace/story-studio',
      icon: Calendar,
    },
    {
      id: 'rec-4',
      title: 'Acoustic Score Ducking Recommended',
      reason: 'Background musical score volume is clipping vocal narrator accent in Scene #4 by +2dB. Apply AI auto-ducking.',
      priority: 'Low',
      priorityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      actionLabel: 'Apply Ducking',
      route: '/workspace/narration-studio',
      icon: Sparkles,
    },
  ];

  return (
    <div id="ai-recommendations-section" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="min-w-0 pr-2">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" /> Actionable AI Director Suggestions
          </h3>
          <p className="text-[11px] text-muted-foreground truncate">
            Intelligent recommendations to optimize pacing, media, and audio quality.
          </p>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="ai-recommendations-grid">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                id={rec.id}
                onClick={() => onSelectRecommendation(rec)}
                className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${rec.priorityColor}`}>
                      {rec.priority} Priority
                    </span>
                    <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-purple-400 transition-colors line-clamp-2">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {rec.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono truncate">Inspect Details</span>
                  <Button
                    id={`btn-act-${rec.id}`}
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast('info', 'Executing Action', `Redirecting to ${rec.actionLabel}`);
                      navigate(rec.route);
                    }}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    className="text-xs py-1 px-2.5 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 cursor-pointer whitespace-nowrap inline-flex items-center gap-1 shrink-0"
                  >
                    {rec.actionLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5" id="ai-recommendations-list">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                id={rec.id}
                onClick={() => onSelectRecommendation(rec)}
                className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${rec.priorityColor}`}>
                        {rec.priority}
                      </span>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-purple-400 transition-colors truncate">
                        {rec.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{rec.reason}</p>
                  </div>
                </div>

                <Button
                  id={`btn-act-${rec.id}`}
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast('info', 'Executing Action', `Redirecting to ${rec.actionLabel}`);
                    navigate(rec.route);
                  }}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  className="text-xs py-1 px-3 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 cursor-pointer whitespace-nowrap inline-flex items-center gap-1 shrink-0"
                >
                  {rec.actionLabel}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* 4. TODAY'S TASKS SECTION (LIGHTWEIGHT TASK CENTER)                   */
/* ==================================================================== */
export interface TodaysTasksSectionProps {
  viewMode: 'grid' | 'list';
  onSelectTask: (task: any) => void;
}

export function TodaysTasksSection({ viewMode, onSelectTask }: TodaysTasksSectionProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Finish Scene #12 script draft in Story Studio',
      priority: 'High',
      dueStatus: 'Due Today',
      completed: false,
      targetWorkspace: '/workspace/story-studio',
    },
    {
      id: 'task-2',
      title: 'Approve synthesized narration for Chapter 2',
      priority: 'High',
      dueStatus: 'Due Today',
      completed: false,
      targetWorkspace: '/workspace/narration-studio',
    },
    {
      id: 'task-3',
      title: 'Review AI-generated biography outline for Elizabeth',
      priority: 'Medium',
      dueStatus: 'Due Tomorrow',
      completed: false,
      targetWorkspace: '/workspace/story-templates',
    },
    {
      id: 'task-4',
      title: 'Upload vintage family photographs (1965 batch)',
      priority: 'Medium',
      dueStatus: 'In 2 Days',
      completed: true,
      targetWorkspace: '/workspace/media-library',
    },
  ]);

  const toggleTask = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    const target = tasks.find((t) => t.id === id);
    showToast(
      'success',
      target?.completed ? 'Task Re-opened' : 'Task Completed',
      title
    );
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div id="todays-tasks-section" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="min-w-0 pr-2">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 truncate">
            <ListTodo className="w-4 h-4 text-amber-500 shrink-0" /> Today's Priority Action Items
          </h3>
          <p className="text-[11px] text-muted-foreground truncate">
            Operational task checklist requiring review and completion.
          </p>
        </div>
        <Button
          id="btn-open-all-tasks"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/workspace/notifications')}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          className="text-xs text-cinema-amber-500 hover:text-cinema-amber-600 px-2.5 shrink-0 whitespace-nowrap"
        >
          All Items ({pendingCount})
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="tasks-checklist-grid">
          {tasks.map((task) => (
            <div
              key={task.id}
              id={`task-row-${task.id}`}
              onClick={() => onSelectTask(task)}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                task.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-muted-foreground'
                  : 'bg-card hover:bg-muted/30 border-border text-foreground'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id, task.title);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-muted-foreground hover:border-cinema-amber-500'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 fill-current shrink-0" />}
                  </button>
                  <span className="text-[9px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                    {task.priority} Priority
                  </span>
                </div>

                <span
                  className={`text-xs font-semibold block line-clamp-2 ${
                    task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground font-mono truncate">{task.dueStatus}</span>
                <Button
                  id={`btn-go-task-${task.id}`}
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(task.targetWorkspace);
                  }}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  className="text-xs py-1 px-3 text-cinema-amber-500 hover:text-cinema-amber-600 shrink-0 border border-border hover:border-cinema-amber-500/40 whitespace-nowrap"
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5" id="tasks-checklist-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              id={`task-row-${task.id}`}
              onClick={() => onSelectTask(task)}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                task.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-muted-foreground'
                  : 'bg-card hover:bg-muted/30 border-border text-foreground'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id, task.title);
                  }}
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-muted-foreground hover:border-cinema-amber-500'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4 fill-current shrink-0" />}
                </button>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <span
                    className={`text-xs font-semibold block truncate ${
                      task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <span className="text-amber-400 font-bold">{task.priority} Priority</span>
                    <span>•</span>
                    <span>{task.dueStatus}</span>
                  </div>
                </div>
              </div>

              <Button
                id={`btn-go-task-${task.id}`}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(task.targetWorkspace);
                }}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                className="text-xs text-cinema-amber-500 hover:text-cinema-amber-600 px-2 shrink-0 whitespace-nowrap"
              >
                Open
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* 5. RECENT ACTIVITY STREAM COMPONENT                                  */
/* ==================================================================== */
export interface RecentActivitySectionProps {
  viewMode: 'grid' | 'list';
  activities: Array<{ title: string; desc: string; time: string; iconColor: string }>;
  onSelectActivity: (act: any) => void;
}

export function RecentActivitySection({
  viewMode,
  activities,
  onSelectActivity,
}: RecentActivitySectionProps) {
  const navigate = useNavigate();

  return (
    <div id="recent-activity-section" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="min-w-0 pr-2">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 truncate">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" /> Operational Activity Stream
          </h3>
          <p className="text-[11px] text-muted-foreground truncate">
            Chronological audit log of edits, media, and render events.
          </p>
        </div>
        <Button
          id="btn-view-all-activity"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/workspace/notifications')}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          className="text-xs text-cinema-amber-500 hover:text-cinema-amber-600 px-2.5 shrink-0 whitespace-nowrap"
        >
          Activity Log
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="activity-stream-grid">
          {activities.map((act, idx) => (
            <div
              key={idx}
              id={`activity-item-${idx}`}
              onClick={() => onSelectActivity(act)}
              className="p-3.5 rounded-xl border border-border bg-card/40 hover:bg-muted/30 transition-all flex flex-col justify-between space-y-2 cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${act.iconColor}`} />
                    <p className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors truncate">
                      {act.title}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {act.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>Timestamp</span>
                <span className="font-semibold text-foreground">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5" id="activity-stream-list">
          {activities.map((act, idx) => (
            <div
              key={idx}
              id={`activity-item-${idx}`}
              onClick={() => onSelectActivity(act)}
              className="p-3 rounded-xl border border-border/60 bg-card/40 hover:bg-muted/30 transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${act.iconColor}`} />
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors truncate">
                    {act.title}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">{act.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* 6. QUICK ACTIONS GRID                                                */
/* ==================================================================== */
export interface QuickActionsGridProps {
  viewMode: 'grid' | 'list';
}

export function QuickActionsGrid({ viewMode }: QuickActionsGridProps) {
  const navigate = useNavigate();

  const actions = [
    { label: 'Create Story', desc: 'Start a new biographic narrative', route: '/workspace/story-studio', icon: Plus, color: 'text-cinema-amber-500' },
    { label: 'Import Media', desc: 'Add photos, letters & documents', route: '/workspace/media-library', icon: ImageIcon, color: 'text-indigo-400' },
    { label: 'Story Studio', desc: 'Manage chapters & draft outlines', route: '/workspace/story-studio', icon: BookOpen, color: 'text-amber-400' },
    { label: 'Record Voice', desc: 'Capture voiceover narration clips', route: '/workspace/narration-studio', icon: Mic, color: 'text-purple-400' },
    { label: 'Legacy Profiles', desc: 'Family heritage biographic dossiers', route: '/workspace/legacy-profiles', icon: UserPlus, color: 'text-emerald-400' },
    { label: 'Render Queue', desc: 'Monitor active 4K scene renders', route: '/workspace/render-queue', icon: Video, color: 'text-rose-400' },
    { label: 'Connect Service', desc: 'Link Google Drive & cloud vaults', route: '/workspace/integrations', icon: Link2, color: 'text-blue-400' },
    { label: 'System Settings', desc: 'Preferences & hardware options', route: '/workspace/settings', icon: Sliders, color: 'text-slate-400' },
  ];

  return (
    <div id="quick-actions-section" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="border-b border-border pb-3">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-cinema-amber-500 shrink-0" /> High-Frequency Quick Actions
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Direct studio shortcuts to start new workflows in one tap.
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="quick-actions-shortcuts-grid">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                id={`quick-action-btn-${idx}`}
                onClick={() => navigate(act.route)}
                className="p-3.5 rounded-xl border border-border bg-card/80 hover:bg-muted/50 hover:border-cinema-amber-500/40 transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer group shadow-xs"
              >
                <div className={`p-2.5 rounded-xl bg-muted group-hover:scale-105 transition-transform ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors line-clamp-1">
                  {act.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="quick-actions-shortcuts-list">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                id={`quick-action-btn-${idx}`}
                onClick={() => navigate(act.route)}
                className="p-3 rounded-xl border border-border bg-card/80 hover:bg-muted/50 hover:border-cinema-amber-500/40 transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg bg-muted group-hover:scale-105 transition-transform ${act.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors block truncate">
                      {act.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {act.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* 7. WORKSPACE SNAPSHOT GRID (NO HISTORICAL CHARTS)                    */
/* ==================================================================== */
export interface WorkspaceSnapshotGridProps {
  viewMode: 'grid' | 'list';
  stats: any;
  onSelectSnapshot: (type: string, data: any) => void;
}

export function WorkspaceSnapshotGrid({ viewMode, stats, onSelectSnapshot }: WorkspaceSnapshotGridProps) {
  const navigate = useNavigate();

  const snapshots = [
    {
      id: 'snap-stories',
      title: 'Story Library',
      metric: `${stats.storiesCount || 8} Active Stories`,
      sub: `${stats.avgProgress || 72}% average completion`,
      route: '/workspace/story-library',
      icon: BookOpen,
      color: 'text-cinema-amber-500',
    },
    {
      id: 'snap-profiles',
      title: 'Legacy Profiles',
      metric: `${stats.profilesCount || 4} Profiles`,
      sub: 'Family heritage dossiers',
      route: '/workspace/legacy-profiles',
      icon: UserCheck,
      color: 'text-emerald-500',
    },
    {
      id: 'snap-media',
      title: 'Media Shelf',
      metric: `${stats.mediaCount || 18} Assets`,
      sub: 'Photos, videos, PDFs',
      route: '/workspace/media-library',
      icon: ImageIcon,
      color: 'text-indigo-500',
    },
    {
      id: 'snap-templates',
      title: 'Chapter Blueprints',
      metric: '6 Blueprints',
      sub: 'Documentary structures',
      route: '/workspace/story-templates',
      icon: Layers,
      color: 'text-purple-500',
    },
    {
      id: 'snap-render',
      title: 'Render Queue',
      metric: '2 Active Nodes',
      sub: '4K video compilation',
      route: '/workspace/render-queue',
      icon: Video,
      color: 'text-rose-500',
    },
    {
      id: 'snap-storage',
      title: 'Storage Vault',
      metric: '4.2 GB / 10.0 GB',
      sub: '42% capacity allocated',
      route: '/workspace/settings',
      icon: HardDrive,
      color: 'text-amber-500',
    },
  ];

  return (
    <div id="workspace-snapshot-section" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="min-w-0 pr-2">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 truncate">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" /> Workspace Operational Snapshot
          </h3>
          <p className="text-[11px] text-muted-foreground truncate">
            Capacity and status across operational platform modules.
          </p>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="workspace-snapshot-grid">
          {snapshots.map((snap) => {
            const Icon = snap.icon;
            return (
              <div
                key={snap.id}
                id={snap.id}
                onClick={() => onSelectSnapshot('widget', { title: snap.title, subtitle: snap.metric })}
                className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex items-start justify-between cursor-pointer group"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <span className="text-[9px] font-mono uppercase font-bold text-muted-foreground block truncate">
                    {snap.title}
                  </span>
                  <p className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors truncate">
                    {snap.metric}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{snap.sub}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(snap.route);
                  }}
                  className={`p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer shrink-0 ${snap.color}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5" id="workspace-snapshot-list">
          {snapshots.map((snap) => {
            const Icon = snap.icon;
            return (
              <div
                key={snap.id}
                id={snap.id}
                onClick={() => onSelectSnapshot('widget', { title: snap.title, subtitle: snap.metric })}
                className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-lg bg-muted shrink-0 ${snap.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-muted-foreground block truncate">
                      {snap.title}
                    </span>
                    <p className="text-xs font-bold text-foreground group-hover:text-cinema-amber-500 transition-colors truncate">
                      {snap.metric}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">{snap.sub}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* 8. SMART STATUS WIDGETS (OPERATIONAL HEALTH)                        */
/* ==================================================================== */
export interface SmartStatusWidgetsProps {
  viewMode: 'grid' | 'list';
}

export function SmartStatusWidgets({ viewMode }: SmartStatusWidgetsProps) {
  const navigate = useNavigate();

  const healthItems = [
    {
      title: 'Stories Awaiting Narration',
      status: '2 Pending',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      route: '/workspace/narration-studio',
    },
    {
      title: 'Incomplete Biographies',
      status: '1 Profile',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      route: '/workspace/legacy-profiles',
    },
    {
      title: 'Active Render Queue',
      status: '1 Job Rendering',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      route: '/workspace/render-queue',
    },
    {
      title: 'Storage Vault Allocation',
      status: '4.2 GB / 10.0 GB (OK)',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      route: '/workspace/settings',
    },
    {
      title: 'Cloud Storage Integration',
      status: 'Connected',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      route: '/workspace/integrations',
    },
    {
      title: 'Backup & Database Sync',
      status: 'Synchronized',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      route: '/workspace/settings',
    },
  ];

  return (
    <div id="smart-status-widgets" className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-4 shadow-xs text-left">
      <div className="border-b border-border pb-3">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Operational Studio Health
        </h3>
        <p className="text-[11px] text-muted-foreground">
          System readiness, background service connectivity, and storage integrity.
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="health-indicators-grid">
          {healthItems.map((item, idx) => (
            <div
              key={idx}
              id={`health-item-${idx}`}
              onClick={() => navigate(item.route)}
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex items-center justify-between gap-2 cursor-pointer group"
            >
              <span className="text-xs font-semibold text-foreground group-hover:text-cinema-amber-500 transition-colors truncate min-w-0 flex-1">
                {item.title}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border whitespace-nowrap shrink-0 ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5" id="health-indicators-list">
          {healthItems.map((item, idx) => (
            <div
              key={idx}
              id={`health-item-${idx}`}
              onClick={() => navigate(item.route)}
              className="p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground group-hover:text-cinema-amber-500 transition-colors truncate">
                  {item.title}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border whitespace-nowrap shrink-0 ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
