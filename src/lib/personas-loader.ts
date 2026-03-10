import type { Persona, TechSavviness } from '@/types/personas'

// Load personas.json at build time
const personaFiles = import.meta.glob('/startup/personas/personas.json', {
  eager: true,
}) as Record<string, { default: unknown }>

const VALID_TECH_SAVVINESS: TechSavviness[] = ['Low', 'Medium', 'High', 'Very High']

function isValidTechSavviness(value: unknown): value is TechSavviness {
  return typeof value === 'string' && VALID_TECH_SAVVINESS.includes(value as TechSavviness)
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

/**
 * Validate and coerce a raw JSON object into a Persona.
 * Returns null if required fields are missing.
 */
function parsePersona(raw: unknown): Persona | null {
  if (!raw || typeof raw !== 'object') return null

  const obj = raw as Record<string, unknown>

  const id = typeof obj.id === 'string' ? obj.id.trim() : ''
  const name = typeof obj.name === 'string' ? obj.name.trim() : ''

  if (!id || !name) return null

  return {
    id,
    name,
    age: typeof obj.age === 'number' ? obj.age : 0,
    occupation: typeof obj.occupation === 'string' ? obj.occupation.trim() : '',
    location: typeof obj.location === 'string' ? obj.location.trim() : '',
    income: typeof obj.income === 'string' ? obj.income.trim() : '',
    techSavviness: isValidTechSavviness(obj.techSavviness)
      ? obj.techSavviness
      : 'Medium',
    description: typeof obj.description === 'string' ? obj.description.trim() : '',
    goals: toStringArray(obj.goals),
    painPoints: toStringArray(obj.painPoints),
    motivations: toStringArray(obj.motivations),
    preferredChannels: toStringArray(obj.preferredChannels),
    behaviors: toStringArray(obj.behaviors),
    quote: typeof obj.quote === 'string' ? obj.quote.trim() : '',
  }
}

/**
 * Load and validate all personas from startup/personas/personas.json.
 * Returns an empty array if the file doesn't exist or can't be parsed.
 */
export function loadPersonas(): Persona[] {
  const module = personaFiles['/startup/personas/personas.json']
  if (!module?.default) return []

  const raw = module.default
  if (!Array.isArray(raw)) return []

  return raw
    .map(parsePersona)
    .filter((p): p is Persona => p !== null)
}

export function hasPersonas(): boolean {
  return '/startup/personas/personas.json' in personaFiles
}

export function getPersonaById(id: string): Persona | null {
  return loadPersonas().find((p) => p.id === id) ?? null
}
