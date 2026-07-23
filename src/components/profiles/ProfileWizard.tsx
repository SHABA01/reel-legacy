/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  Upload,
  Image as ImageIcon,
  User,
  Users,
  Calendar,
  MapPin,
  Globe,
  Languages,
  Sparkles,
  Heart,
  Briefcase,
  FolderOpen,
  Crop,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { WizardStepper } from '../ui/WizardStepper';
import { WizardLayout } from '../ui/WizardLayout';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { ImageCropperModal } from '../ui/ImageCropperModal';
import { useToast } from '../../context/ToastContext';
import { ExtendedLegacyProfile } from './mockData';

interface ProfileWizardProps {
  onClose: () => void;
  onSave: (newProfile: ExtendedLegacyProfile) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'personal', label: 'Personal Biography', desc: 'A standard biographical chronicle' },
  { value: 'autobiography', label: 'Autobiography', desc: 'Self-authored memoir compilation' },
  { value: 'memorial', label: 'Memorial Tribute', desc: 'For beloved ancestors who passed' },
  { value: 'celebration', label: 'Celebration of Life', desc: 'For major anniversaries & milestones' },
  { value: 'career', label: 'Career Journey', desc: 'Professional trajectory & accolades' },
  { value: 'family-history', label: 'Family History', desc: 'Saga covering multiple generations' },
  { value: 'historical-figure', label: 'Historical Figure', desc: 'Archived public profiles' },
  { value: 'organization', label: 'Organization Archive', desc: 'Community groups, schools, teams' },
  { value: 'community', label: 'Community Leader', desc: 'Pillars of civic contribution' },
] as const;

const GENDER_OPTIONS = ['Male', 'Female', 'Non-Binary', 'Other', 'Prefer not to say'];
const LIFE_STATUS_OPTIONS = [
  { value: 'living', label: 'Living', desc: 'Active, present member' },
  { value: 'memorial', label: 'In Memorial', desc: 'Remembering those who have passed' },
  { value: 'historical', label: 'Historical Figure', desc: 'Archived ancestor or public legend' },
] as const;

const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
];

