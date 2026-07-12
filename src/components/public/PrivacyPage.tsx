/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Clock, Eye, Lock, FileText } from 'lucide-react';

export function PrivacyPage() {
  const lastUpdated = 'February 24, 2026';

  return (
    <div id="privacy-page" className="w-full bg-background relative py-16 lg:py-24 text-left">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Policy Header */}
        <div className="border-b border-border pb-8 space-y-4" id="privacy-header">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
            <Shield className="w-3.5 h-3.5" /> Security Mandate
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last Updated: {lastUpdated}</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Version 1.2</span>
            <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> AES-256 Active</span>
          </div>
        </div>

        {/* Policy Content */}
        <div className="pt-8 space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed" id="privacy-content">
          <p>
            At ReelLegacy (sustained and engineered by IdeaCodex Labs Inc.), your private memories, family timelines, co-authored transcripts, scanned documents, and finished documentary renderings are treated with the highest standard of security. We construct our systems to ensure your raw legacy media files are never leaked, mined, or sold.
          </p>

          {/* Section 1 */}
          <div className="space-y-2" id="privacy-sec-1">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              1. Information and Media We Collect
            </h3>
            <p>
              When you interact with the ReelLegacy portal, we collect specific parameters to build your personal memory database:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Profile Credentials:</strong> Name, email address, storyteller role parameters, and secure encrypted passwords.
              </li>
              <li>
                <strong>Archival Media Assets:</strong> Audio interviews, scanned letters, military transcripts, family trees, and high-resolution JPEG/PNG files uploaded directly into the Media Vault.
              </li>
              <li>
                <strong>Synchronization Parameters:</strong> Professional milestones, co-author transcripts, and project data imported securely if you choose to connect your CareerCanvas profile.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2" id="privacy-sec-2">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              2. How We Utilize Your Story Files
            </h3>
            <p>
              ReelLegacy utilizes your uploaded parameters strictly to assemble your custom timeline and render your personal documentary films. We do not engage in monetization models:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                We apply advanced OCR processing to transcribe historical letters and index dates.
              </li>
              <li>
                We pass oral recordings through private transcription engines to build script timelines.
              </li>
              <li>
                <strong>NO AI TRAINING CLONES:</strong> We guarantee that your private audio samples, transcripts, or finished family films are never used, shared, or compiled to train public generative model pipelines.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2" id="privacy-sec-3">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              3. Data Encryption & Storage Security
            </h3>
            <p>
              Our databases are engineered with multiple defense parameters:
            </p>
            <p className="mt-2">
              All files are encrypted in transit using secure SSL/TLS channels and stored at rest utilizing enterprise-grade AES-256 protocols. Media backups are written redundantly across three distinct secure regional zones to protect against catastrophic storage failure.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2" id="privacy-sec-4">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              4. Your Archival Rights
            </h3>
            <p>
              You maintain absolute custody of your family legacy. At any time, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Export your raw timeline files, transcribed scripts, and scanned image assets in standardized formats (MP3, PNG, JSON, PDF).</li>
              <li>Request immediate, permanent deletion of your entire archive, which triggers secure file scrubbing across all regional cloud backends.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-2" id="privacy-sec-5">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              5. Support and Inquiry Desk
            </h3>
            <p>
              If you have any questions regarding our security protocols, data processing boundaries, or compliance with regional privacy frameworks (such as GDPR or CCPA), please contact our legal desk:
            </p>
            <div className="p-4 bg-muted/20 border border-border rounded-xl mt-3 space-y-1" id="privacy-contacts-box">
              <p className="font-semibold text-foreground">IdeaCodex Laboratories Inc. — Legal Desk</p>
              <p>Email Channel: archivist@ideacodex.com</p>
              <p>Address: Silicon Valley, San Francisco, CA</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
