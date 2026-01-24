# Vision: ESLint for AI Primitives

**Status**: Dream / Concept
**Date**: January 23, 2026
**Related**: strategic-vision-2026.md (Route 1: Configuration Quality Platform)

## Overview

What would it feel and look like to have an ESLint-equivalent for Skills and other AI primitives, using existing conventions from modern linters?

This document explores the user experience, features, and technical patterns that would make AI configuration linting feel native and essential to developers.

---

## CLI Experience

```bash
# Install
bun add -D @agentconfig/lint

# Initialize config
agentconfig init
✓ Created agentconfig.json
✓ Detected GitHub Copilot setup
✓ Detected Claude Code setup
  Added recommended rules for your stack

# Run
agentconfig lint .github/skills/

Linting 12 primitive files...

.github/skills/deploy/SKILL.md
  12:15  error    Unsafe bash command without validation           security/bash-injection
  18:3   warning  Hardcoded API endpoint, use env var              best-practices/no-hardcoded-urls
  45:1   warning  Missing error handling section                   completeness/error-handling

.github/copilot-instructions.md
  8:1    error    Instruction conflicts with scope rule            conflicts/instruction-override
  15:22  warning  Overly broad file pattern may impact performance patterns/glob-optimization

.claude/skills/test-runner/SKILL.md
  23:5   error    Exposes credentials in command args              security/credential-exposure
  67:12  warning  Deprecated $ARGUMENTS syntax, use $INPUT         deprecation/arguments-syntax

✖ 6 problems (3 errors, 3 warnings)
  2 errors and 1 warning potentially fixable with --fix
```

---

## Configuration File (agentconfig.json)

```json
{
  "providers": ["copilot", "claude", "cursor"],
  "extends": [
    "@agentconfig/recommended",
    "@agentconfig/security"
  ],
  "rules": {
    "security/bash-injection": "error",
    "security/credential-exposure": "error",
    "best-practices/no-hardcoded-urls": "warn",
    "completeness/frontmatter-required": ["error", {
      "required": ["name", "description", "version"]
    }],
    "cross-provider/portable-paths": "error"
  },
  "overrides": [
    {
      "files": ["*.agent.md"],
      "rules": {
        "agents/tool-permissions": "error",
        "agents/role-clarity": "warn"
      }
    }
  ],
  "ignore": [
    "**/drafts/**",
    "**/*.draft.md"
  ]
}
```

---

## Auto-Fix in Action

```bash
agentconfig lint --fix .github/skills/

Fixing 3/6 problems...

.github/skills/deploy/SKILL.md
  ✓ Fixed: Replaced $ARGUMENTS with $INPUT (line 67)
  ✓ Fixed: Added quotes around bash variable (line 34)

.claude/commands/commit.md
  ✓ Fixed: Updated deprecated frontmatter format

✖ 3 problems remain (require manual attention)
```

---

## IDE Integration (VSCode)

```typescript
// Real-time squiggly underlines as you type
---
name: Deploy to Production
---

# Deploy Workflow

Run this command:
```bash
curl -X POST $API_ENDPOINT/deploy  // 🔴 security/credential-exposure
                                    // API endpoint should use environment variable
```

// Quick fix menu
💡 Quick Fix...
   → Use environment variable
   → Add to agentconfig ignore
   → Disable rule for this line
   → Show rule documentation
```

### IDE Features

- **Real-time validation** as you type
- **Squiggly underlines** (red for errors, yellow for warnings)
- **Quick fix menu** with actionable suggestions
- **Hover documentation** explaining why the rule triggered
- **Code actions** to automatically apply fixes
- **IntelliSense** for frontmatter fields and known primitives

---

## Rule Documentation

```bash
agentconfig explain security/bash-injection

security/bash-injection

Detects unsafe bash commands that may be vulnerable to injection attacks.

❌ Incorrect:
```bash
gh pr create --title "$USER_INPUT"
```

✅ Correct:
```bash
gh pr create --title "$(printf '%s' "$USER_INPUT" | jq -Rs .)"
```

Why: User input in bash commands must be sanitized to prevent
injection attacks. Use proper escaping or parameterized commands.

Related: security/credential-exposure, security/eval-usage
Learn more: https://agentconfig.org/rules/security/bash-injection
```

---

## Shareable Configs

