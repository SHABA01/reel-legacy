# DESIGN_SYSTEM.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** Design System Specification  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. Design Philosophy
3. Design Principles
4. Brand Identity
5. Color System
6. Typography
7. Spacing System
8. Grid & Layout System
9. Elevation & Shadows
10. Border Radius & Shapes
11. Iconography
12. Component Standards
13. Forms & Inputs
14. Motion System
15. Responsive Design
16. Accessibility Standards
17. Design Tokens
18. Shared Design Language with CareerCanvas
19. Future Design Expansion
20. Design Rules

---

# 1. Purpose

This document defines the visual language and reusable design standards that every interface within ReelLegacy must follow.

Its purpose is to ensure:

- Visual consistency
- Faster development
- Reusable UI components
- Better accessibility
- Easier collaboration
- Consistent AI-generated interfaces

This document is the single source of truth for all visual design decisions.

---

# 2. Design Philosophy

ReelLegacy should feel like a **professional cinematic storytelling studio**, not a traditional SaaS dashboard.

The experience should communicate:

- Emotion
- Legacy
- Creativity
- Professionalism
- Simplicity
- Trust
- Elegance
- Modern craftsmanship

The interface should quietly disappear behind the user's story.

Technology should support storytelling—not become the focus.

---

# 3. Design Principles

Every design decision should satisfy the following principles.

### Story First

Content always takes priority over decoration.

### Clarity

Users should immediately understand what to do next.

### Consistency

The same interactions should behave the same way everywhere.

### Simplicity

Reduce unnecessary visual noise.

### Familiarity

Common interface patterns should remain recognizable.

### Accessibility

Every feature should remain usable regardless of ability.

### Scalability

The design system should easily support future applications.

---

# 4. Brand Identity

The visual identity should reflect:

- Cinematic storytelling
- Personal history
- Professional presentation
- Timeless elegance

### Visual Personality

- Modern
- Premium
- Warm
- Minimal
- Confident
- Human-centered

Avoid designs that feel overly corporate, playful, or cluttered.

---

# 5. Color System

The palette should communicate trust, creativity, and warmth.

## Primary

Used for:

- Primary actions
- Links
- Active navigation
- Progress indicators

## Secondary

Used for:

- Supporting UI
- Secondary buttons
- Cards
- Section accents

## Accent

Used sparingly to highlight:

- Important actions
- AI features
- Story milestones
- Featured content

## Semantic Colors

Success

Warning

Error

Information

Each semantic color should maintain sufficient contrast in both light and dark themes.

Backgrounds should remain neutral to keep attention on user content.

---

# 6. Typography

Typography should be clean, readable, and documentary-inspired.

Hierarchy:

- Display
- Heading 1
- Heading 2
- Heading 3
- Heading 4
- Body Large
- Body
- Caption
- Label
- Helper Text

Text should prioritize readability over decoration.

Long-form storytelling should remain comfortable to read.

---

# 7. Spacing System

Use a consistent spacing scale throughout the application.

Spacing applies to:

- Layout margins
- Section spacing
- Cards
- Forms
- Navigation
- Lists
- Timelines
- Modals

Whitespace should create rhythm and reduce cognitive load.

Avoid inconsistent spacing between similar components.

---

# 8. Grid & Layout System

Desktop layouts should use a flexible multi-column grid.

Application layout consists of:

- Header
- Left Sidebar
- Main Content
- Optional Right Utility Panel

Content containers should maintain consistent maximum widths.

Layouts should gracefully adapt to tablet and mobile devices.

---

# 9. Elevation & Shadows

Elevation communicates hierarchy.

Use subtle shadows only when necessary.

Common elevated elements include:

- Cards
- Dialogs
- Dropdowns
- Floating panels
- Menus

Avoid excessive shadow depth.

The interface should feel lightweight rather than layered.

---

# 10. Border Radius & Shapes

Corners should remain consistent across the application.

Use rounded corners for:

- Cards
- Buttons
- Inputs
- Images
- Modals
- Badges
- Chips

Avoid mixing multiple corner styles.

Visual consistency should take priority.

---

# 11. Iconography

Icons should be:

- Simple
- Consistent
- Modern
- Easily recognizable

Icons should support—not replace—labels.

Decorative icons should be used sparingly.

Functional icons should maintain consistent sizing throughout the application.

---

# 12. Component Standards

Reusable components include:

