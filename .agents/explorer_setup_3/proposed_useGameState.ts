import { useState, useEffect, useCallback } from 'react';

export interface DraftPlayer {
  id: string;
  name: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  isSelected: boolean;
}

export interface Game {
  id: string;
  title: string;
  createdAt: number;
  elapsedSeconds: number;
  isRunning: boolean;
  players: Player[];
}

export const PALETTE = [
  '#4B45D4', // Deep Indigo / Brand
  '#22DD66', // Vibrant Green
  '#D4156B', // Vibrant Pink/Magenta
  '#FF9F0A', // Vibrant Orange
  '#0A84FF', // Vibrant Blue
  '#BF5AF2', // Vibrant Purple
  '#FF453A', // Vibrant Red
  '#FFD60A', // Vibrant Yellow
];

const LOCAL_STORAGE_KEY = 'scoreboard_game_state';

export function useGameState() {
  const [screen, setScreen] = useState<'home' | 'setup' | 'ingame'>('home');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [setupTitle, setSetupTitle] = useState('');
  const [setupPlayers, setSetupPlayers] = useState<DraftPlayer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            if (parsed.screen) setScreen(parsed.screen);
            if (parsed.activeGame) setActiveGame(parsed.activeGame);
            if (parsed.setupTitle !== undefined) setSetupTitle(parsed.setupTitle);
            if (parsed.setupPlayers) setSetupPlayers(parsed.setupPlayers);
            setIsInitialized(true);
          }, 0);
          return;
        } catch (e) {
          console.error('Failed to load scoreboard state from localStorage', e);
        }
      }
      setTimeout(() => {
        setIsInitialized(true);
      }, 0);
    }
  }, []);

  // Save state to local storage when it changes (only after initialization to prevent overwriting stored data with default empty state)
  useEffect(() => {
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
  const isRunning = activeGame?.isRunning;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Use functional update to ensure we have the latest state and don't re-trigger interval
      setActiveGame((prev) => {
        if (!prev || !prev.isRunning) return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Screen Navigations
  const goToHome = useCallback(() => setScreen('home'), []);
  const goToSetup = useCallback(() => setScreen('setup'), []);
  const goToInGame = useCallback(() => {
    if (activeGame) {
      setScreen('ingame');
    }
  }, [activeGame]);

  // Setup Actions
  const updateSetupTitle = useCallback((title: string) => {
    setSetupTitle(title);
  }, []);

  const addSetupPlayer = useCallback((name: string, color: string): boolean => {
    let success = true;
    setSetupPlayers((prev) => {
      if (prev.length >= 10) {
        success = false;
        return prev;
      }
      const colorLower = color.toLowerCase();
      if (prev.some((p) => p.color.toLowerCase() === colorLower)) {
        success = false;
        return prev;
      }
      success = true;
      return [...prev, { id: crypto.randomUUID(), name: name.trim(), color }];
    });
    return success;
  }, []);

  const updateSetupPlayer = useCallback((id: string, name: string, color: string): boolean => {
    let success = true;
    setSetupPlayers((prev) => {
      const colorLower = color.toLowerCase();
      // Check if another player uses this color
      if (prev.some((p) => p.id !== id && p.color.toLowerCase() === colorLower)) {
        success = false;
        return prev;
      }
      success = true;
      return prev.map((p) => (p.id === id ? { ...p, name: name.trim(), color } : p));
    });
    return success;
  }, []);

  const deleteSetupPlayer = useCallback((id: string) => {
    setSetupPlayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetSetup = useCallback(() => {
    setSetupTitle('');
    setSetupPlayers([]);
  }, []);

  // Game Play Actions
  const createGame = useCallback((title: string, players: DraftPlayer[]) => {
    const newGame: Game = {
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

  const updateGameTitle = useCallback((title: string) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return { ...prev, title };
    });
  }, []);

  const addPlayerInGame = useCallback((name: string, color: string): boolean => {
    let success = true;
    setActiveGame((prev) => {
      if (!prev) {
        success = false;
        return null;
      }
      if (prev.players.length >= 10) {
        success = false;
        return prev;
      }
      const colorLower = color.toLowerCase();
      if (prev.players.some((p) => p.color.toLowerCase() === colorLower)) {
        success = false;
        return prev;
      }
      success = true;
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
        score: 0,
        isSelected: false,
      };
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });
    return success;
  }, []);

  const updateScore = useCallback((playerId: string, delta: number) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, score: p.score + delta } : p
        ),
      };
    });
  }, []);

  const togglePlayerSelection = useCallback((playerId: string) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, isSelected: !p.isSelected } : p
        ),
      };
    });
  }, []);

  const bulkUpdateScores = useCallback((delta: number) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.isSelected ? { ...p, score: p.score + delta } : p
        ),
      };
    });
  }, []);

  const toggleStopwatch = useCallback((running: boolean) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return { ...prev, isRunning: running };
    });
  }, []);

  const endGame = useCallback(() => {
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
