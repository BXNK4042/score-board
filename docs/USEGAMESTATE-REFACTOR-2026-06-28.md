# useGameState Refactor (Tiers A + B) — 2026-06-28

## Goal
Reduce coupling and per-render cost in `hooks/useGameState.ts` (~608 lines) by extracting pure code, splitting the stopwatch into its own state atom, memoizing leaf components, and right-sizing localStorage persistence. The hook was borderline "god hook" but defensible; this refactor addresses the concrete problems surfaced by an audit without restructuring the central state machine.

## Why
Audit findings that motivated the refactor:

| Problem | Evidence |
|---|---|
| File did 4 jobs | types barrel + constants module + the hook + snooker business rules in one file |
| Stopwatch tick cascaded through the whole tree | `setActiveGame((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }))` produced a new `activeGame` ref every second; with zero `React.memo` anywhere in the repo, every `PlayerCard` (heavy: framer-motion + infinite spring animations) re-rendered every second |
| localStorage written every second | Save effect depended on `activeGame`; tick triggered full `JSON.stringify` of game state including `scoreHistory`, which grew without bound |
| `scoreHistory` unbounded | `updateScore`, `bulkUpdateScores`, `recordBallClick` all prepended without cap |
| `recordBallClick` carried inline business logic | A 20-line IIFE mapping `points → ballName` (duplicating `lib/snookerBalls.ts`) plus the foul-point formula inlined |
| Types lived in the hook file | 7 components imported types from `@/hooks/useGameState`, blurring "hook" vs "module" |

## Method
Four-phase refactor, sequenced so each layer made the next easier. Pure extractions first (zero risk), then split the stopwatch atom (makes memoization nearly trivial), then memoize, then fix persistence.

## Created

### `lib/gameTypes.ts` — Pure types + constants
| Export | Purpose |
|---|---|
| `DraftPlayer`, `Player`, `ScoreChange`, `Game` | Type definitions moved out of the hook |
| `PALETTE` | 12-color player palette |
| `getNonFoulScore(player)` | Pure helper: `player.score − player.foulAwardedPoints` |
| `prependScoreHistory(existing, newEntries, cap)` | Pure helper that prepends and caps at `SCORE_HISTORY_CAP = 200` |

### Extended `lib/snookerBalls.ts`
| Export | Purpose |
|---|---|
| `getBallNameByPoints(points, tab)` | Replaces the 20-line IIFE inside `recordBallClick`; reuses the existing `SNOOKER_BALLS`/`FOUL_BALLS` data (was duplicated) |
| `getFoulPoints(points, playerCount)` | Extracts the foul-point formula `(isFourPointFoul && hasMultiplePlayers) ? 2 : Math.max(points, 4)` |

## Changed

### `hooks/useGameState.ts` — 608 → 545 lines, plus meaningfully simpler
- Imports types/helpers from `lib/gameTypes` and `lib/snookerBalls` instead of declaring them inline.
- `elapsedSeconds` and `isRunning` moved off the `Game` interface into separate state atoms.
- Stopwatch tick (`setInterval`) now calls `setElapsedSeconds((n) => n + 1)` — `activeGame` ref stays stable across ticks.
- `createGame`, `restartGame`, `endGame`, `undo`, `redo` all simplified (no cross-atom preservation dance for the stopwatch).
- Main save effect debounced 500ms; `elapsedSeconds` deliberately excluded from deps (eslint-disabled with comment) — see Decisions.
- New 10s sweep effect persists only the stopwatch fields via a ref, avoiding full-state serialization on every tick.
- Load path migrates legacy saves that had `elapsedSeconds`/`isRunning` on the `Game` object.
- `scoreHistory` capped at 200 entries via `prependScoreHistory` in all 3 push sites (`updateScore`, `bulkUpdateScores`, `recordBallClick`).

### `components/InGameScreen.tsx`
- New props `elapsedSeconds: number`, `isRunning: boolean` (passed through to `StopwatchBanner`).
- `useMemo` for `safeListVariants`, `safeContainerVariants`, `displayScores`, `selectedPlayers` — all keyed on `activeGame` (now tick-stable) and `noFoulDisplay` / `prefersReducedMotion`.
- `useCallback` for `handleToggleDrawer(playerId)` — replaces a per-render inline closure that would have broken `PlayerCard`'s `React.memo`.

