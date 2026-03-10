import type { CustomerProfile, ValueMap, ValueProposition } from '@/types/startup'
import { normalizeMd, parseH2Section, parseH3Section, parseBulletList } from '@/lib/utils'

// Load value-proposition.md at build time
const valuePropFiles = import.meta.glob(
  '/startup/value-proposition/value-proposition.md',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

/**
 * Parse startup/value-proposition/value-proposition.md into ValueProposition.
 *
 * Expected format:
 * # Value Proposition Canvas
 * ## Customer Profile
 * ### Customer Jobs
 * ### Customer Gains
 * ### Customer Pains
 * ## Value Map
 * ### Products & Services
 * ### Gain Creators
 * ### Pain Relievers
 */
export function parseValueProposition(md: string): ValueProposition | null {
  if (!md?.trim()) return null

  try {
    const normalized = normalizeMd(md)

    const customerProfileBlock = parseH2Section(normalized, 'Customer Profile')
    const valueMapBlock = parseH2Section(normalized, 'Value Map')

    if (!customerProfileBlock && !valueMapBlock) return null

    const customerProfile: CustomerProfile = {
      customerJobs: parseBulletList(parseH3Section(customerProfileBlock, 'Customer Jobs')),
      customerGains: parseBulletList(parseH3Section(customerProfileBlock, 'Customer Gains')),
      customerPains: parseBulletList(parseH3Section(customerProfileBlock, 'Customer Pains')),
    }

    const valueMap: ValueMap = {
      products: parseBulletList(parseH3Section(valueMapBlock, 'Products & Services')),
      gainCreators: parseBulletList(parseH3Section(valueMapBlock, 'Gain Creators')),
      painRelievers: parseBulletList(parseH3Section(valueMapBlock, 'Pain Relievers')),
    }

    return { customerProfile, valueMap }
  } catch {
    return null
  }
}

export function loadValueProposition(): ValueProposition | null {
  const content = valuePropFiles['/startup/value-proposition/value-proposition.md']
  return content ? parseValueProposition(content) : null
}

export function hasValueProposition(): boolean {
  return '/startup/value-proposition/value-proposition.md' in valuePropFiles
}

/**
 * Returns a fit score: how many customer pains have a matching pain reliever
 * and how many gains have a matching gain creator (out of total pains + gains).
 */
export function getValuePropFitScore(vp: ValueProposition): {
  coveredPains: number
  totalPains: number
  coveredGains: number
  totalGains: number
} {
  return {
    coveredPains: Math.min(vp.valueMap.painRelievers.length, vp.customerProfile.customerPains.length),
    totalPains: vp.customerProfile.customerPains.length,
    coveredGains: Math.min(vp.valueMap.gainCreators.length, vp.customerProfile.customerGains.length),
    totalGains: vp.customerProfile.customerGains.length,
  }
}
