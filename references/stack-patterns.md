# Stack-Specific Patterns

The orchestrator adapts to any stack. This reference provides build/test/lint commands and common pitfalls per ecosystem.

## Next.js / React / TypeScript

**Detection:** `package.json` with `next`, `react` dependencies; `tsconfig.json`; `next.config.*`

**Commands:**
```bash
npm run build          # or: npx next build
npm test               # or: npx jest / npx vitest
npm run lint           # or: npx next lint / npx eslint .
npm run type-check     # or: npx tsc --noEmit (if configured)
```

**Common pitfalls:**
- ESM/CJS bundling conflicts with third-party packages
- Server Component vs Client Component boundary violations
- Missing `"use client"` directives causing hydration mismatches
- `next/image` and `next/link` import changes between versions
- App Router vs Pages Router API differences
- Environment variable handling (`NEXT_PUBLIC_` prefix for client-side)

**Conventions to check:**
- File-based routing structure
- Component extraction to separate files (one component per file)
- Tailwind or CSS module usage
- Server Actions vs API routes

---

## Flutter / Dart

**Detection:** `pubspec.yaml`, `.dart` files, `lib/` directory

**Commands:**
```bash
flutter build apk      # or: flutter build ios / flutter build web
flutter test
flutter analyze
dart format --set-exit-if-changed .
```

**Common pitfalls:**
- Widget tree depth causing rebuild performance issues
- Missing `const` constructors
- State management pattern inconsistency
- Platform-specific code without proper channel handling
- Null safety migration issues

**Conventions to check:**
- Widget extraction to separate files
- State management pattern (Riverpod, Bloc, Provider, etc.)
- Asset and font registration in pubspec.yaml

---

## Python / Django / FastAPI

**Detection:** `pyproject.toml`, `requirements.txt`, `setup.py`, `manage.py` (Django), `main.py` with FastAPI

**Commands:**
```bash
# Django
python manage.py test
python manage.py check
python -m pytest        # if pytest configured

# FastAPI
pytest
python -m pytest --cov

# General
ruff check .            # or: flake8, pylint
ruff format .           # or: black
mypy .                  # if configured
```

**Common pitfalls:**
- Django ORM N+1 queries (use `select_related`/`prefetch_related`)
- Missing database migrations after model changes
- FastAPI dependency injection ordering
- Circular import chains
- Virtual environment not activated

**Conventions to check:**
- Project structure (apps, modules, packages)
- Type hints usage
- Test organization (unit vs integration)

---

## Rust

**Detection:** `Cargo.toml`, `src/main.rs` or `src/lib.rs`

**Commands:**
```bash
cargo build
cargo test
cargo clippy -- -D warnings
cargo fmt -- --check
```

**Common pitfalls:**
- Borrow checker lifetime issues
- Async runtime conflicts (tokio vs async-std)
- Feature flag combinations causing compilation issues
- Unsafe code blocks without justification
- Missing error type conversions

**Conventions to check:**
- Error handling pattern (thiserror, anyhow, custom)
- Module organization
- Trait usage and generics patterns

---

## Go

**Detection:** `go.mod`, `go.sum`, `.go` files

**Commands:**
```bash
go build ./...
go test ./...
go vet ./...
golangci-lint run       # if configured
```

**Common pitfalls:**
- Goroutine leaks from missing context cancellation
- Race conditions (run `go test -race`)
- Interface satisfaction failures
- Module dependency conflicts
- Error handling consistency (sentinel errors vs wrapping)

**Conventions to check:**
- Package organization
- Interface definition location
- Error handling pattern
- Context propagation

---

## Swift / iOS

**Detection:** `Package.swift`, `.xcodeproj`, `.xcworkspace`, `.swift` files

**Commands:**
```bash
swift build
swift test
# or via Xcode:
xcodebuild test -scheme {scheme} -destination 'platform=iOS Simulator,name=iPhone 16'
swiftlint                # if configured
```

**Common pitfalls:**
- Retain cycles from strong reference captures in closures
- Main thread violations for UI updates
- Swift concurrency (async/await) migration issues
- SwiftUI view body complexity
- Missing Sendable conformance

**Conventions to check:**
- Architecture pattern (MVVM, TCA, etc.)
- Dependency injection approach
- SwiftUI vs UIKit usage

---

## Spring Boot / Java / Kotlin

**Detection:** `pom.xml` (Maven), `build.gradle` / `build.gradle.kts` (Gradle)

**Commands:**
```bash
# Maven
mvn compile
mvn test
mvn verify

# Gradle
./gradlew build
./gradlew test
./gradlew check
```

**Common pitfalls:**
- Bean circular dependencies
- JPA lazy loading outside transaction
- Missing `@Transactional` annotations
- Gradle vs Maven dependency resolution differences
- Kotlin null safety vs Java interop

**Conventions to check:**
- Layered architecture (controller -> service -> repository)
- DTO vs entity separation
- Exception handling strategy
- Security configuration

---

## Supabase / PostgreSQL

**Detection:** `supabase/` directory, `migrations/` directory, `.sql` files, Supabase client imports

**Commands:**
```bash
supabase db push         # apply migrations
supabase db reset        # reset and reapply all migrations
supabase functions serve  # test edge functions locally
supabase gen types typescript --local  # regenerate types
```

**Common pitfalls:**
- RLS policies not covering all access patterns
- Missing indexes on frequently queried columns
- Edge function cold start latency
- Migration ordering conflicts
- Type generation out of sync with schema

**Conventions to check:**
- Migration naming and ordering
- RLS policy completeness
- Edge function error handling
- Type generation workflow

---

## Monorepo Patterns

**Detection:** `turbo.json`, `nx.json`, `lerna.json`, `pnpm-workspace.yaml`, `packages/` or `apps/` directories

**Commands:**
```bash
# Turborepo
npx turbo run build
npx turbo run test
npx turbo run lint

# Nx
npx nx run-many --target=build
npx nx run-many --target=test

# pnpm workspaces
pnpm -r build
pnpm -r test
```

**Common pitfalls:**
- Cross-package dependency version mismatches
- Build order dependencies not properly declared
- Shared package changes not triggering downstream rebuilds
- Import path aliases not resolving correctly across packages
- Package-level vs root-level configuration conflicts

**Conventions to check:**
- Package naming convention
- Shared configuration extraction
- Inter-package dependency management
- Build pipeline configuration