### `components/PlayerCard.tsx`
- `onToggleDrawer` signature changed from `() => void` to `(playerId: string) => void` so the parent can pass a stable callback.
- Wrapped export in `React.memo`. After the stopwatch split, `player` ref is stable across ticks, so shallow memo now correctly skips re-renders.

### Other leaf components
| File | Change |
|---|---|
| `components/ingame/GameHeader.tsx` | `React.memo` wrap |
| `components/ingame/FoulCard.tsx` | `React.memo` wrap |
| `components/ingame/LatestBallCard.tsx` | `React.memo` wrap |
| `components/Footer.tsx` | `React.memo` wrap (now only re-renders every 10s via `useRelativeTime`, not every 1s) |

### Import site updates (7 files)
Type/constant imports moved from `@/hooks/useGameState` to `@/lib/gameTypes`:
`InGameScreen.tsx`, `SetupScreen.tsx`, `PlayerCard.tsx`, `PlayerDialog.tsx`, `PlayerColorPicker.tsx`, `HistoryScreen.tsx`, `BulkRemoveDialog.tsx`.

### `app/page.tsx`
Destructures `elapsedSeconds` + `isRunning` from the hook and passes them to `InGameScreen`.

## Decisions
- **Clean cut on type imports, no re-exports.** The hook could have re-exported the types for back-compat, but that defeats the purpose of the extraction. All 7 import sites were updated directly.
- **Stopwatch fields live in their own atoms, not on `Game`.** This is the load-bearing change: it makes `activeGame`'s reference stable across ticks, which is what lets `React.memo` on `PlayerCard` actually skip re-renders. The cost is two extra state atoms and a small migration shim in the load path.
- **Persistence is split into two effects.** The main debounced save (500ms) handles game/state changes but excludes `elapsedSeconds` from deps so ticks don't trigger serialization. A separate 10s sweep effect (only active while `isRunning`) updates just the stopwatch fields in localStorage via `elapsedRef.current`. This keeps tick cost at O(1) setState + one ref write.
- **`scoreHistory` cap = 200.** Generous enough that a long match won't notice, tight enough that the localStorage payload stays bounded. Tunable via `SCORE_HISTORY_CAP` in `lib/gameTypes.ts`.
- **Save debounce = 500ms.** Short enough that user actions persist almost immediately, long enough that rapid score changes don't thrash localStorage.
- **`PlayerCard.onToggleDrawer` signature changed rather than wrapping in a per-row closure.** A per-row inline closure would have defeated `React.memo`. Taking `playerId` as an argument lets the parent use a single stable `useCallback`.
- **Tier C (splitting the hook into `useGamePersistence` / `useStopwatch` / `useUndoRedo`) deferred.** The undo/redo `updateGame` + `isHistoryActionRef` chokepoint is a legitimate reason to keep mutations centralized; splitting would force every sub-hook to cooperate on that dance. The current refactor captures most of the value at much lower risk.

## Verification
- `npx tsc --noEmit` — passes
- `npm run lint` — 0 errors, 4 pre-existing `<img>` warnings (unrelated)
- Manual smoke test needed: stopwatch still ticks, score changes still work, undo/redo still preserves clock, refresh restores all state including a running clock

## Not in scope
- **Tier C structural split** — compose `useGamePersistence` + `useStopwatch` + `useUndoRedo` + `useGameState`. Defer until pain returns.
- **The 4 `@next/next/no-img-element` warnings** — pre-existing, low priority (tiny local `.webp` avatars).
- **Tests** — `recordBallClick`'s foul formula and `undo`/`redo`'s cross-atom coordination remain unverified by automated tests; no test infrastructure exists in the repo yet.
- **`Context` provider pattern** — would eliminate the `page.tsx` → `InGameScreen` prop chain but is orthogonal to the perf/size concerns addressed here.
