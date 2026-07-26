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

---

# CONTEXT_PANEL_ARCHITECTURE

## Purpose

The Global Context Panel is **not** a permanent structural element of every page.

It is an adaptive workspace that provides additional information, tools, intelligence, and actions only when doing so improves the user's current task.

Pages should **opt into** the Context Panel based on their functional requirements rather than inheriting it automatically.

This prevents redundant UI, maximizes usable workspace, and ensures every page remains focused on its primary purpose.

---

# Core Principle

The Context Panel exists to answer one question:

> **"What additional information or tools would help the user complete their current task?"**

If the answer is **nothing**, then the page should not display the Context Panel.

The panel should never exist simply because other pages have one.

---

# Design Philosophy

The Context Panel is an **Adaptive Context Workspace**, not a permanent sidebar.

Unlike the Global Navigation Sidebar—which exists everywhere because navigation is universal—the Context Panel exists only when contextual assistance provides meaningful value.

This distinction keeps ReelLegacy clean, intentional, and scalable.

---

# Context Modes

Every page must explicitly declare one of three Context Modes.

---

## Required

The Context Panel is an essential part of the workflow.

The page depends on contextual tools, metadata, AI assistance, inspectors, or editing controls.

The panel should be visible by default, while still allowing the user to collapse it if desired.

Typical content includes:

- AI Director
- Metadata
- Selected object properties
- Scene inspector
- Timeline intelligence
- Voice analysis
- Asset metadata
- Collaboration
- Related objects
- AI recommendations

---

## Optional

The page functions perfectly without the Context Panel.

However, users may occasionally need additional contextual information.

The panel should remain hidden by default and only appear when explicitly opened.

Typical content includes:

- Story summaries
- Relationship information
- Render logs
- AI recommendations
- Linked resources
- Historical information
- Activity details

---

## None

The page should never display the Context Panel.

The available horizontal space is significantly more valuable for the page's primary purpose.

Any additional information should instead appear through:

- modal dialogs
- expandable cards
- inline detail panels
- overlays
- drawers
- tooltips

rather than a permanent contextual workspace.

---

# Context Mode Classification

| Page | Context Mode | Reason |
|------|--------------|--------|
| Dashboard | Optional | AI insights and activity are useful but not required. |
| Legacy Profiles | Optional | Profile relationships and linked stories can be inspected on demand. |
| Story Library | Optional | Metadata and story summaries are secondary to browsing. |
| Story Studio Landing | None | Landing page should remain lightweight and action-oriented. |
| Story Studio Workspace | Required | Editing requires continuous contextual intelligence and production controls. |
| Media Library | Required | Selected asset metadata and AI analysis are central to media management. |
| Narration Studio | Required | Voice properties, pronunciation, waveform analysis, and AI guidance require continuous context. |
| Story Templates | Required | Template metadata, structure, requirements, and AI recommendations support template selection. |
| Render Queue | Optional | Render diagnostics and export logs are occasionally useful but not constantly needed. |
| Studio Analytics | None | Charts and visualizations should maximize screen real estate. |
| Integrations | None | Configuration and connection management benefit from wider layouts rather than contextual panels. |
| Advanced Search | None | Search results should utilize the full workspace width. |
| Notifications Center | None | Activity feeds should maximize readability and scanning speed. |
| Help Center | None | Documentation should prioritize reading comfort and content width. |
| Settings | None | Configuration forms require uninterrupted horizontal space. |

---

# Page Categories

## Category A — Context-Driven Workspaces

These pages require continuous contextual assistance while users actively create or edit content.

The Context Panel is considered part of the production workflow.

### Pages

- Story Studio Workspace
- Media Library
- Narration Studio
- Story Templates

### Typical Context

- AI Director
- Selected Item Inspector
- Metadata
- Story Intelligence
- Scene Properties
- Voice Analysis
- Asset Intelligence
- Collaboration
- Timeline Intelligence
- Related Objects

---

## Category B — Context-Enhanced Pages

These pages benefit from contextual information, but only when users explicitly request it.

The panel should remain hidden until opened.

### Pages

- Dashboard
- Legacy Profiles
- Story Library
- Render Queue

### Typical Context

- Story Summary
- Relationship Graph
- AI Suggestions
- Render Diagnostics
- Linked Stories
- Historical Timeline
- Activity Details

---

## Category C — Context-Free Pages

These pages should never allocate permanent screen space to the Context Panel.

Their layouts should maximize focus on their primary interaction model.

### Pages

- Story Studio Landing
- Studio Analytics
- Integrations
- Advanced Search
- Notifications Center
- Help Center
- Settings

### Alternative UI Patterns

Instead of the Context Panel, these pages should use:

- Inline expansion panels
- Modal dialogs
- Side drawers
- Floating overlays
- Tooltips
- Popovers
- Detail cards

This preserves workspace width while still allowing advanced interactions when necessary.

---

# Workspace Classification

Not every page represents the same kind of environment.

ReelLegacy distinguishes between **Page Workspaces** and **Global Utilities**.

This distinction determines how much interface complexity is appropriate.

---

## Page Workspaces

Page Workspaces are environments where users actively create, edit, organize, review, or produce content.

These pages prioritize productivity and frequently benefit from contextual assistance.

### Characteristics

- Long-duration user sessions
- High interaction density
- Frequent editing
- AI-assisted workflows
- Rich object selection
- Context-sensitive controls
- Production-oriented layouts

### Pages

- Story Studio Workspace
- Story Studio Landing
- Media Library
- Narration Studio
- Story Templates
- Render Queue
- Story Library
- Legacy Profiles

---

## Global Utilities

Global Utilities support the application itself rather than the creative production process.

They are task-focused rather than workspace-focused.

These pages should remain lightweight, uncluttered, and efficient.

### Characteristics

- Short interaction sessions
- Administrative tasks
- Configuration
- Search
- Learning
- Monitoring
- Navigation support

### Pages

- Dashboard
- Studio Analytics
- Integrations
- Advanced Search
- Notifications Center
- Help Center
- Settings

---

# Layout Rules by Classification

## Page Workspaces

Page Workspaces may use:

- Context Panel
- Floating inspectors
- Canvas layouts
- Timeline interfaces
- Multi-pane editing
- AI assistance
- Production toolbars

The interface should optimize for uninterrupted creative work.

---

## Global Utilities

Global Utilities should prioritize:

- Simplicity
- Readability
- Discoverability
- Speed
- Full-width layouts
- Minimal visual complexity

They should avoid introducing unnecessary workspace chrome or persistent contextual panels.

---

# Design Rules

When designing any new page, answer the following questions before implementation:

1. Is this page a **Workspace** or a **Global Utility**?
2. Does the user actively create or simply consume/configure information?
3. Would contextual assistance genuinely improve task completion?
4. If yes, should that assistance be **Required** or **Optional**?
5. If no, can the same functionality be delivered through inline components, overlays, or dialogs instead?

Only after these questions are answered should the page layout be designed.

---

# Future Expansion

Every new page introduced into ReelLegacy must declare:

- Its Page Archetype(s)
- Its Workspace Classification (Workspace or Global Utility)
- Its Context Mode (Required, Optional, or None)

These three declarations become mandatory architectural metadata before any UI or implementation work begins.

This ensures that every future page integrates consistently into the ReelLegacy Design System while preventing unnecessary UI duplication, preserving workspace efficiency, and maintaining a coherent user experience across the platform.
