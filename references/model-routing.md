# Model Routing — Full Policy

## How Model Routing Actually Works

**Within a single Claude Code session:** The model DOES NOT switch. If you started on Sonnet, you stay on Sonnet. The cheap/mid/high tiers are a **reasoning discipline** — less verbose output, less over-engineering — not a literal model change.

**Real model switching requires the Agent tool** with the `model:` parameter:
```
Agent(model: "haiku", prompt: "scan these files and extract X")
Agent(model: "sonnet", prompt: "implement feature Y")  
Agent(model: "opus", prompt: "design the architecture for Z")
```
Each spawned subagent runs on its assigned model, starts with a fresh 200k context, and only its result returns to the parent. This is how you actually save cost.

**When NOT to spawn a subagent:** Simple inline edits, single-file reads, quick fixes. Spawning overhead (~200 tokens) only pays off for tasks that would otherwise burn 2k+ tokens in the parent context.

---

## Tier Definitions

| Tier | Model | Latency | Cost | Use Cases |
|------|-------|---------|------|-----------|
| **Cheap** | haiku | ~200ms | Lowest | Reading, scanning, extraction, summaries, simple transforms |
| **Mid** | sonnet | ~1-2s | Medium | Implementation, edits, bug fixes, tests, QA review |
| **High** | opus | ~3-5s | Highest | Architecture, ambiguous debugging, complex planning, critical review |

## Default Agent Routing

| Agent | Default Tier | Escalation Trigger |
|-------|-------------|-------------------|
| Reader | Cheap | Structure is genuinely confusing |
| Planner | Mid | Very ambiguous scope, cross-system architecture |
| Builder | Mid | Complex algorithmic logic, cross-system coordination |
| Debug | Mid | Root cause unclear after 1 focused pass |
| Test | Cheap/Mid | Complex integration or property-based tests |
| QA/QC | Mid | Critical path features, security-sensitive code |
| Security | Mid | Auth/crypto/payment code |
| Perf | Mid | Complex algorithmic optimization |
| Leader | Mid | Critical acceptance, major architectural decisions |

## Escalation Rules

Escalate to a higher tier only when one of these is true:

1. Task involves architecture across multiple systems or bounded contexts
2. Bug persists after one serious debugging pass at the current tier
3. Requirements are ambiguous or conflicting and need reconciliation
4. Logic is high-risk (auth, payments, data integrity, public API contracts)
5. Code touches safety-critical or business-critical behavior
6. Implementation quality from the current tier is demonstrably insufficient
7. The same approach has been tried twice at the current tier without success

## De-Escalation Rules

Return to a lower tier after:

1. Architecture decisions are settled and documented
2. Plan is approved and tasks are well-defined
3. Root cause is identified and the fix is mechanical
4. Implementation becomes straightforward pattern application
5. Task is mostly boilerplate or repetitive
6. The hard reasoning is done and only execution remains

## The Advisor Pattern

Instead of running entire tasks on the High tier, use the **Advisor Pattern**: a Mid-tier executor handles work end-to-end and consults a High-tier advisor only at critical decision points.

**How it works:**
```
Builder (mid) handles routine implementation
  -> Hits ambiguity or high-risk decision
  -> Spawns: Agent(model: "opus", prompt: "Advise on [specific question]")
  -> Advisor returns concise guidance (~100-300 tokens)
  -> Builder continues with advisor's direction
```

**Cost impact:** This yields higher accuracy than Mid-tier alone while costing less than running the full task on High tier. Benchmarks show 11.9% cost reduction vs. running everything on Mid, with +2.7 points accuracy improvement.

**Advisor budget per project:**
| Phase | Max Advisor Calls | Purpose |
|-------|------------------|---------|
| Planning | 1 | Review task decomposition |
| Execution (per task) | 0-2 | Only for high-risk or ambiguous decisions |
| Repair escalation | 1 | Root-cause guidance after 2 failed passes |
| Phase QA | 1 | Final review of feature completeness |

Total advisor calls should not exceed **number of tasks + 2**. If you're calling the advisor on every task, decompose further or improve the executor's prompt.

For full advisor pattern details, read `references/advisor-pattern.md`.

## Anti-Waste Rules

1. Never run all agents on the highest tier by default
2. Never use High tier for file scanning, symbol extraction, or summaries
3. Never use High tier for standard code edits that follow established patterns
4. Never stay on High tier after the hard reasoning is done
5. Always de-escalate once the architecture/root-cause/plan is settled
6. Batch similar cheap-tier operations in one pass to reduce overhead
7. **Prefer advisor consultations over full High-tier escalation** — the advisor answers one focused question at a fraction of the cost of running an entire task on High

## Practical Routing Examples

### Feature Implementation
```
Reader (cheap) -> scan relevant files, extract interface signatures
Planner (mid) -> decompose into tasks
Builder (mid) -> implement each task
Test (cheap/mid) -> validate behavior
QA (mid) -> review quality
Leader (mid) -> sign off
```

### Hard Bug Investigation
```
Reader (cheap) -> gather error logs and stack traces
Debug (mid) -> first pass at root cause analysis
  -> if unclear: Debug (high) -> deep root cause analysis
Builder (mid) -> implement the fix
Test (mid) -> verify fix and regression
QA (mid) -> confirm no side effects
Leader (mid) -> sign off
```

### Architecture Decision
```
Reader (cheap) -> scan codebase structure
Planner (high) -> design architecture, evaluate trade-offs
Builder (mid) -> implement scaffolding
Test (mid) -> validate contracts
QA (mid) -> review patterns
Leader (high) -> approve architectural direction
```

### Simple Refactor
```
Reader (cheap) -> identify all usage sites
Builder (mid) -> apply refactor
Test (cheap) -> verify existing tests pass
QA (mid) -> review consistency
Leader (mid) -> sign off
```

### High-Risk Feature (Advisor Pattern)
```
Reader (cheap) -> scan relevant files
Planner (mid) -> decompose into tasks
Advisor (high) -> review plan for missed risks [1 consultation]
Builder (mid) -> implement task
  -> Builder hits auth boundary decision
  -> Advisor (high) -> advise on approach [1 consultation]
  -> Builder (mid) -> continues with advisor direction
Test (mid) -> validate behavior
QA (mid) -> verify all gates
Advisor (high) -> final feature review [1 consultation]
Leader (mid) -> sign off
```
Total advisor calls: 3 (plan review, critical decision, final review)

## Token Budget Awareness

Track cumulative token usage across the session. When approaching limits:

1. At ~40% usage: Continue normally
2. At ~50% usage: Consider compacting completed task transcripts
3. At ~60% usage: Compact now. Summarize completed work, discard raw transcripts
4. At ~75% usage: Start a fresh session. Carry forward only the task list, current state, and key decisions
5. At ~90% usage: Emergency compact. Preserve only active task context

Always prefer concise structured outputs over prose explanations. Batch instructions when possible to reduce back-and-forth overhead.
