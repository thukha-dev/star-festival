# Star Festival - Implementation Plan

## 1. Scope and Delivery Strategy

This plan turns the approved spec into shippable work across four tracks:
- Database and backend (Supabase)
- Frontend UI and interactions
- Localization and accessibility
- QA, performance, and release readiness

Delivery will be phased to ensure we can demo quickly, then harden moderation and production readiness.

## 2. Architecture Overview

### Frontend
- SPA framework (React/Next.js/Vue acceptable; examples below assume React + TypeScript).
- Animation stack: CSS transforms + lightweight particle layer (Canvas or optimized DOM).
- i18n library for `en`, `ja`, `my`.

### Backend
- Supabase Postgres as source of truth.
- Supabase Auth optional (not required for anonymous wish submission in v1).
- Row-level security (RLS) to ensure only approved wishes are publicly readable.
- Edge Function (or server route) for server-side moderation gate and insert.

## 3. Data Model (Supabase)

## 3.1 Table: `wishes`

Recommended columns:
- `id` UUID PK default `gen_random_uuid()`
- `wish_text` TEXT NOT NULL
- `nickname` TEXT NOT NULL
- `nickname_is_default` BOOLEAN NOT NULL DEFAULT `false`
- `color` TEXT NOT NULL CHECK (`color` IN ('red','blue','green','yellow','purple'))
- `language` TEXT NOT NULL CHECK (`language` IN ('en','ja','my'))
- `status` TEXT NOT NULL CHECK (`status` IN ('pending','approved','rejected')) DEFAULT 'pending'
- `moderation_reason` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT `now()`
- `approved_at` TIMESTAMPTZ NULL

Indexes:
- `idx_wishes_status_created_at` on (`status`, `created_at` desc)
- `idx_wishes_created_at` on (`created_at` desc)

## 3.2 SQL Migration (initial)

```sql
create extension if not exists pgcrypto;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  wish_text text not null,
  nickname text not null,
  nickname_is_default boolean not null default false,
  color text not null check (color in ('red','blue','green','yellow','purple')),
  language text not null check (language in ('en','ja','my')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  moderation_reason text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists idx_wishes_status_created_at
  on public.wishes (status, created_at desc);

create index if not exists idx_wishes_created_at
  on public.wishes (created_at desc);
```

## 4. Security and Access Control

## 4.1 RLS Policies
- Enable RLS on `wishes`.
- Anonymous/public users: `SELECT` only rows where `status = 'approved'`.
- Anonymous users: no direct `INSERT` into table.
- Inserts go through trusted server path (Edge Function/server API) using service role.

Example policy intent:
- `public_read_approved_wishes`: `for select using (status = 'approved')`

## 4.2 Moderation Path
- Client performs basic pre-checks:
  - required text
  - max 120 chars
  - simple bad-word denylist
  - repeated character / spam pattern guard
- Server re-validates all checks.
- Server sets status:
  - `approved` when checks pass
  - `rejected` (or `pending` if manual review desired later) when checks fail

Initial recommendation:
- Auto-approve when safe.
- Auto-reject obvious violations.
- Keep `moderation_reason` for audit.

## 5. API Contract

## 5.1 POST `/api/wishes`
Purpose: Create a new wish through moderation gate.

Request body:
```json
{
  "wishText": "string (1..120)",
  "nickname": "string (optional)",
  "color": "red|blue|green|yellow|purple",
  "language": "en|ja|my"
}
```

Behavior:
- Normalize/sanitize inputs.
- Apply localized default nickname when empty:
  - `en`: `Anonymous`
  - `ja`: `匿名`
  - `my`: `အမည်မဖော်လိုသူ`
- Return inserted wish payload (without sensitive moderation internals if rejected).

Response examples:
- `201 Created` for accepted submission (status may be `approved` or `pending`).
- `400` validation failure.
- `429` rate-limited.

## 5.2 GET `/api/wishes`
Purpose: Fetch public wishes for rendering cards.

Query params:
- `limit` (default 50, max 200)
- `cursor` or `before` for pagination

