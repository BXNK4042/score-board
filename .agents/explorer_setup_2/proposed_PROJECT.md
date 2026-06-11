# ScoreBoard Project Layout and Implementation Plan

This document defines the layout, design tokens, state contract, component structure, and verification methods for the ScoreBoard application.

---

## 1. Directory Layout

The codebase follows a modular structure. Custom hooks and business logic are segregated from presentational components. Tests and mock layouts are organized cleanly.

```
score-board/
├── app/                        # Next.js App Router (pages and configuration)
│   ├── layout.tsx              # Root HTML wrapper, metadata, and fonts
│   ├── page.tsx                # Main entry point (dynamic screen router)
│   └── globals.css             # Tailwind v4 import and custom themes
├── components/                 # Presentation & UI Components
│   ├── ui/                     # Reusable design primitives
│   │   ├── Button.tsx          # Consistent buttons (pills, FABs)
│   │   └── Modal.tsx           # Overlay dialogs (setup edit form, end game confirm)
│   ├── HomeScreen.tsx          # Initial entry view
│   ├── SetupScreen.tsx         # Player setup form and color picker
│   ├── InGameScreen.tsx        # Dynamic scoreboard view (Milestone 2)
│   ├── PlayerCard.tsx          # Player score card (Milestone 2)
│   ├── StopwatchBanner.tsx     # HH:MM:SS timer view and controllers (Milestone 3)
│   └── BulkActionBar.tsx       # Bottom bulk actions drawer (Milestone 4)
├── hooks/                      # Custom hooks and Global State Context
│   └── useGameState.ts         # Central game state management and persistence hook
├── design/                     # Image assets and wireframes (Read-only)
├── tests/                      # Testing Suite
│   └── e2e/                    # Playwright/Cypress end-to-end integration tests
├── package.json                # Dependencies and project scripts
├── tsconfig.json               # TypeScript configuration (path alias @/* mapped to ./*)
└── PROJECT.md                  # This project specification file
```

---

## 2. Design Tokens & Visual Specs

| Token | Color / Hex | Application Surface |
|---|---|---|
| **Background** | `#EEEEF8` (soft lavender) | App layout background |
| **Brand Primary** | `#4B45D4` (deep indigo) | Buttons, header text, active icons |
| **Text Primary** | `#1A1A2E` (near-black) | Primary titles, active player names |
| **Text Secondary** | `#9999AA` (medium grey) | Subtitles, disabled states |
| **Card Background** | `#FFFFFF` | Player list cards, input fields, modals |
| **Danger** | `#E04040` (red) | Delete buttons, destructive actions |
| **Selected Accent** | `#D4156B` (magenta-pink) | Bulk selection indicators and card borders |
| **Live Dot** | `#22DD66` (vivid green) | Running stopwatch indicator |
| **Border Radius Card**| `20px` | Player and game cards |
| **Border Radius Pill**| `999px` | Round buttons, badges, stopwatch banner |
| **Font Weights** | `900` (extra bold) / `700` (bold) | Scores, headers, action titles |

---

## 3. Global State Contract (`useGameState`)

Managed via a React Context Provider wrapper at the application root (`app/layout.tsx`).

### State Models

```typescript
export interface Player {
  id: string;
  name: string;
  color: string;               // Hex accent color
  score: number;               // Default 0
  isSelected: boolean;         // Checked/unchecked for bulk actions
}

export interface Game {
  id: string;
  title: string;
  createdAt: number;          // Timestamp of creation
  elapsedSeconds: number;     // Elapsed seconds count
  isRunning: boolean;         // Stopwatch active state
  players: Player[];          // Array of up to 10 players
}

export type ScreenType = 'home' | 'setup' | 'ingame';
```

### Action Methods

- `createGame(title: string, players: Player[])`: Initializes a new active game, resets elapsed timer, sets it to running, and forwards screen to `'ingame'`.
- `updateGameTitle(title: string)`: Updates active game title in-game.
- `addPlayerInGame(name: string, color: string)`: Instantly inserts a player during a live game (enforcing the 10-player maximum).
- `updateScore(playerId: string, delta: number)`: Modifies a player's score and triggers instant leader recalculation.
- `togglePlayerSelection(playerId: string)`: Toggles selection state for bulk actions.
- `bulkUpdateScores(delta: number)`: Updates scores of all selected players by `delta` in a single action.
- `toggleStopwatch(running: boolean)`: Pauses or resumes the stopwatch interval.
- `endGame()`: Clears active game and resets app to the `'home'` screen.

### Real-Time Leader Rule
- Evaluated on every score update. The leader is the player with the highest score.
- **Tie-Breaker**: In the event of a tie, the player occupying the lower index (earlier in the array) is assigned the leader label.

---

## 4. Milestone 1 Component Architecture

### A. Root Page router (`app/page.tsx`)
- Detects `isHydrated`. Shows a clean skeleton layout if false.
- Renders the simulated mobile phone frame:
  `w-full sm:w-[390px] h-full sm:h-[844px] bg-[#EEEEF8] flex flex-col relative overflow-hidden sm:shadow-2xl sm:rounded-[40px] sm:border-[8px] sm:border-zinc-900`
- Conditionally renders `<HomeScreen />`, `<SetupScreen />`, or `<InGameScreen />`.

### B. Home Screen (`components/HomeScreen.tsx`)
- Display brand logo (gamepad icon + **ScoreBoard** wordmark in deep indigo).
- Centered indigo circle `+` button with a pulse glow and "Create New Game" label.
- **Resume Game** Action: If `game !== null`, render an additional "Resume Current Session" banner/button underneath, allowing the user to pick up where they left off.

### C. Setup Screen (`components/SetupScreen.tsx`)
- Header with logo.
- Rounded input card for **Game Title** with uppercase label `TITLE`.
- **Player List Section**:
  - Title "Players" accompanied by a badge displaying the current player count.
  - Interactive Player list:
    - Left-border accent with player's custom color.
    - Avatar bubble colored with player's accent (20% opacity background, solid icon).
    - Player name.
    - Delete button (red icon) and Edit button (pencil icon).
- **Add Player Interaction**:
  - Floating Action Button (FAB) or row item that opens a custom dialog.
  - Dialog allows typing the name and picking a color.
  - **Color Palette**: 8 distinct colors (Indigo, Green, Magenta, Orange, Blue, Red, Purple, Teal).
  - **Uniqueness Check**: When editing or adding, colors selected by other active players are disabled/unavailable.
- **Start Game Trigger**:
  - Validates `players.length >= 1`.
  - Dispatches `createGame(title, players)` which transfers to `'ingame'` screen.

---

## 5. Verification Command References
- Build & compile check: `npm run build`
- Linter validation: `npm run lint`
- E2E Tests: `npx playwright test`
