# APP_STRUCTURE.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** Application Structure Specification  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. Application Architecture
3. Global Navigation
4. Public Pages
5. Authenticated Application
6. Primary Navigation (Sidebar)
7. Secondary Navigation
8. Global Header
9. Right Utility Panel
10. Page Hierarchy
11. Page Structures
12. Shared Modals
13. Drawers & Overlays
14. Navigation Flows
15. Responsive Structure
16. User Roles & Permissions
17. CareerCanvas Integration Points
18. Future Expansion
19. Application Map
20. Application Rules

---

# 1. Purpose

This document defines the complete structural blueprint of ReelLegacy.

It specifies:

- Every application page
- Navigation hierarchy
- Layout structure
- Sidebars
- Headers
- Modals
- Drawers
- User navigation flows
- Relationships between pages

This document serves as the primary implementation guide for:

- Google AI Studio
- Google Antigravity
- Human Frontend Engineers
- Future Contributors

It intentionally focuses on **application structure**, not visual styling.

---

# 2. Application Architecture

The application consists of two major experiences.

## Public Website

Accessible without authentication.

Purpose:

- Marketing
- Product discovery
- Authentication
- Documentation
- Legal information

---

## Authenticated Application

Accessible after login.

Purpose:

- Story creation
- Documentary production
- AI collaboration
- Media management
- Rendering
- Settings
- Integrations

---

# 3. Global Navigation

Application navigation is divided into four categories.

## Public Navigation

- Home
- Features
- Templates
- Pricing (Future)
- About
- Help
- Login
- Register

---

## Primary Navigation

Main application sidebar.

---

## Secondary Navigation

Context-specific navigation inside feature pages.

---

## Global Utilities

Always accessible.

- Search
- AI Assistant
- Notifications
- Profile
- Settings

---

# 4. Public Pages

The public website includes:

## Marketing

- Landing Page
- Features
- Story Types
- How It Works
- FAQ
- About
- Contact

---

## Authentication

- Login
- Register
- Forgot Password
- Reset Password
- Verify Email

---

## Legal

- Privacy Policy
- Terms of Service
- Cookie Policy (Future)

---

## Support

- Help Center
- Documentation
- Contact Support

---

# 5. Authenticated Application

After authentication, users enter the application shell.

Core application pages include:

- Dashboard
- Story Library
- Story Workspace
- Legacy Profiles
- Timeline
- Media Library
- Narration Studio
- Templates
- Render Queue
- Analytics
- Integrations
- Notifications
- Search
- Settings

Future pages:

- Team Workspace
- Organization Dashboard
- Public Gallery
- Billing
- Plugin Marketplace

---

# 6. Primary Navigation (Sidebar)

The left sidebar serves as the primary navigation.

## Home

- Dashboard

---

## Storytelling

- Story Library
- Story Workspace
- Timeline

---

## Assets

- Legacy Profiles
- Media Library
- Narration Studio
- Templates

---

## Production

- Render Queue
- Analytics

---

## System

- Integrations
- Notifications
- Settings

Sidebar behavior:

Desktop

- Expanded by default
- Collapsible

Tablet

- Collapsed by default

Mobile

- Hidden
- Opens using navigation drawer

---

# 7. Secondary Navigation

Certain pages require internal navigation.

## Story Workspace

- Overview
- Timeline
- Scenes
- Narration
- Media
- Preview
- Versions

---

## Settings

- Profile
- Account
- Security
- Appearance
- Notifications
- AI Preferences
- Integrations
- Storage
- Accessibility
- About

---

## Legacy Profile

- Biography
- Career
- Family
- Education
- Achievements
- Timeline
- Media

---

# 8. Global Header

Visible throughout authenticated pages.

Contains:

Left

- Application Logo
- Current Page Title

Center

- Global Search

Right

- Quick Create
- AI Assistant
- Notifications
- Theme Toggle
- User Avatar
- Account Menu

Future additions:

- Workspace Selector
- Team Switcher

---

# 9. Right Utility Panel

Appears only where useful.

Possible widgets include:

Story Workspace

- AI Suggestions
- Scene Properties
- Story Metadata
- Comments
- Version History

Media Library

- Preview
- Metadata
- Tags
- AI Analysis

Legacy Profile

- Completion Progress
- AI Recommendations

Dashboard

- Recent Activity
- Upcoming Tasks

Panel behavior:

Desktop

Persistent.

Tablet

Collapsible.

Mobile

Drawer.

---

# 10. Page Hierarchy

```
Landing

↓

Authentication

↓

Dashboard

├── Story Library
│      │
│      ├── Story Workspace
│      │       ├── Timeline
│      │       ├── Scenes
│      │       ├── Narration
│      │       ├── Media
│      │       └── Preview
│      │
│      └── Render Queue
│
├── Legacy Profiles
│
├── Media Library
│
├── Templates
│
├── Analytics
│
├── Integrations
│
└── Settings
```

---

# 11. Page Structures

## Dashboard

Contains:

- Welcome Banner
- Continue Editing
- Recent Stories
- Rendering Queue
- AI Suggestions
- Notifications
- Quick Actions
- Story Statistics

---

## Story Library

Contains:

- Search
- Filters
- Story Grid
- Story List
- Story Actions
- Empty State