- Buttons
- Inputs
- Cards
- Search Bars
- Navigation Items
- Story Cards
- Timeline Components
- Upload Zones
- Progress Bars
- Media Cards
- Tables
- Tabs
- Badges
- Chips
- Tooltips
- Drawers
- Modals
- Accordions
- Toast Notifications
- Skeleton Loaders

Every component should support:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error (where applicable)

Components should remain composable and reusable.

---

# 13. Forms & Inputs

Forms should minimize user effort.

Guidelines include:

- Clear labels
- Helpful placeholders
- Inline validation
- Immediate feedback
- Logical grouping
- Consistent spacing
- Accessible error messaging

Required fields should be clearly indicated.

Validation should help users recover quickly.

---

# 14. Motion System

Motion should communicate state changes rather than decorate the interface.

Examples include:

- Page transitions
- Sidebar expansion
- Modal animations
- Card hover effects
- Timeline interactions
- Drag-and-drop
- Progress updates
- Loading indicators
- Success feedback

Animations should feel smooth, subtle, and purposeful.

Avoid excessive or distracting movement.

---

# 15. Responsive Design

Every component should behave predictably across devices.

### Desktop

Full editing experience.

### Laptop

Compact layouts with preserved functionality.

### Tablet

Touch-first interaction.

Adaptive navigation.

### Mobile

Prioritize viewing, reviewing, and lightweight editing.

Collapse complex layouts into simpler vertical structures.

No functionality should be lost due to screen size.

---

# 16. Accessibility Standards

The design system must support:

- Keyboard navigation
- Visible focus indicators
- High color contrast
- Screen readers
- Semantic HTML
- Accessible forms
- Touch accessibility
- Scalable typography
- Motion sensitivity preferences

Accessibility should be built into every reusable component.

---

# 17. Design Tokens

All visual properties should be tokenized.

Examples include:

## Colors

- Primary
- Secondary
- Accent
- Background
- Surface
- Border
- Text

## Typography

- Font Family
- Font Sizes
- Font Weights
- Line Heights

## Spacing

- XS
- SM
- MD
- LG
- XL

## Radius

- Small
- Medium
- Large

## Elevation

- Low
- Medium
- High

## Motion

- Fast
- Standard
- Slow

Using tokens ensures consistency across all applications.

---

# 18. Shared Design Language with CareerCanvas

ReelLegacy should reuse the established CareerCanvas design language wherever appropriate.

Reuse directly:

- Header
- Sidebar
- Global Search
- Notification Center
- Overlay Manager
- Authentication Pages
- Theme System
- Grid System
- Responsive Layout
- Form Components
- Dialog Components
- Navigation Patterns

Customize for ReelLegacy:

- Dashboard
- Story Workspace
- Timeline
- Story Cards
- Legacy Profiles
- Narration Studio
- Media Library
- Rendering Queue

This shared design language creates consistency across the IdeaCodex Labs ecosystem while allowing each application to express its own identity.

---

# 19. Future Design Expansion

The design system should support future additions without requiring redesign.

Potential future capabilities include:

- Interactive timelines
- AI-generated visual themes
- Multi-brand support
- Enterprise branding
- Family workspace themes
- Public gallery themes
- Seasonal themes
- Additional accessibility profiles
- Motion presets
- Cross-platform design parity

Future enhancements should extend existing patterns rather than replace them.

---

# 20. Design Rules

The following rules are mandatory.

1. Story content always takes visual priority.
2. Reuse existing components before creating new ones.
3. Maintain consistent spacing, typography, and visual hierarchy.
4. Every component must support responsive layouts.
5. Every interactive component must support keyboard accessibility.
6. Only one visual language should exist across the application.
7. Motion should clarify interactions, not distract users.
8. Design tokens should be used for all reusable visual properties.
9. Shared CareerCanvas design patterns should be reused whenever appropriate.
10. Every design decision should reinforce ReelLegacy's mission of preserving and presenting meaningful stories through elegant, cinematic, AI-assisted experiences.

---

# PAGE_ARCHETYPES

## Purpose

Every major workspace in ReelLegacy must communicate a different mental model to the user.

Users should immediately understand **what kind of work they are doing** simply from the page layout before reading any labels.

No two major pages should feel like copies of each other.

This section defines the architectural identity ("Page Archetype") of every major workspace.

The purpose is not visual variety for its own sake.

The purpose is reducing cognitive load by ensuring every page matches the type of task being performed.

---

# Core Principle

A page is **not** designed around its data.

A page is designed around **the user's primary intention**.

Different intentions require different interaction models.

Examples:

