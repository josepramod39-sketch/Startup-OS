import { Link } from 'react-router-dom'
import {
  FlaskConical,
  LayoutGrid,
  Circle,
  Users,
  Layers,
  Presentation,
  Download,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { loadStartupOverview, hasStartupOverview } from '@/lib/startup-loader'
import { hasLeanCanvas, getLeanCanvasCompletionCount, loadLeanCanvas } from '@/lib/canvas-loader'
import { hasGoldenCircle } from '@/lib/golden-circle-loader'
import { hasPersonas, loadPersonas } from '@/lib/personas-loader'
import { hasValueProposition } from '@/lib/value-prop-loader'
import { hasPitchDeck } from '@/lib/pitch-deck-loader'
import type { StartupStage } from '@/types/startup'

// ─── Framework card ──────────────────────────────────────────────────────────

interface FrameworkCardProps {
  label: string
  description: string
  to: string
  command: string
  done: boolean
  meta?: string
  icon: React.ReactNode
  accentClass: string
}

function FrameworkCard({
  label,
  description,
  to,
  command,
  done,
  meta,
  icon,
  accentClass,
}: FrameworkCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border p-5 transition-all hover:shadow-sm',
        done
          ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          : 'border-dashed border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60',
      )}
    >
      {/* Icon + status */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            done ? accentClass : 'bg-slate-100 dark:bg-slate-800',
          )}
        >
          <span className={cn(done ? 'text-white' : 'text-slate-400 dark:text-slate-500')}>
            {icon}
          </span>
        </div>
        {done ? (
          <CheckCircle2 className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        ) : (
          <code className="font-mono text-[10px] text-slate-300 dark:text-slate-700">
            {command}
          </code>
        )}
      </div>

      {/* Label + description */}
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      {/* Meta or arrow */}
      <div className="flex items-center justify-between">
        {meta && <span className="font-mono text-[11px] text-slate-400">{meta}</span>}
        <ArrowRight
          className={cn(
            'ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5',
            done ? 'text-slate-400' : 'text-slate-200 dark:text-slate-700',
          )}
        />
      </div>
    </Link>
  )
}

// ─── Stage section ────────────────────────────────────────────────────────────

interface StageSectionProps {
  stage: 1 | 2 | 3
  label: string
  description: string
  completed: number
  total: number
  accentClass: string
  badgeClass: string
  children: React.ReactNode
}

function StageSection({
  stage,
  label,
  description,
  completed,
  total,
  accentClass,
  badgeClass,
  children,
}: StageSectionProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
            badgeClass,
          )}
        >
          {stage}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</h2>
            <span className="font-mono text-[10px] text-slate-400">
              {completed}/{total}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          {/* Progress bar */}
          <div className="mt-2 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={cn('h-full rounded-full transition-all duration-500', accentClass)}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  )
}

// ─── Stage badge styling ──────────────────────────────────────────────────────

const STAGE_STYLES = {
  1: {
    accent: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    cardAccent: 'bg-emerald-500',
  },
  2: {
    accent: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    cardAccent: 'bg-blue-500',
  },
  3: {
    accent: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
    cardAccent: 'bg-violet-500',
  },
}

// ─── Startup stage badge ──────────────────────────────────────────────────────

