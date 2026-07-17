/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Film, Sparkles, Shield, Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div 
      id="auth-layout" 
      className="min-h-screen w-full flex flex-col md:flex-row bg-background text-foreground overflow-x-hidden selection:bg-cinema-amber-500/30 selection:text-cinema-amber-200"
    >
      {/* Welcome Column - Split screen (Hidden on mobile, stacked on tablet, split on large desktop) */}
      <div 
        id="auth-welcome-panel"
        className="hidden md:flex md:w-[40%] lg:w-[40%] p-8 lg:p-16 flex-col justify-between relative overflow-hidden bg-auth-welcome dark:bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-[10px_0_30px_rgba(0,0,0,0.02)] dark:shadow-[10px_0_30px_rgba(0,0,0,0.15)] z-20 shrink-0"
      >
        {/* Subtle glowing spheres */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cinema-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Branding Header with Home Link */}
        <div className="flex items-center justify-between relative z-10" id="auth-layout-brand">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-logo-tile-bg transition-all shadow-sm">
              <Film className="h-5 w-5 text-cinema-amber-500 animate-spin-slow" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">
              Reel<span className="text-cinema-amber-500">Legacy</span>
            </span>
          </div>

          <Link
            id="auth-back-to-home"
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-sidebar-foreground/75 hover:text-sidebar-foreground bg-white/10 dark:bg-white/5 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all border border-sidebar-border shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
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
            <h2 className="font-display text-3xl lg:text-[2.6rem] font-black tracking-tight leading-[1.1] text-sidebar-foreground">
              {title}
            </h2>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* Core pillars checklist */}
          <div className="grid grid-cols-2 gap-4 pt-4" id="auth-pillars">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/40 bg-auth-pillar-card dark:bg-cinema-slate-900/40 border border-sidebar-border backdrop-blur-xs">
              <Shield className="w-5 h-5 text-cinema-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-sidebar-foreground">Absolute Privacy</h4>
                <p className="text-[11px] text-sidebar-foreground/70 leading-normal">Encrypted biographic logs and secure memory bank storage.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/40 bg-auth-pillar-card dark:bg-cinema-slate-900/40 border border-sidebar-border backdrop-blur-xs">
              <Compass className="w-5 h-5 text-cinema-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-sidebar-foreground">Guided Narration</h4>
                <p className="text-[11px] text-sidebar-foreground/70 leading-normal">Structured templates that map out timelines cleanly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Form Column */}
      <div 
        id="auth-form-panel"
        className="w-full md:w-[60%] lg:w-[60%] md:h-screen p-6 sm:p-12 lg:p-16 flex flex-col justify-start md:justify-center bg-auth-form dark:bg-[#070c16] relative z-10 overflow-hidden shadow-[-15px_0_35px_-5px_rgba(0,0,0,0.04)] dark:shadow-[-15px_0_35px_-5px_rgba(0,0,0,0.3)]"
      >
        {/* Mobile Header (Hidden on desktop) */}
        <div className="flex md:hidden items-center justify-between border-b border-border/40 pb-4" id="auth-mobile-header">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-logo-tile-bg shadow-sm">
              <Film className="h-4 w-4 text-cinema-amber-500 animate-spin-slow" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-foreground">
              Reel<span className="text-cinema-amber-500">Legacy</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              id="auth-mobile-back-to-home"
              to="/"
              className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted/60 dark:bg-white/5 px-2.5 py-1 rounded-full border border-border/40"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Home</span>
            </Link>
            <span className="text-[10px] text-cinema-amber-500 font-bold bg-cinema-amber-500/10 px-2.5 py-1 rounded-full border border-cinema-amber-500/20">
              SECURE ACCESS
            </span>
          </div>
        </div>

        {/* Card Content - Fixed Outer Shell, Internal elements handle scroll */}
        <div className="flex-1 flex flex-col justify-between w-full max-w-md mx-auto py-4 md:py-8 overflow-hidden" id="auth-card-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