```json
// @agentconfig/config-security/index.json
{
  "rules": {
    "security/bash-injection": "error",
    "security/credential-exposure": "error",
    "security/eval-usage": "error",
    "security/unsafe-permissions": "error",
    "security/hardcoded-secrets": "error",
    "security/arbitrary-code-exec": "error"
  }
}

// @agentconfig/config-copilot/index.json
{
  "providers": ["copilot"],
  "rules": {
    "copilot/skill-structure": "error",
    "copilot/agent-format": "error",
    "copilot/instruction-scope": "warn"
  }
}
```

### Popular Shareable Configs

- `@agentconfig/recommended` - Essential rules everyone should use
- `@agentconfig/security` - Security-focused rules
- `@agentconfig/copilot` - GitHub Copilot specific rules
- `@agentconfig/claude` - Claude Code specific rules
- `@agentconfig/cursor` - Cursor specific rules
- `@agentconfig/all` - Every available rule (strict mode)
- `@company/config` - Enterprise custom config packages

---

## Plugin System

```typescript
// agentconfig-plugin-custom-rules/index.ts
export default {
  rules: {
    'company/require-approval-step': {
      meta: {
        type: 'problem',
        docs: {
          description: 'All deploy skills must include approval step',
          category: 'Company Policy',
        },
        fixable: 'code',
      },
      create(context) {
        return {
          Skill(node) {
            if (node.tags.includes('deploy') && !hasApprovalStep(node)) {
              context.report({
                node,
                message: 'Deploy skills must include manual approval step',
                fix(fixer) {
                  return fixer.insertTextAfter(
                    node.steps,
                    '\n## Approval Required\n\nObtain approval before proceeding.\n'
                  )
                },
              })
            }
          },
        }
      },
    },
  },
}
```

### Plugin Ecosystem

Plugins enable:
- **Custom rules** specific to your organization
- **Provider-specific validation** for emerging platforms
- **Framework integrations** (Next.js skills, Rails skills, etc.)
- **Security scanners** using specialized detection logic
- **Performance analyzers** with profiling capabilities

---

## CI/CD Integration

```yaml
# .github/workflows/lint-primitives.yml
name: Lint AI Primitives

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: agentconfig/lint-action@v1
        with:
          config: agentconfig.json
          fail-on: error
          auto-fix: true
          comment-pr: true  # Posts results as PR comment
```

### CI/CD Features

- **GitHub Action** for seamless integration
- **PR comments** with inline annotations
- **Auto-fix commits** (optional)
- **Diff-aware linting** (only check changed files)
- **Performance budgets** (fail if primitives too complex)
- **Security gates** (block merges on critical issues)

---

## Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
agentconfig lint --staged --quiet

# Only blocks commit on errors, warnings pass through
```

### Git Hook Features

- **Pre-commit validation** catches issues before they're committed
- **Staged files only** for fast feedback
- **Configurable blocking** (errors block, warnings don't)
- **Auto-fix on commit** (optional)

---

## Cross-Provider Validation

```bash
agentconfig lint --cross-provider .github/skills/

Checking cross-provider compatibility...

.github/skills/file-search/SKILL.md
  ⚠ Compatibility Issues:

    GitHub Copilot ✓ Compatible
    Claude Code    ✓ Compatible
    Cursor         ✗ Incompatible

    Issues:
    • Line 45: Uses Copilot-specific $VSCODE_WORKSPACE (not available in Cursor)
    • Line 67: Assumes .github/skills/ path (Cursor uses .cursor/skills/)

  💡 Suggestion: Use $WORKSPACE_ROOT and relative paths for portability
```

### Cross-Provider Features

- **Compatibility matrix** for each primitive
- **Provider-specific variable detection**
- **Path convention validation**
- **Feature availability checking**
- **Migration suggestions** for portability

---

## Rule Severity Levels

```json
{
  "rules": {
    // error - blocks CI, shows red squigglies
    "security/credential-exposure": "error",

    // warn - passes CI, shows yellow squigglies
    "best-practices/no-hardcoded-urls": "warn",

    // off - disabled completely
    "style/prefer-yaml-frontmatter": "off",

    // Custom severity with options
    "completeness/frontmatter-required": ["error", {
      "required": ["name", "description"],
      "optional": ["version", "author"]
    }]
  }
}
```

### Severity Semantics

| Level | CI Behavior | IDE Display | Use Case |
|-------|-------------|-------------|----------|
| `error` | Fails build | Red squiggle | Security issues, breaking problems |
| `warn` | Passes build | Yellow squiggle | Best practices, style preferences |
| `off` | Ignored | None | Disabled rules |

---

## Smart Suggestions

```bash
agentconfig lint --suggest .github/skills/

