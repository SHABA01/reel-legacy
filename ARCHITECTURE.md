# ARCHITECTURE.md

**Project:** ReelLegacy

**Version:** 1.1.0

**Status:** Technical Architecture Specification

**Owner:** IdeaCodex Labs

**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. Architectural Goals
3. High-Level System Architecture
4. Development Stack
5. System Layers
6. Core Application Modules
7. Frontend Architecture
8. Backend Architecture
9. AI Services Architecture
10. Data Architecture
11. Media Processing Pipeline
12. Integration Architecture
13. Authentication & Authorization
14. Communication Flow
15. Relationship with CareerCanvas
16. Project Structure
17. Scalability Strategy
18. Security Principles
19. Development Principles
20. Architecture Rules

---

# 1. Purpose

This document defines the overall technical architecture of ReelLegacy.

It establishes how the application is organized, how its components communicate, and the responsibilities of each architectural layer.

This document intentionally focuses on **system organization**, while implementation details are documented elsewhere.

Every contributor—human or AI—should follow this architecture unless a newer approved version supersedes it.

---

# 2. Architectural Goals

The architecture should always be:

- Modular
- Scalable
- Maintainable
- API-first
- AI-native
- Cloud-ready
- Secure by default
- Component-driven
- Loosely coupled
- Easily extensible

Each module should have a single responsibility and remain independently maintainable.

---

# 3. High-Level System Architecture

```
                    Users
                      │
                      ▼
     Frontend Application
    (Google AI Studio)
                      │
                      ▼
        Backend Services
     (Google Antigravity)
                      │
     ┌─────────┬──────────┬──────────┐
     ▼         ▼          ▼
Business    AI Layer   Integrations
 Logic
     │
     ▼
Database & Cloud Storage
     │
     ▼
External APIs & Services
```

The frontend handles presentation and user interaction.

The backend owns business logic, AI orchestration, integrations, authentication, rendering, and persistence.

---

# 4. Development Stack

## Product Planning

- ChatGPT

## Documentation

- ChatGPT

## Frontend Development

- Google AI Studio

## Backend Development

- Google Antigravity

## Code Review (Optional)

- GitHub Copilot

## Future Collaboration

- Human Developers

Each tool has a clearly defined responsibility and should not replace another tool's role.

---

# 5. System Layers

The application is organized into six logical layers.

### Presentation Layer

Responsible for rendering the user interface and handling user interactions.

---

### Application Layer

Coordinates workflows between the interface and backend.

---

### Business Layer

Contains business rules and domain logic.

---

### AI Layer

Coordinates AI-powered services.

---

### Data Layer

Handles persistence, storage, and retrieval.

---

### Integration Layer

Communicates with external platforms and APIs.

Each layer should communicate only through well-defined interfaces.

---

# 6. Core Application Modules

The platform consists of independent feature modules.

- Authentication
- Dashboard
- Legacy Profiles
- Story Library
- Story Workspace
- Timeline
- Media Library
- Narration
- AI Story Assistant
- Templates
- Rendering Queue
- Publishing
- Search
- Notifications
- Integrations
- Settings

Every module should own its UI, services, models, and API interactions.

---

# 7. Frontend Architecture

The frontend is developed using **Google AI Studio** and is responsible for:

- Rendering user interfaces
- Responsive layouts
- Client-side routing
- Component composition
- Theme management
- Accessibility
- State management
- Local caching
- Form validation
- API communication

The frontend should remain presentation-focused.

Business rules must remain in the backend.

Reusable UI components should be shared across the application.

---

# 8. Backend Architecture

The backend is developed using **Google Antigravity**.

Responsibilities include:

- Authentication
- Authorization
- User management
- Story management
- Timeline generation
- Rendering orchestration
- AI orchestration
- Media processing
- Notifications
- Integration management
- Data validation
- Background jobs
- File management

The backend is the single source of truth.

---

# 9. AI Services Architecture

AI functionality should be organized into specialized services.

Examples include:

- Story Generator
- Timeline Generator
- Biography Generator
- Resume Interpreter
- Career Story Generator
- Scene Generator
- Narration Generator
- Voice Recommendation
- Script Editor
- Media Analyzer
- Metadata Extractor
- CareerCanvas Import Assistant

