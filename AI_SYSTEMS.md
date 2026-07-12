# AI_SYSTEMS.md

**Project:** ReelLegacy  
**Version:** 1.0.0  
**Status:** AI Systems Specification  
**Owner:** IdeaCodex Labs  
**Last Updated:** July 2026

---

# Table of Contents

1. Purpose
2. AI Philosophy
3. AI Architecture
4. AI Development Stack
5. AI Orchestrator
6. Core AI Systems
7. AI Workflow
8. Prompt Engineering Standards
9. Context & Memory Management
10. AI Safety & Guardrails
11. Human-in-the-Loop
12. CareerCanvas Integration
13. AI Performance & Monitoring
14. Model Abstraction
15. Future AI Capabilities
16. AI Engineering Principles
17. AI Security & Privacy
18. AI Limitations
19. Contributor Guidelines
20. AI Rules

---

# 1. Purpose

This document defines every Artificial Intelligence system used within ReelLegacy.

Its objectives are to:

- Define AI responsibilities.
- Standardize AI behavior.
- Prevent duplicated AI functionality.
- Ensure maintainability.
- Keep AI implementation independent from any single model provider.
- Provide a reference for Google Antigravity, Google AI Studio, ChatGPT, and future contributors.

---

# 2. AI Philosophy

Artificial Intelligence exists to **assist storytelling**, not replace human creativity.

Every AI feature should:

- Reduce repetitive work.
- Improve storytelling quality.
- Help users organize memories.
- Accelerate production.
- Explain its reasoning when appropriate.
- Keep users in complete control.

AI must never become the final authority over a person's life story.

---

# 3. AI Architecture

All AI functionality should pass through a centralized orchestration layer.

```
User

↓

Frontend (Google AI Studio)

↓

Backend API

↓

AI Orchestrator

↓

Specialized AI Services

↓

AI Provider Layer

↓

Response

↓

User Review
```

No module should communicate directly with an AI provider.

---

# 4. AI Development Stack

The project uses specialized AI tools during development.

## Product Planning

- ChatGPT

## Documentation

- ChatGPT

## Frontend Development

- Google AI Studio

## Backend Development

- Google Antigravity

## Code Review

- GitHub Copilot (Optional)

These tools assist development and are separate from the AI systems that power the ReelLegacy application itself.

---

# 5. AI Orchestrator

The AI Orchestrator coordinates every AI request.

Responsibilities include:

- Selecting the appropriate AI service.
- Managing prompts.
- Injecting project context.
- Managing retries.
- Handling failures.
- Logging AI requests.
- Validating AI responses.
- Applying safety checks.
- Tracking AI usage.
- Managing provider selection.

The orchestrator should expose a single internal interface for all AI-powered features.

---

# 6. Core AI Systems

ReelLegacy consists of multiple specialized AI systems rather than one monolithic assistant.

## Biography Generator

Generates structured biographies from user data.

---

## Story Generator

Creates complete documentary story drafts.

---

## Timeline Builder

Builds chronological life timelines.

---

## Scene Generator

Breaks stories into cinematic scenes.

---

## Narration Generator

Creates natural documentary narration.

---

## Resume Interpreter

Transforms CVs and resumes into narrative career stories.

---

## Career Documentary Generator

Converts professional history into cinematic career documentaries.

---

## Media Analyzer

Analyzes uploaded photos, videos, and documents.

---

## Metadata Extractor

Extracts useful metadata from uploaded assets.

---

## Story Editor

Improves clarity, grammar, tone, pacing, and emotional flow.

---

## Missing Information Detector

Identifies gaps that may improve the story.

---

## AI Creative Assistant

Acts as an interactive storytelling collaborator.

---

# 7. AI Workflow

Most AI-assisted workflows follow this sequence:

```
User Input

↓

Context Collection

↓

Prompt Construction

↓

AI Generation

↓

Validation

↓

User Review

↓

User Editing

↓

Save
```

Users should always approve generated content before it becomes part of a Story.

---

# 8. Prompt Engineering Standards

Every prompt should include:

- Task definition.
- User objective.
- Available context.
- Story type.
- Tone requirements.
- Output structure.
- Safety instructions.
- Formatting instructions.

Prompts should remain modular and reusable.

Prompt templates should be stored separately from application logic.

---

