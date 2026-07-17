/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  Building,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

interface ContactPageProps {
  setCurrentPage: (page: string) => void;
}

export function ContactPage({ setCurrentPage }: ContactPageProps) {
  const { showToast } = useToast();

  // Contact form state parameters
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = 'Please enter your name';
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!message) newErrors.message = 'Please enter your message details';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('success', 'Inquiry submitted successfully!', 'Our ReelLegacy support team will contact you within 24 hours.');
      setFullName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  const handlePageNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="contact-page" className="w-full bg-background relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16" id="contact-header">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 border border-cinema-amber-500/20">
            <Mail className="w-3.5 h-3.5 animate-pulse" /> Global Support Desk
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Contact ReelLegacy Support
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Have questions about rendering documentaries, security parameters, or ReelLegacy services? We are here to assist you.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto" id="contact-grid">
          
          {/* Left Form Panel */}
          <div className="lg:col-span-7 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm text-left space-y-6" id="contact-form-card">
            <h3 className="font-display text-base font-bold text-foreground">
              Send a Secure Inquiry
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4" id="contact-inquiry-form">
              <div>
                <label htmlFor="contact-fullname" className="block text-xs font-semibold text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Philip Vance"
                  className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                    errors.fullName ? 'border-red-500/80' : 'border-border'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-muted-foreground mb-1">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                    errors.email ? 'border-red-500/80' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-muted-foreground mb-1">
                  Message Details
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry about ReelLegacy services, rendering, or how we can help you..."
                  className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                    errors.message ? 'border-red-500/80' : 'border-border'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.message}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  id="contact-submit-btn"
                  type="submit"
                  variant="accent"
                  isLoading={isSubmitting}
                  className="w-full justify-center gap-2"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Submit Inquiry Securely
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-border/60 flex items-center gap-1.5 text-[10px] text-muted-foreground" id="contact-form-footer">
              <ShieldCheck className="w-4 h-4 text-green-500" /> AES-256 Encrypted Communication. No SPAM guaranteed.
            </div>
          </div>

          {/* Right Corporate Info Panel */}
          <div className="lg:col-span-5 space-y-8 text-left" id="contact-info-panel">
            {/* Business Contact Cards */}
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-xs" id="corp-address-card">
              <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-cinema-amber-500" /> Company Information
              </h3>
              
              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cinema-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">IdeaCodex Laboratories Inc.</h4>
                    <p>Intellectual Property & Design Labs</p>
                    <p>Silicon Valley, San Francisco, CA</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-cinema-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Email Channels</h4>
                    <p className="hover:underline">support@ideacodex.com</p>
                    <p className="hover:underline">support@reellegacy.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-cinema-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Operational Hours</h4>
                    <p>Monday – Friday: 8:00 AM – 6:00 PM PST</p>
                    <p>Saturday: 10:00 AM – 3:00 PM PST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link to FAQ Shortcut */}
            <div className="p-6 border border-border bg-muted/15 rounded-2xl space-y-3" id="contact-faq-shortcut">
              <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cinema-amber-500" /> Have basic questions?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Before sending an inquiry, check our structured accordion to learn about billing, rendering speeds, and CareerCanvas API scopes.
              </p>
              <button
                onClick={() => handlePageNavigation('faq')}
                className="text-xs font-semibold text-cinema-amber-600 dark:text-cinema-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Read FAQs accordion <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
