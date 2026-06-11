# Project Layout & Implementation Guide

This document defines the layout, architecture, conventions, and verification methods for the **ScoreBoard** application.

---

## 1. Directory Layout

The codebase follows a structured layout. The `.agents/` directory is strictly reserved for agent metadata (plans, progress, handoffs) and MUST NOT contain application source code, assets, or tests.

```
score-board/
├── app/                      # Next.js App Router root
│   ├── favicon.ico
│   ├── globals.css           # Global Tailwind CSS configurations
│   ├── layout.tsx            # HTML Shell & Fonts layout wrapper
│   └── page.tsx              # Main entry page (routing & screen render)
├── components/               # Shareable/Re-usable presentation components
│   ├── HomeScreen.tsx        # Initial landing screen view
│   ├── SetupScreen.tsx       # New game configuration (players, title)
│   ├── PlayerDialog.tsx      # Add/edit player modal sheet
│   └── Icons.tsx             # Inline SVG helper icons
├── hooks/                    # Custom application hooks
│   └── useGameState.ts       # Global state machine & operations
├── public/                   # Static assets
│   ├── next.svg
│   └── vercel.svg
├── tests/                    # Playwright end-to-end test suite
│   ├── placeholder.spec.ts
│   └── scoreboard.spec.ts    # Complete E2E integration test suite
├── package.json              # Project dependencies & npm scripts
│   ├── playwright.config.ts      # Playwright E2E configuration
│   ├── tsconfig.json             # TypeScript configuration
└── PROJECT.md                # Project architecture & verification rules (this file)
```

---

## 2. Command Reference

### Build & Lint
- **Run development server**: `npm run dev`
- **Build production bundle**: `npm run build`
- **Run ESLint checker**: `npm run lint`

### Verification & E2E Testing
- **Run E2E test suite (headless)**: `npx playwright test`
- **Run E2E test suite (headed)**: `npx playwright test --headed`
- **Show test report**: `npx playwright show-report`

---

## 3. Core Architecture & Design Choices

### State Hook (`hooks/useGameState.ts`)
- A central hook managing screen routing (`'home' | 'setup' | 'ingame'`), active game session, and setup configuration draft.
- **Stopwatch interval**: Running state counts up elapsed seconds. To avoid resetting the interval timer on unrelated component re-renders, updates are performed using React's functional state update `setActiveGame(prev => ...)` with dependencies scoped strictly to `activeGame?.isRunning`.
- **LocalStorage persistence**: The application automatically saves state updates to local storage under key `scoreboard_game_state`. Next.js SSR-safeguards are applied by loading storage data inside a client-side `useEffect` hook to prevent hydration mismatches.

### Mobile-First Layout
- Styled exclusively for a single-column phone viewport width (~390px) to deliver an optimized mobile experience.
- Soft off-white/lavender background (`#EEEEF8`).
- Deep indigo brand color (`#4B45D4`).
- Cards are rounded with `border-radius: 20px`, and pill-shaped elements/buttons use `border-radius: 999px`.

### Setup Validation Constraints
- Maximum 10 players.
- Strict color uniqueness: prevents two players from sharing the same color.
- Non-empty game title and at least one player before the "START GAME" button is active.

### In-Game Rules
- **Leader**: Recalculates the highest score player in real-time. Ties award the leader badge to the first player in the list.
- **Score**: Integer, supports negative values. Score display text is large and bold (at least `48px`).
- **Bulk Action Bar**: Slides up from the bottom when $\ge 1$ player is selected. Offers multi-player score increment/decrement.
- **End Game**: Requires a confirmation modal popup to prevent accidental progress loss.

---

## 4. Verification Methods

All code contributions must be verified before handoff:
1. Ensure the build command `npm run build` compiles without TypeScript or linter errors.
2. Run the E2E verification tests using `npx playwright test` to confirm functionality.
3. Validate that no source code or testing files are written under `.agents/`.
