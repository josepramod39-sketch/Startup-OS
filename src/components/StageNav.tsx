import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  LayoutGrid,
  Circle,
  Users,
  Layers,
  Presentation,
  Download,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasStartupOverview } from '@/lib/startup-loader'
import { hasLeanCanvas } from '@/lib/canvas-loader'
import { hasGoldenCircle } from '@/lib/golden-circle-loader'
import { hasPersonas } from '@/lib/personas-loader'
import { hasValueProposition } from '@/lib/value-prop-loader'
import { hasPitchDeck } from '@/lib/pitch-deck-loader'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  done: boolean
  command: string
}

interface StageSection {
  stage: 1 | 2 | 3
  label: string
  items: NavItem[]
}

const stages: StageSection[] = [
  {
    stage: 1,
    label: 'Stage 1 · Foundation',
    items: [
      {
        label: 'Dashboard',
        to: '/',
        icon: <LayoutDashboard className="h-4 w-4" />,
        done: hasStartupOverview(),
        command: '/startup-vision',
      },
      {
        label: 'Lean Canvas',
        to: '/lean-canvas',
        icon: <LayoutGrid className="h-4 w-4" />,
        done: hasLeanCanvas(),
        command: '/lean-canvas',
      },
    ],
  },
  {
    stage: 2,
    label: 'Stage 2 · Strategy',
    items: [
      {
        label: 'Golden Circle',
        to: '/golden-circle',
        icon: <Circle className="h-4 w-4" />,
        done: hasGoldenCircle(),
        command: '/golden-circle',
      },
      {
        label: 'Personas',
        to: '/personas',
        icon: <Users className="h-4 w-4" />,
        done: hasPersonas(),
        command: '/create-persona',
      },
      {
        label: 'Value Proposition',
        to: '/value-proposition',
        icon: <Layers className="h-4 w-4" />,
        done: hasValueProposition(),
        command: '/value-proposition',
      },
    ],
  },
  {
    stage: 3,
    label: 'Stage 3 · Launch',
    items: [
      {
        label: 'Pitch Deck',
        to: '/pitch-deck',
        icon: <Presentation className="h-4 w-4" />,
        done: hasPitchDeck(),
        command: '/generate-pitch-deck',
      },
      {
        label: 'Export',
        to: '/export',
        icon: <Download className="h-4 w-4" />,
        done: false,
        command: '/export-startup',
      },
    ],
  },
]

interface StageNavProps {
  onNavigate?: () => void
}

export default function StageNav({ onNavigate }: StageNavProps) {
  return (
    <nav className="space-y-5 px-3">
      {stages.map((section) => {
        const completed = section.items.filter((i) => i.done).length
        const total = section.items.length

        return (
          <div key={section.stage}>
            {/* Stage header */}
            <div className="mb-1 flex items-center justify-between px-2">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.label}
              </span>
              <span className="font-mono text-[10px] text-slate-300 dark:text-slate-600">
                {completed}/{total}
              </span>
            </div>

            {/* Stage progress bar */}
            <div className="mb-2 mx-2 h-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-slate-400 dark:bg-slate-500 transition-all duration-300"
                style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
              />
            </div>

            {/* Nav items */}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive
                              ? 'text-white dark:text-slate-900'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300',
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.done ? (
                          <CheckCircle2
                            className={cn(
                              'h-3.5 w-3.5 shrink-0 transition-colors',
                              isActive
                                ? 'text-slate-300 dark:text-slate-600'
                                : 'text-slate-300 dark:text-slate-600',
                            )}
                          />
                        ) : (
                          <span
                            className={cn(
                              'shrink-0 font-mono text-[9px] transition-colors',
                              isActive
                                ? 'text-slate-300 dark:text-slate-600'
                                : 'text-slate-300 dark:text-slate-700 group-hover:text-slate-400',
                            )}
                          >
                            {item.command}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
