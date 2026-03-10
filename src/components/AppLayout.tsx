import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import StageNav from '@/components/StageNav'
import { Menu, X, FlaskConical } from 'lucide-react'
import { loadStartupOverview } from '@/lib/startup-loader'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const overview = loadStartupOverview()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-200',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 dark:bg-slate-100">
            <FlaskConical className="h-4 w-4 text-white dark:text-slate-900" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">
              {overview?.name ?? 'Startup Lab'}
            </p>
            {overview?.stage && (
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {overview.stage}
              </p>
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <StageNav onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Footer hint */}
        <div className="shrink-0 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-600">
            run /startup-vision to begin
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            aria-label="Open menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {overview?.name ?? 'Startup Lab'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
