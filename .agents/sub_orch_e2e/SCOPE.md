# Scope: E2E Testing for ScoreBoard

## Architecture
- Mobile-first score-tracking Next.js application.
- Opaque-box, requirement-driven E2E tests using Playwright.
- Test runner executes Playwright tests against a running dev/build server.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Test Infra Setup | Install playwright, configure playwright.config.ts, update package.json | none | DONE |
| 2 | Tier 1 Tests | Feature Coverage: Happy-path E2E tests (40 cases) | M1 | DONE |
| 3 | Tier 2 Tests | Boundary & Corner: Errors, limit checks, negative numbers, overflow (40 cases) | M2 | DONE |
| 4 | Tier 3 Tests | Cross-Feature: Interactions of multiple features, e.g. bulk and leader (8 cases) | M3 | DONE |
| 5 | Tier 4 Tests | Real-World Application: Complete playthrough sessions (5 cases) | M4 | DONE |
| 6 | Verification & Docs | Execute entire test suite, generate TEST_INFRA.md and TEST_READY.md | M5 | DONE |

## Interface Contracts
### E2E Tests ↔ Next.js App
- Testing URL: `http://localhost:3000`
- Elements targeted via descriptive accessibility attributes (`role`, `aria-label`, `placeholder`, `text content`) per Agent Guidelines.
