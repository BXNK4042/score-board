# Scope: Implementation Track

## Architecture
We will use a unified React context or custom state hook (`hooks/useGameState.ts`) to manage the application state globally and persist it in LocalStorage. This ensures that screens can easily read and modify the active game session.
- **State Model**: Holds `Game` state (id, title, createdAt, elapsedSeconds, isRunning, players) and active screen state (`'home' | 'setup' | 'ingame'`).
- **State Flow**:
  - Home Screen: initializes setup state or resumes an existing game.
  - Setup Screen: allows adjusting game title, adding/editing/deleting up to 10 players, and picking unique player colors.
  - In-Game Screen: updates stopwatch ticker, calculates "LEADER" dynamically, increments/decrements player scores, handles bulk actions, and ends sessions via a confirmation modal.
- **UI Architecture**: Mobile-first single-column responsive layout (~390px wide viewport focus), using Tailwind CSS for a minimal, bold, and vibrant aesthetic.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Setup Screen | Home Screen layout, Setup Screen layout (add/edit/delete players, title input, color picker with 8+ distinct colors, max 10 players check) | none | DONE |
| 2 | In-Game Screen Base | Header row with editable title, add player, end game button; Player cards with accent colors, score inc/dec, dynamic leader recalculation | M1 | PLANNED |
| 3 | Stopwatch & Persistence | Stopwatch HH:MM:SS banner with play/pause, non-blocking tick interval, state persistence to LocalStorage (survives reload) | M2 | PLANNED |
| 4 | Bulk Actions & End Game | Multi-select checkbox/circle, Bulk action bar bottom pop-up, bulk +/- buttons, end game confirmation modal | M3 | PLANNED |
| 5 | Integration & E2E Testing | Integration with the opaque-box E2E test suite (Tiers 1-4) sequentially | M4 | PLANNED |
| 6 | Adversarial Hardening | White-box analysis, edge-case coverage expansion, challenger verification, gap resolution | M5 | PLANNED |

## Interface Contracts
### Game State Actions (`useGameState`)
- `createGame(title: string, players: Player[])`: Initializes a new game, sets `elapsedSeconds` to 0, `isRunning` to true, and redirects to `'ingame'`.
- `updateGameTitle(title: string)`: Updates current game title.
- `addPlayerInGame(name: string, color: string)`: Dynamically adds a new player during a live game (up to 10 players total).
- `updateScore(playerId: string, delta: number)`: Adjusts score for a specific player and recalculates leader in real-time.
- `togglePlayerSelection(playerId: string)`: Toggles bulk selection status for a player card.
- `bulkUpdateScores(delta: number)`: Adds `delta` to all selected players' scores.
- `toggleStopwatch(running: boolean)`: Plays or pauses the stopwatch state.
- `endGame()`: Clears active game state and returns to `'home'`.
