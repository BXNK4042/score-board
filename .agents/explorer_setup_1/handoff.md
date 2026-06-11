# Handoff Report — explorer_setup_1

## 1. Observation
- **Package Versions**: Verified in `package.json` that the project uses React `19.2.4` (line 13), Next.js `16.2.9` (line 12), and Tailwind CSS `^4` (line 23).
- **Codebase State**: Currently contains Next.js template files in `app/page.tsx`, `app/layout.tsx`, and `app/globals.css`. 
- **Build Verification**: Executed `npm run build` on the baseline repository and confirmed successful compilation:
  ```
  ▲ Next.js 16.2.9 (Turbopack)
  Creating an optimized production build ...
  ✓ Compiled successfully in 3.7s
  Finished TypeScript in 3.8s
  ```
- **Requirements**:
  - `AGENTS.md` outlines mobile-first layout (~390px wide), unique player colors (at least 8 distinct colors, no sharing), player limit (max 10), score styling (large font, min 48px, font-weight 900), and stopwatch logic.
  - `.agents/sub_orch_impl/SCOPE.md` outlines the necessary hooks and actions (e.g. `createGame`, `updateScore`, `bulkUpdateScores`, etc.) for global state integration.

## 2. Logic Chain
- **Global State hook (`useGameState.ts`)**: To satisfy requirements in `SCOPE.md`, the state needs to be accessible from all screens (Home, Setup, and In-Game). Creating a React Context Provider is the standard approach to manage this global state and avoid prop-drilling.
- **Client-side Hydration / Persistence**: Since Next.js uses server-side rendering, accessing `localStorage` directly during the initial render causes hydration mismatch errors. To prevent this, the provider must render a loading placeholder until the client mounts and successfully loads state via `useEffect`.
- **Stopwatch Ticker**: To prevent timing drift, the stopwatch tick effect should depend only on the running state (`game?.isRunning`), updating via a functional state callback `prevGame => ...`.
- **Setup Screen Validations**:
  - **Player Limit**: The FAB button must check `setupPlayers.length < 10` before opening the modal.
  - **Color Picker**: To ensure no two players share a color while supporting up to 10 players, the color palette must contain at least 10 colors. We chose 12 distinct colors. When adding/editing a player, colors selected by other players must be disabled.
  - **Leader Calculation**: Rather than updating state on every tick, `leaderId` can be computed dynamically with a `useMemo` selector based on `game.players`. The tie-breaker (first player in the list wins) is resolved by checking if another player's score is strictly greater than the current leader's.

## 3. Caveats
- The active In-Game screen layout and controls (such as the bulk action bar and confirmation modal) are out of scope for Milestone 1 and are stubbed with placeholder screens.
- E2E Playwright test infrastructure is planned for Milestone 1 in the E2E track but has not been run or verified against our screens yet.

## 4. Conclusion
- We have formulated a complete global state design, layout, and implementation strategy for Milestone 1.
- All implementation files have been drafted and saved in our working directory:
  - `proposed_useGameState.ts` -> Proposes the global React Context and hook.
  - `proposed_HomeScreen.tsx` -> Proposes the entry layout for the Home Screen.
  - `proposed_SetupScreen.tsx` -> Proposes the player customization forms, color picker, and limit validations.
  - `proposed_page.tsx` -> Proposes the main entry point orchestrating screen states.
  - `proposed_PROJECT.md` -> Proposes the complete project structure.

## 5. Verification Method
- **File Transfer**: Copy the proposed files to their final destinations:
  ```bash
  cp .agents/explorer_setup_1/proposed_useGameState.ts hooks/useGameState.ts
  cp .agents/explorer_setup_1/proposed_HomeScreen.tsx components/HomeScreen.tsx
  cp .agents/explorer_setup_1/proposed_SetupScreen.tsx components/SetupScreen.tsx
  cp .agents/explorer_setup_1/proposed_page.tsx app/page.tsx
  cp .agents/explorer_setup_1/proposed_PROJECT.md PROJECT.md
  ```
- **Build & Quality Check**: Run `npm run build` and `npm run lint` to confirm that the project compiles with no TypeScript compilation errors or ESLint violations.
- **Accessibility Inspection**: Check that elements have appropriate labels (e.g. `aria-label="Add Player"`, `aria-label="Edit Player"`) and role attributes to enable proper accessibility and E2E testing targetability.

## 6. Remaining Work
- **Implementer**: Perform the file copy operations listed above.
- **Implementer**: Verify the builds compile and that UI behaves correctly in the dev server.
- **Implementer**: Progress to Milestone 2 (In-Game Screen Base) using the structures established in `useGameState`.
