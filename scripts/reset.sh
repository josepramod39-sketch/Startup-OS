#!/usr/bin/env bash
# reset.sh — clear the startup plan and start fresh
# Usage: ./scripts/reset.sh [--hard]
#
# Default (soft): removes startup/index.yml only — keeps your planning files.
# --hard:         removes everything in startup/ including all planning files.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

HARD=false
[[ "${1:-}" == "--hard" ]] && HARD=true

echo ""
bold "  Startup OS — Reset"
echo ""

# ── Nothing to reset ──────────────────────────────────────────────────────────
if [[ ! -d "$STARTUP_DIR" ]] || [[ -z "$(ls -A "$STARTUP_DIR" 2>/dev/null)" ]]; then
  info "Nothing to reset — startup/ is already empty."
  echo ""
  exit 0
fi

# ── Soft reset ────────────────────────────────────────────────────────────────
if [[ "$HARD" == false ]]; then
  echo -e "  ${YELLOW}Soft reset${RESET} — removes ${BOLD}startup/index.yml${RESET} only."
  dim "  Your planning files (lean canvas, personas, etc.) will be kept."
  dim "  Use --hard to remove everything."
  echo ""
  read -rp "  Continue? [y/N] " confirm
  echo ""
  [[ "$confirm" =~ ^[Yy]$ ]] || { info "Cancelled."; echo ""; exit 0; }

  if [[ -f "$INDEX_FILE" ]]; then
    rm "$INDEX_FILE"
    success "Removed startup/index.yml"
    dim "  Run /startup-vision in Claude Code to reinitialise the index."
  else
    info "No index file found — nothing removed."
  fi

# ── Hard reset ────────────────────────────────────────────────────────────────
else
  echo -e "  ${RED}${BOLD}Hard reset${RESET} — removes ALL files in ${BOLD}startup/${RESET}:"
  echo ""

  # List what will be deleted
  while IFS= read -r f; do
    dim "    $f"
  done < <(find "$STARTUP_DIR" -type f | sed "s|$REPO_ROOT/||")

  echo ""
  warn "This cannot be undone. Consider committing your work first."
  echo ""
  read -rp "  Type 'reset' to confirm: " confirm
  echo ""

  if [[ "$confirm" != "reset" ]]; then
    info "Cancelled."
    echo ""
    exit 0
  fi

  rm -rf "$STARTUP_DIR"
  mkdir -p "$STARTUP_DIR"
  success "startup/ cleared."
  dim "  Run /startup-vision in Claude Code to start a new plan."
fi

echo ""
