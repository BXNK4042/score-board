# Handoff Report: In-Game Screen Base & Leader Calculation (Milestone 2)

## 1. Observation
After conducting a read-only investigation of the ScoreBoard codebase, the following details were observed:

- **State Hook (`hooks/useGameState.ts`)**:
  - The hook currently implements all state variables and action handlers required for the in-game screen:
    - Game title updates via `updateGameTitle(title: string)` (lines 177-182).
    - Adding players mid-game via `addPlayerInGame(name: string, color: string)` (lines 184-210), which correctly checks for the 10-player maximum limit and unique color constraints.
    - Score updates via `updateScore(playerId: string, delta: number)` (lines 212-222).
    - Player bulk selection via `togglePlayerSelection(playerId: string)` (lines 224-234).
    - Bulk score changes via `bulkUpdateScores(delta: number)` (lines 236-246).
    - Stopwatch ticking and toggling via `toggleStopwatch(running: boolean)` (lines 248-253) and the background tick `useEffect` (lines 88-106).
    - Ending games via `endGame()` (lines 255-258).

- **Current Page Routing (`app/page.tsx`)**:
  - The `ingame` case of the page component (lines 66-88) currently renders a basic placeholder UI showing text fields and a temporary red "END GAME" button. It does not wire up the presentational UI or the available hook handlers.

- **Requirements in `AGENTS.md`**:
  - **Leader Rule**: "The player with the highest score is automatically labeled 'LEADER'. Ties: first player in list wins the label."
  - **Color Consistency Rule**: "Each player's accent color must propagate to all four of their UI surfaces: left-border (setup), avatar background, score text (in-game), and + button. Never hardcode a single color for all players."
  - **In-Game Screen Card Specs**: "Score in extra-large bold (black for leader, grey for others)."
  - **Stopwatch Banner Specs**: "Green live dot + 'LIVE SESSION' label + large monospace time + play/pause ▶ icon."
  - **Bulk Action Bar Scroll Padding**: "It must not overlap the last player card when visible — add bottom padding to the scroll list equal to the bar height."

---

## 2. Logic Chain
1. **Component Separation**: Since `HomeScreen.tsx` and `SetupScreen.tsx` are separated into presentational components, a new file `components/InGameScreen.tsx` should be introduced.
2. **Hook Integration**: The existing `useGameState.ts` hook is fully equipped to support all base actions. Therefore, `app/page.tsx` only needs to import `InGameScreen` and map the state and handler functions directly as props.
3. **Leader Calculation Logic**: The leader must be computed dynamically inside `InGameScreen.tsx` whenever `activeGame.players` changes. A linear scan starting from `maxScore = -Infinity` and checking `player.score > maxScore` (strict inequality) guarantees that the first player with the highest score retains the leader label in the case of a tie, adhering to the tie-breaking rules.
4. **Discrepancy Resolution**: There is a minor styling contradiction in the specification:
   - Visual specification: Score text is black for leader and grey for others.
   - Core guideline: Score text color must be the player's accent color.
   - *Resolution*: Option A (player accent color for scores) is recommended to satisfy the core Color Consistency Guideline. However, Option B (black/grey scores) is documented so that the implementer can switch easily if needed.
5. **Accessibility & Overlap Avoidance**: 
   - Adding `aria-live="polite"` to the score container satisfies the screen reader update requirement.
   - Dynamic `aria-label` tags using the player's name ensures proper accessibility for score increment/decrement buttons.
   - Dynamic `paddingBottom` (e.g. `80px`) on the scroll list when `selectedCount > 0` prevents cards from being covered by the sticky Bulk Action Bar.

---

## 3. Caveats
- **End Game Modal**: In this milestone (M2), the checkmark action stubs the confirmation dialog using a standard browser `window.confirm()`. The custom HTML overlay confirmation modal is deferred to Milestone 4.
- **Stopwatch Refresh Rate**: The timer state relies on React re-renders triggered by `activeGame` updates every second, which is performant enough for single-column mobile viewports.

---

## 4. Conclusion & Code Recommendation
Create a new file `components/InGameScreen.tsx` and update `app/page.tsx` with the proposed changes below.

