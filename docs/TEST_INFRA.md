# E2E Test Infra: ScoreBoard

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Game setup & Creation | Setup Screen, AGENTS.md §2 | 5 | 5 | ✓ |
| 2 | Add Player in Setup | Setup Screen, AGENTS.md §2 | 5 | 5 | ✓ |
| 3 | Edit & Delete Players | Setup Screen, AGENTS.md §2 | 5 | 5 | ✓ |
| 4 | In-Game Stopwatch | In-Game Screen, AGENTS.md §3 | 5 | 5 | ✓ |
| 5 | Individual Player Score Actions | In-Game Screen, AGENTS.md §3 | 5 | 5 | ✓ |
| 6 | Leader Tracking & Labeling | Key Behaviors, AGENTS.md §4 | 5 | 5 | ✓ |
| 7 | Bulk Selection & Actions | Key Behaviors, AGENTS.md §4 | 5 | 5 | ✓ |
| 8 | End Game Flow & Persistence | Key Behaviors, AGENTS.md §4 | 5 | 5 | ✓ |

## Test Architecture
- **Test Runner**: Playwright E2E Test runner. Invocation command: `npm run test:e2e` (or `npx playwright test`).
- **Test Configuration**: `playwright.config.ts` configured for Chromium browser and headless testing. Automatically spins up Next.js dev server on port 3000 via `webServer` option.
- **Directory Layout**:
  - `playwright.config.ts` at project root.
  - `tests/` directory:
    - `tier1.spec.ts` - Tier 1: Feature Coverage (40 tests)
    - `tier2.spec.ts` - Tier 2: Boundary & Corner Cases (40 tests)
    - `tier3.spec.ts` - Tier 3: Cross-Feature Interactions (8 tests)
    - `tier4.spec.ts` - Tier 4: Real-World Play-Through Scenarios (5 tests)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Scenario 1 - 2-Player Card Game | F1, F2, F5, F6, F8 | Medium |
| 2 | Scenario 2 - 4-Player Board Game with Ties & Shifts | F1, F2, F5, F6 | High |
| 3 | Scenario 3 - Bulk Scoring & Deselection | F1, F2, F5, F6, F7 | High |
| 4 | Scenario 4 - Mid-Game Player Addition & Persistence | F1, F2, F3, F5, F6, F8 | High |
| 5 | Scenario 5 - Complete Game Lifecycle with Stopwatch Checks | F1, F2, F4, F8 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total: 40 tests)
- Tier 2: ≥5 per feature (Total: 40 tests)
- Tier 3: pairwise coverage of major feature interactions (Total: 8 tests)
- Tier 4: ≥5 realistic application scenarios (Total: 5 tests)
