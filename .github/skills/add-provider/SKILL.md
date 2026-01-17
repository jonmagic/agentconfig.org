---
name: add-provider
description: Add a new AI provider to agentconfig.org's comparison system. Use when integrating a new coding assistant (e.g., Cursor, Claude Desktop, GitHub Copilot alternative) with proper type system updates, implementation data, UI components, tests, and documentation.
---

# Add Provider

Add a new AI coding assistant provider to agentconfig.org's provider comparison system.

## Overview

Adding a provider requires coordinated work across 6 parallel work streams:

1. **Type System** - Add provider to union types
2. **Data Layer** - Add implementations for all 11 primitives
3. **UI Components** - Update comparison table to display new provider
4. **Testing** - Update E2E tests for multi-provider layout
5. **App Integration** - Update site copy and documentation
6. **LLMs Generation** - Regenerate machine-readable files for AI agents

**Total effort**: ~2-3 hours (with proper planning and 6 parallel streams)

## When to Use

Use this skill when:
- Integrating a new coding assistant (e.g., Cursor, Claude Desktop, Zed with AI)
- Expanding provider support beyond current offerings
- The provider implements most/all 11 AI primitives
- You want comprehensive comparison data visible to users

## Prerequisites

Before starting, you need:
- **Provider capability audit** - Which of the 11 primitives does the provider support?
- **File path documentation** - Where do config files go (global vs project)?
- **Implementation details** - How each primitive is implemented in the provider
- **Support levels** - `full` (native support), `partial` (with workarounds), `none` (not available), or `diy` (achievable with custom setup)

## The 11 Primitives

Every new provider must map to these 11 primitives:

| Category | Primitive |
|----------|-----------|
| **Execution** | Agent Mode, Skills/Workflows, Tool Integrations (MCP) |
| **Customization** | Persistent Instructions, Global Instructions, Path-Scoped Rules, Slash Commands |
| **Control** | Custom Agents, Permissions & Guardrails, Lifecycle Hooks, Verification/Evals |

## Step-by-Step Process

### Stream 1: Type System Updates (No dependencies, can start immediately)

**Duration**: 2-4 hours
**Files to modify**: 3

#### 1a. Add to Provider Union Type

Update `site/src/data/primitives.ts`:

```typescript
// Change from:
export type Provider = 'copilot' | 'claude'

// To:
export type Provider = 'copilot' | 'claude' | 'cursor'  // Add your provider
```

Update `site/src/data/fileTree.ts`:

```typescript
// Change from:
export type Provider = 'copilot' | 'claude'

// To:
export type Provider = 'copilot' | 'claude' | 'cursor'  // Add your provider
```

#### 1b. Update Comparison Interface

Edit `site/src/data/comparison.ts`:

```typescript
export interface ComparisonRow {
  primitiveId: string
  primitiveName: string
  copilot: ProviderSupport
  claude: ProviderSupport
  cursor: ProviderSupport  // Add this field
}
```

#### 1c. Update UI Provider Labels

Edit `site/src/components/PrimitiveCards/PrimitiveCard.tsx`:

```typescript
const providerLabels: Record<Provider, string> = {
  copilot: 'GitHub Copilot',
  claude: 'Claude Code',
  cursor: 'Cursor',  // Add your provider display name
}
```

#### 1d. Verify TypeScript

Run: `npm run typecheck`

Should show errors for missing provider data (expected).

---

### Stream 2: Data Layer Updates (Depends on Stream 1 types)

**Duration**: 4-6 hours
**Files to modify**: 2-3
**Dependencies**: Stream 1 complete

#### 2a. Add Provider Implementations to Primitives

Edit `site/src/data/primitives.ts`:

For each of the 11 primitives, add a cursor entry to the `implementations` array:

```typescript
implementations: [
  {
    provider: 'copilot',
    implementation: 'Agent mode in Copilot Chat',
    location: 'VS Code Copilot Chat',
    support: 'full',
  },
  {
    provider: 'claude',
    implementation: 'Agentic workflows in Claude Code',
    location: 'Claude Code CLI',
    support: 'full',
  },
  {
    provider: 'cursor',  // New entry
    implementation: 'Cursor Agent mode for multi-step execution',
    location: 'Cursor Editor with Agent capabilities',
    support: 'full',  // 'full' | 'partial' | 'diy'
  },
]
```

