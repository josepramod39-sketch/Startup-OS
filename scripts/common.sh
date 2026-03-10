#!/usr/bin/env bash
# common.sh — shared utilities for Startup OS scripts

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${BLUE}${BOLD}→${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}✓${RESET} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}!${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}✗${RESET} $*" >&2; }
dim()     { echo -e "${DIM}$*${RESET}"; }
bold()    { echo -e "${BOLD}$*${RESET}"; }

# ── Repo root detection ───────────────────────────────────────────────────────
find_repo_root() {
  local dir="$PWD"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/agents.md" ]]; then
      echo "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  error "Could not find Startup OS repo root (no agents.md found)."
  exit 1
}

REPO_ROOT="$(find_repo_root)"
INDEX_FILE="$REPO_ROOT/startup/index.yml"
PROFILES_DIR="$REPO_ROOT/profiles"
STARTUP_DIR="$REPO_ROOT/startup"

# ── YAML field reader ─────────────────────────────────────────────────────────
# Usage: yaml_get "field_name" [file]
# Reads a top-level or nested key from a simple YAML file.
# Only handles "key: value" lines (no arrays, no multiline).
yaml_get() {
  local key="$1"
  local file="${2:-$INDEX_FILE}"
  [[ -f "$file" ]] || { echo ""; return; }
  grep -m1 "^[[:space:]]*${key}:" "$file" \
    | sed 's/^[^:]*:[[:space:]]*//' \
    | sed 's/[[:space:]]*#.*//' \
    | tr -d '"' \
    | tr -d "'"
}

# ── Index existence check ─────────────────────────────────────────────────────
require_index() {
  if [[ ! -f "$INDEX_FILE" ]]; then
    error "No startup/index.yml found."
    dim "  Run /startup-vision in Claude Code to initialise your startup plan."
    exit 1
  fi
}

# ── Profile list ──────────────────────────────────────────────────────────────
VALID_PROFILES=(base saas marketplace b2b consumer hardware)

is_valid_profile() {
  local p="$1"
  for v in "${VALID_PROFILES[@]}"; do
    [[ "$v" == "$p" ]] && return 0
  done
  return 1
}
