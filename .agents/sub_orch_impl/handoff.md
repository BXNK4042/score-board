# Soft Handoff: Implementation Orchestrator (Succession Handoff)

## 1. Milestone State
- **PROJECT.md**: DONE (located at project root).
- **Milestone 1 (Setup Screen)**: DONE. Home and Setup screens are fully functional, including unique color palette (12 colors), input accessibility, edit-lockout fix, and synchronous validations. Verified clean compile and lint.
- **Milestone 2 (In-Game Screen Base)**: EXPLORATION DONE. We have dispatched 3 Explorers and collected their design strategies. Recommendations are detailed below. Next step: Implement.
- **Milestones 3-6**: PLANNED.

## 2. Active Subagents
- None. (All Milestone 1 and Milestone 2 Explorer subagents are completed or skipped).

## 3. Decisions & Constraints
- Visual requirements mandate player accent colors propagate to score text and + buttons. Dynamic leader calculations must break ties by list index (first leader wins). Monospace time display must have class `.timer-display`.
- The state hook lacks a deselection action, so we must implement `deselectAllPlayers` in `hooks/useGameState.ts` as part of Milestone 2 (proposed by Explorer 1/2).
- The E2E tests target exact `aria-labels` and selectors (detailed in explorer handoffs).

## 4. Key Recommendations for Milestone 2
- **InGameScreen Component**:
  - Implement a new file `components/InGameScreen.tsx` (using code from Explorer 1/2 reports).
  - Calculate `leaderId` on every render dynamically.
  - Implement `aria-live="polite"` on the score component.
  - Style borders based on selection (pink/magenta) and leader (accent color).
- **useGameState Hook**:
  - Add `deselectAllPlayers()` callback to clear all selected states at once.
- **Page Routing**:
  - Update case `'ingame'` in `app/page.tsx` to render `<InGameScreen />` and wire up the hook callbacks.

## 5. Remaining Work
- Successor should start by spawning a **Worker** for Milestone 2 to write `components/InGameScreen.tsx`, integrate hook state changes, and update page rendering.
- Follow up by spawning **Reviewers**, **Challengers**, and **Forensic Auditor** to verify Milestone 2.
