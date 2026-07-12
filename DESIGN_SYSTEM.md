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
