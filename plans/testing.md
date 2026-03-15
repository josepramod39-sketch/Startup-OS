# Plan: End-to-End Test Suite + Mock Startup Generator

**Status:** Planned — not started
**Created:** 2026-03-10
**Effort estimate:** Medium (2–3 sessions)
**Depends on:** Core Startup OS loaders and types — complete

---

## Overview

Two deliverables:

1. **Test suite** — unit + integration tests for all 6 loaders, shared utilities, and completion metrics. Uses Vitest (native to Vite, zero config overhead).
2. **Mock startup generator** — a script that writes all 6 planning files with realistic fixture data. Used as test fixtures, demo data, and manual QA.

---

## Test Framework: Vitest

Vitest is the natural choice — it shares the Vite config, understands `import.meta.glob`, supports TypeScript natively, and runs in milliseconds.

### Installation

```bash
npm install -D vitest @vitest/coverage-v8
```

### `vite.config.ts` addition

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/router.tsx'],
    },
  },
})
```

### `package.json` scripts to add

```json
"test":          "vitest run",
"test:watch":    "vitest",
"test:coverage": "vitest run --coverage"
```

---

## Directory Structure

```
src/
└── lib/
    └── __tests__/
        ├── fixtures/               ← mock markdown/JSON file content (strings)
        │   ├── startup-overview.md.ts
        │   ├── lean-canvas.md.ts
        │   ├── golden-circle.md.ts
        │   ├── personas.json.ts
        │   ├── value-proposition.md.ts
        │   └── pitch-deck.md.ts
        ├── utils.test.ts           ← parseH2Section, parseH3Section, parseBulletList
        ├── startup-loader.test.ts
        ├── canvas-loader.test.ts
        ├── golden-circle-loader.test.ts
        ├── personas-loader.test.ts
        ├── value-prop-loader.test.ts
        ├── pitch-deck-loader.test.ts
        └── integration.test.ts     ← full pipeline: fixture → parse → type contract
```

---

## Fixtures Design

Each fixture file exports three variants:

```typescript
// Example: src/lib/__tests__/fixtures/lean-canvas.md.ts

export const VALID = `...`          // complete, well-formed file
export const MINIMAL = `...`        // only required fields, rest empty
export const MALFORMED = `...`      // wrong headings, broken markdown
export const PARTIAL = `...`        // some sections present, some missing
```

This gives every test case clean, readable data without inline strings.

---

## Test Coverage Plan

### `utils.test.ts` — Shared parsing utilities

| Test | Input | Expected |
|------|-------|----------|
| `parseH2Section` — valid heading | Full markdown with `## Problem\ncontent` | Returns `"content"` |
| `parseH2Section` — heading not present | Markdown without that heading | Returns `""` |
| `parseH2Section` — heading with special chars | `## Products & Services` | Correctly escapes `&` |
| `parseH2Section` — content until next heading | Multi-section markdown | Stops at next `##` |
| `parseH3Section` — valid nested heading | Under a `##` section | Returns correct H3 content |
| `parseH3Section` — stops at next `##` | Two H2 sections each with H3 | Doesn't bleed across |
| `parseBulletList` — dash bullets | `- item 1\n- item 2` | `["item 1", "item 2"]` |
| `parseBulletList` — asterisk bullets | `* item 1` | `["item 1"]` |
| `parseBulletList` — mixed empty lines | Bullets with blank lines between | Filters blanks |
| `parseBulletList` — empty string | `""` | `[]` |
| `normalizeMd` — CRLF | Windows line endings | Converts to LF |

---

### `startup-loader.test.ts`

| Test | Scenario | Expected |
|------|----------|----------|
| Valid file | Full `VALID` fixture | Returns complete `StartupOverview` object |
| H1 name extraction | `# My Startup\n` | `name === "My Startup"` |
| Stage coercion | `"Ideation"` (capitalised) | `stage === "ideation"` |
| Invalid stage | `"launch"` | Falls back to `"ideation"` |
| Missing tagline | No Tagline section | `tagline === ""` |
| Malformed file | `MALFORMED` fixture | Returns `null` |
| Empty string | `""` | Returns `null` |

---

### `canvas-loader.test.ts`

