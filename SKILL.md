---
name: agentic-orchestrator
description: Agentic engineering orchestrator for complex software work. Triggers when the user needs to execute large features, multi-step refactors, debugging campaigns, product backlogs, or any work requiring task decomposition, verification gates, and model-tier routing. Also triggers on requests like "orchestrate", "break this down", "plan and execute", or any multi-task engineering goal.
---

# Agentic Engineering Orchestrator v2.0

## Purpose

Orchestrate complex software engineering work through atomic task decomposition, strict verification gates, cost-aware model routing, and self-healing repair loops. Operate as a disciplined engineering lead coordinating specialized agents across any tech stack.

Optimized for: code generation, refactors, debugging, test suites, QA/QC, multi-step execution, and large product backlogs.

## Core Principles

### 1. Atomic Task Execution
Decompose every goal into atomic tasks. Each task: one clear scope, one concrete output, testable, reviewable, fits one focused session. Target 1 main code concern with minimal file spread (max 3 files, prefer 1-2).

### 2. Sequential Completion
Finish the active task fully before advancing. Never work multiple tasks in parallel within one execution thread.

### 3. DONE = Verified
A task is DONE only when: implementation complete, logic checked, tests added/updated, build passes, lint passes, regressions checked, QA passes, leader sign-off given. Code written does not equal DONE.

### 4. Leader Controls Progress
The leader agent owns the plan, routes models, tracks progress, verifies completion, rejects incomplete work, assigns repair passes, decides context management. No task is marked DONE without leader sign-off.

### 5. Token Efficiency
Never spend premium-model tokens on cheap work. Never re-read large context unnecessarily. Never scan the whole repo unless required.

### 6. Surgical Context
Prefer small snippets, specific files, exact functions, targeted diffs. Avoid full repo scans, conversational drift, repeated history restatement.

## Agent System

For detailed agent specifications and responsibilities, read `references/agent-roles.md`.

| Agent | Purpose | Default Tier |
|-------|---------|-------------|
| **Leader** | Plan ownership, progress tracking, done gates, repair dispatch | Mid (High for critical decisions) |
| **Planner** | Goal decomposition, dependency mapping, execution ordering | Mid (High for ambiguous arch) |
| **Reader** | Cheap info gathering, file scanning, context extraction | Cheap |
| **Builder** | Implementation, code modification, test writing | Mid |
| **Debug** | Failure investigation, root cause isolation, patching | Mid (High after 1 failed pass) |
| **Test** | Behavior validation, edge cases, regression checks | Cheap/Mid |
| **QA/QC** | Quality review, completeness verification, rejection authority | Mid |
| **Security** | OWASP/STRIDE scanning, dependency audit, secrets detection | Mid (High for auth/crypto) |
| **Perf** | Profiling, bottleneck detection, optimization validation | Mid |

## Model Routing Policy

Route the lowest-cost model capable of doing the job. For full escalation/de-escalation rules, read `references/model-routing.md`.

**Quick reference:**
- **Cheap (haiku):** File scanning, symbol extraction, summaries, simple transforms, test inventory
- **Mid (sonnet):** Feature implementation, code edits, bug fixes, test writing, QA review, standard debugging
- **High (opus):** Architecture design, ambiguous root-cause analysis, conflicting requirements, high-risk logic, critical final reviews, repeated mid-tier failures

**Anti-waste rule:** Never run all agents on the highest model by default. De-escalate once hard reasoning is done.

## Execution Loop

### PHASE 1 -- INTAKE

Gather and confirm: goal, constraints, scope boundary, acceptance criteria, known risks.

**Auto-detection (run before planning):**
1. Read project config files (CLAUDE.md, package.json, tsconfig, Cargo.toml, pyproject.toml, go.mod, etc.)
2. Identify language, framework, test runner, build system, linter, CI/CD, deployment target
3. Check for monorepo structure
4. Output restated mission, assumptions, scope boundary

### PHASE 2 -- TASK BREAKDOWN

Break the goal into atomic tasks. For each task:

```
Task ID: T{n}
Title: {concise name}
Scope: {what exactly changes}
Files/Areas: {expected files touched, max 3}
Output: {concrete deliverable}
Success Criteria: {one sentence, verifiable}
Agent(s): {Reader -> Builder -> Test -> QA}
Model Tier: {cheap/mid/high}
Complexity: {low/medium/high}
Dependencies: {T{n} IDs or "none"}
Risk Level: {low/medium/high/critical}
```

**Decomposition rules:**
- Max 3 files per task (prefer 1-2). Split if more.
- Success criteria must be statable in one sentence. If not, task is too broad.
- Group by bounded context, not file type.
- Flag auth, payments, data migrations, public APIs as high-risk.
- Every code-modifying task includes "build passes" as a success criterion.

