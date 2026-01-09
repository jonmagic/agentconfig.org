import { type ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'file-tree', label: 'File Tree' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'comparison', label: 'Comparison' },
] as const

export interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps): ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (id: string): void => {
    setIsMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-background/80 backdrop-blur-sm border-b border-border',
        className
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-lg">
          agentconfig.org
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id)
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle className="ml-2" />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id)
                }}
                className={cn(
                  'px-4 py-3 rounded-lg text-left font-medium transition-colors',
                  'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
