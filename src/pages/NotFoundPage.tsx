import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
      <p className="font-mono text-sm text-slate-400">404</p>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Page not found
      </h1>
      <Link
        to="/"
        className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
