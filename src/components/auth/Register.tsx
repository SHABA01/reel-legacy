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
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { Mail, Lock, Eye, EyeOff, Loader, User, Globe, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'ZA', label: 'South Africa' },
];

export function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Field states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('US');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Field touch states
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Async states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Password rules validation helper
  const isPasswordValid = (pass: string) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /\d/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    );
  };

  // Field Validation
  const firstNameError = touched.firstName && !firstName.trim() ? 'First name is required' : undefined;
  const lastNameError = touched.lastName && !lastName.trim() ? 'Last name is required' : undefined;
  
  const emailError = touched.email && !email 
    ? 'Email address is required' 
    : touched.email && !/\S+@\S+\.\S+/.test(email) 
    ? 'Please enter a valid email address' 
    : undefined;

  const passwordError = touched.password && !password 
    ? 'Password is required' 
    : touched.password && !isPasswordValid(password)
    ? 'Password does not meet all criteria rules'
    : undefined;

  const confirmPasswordError = touched.confirmPassword && !confirmPassword 
    ? 'Please confirm your password' 
    : touched.confirmPassword && password !== confirmPassword 
    ? 'Passwords do not match' 
    : undefined;

  const isFormValid = 
    firstName.trim() && 
    lastName.trim() && 
    email && 
    /\S+@\S+\.\S+/.test(email) && 
    password && 
    isPasswordValid(password) && 
    confirmPassword === password && 
    agreeTerms && 
    agreePrivacy;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        await register({
          firstName,
          lastName,
          displayName: displayName.trim() || undefined,
          email,
          password,
          country: COUNTRIES.find(c => c.value === country)?.label
        });

        setSuccessMsg('Account created! Generating biographic space & verifying email...');
        showToast('success', 'Registration Successful!', 'Your personal archive workspace has been provisioned.');
        
        setTimeout(() => {
          navigate('/verify-email');
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred during registration.');
        showToast('error', 'Registration Failed', err.message || 'Please check form errors.');
      }
    });
  };

  return (
    <AuthLayout 
      title="Begin Your Storytelling Journey" 
      subtitle="Register an account to map timelines, synthesize transcripts, upload biographic metadata, and collaborate on premium legacy documentaries."
    >
      <div id="register-container" className="space-y-6">
        {/* Card Header */}
        <div id="register-header" className="space-y-1 text-left">
          <h1 className="font-display text-2xl font-black tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-xs text-[#64748b]">
            Provision your biographic studio with zero initial costs.
          </p>
        </div>

        {/* Global States Announcement */}
        {errorMsg && (
          <div 
            id="register-error-banner"
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-shake"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
            <div>
              <span className="font-bold">Error: </span>
              {errorMsg}
            </div>
          </div>
        )}

        {successMsg && (
          <div 
            id="register-success-banner"
            className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5"
          >
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <span className="font-bold">Registered: </span>
              {successMsg}
            </div>
          </div>
        )}

        {/* Core Register Form */}
        <form onSubmit={handleRegister} className="space-y-4" id="register-form">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3" id="register-full-name-row">
            <Input 
              id="register-firstname"
              label="First Name"
              type="text"
              placeholder="e.g. Eleanor"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur('firstName')}
              error={firstNameError}
              disabled={isPending}
              leftElement={<User className="w-4 h-4" />}
            />
            <Input 
              id="register-lastname"
              label="Last Name"
              type="text"
              placeholder="e.g. Vance"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur('lastName')}
              error={lastNameError}
              disabled={isPending}
              leftElement={<User className="w-4 h-4" />}
            />
          </div>

          {/* Optional Display Name */}
          <Input 
            id="register-displayname"
            label="Display Name (Optional)"
            type="text"
            placeholder="e.g. Ellie (defaults to First Name)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isPending}
            leftElement={<Sparkles className="w-4 h-4" />}
          />

          {/* Email Address */}
          <Input 
            id="register-email"
            label="Email Address"
            type="email"
            placeholder="e.g. biographer@reellegacy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            error={emailError}
            disabled={isPending}
            leftElement={<Mail className="w-4 h-4" />}
          />

          {/* Password */}
          <Input 
            id="register-password"
            label="Security Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Choose a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            error={passwordError}
            disabled={isPending}
            leftElement={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                id="register-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Live Password Strength Meter */}
          {password && (
            <PasswordStrengthMeter password={password} />
          )}

          {/* Confirm Password */}
          <Input 
            id="register-confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter security password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            error={confirmPasswordError}
            disabled={isPending}
            leftElement={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                id="register-toggle-confirm-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-white transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Country Selection */}
          <div className="w-full flex flex-col gap-1.5" id="register-country-container">
            <label htmlFor="register-country" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Country of Residence
            </label>
            <div className="relative flex items-center w-full" id="register-country-wrapper">
              <div className="absolute left-3 text-muted-foreground flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <select
                id="register-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isPending}
                className="w-full bg-card border border-border text-sm font-sans rounded-lg py-2.5 pl-10 pr-3.5 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-cinema-amber-500 focus:border-transparent cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Agreements Checkboxes */}
          <div className="space-y-3.5 pt-2" id="register-agreements">
            <label className="flex items-start gap-2.5 text-xs text-[#94a3b8] cursor-pointer select-none" id="agree-terms-label">
              <input 
                id="register-agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-[#1e293b] bg-slate-900 text-cinema-amber-500 focus:ring-cinema-amber-500/50 w-4 h-4 cursor-pointer mt-0.5"
              />
              <span>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noreferrer" className="text-cinema-amber-500 hover:underline">
                  Terms of Service
                </a>{' '}
                and accept responsibility for my content.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-[#94a3b8] cursor-pointer select-none" id="agree-privacy-label">
              <input 
                id="register-agree-privacy"
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="rounded border-[#1e293b] bg-slate-900 text-cinema-amber-500 focus:ring-cinema-amber-500/50 w-4 h-4 cursor-pointer mt-0.5"
              />
              <span>
                I agree to the{' '}
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-cinema-amber-500 hover:underline">
                  Privacy Policy
                </a>{' '}
                and consent to secure data encryption rules.
              </span>
            </label>
          </div>

          {/* Create Button */}
          <Button 
            id="register-submit"
            type="submit"
            variant="primary"
            className="w-full py-3 rounded-xl font-bold transition-all relative overflow-hidden bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid || isPending}
          >
            {isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-slate-950" />
                Provisioning studio...
              </>
            ) : (
              'Create Free Workspace'
            )}
          </Button>
        </form>

        {/* Login Redirect Link */}
        <div className="text-center pt-2 text-xs text-[#64748b]" id="register-login-redirect">
          Already have an archive account?{' '}
          <Link 
            id="register-sign-in-btn"
            to="/login" 
            className="text-cinema-amber-500 hover:text-cinema-amber-400 hover:underline font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
