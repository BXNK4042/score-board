# InGameScreen Modularization — 2026-06-28

## Goal
Break `components/InGameScreen.tsx` out of its 683-line "kitchen-sink" form into a thin orchestrator that wires state and callbacks to focused subcomponents, hooks, and shared helpers. Eliminate duplicated logic discovered along the way.

## Why it was 683 lines
The file mixed 5 distinct concerns in one component:

| Section | Lines | Concern |
|---|---|---|
| 5 inline icon wrapper components | 19–37 | Presentation |
| `getBallStyle` snooker helper | 40–65 | Domain logic (duplicated in `PlayerCard`) |
| State hooks + effects (title sync, time tick) | 108–156 | Stateful logic |
| Inline helpers (`getRelativeTimeString`, leader calc) | 160–208 | Domain logic (`getRelativeTimeString` duplicated in `HistoryScreen`) |
| Header w/ 6 inlined action buttons | 216–317 | Presentation |
| Stats cards (Foul + Latest Ball inline IIFE) | 327–394 | Presentation |
| 4 inline Dialog modals | 477–680 | Presentation |

Two real DRY violations were found:
1. **Snooker ball config** — `getBallStyle` in `InGameScreen` duplicated `SNOOKER_BALLS`/`FOUL_BALLS` in `PlayerCard`.
2. **Relative time formatter** — `getRelativeTimeString` was copy-pasted in `InGameScreen` (verbose style) and `HistoryScreen` (compact style).

## Method
Five-phase extraction, executed bottom-up so each layer builds on the previous one. Pure helpers first (lowest risk), then stateful hooks, then presentational subcomponents, then dialogs, then the final orchestrator rewrite. All `data-testid` hooks preserved as test contracts.

## Created

### `lib/` — Pure shared helpers
| File | Lines | Purpose |
|---|---|---|
| `lib/snookerBalls.ts` | 59 | `SNOOKER_BALLS`, `FOUL_BALLS`, `BallConfig`, `getBallStyle(ballName, type)`. Single source of truth for both `InGameScreen` (latest-ball card) and `PlayerCard` (ball grid). |
| `lib/relativeTime.ts` | 26 | `getRelativeTimeString(timestamp, now?, style)` with `'long'` / `'short'` variants — preserves both original behaviors under one signature. |

### `hooks/` — Stateful logic
| File | Lines | Purpose |
|---|---|---|
| `hooks/useRelativeTime.ts` | 30 | Owns the `now` state + 10s tick interval + immediate-sync timeout. Returns formatted string (or `null`). Replaces ~50 lines of effects from `InGameScreen`. |
| `hooks/useEditableTitle.ts` | 40 | Owns `prevTitle`/`tempTitle`/`isEditing` state + `start`/`save` actions. Syncs external title changes safely. |

### `components/ingame/` — Presentational subcomponents
| File | Lines | Purpose |
|---|---|---|
| `GameHeader.tsx` | 137 | Title input/Button + 6 action buttons (history, add-player, undo, redo, restart, end). Consumes `useEditableTitle`. |
| `FoulCard.tsx` | 24 | Fouls stat card. |
| `LatestBallCard.tsx` | 63 | Latest-ball visual including the conic-gradient special case. Uses shared `getBallStyle`. |

### `components/ingame/dialogs/` — Dialog components
| File | Lines | Purpose |
|---|---|---|
| `BulkEditNameDialog.tsx` | 107 | Bulk rename. Owns `editedNames` state internally; resets on close via `onOpenChange`. |
| `BulkRemoveDialog.tsx` | 71 | Bulk remove confirm. Pure props in/out. |
| `EndGameDialog.tsx` | 48 | End-game confirm. |
| `RestartGameDialog.tsx` | 52 | Restart-session confirm. |

## Changed

### `components/InGameScreen.tsx` — 683 → 243 lines (−64%)
Now a pure orchestrator. Owns only the dialog-open state, drawer/active-tab state, leader/selection derivation, and `getFirstAvailableColor`. Renders `<GameHeader>`, `<StopwatchBanner>`, `<FoulCard>`, `<LatestBallCard>`, the player list, `<Footer>`, `<BulkActionBar>`, and the 4 dialog components. All 10 `data-testid` hooks preserved.

### `components/PlayerCard.tsx`
Replaced local `BallConfig` interface + `SNOOKER_BALLS` + `FOUL_BALLS` (34 lines) with import from `lib/snookerBalls`.

### `components/HistoryScreen.tsx`
Replaced local `getRelativeTimeString` (11 lines) with import from `lib/relativeTime` using `'short'` style.

## Decisions
- **Icon wrappers inlined, not extracted.** The 5 wrappers (`GamepadIcon`, `PersonPlusIcon`, `CheckIcon`, `RotateCcwIcon`, `HistoryIcon`) were used only in the header. Inlining them in `GameHeader.tsx` was simpler than maintaining a separate `icons.tsx`. `GamepadIcon`'s `export` had no external consumers (verified — `SetupScreen` imports its `GamepadIcon` from `HomeScreen`, not `InGameScreen`).
- **Relative time kept as two styles, not unified to one.** The two original call sites used different formats (long-form for footer, short-form for history list). Adding a `style` parameter preserves both behaviors without forcing one display choice.
- **`editedNames` state moved into `BulkEditNameDialog`.** Originally owned by `InGameScreen`. The dialog now owns its transient form state and reports committed edits upward via `onSaveNames`. Reset happens in `onOpenChange` (not a `useEffect`) to satisfy React 19's `react-hooks/set-state-in-effect` rule.

## Verification
- `npx tsc --noEmit` — passes
- `npm run lint` — 0 errors, 3 pre-existing `<img>` warnings (unrelated, in `PlayerCard`/`PlayerDialog`/`SetupScreen`)

## Not in scope
- The 3 `@next/next/no-img-element` warnings — low priority (tiny local `.webp` avatars); would need all 3 files touched together plus review against Next 16's `next/image` API.
