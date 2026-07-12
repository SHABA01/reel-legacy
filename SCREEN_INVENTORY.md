# SCREEN_INVENTORY.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** Screen Inventory & Frontend Blueprint  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. Screen Classification
3. Public Website Screens
4. Authentication Screens
5. Core Application Screens
6. Story Creation Workflow
7. Story Workspace Screens
8. Supporting Feature Screens
9. Settings Screens
10. Shared Layouts
11. Shared Components
12. Modals
13. Drawers & Global Overlays
14. Empty States
15. Loading States
16. Error States
17. Responsive Screen Behavior
18. Future Screens
19. Screen Relationships
20. Screen Rules

---

# 1. Purpose

This document serves as the complete inventory of every screen, page, layout, modal, drawer, overlay, and reusable interface within ReelLegacy.

Unlike **APP_STRUCTURE.md**, which explains how the application is organized, this document explains **what each individual screen contains**.

This document should guide:

- Google AI Studio
- Google Antigravity
- Human Frontend Engineers
- UI/UX Designers
- Future Contributors

Every screen should have a clearly defined purpose before implementation begins.

---

# 2. Screen Classification

The application is divided into six categories.

## Public Website

Marketing and informational pages.

## Authentication

User identity and account management.

## Core Application

Daily productivity and storytelling screens.

## Feature Screens

Dedicated workflows for media, rendering, narration, etc.

## Settings

Configuration and preferences.

## Shared UI

Reusable layouts, modals, overlays, and components.

---

# 3. Public Website Screens

## Landing Page

Purpose

Introduce ReelLegacy.

Sections

- Hero
- Value Proposition
- Story Types
- Features
- AI Capabilities
- Testimonials
- FAQ
- Call To Action
- Footer

Primary Actions

- Get Started
- Login
- Learn More

---

## Features

Contains

- Product Features
- AI Features
- Documentary Examples
- Workflow Overview

---

## Story Types

Displays supported documentaries.

Examples

- Biography
- Autobiography
- Celebration of Life
- Memorial
- Career Documentary
- Retirement Story
- Family Legacy

---

## About

Contains

- Mission
- Vision
- Company Story

---

## Help Center

Contains

- Documentation
- Guides
- Contact Support

---

## Legal

Separate pages for:

- Privacy Policy
- Terms of Service
- Cookie Policy (Future)

---

# 4. Authentication Screens

## Login

Contains

- Email
- Password
- Remember Me
- Login Button
- Forgot Password
- Register Link

---

## Register

Contains

- Name
- Email
- Password
- Confirm Password
- Create Account

---

## Forgot Password

Contains

- Email Input
- Reset Request

---

## Reset Password

Contains

- New Password
- Confirm Password

---

## Email Verification

Contains

- Verification Status
- Resend Verification

---

# 5. Core Application Screens

## Dashboard

Widgets

- Welcome
- Continue Editing
- Recent Stories
- AI Suggestions
- Rendering Queue
- Notifications
- Storage Usage
- Quick Actions

---

## Story Library

Contains

- Search
- Filters
- Story Grid
- Story List
- Sort Controls
- Create Story Button

---

## Legacy Profiles

Contains

- Biography
- Personal Details
- Career
- Family
- Timeline
- Documents
- Media

---

## Timeline

Contains

- Timeline Editor
- Events
- Filters
- Add Event
- AI Suggestions

---

# 6. Story Creation Workflow

## Create Story Wizard

Step 1

Choose Story Type

↓

Step 2

Select Person

↓

Step 3

Import Data

↓

Step 4

Upload Media

↓

Step 5

AI Story Generation

↓

Step 6

Review

↓

Step 7

Open Story Workspace

---

## Import Resume

Contains

- Upload Area
- Resume Preview
- AI Extraction
- Timeline Generation

---

## Import CareerCanvas

Contains

- Account Connection
- Data Selection
- Import Preview
- Import Summary

---

# 7. Story Workspace Screens

This is the primary working environment.

## Workspace Overview

Contains

- Story Header
- Toolbar
- Story Status
- Progress

---

## Scene Editor

Contains

- Scene List
- Rich Text Editor
- AI Rewrite
- Scene Notes

---

## Timeline View

Contains

- Chronological Events
- Reordering
- AI Recommendations

---

## Narration View

Contains

- Narration Script
- Voice Selection
- Audio Preview

---

## Media View

Contains

- Linked Photos
- Videos
- Documents
- Audio

---

## Preview

Contains

- Story Preview
- Documentary Preview
- Playback Controls

---

## Version History

Contains

- Previous Versions
- Restore
- Compare

---

# 8. Supporting Feature Screens

## Media Library

Contains

- Upload
- Grid View
- List View
- Folder Tree
- Preview
- Metadata
- AI Analysis

---

## Narration Studio

Contains

- Script Editor
- Voice Library
- Audio Preview
- AI Narration

---

## Templates

Contains

- Documentary Templates
- Preview
- Categories
- Favorites

---

## Render Queue

Contains