const STARTUP_STAGE_STYLES: Record<StartupStage, string> = {
  ideation: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  validation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  prototyping: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-100">
        <FlaskConical className="h-7 w-7 text-white dark:text-slate-900" />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Build your startup plan
      </h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Startup Lab guides you through proven entrepreneurship frameworks — one conversation at a
        time. Start by defining your startup vision.
      </p>

      {/* Command prompt */}
      <div className="mb-10 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
        <Terminal className="h-4 w-4 shrink-0 text-slate-400" />
        <code className="font-mono text-sm text-slate-700 dark:text-slate-300">
          /startup-vision
        </code>
        <span className="text-xs text-slate-400">to get started</span>
      </div>

      {/* Steps overview */}
      <div className="w-full max-w-md space-y-2 text-left">
        {[
          { n: 1, label: 'Startup Vision', desc: 'Name, problem, market, stage' },
          { n: 2, label: 'Lean Canvas', desc: '9-section business model map' },
          { n: 3, label: 'Golden Circle', desc: 'Why, How, What + go-to-market' },
          { n: 4, label: 'Personas', desc: 'Target customer profiles' },
          { n: 5, label: 'Value Proposition', desc: 'Map needs to your product' },
          { n: 6, label: 'Pitch Deck', desc: 'Synthesized 10-slide deck' },
        ].map(({ n, label, desc }) => (
          <div key={n} className="flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-mono text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {n}
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
            <span className="text-xs text-slate-400">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  if (!hasStartupOverview()) return <EmptyState />

  const overview = loadStartupOverview()!
  const canvas = loadLeanCanvas()
  const personas = loadPersonas()
  const canvasCount = canvas ? getLeanCanvasCompletionCount(canvas) : 0

  // Stage 1 stats
  const stage1Done = [hasLeanCanvas()].filter(Boolean).length

  // Stage 2 stats
  const stage2Done = [hasGoldenCircle(), hasPersonas(), hasValueProposition()].filter(Boolean).length

  // Stage 3 stats
  const stage3Done = [hasPitchDeck()].filter(Boolean).length

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium capitalize',
              STARTUP_STAGE_STYLES[overview.stage],
            )}
          >
            {overview.stage}
          </span>
          {overview.industry && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {overview.industry}
            </span>
          )}
          {overview.teamSize && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {overview.teamSize}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {overview.name}
        </h1>

        {overview.tagline && (
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
            {overview.tagline}
          </p>
        )}

        {overview.problem && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Problem
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {overview.problem}
            </p>
          </div>
        )}
      </div>

      {/* Stage 1 — Foundation */}
      <StageSection
        stage={1}
        label="Foundation"
        description="Define your business model before building anything."
        completed={stage1Done}
        total={1}
        accentClass={STAGE_STYLES[1].accent}
        badgeClass={STAGE_STYLES[1].badge}
      >
        <FrameworkCard
          label="Lean Canvas"
          description="Map your problem, solution, UVP, channels, revenue streams, and unfair advantage."
          to="/lean-canvas"
          command="/lean-canvas"
          done={hasLeanCanvas()}
          meta={hasLeanCanvas() ? `${canvasCount}/9 sections` : undefined}
          icon={<LayoutGrid className="h-4 w-4" />}
          accentClass={STAGE_STYLES[1].cardAccent}
        />
      </StageSection>

      {/* Stage 2 — Strategy */}
      <StageSection
        stage={2}
        label="Strategy"
        description="Understand your purpose, customers, and how your product creates value."
        completed={stage2Done}
        total={3}
        accentClass={STAGE_STYLES[2].accent}
        badgeClass={STAGE_STYLES[2].badge}
      >
        <FrameworkCard
          label="Golden Circle"
          description="Clarify your Why, How, and What — then build a go-to-market strategy."
          to="/golden-circle"
          command="/golden-circle"
          done={hasGoldenCircle()}
          icon={<Circle className="h-4 w-4" />}
          accentClass={STAGE_STYLES[2].cardAccent}
        />
        <FrameworkCard
          label="Personas"
          description="Build detailed profiles of your target customers to guide every decision."
          to="/personas"
          command="/create-persona"
          done={hasPersonas()}
          meta={personas.length > 0 ? `${personas.length} persona${personas.length !== 1 ? 's' : ''}` : undefined}
          icon={<Users className="h-4 w-4" />}
          accentClass={STAGE_STYLES[2].cardAccent}
        />
        <FrameworkCard
          label="Value Proposition"
          description="Map customer jobs, pains, and gains to your products and features."
          to="/value-proposition"
          command="/value-proposition"
          done={hasValueProposition()}
          icon={<Layers className="h-4 w-4" />}
          accentClass={STAGE_STYLES[2].cardAccent}
        />
      </StageSection>

      {/* Stage 3 — Launch */}
      <StageSection
        stage={3}
        label="Launch"
        description="Synthesize everything into a pitch and export your portable startup plan."
        completed={stage3Done}
        total={2}
        accentClass={STAGE_STYLES[3].accent}
        badgeClass={STAGE_STYLES[3].badge}
      >
        <FrameworkCard
          label="Pitch Deck"
          description="10-slide deck synthesized from all your planning files. Ready to present."
          to="/pitch-deck"
          command="/generate-pitch-deck"
          done={hasPitchDeck()}
          icon={<Presentation className="h-4 w-4" />}
          accentClass={STAGE_STYLES[3].cardAccent}
        />
        <FrameworkCard
          label="Export"
          description="Package your entire startup plan as a portable folder and zip archive."
          to="/export"
          command="/export-startup"
          done={false}
          icon={<Download className="h-4 w-4" />}
          accentClass={STAGE_STYLES[3].cardAccent}
        />
      </StageSection>
    </div>
  )
}
