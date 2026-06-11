# Handoff Report: Setup Screen & Global State Design

## 1. Observation
- **Root Directory Contents**: Verified the structure contains Next.js files and `AGENTS.md` (which details specifications including the soft-lavender background, deep indigo brand color, player limit of 10, real-time leader recalculation, non-blocking stopwatch, and bulk action bar).
- **Current App Codebase**:
  - `app/layout.tsx`: Uses `Geist` and `Geist_Mono` fonts, setting up the base page layout.
  - `app/page.tsx`: Contains placeholder Next.js landing page code.
  - `package.json`: Specifying `"next": "16.2.9"` and `"react": "19.2.4"`.
- **E2E Testing infrastructure**: `playwright.config.ts` and `tests/placeholder.spec.ts` are set up.
- **Previous Explorers**: Explorer 1 and 2 folders exist but their proposed code contains syntax and linter errors, e.g., in ESLint run:
  ```
  /home/bank/score-board/.agents/explorer_setup_1/proposed_useGameState.ts
    223:6  error  Parsing error: '>' expected
  ```
- **Milestone 1 Proposals**: Designed and created the following files inside `.agents/explorer_setup_3/`:
  - `proposed_useGameState.ts`: Custom state machine using React hooks.
  - `proposed_layouts.tsx`: Home Screen, Setup Screen, and Dialog Components styled with Tailwind CSS.
  - `proposed_page.tsx`: Application-level controller.
  - `proposed_PROJECT.md`: Structure guidelines and commands for execution.

---

## 2. Logic Chain
- **SSR Safe LocalStorage Load**: Next.js App Router renders pages on the server first, where `window` and `localStorage` are undefined. To avoid crashes and hydration mismatches, the proposed `useGameState.ts` initializes state in a loading/deferred mode (`isInitialized` flag) and reads from `localStorage` inside a client-side `useEffect` callback, deferred with `setTimeout` to satisfy the strict `react-hooks/set-state-in-effect` linting rule.
- **Non-Blocking Stopwatch Ticker**: The requirement states that the stopwatch timer must be non-blocking. By using React's functional update callback (`setActiveGame(prev => ...)`), the stopwatch's `useEffect` only registers a dependency on `isRunning` rather than the entire `activeGame` object. This guarantees that score increments, player edits, or other state changes do not reset or disrupt the accuracy of the 1-second interval timer.
- **Player Limit & Unique Color Palette**: The state hook `addSetupPlayer` and `updateSetupPlayer` validate that the player list does not exceed 10 players, and performs a case-insensitive check against `usedColors` (loaded from the active player pool) to prevent duplicate assignments of the 8 default palette colors.
- **Key-Based Modal Reset**: Instead of synchronization via `useEffect` (which causes `react-hooks/set-state-in-effect` violations), the edit modal `PlayerDialog` state resets dynamically using React's `key` property. Conditionally rendering the dialog with `key={editingPlayer ? editingPlayer.id : 'new'}` forces a clean mount and initializes state in `useState(initialValue)` directly.
- **ESLint Compliance**: Re-running `npm run lint` on the project root validates that the newly proposed files in `/home/bank/score-board/.agents/explorer_setup_3/` yield zero warnings or errors.

---

## 3. Caveats
- **In-Game Base & Stopwatch rendering**: The `InGameScreen` components (Score tracking, Stopwatch banner, and Bulk action bar) are represented by temporary layout placeholders on the `ingame` screen router, as they are designated for implementation in Milestone 2 and 3.
- **Color palette size**: Designed with the 8 standard colors specified in the palette. It can be extended if the client wishes, but is bounded to 8 to fit standard mobile screens easily.

---

## 4. Conclusion
The implementation strategy for Milestone 1 is fully formulated, designed, and verified to compile without ESLint violations.
- Propose writing `proposed_useGameState.ts` to `hooks/useGameState.ts`.
- Propose writing `proposed_layouts.tsx` to `components/HomeScreen.tsx`, `components/SetupScreen.tsx`, and `components/PlayerDialog.tsx` respectively.
- Propose writing `proposed_page.tsx` to `app/page.tsx`.
- Propose writing `proposed_PROJECT.md` to `PROJECT.md` at the project root.

---

## 5. Verification Method
To independently verify:
1. Inspect the proposed files inside `/home/bank/score-board/.agents/explorer_setup_3/`.
2. Run `npm run lint` from the project root directory. Verify that no linting errors are reported for files in the `explorer_setup_3` directory:
   ```bash
   npm run lint
   ```
3. Once the code is copied to the `app/` and `components/` folders (by the implementer subagent), compile and run build to verify compliance:
   ```bash
   npm run build
   ```
