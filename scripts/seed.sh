#!/usr/bin/env bash
# seed.sh — write all 6 startup planning files with realistic fixture data
# Uses fictional SaaS startup: FlowSync
#
# Usage:
#   ./scripts/seed.sh          — seed startup/ (warns if files already exist)
#   ./scripts/seed.sh --wipe   — clear startup/ first, then seed

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

WIPE=false
[[ "${1:-}" == "--wipe" ]] && WIPE=true

TODAY="$(date +%Y-%m-%d)"

echo ""
bold "  Startup OS — Seed Demo Data"
dim "  Startup: FlowSync (SaaS / Productivity)"
echo ""

# ── Wipe if requested ─────────────────────────────────────────────────────────
if [[ "$WIPE" == true ]]; then
  warn "Wiping startup/ before seeding..."
  rm -rf "$STARTUP_DIR"
  success "startup/ cleared."
  echo ""
fi

# ── Guard: already seeded ─────────────────────────────────────────────────────
if [[ -f "$STARTUP_DIR/startup-overview.md" ]] && [[ "$WIPE" == false ]]; then
  warn "startup/startup-overview.md already exists."
  dim "  Use --wipe to overwrite: ./scripts/seed.sh --wipe"
  echo ""
  exit 0
fi

# ── Create directories ────────────────────────────────────────────────────────
mkdir -p \
  "$STARTUP_DIR/lean-canvas" \
  "$STARTUP_DIR/golden-circle" \
  "$STARTUP_DIR/personas" \
  "$STARTUP_DIR/value-proposition" \
  "$STARTUP_DIR/pitch-deck"

# ── 1. Startup Overview ───────────────────────────────────────────────────────
cat > "$STARTUP_DIR/startup-overview.md" <<'EOF'
# FlowSync

## Tagline
Project management for async-first remote teams who are drowning in Slack threads and missed context.

## Stage
validation

## Industry
SaaS / Productivity

## Problem
Remote teams lose hours every week to status-update meetings and scattered context across tools. Work decisions get made in Slack threads that disappear, leaving teammates out of the loop and managers without visibility. Existing project management tools were built for synchronous office environments and bolt-on async as an afterthought.

## Target Market
Product and engineering teams at Series A–B remote-first startups (20–150 employees) who have outgrown Notion + Slack but find Jira too heavy and process-driven for their pace.

## Team Size
2 co-founders
EOF
success "startup/startup-overview.md"

# ── 2. Lean Canvas ────────────────────────────────────────────────────────────
cat > "$STARTUP_DIR/lean-canvas/lean-canvas.md" <<'EOF'
# Lean Canvas

## Problem
Remote teams at high-growth startups waste 6–10 hours per week in status meetings and chasing context across Slack, Notion, and Linear. Decisions made in Slack threads become invisible to anyone not in the thread at that moment, creating misalignment and duplicated work. Managers lack a real-time view of what is actually blocked without scheduling a meeting.

## Customer Segments
Product managers and engineering leads at remote-first Series A–B startups with 20–150 employees. Early adopters: eng-led companies where the CTO or VP Eng owns tooling decisions and feels the pain of async coordination directly.

## Unique Value Proposition
FlowSync gives remote teams a single async command centre — decisions, blockers, and progress are visible to everyone without a meeting, so your team ships faster with less coordination overhead.

## Solution
Persistent decision threads that surface context alongside the task, not buried in Slack history. A daily async standup digest that aggregates blockers and progress automatically from your existing tools. A manager dashboard that shows team health, blockers, and momentum without requiring check-in meetings.

## Channels
Bottom-up PLG via a free tier targeted at individual PMs and eng leads. Integration listings on the Linear and Notion marketplaces. Content SEO targeting "async remote team management" and "remote engineering culture". Direct outreach to DevRel and Head of Remote communities on Twitter and LinkedIn.

## Revenue Streams
Freemium: free for up to 5 users with core async standup features. Pro plan at $12/seat/month for unlimited users, manager dashboard, and integrations. Team plan at $8/seat/month (annual, 10+ seats). Target ACV of $5,000–$15,000 for mid-market teams.

