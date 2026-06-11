## 2026-06-11T04:07:36Z
You are the Implementation Worker for Milestone 1 (Setup Screen and global state hook).
Your working directory is /home/bank/score-board/.agents/worker_setup/

Your task:
1. Create `PROJECT.md` at the project root using the recommendations in `/home/bank/score-board/.agents/explorer_setup_3/proposed_PROJECT.md`.
2. Create `/home/bank/score-board/hooks/useGameState.ts` based on `/home/bank/score-board/.agents/explorer_setup_3/proposed_useGameState.ts`.
3. Create the components under `/home/bank/score-board/components/` by splitting `/home/bank/score-board/.agents/explorer_setup_3/proposed_layouts.tsx` cleanly into:
   - `components/HomeScreen.tsx` (Home Screen view & icon helpers)
   - `components/PlayerDialog.tsx` (Add/Edit player dialog)
   - `components/SetupScreen.tsx` (Setup Screen view)
   Make sure you resolve imports correctly (e.g. using `@/hooks/useGameState` or relative imports `../hooks/useGameState` as required).
4. Create `/home/bank/score-board/app/page.tsx` based on `/home/bank/score-board/.agents/explorer_setup_3/proposed_page.tsx`, adjusting the imports to point to `@/hooks/useGameState` and the respective components.
5. Run the build checks (`npm run build` and `npm run lint`) to verify that the code compiles successfully with 0 TypeScript compilation errors or lints.
6. Write a completion report at `/home/bank/score-board/.agents/worker_setup/handoff.md` detailing the commands you ran, files modified, and compile results.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.
