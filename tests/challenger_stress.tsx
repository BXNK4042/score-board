// tests/challenger_stress.tsx
import Module from 'module';
import path from 'path';
import assert from 'assert';

// Define our mutable state mockup for React hooks
interface MockStateStore {
  states: any[];
  stateSetters: ((val: any) => void)[];
  stateCursor: number;
}

const mockStore: MockStateStore = {
  states: [],
  stateSetters: [],
  stateCursor: 0
};

// Reset helpers
function resetMockStore() {
  mockStore.states = [];
  mockStore.stateSetters = [];
  mockStore.stateCursor = 0;
}

// Monkey-patch require to intercept react and resolve aliases
const ModuleProto = Module.prototype as any;
const originalRequire = ModuleProto.require;
ModuleProto.require = function (id: string) {
  if (id === 'react') {
    const realReact = originalRequire.call(this, 'react');
    
    // Mutate realReact in place to override hooks
    realReact.useState = (initialValue: any) => {
      const cursor = mockStore.stateCursor++;
      if (mockStore.states[cursor] === undefined) {
        mockStore.states[cursor] = initialValue;
      }
      
      const setter = (newVal: any) => {
        if (typeof newVal === 'function') {
          mockStore.states[cursor] = newVal(mockStore.states[cursor]);
        } else {
          mockStore.states[cursor] = newVal;
        }
      };
      mockStore.stateSetters[cursor] = setter;
      return [mockStore.states[cursor], setter];
    };
    realReact.useEffect = () => {};
    realReact.useCallback = (fn: any) => fn;

    return realReact;
  }
  if (id === 'react/jsx-runtime') {
    return {
      jsx: (type: any, props: any) => ({ type, props }),
      jsxs: (type: any, props: any) => ({ type, props }),
      Fragment: 'Fragment'
    };
  }
  if (id.startsWith('@/')) {
    const resolvedPath = path.resolve(__dirname, '..', id.slice(2));
    return originalRequire.call(this, resolvedPath);
  }
  return originalRequire.apply(this, arguments);
};

// Import code after monkey patch
import { useGameState, PALETTE } from '../hooks/useGameState';
import { PlayerDialog } from '../components/PlayerDialog';
import { SetupScreen } from '../components/SetupScreen';

console.log('=== CHALLENGER 2 ADVANCED STRESS TESTS ===');

// HELPER: Traversal helper to find form elements by type
function findElementsByType(element: any, type: string): any[] {
  const results: any[] = [];
  function traverse(el: any) {
    if (!el || typeof el !== 'object') return;
    if (el.type === type) {
      results.push(el);
    }
    if (el.props && el.props.children) {
      if (Array.isArray(el.props.children)) {
        el.props.children.forEach(traverse);
      } else {
        traverse(el.props.children);
      }
    }
  }
  traverse(element);
  return results;
}

// -------------------------------------------------------------
// CHALLENGE 1: Editing a player's name without changing their color
// -------------------------------------------------------------
function testEditPlayerWithoutChangingColor() {
  console.log('\n--- Challenge 1: Edit Player Name without changing color ---');
  resetMockStore();

  let onSaveCalled = false;
  let savedName = '';
  let savedColor = '';

  const props = {
    isOpen: true,
    onClose: () => {},
    onSave: (name: string, color: string) => {
      onSaveCalled = true;
      savedName = name;
      savedColor = color;
    },
    title: 'Edit Player',
    initialName: 'Alice',
    initialColor: '#4B45D4',
    usedColors: ['#4B45D4', '#22DD66']
  };

  // 1. Render dialog first time to populate hook structure
  PlayerDialog(props);

  // Change name only in state
  // states mapping in PlayerDialog: [0] name, [1] color, [2] error
  mockStore.stateSetters[0]('Alice Edited'); 
  
  // 2. Re-render to capture updated state in closure
  mockStore.stateCursor = 0;
  const vdom2 = PlayerDialog(props);

  // Extract onSubmit from the updated render
  const forms = findElementsByType(vdom2, 'form');
  assert.strictEqual(forms.length, 1, 'Should render exactly one form');
  const onSubmit = forms[0].props.onSubmit;

  // Submit form
  onSubmit({ preventDefault: () => {} });

  console.log('onSaveCalled:', onSaveCalled);
  console.log('savedName:', savedName);
  console.log('savedColor:', savedColor);
  console.log('error state:', mockStore.states[2] || 'NONE');

  assert.ok(onSaveCalled, 'onSave should be called');
  assert.strictEqual(savedName, 'Alice Edited', 'Name should be updated');
  assert.strictEqual(savedColor, '#4B45D4', 'Color should remain the same');
  assert.strictEqual(mockStore.states[2], '', 'Error should be empty');
  
  console.log('✅ Challenge 1 Passed: Successfully edited player name without changing color.');
}