- Pending
- Active
- Completed
- Failed

---

## Analytics

Contains

- Story Statistics
- AI Usage
- Rendering Statistics
- Storage Usage

---

## Integrations

Contains

- CareerCanvas
- Google Drive
- Dropbox
- LinkedIn
- Future Integrations

---

# 9. Settings Screens

Settings is divided into dedicated pages.

## Profile

Personal information.

---

## Account

Email and account details.

---

## Security

- Password
- Sessions
- Devices

---

## Appearance

- Theme
- Light
- Dark
- System
- Font Size (Future)

---

## Notifications

- Email
- Push
- In-App

---

## AI Preferences

- Writing Style
- Story Tone
- Creativity Level
- Default AI Behavior

---

## Storage

- Usage
- Cleanup
- Limits

---

## Integrations

Connected services.

---

## Accessibility

- High Contrast
- Reduced Motion
- Keyboard Navigation

---

## About

Application information.

---

# 10. Shared Layouts

Reusable layouts include:

- Public Website Layout
- Authentication Layout
- Application Shell
- Full Editor Layout
- Settings Layout
- Wizard Layout
- Empty Layout
- Error Layout

These layouts should remain consistent across all pages.

---

# 11. Shared Components

Major reusable components include:

- Header
- Sidebar
- Right Utility Panel
- Search Bar
- Story Card
- Media Card
- Timeline Card
- AI Suggestion Card
- Buttons
- Inputs
- Forms
- Tables
- Accordions
- Tabs
- Progress Bars
- Upload Zones
- Toast Notifications
- Skeleton Loaders

These components should be reused instead of recreated.

---

# 12. Modals

Application modals include:

- Create Story
- Upload Media
- Import Resume
- Import CareerCanvas
- AI Story Generator
- AI Biography Generator
- Rename Story
- Duplicate Story
- Delete Story
- Export Story
- Confirm Action
- Success Dialog
- Error Dialog

All modals should follow a consistent design pattern.

---

# 13. Drawers & Global Overlays

Managed through the shared Overlay Manager.

Supported overlays:

- Global Search
- AI Assistant
- Notifications
- Help Center (Future)

Only one overlay may remain open at any time.

On mobile devices, these overlays become full-screen drawers.

---

# 14. Empty States

Every screen should define meaningful empty states.

Examples:

Dashboard

"No stories yet."

Story Library

"Create your first story."

Media Library

"No media uploaded."

Render Queue

"No active renders."

Timeline

"No events added."

Empty states should always provide a clear next action.

---

# 15. Loading States

Loading experiences should include:

- Skeleton Cards
- Skeleton Lists
- Progress Indicators
- Upload Progress
- Rendering Progress
- AI Generation Progress

Avoid blank screens during loading.

---

# 16. Error States

Every screen should gracefully handle:

- Validation Errors
- Network Errors
- Authentication Failures
- Permission Errors
- Missing Files
- AI Generation Failures
- Rendering Failures
- Integration Failures

Users should always receive actionable recovery options.

---

# 17. Responsive Screen Behavior

Desktop

- Multi-column layouts
- Persistent sidebar
- Right utility panel

Tablet

- Collapsible sidebar
- Adaptive grids

Mobile

- Drawer navigation
- Single-column layouts
- Full-screen editing
- Bottom actions (Future)

No core functionality should be removed on smaller screens.

---

# 18. Future Screens

Potential future additions include:

- Team Workspace
- Organization Dashboard
- Family Workspace
- Public Gallery
- Plugin Marketplace
- Billing
- Subscription Management
- AI Marketplace
- Mobile Companion
- Desktop Companion

These screens should integrate into the existing navigation without major restructuring.

---

# 19. Screen Relationships

```
Landing
    │
    ▼
Authentication
    │
    ▼
Dashboard
    │
    ├── Story Library
    │      │
    │      └── Story Workspace
    │             ├── Timeline
    │             ├── Scenes
    │             ├── Narration
    │             ├── Media
    │             ├── Preview
    │             └── Versions
    │
    ├── Legacy Profiles
    ├── Media Library
    ├── Templates
    ├── Render Queue
    ├── Analytics
    ├── Integrations
    └── Settings
```

---

# 20. Screen Rules

1. Every screen must have a single, clearly defined purpose.
2. Every screen should expose one primary action and a limited number of secondary actions.
3. Shared layouts and components must be reused across the application.
4. Every screen must support desktop, tablet, and mobile devices.
5. Every screen must define empty, loading, success, and error states.
6. All navigation must remain consistent with **APP_STRUCTURE.md**.
7. Global overlays must be managed exclusively through the shared Overlay Manager.
8. Story creation and editing screens should prioritize focus and minimize distractions.
9. CareerCanvas integration screens should clearly distinguish imported data from ReelLegacy-generated content.
10. Every screen should reinforce ReelLegacy's core mission: helping users transform personal, professional, and organizational stories into authentic, AI-assisted cinematic experiences through a clear, intuitive, and emotionally engaging interface.
