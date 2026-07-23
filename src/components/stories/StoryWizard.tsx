/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  BookOpen,
  Users,
  Film,
  Sparkles,
  Layers,
  FileText,
  Calendar,
  Heart,
  AlertCircle,
  Search,
  Globe,
  Lock,
  Eye,
  Building,
  Award,
  GraduationCap,
  Gift,
  Palette,
  Wand2,
  Smile,
  Video,
  Camera,
  Mic,
  Sliders,
  CheckSquare,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { WizardStepper } from '../ui/WizardStepper';
import { WizardLayout } from '../ui/WizardLayout';
import { useToast } from '../../context/ToastContext';
import { ExtendedStory, STORY_TYPES } from './mockStoriesData';
import { ExtendedLegacyProfile } from '../profiles/mockData';
import { persistenceService } from '../../storage';

interface StoryWizardProps {
  onClose: () => void;
  onSave: (newStory: ExtendedStory) => void;
  initialCategory?: string;
}

const STORY_TYPE_DETAILS = [
  {
    type: 'Biography',
    icon: BookOpen,
    description: 'Deep biographical film covering a full life retrospective.',
    useCases: 'Family archives, major milestones, ancestral histories'
  },
  {
    type: 'Autobiography',
    icon: Smile,
    description: 'Self-told cinematic memoir focusing on personal journey and lessons.',
    useCases: 'Personal legacy planning, direct-to-descendants wisdom, memoirs'
  },
  {
    type: 'Memorial',
    icon: Heart,
    description: 'Comforting remembrance tribute honoring a departed loved one.',
    useCases: 'Funerals, memorial services, family remembrance anniversaries'
  },
  {
    type: 'Celebration of Life',
    icon: Sparkles,
    description: 'Uplifting celebration of active milestones and happy memories.',
    useCases: 'Major milestone birthdays, retirement, community honors'
  },
  {
    type: 'Career Documentary',
    icon: Award,
    description: 'Professional retrospective showcasing work achievements and service.',
    useCases: 'Professional profiles, veteran tributes, business achievements'
  },
  {
    type: 'Family Documentary',
    icon: Users,
    description: 'Multi-generational heritage film mapping roots and ancestral lines.',
    useCases: 'Family reunions, ancestry trace projects, heritage celebrations'
  },
  {
    type: 'Historical Documentary',
    icon: Globe,
    description: 'Educational archive capturing significant historical figure milestones.',
    useCases: 'Genealogy research, community founders, local historical events'
  },
  {
    type: 'Tribute',
    icon: Award,
    description: 'Special honorary dedication for specific contributions and values.',
    useCases: 'Community service awards, organization dedications, friendship tributes'
  },
  {
    type: 'Anniversary',
    icon: Calendar,
    description: 'Commemorative cinematic journey tracking long partnerships and marriages.',
    useCases: 'Silver & Golden wedding anniversaries, business centennials'
  },
  {
    type: 'Graduation',
    icon: GraduationCap,
    description: 'Energetic celebration of student academic achievements and future path.',
    useCases: 'School completions, high school or college memory reels'
  },
  {
    type: 'Retirement',
    icon: Layers,
    description: 'Heartfelt farewell highlights and career-closing reflections.',
    useCases: 'Company retirement events, long-service celebrations'
  },
  {
    type: 'Wedding',
    icon: Heart,
    description: 'Romantic preservation of couples’ courtships, vows, and wedding day.',
    useCases: 'Post-wedding highlights, keepsake files, wedding screenings'
  },
  {
    type: 'Birthday',
    icon: Gift,
    description: 'Warm annual retrospective of personal growth and birthday memories.',
    useCases: 'Milestone birthdays (e.g. 50th, 80th, 90th), annual summaries'
  },
  {
    type: 'Organizational History',
    icon: Building,
    description: 'Commemorative film charting the origin, impact, and scaling of an organization.',
    useCases: 'Corporate foundation anniversaries, school/church histories'
  }
];