Behavior:
- Return only approved wishes ordered by newest first.

## 6. Frontend Work Breakdown

## 6.1 Foundations
- Set up design tokens (color, glow, spacing, z-index, animation durations).
- Build app shell with fullscreen hero layout and language provider.
- Load font stacks for JP/EN/MY with fallback handling.

## 6.2 Core Components
- `HeroSection`
- `LanguageSwitcher`
- `NightSkyLayer` (gradient, stars, milky glow, shooting star)
- `BambooScene` (center illustration + sway)
- `TanzakuCard`
- `WishInputPanel`
- `WishModal`
- `ParticleLayer`

## 6.3 Interaction Implementation
- Primary CTA: smooth scroll + focus textarea in wish panel.
- Secondary CTA: intro interaction (camera pan/soft scene reveal or title animation).
- Submit flow:
  - optimistic local animation (float + sparkle)
  - resolve with API response
  - keep card if approved/pending visualization is desired; otherwise follow product rule for rejected items

## 6.4 Form and Validation
- Local validation:
  - required wish text
  - max 120 chars
  - color required
- Live character counter.
- Localized field labels/errors.

## 6.5 Public Wish Rendering
- Fetch approved wishes on load.
- Render cards with subtle randomized resting rotation.
- Click card opens modal with full wish details.

## 7. Localization Plan

Translation keys grouped by domain:
- `hero.*`
- `wishForm.*`
- `modal.*`
- `validation.*`
- `common.*`

Required localized strings include:
- CTA labels (primary/secondary)
- Placeholder and field labels
- Validation messages
- Localized anonymous nickname

## 8. Accessibility Plan

- Keyboard support for all controls.
- Focus trap and `Esc` close in modal.
- ARIA labels for color pickers and language toggles.
- Reduced-motion mode:
  - disable shooting stars and reduce sway amplitude
  - use fade instead of float/sparkle-heavy sequences

## 9. Performance Plan

- Keep animation on `transform` + `opacity`.
- Cap star and particle counts, lower caps on mobile.
- Lazy-init noncritical animation loops after first paint.
- Target Lighthouse mobile perf >= 85 for landing route.

## 10. Milestones

## Milestone 1 - Foundation (Day 1)
- Project scaffold, theme tokens, layout skeleton.
- i18n setup with EN/JA/MY.
- Static hero and input panel UI.

## Milestone 2 - Backend and Data (Day 2)
- Supabase table + RLS policies.
- POST/GET wishes API.
- Validation + basic moderation.

## Milestone 3 - Interactions (Day 3)
- Bamboo sway, stars, shooting star.
- Submit animation pipeline.
- Modal and card interactions.

## Milestone 4 - Polish and QA (Day 4)
- Responsive refinement.
- Accessibility pass.
- Performance pass and bug fixes.

## 11. Testing Strategy

### Unit Tests
- Validation rules (length, required, color/language enums).
- Nickname fallback localization.
- Moderation utility behavior.

### Integration Tests
- POST wish -> DB row created with expected status.
- GET wishes returns approved only.
- Primary CTA scroll/focus behavior.

### E2E Tests
- Language switching across EN/JA/MY.
- Submit wish happy path.
- Modal open/close keyboard and pointer behavior.

## 12. Definition of Done

- All acceptance criteria from project spec pass.
- API and DB protections verified (no public direct insert).
- Public list contains approved wishes only.
- Localized anonymous nickname works per language.
- Core flows tested on desktop + mobile viewports.

## 13. Immediate Next Tasks (Execution Order)

1. Create Supabase migration for `wishes` table + indexes.
2. Configure RLS and write policies for public approved-read only.
3. Implement `POST /api/wishes` with server-side moderation/validation.
4. Implement `GET /api/wishes` public endpoint with pagination.
5. Build `WishInputPanel` with localized validation and char counter.
6. Implement CTA behaviors (primary focus-scroll, secondary intro).
7. Wire submission animation and public rendering from API.
8. Add test coverage for validation, moderation, and public visibility rules.