## Cost Structure
Team: 2 co-founder salaries. Infrastructure: cloud compute + storage at approximately $800/month at current scale, scaling linearly with MAU. CAC: estimated $180 self-serve, $600 assisted. Third-party integrations (Linear, Notion, Slack APIs). Legal and compliance (SOC 2 Type II planned for month 18).

## Key Metrics
MRR growth rate (target: 15% MoM in first year). Activation rate: % of signups who complete first async standup within 7 days (target: 40%). D30 retention (target: 65%). Team expansion rate: % of individual signups who invite 3+ teammates within 30 days (viral coefficient proxy).

## Unfair Advantage
Deep integrations with Linear and Notion that competitors cannot replicate without dedicated partnership agreements — we have early access to both beta APIs. Co-founder previously built async tooling at GitLab (3 years) and has direct relationships with 40+ remote engineering leaders who are design partners.
EOF
success "startup/lean-canvas/lean-canvas.md"

# ── 3. Golden Circle ──────────────────────────────────────────────────────────
cat > "$STARTUP_DIR/golden-circle/golden-circle.md" <<'EOF'
# Golden Circle

## Why
We believe that great work happens when people have clarity, not when they have more meetings. The best teams in the world are not the ones that communicate the most — they are the ones that communicate with the least friction.

## How
By making async the default rather than the fallback. FlowSync is built around the principle that context should travel with work, not sit in someone's memory or a Slack thread that disappears. Every feature is designed to reduce coordination overhead, not add another tool to manage.

## What
An async project management platform that replaces daily standups and status meetings with persistent decision threads, automated progress digests, and a real-time manager dashboard — all connected to the tools your team already uses.

## Go-to-Market Strategy

### Target Market
Remote-first product and engineering teams at Series A–B startups with 20–150 employees. The ideal early adopter is an engineering lead or VP of Product at a company where the team is distributed across 3+ time zones and the cost of synchronous coordination is felt daily. They have already tried and outgrown Notion + Slack as a coordination system.

### Value Proposition
FlowSync reduces the coordination tax on remote teams by making work context visible and decisions permanent — without requiring anyone to be online at the same time. Teams using FlowSync report replacing 4–6 hours of status meetings per week with a 10-minute async digest review.

### Pricing Strategy
Freemium with a self-serve upgrade trigger. Free tier: up to 5 users, 1 project, core async standup. Pro tier: $12/seat/month (monthly) or $96/seat/year (33% discount). Team tier: $8/seat/month billed annually for 10+ seats. Enterprise: custom pricing with SSO, audit logs, and dedicated onboarding. Upgrade prompt triggered at team invitation (users hitting the 5-seat wall) and at manager dashboard access (gated to Pro).

### Distribution Channels
Primary: product-led growth via free tier and team viral loop (inviting teammates). Secondary: integration marketplace listings (Linear App Store, Notion Integrations). Tertiary: content SEO for "async standup tool", "remote engineering management", and "no-meeting startup". Outbound for companies with 50+ employees identified through LinkedIn Sales Navigator.

### Marketing Strategy
Founder-led content on LinkedIn and Twitter targeting remote engineering leaders — weekly posts on async culture, remote team health, and no-meeting frameworks. A public benchmark report on "The State of Async Work" (published annually, drives backlinks and signups). Partnerships with remote-first communities: Remote First Institute, No Meeting Fridays community, and Running Remote conference.

### Key Metrics
CAC (target: <$200 self-serve, <$800 assisted). LTV:CAC ratio (target: >3:1 within 12 months of customer cohort). Activation rate (target: 40% complete first async standup within 7 days). NPS (target: >50 at 90 days). MRR and MRR growth rate (primary north star). Team expansion rate (% of individual signups who grow to 3+ seats within 60 days).
EOF
success "startup/golden-circle/golden-circle.md"

