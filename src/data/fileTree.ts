export type Provider = 'copilot' | 'claude'

export interface FileNode {
  /** Unique identifier for the node */
  id: string
  /** Display name */
  name: string
  /** Type of node */
  type: 'file' | 'folder'
  /** Child nodes (for folders) */
  children?: FileNode[]
  /** File details (for files with explanations) */
  details?: FileDetails
}

export interface FileDetails {
  /** Short label for the file type */
  label: string
  /** One-sentence description */
  description: string
  /** What content goes in this file */
  whatGoesHere: string[]
  /** When is it loaded/used */
  whenLoaded: string
  /** Position in load order */
  loadOrder: number
  /** Example content */
  example: string
}

export const copilotTree: FileNode = {
  id: 'copilot-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'copilot-github',
      name: '.github',
      type: 'folder',
      children: [
        {
          id: 'copilot-instructions',
          name: 'copilot-instructions.md',
          type: 'file',
          details: {
            label: 'Repo Instructions',
            description: 'The primary file for repo-wide behavioral guidance. Copilot reads this automatically for every interaction.',
            whatGoesHere: [
              'Project overview and tech stack',
              'Coding conventions (naming, formatting, patterns)',
              'Testing requirements and how to run tests',
              'Build/deploy commands',
              'Security constraints',
            ],
            whenLoaded: 'Always loaded first. Forms the baseline context for all Copilot interactions.',
            loadOrder: 1,
            example: `# Copilot Instructions

## Tech Stack
- TypeScript, React 18, Node.js 20
- PostgreSQL with Prisma ORM

## Conventions
- Use functional components with hooks
- Prefer named exports
- All API endpoints return { data, error } shape

## Testing
- Run tests: \`npm test\`
- All PRs must have tests for new functionality`,
          },
        },
        {
          id: 'copilot-agents',
          name: 'agents',
          type: 'folder',
          children: [
            {
              id: 'copilot-agent-reviewer',
              name: 'reviewer.agent.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized agent persona with specific roles, behaviors, and tool permissions.',
                whatGoesHere: [
                  'Agent name and description',
                  'Role definition (what it focuses on)',
                  'Allowed/disallowed tools',
                  'Specific instructions for behavior',
                ],
                whenLoaded: 'Loaded when you explicitly select this agent in Copilot Chat.',
                loadOrder: 5,
                example: `---
name: "Code Reviewer"
description: "Reviews code for correctness and style"
tools:
  - read_file
  - grep_search
---

# Code Reviewer Agent

You are a senior code reviewer. Your job is to:
1. Identify bugs and potential issues
2. Check adherence to project conventions
3. Suggest improvements (but don't make changes)`,
              },
            },
            {
              id: 'copilot-agent-planner',
              name: 'planner.agent.md',
              type: 'file',
              details: {
                label: 'Custom Agent',
                description: 'Defines a specialized agent persona with specific roles, behaviors, and tool permissions.',
                whatGoesHere: [
                  'Agent name and description',
                  'Role definition (what it focuses on)',
                  'Allowed/disallowed tools',
                  'Specific instructions for behavior',
                ],
                whenLoaded: 'Loaded when you explicitly select this agent in Copilot Chat.',
                loadOrder: 5,
                example: `---
name: "Implementation Planner"
description: "Plans implementation approach before coding"
---

# Implementation Planner Agent

Before writing any code, help the user:
1. Break down the task into steps
2. Identify potential challenges
3. Suggest the best approach`,
              },
            },
          ],
        },
        {
          id: 'copilot-skills',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'copilot-skill-debug-ci',
              name: 'debug-ci',
              type: 'folder',
              children: [
                {
                  id: 'copilot-skill-debug-ci-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'A reusable, multi-step workflow that Copilot can invoke automatically based on the task.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Tool usage patterns',
                      'Example inputs/outputs',
                    ],
                    whenLoaded: 'Auto-selected based on task. The skill description is matched against user requests.',
                    loadOrder: 6,
                    example: `---
name: "Debug CI Failures"
description: "Diagnose and fix failing CI runs"
---

# Debug CI Failures

## Steps
1. Check CI logs for error message
2. Reproduce locally
3. Identify common causes
4. Fix and verify`,
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'copilot-instructions-folder',
          name: 'instructions',
          type: 'folder',
          children: [
            {
              id: 'copilot-instructions-frontend',
              name: 'frontend.instructions.md',
              type: 'file',
              details: {
                label: 'Path-Specific',
                description: 'Instructions that apply only to specific directories or file patterns using glob patterns.',
                whatGoesHere: [
                  'Directory-specific conventions',
                  'Framework-specific guidance',
                  'Different rules for frontend vs backend',
                ],
                whenLoaded: 'Loaded when working on files matching the glob pattern in frontmatter.',
                loadOrder: 4,
                example: `---
applyTo: "frontend/**"
---

# Frontend Instructions

## React Conventions
- Use functional components only
- Extract reusable logic into custom hooks

## Testing
- Use React Testing Library
- Test behavior, not implementation`,
              },
            },
            {
              id: 'copilot-instructions-backend',
              name: 'backend.instructions.md',
              type: 'file',
              details: {
                label: 'Path-Specific',
                description: 'Instructions that apply only to specific directories or file patterns using glob patterns.',
                whatGoesHere: [
                  'Directory-specific conventions',
                  'Framework-specific guidance',
                  'API design patterns',
                ],
                whenLoaded: 'Loaded when working on files matching the glob pattern in frontmatter.',
                loadOrder: 4,
                example: `---
applyTo: "backend/**"
---

# Backend Instructions

## API Conventions
- RESTful endpoint naming
- Always validate input
- Return consistent error shapes`,
              },
            },
          ],
        },
        {
          id: 'copilot-prompts',
          name: 'prompts',
          type: 'folder',
          children: [
            {
              id: 'copilot-prompt-write-tests',
              name: 'write-tests.prompt.md',
              type: 'file',
              details: {
                label: 'Prompt Template',
                description: 'Reusable prompt templates for common tasks. Invoke via / commands in Copilot Chat.',
                whatGoesHere: [
                  'A well-crafted prompt for a repeatable task',
                  'File references with #file:',
                  'Variables like ${SELECTION}',
                ],
                whenLoaded: 'User-invoked only. Not automatically loaded.',
                loadOrder: 7,
                example: `---
name: "Write Tests"
description: "Generate unit tests for selected code"
---

Write comprehensive unit tests for:

#file:\${SELECTION}

Requirements:
- Cover happy path and edge cases
- Include at least one error case
- Follow AAA pattern (Arrange, Act, Assert)`,
              },
            },
            {
              id: 'copilot-prompt-review-pr',
              name: 'review-pr.prompt.md',
              type: 'file',
              details: {
                label: 'Prompt Template',
                description: 'Reusable prompt templates for common tasks. Invoke via / commands in Copilot Chat.',
                whatGoesHere: [
                  'A well-crafted prompt for a repeatable task',
                  'File references with #file:',
                  'Variables like ${SELECTION}',
                ],
                whenLoaded: 'User-invoked only. Not automatically loaded.',
                loadOrder: 7,
                example: `---
name: "Review PR"
description: "Generate a PR review checklist"
---

Review this PR for:
- [ ] Logic correctness
- [ ] Error handling
- [ ] Test coverage
- [ ] Security considerations`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'copilot-agents-md',
      name: 'AGENTS.md',
      type: 'file',
      details: {
        label: 'Cross-Tool Context',
        description: 'An open standard for AI agents. Works with Copilot, Cursor, Claude, and other tools.',
        whatGoesHere: [
          'How to build and run the project',
          'How to run tests',
          'Project structure overview',
          'Key conventions and commands',
        ],
        whenLoaded: 'Read by Copilot agent mode and other compatible tools. Loaded alongside repo instructions.',
        loadOrder: 2,
        example: `# AGENTS.md

## Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing
\`\`\`bash
npm test
\`\`\`

## Project Structure
- \`/src\` — Source code
- \`/tests\` — Test files`,
      },
    },
    {
      id: 'copilot-frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          id: 'copilot-frontend-agents',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Nested Context',
            description: 'Same as root AGENTS.md but scoped to this subdirectory. Provides additional context specific to this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to (doesn\'t replace) root context.',
            loadOrder: 3,
            example: `# Frontend AGENTS.md

## Stack
- React 18 with TypeScript
- Vite for bundling

## Key Directories
- \`/src/components\` — UI components
- \`/src/hooks\` — Custom hooks`,
          },
        },
        {
          id: 'copilot-frontend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
    {
      id: 'copilot-backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          id: 'copilot-backend-agents',
          name: 'AGENTS.md',
          type: 'file',
          details: {
            label: 'Nested Context',
            description: 'Same as root AGENTS.md but scoped to this subdirectory. Provides additional context specific to this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to (doesn\'t replace) root context.',
            loadOrder: 3,
            example: `# Backend AGENTS.md

## Stack
- Node.js with Express
- PostgreSQL with Prisma

## Key Directories
- \`/src/routes\` — API routes
- \`/src/services\` — Business logic`,
          },
        },
        {
          id: 'copilot-backend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
}

export const claudeTree: FileNode = {
  id: 'claude-root',
  name: 'my-project',
  type: 'folder',
  children: [
    {
      id: 'claude-dotclaude',
      name: '.claude',
      type: 'folder',
      children: [
        {
          id: 'claude-settings',
          name: 'settings.json',
          type: 'file',
          details: {
            label: 'Claude Settings',
            description: 'Configuration for Claude Code behavior including model selection and tool permissions.',
            whatGoesHere: [
              'Model preferences',
              'Tool permissions',
              'MCP server configurations',
            ],
            whenLoaded: 'Always loaded. Configures Claude\'s capabilities.',
            loadOrder: 3,
            example: `{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": ["read", "write", "bash"]
  }
}`,
          },
        },
        {
          id: 'claude-skills-folder',
          name: 'skills',
          type: 'folder',
          children: [
            {
              id: 'claude-skill-refactor',
              name: 'refactor',
              type: 'folder',
              children: [
                {
                  id: 'claude-skill-refactor-file',
                  name: 'SKILL.md',
                  type: 'file',
                  details: {
                    label: 'Skill',
                    description: 'Reusable workflows Claude can invoke. Same concept as Copilot skills.',
                    whatGoesHere: [
                      'Skill metadata (name, description)',
                      'Step-by-step instructions',
                      'Tool usage patterns',
                    ],
                    whenLoaded: 'Auto-selected based on task matching.',
                    loadOrder: 4,
                    example: `---
name: "Safe Refactor"
description: "Refactor code while maintaining tests"
---

# Safe Refactoring

1. Run existing tests first
2. Make incremental changes
3. Run tests after each change
4. Commit working states`,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'claude-md',
      name: 'CLAUDE.md',
      type: 'file',
      details: {
        label: 'Project Memory',
        description: 'Claude\'s primary file for project context. Claude reads this automatically to understand the project.',
        whatGoesHere: [
          'Project overview and conventions',
          'Key commands (build, test, run)',
          'Architecture notes',
          'Anything you want Claude to "remember"',
        ],
        whenLoaded: 'Always loaded first. Forms the baseline context for all Claude interactions.',
        loadOrder: 1,
        example: `# CLAUDE.md

## Project Overview
A web application built with React and Node.js.

## Commands
- \`npm run dev\` — Start development
- \`npm test\` — Run tests
- \`npm run build\` — Production build

## Conventions
- Use TypeScript strict mode
- Prefer functional patterns
- Write tests for new features`,
      },
    },
    {
      id: 'claude-frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          id: 'claude-frontend-md',
          name: 'CLAUDE.md',
          type: 'file',
          details: {
            label: 'Nested Memory',
            description: 'Additional context for this directory. Claude reads this when working in this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to root context.',
            loadOrder: 2,
            example: `# Frontend CLAUDE.md

## Stack
- React 18 with hooks
- TanStack Query for data fetching

## Patterns
- Components in /components
- Hooks in /hooks`,
          },
        },
        {
          id: 'claude-frontend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
    {
      id: 'claude-backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          id: 'claude-backend-md',
          name: 'CLAUDE.md',
          type: 'file',
          details: {
            label: 'Nested Memory',
            description: 'Additional context for this directory. Claude reads this when working in this area.',
            whatGoesHere: [
              'Directory-specific stack info',
              'Local conventions',
              'Relevant commands',
            ],
            whenLoaded: 'Loaded when working in this directory. Adds to root context.',
            loadOrder: 2,
            example: `# Backend CLAUDE.md

## Stack
- Express.js API
- Prisma ORM

## Patterns
- Routes in /routes
- Services in /services`,
          },
        },
        {
          id: 'claude-backend-src',
          name: 'src',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
}

export const trees: Record<Provider, FileNode> = {
  copilot: copilotTree,
  claude: claudeTree,
}