Analyzing patterns...

📊 Insights:
  • 8/12 skills don't handle error cases
  • 5/12 skills have potential security issues
  • 3/12 skills use deprecated syntax

💡 Suggestions:

  1. Add error handling template
     Skills without try/catch or error validation: deploy, test, migrate
     → Run: agentconfig fix --template error-handling

  2. Update to modern syntax
     3 skills use deprecated $ARGUMENTS
     → Run: agentconfig migrate --from arguments --to input

  3. Security audit recommended
     → Run: agentconfig audit --security
```

---

## Performance Impact Report

```bash
agentconfig analyze .github/

Performance Analysis:

.github/copilot-instructions.md
  ⚠ Performance Impact: MEDIUM
  • Line 8: Glob pattern "**/*.{ts,tsx,js,jsx}" matches 12,453 files
  • Suggestion: Scope to relevant directories

    Current:  applyTo: ["**/*.{ts,tsx,js,jsx}"]
    Better:   applyTo: ["src/**/*.{ts,tsx}"]
    Impact:   98% fewer files scanned

.github/skills/auto-test/SKILL.md
  ✓ Performance Impact: LOW
  • Well-scoped file patterns
  • Efficient tool usage
```

---

## Dream Features

### 1. Semantic Understanding

Not just regex matching - understands the _intent_ of primitives:

```bash
# Detects logical conflicts
"You say 'never use console.log' in instructions.md
 but your debug skill generates console.log statements"
```

**How it works**:
- Parses primitive semantics, not just syntax
- Builds knowledge graph of instructions, rules, and skills
- Detects contradictions and conflicts
- Suggests resolutions based on context

---

### 2. Security Scanning

```bash
agentconfig scan --security

🔒 Security Report:

CRITICAL (1):
  • .claude/skills/deploy/SKILL.md:23
    Credential exposure: GitHub token in plain text

HIGH (2):
  • Command injection vulnerability in user input
  • Arbitrary file write without path validation

MEDIUM (3):
  • Overly permissive file access patterns
  • External API calls without timeout
  • Unvalidated regex in user input

Recommendations:
→ Use secret management (GitHub Secrets, env vars)
→ Validate and sanitize all user inputs
→ Restrict file operations to safe directories
```

**Security Rules**:
- Credential exposure detection
- Command injection patterns
- Path traversal vulnerabilities
- Unsafe eval/exec usage
- Excessive permissions
- Unvalidated user input
- Secrets in code

---

### 3. Dependency Graph

```bash
agentconfig graph

Primitive Dependency Graph:

copilot-instructions.md
  ├── imports: .github/instructions/typescript.md
  │   └── conflicts with: .github/rules/style.md (line 12)
  │
  └── references: .github/skills/test/
      └── requires: .github/agents/test-runner.agent.md

⚠ Circular dependency detected:
  deploy.skill.md → test.skill.md → deploy.skill.md
```

**Graph Analysis**:
- Imports and references tracking
- Circular dependency detection
- Conflict identification
- Impact analysis (what changes affect what)
- Orphaned primitive detection

---

### 4. AI-Powered Fixes

```bash
agentconfig fix --ai

Using AI to suggest fixes...

.github/skills/deploy/SKILL.md
  Problem: Hardcoded configuration values
  AI Suggestion:

    Extract to config:

    // Create .github/config/deploy.json
    {
      "apiEndpoint": "https://api.example.com",
      "region": "us-west-2"
    }

    // Update skill to reference:
    API_ENDPOINT=$(jq -r '.apiEndpoint' .github/config/deploy.json)

  Apply this fix? (y/n)
