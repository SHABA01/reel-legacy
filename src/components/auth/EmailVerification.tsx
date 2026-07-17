/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthLayout } from './AuthLayout';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Loader, LogOut, Edit2 } from 'lucide-react';

export function EmailVerification() {
  const { user, verifyEmailToken, sendVerificationEmail, changeEmailInVerification, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Interactive Verification states
  const [verificationState, setVerificationState] = useState<'idle' | 'loading' | 'success' | 'expired' | 'invalid'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Resend and editing states
  const [resending, setResending] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  // If a token is supplied in the URL, verify it immediately
  useEffect(() => {
    if (token) {
      setVerificationState('loading');
      verifyEmailToken(token).then((result) => {
        if (result.success) {
          setVerificationState('success');
          setStatusMessage(result.message);
          showToast('success', 'Email Verified', result.message);
        } else {
          if (token === 'expired') {
            setVerificationState('expired');
          } else {
            setVerificationState('invalid');
          }
          setStatusMessage(result.message);
          showToast('error', 'Verification Failed', result.message);
        }
      });
    } else if (user?.isVerified) {
      setVerificationState('success');
      setStatusMessage('Your email address is already verified.');
    }
  }, [token, user?.isVerified, verifyEmailToken, showToast]);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await sendVerificationEmail(user.email);
      showToast('success', 'Email Dispatched', `A secure verification token was sent to ${user.email}.`);
    } catch (err: any) {
      showToast('error', 'Dispatch Failed', err.message || 'Could not resend code.');
    } finally {
      setResending(false);
    }
  };

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(undefined);

    startTransition(async () => {
      try {
        await changeEmailInVerification(newEmail);
        showToast('success', 'Email Updated', `Your register address has been updated to ${newEmail}.`);
        setEditMode(false);
        // Automatically trigger a resend for the new address
        await sendVerificationEmail(newEmail);
      } catch (err: any) {
        setEmailError(err.message || 'Failed to update email address.');
      }
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AuthLayout 
      title="Secure Your Biographic Archive" 
      subtitle="Before rendering legacy footage or drafting memories, we must verify ownership of your communication address to preserve credential protection."
    >
      <div id="email-verification-container" className="space-y-6">
        {/* Token Verification Loading State */}
        {verificationState === 'loading' && (
          <div className="text-center py-8 space-y-4" id="verification-loading">
            <div className="w-16 h-16 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-500 mx-auto">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-white">Validating Secret Link...</h2>
              <p className="text-xs text-[#64748b] max-w-xs mx-auto">
                Comparing signature tokens against local security registers.
              </p>
            </div>
          </div>
        )}

        {/* Token Verification SUCCESS State */}
        {verificationState === 'success' && (
          <div className="text-center py-6 space-y-6 animate-fade-in" id="verification-success">
            {/* Success Illustration Placeholder */}
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/5">
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-white">Verified Successfully!</h2>
              <p className="text-xs text-emerald-400 font-semibold px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 inline-block">
                Secure Session Active
              </p>
              <p className="text-xs text-[#94a3b8] max-w-sm mx-auto leading-relaxed pt-2">
                {statusMessage || 'Your biographic profile is validated and authorized. You have been granted complete cinematic editing capabilities.'}
              </p>
            </div>
            <Button 
              id="verification-continue-btn"
              onClick={() => navigate('/workspace/dashboard')}
              variant="primary"
              className="w-full py-3 rounded-xl font-bold bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Enter Studio Workspace <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Token Verification EXPIRED State */}
        {verificationState === 'expired' && (
          <div className="text-center py-6 space-y-6 animate-fade-in" id="verification-expired">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-foreground">Verification Link Expired</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Security tokens expire after 24 hours. Request another verification link to unlock the studio.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Button 
                id="verification-expired-resend"
                onClick={handleResend}
                disabled={resending}
                variant="primary"
                className="w-full bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950"
              >
                {resending ? 'Requesting Link...' : 'Resend Verification Link'}
              </Button>
              <Link to="/login" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
                Return to Login
              </Link>
            </div>
          </div>
        )}

        {/* Token Verification INVALID State */}
        {verificationState === 'invalid' && (
          <div className="text-center py-6 space-y-6 animate-fade-in" id="verification-invalid">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-foreground">Invalid Verification Token</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                This verification signature is corrupted or has already been consumed. Please check the address or request a fresh token.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Button 
                id="verification-invalid-resend"
                onClick={handleResend}
                disabled={resending}
                variant="primary"
                className="w-full bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950"
              >
                {resending ? 'Requesting Link...' : 'Resend Verification Link'}
              </Button>
              <Link to="/login" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">
                Return to Login
              </Link>
            </div>
          </div>
        )}

        {/* Pending Verification screen (Idle state, no token in query string) */}
        {verificationState === 'idle' && (
          <div className="space-y-6 animate-fade-in" id="verification-pending">
            {/* Header / Illustration Placeholder */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-cinema-amber-500/5 border border-cinema-amber-500/20 flex items-center justify-center text-cinema-amber-400 shadow-lg">
                <Mail className="w-10 h-10 animate-pulse text-cinema-amber-500" />
              </div>
              <div className="space-y-1">
                <h1 className="font-display text-xl font-bold text-foreground">Check your Inbox</h1>
                <p className="text-xs text-muted-foreground">
                  A verification link is on its way to your account.
                </p>
              </div>
            </div>

            {/* Verification message / Info Banner */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground leading-relaxed animate-fade-in" id="verification-pending-banner">
              We have dispatched a time-sensitive verification email to{' '}
              <span className="text-foreground font-bold block mt-1 font-mono tracking-wide">{user?.email || 'your email address'}</span>. 
              Click the link inside to confirm ownership and authorize full cinematic rendering modules.
            </div>

            {/* Actions: Resend or Edit Email */}
            {editMode ? (
              <form onSubmit={handleUpdateEmail} className="space-y-3.5 p-3.5 rounded-xl bg-muted/40 border border-border/50 animate-fade-in" id="verification-edit-email-form">
                <Input 
                  id="verification-new-email"
                  label="Update Email Address"
                  type="email"
                  placeholder="e.g. biographer@reellegacy.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  error={emailError}
                  disabled={isPending}
                  leftElement={<Mail className="w-4 h-4" />}
                />
                <div className="flex gap-2 justify-end text-xs">
                  <button 
                    type="button" 
                    id="verification-cancel-edit-email"
                    onClick={() => {
                      setEditMode(false);
                      setNewEmail(user?.email || '');
                      setEmailError(undefined);
                    }}
                    className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button 
                    id="verification-save-edit-email"
                    type="submit" 
                    variant="primary" 
                    className="py-1 px-4 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950"
                    disabled={isPending}
                  >
                    {isPending ? 'Updating...' : 'Save & Send'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-2 pt-2" id="verification-actions">
                <Button 
                  id="verification-pending-resend"
                  onClick={handleResend}
                  disabled={resending}
                  variant="primary"
                  className="w-full py-3 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 font-semibold"
                >
                  {resending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-slate-950" />
                      Dispatched...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>

                <div className="flex justify-between items-center text-xs text-muted-foreground px-1" id="verification-secondary-actions">
                  <button 
                    type="button" 
                    id="verification-change-email"
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Incorrect email address?
                  </button>
                  
                  <button 
                    type="button" 
                    id="verification-pending-logout"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors text-red-500 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="text-center pt-2 text-xs text-muted-foreground" id="verification-back-login">
              <Link to="/login" className="hover:text-foreground hover:underline transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
