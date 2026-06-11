# ScoreBoard Project Plan

## Architecture
We will build a React state-driven Single Page Application (SPA) in `app/page.tsx` (using helper components as needed). 
The application state will toggle between:
- `'HOME'`: Displays the Home Screen with the "Create New Game" button.
- `'SETUP'`: Setup screen allowing game title entry, player additions/deletions/color configuration (up to 10 players), and a start button.
- `'GAME'`: In-Game screen featuring the editable title, live stopwatch, player score cards, bulk actions, and end game trigger.

### State Structure:
```typescript
interface Player {
  id: string;
  name: string;
  color: string; // Hex accent color
  score: number; // Default 0, integer (can be negative)
  isSelected: boolean; // For bulk selection
}

interface GameState {
  screen: 'HOME' | 'SETUP' | 'GAME';
  title: string;
  createdAt: number;
  elapsedSeconds: number;
  isRunning: boolean;
  players: Player[];
}
```

State is persisted in `localStorage` key `'scoreboard_game_state'` and loaded on mount.

## Milestones

| Milestone | Target | Description | Dependencies | Status |
|-----------|--------|-------------|--------------|--------|
| M1 | E2E Testing Track | Complete E2E test suite design and implementation (Tiers 1-4) in Playwright. Publish `TEST_READY.md`. | None | PLANNED |
| M2 | Implementation M1 | Setup Screen & Palette: Title input, player add/edit/delete, validation (max 10, unique colors). | None | PLANNED |
| M3 | Implementation M2 | In-Game Screen Base: Player score cards, score adjust, dynamic leader computation. | M2 | PLANNED |
| M4 | Implementation M3 | Stopwatch & Persistence: Live non-blocking stopwatch, local storage persistence and recovery. | M3 | PLANNED |
| M5 | Implementation M4 | Bulk Actions & End Game Modal: Multi-player selection, bulk adjust, end game confirmation. | M4 | PLANNED |
| M6 | Integration & Phase 2 | Pass all E2E tests, and execute Tier 5 adversarial white-box testing. | M1, M5 | PLANNED |

## Verification Plan
We will use Playwright for our E2E testing. 
The E2E Test Suite will cover:
- Tier 1: Core flows (Game setup, starting, in-game increments, play/pause stopwatch, ending game).
- Tier 2: Boundaries (Exactly 10 players limit, unique color restriction, negative scores).
- Tier 3: Interactions (Bulk select toggle, bulk increment/decrement, dynamic leader update with ties).
- Tier 4: Real-world scenario (A full game session simulation with state reload persistence).