const AUDIENCE_OPTIONS = [
  { id: 'aud-family', name: 'Family Circle', desc: 'Parents, children, and close relatives. Highly secure.', level: 'High Privacy' },
  { id: 'aud-friends', name: 'Friends & Companions', desc: 'Outer social circle and childhood companions.', level: 'Medium Privacy' },
  { id: 'aud-work', name: 'Workplace & Colleagues', desc: 'Professional connections, team members, and peers.', level: 'Medium Privacy' },
  { id: 'aud-community', name: 'Community & Congregation', desc: 'Local groups, church networks, or schools.', level: 'Restricted Sharing' },
  { id: 'aud-public', name: 'Public Audience', desc: 'Unrestricted access for global public viewers.', level: 'Low Privacy' },
  { id: 'aud-private', name: 'Strictly Private', desc: 'Me, myself, and assigned heritage editors only.', level: 'Max Security' }
];

const TONE_OPTIONS = [
  { name: 'Inspirational', desc: 'Motivational and uplifting, focusing on triumph.' },
  { name: 'Emotional', desc: 'Sentimental and moving, focusing on deep bonds.' },
  { name: 'Celebratory', desc: 'Joyful and festive, high-energy milestone pacing.' },
  { name: 'Historical', desc: 'Accurate and analytical, documentary archival rhythm.' },
  { name: 'Documentary', desc: 'Balanced and journalistic, exploring deep perspectives.' },
  { name: 'Professional', desc: 'Distinguished and steady, highlighting career milestones.' },
  { name: 'Reflective', desc: 'Poetic, gentle, and slow-paced contemplative state.' },
  { name: 'Cinematic', desc: 'Dramatic orchestration, deep emotional highs and lows.' }
];

const STYLE_OPTIONS = [
  { name: 'Modern', desc: 'Minimalist widgets, clean margins, sans-serif display.' },
  { name: 'Minimal', desc: 'Zero visual noise, focus on spacious typography.' },
  { name: 'Classic', desc: 'Traditional film textures, borders, and smooth fade effects.' },
  { name: 'Elegant', desc: 'Golden accents, serif pairing, delicate pacing.' },
  { name: 'Dramatic', desc: 'Chiaroscuro shadow focus, high-impact captions.' },
  { name: 'Family Album', desc: 'Warm polaroid style overlays, cozy handwritten notes.' },
  { name: 'Corporate', desc: 'Sleek geometric lower-thirds and statistical callouts.' },
  { name: 'Memorial', desc: 'Soft ambient glow, vintage crossfades, candle tones.' }
];

const INTENDED_ASSETS_OPTIONS = [
  { id: 'asset-photos', label: 'Photos & Portraits', icon: Camera, desc: 'Family prints, digital albums, and portrait series' },
  { id: 'asset-videos', label: 'Videos & Home Movies', icon: Video, desc: 'Vintage Super8 transfers, mobile clips, or interviews' },
  { id: 'asset-audio', label: 'Audio Records', icon: Mic, desc: 'Voice messages, voicemail clips, and oral records' },
  { id: 'asset-documents', label: 'Letters & Diaries', icon: FileText, desc: 'Scanned journals, love letters, and transcripts' },
  { id: 'asset-certificates', label: 'Official Certificates', icon: Award, desc: 'Birth certificates, military orders, or land deeds' },
  { id: 'asset-awards', label: 'Awards & Accolades', icon: Sparkles, desc: 'Plaques, honors, and formal commendations' },
  { id: 'asset-resume', label: 'Resume & Career Files', icon: Layers, desc: 'Academic papers, curriculum vitae, patent list' },
  { id: 'asset-interviews', label: 'Structured Q&As', icon: Users, desc: 'Written questionnaire transcripts or audio Q&As' }
];

const AI_PREP_OPTIONS = [
  { id: 'ai-script', label: 'Draft Biography Script', desc: 'Synthesize details into a narrated transcript outline.' },
  { id: 'ai-timeline', label: 'Build Dynamic Timeline', desc: 'Chronologically map historical milestones.' },
  { id: 'ai-narration', label: 'Structure Narration Cues', desc: 'Match vocal guidelines with background acoustic cues.' },
  { id: 'ai-chapters', label: 'Scaffold Narrative Chapters', desc: 'Automatically partition life stages into 3-5 chapters.' },
  { id: 'ai-interview', label: 'Formulate Relative Questions', desc: 'Generate customized interview sheets for family.' },
  { id: 'ai-trailer', label: 'Draft Promo Spotlight Trailer', desc: 'Create a 1-minute highlight script of main milestones.' }
];

