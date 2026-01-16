import type { VNode } from 'preact'
import { cn } from '@/lib/utils'

export interface SkillsHeroProps {
  className?: string
}

export function SkillsHero({ className }: SkillsHeroProps): VNode {
  return (
    <div className={cn('py-16 md:py-24 text-center', className)}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Building Agent Skills
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn how to create reusable, composable skills that extend what AI coding assistants can do.
          From simple documentation to sophisticated multimodal workflows.
        </p>
      </div>
    </div>
  )
}
