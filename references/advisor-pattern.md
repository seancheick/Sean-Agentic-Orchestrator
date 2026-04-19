# Advisor Pattern — Strategic Consultation

## What It Is

The Advisor Pattern is Anthropic's model-pairing strategy where a cost-efficient executor model (Sonnet or Haiku) runs tasks end-to-end and consults a high-capability advisor model (Opus) **only at critical decision points**. The advisor never calls tools or produces user-facing output — it returns plans, corrections, or stop signals.

This inverts the traditional pattern where the most expensive model drives everything. Instead, the cheap model handles 90-95% of mechanical work while the expensive model handles the 5-10% that requires frontier reasoning.

## Benchmarks

| Configuration | Accuracy | Cost |
|---------------|----------|------|
| Sonnet alone | 72.1% SWE-bench | Baseline |
| Sonnet + Opus advisor | 74.8% SWE-bench | 11.9% less than baseline |
| Haiku alone | 19.7% BrowseComp | Lowest |
| Haiku + Opus advisor | 41.2% BrowseComp | 85% less than Sonnet |

The advisor adds accuracy while **reducing** total cost because it prevents the executor from going down wrong paths that waste tokens on retries.

## When the Executor Should Consult the Advisor

The executor consults the advisor at defined checkpoints — not on every turn. Consultation triggers:

### Always Consult
1. **Before committing to an architectural approach** — which pattern, what trade-offs
2. **When the plan involves high-risk areas** — auth, payments, data migrations, public APIs
3. **When requirements are ambiguous or conflicting** — before guessing, ask the advisor
4. **After 2 failed repair passes** — before escalating to pass 3, get advisor guidance on root cause
5. **Before declaring a phase complete** — advisor reviews the phase summary for blind spots

### Never Consult
1. File scanning, symbol extraction, summaries — cheap work stays cheap
2. Standard code edits following established patterns — mechanical work
3. Running build/test/lint commands — tool execution, not reasoning
4. Single-file bug fixes with obvious root cause — no ambiguity to resolve

## Integration With the Orchestrator Pipeline

The advisor integrates at three natural checkpoints in the execution loop:

### Checkpoint 1: Plan Review (Phase 2)
After the Planner generates the task breakdown, the advisor reviews:
- Is the decomposition correct?
- Are dependencies mapped accurately?
- Are model tier assignments appropriate?
- Are there risks the planner missed?

```
Planner (mid) -> Advisor (high) reviews plan -> Leader approves -> Execution begins
```

> **Opus 4.7 note:** Opus 4.7 performs intrinsic self-verification during planning — it catches logical faults and missed dependencies before returning. For standard features (no auth, payments, migrations, or public API contracts), Checkpoint 1 may be skipped when the Planner itself ran on Opus 4.7. Keep Checkpoint 1 mandatory whenever the Planner ran on Sonnet/Haiku, or the plan touches high-risk areas.

### Checkpoint 2: Critical Decision Points (Phase 3)
During execution, the advisor is consulted when:
- A task touches high-risk code (auth, payments, data integrity)
- The builder faces a non-obvious design choice
- A debugging pass fails to find root cause

```
Builder (mid) hits ambiguity -> Advisor (high) provides direction -> Builder continues
```

### Checkpoint 3: Phase Sign-Off (Phase 6)
Before marking a feature/phase complete, the advisor reviews:
- Does the implementation match the original intent?
- Are there subtle risks the QA agent might miss?
- Is the approach maintainable long-term?

```
QA (mid) passes -> Advisor (high) final review -> Leader signs off
```

## How It Works in Practice

### In Claude Code (Skill Context)
The orchestrator directs when to spawn a high-tier subagent for advisory review:

```
Agent(model: "opus", prompt: "Review this plan for [task]. Check for: 
missed dependencies, incorrect tier assignments, architectural risks, 
and blind spots. Return: approved / rejected with specific feedback.")
```

The advisor subagent returns a concise assessment. Only the assessment enters the parent context — the advisor's reasoning stays in its own context window.

### In the Claude API
```python
tools = [{
    "type": "advisor_20260301",
    "name": "advisor",
    "model": "claude-opus-4-7",
    "max_uses": 3  # Cap consultations per request
}]

response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    betas=["advisor-tool-2026-03-01"],
    tools=tools,
    messages=messages
)
```

## Cost Control

### Max Uses Per Phase
| Phase | Max Advisor Consultations | Rationale |
|-------|--------------------------|-----------|
| Planning | 1 | One plan review is sufficient |
| Execution (per task) | 1-2 | Only for high-risk or ambiguous tasks |
| Phase QA | 1 | One final review per feature |
| Repair escalation | 1 | Before pass 3 escalation |

### Budget Rule
Total advisor consultations per project should not exceed **number of tasks + 2**. If you're consulting the advisor on every task, either the tasks are too complex (decompose further) or the executor model needs a better prompt.

## Anti-Patterns

- Consulting the advisor on every task regardless of complexity
- Using the advisor for file scanning or context gathering
- Asking the advisor to implement code (it advises, it doesn't execute)
- Ignoring the advisor's feedback and proceeding anyway
- Not capping `max_uses` — allowing unlimited consultations defeats the cost benefit