```

**AI Features**:
- Context-aware fix suggestions
- Refactoring recommendations
- Pattern learning from corrections
- Natural language explanations
- Interactive fix application

---

## Rule Categories

### Security Rules
- `security/bash-injection` - Unsafe bash commands
- `security/credential-exposure` - Hardcoded secrets
- `security/eval-usage` - Dangerous eval/exec
- `security/unsafe-permissions` - Overly permissive access
- `security/arbitrary-code-exec` - Unvalidated code execution
- `security/path-traversal` - Unsafe file path handling

### Best Practices
- `best-practices/no-hardcoded-urls` - Use configuration
- `best-practices/error-handling` - Require error handling
- `best-practices/documentation` - Require documentation
- `best-practices/naming-convention` - Consistent naming
- `best-practices/single-responsibility` - One purpose per primitive

### Completeness
- `completeness/frontmatter-required` - Required metadata
- `completeness/description` - Require descriptions
- `completeness/examples` - Require usage examples
- `completeness/test-coverage` - Test expectations

### Performance
- `performance/glob-optimization` - Efficient file patterns
- `performance/excessive-context` - Context size warnings
- `performance/redundant-operations` - Duplicate work detection

### Cross-Provider
- `cross-provider/portable-paths` - Platform-agnostic paths
- `cross-provider/variable-compatibility` - Compatible variables
- `cross-provider/feature-detection` - Available features
- `cross-provider/syntax-compatibility` - Portable syntax

### Deprecation
- `deprecation/arguments-syntax` - Old syntax warnings
- `deprecation/removed-features` - Unsupported features
- `deprecation/migration-path` - Upgrade suggestions

### Conflicts
- `conflicts/instruction-override` - Contradicting instructions
- `conflicts/circular-dependency` - Circular references
- `conflicts/duplicate-definition` - Duplicate primitives

---

## Integration Points

### Editors
- **VSCode Extension**: Real-time validation with squiggles
- **Cursor Extension**: Native integration
- **JetBrains Plugin**: IntelliJ, WebStorm support
- **Vim/Neovim Plugin**: ALE/LSP integration
- **Sublime Text Package**: SublimeLinter integration

### CI/CD
- **GitHub Actions**: Official action
- **GitLab CI**: Pipeline integration
- **CircleCI**: Orb support
- **Jenkins**: Plugin support
- **Azure Pipelines**: Task integration

### Pre-commit/Git Hooks
- **Husky**: Git hook integration
- **Pre-commit**: Python-based hooks
- **Lefthook**: Fast git hook manager
- **Git hooks**: Native git hooks

### Package Managers
- **npm/Bun**: JavaScript ecosystem
- **cargo**: Rust ecosystem (for CLI tool)
- **brew**: macOS package manager
- **apt/yum**: Linux package managers

---

## Technical Architecture

### Parser Layer
- Markdown AST parser (unified/remark)
- YAML frontmatter parser
- Bash/shell script parser
- Variable interpolation parser
- Provider-specific syntax parsers

### Rule Engine
- ESLint-compatible rule API
- AST visitor pattern
- Rule configuration system
- Severity management
- Auto-fix infrastructure

### Plugin System
- npm-style plugin loading
- Rule registration API
- Custom parser support
- Shareable config mechanism

### CLI
- Fast file scanning (parallel)
- Watch mode for development
- JSON/JUnit output formats
- CI-friendly exit codes
- Progress indicators

---

## The Vision

It would feel **native** - like ESLint has always existed for this domain. Developers would:

- ✅ Run it constantly during development
- ✅ Enforce it in CI pipelines
- ✅ Share configs across teams
- ✅ Build custom rules for their domain
- ✅ Trust it to catch issues before they cause problems

The difference? This prevents:
- 🔒 **Security breaches** (credential leaks, injection attacks)
- 🤖 **Confusing agent behavior** (contradicting instructions)
- 💰 **Wasted AI tokens** (inefficient patterns, redundant context)
- 🐛 **Runtime failures** (malformed primitives, missing dependencies)

Instead of just catching style inconsistencies, it catches **real problems that cost real money and time**.

---

## Next Steps

1. **Prototype** basic linter for one primitive type (skills)
2. **Define** core rule set (security + best practices)
3. **Build** MVP CLI tool with auto-fix
4. **Test** with real-world primitives from agentconfig.org
5. **Iterate** based on feedback
6. **Expand** to full multi-provider support
7. **Launch** VSCode extension for IDE integration
8. **Grow** plugin ecosystem

---

## Related Documents

- [strategic-vision-2026.md](./strategic-vision-2026.md) - Overall strategic plan
- Route 1: Configuration Quality Platform - This vision realized