---

## Story Workspace

Contains:

- Toolbar
- Timeline
- Scene List
- Story Editor
- Preview
- AI Assistant
- Right Panel

---

## Legacy Profiles

Contains:

- Biography
- Timeline
- Career
- Family
- Media
- Documents

---

## Media Library

Contains:

- Upload Area
- Folder Tree
- Grid View
- List View
- Preview
- Metadata

---

## Narration Studio

Contains:

- Script
- Voice Selection
- Audio Preview
- AI Suggestions

---

## Render Queue

Contains:

- Pending Jobs
- Active Jobs
- Completed Jobs
- Failed Jobs

---

## Analytics

Contains:

- Story Statistics
- Rendering Metrics
- Storage Usage
- AI Usage

---

## Integrations

Contains:

- Connected Apps
- CareerCanvas
- LinkedIn
- Google Drive
- Dropbox
- GitHub (Future)

---

## Settings

Contains:

- Profile
- Account
- Appearance
- Notifications
- Security
- AI Preferences
- Integrations
- Storage
- Accessibility
- About

---

# 12. Shared Modals

Reusable modals include:

- Create Story
- Import Resume
- Import CareerCanvas Data
- Upload Media
- AI Story Generator
- Rename Story
- Duplicate Story
- Delete Story
- Export Story
- Confirm Action
- Error Dialog
- Success Dialog

All modals should follow consistent sizing, spacing, and interaction patterns.

---

# 13. Drawers & Overlays

Global overlays reuse the shared Overlay Manager architecture established in CareerCanvas.

Supported overlays:

- Global Search
- AI Assistant
- Notifications
- Help Center (Future)

Rules:

- Only one global overlay may be open at a time.
- Opening a new overlay automatically closes the previous one.
- Standard modals are independent of the Overlay Manager.

---

# 14. Navigation Flows

## New Story

Dashboard

↓

Create Story

↓

Story Wizard

↓

Story Workspace

↓

Render Queue

↓

Export

---

## Resume to Career Documentary

Dashboard

↓

Import Resume

↓

Resume Interpreter

↓

Timeline Generator

↓

Story Generator

↓

Story Workspace

↓

Render

↓

Share

---

## CareerCanvas Workflow

Dashboard

↓

Connect CareerCanvas

↓

Import Professional Data

↓

Generate Career Documentary

↓

Story Workspace

↓

Render

↓

Export Back to CareerCanvas (Optional)

---

# 15. Responsive Structure

Desktop

- Full sidebar
- Right utility panel
- Multi-column layouts

Tablet

- Collapsible sidebar
- Optional utility panel
- Adaptive grids

Mobile

- Navigation drawer
- Bottom action bar (future)
- Single-column layouts
- Full-screen editors
- Drawer-based utilities

All pages should preserve functionality across screen sizes.

---

# 16. User Roles & Permissions

## Guest

- View public pages

---

## Registered User

- Create stories
- Manage media
- Render documentaries
- Access AI features

---

## Collaborator (Future)

- Edit shared stories
- Comment
- Review
- Suggest changes

---

## Administrator

- User management
- Platform management
- Analytics
- System configuration

---

# 17. CareerCanvas Integration Points

ReelLegacy integrates with CareerCanvas through dedicated APIs.

Import capabilities:

- Resume
- Projects
- Skills
- Experience
- Education
- Certifications
- Professional Timeline
- Portfolio Media

Export capabilities:

- Career Documentary
- Biography Video
- Highlight Reel
- Public Showcase Link

Each application maintains its own database and repository.

---

# 18. Future Expansion

The application structure should support future modules including:

- Family Workspace
- Organization Workspace
- Public Gallery
- Plugin Marketplace
- Mobile Companion
- Desktop Application
- AI Story Marketplace
- Collaboration Hub
- Billing & Subscriptions
- Multi-language Support

These modules should integrate without restructuring the existing navigation.

---

# 19. Application Map

```
Public Website
│
├── Landing
├── Features
├── About
├── Help
├── Login
└── Register

↓

Authenticated App

Dashboard
│
├── Story Library
│      └── Story Workspace
│              ├── Timeline
│              ├── Scenes
│              ├── Narration
│              ├── Media
│              └── Preview
│
├── Legacy Profiles
├── Media Library
├── Templates
├── Render Queue
├── Analytics
├── Integrations
├── Notifications
├── Search
└── Settings
```

---

# 20. Application Rules

1. Every screen must belong to a clearly defined navigation hierarchy.
2. The application shell (header, sidebar, overlays) must remain consistent across authenticated pages.
3. Reuse CareerCanvas navigation patterns and shared components wherever appropriate.
4. Only one global overlay may be open at any time.
5. Every page must support desktop, tablet, and mobile layouts.
6. Every major feature should have a dedicated top-level page rather than being hidden inside unrelated screens.
7. All imports and exports with CareerCanvas must occur through documented APIs.
8. New modules should extend the existing navigation instead of replacing it.
9. The application should remain modular, scalable, and easy to understand for both users and contributors.
10. Every structural decision should reinforce ReelLegacy's mission of helping users transform personal, professional, and organizational stories into compelling AI-assisted cinematic experiences.
