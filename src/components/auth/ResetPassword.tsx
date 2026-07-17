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
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { Lock, Eye, EyeOff, Loader, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export function ResetPassword() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'valid-secret-token'; // Defaults to valid for sandbox play

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Touch states
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Validate the recovery link token immediately
  useEffect(() => {
    if (token === 'expired') {
      setErrorMsg('This password recovery link has expired. Please request a new link.');
      showToast('error', 'Token Expired', 'The recovery token has timed out.');
    } else if (token === 'invalid') {
      setErrorMsg('This password recovery link is invalid or corrupted. Please check your recovery email.');
      showToast('error', 'Invalid Token', 'The recovery signature is corrupt.');
    }
  }, [token, showToast]);

  const isPasswordValid = (pass: string) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /\d/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    );
  };

  const passwordError = passwordTouched && !password 
    ? 'Password is required' 
    : passwordTouched && !isPasswordValid(password)
    ? 'Password does not meet all strength requirements'
    : undefined;

  const confirmPasswordError = confirmPasswordTouched && !confirmPassword
    ? 'Please confirm your password'
    : confirmPasswordTouched && password !== confirmPassword
    ? 'Passwords do not match'
    : undefined;

  const isFormValid = 
    password && 
    isPasswordValid(password) && 
    confirmPassword === password && 
    token !== 'expired' && 
    token !== 'invalid';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    setErrorMsg(null);

    startTransition(async () => {
      try {
        await resetPassword(token, password);
        setSuccess(true);
        showToast('success', 'Credentials Forged', 'Your security password has been updated. You can now log in.');
      } catch (err: any) {
        setErrorMsg(err.message || 'An error occurred while forging your new password.');
        showToast('error', 'Forge Failed', err.message || 'We could not update your credentials.');
      }
    });
  };

  return (
    <AuthLayout 
      title="Forge a New Secret Key" 
      subtitle="Update your security password with robust, non-overlapping criteria to shield your biographic memoirs from unauthorized exposure."
    >
      <div id="reset-password-container" className="flex-grow flex flex-col justify-between h-full overflow-hidden">
        {/* Card Header - FIXED */}
        <div id="reset-password-header" className="space-y-1 text-left pb-4 shrink-0">
          <h1 className="font-display text-2xl font-black tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Establish your fresh archive access secrets.
          </p>
        </div>

        {success ? (
          <div className="flex-grow flex flex-col justify-between h-full overflow-hidden animate-fade-in" id="reset-password-success-view">
            {/* Scrollable Success Area */}
            <div className="flex-1 overflow-y-auto scrollbar-ephemeral pl-5 pr-3 py-2 min-h-[100px]" id="reset-password-success-scroll">
              <div className="text-center py-4 space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/5 animate-scale-in">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-xl font-bold text-foreground">Password Updated!</h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Your new security signature has been synchronized globally. You can now use it to restore your biographic session.
                  </p>
                </div>
              </div>
            </div>

            {/* FIXED Footer */}
            <div className="shrink-0 pt-4" id="reset-password-success-footer">
              <Link to="/login" className="block">
                <Button 
                  id="reset-success-login-btn"
                  variant="primary"
                  className="w-full py-3 bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 font-bold rounded-xl cursor-pointer"
                >
                  Sign In to Studio <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between h-full overflow-hidden" id="reset-password-form-view">
            {/* Global States Announcement - FIXED */}
            {errorMsg && (
              <div className="shrink-0 pb-3" id="reset-password-banners">
                <div 
                  id="reset-password-error-banner"
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
              className="flex-1 overflow-y-auto scrollbar-ephemeral pl-5 pr-3 py-2 min-h-[100px] max-h-[220px]" 
              id="reset-password-inputs-scroll"
            >
              <form onSubmit={handleSubmit} className="space-y-4" id="reset-password-form">
                {/* New Password */}
                <Input 
                  id="reset-password-new"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Choose a robust password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  error={passwordError}
                  disabled={isPending || token === 'expired' || token === 'invalid'}
                  leftElement={<Lock className="w-4 h-4" />}
                  autoFocus
                />

                {/* Strength Meter */}
                {password && (
                  <PasswordStrengthMeter password={password} />
                )}

                {/* Confirm Password */}
                <Input 
                  id="reset-password-confirm"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password for validation"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  error={confirmPasswordError}
                  disabled={isPending || token === 'expired' || token === 'invalid'}
                  leftElement={<Lock className="w-4 h-4" />}
                  rightElement={
                    <button
                      type="button"
                      id="reset-password-toggle-confirm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </form>
            </div>

            {/* FIXED Footer Actions Container */}
            <div className="shrink-0 pt-4 space-y-4" id="reset-password-footer">
              <Button 
                id="reset-password-submit"
                type="submit"
                form="reset-password-form"
                variant="primary"
                className="w-full py-3 rounded-xl font-bold transition-all relative overflow-hidden bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={!isFormValid || isPending}
              >
                {isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-slate-950" />
                    Synchronizing keys...
                  </>
                ) : (
                  'Forge New Password'
                )}
              </Button>

              <div className="text-center pt-2" id="reset-password-back">
                <Link 
                  id="reset-password-back-login"
                  to="/login" 
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
