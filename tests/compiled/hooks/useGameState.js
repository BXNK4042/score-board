"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PALETTE = void 0;
exports.useGameState = useGameState;
const react_1 = require("react");
exports.PALETTE = [
    '#4B45D4', // Deep Indigo / Brand
    '#22DD66', // Vibrant Green
    '#D4156B', // Vibrant Pink/Magenta
    '#FF9F0A', // Vibrant Orange
    '#0A84FF', // Vibrant Blue
    '#BF5AF2', // Vibrant Purple
    '#FF453A', // Vibrant Red
    '#FFD60A', // Vibrant Yellow
    '#30D158', // Vibrant Light Green
    '#64D2FF', // Vibrant Light Blue
    '#FF375F', // Vibrant Deep Pink
    '#9B59B6', // Vibrant Dark Purple
];
const LOCAL_STORAGE_KEY = 'scoreboard_game_state';
function useGameState() {
    const [screen, setScreen] = (0, react_1.useState)('home');
    const [activeGame, setActiveGame] = (0, react_1.useState)(null);
    const [setupTitle, setSetupTitle] = (0, react_1.useState)('');
    const [setupPlayers, setSetupPlayers] = (0, react_1.useState)([]);
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    // Load state from local storage on mount
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setTimeout(() => {
                        if (parsed.screen)
                            setScreen(parsed.screen);
                        if (parsed.activeGame)
                            setActiveGame(parsed.activeGame);
                        if (parsed.setupTitle !== undefined)
                            setSetupTitle(parsed.setupTitle);
                        if (parsed.setupPlayers)
                            setSetupPlayers(parsed.setupPlayers);
                        setIsInitialized(true);
                    }, 0);
                    return;
                }
                catch (e) {
                    console.error('Failed to load scoreboard state from localStorage', e);
                }
            }
            setTimeout(() => {
                setIsInitialized(true);
            }, 0);
        }
    }, []);
    // Save state to local storage when it changes (only after initialization to prevent overwriting stored data with default empty state)
    (0, react_1.useEffect)(() => {
        if (isInitialized && typeof window !== 'undefined') {
            const stateToSave = {
                screen,
                activeGame,
                setupTitle,
                setupPlayers,
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        }
    }, [screen, activeGame, setupTitle, setupPlayers, isInitialized]);
    // Non-blocking timer tick
    const isRunning = activeGame === null || activeGame === void 0 ? void 0 : activeGame.isRunning;
    (0, react_1.useEffect)(() => {
        if (!isRunning)
            return;
        const interval = setInterval(() => {
            // Use functional update to ensure we have the latest state and don't re-trigger interval
            setActiveGame((prev) => {
                if (!prev || !prev.isRunning)
                    return prev;
                return Object.assign(Object.assign({}, prev), { elapsedSeconds: prev.elapsedSeconds + 1 });
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning]);
    // Screen Navigations
    const goToHome = (0, react_1.useCallback)(() => setScreen('home'), []);
    const goToSetup = (0, react_1.useCallback)(() => setScreen('setup'), []);
    const goToInGame = (0, react_1.useCallback)(() => {
        if (activeGame) {
            setScreen('ingame');
        }
    }, [activeGame]);
    // Setup Actions
    const updateSetupTitle = (0, react_1.useCallback)((title) => {
        setSetupTitle(title);
    }, []);
    const addSetupPlayer = (0, react_1.useCallback)((name, color) => {
        if (setupPlayers.length >= 10) {
            return false;
        }
        const colorLower = color.toLowerCase();
        if (setupPlayers.some((p) => p.color.toLowerCase() === colorLower)) {
            return false;
        }
        setSetupPlayers((prev) => [
            ...prev,
            { id: crypto.randomUUID(), name: name.trim(), color }
        ]);
        return true;
    }, [setupPlayers]);
    const updateSetupPlayer = (0, react_1.useCallback)((id, name, color) => {
        const colorLower = color.toLowerCase();
        if (setupPlayers.some((p) => p.id !== id && p.color.toLowerCase() === colorLower)) {
            return false;
        }
        setSetupPlayers((prev) => prev.map((p) => (p.id === id ? Object.assign(Object.assign({}, p), { name: name.trim(), color }) : p)));
        return true;
    }, [setupPlayers]);
    const deleteSetupPlayer = (0, react_1.useCallback)((id) => {
        setSetupPlayers((prev) => prev.filter((p) => p.id !== id));
    }, []);
    const resetSetup = (0, react_1.useCallback)(() => {
        setSetupTitle('');
        setSetupPlayers([]);
    }, []);
    // Game Play Actions
    const createGame = (0, react_1.useCallback)((title, players) => {
        const newGame = {
            id: crypto.randomUUID(),
            title: title.trim() || 'Untitled Game',
            createdAt: Date.now(),
            elapsedSeconds: 0,
            isRunning: true,
            players: players.map((p) => ({
                id: p.id,
                name: p.name,
                color: p.color,
                score: 0,
                isSelected: false,
            })),
        };
        setActiveGame(newGame);
        setScreen('ingame');
    }, []);
    const updateGameTitle = (0, react_1.useCallback)((title) => {
        setActiveGame((prev) => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { title });
        });
    }, []);
    const addPlayerInGame = (0, react_1.useCallback)((name, color) => {
        if (!activeGame) {
            return false;
        }
        if (activeGame.players.length >= 10) {
            return false;
        }
        const colorLower = color.toLowerCase();
        if (activeGame.players.some((p) => p.color.toLowerCase() === colorLower)) {
            return false;
        }
        const newPlayer = {
            id: crypto.randomUUID(),
            name: name.trim(),
            color,
            score: 0,
            isSelected: false,
        };
        setActiveGame((prev) => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { players: [...prev.players, newPlayer] });
        });
        return true;
    }, [activeGame]);
    const updateScore = (0, react_1.useCallback)((playerId, delta) => {
        setActiveGame((prev) => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { players: prev.players.map((p) => p.id === playerId ? Object.assign(Object.assign({}, p), { score: p.score + delta }) : p) });
        });
    }, []);
    const togglePlayerSelection = (0, react_1.useCallback)((playerId) => {
        setActiveGame((prev) => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { players: prev.players.map((p) => p.id === playerId ? Object.assign(Object.assign({}, p), { isSelected: !p.isSelected }) : p) });
        });
    }, []);
    const bulkUpdateScores = (0, react_1.useCallback)((delta) => {
        setActiveGame((prev) => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { players: prev.players.map((p) => p.isSelected ? Object.assign(Object.assign({}, p), { score: p.score + delta }) : p) });
        });
    }, []);
    const toggleStopwatch = (0, react_1.useCallback)((running) => {
        setActiveGame((prev) => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { isRunning: running });
        });
    }, []);
    const endGame = (0, react_1.useCallback)(() => {
        setActiveGame(null);
        setScreen('home');
    }, []);
    return {
        screen,
        activeGame,
        setupTitle,
        setupPlayers,
        isInitialized,
        goToHome,
        goToSetup,
        goToInGame,
        updateSetupTitle,
        addSetupPlayer,
        updateSetupPlayer,
        deleteSetupPlayer,
        resetSetup,
        createGame,
        updateGameTitle,
        addPlayerInGame,
        updateScore,
        togglePlayerSelection,
        bulkUpdateScores,
        toggleStopwatch,
        endGame,
    };
}
