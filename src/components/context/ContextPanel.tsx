/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useInspector } from '../../context/InspectorContext';
import { ContextMode } from '../../context/contextMode';
import { getInspectorTabsForRoute, getHeaderConfigForSelection } from '../../context/inspectorConfig';
import { ContextPanelHeader } from './ContextPanelHeader';
import { ContextTabs } from './ContextTabs';
import { ContextInspector } from './ContextInspector';

export function ContextPanel() {
  const {
    route,
    contextMode,
    selection,
    clearSelection,
    activeTab,
    setActiveTab,
    closeInspector,
    isInspectorOpen,
  } = useInspector();

  // Toast feedback state
  const [toast, setToast] = useState<{ type: string; title: string; detail?: string } | null>(null);

  // Local widget control state
  const [kenBurns, setKenBurns] = useState(true);
  const [breathReduction, setBreathReduction] = useState(true);
  const [scoreDucking, setScoreDucking] = useState(true);
  const [colorizationEnabled, setColorizationEnabled] = useState(false);
  const [aiSuperRes, setAiSuperRes] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState([
    { user: 'Director AI', text: 'Pacing optimal across chapter transitions.', time: '10m ago' },
    { user: 'Archivist Lead', text: 'Scanned photos verified for high dynamic range.', time: '1h ago' },
  ]);

  const showToast = (type: string, title: string, detail?: string) => {
    setToast({ type, title, detail });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setCommentsList([
      ...commentsList,
      { user: 'Producer User', text: commentInput.trim(), time: 'Just now' },
    ]);
    setCommentInput('');
    showToast('success', 'Review Note Added', 'Saved to editorial session log.');
  };

  const activities = [
    { id: 1, title: 'Scene 3 Script Rewritten', desc: 'Adjusted length to match voice speed.', time: '15m ago' },
    { id: 2, title: 'Colorization Applied', desc: 'AI photo restoration model rendered.', time: '2h ago' },
    { id: 3, title: 'Story Draft Initialized', desc: 'Imported from Legacy Profile data.', time: '1d ago' },
  ];

  // Rule 1: Category C (ContextMode.None) pages MUST NEVER render the panel
  if (contextMode === ContextMode.None) {
    return null;
  }

  // Rule 2 & 3: If closed by user or not open, do not render panel
  if (!isInspectorOpen) {
    return null;
  }

  const tabs = getInspectorTabsForRoute(route, selection.type);
  const headerConfig = getHeaderConfigForSelection(route, selection);

  return (
    <aside
      id="global-context-panel"
      className="w-[320px] xl:w-[360px] h-full bg-card border-l border-border flex flex-col shrink-0 shadow-xl z-20 relative transition-all duration-200"
    >
      {/* Toast Feedback Notification banner */}
      {toast && (
        <div className="absolute top-2 left-2 right-2 z-50 p-2.5 rounded-xl bg-popover border border-border text-xs text-foreground shadow-2xl animate-fade-in flex flex-col gap-0.5">
          <span className="font-bold text-cinema-amber-500 font-mono text-[10px] uppercase">
            {toast.title}
          </span>
          {toast.detail && <span className="text-muted-foreground text-[11px]">{toast.detail}</span>}
        </div>
      )}

      {/* Header */}
      <ContextPanelHeader
        headerConfig={headerConfig}
        selection={selection}
        onClearSelection={clearSelection}
        onClose={closeInspector}
      />

      {/* Dynamic Inspector Tabs */}
      <ContextTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Scrollable Inspector Viewport */}
      <ContextInspector
        activeTab={activeTab}
        route={route}
        selection={selection}
        showToast={showToast}
        kenBurns={kenBurns}
        setKenBurns={setKenBurns}
        breathReduction={breathReduction}
        setBreathReduction={setBreathReduction}
        scoreDucking={scoreDucking}
        setScoreDucking={setScoreDucking}
        colorizationEnabled={colorizationEnabled}
        setColorizationEnabled={setColorizationEnabled}
        aiSuperRes={aiSuperRes}
        setAiSuperRes={setAiSuperRes}
        voiceSpeed={voiceSpeed}
        setVoiceSpeed={setVoiceSpeed}
        voicePitch={voicePitch}
        setVoicePitch={setVoicePitch}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
        commentsList={commentsList}
        handleAddComment={handleAddComment}
        activities={activities}
      />

      {/* Footer */}
      <div className="p-3 px-4 border-t border-border bg-muted/30 shrink-0 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span className="uppercase font-bold">Mode: {selection.type.toUpperCase()}</span>
        <span className="capitalize">{route.replace('-', ' ')}</span>
      </div>
    </aside>
  );
}
