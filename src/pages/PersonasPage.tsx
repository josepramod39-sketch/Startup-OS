import { Link } from 'react-router-dom'
import { Users, MapPin, ArrowRight } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import { loadPersonas } from '@/lib/personas-loader'
import { getPersonaInitials, TECH_SAVVINESS_COLORS } from '@/types/personas'
import { cn } from '@/lib/utils'

export default function PersonasPage() {
  const personas = loadPersonas()

  if (personas.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No personas yet"
        description="Build detailed customer profiles to guide your product, messaging, and channel decisions."
        command="/create-persona"
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Personas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {personas.length} target customer{personas.length !== 1 ? 's' : ''} defined
          </p>
        </div>
        <code className="mt-1 font-mono text-[11px] text-slate-400">/create-persona</code>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {personas.map((persona) => (
          <Link
            key={persona.id}
            to={`/personas/${persona.id}`}
            className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Avatar + name */}
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                {getPersonaInitials(persona)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {persona.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {persona.age > 0 ? `${persona.age} · ` : ''}{persona.occupation}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-700" />
            </div>

            {/* Location + tech */}
            <div className="flex flex-wrap items-center gap-2">
              {persona.location && (
                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {persona.location}
                </span>
              )}
              {persona.techSavviness && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] font-medium',
                    TECH_SAVVINESS_COLORS[persona.techSavviness],
                  )}
                >
                  {persona.techSavviness} tech
                </span>
              )}
            </div>

            {/* Quote */}
            {persona.quote && (
              <p className="line-clamp-2 text-xs italic leading-relaxed text-slate-500 dark:text-slate-400 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                "{persona.quote}"
              </p>
            )}

            {/* Goals preview */}
            {persona.goals.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Goals
                </p>
                <ul className="space-y-0.5">
                  {persona.goals.slice(0, 2).map((goal, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                      <span className="line-clamp-1">{goal}</span>
                    </li>
                  ))}
                  {persona.goals.length > 2 && (
                    <li className="font-mono text-[10px] text-slate-400 pl-2.5">
                      +{persona.goals.length - 2} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
