/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthLayout } from './AuthLayout';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, ArrowLeft, Loader, CheckCircle2, AlertCircle } from 'lucide-react';

export function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const emailError = emailTouched && !email 
    ? 'Email address is required' 
    : emailTouched && !/\S+@\S+\.\S+/.test(email) 
    ? 'Please enter a valid email address' 
    : undefined;

  const isFormValid = email && /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    setErrorMsg(null);

    startTransition(async () => {
      try {
        await forgotPassword(email);
        setSuccess(true);
        showToast('success', 'Reset Link Dispatched', `A secure reset link has been sent to ${email}.`);
      } catch (err: any) {
        setErrorMsg(err.message || 'An error occurred while resetting your password.');
        showToast('error', 'Reset Failed', err.message || 'We could not dispatch a link.');
      }
    });
  };

  return (
    <AuthLayout 
      title="Restore Your Workspace Access" 
      subtitle="No worries, request a secure, time-sensitive link to reset your biography credentials and protect your legacy archive."
    >
      <div id="forgot-password-container" className="flex-grow flex flex-col justify-between h-full overflow-hidden">
        {/* Card Header - FIXED */}
        <div id="forgot-password-header" className="space-y-1 text-left pb-4 shrink-0">
          <h1 className="font-display text-2xl font-black tracking-tight text-foreground">
            Forgot Password?
          </h1>
          <p className="text-xs text-muted-foreground">
            Request a secure credentials replacement envelope.
          </p>
        </div>

        {success ? (
          <div className="flex-grow flex flex-col justify-between h-full overflow-hidden animate-fade-in" id="forgot-password-success-view">
            {/* Scrollable View Area */}
            <div className="flex-1 overflow-y-auto scrollbar-ephemeral pl-5 pr-3 py-2 min-h-[100px]" id="forgot-password-success-scroll">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-sm text-foreground">Email Sent successfully!</span>
                  <p className="leading-relaxed text-muted-foreground mt-1 text-xs">
                    A time-sensitive recovery link has been dispatched to{' '}
                    <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">{email}</span>. 
                    The link will expire in 2 hours for security safety.
                  </p>
                </div>
              </div>

              {/* Keep a minimal action to test the next step in a cleaner way */}
              <div className="pt-4" id="simulated-reset-action-block">
                <Button 
                  id="simulate-reset-link-btn"
                  onClick={() => navigate('/reset-password?token=valid-secret-token')}
                  variant="secondary"
                  className="w-full py-2.5 border border-border bg-card hover:bg-muted/50 text-foreground flex items-center justify-center gap-2 text-xs rounded-xl cursor-pointer"
                >
                  Simulate Password Reset Link
                </Button>
              </div>
            </div>

            {/* FIXED Footer */}
            <div className="shrink-0 pt-4" id="forgot-password-success-footer">
              <Link 
                id="back-to-login-success-btn"
                to="/login" 
                className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between h-full overflow-hidden" id="forgot-password-form-view">
            {/* Global States Announcement - FIXED */}
            {errorMsg && (
              <div className="shrink-0 pb-3" id="forgot-password-banners">
                <div 
                  id="forgot-password-error"
                  className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-start gap-2.5 animate-shake"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  <div>
                    <span className="font-bold">Error: </span>
                    {errorMsg}
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Fields Wrapper */}
            <div 
              className="flex-1 overflow-y-auto scrollbar-ephemeral pl-5 pr-3 py-2 min-h-[80px] max-h-[160px]" 
              id="forgot-password-inputs-scroll"
            >
              <form onSubmit={handleSubmit} className="space-y-4" id="forgot-password-form">
                <Input 
                  id="forgot-password-email"
                  label="Email Address"
                  type="email"
                  placeholder="e.g. biographer@reellegacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  error={emailError}
                  disabled={isPending}
                  leftElement={<Mail className="w-4 h-4" />}
                  autoFocus
                />
              </form>
            </div>

            {/* FIXED Footer Actions Container */}
            <div className="shrink-0 pt-4 space-y-4" id="forgot-password-footer">
              <Button 
                id="forgot-password-submit"
                type="submit"
                form="forgot-password-form"
                variant="primary"
                className="w-full py-3 rounded-xl font-bold transition-all relative overflow-hidden bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={!isFormValid || isPending}
              >
                {isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-slate-950" />
                    Sending recovery envelope...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <div className="text-center pt-2" id="forgot-password-back">
                <Link 
                  id="forgot-password-back-link"
                  to="/login" 
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
