import { Circle } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import { loadGoldenCircle } from '@/lib/golden-circle-loader'
import type { GoldenCircleGTM } from '@/types/startup'
import { cn } from '@/lib/utils'

// ─── Why / How / What cards ───────────────────────────────────────────────────

const WHY_HOW_WHAT = [
  {
    key: 'why' as const,
    label: 'Why',
    sub: 'Purpose & belief',
    depth: 'Innermost',
    bg: 'bg-slate-900 dark:bg-slate-100',
    text: 'text-white dark:text-slate-900',
    sub2: 'text-slate-400 dark:text-slate-500',
    indent: 0,
  },
  {
    key: 'how' as const,
    label: 'How',
    sub: 'Unique approach',
    depth: 'Middle ring',
    bg: 'bg-slate-200 dark:bg-slate-700',
    text: 'text-slate-900 dark:text-slate-100',
    sub2: 'text-slate-500 dark:text-slate-400',
    indent: 6,
  },
  {
    key: 'what' as const,
    label: 'What',
    sub: 'Products & services',
    depth: 'Outer ring',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-900 dark:text-slate-100',
    sub2: 'text-slate-400 dark:text-slate-500',
    indent: 12,
  },
]

const GTM_FIELDS: Array<{ key: keyof GoldenCircleGTM; label: string }> = [
  { key: 'targetMarket', label: 'Target Market' },
  { key: 'valueProposition', label: 'Value Proposition' },
  { key: 'pricingStrategy', label: 'Pricing Strategy' },
  { key: 'distributionChannels', label: 'Distribution Channels' },
  { key: 'marketingStrategy', label: 'Marketing Strategy' },
  { key: 'keyMetrics', label: 'Key Metrics' },
]

export default function GoldenCirclePage() {
  const gc = loadGoldenCircle()

  if (!gc) {
    return (
      <EmptyState
        icon={<Circle className="h-6 w-6" />}
        title="No Golden Circle yet"
        description="Clarify your Why, How, and What — then build a go-to-market strategy on top."
        command="/golden-circle"
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Golden Circle
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Purpose-driven strategy: Why → How → What
          </p>
        </div>
        <code className="mt-1 font-mono text-[11px] text-slate-400">/golden-circle</code>
      </div>

      {/* Why / How / What — nested cards */}
      <div className="space-y-2">
        {WHY_HOW_WHAT.map(({ key, label, sub, bg, text, sub2, indent }) => (
          <div
            key={key}
            className={cn('rounded-xl p-5', bg)}
            style={{ marginLeft: `${indent * 4}px` }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 pt-0.5">
                <p className={cn('font-bold text-xl', text)}>{label}</p>
                <p className={cn('font-mono text-[10px] uppercase tracking-wider', sub2)}>{sub}</p>
              </div>
              <p className={cn('text-sm leading-relaxed', text, 'opacity-90')}>
                {gc[key] || <span className="italic opacity-50">Not filled in yet</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
          Go-to-Market Strategy
        </p>
        <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
      </div>

      {/* GTM grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GTM_FIELDS.map(({ key, label }) => {
          const value = gc.gtm[key]
          return (
            <div
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {label}
              </p>
              {value ? (
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {value}
                </p>
              ) : (
                <p className="text-xs italic text-slate-300 dark:text-slate-700">Empty</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
