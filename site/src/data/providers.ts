import type { Provider } from './primitives'

export interface ProviderMeta {
  id: Provider
  name: string
  icon: string
}

export const providers: ProviderMeta[] = [
  { id: 'copilot', name: 'GitHub Copilot', icon: '🤖' },
  { id: 'claude', name: 'Claude Code', icon: '🧠' },
  { id: 'cursor', name: 'Cursor', icon: '✨' },
  { id: 'codex', name: 'OpenAI Codex', icon: '⚡' },
]