# ── 4. Personas ───────────────────────────────────────────────────────────────
cat > "$STARTUP_DIR/personas/personas.json" <<'EOF'
[
  {
    "id": "maya-patel",
    "name": "Maya Patel",
    "age": 32,
    "occupation": "Senior Product Manager",
    "location": "Austin, TX (remote team across 4 time zones)",
    "income": "$135,000",
    "techSavviness": "High",
    "description": "Maya leads product at a 60-person Series B fintech startup. Her team of 4 PMs and 18 engineers is fully remote across the US and Eastern Europe. She spends her mornings in a wall of Slack notifications and her afternoons in status update meetings she knows she could replace with a better async system.",
    "goals": [
      "Ship product faster without sacrificing team alignment",
      "Replace weekly status meetings with a system that keeps everyone informed asynchronously",
      "Have real-time visibility into what is blocked across squads without scheduling a check-in",
      "Build a culture where engineers feel trusted and autonomous, not micromanaged"
    ],
    "painPoints": [
      "Decisions made in Slack threads are invisible to anyone not in the channel at the time — context is constantly lost",
      "Daily standups with distributed engineers mean someone is always joining at 7am or 9pm",
      "Linear and Notion are both in use but there is no single view of what is actually in flight",
      "She spends 90 minutes every Friday manually compiling a status update for the VP of Engineering"
    ],
    "motivations": [
      "Being recognised as the PM who unlocked her team's velocity, not the one who added more process",
      "Building products that engineers respect and enjoy using",
      "Getting home in time for dinner without feeling like she missed something critical"
    ],
    "preferredChannels": [
      "Slack (reluctantly — it is where the team already is)",
      "Linear for task management",
      "Twitter and LinkedIn for discovering new tools and remote work content",
      "Word of mouth from trusted peers in her PM community"
    ],
    "behaviors": [
      "Evaluates new tools by trialling them solo before proposing to the team",
      "Reads async/remote work content from leaders at GitLab, Basecamp, and Doist",
      "Participates in 2–3 PM Slack communities where she asks for tool recommendations",
      "Cancels recurring meetings regularly — her calendar is a constant battle against status updates"
    ],
    "quote": "I don't need another place to write things down. I need the things I already wrote to actually reach the right people without me having to manually route them."
  },
  {
    "id": "jordan-kim",
    "name": "Jordan Kim",
    "age": 38,
    "occupation": "VP of Engineering",
    "location": "Brooklyn, NY (leads 35-person fully distributed team)",
    "income": "$210,000",
    "techSavviness": "Very High",
    "description": "Jordan runs engineering at a 120-person Series B SaaS company. She inherited a culture of too many meetings from the previous CTO and is on a mission to reduce coordination overhead without losing alignment. She has budget authority for tooling decisions and signs contracts under $30k without escalation.",
    "goals": [
      "Cut the number of synchronous meetings by 50% without losing team cohesion",
      "Have a clear view of team health, morale, and blockers across 6 squads without being in every standup",
      "Reduce onboarding time for new engineers from 3 weeks to 1 week by making context discoverable",
      "Retain senior engineers who are burning out from coordination overhead"
    ],
    "painPoints": [
      "She attends 8–12 standups per week across squads just to know what is blocked — this is not scalable",
      "When an engineer leaves, their context leaves with them — there is no persistent decision log",
      "The board asks for engineering velocity metrics and she has to manually assemble them from Linear and Jira",
      "Remote engineers in Europe are excluded from important decisions made in ad-hoc Slack calls at 2pm EST"
    ],
    "motivations": [
      "Being the engineering leader who demonstrably improved team output without burning people out",
      "Building systems and culture that outlast her tenure",
      "Spending her time on architecture and hiring, not coordination and status updates"
    ],
    "preferredChannels": [
      "Direct outreach from respected peers or founders she already knows",
      "Engineering leadership communities (Rands Leadership Slack, CTO Craft)",
      "Conference talks and case studies from companies like GitLab and Basecamp",
      "LinkedIn for professional content — she reads but rarely posts"
    ],
    "behaviors": [
      "Evaluates tools based on integration quality first — will not adopt anything that creates a new silo",
      "Runs a structured 2-week pilot with a single squad before rolling out company-wide",
      "Asks her team for feedback before making a tooling decision — does not impose tools top-down",
      "Reads engineering culture blogs from Will Larson, Camille Fournier, and Lara Hogan weekly"
    ],
    "quote": "I'm not paying for another dashboard I have to manually feed. If it doesn't integrate with Linear and pull its own data, I'm not interested."
  }
]
EOF
success "startup/personas/personas.json"

# ── 5. Value Proposition ──────────────────────────────────────────────────────
cat > "$STARTUP_DIR/value-proposition/value-proposition.md" <<'EOF'
# Value Proposition Canvas

## Customer Profile