**Research tip**: For each primitive, document:
- **Implementation**: How does this provider implement this primitive?
- **Location**: Where are config files? (e.g., `.cursor/instructions.md`)
- **Support**: Is it native (`full`), limited (`partial`), or workaround-based (`diy`)?

#### 2b. Add Provider Data to Comparison Matrix

Edit `site/src/data/comparison.ts`:

For each of the 11 `ComparisonRow` entries, add cursor field:

```typescript
{
  primitiveId: 'agent-mode',
  primitiveName: 'Agent Mode',
  copilot: { level: 'full', implementation: '...', location: '...' },
  claude: { level: 'full', implementation: '...', location: '...' },
  cursor: {  // New entry
    level: 'full',  // 'full' | 'partial' | 'none'
    implementation: 'Cursor Agent mode for multi-step execution',
    location: 'Cursor Editor with Agent capabilities',
  },
}
```

#### 2c. Add File Tree Structure (if applicable)

Edit `site/src/data/fileTree.ts`:

Add provider-specific file tree structure:

```typescript
export const cursorTree: FileNode = {
  id: 'cursor-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'cursor-dotcursor',
      name: '.cursor',
      type: 'folder',
      children: [
        {
          id: 'cursor-instructions',
          name: 'instructions.md',
          type: 'file',
          details: {
            label: 'Project Instructions',
            description: 'Cursor project-level instructions for AI behavior.',
            whatGoesHere: ['Project overview', 'Coding conventions', 'Build commands'],
            whenLoaded: 'Always loaded first.',
            loadOrder: 1,
            example: `# Cursor Instructions\n\n## Project Setup\n- Node.js 18+\n- npm install`,
          },
        },
      ],
    },
  ],
}

// Add to trees mapping:
export const trees: Record<Provider, FileNode> = {
  copilot: copilotTree,
  claude: claudeTree,
  cursor: cursorTree,  // Add this
}

export const globalTrees: Record<Provider, FileNode> = {
  copilot: copilotGlobalTree,
  claude: claudeGlobalTree,
  cursor: cursorGlobalTree,  // Add this
}
```

#### 2d. Verify TypeScript Again

Run: `npm run typecheck`

Should now have no errors.

---

### Stream 3: UI Component Updates (Depends on Stream 1 & 2)

**Duration**: 4-8 hours
**Files to modify**: 1-2
**Dependencies**: Streams 1 & 2 complete

#### 3a. Update Comparison Table

Edit `site/src/components/ProviderComparison/ComparisonTable.tsx`:

Add provider column to table header:

```typescript
<th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
  <span className="inline-flex items-center gap-2">
    <span aria-hidden="true">✨</span>
    Cursor
  </span>
</th>
```

Add provider cell to table rows:

```typescript
<td className="px-4 py-3 text-center">
  <SupportBadge level={row.cursor.level} />
</td>
```

Update `ExpandedRow` component to show all provider details:

```typescript
// Update colSpan from 3 to 4
<td colSpan={4} className="px-4 py-4">
  {/* Update grid from md:grid-cols-2 to md:grid-cols-3 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Add new provider section with implementation, location, copy button */}
  </div>
</td>
```

Update state typing:

```typescript
const [copiedLocation, setCopiedLocation] = useState<'copilot' | 'claude' | 'cursor' | null>(null)
```

---

### Stream 4: Testing (Depends on Stream 3)

**Duration**: 3-4 hours
**Files to modify**: 1
**Dependencies**: Stream 3 complete

#### 4a. Update E2E Tests

Edit `site/tests/e2e/comparison.spec.ts`:

Add Cursor to column header test:

```typescript
test('should display table headers', async ({ page }) => {
  await expect(page.getByRole('columnheader', { name: /Cursor/i })).toBeVisible()
})
```

Update support badge count test:

```typescript
// Update expected badge counts based on new provider support levels
const fullSupportBadges = table.getByText('Full Support')
await expect(fullSupportBadges).toHaveCount(18)  // Adjust based on provider

const partialBadges = table.getByText('Partial')
await expect(partialBadges).toHaveCount(5)  // Adjust based on provider
```

Add provider to expansion tests:

```typescript
test('should expand row on click to show details', async ({ page }) => {
  // ...
  await expect(page.getByText('Project instructions file')).toBeVisible()  // Cursor
})

test('should show file locations when expanded', async ({ page }) => {
  // ...
  await expect(page.getByText('.cursor/instructions.md')).toBeVisible()
})

