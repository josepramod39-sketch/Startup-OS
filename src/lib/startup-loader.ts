import type { StartupOverview, StartupStage } from '@/types/startup'
import { normalizeMd, parseH2Section } from '@/lib/utils'

// Load startup-overview.md at build time
const overviewFiles = import.meta.glob('/startup/startup-overview.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const VALID_STAGES: StartupStage[] = ['ideation', 'validation', 'prototyping']

function parseStage(raw: string): StartupStage {
  const normalized = raw.toLowerCase().trim() as StartupStage
  return VALID_STAGES.includes(normalized) ? normalized : 'ideation'
}

/**
 * Parse startup/startup-overview.md into StartupOverview.
 *
 * Expected format:
 * # [Startup Name]
 *
 * ## Tagline
 * [one-line tagline]
 *
 * ## Stage
 * [ideation | validation | prototyping]
 *
 * ## Industry
 * [industry]
 *
 * ## Problem
 * [problem description]
 *
 * ## Target Market
 * [target market description]
 *
 * ## Team Size
 * [team size]
 */
export function parseStartupOverview(md: string): StartupOverview | null {
  if (!md?.trim()) return null

  try {
    const normalized = normalizeMd(md)

    const nameMatch = normalized.match(/^#\s+(.+)$/m)
    const name = nameMatch?.[1]?.trim() ?? ''

    if (!name) return null

    const tagline = parseH2Section(normalized, 'Tagline')
    const stageRaw = parseH2Section(normalized, 'Stage')
    const industry = parseH2Section(normalized, 'Industry')
    const problem = parseH2Section(normalized, 'Problem')
    const targetMarket = parseH2Section(normalized, 'Target Market')
    const teamSize = parseH2Section(normalized, 'Team Size')

    return {
      name,
      tagline,
      stage: parseStage(stageRaw),
      industry,
      problem,
      targetMarket,
      teamSize,
    }
  } catch {
    return null
  }
}

export function loadStartupOverview(): StartupOverview | null {
  const content = overviewFiles['/startup/startup-overview.md']
  return content ? parseStartupOverview(content) : null
}

export function hasStartupOverview(): boolean {
  return '/startup/startup-overview.md' in overviewFiles
}