### Customer Jobs
- Coordinate work across a distributed team without requiring everyone to be online at the same time
- Keep stakeholders informed on project status without spending hours compiling manual updates
- Surface blockers quickly so engineers are never stuck waiting for decisions
- Make decisions visible and permanent so new team members can understand the reasoning behind past choices
- Prove engineering team velocity and health to leadership without vanity metrics

### Customer Gains
- Ship faster by removing the synchronous bottleneck from daily coordination
- Get their Friday afternoons back — no more manual status report compilation
- Trust that their team is aligned without being in every meeting
- Attract and retain engineers who value autonomy and async culture
- Have a single source of truth for decisions that survives team turnover

### Customer Pains
- Decisions and context buried in Slack threads that disappear after 90 days on free plan
- Status meetings that interrupt deep work for every engineer on the team
- No visibility into cross-squad blockers without scheduling a dedicated check-in
- New engineers spending weeks catching up on decisions made before they joined
- European timezone engineers excluded from decisions made in afternoon Slack calls

## Value Map

### Products & Services
- Async standup digest — automatically aggregates daily progress and blockers from Linear and Notion into a single readable summary, delivered at each team member's preferred time
- Persistent decision threads — every significant decision lives in a searchable, linked thread attached to the relevant project, not in someone's Slack DMs
- Manager health dashboard — real-time view of blockers, team velocity, and squad momentum without attending standups

### Gain Creators
- Saves 4–6 hours per week in status meetings by replacing synchronous standups with async digests that take 10 minutes to review
- Eliminates manual status report compilation by auto-generating weekly summaries from connected tools
- Makes the team timezone-independent for coordination — engineers in Europe contribute on equal footing with those in US timezones
- Speeds up new engineer onboarding by making all past decisions searchable and discoverable

### Pain Relievers
- Replaces ephemeral Slack threads with persistent decision records that survive team turnover and Slack message limits
- Removes the need for daily synchronous standups by delivering the same information asynchronously at each person's preferred time
- Surfaces cross-squad blockers in the manager dashboard without requiring the manager to attend every squad standup
- Connects to Linear and Notion so there is no new data entry — context is pulled automatically from where work already lives
EOF
success "startup/value-proposition/value-proposition.md"

# ── 6. Pitch Deck ─────────────────────────────────────────────────────────────
cat > "$STARTUP_DIR/pitch-deck/pitch-deck.md" <<'EOF'
# Pitch Deck

## Slide 1: Title
**Company:** FlowSync
**Tagline:** Project management for async-first remote teams
**Presenter:** Priya Nair & Arjun Mehta, Co-Founders
**Date:** March 2026

## Slide 2: Problem
Remote teams at high-growth startups are spending 6–10 hours per week in status update meetings — not because they want to, but because their tools make async coordination impossible.

**Key pain points:**
- Decisions made in Slack threads are invisible to anyone not present — context is constantly lost
- Daily standups require engineers across time zones to join at inconvenient hours, fragmenting deep work
- No single view of what is blocked across teams without scheduling a dedicated check-in meeting
- When engineers leave, their context leaves with them — there is no persistent decision record

## Slide 3: Solution
FlowSync replaces status meetings with a persistent async command centre — decisions, blockers, and progress are visible to everyone without requiring anyone to be online at the same time.

**How it works:**
- Connects to Linear and Notion to automatically pull daily progress and blockers into a readable async standup digest
- Every significant decision is captured in a persistent thread linked to the relevant project — searchable, not ephemeral
- Managers get a real-time health dashboard showing blockers and team velocity across all squads without attending a single standup

## Slide 4: Value Proposition
**Headline:** Ship faster by removing the synchronous bottleneck from your team's coordination.

Teams using FlowSync replace 4–6 hours of weekly status meetings with a 10-minute async digest review. Engineers stay in deep work. Managers stay informed. Decisions stay permanent. The result is a team that moves faster with less overhead — not despite being remote, but because of how they are set up to work.

## Slide 5: Market Opportunity
**Target market:** Product and engineering teams at remote-first Series A–C startups globally with 20–500 employees
**Market size:** 180,000 remote-first tech startups globally (Crunchbase, 2025). Average team size of 45 employees at target stage. At $96/seat/year, SAM is approximately $780M. Current tooling spend on project management per remote team averages $4,200/year — FlowSync targets a 3× premium on incumbent tools through async-native positioning.

