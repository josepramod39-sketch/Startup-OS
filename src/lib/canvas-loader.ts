import type { LeanCanvas } from '@/types/startup'
import { normalizeMd, parseH2Section } from '@/lib/utils'

// Load lean-canvas.md at build time
const canvasFiles = import.meta.glob('/startup/lean-canvas/lean-canvas.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse startup/lean-canvas/lean-canvas.md into LeanCanvas.
 *
 * Expected format — each section is a ## heading:
 * # Lean Canvas
 * ## Problem
 * ## Customer Segments
 * ## Unique Value Proposition
 * ## Solution
 * ## Channels
 * ## Revenue Streams
 * ## Cost Structure
 * ## Key Metrics
 * ## Unfair Advantage
 */
export function parseLeanCanvas(md: string): LeanCanvas | null {
  if (!md?.trim()) return null

  try {
    const normalized = normalizeMd(md)

    const problem = parseH2Section(normalized, 'Problem')
    const customerSegments = parseH2Section(normalized, 'Customer Segments')
    const uniqueValueProposition = parseH2Section(normalized, 'Unique Value Proposition')
    const solution = parseH2Section(normalized, 'Solution')
    const channels = parseH2Section(normalized, 'Channels')
    const revenueStreams = parseH2Section(normalized, 'Revenue Streams')
    const costStructure = parseH2Section(normalized, 'Cost Structure')
    const keyMetrics = parseH2Section(normalized, 'Key Metrics')
    const unfairAdvantage = parseH2Section(normalized, 'Unfair Advantage')

    // Require at least one meaningful section to return a non-null result
    if (!problem && !customerSegments && !uniqueValueProposition) return null

    return {
      problem,
      customerSegments,
      uniqueValueProposition,
      solution,
      channels,
      revenueStreams,
      costStructure,
      keyMetrics,
      unfairAdvantage,
    }
  } catch {
    return null
  }
}

export function loadLeanCanvas(): LeanCanvas | null {
  const content = canvasFiles['/startup/lean-canvas/lean-canvas.md']
  return content ? parseLeanCanvas(content) : null
}

export function hasLeanCanvas(): boolean {
  return '/startup/lean-canvas/lean-canvas.md' in canvasFiles
}

/**
 * Returns the number of non-empty sections in the canvas (out of 9).
 */
export function getLeanCanvasCompletionCount(canvas: LeanCanvas): number {
  return Object.values(canvas).filter((v) => v.trim().length > 0).length
}
