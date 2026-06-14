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
  lastScoreUpdated?: number;
  foulCount?: number;
}

export const PALETTE = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#84CC16', // Lime
  '#0EA5E9', // Sky
  '#A855F7', // Purple
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

  const updateSetupPlayer = useCallback((id: string, name: string, color: string): boolean => {
    const colorLower = color.toLowerCase();
    if (setupPlayers.some((p) => p.id !== id && p.color.toLowerCase() === colorLower)) {
      return false;
    }
    setSetupPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: name.trim(), color } : p))
    );
    return true;
  }, [setupPlayers]);

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
      foulCount: 0,
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
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      score: 0,
      isSelected: false,
    };
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });
    return true;
  }, [activeGame]);

  const updateScore = useCallback((playerId: string, delta: number) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        lastScoreUpdated: Date.now(),
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
        lastScoreUpdated: Date.now(),
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

  const deselectAllPlayers = useCallback(() => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) => ({
          ...p,
          isSelected: false,
        })),
      };
    });
  }, []);

  const reversePlayerSelection = useCallback(() => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) => ({
          ...p,
          isSelected: !p.isSelected,
        })),
      };
    });
  }, []);

  const updatePlayerName = useCallback((playerId: string, newName: string) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, name: newName.trim() } : p
        ),
      };
    });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.filter((p) => p.id !== playerId),
      };
    });
  }, []);

  const incrementFoulCount = useCallback(() => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        foulCount: (prev.foulCount || 0) + 1,
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setActiveGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        elapsedSeconds: 0,
        isRunning: true,
        lastScoreUpdated: undefined,
        foulCount: 0,
        players: prev.players.map((p) => ({
          ...p,
          score: 0,
          isSelected: false,
        })),
      };
    });
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
    deselectAllPlayers,
    reversePlayerSelection,
    toggleStopwatch,
    endGame,
    updatePlayerName,
    removePlayer,
    incrementFoulCount,
    restartGame,
  };
}
