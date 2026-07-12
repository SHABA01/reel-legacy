# UI_SPEC.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** User Interface & User Experience Specification  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. UI Philosophy
3. Design Goals
4. Responsive Strategy
5. Global Application Layout
6. Navigation System
7. Landing Experience
8. Authentication Experience
9. Dashboard
10. Story Workspace
11. Feature Pages
12. Shared UI Components
13. Overlay System
14. AI Assistant Experience
15. Motion & Interaction Design
16. Accessibility Standards
17. Empty, Loading & Error States
18. Visual Consistency Rules
19. UI Reuse Strategy with CareerCanvas
20. UI Rules

---

# 1. Purpose

This document defines the visual structure, interaction patterns, navigation principles, and user experience standards for ReelLegacy.

It serves as the primary UI reference for:

- Google AI Studio
- Human Frontend Engineers
- UI/UX Designers
- Future Contributors

This document explains **what the interface should look and feel like**, while implementation details belong elsewhere.

---

# 2. UI Philosophy

ReelLegacy should feel like a creative storytelling studio rather than traditional productivity software.

The interface should communicate:

- Creativity
- Elegance
- Professionalism
- Emotional warmth
- Simplicity
- Focus
- Confidence

Users should feel they are directing a documentary instead of filling out forms.

The interface should encourage storytelling while minimizing cognitive load.

---

# 3. Design Goals

The UI should always be:

- Modern
- Minimal
- Cinematic
- Highly visual
- Consistent
- Accessible
- Fast
- Responsive
- Modular
- Reusable

Every page should prioritize storytelling over configuration.

Primary actions should always be visually emphasized.

---

# 4. Responsive Strategy

The application should support:

## Desktop

Primary editing experience.

Multi-column layouts.

Persistent sidebar.

Optional right utility panel.

Large preview areas.

---

## Laptop

Slightly compressed layouts.

Collapsible side panels.

Reduced spacing where appropriate.

---

## Tablet

Responsive grids.

Collapsible navigation.

Single-column editing where needed.

Touch-optimized controls.

---

## Mobile

Story viewing and light editing.

Bottom navigation where appropriate.

Stacked layouts.

Drawer-based menus.

Large touch targets.

Simplified workspace.

---

# 5. Global Application Layout

The authenticated application should use a consistent shell.

```
App Header

──────────────────────────────────────────────

Sidebar

│

│      Main Content Area

│

│

Right Utility Panel (Optional)
```

The layout should remain consistent throughout the application.

Only the content area should change between pages.

---

# 6. Navigation System

Primary navigation should include:

- Dashboard
- Story Library
- Story Workspace
- Legacy Profiles
- Timeline
- Media Library
- Narration
- Templates
- Rendering Queue
- Integrations
- Notifications
- Settings

Navigation should remain predictable.

Users should never lose awareness of where they are.

Breadcrumbs should be used where appropriate.

---

# 7. Landing Experience

The landing page should communicate storytelling before technology.

Primary sections include:

- Hero
- Features
- Story Types
- How It Works
- AI Capabilities
- Testimonials
- Pricing (future)
- FAQ
- Call-to-Action
- Footer

The hero section should immediately answer:

"What can ReelLegacy create for me?"

The landing page should encourage exploration rather than information overload.

---

# 8. Authentication Experience

Authentication screens should closely follow the shared authentication patterns established in CareerCanvas.

Supported screens include:

- Login
- Register
- Forgot Password
- Reset Password
- Email Verification

The experience should remain simple, familiar, and distraction-free.

Authentication pages should maintain the application's cinematic branding while minimizing unnecessary visual complexity.

---

# 9. Dashboard

The Dashboard serves as the user's production home.

Primary widgets include:

- Continue Editing
- Recent Stories
- Story Statistics
- Rendering Queue
- AI Suggestions
- Recent Activity
- Storage Usage
- Quick Actions
- Notifications
- Upcoming Milestones

The dashboard should immediately answer:

"What should I work on next?"

---

# 10. Story Workspace

The Story Workspace is the primary production environment.

Major areas include:

- Story Header
- Story Timeline
- Scene List
- Preview Player
- Scene Editor
- Properties Panel
- AI Assistant
- Version History

This should become the most powerful and feature-rich page in the application.

Users should spend most of their time here.

---

# 11. Feature Pages

Core pages include:

- Story Library
- Legacy Profiles
- Timeline
- Media Library
- Voice Library
- Narration
- Templates
- Rendering Queue
- Integrations
- Search
- Notifications
- Settings

