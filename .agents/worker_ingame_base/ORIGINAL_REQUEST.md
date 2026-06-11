## 2026-06-11T07:45:09Z

Please implement Milestone 2 (In-Game Screen Base & Leader Calculation) for the ScoreBoard application.

Follow these specifications:
1. Edit `hooks/useGameState.ts` to add and expose `deselectAllPlayers()` callback, which sets `isSelected: false` on all players of `activeGame`.
2. Create `components/InGameScreen.tsx` with:
   - Dynamic leader calculation (tie breaker: first player in list wins).
   - Dynamic player accent colors on score text and '+' button background.
   - Large bold score text (at least 48px, e.g. text-5xl) wrapped in an `aria-live="polite"` region.
   - Header with editable title (starts/saves on click/blur/Enter, maxLength=40, aria-label="Edit game title"), person-plus add player button (opens PlayerDialog), and checkmark end game button.
   - Monospace stopwatch display with class `.timer-display` and a play/pause toggle button (aria-label="Pause stopwatch" / "Start stopwatch").
   - Scrollable player cards list with selection checkboxes (aria-label="Select [Name] for bulk action") and +/- buttons (aria-label="Increase score for [Name]" / "Decrease score for [Name]").
   - Add bottom padding to player scroll list equal to bulk bar height when visible.
   - Bulk action bar visible when selectedCount >= 1 with deselect button (aria-label="Deselect all players"), selection count text containing "Player(s) SELECTED FOR BULK", and bulk +/- buttons.
   - Add Player Dialog mid-game.
   - Custom End Game confirmation modal with title "Are you sure you want to end the game?", confirm button ("Yes, End Game" or "Confirm"), and cancel button ("No, Keep Playing" or "Cancel").
3. Edit `app/page.tsx` to import and render `InGameScreen` inside the case `'ingame'`.

Verify the implementation:
1. Run `npm run build` and check for compile/type/lint errors.
2. Run `npx playwright test` to verify that setup and in-game E2E tests pass.
3. Write a handoff report in `/home/bank/score-board/.agents/worker_ingame_base/handoff.md` detailing changes made, build and test commands run, and verification results.
