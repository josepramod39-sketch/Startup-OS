#!/usr/bin/env bash
# status.sh — print startup plan progress from startup/index.yml
# Usage: ./scripts/status.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

require_index

# ── Read index ────────────────────────────────────────────────────────────────
startup_name="$(yaml_get "name")"
startup_stage="$(yaml_get "stage")"
startup_industry="$(yaml_get "industry")"
active_profile="$(yaml_get "profile")"
last_updated="$(yaml_get "last_updated")"
next_step="$(yaml_get "next_step")"
completed="$(yaml_get "completed")"
total="$(yaml_get "total")"

# File presence — find block header then check next 5 lines for "present: true"
file_present() {
  local block="$1"
  grep -A5 "^  ${block}:" "$INDEX_FILE" | grep -q "present: true" && echo "true" || echo "false"
}

persona_count="$(yaml_get "count")"
canvas_sections="$(yaml_get "sections_complete")"
slides_done="$(yaml_get "slides_complete")"

overview_ok="$(file_present overview)"
canvas_ok="$(file_present lean_canvas)"
golden_ok="$(file_present golden_circle)"
personas_ok="$(file_present personas)"
vp_ok="$(file_present value_proposition)"
deck_ok="$(file_present pitch_deck)"

# ── Header ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Startup OS — Plan Status${RESET}"
dim "Last updated: ${last_updated:-unknown} · Profile: ${active_profile:-base}"
echo ""

# ── Startup info ──────────────────────────────────────────────────────────────
if [[ -n "$startup_name" ]]; then
  bold "  ${startup_name}"
  [[ -n "$startup_stage" ]]    && dim "  Stage: $startup_stage"
  [[ -n "$startup_industry" ]] && dim "  Industry: $startup_industry"
  echo ""
fi

# ── Progress bar ──────────────────────────────────────────────────────────────
completed="${completed:-0}"
total="${total:-6}"
filled=$(( completed * 20 / total ))
empty=$(( 20 - filled ))
bar="$(printf '%0.s█' $(seq 1 $filled))$(printf '%0.s░' $(seq 1 $empty))"
echo -e "  ${BOLD}Progress${RESET}  ${GREEN}${bar}${RESET}  ${completed}/${total}"
echo ""

# ── File checklist ────────────────────────────────────────────────────────────
print_row() {
  local label="$1"
  local present="$2"
  local command="$3"
  local meta="${4:-}"

  if [[ "$present" == "true" ]]; then
    echo -e "  ${GREEN}✓${RESET}  ${BOLD}${label}${RESET}${meta:+  ${DIM}${meta}${RESET}}"
  else
    echo -e "  ${DIM}○${RESET}  ${label}  ${DIM}→ ${command}${RESET}"
  fi
}

print_row "Startup Vision"    "$overview_ok"  "/startup-vision"
print_row "Lean Canvas"       "$canvas_ok"    "/lean-canvas"    "${canvas_sections:+${canvas_sections}/9 sections}"
print_row "Golden Circle"     "$golden_ok"    "/golden-circle"
print_row "Personas"          "$personas_ok"  "/create-persona" "${persona_count:+${persona_count} persona(s)}"
print_row "Value Proposition" "$vp_ok"        "/value-proposition"
print_row "Pitch Deck"        "$deck_ok"      "/generate-pitch-deck" "${slides_done:+${slides_done}/10 slides}"

echo ""

# ── Next step ────────────────────────────────────────────────────────────────
if [[ -n "$next_step" && "$completed" -lt "$total" ]]; then
  info "Next step: ${BOLD}${next_step}${RESET}"
  dim "  Open Claude Code and run: ${next_step}"
elif [[ "$completed" -ge "$total" ]]; then
  success "Plan complete! Run ${BOLD}/export-startup${RESET} to package everything."
fi

echo ""
