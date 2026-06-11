// tests/verify-all.js
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

// Mock React dependency
const mockReact = {
  useState: null,
  useEffect: (fn, deps) => {},
  useCallback: (fn, deps) => fn,
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
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  clear() { this.store = {}; }
};

// Import compiled hook
const { useGameState, PALETTE } = require('./compiled/hooks/useGameState');

console.log('--- SCOREBOARD ALL-UP CHALLENGE SUITE ---');

function runStressTests() {
  let stateCursor = 0;
  const states = [];
  const stateUpdaters = [];

  // Mock useState to record history and capture updates
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

  // Re-run helper to simulate react render cycle and flush state queue
  const renderHook = () => {
    stateCursor = 0;
    const actions = useGameState();
    // Flush updates
    while (stateUpdaters.length > 0) {
      const { cursor, updater } = stateUpdaters.shift();
      states[cursor] = updater(states[cursor]);
    }
    // Re-run once more to get fresh values with updated state
    stateCursor = 0;
    return useGameState();
  };

  let hook = renderHook();

  // Test 1: Add 10 players sequentially
  console.log('\nTest 1: Adding 10 players sequentially...');
  for (let i = 0; i < 10; i++) {
    const name = `Player ${i + 1}`;
    const color = PALETTE[i];
    const success = hook.addSetupPlayer(name, color);
    assert.strictEqual(success, true, `Should successfully add player ${i + 1}`);
    hook = renderHook(); // Update hook state
  }
  assert.strictEqual(hook.setupPlayers.length, 10, 'Should have exactly 10 players in list');
  console.log('✅ PASS: Added 10 players with unique colors successfully.');

  // Test 2: Try to add an 11th player
  console.log('\nTest 2: Adding an 11th player (exceed limit)...');
  const success11 = hook.addSetupPlayer('Player 11', PALETTE[10]);
  assert.strictEqual(success11, false, 'Should fail to add 11th player');
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers.length, 10, 'Player count should remain 10');
  console.log('✅ PASS: Correctly blocked adding an 11th player.');

  // Test 3: Delete player at index 4 (5th player) and check length
  console.log('\nTest 3: Deleting a player...');
  const targetId = hook.setupPlayers[4].id;
  const targetName = hook.setupPlayers[4].name;
  const targetColor = hook.setupPlayers[4].color;
  hook.deleteSetupPlayer(targetId);
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers.length, 9, 'Should have 9 players after deletion');
  assert.ok(!hook.setupPlayers.some(p => p.id === targetId), 'Player should be deleted');
  console.log(`✅ PASS: Successfully deleted player "${targetName}" with color "${targetColor}".`);

  // Test 4: Add 10th player back using one of the remaining palette colors (11th color)
  console.log('\nTest 4: Adding 10th player back using an available palette color...');
  const newColor = PALETTE[10]; // 11th color
  const successAddBack = hook.addSetupPlayer('Replacement Player', newColor);
  assert.strictEqual(successAddBack, true, 'Should successfully add player with 11th color');
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers.length, 10, 'Should be back to 10 players');
  console.log('✅ PASS: Successfully added 10th player using expanded palette color.');

  // Test 5: Verify duplicate color validation is synchronous and fails duplicate addition
  console.log('\nTest 5: Duplicate color validation...');
  // Delete player to make space
  hook.deleteSetupPlayer(hook.setupPlayers[9].id); // Delete the replacement player
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers.length, 9);
  
  // Try to add player with already used color (e.g. PALETTE[0])
  const duplicateSuccess = hook.addSetupPlayer('Duplicate Color Guy', PALETTE[0]);
  assert.strictEqual(duplicateSuccess, false, 'Should return false for duplicate color');
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers.length, 9, 'Player count should remain 9');
  console.log('✅ PASS: Duplicate color addition correctly blocked.');

  // Test 6: Edit a player's name without changing their color
  console.log('\nTest 6: Editing a player\'s name without changing color...');
  const editId = hook.setupPlayers[0].id;
  const originalColor = hook.setupPlayers[0].color;
  const editSuccess = hook.updateSetupPlayer(editId, 'Alice Cooper', originalColor);
  assert.strictEqual(editSuccess, true, 'Should allow editing name without changing color');
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers[0].name, 'Alice Cooper', 'Name should be updated');
  assert.strictEqual(hook.setupPlayers[0].color, originalColor, 'Color should remain the same');
  console.log('✅ PASS: Successfully edited name while keeping the same color.');

  // Test 7: Edit a player's color to another player's color (should fail)
  console.log('\nTest 7: Editing player\'s color to an in-use color...');
  const otherPlayerColor = hook.setupPlayers[1].color;
  const editFailSuccess = hook.updateSetupPlayer(editId, 'Alice Cooper', otherPlayerColor);
  assert.strictEqual(editFailSuccess, false, 'Should block updating color to an in-use color');
  hook = renderHook();
  assert.notStrictEqual(hook.setupPlayers[0].color, otherPlayerColor, 'Color should not have changed');
  console.log('✅ PASS: Correctly blocked editing color to an in-use color.');

  // Test 8: Edit a player's color to an unused color (e.g., 12th color)
  console.log('\nTest 8: Editing player\'s color to an unused palette color...');
  const unusedColor = PALETTE[11]; // 12th color
  const editSuccessNewColor = hook.updateSetupPlayer(editId, 'Alice Cooper', unusedColor);
  assert.strictEqual(editSuccessNewColor, true, 'Should allow editing color to an unused color');
  hook = renderHook();
  assert.strictEqual(hook.setupPlayers[0].color, unusedColor, 'Color should be updated to unused color');
  console.log('✅ PASS: Successfully changed player color to an unused palette color.');
}

try {
  runStressTests();
} catch (e) {
  console.error('FAIL:', e);
  process.exit(1);
}