# 9. Context & Memory Management

AI should use only the context necessary for the current task.

Possible context sources include:

- Legacy Profile
- Story
- Timeline
- Resume
- CareerCanvas imports
- Uploaded media
- Previous AI outputs
- User preferences
- Story templates

Context should be assembled dynamically rather than permanently stored inside prompts.

---

# 10. AI Safety & Guardrails

The AI must never intentionally:

- Invent life events.
- Fabricate employment history.
- Create fictional achievements.
- Modify verified information without approval.
- Misrepresent uploaded documents.
- Replace user-written content without permission.

Whenever information is incomplete, AI should ask for clarification instead of guessing.

---

# 11. Human-in-the-Loop

Every AI-generated output remains editable.

Users should be able to:

- Accept
- Reject
- Rewrite
- Regenerate
- Edit manually
- Compare versions

AI suggestions are recommendations—not automatic changes.

---

# 12. CareerCanvas Integration

ReelLegacy should integrate with CareerCanvas through documented APIs.

Supported AI workflows include:

- Import Resume
- Import Professional Timeline
- Import Portfolio Projects
- Import Certifications
- Generate Career Documentary
- Update Story from CareerCanvas
- Generate Career Highlights

CareerCanvas remains the structured professional profile.

ReelLegacy transforms that information into cinematic storytelling.

---

# 13. AI Performance & Monitoring

The backend should monitor:

- Response times
- Success rates
- Failure rates
- Token usage
- Cost estimates
- User acceptance rate
- Regeneration frequency
- AI provider availability

Monitoring should improve reliability rather than collect unnecessary user data.

---

# 14. Model Abstraction

AI services should never depend directly on a specific model.

The AI Provider Layer should allow future replacement or addition of providers without changing business logic.

Possible future providers include:

- Google Gemini
- OpenAI
- Anthropic
- Open-source models
- Enterprise-hosted models

Business services should communicate only with the AI Orchestrator.

---

# 15. Future AI Capabilities

Future AI systems may include:

- Voice Cloning
- Emotion Detection
- Storyboard Generation
- Cinematic Shot Planning
- AI Video Editing
- AI Music Recommendation
- AI Translation
- Multi-language Narration
- Family Story Linking
- Interactive Storytelling
- AI Fact Verification
- Historical Research Assistance

These capabilities should extend the existing architecture rather than replace it.

---

# 16. AI Engineering Principles

Every AI system should be:

- Modular
- Replaceable
- Observable
- Explainable
- Testable
- Maintainable
- Provider-independent
- Secure
- Cost-aware
- Extensible

Each AI service should have a clearly defined responsibility.

---

# 17. AI Security & Privacy

AI systems should follow strict privacy rules.

Requirements include:

- Process only authorized user data.
- Respect user permissions.
- Protect uploaded media.
- Avoid unnecessary data retention.
- Log AI activity without exposing sensitive content.
- Secure communication with AI providers.
- Support future data residency requirements.

Personal memories should be treated as highly sensitive information.

---

# 18. AI Limitations

AI systems should acknowledge limitations.

They may:

- Misinterpret incomplete information.
- Require additional user clarification.
- Produce multiple acceptable outputs.
- Recommend edits rather than definitive answers.

AI should communicate uncertainty when confidence is low.

---

# 19. Contributor Guidelines

Contributors should:

- Reuse existing AI services before creating new ones.
- Avoid duplicated prompts.
- Keep prompts modular.
- Document every AI workflow.
- Separate prompt templates from application logic.
- Maintain provider independence.
- Validate AI outputs before persistence.
- Follow the orchestration architecture.

Any new AI capability should integrate through the AI Orchestrator rather than bypass it.

---

# 20. AI Rules

The following rules are mandatory.

1. Every AI request must pass through the AI Orchestrator.
2. AI services must have a single, clearly defined responsibility.
3. AI providers must remain replaceable.
4. Users always retain final editorial control.
5. AI must never fabricate factual information.
6. All AI-generated content must remain editable.
7. Prompts should be modular, reusable, and documented.
8. CareerCanvas integration must use documented APIs only.
9. Privacy and security take precedence over AI convenience.
10. Every AI system should support ReelLegacy's mission of helping users preserve and present authentic life stories through intelligent, human-centered cinematic storytelling.
