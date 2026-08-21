# ReelLegacy Supabase / PostgreSQL Production Migration Package

This package contains the complete, contract-compliant SQL migration suite for ReelLegacy, faithfully implementing the authoritative 22-entity domain and repository contract.

---

## Migration Sequence

### 1. `001_extensions_and_types.sql`
- **Extensions:** `uuid-ossp`, `pgcrypto`, `pg_trgm`
- **Domain Enums:**
  - `life_status`, `profile_category`, `profile_status`
  - `story_status`, `media_type`, `media_status`
  - `document_category`, `import_status`
  - `character_role`, `character_importance`, `character_status`, `character_relation_type`
  - `scene_layout`, `scene_status`, `scene_asset_role`
  - `voice_category`, `voice_gender`, `voice_emotion`, `narration_status`, `version_type`
  - `render_job_status`, `render_type`, `render_resolution`, `render_priority`
  - `notification_type`, `share_access_level`

### 2. `002_core_tables.sql`
- **Core Tenant & Primary Entities:**
  1. `user_settings` (1:1 with `auth.users`, theme, workspace, accessibility, notifications, security)
  2. `legacy_profiles` (Tenant anchor per heritage subject, full name, life status, family members JSONB)
  3. `media_collections` (Media albums/collections referencing `legacy_profiles`)
  4. `stories` (Story domain model with narrative styles, completion progress, estimates, metadata)
  5. `story_characters` (First-class character entity scoped directly to `stories(id)` with cascade)
  6. `media_assets` (Photo, video, audio, and doc assets with dimensions, blurhash, EXIF, AI metadata)
  7. `source_documents` (Archival grounding documents and OCR/transcription text for AI storytelling)
  8. `source_imports` (External import records for memoirs, interview transcripts, obituaries)
  9. `story_chapters` (Act/chapter structural hierarchy)
  10. `story_scenes` (Scenes with camera directions, transitions, lighting, music, and layout)

### 3. `003_relational_and_join_tables.sql`
- **Relational Graphs & Production Pipeline Entities:**
  11. `character_relationships` (Self-referencing character graph scoped to story)
  12. `story_scene_media` (M:N scene media with `layer_order` and `asset_role`: `primary`, `background`, `b_roll`, `overlay`, `document`, `audio`)
  13. `story_scene_characters` (M:N scene characters with `role_in_scene`)
  14. `timeline_events` (Historical milestones with date precision, people involved, supporting media)
  15. `voice_profiles` (Narrator catalog: system presets and custom AI voice clones)
  16. `narration_projects` (1:1 with story: voice settings, pronunciation rules, background music)
  17. `narration_segments` (Scene narration with multi-take versioning JSONB, waveforms, subtitle cues)
  18. `render_jobs` (Production video pipeline: 14-stage pipeline JSONB, preflight checks JSONB, progress percentage)
  19. `story_templates` (Story blueprints, act breakdowns, interview question groups JSONB)
  20. `activity_logs` (Domain activity and audit logs)
  21. `notifications` (User-scoped in-app alerts and notifications)
  22. `story_shares` (Secure tokenized sharing with password hashing and access boundaries)

### 4. `004_indexes_and_constraints.sql`
- Foreign key and join performance indexes on all 22 tables
- Compound ordering indexes (`(story_id, order_index)`, `(chapter_id, scene_number)`, `(project_id, order_index)`)
- Trigram GIN indexes (`pg_trgm`) for fuzzy text search across profiles, stories, characters, media, documents, timeline events, and templates
- Partial indexes for active render queues, unread notifications, and active story shares

### 5. `005_rls_security_policies.sql`
- Zero-recursion `STABLE SECURITY DEFINER` helper functions (`owns_profile`, `owns_story`, `owns_chapter`, `owns_scene`, `owns_character`, `owns_narration_project`) with explicit `SET search_path = public`
- Granular Row Level Security (RLS) policies enabled across all 22 tables
- Public read policies for active tokenized shares (`story_shares`), system presets (`voice_profiles`, `story_templates`)

### 6. `006_triggers_and_functions.sql`
- Automated `updated_at` timestamp triggers across all 17 mutable entity tables
- `handle_new_user()` bootstrap trigger on `auth.users` provisioning default `user_settings` and `legacy_profiles`
- Supabase Storage bucket configurations (`reellegacy-media`, `reellegacy-audio`, `reellegacy-renders`) with strict authenticated user folder isolation policies
