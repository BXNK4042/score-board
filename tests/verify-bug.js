const Module = require('module');
const path = require('path');

// 1. Mock React
const mockStates = {
  name: 'Alice',
  color: '#4B45D4',
  error: '',
  stateCalls: 0
};

const mockedReact = {
  useState(initialValue) {
    const callIndex = mockStates.stateCalls++;
    if (callIndex === 0) {
      // name state
      return [mockStates.name, (val) => { mockStates.name = val; }];
    } else if (callIndex === 1) {
      // color state
      return [mockStates.color, (val) => { mockStates.color = val; }];
    } else {
      // error state
      return [mockStates.error, (val) => { mockStates.error = val; }];
    }
  },
  useEffect() {},
  useCallback(fn) { return fn; }
};

// 2. Monkey-patch require to resolve imports
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'react') {
    return mockedReact;
  }
  if (id.startsWith('@/')) {
    const resolvedPath = path.resolve(__dirname, '..', id.slice(2));
    return originalRequire.call(this, resolvedPath);
  }
  return originalRequire.apply(this, arguments);
};

// Import PlayerDialog
const { PlayerDialog } = require('@/components/PlayerDialog');

// Traversal helper to locate the onSubmit handler
function findFormOnSubmit(element) {
  if (!element || typeof element !== 'object') return null;
  if (element.type === 'form' && element.props && element.props.onSubmit) {
    return element.props.onSubmit;
  }
  if (element.props && element.props.children) {
    if (Array.isArray(element.props.children)) {
      for (const child of element.props.children) {
        const found = findFormOnSubmit(child);
        if (found) return found;
      }
    } else {
      return findFormOnSubmit(element.props.children);
    }
  }
  return null;
}

// RUN TEST 1: Editing a player, name is changed but color remains the same (own color is in usedColors)
console.log('--- RUNNING TEST 1: Edit player, keep same color ---');
mockStates.name = 'Alice Edited';
mockStates.color = '#4B45D4'; // Same as initialColor
mockStates.error = '';
mockStates.stateCalls = 0;

let saveCalled = false;
let savedName = '';
let savedColor = '';
let closeCalled = false;

const props1 = {
  isOpen: true,
  onClose: () => { closeCalled = true; },
  onSave: (name, color) => {
    saveCalled = true;
    savedName = name;
    savedColor = color;
  },
  title: 'Edit Player',
  initialName: 'Alice',
  initialColor: '#4B45D4',
  usedColors: ['#4B45D4', '#22DD66'] // Includes Alice's color and Bob's color
};

// Render PlayerDialog element
const element1 = PlayerDialog(props1);

// Find and run form onSubmit
const onSubmit1 = findFormOnSubmit(element1);
if (!onSubmit1) {
  console.error('FAIL: Could not find form onSubmit handler');
  process.exit(1);
}

onSubmit1({ preventDefault: () => {} });

console.log('Result:');
console.log('  onSave called:', saveCalled);
console.log('  onClose called:', closeCalled);
console.log('  error state:', mockStates.error);

if (mockStates.error === 'Color is already in use by another player') {
  console.log('BUG CONFIRMED: PlayerDialog blocked saving because their own color is in usedColors.');
} else if (saveCalled && savedName === 'Alice Edited' && savedColor === '#4B45D4') {
  console.log('PASS: PlayerDialog successfully saved.');
} else {
  console.log('UNKNOWN STATE: Save not called, but no color error.');
}

// RUN TEST 2: Adding a new player with an unused color
console.log('\n--- RUNNING TEST 2: Add player with unused color ---');
mockStates.name = 'Charlie';
mockStates.color = '#FF9F0A'; // Orange (unused)
mockStates.error = '';
mockStates.stateCalls = 0;
saveCalled = false;
closeCalled = false;

const props2 = {
  isOpen: true,
  onClose: () => { closeCalled = true; },
  onSave: (name, color) => {
    saveCalled = true;
    savedName = name;
    savedColor = color;
  },
  title: 'Add Player',
  initialName: '',
  initialColor: '#FF9F0A',
  usedColors: ['#4B45D4', '#22DD66'] // Alice and Bob
};

const element2 = PlayerDialog(props2);
const onSubmit2 = findFormOnSubmit(element2);
onSubmit2({ preventDefault: () => {} });

console.log('Result:');
console.log('  onSave called:', saveCalled);
console.log('  onClose called:', closeCalled);
console.log('  error state:', mockStates.error);

// RUN TEST 3: Adding a new player with a used color
console.log('\n--- RUNNING TEST 3: Add player with used color ---');
mockStates.name = 'Charlie';
mockStates.color = '#4B45D4'; // Already used by Alice
mockStates.error = '';
mockStates.stateCalls = 0;
saveCalled = false;
closeCalled = false;

const props3 = {
  isOpen: true,
  onClose: () => { closeCalled = true; },
  onSave: (name, color) => {
    saveCalled = true;
    savedName = name;
    savedColor = color;
  },
  title: 'Add Player',
  initialName: '',
  initialColor: '#FF9F0A',
  usedColors: ['#4B45D4', '#22DD66'] // Alice and Bob
};

const element3 = PlayerDialog(props3);
const onSubmit3 = findFormOnSubmit(element3);
onSubmit3({ preventDefault: () => {} });

console.log('Result:');
console.log('  onSave called:', saveCalled);
console.log('  onClose called:', closeCalled);
console.log('  error state:', mockStates.error);
