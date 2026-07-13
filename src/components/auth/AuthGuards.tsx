/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Film, Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current path so we can redirect back after authentication
      localStorage.setItem('rl_redirect_after_auth', location.pathname);
    }
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    const from = localStorage.getItem('rl_redirect_after_auth') || '/workspace/dashboard';
    // Clear redirect after fetching
    localStorage.removeItem('rl_redirect_after_auth');
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

function AuthLoadingScreen() {
  return (
    <div 
      id="auth-global-loader"
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070b13] text-white"
    >
      <div className="relative flex flex-col items-center space-y-4" id="loader-content">
        <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-cinema-amber-400 shadow-2xl relative overflow-hidden">
          <Film className="w-8 h-8 animate-pulse text-cinema-amber-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-amber-500/10 to-transparent pointer-events-none" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#64748b] tracking-widest uppercase">
          <Loader className="w-3.5 h-3.5 animate-spin text-cinema-amber-500" />
          Restoring Session...
        </div>
      </div>
    </div>
  );
}
