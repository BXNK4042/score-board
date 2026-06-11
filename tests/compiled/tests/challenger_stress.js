"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/challenger_stress.tsx
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
const assert_1 = __importDefault(require("assert"));
const mockStore = {
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
const ModuleProto = module_1.default.prototype;
const originalRequire = ModuleProto.require;
ModuleProto.require = function (id) {
    if (id === 'react') {
        const realReact = originalRequire.call(this, 'react');
        // Mutate realReact in place to override hooks
        realReact.useState = (initialValue) => {
            const cursor = mockStore.stateCursor++;
            if (mockStore.states[cursor] === undefined) {
                mockStore.states[cursor] = initialValue;
            }
            const setter = (newVal) => {
                if (typeof newVal === 'function') {
                    mockStore.states[cursor] = newVal(mockStore.states[cursor]);
                }
                else {
                    mockStore.states[cursor] = newVal;
                }
            };
            mockStore.stateSetters[cursor] = setter;
            return [mockStore.states[cursor], setter];
        };
        realReact.useEffect = () => { };
        realReact.useCallback = (fn) => fn;
        return realReact;
    }
    if (id === 'react/jsx-runtime') {
        return {
            jsx: (type, props) => ({ type, props }),
            jsxs: (type, props) => ({ type, props }),
            Fragment: 'Fragment'
        };
    }
    if (id.startsWith('@/')) {
        const resolvedPath = path_1.default.resolve(__dirname, '..', id.slice(2));
        return originalRequire.call(this, resolvedPath);
    }
    return originalRequire.apply(this, arguments);
};
// Import code after monkey patch
const useGameState_1 = require("../hooks/useGameState");
const PlayerDialog_1 = require("../components/PlayerDialog");
const SetupScreen_1 = require("../components/SetupScreen");
console.log('=== CHALLENGER 2 ADVANCED STRESS TESTS ===');
// HELPER: Traversal helper to find form elements by type
function findElementsByType(element, type) {
    const results = [];
    function traverse(el) {
        if (!el || typeof el !== 'object')
            return;
        if (el.type === type) {
            results.push(el);
        }
        if (el.props && el.props.children) {
            if (Array.isArray(el.props.children)) {
                el.props.children.forEach(traverse);
            }
            else {
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
        onClose: () => { },
        onSave: (name, color) => {
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
    (0, PlayerDialog_1.PlayerDialog)(props);
    // Change name only in state
    // states mapping in PlayerDialog: [0] name, [1] color, [2] error
    mockStore.stateSetters[0]('Alice Edited');
    // 2. Re-render to capture updated state in closure
    mockStore.stateCursor = 0;
    const vdom2 = (0, PlayerDialog_1.PlayerDialog)(props);
    // Extract onSubmit from the updated render
    const forms = findElementsByType(vdom2, 'form');
    assert_1.default.strictEqual(forms.length, 1, 'Should render exactly one form');
    const onSubmit = forms[0].props.onSubmit;
    // Submit form
    onSubmit({ preventDefault: () => { } });
    console.log('onSaveCalled:', onSaveCalled);
    console.log('savedName:', savedName);
    console.log('savedColor:', savedColor);
    console.log('error state:', mockStore.states[2] || 'NONE');
    assert_1.default.ok(onSaveCalled, 'onSave should be called');
    assert_1.default.strictEqual(savedName, 'Alice Edited', 'Name should be updated');
    assert_1.default.strictEqual(savedColor, '#4B45D4', 'Color should remain the same');
    assert_1.default.strictEqual(mockStore.states[2], '', 'Error should be empty');
    console.log('✅ Challenge 1 Passed: Successfully edited player name without changing color.');
}
// -------------------------------------------------------------
// CHALLENGE 2: Adding 9th and 10th players using expanded palette
// -------------------------------------------------------------
function testAdd9thAnd10thPlayers() {
    console.log('\n--- Challenge 2: Adding 9th and 10th players with 12-color palette ---');
    resetMockStore();
    // Check palette size
    console.log('PALETTE size:', useGameState_1.PALETTE.length);
    assert_1.default.strictEqual(useGameState_1.PALETTE.length, 12, 'Palette must have 12 colors');
    mockStore.stateCursor = 0;
    const hook = (0, useGameState_1.useGameState)();
    // Add players 1 to 8
    for (let i = 1; i <= 8; i++) {
        const added = hook.addSetupPlayer(`Player ${i}`, useGameState_1.PALETTE[i - 1]);
        assert_1.default.ok(added, `Player ${i} should be added successfully`);
    }
    // Refresh hook with updated state (states[3] is setupPlayers)
    mockStore.stateCursor = 0;
    let hook2 = (0, useGameState_1.useGameState)();
    assert_1.default.strictEqual(mockStore.states[3].length, 8, 'Should have exactly 8 players in state');
    // Verify colors used so far
    const used = mockStore.states[3].map((p) => p.color);
    console.log('Used colors:', used);
    // Add 9th player
    const added9 = hook2.addSetupPlayer('Player 9', useGameState_1.PALETTE[8]); // 9th color
    assert_1.default.ok(added9, 'Player 9 should be added successfully');
    mockStore.stateCursor = 0;
    let hook3 = (0, useGameState_1.useGameState)();
    assert_1.default.strictEqual(mockStore.states[3].length, 9, 'Should have exactly 9 players in state');
    // Add 10th player
    const added10 = hook3.addSetupPlayer('Player 10', useGameState_1.PALETTE[9]); // 10th color
    assert_1.default.ok(added10, 'Player 10 should be added successfully');
    mockStore.stateCursor = 0;
    let hook4 = (0, useGameState_1.useGameState)();
    assert_1.default.strictEqual(mockStore.states[3].length, 10, 'Should have exactly 10 players in state');
    // Try to add 11th player (should fail limit check)
    const added11 = hook4.addSetupPlayer('Player 11', useGameState_1.PALETTE[10]);
    assert_1.default.strictEqual(added11, false, 'Adding 11th player must fail player limit check');
    // Try to add a player with duplicate color
    const addedDuplicateColor = hook4.addSetupPlayer('Player Duplicate Color', useGameState_1.PALETTE[0]);
    assert_1.default.strictEqual(addedDuplicateColor, false, 'Adding player with duplicate color must fail validation');
    console.log('✅ Challenge 2 Passed: 9th & 10th players successfully added, 11th player & duplicate color correctly rejected.');
}
// -------------------------------------------------------------
// CHALLENGE 3: Synchronous validation hook responses
// -------------------------------------------------------------
function testSynchronousValidationHookResponses() {
    console.log('\n--- Challenge 3: Synchronous validation hook responses ---');
    resetMockStore();
    mockStore.stateCursor = 0;
    let hook = (0, useGameState_1.useGameState)();
    // Test 3.1: Duplicate color addition return value is synchronously false
    const r1 = hook.addSetupPlayer('Bob', useGameState_1.PALETTE[0]);
    assert_1.default.strictEqual(r1, true, 'First add should succeed');
    // Re-run hook to update closure state
    mockStore.stateCursor = 0;
    hook = (0, useGameState_1.useGameState)();
    // Adding same color again must return false synchronously
    const r2 = hook.addSetupPlayer('Charlie', useGameState_1.PALETTE[0]);
    assert_1.default.strictEqual(r2, false, 'Second add with same color must fail synchronously');
    // Test 3.2: updateSetupPlayer returns true for valid edit, false for invalid
    // First, add a second player with a different color
    const r3 = hook.addSetupPlayer('Charlie', useGameState_1.PALETTE[1]);
    assert_1.default.strictEqual(r3, true, 'Third add should succeed with unique color');
    // Re-run hook to get latest state
    mockStore.stateCursor = 0;
    hook = (0, useGameState_1.useGameState)();
    const players = mockStore.states[3];
    assert_1.default.strictEqual(players.length, 2, 'Should have 2 players');
    const p1 = players[0];
    const p2 = players[1];
    // Update p1 with a new name but keep their same color -> expect true
    const u1 = hook.updateSetupPlayer(p1.id, 'Bob Edited', p1.color);
    assert_1.default.strictEqual(u1, true, 'Should return true when keeping same color');
    // Update p1 with a color already used by p2 -> expect false
    const u2 = hook.updateSetupPlayer(p1.id, 'Bob Edited', p2.color);
    assert_1.default.strictEqual(u2, false, 'Should return false when attempting to duplicate another player\'s color');
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
        onUpdateTitle: () => { },
        onAddPlayer: () => true,
        onUpdatePlayer: () => true,
        onDeletePlayer: () => { },
        onStartGame: () => { },
        onCancel: () => { },
    };
    const setupVdom = (0, SetupScreen_1.SetupScreen)(setupScreenProps);
    const setupLabels = findElementsByType(setupVdom, 'label');
    const setupInputs = findElementsByType(setupVdom, 'input');
    console.log('SetupScreen Labels found:', setupLabels.length);
    console.log('SetupScreen Inputs found:', setupInputs.length);
    assert_1.default.ok(setupLabels.length >= 1, 'SetupScreen should have at least one label');
    assert_1.default.ok(setupInputs.length >= 1, 'SetupScreen should have at least one input');
    // Find game title label and input
    const titleLabel = setupLabels.find(l => l.props.htmlFor === 'game-title-input');
    const titleInput = setupInputs.find(i => i.props.id === 'game-title-input');
    assert_1.default.ok(titleLabel, 'Label with htmlFor="game-title-input" should exist');
    assert_1.default.ok(titleInput, 'Input with id="game-title-input" should exist');
    assert_1.default.strictEqual(titleLabel.props.htmlFor, titleInput.props.id, 'Label htmlFor must match input id');
    // 4.2 Check PlayerDialog
    const playerDialogProps = {
        isOpen: true,
        onClose: () => { },
        onSave: () => { },
        title: 'Add Player',
        initialName: '',
        initialColor: '#4B45D4',
        usedColors: []
    };
    const dialogVdom = (0, PlayerDialog_1.PlayerDialog)(playerDialogProps);
    const dialogLabels = findElementsByType(dialogVdom, 'label');
    const dialogInputs = findElementsByType(dialogVdom, 'input');
    console.log('PlayerDialog Labels found:', dialogLabels.length);
    console.log('PlayerDialog Inputs found:', dialogInputs.length);
    assert_1.default.ok(dialogLabels.length >= 1, 'PlayerDialog should have at least one label');
    assert_1.default.ok(dialogInputs.length >= 1, 'PlayerDialog should have at least one input');
    const nameLabel = dialogLabels.find(l => l.props.htmlFor === 'player-name-input');
    const nameInput = dialogInputs.find(i => i.props.id === 'player-name-input');
    assert_1.default.ok(nameLabel, 'Label with htmlFor="player-name-input" should exist');
    assert_1.default.ok(nameInput, 'Input with id="player-name-input" should exist');
    assert_1.default.strictEqual(nameLabel.props.htmlFor, nameInput.props.id, 'Label htmlFor must match input id');
    console.log('✅ Challenge 4 Passed: Label-input HTML accessibility connections are correct.');
}
// Run all test challenges
try {
    testEditPlayerWithoutChangingColor();
    testAdd9thAnd10thPlayers();
    testSynchronousValidationHookResponses();
    testLabelInputAccessibility();
    console.log('\n🎉 ALL ADVANCED STRESS TESTS PASSED SUCCESSFULLY!');
}
catch (error) {
    console.error('\n❌ STRESS TEST FAILED:', error);
    process.exit(1);
}
