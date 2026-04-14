---
name: agentic-orchestrator
description: Use for complex multi-step engineering work: large features, refactors, debugging campaigns, product backlogs, sprint execution. Triggers on "orchestrate", "break this down", "plan and execute", "sprint", "work on backlog".
---

# Agentic Engineering Orchestrator v2.3

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
Run `/compact` when context reaches ~60% (completed work bloats the window). Start a fresh session at ~75% carrying only: task list + current state + key decisions.

### 6. Surgical Context
Prefer small snippets, specific files, exact functions, targeted diffs. Avoid full repo scans, conversational drift, repeated history restatement.
Spawn subagents for research/WebSearch — only the summary returns to parent context, keeping the main window lean.

### 7. Advisor-Guided Decisions
Use the Advisor Pattern for critical decision points. A cost-efficient executor (Sonnet/Haiku) handles routine work end-to-end and consults a high-capability advisor (Opus) only when it encounters architectural choices, ambiguous requirements, or repeated failures. The advisor never executes — it advises. This yields higher accuracy at lower total cost than running everything on the highest tier.

For full advisor integration details, read `references/advisor-pattern.md`.

### 8. Artifact-Based Communication
When subagents produce large outputs, they store results externally (files, TodoWrite) and return lightweight summaries (~100-500 tokens) to the parent context. The parent reads details on demand. This prevents context bloat from agent-to-agent communication.

For full context engineering techniques, read `references/context-engineering.md`.

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

**Advisor consultation:** The Leader consults a High-tier advisor at defined checkpoints — plan review, high-risk task decisions, and phase sign-off. See `references/advisor-pattern.md` for when and how to trigger advisor consultations.

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

**Eval definition (define before executing):**

Before writing a single line of code, define two evals:

1. **Capability eval** — What does passing look like? Write the specific test, assertion, or observable behavior that proves the feature works. Example: "POST /auth/login returns 200 with a valid JWT and sets a refresh token cookie."
2. **Regression eval** — What existing behavior must not break? Identify the tests or behaviors that cover adjacent code. Run them now to capture the baseline pass/fail state.

