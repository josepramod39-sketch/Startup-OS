import { Layers } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import { loadValueProposition, getValuePropFitScore } from '@/lib/value-prop-loader'
import { cn } from '@/lib/utils'

function ItemList({ items, label, accent }: { items: string[]; label: string; accent: string }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      {items.length === 0 ? (
        <p className="text-xs italic text-slate-300 dark:text-slate-700">Empty</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', accent)} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FitBar({
  covered,
  total,
  label,
}: {
  covered: number
  total: number
  label: string
}) {
  if (total === 0) return null
  const pct = Math.round((covered / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 font-mono text-[10px] text-slate-500">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-900 dark:bg-slate-100 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono text-[10px] text-slate-400">
        {covered}/{total}
      </span>
    </div>
  )
}

export default function ValuePropPage() {
  const vp = loadValueProposition()

  if (!vp) {
    return (
      <EmptyState
        icon={<Layers className="h-6 w-6" />}
        title="No Value Proposition yet"
        description="Map customer jobs, pains, and gains to your product features — and check for fit."
        command="/value-proposition"
      />
    )
  }

  const fit = getValuePropFitScore(vp)

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Value Proposition
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Customer Profile ↔ Value Map fit
          </p>
        </div>
        <code className="mt-1 font-mono text-[11px] text-slate-400">/value-proposition</code>
      </div>

      {/* Fit score */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          Fit Coverage
        </p>
        <FitBar covered={fit.coveredPains} total={fit.totalPains} label="Pains relieved" />
        <FitBar covered={fit.coveredGains} total={fit.totalGains} label="Gains created" />
      </div>

      {/* Two-column canvas */}
      <div className="grid gap-px rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 overflow-hidden lg:grid-cols-2">
        {/* Customer Profile */}
        <div className="bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Customer Profile
            </h2>
          </div>
          <ItemList
            items={vp.customerProfile.customerJobs}
            label="Customer Jobs"
            accent="bg-emerald-400"
          />
          <ItemList
            items={vp.customerProfile.customerGains}
            label="Customer Gains"
            accent="bg-emerald-400"
          />
          <ItemList
            items={vp.customerProfile.customerPains}
            label="Customer Pains"
            accent="bg-emerald-400"
          />
        </div>

        {/* Value Map */}
        <div className="bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Value Map</h2>
          </div>
          <ItemList
            items={vp.valueMap.products}
            label="Products & Services"
            accent="bg-blue-400"
          />
          <ItemList
            items={vp.valueMap.gainCreators}
            label="Gain Creators"
            accent="bg-blue-400"
          />
          <ItemList
            items={vp.valueMap.painRelievers}
            label="Pain Relievers"
            accent="bg-blue-400"
          />
        </div>
      </div>
    </div>
  )
}
