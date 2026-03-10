# Plan: Ollama / Open-Source LLM Support

**Status:** Planned — not started
**Created:** 2026-03-10
**Effort estimate:** Medium (3–5 focused sessions)
**Depends on:** Core Startup OS (agents.md, profiles/, scripts/) — complete

---

## Problem

Startup OS is currently coupled to Claude Code. The slash commands (`/lean-canvas`, `/startup-vision`, etc.) rely on Claude Code's skill system. The `agents.md` and `CLAUDE.md` files are auto-loaded by Claude Code's runtime — no other tool does this automatically.

Users who want to run Startup OS with a local LLM via Ollama (or any OpenAI-compatible API) have no path to do so today.

---

## Goal

Make Startup OS runnable with any Ollama-compatible model using a terminal-based conversation loop — same planning flow, same file outputs, same `startup/index.yml` index, same profiles.

The Claude Code path should remain unchanged. Ollama support is an additive layer, not a replacement.

---

## Proposed Architecture

```
scripts/
├── common.sh              ← existing (no changes needed)
├── status.sh              ← existing (no changes needed)
├── set-profile.sh         ← existing (no changes needed)
├── reset.sh               ← existing (no changes needed)
├── build-prompt.sh        ← NEW: assembles system prompt from index + profile
└── run.sh                 ← NEW: ollama conversation loop + file writer

system-prompt.md           ← NEW: flat version of agents.md for non-Claude runtimes
plans/
└── ollama-support.md      ← this file
```

---

## Files to Build

### 1. `system-prompt.md`

A flat, self-contained system prompt that packages everything an LLM needs without relying on Claude Code's auto-loading:

- Full agent directives (condensed from `agents.md`)
- Active profile content (injected at runtime by `build-prompt.sh`)
- Current index state (injected at runtime)
- File format specifications (verbatim from `agents.md`)
- Instruction to write files using a parseable output format (see File Write Protocol below)

**Key difference from `agents.md`:** No slash command routing. The LLM receives a single system prompt and responds conversationally. Commands are triggered by the user typing them naturally ("let's do the lean canvas") rather than as slash commands.

---

### 2. `scripts/build-prompt.sh`

Assembles the final system prompt before each session:

```
Input:  system-prompt.md + startup/index.yml + profiles/<active>.md
Output: /tmp/startup-os-prompt.txt (ephemeral, not committed)
```

Steps:
1. Read `startup/index.yml` — get active profile, current state, completed files
2. Load `profiles/base.md` + `profiles/<active>.md`
3. Inject profile content into the system prompt template
4. Inject current index state as a "Current State" block
5. Write assembled prompt to `/tmp/startup-os-prompt.txt`

---

### 3. `scripts/run.sh`

The main conversation loop. Wraps `ollama` CLI with context management and file writing.

**Responsibilities:**
1. Call `build-prompt.sh` to assemble the system prompt
2. Start a multi-turn conversation with the chosen Ollama model
3. Parse LLM output for file write instructions (see File Write Protocol)
4. Execute file writes to `startup/`
5. Update `startup/index.yml` after each file is written
6. Pass conversation history back into the next turn

**Usage:**
```bash
./scripts/run.sh                        # uses model from config, or prompts
./scripts/run.sh --model llama3.1:70b   # specify model explicitly
./scripts/run.sh --model qwen2.5:72b
```

---

## File Write Protocol

The core challenge: how does the shell script know when the LLM wants to write a file?

Proposed approach — instruct the LLM (via `system-prompt.md`) to wrap file writes in a parseable block:

```
<<<WRITE_FILE: startup/lean-canvas/lean-canvas.md>>>
# Lean Canvas

## Problem
...full file content...
<<<END_FILE>>>
```

`run.sh` scans each LLM response for this pattern, extracts the path and content, and writes it using `mkdir -p` + file write. The user sees a confirmation line before and after each write.

This is a common pattern used by coding agents (Aider uses a similar `SEARCH/REPLACE` block convention).

---

## Model Recommendations

Not all Ollama models will follow complex instructions reliably. Ranked by expected compatibility:

| Model | Size | Expected quality | Notes |
|-------|------|-----------------|-------|
| `qwen2.5:72b` | 72B | ★★★★★ | Best instruction following in open-source; strong format adherence |
| `llama3.1:70b` | 70B | ★★★★☆ | Solid multi-turn, good format adherence |
| `deepseek-r1:70b` | 70B | ★★★★☆ | Strong reasoning; good for validate-idea |
| `mistral-large` | 123B | ★★★★☆ | Good instruction following, large context |
| `llama3.1:8b` | 8B | ★★★☆☆ | Usable for simple sections; may drift on format |
| `phi4:14b` | 14B | ★★★☆☆ | Punches above weight; worth testing |
| `llama3.2:3b` | 3B | ★★☆☆☆ | Too small for reliable multi-section planning |

**Minimum recommended:** 14B parameters. Below that, format adherence for the strict markdown/JSON outputs degrades significantly.

---

## Known Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| LLM ignores `WRITE_FILE` block format | High | Retry logic in `run.sh`; fallback to asking user to confirm manually |
| File format drift (parser breaks React app) | High | Post-write validation in `run.sh` — check key headings exist before accepting |
| Context window overflow on long sessions | Medium | Summarise conversation history after each file write; keep rolling window |
| Model refuses to follow coaching instructions | Medium | Simplify system prompt for smaller models; add `--lite` flag |
| Ollama not installed / model not pulled | Low | `run.sh` checks for `ollama` binary and model availability, prints install instructions if missing |

---

## Out of Scope (for this plan)

- GUI or web interface for the Ollama loop
- Support for OpenAI API / Anthropic API directly (separate plan if needed)
- Streaming output to terminal (nice-to-have, not required)
- Windows support (bash scripts only; WSL users should be fine)
- Automated testing of LLM outputs

---

## Implementation Order

```
Phase 1 — Foundation
  [ ] Write system-prompt.md (flat agent directives, no slash commands)
  [ ] Write scripts/build-prompt.sh (assembles prompt from index + profile)
  [ ] Manual test: pipe assembled prompt into ollama, verify it responds correctly

Phase 2 — Conversation loop
  [ ] Write scripts/run.sh (basic multi-turn loop, no file writing yet)
  [ ] Test with qwen2.5:72b — full startup-vision → lean-canvas flow manually

Phase 3 — File writing
  [ ] Add WRITE_FILE block parsing to run.sh
  [ ] Add post-write validation (check key headings)
  [ ] Add startup/index.yml update after each write

Phase 4 — Hardening
  [ ] Test with llama3.1:70b, llama3.1:8b — compare output quality
  [ ] Add --model flag and model validation
  [ ] Add context window management (rolling summary)
  [ ] Add error recovery (retry on malformed output)

Phase 5 — Documentation
  [ ] Update README.md with Ollama section
  [ ] Add model compatibility table
  [ ] Add troubleshooting guide for common failures
```

---

## Definition of Done

- `./scripts/run.sh` completes a full `/startup-vision` → `/lean-canvas` flow with `qwen2.5:72b`
- Output files pass the existing React app parser (viewer renders them correctly)
- `startup/index.yml` is correctly updated after each step
- `./scripts/status.sh` reflects the completed steps
- README documents the Ollama path alongside the Claude Code path
