# Agentic Engineering Orchestrator

A Claude Code skill that orchestrates complex software engineering work through atomic task decomposition, strict verification gates, cost-aware model routing, and self-healing repair loops.

Built for engineers who ship production code and need guarantees — not hopes — that every task is complete, tested, and verified before moving on.

---

## What It Does

When you give Claude Code a large engineering goal, this skill activates and:

1. **Decomposes** the goal into atomic, testable tasks (max 3 files each)
2. **Auto-detects** your stack — language, framework, test runner, build system, linter
3. **Routes** each task to the cheapest model tier that can handle it (saving tokens)
4. **Executes** tasks sequentially with a strict agent pipeline: Reader → Builder → Test → QA → Leader sign-off
5. **Verifies** every task through a 9-point Done Gate (build, tests, lint, regression, security, QA...)
6. **Self-heals** — failures trigger automatic repair loops with escalation after 3 attempts
7. **Manages context** — advises when to compact or start fresh sessions

No task is marked DONE until build passes, tests pass, and the leader agent explicitly approves.

---

## Supported Stacks

Works with any tech stack. Includes built-in patterns and commands for:

| Stack | Detection |
|-------|-----------|
| Next.js / React / TypeScript | `package.json`, `tsconfig.json`, `next.config.*` |
| Flutter / Dart | `pubspec.yaml`, `.dart` files |
| Python / Django / FastAPI | `pyproject.toml`, `manage.py`, `requirements.txt` |
| Rust | `Cargo.toml` |
| Go | `go.mod` |
| Swift / iOS | `Package.swift`, `.xcodeproj` |
| Spring Boot / Java / Kotlin | `pom.xml`, `build.gradle` |
| Supabase / PostgreSQL | `supabase/` directory, `.sql` files |
| Monorepos | `turbo.json`, `nx.json`, `pnpm-workspace.yaml` |

---

## Installation

### Option A: npm (Recommended)

```bash
npx sean-agentic-orchestrator
```

This automatically copies the skill files to `~/.claude/skills/agentic-orchestrator`. Done.

Or install globally for repeated use:

```bash
npm install -g sean-agentic-orchestrator
```

### Option B: Git Clone

```bash
git clone https://github.com/seancheick/Sean-Agentic-Orchestrator.git /tmp/agentic-orchestrator-repo
mkdir -p ~/.claude/skills
cp -r /tmp/agentic-orchestrator-repo ~/.claude/skills/agentic-orchestrator
rm -rf /tmp/agentic-orchestrator-repo
```

### Option C: Manual Download

1. Download or clone this repository
2. Copy the entire folder to `~/.claude/skills/agentic-orchestrator`
3. Ensure the structure looks like:

```
~/.claude/skills/agentic-orchestrator/
├── SKILL.md
└── references/
    ├── agent-roles.md
    ├── failure-recovery.md
    ├── model-routing.md
    ├── output-templates.md
    └── stack-patterns.md
```

### Verify Installation

Open Claude Code and type:

```
/agentic-orchestrator
```

If installed correctly, Claude will activate the orchestrator and begin the intake phase.

---

## Usage

### Basic Usage

Just describe your engineering goal. The orchestrator activates automatically on complex multi-step work, or invoke it directly:

```
/agentic-orchestrator

Add user authentication with JWT tokens, refresh token rotation,
and role-based access control to my Express API.
```

The orchestrator will:
1. Read your project files to detect conventions
2. Break the work into atomic tasks
3. Present a numbered checklist for your approval
4. Execute tasks one by one with full verification
5. Report results after each task

### Trigger Phrases

The skill activates on requests like:
- "Break this down and execute..."
- "Orchestrate the implementation of..."
- "Plan and execute..."
- Any multi-step engineering goal that requires decomposition

### What You'll See

**Planning phase** — a structured task list with IDs, model tiers, dependencies, and risk levels:

```
T1: Set up JWT signing/verification utilities    [Mid] [Low Risk]
T2: Create auth middleware                       [Mid] [High Risk]
T3: Add refresh token rotation endpoint          [Mid] [High Risk]
T4: Implement role-based access control          [Mid] [Medium Risk]
T5: Add auth tests                               [Mid] [Low Risk]
```

**Execution phase** — after each task, a structured report:

