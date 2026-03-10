/**
 * Startup Lab — Persona Types
 *
 * Mirrors the JSON format in startup/personas/personas.json
 */

// =============================================================================
// Persona  (startup/personas/personas.json — array of these)
// =============================================================================

export type TechSavviness = 'Low' | 'Medium' | 'High' | 'Very High'

export interface Persona {
  /** Slug-based unique ID derived from name, e.g. "sarah-chen" */
  id: string
  name: string
  age: number
  occupation: string
  location: string
  income: string
  techSavviness: TechSavviness
  /** 2-3 sentence description of who this person is in their context */
  description: string
  goals: string[]
  painPoints: string[]
  motivations: string[]
  preferredChannels: string[]
  behaviors: string[]
  /** A direct quote in their voice about the problem being solved */
  quote: string
}

// =============================================================================
// Derived / display helpers
// =============================================================================

export function getPersonaInitials(persona: Persona): string {
  return persona.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isPersonaComplete(persona: Persona): boolean {
  return (
    persona.name.trim().length > 0 &&
    persona.occupation.trim().length > 0 &&
    persona.goals.length >= 1 &&
    persona.painPoints.length >= 1
  )
}

export const TECH_SAVVINESS_LEVELS: TechSavviness[] = [
  'Low',
  'Medium',
  'High',
  'Very High',
]

export const TECH_SAVVINESS_COLORS: Record<TechSavviness, string> = {
  'Low': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'High': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Very High': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
}
