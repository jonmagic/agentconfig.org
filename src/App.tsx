import { type ReactNode, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

export function App(): ReactNode {
  const [count, setCount] = useState(0)

  const handleClick = (): void => {
    setCount((c) => c + 1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="h-24 w-24 animate-spin" style={{ animationDuration: '20s' }} alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8">Vite + React</h1>
      <div className="p-8 rounded-lg bg-card text-card-foreground mb-4">
        <button
          onClick={handleClick}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          count is {count}
        </button>
        <p className="mt-4 text-muted-foreground">
          Edit <code className="font-mono bg-muted px-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}
