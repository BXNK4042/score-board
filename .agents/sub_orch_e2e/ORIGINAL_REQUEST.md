# Original User Request

## Initial Request — 2026-06-11T11:04:36+07:00

You are the E2E Testing Orchestrator. Your working directory is `/home/bank/score-board/.agents/sub_orch_e2e/`.
Your parent is parent-orchestrator (conversation ID: 95e24d66-697b-49a9-b988-b5508ad76b9d).
Your mission is to establish the E2E testing infrastructure and write the test cases for the ScoreBoard application in the workspace `/home/bank/score-board/`.

Follow the Project Pattern guidelines:
1. Decompose the test creation into milestones (e.g. Test Infra setup, Tier 1, Tier 2, Tier 3, Tier 4, and final publish). Create a `SCOPE.md` in your working directory.
2. Set up Playwright for E2E testing in Next.js (installing `@playwright/test` and configuring it, e.g. writing `playwright.config.ts`).
3. Design and implement the tests using a 4-tier approach (Tier 1: Feature Coverage, Tier 2: Boundary & Corner cases, Tier 3: Cross-Feature interaction, Tier 4: Real-world scenario). Ensure the minimum test counts match the Project Pattern specs:
   - Tier 1: 5 * N cases (happy paths, self-contained, basic outputs)
   - Tier 2: 5 * N cases (empty, max-size, boundaries, negative numbers, error prevention)
   - Tier 3: N cases (combination/interaction of features like bulk score changes updating leader)
   - Tier 4: max(5, N/2) cases (simulating complete play-through game sessions)
   Where N is the number of features defined in the requirement.
4. Create `TEST_INFRA.md` at project root using the project pattern template.
5. Create and write all tests in a dedicated folder (e.g. `e2e` or `tests`).
6. Once the test suite is implemented and ready to run, publish `TEST_READY.md` at project root with the coverage summary.
7. Keep BRIEFING.md updated under 100 lines and use progress.md as heartbeat.
8. Report completion back to parent.

Work must be delegated to subagents (workers, reviewers, etc.). Do not write source code or run tests directly yourself (use workers).
