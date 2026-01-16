import type { VNode } from 'preact'
import { cn } from '@/lib/utils'

export interface SkillsHeroProps {
  className?: string
}

export function SkillsHero({ className }: SkillsHeroProps): VNode {
  return (
    <header className={cn('border-b border-border bg-muted/30', className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Building Agent Skills
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Learn how to create reusable, composable skills that extend what AI coding assistants can do.
          From simple documentation to sophisticated multimodal workflows.
        </p>
        <div className="flex gap-2 mt-6 flex-wrap">
          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Beginner friendly
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Recipes included
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Advanced workflows
          </span>
        </div>
      </div>
    </header>
  )
}
