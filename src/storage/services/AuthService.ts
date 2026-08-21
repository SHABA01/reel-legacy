/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { UserSchema, SessionSchema } from '../schemas/schemas';
import { hashPassword, comparePassword } from '../utils/crypto';
import { isSupabaseConfigured, getSupabaseClient } from '../../lib/supabase';
import type { User as SupabaseAuthUser, Session as SupabaseSession, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Helper to convert a Supabase Auth User object into the application UserSchema.
 */
export function mapSupabaseUserToSchema(sbUser: SupabaseAuthUser): UserSchema {
  const meta = sbUser.user_metadata || {};
  const firstName = meta.first_name || meta.firstName || sbUser.email?.split('@')[0] || 'Member';
  const lastName = meta.last_name || meta.lastName || '';
  const fullName = meta.full_name || `${firstName} ${lastName}`.trim();
  const displayName = meta.display_name || meta.displayName || fullName || firstName;

  return {
    id: sbUser.id,
    email: sbUser.email || '',
    firstName,
    lastName,
    fullName,
    displayName,
    passwordHash: '', // Never store or expose password hashes in Supabase mode
    avatarUrl: meta.avatar_url || meta.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    coverImageUrl: meta.cover_image_url || meta.coverImageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    bio: meta.bio || 'Family Historian exploring biographic legacies.',
    timeZone: meta.time_zone || meta.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    country: meta.country || 'United States',
    language: meta.language || 'English',
    verified: !!sbUser.email_confirmed_at || !!sbUser.confirmed_at,
    accountStatus: 'active',
    role: meta.role || 'Family Historian',
    lastLogin: sbUser.last_sign_in_at || new Date().toISOString(),
    createdAt: sbUser.created_at || new Date().toISOString(),
    updatedAt: sbUser.updated_at || new Date().toISOString(),
    schemaVersion: 1
  };
}

/**
 * AuthService
 * 
 * Manages user registration, credential verification, sessions, and password recovery.
 * When Supabase environment credentials exist, Supabase Auth acts as the source of truth.
 * When running offline or in local development, it provides a resilient client-side simulation.
 */
export class AuthService {
  /**
   * Registers a new user account via Supabase Auth or local persistence.
   */
  static async register(data: {
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
    password: string;
    country?: string;
  }): Promise<UserSchema> {
    const cleanEmail = data.email.toLowerCase().trim();
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const displayName = data.displayName?.trim() || data.firstName;

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable.');

      const redirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || (typeof window !== 'undefined' ? `${window.location.origin}/verify-email` : undefined);

      const { data: authData, error } = await client.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            full_name: fullName,
            display_name: displayName,
            country: data.country || 'United States',
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!authData.user) {
        throw new Error('Registration failed. Please try again.');
      }

      return mapSupabaseUserToSchema(authData.user);
    }

    // Local Development Fallback
    const existingUser = await persistenceService.users.getByEmail(cleanEmail);
    if (existingUser) {
      throw new Error('This email address is already in use. Please sign in or use another.');
    }

    const passwordHash = await hashPassword(data.password);

    const newUser = await persistenceService.users.create({
      email: cleanEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      displayName,
      passwordHash,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      coverImageUrl: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80`,
      bio: 'Family Historian exploring biographic legacies.',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      country: data.country || 'United States',
      language: 'English',
      verified: false,
      accountStatus: 'active',
      role: 'Family Historian',
      schemaVersion: 1
    });

    return newUser;
  }

  /**
   * Logs in a user via Supabase Auth or local credentials verification.
   */
  static async login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<{ user: UserSchema; session: SessionSchema }> {
    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable.');

      const { data: authData, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!authData.user || !authData.session) {
        throw new Error('Login failed. Please verify your credentials.');
      }

      const userSchema = mapSupabaseUserToSchema(authData.user);
      const sessionSchema: SessionSchema = {
        id: authData.session.access_token.slice(-12),
        userId: authData.user.id,
        token: authData.session.access_token,
        expiresAt: new Date(authData.session.expires_at ? authData.session.expires_at * 1000 : Date.now() + 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schemaVersion: 1
      };

      return {
        user: userSchema,
        session: sessionSchema
      };
    }

    // Local Development Fallback
    const user = await persistenceService.users.getByEmail(cleanEmail);
    if (!user) {
      throw new Error('Invalid credentials. The email address or password you entered is incorrect.');
    }

    if (user.accountStatus !== 'active') {
      throw new Error('This account has been suspended or is pending activation.');
    }

    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials. The email address or password you entered is incorrect.');
    }

    const expiresAt = new Date();
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    const token = `token_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    
    const session = await persistenceService.sessions.create({
      userId: user.id,
      token,
      expiresAt: expiresAt.toISOString(),
      schemaVersion: 1
    });

    await persistenceService.users.update(user.id, {
      lastLogin: new Date().toISOString()
    });

    const updatedUser = await persistenceService.users.getById(user.id);
    
    return {
      user: updatedUser || user,
      session
    };
  }

  /**
   * Logs out the active user session.
   */
  static async logout(token?: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        await client.auth.signOut();
      }
      return;
    }

    // Local Development Fallback
    if (token) {
      const sessions = await persistenceService.sessions.getAll();
      const active = sessions.find(s => s.token === token);
      if (active) {
        await persistenceService.sessions.delete(active.id);
      }
    }
  }

  /**
   * Restores an active user session.
   */
  static async restoreSession(token?: string): Promise<UserSchema | null> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) return null;

      const { data: { session }, error } = await client.auth.getSession();
      if (error || !session?.user) return null;

      return mapSupabaseUserToSchema(session.user);
    }

    // Local Development Fallback
    if (!token) return null;
    const sessions = await persistenceService.sessions.getAll();
    const active = sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
    if (!active) return null;

    const user = await persistenceService.users.getById(active.userId);
    return user;
  }

  /**
   * Returns the current Supabase session if configured.
   */
  static async getSession(): Promise<SupabaseSession | null> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) return null;
      const { data: { session } } = await client.auth.getSession();
      return session;
    }
    return null;
  }

  /**
   * Subscribes to Supabase auth state changes.
   */
  static onAuthStateChange(
    callback: (event: AuthChangeEvent, session: SupabaseSession | null) => void
  ) {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        return client.auth.onAuthStateChange(callback);
      }
    }
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  /**
   * Verifies a user's email address.
   */
  static async verifyEmail(userId: string): Promise<UserSchema> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data: { user } } = await client.auth.getUser();
        if (user) return mapSupabaseUserToSchema(user);
      }
    }

    const updated = await persistenceService.users.update(userId, {
      verified: true
    });
    if (!updated) {
      throw new Error('User not found.');
    }
    return updated;
  }

  /**
   * Checks if an email address is available for registration.
   */
  static async checkEmailAvailability(email: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      // In Supabase, signUp will reject or handle duplicate accounts automatically
      return true;
    }

    const user = await persistenceService.users.getByEmail(email);
    return user === null;
  }

  /**
   * Resets password of a user identified by email.
   */
  static async resetPasswordByEmail(email: string, password_val: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable.');
      const { error } = await client.auth.updateUser({ password: password_val });
      if (error) throw new Error(error.message);
      return;
    }

    const user = await persistenceService.users.getByEmail(email);
    if (!user) {
      throw new Error('User not found.');
    }

    const passwordHash = await hashPassword(password_val);
    await persistenceService.users.update(user.id, {
      passwordHash
    });
  }

  /**
   * Initiates password recovery process.
   */
  static async requestPasswordReset(email: string): Promise<string> {
    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable.');

      const { error } = await client.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw new Error(error.message);
      return 'Supabase password recovery email dispatched.';
    }

    const user = await persistenceService.users.getByEmail(cleanEmail);
    if (!user) {
      throw new Error('We could not find an account with that email address.');
    }

    return `reset_token_${user.id}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Updates user profile metadata.
   */
  static async updateProfile(userId: string, updates: Partial<UserSchema>): Promise<UserSchema> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable.');

      const metaUpdates: Record<string, any> = {};
      if (updates.firstName) metaUpdates.first_name = updates.firstName;
      if (updates.lastName) metaUpdates.last_name = updates.lastName;
      if (updates.displayName) metaUpdates.display_name = updates.displayName;
      if (updates.fullName) metaUpdates.full_name = updates.fullName;
      if (updates.country) metaUpdates.country = updates.country;
      if (updates.bio) metaUpdates.bio = updates.bio;
      if (updates.timeZone) metaUpdates.time_zone = updates.timeZone;
      if (updates.avatarUrl) metaUpdates.avatar_url = updates.avatarUrl;
      if (updates.coverImageUrl) metaUpdates.cover_image_url = updates.coverImageUrl;

      const { data, error } = await client.auth.updateUser({
        data: metaUpdates
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Profile update failed.');

      return mapSupabaseUserToSchema(data.user);
    }

    const safeUpdates: Partial<UserSchema> = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.passwordHash;
    delete safeUpdates.email;

    if (updates.firstName && updates.lastName) {
      safeUpdates.fullName = `${updates.firstName} ${updates.lastName}`.trim();
    }

    const updated = await persistenceService.users.update(userId, safeUpdates);
    if (!updated) {
      throw new Error('Profile update failed. User not found.');
    }
    return updated;
  }
}

