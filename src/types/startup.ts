/**
 * Startup Lab — Core Types
 *
 * These interfaces mirror the exact file formats defined in agents.md.
 * Loaders in src/lib/ parse markdown/JSON into these shapes.
 */

// =============================================================================
// Startup Overview  (startup/startup-overview.md)
// =============================================================================

export type StartupStage = 'ideation' | 'validation' | 'prototyping'

export interface StartupOverview {
  name: string
  tagline: string
  stage: StartupStage
  industry: string
  problem: string
  targetMarket: string
  teamSize: string
}

// =============================================================================
// Lean Canvas  (startup/lean-canvas/lean-canvas.md)
// =============================================================================

export interface LeanCanvas {
  problem: string
  customerSegments: string
  uniqueValueProposition: string
  solution: string
  channels: string
  revenueStreams: string
  costStructure: string
  keyMetrics: string
  unfairAdvantage: string
}

export type LeanCanvasSection = keyof LeanCanvas

export const LEAN_CANVAS_SECTION_LABELS: Record<LeanCanvasSection, string> = {
  problem: 'Problem',
  customerSegments: 'Customer Segments',
  uniqueValueProposition: 'Unique Value Proposition',
  solution: 'Solution',
  channels: 'Channels',
  revenueStreams: 'Revenue Streams',
  costStructure: 'Cost Structure',
  keyMetrics: 'Key Metrics',
  unfairAdvantage: 'Unfair Advantage',
}

export const LEAN_CANVAS_SECTION_ORDER: LeanCanvasSection[] = [
  'problem',
  'customerSegments',
  'uniqueValueProposition',
  'solution',
  'channels',
  'revenueStreams',
  'costStructure',
  'keyMetrics',
  'unfairAdvantage',
]

// =============================================================================
// Golden Circle  (startup/golden-circle/golden-circle.md)
// =============================================================================

export interface GoldenCircle {
  why: string
  how: string
  what: string
  gtm: GoldenCircleGTM
}

export interface GoldenCircleGTM {
  targetMarket: string
  valueProposition: string
  pricingStrategy: string
  distributionChannels: string
  marketingStrategy: string
  keyMetrics: string
}

// =============================================================================
// Value Proposition Canvas  (startup/value-proposition/value-proposition.md)
// =============================================================================

export interface CustomerProfile {
  customerJobs: string[]
  customerGains: string[]
  customerPains: string[]
}

export interface ValueMap {
  products: string[]
  gainCreators: string[]
  painRelievers: string[]
}

export interface ValueProposition {
  customerProfile: CustomerProfile
  valueMap: ValueMap
}

// =============================================================================
// Pitch Deck  (startup/pitch-deck/pitch-deck.md)
// =============================================================================

export type PitchSlideId =
  | 'title'
  | 'problem'
  | 'solution'
  | 'value-proposition'
  | 'market-opportunity'
  | 'business-model'
  | 'traction'
  | 'go-to-market'
  | 'team'
  | 'ask'

export interface PitchSlide {
  id: PitchSlideId
  title: string
  /** Raw markdown content of this slide section */
  content: string
}

export interface PitchDeck {
  slides: PitchSlide[]
}

// =============================================================================
// Combined Startup Data
// =============================================================================

export interface StartupData {
  overview: StartupOverview | null
  leanCanvas: LeanCanvas | null
  goldenCircle: GoldenCircle | null
  valueProposition: ValueProposition | null
  pitchDeck: PitchDeck | null
}

// =============================================================================
// Completion / Progress
// =============================================================================

export interface FrameworkStatus {
  id: string
  label: string
  description: string
  isComplete: boolean
  command: string
  stage: 1 | 2 | 3
}

export interface StageProgress {
  stage: 1 | 2 | 3
  label: string
  frameworks: FrameworkStatus[]
  completedCount: number
  totalCount: number
}