Each page should follow the same layout principles while remaining optimized for its specific purpose.

---

# 12. Shared UI Components

Reusable components include:

- Buttons
- Cards
- Forms
- Inputs
- Search Bars
- Tables
- Timelines
- Upload Areas
- Media Cards
- Story Cards
- Progress Indicators
- Tags
- Badges
- Dropdowns
- Tabs
- Accordions
- Modals
- Drawers
- Toast Notifications
- Tooltips
- Empty States
- Skeleton Loaders

Components should remain consistent across all modules.

Existing CareerCanvas components should be reused wherever appropriate.

---

# 13. Overlay System

ReelLegacy should reuse the shared overlay architecture introduced in CareerCanvas.

Only one global overlay may remain open at any time.

Supported overlays include:

- AI Assistant
- Global Search
- Notifications
- Help Center (future)

Opening one overlay should automatically close any previously opened global overlay.

Modal dialogs remain independent from the overlay system.

---

# 14. AI Assistant Experience

The AI Assistant should function as a creative collaborator.

Capabilities include:

- Story brainstorming
- Biography drafting
- Timeline generation
- Scene suggestions
- Narration generation
- Career story generation
- Writing improvement
- Story restructuring
- Missing information detection

The assistant should explain suggestions instead of silently changing content.

Users should always approve AI-generated changes.

---

# 15. Motion & Interaction Design

Animations should feel smooth, purposeful, and subtle.

Examples include:

- Page transitions
- Modal animations
- Sidebar expansion
- Card hover elevation
- Timeline animations
- Upload progress
- Rendering progress
- Skeleton loading
- Button feedback
- Drag-and-drop interactions

Motion should enhance understanding rather than distract users.

---

# 16. Accessibility Standards

The interface should follow accessibility best practices.

Requirements include:

- Keyboard navigation
- Screen reader compatibility
- Proper semantic structure
- High color contrast
- Visible focus indicators
- Responsive typography
- Adequate touch targets
- Accessible forms
- Alternative text for media

Accessibility should be considered during initial implementation—not added later.

---

# 17. Empty, Loading & Error States

Every page should define meaningful states.

## Empty

Guide users toward the next logical action.

Example:

"No stories yet. Create your first documentary."

---

## Loading

Use skeleton loaders where possible.

Provide progress indicators for long-running operations.

---

## Error

Display human-friendly messages.

Offer retry actions whenever possible.

Avoid exposing technical details to end users.

---

# 18. Visual Consistency Rules

Every screen should maintain consistency in:

- Typography
- Colors
- Spacing
- Iconography
- Shadows
- Border radius
- Card layouts
- Navigation
- Component sizing
- Motion language

Users should immediately recognize they are still inside the ReelLegacy ecosystem regardless of which page they are using.

---

# 19. UI Reuse Strategy with CareerCanvas

To maximize consistency and development speed, ReelLegacy should reuse proven UI patterns from CareerCanvas whenever they align with the storytelling experience.

## Reuse Without Modification

- Authentication pages
- Application shell
- Header
- Sidebar framework
- Notification system
- Search architecture
- Overlay manager
- Theme system
- Responsive grid system
- Shared UI components
- Accessibility patterns

## Reuse With Modification

- Dashboard
- Profile pages (becoming Legacy Profiles)
- Media Manager
- Settings
- AI Assistant
- Analytics

## Replace Completely

- Portfolio
- Resume Builder
- Projects
- Experience
- Education
- Skills
- Certifications

These should become storytelling-focused experiences such as Story Library, Story Workspace, Timeline, Narration, and Legacy Profiles.

This strategy reduces development effort while maintaining a consistent user experience across the IdeaCodex Labs ecosystem.

---

# 20. UI Rules

The following rules are mandatory.

1. Storytelling always takes precedence over data entry.
2. Every page must have a clear primary action.
3. The application shell must remain consistent across authenticated pages.
4. Shared components should always be reused before creating new ones.
5. Responsive behavior must be considered during initial implementation.
6. Every page must support empty, loading, success, and error states.
7. Only one global overlay may be open at a time.
8. AI suggestions must always require user approval before altering content.
9. Interfaces should remain clean, focused, and emotionally engaging.
10. Every UI decision should reinforce ReelLegacy's purpose: helping users preserve, create, and share meaningful stories through AI-assisted cinematic experiences.
