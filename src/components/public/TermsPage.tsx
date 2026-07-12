/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, Clock, ShieldCheck, Scale, Globe } from 'lucide-react';

export function TermsPage() {
  const lastUpdated = 'February 24, 2026';

  return (
    <div id="terms-page" className="w-full bg-background relative py-16 lg:py-24 text-left">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Terms Header */}
        <div className="border-b border-border pb-8 space-y-4" id="terms-header">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
            <Scale className="w-3.5 h-3.5" /> Legal Parameters
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last Updated: {lastUpdated}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Compliance Active</span>
            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Global Platform</span>
          </div>
        </div>

        {/* Terms Content */}
        <div className="pt-8 space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed" id="terms-content">
          <p>
            Welcome to ReelLegacy. By registering a profile, utilizing our online timeline tools, importing files from CareerCanvas, or triggering documentary compilation render jobs, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before accessing our system.
          </p>

          {/* Section 1 */}
          <div className="space-y-2" id="terms-sec-1">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              1. Profile Registration & Security
            </h3>
            <p>
              To access the memory creation studio, you must establish an archivist profile. You are solely responsible for maintaining the confidentiality of your login passwords. You agree to notify our support desk immediately of any unauthorized portal entry. ReelLegacy is not liable for data losses resulting from shared credentials.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2" id="terms-sec-2">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              2. Uploaded Media Content & Intellectual Property
            </h3>
            <p>
              ReelLegacy claims **zero ownership** over your uploaded assets, oral interviews, family trees, patent lists, or final rendered video files:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>You guarantee that you own or possess the appropriate permission to compile all photographs, audio tapes, and historical documents uploaded into our system.</li>
              <li>You are strictly prohibited from uploading media assets that infringe on copyrights, patents, or trade secrets of other individuals or corporations.</li>
              <li>You grant ReelLegacy a limited, technical, non-exclusive license solely to process and render your media into timelines and documentaries within your secure, private portal. We never share or display your memoirs without explicit permission.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2" id="terms-sec-3">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              3. AI Content & Generative Guardrails
            </h3>
            <p>
              The ReelLegacy AI Biography Assistant, transcript summarizing networks, and text-to-speech narrators are constructed to aid writing and editing. You acknowledge that you maintain the final edit authority. You are solely responsible for reviewing rendered script previews to confirm factual and biographical accuracy. ReelLegacy is not liable for errors in final rendered films resulting from unreviewed scripts.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2" id="terms-sec-4">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              4. Service Availability & Rendering Limitations
            </h3>
            <p>
              While ReelLegacy and IdeaCodex Labs strive to maintain high-performance rendering clouds, we do not guarantee uninterrupted system access. Documentary exports may occasionally experience queuing delays during periods of extreme high demand. We reserve the right to limit rendering capacities or introduce monthly processing hour allowances to maintain balance across our server networks.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2" id="terms-sec-5">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              5. Support and Dispute Desk
            </h3>
            <p>
              These terms are governed by the laws of the State of California. Any disputes, billing questions, or compliance concerns regarding intellectual property rights or licensing limitations should be brought to our legal channels:
            </p>
            <div className="p-4 bg-muted/20 border border-border rounded-xl mt-3 space-y-1" id="terms-contacts-box">
              <p className="font-semibold text-foreground">IdeaCodex Laboratories Inc. — Legal & Archivist Desk</p>
              <p>Email Channel: support@reellegacy.com</p>
              <p>Address: Silicon Valley, San Francisco, CA</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