| Test | Scenario | Expected |
|------|----------|----------|
| Valid file | `VALID` fixture | All 9 fields populated |
| All 9 sections present | Check each key | Non-empty strings |
| Empty section | `## Problem\n\n## Customer Segments` | `problem === ""` |
| `getLeanCanvasCompletionCount` — all filled | 9 non-empty sections | Returns `9` |
| `getLeanCanvasCompletionCount` — partial | 5 filled, 4 empty | Returns `5` |
| Multiline section content | Section with multiple paragraphs | Preserves full content |
| Section with bullet list | Problem as bullet list | Returns raw text including `- ` |
| Malformed file | No `## ` headings | All fields `""`, not null |

---

### `golden-circle-loader.test.ts`

| Test | Scenario | Expected |
|------|----------|----------|
| Valid file | `VALID` fixture | All Why/How/What + 6 GTM fields |
| Why extraction | `## Why\ncontent` | `why === "content"` |
| GTM Target Market | `### Target Market\ncontent` | `gtm.targetMarket === "content"` |
| GTM stops at next `##` | `## What` after GTM section | GTM fields don't include What content |
| Missing GTM section | No `## Go-to-Market Strategy` | All GTM fields `""` |
| Partial GTM | Only 3 of 6 GTM fields | Missing fields `""`, present fields populated |
| Malformed file | `MALFORMED` fixture | Returns `null` |

---

### `personas-loader.test.ts`

| Test | Scenario | Expected |
|------|----------|----------|
| Valid JSON | `VALID` fixture | Array of `Persona` objects |
| Single persona | One persona in array | Returns array of length 1 |
| Multiple personas | 3 personas | Returns array of length 3 |
| Missing `id` field | Persona without `id` | Filtered out of array |
| Missing `name` field | Persona without `name` | Filtered out of array |
| Invalid `techSavviness` | `"Expert"` | Coerced to `"Medium"` |
| Valid `techSavviness` values | All 4 valid values | Each passes through unchanged |
| Missing array field | No `goals` key | Returns `goals: []` |
| Non-array field | `goals: "string"` | Returns `goals: []` |
| `age: 0` | Persona with age 0 | `age === 0` (valid) |
| `getPersonaById` — found | ID exists | Returns matching persona |
| `getPersonaById` — not found | ID doesn't exist | Returns `undefined` |
| `getPersonaInitials` — two words | `"Sarah Chen"` | Returns `"SC"` |
| `getPersonaInitials` — one word | `"Jax"` | Returns `"J"` |
| Malformed JSON | `"not json"` | Returns `[]` |
| Empty array | `[]` | Returns `[]` |

---

### `value-prop-loader.test.ts`

| Test | Scenario | Expected |
|------|----------|----------|
| Valid file | `VALID` fixture | All 6 arrays populated |
| Customer jobs as bullets | `- Functional\n- Social` | `customerJobs: ["Functional", "Social"]` |
| Empty section | No bullets under heading | Returns `[]` for that field |
| `getValuePropFitScore` — full coverage | All pains have relievers | `coveredPains === totalPains` |
| `getValuePropFitScore` — no coverage | Empty pain relievers | `coveredPains === 0` |
| `getValuePropFitScore` — partial | 2 pains, 1 reliever | `coveredPains === 1` |
| Asterisk bullets | `* item` | Parsed same as `- item` |
| Malformed file | `MALFORMED` fixture | Returns `null` |

---

### `pitch-deck-loader.test.ts`

| Test | Scenario | Expected |
|------|----------|----------|
| Valid 10-slide file | `VALID` fixture | `slides.length === 10` |
| Slide title extraction | `## Slide 1: Title` | `slides[0].title === "Title"` |
| Slide content extraction | Content between two `## Slide` headings | Correct content per slide |
| Slide ID mapping — title | `## Slide 1: Title` | `slides[0].id === "title"` |
| Slide ID mapping — go-to-market | `## Slide 8: Go-to-Market` | `id === "go-to-market"` |
| Partial deck | Only 5 slides | `slides.length === 5` |
| Unknown slide title | `## Slide 11: Custom` | `id === "custom"` (slugified fallback) |
| Empty slide content | Slide with no body text | `content === ""` |
| Malformed file | No `## Slide` headings | `slides: []` |

---

### `integration.test.ts` — Full pipeline

Tests that fixture files produce objects matching the TypeScript type contracts — essentially a regression guard that catches any parser drift breaking the viewer.

