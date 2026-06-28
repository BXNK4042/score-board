<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project runs **Next.js 16** + **React 19**, which have breaking API/convention differences from earlier versions in your training data. Before writing framework code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — ScoreBoard

Mobile-first score-tracking app for snooker-style games (players, scored balls, fouls, live stopwatch, undo/redo, score history). Single-page Next.js App Router app.

## Commands

```bash
npm run dev       # dev server (http://localhost:3000)
npm run build     # production build
npm run lint      # eslint (next config)
npx tsc --noEmit  # TYPECHECK — there is NO `npm run typecheck` script
```

Required after non-trivial changes: **lint → typecheck**. Both must be clean. The 4 standing `@next/next/no-img-element` warnings are accepted (see Images).

Path alias: `@/*` → repo root.

## Where things live (an agent will get this wrong without help)

- **Types & constants**: `lib/gameTypes.ts` — `Player`, `Game`, `ScoreChange`, `DraftPlayer`, `PALETTE`, `getNonFoulScore`, `prependScoreHistory`, `SCORE_HISTORY_CAP`. **Not** in `hooks/useGameState.ts` (older doc/code may suggest otherwise).
- **Snooker data & rules**: `lib/snookerBalls.ts` — single source of truth. Use `getBallNameByPoints`, `getFoulPoints`, `getBallStyle`, `SNOOKER_BALLS`, `FOUL_BALLS`. Do not reinline.
- **Avatar mapping**: `lib/playerAvatar.ts` — `COLOR_TO_AVATAR`, `hasAvatar`, `getAvatarSrc`.
- **Animation helpers**: `lib/animations.ts` — `useReducedMotion`, `createSafeVariants`, `listContainerVariants`, `listItemVariants`. Always animate only transform/opacity; helpers handle reduced-motion.
- **CSS tokens**: `app/globals.css` — `--app-brand`, `--app-snooker-*`, `--app-warning-*`, `--app-crown`, etc. Always use `--app-*` tokens via arbitrary values (e.g. `bg-[var(--app-brand)]`) — never literal hex in `components/` or `lib/`. Snooker ball inset highlights use the `.ball-inset-shadow` / `.ball-inset-shadow-lg` utility classes (Tailwind arbitrary `shadow-[...]` can't cleanly compose `var()` + alpha).
- **State hook**: `hooks/useGameState.ts` — single consumer is `app/page.tsx`. Don't add a second consumer; don't restructure without reading `docs/USEGAMESTATE-REFACTOR-2026-06-28.md`.

## State architecture invariants (load-bearing — do not break)

- **Stopwatch is split off `Game`**: `elapsedSeconds` and `isRunning` are separate atoms in `useGameState`, not fields on the `Game` object. The 1s tick touches only `elapsedSeconds` so the `activeGame` ref stays stable. Recoupling them re-introduces a per-tick re-render cascade through every `PlayerCard`.
- **`elapsedSeconds` is deliberately excluded** from the main debounced save effect's deps; it persists via a separate 10s sweep using `elapsedRef`. Don't add it back.
- **Undo/redo chokepoint**: every game mutation goes through `updateGame(updater, isHistoryAction = true)`. The `isHistoryActionRef` dance is intentional — see comment in file.
- **`recordBallClick` is atomic on purpose**: score + scoredBalls + foulCount + latestBall + scoreHistory update together to prevent double-undo. Touch all related fields in one `updateGame` call.
- **`scoreHistory` is capped at 200** via `prependScoreHistory`. Don't prepend manually.
- **Persistence**: localStorage key `scoreboard_game_state`. The load path has migration shims for new `Player`/`Game` fields — extend the migration when adding fields.

## Snooker domain rules (genuinely surprising)

- **Fouls award points to opponents** (snooker rules); the offender's `score` is **not** decremented.
- **A 4-point foul with >2 players becomes 2 points** (see `getFoulPoints`).
- Each opponent's accumulated foul-award is tracked in `Player.foulAwardedPoints` so "non-foul score" can be derived (`getNonFoulScore`).
- Tag any new foul-driven `ScoreChange` with `isFoul: true` so `HistoryScreen` colors it red.

## Components

- **shadcn/ui** (`@/components/ui/*`) for Button, Card, Input, Dialog, Checkbox, Label. Style: "new-york" (`components.json`).
- **Icons**: lucide-react only. No inline SVGs.
- **`React.memo`** is on `PlayerCard`, `GameHeader`, `FoulCard`, `LatestBallCard`, `Footer`. When adding props to these, ensure stable identities (useCallback/useMemo in parent) or memo silently breaks.
- **`PlayerCard.onToggleDrawer`** takes `(playerId: string) => void` (not `() => void`) specifically so the parent can pass a stable callback. Don't "simplify" the signature.

## UX rules that are actually enforced in code

- Mobile-first, **single column**, ~390px max width.
- **Score is the largest visual element** on a `PlayerCard` — never shrink it below surrounding content.
- **Max 10 players** (enforced in `addSetupPlayer`/`addPlayerInGame`).
- **Leader** = highest displayed score; recalc on every change. Tie → first player wins.
- **Player colors are unique** within a game (case-insensitive).
- **BulkActionBar** appears only when ≥1 player is selected; actions apply to all selected.
- **End Game** and **Restart** always require a confirmation dialog.
- State must survive refresh (localStorage persistence).

## Conventions

- **`cn()`** from `@/lib/utils` for conditional classnames.
- **`'use client'`** at the top of any file using hooks/state.
- **"ponytail:" prefix** in comments marks deliberate, non-obvious decisions. Preserve existing ones; use the same prefix when leaving similar markers.

## Images

- Player avatar `.webp` files in `public/player-avatar/` (12 files, one per palette color).
- The project deliberately uses native `<img>` (not `next/image`). Do not "fix" the `no-img-element` lint warnings without a full review.

## Docs & tests

- `docs/` holds retrospective markdown files named `TOPIC-YYYY-MM-DD.md`. Read the relevant one before non-trivial refactors.
- `docs/PROJECT.md` is **stale** in places: claims `tests/` exists (it does not), lists renamed components, and describes the old stopwatch-on-`Game` architecture. Trust the code, not PROJECT.md.
- `README.md` is the unmodified create-next-app default.
- **No tests exist.** `eslint.config.mjs` ignores `tests/**` and `.agents/**` for future use. Do not claim to "run tests" — only lint + `tsc`.

## Definition of done

A feature is complete when: mobile-first, accessible, uses design tokens, uses shadcn/ui + lucide-react, animates via the helpers, persists state correctly, and passes **lint + `tsc --noEmit`**.
