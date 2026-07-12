/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Film, Send, Shield, Sparkles, Youtube, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export function Footer({ setCurrentPage }: FooterProps) {
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    if (!/\S+@\S+\.\S+/.test(newsletterEmail)) {
      showToast('error', 'Invalid email address', 'Please enter a valid email to join our circular.');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      showToast('success', 'Subscribed to Cinema Notes!', 'You are now on the ReelLegacy release catalog.');
      setNewsletterEmail('');
    }, 1200);
  };

  const handleFooterLinkClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="public-footer" className="bg-cinema-slate-950 text-cinema-slate-300 border-t border-cinema-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8" id="footer-layout-grid">
          {/* Brand Info */}
          <div className="space-y-4 xl:col-span-1" id="footer-brand-info">
            <button
              onClick={() => handleFooterLinkClick('home')}
              className="flex items-center gap-2 text-left cursor-pointer"
              id="footer-logo-btn"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-400">
                <Film className="h-5 w-5 animate-spin-slow" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Reel<span className="text-cinema-amber-500">Legacy</span>
              </span>
            </button>
            <p className="text-xs leading-relaxed max-w-md text-cinema-slate-400">
              The premier AI-assisted cinematic storytelling platform. We bridge modern filmmaking technology with personal, family, and career histories to produce broadcast-quality legacy documentaries that endure forever.
            </p>
            {/* Social icons */}
            <div className="flex space-x-3 pt-2" id="footer-social-links">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); showToast('info', 'YouTube Legacy Hub', 'Our cinematic showcases and process tutorials will launch soon.'); }}
                className="p-2 bg-cinema-slate-900 hover:bg-cinema-slate-800 rounded-lg text-cinema-slate-400 hover:text-white transition-colors"
                title="ReelLegacy YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); showToast('info', 'LinkedIn Profile', 'Connect with IdeaCodex Labs on professional networking channels.'); }}
                className="p-2 bg-cinema-slate-900 hover:bg-cinema-slate-800 rounded-lg text-cinema-slate-400 hover:text-white transition-colors"
                title="LinkedIn IdeaCodex"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); showToast('info', 'Instagram Showcase', 'Follow our design updates and production stills.'); }}
                className="p-2 bg-cinema-slate-900 hover:bg-cinema-slate-800 rounded-lg text-cinema-slate-400 hover:text-white transition-colors"
                title="Instagram Reels"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation link sets */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0" id="footer-nav-grids">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Product links */}
              <div id="footer-col-product">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Product</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('features')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Features Directory
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('story-types')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Supported Story Types
                    </button>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); showToast('info', 'CareerCanvas Integration', 'Directly load career transcripts and portfolios into ReelLegacy.'); }}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors flex items-center gap-1"
                    >
                      CareerCanvas Link <Sparkles className="w-3 h-3 text-cinema-amber-400" />
                    </a>
                  </li>
                </ul>
              </div>
              {/* Company links */}
              <div className="mt-10 md:mt-0" id="footer-col-company">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Company</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('about')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      About Us & Mission
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('contact')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Contact Sales & Support
                    </button>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); showToast('info', 'IdeaCodex Labs', 'ReelLegacy is designed and sustained by IdeaCodex Labs.'); }}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      IdeaCodex Labs
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Resources */}
              <div id="footer-col-resources">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Resources</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('help')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('faq')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Frequently Asked Questions
                    </button>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); showToast('info', 'Legacy Academy', 'Curated guides and interview questions for capturing grandparent memories.'); }}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Legacy Academy
                    </a>
                  </li>
                </ul>
              </div>
              {/* Legal info */}
              <div className="mt-10 md:mt-0" id="footer-col-legal">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Legal</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('privacy')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFooterLinkClick('terms')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li className="text-[10px] text-cinema-slate-500 flex items-center gap-1 pt-1">
                    <Shield className="w-3 h-3 text-cinema-amber-500" /> CCPA & GDPR Compliant
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter and final brand row */}
        <div className="mt-12 border-t border-cinema-slate-900 pt-8 lg:flex lg:items-center lg:justify-between" id="footer-newsletter-row">
          <div className="max-w-md lg:max-w-none" id="newsletter-text">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
              Subscribe to Cinema Notes <Sparkles className="w-3.5 h-3.5 text-cinema-amber-400" />
            </h3>
            <p className="mt-1.5 text-xs text-cinema-slate-400 leading-relaxed">
              Receive tips on legacy archiving, memory collection, and early product features.
            </p>
          </div>
          <div className="mt-4 sm:flex sm:max-w-md lg:mt-0 lg:ml-8" id="newsletter-form-container">
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-sm items-center space-x-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-3 py-1.5 text-xs bg-cinema-slate-900 border border-cinema-slate-800 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-cinema-amber-500 focus:border-cinema-amber-500"
                disabled={newsletterStatus === 'success'}
              />
              <button
                type="submit"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-cinema-amber-500 px-3 text-xs font-semibold text-cinema-slate-950 hover:bg-cinema-amber-600 cursor-pointer disabled:opacity-50"
                disabled={newsletterStatus === 'success'}
              >
                {newsletterStatus === 'loading' ? '...' : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-cinema-slate-900/60 pt-8 md:flex md:items-center md:justify-between" id="footer-copyright-row">
          <p className="text-[10px] text-cinema-slate-500 md:order-1">
            &copy; {currentYear} ReelLegacy by IdeaCodex Labs. All rights reserved.
          </p>
          <p className="mt-2 text-[10px] text-cinema-slate-500 md:order-2 md:mt-0">
            Designed for enduring authenticity. Built on React & motion.
          </p>
        </div>
      </div>
    </footer>
  );
}
