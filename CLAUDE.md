# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope

`siae-plugin` is a Claude Code plugin that enforces a structured development cycle via hooks, skills, and agents. It is the deliverable for SIAE Hackathon 2026 (Story 1). Story 2 is a SIAE+ web app (Vue 3 frontend + Express backend) built using this plugin's conventions.

## Commands

```bash
# Install root dependencies (includes SIAE design system from local tarball)
npm install

# Install the SIAE design system in a new project
npm install ./itsiae-siae-design-system-1.0.3.tgz

# Run hook tests (must pass all 6 cases)
bash siae-plugin/tests/test.sh

# Run a single test by line number or grep
bash siae-plugin/tests/test.sh | grep "test_name"
```

## Plugin Structure

```
siae-plugin/
├── .claude-plugin/plugin.json          # Plugin manifest (name, version, description)
├── hooks/hooks.json                    # Hook event registrations
├── scripts/
│   ├── session-start.sh                # SessionStart hook script
│   └── pre-commit.sh                   # PreToolUse hook script (Conventional Commits)
├── skills/
│   ├── brainstorming/SKILL.md          # Triggered by: implementa, crea, scrivi, aggiungi
│   ├── implementation/SKILL.md         # Vue 3 + TypeScript conventions
│   ├── tdd/SKILL.md                    # RED → GREEN → REFACTOR cycle
│   └── verification/SKILL.md           # Final gate before declaring task done
├── agents/reviewer.md                  # Code review agent (respects max_tokens budget)
└── tests/
    ├── test.sh                         # Hook integration tests runner (min. 6 cases)
    ├── test-sessionstart-hook.test.sh  # SessionStart hook tests
    └── test-precommit-hook.test.sh     # PreToolUse / Conventional Commits tests
```

## Hooks

| Event | Behavior |
|-------|----------|
| `SessionStart` | Announce all available skills to the user |
| `PreToolUse` | Validate Conventional Commits format before any git commit tool call |

## Mandatory Rules

- **Conventional Commits**: every commit must match `type(scope): description` — enforced by `PreToolUse` hook.
- **TDD**: no production code without a failing test first. Cycle: RED → GREEN → REFACTOR.
- **Verification gate**: before marking any task complete, run the verification skill.

## Available Skills

| Skill | When to invoke |
|-------|----------------|
| `brainstorming` | User message contains: *implementa, crea, scrivi, aggiungi* |
| `implementation` | Writing Vue 3 + TypeScript code for SIAE+ app |
| `tdd` | Any new feature or fix — drives the RED→GREEN→REFACTOR loop |
| `verification` | Final check before declaring a task done |

## Available Agents

| Agent | Purpose |
|-------|---------|
| `reviewer` | Code review with bounded token budget; invoked after implementation |

## SIAE Design System

Pre-built Vue 3 + Tailwind v4 component library, available offline from the local tarball.

```js
// main.ts
import '@itsiae/siae-design-system/dist/siae-design-system.css'
import * as SiaeDS from '@itsiae/siae-design-system'
```

Peer deps required: `vue@^3.5`, `vue-router@^4.5`, `@nuxt/ui@^3.2`.
