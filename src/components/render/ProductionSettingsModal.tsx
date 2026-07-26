/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RenderQueueService } from '../../services/renderQueueService';
import { ProductionSettings } from '../../types/render';
import { Cpu, HardDrive, Cloud, Bell, Shield, Sliders } from 'lucide-react';

interface ProductionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProductionSettings;
  onSave: (settings: Partial<ProductionSettings>) => void;
}

export const ProductionSettingsModal: React.FC<ProductionSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [maxWorkers, setMaxWorkers] = useState(settings.maxParallelWorkers);
  const [gpuAccel, setGpuAccel] = useState(settings.gpuAcceleration);
  const [autoCleanupDays, setAutoCleanupDays] = useState(settings.autoCleanupDays);
  const [maxStorage, setMaxStorage] = useState(settings.maxStorageLimitGB);
  const [cloudSync, setCloudSync] = useState(settings.cloudSyncEnabled);
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  const [notify, setNotify] = useState(settings.notifyOnCompletion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      maxParallelWorkers: maxWorkers,
      gpuAcceleration: gpuAccel,
      autoCleanupDays: autoCleanupDays,
      maxStorageLimitGB: maxStorage,
      cloudSyncEnabled: cloudSync,
      webhookUrl: webhookUrl,
      notifyOnCompletion: notify,
    });
    onClose();
  };

  return (
    <Modal
      id="production-settings-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Production Queue & GPU Pipeline Settings"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <p className="text-xs text-muted-foreground">
          Configure rendering hardware allocation, parallel encoding workers, cloud webhook synchronization, and storage retention.
        </p>

        {/* Parallel Workers & GPU Acceleration */}
        <div className="p-3.5 bg-muted/30 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cinema-amber-500" />
            Hardware & Worker Allocation
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="settings-max-workers"
              label="Parallel Render Workers"
              type="number"
              min={1}
              max={8}
              value={maxWorkers}
              onChange={(e) => setMaxWorkers(Number(e.target.value))}
            />

            <Input
              id="settings-max-storage"
              label="Storage Buffer Threshold (GB)"
              type="number"
              value={maxStorage}
              onChange={(e) => setMaxStorage(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="settings-gpu"
              checked={gpuAccel}
              onChange={(e) => setGpuAccel(e.target.checked)}
              className="rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
            />
            <label htmlFor="settings-gpu" className="text-xs text-foreground font-medium cursor-pointer">
              Enable Simulated Hardware GPU Acceleration (NVENC / QuickSync)
            </label>
          </div>
        </div>

        {/* Cloud Sync & Webhook */}
        <div className="p-3.5 bg-muted/30 border border-border rounded-2xl space-y-3">
          <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-blue-400" />
            Cloud Synchronization & Webhooks
          </h4>

          <Input
            id="settings-webhook"
            label="Export Webhook Endpoint URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://api.yourdomain.com/webhooks/renders"
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="settings-cloud-sync"
              checked={cloudSync}
              onChange={(e) => setCloudSync(e.target.checked)}
              className="rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
            />
            <label htmlFor="settings-cloud-sync" className="text-xs text-foreground font-medium cursor-pointer">
              Auto-sync completed export bundles to ReelLegacy Cloud Archival Storage
            </label>
          </div>
        </div>

        {/* Notifications & Retention */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="settings-auto-cleanup"
            label="Auto-cleanup Cache (Days)"
            type="number"
            value={autoCleanupDays}
            onChange={(e) => setAutoCleanupDays(Number(e.target.value))}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">
              Notifications
            </label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="settings-notify"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
              />
              <label htmlFor="settings-notify" className="text-xs text-foreground font-medium cursor-pointer">
                Notify on completed / failed render
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs"
          >
            Save Production Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
};
