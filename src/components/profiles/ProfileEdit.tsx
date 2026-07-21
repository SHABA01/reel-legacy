/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  User,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';
import { ExtendedLegacyProfile } from './mockData';

interface ProfileEditProps {
  profile: ExtendedLegacyProfile;
  onCancel: () => void;
  onSave: (updatedProfile: ExtendedLegacyProfile) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'personal', label: 'Personal Biography' },
  { value: 'autobiography', label: 'Autobiography' },
  { value: 'memorial', label: 'Memorial Tribute' },
  { value: 'celebration', label: 'Celebration of Life' },
  { value: 'career', label: 'Career Journey' },
  { value: 'family-history', label: 'Family History' },
  { value: 'historical-figure', label: 'Historical Figure' },
  { value: 'organization', label: 'Organization Archive' },
  { value: 'community', label: 'Community Leader' },
] as const;

export function ProfileEdit({ profile, onCancel, onSave }: ProfileEditProps) {
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    middleName: profile.middleName || '',
    lastName: profile.lastName,
    preferredName: profile.preferredName,
    nickname: profile.nickname || '',
    gender: profile.gender || 'Male',
    dateOfBirth: profile.dateOfBirth,
    placeOfBirth: profile.placeOfBirth || '',
    dateOfDeath: profile.dateOfDeath || '',
    placeOfDeath: profile.placeOfDeath || '',
    nationality: profile.nationality || '',
    lifeStatus: profile.lifeStatus,
    category: profile.category,
    relationship: profile.relationship,
    biographySummary: profile.biographySummary || '',
    status: profile.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Track modification
  useEffect(() => {
    const isModified =
      formData.firstName !== profile.firstName ||
      formData.middleName !== (profile.middleName || '') ||
      formData.lastName !== profile.lastName ||
      formData.preferredName !== profile.preferredName ||
      formData.nickname !== (profile.nickname || '') ||
      formData.gender !== (profile.gender || 'Male') ||
      formData.dateOfBirth !== profile.dateOfBirth ||
      formData.placeOfBirth !== (profile.placeOfBirth || '') ||
      formData.dateOfDeath !== (profile.dateOfDeath || '') ||
      formData.placeOfDeath !== (profile.placeOfDeath || '') ||
      formData.nationality !== (profile.nationality || '') ||
      formData.lifeStatus !== profile.lifeStatus ||
      formData.category !== profile.category ||
      formData.relationship !== profile.relationship ||
      formData.biographySummary !== (profile.biographySummary || '') ||
      formData.status !== profile.status;

    setIsDirty(isModified);
  }, [formData, profile]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required.';
    if (!formData.relationship.trim()) newErrors.relationship = 'Relationship node description is required.';

    if (formData.lifeStatus !== 'living' && !formData.dateOfDeath) {
      newErrors.dateOfDeath = 'Date of Death is required for non-living profiles.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('warning', 'Review Form Details', 'Please resolve highlighted issues before saving.');
      return;
    }

    const updatedProfile: ExtendedLegacyProfile = {
      ...profile,
      firstName: formData.firstName,
      middleName: formData.middleName || undefined,
      lastName: formData.lastName,
      preferredName: formData.preferredName || `${formData.firstName} ${formData.lastName}`,
      nickname: formData.nickname || undefined,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      placeOfBirth: formData.placeOfBirth || undefined,
      dateOfDeath: formData.lifeStatus !== 'living' ? formData.dateOfDeath || undefined : undefined,
      placeOfDeath: formData.lifeStatus !== 'living' ? formData.placeOfDeath || undefined : undefined,
      nationality: formData.nationality || undefined,
      lifeStatus: formData.lifeStatus,
      category: formData.category,
      relationship: formData.relationship,
      biographySummary: formData.biographySummary || undefined,
      status: formData.status,
      lastUpdated: new Date().toISOString(),
    };

    onSave(updatedProfile);
    showToast('success', 'Profile Updated Successfully!', `${updatedProfile.preferredName} updates have been compiled.`);
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      onCancel();
    }
  };

  return (
    <div id="profile-edit-root" className="space-y-6 animate-fade-in text-left pb-12">
      {/* Header Form */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Edit className="w-5 h-5 text-cinema-amber-500" /> Edit {profile.preferredName}'s Profile Card
          </h2>
          <p className="text-xs text-muted-foreground">
            Update biographical fields and configure classification tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="btn-edit-cancel"
            variant="ghost"
            size="sm"
            leftIcon={<X className="w-4 h-4 text-foreground" />}
            onClick={handleCancelClick}
            className="text-xs border border-border"
          >
            Cancel
          </Button>
          <Button
            id="btn-edit-save"
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-4 h-4 text-slate-950" />}
            onClick={handleSave}
            className="text-xs bg-cinema-amber-500 hover:bg-cinema-amber-600 text-slate-950 font-bold"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {isDirty && (
        <div className="p-3 bg-cinema-amber-500/5 border border-cinema-amber-500/20 rounded-xl text-xs text-cinema-amber-800 dark:text-cinema-amber-300 flex items-center gap-2.5" id="unsaved-changes-banner">
          <AlertTriangle className="w-4 h-4 text-cinema-amber-500 shrink-0" />
          <span>You have unsaved edits in this profile record. Click "Save Changes" to store them.</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="edit-profile-form">
        {/* Left Columns - Detailed settings */}
        <div className="lg:col-span-2 space-y-6 bg-card border border-border rounded-2xl p-6" id="edit-left-pane">
          {/* Section 1: Names */}
          <div className="space-y-4" id="edit-section-names">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border">
              <User className="w-4 h-4 text-cinema-amber-500" /> 1. Primary Identifiers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="edit-first-name"
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
              />
              <Input
                id="edit-middle-name"
                label="Middle Name"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="edit-last-name"
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
              />
              <Input
                id="edit-preferred-name"
                label="Preferred Name"
                value={formData.preferredName}
                onChange={(e) => handleInputChange('preferredName', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="edit-nickname"
                label="Nickname or Alias"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
              />
              <Input
                id="edit-relationship"
                label="Relationship Node Description *"
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                error={errors.relationship}
              />
            </div>
          </div>

          {/* Section 2: Birth Details */}
          <div className="space-y-4 pt-4" id="edit-section-birth">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border">
              <Calendar className="w-4 h-4 text-indigo-500" /> 2. Personal Birth Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker
                id="edit-dob"
                label="Date of Birth *"
                value={formData.dateOfBirth}
                onChange={(val) => handleInputChange('dateOfBirth', val)}
                error={errors.dateOfBirth}
              />
              <Input
                id="edit-pob"
                label="Place of Birth"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="edit-gender-select"
                label="Gender"
                value={formData.gender}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Non-Binary', label: 'Non-Binary' },
                  { value: 'Other', label: 'Other' },
                  { value: 'Prefer not to say', label: 'Prefer not to say' }
                ]}
                onChange={(val) => handleInputChange('gender', val)}
              />
              <Input
                id="edit-nationality"
                label="Nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Life Status & Death (if any) */}
          <div className="space-y-4 pt-4" id="edit-section-life">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border">
              <Heart className="w-4 h-4 text-red-500" /> 3. Current Life Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="edit-life-status-select"
                label="Life Status"
                value={formData.lifeStatus}
                options={[
                  { value: 'living', label: 'Living' },
                  { value: 'memorial', label: 'In Memorial' },
                  { value: 'historical', label: 'Historical Figure' }
                ]}
                onChange={(val) => handleInputChange('lifeStatus', val)}
              />

              <Select
                id="edit-category-select"
                label="Category Classification"
                value={formData.category}
                options={[...CATEGORY_OPTIONS]}
                onChange={(val) => handleInputChange('category', val)}
              />
            </div>

            {formData.lifeStatus !== 'living' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border" id="edit-death-details-fields">
                <DatePicker
                  id="edit-dod"
                  label="Date of Death *"
                  value={formData.dateOfDeath}
                  onChange={(val) => handleInputChange('dateOfDeath', val)}
                  error={errors.dateOfDeath}
                />
                <Input
                  id="edit-pod"
                  label="Place of Death"
                  value={formData.placeOfDeath}
                  onChange={(e) => handleInputChange('placeOfDeath', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bio summary, status, publish controls */}
        <div className="space-y-6" id="edit-right-pane">
          {/* Executive Summary */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4" id="edit-section-summary">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground pb-2 border-b border-border flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-500" /> 4. Biography Summary
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Bio Outline Description</label>
              <textarea
                id="edit-biography-summary"
                rows={6}
                value={formData.biographySummary}
                onChange={(e) => handleInputChange('biographySummary', e.target.value)}
                placeholder="Write a concise executive summary representing their legacy..."
                className="w-full p-3 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Publishing Configuration */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4" id="edit-section-publishing">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground pb-2 border-b border-border flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cinema-amber-500" /> 5. Archiving Status
            </h3>

            <div className="space-y-3">
              <Select
                id="edit-status-select"
                label="Workflow Status"
                value={formData.status}
                options={[
                  { value: 'draft', label: 'Draft (Private Sandbox)' },
                  { value: 'published', label: 'Published (Family Library)' },
                  { value: 'archived', label: 'Archived (System Attic)' }
                ]}
                onChange={(val) => handleInputChange('status', val)}
              />

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Published profiles are available for compiling automatic video narration scripts in the Story Studio.
              </p>
            </div>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={onCancel}
        title="Discard Unsaved Changes"
        message="You have made modifications to this legacy profile that have not been saved. Are you sure you want to discard your changes?"
        confirmLabel="Discard Changes"
        cancelLabel="Continue Editing"
      />
    </div>
  );
}

// Inline edit icon helper import
function Edit({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
  );
}
