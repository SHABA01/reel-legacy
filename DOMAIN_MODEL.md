# DOMAIN_MODEL.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** Domain Model Specification  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. Domain Overview
3. Domain Design Principles
4. Core Domain Entities
5. User Domain
6. Legacy Profile Domain
7. Story Domain
8. Timeline Domain
9. Scene Domain
10. Media Domain
11. Narration Domain
12. Template Domain
13. Render Job Domain
14. Integration Domain
15. Collaboration Domain
16. Notification Domain
17. Analytics Domain
18. Relationships Between Domains
19. Domain Rules
20. Future Domain Expansion

---

# 1. Purpose

This document defines the business entities (domain objects) that make up ReelLegacy.

It establishes:

- The language used throughout the project.
- The responsibilities of each domain entity.
- Relationships between entities.
- Ownership of business data.
- High-level business rules.

This document is implementation-independent and should remain valid regardless of programming language, database, or framework.

---

# 2. Domain Overview

ReelLegacy revolves around one central concept:

> **A Story.**

Everything in the application exists to help users create, organize, enrich, render, preserve, and share meaningful stories.

Supporting entities such as profiles, timelines, media, narration, templates, and rendering all contribute toward building complete cinematic stories.

---

# 3. Domain Design Principles

The domain model should follow these principles:

- Story-first architecture
- Clear ownership of data
- Single responsibility for each entity
- Loose coupling
- High cohesion
- Extensibility
- AI-assisted workflows
- Reusable domain services
- Framework independence
- API-first design

Each domain entity should represent one real-world business concept.

---

# 4. Core Domain Entities

The primary entities are:

- User
- Legacy Profile
- Story
- Timeline
- Timeline Event
- Scene
- Media Asset
- Narration
- Voice
- Template
- Render Job
- Integration
- Notification
- Workspace
- Collaboration
- Analytics

These entities form the foundation of the application.

---

# 5. User Domain

The **User** represents the owner or collaborator of ReelLegacy content.

Responsibilities include:

- Authentication
- Account management
- Story ownership
- Collaboration
- Settings
- Preferences
- Subscription
- Notifications

A user may own multiple Legacy Profiles and multiple Stories.

A user can collaborate on stories owned by other users if granted permission.

---

# 6. Legacy Profile Domain

A **Legacy Profile** represents the structured information about a person or organization whose story is being told.

Typical information includes:

- Identity
- Biography
- Career
- Education
- Family
- Achievements
- Milestones
- Interests
- Beliefs
- Awards
- Organizations
- Personal notes

A Legacy Profile serves as the primary source of information for story generation.

One profile can produce multiple stories.

---

# 7. Story Domain

The **Story** is the central business entity.

Every story contains:

- Story type
- Story structure
- Timeline
- Scenes
- Media
- Narration
- Theme
- Render settings
- Publishing status

Examples include:

- Career Documentary
- Personal Biography
- Celebration of Life
- Founder Story
- Family History

A Story always belongs to one Legacy Profile.

---

# 8. Timeline Domain

A **Timeline** organizes events in chronological order.

Each timeline consists of multiple Timeline Events.

Typical events include:

- Birth
- Graduation
- Employment
- Marriage
- Awards
- Business milestones
- Travels
- Retirement

Timeline data becomes the narrative backbone of every Story.

---

# 9. Scene Domain

A **Scene** represents one chapter of a story.

A scene may contain:

- Title
- Description
- Narration
- Images
- Video
- Music
- Timeline references
- Transitions
- AI-generated suggestions

Scenes can be reordered, edited, duplicated, or removed without affecting other scenes.

---

# 10. Media Domain

A **Media Asset** represents any uploaded or imported content.

Supported examples include:

- Photos
- Videos
- Audio
- Documents
- Certificates
- Resumes
- CVs
- Newspaper clippings
- Letters
- Scanned images
- Presentation slides

Media may belong to one or multiple stories.

Media can also remain unassigned until needed.

---

# 11. Narration Domain

Narration provides the spoken storytelling for a Story.

Narration may be:

- AI-generated
- User-written
- Professionally recorded
- Uploaded audio

Narration is associated with one or more Scenes.

Users always retain editing control over narration.

---

# 12. Template Domain

Templates define the presentation style of a Story.

Examples include:

- Elegant
- Documentary
- Corporate
- Celebration
- Memorial
- Historical
- Inspirational
- Modern

Templates influence:

- Typography
- Transitions
- Scene layouts
- Colors
- Motion
- Music recommendations

Templates never modify the underlying story content.

---

# 13. Render Job Domain

A **Render Job** represents the process of generating the final documentary.

Possible states include:

- Pending
- Queued
- Processing
- Rendering
- Optimizing
- Completed
- Failed
- Cancelled

Each Render Job belongs to one Story.

Multiple render versions may exist for the same Story.

---

# 14. Integration Domain

Integrations allow ReelLegacy to communicate with external platforms.

Examples include:

- CareerCanvas
- LinkedIn
- GitHub
- Google Drive
- Google Photos
- Dropbox
- OneDrive

Each integration manages:

- Authentication
- Data synchronization
- Import
- Export
- Error handling

Integrations should never directly modify unrelated domain entities.

---

# 15. Collaboration Domain

Collaboration enables multiple people to contribute to a Story.

Possible collaborator roles include:

- Owner
- Editor
- Reviewer
- Viewer

Collaboration may include:

- Comments
- Suggestions
- Shared editing
- Version history
- Activity tracking

Permissions should always be role-based.

---

# 16. Notification Domain

Notifications inform users about important events.

Examples include:

- Render completed
- Story shared
- Collaboration request
- Import finished
- AI suggestion available
- Upload completed
- Integration status
- Account activity

Notifications should be non-intrusive and actionable.

---

# 17. Analytics Domain

Analytics provides insights into application usage.

Examples include:

- Stories created
- Render success rate
- Story completion rate
- Collaboration activity
- Storage usage
- AI usage
- Publishing statistics
- User engagement

Analytics should help users improve storytelling rather than simply collect statistics.

---

# 18. Relationships Between Domains

The high-level domain relationships are:

```
User
│
├── Owns
│      │
│      ▼
│  Legacy Profiles
│      │
│      ▼
│    Stories
│      │
├──────┼───────────────────────────────┐
│      │                               │
▼      ▼                               ▼
Timeline   Scenes                 Render Jobs
│            │
│            ├──────────────┐
▼            ▼              ▼
Events     Narration     Media Assets
                             │
                             ▼
                        Integrations
```

Supporting domains include:

- Templates
- Notifications
- Collaboration
- Analytics
---

# 19. Domain Rules

The following business rules apply across the platform.

1. Every Story belongs to exactly one Legacy Profile.
2. Every Legacy Profile belongs to one owner.
3. One Legacy Profile may produce many Stories.
4. Stories may contain many Scenes.
5. Stories contain one Timeline.
6. Timelines contain many Timeline Events.
7. Scenes may reference multiple Media Assets.
8. Media Assets may be reused across multiple Stories.
9. Render Jobs never modify Story content.
10. AI-generated content always remains editable by users.
11. Imported data should never overwrite user-approved information without confirmation.
12. Domain entities should communicate only through defined services.

---

# 20. Future Domain Expansion

The domain model is intentionally extensible.

Future entities may include:

- Family Trees
- Organization Profiles
- Historical Archives
- AI Characters
- Interactive Stories
- VR Experiences
- Public Story Collections
- Educational Story Modules
- Story Marketplaces
- Community Templates

Future additions should extend the existing domain model without requiring changes to the core entities.

The Story domain should remain the central entity around which all future capabilities are built.