Each AI service should expose a consistent internal interface, allowing future model changes without affecting the rest of the system.

---

# 10. Data Architecture

Core entities include:

- User
- Legacy Profile
- Story
- Scene
- Timeline Event
- Media Asset
- Narration
- Template
- Render Job
- Integration
- Notification

Structured data should remain independent from uploaded media assets.

Relationships should prioritize maintainability and future scalability.

---

# 11. Media Processing Pipeline

Media processing should execute asynchronously.

```
Upload

↓

Validation

↓

Metadata Extraction

↓

Storage

↓

Thumbnail Generation

↓

AI Analysis

↓

Story Association

↓

Rendering Queue
```

Long-running operations must never block the user interface.

---

# 12. Integration Architecture

Every external platform communicates through dedicated integration services.

Examples include:

- CareerCanvas
- LinkedIn
- GitHub
- Google Drive
- Google Photos
- Dropbox
- OneDrive

Each integration should include:

- Authentication handler
- API adapter
- Data mapper
- Synchronization service
- Error handling

UI components must never communicate directly with external APIs.

---

# 13. Authentication & Authorization

Authentication should support:

- Email & Password
- OAuth providers
- Session management
- Password reset
- Email verification

Authorization should use role-based permissions.

Example roles:

- User
- Collaborator
- Administrator

Future enterprise roles should be easily added.

---

# 14. Communication Flow

```
User

↓

Frontend (Google AI Studio)

↓

API Client

↓

Backend Endpoint (Google Antigravity)

↓

Business Service

↓

AI Service (Optional)

↓

Database

↓

Response

↓

Frontend Update
```

Communication between modules should always occur through documented APIs.

---

# 15. Relationship with CareerCanvas

CareerCanvas and ReelLegacy are independent applications within the IdeaCodex Labs ecosystem.

Shared concepts include:

- Authentication
- Design language
- Component philosophy
- Search architecture
- Notification architecture
- Overlay architecture
- API conventions

Communication should occur through secure, versioned APIs.

Possible integrations include:

- Import Career Timeline
- Import Resume
- Import Portfolio Projects
- Import Certifications
- Export Career Documentary
- Embed ReelLegacy documentaries inside CareerCanvas

Neither application should depend on the other for core functionality.

---

# 16. Project Structure

```
src/

├── app/
├── pages/
├── layouts/
├── modules/
├── components/
├── services/
├── hooks/
├── context/
├── types/
├── utils/
├── assets/
├── styles/
├── config/
└── integrations/
```

Feature modules should remain self-contained whenever practical.

---

# 17. Scalability Strategy

The architecture should support future growth through:

- Feature modules
- Service abstraction
- AI provider abstraction
- Background jobs
- Lazy loading
- Code splitting
- Reusable components
- Integration adapters
- Shared services

New capabilities should primarily be added by extending modules rather than rewriting existing architecture.

---

# 18. Security Principles

Security considerations include:

- Secure authentication
- Authorization enforcement
- Input validation
- Secure uploads
- API rate limiting
- Encryption in transit
- Secure storage
- Audit logging
- Privacy-first data handling

Personal memories, biographies, and documentary assets should always be treated as sensitive user-owned data.

---

# 19. Development Principles

Every contributor should follow these principles:

- Documentation-first development
- Architecture before implementation
- Component reuse before duplication
- Separation of concerns
- Strong typing
- Consistent naming
- Small, focused modules
- Backward compatibility where practical
- Testability
- AI-assisted, human-reviewed development

Implementation should always follow the uploaded Markdown documentation rather than assumptions made by AI tools.

---

# 20. Architecture Rules

The following rules are mandatory.

1. Business logic belongs exclusively in the backend.
2. Frontend components remain presentation-focused.
3. AI services must be modular.
4. External systems communicate only through integration services.
5. Shared functionality should be reused rather than duplicated.
6. Every module should have a single clear responsibility.
7. Long-running operations must execute asynchronously.
8. APIs should remain documented and versioned.
9. ReelLegacy and CareerCanvas communicate only through documented APIs.
10. All architectural decisions should support ReelLegacy's mission of AI-assisted cinematic storytelling while remaining scalable, maintainable, and adaptable for future growth.
