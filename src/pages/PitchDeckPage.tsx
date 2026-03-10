import { useState } from 'react'
import { Presentation, ChevronLeft, ChevronRight } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import { loadPitchDeck } from '@/lib/pitch-deck-loader'
import type { PitchSlide } from '@/types/startup'
import { cn } from '@/lib/utils'

// ─── Minimal markdown renderer ────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}

function SlideContent({ content }: { content: string }) {
  if (!content.trim()) {
    return <p className="text-sm italic text-slate-400">No content</p>
  }

  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let listBuf: string[] = []

  const flushList = (key: number) => {
    if (listBuf.length > 0) {
      nodes.push(
        <ul key={`ul-${key}`} className="my-3 space-y-1.5 pl-1">
          {listBuf.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      )
      listBuf = []
    }
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd()
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listBuf.push(line.slice(2))
    } else {
      flushList(idx)
      if (line.trim()) {
        nodes.push(
          <p key={`p-${idx}`} className="my-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {renderInline(line)}
          </p>,
        )
      }
    }
  })
  flushList(lines.length)

  return <div>{nodes}</div>
}

// ─── Slide sidebar item ───────────────────────────────────────────────────────

function SlideTab({
  slide,
  index,
  isActive,
  onClick,
}: {
  slide: PitchSlide
  index: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
        isActive
          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold',
          isActive
            ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        )}
      >
        {index + 1}
      </span>
      <span className="truncate text-sm">{slide.title}</span>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PitchDeckPage() {
  const deck = loadPitchDeck()
  const [activeIndex, setActiveIndex] = useState(0)

  if (!deck || deck.slides.length === 0) {
    return (
      <EmptyState
        icon={<Presentation className="h-6 w-6" />}
        title="No Pitch Deck yet"
        description="Once you've filled in your canvas and personas, generate a 10-slide pitch deck automatically."
        command="/generate-pitch-deck"
      />
    )
  }

  const slide = deck.slides[activeIndex]
  const total = deck.slides.length

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden">
      {/* Slide list — desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            {total} slides
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {deck.slides.map((s, i) => (
            <SlideTab
              key={s.id}
              slide={s}
              index={i}
              isActive={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </aside>

      {/* Main slide area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Slide header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400">
              {activeIndex + 1} / {total}
            </span>
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {slide.title}
            </span>
          </div>
          <code className="font-mono text-[11px] text-slate-400">/generate-pitch-deck</code>
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 lg:px-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {slide.title}
            </h2>
            <SlideContent content={slide.content} />
          </div>
        </div>

        {/* Navigation footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-6 py-3 dark:border-slate-800">
          {/* Mobile slide dots */}
          <div className="flex items-center gap-1 lg:hidden">
            {deck.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === activeIndex
                    ? 'w-4 bg-slate-900 dark:bg-slate-100'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700',
                )}
              />
            ))}
          </div>
          <div className="hidden lg:block" />

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
              disabled={activeIndex === total - 1}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
