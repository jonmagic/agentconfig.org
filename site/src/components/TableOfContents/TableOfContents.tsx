import { useState, useEffect } from 'preact/hooks'
import type { VNode } from 'preact'
import type { JSX } from 'preact'
import { cn } from '@/lib/utils'

export interface TocItem {
  /** Unique ID matching the section's id attribute */
  id: string
  /** Display label */
  label: string
  /** Audience level badge (optional) */
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export interface TableOfContentsProps {
  /** List of sections */
  items: readonly TocItem[]
  /** Additional CSS classes */
  className?: string
}

const levelColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const

export function TableOfContents({ items, className }: TableOfContentsProps): VNode {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    for (const item of items) {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    }

    return (): void => { observer.disconnect() }
  }, [items])

  const handleClick = (e: JSX.TargetedMouseEvent<HTMLAnchorElement>, id: string): void => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', `#${id}`)
    }
  }

  return (
    <nav aria-label="Table of contents" className={cn('space-y-1', className)}>
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
        On this page
      </h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => { handleClick(e, item.id) }}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeId === item.id
                  ? 'bg-muted font-medium text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <span className="flex-1">{item.label}</span>
              {item.level && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-medium capitalize',
                    levelColors[item.level]
                  )}
                >
                  {item.level}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
