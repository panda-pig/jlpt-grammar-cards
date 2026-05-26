# JLPT Grammar Deck PRD

Last updated: 2026-05-26

## 1. Product Summary

JLPT Grammar Deck is an Anki-style Japanese grammar learning product for JLPT N1-N5 learners.

The product combines a curated grammar library, flashcard-based learning, SM-2 spaced repetition, favorites, progress tracking, multilingual UI/content structure, local guest mode, and Supabase-backed account sync.

The current product direction is not a static grammar reference site. It is a real study system where users can learn new grammar, review due cards, save progress, and eventually manage their own personal grammar library.

## 2. Product Goals

### Primary Goals

- Provide a usable JLPT grammar study MVP that can be deployed and tested by real users.
- Make grammar learning card-based, reviewable, and measurable, similar to Anki.
- Support both unauthenticated local trial mode and authenticated cross-device sync.
- Maintain a curated default grammar deck as the system library.
- Allow future user-specific grammar management without letting normal users modify the shared default deck.
- Support Chinese and English UI, and support multilingual grammar content fields.
- Keep grammar data auditable, deduplicated, and safe from placeholder/filler content.

### Non-Goals For Current MVP

- Full admin CMS with production-grade role management.
- Perfect full-market grammar coverage across every external source.
- Complete human-polished English explanations for every item.
- Native mobile app.
- Complex social features, sharing, ranking, or classroom management.

## 3. Target Users

### Primary Users

- JLPT learners preparing for N5-N1.
- Chinese-speaking learners who want structured grammar review.
- English-speaking learners who want an English UI and content fallback support.
- Self-study users familiar with Anki-style review.

### Secondary Users

- Power users who want to build or customize their own grammar library.
- Future content maintainers/admins who will refine the default grammar deck.

## 4. Core User Problems

1. JLPT grammar is fragmented across books, websites, and notes.
2. Learners often read grammar once but do not review it systematically.
3. Similar grammar points are easy to confuse.
4. Static grammar lists do not show due review, mastery, or progress.
5. Login walls increase friction for first-time learners.
6. Multilingual switching often only translates UI while grammar content remains hard-coded.
7. Shared default content must be protected while still allowing personal customization.

## 5. Product Principles

- Learn first, account later: users can start immediately without logging in.
- Real study flow over demo behavior: progress, review, favorites, and stats must actually work.
- Default deck is curated and protected.
- User data belongs to the user: progress, favorites, review history, hidden items, and private grammar are user-specific.
- Content quality must be auditable.
- Missing content should degrade naturally, not crash or show careless placeholders.
- Chinese and English support must be structural, not hard-coded in components.

## 6. Current MVP Scope

### 6.1 Grammar Library

Users can browse the default JLPT grammar library.

Current default deck:

- Total: 680 grammar items
- N5: 129
- N4: 153
- N3: 122
- N2: 146
- N1: 130

Supported library features:

- Browse all grammar.
- Search by grammar, meaning, and keywords.
- Filter by JLPT level.
- Filter by grammar scene/type.
- Filter by learning status.
- Filter favorites.
- Open grammar detail page.
- Show same-title related usage links when a grammar form appears in multiple contexts.
- Show structure as a subtitle to distinguish same-title grammar entries.

### 6.2 Grammar Detail Page

The detail page should show:

- Grammar title
- JLPT level
- Grammar type/scene
- Meaning
- Structure
- Explanation
- Usage note
- Example sentence
- Translation
- Common mistake
- Memory tip
- Similar grammar
- Same-title related usages
- Current learning status
- Mastery level
- Review count
- Last review date
- Next review date
- Favorite toggle
- Start learning action

The page must not show filler placeholders such as "example is being prepared" or "content not added yet" in production content.

### 6.3 Study Page

Route: `/study`

Purpose:

- Main learning entry.
- Allows users to study new cards.
- Allows users to rate the current card.
- New cards can become scheduled review cards after scoring.

Expected behavior:

- User selects level.
- System loads new cards not yet reviewed.
- Card front asks the user to recall meaning, structure, example, and mistake point.
- Card back reveals grammar details.
- User rates recall:
  - Again / 忘记
  - Hard / 模糊
  - Good / 记住
  - Easy / 简单
