/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


export interface ExtendedLegacyProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  nickname?: string;
  gender?: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  nationality?: string;
  languages?: string[];
  lifeStatus: 'living' | 'memorial' | 'historical';
  category: 'personal' | 'autobiography' | 'memorial' | 'celebration' | 'career' | 'family-history' | 'historical-figure' | 'organization' | 'community';
  relationship: string;
  coverPhoto: string;
  profilePhoto: string;
  status: 'draft' | 'published' | 'archived';
  storyProgress: number; // 0-100
  mediaCount: number;
  timelineEventsCount: number;
  documentCount: number;
  lastUpdated: string;
  dateCreated: string;
  biographySummary?: string;
  tags?: string[];
  pinned?: boolean;
  favorite?: boolean;
  
  // Relationships
  parents?: string[];
  spouse?: string;
  children?: string[];
  familyMembers?: { relation: string; name: string }[];
  
  // Custom arrays for detail pages
  mediaPreviews?: { id: string; type: 'image' | 'video' | 'audio' | 'document'; url: string; title: string; size?: string }[];
  timelinePreviews?: { id: string; year: string; title: string; description: string; category?: string }[];
  documentsPreviews?: { id: string; title: string; type: string; size: string; dateAdded: string }[];
}

export const INITIAL_PROFILES: ExtendedLegacyProfile[] = [
  {
    id: 'profile-elizabeth-vance',
    firstName: 'Elizabeth',
    middleName: 'Ann',
    lastName: 'Vance',
    preferredName: 'Elizabeth Vance',
    nickname: 'Lizzy, Nana',
    gender: 'Female',
    dateOfBirth: '1935-10-12',
    placeOfBirth: 'Boston, MA',
    dateOfDeath: '2021-04-15',
    placeOfDeath: 'San Francisco, CA',
    nationality: 'American',
    languages: ['English', 'French'],
    lifeStatus: 'memorial',
    category: 'memorial',
    relationship: 'Grandmother',
    coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    status: 'published',
    storyProgress: 85,
    mediaCount: 42,
    timelineEventsCount: 18,
    documentCount: 12,
    lastUpdated: '2026-07-12T14:30:00Z',
    dateCreated: '2026-05-01T08:00:00Z',
    biographySummary: 'A pioneering educator and dedicated family matriarch, Elizabeth Ann Vance spent over forty years teaching public high school literature in Massachusetts and California. She was a passionate collector of classic novels, an amateur watercolorist, and the guiding light of the Vance family through three generations of change. Her resilience during the post-war era and her devotion to literature inspired countless young minds.',
    tags: ['Matriarch', 'Educator', 'Wellesley Alumna', 'Watercolorist'],
    parents: ['Arthur Pendelton', 'Clara Pendelton'],
    spouse: 'Robert "Grandpa Bob" Vance',
    children: ['Richard Vance', 'Susan Vance Miller'],
    familyMembers: [
      { relation: 'Spouse', name: 'Robert Vance' },
      { relation: 'Child', name: 'Richard Vance' },
      { relation: 'Child', name: 'Susan Vance Miller' },
      { relation: 'Grandchild', name: 'Philip Vance' },
    ],
    mediaPreviews: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=400&q=80', title: 'Elizabeth Teaching Literature, 1968', size: '2.4 MB' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', title: 'Summer in Cape Cod, 1974', size: '3.8 MB' },
      { id: 'm3', type: 'audio', url: '#', title: 'Elizabeth Reciting Robert Frost (Audio)', size: '14.5 MB' },
      { id: 'm4', type: 'document', url: '#', title: 'Literary Excellence Teacher Award 1982', size: '840 KB' },
    ],
    timelinePreviews: [
      { id: 't1', year: '1935', title: 'Born in Boston, Massachusetts', description: 'Born to Arthur and Clara Pendelton during the autumn transition.', category: 'Life event' },
      { id: 't2', year: '1957', title: 'Graduated from Wellesley College', description: 'Received her Bachelor of Arts in English Literature with high honors.', category: 'Education' },
      { id: 't3', year: '1960', title: 'Married Robert Vance', description: 'A beautiful ceremony in Boston, followed by a move to California.', category: 'Relationship' },
      { id: 't4', year: '1965', title: 'Appointed Head of Literature', description: 'Joined San Francisco Union High School, launching a legendary 35-year teaching career.', category: 'Career' },
      { id: 't5', year: '1988', title: 'First Watercolor Exhibition', description: 'Showcased twenty coastal landscapes at the Marina District Gallery.', category: 'Creative' },
    ],
    documentsPreviews: [
      { id: 'd1', title: 'Vintage Marriage Certificate (1960)', type: 'PDF Scan', size: '1.2 MB', dateAdded: '2026-05-15' },
      { id: 'd2', title: 'Wellesley College Thesis Paper', type: 'PDF document', size: '14.2 MB', dateAdded: '2026-06-01' },
      { id: 'd3', title: 'SF Chronicle Teacher Feature Article (1995)', type: 'Image clipping', size: '3.1 MB', dateAdded: '2026-06-20' },
    ],
  },
  {
    id: 'profile-bob-vance',
    firstName: 'Robert',
    middleName: 'James',
    lastName: 'Vance',
    preferredName: 'Bob Vance',
    nickname: 'Grandpa Bob',
    gender: 'Male',
    dateOfBirth: '1931-01-15',
    placeOfBirth: 'Chicago, IL',
    dateOfDeath: '2023-09-28',
    placeOfDeath: 'San Francisco, CA',
    nationality: 'American',
    languages: ['English'],
    lifeStatus: 'memorial',
    category: 'memorial',
    relationship: 'Grandfather',
    coverPhoto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    status: 'published',
    storyProgress: 60,
    mediaCount: 31,
    timelineEventsCount: 12,
    documentCount: 8,
    lastUpdated: '2026-07-11T09:15:00Z',
    dateCreated: '2026-05-10T11:00:00Z',
    biographySummary: 'Robert "Grandpa Bob" Vance was a visionary civil engineer who helped build modern San Francisco transit infrastructure. Born in Chicago, he served as a surveyor in the late Korean War, then moved west to establish a lifelong career with Bay Area transit councils. He loved carpentry, deep-sea fishing, and reciting old seafaring tales to his children and grandchildren.',
    tags: ['Engineer', 'Veteran', 'Builder', 'Fisherman'],
    parents: ['John Vance', 'Evelyn Vance'],
    spouse: 'Elizabeth Ann Vance',
    children: ['Richard Vance', 'Susan Vance Miller'],
    familyMembers: [
      { relation: 'Spouse', name: 'Elizabeth Ann Vance' },
      { relation: 'Child', name: 'Richard Vance' },
      { relation: 'Child', name: 'Susan Vance Miller' },
    ],
    mediaPreviews: [
      { id: 'm201', type: 'image', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80', title: 'Surveying Transit Lines, 1971', size: '4.1 MB' },
      { id: 'm202', type: 'image', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80', title: 'Deep Sea Fishing in Monterey', size: '2.9 MB' },
      { id: 'm203', type: 'video', url: '#', title: 'Grandpa Bob Woodworking, 1994 (Super8)', size: '78.2 MB' },
    ],
    timelinePreviews: [
      { id: 't201', year: '1931', title: 'Born in Chicago, Illinois', description: 'Born in the heart of the Midwest during the Great Depression.', category: 'Life event' },
      { id: 't202', year: '1951', title: 'Enlisted in US Navy Civil Engineer Corps', description: 'Deployed as a construction surveyor, gaining invaluable engineering experience.', category: 'Military' },
      { id: 't203', year: '1965', title: 'Lead Engineer, Bay Area Transit Plan', description: 'Oversaw concrete framing and soil surveys for major subway expansions.', category: 'Career' },
      { id: 't204', year: '1998', title: 'Retired to Carpentry Studio', description: 'Established his backyard wood shop, handcrafting furniture for family members.', category: 'Retirement' },
    ],
    documentsPreviews: [
      { id: 'd201', title: 'Navy Discharge Papers (1954)', type: 'Official document', size: '2.3 MB', dateAdded: '2026-05-12' },
      { id: 'd202', title: 'BART Expansion Blueprints', type: 'Drafting Scan', size: '11.5 MB', dateAdded: '2026-05-18' },
    ],
  },
  {
    id: 'profile-philip-vance',
    firstName: 'Philip',
    middleName: 'Richard',
    lastName: 'Vance',
    preferredName: 'Philip Vance',
    nickname: 'Phil',
    gender: 'Male',
    dateOfBirth: '1988-07-22',
    placeOfBirth: 'San Francisco, CA',
    nationality: 'American',
    languages: ['English', 'Spanish'],
    lifeStatus: 'living',
    category: 'autobiography',
    relationship: 'Self',
    coverPhoto: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'draft',
    storyProgress: 45,
    mediaCount: 15,
    timelineEventsCount: 6,
    documentCount: 4,
    lastUpdated: '2026-07-13T08:00:00Z',
    dateCreated: '2026-06-15T10:00:00Z',
    biographySummary: 'Philip "Phil" Vance is a digital archivist and film producer based in northern California. Inspired by his grandparents\' rich collection of letters, Super8 films, and vintage diaries, he initiated the ReelLegacy ecosystem. He aims to combine professional cinematic narrative structuring with personal historical archives to help families synthesize their legacies.',
    tags: ['Author', 'Producer', 'Archivist', 'Founder'],
    parents: ['Richard Vance', 'Mary Vance'],
    spouse: 'Helena Vance',
    children: ['Clara Bow Vance'],
    familyMembers: [
      { relation: 'Spouse', name: 'Hel Helena Vance' },
      { relation: 'Child', name: 'Clara Bow Vance' },
      { relation: 'Parent', name: 'Richard Vance' },
    ],
    mediaPreviews: [
      { id: 'm301', type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', title: 'Philip on Set, Documentary Shoot', size: '5.2 MB' },
    ],
    timelinePreviews: [
      { id: 't301', year: '1988', title: 'Born in San Francisco', description: 'Born at UCSF Medical Center during a bright summer morning.', category: 'Life event' },
      { id: 't302', year: '2010', title: 'Graduated USC School of Cinematic Arts', description: 'Earned a BFA in Documentary Film Production and Digital Archiving.', category: 'Education' },
      { id: 't303', year: '2020', title: 'Founded ReelLegacy', description: 'Laid the digital blueprint for family preservation systems.', category: 'Career' },
    ],
    documentsPreviews: [
      { id: 'd301', title: 'USC Graduation Diploma', type: 'PDF Scan', size: '1.4 MB', dateAdded: '2026-06-16' },
    ],
  },
  {
    id: 'profile-arthur-pendelton',
    firstName: 'Arthur',
    middleName: 'Thomas',
    lastName: 'Pendelton',
    preferredName: 'Arthur Pendelton',
    nickname: 'Artie',
    gender: 'Male',
    dateOfBirth: '1905-04-18',
    placeOfBirth: 'Gloucester, England',
    dateOfDeath: '1982-11-03',
    placeOfDeath: 'Boston, MA',
    nationality: 'British',
    languages: ['English'],
    lifeStatus: 'historical',
    category: 'historical-figure',
    relationship: 'Great-Grandfather',
    coverPhoto: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'published',
    storyProgress: 35,
    mediaCount: 18,
    timelineEventsCount: 5,
    documentCount: 14,
    lastUpdated: '2026-06-25T18:22:00Z',
    dateCreated: '2026-05-20T09:00:00Z',
    biographySummary: 'Arthur Pendelton immigrated from Gloucestershire to Boston in 1923 at the age of eighteen. A masterful blacksmith and later precision machinist, he worked in the Boston shipyards for four decades. He was a champion of local labor groups, an avid chess player, and a dedicated writer of letters detailing the immigrant struggle in early 20th century America.',
    tags: ['Immigrant', 'Blacksmith', 'Machinist', 'Chess Master'],
    parents: ['Thomas Pendelton', 'Sarah Pendelton'],
    spouse: 'Clara Pendelton',
    children: ['Elizabeth Ann Vance'],
    familyMembers: [
      { relation: 'Spouse', name: 'Clara Pendelton' },
      { relation: 'Child', name: 'Elizabeth Ann Vance' },
    ],
    mediaPreviews: [
      { id: 'm401', type: 'image', url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80', title: 'Blacksmith Shop in Gloucester, 1922', size: '6.5 MB' },
    ],
    timelinePreviews: [
      { id: 't401', year: '1905', title: 'Born in Gloucester, England', description: 'Born into a long line of English ironworkers.', category: 'Life event' },
      { id: 't402', year: '1923', title: 'Arrived at Ellis Island', description: 'Immigrated to the United States on the SS Celtic with only a trunk of iron tools.', category: 'Immigration' },
      { id: 't403', year: '1934', title: 'Married Clara Stone', description: 'A quiet autumn wedding at the Beacon Hill Chapel in Boston.', category: 'Relationship' },
    ],
    documentsPreviews: [
      { id: 'd401', title: 'Ellis Island Ship Manifest Scan', type: 'Archive document', size: '4.8 MB', dateAdded: '2026-05-22' },
      { id: 'd402', title: 'US Citizenship Certificate (1930)', type: 'Official document', size: '2.1 MB', dateAdded: '2026-05-25' },
    ],
  },
];