- finding
- creating
- monitoring
- configuring
- learning
- reviewing
- collaborating

Each intention receives its own page archetype.

---

# Universal Layout Rules

These rules apply across the entire application.

## 1. One Navigation System

The global left navigation is the application's only permanent sidebar.

Pages must never introduce another permanent navigation sidebar.

Nested left sidebars create unnecessary hierarchy, reduce available workspace width, and compete with the primary navigation.

---

## 2. Context Instead of Navigation

If a page requires secondary controls, they should appear as one of the following:

- horizontal navigation tabs
- segmented controls
- filter chips
- toolbar actions
- expandable sections
- floating inspectors
- contextual drawers
- modal workflows

Never another navigation sidebar.

---

## 3. The Workspace Owns the Screen

Every page should maximize usable horizontal space.

Layouts should prioritize:

- content
- previews
- timelines
- editors
- grids
- analytics
- forms

Navigation should consume the smallest possible amount of space.

---

## 4. Every Page Has One Dominant Surface

Every workspace should have one clearly dominant interaction surface.

Examples:

Media Library → asset grid

Story Studio → canvas

Render Queue → pipeline list

Analytics → charts

Settings → forms

Notifications → feed

Help Center → documentation

Users should immediately know where their attention belongs.

---

## 5. Progressive Disclosure

Only show advanced controls when needed.

Never overwhelm users with every option simultaneously.

Complexity should appear gradually as work progresses.

---

# Archetype Definitions

Every page belongs to one or more archetypes.

These archetypes define layout, behavior, interaction patterns, and information hierarchy.

---

## Explorer

### Purpose

Help users discover, browse, compare, organize, and retrieve content.

### Primary User Question

> "Where is the thing I'm looking for?"

### Characteristics

- search first
- filtering
- sorting
- collections
- grouping
- metadata
- bulk actions
- previews

### Dominant UI

Large visual grid or organized list.

---

## Workspace

### Purpose

Support focused creation and editing.

### Primary User Question

> "How do I build something?"

### Characteristics

- editing
- drafting
- assembling
- manipulating
- iteration
- keyboard efficiency
- minimal distractions

### Dominant UI

Canvas, editor, or production workspace.

---

## Pipeline

### Purpose

Track work progressing through multiple stages.

### Primary User Question

> "What is happening now?"

### Characteristics

- queues
- stages
- progress
- statuses
- scheduling
- monitoring
- retries

### Dominant UI

Timeline, queue, or process list.

---

## Dashboard

### Purpose

Provide situational awareness.

### Primary User Question

> "What should I pay attention to?"

### Characteristics

- summaries
- recent activity
- KPIs
- shortcuts
- recommendations
- alerts

### Dominant UI

Cards and widgets.

---

## Library

### Purpose

Organize reusable knowledge or reusable assets.

### Primary User Question

> "What resources already exist?"

### Characteristics

- reusable
- categorized
- searchable
- reference-oriented
- reusable across projects

### Dominant UI

Collections and catalogs.

---

## Feed

### Purpose

Present chronological events requiring review or action.

### Primary User Question

> "What happened?"

### Characteristics

- newest first
- timestamps
- unread states
- actions
- event history

### Dominant UI

Vertical timeline.

---

## Configuration

### Purpose

Allow users to customize the application.

### Primary User Question

> "How do I make the application behave the way I want?"

### Characteristics

- preferences
- toggles
- forms
- account
- integrations
- security

### Dominant UI

Grouped settings panels.

---

## Knowledge

### Purpose

Teach users.

### Primary User Question

> "How do I accomplish this?"

### Characteristics

- guides
- tutorials
- documentation
- FAQs
- troubleshooting

### Dominant UI

Documentation portal.

---

## Search

### Purpose

Find anything from anywhere.

### Primary User Question

> "Take me directly to what I need."

### Characteristics

- global indexing
- commands
- universal search
- fuzzy matching
- keyboard driven

### Dominant UI

Search-first interface.

---

## Intelligence

### Purpose

Reveal insights rather than raw information.

### Primary User Question

> "What does this data mean?"

### Characteristics

- trends
- charts
- comparisons
- AI insights
- predictions
- recommendations

### Dominant UI

Analytics dashboards.

---

# Page Classification

