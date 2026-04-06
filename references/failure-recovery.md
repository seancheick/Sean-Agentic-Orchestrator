# Failure Recovery Patterns

## Build Failures

### Compilation Error
1. Read the exact error message and file/line reference
2. Open the specific file at the specific line
3. Fix the specific issue (typo, missing import, type mismatch)
4. Re-run build
5. Do not guess. Do not fix "nearby" issues. Fix what the error says.

### Missing Dependency
1. Read the error to identify the missing package
2. Check if it should be a dependency or devDependency
3. Install the specific version compatible with the project
4. Do not upgrade unrelated packages
5. Verify lockfile is updated correctly

### Type Error Cascade
1. Find the root type that changed (not the downstream errors)
2. Fix the root type definition
3. Propagate changes outward from the root
4. Never suppress with `any`, `as unknown`, or `@ts-ignore`
5. If the cascade is large, consider whether the type change itself was correct

### ESM/CJS Conflict
1. Check the package's export format
2. Verify `tsconfig.json` module resolution setting
3. Check `package.json` type field
4. Use dynamic import if the package is ESM-only in a CJS context
5. Do not add random `type: "module"` without understanding the impact

---

## Test Failures

### Assertion Failure
1. Read the expected vs actual values
2. Determine: is the test wrong or is the code wrong?
3. If the test is outdated (testing old behavior that was intentionally changed), update the test
4. If the code is wrong, fix the code
5. Never change a test assertion to match incorrect behavior

### Timeout
1. Check if the test is waiting on something that never resolves
2. Look for missing mock responses, unresolved promises, or missing async/await
3. Check if the timeout is too short for the environment
4. Fix the root cause. Do not just increase the timeout.

### Flaky Test
1. Run the test 3 times in isolation
2. If it passes inconsistently, check for:
   - Timing dependencies (use deterministic clocks/mocks)
   - Shared state between tests (missing cleanup/setup)
   - External service dependencies (missing mocks)
   - Race conditions in async code
3. If the fix is not obvious, quarantine the test and create a follow-up task
4. Never block the pipeline on a known flaky test

### Missing Test Coverage
1. Identify the changed behavior that lacks tests
2. Write tests that verify the actual behavior change
3. Include edge cases: null/empty inputs, boundary values, error paths
4. Tests must assert meaningful behavior, not just existence

---

## Runtime Failures

### Unhandled Exception
1. Read the full stack trace
2. Identify the throwing function and the caller chain
3. Determine if input validation is missing at the boundary
4. Fix at the appropriate layer (validation at boundary, not deep in the stack)
5. Add a test that reproduces the failure

### Memory Leak
1. Profile memory usage over time
2. Identify growing objects (event listeners, caches, closures)
3. Ensure proper cleanup (removeEventListener, cache eviction, weak references)
4. Verify the fix with a second profiling run

### N+1 Query
1. Profile the query count for the affected endpoint
2. Identify the loop that triggers individual queries
3. Replace with a batch query (join, IN clause, prefetch)
4. Verify query count is reduced
5. Check that the batch query performance is acceptable

### Deadlock / Race Condition
1. Identify the competing resources
2. Establish a consistent lock ordering
3. Use appropriate synchronization primitives
4. Test under concurrent load
5. This is always a High-tier debugging task

---

## Dependency Failures

### Version Conflict
1. Read the conflict message to identify the incompatible versions
2. Check which package requires which version range
3. Pin the compatible version in the lockfile
4. Do not force-resolve unless you understand the incompatibility
5. Do not upgrade unrelated packages

### Security Vulnerability (CVE)
1. Classify severity: critical, high, medium, low
2. Critical/high: fix immediately (upgrade, patch, or replace)
3. Medium/low: create a follow-up task
4. Verify the fix does not break existing functionality
5. Run the full test suite after any dependency change

### Deprecated API
1. Identify the deprecation replacement
2. Migrate to the new API
3. If no replacement exists, evaluate alternatives
4. Do not suppress deprecation warnings without a migration plan

---

## Recovery Escalation Ladder

| Pass | Action | Tier |
|------|--------|------|
| 1 | Read error, apply targeted fix, re-verify | Mid |
| 2 | Broaden context, check adjacent code, apply second fix | Mid |
| 3 | Deep root-cause analysis with broader codebase context | High |
| 4 (max) | Mark BLOCKED, document findings, move to next independent task | Leader |

After 3 repair passes without resolution, the task must be escalated or blocked. Do not continue cycling at the same tier.

---

## Anti-Patterns in Failure Recovery

- Guessing at fixes without reading the error
- Applying "shotgun" fixes (changing multiple things hoping one works)
- Suppressing errors instead of fixing them
- Expanding scope during a fix (fixing unrelated issues found during investigation)
- Ignoring test failures because "they were already failing"
- Deleting tests that fail instead of fixing the underlying issue
- Retrying the exact same approach without changing anything
- Force-pushing or resetting to "make it go away"
