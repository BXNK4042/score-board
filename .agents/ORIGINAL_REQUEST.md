# Original User Request

## 2026-06-11T04:03:34Z

ScoreBoard is a mobile-first, Next.js score-tracking app for tabletop and card games, featuring a game stopwatch, support for up to 10 players with unique colors, persistent scores, leader calculation, and bulk score adjustments. The project aims to build a polished, high-fidelity app based on the design assets in `design/` and specifications in `AGENTS.md`.

Working directory: `/home/bank/score-board`
Integrity mode: benchmark

## Requirements

### R1. UI Implementation and Design Fidelity
Implement the ScoreBoard application matching the mobile-first layouts, color palettes, bold typography, and visual designs described in `AGENTS.md` and located in the `design/` directory.

### R2. Core ScoreBoard Features
Provide a Setup Screen (with player additions/deletions/colors up to 10), an In-Game Screen (with leader indicator, live stopwatch, per-player increment/decrement), and a Bulk Action Bar for multi-player adjustments.

### R3. State Persistence
Ensure session states (players, scores, elapsed stopwatch time, active timer status) are persisted locally to survive browser refreshes and page reloads.

### R4. E2E Verification Suite
Create programmatic E2E tests (e.g. using Playwright or Cypress) to verify the core flows: game creation, player limits, stopwatch function, leader recalculation, bulk score actions, state persistence across reloads, and end-game confirmation.

## Acceptance Criteria

### UI & UX Polish
- [ ] UI is single-column, mobile-first, and fully responsive for mobile screens (~390px wide).
- [ ] Design elements follow visual specifications (background `#EEEEF8`, brand `#4B45D4`, card border accents, large score text >= 48px).

### Functional Behavior
- [ ] Stopwatch is non-blocking, counts up in HH:MM:SS, and persists its state.
- [ ] Leader label is dynamically recalculated on every score change (highest score; ties broken by list position).
- [ ] Bulk selection toggles selected players, displaying the bottom Bulk Action Bar, and allows multi-player score modifications.
- [ ] End-game triggers a confirmation modal to prevent accidental loss of data.

### Automated Testing
- [ ] Programmatic E2E tests run successfully and verify all core features: game setup, stopwatch toggle, dynamic leader updates, bulk adjustment, and reload persistence.
