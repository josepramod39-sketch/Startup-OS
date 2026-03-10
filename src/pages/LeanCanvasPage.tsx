import { LayoutGrid } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import { loadLeanCanvas } from '@/lib/canvas-loader'
import { LEAN_CANVAS_SECTION_LABELS, LEAN_CANVAS_SECTION_ORDER, type LeanCanvas } from '@/types/startup'
import { cn } from '@/lib/utils'

// ─── Canvas section cell ──────────────────────────────────────────────────────

function CanvasCell({
  label,
  content,
  featured = false,
  className,
}: {
  label: string
  content: string
  featured?: boolean
  className?: string
}) {
  const isEmpty = !content.trim()

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-4',
        featured && 'bg-slate-50 dark:bg-slate-800/60',
        className,
      )}
    >
      <p
        className={cn(
          'font-mono text-[10px] font-medium uppercase tracking-wider',
          featured ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500',
        )}
      >
        {label}
      </p>
      {isEmpty ? (
        <p className="text-xs italic text-slate-300 dark:text-slate-700">Empty</p>
      ) : (
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
          {content}
        </p>
      )}
    </div>
  )
}

// ─── Desktop grid (lg+) ───────────────────────────────────────────────────────

function DesktopGrid({ canvas }: { canvas: LeanCanvas }) {
  const divider = 'bg-slate-200 dark:bg-slate-700'

  return (
    <div
      className={cn('hidden lg:grid rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden', divider)}
      style={{
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'auto auto auto',
        gap: '1px',
      }}
    >
      {/* Problem — col 1, rows 1-2 */}
      <div style={{ gridColumn: '1', gridRow: '1 / 3' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Problem" content={canvas.problem} className="h-full" />
      </div>

      {/* Solution — col 2, row 1 */}
      <div style={{ gridColumn: '2', gridRow: '1' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Solution" content={canvas.solution} />
      </div>

      {/* UVP — col 3, rows 1-2 */}
      <div style={{ gridColumn: '3', gridRow: '1 / 3' }} className="bg-slate-50 dark:bg-slate-800/60">
        <CanvasCell label="Unique Value Proposition" content={canvas.uniqueValueProposition} featured className="h-full" />
      </div>

      {/* Unfair Advantage — col 4, row 1 */}
      <div style={{ gridColumn: '4', gridRow: '1' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Unfair Advantage" content={canvas.unfairAdvantage} />
      </div>

      {/* Customer Segments — col 5, rows 1-2 */}
      <div style={{ gridColumn: '5', gridRow: '1 / 3' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Customer Segments" content={canvas.customerSegments} className="h-full" />
      </div>

      {/* Key Metrics — col 2, row 2 */}
      <div style={{ gridColumn: '2', gridRow: '2' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Key Metrics" content={canvas.keyMetrics} />
      </div>

      {/* Channels — col 4, row 2 */}
      <div style={{ gridColumn: '4', gridRow: '2' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Channels" content={canvas.channels} />
      </div>

      {/* Cost Structure — cols 1-2, row 3 */}
      <div style={{ gridColumn: '1 / 3', gridRow: '3' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Cost Structure" content={canvas.costStructure} />
      </div>

      {/* Revenue Streams — cols 3-6, row 3 */}
      <div style={{ gridColumn: '3 / 6', gridRow: '3' }} className="bg-white dark:bg-slate-900">
        <CanvasCell label="Revenue Streams" content={canvas.revenueStreams} />
      </div>
    </div>
  )
}

// ─── Mobile list (< lg) ───────────────────────────────────────────────────────

function MobileList({ canvas }: { canvas: LeanCanvas }) {
  return (
    <div className="lg:hidden grid gap-3 sm:grid-cols-2">
      {LEAN_CANVAS_SECTION_ORDER.map((key) => (
        <div
          key={key}
          className={cn(
            'rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900',
            key === 'uniqueValueProposition' && 'sm:col-span-2 bg-slate-50 dark:bg-slate-800/60',
          )}
        >
          <CanvasCell label={LEAN_CANVAS_SECTION_LABELS[key]} content={canvas[key]} />
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeanCanvasPage() {
  const canvas = loadLeanCanvas()

  if (!canvas) {
    return (
      <EmptyState
        icon={<LayoutGrid className="h-6 w-6" />}
        title="No Lean Canvas yet"
        description="Map your business model across 9 sections — problem, solution, UVP, channels, and more."
        command="/lean-canvas"
      />
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Lean Canvas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your 9-section business model map
          </p>
        </div>
        <code className="mt-1 font-mono text-[11px] text-slate-400">/lean-canvas</code>
      </div>

      <DesktopGrid canvas={canvas} />
      <MobileList canvas={canvas} />
    </div>
  )
}
