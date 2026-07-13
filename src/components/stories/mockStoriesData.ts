/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExtendedStory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category:
    | 'Biography'
    | 'Autobiography'
    | 'Memorial'
    | 'Celebration of Life'
    | 'Career Documentary'
    | 'Family Documentary'
    | 'Historical Documentary'
    | 'Tribute'
    | 'Anniversary'
    | 'Graduation'
    | 'Retirement'
    | 'Wedding'
    | 'Birthday';
  status:
    | 'Draft'
    | 'In Progress'
    | 'Ready for AI'
    | 'AI Processing'
    | 'Review'
    | 'Published'
    | 'Archived';
  completionProgress: number; // 0 - 100
  durationEstimate: string; // e.g. "12 mins"
  lastEdited: string; // ISO string
  lastGenerated: string | null; // ISO string or null
  aiReady: boolean;
  mediaCount: number;
  chapterCount: number;
  timelineEventCount: number;
  
  // Associated Legacy Profile details
  associatedProfileId: string;
  associatedProfileName: string;
  associatedProfilePhoto: string;
  associatedProfileRelationship: string;

  // Metadata & Organizers
  pinned: boolean;
  favorite: boolean;
  tags: string[];
  contributors: string[];

  // Lists for Details Page preview
  chapters?: {
    id: string;
    title: string;
    duration: string;
    summary: string;
    mediaCount: number;
  }[];
  timelineEvents?: {
    id: string;
    year: string;
    title: string;
    description: string;
  }[];
  mediaPreviews?: {
    id: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    title: string;
  }[];
  recentActivity?: {
    id: string;
    user: string;
    action: string;
    date: string;
  }[];
  aiInsights?: string[];
  coverImage: string;
}

export const STORY_TYPES = [
  'Biography',
  'Autobiography',
  'Memorial',
  'Celebration of Life',
  'Career Documentary',
  'Family Documentary',
  'Historical Documentary',
  'Tribute',
  'Anniversary',
  'Graduation',
  'Retirement',
  'Wedding',
  'Birthday'
] as const;

export const STORY_STATUSES = [
  'Draft',
  'In Progress',
  'Ready for AI',
  'AI Processing',
  'Review',
  'Published',
  'Archived'
] as const;

export const STORY_TYPE_ICONS: Record<string, string> = {
  'Biography': 'BookOpen',
  'Autobiography': 'User',
  'Memorial': 'Heart',
  'Celebration of Life': 'Sparkles',
  'Career Documentary': 'Briefcase',
  'Family Documentary': 'Users',
  'Historical Documentary': 'Globe',
  'Tribute': 'Award',
  'Anniversary': 'Calendar',
  'Graduation': 'GraduationCap',
  'Retirement': 'Wine',
  'Wedding': 'HeartHandshake',
  'Birthday': 'Gift'
};

