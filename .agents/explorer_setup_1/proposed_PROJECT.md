# Project Layout & Structure — ScoreBoard

This document outlines the directory structure, file responsibilities, build procedures, and coding guidelines for the ScoreBoard application.

---

## Directory Structure

```
score-board/
├── app/                       # Next.js App Router root
│   ├── favicon.ico
│   ├── globals.css            # Tailwind v4 styles
│   ├── layout.tsx             # Root layout wrapping the app
│   └── page.tsx               # App entry point (orchestrates active screens)
│
├── components/                # UI Screen Components
│   ├── HomeScreen.tsx         # Launch/Home screen UI
│   ├── SetupScreen.tsx        # Player setup & color picker UI
│   └── InGameScreen.tsx       # Live scoreboard, stopwatch, & bulk controls (TBD)
│
├── hooks/                     # Custom React Hooks & State Providers
│   └── useGameState.ts        # Unified Game state React Context Provider
│
├── public/                    # Static assets
│   └── (SVG assets & logos)
│
├── .agents/                   # Agent plans, progress log, and handoff reports
│   └── (Only agent metadata folders here)
│
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript config
└── PROJECT.md                 # Project layout guide (this file)
```

---

## Component Roles & Interface Contracts

### 1. Global State: `hooks/useGameState.ts`
- **Purpose**: Manages active game session, current screen navigation, temporary setup configurations, and stopwatch interval.
- **Contract**:
  - `game`: Contains current game info (title, players, duration, status).
  - `screen`: `'home' | 'setup' | 'ingame'`.
  - `setupPlayers` / `setupTitle`: Temporary states for configuring players prior to starting the game.
  - `createGame(title, players)`: Commences game session.
  - `updateScore(playerId, delta)`: Recalculates individual player score and re-evaluates the "LEADER" designation in real-time.
  - `bulkUpdateScores(delta)`: Increments/decrements selected player scores simultaneously.
  - `toggleStopwatch(running)`: Drives the stopwatch.
  - `endGame()`: Cleans up the active session and returns to Home.

### 2. Layouts and Screens
- **`HomeScreen`**: Provides a beautiful entry gate containing the logo and a prominent `+` button to open the Setup Screen.
- **`SetupScreen`**: Handles the form to title the game, add up to 10 players, assign them unique colors (via color picker), and edit or remove them.
- **`InGameScreen`**: Renders the active game, individual player cards with action buttons, leader label, stopwatch banner, and the bulk action bar.

---

## Styling & Design System (Tailwind v4)
- **Base Style**: Soft lavender background (`#EEEEF8`) with single-column layout containment (`max-w-[390px] mx-auto min-h-screen bg-[#EEEEF8] shadow-2xl`).
- **Typography**: Big bold numbers for scores (minimum `48px`, font-weight `900`). Bold headers.
- **Components**: Standardized border-radius (`rounded-[20px]` for cards, `rounded-full` / `rounded-full` for pills and buttons).
- **Colors**: Unique hex color code propagated to cards' left-borders, score text, and increment buttons.

---

## Build & Verify Commands

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Code Quality / Linting
```bash
npm run lint
```