- Rating updates SM-2 progress.

### 6.4 Review Page

Route: `/review`

Purpose:

- Dedicated due-card review page.
- Only shows old due review content.
- Does not mix in new-card learning.

Expected behavior:

- Load cards where `next_review_at <= now`.
- Show due review card.
- User rates recall using the same four ratings.
- Rating updates SM-2 progress and review history.
- If no due cards exist, show a calm empty state.

### 6.5 Favorites

Users can favorite grammar items.

Expected behavior:

- Favorite works for unauthenticated users using localStorage.
- Favorite works for authenticated users using Supabase user progress.
- Favorite state is part of progress sync.
- Favorites page shows saved grammar.

### 6.6 Dashboard

Dashboard shows real progress stats:

- Today due
- Today new
- Today completed
- Streak days
- Total learned
- Total mastered
- Total favorites
- JLPT level progress
- Recent reviews

Stats should read from local progress in guest mode and from Supabase in authenticated mode.

### 6.7 Local Guest Mode

Unauthenticated users can use the product without login.

Guest mode supports:

- Browse grammar library.
- View grammar details.
- Study cards.
- Review cards.
- Favorite grammar.
- See dashboard stats.

Local state is stored in browser localStorage.

Guest mode messaging:

- Chinese: "当前进度保存在本机浏览器，登录后可永久保存并跨设备同步。"
- English: "Progress is saved in this browser. Log in to keep it permanently and sync across devices."

### 6.8 Login Sync

When a guest user logs in, local progress should sync into the authenticated account.

Sync behavior:

- Detect local progress changes with a local sync fingerprint.
- Avoid duplicate sync for the same user and same local progress state.
- Allow later local changes to sync again.
- Merge local progress with existing remote progress.
- Preserve strongest useful state:
  - Learning status
  - Favorite state
  - Review count
  - Mastery level
  - Due date
  - Last reviewed date
  - Last rating
  - SM-2 interval
  - SM-2 repetition
  - SM-2 ease factor
  - Review history
- Avoid duplicate review history records where possible.
- Update daily stats for imported review history.

UI feedback:

- Syncing
- Sync succeeded
- Sync failed but local progress remains safe

### 6.9 My Grammar Library

Route: `/my-grammar`

Current MVP behavior:

- Logged-in users can access personal grammar library management.
- Users can add private grammar items.
- Users can hide default grammar items for their own library view.
- If remote schema is unavailable, local fallback mode stores personal changes in localStorage.

Future behavior:

- Edit private grammar.
- Delete private grammar.
- Restore hidden default grammar.
- Batch manage default/private grammar.
- Import/export personal grammar.

## 7. Multilingual Requirements

### 7.1 UI i18n

All UI copy should be dictionary-driven.

Supported locales:

- `zh`
- `en`

Requirements:

- Buttons, titles, filters, hints, navigation, empty states, dashboard labels, and sync messages must switch language.
- UI copy should not be hard-coded inside components unless it is a stable technical identifier.

### 7.2 Grammar Content i18n

Grammar content should support both Chinese and English fields.

Required content fields:

```json
{
  "meaning_zh": "",
  "meaning_en": "",
  "explanation_zh": "",
  "explanation_en": "",
  "usage_note_zh": "",
  "usage_note_en": "",
  "example_zh": "",
  "example_en": "",
  "common_mistake_zh": "",
  "common_mistake_en": ""
}
```

Current strategy:

- Chinese content is the primary completed content.
- English content structure exists and should display where available.
- If English content is missing, fallback may use Chinese content, but components must be structured to support English content natively.

### 7.3 Route Names And Labels

Some Japanese learning route/source names should keep familiar original names if used in the future, for example:

- 蓝宝书 Blue Book
- TRY
- 一册合格 Issatsu Goukaku

Current product has removed route badges from card display, but the product should preserve recognizable names if such metadata returns later.

## 8. Spaced Repetition Requirements

### Algorithm

Use SM-2.

Do not use fixed demo rules such as:

- Again = today
- Hard = 1 day
- Good = 3 days
- Easy = 7 days

### Ratings

