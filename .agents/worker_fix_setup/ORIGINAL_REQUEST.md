## 2026-06-11T11:15:43+07:00
You are the Worker Fix Setup subagent.
Your working directory is /home/bank/score-board/.agents/worker_fix_setup/

Please execute the following fixes for the Milestone 1 codebase:
1. In `hooks/useGameState.ts`:
   - Expand `PALETTE` to 12 vibrant colors (add: '#30D158', '#64D2FF', '#FF375F', '#9B59B6') to ensure 10 players can be created without sharing colors.
   - Refactor `addSetupPlayer`, `updateSetupPlayer`, and `addPlayerInGame` to perform their validation checks synchronously against `setupPlayers` / `activeGame.players` state variables, and return a boolean synchronously. Avoid returning state-setter dependent updates as the state setters are asynchronous.
2. In `components/PlayerDialog.tsx`:
   - Fix duplicate color validation in `handleSubmit` by ignoring the player's own color, e.g. checking `const isColorUsed = usedColors.some((c) => c.toLowerCase() === colorLower) && colorLower !== initialColor.toLowerCase();`.
   - Update the color picker button grid layout from `grid-cols-4` to `grid-cols-6` to accommodate 12 colors.
   - Add labels association for accessibility: link label with `htmlFor="player-name-input"` to input with `id="player-name-input"`.
3. In `components/SetupScreen.tsx`:
   - Add label association for game title input: link label with `htmlFor="game-title-input"` to input with `id="game-title-input"`.
4. In `tests/scoreboard.spec.ts`:
   - Resolve strict mode locator ambiguity. For instance, replace ambiguous `locator('text=Add Player')` references with more specific selectors (e.g. using `getByRole('heading', { name: 'Add Player' })`).
5. In `eslint.config.mjs`:
   - Ensure linting checks pass by verifying no errors are returned for application source files. Add `"tests/verify*.tsx"` and `"tests/verify*.js"` (or the entire `"tests/**"` if needed) to the eslint ignores array so helper scripts don't break lints.
6. Run `npm run build` and `npm run lint` to confirm that all changes compile and pass checks with 0 errors.
7. Write a completion report at `/home/bank/score-board/.agents/worker_fix_setup/handoff.md`.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.
