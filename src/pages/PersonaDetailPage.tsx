import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Banknote } from 'lucide-react'
import { getPersonaById } from '@/lib/personas-loader'
import { getPersonaInitials, TECH_SAVVINESS_COLORS, TECH_SAVVINESS_LEVELS } from '@/types/personas'
import { cn } from '@/lib/utils'

function BulletList({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PersonaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const persona = id ? getPersonaById(id) : null

  if (!persona) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-8">
        <p className="font-mono text-sm text-slate-400">Persona not found</p>
        <Link
          to="/personas"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to personas
        </Link>
      </div>
    )
  }

  const techIndex = TECH_SAVVINESS_LEVELS.indexOf(persona.techSavviness)
  const techPct = ((techIndex + 1) / TECH_SAVVINESS_LEVELS.length) * 100

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
      {/* Back */}
      <Link
        to="/personas"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All personas
      </Link>

      {/* Profile hero */}
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white dark:bg-slate-100 dark:text-slate-900">
          {getPersonaInitials(persona)}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {persona.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {persona.age > 0 ? `${persona.age} · ` : ''}{persona.occupation}
            </p>
          </div>
          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {persona.location && (
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <MapPin className="h-3 w-3" />
                {persona.location}
              </span>
            )}
            {persona.income && (
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <Banknote className="h-3 w-3" />
                {persona.income}
              </span>
            )}
            {persona.techSavviness && (
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium',
                  TECH_SAVVINESS_COLORS[persona.techSavviness],
                )}
              >
                {persona.techSavviness} tech savviness
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tech savviness bar */}
      {persona.techSavviness && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Tech Savviness
            </p>
            <span className="font-mono text-[10px] text-slate-400">{persona.techSavviness}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-900 dark:bg-slate-100 transition-all"
              style={{ width: `${techPct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between">
            {TECH_SAVVINESS_LEVELS.map((l) => (
              <span key={l} className="font-mono text-[9px] text-slate-300 dark:text-slate-700">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {persona.description && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            About
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {persona.description}
          </p>
        </div>
      )}

      {/* Quote */}
      {persona.quote && (
        <blockquote className="border-l-4 border-slate-900 pl-4 dark:border-slate-100">
          <p className="text-base font-medium italic text-slate-800 dark:text-slate-200">
            "{persona.quote}"
          </p>
          <footer className="mt-1 font-mono text-[11px] text-slate-400">— {persona.name}</footer>
        </blockquote>
      )}

      {/* Lists grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <BulletList items={persona.goals} label="Goals" />
        <BulletList items={persona.painPoints} label="Pain Points" />
        <BulletList items={persona.motivations} label="Motivations" />
        <BulletList items={persona.preferredChannels} label="Preferred Channels" />
        {persona.behaviors.length > 0 && (
          <div className="sm:col-span-2">
            <BulletList items={persona.behaviors} label="Behaviors" />
          </div>
        )}
      </div>
    </div>
  )
}
