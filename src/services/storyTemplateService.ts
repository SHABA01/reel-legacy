/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StoryTemplate,
  TemplateFilterState,
  AppliedStoryBlueprint,
} from '../types/storyTemplate';

export const INITIAL_STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'tmpl-life-story',
    name: 'Complete Life Story',
    description: 'A comprehensive, multi-chapter biographical blueprint capturing an individual’s whole journey from early childhood to lasting legacy.',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    category: 'Personal Biography',
    difficulty: 'Intermediate',
    estimatedRuntime: '25 - 45 mins',
    actCount: 3,
    chapterCount: 9,
    sceneCount: 27,
    storyType: 'Documentary Feature',
    recommendedAudience: 'Family, Descendants & Archive',
    popularity: 98,
    aiCompatibility: 'Full',
    recentlyUpdated: '2026-07-20',
    isFeatured: true,
    isPopular: true,
    isFavorite: false,
    author: 'ReelLegacy Master Studio',
    version: '2.4.0',
    versionHistory: [
      { version: '2.4.0', date: '2026-07-20', changes: 'Added AI prompt pack for archival voice restoration and enhanced 3-act pacing.' },
      { version: '2.0.0', date: '2026-03-12', changes: 'Introduced interview question bank for grand-children and milestone camera paths.' }
    ],
    rating: 4.9,
    tags: ['Biography', 'Life Story', 'Heritage', 'Full Feature', 'Archival'],
    narrativeBlueprint: {
      narrationStyle: 'Warm, reverent, reflective tone with gentle emotional pauses and historical resonance.',
      musicStyle: 'Cinematic Orchestral & Acoustic Piano (Tempo: Slow-Medium, 72-84 BPM)',
      cameraStyle: 'Slow Ken Burns pans across vintage photographs, intimate close-ups, smooth parallax depth.',
      visualStyle: 'Warm Sepia & Vintage Color Grading with grain overlays and soft lens vignettes.',
      recommendedSceneFlow: 'Chronological progression with reflective thematic interludes between major life eras.',
      acts: [
        {
          id: 'act-1',
          actNumber: 1,
          title: 'Act I: Roots & Foundations',
          description: 'Establishes origin, early ancestry, childhood environments, and formative youth experiences.',
          durationMinutes: 10,
          chapters: [
            {
              id: 'chap-1',
              title: 'Childhood & Ancestral Beginnings',
              objective: 'Introduce family lineage, birthplace, and childhood memories.',
              suggestedScenes: [
                {
                  id: 'sc-1',
                  title: 'Opening Prologue & Ancestral Roots',
                  narrativePurpose: 'Set the emotional tone and display ancestral family home or old black-and-white portraits.',
                  suggestedDuration: '02:15',
                  recommendedCameraMovement: 'Slow push-in on main portrait with subtle particle light rays.',
                  suggestedAssets: ['Vintage family photo 1930s', 'Voice recording prologue', 'Soft piano track'],
                  narrationObjective: 'Introduce the subjects full name, birth year, and family heritage.',
                  musicRecommendation: 'Acoustic Piano & Soft Strings (70 BPM)',
                  transitionType: 'Crossfade Blur'
                },
                {
                  id: 'sc-2',
                  title: 'School Days & Hometown Life',
                  narrativePurpose: 'Show childhood home, schoolhouse, early friends, and neighborhood culture.',
                  suggestedDuration: '03:00',
                  recommendedCameraMovement: 'Horizontal pan across old school report cards and town maps.',
                  suggestedAssets: ['Classroom photo', 'Hometown newspaper clipping'],
                  narrationObjective: 'Recount early mischief, favorite subjects, and childhood mentors.',
                  musicRecommendation: 'Nostalgic Acoustic Guitar',
                  transitionType: 'Film Reel Cut'
                }
              ]
            },
            {
              id: 'chap-2',
              title: 'Formative Youth & Early Dreams',
              objective: 'Capture adolescence, high school years, first ambitions, and hobbies.',
              suggestedScenes: [
                {
                  id: 'sc-3',
                  title: 'Youthful Ambitions & Hobbies',
                  narrativePurpose: 'Highlight sports, music instruments, or early passions during teenage years.',
                  suggestedDuration: '02:45',
                  recommendedCameraMovement: 'Slow zoom on diploma or sports trophy photo.',
                  suggestedAssets: ['High school yearbook portrait', 'Local newspaper headline'],
                  narrationObjective: 'Describe early dreams and character-building moments.',
                  musicRecommendation: 'Uplifting Warm Strings',
                  transitionType: 'Dissolve'
                }
              ]
            }
          ]
        },
        {
          id: 'act-2',
          actNumber: 2,
          title: 'Act II: The Journey & Crucible',
          description: 'Covers career, courtship, building a home, raising family, and overcoming adversity.',
          durationMinutes: 18,
          chapters: [
            {
              id: 'chap-3',
              title: 'Career & Life Calling',
              objective: 'Detail entering the workforce, military service, or finding professional purpose.',
              suggestedScenes: [
                {
                  id: 'sc-4',
                  title: 'First Job & Professional Path',
                  narrativePurpose: 'Illustrate early career struggles, dedication, and work ethics.',
                  suggestedDuration: '03:30',
                  recommendedCameraMovement: 'Pan across workplace photos and tools of trade.',
                  suggestedAssets: ['Workplace photo', 'First paycheck stub'],
                  narrationObjective: 'Explain core career accomplishments and colleagues.',
                  musicRecommendation: 'Inspirational Ambient Orchestra',
                  transitionType: 'Fade to Neutral'
                }
              ]
            },
            {
              id: 'chap-4',
              title: 'Courtship, Marriage & Building Family',
              objective: 'Document meeting spouse, wedding ceremony, buying first home, and birth of children.',
              suggestedScenes: [
                {
                  id: 'sc-5',
                  title: 'The Love Story & Wedding Day',
                  narrativePurpose: 'Celebrate the romance and union that shaped the family branch.',
                  suggestedDuration: '04:00',
                  recommendedCameraMovement: 'Ken Burns tilt on wedding portrait and invitation card.',
                  suggestedAssets: ['Wedding album scan', 'Love letters', 'Wedding Waltz audio'],
                  narrationObjective: 'Narrate how they met and key memories from the wedding day.',
                  musicRecommendation: 'Romantic String Quartet',
                  transitionType: 'Soft Light Flash'
                }
              ]
            }
          ]
        },
        {
          id: 'act-3',
          actNumber: 3,
          title: 'Act III: Wisdom & Eternal Legacy',
          description: 'Reflections on achievements, grand-children, golden years, and final advice for generations.',
          durationMinutes: 12,
          chapters: [
            {
              id: 'chap-5',
              title: 'Golden Years & Family Gatherings',
              objective: 'Show retirement, family reunions, hobbies, and wisdom shared.',
              suggestedScenes: [
                {
                  id: 'sc-6',
                  title: 'Wisdom for Grandchildren & Epilogue',
                  narrativePurpose: 'Provide a deeply moving closing message directly from the subject to future generations.',
                  suggestedDuration: '03:45',
                  recommendedCameraMovement: 'Static intimate video interview frame with soft bokeh backlighting.',
                  suggestedAssets: ['Video clip of wisdom advice', 'Family portrait 2026'],
                  narrationObjective: 'Share life philosophy, core values, and message of love.',
                  musicRecommendation: 'Emotional Orchestral Epilogue (68 BPM)',
                  transitionType: 'Fade to Black'
                }
              ]
            }
          ]
        }
      ],
      interviewQuestions: [
        {
          category: 'Early Beginnings',
          questions: [
            'What is your earliest vivid memory from childhood?',
            'What values did your parents instill in you that stayed with you forever?',
            'How would you describe the town or home where you grew up?'
          ]
        },
        {
          category: 'Love & Family',
          questions: [
            'How did you first meet your spouse, and what was your first impression?',
            'What was the most challenging era raising your children, and what brought you the greatest joy?',
            'What advice on marriage and relationships would you give your great-grandchildren?'
          ]
        },
        {
          category: 'Legacy & Reflection',
          questions: [
            'Looking back at your life, what accomplishment are you most proud of?',
            'What was the hardest obstacle you overcame, and how did it shape your character?',
            'What final words or blessings do you want recorded in this film for future generations?'
          ]
        }
      ],
      aiPromptPacks: [
        {
          title: 'Generative Life Narrative Script',
          purpose: 'Craft a 3-act voiceover script connecting archival clippings and video clips.',
          prompt: 'Write a warm, dignified 3-act documentary narration script for [Name], born in [Year]. Highlight their values of resilience, family devotion, and humility. Connect childhood roots in [Hometown] with career as [Profession] and marriage to [Spouse].'
        },
        {
          title: 'Emotional Transition Synthesizer',
          purpose: 'Generate bridging narration between career era and family era.',
          prompt: 'Create a smooth 30-second narration bridge transitioning from [Name]\'s retirement from [Career] into their role as a devoted grandparent surrounded by [Grandchildren Count] grandchildren.'
        }
      ],
      musicSuggestions: [
        {
          title: 'Memory Lane Reverie',
          genre: 'Cinematic Classical',
          mood: 'Nostalgic & Warm',
          tempo: 'Slow (68 BPM)',
          instrumentation: 'Solo Grand Piano, Cello & Soft Woodwinds',
          transitionStyle: 'Crossfade on chapter changes'
        },
        {
          title: 'Generational Horizon',
          genre: 'Inspirational Orchestra',
          mood: 'Triumphant & Uplifting',
          tempo: 'Medium (84 BPM)',
          instrumentation: 'Full String Section, French Horn & Harp',
          transitionStyle: 'Swell on climax scenes'
        }
      ],
      requiredAssets: [
        'Childhood portraits (min 3)',
        'Wedding photos or certificate',
        'Audio recording or video interview',
        'Family tree or lineage map'
      ],
      aiNotes: 'Optimal for AI voice cloning with high clarity audio clips. Ensures emotional resonance across all acts.'
    }
  },

  {
    id: 'tmpl-celebration-life',
    name: 'Celebration of Life',
    description: 'A respectful, uplifting tribute documentary designed for memorial services, funeral gatherings, or family archives.',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    category: 'Celebration of Life',
    difficulty: 'Beginner',
    estimatedRuntime: '10 - 18 mins',
    actCount: 3,
    chapterCount: 6,
    sceneCount: 15,
    storyType: 'Memorial Tribute',
    recommendedAudience: 'Memorial Service & Family Legacy',
    popularity: 96,
    aiCompatibility: 'Full',
    recentlyUpdated: '2026-07-24',
    isFeatured: true,
    isPopular: true,
    isFavorite: false,
    author: 'Memorial Tribute Studio',
    version: '1.8.0',
    versionHistory: [
      { version: '1.8.0', date: '2026-07-24', changes: 'Added candle lighting tribute scene and custom hymn music pack.' }
    ],
    rating: 4.95,
    tags: ['Memorial', 'Tribute', 'Celebration', 'In Remembrance', 'Comfort'],
    narrativeBlueprint: {
      narrationStyle: 'Gentle, soothing, deeply honoring voiceover focusing on joy, gratitude, and enduring spirit.',
      musicStyle: 'Acoustic Guitar, Warm Piano & Choral Ambient (Tempo: 60-75 BPM)',
      cameraStyle: 'Gentle floating drifts across photo collages and candle lit portraits.',
      visualStyle: 'Soft Golden Hour lighting, subtle lens flare, clean warm tones.',
      recommendedSceneFlow: 'Opening Tribute -> Early Life -> Family & Love -> Impact -> Tributes & Messages -> Closing Montage.',
      acts: [
        {
          id: 'act-1',
          actNumber: 1,
          title: 'Opening Tribute & Early Years',
          description: 'Introduces the honored individual, birth details, and joyous early memories.',
          durationMinutes: 4,
          chapters: [
            {
              id: 'chap-1',
              title: 'In Loving Memory',
              objective: 'Set a serene atmosphere and celebrate the life lived.',
              suggestedScenes: [
                {
                  id: 'sc-10',
                  title: 'Opening Tribute Portrait',
                  narrativePurpose: 'Display main honored portrait with dates and title screen.',
                  suggestedDuration: '01:30',
                  recommendedCameraMovement: 'Slow zoom out from portrait revealing candlelight.',
                  suggestedAssets: ['Honored portrait', 'Favorite poem text'],
                  narrationObjective: 'Express love and gratitude for the life of [Name].',
                  musicRecommendation: 'Soft Reverence Piano',
                  transitionType: 'Soft White Fade'
                }
              ]
            }
          ]
        },
        {
          id: 'act-2',
          actNumber: 2,
          title: 'Life Journey, Love & Community Impact',
          description: 'Showcases family bonds, friendships, career milestones, and community service.',
          durationMinutes: 8,
          chapters: [
            {
              id: 'chap-2',
              title: 'Laughter, Family & Friendships',
              objective: 'Highlight joyful moments, holidays, vacations, and smiles.',
              suggestedScenes: [
                {
                  id: 'sc-11',
                  title: 'A Life Full of Laughter',
                  narrativePurpose: 'Montage of candid family snapshots and holiday celebrations.',
                  suggestedDuration: '03:00',
                  recommendedCameraMovement: 'Dynamic photo wall scroll with soft focus overlays.',
                  suggestedAssets: ['Family holiday photos', 'Vacation clips'],
                  narrationObjective: 'Recall [Name]\'s sense of humor, kindness, and big heart.',
                  musicRecommendation: 'Warm Acoustic Folk & Piano',
                  transitionType: 'Crossfade'
                }
              ]
            }
          ]
        },
        {
          id: 'act-3',
          actNumber: 3,
          title: 'Closing Messages & Eternal Light',
          description: 'Quotes from family members, final blessing, and photo slideshow closing.',
          durationMinutes: 5,
          chapters: [
            {
              id: 'chap-3',
              title: 'Messages of Love & Epilogue',
              objective: 'Provide comfort and eternal remembrance.',
              suggestedScenes: [
                {
                  id: 'sc-12',
                  title: 'Sunset Closing Montage',
                  narrativePurpose: 'Closing photo collage set to an inspiring musical crescendo.',
                  suggestedDuration: '02:30',
                  recommendedCameraMovement: 'Pan up toward sky / sunset horizon.',
                  suggestedAssets: ['Sunset image', 'Signature handwriting scan'],
                  narrationObjective: 'Final closing message: "Forever in our hearts."',
                  musicRecommendation: 'Choral Strings & Piano Finale',
                  transitionType: 'Fade to Light'
                }
              ]
            }
          ]
        }
      ],
      interviewQuestions: [
        {
          category: 'Memories & Stories',
          questions: [
            'What was their favorite song or phrase they always repeated?',
            'What is one story about them that always makes everyone laugh?',
            'How did they make people feel when they walked into a room?'
          ]
        }
      ],
      aiPromptPacks: [
        {
          title: 'Memorial Tribute Speech Generator',
          purpose: 'Draft a respectful, heart-felt eulogy narration.',
          prompt: 'Write a compassionate, comforting 3-minute tribute voiceover for the celebration of life of [Name]. Emphasize their kindness, love for family, and the joy they brought into every room.'
        }
      ],
      musicSuggestions: [
        {
          title: 'Golden Sunset Peace',
          genre: 'Ambient Piano & Strings',
          mood: 'Peaceful & Comforting',
          tempo: '60 BPM',
          instrumentation: 'Piano, Cello, Light Synth Pad',
          transitionStyle: 'Smooth Dissolve'
        }
      ],
      requiredAssets: ['Honored main portrait', 'Life milestone photos', 'Spouse & family photos'],
      aiNotes: 'Optimized for quick rendering and high emotional warmth.'
    }
  },

  {
    id: 'tmpl-military-service',
    name: 'Military Veteran Legacy',
    description: 'An honorable narrative blueprint dedicated to recording military service, enlistment, deployments, awards, and return to civilian family life.',
    coverImage: 'https://images.unsplash.com/photo-1579912437766-78923a31c510?auto=format&fit=crop&w=800&q=80',
    category: 'Military Service',
    difficulty: 'Intermediate',
    estimatedRuntime: '15 - 30 mins',
    actCount: 3,
    chapterCount: 7,
    sceneCount: 20,
    storyType: 'Historical Military Documentary',
    recommendedAudience: 'Veterans, Family Archives & Museums',
    popularity: 91,
    aiCompatibility: 'Full',
    recentlyUpdated: '2026-07-15',
    isFeatured: true,
    isPopular: false,
    isFavorite: false,
    author: 'Heroic Veterans Audio Visual',
    version: '2.1.0',
    versionHistory: [
      { version: '2.1.0', date: '2026-07-15', changes: 'Added battle map animation preset and medal display showcase.' }
    ],
    rating: 4.88,
    tags: ['Military', 'Veteran', 'Patriot', 'Honor', 'Service', 'History'],
    narrativeBlueprint: {
      narrationStyle: 'Resonant, stately, courageous narration with clear historical accuracy and deep respect.',
      musicStyle: 'Brass Horns, Cinematic Drums & Patriotic Strings (Tempo: 76-90 BPM)',
      cameraStyle: 'Tactical map zooms, medal close-ups, archival photo scans with military crest watermarks.',
      visualStyle: 'High contrast archival black and white with khaki / olive film tint accents.',
      recommendedSceneFlow: 'Enlistment -> Training -> Deployment & Service -> Camaraderie -> Return Home -> Legacy.',
      acts: [
        {
          id: 'act-1',
          actNumber: 1,
          title: 'Act I: Call to Duty',
          description: 'Covers enlistment or draft, basic training, and entering the armed forces.',
          durationMinutes: 6,
          chapters: [
            {
              id: 'chap-1',
              title: 'Enlistment & Boot Camp',
              objective: 'Detail branch of service, boot camp location, and early discipline.',
              suggestedScenes: [
                {
                  id: 'sc-20',
                  title: 'Swearing In & Uniform Portrait',
                  narrativePurpose: 'Show official service portrait, branch logo, and enlistment location.',
                  suggestedDuration: '02:00',
                  recommendedCameraMovement: 'Slow push-in on uniform portrait with military insignia overlay.',
                  suggestedAssets: ['Service photo', 'Dog tags photo', 'Branch march music'],
                  narrationObjective: 'Record service branch, rank, unit designation, and date of enlistment.',
                  musicRecommendation: 'Cinematic Snare Drum & Brass',
                  transitionType: 'Wipe Right'
                }
              ]
            }
          ]
        },
        {
          id: 'act-2',
          actNumber: 2,
          title: 'Act II: Overseas Deployment & Service',
          description: 'Documents theaters of operation, key missions, letters home, and brotherhood in arms.',
          durationMinutes: 12,
          chapters: [
            {
              id: 'chap-2',
              title: 'Theater of Operations & Letters Home',
              objective: 'Illustrate daily life during deployment, field conditions, and correspondence with loved ones.',
              suggestedScenes: [
                {
                  id: 'sc-21',
                  title: 'Letters from the Frontline',
                  narrativePurpose: 'Voiceover reading handwritten letters sent to parents or spouse.',
                  suggestedDuration: '03:30',
                  recommendedCameraMovement: 'Ken Burns pan over original handwritten letter text.',
                  suggestedAssets: ['Archival letter scan', 'Unit group photo'],
                  narrationObjective: 'Read poignant excerpts from letters expressing hope and duty.',
                  musicRecommendation: 'Solemn Trumpet & Strings',
                  transitionType: 'Crossfade'
                }
              ]
            }
          ]
        },
        {
          id: 'act-3',
          actNumber: 3,
          title: 'Act III: Return Home & Lifetime of Honor',
          description: 'Honorable discharge, civilian career, veteran service organizations, and family pride.',
          durationMinutes: 8,
          chapters: [
            {
              id: 'chap-3',
              title: 'Medals, Ribbons & Epilogue',
              objective: 'Showcase commendations, medals, and reflections on serving the nation.',
              suggestedScenes: [
                {
                  id: 'sc-22',
                  title: 'Medal Case & Taps Salute',
                  narrativePurpose: 'Highlight shadowbox with medals, Purple Heart, Bronze Star, or service ribbons.',
                  suggestedDuration: '02:45',
                  recommendedCameraMovement: 'Macro lens drift across military medals and flag fold.',
                  suggestedAssets: ['Medal shadowbox photo', 'Flag presentation clip'],
                  narrationObjective: 'Summarize honors received and final message on service and freedom.',
                  musicRecommendation: 'Solemn Orchestral Brass & Strings',
                  transitionType: 'Fade to Black'
                }
              ]
            }
          ]
        }
      ],
      interviewQuestions: [
        {
          category: 'Military Experience',
          questions: [
            'What motivated you or how were you called to join the military?',
            'Who was your most memorable comrade or commander during your service?',
            'What lesson from military service stayed with you throughout your civilian life?'
          ]
        }
      ],
      aiPromptPacks: [
        {
          title: 'Military History Narrator',
          purpose: 'Generate an accurate, respectful narration combining military terminology and personal emotion.',
          prompt: 'Write an honorable military documentary script for Veteran [Name], who served in the [Branch] with the [Unit/Division] in [Location/Era]. Incorporate themes of sacrifice, camaraderie, and devotion to duty.'
        }
      ],
      musicSuggestions: [
        {
          title: 'Hymn for the Fallen',
          genre: 'Cinematic Military Brass',
          mood: 'Honorable & Reverent',
          tempo: '72 BPM',
          instrumentation: 'French Horns, Snare, Strings & Timpani',
          transitionStyle: 'Fade on scene shift'
        }
      ],
      requiredAssets: ['Official military photo', 'Dog tags or discharge papers', 'Medals or unit patch photo'],
      aiNotes: 'Includes military insignia watermark overlay and historical timeline milestones.'
    }
  },

  {
    id: 'tmpl-business-founder',
    name: 'Business Founder & Entrepreneur',
    description: 'Document the origin, grit, triumphs, team culture, and legacy of a company, startup, or family business founder.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    category: 'Business Legacy',
    difficulty: 'Advanced',
    estimatedRuntime: '20 - 35 mins',
    actCount: 3,
    chapterCount: 8,
    sceneCount: 22,
    storyType: 'Corporate & Entrepreneurial Feature',
    recommendedAudience: 'Company Stakeholders, Employees & Industry',
    popularity: 88,
    aiCompatibility: 'Full',
    recentlyUpdated: '2026-07-18',
    isFeatured: false,
    isPopular: false,
    isFavorite: false,
    author: 'Executive Heritage Films',
    version: '1.5.0',
    versionHistory: [
      { version: '1.5.0', date: '2026-07-18', changes: 'Added business timeline chart graphics and founder interview prompts.' }
    ],
    rating: 4.82,
    tags: ['Business', 'Entrepreneur', 'Founder', 'Company', 'Innovation', 'Success'],
    narrativeBlueprint: {
      narrationStyle: 'Dynamic, confident, visionary narration with inspiring forward-looking energy.',
      musicStyle: 'Modern Cinematic Electronic, Crisp Percussion & Uplifting Strings (Tempo: 90-110 BPM)',
      cameraStyle: 'Sleek pan motions over blueprint schematics, factory floor footage, and boardrooms.',
      visualStyle: 'Modern corporate cinematic grading, high contrast, crisp blue and amber hues.',
      recommendedSceneFlow: 'The Spark -> Garage Days -> The Breakout -> Overcoming Crisis -> Scaling -> Future Vision.',
      acts: [
        {
          id: 'act-1',
          actNumber: 1,
          title: 'Act I: The Spark & Garage Days',
          description: 'Captures the original idea, initial sacrifices, garage setup, and early prototypes.',
          durationMinutes: 7,
          chapters: [
            {
              id: 'chap-1',
              title: 'The Unsolved Problem & First Blueprint',
              objective: 'Explain the market opportunity and founder’s eureka moment.',
              suggestedScenes: [
                {
                  id: 'sc-30',
                  title: 'Garage Prototype & Napkin Sketch',
                  narrativePurpose: 'Show first prototype, original sketch on napkin or notebook.',
                  suggestedDuration: '02:30',
                  recommendedCameraMovement: 'Fast macro camera slide over original schematics.',
                  suggestedAssets: ['First prototype photo', 'Original business plan scan'],
                  narrationObjective: 'Explain why the founder risked everything to build this business.',
                  musicRecommendation: 'Driving Percussive Electronic',
                  transitionType: 'Glitch Zoom'
                }
              ]
            }
          ]
        },
        {
          id: 'act-2',
          actNumber: 2,
          title: 'Act II: Scaling, Innovation & Overcoming Storms',
          description: 'Detailing major breakthroughs, market expansions, economic downturns, and leadership decisions.',
          durationMinutes: 15,
          chapters: [
            {
              id: 'chap-2',
              title: 'The Breakthrough Order & Company Culture',
              objective: 'Highlight the key milestone contract that put the company on the map.',
              suggestedScenes: [
                {
                  id: 'sc-31',
                  title: 'Building the Dream Team',
                  narrativePurpose: 'Interviews with early key employees and factory floor footage.',
                  suggestedDuration: '04:00',
                  recommendedCameraMovement: 'Dynamic tracking shot through company headquarters.',
                  suggestedAssets: ['Early team photo 1990', 'Modern HQ video tour'],
                  narrationObjective: 'Celebrate the core values, work ethic, and culture built over decades.',
                  musicRecommendation: 'Uplifting Modern Symphony',
                  transitionType: 'Slide Left'
                }
              ]
            }
          ]
        },
        {
          id: 'act-3',
          actNumber: 3,
          title: 'Act III: The Legacy & Horizon',
          description: 'Passing the torch, succession planning, philanthropy, and lasting industry impact.',
          durationMinutes: 8,
          chapters: [
            {
              id: 'chap-3',
              title: 'Passing the Baton & The Next 50 Years',
              objective: 'Reflect on legacy and inspire future leaders.',
              suggestedScenes: [
                {
                  id: 'sc-32',
                  title: 'Founder\'s Message to Future Employees',
                  narrativePurpose: 'Direct address from founder summarizing key principles of success.',
                  suggestedDuration: '03:15',
                  recommendedCameraMovement: 'Centered cinematic portrait lighting.',
                  suggestedAssets: ['Founder video interview', 'Company milestone timeline'],
                  narrationObjective: 'Articulate the guiding compass for future generations of the enterprise.',
                  musicRecommendation: 'Inspiring Ambient Horizon',
                  transitionType: 'Fade to White'
                }
              ]
            }
          ]
        }
      ],
      interviewQuestions: [
        {
          category: 'Entrepreneurship',
          questions: [
            'What was the single scariest moment when the company almost failed, and how did you survive?',
            'What core principle guided your decision-making when hiring your first 10 employees?',
            'If you could give one piece of advice to a young founder starting today, what would it be?'
          ]
        }
      ],
      aiPromptPacks: [
        {
          title: 'Founder\'s Journey Scriptwriter',
          purpose: 'Craft an inspiring corporate origin story script.',
          prompt: 'Write an energetic, inspiring documentary script for [Company Name], founded by [Founder Name]. Focus on grit, innovation, overcoming the [Industry Crisis], and building a lasting industry legacy.'
        }
      ],
      musicSuggestions: [
        {
          title: 'Architect of Tomorrow',
          genre: 'Modern Hybrid Cinematic',
          mood: 'Driven & Visionary',
          tempo: '102 BPM',
          instrumentation: 'Synth Bass, Crisp Drums, Soaring Strings',
          transitionStyle: 'Beat Match Transition'
        }
      ],
      requiredAssets: ['Original logo / storefront photo', 'Early team photos', 'Key milestone newspaper clippings'],
      aiNotes: 'Includes automated timeline widget generator for company revenue and headcount milestones.'
    }
  },

  {
    id: 'tmpl-love-wedding',
    name: 'Love Story & Wedding Journey',
    description: 'A romantic storytelling blueprint charting how two people met, fell in love, got engaged, married, and built a shared life.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    category: 'Wedding Story',
    difficulty: 'Beginner',
    estimatedRuntime: '12 - 20 mins',
    actCount: 3,
    chapterCount: 6,
    sceneCount: 16,
    storyType: 'Romantic Documentary',
    recommendedAudience: 'Couple, Wedding Guests & Anniversary',
    popularity: 94,
    aiCompatibility: 'Full',
    recentlyUpdated: '2026-07-22',
    isFeatured: true,
    isPopular: true,
    isFavorite: false,
    author: 'Romantic Cinema Guild',
    version: '2.2.0',
    versionHistory: [
      { version: '2.2.0', date: '2026-07-22', changes: 'Added vows audio waveform visualizer and wedding waltz preset.' }
    ],
    rating: 4.92,
    tags: ['Wedding', 'Love Story', 'Romance', 'Anniversary', 'Couple', 'Vows'],
    narrativeBlueprint: {
      narrationStyle: 'Warm, intimate, joyful storytelling with dual perspective commentary.',
      musicStyle: 'Acoustic Guitar, Soft Piano & Romantic String Ensemble (Tempo: 70-85 BPM)',
      cameraStyle: 'Slow motion ring details, romantic portrait glides, warm lens flares.',
      visualStyle: 'Dreamy pastel tones, soft glow lighting, golden hour hues.',
      recommendedSceneFlow: 'First Encounter -> The Spark -> The Proposal -> Wedding Day Vows -> Golden Horizons.',
      acts: [
        {
          id: 'act-1',
          actNumber: 1,
          title: 'Act I: How We Met & First Spark',
          description: 'Recounting the first meeting, first date nervousness, and falling in love.',
          durationMinutes: 5,
          chapters: [
            {
              id: 'chap-1',
              title: 'The First Encounter',
              objective: 'Contrast both perspectives of how the couple first crossed paths.',
              suggestedScenes: [
                {
                  id: 'sc-40',
                  title: 'Two Paths Cross',
                  narrativePurpose: 'Show photos from before they met, leading up to the fateful first date.',
                  suggestedDuration: '02:15',
                  recommendedCameraMovement: 'Split screen sliding reveal of both individuals.',
                  suggestedAssets: ['Early photo of Bride', 'Early photo of Groom', 'Coffee shop location photo'],
                  narrationObjective: 'Share both perspectives of the first date and initial spark.',
                  musicRecommendation: 'Playful Acoustic Guitar & Ukulele',
                  transitionType: 'Soft Heart Vignette Fade'
                }
              ]
            }
          ]
        },
        {
          id: 'act-2',
          actNumber: 2,
          title: 'Act II: The Proposal & Wedding Day',
          description: 'The proposal story, wedding preparations, exchange of vows, and celebration.',
          durationMinutes: 10,
          chapters: [
            {
              id: 'chap-2',
              title: 'The Proposal & Wedding Vows',
              objective: 'Immortalize the magical proposal location and wedding ceremony.',
              suggestedScenes: [
                {
                  id: 'sc-41',
                  title: 'I Do - The Wedding Ceremony',
                  narrativePurpose: 'High definition showcase of the exchange of rings and wedding vows.',
                  suggestedDuration: '04:00',
                  recommendedCameraMovement: 'Cinematic slow motion pan across wedding altar.',
                  suggestedAssets: ['Wedding ceremony video clips', 'Vows audio track', 'Ring photo'],
                  narrationObjective: 'Play original vows audio or narrated love letter.',
                  musicRecommendation: 'Romantic String Quartet & Piano',
                  transitionType: 'Light Burst Dissolve'
                }
              ]
            }
          ]
        },
        {
          id: 'act-3',
          actNumber: 3,
          title: 'Act III: Building a Life Together',
          description: 'Honey moon memories, home building, anniversaries, and growing old together.',
          durationMinutes: 5,
          chapters: [
            {
              id: 'chap-3',
              title: 'Forever & Always',
              objective: 'Celebrate the journey ahead and anniversary milestones.',
              suggestedScenes: [
                {
                  id: 'sc-42',
                  title: 'Anniversary Toast & Epilogue',
                  narrativePurpose: 'Closing collage of current family life and travel adventures.',
                  suggestedDuration: '02:30',
                  recommendedCameraMovement: 'Smooth push-in on smiling couple portrait.',
                  suggestedAssets: ['Honeymoon photos', 'Current couple portrait'],
                  narrationObjective: 'Express gratitude for years of love and shared adventure.',
                  musicRecommendation: 'Inspiring Acoustic Crescendo',
                  transitionType: 'Fade to Light'
                }
              ]
            }
          ]
        }
      ],
      interviewQuestions: [
        {
          category: 'Love & Romance',
          questions: [
            'When did you realize that this person was "The One"?',
            'What is the funniest memory or mishap from your proposal day or wedding day?',
            'What is the secret ingredient that keeps your love strong year after year?'
          ]
        }
      ],
      aiPromptPacks: [
        {
          title: 'Romantic Vows Narrator',
          purpose: 'Blend wedding vows into a cinematic script.',
          prompt: 'Synthesize the wedding vows and love letters of [Partner A] and [Partner B] into a heartwarming 2-minute documentary voiceover script.'
        }
      ],
      musicSuggestions: [
        {
          title: 'Forever in Bloom',
          genre: 'Acoustic Romantic Piano',
          mood: 'Tender & Joyful',
          tempo: '78 BPM',
          instrumentation: 'Piano, Acoustic Guitar, Cello',
          transitionStyle: 'Soft Fade'
        }
      ],
      requiredAssets: ['Early dating photos', 'Proposal photo', 'Wedding ceremony photos/video'],
      aiNotes: 'Supports dual audio track mixing for mixing Bride and Groom voices.'
    }
  },

  {
    id: 'tmpl-blank-documentary',
    name: 'Custom Blank Canvas',
    description: 'A completely unconstrained, clean slate documentary blueprint allowing filmmakers to build custom acts, chapters, and scenes from scratch.',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    category: 'Custom Templates',
    difficulty: 'Advanced',
    estimatedRuntime: 'Custom Duration',
    actCount: 1,
    chapterCount: 1,
    sceneCount: 3,
    storyType: 'Flexible Custom Blueprint',
    recommendedAudience: 'Filmmakers, Editors & Power Users',
    popularity: 75,
    aiCompatibility: 'Full',
    recentlyUpdated: '2026-07-01',
    isFeatured: false,
    isPopular: false,
    isFavorite: false,
    author: 'ReelLegacy Open Blueprint',
    version: '1.0.0',
    versionHistory: [
      { version: '1.0.0', date: '2026-07-01', changes: 'Initial release of modular blank template studio canvas.' }
    ],
    rating: 4.7,
    tags: ['Blank', 'Custom', 'Modular', 'Advanced', 'Filmmaker', 'Freeform'],
    narrativeBlueprint: {
      narrationStyle: 'Custom user defined narration style.',
      musicStyle: 'User selected music tracks.',
      cameraStyle: 'User selected camera presets.',
      visualStyle: 'Neutral cinema color grading.',
      recommendedSceneFlow: 'Freeform user defined structure.',
      acts: [
        {
          id: 'act-1',
          actNumber: 1,
          title: 'Act I: Custom Opening',
          description: 'Initial custom act designed by user.',
          durationMinutes: 5,
          chapters: [
            {
              id: 'chap-1',
              title: 'Chapter 1: Custom Chapter',
              objective: 'User defined objective.',
              suggestedScenes: [
                {
                  id: 'sc-100',
                  title: 'Scene 1: Introduction Placeholder',
                  narrativePurpose: 'Establish custom intro scene.',
                  suggestedDuration: '01:00',
                  recommendedCameraMovement: 'Static or custom camera move',
                  suggestedAssets: ['Media Asset 1'],
                  narrationObjective: 'User custom voiceover statement.',
                  musicRecommendation: 'User choice background audio',
                  transitionType: 'Standard Cut'
                }
              ]
            }
          ]
        }
      ],
      interviewQuestions: [
        {
          category: 'Custom Category',
          questions: ['What is the primary topic of this film?']
        }
      ],
      aiPromptPacks: [
        {
          title: 'Freeform Narrative Assistant',
          purpose: 'Generate script from user topic prompt.',
          prompt: 'Write a documentary narration script about [Custom Topic].'
        }
      ],
      musicSuggestions: [
        {
          title: 'Universal Cinematic Theme',
          genre: 'Cinematic Orchestral',
          mood: 'Neutral & Atmospheric',
          tempo: '80 BPM',
          instrumentation: 'Strings & Piano',
          transitionStyle: 'Fade'
        }
      ],
      requiredAssets: ['Custom media files'],
      aiNotes: 'Provides maximum flexibility for non-traditional documentaries.'
    }
  }
];

