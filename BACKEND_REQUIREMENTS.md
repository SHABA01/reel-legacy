# BACKEND_REQUIREMENTS.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** Backend Engineering Requirements  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. Backend Philosophy
3. Backend Responsibilities
4. Technology Principles
5. API Design Standards
6. Service Architecture
7. AI Orchestration Layer
8. Data Management
9. Authentication & Authorization
10. Media Processing Services
11. Integration Services
12. Background Jobs & Queues
13. Notifications & Events
14. Error Handling & Logging
15. Performance Requirements
16. Security Requirements
17. Testing Requirements
18. Deployment Readiness
19. Future Scalability
20. Backend Rules

---

# 1. Purpose

This document defines the functional and architectural requirements for the ReelLegacy backend.

It serves as the implementation guide for:

- Google Antigravity
- Human Backend Engineers
- Future AI Coding Agents

The backend is responsible for business logic, AI orchestration, integrations, security, persistence, and long-running processing.

The frontend should never contain business logic that belongs here.

---

# 2. Backend Philosophy

The backend should be:

- API-first
- Modular
- Scalable
- Secure
- Stateless where practical
- Event-driven where beneficial
- AI-native
- Framework-independent
- Easily testable
- Easy to extend

Business rules should exist only once.

Avoid duplicated logic.

---

# 3. Backend Responsibilities

The backend owns:

- Authentication
- Authorization
- User management
- Legacy Profile management
- Story management
- Timeline generation
- Scene management
- Media management
- AI orchestration
- Rendering orchestration
- Notifications
- Search
- Analytics
- Integrations
- File processing
- Background jobs
- Audit logging

The backend is the single source of truth for application data.

---

# 4. Technology Principles

The backend will be generated and maintained primarily using **Google Antigravity**.

Implementation should remain technology-agnostic wherever practical.

Core principles include:

- Layered architecture
- Service-oriented design
- Dependency inversion
- Strong typing
- Configuration-driven behavior
- Environment isolation
- Versioned APIs

Business logic should never depend directly on frontend implementation details.

---

# 5. API Design Standards

All APIs should follow consistent conventions.

Requirements include:

- RESTful resource naming
- Predictable endpoint structure
- Versioned APIs
- JSON request/response formats
- Standard HTTP status codes
- Pagination for collections
- Filtering
- Sorting
- Search support
- Consistent validation responses

Example resource groups:

- `/auth`
- `/users`
- `/profiles`
- `/stories`
- `/scenes`
- `/timeline`
- `/media`
- `/render`
- `/templates`
- `/integrations`
- `/notifications`
- `/analytics`

---

# 6. Service Architecture

Business logic should be organized into focused services.

Examples include:

- Authentication Service
- User Service
- Legacy Profile Service
- Story Service
- Timeline Service
- Scene Service
- Media Service
- Narration Service
- Rendering Service
- Notification Service
- Search Service
- Analytics Service
- Integration Service

Services should communicate through defined interfaces rather than direct implementation coupling.

---

# 7. AI Orchestration Layer

AI functionality should be coordinated through a dedicated orchestration layer.

Example AI services include:

- Biography Generator
- Story Generator
- Timeline Builder
- Resume Interpreter
- Scene Generator
- Narration Generator
- Voice Recommendation
- Script Editor
- Media Analyzer
- Metadata Extractor

The orchestration layer should:

- Select appropriate AI models
- Manage prompts
- Handle retries
- Validate outputs
- Apply safety checks
- Track AI usage
- Log AI operations

Individual business services should never communicate directly with AI providers.

---

# 8. Data Management

Backend services should manage:

- Structured application data
- Metadata
- Relationships
- User preferences
- Rendering history
- Integration mappings

Uploaded media should remain separate from structured database records.

Soft deletion should be preferred where recovery is valuable.

All critical changes should be auditable.

---

# 9. Authentication & Authorization

Support:

- Email/password authentication
- OAuth providers
- Password reset
- Email verification
- Session management
- Token refresh
- Multi-device sessions (future)

Authorization should use role-based access control.

Example roles:

- User
- Collaborator
- Administrator

Future enterprise roles should integrate without architectural changes.

---

# 10. Media Processing Services

Media uploads should execute asynchronously.

Processing pipeline:

1. Upload
2. Validation
3. Virus/security checks
4. Metadata extraction
5. Thumbnail generation
6. AI analysis
7. Storage
8. Story association

Supported media types include:

- Images
- Videos
- Audio
- Documents
- Certificates
- CVs
- PDFs
- Presentation files

Media processing should never block user interaction.

---

# 11. Integration Services

Every external system should have its own integration module.

Initial integrations include:

- CareerCanvas
- LinkedIn
- GitHub
- Google Drive
- Google Photos
- Dropbox
- OneDrive

Each integration should contain:

- Authentication manager
- API adapter
- Data mapper
- Synchronization logic
- Import/export handlers
- Retry mechanisms
- Error handling

Integrations should be replaceable without affecting the core application.

---

# 12. Background Jobs & Queues

Long-running operations should execute through background workers.

Examples include:

- Video rendering
- AI generation
- Media analysis
- Thumbnail generation
- Synchronization
- Notification delivery
- Analytics processing
- Scheduled tasks

Every background job should support:

- Retry
- Cancellation
- Progress tracking
- Failure reporting
- Logging

---

# 13. Notifications & Events

The backend should publish domain events for important actions.

Examples include:

- Story created
- Story updated
- Render started
- Render completed
- AI generation completed
- Collaboration invited
- Media uploaded
- Integration completed

Events should drive notifications without tightly coupling unrelated services.

---

# 14. Error Handling & Logging

Errors should be:

- Logged
- Categorized
- Traceable
- User-friendly

Logging should include:

- API requests
- Authentication events
- AI interactions
- Rendering operations
- Integration failures
- Background job failures
- Security events

Sensitive information must never be exposed in logs.

---

# 15. Performance Requirements

The backend should optimize for:

- Fast API responses
- Efficient database access
- Minimal redundant queries
- Intelligent caching
- Parallel processing where appropriate
- Lazy loading
- Efficient media handling

Heavy workloads should execute asynchronously.

Performance should remain predictable as the platform grows.

---

# 16. Security Requirements

Security requirements include:

- Secure authentication
- Role-based authorization
- Input validation
- Output sanitization
- File validation
- Rate limiting
- Encryption in transit
- Secure secret management
- Audit trails
- Abuse prevention

User-generated stories and personal memories should be treated as highly sensitive information.

---

# 17. Testing Requirements

Backend implementation should support:

- Unit tests
- Integration tests
- API tests
- Service tests
- Authorization tests
- AI orchestration tests
- Integration tests for external providers
- Background job testing

Business logic should remain independently testable.

---

# 18. Deployment Readiness

The backend should support:

- Environment-based configuration
- Development
- Testing
- Staging
- Production

Configuration should never be hardcoded.

Secrets should always be externally managed.

Deployment should be repeatable and automated where possible.

---

# 19. Future Scalability

The backend should be designed to support future capabilities including:

- Team workspaces
- Family workspaces
- Enterprise organizations
- Public documentary galleries
- AI provider abstraction
- Multi-language narration
- Mobile applications
- Desktop applications
- Plugin architecture
- Additional IdeaCodex ecosystem integrations

Future expansion should require adding new services rather than rewriting existing ones.

---

# 20. Backend Rules

The following rules are mandatory.

1. The backend is the single source of truth.
2. Business logic must never exist in the frontend.
3. Every feature should belong to a dedicated service.
4. AI providers must be accessed only through the AI Orchestration Layer.
5. Long-running operations must execute asynchronously.
6. Every external platform must communicate through an Integration Service.
7. APIs must remain versioned, documented, and consistent.
8. Security and privacy take precedence over convenience.
9. Services should remain modular, loosely coupled, and independently testable.
10. Every backend decision should support ReelLegacy's long-term vision of becoming a scalable, AI-powered cinematic storytelling platform while remaining compatible with the broader IdeaCodex Labs ecosystem.
