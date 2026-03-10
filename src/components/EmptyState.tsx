import { Terminal } from 'lucide-react'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  command: string
}

export default function EmptyState({ icon, title, description, command }: EmptyStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        {icon}
      </div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
      <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <code className="font-mono text-sm text-slate-700 dark:text-slate-300">{command}</code>
      </div>
    </div>
  )
}