// LocalStorage Persistence Key
const TEMPLATES_STORAGE_KEY = 'reellegacy_story_templates_v1';
const FAVORITES_STORAGE_KEY = 'reellegacy_story_templates_favorites_v1';
const APPLIED_BLUEPRINTS_STORAGE_KEY = 'reellegacy_applied_blueprints_v1';

export class StoryTemplateService {
  private static instance = new StoryTemplateService();
  private templates: StoryTemplate[] = [];
  private favorites: Set<string> = new Set();
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): StoryTemplateService {
    return StoryTemplateService.instance;
  }

  private loadFromStorage(): void {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        this.favorites = new Set(JSON.parse(savedFavorites));
      }

      const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (savedTemplates) {
        const parsed: StoryTemplate[] = JSON.parse(savedTemplates);
        // Merge with built-in templates to preserve defaults while keeping custom ones
        const customOnly = parsed.filter(t => t.isCustom || t.isCommunity);
        this.templates = [
          ...INITIAL_STORY_TEMPLATES.map(t => ({
            ...t,
            isFavorite: this.favorites.has(t.id)
          })),
          ...customOnly.map(t => ({
            ...t,
            isFavorite: this.favorites.has(t.id)
          }))
        ];
      } else {
        this.templates = INITIAL_STORY_TEMPLATES.map(t => ({
          ...t,
          isFavorite: this.favorites.has(t.id)
        }));
      }
    } catch (err) {
      console.warn('Failed to load templates from localStorage, fallback to initial templates:', err);
      this.templates = INITIAL_STORY_TEMPLATES;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(this.templates));
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(this.favorites)));
    } catch (err) {
      console.warn('Failed to save templates to localStorage:', err);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  public getTemplates(): StoryTemplate[] {
    return [...this.templates];
  }

  public getTemplateById(id: string): StoryTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  public toggleFavorite(id: string): boolean {
    const isFav = this.favorites.has(id);
    if (isFav) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }

    this.templates = this.templates.map(t => {
      if (t.id === id) {
        return { ...t, isFavorite: !isFav };
      }
      return t;
    });

    this.saveToStorage();
    this.notify();
    return !isFav;
  }

  public duplicateTemplate(id: string): StoryTemplate | undefined {
    const original = this.getTemplateById(id);
    if (!original) return undefined;

    const copy: StoryTemplate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `tmpl-custom-${Date.now()}`,
      name: `${original.name} (Copy)`,
      category: 'Custom Templates',
      isCustom: true,
      isFeatured: false,
      isPopular: false,
      author: 'You (Custom)',
      recentlyUpdated: new Date().toISOString().split('T')[0],
      version: '1.0.0',
      versionHistory: [
        {
          version: '1.0.0',
          date: new Date().toISOString().split('T')[0],
          changes: `Duplicated from ${original.name}`
        }
      ]
    };

    this.templates.unshift(copy);
    this.saveToStorage();
    this.notify();
    return copy;
  }

  public saveCustomTemplate(template: StoryTemplate): StoryTemplate {
    const existingIndex = this.templates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      this.templates[existingIndex] = {
        ...template,
        recentlyUpdated: new Date().toISOString().split('T')[0]
      };
    } else {
      this.templates.unshift(template);
    }

    this.saveToStorage();
    this.notify();
    return template;
  }

  public filterTemplates(filter: TemplateFilterState): StoryTemplate[] {
    return this.templates.filter(t => {
      // Category filter
      if (filter.category !== 'All Templates') {
        if (filter.category === 'Custom Templates' && !t.isCustom) return false;
        if (filter.category === 'Community Templates' && !t.isCommunity) return false;
        if (filter.category === 'Saved Templates' && !t.isFavorite) return false;
        if (
          filter.category !== 'Custom Templates' &&
          filter.category !== 'Community Templates' &&
          filter.category !== 'Saved Templates' &&
          t.category !== filter.category
        ) {
          return false;
        }
      }

      // Tab filter
      if (filter.tab === 'featured' && !t.isFeatured) return false;
      if (filter.tab === 'popular' && !t.isPopular) return false;
      if (filter.tab === 'custom' && !t.isCustom) return false;
      if (filter.tab === 'community' && !t.isCommunity) return false;

      // Search Query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(query);
        const matchDesc = t.description.toLowerCase().includes(query);
        const matchTags = t.tags.some(tag => tag.toLowerCase().includes(query));
        const matchCategory = t.category.toLowerCase().includes(query);
        const matchActs = t.narrativeBlueprint.acts.some(a =>
          a.title.toLowerCase().includes(query) ||
          a.chapters.some(c => c.title.toLowerCase().includes(query))
        );

        if (!matchName && !matchDesc && !matchTags && !matchCategory && !matchActs) {
          return false;
        }
      }

      // Difficulty
      if (filter.difficulty && filter.difficulty !== 'all' && t.difficulty.toLowerCase() !== filter.difficulty.toLowerCase()) {
        return false;
      }

      return true;
    });
  }

  /**
   * Applies a template blueprint directly to create a new Story in Story Workspace!
   * Scaffolds acts, chapters, scenes, interview questions, narration placeholders into local state.
   */
  public applyTemplateToStory(templateId: string, customStoryTitle?: string, profileName?: string): AppliedStoryBlueprint {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const title = customStoryTitle || `${template.name} - ${profileName || 'New Documentary'}`;

    const appliedBlueprint: AppliedStoryBlueprint = {
      templateId: template.id,
      templateName: template.name,
      storyTitle: title,
      profileName: profileName || 'Legacy Subject',
      createdAt: new Date().toISOString(),
      actCount: template.actCount,
      chapterCount: template.chapterCount,
      sceneCount: template.sceneCount,
      status: 'scaffolded'
    };

    // Store applied blueprint record
    try {
      const historyStr = localStorage.getItem(APPLIED_BLUEPRINTS_STORAGE_KEY);
      const history: AppliedStoryBlueprint[] = historyStr ? JSON.parse(historyStr) : [];
      history.unshift(appliedBlueprint);
      localStorage.setItem(APPLIED_BLUEPRINTS_STORAGE_KEY, JSON.stringify(history));

      // Save active story blueprint context for Story Studio
      localStorage.setItem('reellegacy_active_applied_template', JSON.stringify({
        template,
        blueprint: appliedBlueprint,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Failed to persist applied blueprint state:', err);
    }

    this.notify();
    return appliedBlueprint;
  }

  public getAppliedBlueprints(): AppliedStoryBlueprint[] {
    try {
      const str = localStorage.getItem(APPLIED_BLUEPRINTS_STORAGE_KEY);
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  }

  public getStats() {
    const total = this.templates.length;
    const custom = this.templates.filter(t => t.isCustom).length;
    const community = this.templates.filter(t => t.isCommunity).length;
    const favorites = this.favorites.size;
    const installed = total;

    return {
      total,
      custom,
      community,
      favorites,
      installed,
      updatesAvailable: 2
    };
  }
}