test('should have copy buttons in expanded row', async ({ page }) => {
  const copyButtons = page.getByRole('button', { name: /Copy location/i })
  await expect(copyButtons.nth(0)).toBeVisible()  // Copilot
  await expect(copyButtons.nth(1)).toBeVisible()  // Claude
  await expect(copyButtons.nth(2)).toBeVisible()  // Cursor (new)
})
```

Run tests:

```bash
npm run test
```

All tests should pass.

---

### Stream 5: App Integration (Depends on Streams 1-3, no hard dependency)

**Duration**: 1-2 hours
**Files to modify**: 3-4

#### 5a. Update Site Copy

Edit `site/src/App.tsx`:

```typescript
// Update comparison section description
description="Compare how primitives are implemented across GitHub Copilot, Claude Code, and Cursor."
```

Edit `site/src/components/Hero/Hero.tsx`:

```typescript
// Update hero tagline
Configure GitHub Copilot, Claude Code, and Cursor for any role or workflow.
```

#### 5b. Update Documentation

Edit `README.md`:

```markdown
- **AI Primitives** — The 11 core configuration primitives...
- **Provider Comparison** — Side-by-side comparison of GitHub Copilot, Claude Code, and Cursor...

### Cursor

| Type | Path |
|------|------|
| Global settings | `~/.cursor/settings.json` |
| Project instructions | `.cursor/instructions.md` |
| Project rules | `.cursor/rules/*.md` |
```

---

### Stream 6: LLMs Generation (Depends on all previous streams)

**Duration**: 1-2 hours
**Files to modify**: 2
**Dependencies**: Streams 1-5 complete

#### 6a. Update Generation Script

If needed, update `.github/skills/generate-llms/scripts/generate-llms-full.ts`:

Check the provider name mapping. If using a ternary, update it:

```typescript
// If the script only handles 'copilot' and defaults to 'Claude Code':
const providerName =
  impl.provider === 'copilot' ? 'GitHub Copilot' :
  impl.provider === 'claude' ? 'Claude Code' :
  impl.provider === 'cursor' ? 'Cursor' :
  impl.provider;