```
TASK EXECUTION
Task ID: T1
Status: QA_REVIEW
Files Touched: src/utils/jwt.ts — created signing/verification helpers
Build: PASS
Tests: PASS (12 passed, 0 failed)
Lint: PASS
```

**Done Gate** — explicit leader sign-off before advancing.

### Model Routing

The orchestrator automatically assigns the cheapest model capable of each task:

| Tier | Used For | Examples |
|------|----------|---------|
| **Cheap** (haiku) | Reading, scanning, extraction | File structure analysis, symbol lookup |
| **Mid** (sonnet) | Implementation, testing, QA | Feature code, bug fixes, test writing |
| **High** (opus) | Architecture, hard debugging | System design, ambiguous root-cause analysis |

This saves significant token cost on large projects.

---

## Skill Structure

```
agentic-orchestrator/
├── SKILL.md                        # Core orchestrator — principles, execution loop, done gate
└── references/
    ├── agent-roles.md              # 9 specialized agent definitions with responsibilities
    ├── model-routing.md            # Full escalation/de-escalation policy with examples
    ├── output-templates.md         # 6 structured output templates (plan, execute, QA, etc.)
    ├── stack-patterns.md           # 9 tech stack guides with commands and pitfalls
    └── failure-recovery.md         # Recovery patterns and escalation ladder
```

### Agent System

| Agent | Role |
|-------|------|
| **Leader** | Owns the plan, controls progress, runs done gates |
| **Planner** | Decomposes goals into atomic tasks |
| **Reader** | Cheap context gathering and file scanning |
| **Builder** | Implements changes with tight scope control |
| **Debug** | Investigates failures, isolates root causes |
| **Test** | Validates behavior, identifies missing coverage |
| **QA/QC** | Reviews quality, rejects incomplete work |
| **Security** | OWASP scanning, secrets detection, auth validation |
| **Perf** | Profiling, bottleneck detection, optimization validation |

---

## How It Works

### The Done Gate

Every task must pass ALL 9 gates before being marked DONE:

| # | Gate | What It Checks |
|---|------|----------------|
| 1 | Scope | All requested work is implemented |
| 2 | Acceptance | Success criteria are satisfied |
| 3 | Build | Zero errors, zero new warnings |
| 4 | Tests | Pass, new tests where gaps existed |
| 5 | Lint | Passes (if configured) |
| 6 | Regression | No breakage in adjacent code |
| 7 | Security | No new vulnerabilities (boundary tasks) |
| 8 | QA | Maintainable, follows conventions |
| 9 | Leader | Explicit approval |

If any gate fails, the task enters a repair loop automatically.

### Repair Loop

When something breaks:
1. A fix subtask is created (`T3.1`, `T3.2`, etc.)
2. The appropriate agent is assigned (Debug for failures, Security for vulns)
3. Fix is applied with minimal scope
4. Full verification pipeline re-runs
5. Max 3 repair passes — then escalates to High model or marks BLOCKED

### Context Management

The orchestrator monitors token usage and recommends:
- **Continue** — plenty of context remaining
- **Compact** — summarize completed work, free up context
- **Fresh session** — switch features or clear stale history

---

## Configuration

No configuration needed. The skill reads your project's existing config files:

- `CLAUDE.md` — project instructions
- `package.json` / `Cargo.toml` / `go.mod` / `pyproject.toml` — dependencies and scripts
- `tsconfig.json` — TypeScript settings
- `.eslintrc` / `biome.json` / `rustfmt.toml` — linter config
- `turbo.json` / `nx.json` — monorepo config

The orchestrator adapts its build/test/lint commands to match your project.

---

## Contributing

Contributions welcome. To improve the skill:

1. Fork this repository
2. Edit files in the `references/` directory for stack patterns, agent roles, or recovery patterns
3. Edit `SKILL.md` for core orchestration logic
4. Test by copying to `~/.claude/skills/agentic-orchestrator` and running `/agentic-orchestrator` on a real project
5. Submit a PR with a description of what changed and why

### Adding Stack Support

To add a new tech stack, edit `references/stack-patterns.md`:
1. Add a detection section (what files indicate this stack)
2. Add build/test/lint commands
3. Add common pitfalls specific to that stack
4. Add conventions to check

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

Built by [Sean Cheick](https://github.com/seancheick) with the [Claude Code Skill Creator](https://docs.anthropic.com/en/docs/claude-code).

If this skill saves you time, consider starring the repo.
