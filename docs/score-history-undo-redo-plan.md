# Score History Feature with Undo/Redo - Implementation Plan

## Overview

Add a comprehensive score history page that tracks all score changes in a game, complete with undo/redo functionality. Users will access this screen by tapping the "Latest Ball" stats card in the in-game screen.

## Table of Contents

- [Analysis Summary](#analysis-summary)
- [Implementation Phases](#implementation-phases)
- [Detailed Component Structure](#detailed-component-structure)
- [File Changes Required](#file-changes-required)
- [Implementation Order](#implementation-order)
- [Anticipated Challenges](#anticipated-challenges)
- [Success Criteria](#success-criteria)
- [Testing Strategy](#testing-strategy)
- [Key Design Decisions](#key-design-decisions)

---

## Analysis Summary

### Current State

**Architecture:**
- Single-screen app with 3 screens: `home | setup | ingame`
- State managed via `useGameState` hook with localStorage persistence
- Score updates flow: `PlayerCard` → `InGameScreen` → `useGameState`
- "Latest Ball" shown in stats card (lines 347-397 in InGameScreen.tsx)
- No current history tracking or undo/redo functionality

**Tech Stack:**
- Next.js with TypeScript and React
- shadcn/ui components and Framer Motion animations
- Mobile-first design, single-column layouts
- Maximum 10 players per game

**Key Patterns:**
- Centralized state management via custom hook
- localStorage persistence for game state
- Framer Motion for smooth transitions
- Component composition with props drilling
- Event handlers flow up from components to state hook

---

## Implementation Phases

### Phase 1: Data Model & State Management

#### Task 1.1: Extend Game Interface with History Tracking

**File:** `/hooks/useGameState.ts`

**Changes:**
```typescript
// Add new interfaces
interface ScoreEvent {
  id: string;
  timestamp: number;
  playerId: string;
  playerName: string;
  playerColor: string;
  delta: number;
  previousScore: number;
  newScore: number;
  type: 'score' | 'foul';
  ballName: string;
}

interface GameSnapshot {
  timestamp: number;
  state: Game; // Deep copy of game state
  eventId: string; // Reference to score event
}

// Extend Game interface
interface Game {
  // ... existing fields
  scoreHistory: ScoreEvent[];
  undoStack: GameSnapshot[];
  redoStack: GameSnapshot[];
}
```

#### Task 1.2: Implement History Tracking Logic

**File:** `/hooks/useGameState.ts`

**New Functions:**
```typescript
const recordScoreEvent = (event: ScoreEvent) => {
  // Add event to scoreHistory
  // Create and save game snapshot
};

const saveGameStateSnapshot = (eventId: string) => {
  // Create deep copy of current game state
  // Push to undoStack
  // Clear redoStack
};
```

**Modified Functions:**
- `updateScore()` - Record event, save snapshot before change
- `bulkUpdateScores()` - Record each player change, save snapshot

**Dependencies:** None (foundational work)

---

### Phase 2: Screen Navigation Enhancement

#### Task 2.1: Add History Screen State

**File:** `/hooks/useGameState.ts`

**Changes:**
```typescript
// Extend screen type
type Screen = 'home' | 'setup' | 'ingame' | 'history';

// Add navigation function
const goToHistory = () => {
  setScreen('history');
};
```

#### Task 2.2: Make Stats Card Clickable

**File:** `/components/InGameScreen.tsx` (lines 347-397)

**Changes:**
- Add `onClick` handler to navigate to history screen
- Add visual affordance (hover state, cursor pointer)
- Add accessibility (aria-label, role="button")
- Show chevron/arrow icon to indicate navigation

**Dependencies:** Task 1.1, Task 1.2

---

### Phase 3: History Screen Component

#### Task 3.1: Create HistoryScreen Component

**File:** `/components/HistoryScreen.tsx` (NEW)

**Component Structure:**
```typescript
interface HistoryScreenProps {
  activeGame: Game;
  onBackToGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

**Layout:**
- Header with back button and title "Score History"
- Timeline list of score events (reverse chronological)
- Fixed bottom action bar with Undo/Redo buttons
- Empty state when no history

#### Task 3.2: Design Timeline Events

**Event Item Component:**
```tsx
<HistoryEventItem
  playerName={event.playerName}
  playerColor={event.playerColor}
  delta={event.delta}
  ballName={event.ballName}
  type={event.type}
  timestamp={event.timestamp}
  newScore={event.newScore}
/>
```

**Visual Design:**
- Show player color badge with initial
- Display ball visual using `getBallStyle()` function
- Show timestamp in readable format (e.g., "2:30 ago")
- Show score delta with color coding (+ in green, - in red)
- Display new score prominently

#### Task 3.3: Add Undo/Redo Controls

**Bottom Action Bar:**
```tsx
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
  <div className="flex gap-3 max-w-[390px] mx-auto">
    <Button 
      onClick={onUndo} 
      disabled={!canUndo}
      className="flex-1"
    >
      <RotateCcw /> Undo
    </Button>
    <Button 
      onClick={onRedo} 
      disabled={!canRedo}
      className="flex-1"
    >
      <Redo2 /> Redo
    </Button>
  </div>
</div>
```

**Dependencies:** Task 2.1, Task 2.2

---

### Phase 4: Undo/Redo Implementation

#### Task 4.1: Implement Game Snapshot System

**File:** `/hooks/useGameState.ts`

**New Functions:**
```typescript
const createGameSnapshot = (): GameSnapshot => {
  return {
    timestamp: Date.now(),
    state: structuredClone(currentGame), // Deep copy
    eventId: lastEventId,
  };
};

const MAX_STACK_SIZE = 50; // Limit to prevent memory issues
```

**Stack Management:**
- Limit stack size to 50 snapshots
- Push to undoStack before each action
- Clear redoStack when new action occurs
- Use structuredClone for deep copying

#### Task 4.2: Implement Undo Logic

**File:** `/hooks/useGameState.ts`

```typescript
const undoLastAction = () => {
  if (undoStack.length === 0) return;
  
  const snapshot = undoStack.pop();
  if (snapshot) {
    // Push current state to redoStack
    redoStack.push(createGameSnapshot());
    
    // Restore previous state
    setCurrentGame(snapshot.state);
    
    // Remove last event from history
    setScoreHistory(prev => prev.slice(0, -1));
  }
};
```

#### Task 4.3: Implement Redo Logic

**File:** `/hooks/useGameState.ts`

```typescript
const redoLastAction = () => {
  if (redoStack.length === 0) return;
  
  const snapshot = redoStack.pop();
  if (snapshot) {
    // Push current state to undoStack
    undoStack.push(createGameSnapshot());
    
    // Restore redone state
    setCurrentGame(snapshot.state);
    
    // Add event back to history
    setScoreHistory(prev => [...prev, snapshot.event]);
  }
};
```

**Dependencies:** Task 3.3

---

### Phase 5: Main Page Integration

#### Task 5.1: Update Main Page Routing

**File:** `/app/page.tsx`

**Changes:**
```typescript
// Add history case to screen switch
{screen === 'history' && (
  <HistoryScreen
    activeGame={activeGame}
    onBackToGame={() => setScreen('ingame')}
    onUndo={undoLastAction}
    onRedo={redoLastAction}
    canUndo={canUndo}
    canRedo={canRedo}
  />
)}
```

#### Task 5.2: Connect Navigation Functions

**File:** `/app/page.tsx`

**Changes:**
- Wire `goToHistory()` from useGameState hook
- Add back button in HistoryScreen to return to game
- Ensure smooth screen transitions with AnimatePresence

**Dependencies:** Task 4.1, Task 4.2, Task 4.3

---

### Phase 6: Visual Polish & Animations

#### Task 6.1: Add History-Specific Animations

**File:** `/lib/animations.ts`

**New Variants:**
```typescript
export const timelineItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const undoButtonVariants = {
  idle: { scale: 1 },
  press: { scale: 0.95 },
  disabled: { opacity: 0.5 }
};
```

#### Task 6.2: Responsive Design

**Mobile Optimization:**
- Single-column timeline layout
- Touch-friendly buttons (min 44px height)
- Sticky header for long timelines
- Smooth scrolling with momentum
- Use existing `no-scrollbar` utility

**Dependencies:** Task 5.1, Task 5.2

---

### Phase 7: Testing & Validation

#### Task 7.1: Create E2E Tests

**File:** `/tests/score-history.spec.ts` (NEW)

**Test Cases:**
```typescript
describe('Score History', () => {
  test('navigation to history screen');
  test('score events are tracked correctly');
  test('undo functionality');
  test('redo functionality');
  test('history persists across page reloads');
  test('undo/redo with multiple players');
  test('stack size limits');
});
```

#### Task 7.2: Manual Testing

**Test Scenarios:**
- Undo/redo doesn't break game state
- Test with maximum 10 players
- Test with rapid score changes
- Verify localStorage persistence
- Test undo/redo with bulk actions
- Test empty history state
- Test stack overflow scenarios

**Dependencies:** Task 6.1, Task 6.2

---

## Detailed Component Structure

### New Component: HistoryScreen.tsx

```typescript
interface HistoryScreenProps {
  activeGame: Game;
  onBackToGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function HistoryScreen({
  activeGame,
  onBackToGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: HistoryScreenProps) {
  // Render timeline, header, controls
}

// Sub-components
function HistoryEventItem({ event, player }: HistoryEventProps) {
  // Render individual event with ball visual
}

function EmptyHistoryState() {
  // Render empty state illustration
}

function UndoRedoBar({ canUndo, canRedo, onUndo, onRedo }) {
  // Render bottom action bar
}
```

### Enhanced useGameState Hook

**New State Variables:**
```typescript
const [scoreHistory, setScoreHistory] = useState<ScoreEvent[]>([]);
const [undoStack, setUndoStack] = useState<GameSnapshot[]>([]);
const [redoStack, setRedoStack] = useState<GameSnapshot[]>([]);
```

**New Functions:**
- `recordScoreEvent(event: ScoreEvent)` - Add event to history
- `createSnapshot(): GameSnapshot` - Create game state snapshot
- `undoLastAction()` - Undo last score change
- `redoLastAction()` - Redo previously undone action
- `goToHistory()` - Navigate to history screen
- `canUndo: boolean` - Computed property
- `canRedo: boolean` - Computed property

**Modified Functions:**
```typescript
const updateScore = (playerId: string, delta: number) => {
  // 1. Create snapshot of current state
  // 2. Record score event
  // 3. Update score
  // 4. Clear redo stack
};
```

---

## File Changes Required

### Critical Files for Implementation

#### 1. `/hooks/useGameState.ts`
**Purpose:** Core state management extension

**Changes:**
- Add `ScoreEvent`, `GameSnapshot` interfaces
- Extend `Game` interface with history fields
- Implement undo/redo logic
- Add history tracking to score updates
- Add navigation functions

**Lines Added:** ~150

#### 2. `/components/InGameScreen.tsx`
**Purpose:** Add navigation entry point

**Changes:**
- Make stats card clickable (lines 347-397)
- Add onClick handler for history navigation
- Add visual affordance (hover, pointer)
- Add accessibility attributes

**Lines Added:** ~15

#### 3. `/components/HistoryScreen.tsx` (NEW)
**Purpose:** Timeline view and undo/redo UI

**Components:**
- HistoryScreen main component
- HistoryEventItem sub-component
- EmptyHistoryState component
- UndoRedoBar component

**Lines Added:** ~250

#### 4. `/app/page.tsx`
**Purpose:** Screen routing integration

**Changes:**
- Add history case to screen switch
- Pass history-related props
- Handle screen transitions

**Lines Added:** ~20

#### 5. `/lib/animations.ts`
**Purpose:** Animation variants

**Changes:**
- Add timeline-specific variants
- Add undo/redo button feedback animations

**Lines Added:** ~30

---

## Implementation Order

### Sequential Dependencies

**Critical Path:**
1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 3.3 → 4.1 → 4.2 → 5.1 → 6.1 → 7.1

### Parallel Opportunities

- **Phase 3:** Tasks 3.1 and 3.2 can be done concurrently
- **Phase 4:** Tasks 4.2 and 4.3 can be done concurrently  
- **Phase 5:** Tasks 5.1 and 5.2 can be done concurrently
- **Phase 6:** Tasks 6.1 and 6.2 can be done concurrently

### Phase Timeline Estimate

- **Phase 1:** 2-3 hours (foundational work)
- **Phase 2:** 1-2 hours (navigation setup)
- **Phase 3:** 4-5 hours (UI component)
- **Phase 4:** 3-4 hours (undo/redo logic)
- **Phase 5:** 2-3 hours (integration)
- **Phase 6:** 2-3 hours (polish)
- **Phase 7:** 3-4 hours (testing)

**Total Estimated Time:** 17-24 hours

---

## Anticipated Challenges

### Challenge 1: State Complexity

**Risk:** Undo/redo requires deep state cloning and careful stack management

**Solution:**
- Use `structuredClone()` for deep copying
- Limit stack size to 50 snapshots
- Implement strict type checking
- Add comprehensive error handling

### Challenge 2: Performance with Long History

**Risk:** Many score events could slow down rendering

**Solution:**
- Implement virtualization for timeline list (>100 events)
- Limit stored events to last 100 for display
- Use React.memo for HistoryEventItem components
- Implement efficient state updates with functional setState

### Challenge 3: Race Conditions

**Risk:** Rapid clicks on undo/redo could cause state inconsistencies

**Solution:**
- Add debouncing/throttling (300ms)
- Disable buttons during state updates
- Use requestAnimationFrame for state updates
- Add loading states during undo/redo operations

### Challenge 4: Mobile Usability

**Risk:** Timeline might be hard to navigate on small screens

**Solution:**
- Use sticky headers for player names
- Clear visual hierarchy with color coding
- Touch-friendly buttons (min 44px height)
- Implement pull-to-refresh for latest events
- Add search/filter functionality if needed

### Challenge 5: Data Persistence

**Risk:** History data might not persist correctly across sessions

**Solution:**
- Ensure proper serialization in localStorage
- Handle migration gracefully if data structure changes
- Add validation when loading from storage
- Implement fallback to empty state on corruption
- Add version tracking for data structure

---

## Success Criteria

### Functional Requirements

- ✅ All score changes tracked with full metadata
- ✅ Undo/redo works correctly without breaking game state
- ✅ History persists across page reloads
- ✅ Navigation between game and history screens is smooth
- ✅ Undo/redo works with bulk actions
- ✅ Stack limits are enforced properly

### Design Requirements

- ✅ Mobile-first responsive design
- ✅ Consistent with existing design system
- ✅ Clear visual representation of score changes
- ✅ Smooth animations following existing patterns
- ✅ Accessible color contrast and typography
- ✅ Touch-friendly interface elements

### Performance Requirements

- ✅ No noticeable lag on score updates
- ✅ Timeline renders smoothly with 100+ events
- ✅ Undo/redo actions complete in < 100ms
- ✅ Memory usage stays within reasonable limits
- ✅ Smooth 60fps animations

### Accessibility Requirements

- ✅ Proper ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader announcements for score changes
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Focus management during undo/redo

---

## Testing Strategy

### Unit Testing

**File:** `/tests/unit/useGameState.test.ts`

**Test Cases:**
- `recordScoreEvent()` adds event to history
- `createSnapshot()` creates deep copy
- `undoLastAction()` restores previous state
- `redoLastAction()` redoes undone action
- Stack size limits are enforced
- State updates are atomic

### Integration Testing

**File:** `/tests/integration/score-history.test.ts`

**Test Cases:**
- Full flow: score update → history → undo → game state
- localStorage persistence across sessions
- Multiple players with concurrent actions
- Bulk actions with undo/redo
- Screen navigation and transitions

### E2E Testing

**File:** `/tests/e2e/score-history.spec.ts`

**User Journeys:**
1. Play game → check history → undo → verify score
2. Multiple score updates → full timeline → undo all
3. Undo → redo → verify final state
4. Long timeline → scroll performance
5. Bulk action → individual history events

**Edge Cases:**
- Empty history state
- Max stack size scenarios
- Rapid click scenarios
- Corrupted localStorage
- Navigation during undo/redo

### Manual Testing Checklist

- [ ] Undo/redo doesn't break game state
- [ ] Test with maximum 10 players
- [ ] Test with rapid score changes
- [ ] Verify localStorage persistence
- [ ] Test undo/redo with bulk actions
- [ ] Test empty history state
- [ ] Test stack overflow scenarios
- [ ] Test on mobile devices
- [ ] Test with screen reader
- [ ] Test keyboard navigation

---

## Key Design Decisions

### Why Separate History Screen?

**Decision:** Create dedicated history screen instead of inline history

**Rationale:**
- Keeps game interface clean and focused
- Allows for detailed timeline view without clutter
- Follows existing single-screen pattern
- Easier to implement undo/redo UI
- Better for mobile user experience

### Why Stack-Based Undo/Redo?

**Decision:** Implement classic undo/redo stack pattern

**Rationale:**
- Familiar mental model for users
- Efficient for linear action sequences
- Easy to implement with current state structure
- Allows for multiple undo/redo steps
- Industry-standard approach

### Why Record All Score Events?

**Decision:** Maintain complete audit trail of game progression

**Rationale:**
- Enables rich timeline visualization
- Supports future features (statistics, replays)
- Complete debugging capability
- Minimal storage overhead
- User transparency in game progress

### Why Limit Stack Size?

**Decision:** Cap undo/redo stack at 50 snapshots

**Rationale:**
- Prevents memory issues
- Maintains performance
- Most users only need recent history
- Permanent history log remains complete
- Prevents localStorage quota issues

### Why Use structuredClone?

**Decision:** Use modern deep cloning API over JSON serialization

**Rationale:**
- Handles complex objects correctly
- Preserves Date objects and special types
- More performant than manual cloning
- Future-proof solution
- Cleaner code than JSON.parse/stringify

---

## Next Steps

1. **Review and approve this plan** - Ensure alignment with project goals
2. **Set up development branch** - Create feature branch for implementation
3. **Begin Phase 1** - Start with data model extensions
4. **Iterative testing** - Test each phase before moving to next
5. **Documentation updates** - Update AGENTS.md with new patterns

---

## Appendix: Code Examples

### Example Score Event

```typescript
{
  id: "evt_1234567890",
  timestamp: 1634567890000,
  playerId: "player_abc123",
  playerName: "Alice",
  playerColor: "#FF5733",
  delta: 5,
  previousScore: 10,
  newScore: 15,
  type: "score",
  ballName: "Blue"
}
```

### Example Timeline Event JSX

```tsx
<div className="flex items-center gap-3 p-3 bg-white rounded-xl mb-2">
  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: playerColor }}>
    {playerName[0]}
  </div>
  <div className="flex-1">
    <div className="font-bold text-sm">{playerName}</div>
    <div className="text-xs text-gray-500">{getRelativeTime(timestamp)}</div>
  </div>
  <div className="text-right">
    <div className="text-green-500 font-bold">+{delta}</div>
    <div className="text-xs text-gray-600">{newScore}</div>
  </div>
</div>
```

---

*This plan is subject to adjustment based on implementation discoveries and user feedback.*