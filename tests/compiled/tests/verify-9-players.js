"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
// 1. Mock state definition
const mockStates = {
    name: 'Player 9',
    color: '#4B45D4', // First color
    error: '',
    stateCalls: 0
};
// 2. Monkey-patch require to intercept react and resolve aliases
const ModuleProto = module_1.default.prototype;
const originalRequire = ModuleProto.require;
ModuleProto.require = function (id) {
    if (id === 'react') {
        const realReact = originalRequire.call(this, 'react');
        realReact.useState = function (initialValue) {
            const callIndex = mockStates.stateCalls++;
            if (callIndex === 0) {
                return [mockStates.name, (val) => { mockStates.name = val; }];
            }
            else if (callIndex === 1) {
                return [mockStates.color, (val) => { mockStates.color = val; }];
            }
            else {
                return [mockStates.error, (val) => { mockStates.error = val; }];
            }
        };
        realReact.useEffect = function () { };
        realReact.useCallback = function (fn) { return fn; };
        return realReact;
    }
    if (id.startsWith('@/')) {
        const resolvedPath = path_1.default.resolve(__dirname, '..', id.slice(2));
        return originalRequire.call(this, resolvedPath);
    }
    return originalRequire.apply(this, arguments);
};
// Import PALETTE and PlayerDialog
const useGameState_1 = require("../hooks/useGameState");
const PlayerDialog_1 = require("../components/PlayerDialog");
function findFormOnSubmit(element) {
    if (!element || typeof element !== 'object')
        return null;
    if (element.type === 'form' && element.props && element.props.onSubmit) {
        return element.props.onSubmit;
    }
    if (element.props && element.props.children) {
        if (Array.isArray(element.props.children)) {
            for (const child of element.props.children) {
                const found = findFormOnSubmit(child);
                if (found)
                    return found;
            }
        }
        else {
            return findFormOnSubmit(element.props.children);
        }
    }
    return null;
}
console.log('--- RUNNING 9TH PLAYER TEST ---');
console.log('Palette size:', useGameState_1.PALETTE.length);
// Pretend we have 8 players, using all 8 colors in the palette
const usedColors = [...useGameState_1.PALETTE];
let saveCalled = false;
let closeCalled = false;
const props = {
    isOpen: true,
    onClose: () => { closeCalled = true; },
    onSave: () => { saveCalled = true; },
    title: 'Add Player',
    initialName: '',
    initialColor: useGameState_1.PALETTE[0], // Default color since none are available
    usedColors: usedColors
};
// We will attempt to save with each of the palette colors
for (const color of useGameState_1.PALETTE) {
    mockStates.name = 'Player 9';
    mockStates.color = color;
    mockStates.error = '';
    mockStates.stateCalls = 0;
    saveCalled = false;
    closeCalled = false;
    const element = (0, PlayerDialog_1.PlayerDialog)(props);
    const onSubmit = findFormOnSubmit(element);
    onSubmit({ preventDefault: () => { } });
    if (saveCalled) {
        console.log(`Success saving 9th player with color ${color}`);
        break;
    }
}
if (!saveCalled) {
    console.log('BUG CONFIRMED: 9th player cannot be added with any palette color because all colors are already in use!');
}
else {
    console.log('PASS: Successfully added 9th player.');
}