// -------------------------------------------------------------
// CHALLENGE 2: Adding 9th and 10th players using expanded palette
// -------------------------------------------------------------
function testAdd9thAnd10thPlayers() {
  console.log('\n--- Challenge 2: Adding 9th and 10th players with 12-color palette ---');
  resetMockStore();

  // Check palette size
  console.log('PALETTE size:', PALETTE.length);
  assert.strictEqual(PALETTE.length, 12, 'Palette must have 12 colors');

  mockStore.stateCursor = 0;
  const hook = useGameState();

  // Add players 1 to 8
  for (let i = 1; i <= 8; i++) {
    const added = hook.addSetupPlayer(`Player ${i}`, PALETTE[i - 1]);
    assert.ok(added, `Player ${i} should be added successfully`);
  }

  // Refresh hook with updated state (states[3] is setupPlayers)
  mockStore.stateCursor = 0;
  let hook2 = useGameState();
  assert.strictEqual(mockStore.states[3].length, 8, 'Should have exactly 8 players in state');

  // Verify colors used so far
  const used = mockStore.states[3].map((p: any) => p.color);
  console.log('Used colors:', used);

  // Add 9th player
  const added9 = hook2.addSetupPlayer('Player 9', PALETTE[8]); // 9th color
  assert.ok(added9, 'Player 9 should be added successfully');

  mockStore.stateCursor = 0;
  let hook3 = useGameState();
  assert.strictEqual(mockStore.states[3].length, 9, 'Should have exactly 9 players in state');

  // Add 10th player
  const added10 = hook3.addSetupPlayer('Player 10', PALETTE[9]); // 10th color
  assert.ok(added10, 'Player 10 should be added successfully');

  mockStore.stateCursor = 0;
  let hook4 = useGameState();
  assert.strictEqual(mockStore.states[3].length, 10, 'Should have exactly 10 players in state');

  // Try to add 11th player (should fail limit check)
  const added11 = hook4.addSetupPlayer('Player 11', PALETTE[10]);
  assert.strictEqual(added11, false, 'Adding 11th player must fail player limit check');

  // Try to add a player with duplicate color
  const addedDuplicateColor = hook4.addSetupPlayer('Player Duplicate Color', PALETTE[0]);
  assert.strictEqual(addedDuplicateColor, false, 'Adding player with duplicate color must fail validation');

  console.log('✅ Challenge 2 Passed: 9th & 10th players successfully added, 11th player & duplicate color correctly rejected.');
}

// -------------------------------------------------------------
// CHALLENGE 3: Synchronous validation hook responses
// -------------------------------------------------------------
function testSynchronousValidationHookResponses() {
  console.log('\n--- Challenge 3: Synchronous validation hook responses ---');
  resetMockStore();

  mockStore.stateCursor = 0;
  let hook = useGameState();

  // Test 3.1: Duplicate color addition return value is synchronously false
  const r1 = hook.addSetupPlayer('Bob', PALETTE[0]);
  assert.strictEqual(r1, true, 'First add should succeed');

  // Re-run hook to update closure state
  mockStore.stateCursor = 0;
  hook = useGameState();

  // Adding same color again must return false synchronously
  const r2 = hook.addSetupPlayer('Charlie', PALETTE[0]);
  assert.strictEqual(r2, false, 'Second add with same color must fail synchronously');

  // Test 3.2: updateSetupPlayer returns true for valid edit, false for invalid
  // First, add a second player with a different color
  const r3 = hook.addSetupPlayer('Charlie', PALETTE[1]);
  assert.strictEqual(r3, true, 'Third add should succeed with unique color');

  // Re-run hook to get latest state
  mockStore.stateCursor = 0;
  hook = useGameState();
  const players = mockStore.states[3];
  assert.strictEqual(players.length, 2, 'Should have 2 players');

  const p1 = players[0];
  const p2 = players[1];

  // Update p1 with a new name but keep their same color -> expect true
  const u1 = hook.updateSetupPlayer(p1.id, 'Bob Edited', p1.color);
  assert.strictEqual(u1, true, 'Should return true when keeping same color');

  // Update p1 with a color already used by p2 -> expect false
  const u2 = hook.updateSetupPlayer(p1.id, 'Bob Edited', p2.color);
  assert.strictEqual(u2, false, 'Should return false when attempting to duplicate another player\'s color');

  console.log('✅ Challenge 3 Passed: Hooks return correct validation booleans synchronously.');
}

