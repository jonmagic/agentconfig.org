import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { trees, type Provider, type FileNode } from '@/data/fileTree'
import { TreeNode } from './TreeNode'

export interface FileTreeProps {
  /** Currently selected file ID */
  selectedId?: string | undefined
  /** Callback when a file is clicked */
  onFileClick?: ((node: FileNode) => void) | undefined
  /** Additional CSS classes */
  className?: string | undefined
}

const providers: { id: Provider; label: string; icon: string }[] = [
  { id: 'copilot', label: 'GitHub Copilot', icon: '🤖' },
  { id: 'claude', label: 'Claude Code', icon: '🧠' },
]

export function FileTree({
  selectedId,
  onFileClick,
  className,
}: FileTreeProps): ReactNode {
  const [activeProvider, setActiveProvider] = useState<Provider>('copilot')
  const tree = trees[activeProvider]

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Provider tabs */}
      <div
        role="tablist"
        aria-label="Select AI provider"
        className="flex gap-2 mb-4"
      >
        {providers.map((provider) => (
          <button
            key={provider.id}
            role="tab"
            aria-selected={activeProvider === provider.id}
            aria-controls={`tree-panel-${provider.id}`}
            onClick={() => { setActiveProvider(provider.id) }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              activeProvider === provider.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <span aria-hidden="true">{provider.icon}</span>
            {provider.label}
          </button>
        ))}
      </div>

      {/* Tree panel */}
      <div
        id={`tree-panel-${activeProvider}`}
        role="tabpanel"
        aria-label={`${activeProvider} file structure`}
        className={cn(
          'rounded-xl border border-border bg-card p-4',
          'overflow-auto max-h-[500px]'
        )}
      >
        <div role="tree" aria-label="Project file structure">
          <TreeNode
            node={tree}
            selectedId={selectedId}
            onFileClick={onFileClick}
          />
        </div>
      </div>
    </div>
  )
}