Supported ratings:

- Again / 忘记
- Hard / 模糊
- Good / 记住
- Easy / 简单

### Each Rating Must Update

- Due date
- Interval
- Ease factor
- Repetition count
- Review count
- Mastery level
- Last reviewed date
- Last rating
- Review history
- Daily stats

## 9. Data Model

### 9.1 Shared Default Grammar

Table: `grammar`

Purpose:

- Curated system grammar deck.
- Readable by all users.
- Writable only by service role or future admin workflow.

Important fields:

- `id`
- `source_key`
- `slug`
- `title`
- `jlpt_level`
- `grammar_type`
- `tags`
- `meaning_cn`
- `meaning_en`
- `meaning_zh`
- `explanation`
- `explanation_zh`
- `explanation_en`
- `usage_note`
- `usage_note_zh`
- `usage_note_en`
- `example_jp`
- `example_cn`
- `example_zh`
- `example_en`
- `common_mistake`
- `common_mistake_zh`
- `common_mistake_en`
- `memory_tip`
- `memory_tip_zh`
- `memory_tip_en`
- `is_system`
- `content_version`
- `updated_at`

Stable key rule:

- Runtime progress should use `grammar_key`.
- Default grammar uses local `source_key` as stable key.
- This prevents progress from breaking when Supabase row UUIDs change.

### 9.2 User Progress

Table: `user_grammar_progress`

Purpose:

- Stores user-specific learning state for system and private grammar.

Important fields:

- `user_id`
- `grammar_id`
- `grammar_key`
- `study_status`
- `is_favorite`
- `review_count`
- `mastery_level`
- `interval`
- `repetition`
- `ease_factor`
- `next_review_at`
- `last_reviewed_at`
- `last_rating`
- `created_at`
- `updated_at`

### 9.3 Review History

Table: `review_history`

Purpose:

- Stores each review event.

Important fields:

- `user_id`
- `grammar_id`
- `grammar_key`
- `rating`
- `reviewed_at`
- `interval`
- `repetition`
- `ease_factor`
- `next_review_at`

### 9.4 Daily Stats

Table: `daily_stats`

Purpose:

- Supports dashboard daily completed/new/streak stats.

### 9.5 User Grammar Overrides

Table: `user_grammar_overrides`

Purpose:

- Stores user-specific behavior for default grammar items.
- Current use: hide default grammar item for one user.

### 9.6 User Grammar Items

Table: `user_grammar_items`

Purpose:

- Stores user-created private grammar items.
- Should be visible/editable only by the owner.

## 10. Permissions And Security

### Current MVP

- Public/default grammar can be read by all users.
- Normal users should not write to the shared `grammar` table.
- User progress is writable only by the owning user.
- User private grammar is writable only by the owning user.
- User overrides are writable only by the owning user.
- Default grammar sync scripts use `SUPABASE_SERVICE_ROLE_KEY`.

### Key Handling