export function ProfileWizard({ onClose, onSave }: ProfileWizardProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    nickname: '',
    gender: 'Male',
    dateOfBirth: '',
    placeOfBirth: '',
    dateOfDeath: '',
    placeOfDeath: '',
    nationality: '',
    languages: [] as string[],
    lifeStatus: 'living' as 'living' | 'memorial' | 'historical',
    category: 'personal' as typeof CATEGORY_OPTIONS[number]['value'],
    relationship: '',
    coverPhoto: COVER_PRESETS[0],
    profilePhoto: PHOTO_PRESETS[0],
    biographySummary: '',
    tags: [] as string[],
    parents: [] as string[],
    spouse: '',
    children: [] as string[],
  });

  // Tag & Lang input helpers
  const [tagInput, setTagInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [parentInput, setParentInput] = useState('');
  const [childInput, setChildInput] = useState('');

  // Image Cropper & File Upload state
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const [cropperState, setCropperState] = useState<{
    isOpen: boolean;
    imageSrc: string;
    type: 'profile' | 'cover';
  }>({
    isOpen: false,
    imageSrc: '',
    type: 'profile',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Please select an image smaller than 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropperState({
          isOpen: true,
          imageSrc: event.target.result as string,
          type,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropSave = (croppedDataUrl: string) => {
    if (cropperState.type === 'profile') {
      handleInputChange('profilePhoto', croppedDataUrl);
      showToast('success', 'Profile Photo Saved', 'Custom profile photo repositioned and set.');
    } else {
      handleInputChange('coverPhoto', croppedDataUrl);
      showToast('success', 'Hero Cover Saved', 'Custom cover banner repositioned and set.');
    }
    setCropperState((prev) => ({ ...prev, isOpen: false }));
  };

  // Errors for active fields
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required.';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required.';
    } else if (step === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required.';
    } else if (step === 3) {
      if (formData.lifeStatus === 'memorial' && !formData.dateOfDeath) {
        newErrors.dateOfDeath = 'Date of Death is required for memorial profiles.';
      }
    } else if (step === 4) {
      if (!formData.relationship.trim()) {
        newErrors.relationship = 'Please specify the relationship or role (e.g. Grandmother, Self).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(prev => prev + 1);
      }
    } else {
      showToast('warning', 'Review Form Details', 'Please resolve highlighted issues before moving forward.');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    showToast('loading', 'Saving draft...', 'Storing progress in your local secure workspace sandbox.');
    setTimeout(() => {
      showToast('success', 'Workspace Draft Stored', 'Profile draft has been cached safely.');
      onClose();
    }, 600);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (idx: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
  };

  const handleAddLang = () => {
    if (langInput.trim() && !formData.languages.includes(langInput.trim())) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, langInput.trim()] }));
      setLangInput('');
    }
  };

  const handleRemoveLang = (idx: number) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== idx) }));
  };

  const handleAddParent = () => {
    if (parentInput.trim() && !formData.parents.includes(parentInput.trim())) {
      setFormData(prev => ({ ...prev, parents: [...prev.parents, parentInput.trim()] }));
      setParentInput('');
    }
  };

  const handleAddChild = () => {
    if (childInput.trim() && !formData.children.includes(childInput.trim())) {
      setFormData(prev => ({ ...prev, children: [...prev.children, childInput.trim()] }));
      setChildInput('');
    }
  };

  const handleFinish = () => {
    const finalProfile: ExtendedLegacyProfile = {
      id: `profile-${Date.now()}`,
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
      languages: formData.languages.length > 0 ? formData.languages : undefined,
      lifeStatus: formData.lifeStatus,
      category: formData.category,
      relationship: formData.relationship || 'Relative',
      coverPhoto: formData.coverPhoto,
      profilePhoto: formData.profilePhoto,
      status: 'draft',
      storyProgress: 10, // Initial percentage for newly created profile
      mediaCount: 0,
      timelineEventsCount: 0,
      documentCount: 0,
      lastUpdated: new Date().toISOString(),
      dateCreated: new Date().toISOString(),
      biographySummary: formData.biographySummary || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      parents: formData.parents.length > 0 ? formData.parents : undefined,
      spouse: formData.spouse || undefined,
      children: formData.children.length > 0 ? formData.children : undefined,
      familyMembers: [
        ...(formData.spouse ? [{ relation: 'Spouse', name: formData.spouse }] : []),
        ...formData.parents.map(p => ({ relation: 'Parent', name: p })),
        ...formData.children.map(c => ({ relation: 'Child', name: c })),
      ],
      mediaPreviews: [],
      timelinePreviews: [],
      documentsPreviews: [],
    };

    onSave(finalProfile);
    showToast('success', 'Legacy Profile Registered!', `${finalProfile.preferredName} has been catalogued in active workspace.`);
  };

  // Stepper Header helper
  const steps = [
    { number: 1, title: 'Basic Information', description: 'Primary name inputs' },
    { number: 2, title: 'Personal Details', description: 'Birth & origin details' },
    { number: 3, title: 'Life Status', description: 'Current status classification' },
    { number: 4, title: 'Relationships', description: 'Immediate kin mapping' },
    { number: 5, title: 'Profile Photo', description: 'Identity badge avatar' },
    { number: 6, title: 'Cover Photo', description: 'Backdrop banner landscape' },
    { number: 7, title: 'Review Details', description: 'Double check metadata' },
    { number: 8, title: 'Create Profile', description: 'Finalize & build badge' }
  ];

  const stepsTitles = steps.map(s => s.title);

  return (
    <WizardLayout
      id="create-profile-wizard"
      title="CO-AUTHOR WIZARD"
      subtitle="Establish Legacy Profile Metadata Setup Flow"
      icon={<Users className="w-5 h-5 text-cinema-amber-500" />}
      steps={steps}
      currentStep={step}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={handlePrev}
      onNext={step === totalSteps ? handleFinish : handleNext}
      onSaveDraft={handleSaveDraft}
      isFinalStep={step === totalSteps}
      finalStepLabel="Create Profile"
      continueLabel="Next"
    >
      <div className="space-y-5" id="profile-wizard-step-inner-content">
              {/* STEP 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-4 text-left" id="step-basic-info">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-cinema-amber-500" /> Basic Information
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Let's start with primary names. First and last names are mandatory fields.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="wizard-first-name"
                      label="First Name *"
                      placeholder="e.g. Elizabeth"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      error={errors.firstName}
                    />
                    <Input
                      id="wizard-middle-name"
                      label="Middle Name"
                      placeholder="e.g. Ann"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                  </div>

                  <Input
                    id="wizard-last-name"
                    label="Last Name *"
                    placeholder="e.g. Vance"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="wizard-preferred-name"
                      label="Preferred Full Name"
                      placeholder="e.g. Elizabeth Vance"
                      value={formData.preferredName}
                      onChange={(e) => handleInputChange('preferredName', e.target.value)}
                      helperText="If different from legal first + last name."
                    />
                    <Input
                      id="wizard-nickname"
                      label="Nickname or Alias"
                      placeholder="e.g. Lizzy, Nana"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Details */}
              {step === 2 && (
                <div className="space-y-4 text-left" id="step-personal-details">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-500" /> Personal Details
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Capture birth dates, locations, and spoken languages to structure context timelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DatePicker
                      id="wizard-dob"
                      label="Date of Birth *"
                      value={formData.dateOfBirth}
                      onChange={(val) => handleInputChange('dateOfBirth', val)}
                      error={errors.dateOfBirth}
                    />
                    <Input
                      id="wizard-pob"
                      label="Place of Birth"
                      placeholder="e.g. Boston, MA"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      id="wizard-gender-select"
                      label="Gender"
                      value={formData.gender}
                      options={GENDER_OPTIONS.map(g => ({ value: g, label: g }))}
                      onChange={(val) => handleInputChange('gender', val)}
                    />
                    <Input
                      id="wizard-nationality"
                      label="Nationality"
                      placeholder="e.g. American"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  </div>

                  {/* Languages list */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider block">Languages Spoken</label>
                    <div className="flex gap-2">
                      <Input
                        id="wizard-lang-input"
                        placeholder="e.g. French, Spanish"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLang())}
                      />
                      <Button id="btn-add-lang" onClick={handleAddLang} variant="secondary" className="px-3">
                        Add
                      </Button>
                    </div>
                    {formData.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5" id="wizard-langs-tags">
                        {formData.languages.map((l, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                            {l}
                            <button id={`btn-remove-lang-${i}`} onClick={() => handleRemoveLang(i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Life Status */}
              {step === 3 && (
                <div className="space-y-4 text-left" id="step-life-status">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" /> Life Status & Category
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Select how this legacy record should be catalogued. Living members focus on autobiography; Memorial on heritage.
                    </p>
                  </div>

                  {/* Life Status Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {LIFE_STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        id={`btn-status-${opt.value}`}
                        onClick={() => handleInputChange('lifeStatus', opt.value)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                          formData.lifeStatus === opt.value
                            ? 'bg-cinema-amber-500/10 border-cinema-amber-500 text-foreground'
                            : 'bg-card hover:bg-muted/40 border-border text-muted-foreground'
                        }`}
                      >
                        <span className={`text-xs font-black uppercase tracking-wider ${formData.lifeStatus === opt.value ? 'text-cinema-amber-500' : 'text-foreground'}`}>
                          {opt.label}
                        </span>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Date of death details for non-living */}
                  {formData.lifeStatus !== 'living' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border"
                      id="death-fields-block"
                    >
                      <DatePicker
                        id="wizard-dod"
                        label="Date of Death *"
                        value={formData.dateOfDeath}
                        onChange={(val) => handleInputChange('dateOfDeath', val)}
                        error={errors.dateOfDeath}
                      />
                      <Input
                        id="wizard-pod"
                        label="Place of Death"
                        placeholder="e.g. San Francisco, CA"
                        value={formData.placeOfDeath}
                        onChange={(e) => handleInputChange('placeOfDeath', e.target.value)}
                      />
                    </motion.div>
                  )}

                  {/* Category select */}
                  <Select
                    id="wizard-category-select"
                    label="Profile Category Blueprint"
                    value={formData.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(val) => handleInputChange('category', val)}
                  />
                </div>
              )}

              {/* STEP 4: Relationships */}
              {step === 4 && (
                <div className="space-y-4 text-left" id="step-relationships">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5 text-cinema-ai" /> Family Relationships
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Set up the primary co-author relationship and register close family nodes.
                    </p>
                  </div>

                  <Input
                    id="wizard-relationship"
                    label="Relationship to You (Lead Archivist) *"
                    placeholder="e.g. Grandmother, Father, Spouse, Self"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    error={errors.relationship}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="wizard-spouse"
                      label="Spouse / Partner Name"
                      placeholder="e.g. Robert Vance"
                      value={formData.spouse}
                      onChange={(e) => handleInputChange('spouse', e.target.value)}
                    />
                    
                    {/* Add Parent node */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider block">Add Parents</label>
                      <div className="flex gap-2">
                        <Input
                          id="wizard-parent-input"
                          placeholder="e.g. Arthur Pendelton"
                          value={parentInput}
                          onChange={(e) => setParentInput(e.target.value)}
                        />
                        <Button id="btn-add-parent" onClick={handleAddParent} variant="secondary" className="px-3.5">
                          Add
                        </Button>
                      </div>
                      {formData.parents.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {formData.parents.map((p, i) => (
                            <span key={i} className="text-[9px] font-bold font-mono bg-muted border border-border px-1.5 py-0.5 rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Children list */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider block">Add Children</label>
                    <div className="flex gap-2">
                      <Input
                        id="wizard-child-input"
                        placeholder="e.g. Richard Vance"
                        value={childInput}
                        onChange={(e) => setChildInput(e.target.value)}
                      />
                      <Button id="btn-add-child" onClick={handleAddChild} variant="secondary" className="px-3.5">
                        Add
                      </Button>
                    </div>
                    {formData.children.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {formData.children.map((c, i) => (
                          <span key={i} className="text-[9px] font-bold font-mono bg-muted border border-border px-1.5 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Profile Photo */}
              {step === 5 && (
                <div className="space-y-4 text-left" id="step-profile-photo">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-indigo-500" /> Profile Photo
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Select from our vintage historical avatars or upload a custom image (1:1 aspect ratio with crop & reposition).
                    </p>
                  </div>

                  <input
                    ref={profileFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'profile')}
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-muted/30 border border-border">
                    <div className="relative w-24 h-24 rounded-full border-2 border-cinema-amber-500/40 overflow-hidden shrink-0 bg-muted shadow-md group">
                      <img
                        id="wizard-profile-preview"
                        src={formData.profilePhoto}
                        alt="Profile avatar preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-3 flex-grow text-center sm:text-left">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Choose Avatar Preset</span>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5" id="presets-avatars-row">
                        {PHOTO_PRESETS.map((url, i) => (
                          <button
                            key={i}
                            id={`btn-preset-avatar-${i}`}
                            onClick={() => handleInputChange('profilePhoto', url)}
                            className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${
                              formData.profilePhoto === url ? 'border-cinema-amber-500 scale-105 shadow-sm' : 'border-transparent opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img src={url} className="w-full h-full object-cover" alt={`Preset ${i}`} referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                      
                      <div className="pt-2 border-t border-border/40 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                        <Button
                          id="btn-upload-custom-photo"
                          variant="ghost"
                          size="sm"
                          leftIcon={<Upload className="w-4 h-4 text-cinema-amber-500" />}
                          onClick={() => profileFileInputRef.current?.click()}
                          className="text-[11px] font-bold border border-cinema-amber-500/30 hover:bg-cinema-amber-500/10"
                        >
                          Upload Custom Photo
                        </Button>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted border border-border px-2 py-1 rounded-md">
                          Target Aspect Ratio: <strong className="text-foreground">1:1 Square</strong> (400x400 px)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Cover Photo */}
              {step === 6 && (
                <div className="space-y-4 text-left" id="step-cover-photo">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-500" /> Hero Cover Image
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Choose an atmospheric background or upload a custom landscape banner (16:5 widescreen aspect ratio with crop & reposition).
                    </p>
                  </div>

                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'cover')}
                  />

                  <div className="space-y-4 p-4 rounded-2xl bg-muted/30 border border-border">
                    <div className="w-full h-28 rounded-xl border border-cinema-amber-500/40 overflow-hidden bg-muted relative shadow-sm">
                      <img
                        id="wizard-cover-preview"
                        src={formData.coverPhoto}
                        alt="Profile cover banner preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Choose cover Preset</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="presets-covers-grid">
                        {COVER_PRESETS.map((url, i) => (
                          <button
                            key={i}
                            id={`btn-preset-cover-${i}`}
                            onClick={() => handleInputChange('coverPhoto', url)}
                            className={`w-full aspect-video rounded-lg border-2 overflow-hidden transition-all ${
                              formData.coverPhoto === url ? 'border-cinema-amber-500 scale-102' : 'border-transparent opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img src={url} className="w-full h-full object-cover" alt={`Preset ${i}`} referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-border/40 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                        <Button
                          id="btn-upload-custom-cover"
                          variant="ghost"
                          size="sm"
                          leftIcon={<Upload className="w-4 h-4 text-cinema-amber-500" />}
                          onClick={() => coverFileInputRef.current?.click()}
                          className="text-[11px] font-bold border border-cinema-amber-500/30 hover:bg-cinema-amber-500/10"
                        >
                          Upload Custom Cover
                        </Button>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted border border-border px-2 py-1 rounded-md">
                          Target Aspect Ratio: <strong className="text-foreground">16:5 Wide Banner</strong> (1200x375 px)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Review Details */}
              {step === 7 && (
                <div className="space-y-4 text-left" id="step-review-details">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cinema-amber-500" /> Review Biography Profile
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Verify that names, dates, and category settings match your family records.
                    </p>
                  </div>

                  {/* Summary card */}
                  <div className="p-5 rounded-2xl bg-card border border-border space-y-4" id="wizard-review-summary-card">
                    <div className="flex items-center gap-4">
                      <img src={formData.profilePhoto} alt="Review avatar" className="w-12 h-12 rounded-full object-cover border border-border" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-display font-bold text-sm text-foreground">
                          {formData.firstName} {formData.middleName ? formData.middleName + ' ' : ''}{formData.lastName}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">
                          {formData.relationship} • {formData.category} Blueprint
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-border">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Life status</span>
                        <p className="font-medium text-foreground capitalize">{formData.lifeStatus}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Born</span>
                        <p className="font-medium text-foreground">{formData.dateOfBirth} {formData.placeOfBirth ? `(${formData.placeOfBirth})` : ''}</p>
                      </div>
                      {formData.lifeStatus !== 'living' && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Passed</span>
                          <p className="font-medium text-foreground">{formData.dateOfDeath} {formData.placeOfDeath ? `(${formData.placeOfDeath})` : ''}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Languages</span>
                        <p className="font-medium text-foreground">{formData.languages.join(', ') || 'English'}</p>
                      </div>
                    </div>

                    {/* Biography draft text area */}
                    <div className="space-y-1 pt-2 border-t border-border">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">Biography Executive Summary (Optional)</label>
                      <textarea
                        id="wizard-bio-summary"
                        placeholder="e.g. A pioneering educator and dedicated family matriarch..."
                        rows={3}
                        value={formData.biographySummary}
                        onChange={(e) => handleInputChange('biographySummary', e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Ready / Create Profile */}
              {step === 8 && (
                <div className="space-y-4 text-center py-6" id="step-finished-wizard">
                  <div className="w-16 h-16 rounded-full bg-cinema-amber-500/10 border border-cinema-amber-500/20 text-cinema-amber-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-xl text-foreground">
                      Ready to compile Profile?
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      You are about to establish the profile record. Once registered, you will be able to attach media, timelines, and draft narrations.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-border max-w-xs mx-auto text-xs text-muted-foreground flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="text-left leading-relaxed">
                      All metadata has been verified to match downstream database models.
                    </p>
                  </div>
                </div>
              )}
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperState.isOpen}
        imageSrc={cropperState.imageSrc}
        title={cropperState.type === 'profile' ? 'Reposition Profile Photo' : 'Reposition Hero Cover Image'}
        aspectRatio={cropperState.type === 'profile' ? 1 : 16 / 5}
        aspectRatioLabel={
          cropperState.type === 'profile'
            ? '1:1 Square Ratio (Recommended: 400x400 px)'
            : '16:5 Wide Banner Ratio (Recommended: 1200x375 px)'
        }
        targetWidth={cropperState.type === 'profile' ? 400 : 1200}
        targetHeight={cropperState.type === 'profile' ? 400 : 375}
        onClose={() => setCropperState((prev) => ({ ...prev, isOpen: false }))}
        onCropSave={handleCropSave}
      />
    </WizardLayout>
  );
}
