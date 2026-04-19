# Context Engineering — Token Efficiency & Memory Management

## Core Principle

Context is a finite attention budget. As tokens increase, models experience **context rot** — degraded performance in recall and long-range reasoning. The goal: find the smallest set of high-signal tokens that maximize the likelihood of the desired outcome.

Every token in the context window should earn its place. If it doesn't contribute to the current task, it shouldn't be there.

## Just-In-Time Context Retrieval

**Don't pre-load everything. Load what you need, when you need it.**

Maintain lightweight identifiers (file paths, function names, symbol references) and dynamically load data at runtime using tools rather than reading everything upfront.

### Good Pattern
```
1. Reader (cheap) -> grep for function signature -> returns: file path + line number
2. Builder reads only the specific function + its direct callers
3. Builder makes the change
4. Test runs only affected tests
```

### Bad Pattern
```
1. Reader scans the whole repo structure
2. Reader reads all related files in full
3. Builder reads the same files again
4. Context is now 60% bloated before any work is done
```

### Rules
- Use `Grep` and `Glob` for discovery — they return results without consuming context
- Read specific line ranges, not full files (`Read file.ts lines 45-80`)
- Extract function signatures, not full implementations, for planning
- Only load a file's full content when you're about to edit it

## Structured Note-Taking

For long-running tasks that span compaction boundaries, maintain an external memory file.

### The NOTES.md Pattern
Create a `NOTES.md` (or use TodoWrite) that captures:
- Architectural decisions made and why
- Key file paths and their roles
- Unresolved questions or blocked items
- Discovered constraints or gotchas

This file lives **outside the context window** and gets pulled back in after compaction or session handoff. It's cheaper to re-read a 200-line notes file than to re-discover the same information through exploration.

### When to Write Notes
- After making an architectural decision
- After discovering an unexpected constraint
- After completing a phase (key outcomes)
- Before compaction (capture everything that would be lost)

### When to Read Notes
- After compaction
- At the start of a new session
- When the current task references decisions from completed tasks

## Prompt Caching

### How It Saves Tokens
- **Cache reads cost 10% of regular input tokens** (90% savings)
- Content that stays the same across turns gets cached automatically
- Only new content (latest tool results, new messages) is processed at full cost

### Rules for Agentic Loops
1. Place static content early in the conversation (system prompt, project context)
2. Structure conversations so the growing part is at the end
3. The identical prefix across turns gets cached — only the new suffix costs full price
4. Cache hits don't count against rate limits

### Minimum Cache Thresholds
| Model | Min Tokens for Cache |
|-------|---------------------|
| Opus 4.7 / 4.6 | 4096 tokens |
| Sonnet 4.6 | 2048 tokens |
| Haiku 4.5 | 2048 tokens |
| Sonnet 4.5/4 | 1024 tokens |

> **Note on Opus 4.7 tokenizer:** Opus 4.7 uses a new tokenizer that produces 1.0–1.35x more tokens than 4.6 for the same text. Compact and new-session thresholds (~60% / ~75%) still apply as ratios, but absolute cost estimates for Opus steps should be recalibrated.

## Artifact-Based Communication

When subagents produce large outputs, they should store results externally and pass lightweight references back to the parent context.

### How It Works
```
1. Subagent completes analysis -> writes structured output to a file or TodoWrite
2. Subagent returns to parent: "Analysis complete. Key findings: [3-sentence summary]. Full details in [location]."
3. Parent context receives only the summary (~100 tokens instead of ~2000)
4. If parent needs details, it reads the specific section on demand
```

### When to Use
- Research subagents returning large context packs
- Reader agents scanning multiple files
- QA agents producing detailed gate reports
- Any subagent output exceeding ~500 tokens

### When NOT to Use
- Short, direct answers (pass inline)
- Binary results (pass/fail with one-line reason)
- Simple file path or symbol references

## Compaction Strategy

### Progressive Compaction Triggers
| Context Usage | Action |
|---------------|--------|
| ~40% | Continue normally |
| ~50% | Write key decisions to NOTES.md proactively |
| ~60% | Compact: summarize completed work, discard raw transcripts |
| ~75% | Start fresh session with handoff template + NOTES.md |
| ~90% | Emergency: preserve only active task context |

### What to Preserve During Compaction
**Always keep:**
- Active task state and remaining work
- Architectural decisions and their rationale
- Unresolved issues and blocked items
- File paths of modified files
- Key function/variable names referenced in current work

**Always discard:**
- Raw tool outputs from completed tasks
- Exploration transcripts that led to dead ends
- Repeated file reads
- Debug traces from resolved issues
- Full test output (keep only pass/fail summary)

### Compaction Command
When context reaches ~60%, summarize:
```
COMPACT SUMMARY:
- Completed: T1 (auth middleware), T2 (JWT utils) — both passing all gates
- Active: T3 (refresh token rotation) — builder done, awaiting QA
- Key decisions: Using RS256 for JWT, refresh tokens in httpOnly cookies
- Modified files: src/auth/middleware.ts, src/utils/jwt.ts, src/routes/auth.ts
- Next: QA review of T3, then T4 (RBAC)
```

Drop everything else.

## Sub-Agent Context Isolation

Each spawned subagent starts with a **fresh context window**. This is a feature, not a limitation.

### Benefits
- Subagent can't be confused by irrelevant parent context
- Parent context doesn't bloat from subagent's exploration
- Only the subagent's conclusion returns to parent (~100-500 tokens vs 5000+ tokens of reasoning)

### Best Practices
- Give subagents self-contained prompts with all necessary context
- Don't pass the entire conversation history to a subagent
- Request structured, concise outputs ("return a JSON summary" or "report in under 200 words")
- Use `run_in_background: true` for independent research tasks

## Token Budget Awareness

### Per-Task Budget Heuristics
| Task Type | Expected Token Budget |
|-----------|--------------------|
| File scan / symbol extraction | 500-1500 tokens |
| Standard implementation (1-2 files) | 2000-5000 tokens |
| Complex implementation (3 files) | 5000-10000 tokens |
| Debug investigation | 3000-8000 tokens |
| QA review | 1000-3000 tokens |
| Plan generation | 2000-4000 tokens |

If a task is consuming 3x its expected budget, something is wrong — either the scope is too broad, context is bloated, or the approach needs rethinking.

### Anti-Patterns
- Reading the same file multiple times in one task
- Loading full files when you only need a function
- Passing raw tool output between agents instead of summaries
- Keeping resolved debug traces in context
- Repeated re-statement of the goal or constraints