export const INITIAL_STORIES: ExtendedStory[] = [
  {
    id: 'story-elizabeth-legacy',
    title: 'The Literary Legacy of Elizabeth Vance',
    subtitle: 'A lifelong journey of teaching, prose, and family devotion',
    description: 'An immersive biographical documentary charting Elizabeth Vance’s 40-year impact as an educator, literature enthusiast, and loving matriarch. This story chronicles her upbringing in Boston, her legendary lessons in literature, her coastal watercolors, and her enduring lessons passed down to grandchildren.',
    category: 'Biography',
    status: 'Ready for AI',
    completionProgress: 88,
    durationEstimate: '14 mins',
    lastEdited: '2026-07-12T16:45:00Z',
    lastGenerated: '2026-07-01T10:30:00Z',
    aiReady: true,
    mediaCount: 32,
    chapterCount: 5,
    timelineEventCount: 12,
    associatedProfileId: 'profile-elizabeth-vance',
    associatedProfileName: 'Elizabeth Vance',
    associatedProfilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    associatedProfileRelationship: 'Grandmother',
    pinned: true,
    favorite: true,
    tags: ['Matriarch', 'Literature', 'Boston', 'Documentary'],
    contributors: ['Philip Vance', 'Richard Vance'],
    coverImage: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=800&q=80',
    chapters: [
      { id: 'ch1', title: 'Autumn in Boston', duration: '2:30', summary: 'Her childhood years, early literary influences, and graduation from Wellesley College.', mediaCount: 6 },
      { id: 'ch2', title: 'The Call of California', duration: '3:15', summary: 'Moving west after marrying Robert Bob Vance and taking her first role as an instructor.', mediaCount: 8 },
      { id: 'ch3', title: 'The Classroom as Canvas', duration: '4:00', summary: 'Thirty-five years of literature lessons, high-school debates, and young minds inspired.', mediaCount: 10 },
      { id: 'ch4', title: 'Whispering Winds of Cape Cod', duration: '2:15', summary: 'Summer retreats and the watercolor painting hobbies that brought calm reflection.', mediaCount: 4 },
      { id: 'ch5', title: 'The Quiet Matriarch', duration: '2:00', summary: 'Retirement, welcoming grandchildren, and building a foundation of family archives.', mediaCount: 4 }
    ],
    timelineEvents: [
      { id: 'ev1', year: '1935', title: 'Born in Boston, Massachusetts', description: 'Welcomed into the world by Arthur and Clara Pendelton.' },
      { id: 'ev2', year: '1957', title: 'Wellesley College Graduation', description: 'Awarded a Bachelor of Arts in English Literature with high honors.' },
      { id: 'ev3', year: '1960', title: 'Married Robert "Bob" Vance', description: 'A beautiful ceremony in Boston before moving west together.' },
      { id: 'ev4', year: '1965', title: 'The Instructor Appointed', description: 'Head of Literature at San Francisco Union High School.' },
      { id: 'ev5', year: '1988', title: 'Watercolors at Marina District', description: 'First public exhibition showing twenty landscape canvases.' }
    ],
    mediaPreviews: [
      { id: 'm1', type: 'image', title: 'Elizabeth Teaching Class, 1972', url: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=300&q=80' },
      { id: 'm2', type: 'image', title: 'Wellesley College Portrait, 1957', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { id: 'm3', type: 'image', title: 'Summer in Cape Cod Coast', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' }
    ],
    recentActivity: [
      { id: 'act1', user: 'Philip Vance', action: 'Added Chapter 5 draft outline', date: '2026-07-12T16:45:00Z' },
      { id: 'act2', user: 'Philip Vance', action: 'Uploaded Cape Cod watercolor photo', date: '2026-07-11T14:12:00Z' },
      { id: 'act3', user: 'System AI', action: 'Scanned timeline consistency and marked Ready for AI', date: '2026-07-10T09:00:00Z' }
    ],
    aiInsights: [
      'Story contains excellent, high-contrast imagery covering her teaching career.',
      'Narrative has a cohesive chronological flow, moving from Boston to San Francisco.',
      'Recommended Voice Profile: "Graceful Matriarch" (warm, intellectual, standard mid-Atlantic dialect).'
    ]
  },
  {
    id: 'story-bob-military',
    title: 'Bob Vance: Service and Blue Skies',
    subtitle: 'The aviation journey and career of Grandpa Bob',
    description: 'A tribute film tracing Grandpa Bob Vance’s military service in the Pacific, his love for structural drafting, and his late-career dedication to restoring historic vintage biplanes.',
    category: 'Career Documentary',
    status: 'In Progress',
    completionProgress: 65,
    durationEstimate: '10 mins',
    lastEdited: '2026-07-10T11:20:00Z',
    lastGenerated: null,
    aiReady: false,
    mediaCount: 18,
    chapterCount: 3,
    timelineEventCount: 8,
    associatedProfileId: 'profile-bob-vance',
    associatedProfileName: 'Bob Vance',
    associatedProfilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    associatedProfileRelationship: 'Grandfather',
    pinned: true,
    favorite: false,
    tags: ['Aviation', 'Veteran', 'Drafting', 'History'],
    contributors: ['Philip Vance'],
    coverImage: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80',
    chapters: [
      { id: 'bch1', title: 'The Chicago Draftsman', duration: '3:00', summary: 'His training in drafting tables and technical drawings during the early 1950s.', mediaCount: 5 },
      { id: 'bch2', title: 'Wings of Honor', duration: '4:00', summary: 'Service years maintaining high-performance aircraft and traveling across tactical bases.', mediaCount: 8 },
      { id: 'bch3', title: 'Restoration Projects', duration: '3:00', summary: 'Retirement in California and his hands-on hangar restorations of classic vintage biplanes.', mediaCount: 5 }
    ],
    timelineEvents: [
      { id: 'bev1', year: '1931', title: 'Born in Chicago, Illinois', description: 'Born to second-generation immigrant mechanics.' },
      { id: 'bev2', year: '1951', title: 'Enlisted in Air Division', description: 'Assigned as a technical mechanic supervisor.' }
    ],
    mediaPreviews: [
      { id: 'bm1', type: 'image', title: 'Hangar Restoration Work, 2004', url: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=300&q=80' }
    ],
    recentActivity: [
      { id: 'bact1', user: 'Philip Vance', action: 'Updated Restoration chapter summary', date: '2026-07-10T11:20:00Z' }
    ],
    aiInsights: [
      'Narrative structure requires 2 more media items for Chapter 2 (Wings of Honor) to meet high quality standards.',
      'Recommended Voice Profile: "Veteran Commander" (gravelly, steady, dignified baritone).'
    ]
  },
  {
    id: 'story-vance-wedding',
    title: 'The Union of Elizabeth and Bob',
    subtitle: 'Celebrating fifty-eight years of marriage and partnership',
    description: 'A romantic archive celebrating the long marriage of Elizabeth Vance and Bob Vance. Highlighting their 1960 wedding, family moves, vacation roadtrips, and their joint family contributions.',
    category: 'Wedding',
    status: 'Published',
    completionProgress: 100,
    durationEstimate: '8 mins',
    lastEdited: '2026-06-15T09:15:00Z',
    lastGenerated: '2026-06-15T12:00:00Z',
    aiReady: true,
    mediaCount: 24,
    chapterCount: 4,
    timelineEventCount: 6,
    associatedProfileId: 'profile-elizabeth-vance',
    associatedProfileName: 'Elizabeth Vance',
    associatedProfilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    associatedProfileRelationship: 'Grandmother',
    pinned: false,
    favorite: true,
    tags: ['Wedding', 'Love', 'Vintage-Photo', 'Family-Milestone'],
    contributors: ['Philip Vance', 'Susan Vance Miller'],
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    chapters: [
      { id: 'wch1', title: 'Boston Bells', duration: '2:00', summary: 'The summer courtship and cathedral wedding ceremony in June 1960.', mediaCount: 6 },
      { id: 'wch2', title: 'Starting Anew in California', duration: '2:00', summary: 'Packing a station wagon and relocating to their first home in San Francisco.', mediaCount: 6 }
    ],
    timelineEvents: [
      { id: 'wev1', year: '1960', title: 'The Wedding Day', description: 'Elizabeth and Robert exchange vows in Boston.' }
    ],
    mediaPreviews: [
      { id: 'wm1', type: 'image', title: 'Wedding Toast, June 1960', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80' }
    ],
    recentActivity: [
      { id: 'wact1', user: 'Susan Vance Miller', action: 'Approved the final video rendering', date: '2026-06-15T12:00:00Z' }
    ],
    aiInsights: [
      'Video generation succeeded. Export jobs completed on 2026-06-15.'
    ]
  },
  {
    id: 'story-clara-roots',
    title: 'Clara Pendelton: Pioneer Days',
    subtitle: 'Historical archival narrative of late-nineteenth-century roots',
    description: 'An investigative genealogical chronicle of Clara Pendelton’s lineage, mapping their pioneer migration from Nebraska to Boston. Contains rare historical scans, old diary excerpts, and map tracking overlays.',
    category: 'Historical Documentary',
    status: 'Draft',
    completionProgress: 25,
    durationEstimate: '18 mins',
    lastEdited: '2026-07-01T15:30:00Z',
    lastGenerated: null,
    aiReady: false,
    mediaCount: 8,
    chapterCount: 2,
    timelineEventCount: 4,
    associatedProfileId: 'profile-elizabeth-vance',
    associatedProfileName: 'Elizabeth Vance',
    associatedProfilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    associatedProfileRelationship: 'Grandmother',
    pinned: false,
    favorite: false,
    tags: ['Genealogy', 'Pioneer', '19th-Century', 'Archives'],
    contributors: ['Richard Vance'],
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    chapters: [
      { id: 'pch1', title: 'The Prairie Outpost', duration: '5:00', summary: 'Life in Nebraska pioneer structures, farming challenges, and community bonds.', mediaCount: 4 }
    ],
    timelineEvents: [
      { id: 'pev1', year: '1888', title: 'Great Blizzard Resilience', description: 'Excerpts from Clara’s mother’s diary detailing the great storm.' }
    ],
    mediaPreviews: [],
    recentActivity: [
      { id: 'pact1', user: 'Richard Vance', action: 'Created new draft story script', date: '2026-07-01T15:30:00Z' }
    ],
    aiInsights: [
      'Story is in early Draft state. Add at least 5 more media items and complete a full chronological timeline to proceed.'
    ]
  },
  {
    id: 'story-elizabeth-retirement',
    title: 'Thirty-Five Years of Literature',
    subtitle: 'Celebrating Elizabeth’s retirement banquet and tribute highlights',
    description: 'A special memorial retirement scrapbook combining clips, letters from old students, and snapshots of the legendary 2000 farewell banquet at Union High School.',
    category: 'Retirement',
    status: 'Review',
    completionProgress: 95,
    durationEstimate: '6 mins',
    lastEdited: '2026-07-11T08:10:00Z',
    lastGenerated: '2026-07-11T08:30:00Z',
    aiReady: true,
    mediaCount: 15,
    chapterCount: 3,
    timelineEventCount: 5,
    associatedProfileId: 'profile-elizabeth-vance',
    associatedProfileName: 'Elizabeth Vance',
    associatedProfilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    associatedProfileRelationship: 'Grandmother',
    pinned: false,
    favorite: false,
    tags: ['Retirement', 'Tribute', 'Teaching', 'Prose'],
    contributors: ['Richard Vance', 'Philip Vance'],
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    chapters: [
      { id: 'rch1', title: 'The Final Lecture', duration: '2:00', summary: 'Elizabeth’s last lecture on Shakespearean drama before retirement.', mediaCount: 4 },
      { id: 'rch2', title: 'Words of Appreciation', duration: '2:00', summary: 'Letters and videos from three generations of alumni.', mediaCount: 7 }
    ],
    timelineEvents: [
      { id: 'rev1', year: '2000', title: 'Retirement Banquet', description: 'Two hundred guests gather at the Mark Hopkins Hotel to celebrate Elizabeth.' }
    ],
    mediaPreviews: [],
    recentActivity: [
      { id: 'ract1', user: 'Philip Vance', action: 'Sent draft out for Review', date: '2026-07-11T08:10:00Z' }
    ],
    aiInsights: [
      'Narration tracks perfect audio timings. Review completed by family members.'
    ]
  },
  {
    id: 'story-bob-garage',
    title: 'The Backyard Workshop & Garden',
    subtitle: 'Grandpa Bob’s creative crafting, woodturning, and heirloom roses',
    description: 'A warm, intimate home-documentary exploring the small workshop in Bob’s backyard. It covers his love for mahogany woodwork, building toys for grandchildren, and nurturing rare hybrid tea rosebeds in his garden.',
    category: 'Celebration of Life',
    status: 'In Progress',
    completionProgress: 50,
    durationEstimate: '7 mins',
    lastEdited: '2026-07-09T18:00:00Z',
    lastGenerated: null,
    aiReady: false,
    mediaCount: 11,
    chapterCount: 3,
    timelineEventCount: 5,
    associatedProfileId: 'profile-bob-vance',
    associatedProfileName: 'Bob Vance',
    associatedProfilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    associatedProfileRelationship: 'Grandfather',
    pinned: false,
    favorite: false,
    tags: ['Gardening', 'Woodworking', 'Heirlooms', 'Crafts'],
    contributors: ['Philip Vance'],
    coverImage: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=800&q=80',
    chapters: [
      { id: 'gch1', title: 'Shavings of Mahogany', duration: '2:30', summary: 'Inside the 10x12 wooden workshop where toys and custom frames were turned.', mediaCount: 4 }
    ],
    timelineEvents: [
      { id: 'gev1', year: '1995', title: 'The Hothouse Built', description: 'Bob builds his backyard greenhouse for hybrid tea roses.' }
    ],
    mediaPreviews: [],
    recentActivity: [
      { id: 'gact1', user: 'Philip Vance', action: 'Added tags and woodworking overview', date: '2026-07-09T18:00:00Z' }
    ],
    aiInsights: [
      'Story contains excellent, intimate sensory elements. Add ambient background soundscapes (woodplane shaving, bird calls) to enhance immersion.'
    ]
  }
];
