/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Sliders,
  Database,
  History,
  MessageSquare,
  Activity,
  CheckCircle2,
  FileText,
  Film,
  Users,
  Image as ImageIcon,
  Mic,
  LayoutTemplate,
  Video,
  Settings,
  Link2,
  Layers,
  Award,
  BarChart3,
  HardDrive,
  Cpu,
  Clock,
  Shield,
  Zap,
  BookOpen,
  HelpCircle,
  Keyboard,
  Compass,
} from 'lucide-react';
import { InspectorSelection } from './InspectorContext';

export interface InspectorTabDef {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface InspectorHeaderConfig {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
}

export function getDynamicInspectorHeader(
  route: string,
  selection: InspectorSelection
): InspectorHeaderConfig {
  // 1. STORY STUDIO WORKSPACE
  if (route === 'story-studio-workspace') {
    if (selection.type === 'scene' && selection.data) {
      return {
        title: `Scene #${selection.data.sceneNumber || 1}: ${selection.data.title || 'Untitled Scene'}`,
        subtitle: selection.data.description || 'Scene properties & audio composition',
        badge: 'SCENE INSPECTOR',
        badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
      };
    }
    if (selection.type === 'character' && selection.data) {
      return {
        title: selection.data.fullName || selection.data.name || 'Character Profile',
        subtitle: selection.data.storyRole || selection.data.relationship || 'Biography & narrative role',
        badge: 'CHARACTER INSPECTOR',
        badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      };
    }
    if (selection.type === 'media' && selection.data) {
      return {
        title: selection.data.displayName || selection.data.name || 'Media Asset',
        subtitle: selection.data.mediaType || selection.data.type || 'Visual archive asset',
        badge: 'MEDIA INSPECTOR',
        badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      };
    }
    if (selection.type === 'narration' && selection.data) {
      return {
        title: selection.data.voiceName || 'Voice Narration',
        subtitle: selection.data.assignedVoice || 'AI voice synthesis parameters',
        badge: 'VOICE INSPECTOR',
        badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      };
    }
    if (selection.type === 'timeline' && selection.data) {
      return {
        title: selection.data.year ? `Milestone: ${selection.data.year}` : 'Timeline Milestone',
        subtitle: selection.data.title || 'Chronological milestone event',
        badge: 'TIMELINE INSPECTOR',
        badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      };
    }
    if (selection.type === 'career' && selection.data) {
      return {
        title: selection.data.position || 'Career Milestone',
        subtitle: selection.data.company || 'Employment record details',
        badge: 'CAREER INSPECTOR',
        badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      };
    }
    if (selection.type === 'document' || selection.type === 'import') {
      return {
        title: selection.data?.displayName || 'Archive Record',
        subtitle: selection.data?.documentType || selection.data?.importType || 'Heritage document citation',
        badge: 'DOCUMENT INSPECTOR',
        badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      };
    }
    return {
      title: 'Active Story Project',
      subtitle: 'Global workspace parameters & readiness',
      badge: 'STORY WORKSPACE',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 2. DASHBOARD
  if (route === 'dashboard') {
    if (selection.type === 'story' && selection.data) {
      return {
        title: selection.data.title || 'Story Draft',
        subtitle: selection.data.type || `Progress: ${selection.data.progress || 0}%`,
        badge: 'DRAFT INSPECTOR',
        badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
      };
    }
    if (selection.type === 'task' && selection.data) {
      return {
        title: selection.data.title || selection.data.label || 'Action Task',
        subtitle: `Priority: ${selection.data.priority || 'Normal'} • Status: ${selection.data.dueStatus || 'Pending'}`,
        badge: 'TASK INSPECTOR',
        badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      };
    }
    if (selection.type === 'recommendation' && selection.data) {
      return {
        title: selection.data.title || 'AI Recommendation',
        subtitle: selection.data.reason || 'Automated Studio Advice',
        badge: 'AI ADVISOR',
        badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      };
    }
    if (selection.type === 'activity' && selection.data) {
      return {
        title: selection.data.title || 'Studio Activity',
        subtitle: selection.data.time || 'Operational Event Log',
        badge: 'ACTIVITY ITEM',
        badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      };
    }
    if (selection.type === 'widget' && selection.data) {
      return {
        title: selection.data.title || 'Workspace Snapshot',
        subtitle: selection.data.subtitle || 'Operational Status Overview',
        badge: 'SNAPSHOT WIDGET',
        badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      };
    }
    return {
      title: 'Mission Control Inspector',
      subtitle: 'Contextual insights, recommended actions & operational triage',
      badge: 'MISSION CONTROL',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 3. STORY LIBRARY
  if (route === 'story-library') {
    if (selection.type === 'story' && selection.data) {
      return {
        title: selection.data.title || 'Story Project',
        subtitle: selection.data.subtitle || `Category: ${selection.data.category || 'Memoir'}`,
        badge: 'STORY INSPECTOR',
        badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
      };
    }
    return {
      title: 'Story Catalog Overview',
      subtitle: 'Global statistics, drafts & storage metrics',
      badge: 'CATALOG METRICS',
      badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    };
  }

  // 4. STORY STUDIO LANDING
  if (route === 'story-studio-landing') {
    return {
      title: 'Studio Launchpad',
      subtitle: 'Production readiness & quick studio shortcuts',
      badge: 'CREATIVE STUDIO',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 5. LEGACY PROFILES
  if (route === 'legacy-profiles') {
    if (selection.type === 'profile' && selection.data) {
      return {
        title: selection.data.fullName || selection.data.name || 'Master Profile',
        subtitle: selection.data.relationship || 'Heritage biography record',
        badge: 'PROFILE INSPECTOR',
        badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      };
    }
    return {
      title: 'Legacy Directory Stats',
      subtitle: 'Biographical records & family tree coverage',
      badge: 'HERITAGE METRICS',
      badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    };
  }

  // 6. MEDIA LIBRARY
  if (route === 'media-library') {
    if (selection.type === 'media' && selection.data) {
      return {
        title: selection.data.displayName || selection.data.name || 'Asset Inspector',
        subtitle: selection.data.fileType || selection.data.type || 'Media archive record',
        badge: 'FILE INSPECTOR',
        badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      };
    }
    return {
      title: 'Media Archive Metrics',
      subtitle: 'Storage distribution & upload activity',
      badge: 'STORAGE ENGINE',
      badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    };
  }

  // 7. NARRATION STUDIO
  if (route === 'narration-studio') {
    if (selection.type === 'narration' && selection.data) {
      return {
        title: selection.data.name || 'Voice Profile',
        subtitle: selection.data.accent || selection.data.gender || 'AI Voice Synthesis Engine',
        badge: 'VOICE INSPECTOR',
        badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      };
    }
    return {
      title: 'Voice Studio Overview',
      subtitle: 'Audio synthesis capacity & voice metrics',
      badge: 'AUDIO ENGINE',
      badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    };
  }

  // 8. STORY TEMPLATES
  if (route === 'story-templates') {
    if (selection.type === 'template' && selection.data) {
      return {
        title: selection.data.title || 'Template Details',
        subtitle: selection.data.category || 'Documentary Blueprint',
        badge: 'TEMPLATE INSPECTOR',
        badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      };
    }
    return {
      title: 'Template Catalog',
      subtitle: 'Documentary blueprints & chapter structures',
      badge: 'BLUEPRINT METRICS',
      badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
    };
  }

  // 9. RENDER QUEUE
  if (route === 'render-queue') {
    if (selection.type === 'render' && selection.data) {
      return {
        title: selection.data.title || 'Render Job',
        subtitle: selection.data.resolution || '4K Render Pipeline Node',
        badge: 'RENDER JOB INSPECTOR',
        badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      };
    }
    return {
      title: 'Render Queue Status',
      subtitle: 'Active export pipeline & GPU node load',
      badge: 'PIPELINE METRICS',
      badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    };
  }

  // 10. STUDIO ANALYTICS
  if (route === 'studio-analytics') {
    return {
      title: 'Studio Analytics & Telemetry',
      subtitle: 'System health, AI usage & studio activity insights',
      badge: 'MONITOR ARCHETYPE',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 11. INTEGRATIONS
  if (route === 'integrations') {
    if (selection.type === 'integration' && selection.data) {
      return {
        title: selection.data.name || 'Service Connector',
        subtitle: selection.data.category || 'External Service Node',
        badge: 'INTEGRATION INSPECTOR',
        badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      };
    }
    return {
      title: 'Integration Inspector',
      subtitle: 'Ecosystem health, sync status & OAuth security',
      badge: 'CONFIGURATION ARCHETYPE',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 12. SEARCH / EXPLORER
  if (route === 'search') {
    if (selection.data) {
      return {
        title: selection.data.title || selection.data.name || 'Search Result',
        subtitle: selection.data.subtitle || selection.data.meta || 'Discovered Record',
        badge: 'SEARCH INSPECTOR',
        badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
      };
    }
    return {
      title: 'Intelligence Discovery Hub',
      subtitle: 'Global knowledge graph & semantic memory indexer',
      badge: 'EXPLORER ARCHETYPE',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 13. NOTIFICATIONS / OPERATIONS
  if (route === 'notifications') {
    if (selection.data) {
      return {
        title: selection.data.title || 'Notification Event',
        subtitle: selection.data.description || 'System Activity Item',
        badge: 'OPERATIONS INSPECTOR',
        badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
      };
    }
    return {
      title: 'Operations Center',
      subtitle: 'System triage, event audit trail & operational intelligence',
      badge: 'OPERATIONS ARCHETYPE',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 14. HELP CENTER / KNOWLEDGE HUB
  if (route === 'help') {
    if (selection.data) {
      return {
        title: selection.data.title || 'Help Article',
        subtitle: selection.data.excerpt || 'Knowledge Hub Reference',
        badge: 'ARTICLE INSPECTOR',
        badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
      };
    }
    return {
      title: 'Help Center & Guidance',
      subtitle: 'Documentation, feature guides & AI learning companion',
      badge: 'KNOWLEDGE ARCHETYPE',
      badgeColor: 'text-cinema-amber-400 bg-cinema-amber-500/15 border-cinema-amber-500/30',
    };
  }

  // 11. SETTINGS
  return {
    title: 'System Preferences',
    subtitle: 'API keys, local storage & environment telemetry',
    badge: 'SYSTEM INSPECTOR',
    badgeColor: 'text-slate-400 bg-slate-500/15 border-slate-500/30',
  };
}

export function getDynamicInspectorTabs(
  route: string,
  selection: InspectorSelection
): InspectorTabDef[] {
  // Common tab definitions
  const aiDirectorTab: InspectorTabDef = { id: 'ai-director', label: 'AI Director', icon: Sparkles };
  const propertiesTab: InspectorTabDef = { id: 'properties', label: 'Properties', icon: Sliders };
  const metadataTab: InspectorTabDef = { id: 'metadata', label: 'Metadata', icon: Database };
  const activityTab: InspectorTabDef = { id: 'activity', label: 'Activity', icon: History };
  const commentsTab: InspectorTabDef = { id: 'comments', label: 'Reviews', icon: MessageSquare };
  const validationTab: InspectorTabDef = { id: 'validation', label: 'Readiness', icon: CheckCircle2 };
  const telemetryTab: InspectorTabDef = { id: 'telemetry', label: 'Telemetry', icon: Activity };
  const restorationTab: InspectorTabDef = { id: 'restoration', label: 'Restoration', icon: Zap };
  const audioTab: InspectorTabDef = { id: 'audio', label: 'Voice Tuning', icon: Mic };
  const renderJobTab: InspectorTabDef = { id: 'render-job', label: 'Export Specs', icon: Video };

  // Route-aware tab rules
  if (route === 'dashboard') {
    if (selection.type === 'story') {
      return [propertiesTab, aiDirectorTab, activityTab, metadataTab];
    }
    if (selection.type === 'task') {
      return [
        { id: 'task-details', label: 'Task Details', icon: CheckCircle2 },
        aiDirectorTab,
        { id: 'quick-actions', label: 'Actions', icon: Zap },
      ];
    }
    if (selection.type === 'recommendation') {
      return [
        { id: 'ai-recommendation', label: 'AI Recommendation', icon: Sparkles },
        { id: 'quick-actions', label: 'Actions', icon: Zap },
      ];
    }
    if (selection.type === 'activity') {
      return [activityTab, metadataTab];
    }
    return [aiDirectorTab, telemetryTab, activityTab, metadataTab, commentsTab];
  }

  if (route === 'story-library') {
    if (selection.type === 'story') {
      return [aiDirectorTab, propertiesTab, metadataTab, activityTab, commentsTab];
    }
    return [aiDirectorTab, validationTab, activityTab, metadataTab];
  }

  if (route === 'story-studio-landing') {
    return [aiDirectorTab, validationTab, telemetryTab, activityTab];
  }

  if (route === 'story-studio-workspace') {
    if (selection.type === 'scene') {
      return [aiDirectorTab, propertiesTab, metadataTab, commentsTab, activityTab];
    }
    if (selection.type === 'character') {
      return [aiDirectorTab, propertiesTab, metadataTab, commentsTab];
    }
    if (selection.type === 'media') {
      return [aiDirectorTab, propertiesTab, restorationTab, metadataTab];
    }
    if (selection.type === 'narration') {
      return [aiDirectorTab, audioTab, propertiesTab, metadataTab];
    }
    if (selection.type === 'timeline') {
      return [aiDirectorTab, propertiesTab, metadataTab, activityTab];
    }
    return [aiDirectorTab, propertiesTab, validationTab, metadataTab, commentsTab, activityTab];
  }

  if (route === 'legacy-profiles') {
    if (selection.type === 'profile') {
      return [aiDirectorTab, propertiesTab, metadataTab, activityTab, commentsTab];
    }
    return [aiDirectorTab, validationTab, activityTab, metadataTab];
  }

  if (route === 'media-library') {
    if (selection.type === 'media') {
      return [propertiesTab, restorationTab, aiDirectorTab, metadataTab];
    }
    return [aiDirectorTab, telemetryTab, activityTab, metadataTab];
  }

  if (route === 'narration-studio') {
    if (selection.type === 'narration') {
      return [audioTab, propertiesTab, aiDirectorTab, metadataTab];
    }
    return [aiDirectorTab, telemetryTab, activityTab];
  }

  if (route === 'story-templates') {
    if (selection.type === 'template') {
      return [propertiesTab, aiDirectorTab, metadataTab, validationTab];
    }
    return [aiDirectorTab, validationTab, metadataTab];
  }

  if (route === 'render-queue') {
    if (selection.type === 'render') {
      return [renderJobTab, telemetryTab, aiDirectorTab, activityTab];
    }
    return [telemetryTab, aiDirectorTab, activityTab];
  }

  if (route === 'studio-analytics') {
    return [
      { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
      { id: 'metric-details', label: 'Metric Details', icon: BarChart3 },
      { id: 'system-status', label: 'System Status', icon: Activity },
      { id: 'activity-timeline', label: 'Activity Timeline', icon: History },
    ];
  }

  if (route === 'integrations') {
    return [
      { id: 'service-details', label: 'Service Details', icon: Link2 },
      { id: 'sync-status', label: 'Sync Status', icon: Activity },
      { id: 'permissions', label: 'Permissions', icon: CheckCircle2 },
      { id: 'activity', label: 'Activity', icon: History },
    ];
  }

  if (route === 'search') {
    return [
      { id: 'result-details', label: 'Details', icon: FileText },
      { id: 'relationships', label: 'Relationships', icon: Layers },
      { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
      { id: 'activity', label: 'Activity', icon: History },
      { id: 'quick-actions', label: 'Actions', icon: Zap },
    ];
  }

  if (route === 'notifications') {
    return [
      { id: 'notif-details', label: 'Details', icon: FileText },
      { id: 'affected-story', label: 'Entity Context', icon: BookOpen },
      { id: 'ai-explanation', label: 'AI Diagnosis', icon: Sparkles },
      { id: 'activity-timeline', label: 'Event History', icon: History },
      { id: 'quick-actions', label: 'Actions', icon: Zap },
    ];
  }

  if (route === 'help') {
    return [
      { id: 'article-outline', label: 'Doc Outline', icon: FileText },
      { id: 'related-docs', label: 'Related Guides', icon: BookOpen },
      { id: 'ai-learning', label: 'AI Companion', icon: Sparkles },
      { id: 'shortcuts-ref', label: 'Key Bindings', icon: Keyboard },
      { id: 'quick-actions', label: 'Actions', icon: Zap },
    ];
  }

  if (route === 'settings') {
    return [telemetryTab, metadataTab, activityTab];
  }

  return [aiDirectorTab, propertiesTab, metadataTab, commentsTab, activityTab];
}

export {
  getDynamicInspectorHeader as getHeaderConfigForSelection,
  getDynamicInspectorTabs as getInspectorTabsForRoute,
};