- `NEXT_PUBLIC_SUPABASE_URL` can be public.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be public if RLS is correctly configured.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` should only live in local `.env.local`, CI secrets, or secure server-side jobs.
- `.env.local` must not be committed.

## 11. Technical Architecture

### Frontend

- Framework: Next.js 16 App Router
- React: 19
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- lucide-react icons

### Backend / Database

- Supabase
- Supabase Auth
- Supabase Postgres
- RLS policies

### Local Storage

Used for:

- Guest learning progress
- Guest favorites
- Guest review history
- Local personal grammar fallback
- Guest-to-account sync fingerprint

### Important Services

- `grammarService`
  - Loads grammar from Supabase.
  - Falls back to local curated JSON when needed.
  - Applies user overrides and private grammar.

- `progressService`
  - Reads/writes Supabase user progress.
  - Records SM-2 review events.
  - Imports local progress into remote account.

- `localProgressService`
  - Stores guest progress in localStorage.
  - Runs local SM-2 progress updates.
  - Tracks local sync fingerprint.

- `learningService`
  - Unified progress API used by pages/components.
  - Chooses remote or local mode depending on login state and remote availability.

- `localGrammarLibraryService`
  - Stores local fallback private grammar and hidden default items.

## 12. Routes

Main product routes:

- `/[lang]`
- `/[lang]/grammar`
- `/[lang]/grammar/[slug]`
- `/[lang]/study`
- `/[lang]/review`
- `/[lang]/favorites`
- `/[lang]/dashboard`
- `/[lang]/login`
- `/[lang]/my-grammar`

Admin-related routes currently exist but should not be treated as production-ready public content management until admin role/RLS is completed.

## 13. Content Quality Requirements

### Current Baseline

The curated grammar data must pass:

- `npm run grammar:audit`
- `npm run grammar:audit:strict`

Current audit baseline:

- 680 total grammar items
- 0 audit failures
- 0 audit warnings
- 0 strict failures
- 0 strict warnings

### Content Rules

- No filler placeholders.
- No repeated examples for same-title but different-scene grammar.
- Same grammar form with different meaning/structure/scene should remain distinct.
- True duplicates should be deduplicated and redirected with stable mapping.
- If multiple entries share the same title, card/detail should help users distinguish them by structure, level, scene, and related usages.
- English content should eventually match Chinese content quality, not merely machine-like fallback text.

### External Reference Coverage

External JLPT inventories can be used for planning, but not every external mismatch is a failing condition.

Current strict audit treats external JLPT Sensei inventory as advisory.

## 14. Validation Commands

Before release or after major data changes:

```bash
npm run lint
npm run build
npm run grammar:audit
npm run grammar:audit:strict
npm run grammar:check-db
```

Before replacing remote default grammar:

```bash
npm run grammar:sync-db -- --replace-system
```

Apply remote replacement only when intentional:

```bash
npm run grammar:sync-db -- --apply --replace-system --confirm-replace-system
```

## 15. MVP Acceptance Criteria

The MVP is acceptable when:

- Users can browse the grammar library.
- Users can open grammar detail pages.
- Users can study new grammar cards.
- Users can review due cards separately from new-card learning.
- SM-2 review updates progress correctly.
- Favorites work.
- Dashboard shows real stats.
- Guest mode works with localStorage.
- Login sync moves guest progress into the authenticated account.
- Supabase default grammar reads correctly.
- Normal users cannot write shared default grammar.
- UI supports Chinese and English.
- Grammar content model supports Chinese and English fields.
- Default grammar data passes audit scripts.
- Build and lint pass.

## 16. Known Remaining Work

### P0 Before Public Launch

- Configure deployment environment variables.
- Validate deployed site against production Supabase.
- Test a real user account on deployed URL:
  - guest study
  - login sync
  - favorites
  - review
  - dashboard
  - my grammar library

### P1 Product Improvements

- Add explicit sync status page or account settings section.
- Add edit/delete/restore flows for personal grammar.
- Add import/export for personal grammar.
- Add better empty states for personal library.
- Add admin role and production-safe grammar CMS.
- Add account profile area.

### P2 Quality And Coverage

- Continue expanding N1/N2/N3 grammar coverage using reference inventories.
- Human-review nuanced grammar explanations.
- Improve English explanations and translations.
- Add more similar-grammar comparisons.
- Add more quiz content.

### P3 Testing And Operations

- Add Playwright E2E tests.
- Add CI for lint/build/audits.
- Add database migration checklist.
- Add data sync runbook.
- Add release checklist.

## 17. Open Product Decisions

- Should login sync be fully automatic forever, or should users see a merge confirmation when remote account already has progress?
- Should users be able to fork default grammar into private editable copies?
- Should hidden default grammar affect study/review only, or also hide from global search?
- Should personal grammar be included in JLPT level stats?
- Should admin grammar edits create content versions and migration notes?
- Should the product expose grammar source/reference metadata again, or keep the UI source-free?

## 18. Release Checklist

- Local build passes.
- Local lint passes.
- Grammar audits pass.
- Remote schema check passes.
- Remote grammar count matches expected default deck.
- `.env.local` is ignored.
- No service role key is committed.
- Production environment variables are configured.
- Auth callback works on deployed domain.
- Guest-to-login sync works on deployed domain.
- At least one real account has completed:
  - study
  - review
  - favorite
  - dashboard
  - my grammar library

