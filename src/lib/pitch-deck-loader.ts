import type { PitchDeck, PitchSlide, PitchSlideId } from '@/types/startup'
import { normalizeMd } from '@/lib/utils'

// Load pitch-deck.md at build time
const pitchDeckFiles = import.meta.glob(
  '/startup/pitch-deck/pitch-deck.md',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

/**
 * Map a slide title (from `## Slide N: Title`) to a PitchSlideId.
 * Matches case-insensitively on the title portion.
 */
const SLIDE_ID_MAP: Array<{ pattern: RegExp; id: PitchSlideId }> = [
  { pattern: /^title$/i, id: 'title' },
  { pattern: /^problem$/i, id: 'problem' },
  { pattern: /^solution$/i, id: 'solution' },
  { pattern: /^value\s+proposition$/i, id: 'value-proposition' },
  { pattern: /^market\s+opportunity$/i, id: 'market-opportunity' },
  { pattern: /^business\s+model$/i, id: 'business-model' },
  { pattern: /^traction$/i, id: 'traction' },
  { pattern: /^go-?to-?market$/i, id: 'go-to-market' },
  { pattern: /^team$/i, id: 'team' },
  { pattern: /^ask$/i, id: 'ask' },
]

function resolveSlideId(title: string): PitchSlideId | null {
  const t = title.trim()
  for (const { pattern, id } of SLIDE_ID_MAP) {
    if (pattern.test(t)) return id
  }
  return null
}

/**
 * Parse startup/pitch-deck/pitch-deck.md into PitchDeck.
 *
 * Expected format:
 * # Pitch Deck
 * ## Slide 1: Title
 * ## Slide 2: Problem
 * ...
 * ## Slide 10: Ask
 */
export function parsePitchDeck(md: string): PitchDeck | null {
  if (!md?.trim()) return null

  try {
    const normalized = normalizeMd(md)

    // Split on ## Slide N: ... boundaries
    const slideRegex = /^## Slide \d+:\s*(.+)$/gm
    const slides: PitchSlide[] = []

    let match: RegExpExecArray | null
    const matches: Array<{ title: string; index: number }> = []

    while ((match = slideRegex.exec(normalized)) !== null) {
      matches.push({ title: match[1].trim(), index: match.index })
    }

    if (matches.length === 0) return null

    for (let i = 0; i < matches.length; i++) {
      const { title, index } = matches[i]
      const nextIndex = matches[i + 1]?.index ?? normalized.length

      // Content starts after the heading line
      const headingEnd = normalized.indexOf('\n', index)
      const content = normalized.slice(headingEnd + 1, nextIndex).trim()

      const id = resolveSlideId(title)
      if (!id) continue

      slides.push({ id, title, content })
    }

    if (slides.length === 0) return null

    return { slides }
  } catch {
    return null
  }
}

export function loadPitchDeck(): PitchDeck | null {
  const content = pitchDeckFiles['/startup/pitch-deck/pitch-deck.md']
  return content ? parsePitchDeck(content) : null
}

export function hasPitchDeck(): boolean {
  return '/startup/pitch-deck/pitch-deck.md' in pitchDeckFiles
}

export function getSlideById(deck: PitchDeck, id: PitchSlideId): PitchSlide | null {
  return deck.slides.find((s) => s.id === id) ?? null
}
