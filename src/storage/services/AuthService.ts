/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { UserSchema, SessionSchema } from '../schemas/schemas';
import { hashPassword, comparePassword } from '../utils/crypto';

export class AuthService {
  /**
   * Registers a new local user account.
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
    
    // Check if user already exists
    const existingUser = await persistenceService.users.getByEmail(cleanEmail);
    if (existingUser) {
      throw new Error('This email address is already in use. Please sign in or use another.');
    }

    // Encrypt password
    const passwordHash = await hashPassword(data.password);
    
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const displayName = data.displayName?.trim() || data.firstName;

    const newUser = await persistenceService.users.create({
      email: cleanEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      displayName,
      passwordHash,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`, // Elegant default portrait
      coverImageUrl: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80`, // Elegant tech/cosmic banner
      bio: 'Family Historian exploring biographic legacies.',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      country: data.country || 'United States',
      language: 'English',
      verified: false, // Must verify email
      accountStatus: 'active',
      role: 'Family Historian',
      schemaVersion: 1
    });

    return newUser;
  }

  /**
   * Logs in a user by comparing the stored password hash.
   */
  static async login(email: string, password: string, rememberMe: boolean): Promise<{ user: UserSchema; session: SessionSchema }> {
    const cleanEmail = email.toLowerCase().trim();
    
    const user = await persistenceService.users.getByEmail(cleanEmail);
    if (!user) {
      throw new Error('Invalid credentials. The email address or password you entered is incorrect.');
    }

    if (user.accountStatus !== 'active') {
      throw new Error('This account has been suspended or is pending activation.');
    }

    // Verify password hash
    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials. The email address or password you entered is incorrect.');
    }

    // Create a new session
    const expiresAt = new Date();
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days session
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours session
    }

    const token = `token_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    
    const session = await persistenceService.sessions.create({
      userId: user.id,
      token,
      expiresAt: expiresAt.toISOString(),
      schemaVersion: 1
    });

    // Update user's last login
    await persistenceService.users.update(user.id, {
      lastLogin: new Date().toISOString()
    });

    // Fetch updated user
    const updatedUser = await persistenceService.users.getById(user.id);
    
    return {
      user: updatedUser || user,
      session
    };
  }

  /**
   * Logs out the user by terminating the session.
   */
  static async logout(token: string): Promise<void> {
    const sessions = await persistenceService.sessions.getAll();
    const active = sessions.find(s => s.token === token);
    if (active) {
      await persistenceService.sessions.delete(active.id);
    }
  }

  /**
   * Restores a user session from storage.
   */
  static async restoreSession(token: string): Promise<UserSchema | null> {
    const sessions = await persistenceService.sessions.getAll();
    const active = sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
    if (!active) return null;

    const user = await persistenceService.users.getById(active.userId);
    return user;
  }

  /**
   * Verifies a user's email address.
   */
  static async verifyEmail(userId: string): Promise<UserSchema> {
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
    const user = await persistenceService.users.getByEmail(email);
    return user === null;
  }

  /**
   * Resets password of a user identified by email.
   */
  static async resetPasswordByEmail(email: string, password_val: string): Promise<void> {
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
    const user = await persistenceService.users.getByEmail(cleanEmail);
    if (!user) {
      throw new Error('We could not find an account with that email address.');
    }

    // Return a simulated token
    return `reset_token_${user.id}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Updates user profile info.
   */
  static async updateProfile(userId: string, updates: Partial<UserSchema>): Promise<UserSchema> {
    // Prevent updating critical fields directly
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
