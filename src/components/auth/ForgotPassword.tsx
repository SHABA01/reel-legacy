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
      <div id="forgot-password-container" className="space-y-6">
        {/* Card Header */}
        <div id="forgot-password-header" className="space-y-1 text-left">
          <h1 className="font-display text-2xl font-black tracking-tight text-white">
            Forgot Password?
          </h1>
          <p className="text-xs text-[#64748b]">
            Request a secure credentials replacement envelope.
          </p>
        </div>

        {success ? (
          <div className="space-y-6 animate-fade-in" id="forgot-password-success-view">
            {/* Success Banner */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-sm text-white">Email Sent successfully!</span>
                <p className="leading-relaxed text-[#94a3b8] mt-1 text-xs">
                  A time-sensitive recovery link has been dispatched to{' '}
                  <span className="text-emerald-400 font-mono font-bold">{email}</span>. 
                  The link will expire in 2 hours for security safety.
                </p>
              </div>
            </div>

            {/* Quick Simulation Help */}
            <div className="p-3.5 rounded-xl bg-cinema-amber-500/5 border border-cinema-amber-500/20 text-[11px] text-cinema-amber-400 space-y-1 font-sans">
              <span className="font-bold uppercase tracking-wider text-[9px] font-mono">Sandbox Simulator:</span>
              <p className="leading-relaxed">
                To test the next step of the flow, click the button below to simulate receiving the link:<br />
                <code className="text-white bg-slate-950/70 p-1 rounded mt-1 select-all block text-center font-mono">/reset-password?token=valid-secret-token</code>
              </p>
            </div>

            <Button 
              id="simulate-reset-link-btn"
              onClick={() => navigate('/reset-password?token=valid-secret-token')}
              variant="secondary"
              className="w-full py-3 border border-slate-800 bg-slate-900/40 text-white flex items-center justify-center gap-2 text-xs"
            >
              Simulate Password Reset Link
            </Button>

            <Link 
              id="back-to-login-success-btn"
              to="/login" 
              className="flex items-center justify-center gap-2 text-xs text-[#64748b] hover:text-white transition-colors pt-2 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="space-y-5" id="forgot-password-form-view">
            {errorMsg && (
              <div 
                id="forgot-password-error"
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-shake"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <span className="font-bold">Error: </span>
                  {errorMsg}
                </div>
              </div>
            )}

            {/* Simulated Error Tips */}
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-[10px] text-[#475569] font-mono leading-relaxed" id="forgot-password-sandbox-tips">
              <span className="text-cinema-amber-500 font-bold uppercase block mb-0.5 text-[9px]">Sandbox Simulation Guides:</span>
              Enter <span className="text-[#94a3b8] font-bold">notfound@reellegacy.com</span> to simulate an "email not found" error, or <span className="text-[#94a3b8] font-bold">error@reellegacy.com</span> to simulate a connection fault.
            </div>

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

              <Button 
                id="forgot-password-submit"
                type="submit"
                variant="primary"
                className="w-full py-3 rounded-xl font-bold transition-all relative overflow-hidden bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
            </form>

            <div className="text-center pt-2" id="forgot-password-back">
              <Link 
                id="forgot-password-back-link"
                to="/login" 
                className="inline-flex items-center gap-1.5 text-xs text-[#64748b] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
