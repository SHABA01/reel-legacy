/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
      showToast('success', 'Subscribed to Legacy Notes!', 'You are now on the ReelLegacy release catalog.');
      setNewsletterEmail('');
    }, 1200);
  };

  const handleFooterLinkClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    let active = true;
    async function fetchServerYear() {
      try {
        const response = await fetch(window.location.origin, { method: 'HEAD' });
        const dateHeader = response.headers.get('date');
        if (dateHeader && active) {
          const year = new Date(dateHeader).getFullYear();
          if (!isNaN(year) && year >= 2026) {
            setCurrentYear(year);
            return;
          }
        }
      } catch (e) {
        // ignore & fallback
      }

      try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        if (data && data.utc_datetime && active) {
          const year = new Date(data.utc_datetime).getFullYear();
          if (!isNaN(year) && year >= 2026) {
            setCurrentYear(year);
            return;
          }
        }
      } catch (e) {
        // ignore & fallback
      }

      if (active) {
        const clientYear = new Date().getFullYear();
        setCurrentYear(clientYear >= 2026 ? clientYear : 2026);
      }
    }

    fetchServerYear();
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer id="public-footer" className="bg-cinema-slate-950 text-cinema-slate-300 border-t border-cinema-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8" id="footer-layout-grid">
          {/* Brand Info */}
          <div className="space-y-4 xl:col-span-1" id="footer-brand-info">
            <button
              onClick={() => handleFooterLinkClick('home')}
              className="flex items-center gap-2 text-left cursor-pointer group"
              id="footer-logo-btn"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-logo-tile-bg transition-all group-hover:scale-105 shadow-sm">
                <Film className="h-5 w-5 text-cinema-amber-500 animate-spin-slow" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Reel<span className="text-cinema-amber-500">Legacy</span>
              </span>
            </button>
            <p className="text-xs leading-relaxed max-w-md text-cinema-slate-400 text-justify">
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
                title="ReelLegacy LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); showToast('info', 'Instagram Showcase', 'Follow our design updates and production stills.'); }}
                className="p-2 bg-cinema-slate-900 hover:bg-cinema-slate-800 rounded-lg text-cinema-slate-400 hover:text-white transition-colors"
                title="ReelLegacy Instagram"
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
                    <div className="relative group text-xs text-cinema-slate-500 flex items-center cursor-not-allowed select-none w-max">
                      <span>CareerCanvas Link</span>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-cinema-slate-900 text-cinema-amber-500 text-[9px] font-mono font-semibold tracking-wider px-2 py-1 rounded shadow-lg border border-cinema-slate-800 pointer-events-none whitespace-nowrap z-50">
                        COMING SOON
                      </div>
                    </div>
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
                    <div className="relative group text-xs text-cinema-slate-500 flex items-center cursor-not-allowed select-none w-max">
                      <span>IdeaCodex Labs</span>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-cinema-slate-900 text-cinema-amber-500 text-[9px] font-mono font-semibold tracking-wider px-2 py-1 rounded shadow-lg border border-cinema-slate-800 pointer-events-none whitespace-nowrap z-50">
                        COMING SOON
                      </div>
                    </div>
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
                      onClick={() => handleFooterLinkClick('faq')}
                      className="text-xs text-cinema-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Frequently Asked Questions
                    </button>
                  </li>
                  <li>
                    <div className="relative group text-xs text-cinema-slate-500 flex items-center cursor-not-allowed select-none w-max">
                      <span>Legacy Academy</span>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-cinema-slate-900 text-cinema-amber-500 text-[9px] font-mono font-semibold tracking-wider px-2 py-1 rounded shadow-lg border border-cinema-slate-800 pointer-events-none whitespace-nowrap z-50">
                        COMING SOON
                      </div>
                    </div>
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
        <div className="mt-12 border-t border-cinema-slate-900 pt-8 flex flex-col items-center justify-center text-center space-y-4" id="footer-newsletter-row">
          <div className="max-w-md" id="newsletter-text">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center justify-center gap-1.5">
              Subscribe to Legacy Notes <Sparkles className="w-3.5 h-3.5 text-cinema-amber-400" />
            </h3>
            <p className="mt-1.5 text-xs text-cinema-slate-400 leading-relaxed text-justify lg:text-center lg:whitespace-nowrap">
              Receive tips on legacy archiving, memory collection, and early product features.
            </p>
          </div>
          <div className="w-full max-w-sm" id="newsletter-form-container">
            <form onSubmit={handleNewsletterSubmit} className="flex w-full items-center space-x-2 justify-center">
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
        <div className="mt-8 border-t border-cinema-slate-900/60 pt-8 flex items-center justify-center text-center" id="footer-copyright-row">
          <p className="text-[10px] text-cinema-slate-500">
            © {currentYear} ReelLegacy by IdeaCodex Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