| Test | What it verifies |
|------|-----------------|
| Overview → `StartupOverview` shape | All required fields present and typed correctly |
| Canvas → `LeanCanvas` shape | 9 string fields, all present |
| Golden Circle → `GoldenCircle` shape | why/how/what strings + gtm object with 6 strings |
| Personas → `Persona[]` shape | Array elements match Persona interface |
| Value Prop → `ValueProposition` shape | customerProfile + valueMap, all arrays |
| Pitch Deck → `PitchDeck` shape | slides array, each with id/title/content |
| All fixtures → no null returns | Valid fixtures never return null |
| All malformed → null returns | Malformed fixtures always return null |

---

## Mock Startup Generator

### Purpose

A script that writes all 6 planning files with realistic fixture data:
- **Test fixtures** — Vitest tests import from here instead of inline strings
- **Demo mode** — lets you run the React app with a complete example without Claude
- **QA baseline** — known-good files to verify the parser after changes

### File

```
scripts/seed.sh    ← writes all 6 startup/ files + startup/index.yml
```

### Usage

```bash
./scripts/seed.sh              # writes demo startup: "FlowSync" (SaaS)
./scripts/seed.sh --wipe       # clears startup/ first, then seeds
```

### Fictional Startup: FlowSync

A realistic SaaS example used as the fixture startup:

```
Name:      FlowSync
Tagline:   Project management for async-first remote teams
Stage:     validation
Industry:  SaaS / Productivity
Profile:   saas
```

This gives every parser something non-trivial to chew on — realistic sentences, multi-item bullet lists, nested GTM sections, 2 personas, a full value prop canvas, and all 10 pitch slides.

---

### Files Generated by `seed.sh`

| File | Content |
|------|---------|
| `startup/startup-overview.md` | FlowSync overview — name, tagline, stage, problem, target market |
| `startup/lean-canvas/lean-canvas.md` | All 9 sections filled, 2–4 sentences each |
| `startup/golden-circle/golden-circle.md` | Why/How/What + all 6 GTM fields |
| `startup/personas/personas.json` | 2 personas: "Maya Patel" (PM) + "Jordan Kim" (Engineering Lead) |
| `startup/value-proposition/value-proposition.md` | 3 jobs, 3 gains, 3 pains — 3 products, 3 creators, 3 relievers |
| `startup/pitch-deck/pitch-deck.md` | All 10 slides with realistic content |
| `startup/index.yml` | All files marked present, profile: saas, progress: 6/6 |

---

## Implementation Order

```
Phase 1 — Setup
  [ ] Install vitest + @vitest/coverage-v8
  [ ] Add test config to vite.config.ts
  [ ] Add test/test:watch/test:coverage scripts to package.json
  [ ] Create src/lib/__tests__/ directory structure

Phase 2 — Fixtures
  [ ] Write all 6 fixture files (VALID / MINIMAL / MALFORMED / PARTIAL variants)
  [ ] Verify fixtures are valid by running them through loaders manually

Phase 3 — Unit tests
  [ ] utils.test.ts (start here — no mocking needed)
  [ ] startup-loader.test.ts
  [ ] canvas-loader.test.ts
  [ ] golden-circle-loader.test.ts
  [ ] personas-loader.test.ts
  [ ] value-prop-loader.test.ts
  [ ] pitch-deck-loader.test.ts

Phase 4 — Integration tests
  [ ] integration.test.ts — type contract regression suite

Phase 5 — Mock generator
  [ ] scripts/seed.sh — writes all 6 files + index.yml
  [ ] Manual test: seed → npm run dev → verify all 6 viewer pages render

Phase 6 — CI
  [ ] Add npm run test to GitHub Actions (if/when CI is set up)
  [ ] Target: 90%+ coverage on src/lib/
```

---

## Coverage Target

| File | Target |
|------|--------|
| `src/lib/utils.ts` | 100% |
| `src/lib/startup-loader.ts` | 95% |
| `src/lib/canvas-loader.ts` | 95% |
| `src/lib/golden-circle-loader.ts` | 90% |
| `src/lib/personas-loader.ts` | 95% |
| `src/lib/value-prop-loader.ts` | 90% |
| `src/lib/pitch-deck-loader.ts` | 90% |
| **Overall** | **≥ 90%** |

Pages and components are excluded — parser correctness is the critical path.

---

## Definition of Done

- `npm test` passes with zero failures
- `npm run test:coverage` reports ≥ 90% on `src/lib/`
- `./scripts/seed.sh` writes all files and the React app renders all 6 viewer pages correctly
- Malformed input tests confirm parsers never throw — always return `null` or `[]`
