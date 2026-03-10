import type { GoldenCircle, GoldenCircleGTM } from '@/types/startup'
import { normalizeMd, parseH2Section, parseH3Section } from '@/lib/utils'

// Load golden-circle.md at build time
const goldenCircleFiles = import.meta.glob(
  '/startup/golden-circle/golden-circle.md',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

/**
 * Parse startup/golden-circle/golden-circle.md into GoldenCircle.
 *
 * Expected format:
 * # Golden Circle
 * ## Why
 * ## How
 * ## What
 * ## Go-to-Market Strategy
 * ### Target Market
 * ### Value Proposition
 * ### Pricing Strategy
 * ### Distribution Channels
 * ### Marketing Strategy
 * ### Key Metrics
 */
export function parseGoldenCircle(md: string): GoldenCircle | null {
  if (!md?.trim()) return null

  try {
    const normalized = normalizeMd(md)

    const why = parseH2Section(normalized, 'Why')
    const how = parseH2Section(normalized, 'How')
    const what = parseH2Section(normalized, 'What')

    if (!why && !how && !what) return null

    // Extract the GTM section block first, then parse sub-headings within it
    const gtmBlock = parseH2Section(normalized, 'Go-to-Market Strategy')

    const gtm: GoldenCircleGTM = {
      targetMarket: parseH3Section(gtmBlock, 'Target Market'),
      valueProposition: parseH3Section(gtmBlock, 'Value Proposition'),
      pricingStrategy: parseH3Section(gtmBlock, 'Pricing Strategy'),
      distributionChannels: parseH3Section(gtmBlock, 'Distribution Channels'),
      marketingStrategy: parseH3Section(gtmBlock, 'Marketing Strategy'),
      keyMetrics: parseH3Section(gtmBlock, 'Key Metrics'),
    }

    return { why, how, what, gtm }
  } catch {
    return null
  }
}

export function loadGoldenCircle(): GoldenCircle | null {
  const content = goldenCircleFiles['/startup/golden-circle/golden-circle.md']
  return content ? parseGoldenCircle(content) : null
}

export function hasGoldenCircle(): boolean {
  return '/startup/golden-circle/golden-circle.md' in goldenCircleFiles
}