### Proposed: `components/InGameScreen.tsx`
```tsx
import React, { useState, useEffect } from 'react';
import { Game, Player, PALETTE } from '@/hooks/useGameState';
import { PlayerDialog } from '@/components/PlayerDialog';
import { GamepadIcon } from '@/components/HomeScreen';

// Icons declarations
export const PersonPlusIcon = () => (
  <svg className="w-6 h-6 text-[#4B45D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

export const CheckIcon = () => (
  <svg className="w-6 h-6 text-[#22DD66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

interface InGameScreenProps {
  activeGame: Game;
  onUpdateGameTitle: (title: string) => void;
  onAddPlayerInGame: (name: string, color: string) => boolean;
  onUpdateScore: (playerId: string, delta: number) => void;
  onTogglePlayerSelection: (playerId: string) => void;
  onBulkUpdateScores: (delta: number) => void;
  onToggleStopwatch: (running: boolean) => void;
  onEndGame: () => void;
}

export function InGameScreen({
  activeGame,
  onUpdateGameTitle,
  onAddPlayerInGame,
  onUpdateScore,
  onTogglePlayerSelection,
  onBulkUpdateScores,
  onToggleStopwatch,
  onEndGame,
}: InGameScreenProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeGame.title);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  useEffect(() => {
    if (!isEditingTitle) {
      setTitleInput(activeGame.title);
    }
  }, [activeGame.title, isEditingTitle]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== activeGame.title) {
      onUpdateGameTitle(trimmed);
    }
  };

  const getLeaderId = (): string | null => {
    if (!activeGame.players || activeGame.players.length === 0) return null;
    let maxScore = -Infinity;
    let leaderId = null;
    for (const player of activeGame.players) {
      if (player.score > maxScore) {
        maxScore = player.score;
        leaderId = player.id;
      }
    }
    return leaderId;
  };

  const leaderId = getLeaderId();

  const getFirstAvailableColor = () => {
    const usedColors = activeGame.players.map((p) => p.color.toLowerCase());
    const available = PALETTE.find((c) => !usedColors.includes(c.toLowerCase()));
    return available || PALETTE[0];
  };

  const formatTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const handleEndGameClick = () => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end this game? Current progress will be lost."
    );
    if (confirmEnd) {
      onEndGame();
    }
  };

  const selectedCount = activeGame.players.filter((p) => p.isSelected).length;

  return (
    <div className="flex flex-col flex-1 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen relative p-6 justify-between">
      <div className="flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between w-full pt-6 gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-1 flex-shrink-0">
              <GamepadIcon />
            </div>
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                    setTitleInput(activeGame.title);
                  }
                }}
                className="font-extrabold text-lg text-[#1A1A2E] bg-transparent border-b border-[#4B45D4] focus:outline-none w-full max-w-[180px]"
                autoFocus
                maxLength={40}
              />
            ) : (
              <h1
                onClick={() => {
                  setTitleInput(activeGame.title);
                  setIsEditingTitle(true);
                }}
                className="font-extrabold text-lg text-[#1A1A2E] cursor-pointer break-words line-clamp-2 max-w-[180px]"
                title="Click to edit game title"
              >
                {activeGame.title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeGame.players.length < 10 && (
              <button
                onClick={() => setIsAddPlayerOpen(true)}
                className="p-2 hover:bg-white/50 active:scale-95 rounded-full cursor-pointer transition-transform"
                aria-label="Add player in game"
              >
                <PersonPlusIcon />
              </button>
            )}
            <button
              onClick={handleEndGameClick}
              className="p-2 hover:bg-white/50 active:scale-95 rounded-full cursor-pointer transition-transform"
              aria-label="End Game"
            >
              <CheckIcon />
            </button>
          </div>
        </div>

        {/* Stopwatch Banner */}
        <div className="w-full bg-[#4B45D4] text-white py-3 px-6 rounded-full flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-[#22DD66] ${activeGame.isRunning ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">
              LIVE SESSION
            </span>
          </div>
          <span className="font-mono font-bold text-lg select-none">
            {formatTime(activeGame.elapsedSeconds)}
          </span>
          <button
            onClick={() => onToggleStopwatch(!activeGame.isRunning)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all cursor-pointer"
            aria-label={activeGame.isRunning ? "Pause stopwatch" : "Play stopwatch"}
          >
            {activeGame.isRunning ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Player Cards Scrollable List */}
        <div 
          style={{ paddingBottom: selectedCount > 0 ? '80px' : '0px' }}
          className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-1 transition-all"
        >
          {activeGame.players.length === 0 ? (
            <div className="text-center py-12 text-[#9999AA] text-sm font-semibold">
              No players in game.
            </div>
          ) : (
            activeGame.players.map((player, index) => {
              const isLeader = player.id === leaderId;
              const isSelected = player.isSelected;

              // Border outline color styling
              const borderStyle = isSelected
                ? { borderColor: '#D4156B' }
                : isLeader
                ? { borderColor: player.color }
                : { borderColor: 'transparent' };

              return (
                <div
                  key={player.id}
                  style={borderStyle}
                  className="bg-white p-4 rounded-[20px] shadow-sm flex flex-col gap-3 border-2 relative transition-all"
                >
                  {/* Selection circle / status badge */}
                  <div className="absolute top-4 right-4 z-10">
                    {isSelected ? (
                      <button
                        onClick={() => onTogglePlayerSelection(player.id)}
                        className="bg-[#D4156B] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer shadow-sm"
                        aria-label={`Deselect ${player.name}`}
                      >
                        SELECTED
                      </button>
                    ) : (
                      <button
                        onClick={() => onTogglePlayerSelection(player.id)}
                        className="w-5 h-5 rounded-full border-2 border-[#9999AA]/60 bg-white cursor-pointer hover:border-[#4B45D4] transition-colors"
                        aria-label={`Select ${player.name} for bulk action`}
                      />
                    )}
                  </div>

                  {/* Top: Role Label & Player Name */}
                  <div className="flex flex-col gap-0.5">
                    {isLeader ? (
                      <div
                        style={{ color: player.color }}
                        className="text-xs font-black uppercase tracking-wider"
                      >
                        LEADER
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-[#9999AA] uppercase tracking-wider">
                        PLAYER {index + 1}
                      </div>
                    )}
                    <h3 className="text-xl font-extrabold text-[#1A1A2E] break-words pr-20">
                      {player.name}
                    </h3>
                  </div>

                  {/* Bottom: Score controls */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Decrement (-) Button */}
                    <button
                      onClick={() => onUpdateScore(player.id, -1)}
                      className="w-12 h-12 rounded-full bg-[#EEEEF8] flex items-center justify-center text-[#1A1A2E] hover:bg-[#E2E2F0] active:scale-90 transition-all cursor-pointer select-none"
                      aria-label={`Decrease score for ${player.name}`}
                    >
                      <span className="text-2xl font-bold">−</span>
                    </button>

                    {/* Score (Large text) */}
                    {/* Option A: Score text in player accent color (Strict guidelines compatibility) */}
                    <span
                      aria-live="polite"
                      style={{ color: player.color }}
                      className="text-5xl font-black tracking-tight select-none min-w-[80px] text-center"
                    >
                      {player.score}
                    </span>

                    {/* Option B: Alternative (black for leader, grey for others)
                    <span
                      aria-live="polite"
                      className={`text-5xl font-black tracking-tight select-none min-w-[80px] text-center ${
                        isLeader ? 'text-[#1A1A2E]' : 'text-[#9999AA]'
                      }`}
                    >
                      {player.score}
                    </span>
                    */}

                    {/* Increment (+) Button */}
                    <button
                      onClick={() => onUpdateScore(player.id, 1)}
                      style={{ backgroundColor: player.color }}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90 active:scale-90 transition-all cursor-pointer select-none shadow-sm shadow-[#4B45D4]/10"
                      aria-label={`Increase score for ${player.name}`}
                    >
                      <span className="text-2xl font-bold">+</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bulk Action Bar Placeholder (For future Milestone 4 integration) */}
      {selectedCount > 0 && (
        <div className="absolute bottom-6 left-6 right-6 bg-[#1A1A2E] text-white p-4 rounded-3xl flex items-center justify-between shadow-lg animate-fade-in z-20">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-wider text-[#9999AA]">
              {selectedCount} PLAYER(S)
            </span>
            <span className="text-[10px] font-bold text-white/70">
              SELECTED FOR BULK
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onBulkUpdateScores(-1)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
              aria-label="Bulk decrease score"
            >
              <span className="text-xl font-bold">−</span>
            </button>
            <button
              onClick={() => onBulkUpdateScores(1)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A1A2E] hover:bg-white/95 active:scale-90 transition-all cursor-pointer"
              aria-label="Bulk increase score"
            >
              <span className="text-xl font-bold">+</span>
            </button>
          </div>
        </div>
      )}

      {/* PlayerDialog for adding players dynamically */}
      {isAddPlayerOpen && (
        <PlayerDialog
          isOpen={isAddPlayerOpen}
          onClose={() => setIsAddPlayerOpen(false)}
          onSave={(name, color) => {
            onAddPlayerInGame(name, color);
          }}
          title="Add Player"
          initialName=""
          initialColor={getFirstAvailableColor()}
          usedColors={activeGame.players.map((p) => p.color)}
        />
      )}
    </div>
  );
}
```