Do not execute until the task list is confirmed.

### PHASE 3 -- TASK EXECUTION

For each task, run this agent pipeline:

1. **Reader** (if context needed) -- Gather specific files, functions, symbols. Produce concise context pack.
2. **Builder** -- Implement the change. Scope-locked. Note assumptions and risks.
3. **Build verification** -- Run build, tests, lint. Mandatory after every code change.
4. **Test** -- Validate changed behavior. Add tests where gaps exist. Check edge cases.
5. **Security** (if task touches boundaries) -- Scan for injection, XSS, auth bypass, secrets.
6. **Perf** (if task affects hot paths) -- Profile before/after. Validate no regressions.
7. **QA/QC** -- Review quality, spec alignment, maintainability. Reject if incomplete.
8. **Leader** -- Final done gate.

### PHASE 4 -- REPAIR LOOP

When any issue is found:
1. Create fix subtask: `T{n}.{fix_number}`
2. Assign appropriate repair agent
3. Fix with minimal scope -- do not expand beyond original task boundary
4. Re-run full verification pipeline (build, test, lint, QA)
5. Re-enter Done Gate

**Repair budget:** Max 3 repair passes per task. If not converging after 3 passes, escalate to High model. If still failing, mark BLOCKED and move to next independent task.

### PHASE 5 -- TASK SIGN-OFF

Leader checks Done Gate. Only then update checklist and begin next task.

### PHASE 6 -- PHASE QA / PROJECT QA

After completing a batch of related tasks or a full feature:
- Run full test suite (not just changed tests)
- Run production build if applicable
- Inspect cross-module integration
- Check for unintended side effects
- Produce summary: what shipped, what risks remain, what to tackle next

## Done Gate

A task is DONE only when ALL pass:

| Gate | Check |
|------|-------|
| **Scope** | All requested work implemented |
| **Acceptance** | Success criteria satisfied |
| **Build** | Zero errors, zero new warnings |
| **Tests** | Pass. New tests where gaps existed. No unjustified skips |
| **Lint** | Passes (if configured) |
| **Regression** | No breakage in adjacent code |
| **Security** | No new vulnerabilities (for boundary tasks) |
| **QA** | Understandable, maintainable, follows project conventions |
| **Leader** | Explicitly confirms DONE |

Any gate failure -> `FIX_REQUIRED` -> repair subtask immediately.

## Task State System

| State | Meaning |
|-------|---------|
| `TODO` | Not started |
| `IN_PROGRESS` | Currently being worked on |
| `BLOCKED` | Cannot proceed |
| `FIX_REQUIRED` | Bug or QA rejection, repair needed |
| `QA_REVIEW` | Build done, awaiting QA + leader |
| `DONE` | All gates passed, leader approved |

Track with TodoWrite. Update transitions in real-time.

## Context and Token Management

**Session discipline:** One session per feature, bug cluster, refactor slice, or subsystem.

**Compact triggers:** Token usage at ~50-60%, main reasoning done, large debug thread, transcript bloat from completed subtasks.

**New session triggers:** Switching features/subsystems, stale debug history, context drift hurting precision.

**Reading policy:** Always prefer exact file paths, function names, targeted symbols, diffs. Never "scan the whole repo" or repeated full-file loads.

## Failure Recovery

For detailed failure recovery patterns, stack-specific commands, and anti-patterns, read `references/failure-recovery.md` and `references/stack-patterns.md`.

**Quick reference:**
1. Build failure -> Read exact error, fix specific issue, re-run. Do not guess.
2. Test failure -> Read failing output. Is the test wrong or the code? Fix accordingly.
3. Flaky test -> Run 3x. If inconsistent, quarantine and note. Do not block pipeline.
4. Type error cascade -> Fix from root type outward. Never suppress with `any`.
5. Dependency conflict -> Check lockfile, pin versions. Do not upgrade unrelated packages.

## Output Formats

For structured output templates (Planning, Execution, QA, Context Guidance, Phase Summary), read `references/output-templates.md`.

## Startup Behavior

When this skill activates:
1. Read project config files to understand conventions
2. Restate goal concisely
3. Run auto-detection (language, framework, test runner, build system)
4. Decompose into atomic tasks with model tier assignments
5. Present checklist for confirmation
6. Recommend context strategy
7. Begin T1 if user confirms, or wait for adjustments

## Anti-Patterns

- Declaring victory before verification
- Moving to next task with known defects open
- Premium reasoning for low-complexity work
- Re-reading more context than needed
- Unrelated "while I'm here" edits
- Suppressing type errors instead of fixing them
- Adding TODO comments instead of fixing issues
- Skipping tests for "small changes"
- Bulk-updating data files (fix one at a time, verify each)
