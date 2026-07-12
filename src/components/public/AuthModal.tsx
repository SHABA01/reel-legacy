/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Sparkles, Film, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialTab = 'login', onSuccess }: AuthModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [storytellerRole, setStorytellerRole] = useState('family_historian');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize state when modal is opened with a specific tab
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setRegisterStep(1);
      setErrors({});
    }
  }, [isOpen, initialTab]);

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms of service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setRegisterStep(2);
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'login') {
      const newErrors: { [key: string]: string } = {};
      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!password) {
        newErrors.password = 'Password is required';
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
    } else {
      // Register submission
      if (registerStep === 1) {
        handleNextStep();
        return;
      }
      if (!validateStep2()) return;
    }
    
    setIsLoading(true);
    
    // Simulate auth check and redirect to mock dashboard or trigger success
    setTimeout(() => {
      setIsLoading(false);
      if (activeTab === 'login') {
        showToast('success', 'Logged in successfully!', 'Welcome back to your cinematic legacy.');
      } else {
        showToast('success', 'Account created successfully!', 'Your personal archive has been provisioned.');
      }
      onClose();
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/65 backdrop-blur-sm">
          {/* Backdrop click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            id="auth-modal-container"
            className="relative w-full max-w-md overflow-hidden bg-card text-foreground rounded-2xl border border-border shadow-2xl z-10"
          >
            {/* Header visual banner */}
            <div className="relative p-6 bg-gradient-to-r from-cinema-slate-950 to-cinema-slate-900 text-white border-b border-border/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cinema-amber-500/10 border border-cinema-amber-500/30 flex items-center justify-center text-cinema-amber-400 shrink-0">
                <Film className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  ReelLegacy Portal <Sparkles className="w-4.5 h-4.5 text-cinema-amber-400" />
                </h3>
                <p className="text-xs text-cinema-slate-400">
                  Preserving authentic stories for generations to come.
                </p>
              </div>
              <button
                onClick={onClose}
                id="close-auth-modal"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-cinema-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Tab Toggles */}
              <div className="flex bg-muted/50 p-1 rounded-xl border border-border/40" id="auth-tab-group">
                <button
                  id="tab-btn-login"
                  onClick={() => {
                    setActiveTab('login');
                    setErrors({});
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-btn-register"
                  onClick={() => {
                    setActiveTab('register');
                    setRegisterStep(1);
                    setErrors({});
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
                {activeTab === 'login' ? (
                  /* Login Fields */
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label htmlFor="auth-email" className="block text-xs font-semibold text-muted-foreground mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="auth-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className={`w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                            errors.email ? 'border-red-500/80' : 'border-border'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="auth-password" className="block text-xs font-semibold text-muted-foreground">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => showToast('info', 'Password reset request initiated.', 'Check your email for reset instructions shortly.')}
                          className="text-[11px] font-semibold text-cinema-amber-600 dark:text-cinema-amber-400 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="auth-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                            errors.password ? 'border-red-500/80' : 'border-border'
                          }`}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        id="submit-auth-btn"
                        type="submit"
                        variant="accent"
                        isLoading={isLoading}
                        className="w-full flex justify-center gap-2"
                      >
                        <span>Access My Archive</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Register Fields with 2-Step Process */
                  <div className="space-y-4 animate-fade-in">
                    {registerStep === 1 ? (
                      /* Step 1 */
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <label htmlFor="auth-fullname" className="block text-xs font-semibold text-muted-foreground mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              id="auth-fullname"
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Eleanor Vance"
                              className={`w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                                errors.fullName ? 'border-red-500/80' : 'border-border'
                              }`}
                            />
                          </div>
                          {errors.fullName && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="auth-role" className="block text-xs font-semibold text-muted-foreground mb-1">
                            I am capturing a legacy for
                          </label>
                          <select
                            id="auth-role"
                            value={storytellerRole}
                            onChange={(e) => setStorytellerRole(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all"
                          >
                            <option value="family_historian">Family Historian / Ancestry Archivist</option>
                            <option value="career_veteran">Retiring Executive / Career Veteran</option>
                            <option value="autobiographer">Myself (Autobiography & Memoirs)</option>
                            <option value="professional">Professional Legacy Biographer</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                          <span className="font-semibold text-cinema-amber-500">Step 1 of 2</span>
                          <span>Personal details</span>
                        </div>

                        <div className="pt-2">
                          <Button
                            id="register-step1-btn"
                            type="button"
                            onClick={handleNextStep}
                            variant="accent"
                            className="w-full flex justify-center gap-2"
                          >
                            <span>Continue to Next Step</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Step 2 */
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <label htmlFor="auth-email" className="block text-xs font-semibold text-muted-foreground mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              id="auth-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className={`w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                                errors.email ? 'border-red-500/80' : 'border-border'
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="auth-password" className="block text-xs font-semibold text-muted-foreground mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              id="auth-password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className={`w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/30 focus:border-cinema-amber-500 transition-all ${
                                errors.password ? 'border-red-500/80' : 'border-border'
                              }`}
                            />
                          </div>
                          {errors.password && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-start gap-2.5 mt-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={acceptTerms}
                              onChange={(e) => setAcceptTerms(e.target.checked)}
                              className="mt-0.5 rounded border-border text-cinema-amber-500 focus:ring-cinema-amber-500 cursor-pointer"
                            />
                            <span className="text-[11px] leading-relaxed text-muted-foreground">
                              I agree to the{' '}
                              <span className="text-foreground underline font-medium">Terms of Service</span>{' '}
                              and acknowledge the{' '}
                              <span className="text-foreground underline font-medium">Privacy Policy</span>.
                            </span>
                          </label>
                          {errors.acceptTerms && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.acceptTerms}</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                          <span className="font-semibold text-cinema-amber-500">Step 2 of 2</span>
                          <span>Account credentials</span>
                        </div>

                        <div className="pt-2 space-y-2">
                          <Button
                            id="submit-auth-btn"
                            type="submit"
                            variant="accent"
                            isLoading={isLoading}
                            className="w-full flex justify-center gap-2"
                          >
                            <span>Begin My Journey</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              setRegisterStep(1);
                              setErrors({});
                            }}
                            className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground py-1 cursor-pointer transition-colors"
                          >
                            Go Back to Step 1
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Conversational trust flags */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground" id="auth-trust-banners">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> AES-256 Secured
                </span>
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cinema-amber-500" /> Help Support active
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
