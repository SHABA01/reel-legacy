/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  country?: string;
  isVerified: boolean;
  role: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      // Simulate checking session status (1s delay)
      try {
        const storedAuth = localStorage.getItem('rl_authenticated') === 'true' || 
                           sessionStorage.getItem('rl_authenticated') === 'true';
        
        const storedUserJson = localStorage.getItem('rl_user') || sessionStorage.getItem('rl_user');
        
        if (storedAuth && storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          setUser(storedUser);
          setIsAuthenticated(true);
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

  const login = async (email: string, password: string, remember: boolean): Promise<User> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        // Standard user test credentials or random
        if (email === 'error@reellegacy.com') {
          reject(new Error('Network failure. Please verify your connection.'));
          return;
        }
        if (password === 'wrongpass') {
          reject(new Error('Invalid credentials. The email address or password you entered is incorrect.'));
          return;
        }

        const mockUser: User = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'Johnnie',
          email,
          country: 'United States',
          isVerified: email !== 'unverified@reellegacy.com', // Simulate unverified email
          role: 'Family Historian'
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        setRememberMe(remember);

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('rl_authenticated', 'true');
        storage.setItem('rl_user', JSON.stringify(mockUser));

        resolve(mockUser);
      }, 1500);
    });
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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        
        if (data.email === 'taken@reellegacy.com') {
          reject(new Error('This email address is already in use. Please sign in or use another.'));
          return;
        }
        if (data.email === 'error@reellegacy.com') {
          reject(new Error('Network failure. Could not contact registration server.'));
          return;
        }

        const newUser: User = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName || `${data.firstName} ${data.lastName.charAt(0)}.`,
          email: data.email,
          country: data.country || 'United States',
          isVerified: false, // Starts as unverified
          role: 'Family Historian'
        };

        // For registration, we do NOT automatically mark them fully authenticated as they need verification
        // But for mock purposes, we can store their user information
        setUser(newUser);
        setIsAuthenticated(true); // Let them sign in to view verification flow

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('rl_authenticated', 'true');
        storage.setItem('rl_user', JSON.stringify(newUser));

        resolve(newUser);
      }, 1500);
    });
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);

        localStorage.removeItem('rl_authenticated');
        localStorage.removeItem('rl_user');
        sessionStorage.removeItem('rl_authenticated');
        sessionStorage.removeItem('rl_user');
        
        resolve();
      }, 1000);
    });
  };

  const sendVerificationEmail = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'fail@reellegacy.com') {
          reject(new Error('Could not resend email. Please try again.'));
        } else {
          resolve();
        }
      }, 1200);
    });
  };

  const verifyEmailToken = async (token: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (token === 'expired') {
          resolve({ success: false, message: 'The verification link has expired. Please request a new one.' });
        } else if (token === 'invalid') {
          resolve({ success: false, message: 'The verification link is invalid or corrupted.' });
        } else {
          // Success
          if (user) {
            const verifiedUser = { ...user, isVerified: true };
            setUser(verifiedUser);
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('rl_user', JSON.stringify(verifiedUser));
          }
          resolve({ success: true, message: 'Your email address has been successfully verified.' });
        }
      }, 1500);
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (email === 'notfound@reellegacy.com') {
          reject(new Error('We could not find an account with that email address.'));
        } else if (email === 'error@reellegacy.com') {
          reject(new Error('Network failure. Please try again.'));
        } else {
          resolve();
        }
      }, 1500);
    });
  };

  const resetPassword = async (token: string, password_val: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (token === 'expired') {
          reject(new Error('The reset password link has expired.'));
        } else if (token === 'invalid') {
          reject(new Error('The reset password link is invalid or has already been used.'));
        } else {
          resolve();
        }
      }, 1500);
    });
  };

  const changeEmailInVerification = async (newEmail: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
          reject(new Error('Invalid email format'));
          return;
        }
        if (user) {
          const updatedUser = { ...user, email: newEmail };
          setUser(updatedUser);
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('rl_user', JSON.stringify(updatedUser));
        }
        resolve();
      }, 1000);
    });
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
        changeEmailInVerification
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