Record both evals in the planning output. Re-run both after implementation to measure the delta. A task cannot enter the Done Gate if the capability eval does not pass or the regression eval degrades.

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
Model Tier: {cheap/mid/high} — also sets Agent tool model: param when spawning
Dependencies: {T{n} IDs or "none"}
```

**Task-type hints** (starting points for the Planner — override based on actual task needs):

| Task Type | Typical Pipeline | Notes |
|-----------|-----------------|-------|
| Bug fix | Reader → Debug → Builder → Test → QA | Debug before Build — understand root cause first |
| New feature | Reader → Builder → Test → Security → QA | Security if it touches boundaries |
| Refactor | Reader → Builder → Test → QA | Lean pipeline — existing tests should cover behavior |
| Performance | Reader → Perf → Builder → Perf → QA | Measure before AND after |
| Security fix | Reader → Security → Builder → Security → QA | Security reviews both the problem and the fix |

These are **starting signals, not rigid routes.** The Planner determines the actual pipeline based on the specific task. A "bug fix" spanning 3 services needs a different plan than a 1-line typo fix. Let the orchestrator adapt.

**Decomposition rules:**
- Max 3 files per task (prefer 1-2). Split if more.
- Success criteria must be statable in one sentence. If not, task is too broad.
- Group by bounded context, not file type.
- Flag auth, payments, data migrations, public APIs as high-risk.
- Every code-modifying task includes "build passes" as a success criterion.

Do not execute until the task list is confirmed.

**Advisor checkpoint:** For projects with high-risk tasks (auth, payments, migrations, public APIs) or ambiguous requirements, consult the advisor to review the plan before execution begins. The advisor checks: decomposition correctness, dependency accuracy, tier assignments, and missed risks.

### PHASE 3 -- TASK EXECUTION

**Parallel vs sequential decision:**

Before executing, classify tasks for parallelism. Be conservative — coding tasks have fewer truly parallelizable operations than research tasks, and coordination overhead is real.

| Condition | Decision |
|-----------|----------|
| Tasks touch different files with no shared imports/state | Parallelize |
| 3+ independent tasks in the queue with no dependency chain | Parallelize |
| Tasks touch the same module, shared types, or common state | Sequential |
| Single-file fix or 1-2 line change | Sequential (spawning overhead > time saved) |
| Ambiguous independence | Sequential (safer default) |

**When parallelizing:** Spawn concurrent tasks using `Agent(run_in_background: true, model: "{tier}")`. All parallel spawns go in ONE message. Each parallel task still runs its full verification pipeline independently. Merge conflicts between parallel tasks = immediate repair subtask.

**Cost guardrail:** Multi-agent runs use ~15x more tokens than single-agent. Only parallelize when the time savings justify the token cost — typically 3+ truly independent tasks.

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

**Repair budget:** Max 3 repair passes per task.

**Termination strategies** (stop the loop when any is true):
- **Convergence:** The fix between pass N and N-1 changes fewer than 5 lines and the same test still fails → the approach is wrong, not the implementation. Stop and rethink.
- **Quality threshold:** All gates pass. Stop immediately — don't "improve" passing code.
- **Escalation:** After pass 2 without resolution, consult the advisor (High tier) for root-cause guidance before attempting pass 3.
- **Max passes:** After 3 passes, mark BLOCKED and move to next independent task.

**Avoid the self-consistency trap:** If the same agent keeps defending its original approach across repair passes, use a different agent role (e.g., switch from Builder to Debug) or consult the advisor for an independent perspective.

### PHASE 5 -- TASK SIGN-OFF

Leader checks Done Gate. Only then update checklist and begin next task.

**Anti-drift check (every 3 completed tasks or at phase boundary):**
The Leader pauses and answers three questions:
1. **Goal alignment:** Does the work completed so far still serve the original goal? (If the goal was "add JWT auth" and T3 is refactoring the database layer, something drifted.)
2. **Scope creep:** Has any task expanded beyond its original boundary? (Check files touched vs files planned.)
3. **Budget check:** Are token/repair costs tracking to plan, or is one task consuming disproportionate resources?

If any answer reveals drift: stop, restate the goal, adjust the remaining task list, and note the correction. If the drift check fires 3 times in one project, escalate to the user — the goal or constraints may need clarification.

### PHASE 6 -- PHASE QA / PROJECT QA

After completing a batch of related tasks or a full feature:
- Run full test suite (not just changed tests)
- Run production build if applicable
- Inspect cross-module integration
- Check for unintended side effects
- **Advisor checkpoint:** For features touching high-risk areas, consult the advisor for a final review — does the implementation match the original intent? Are there subtle risks the QA agent might miss?
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

For comprehensive context engineering techniques, read `references/context-engineering.md`.

**Session discipline:** One session per feature, bug cluster, refactor slice, or subsystem.

**Compact triggers:** Token usage at ~50-60%, main reasoning done, large debug thread, transcript bloat from completed subtasks.

**New session triggers:** Switching features/subsystems, stale debug history, context drift hurting precision.

**Reading policy:** Always prefer exact file paths, function names, targeted symbols, diffs. Never "scan the whole repo" or repeated full-file loads.

**Just-in-time retrieval:** Don't pre-load all context upfront. Use Grep/Glob for discovery (zero context cost), then read only the specific lines you need to edit. Load context at the moment it's needed, not before.

**Structured notes:** For long-running projects, maintain key decisions and state in NOTES.md or TodoWrite. This survives compaction and session handoffs — cheaper to re-read a 200-line notes file than to re-discover through exploration.

**Artifact-based agent output:** Subagents return concise summaries to the parent context. Large outputs (research packs, detailed reports) go to external storage. Parent reads details on demand.

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
5. Recommend context strategy

**Clear task (scope obvious, no ambiguity):** Present checklist + begin T1 immediately in the same response. Do not wait for confirmation — unnecessary round-trips burn tokens and slow execution.

**Ambiguous task (scope unclear, conflicting requirements, high risk):** Present checklist and explicitly ask one focused clarifying question before proceeding.

## Session Handoff Template

Use this when starting a fresh session at ~75% context. Carry only:

```
## SESSION HANDOFF

Goal: {original goal in one sentence}
Completed: {T1, T2, T3 — one line each with what was done}
Active: {Tn — current task, what was done, what remains}
Blocked: {Tn — reason, what's needed to unblock}
Remaining: {list of task IDs not yet started}
Key decisions: {any architectural or design choices made that affect future tasks}
Files modified: {list of changed files}
Next action: {exactly what to do first in this new session}
```

Drop everything else — debug history, completed task transcripts, exploration context. The handoff is the only context the new session needs.

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
