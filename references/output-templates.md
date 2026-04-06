# Output Templates

## A. Planning Output

```markdown
## PROJECT PLAN

**Goal:** {concise goal statement}
**Constraints:** {budget, time, tech stack, existing patterns}
**Assumptions:** {what is being assumed true}
**Scope Boundary:** {what is IN, what is OUT}

### Auto-Detection Results
- Language: {detected}
- Framework: {detected}
- Test Runner: {detected}
- Build System: {detected}
- Linter: {detected}
- CI/CD: {detected or "none"}
- Monorepo: {yes/no}

### Task List

| ID | Title | Files | Tier | Complexity | Risk | Deps |
|----|-------|-------|------|-----------|------|------|
| T1 | {title} | {files} | {tier} | {complexity} | {risk} | none |
| T2 | {title} | {files} | {tier} | {complexity} | {risk} | T1 |

### Task Details

**T1: {title}**
- Scope: {what changes}
- Output: {concrete deliverable}
- Success Criteria: {one sentence}
- Agent Pipeline: Reader -> Builder -> Test -> QA
- Risk Notes: {any risks}

### Execution Order
1. T1 (no dependencies)
2. T2 (depends on T1)
3. T3, T4 (independent, can be done in any order after T2)

### Context Strategy
- Keep in session: {active task context, key decisions}
- Compact after: {each completed task batch}
- Fresh session at: {feature boundary, subsystem switch}
```

## B. Execution Output

```markdown
## TASK EXECUTION

**Task ID:** T{n}
**Status:** {IN_PROGRESS | QA_REVIEW | DONE | FIX_REQUIRED}
**Assigned Agent:** {Builder/Debug/etc.}
**Model Tier:** {cheap/mid/high}

### Files Touched
- `path/to/file.ts` — {what changed and why}

### What Changed
{Concise summary of the implementation}

### Build Verification
- Build: PASS/FAIL
- Tests: PASS/FAIL ({n} passed, {n} failed, {n} skipped)
- Lint: PASS/FAIL

### Assumptions
- {any assumptions made during implementation}

### Risks
- {any risks introduced or discovered}

### Next
- {next check: QA review, leader sign-off, or repair}
```

## C. QA Output

```markdown
## QA RESULT

**Task ID:** T{n}
**Status:** PASS / FAIL

### Checks
| Gate | Result | Notes |
|------|--------|-------|
| Scope | PASS/FAIL | {notes} |
| Acceptance | PASS/FAIL | {notes} |
| Build | PASS/FAIL | {notes} |
| Tests | PASS/FAIL | {notes} |
| Lint | PASS/FAIL | {notes} |
| Regression | PASS/FAIL | {notes} |
| Security | PASS/FAIL/N/A | {notes} |
| Conventions | PASS/FAIL | {notes} |

### Findings
- {any issues found}

### Regression Risks
- {adjacent areas that could be affected}

### Required Fixes
- {if FAIL: specific fixes needed}

### Leader Decision
- {APPROVED / REJECTED with reason}
```

## D. Context Guidance Output

```markdown
## CONTEXT GUIDANCE

**Current Task:** T{n} — {title}
**Context Health:** {green/yellow/red}
**Token Usage:** ~{n}% estimated

### Recommendation
{One of: continue | compact soon | compact now | start fresh session}

### Reason
{Why this recommendation}

### What to Carry Forward
- {task list and states}
- {key decisions made}
- {active assumptions}
```

## E. Phase Summary Output

```markdown
## PHASE SUMMARY

### Completed Tasks
| ID | Title | Status | Repair Passes |
|----|-------|--------|---------------|
| T1 | {title} | DONE | 0 |
| T2 | {title} | DONE | 1 |

### Test Results
- Full suite: {n} passed, {n} failed, {n} skipped
- New tests added: {n}
- Coverage change: {+/-n%} (if measurable)

### Production Build
- Status: PASS/FAIL
- Warnings: {n new warnings}

### Integration Check
- Cross-module: {status}
- Side effects: {none found / list}

### Remaining Risks
- {any risks that need monitoring}

### Next Recommended Work
- {what to tackle next}

### Session Recommendation
- {continue / compact / fresh session}
```

## F. Repair Subtask Output

```markdown
## REPAIR SUBTASK

**Parent Task:** T{n}
**Fix ID:** T{n}.{fix_number}
**Repair Pass:** {1/2/3}
**Agent:** {Debug/Builder/Security}
**Model Tier:** {current tier}

### Issue
{What failed and why}

### Root Cause
{Identified root cause}

### Fix Applied
{What was changed}

### Verification
- Build: PASS/FAIL
- Tests: PASS/FAIL
- Original failure: RESOLVED/PERSISTS

### Escalation
{If pass 3 and still failing: escalate to High / mark BLOCKED}
```
