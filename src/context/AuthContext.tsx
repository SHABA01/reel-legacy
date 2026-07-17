/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, persistenceService } from '../storage';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  country?: string;
  isVerified: boolean;
  role: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  timeZone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  login: (email: string, password: string, rememberMe: boolean) => Promise<User>;
  register: (data: {
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
    password: string;
    country?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyEmailToken: (token: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changeEmailInVerification: (newEmail: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map UserSchema to context User format
function mapSchemaToUser(schema: any): User {
  return {
    id: schema.id,
    firstName: schema.firstName,
    lastName: schema.lastName,
    displayName: schema.displayName || schema.fullName,
    email: schema.email,
    country: schema.country,
    isVerified: schema.verified,
    role: schema.role || 'Family Historian',
    avatarUrl: schema.avatarUrl,
    coverImageUrl: schema.coverImageUrl,
    bio: schema.bio,
    timeZone: schema.timeZone
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('rl_remember_me') === 'true';
  });

  // Load session on startup
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('rl_session_token') || sessionStorage.getItem('rl_session_token');
        if (storedToken) {
          const userSchema = await AuthService.restoreSession(storedToken);
          if (userSchema) {
            setUser(mapSchemaToUser(userSchema));
            setIsAuthenticated(true);
          } else {
            // Token was expired or invalid; clean it up
            localStorage.removeItem('rl_session_token');
            sessionStorage.removeItem('rl_session_token');
          }
        }
      } catch (e) {
        console.error('Session restoration failed:', e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Update rememberMe preference in localStorage
  useEffect(() => {
    localStorage.setItem('rl_remember_me', rememberMe ? 'true' : 'false');
  }, [rememberMe]);

  /**
   * Refetches the user data from storage to keep context synced.
   */
  const refreshUser = async () => {
    if (!user) return;
    try {
      const updatedSchema = await persistenceService.users.getById(user.id);
      if (updatedSchema) {
        setUser(mapSchemaToUser(updatedSchema));
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const login = async (email: string, password_val: string, remember: boolean): Promise<User> => {
    setIsLoading(true);
    try {
      // Direct pass for sandbox connectivity error
      if (email === 'error@reellegacy.com') {
        throw new Error('Network failure. Please verify your connection.');
      }

      const { user: userSchema, session } = await AuthService.login(email, password_val, remember);
      
      const mappedUser = mapSchemaToUser(userSchema);
      setUser(mappedUser);
      setIsAuthenticated(true);
      setRememberMe(remember);

      // Store token based on rememberMe option
      if (remember) {
        localStorage.setItem('rl_session_token', session.token);
        sessionStorage.removeItem('rl_session_token');
      } else {
        sessionStorage.setItem('rl_session_token', session.token);
        localStorage.removeItem('rl_session_token');
      }

      return mappedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
    password: string;
    country?: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      // Simulate sandbox connectivity error
      if (data.email === 'error@reellegacy.com') {
        throw new Error('Network failure. Could not contact registration server.');
      }

      const userSchema = await AuthService.register(data);
      
      // Automatically log the user in to initialize active session
      const { user: loggedInUser, session } = await AuthService.login(data.email, data.password, rememberMe);
      
      const mappedUser = mapSchemaToUser(loggedInUser);
      setUser(mappedUser);
      setIsAuthenticated(true);

      // Store token
      if (rememberMe) {
        localStorage.setItem('rl_session_token', session.token);
        sessionStorage.removeItem('rl_session_token');
      } else {
        sessionStorage.setItem('rl_session_token', session.token);
        localStorage.removeItem('rl_session_token');
      }

      return mappedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('rl_session_token') || sessionStorage.getItem('rl_session_token');
      if (storedToken) {
        await AuthService.logout(storedToken);
      }
    } catch (e) {
      console.error('Logout error on backend session:', e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('rl_session_token');
      sessionStorage.removeItem('rl_session_token');
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string): Promise<void> => {
    // Sandbox simulate failure
    if (email === 'fail@reellegacy.com') {
      throw new Error('Could not resend email. Please try again.');
    }
    // Fully functional stub
    return Promise.resolve();
  };

  const verifyEmailToken = async (token: string): Promise<{ success: boolean; message: string }> => {
    return new Promise(async (resolve) => {
      if (token === 'expired') {
        resolve({ success: false, message: 'The verification link has expired. Please request a new one.' });
      } else if (token === 'invalid') {
        resolve({ success: false, message: 'The verification link is invalid or corrupted.' });
      } else {
        try {
          if (user) {
            const updatedUserSchema = await AuthService.verifyEmail(user.id);
            setUser(mapSchemaToUser(updatedUserSchema));
            resolve({ success: true, message: 'Your email address has been successfully verified.' });
          } else {
            resolve({ success: false, message: 'No active session found to verify.' });
          }
        } catch (e: any) {
          resolve({ success: false, message: e.message || 'An error occurred during verification.' });
        }
      }
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (email === 'error@reellegacy.com') {
        throw new Error('Network failure. Please try again.');
      }
      
      await AuthService.requestPasswordReset(email);
      // Retain email securely in local state to permit password replace simulation
      localStorage.setItem('rl_reset_password_email', email);
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password_val: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (token === 'expired') {
        throw new Error('The reset password link has expired.');
      }
      if (token === 'invalid') {
        throw new Error('The reset password link is invalid or has already been used.');
      }

      const email = localStorage.getItem('rl_reset_password_email');
      if (!email) {
        throw new Error('No password recovery request exists or session expired.');
      }

      await AuthService.resetPasswordByEmail(email, password_val);
      localStorage.removeItem('rl_reset_password_email');
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmailInVerification = async (newEmail: string): Promise<void> => {
    if (!user) {
      throw new Error('Must be signed in to change verification email.');
    }
    
    // Check if the target email is already taken
    const isAvailable = await AuthService.checkEmailAvailability(newEmail);
    if (!isAvailable) {
      throw new Error('This email address is already in use by another archive account.');
    }

    // Direct repository update
    const updatedUserSchema = await persistenceService.users.update(user.id, {
      email: newEmail
    });

    if (updatedUserSchema) {
      setUser(mapSchemaToUser(updatedUserSchema));
    } else {
      throw new Error('Failed to update email address.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        rememberMe,
        setRememberMe,
        login,
        register,
        logout,
        sendVerificationEmail,
        verifyEmailToken,
        forgotPassword,
        resetPassword,
        changeEmailInVerification,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