### Proposed Changes to `app/page.tsx`
1. **Import the new component**:
   ```typescript
   import { InGameScreen } from '@/components/InGameScreen';
   ```
2. **Map case `'ingame'` in the router render block**:
   ```tsx
   case 'ingame':
     if (!activeGame) return null;
     return (
       <InGameScreen
         activeGame={activeGame}
         onUpdateGameTitle={updateGameTitle}
         onAddPlayerInGame={addPlayerInGame}
         onUpdateScore={updateScore}
         onTogglePlayerSelection={togglePlayerSelection}
         onBulkUpdateScores={bulkUpdateScores}
         onToggleStopwatch={toggleStopwatch}
         onEndGame={endGame}
       />
     );
   ```

---

## 5. Verification Method
1. **TypeScript Type Safety**: Compile and test the app using `npm run build` after creating the files.
2. **ESLint Validation**: Verify compliance with styling rules via `npm run lint`.
3. **Behavior Verification**: Run Playwright E2E integration tests:
   ```bash
   npx playwright test
   ```
4. **Invalidation Conditions**: The logic should be rejected if:
   - Dynamic leader calculation does not resolve ties by order index (first leader retains badge unless strictly overtaken).
   - In-game player addition ignores color uniqueness or maximum player count (10).
   - The score display size scales down below `48px`.
