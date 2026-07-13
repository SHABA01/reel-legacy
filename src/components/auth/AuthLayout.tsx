/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Film, Sparkles, Shield, Compass, BookOpen } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div 
      id="auth-layout" 
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#070b13] text-[#f8fafc] overflow-x-hidden selection:bg-cinema-amber-500/30 selection:text-cinema-amber-200"
    >
      {/* Welcome Column - Split screen (Hidden on mobile, stacked on tablet, split on large desktop) */}
      <div 
        id="auth-welcome-panel"
        className="hidden md:flex md:w-1/2 lg:w-3/5 p-8 lg:p-16 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0b1324] via-[#070b13] to-[#04060b] border-r border-[#1e293b]/40"
      >
        {/* Subtle glowing spheres */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cinema-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Branding Header */}
        <div className="flex items-center gap-3 relative z-10" id="auth-layout-brand">
          <div className="w-10 h-10 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-400">
            <Film className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Reel<span className="text-cinema-amber-500">Legacy</span>
            </span>
            <p className="text-[9px] text-[#475569] font-mono tracking-widest uppercase">Biographic Studio</p>
          </div>
        </div>

        {/* Dynamic Welcome Content */}
        <div className="my-auto max-w-lg space-y-8 relative z-10 py-12" id="auth-layout-copy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 shadow-sm shadow-cinema-amber-500/5">
              <Sparkles className="w-3 h-3 animate-pulse" /> Cinematic Legacy Preservation
            </span>
            <h2 className="font-display text-3xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              {title}
            </h2>
            <p className="text-sm lg:text-base text-[#94a3b8] leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* Core pillars checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" id="auth-pillars">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xs">
              <Shield className="w-5 h-5 text-cinema-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Absolute Privacy</h4>
                <p className="text-[11px] text-[#64748b]">Encrypted biographic logs and secure memory bank storage.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xs">
              <Compass className="w-5 h-5 text-cinema-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Guided Narration</h4>
                <p className="text-[11px] text-[#64748b]">Structured templates that map out timelines cleanly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info links */}
        <div className="flex items-center justify-between text-[11px] text-[#475569] font-mono tracking-wider relative z-10" id="auth-layout-footer-credits">
          <span>IDEACODEX LABS • © 2026</span>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-cinema-amber-500 transition-colors">TERMS</a>
            <a href="/privacy" className="hover:text-cinema-amber-500 transition-colors">PRIVACY</a>
          </div>
        </div>
      </div>

      {/* Authentication Form Column */}
      <div 
        id="auth-form-panel"
        className="w-full md:w-1/2 lg:w-2/5 min-h-screen p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-[#04060b] relative z-10"
      >
        {/* Mobile Header (Hidden on desktop) */}
        <div className="flex md:hidden items-center justify-between border-b border-[#1e293b]/30 pb-4" id="auth-mobile-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cinema-amber-500/10 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-white">
              Reel<span className="text-cinema-amber-500">Legacy</span>
            </span>
          </div>
          <span className="text-[10px] text-cinema-amber-500 font-bold bg-cinema-amber-500/5 px-2 py-0.5 rounded-full border border-cinema-amber-500/10">
            SECURE ACCESS
          </span>
        </div>

        {/* Centered card content */}
        <div className="my-auto w-full max-w-md mx-auto py-8" id="auth-card-wrapper">
          {children}
        </div>

        {/* Mobile credits footer */}
        <div className="flex md:hidden items-center justify-between text-[9px] text-[#334155] font-mono tracking-widest pt-4 border-t border-[#1e293b]/20" id="auth-mobile-footer">
          <span>IDEACODEX LABS • © 2026</span>
          <div className="flex gap-3">
            <a href="/terms" className="hover:text-cinema-amber-400 transition-colors">TERMS</a>
            <a href="/privacy" className="hover:text-cinema-amber-400 transition-colors">PRIVACY</a>
          </div>
        </div>
      </div>
    </div>
  );
}