// -------------------------------------------------------------
// CHALLENGE 4: Label-input accessibility connections
// -------------------------------------------------------------
function testLabelInputAccessibility() {
  console.log('\n--- Challenge 4: Label-input accessibility connections ---');
  resetMockStore();

  // 4.1 Check SetupScreen
  const setupScreenProps = {
    setupTitle: '',
    setupPlayers: [],
    onUpdateTitle: () => {},
    onAddPlayer: () => true,
    onUpdatePlayer: () => true,
    onDeletePlayer: () => {},
    onStartGame: () => {},
    onCancel: () => {},
  };

  const setupVdom = SetupScreen(setupScreenProps);
  const setupLabels = findElementsByType(setupVdom, 'label');
  const setupInputs = findElementsByType(setupVdom, 'input');

  console.log('SetupScreen Labels found:', setupLabels.length);
  console.log('SetupScreen Inputs found:', setupInputs.length);

  assert.ok(setupLabels.length >= 1, 'SetupScreen should have at least one label');
  assert.ok(setupInputs.length >= 1, 'SetupScreen should have at least one input');

  // Find game title label and input
  const titleLabel = setupLabels.find(l => l.props.htmlFor === 'game-title-input');
  const titleInput = setupInputs.find(i => i.props.id === 'game-title-input');

  assert.ok(titleLabel, 'Label with htmlFor="game-title-input" should exist');
  assert.ok(titleInput, 'Input with id="game-title-input" should exist');
  assert.strictEqual(titleLabel.props.htmlFor, titleInput.props.id, 'Label htmlFor must match input id');

  // 4.2 Check PlayerDialog
  const playerDialogProps = {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    title: 'Add Player',
    initialName: '',
    initialColor: '#4B45D4',
    usedColors: []
  };

  const dialogVdom = PlayerDialog(playerDialogProps);
  const dialogLabels = findElementsByType(dialogVdom, 'label');
  const dialogInputs = findElementsByType(dialogVdom, 'input');

  console.log('PlayerDialog Labels found:', dialogLabels.length);
  console.log('PlayerDialog Inputs found:', dialogInputs.length);

  assert.ok(dialogLabels.length >= 1, 'PlayerDialog should have at least one label');
  assert.ok(dialogInputs.length >= 1, 'PlayerDialog should have at least one input');

  const nameLabel = dialogLabels.find(l => l.props.htmlFor === 'player-name-input');
  const nameInput = dialogInputs.find(i => i.props.id === 'player-name-input');

  assert.ok(nameLabel, 'Label with htmlFor="player-name-input" should exist');
  assert.ok(nameInput, 'Input with id="player-name-input" should exist');
  assert.strictEqual(nameLabel.props.htmlFor, nameInput.props.id, 'Label htmlFor must match input id');

  console.log('✅ Challenge 4 Passed: Label-input HTML accessibility connections are correct.');
}

// Run all test challenges
try {
  testEditPlayerWithoutChangingColor();
  testAdd9thAnd10thPlayers();
  testSynchronousValidationHookResponses();
  testLabelInputAccessibility();
  console.log('\n🎉 ALL ADVANCED STRESS TESTS PASSED SUCCESSFULLY!');
} catch (error) {
  console.error('\n❌ STRESS TEST FAILED:', error);
  process.exit(1);
}
