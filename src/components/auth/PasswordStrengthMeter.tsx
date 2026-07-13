/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getRequirements = (pass: string) => {
    return [
      { id: 'length', label: 'Minimum 8 characters', met: pass.length >= 8 },
      { id: 'upper', label: 'At least 1 uppercase letter', met: /[A-Z]/.test(pass) },
      { id: 'lower', label: 'At least 1 lowercase letter', met: /[a-z]/.test(pass) },
      { id: 'number', label: 'At least 1 digit (0-9)', met: /\d/.test(pass) },
      { id: 'special', label: 'At least 1 special symbol', met: /[^A-Za-z0-9]/.test(pass) },
    ];
  };

  const requirements = getRequirements(password);
  const metCount = requirements.filter(req => req.met).length;

  const getStrengthLabel = (count: number, passLen: number) => {
    if (passLen === 0) return { label: 'Empty', color: 'bg-neutral-800', textColor: 'text-[#475569]' };
    if (count <= 2) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400' };
    if (count <= 3) return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-400' };
    if (count <= 4) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400' };
    return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
  };

  const strength = getStrengthLabel(metCount, password.length);

  return (
    <div className="space-y-3.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/40" id="password-strength-container">
      {/* Header with Strength Label */}
      <div className="flex items-center justify-between text-xs" id="password-strength-header">
        <span className="font-medium text-[#94a3b8]">Security Strength</span>
        <span className={`font-bold uppercase tracking-wider text-[10px] ${strength.textColor}`}>
          {strength.label}
        </span>
      </div>

      {/* Visual Strength Bars */}
      <div className="grid grid-cols-4 gap-1.5" id="password-strength-bars">
        {[1, 2, 3, 4].map((index) => {
          let barColor = 'bg-neutral-800';
          if (password.length > 0) {
            if (index === 1 && metCount >= 1) barColor = strength.color;
            if (index === 2 && metCount >= 3) barColor = strength.color;
            if (index === 3 && metCount >= 4) barColor = strength.color;
            if (index === 4 && metCount === 5) barColor = strength.color;
          }
          return (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-350 ${barColor}`} 
            />
          );
        })}
      </div>

      {/* Live Checklists */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/30" id="password-criteria-checklist">
        {requirements.map((req) => (
          <div key={req.id} className="flex items-center gap-2 text-[11px]" id={`criteria-${req.id}`}>
            <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full shrink-0 transition-all duration-300 ${
              req.met 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-slate-850 text-[#475569] border border-slate-800/40'
            }`}>
              {req.met ? (
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              ) : (
                <X className="w-2 h-2 stroke-[3]" />
              )}
            </span>
            <span className={`transition-colors duration-200 ${req.met ? 'text-emerald-400 font-medium' : 'text-[#64748b]'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
