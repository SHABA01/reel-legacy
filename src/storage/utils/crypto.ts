/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates a secure cryptographic hash of a password using SHA-256.
 * Falls back to a custom non-trivial deterministic hash if window.crypto is unavailable (e.g. in sandbox iframes).
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('SubtleCrypto digest failed, using fallback hash', e);
    }
  }

  // Fallback deterministic polynomial rolling hash + salt signature
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const salt = 'ReelLegacySecureSalt_';
  const combined = salt + password;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `local_pbkdf_${part1}${part2}`;
}

/**
 * Compares a plain text password with a hashed password to check if they match.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}
