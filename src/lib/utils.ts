import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =============================================================================
// Markdown parsing utilities — shared by all loaders
// =============================================================================

/**
 * Normalize line endings to LF.
 */
export function normalizeMd(md: string): string {
  return md.replace(/\r\n/g, '\n').trim()
}

/**
 * Extract content under a `## Heading` section.
 * Returns trimmed text between this heading and the next `##` (or end of file).
 */
export function parseH2Section(md: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(
    `##\\s+${escaped}\\s*\\n+([\\s\\S]*?)(?=\\n##\\s|\\n#[^#]|$)`,
  )
  const match = md.match(regex)
  return match?.[1]?.trim() ?? ''
}

/**
 * Extract content under a `### Sub-heading` section.
 * Returns trimmed text between this sub-heading and the next `###` or `##`.
 */
export function parseH3Section(md: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(
    `###\\s+${escaped}\\s*\\n+([\\s\\S]*?)(?=\\n###\\s|\\n##\\s|\\n#[^#]|$)`,
  )
  const match = md.match(regex)
  return match?.[1]?.trim() ?? ''
}

/**
 * Parse a markdown bullet list into an array of strings.
 * Handles `- item` and `* item` patterns. Ignores blank lines.
 */
export function parseBulletList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') || line.startsWith('* '))
    .map((line) => line.slice(2).trim())
    .filter((item) => item.length > 0)
}

/**
 * Extract the value of a bold key in markdown.
 * e.g. `**Company:** Acme` → `"Acme"`
 */
export function parseBoldField(text: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\*\\*${escaped}:\\*\\*\\s*(.+)`)
  const match = text.match(regex)
  return match?.[1]?.trim() ?? ''
}
