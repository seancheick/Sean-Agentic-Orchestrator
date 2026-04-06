<div align="center">

# 🤖 Agentic Engineering Orchestrator

**A Claude Code skill that guarantees your engineering work is done — not just written.**

[![npm version](https://img.shields.io/npm/v/sean-agentic-orchestrator?style=for-the-badge&color=CB3837&logo=npm)](https://www.npmjs.com/package/sean-agentic-orchestrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-8A2BE2?style=for-the-badge&logo=anthropic)](https://docs.anthropic.com/en/docs/claude-code)

[![Made with AI](https://img.shields.io/badge/Made_with-Claude_AI-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white)](https://claude.ai)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-00C851?style=for-the-badge)](https://github.com/seancheick/Sean-Agentic-Orchestrator)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=for-the-badge&logo=github)](https://github.com/seancheick/Sean-Agentic-Orchestrator/pulls)
[![Company](https://img.shields.io/badge/B%26Br_Technology-Founder-1A1A2E?style=for-the-badge)](https://github.com/seancheick)

---

*Atomic task decomposition · 9-point verification gates · Cost-aware model routing · Self-healing repair loops*

</div>

---

## 🧠 What It Does

When you give Claude Code a large engineering goal, this skill activates and:

1. 🔍 **Decomposes** the goal into atomic, testable tasks (max 3 files each)
2. ⚡ **Auto-detects** your stack — language, framework, test runner, build system, linter
3. 💰 **Routes** each task to the cheapest model tier capable of handling it (saves tokens)
4. 🔁 **Executes** tasks sequentially with a strict agent pipeline: Reader → Builder → Test → QA → Leader sign-off
5. ✅ **Verifies** every task through a 9-point Done Gate (build, tests, lint, regression, security, QA...)
6. 🛠️ **Self-heals** — failures trigger automatic repair loops with escalation after 3 attempts
7. 🧹 **Manages context** — advises when to compact or start fresh sessions

> **No task is marked DONE until build passes, tests pass, and the leader agent explicitly approves.**

---

## 🚀 Quick Install

```bash
npx sean-agentic-orchestrator
```

Then open Claude Code and type `/agentic-orchestrator`. That's it.

---

## 📦 All Install Options

### Option A — npx (Recommended)

```bash
npx sean-agentic-orchestrator
```

Automatically copies skill files to `~/.claude/skills/agentic-orchestrator`.

### Option B — Global Install

```bash
npm install -g sean-agentic-orchestrator
```

### Option C — Git Clone

```bash
git clone https://github.com/seancheick/Sean-Agentic-Orchestrator.git /tmp/ao
mkdir -p ~/.claude/skills
cp -r /tmp/ao ~/.claude/skills/agentic-orchestrator
rm -rf /tmp/ao
```

### Option D — Manual

1. Download this repo as a ZIP
2. Extract and copy the folder to `~/.claude/skills/agentic-orchestrator`

### ✅ Verify Installation

```
/agentic-orchestrator
```

Claude will activate the orchestrator and begin the intake phase.

---

## 🛠️ Supported Stacks

Works with any tech stack. Includes built-in commands, pitfalls, and conventions for:

| Stack | Detection |
|-------|-----------|
| ⚛️ Next.js / React / TypeScript | `package.json`, `tsconfig.json`, `next.config.*` |
| 🐦 Flutter / Dart | `pubspec.yaml`, `.dart` files |
| 🐍 Python / Django / FastAPI | `pyproject.toml`, `manage.py`, `requirements.txt` |
| 🦀 Rust | `Cargo.toml` |
| 🐹 Go | `go.mod` |
| 🍎 Swift / iOS | `Package.swift`, `.xcodeproj` |
| ☕ Spring Boot / Java / Kotlin | `pom.xml`, `build.gradle` |
| 🐘 Supabase / PostgreSQL | `supabase/` directory, `.sql` files |
| 📦 Monorepos | `turbo.json`, `nx.json`, `pnpm-workspace.yaml` |

---

## 💡 Usage

### Invoke Directly

```
/agentic-orchestrator

Add user authentication with JWT tokens, refresh token rotation,
and role-based access control to my Express API.
```

### Natural Trigger Phrases

The skill also activates on:
- *"Break this down and execute..."*
- *"Orchestrate the implementation of..."*
- *"Plan and execute this feature..."*
- Any multi-step engineering goal

### What You'll See

**Planning phase** — structured task list with model tiers, risk levels, dependencies:

```
T1: Set up JWT signing/verification utilities    [Mid] [Low Risk]
T2: Create auth middleware                       [Mid] [High Risk]
T3: Add refresh token rotation endpoint          [Mid] [High Risk]
T4: Implement role-based access control          [Mid] [Medium Risk]
T5: Add auth tests                               [Mid] [Low Risk]
```

**Execution phase** — verified output after each task:

```
TASK EXECUTION
Task ID: T1  |  Status: QA_REVIEW
Files: src/utils/jwt.ts — signing/verification helpers
Build:  PASS
Tests:  PASS (12 passed, 0 failed)
Lint:   PASS
```

**Done Gate** — explicit leader sign-off before the next task begins.

---

## 🤖 Agent System

9 specialized agents coordinate to execute your work:

| Agent | Role |
|-------|------|
| 👑 **Leader** | Owns the plan, controls progress, runs done gates |
| 📋 **Planner** | Decomposes goals into atomic tasks |
| 📖 **Reader** | Cheap context gathering and targeted file scanning |
| 🔨 **Builder** | Implements changes with strict scope control |
| 🐛 **Debug** | Investigates failures, isolates root causes |
| 🧪 **Test** | Validates behavior, identifies missing coverage |
| 🔍 **QA/QC** | Reviews quality, rejects incomplete work |
| 🔒 **Security** | OWASP scanning, secrets detection, auth validation |
| ⚡ **Perf** | Profiling, bottleneck detection, optimization validation |

---

## ✅ The 9-Point Done Gate

Every task must pass ALL gates before being marked DONE:

| # | Gate | What It Checks |
|---|------|----------------|
| 1 | 📐 Scope | All requested work is implemented |
| 2 | 🎯 Acceptance | Success criteria are satisfied |
| 3 | 🏗️ Build | Zero errors, zero new warnings |
| 4 | 🧪 Tests | Pass — new tests where gaps existed |
| 5 | 🧹 Lint | Passes (if configured) |
| 6 | 🔄 Regression | No breakage in adjacent code |
| 7 | 🔒 Security | No new vulnerabilities (boundary tasks) |
| 8 | 💎 QA | Maintainable, follows conventions |
| 9 | 👑 Leader | Explicit approval |

> Any gate fails → task status = `FIX_REQUIRED` → automatic repair loop.

---

## 💰 Model Routing

The orchestrator routes each task to the **cheapest capable model tier** — no wasted tokens:

| Tier | Model | Used For |
|------|-------|---------|
| 🟢 **Cheap** | haiku | Reading, scanning, extraction, summaries |
| 🟡 **Mid** | sonnet | Implementation, testing, QA, bug fixes |
| 🔴 **High** | opus | Architecture, ambiguous root-cause, critical reviews |

---

## 📁 Skill Structure

```
agentic-orchestrator/
├── SKILL.md                        # Core orchestrator — principles, loop, done gate
└── references/
    ├── agent-roles.md              # 9 specialized agent definitions
    ├── model-routing.md            # Full escalation/de-escalation policy
    ├── output-templates.md         # 6 structured output templates
    ├── stack-patterns.md           # 9 tech stack command & pitfall guides
    └── failure-recovery.md         # Recovery patterns & escalation ladder
```

---

## ⚙️ Configuration

**Zero configuration needed.** The skill auto-reads your project's existing config:

- `CLAUDE.md` — project instructions
- `package.json` / `Cargo.toml` / `go.mod` / `pyproject.toml` — scripts & deps
- `tsconfig.json` — TypeScript settings
- `.eslintrc` / `biome.json` / `rustfmt.toml` — linter config
- `turbo.json` / `nx.json` — monorepo config

---

## 🤝 Contributing

Contributions welcome!

1. Fork this repository
2. Edit `references/` for stack patterns, agent roles, or recovery patterns
3. Edit `SKILL.md` for core orchestration logic
4. Test locally: copy to `~/.claude/skills/agentic-orchestrator` and run `/agentic-orchestrator`
5. Submit a PR with description of what changed and why

### Adding a New Stack

Edit `references/stack-patterns.md`:
1. Add detection (what config files indicate this stack)
2. Add build/test/lint commands
3. Add common pitfalls
4. Add conventions to check

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

## Built by

**Sean Cheick**
Founder & CEO · [B&Br Technology](https://github.com/seancheick)

[![GitHub](https://img.shields.io/badge/GitHub-seancheick-181717?style=for-the-badge&logo=github)](https://github.com/seancheick)
[![npm](https://img.shields.io/badge/npm-sean--agentic--orchestrator-CB3837?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/sean-agentic-orchestrator)

---

⭐ **If this skill saves you time, star the repo — it helps others find it.**

</div>