export function StoryWizard({ onClose, onSave, initialCategory }: StoryWizardProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Load active legacy profiles to let user select one
  const [profiles, setProfiles] = useState<ExtendedLegacyProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetched = await persistenceService.profiles.getAll();
        setProfiles(fetched as any);
      } catch (err) {
        console.error('Failed to load profiles inside wizard:', err);
      }
    };
    fetchProfiles();
  }, []);

  // Filter state for profile selection (Step 1)
  const [profileSearch, setProfileSearch] = useState('');

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const prefName = (p.preferredName || '').toLowerCase();
      const relationship = (p.relationship || '').toLowerCase();
      const nickname = (p.nickname || '').toLowerCase();
      const query = profileSearch.toLowerCase();
      return fullName.includes(query) || prefName.includes(query) || relationship.includes(query) || nickname.includes(query);
    });
  }, [profiles, profileSearch]);

  // Wizard form data state (fully compliant with the 8 steps)
  const [formData, setFormData] = useState({
    associatedProfileId: '',
    title: '',
    subtitle: '',
    description: '',
    language: 'English',
    visibility: 'Private',
    internalNotes: '',
    category: initialCategory || 'Biography',
    audiences: [] as string[],
    tone: 'Inspirational',
    style: 'Modern',
    assets: [] as string[],
    aiPreferences: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time live validations
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.associatedProfileId) {
        newErrors.profile = 'Please select an associated Legacy Profile to proceed.';
      }
    }

    if (currentStep === 2) {
      if (!formData.title.trim()) {
        newErrors.title = 'Story Title is required.';
      } else if (formData.title.length > 80) {
        newErrors.title = 'Story Title cannot exceed 80 characters.';
      }

      if (!formData.subtitle.trim()) {
        newErrors.subtitle = 'Story Subtitle is required.';
      } else if (formData.subtitle.length > 120) {
        newErrors.subtitle = 'Story Subtitle cannot exceed 120 characters.';
      }
    }

    if (currentStep === 3) {
      if (!formData.category) {
        newErrors.category = 'Please select a Story Type.';
      }
    }

    if (currentStep === 4) {
      if (formData.audiences.length === 0) {
        newErrors.audiences = 'Please select at least one intended audience group.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleFinalSave(false);
      }
    } else {
      showToast('warning', 'Validation Error', 'Please satisfy the required fields before proceeding.');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      showToast('error', 'Story Title Required', 'Please enter at least a Story Title on Step 2 to save a draft.');
      // Direct user back to step 2 if they try to save draft without title
      if (step !== 2) {
        setStep(2);
      }
      return;
    }
    handleFinalSave(true);
  };

  const handleFinalSave = (isDraft = false) => {
    const selectedProfile = profiles.find(p => p.id === formData.associatedProfileId);

    // Map the selected category to conform with ExtendedStory category types if it falls into a custom category
    let finalCategory = formData.category as ExtendedStory['category'];
    if (formData.category === 'Organizational History') {
      finalCategory = 'Historical Documentary';
    }

    // Process tags
    const tagList = [
      finalCategory,
      selectedProfile ? selectedProfile.relationship : 'Family',
      formData.tone,
      formData.style
    ].filter(Boolean);

    // Generate beautiful Unsplash cover image based on category
    let coverImg = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
    if (finalCategory === 'Memorial') {
      coverImg = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80';
    } else if (finalCategory === 'Career Documentary') {
      coverImg = 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80';
    } else if (finalCategory === 'Historical Documentary') {
      coverImg = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80';
    } else if (finalCategory === 'Wedding') {
      coverImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
    } else if (finalCategory === 'Celebration of Life') {
      coverImg = 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80';
    }

    const newStory: ExtendedStory = {
      id: `story-${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description || 'No description provided.',
      category: finalCategory,
      status: isDraft ? 'Draft' : 'In Progress',
      completionProgress: isDraft ? 15 : 30,
      durationEstimate: '8-12 mins',
      lastEdited: new Date().toISOString(),
      lastGenerated: null,
      aiReady: !isDraft && formData.aiPreferences.length > 0,
      mediaCount: selectedProfile?.mediaCount || 0,
      chapterCount: 3,
      timelineEventCount: selectedProfile?.timelineEventsCount || 0,
      associatedProfileId: selectedProfile?.id || 'profile-unknown',
      associatedProfileName: selectedProfile ? `${selectedProfile.firstName} ${selectedProfile.lastName}` : 'Unlinked Member',
      associatedProfilePhoto: selectedProfile?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      associatedProfileRelationship: selectedProfile?.relationship || 'Family Connection',
      pinned: false,
      favorite: false,
      tags: tagList,
      contributors: ['Philip Vance'],
      coverImage: coverImg,
      chapters: [
        { id: 'ch-w1', title: 'Chapter 1: Foundations & Family Tree', duration: '2:15', summary: 'Introduction to roots, ancestors, and early birth milestones.', mediaCount: 2 },
        { id: 'ch-w2', title: 'Chapter 2: Key Milestones & Growth', duration: '4:30', summary: 'Active journey, key professional and personal milestones.', mediaCount: 4 },
        { id: 'ch-w3', title: 'Chapter 3: Reflective Wisdom & Tribute', duration: '3:00', summary: 'Closing remarks, permanent family lessons, and archival thoughts.', mediaCount: 2 }
      ],
      timelineEvents: selectedProfile?.timelinePreviews || [],
      mediaPreviews: [],
      recentActivity: [
        { id: `act-${Date.now()}`, user: 'Philip Vance', action: isDraft ? 'Saved draft story workspace configuration' : 'Created story project with Creator Wizard', date: new Date().toISOString() }
      ],
      aiInsights: [
        `Story initiated via Creator Wizard using "${formData.tone}" tone presets.`,
        `Intended Assets mapped: ${formData.assets.length > 0 ? formData.assets.map(a => a.replace('asset-', '')).join(', ') : 'None selected yet'}.`,
        `Configured with language "${formData.language}" and visibility set to "${formData.visibility}".`
      ]
    };

    onSave(newStory);
    showToast(
      isDraft ? 'info' : 'success',
      isDraft ? 'Draft Story Saved' : 'Story Created Successfully',
      `"${formData.title}" has been added to your local Story Library.`
    );
  };

  const toggleAudience = (audId: string) => {
    setFormData(prev => {
      const exists = prev.audiences.includes(audId);
      const updated = exists
        ? prev.audiences.filter(id => id !== audId)
        : [...prev.audiences, audId];
      return { ...prev, audiences: updated };
    });
  };

  const toggleAsset = (assetId: string) => {
    setFormData(prev => {
      const exists = prev.assets.includes(assetId);
      const updated = exists
        ? prev.assets.filter(id => id !== assetId)
        : [...prev.assets, assetId];
      return { ...prev, assets: updated };
    });
  };

  const toggleAIPreference = (prefId: string) => {
    setFormData(prev => {
      const exists = prev.aiPreferences.includes(prefId);
      const updated = exists
        ? prev.aiPreferences.filter(id => id !== prefId)
        : [...prev.aiPreferences, prefId];
      return { ...prev, aiPreferences: updated };
    });
  };

  const wizardSteps = [
    { number: 1, title: 'Select Legacy Profile', description: 'Link to profile' },
    { number: 2, title: 'Story Information', description: 'Enter title & details' },
    { number: 3, title: 'Story Type Selection', description: 'Choose narrative style' },
    { number: 4, title: 'Identify Intended Audience', description: 'Configure privacy level' },
    { number: 5, title: 'Story Tone & Visual Style', description: 'Set aesthetic feel' },
    { number: 6, title: 'Select Initial Assets', description: 'Select files' },
    { number: 7, title: 'AI Preparation Config', description: 'Configure AI options' },
    { number: 8, title: 'Review & Confirm Production', description: 'Submit project' }
  ];

  return (
    <WizardLayout
      id="story-creation-wizard"
      title="Story Creation Production Wizard"
      subtitle="Stage 6 — Guided Eight-Step Smart Setup Flow"
      icon={<Wand2 className="w-5 h-5 text-cinema-amber-500" />}
      steps={wizardSteps}
      currentStep={step}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={handleBack}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      isFinalStep={step === totalSteps}
      finalStepLabel="Finalize & Create Story"
      continueLabel="Continue Workflow"
    >
      <div className="space-y-6" id="wizard-step-inner-content">
            
            {/* STEP 1: Select Legacy Profile */}
            {step === 1 && (
              <motion.div
                key="step-1-profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step1-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 1: Select Legacy Profile
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Link this story with a commemorative profile. The selected profile’s timeline milestones, dates, and media records will scaffold the initial structure.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 py-2 w-full max-w-md">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search profiles by name, relationship..."
                    value={profileSearch}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    className="bg-transparent border-none text-xs text-foreground focus:outline-none w-full font-medium"
                    id="profile-search-input"
                  />
                  {profileSearch && (
                    <button onClick={() => setProfileSearch('')} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {errors.profile && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errors.profile}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="profiles-picker-grid">
                  {filteredProfiles.map((p) => {
                    const isSelected = formData.associatedProfileId === p.id;
                    return (
                      <div
                        key={p.id}
                        id={`wizard-profile-card-${p.id}`}
                        onClick={() => {
                          setFormData({ ...formData, associatedProfileId: p.id });
                          setErrors(prev => ({ ...prev, profile: '' }));
                        }}
                        className={`group relative overflow-hidden rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.04] ring-1 ring-cinema-amber-500'
                            : 'border-border bg-muted/30 hover:bg-muted/70 hover:border-muted-foreground/30'
                        }`}
                      >
                        {/* Cover Image Header */}
                        <div className="h-16 w-full relative overflow-hidden bg-slate-900 border-b border-border/40">
                          <img
                            src={p.coverPhoto}
                            alt=""
                            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                              p.lifeStatus === 'living'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-cinema-amber-500/10 text-cinema-amber-400 border-cinema-amber-500/20'
                            }`}>
                              {p.lifeStatus}
                            </span>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 relative flex gap-3 -mt-6">
                          <img
                            src={p.profilePhoto}
                            alt={p.preferredName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-card shadow-md shrink-0 bg-muted"
                            referrerPolicy="no-referrer"
                          />
                          <div className="pt-5 flex-grow">
                            <h5 className="text-xs font-black text-foreground flex items-center gap-1.5">
                              {p.preferredName || `${p.firstName} ${p.lastName}`}
                              <span className="text-[9px] text-muted-foreground font-mono">({p.relationship})</span>
                            </h5>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 leading-normal font-medium">
                              {p.biographySummary || 'No summary text registered for this heritage record.'}
                            </p>
                          </div>
                        </div>

                        {/* Footer details */}
                        <div className="px-4 py-2 bg-muted/20 border-t border-border/30 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span>{p.timelineEventsCount} Milestones</span>
                            <span>•</span>
                            <span>{p.mediaCount} Media Scans</span>
                          </div>
                          
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950' : 'border-border bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredProfiles.length === 0 && (
                    <div className="col-span-1 md:col-span-2 py-10 border border-dashed border-border rounded-xl text-center space-y-3" id="profile-empty-state">
                      <p className="text-xs text-muted-foreground font-semibold">
                        No Legacy Profiles found matching "{profileSearch}".
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 max-w-xs mx-auto leading-relaxed">
                        Please proceed to the <strong>Profiles Library</strong> to register a new legacy profile card. Creating profile entries directly within this creation wizard is disabled.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Story Information */}
            {step === 2 && (
              <motion.div
                key="step-2-info"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step2-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 2: Story Information
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Define the core administrative headings and security parameters for this production draft.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    {/* Story Title */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label htmlFor="w-title-input" className="text-xs font-bold text-foreground">
                          Story Title <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[9px] font-mono ${formData.title.length > 80 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {formData.title.length}/80 Chars
                        </span>
                      </div>
                      <input
                        id="w-title-input"
                        type="text"
                        placeholder="e.g. The Quiet Educator: Life Story of Elizabeth Vance"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value.slice(0, 100) });
                          setErrors(prev => ({ ...prev, title: '' }));
                        }}
                        className={`w-full h-10 px-3.5 rounded-xl bg-muted border ${
                          errors.title ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-cinema-amber-500'
                        } text-foreground text-xs font-semibold focus:outline-none focus:bg-muted/70 transition-all placeholder:text-muted-foreground/50`}
                      />
                      {errors.title && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Subtitle / Hook */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label htmlFor="w-subtitle-input" className="text-xs font-bold text-foreground">
                          Subtitle / Narrative Hook <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[9px] font-mono ${formData.subtitle.length > 120 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {formData.subtitle.length}/120 Chars
                        </span>
                      </div>
                      <input
                        id="w-subtitle-input"
                        type="text"
                        placeholder="e.g. Celebrating forty years of literature lessons, coastal watercolors, and family devotion"
                        value={formData.subtitle}
                        onChange={(e) => {
                          setFormData({ ...formData, subtitle: e.target.value.slice(0, 150) });
                          setErrors(prev => ({ ...prev, subtitle: '' }));
                        }}
                        className={`w-full h-10 px-3.5 rounded-xl bg-muted border ${
                          errors.subtitle ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-cinema-amber-500'
                        } text-foreground text-xs font-semibold focus:outline-none focus:bg-muted/70 transition-all placeholder:text-muted-foreground/50`}
                      />
                      {errors.subtitle && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" /> {errors.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Story Language */}
                    <Select
                      id="w-language-select"
                      label="Narrative Production Language"
                      value={formData.language}
                      onChange={(val) => setFormData({ ...formData, language: val })}
                      options={[
                        { value: 'English', label: 'English (US / UK Standard)' },
                        { value: 'Spanish', label: 'Spanish (Español)' },
                        { value: 'French', label: 'French (Français)' },
                        { value: 'German', label: 'German (Deutsch)' },
                        { value: 'Italian', label: 'Italian (Italiano)' },
                        { value: 'Chinese', label: 'Chinese (中文)' },
                        { value: 'Japanese', label: 'Japanese (日本語)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Story Description */}
                    <div className="space-y-1.5">
                      <label htmlFor="w-desc-textarea" className="text-xs font-bold text-foreground block">
                        Story Summary / Description
                      </label>
                      <textarea
                        id="w-desc-textarea"
                        rows={3}
                        placeholder="Provide a high-level summary of what this commemorative biographical documentary covers. What is the central message?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/50 resize-none"
                      />
                    </div>

                    {/* Story Visibility */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        Story Visibility Group
                      </label>
                      <div className="grid grid-cols-3 gap-2" id="visibility-picker">
                        {[
                          { id: 'Private', label: 'Only Me', icon: Lock, desc: 'Maximum security' },
                          { id: 'Family', label: 'Family Only', icon: Eye, desc: 'Shared circle' },
                          { id: 'Public', label: 'Public Link', icon: Globe, desc: 'Global viewing' }
                        ].map(item => {
                          const isSelected = formData.visibility === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, visibility: item.id })}
                              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? 'border-cinema-amber-500 bg-cinema-amber-500/5 text-cinema-amber-500'
                                  : 'border-border bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <item.icon className="w-4 h-4" />
                              <span className="text-[10px] font-black">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="space-y-1.5">
                      <label htmlFor="w-notes-textarea" className="text-xs font-bold text-foreground block">
                        Internal Editorial Notes
                      </label>
                      <input
                        id="w-notes-textarea"
                        type="text"
                        placeholder="e.g. Gather additional letters from Uncle Philip before publishing."
                        value={formData.internalNotes}
                        onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-cinema-amber-500 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/45"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Select Story Type */}
            {step === 3 && (
              <motion.div
                key="step-3-type"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step3-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 3: Select Story Type
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Define the core genre structure. Categorization directly shifts future script formatting, recommended duration ranges, and AI chapter layouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-2" id="story-types-wizard-list">
                  {STORY_TYPE_DETAILS.map((item) => {
                    const isSelected = formData.category === item.type;
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.type}
                        id={`story-type-card-${item.type}`}
                        onClick={() => setFormData({ ...formData, category: item.type })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 relative group overflow-hidden ${
                          isSelected
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.04] ring-1 ring-cinema-amber-500'
                            : 'border-border bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className={`p-1.5 rounded-lg border ${
                              isSelected ? 'bg-cinema-amber-500/10 border-cinema-amber-500/20 text-cinema-amber-500' : 'bg-muted border-border text-muted-foreground group-hover:text-foreground'
                            }`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950' : 'border-border bg-transparent'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          <h5 className="text-xs font-black text-foreground mt-2.5">
                            {item.type}
                          </h5>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1 leading-normal font-medium">
                            {item.description}
                          </p>
                        </div>

                        <div className="text-[9px] text-muted-foreground/80 font-mono mt-1 border-t border-border/20 pt-1 border-dashed">
                          Use: <strong className="text-foreground/90 font-sans font-medium">{item.useCases}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Audience */}
            {step === 4 && (
              <motion.div
                key="step-4-audience"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step4-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 4: Identify Intended Audience
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Define who will watch or read this commemorative publication. Access group settings are compiled early to prepare proper security rule wrappers.
                  </p>
                </div>

                {errors.audiences && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errors.audiences}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="audiences-selection-list">
                  {AUDIENCE_OPTIONS.map((item) => {
                    const isSelected = formData.audiences.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        id={`audience-card-${item.id}`}
                        onClick={() => {
                          toggleAudience(item.id);
                          setErrors(prev => ({ ...prev, audiences: '' }));
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.03] ring-1 ring-cinema-amber-500'
                            : 'border-border bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-foreground flex items-center gap-2">
                            {item.name}
                            <span className="text-[8px] font-mono font-bold bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground uppercase">
                              {item.level}
                            </span>
                          </h5>
                          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950' : 'border-border bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Story Tone & Visual Style */}
            {step === 5 && (
              <motion.div
                key="step-5-style"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step5-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 5: Story Tone & Visual Style
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Define the artistic parameters. The selected vocal tone guides narration pacing, while the visual style coordinates caption typography and transit overlays.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Voice Tone */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-border/60 pb-1.5">
                      <Palette className="w-4 h-4 text-cinema-amber-500" />
                      <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Cinematic Voice & Tone
                      </h5>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-[42vh] overflow-y-auto pr-1" id="voice-tone-list">
                      {TONE_OPTIONS.map((t) => {
                        const isSelected = formData.tone === t.name;
                        return (
                          <div
                            key={t.name}
                            onClick={() => setFormData({ ...formData, tone: t.name })}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.04] ring-1 ring-cinema-amber-500'
                                : 'border-border bg-muted/15 hover:bg-muted/30'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-foreground">{t.name}</span>
                              <p className="text-[10px] text-muted-foreground font-medium">{t.desc}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950 font-bold' : 'border-border bg-transparent'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Visual Theme */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-border/60 pb-1.5">
                      <Sliders className="w-4 h-4 text-cinema-amber-500" />
                      <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Visual & Graphic Theme style
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-[42vh] overflow-y-auto pr-1" id="visual-style-list">
                      {STYLE_OPTIONS.map((s) => {
                        const isSelected = formData.style === s.name;
                        return (
                          <div
                            key={s.name}
                            onClick={() => setFormData({ ...formData, style: s.name })}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.04] ring-1 ring-cinema-amber-500'
                                : 'border-border bg-muted/15 hover:bg-muted/30'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-foreground">{s.name}</span>
                              <p className="text-[10px] text-muted-foreground font-medium">{s.desc}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950 font-bold' : 'border-border bg-transparent'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Initial Assets */}
            {step === 6 && (
              <motion.div
                key="step-6-assets"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step6-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 6: Select Initial Assets Intentions
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Indicate which heritage files you intend to link later. <em>No uploads occur in this step</em>; this maps the asset catalog requirements to outline placeholders.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1" id="assets-wizard-grid">
                  {INTENDED_ASSETS_OPTIONS.map((item) => {
                    const isSelected = formData.assets.includes(item.id);
                    const AssetIcon = item.icon;
                    return (
                      <div
                        key={item.id}
                        id={`asset-intent-card-${item.id}`}
                        onClick={() => toggleAsset(item.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 relative group ${
                          isSelected
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.04] ring-1 ring-cinema-amber-500'
                            : 'border-border bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-lg border ${
                            isSelected ? 'bg-cinema-amber-500/10 border-cinema-amber-500/20 text-cinema-amber-500' : 'bg-muted border-border text-muted-foreground group-hover:text-foreground'
                          }`}>
                            <AssetIcon className="w-3.5 h-3.5" />
                          </div>

                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950' : 'border-border bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-foreground block">{item.label}</span>
                          <span className="text-[9px] text-muted-foreground font-medium leading-tight block">{item.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 7: AI Preparation Config */}
            {step === 7 && (
              <motion.div
                key="step-7-aiprep"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step7-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 7: AI Preparation Config
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pre-schedule automated assistant draft blocks. Checking these options instructs the background workflow to structure chapters and scripts on final validation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="ai-preparation-list">
                  {AI_PREP_OPTIONS.map((item) => {
                    const isSelected = formData.aiPreferences.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        id={`ai-pref-card-${item.id}`}
                        onClick={() => toggleAIPreference(item.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.04] ring-1 ring-cinema-amber-500'
                            : 'border-border bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-foreground flex items-center gap-2">
                            {item.label}
                            {isSelected && (
                              <span className="text-[8px] font-mono font-bold bg-cinema-amber-500/10 text-cinema-amber-600 dark:text-cinema-amber-400 px-1.5 rounded uppercase">
                                Pre-Scheduled
                              </span>
                            )}
                          </h5>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {item.desc}
                          </p>
                        </div>

                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500 text-slate-950' : 'border-border bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-muted/60 border border-border rounded-xl text-[10px] text-muted-foreground leading-relaxed flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-cinema-amber-500" />
                  <span>These configurations acts as automated drafting flags. <strong>No credit tokens are used</strong>, and no dynamic rendering takes place until you trigger the Studio pipeline.</span>
                </div>
              </motion.div>
            )}

            {/* STEP 8: Review & Confirm Production */}
            {step === 8 && (
              <motion.div
                key="step-8-review"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
                id="wizard-step8-pane"
              >
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Step 8: Review & Confirm Production
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Validate your production choices. Initializing your project builds the workspace environment where you can review scripts, timeline tracks, and draft recordings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="wizard-review-panel">
                  
                  {/* Subject and Basics Block */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-3 md:col-span-2">
                    <h5 className="text-[10px] font-black text-cinema-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Subject & Story Basics
                    </h5>
                    
                    <div className="flex gap-3 bg-muted/60 p-3 rounded-lg border border-border/40">
                      <img
                        src={profiles.find(p => p.id === formData.associatedProfileId)?.profilePhoto}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[9px] text-muted-foreground font-mono block">Linked Profile Subject</span>
                        <strong className="text-xs text-foreground">
                          {profiles.find(p => p.id === formData.associatedProfileId)?.preferredName || 'Unknown subject'}
                        </strong>
                        <span className="text-[10px] text-muted-foreground ml-1.5">
                          ({profiles.find(p => p.id === formData.associatedProfileId)?.relationship || 'Subject'})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">Story Title</span>
                        <span className="text-xs font-bold text-foreground block line-clamp-1">{formData.title}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">Subtitle / Hook</span>
                        <span className="text-xs text-muted-foreground font-medium block line-clamp-1">{formData.subtitle}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">Description</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed block font-medium">
                          {formData.description || 'No descriptive outline provided.'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-2.5">
                      <div>
                        <span className="text-[9px] text-muted-foreground font-mono block">Language</span>
                        <span className="text-xs text-foreground font-bold">{formData.language}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground font-mono block">Visibility</span>
                        <span className="text-xs text-foreground font-bold">{formData.visibility}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground font-mono block">Custom Type</span>
                        <span className="text-xs text-foreground font-bold">{formData.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Format and Assets Column */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-4">
                    {/* Style & Tone */}
                    <div className="space-y-1.5">
                      <h5 className="text-[10px] font-black text-cinema-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" /> Style & Tone
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[8px] text-muted-foreground font-mono block">Vocal Tone</span>
                          <strong className="text-foreground">{formData.tone}</strong>
                        </div>
                        <div>
                          <span className="text-[8px] text-muted-foreground font-mono block">Visual Theme</span>
                          <strong className="text-foreground">{formData.style}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Intended Audiences */}
                    <div className="space-y-1">
                      <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-wider block">Target Audiences</span>
                      <div className="flex flex-wrap gap-1">
                        {formData.audiences.length > 0 ? (
                          formData.audiences.map(audId => (
                            <span key={audId} className="text-[9px] font-mono font-bold bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                              {AUDIENCE_OPTIONS.find(a => a.id === audId)?.name || audId.replace('aud-', '')}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-red-400 font-bold">No audience selected</span>
                        )}
                      </div>
                    </div>

                    {/* Assets & Preps Summary */}
                    <div className="space-y-2 border-t border-border/40 pt-2">
                      <div>
                        <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-wider block">Intended Assets Selected</span>
                        <span className="text-xs text-foreground font-black">{formData.assets.length} file categories</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-wider block">AI Script Scaffolding</span>
                        <span className="text-xs text-foreground font-black">{formData.aiPreferences.length} active drafts</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-cinema-amber-500/[0.03] border border-cinema-amber-500/10 rounded-xl text-[10px] text-cinema-amber-800 dark:text-cinema-amber-300 font-semibold leading-relaxed">
                  <strong>Notice on Digital Assets:</strong> Initial draft structure will be compiled inside the Story Library. No storage allocation limits are incurred. Proceeding compiles your outline immediately.
                </div>
              </motion.div>
            )}

      </div>
    </WizardLayout>
  );
}
