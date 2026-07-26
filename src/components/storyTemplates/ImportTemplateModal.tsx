/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoryTemplate } from '../../types/storyTemplate';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TemplateImportExportService } from '../../services/templateImportExportService';
import { Upload, FileCode, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateImported: (template: StoryTemplate) => void;
}

export const ImportTemplateModal: React.FC<ImportTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateImported,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    setError(null);
    if (!jsonText.trim()) {
      setError('Please paste valid JSON template data or drop a .json file.');
      return;
    }

    try {
      const imported = TemplateImportExportService.importTemplateJSON(jsonText);
      onTemplateImported(imported);
      setJsonText('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse JSON file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      id="import-template-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Import Narrative Blueprint JSON"
      size="md"
    >
      <div className="space-y-4 pt-2">
        <p className="text-xs text-muted-foreground">
          Paste a story template JSON blueprint or drop a file exported from another ReelLegacy studio.
        </p>
        {/* File Upload Drop Zone */}
        <div className="border-2 border-dashed border-border hover:border-cinema-amber-500/50 rounded-2xl p-4 text-center space-y-2 bg-muted/20 transition-colors">
          <Upload className="w-6 h-6 text-cinema-amber-500 mx-auto" />
          <div className="text-xs">
            <label className="font-bold text-cinema-amber-500 cursor-pointer hover:underline">
              Choose .json blueprint file
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              Supports .json template schema exports
            </p>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">
            Or Paste JSON Code:
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            rows={8}
            placeholder='{ "name": "Custom Blueprint", "narrativeBlueprint": { ... } }'
            className="w-full p-3 rounded-xl bg-black/80 font-mono text-[11px] text-amber-200 border border-border focus:outline-none focus:border-cinema-amber-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleImport}
            className="bg-cinema-amber-500 text-black hover:bg-cinema-amber-400 font-bold text-xs gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            Import Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};