## Slide 6: Business Model
**Revenue model:** Freemium SaaS with seat-based subscription
**Pricing:** Free (up to 5 users) → Pro at $12/seat/month → Team at $8/seat/month (annual, 10+ seats) → Enterprise custom
**Key revenue streams:** Pro and Team subscriptions (primary). Enterprise contracts with SSO and audit logs (year 2). Integration marketplace revenue share with Linear and Notion (year 2).

## Slide 7: Traction
Currently in private beta with 12 design partner companies (total 380 users across 28 teams). Key metrics after 90 days of beta: 67% D30 retention (vs 40% target), 4.2 average team expansion rate (individual signups growing to 4+ seat teams), NPS of 61. Three design partners have pre-committed to paid plans at $8/seat/month annual. Waitlist of 840 teams from content and word-of-mouth. Integration partnership agreement signed with Linear (in Linear App Store from April 2026).

## Slide 8: Go-to-Market
**Primary channel:** Product-led growth — free tier drives individual signups; team viral loop (inviting teammates) drives expansion to paid
**Strategy:** Launch on Product Hunt in April 2026 targeting #1 Product of the Day in the Productivity category. Activate design partner case studies for SEO and social proof. Linear App Store listing drives warm inbound from engineering teams. Founder content on LinkedIn and Twitter targeting VP Engineering and Head of Remote audiences (combined reach: 28,000 followers).
**Milestones:** 500 paying teams by end of Q3 2026. $40k MRR by end of 2026. Linear App Store top 10 productivity integration by June 2026.

## Slide 9: Team
Priya Nair — CEO & Co-Founder. Previously Product Lead at GitLab (Remote Work Platform team, 2021–2024). Built async tooling used by 3,000+ GitLab team members. Stanford CS, MBA from Wharton.
Arjun Mehta — CTO & Co-Founder. Previously Staff Engineer at Notion (integrations platform, 2020–2024). Architected Notion's public API used by 400,000+ developers. IIT Bombay, MS Stanford.

## Slide 10: Ask
**Raising:** $2.5M pre-seed
**Use of funds:** Engineering (2 senior full-stack hires, 18 months runway) — 55%. GTM (content, PLG infrastructure, first sales hire at month 12) — 25%. Operations and legal (SOC 2 Type II, entity, finance) — 20%.
**Vision:** In 3 years, FlowSync is the default coordination layer for remote engineering teams at 10,000+ companies globally — the tool that finally made async work not just possible but preferable to being in the office.
EOF
success "startup/pitch-deck/pitch-deck.md"

# ── 7. Index ──────────────────────────────────────────────────────────────────
cat > "$INDEX_FILE" <<EOF
# Auto-generated by Startup OS. Do not edit manually.
version: 1
last_updated: "${TODAY}"
profile: saas

startup:
  name: "FlowSync"
  stage: "validation"
  industry: "SaaS / Productivity"

files:
  overview:
    path: startup/startup-overview.md
    present: true
  lean_canvas:
    path: startup/lean-canvas/lean-canvas.md
    present: true
    sections_complete: 9
    sections_total: 9
  golden_circle:
    path: startup/golden-circle/golden-circle.md
    present: true
  personas:
    path: startup/personas/personas.json
    present: true
    count: 2
  value_proposition:
    path: startup/value-proposition/value-proposition.md
    present: true
  pitch_deck:
    path: startup/pitch-deck/pitch-deck.md
    present: true
    slides_complete: 10
    slides_total: 10

progress:
  completed: 6
  total: 6
  next_step: /export-startup
EOF
success "startup/index.yml"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
bold "  Done. 7 files written:"
dim "  startup/startup-overview.md"
dim "  startup/lean-canvas/lean-canvas.md"
dim "  startup/golden-circle/golden-circle.md"
dim "  startup/personas/personas.json        (2 personas: Maya Patel, Jordan Kim)"
dim "  startup/value-proposition/value-proposition.md"
dim "  startup/pitch-deck/pitch-deck.md      (10 slides)"
dim "  startup/index.yml                     (progress: 6/6, profile: saas)"
echo ""
info "Run ${BOLD}npm run dev${RESET} to open the viewer — all 6 pages should render."
echo ""
