/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  Link2,
  RefreshCw,
  Download,
  SlidersHorizontal,
  Layers,
  Activity,
  Plus,
} from 'lucide-react';
import { useOverlay } from '../../context/OverlayContext';
import { useToast } from '../../context/ToastContext';
import { useInspector } from '../../context/InspectorContext';
import { Button } from '../ui/Button';

import { IntegrationProvider, AutomationRule, SyncLogEvent } from './integrationTypes';
import {
  INITIAL_INTEGRATIONS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_SYNC_LOGS,
} from './integrationData';

import { IntegrationHealthOverview } from './IntegrationHealthOverview';
import { IdeaCodexEcosystemSection } from './IdeaCodexEcosystemSection';
import { RecommendedIntegrations } from './RecommendedIntegrations';
import { ConnectedServicesSection } from './ConnectedServicesSection';
import { AvailableServicesSection } from './AvailableServicesSection';
import { AutomationRulesSection } from './AutomationRulesSection';
import { SyncActivityTimeline } from './SyncActivityTimeline';
import { ServiceDetailModal } from './ServiceDetailModal';

export function IntegrationsPage() {
  const { rightPanelOpen, setRightPanelOpen } = useOverlay();
  const { showToast } = useToast();
  const { setSelection } = useInspector();

  // State
  const [providers, setProviders] = useState<IntegrationProvider[]>(INITIAL_INTEGRATIONS);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [syncLogs, setSyncLogs] = useState<SyncLogEvent[]>(INITIAL_SYNC_LOGS);
  const [activeModalProvider, setActiveModalProvider] = useState<IntegrationProvider | null>(null);

  // Derived KPI metrics
  const connectedCount = providers.filter((p) => p.status === 'connected').length;
  const availableCount = providers.filter((p) => p.status !== 'connected').length;
  const activeSyncsCount = 2;
  const failedSyncsCount = 0;
  const lastBackupTime = '12 mins ago';
  const storageConnectedGb = 1.24;
  const aiProvidersCount = providers.filter(
    (p) => p.category === 'AI Providers' && p.status === 'connected'
  ).length;

  // Handlers
  const handleSelectProvider = useCallback(
    (provider: IntegrationProvider) => {
      setActiveModalProvider(provider);
      // Synchronize with Right Utility Panel Inspector Context
      setSelection('integration', provider, { source: 'integrations-page' });
    },
    [setSelection]
  );

  const handleConnectProvider = useCallback(
    (provider: IntegrationProvider) => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === provider.id
            ? {
                ...p,
                status: 'connected',
                connectedAccount: 'User.Account@reellegacy.app',
                lastSyncTime: 'Just now',
                syncFrequency: 'Real-time',
              }
            : p
        )
      );

      const newLog: SyncLogEvent = {
        id: `log-${Date.now()}`,
        integrationId: provider.id,
        integrationName: provider.name,
        timestamp: 'Just now',
        status: 'success',
        message: `${provider.name} OAuth Session Connected`,
        details: 'OAuth credentials verified successfully. Initial workspace directory created.',
      };

      setSyncLogs((prev) => [newLog, ...prev]);

      showToast(
        'success',
        `Connected to ${provider.name}`,
        'OAuth credentials authorized and background sync initialized.'
      );

      if (activeModalProvider?.id === provider.id) {
        setActiveModalProvider((prev) =>
          prev ? { ...prev, status: 'connected', lastSyncTime: 'Just now' } : null
        );
      }
    },
    [activeModalProvider, showToast]
  );

  const handleDisconnectProvider = useCallback(
    (provider: IntegrationProvider) => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === provider.id
            ? {
                ...p,
                status: 'disconnected',
                connectedAccount: undefined,
              }
            : p
        )
      );

      const newLog: SyncLogEvent = {
        id: `log-${Date.now()}`,
        integrationId: provider.id,
        integrationName: provider.name,
        timestamp: 'Just now',
        status: 'info',
        message: `${provider.name} OAuth Session Revoked`,
        details: 'User revoked credentials and disconnected background sync pipeline.',
      };

      setSyncLogs((prev) => [newLog, ...prev]);

      showToast(
        'info',
        `Disconnected ${provider.name}`,
        'Access credentials revoked and background sync disabled.'
      );

      if (activeModalProvider?.id === provider.id) {
        setActiveModalProvider((prev) => (prev ? { ...prev, status: 'disconnected' } : null));
      }
    },
    [activeModalProvider, showToast]
  );

  const handleTestConnection = useCallback(
    (provider: IntegrationProvider) => {
      showToast(
        'success',
        `Health Probe Passed: ${provider.name}`,
        `Latency: 84ms. Access token valid. API endpoint responding with status 200 OK.`
      );
    },
    [showToast]
  );

  const handleToggleAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const handleRunAutomationRule = useCallback(
    (rule: AutomationRule) => {
      setAutomationRules((prev) =>
        prev.map((r) =>
          r.id === rule.id
            ? { ...r, lastRun: 'Just now', runCount: r.runCount + 1 }
            : r
        )
      );

      showToast(
        'success',
        `Executed Rule: ${rule.title}`,
        `Trigger event sent to ${rule.actionService}. Action completed successfully.`
      );
    },
    [showToast]
  );

  const handleCreateRule = useCallback(() => {
    showToast(
      'info',
      'Automation Rule Builder',
      'Select a trigger event and target service in the builder modal.'
    );
  }, [showToast]);

  const handleRefreshStatus = useCallback(() => {
    showToast('info', 'Refreshing Ecosystem Status', 'Probing OAuth endpoints for all connected providers...');
  }, [showToast]);

  const handleExportConfig = useCallback(() => {
    showToast('success', 'Exported Configuration', 'Download integration manifest JSON file.');
  }, [showToast]);

  return (
    <div id="integrations-page-container" className="min-h-full bg-background text-foreground pb-12">
      {/* Top Header Banner adhering strictly to CONFIGURATION ARCHETYPE */}
      <div id="integrations-header-banner" className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cinema-amber-500 bg-cinema-amber-500/10 px-2.5 py-0.5 rounded-full border border-cinema-amber-500/20">
                CONFIGURATION ARCHETYPE
              </span>
              <span className="text-xs font-mono text-muted-foreground">ECOSYSTEM INTEGRATION HUB</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground flex items-center gap-2.5 mt-1">
              <Link2 className="w-7 h-7 text-cinema-amber-500" /> Integration Hub & Services
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl mt-0.5">
              Discover, connect, monitor, configure, and automate external cloud storage, AI voice providers, and genealogy tools powering your storytelling workflow.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStatus}
              className="cursor-pointer border-border hover:border-cinema-amber-500 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-cinema-amber-500" /> Refresh Status
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportConfig}
              className="cursor-pointer border-border hover:border-cinema-amber-500 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Config
            </Button>

            <Button
              variant={rightPanelOpen ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`cursor-pointer text-xs font-semibold ${
                rightPanelOpen
                  ? 'bg-cinema-amber-500 text-slate-950 hover:bg-cinema-amber-400'
                  : 'border-border hover:border-cinema-amber-500'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Context Panel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Section 0: IdeaCodex Ecosystem Integrations (First-Party Priority) */}
        <IdeaCodexEcosystemSection />

        {/* Zone 1: Integration Health Overview */}
        <IntegrationHealthOverview
          connectedCount={connectedCount}
          availableCount={availableCount}
          activeSyncsCount={activeSyncsCount}
          failedSyncsCount={failedSyncsCount}
          lastBackupTime={lastBackupTime}
          storageConnectedGb={storageConnectedGb}
          aiProvidersCount={aiProvidersCount}
        />

        {/* Zone 2: Recommended Integrations */}
        <RecommendedIntegrations
          providers={providers}
          onSelectProvider={handleSelectProvider}
          onConnectProvider={handleConnectProvider}
        />

        {/* Zone 3: Connected Services */}
        <ConnectedServicesSection
          providers={providers}
          onSelectProvider={handleSelectProvider}
          onDisconnectProvider={handleDisconnectProvider}
          onTestConnection={handleTestConnection}
        />

        {/* Zone 4: Available Services Catalog with Search & Category Chips */}
        <AvailableServicesSection
          providers={providers}
          onSelectProvider={handleSelectProvider}
          onConnectProvider={handleConnectProvider}
        />

        {/* Zone 5: Automated Integration Rules */}
        <AutomationRulesSection
          rules={automationRules}
          onToggleRule={handleToggleAutomationRule}
          onRunRule={handleRunAutomationRule}
          onCreateRule={handleCreateRule}
        />

        {/* Zone 6: Sync Activity Timeline */}
        <SyncActivityTimeline
          logs={syncLogs}
          onExportLogs={handleExportConfig}
        />
      </div>

      {/* Detail Modal / Drawer */}
      <ServiceDetailModal
        provider={activeModalProvider}
        onClose={() => setActiveModalProvider(null)}
        onConnect={handleConnectProvider}
        onDisconnect={handleDisconnectProvider}
        onTestConnection={handleTestConnection}
      />
    </div>
  );
}
