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
import { Mail, Lock, Eye, EyeOff, Loader, Chrome, Linkedin, AlertCircle, CheckCircle } from 'lucide-react';

export function Login() {
  const { login, rememberMe, setRememberMe } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Individual field dirty states for validation
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Live validation errors
  const emailError = emailTouched && !email 
    ? 'Email address is required' 
    : emailTouched && !/\S+@\S+\.\S+/.test(email) 
    ? 'Please enter a valid email address' 
    : undefined;

  const passwordError = passwordTouched && !password 
    ? 'Password is required' 
    : undefined;

  const isFormValid = email && /\S+@\S+\.\S+/.test(email) && password;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const user = await login(email, password, rememberMe);
        setSuccessMsg('Authentication successful! Initializing workspace...');
        showToast('success', 'Logged in successfully!', `Welcome back, ${user.displayName || 'Storyteller'}.`);
        
        // Delay navigation slightly to let user see success state/animation
        setTimeout(() => {
          if (!user.isVerified) {
            navigate('/verify-email');
          } else {
            navigate('/workspace/dashboard');
          }
        }, 1200);
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred during login.');
        showToast('error', 'Login Failed', err.message || 'Please check your credentials.');
      }
    });
  };

  return (
    <AuthLayout 
      title="Access Your Cinematic Legacy" 
      subtitle="Securely log in to continue mapping, compiling, and rendering your life story into television-grade biographic documentaries."
    >
      <div id="login-container" className="flex-grow flex flex-col justify-between h-full overflow-hidden">
        {/* Card Header - FIXED */}
        <div id="login-header" className="space-y-1 text-left pb-4 shrink-0">
          <h1 className="font-display text-2xl font-black tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your credentials to restore your biographic session.
          </p>
        </div>

        {/* Global States Announcement - FIXED */}
        {(errorMsg || successMsg) && (
          <div className="shrink-0 pb-3" id="login-banners-wrapper">
            {errorMsg && (
              <div 
                id="login-error-banner"
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-start gap-2.5 animate-shake"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <span className="font-bold">Access Denied: </span>
                  {errorMsg}
                </div>
              </div>
            )}

            {successMsg && (
              <div 
                id="login-success-banner"
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                <div>
                  <span className="font-bold">Verified: </span>
                  {successMsg}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Form Input Fields */}
        <div 
          className="flex-1 overflow-y-auto scrollbar-ephemeral pl-5 pr-3 py-2 min-h-[100px] max-h-[220px]" 
          id="login-inputs-scroll-container"
        >
          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <Input 
              id="login-email"
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

            <Input 
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your security password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              error={passwordError}
              disabled={isPending}
              leftElement={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  id="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </form>
        </div>

        {/* FIXED Footer Actions Container */}
        <div className="shrink-0 pt-4 space-y-4" id="login-footer-fixed">
          {/* Form helper controls */}
          <div className="flex items-center justify-between text-xs font-medium" id="login-helper-controls">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none" id="login-remember-me-label">
              <input 
                id="login-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border bg-card text-cinema-amber-500 focus:ring-cinema-amber-500/50 w-4 h-4 cursor-pointer"
              />
              Remember Me
            </label>
            <Link 
              id="login-forgot-password-link"
              to="/forgot-password" 
              className="text-cinema-amber-500 hover:text-cinema-amber-400 hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Action */}
          <Button 
            id="login-submit"
            type="submit"
            form="login-form"
            variant="primary"
            className="w-full py-3 rounded-xl font-bold transition-all relative overflow-hidden bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={!isFormValid || isPending}
          >
            {isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-slate-950" />
                Initializing workspace...
              </>
            ) : (
              'Login to Workspace'
            )}
          </Button>

          {/* Divider */}
          <div className="relative flex py-1.5 items-center" id="login-divider">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink mx-4 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              or continue with
            </span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3" id="login-socials">
            <button 
              type="button" 
              id="social-login-google"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border hover:bg-muted/40 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all active:scale-[0.97] cursor-pointer"
              onClick={() => showToast('info', 'Google OAuth Integration', 'Under development. Production redirect placeholder.')}
            >
              <Chrome className="w-4 h-4" />
              <span>Google</span>
            </button>
            <button 
              type="button" 
              id="social-login-linkedin"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border hover:bg-muted/40 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all active:scale-[0.97] cursor-pointer"
              onClick={() => showToast('info', 'LinkedIn OAuth Integration', 'Under development. LinkedIn Professional login placeholder.')}
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </button>
          </div>

          {/* Register Redirect Link */}
          <div className="text-center pt-2 text-xs text-muted-foreground" id="login-register-redirect">
            Don't have an archive account?{' '}
            <Link 
              id="login-create-account-btn"
              to="/register" 
              className="text-cinema-amber-500 hover:text-cinema-amber-400 hover:underline font-semibold transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
