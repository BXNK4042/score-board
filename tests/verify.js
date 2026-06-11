// tests/verify.js
const assert = require('assert');
const Module = require('module');

// Override Node's module resolution to handle webpack/tsconfig path aliases
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const resolvedPath = request.replace('@/', '/home/bank/score-board/tests/compiled/');
    return originalResolve(resolvedPath, parent, isMain, options);
  }
  return originalResolve(request, parent, isMain, options);
};

// Mock react/jsx-runtime
const mockJsx = {
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
  Fragment: 'Fragment'
};
require.cache[require.resolve('react/jsx-runtime')] = {
  id: 'react/jsx-runtime',
  filename: 'react/jsx-runtime',
  loaded: true,
  exports: mockJsx
};

// 1. Mock React dependency
const mockReact = {
  useState: null,
  useEffect: (fn, deps) => {
    // Run effects immediately in test environment if needed
    if (mockReact.runEffects) {
      fn();
    }
  },
  useCallback: (fn, deps) => fn,
  runEffects: false,
};

// Mock the React module in Node module cache
require.cache[require.resolve('react')] = {
  id: 'react',
  filename: 'react',
  loaded: true,
  exports: mockReact
};

// Mock global window and localStorage
global.window = {};
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  clear() {
    this.store = {};
  }
};

// Import compiled hook and component
const { useGameState, PALETTE } = require('./compiled/hooks/useGameState');
const { PlayerDialog } = require('./compiled/components/PlayerDialog');

console.log('--- SCOREBOARD VERIFICATION SUITE ---');

// --- Test 1: PlayerDialog Bug (Duplicate Color Block when Editing) ---
function testPlayerDialogEditBug() {
  console.log('\nRunning Test 1: PlayerDialog Duplicate Color Block when Editing...');
  
  let stateCursor = 0;
  const states = [];
  const stateSetters = [];

  // Reset hooks mock for this component run
  mockReact.useState = (initial) => {
    const cursor = stateCursor++;
    if (states[cursor] === undefined) {
      states[cursor] = initial;
    }
    const setter = (newVal) => {
      states[cursor] = newVal;
    };
    stateSetters[cursor] = setter;
    return [states[cursor], setter];
  };

  let onSaveCalled = false;
  let savedData = null;
  let onCloseCalled = false;

  const props = {
    isOpen: true,
    onClose: () => { onCloseCalled = true; },
    onSave: (name, color) => {
      onSaveCalled = true;
      savedData = { name, color };
    },
    title: 'Edit Player',
    initialName: 'Alice',
    initialColor: '#4B45D4',
    usedColors: ['#4B45D4'] // Only Alice exists, using this color
  };

  // 1. Render the component once to populate hooks
  const vdom = PlayerDialog(props);

  // States are: [0] name, [1] color, [2] error
  assert.strictEqual(states[0], 'Alice');
  assert.strictEqual(states[1], '#4B45D4');
  assert.strictEqual(states[2], '');

  // 2. Find the form submit handler
  // PlayerDialog returns a div containing h3, form, etc.
  // Let's inspect the returned structure
  const formElement = vdom.props.children.props.children[1];
  assert.strictEqual(formElement.type, 'form');
  const onSubmit = formElement.props.onSubmit;

  // 3. Simulate editing the name to 'Alice Smith' but keeping the color '#4B45D4'
  stateSetters[0]('Alice Smith'); // setName('Alice Smith')
  // Render again to simulate React update
  stateCursor = 0;
  PlayerDialog(props);

  // 4. Trigger submit
  let preventDefaultCalled = false;
  const mockEvent = {
    preventDefault: () => { preventDefaultCalled = true; }
  };

  onSubmit(mockEvent);

  // Re-run to see final states
  stateCursor = 0;
  PlayerDialog(props);

  console.log('Resulting states:');
  console.log(`- Name: "${states[0]}"`);
  console.log(`- Color: "${states[1]}"`);
  console.log(`- Error state: "${states[2]}"`);
  console.log(`- onSave called: ${onSaveCalled}`);

  // Assertions
  if (states[2] === 'Color is already in use by another player' && !onSaveCalled) {
    console.log('❌ BUG CONFIRMED: PlayerDialog blocks saving edits if the player keeps their original color.');
  } else {
    console.log('✅ PASS: PlayerDialog saved successfully.');
  }
}

// --- Test 2: Hook addSetupPlayer Asynchronous Success Return Bug ---
function testHookAsyncReturnBug() {
  console.log('\nRunning Test 2: Hook addSetupPlayer Asynchronous Success Return Bug...');

  let stateCursor = 0;
  const states = [];
  const stateUpdaters = [];

  // Reset hooks mock
  mockReact.useState = (initial) => {
    const cursor = stateCursor++;
    if (states[cursor] === undefined) {
      states[cursor] = initial;
    }
    const setter = (newVal) => {
      if (typeof newVal === 'function') {
        stateUpdaters.push({ cursor, updater: newVal });
      } else {
        states[cursor] = newVal;
      }
    };
    return [states[cursor], setter];
  };

  // Instantiate the hook
  stateCursor = 0;
  const hookActions = useGameState();

  // Initially: setupPlayers is empty (state index 3 based on hook variable order)
  // Let's verify where setupPlayers is.
  // In useGameState: 
  // [screen, setScreen] = useState('home'); -> index 0
  // [activeGame, setActiveGame] = useState(null); -> index 1
  // [setupTitle, setSetupTitle] = useState(''); -> index 2
  // [setupPlayers, setSetupPlayers] = useState([]); -> index 3
  
  // 1. Try to add 1st player
  const color1 = PALETTE[0];
  const res1 = hookActions.addSetupPlayer('Bob', color1);
  console.log(`Adding 1st player ('Bob', '${color1}'). Return value:`, res1);
  assert.strictEqual(res1, true, 'Should return true on success');

  // Process the state updaters to actually update setupPlayers
  stateUpdaters.forEach(({ cursor, updater }) => {
    states[cursor] = updater(states[cursor]);
  });
  stateUpdaters.length = 0; // clear queue

  // Re-run hook to get updated actions
  stateCursor = 0;
  const hookActions2 = useGameState();
  assert.strictEqual(states[3].length, 1, 'One player should be in state now');
  assert.strictEqual(states[3][0].name, 'Bob');

  // 2. Try to add 2nd player with the DUPLICATE color
  const resDuplicate = hookActions2.addSetupPlayer('Charlie', color1);
  console.log(`Adding 2nd player ('Charlie', '${color1}') with duplicate color. Return value:`, resDuplicate);

  // Since React runs the updater asynchronously, the hook returns `success` (which is still true) before the updater runs.
  if (resDuplicate === true) {
    console.log('❌ BUG CONFIRMED: addSetupPlayer returned true for a duplicate color addition.');
  } else {
    console.log('✅ PASS: addSetupPlayer correctly returned false for duplicate color.');
  }

  // Let's run the queued updater to see if the state actually rejects the change
  const oldState = states[3];
  stateUpdaters.forEach(({ cursor, updater }) => {
    states[cursor] = updater(states[cursor]);
  });
  stateUpdaters.length = 0;

  console.log(`After updater runs, state players count: ${states[3].length} (Expected: 1, Old: ${oldState.length})`);
  assert.strictEqual(states[3].length, 1, 'Duplicate color addition should be rejected in state');
}

try {
  testPlayerDialogEditBug();
  testHookAsyncReturnBug();
} catch (e) {
  console.error('Test execution failed with error:', e);
}