```

#### 6b. Regenerate LLMs Files

Run:

```bash
bun .github/skills/generate-llms/scripts/generate-llms-full.ts
```

This regenerates:
- `site/public/llms-full.txt` - Complete content with all providers
- `site/public/llms.txt` - Table of contents
- `site/public/*.md` - Page-specific markdown files

Verify output shows your provider correctly:

```bash
grep -A 3 "Agent Mode" site/public/llms-full.txt
# Should show: | Cursor | ... | full |
```

---

## Checklist

Before considering the provider complete:

### Type System
- [ ] Added provider to `Provider` type in `primitives.ts`
- [ ] Added provider to `Provider` type in `fileTree.ts`
- [ ] Updated `ComparisonRow` interface with provider field
- [ ] Updated provider labels in `PrimitiveCard.tsx`
- [ ] TypeScript compiles without errors (`npm run typecheck`)

### Data Layer
- [ ] Added provider implementations to all 11 primitives in `primitives.ts`
- [ ] Added provider entries to all 11 rows in `comparison.ts`
- [ ] Created provider file tree in `fileTree.ts` (trees mapping updated)
- [ ] Created provider global file tree in `fileTree.ts` (globalTrees mapping updated)

### UI Components
- [ ] Added provider column header to comparison table
- [ ] Added provider cell to table rows
- [ ] Updated `ExpandedRow` colSpan and grid columns
- [ ] Added provider section in expanded row with copy button
- [ ] Updated `copiedLocation` state typing

### Testing
- [ ] Updated header test to check for provider column
- [ ] Updated support badge count tests
- [ ] Updated expansion tests to show provider details
- [ ] Updated copy button tests to verify all 3 providers
- [ ] E2E tests pass (`npm run test`)

### Documentation & Integration
- [ ] Updated App.tsx comparison description
- [ ] Updated Hero.tsx tagline
- [ ] Updated README.md with provider section and paths
- [ ] Updated LLMs generation script (if needed)
- [ ] Regenerated LLMs files
- [ ] Verified provider name displays correctly in llms-full.txt

### Verification
- [ ] Site builds successfully (`npm run build`)
- [ ] All providers display in comparison table on homepage
- [ ] Expanding rows shows all 3+ provider details
- [ ] Copy buttons work for all providers
- [ ] Responsive layout works on mobile (3+ columns may need horizontal scroll)
- [ ] Dark mode works correctly
- [ ] llms-full.txt contains provider data for all primitives

---

## Common Patterns

### Support Levels

Use these consistently:

- **`full`** - Native, first-class support in the provider
  - Example: Agent Mode in Cursor Editor
- **`partial`** - Works but with limitations or workarounds
  - Example: Tool Integrations in Cursor (via Extensions API, not full MCP)
- **`diy`** - Not natively available, but achievable with custom configuration
  - Example: Lifecycle Hooks (provider doesn't have built-in hooks, but user can script them)
- **`none`** - Not possible in the provider
  - Example: Lifecycle Hooks in Copilot (not available)

### File Locations

Follow provider conventions:

- **Copilot**: `.github/` + `*.md` files
  - `.github/copilot-instructions.md`
  - `.github/agents/*.agent.md`
  - `.github/skills/*/SKILL.md`
- **Claude**: `.claude/` + `*.json` settings or `.md` files
  - `.claude/settings.json`
  - `.claude/agents/*.md`
  - `.claude/rules/*.md`
  - `.claude/commands/*.md`
- **Cursor**: `.cursor/` + similar to Claude
  - `.cursor/settings.json`
  - `.cursor/instructions.md`
  - `.cursor/rules/*.md`

---

## Error Handling

### TypeScript Errors After Stream 1

**Error**: `Property 'cursor' is missing in type`

**Solution**: Expected! You haven't added data yet. Continue to Stream 2.

### Support Badge Count Mismatch in Tests

**Error**: `Expected 18, received 21`

**Solution**: Update test expectations based on your provider's actual support levels:
- Count all rows × all providers to get total expected badges
- Different providers may have different support levels

### Provider Name Shows as "Claude Code" in llms-full.txt

**Error**: New provider displays as existing provider name

**Solution**: Update `.github/skills/generate-llms/scripts/generate-llms-full.ts` provider name mapping to include your provider

### Build Fails After UI Updates

**Error**: `colSpan mismatch` or `grid column count mismatch`

**Solution**:
- Table colSpan should be 4 (1 primitive + 3 providers)
- Grid should be `md:grid-cols-3` for 3 provider details

---

## Example Prompts

### Add a new provider (start to finish)
```
Add Cursor as a provider to agentconfig.org following the add-provider skill.
Research Cursor's implementation of all 11 primitives and determine support levels.
```

### Research provider capabilities only
```
Research which of the 11 AI primitives Cursor supports and at what level (full/partial/none).
Document implementation paths and config file locations.
```

### Update existing provider data
```
Update Cursor's tool integration support from 'partial' to 'full' in comparison.ts.
Also update the UI component to reflect the change.
```

### Add provider to specific stream only
```
I've completed Stream 1 (types). Now execute Stream 2 (data layer updates) to add Cursor implementations.
```

---

## Stream Dependencies

```
Start
  ├─> Stream 1 (Type System) → no dependencies, can start immediately
  ├─> Stream 2 (Data Layer) → depends on Stream 1
  │   └─> Stream 3 (UI Components) → depends on Streams 1 & 2
  │       └─> Stream 4 (Testing) → depends on Stream 3
  │           └─> Stream 5 (App Integration) → no hard deps, can run in parallel
  │               └─> Stream 6 (LLMs Generation) → depends on all previous
```

Parallel execution possible: Start Stream 5 while Streams 3-4 are in progress.

---

## Success Metrics

✅ Provider added to all type definitions
✅ All 11 primitives have provider implementation data
✅ Comparison table renders with provider column
✅ All E2E tests pass with new provider
✅ No TypeScript errors
✅ Production build succeeds
✅ llms-full.txt regenerated with provider data
✅ Responsive design works (3+ columns)
✅ Dark mode works correctly
✅ Documentation updated (README, app copy)

---

## Related Skills

- **[add-primitive](https://github.com/jonmagic/agentconfig.org/.github/skills/add-primitive)** - Add a new AI primitive (when you want to expand the 11 to 12+)
- **[generate-llms](https://github.com/jonmagic/agentconfig.org/.github/skills/generate-llms)** - Regenerate llms.txt and llms-full.txt
- **[semantic-commit](https://github.com/jonmagic/agentconfig.org/.github/skills/semantic-commit)** - Create semantic commit messages for your changes
