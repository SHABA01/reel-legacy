/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class ValidationService {
  static validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validateProfile(profile: { firstName: string; lastName: string; dateOfBirth: string }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!profile.firstName.trim()) errors.push('First name is required.');
    if (!profile.lastName.trim()) errors.push('Last name is required.');
    if (!profile.dateOfBirth) errors.push('Date of birth is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateStory(story: { title: string; description: string; associatedProfileId: string }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!story.title.trim()) errors.push('Story title is required.');
    if (!story.description.trim()) errors.push('Story description is required.');
    if (!story.associatedProfileId) errors.push('An associated profile is required.');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