| Page | Primary Archetype | Secondary Archetype |
|---------|-----------------|--------------------|
| Dashboard | Dashboard | Intelligence |
| Legacy Profiles | Library | Explorer |
| Story Library | Library | Explorer |
| Story Studio Landing | Dashboard | Workspace |
| Story Studio Workspace | Workspace | Pipeline |
| Media Library | Explorer | Library |
| Narration Studio | Workspace | Intelligence |
| Story Templates | Explorer | Library |
| Render Queue | Pipeline | Feed |
| Studio Analytics | Intelligence | Dashboard |
| Integrations | Configuration | Library |
| Global Search | Search | Explorer |
| Notifications | Feed | Dashboard |
| Help Center | Knowledge | Search |
| Settings | Configuration | Dashboard |

---

# Page Identity Specifications

## Dashboard

The dashboard is the command center.

It surfaces important information, recent work, recommendations, deadlines, AI suggestions, and shortcuts.

It should never become a workspace.

---

## Legacy Profiles

Legacy Profiles are a reusable collection of people.

Users browse, search, organize, and open profiles.

The page behaves like a professional CRM rather than a file explorer.

---

## Story Library

Story Library is the master repository of stories.

Unlike Media Library, users browse narrative entities instead of files.

Cards emphasize story metadata, collaborators, completion status, and timeline rather than thumbnails.

---

## Story Studio Landing

This page is a launchpad.

It helps users resume work, start new projects, or continue drafts.

It is intentionally lightweight.

---

## Story Studio Workspace

This is ReelLegacy's creative engine.

Everything exists to maximize uninterrupted creation.

Canvas space takes priority over navigation.

Panels appear only when relevant.

---

## Media Library

Media Library focuses on discovery and management of assets.

Large thumbnails dominate.

Filters and metadata are prominent.

Unlike Story Library, the emphasis is on files rather than narratives.

---

## Narration Studio

Narration Studio is an audio production workspace.

Waveforms, scripts, recording controls, AI narration, and voice editing become the primary interaction surfaces.

---

## Story Templates

Templates are reusable blueprints.

Unlike Story Library, templates emphasize starting points rather than completed work.

Preview quality is more important than metadata density.

---

## Render Queue

Render Queue visualizes production progress.

Users monitor jobs rather than edit content.

Status, progress, failures, priorities, and estimated completion dominate the interface.

---

## Studio Analytics

Analytics converts production activity into insights.

Charts, trends, comparisons, and AI-generated recommendations take priority over raw numbers.

---

## Integrations

Integrations manage external systems.

Each integration is presented as a capability card showing connection status, permissions, synchronization health, and configuration.

The page should evolve into an ecosystem management hub rather than a simple settings page.

---

## Global Search

Global Search is command-oriented.

Search begins immediately.

Results are grouped by entity type.

Keyboard navigation is first-class.

Users should be able to reach any object in the application within seconds.

---

## Notifications

Notifications function as an activity timeline.

Events are chronological.

Actions are immediate.

The emphasis is reviewing activity rather than reading messages.

---

## Help Center

Help Center functions as a documentation portal.

Search is always visible.

Guides, tutorials, FAQs, troubleshooting articles, and onboarding resources are organized by topic rather than chronology.

---

## Settings

Settings are purely configurational.

The page should feel calm, structured, and form-oriented.

Navigation inside Settings should use categories, tabs, or grouped sections—not an additional permanent sidebar.

---

# Differentiation Rules

Even when two pages share the same archetype, they must remain visually and behaviorally distinct.

| Shared Archetype | Differentiation |
|------------------|-----------------|
| Media Library vs Story Library | Files vs narratives |
| Story Library vs Templates | Completed work vs reusable blueprints |
| Dashboard vs Analytics | Operational awareness vs insight generation |
| Notifications vs Render Queue | Historical events vs active production processes |
| Help Center vs Global Search | Learning content vs direct retrieval |
| Settings vs Integrations | Internal application behavior vs external ecosystem management |

---

# Implementation Guidelines

When designing or refactoring any page, validate the following:

- Does the page clearly communicate its archetype within five seconds?
- Is there only one permanent navigation sidebar in the application?
- Does the page maximize workspace width?
- Does it have one dominant interaction surface?
- Does it prioritize the user's primary intention?
- Does it avoid duplicating another page's layout?
- Does it progressively reveal complexity instead of exposing everything immediately?

If any answer is "No", the page should be redesigned before implementation.

---

# Future Expansion

New pages introduced into ReelLegacy must first be assigned one or more page archetypes before any UI work begins.

Layout decisions should emerge from the assigned archetype rather than from copying an existing page.

This ensures ReelLegacy grows as a coherent design system rather than as a collection of unrelated screens.
