'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Player {
  id: string;
  name: string;
  color: string;               // hex accent color
  score: number;               // default 0
  isSelected: boolean;         // for bulk actions
}

export interface Game {
  id: string;
  title: string;
  createdAt: number;          // timestamp
  elapsedSeconds: number;     // stopwatch state
  isRunning: boolean;
  players: Player[];
}

export type ScreenType = 'home' | 'setup' | 'ingame';

export interface GameStateContextType {
  screen: ScreenType;
  game: Game | null;
  isHydrated: boolean;
  setScreen: (screen: ScreenType) => void;
  createGame: (title: string, players: Player[]) => void;
  updateGameTitle: (title: string) => void;
  addPlayerInGame: (name: string, color: string) => void;
  updateScore: (playerId: string, delta: number) => void;
  togglePlayerSelection: (playerId: string) => void;
  clearAllSelections: () => void;
  bulkUpdateScores: (delta: number) => void;
  toggleStopwatch: (running: boolean) => void;
  endGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'scoreboard_game_state';

interface SavedState {
  screen: ScreenType;
  game: Game | null;
}

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreenState] = useState<ScreenType>('home');
  const [game, setGameState] = useState<Game | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedState;
        if (parsed.screen) setScreenState(parsed.screen);
        if (parsed.game) setGameState(parsed.game);
      }
    } catch (e) {
      console.error('Failed to parse saved game state:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ screen, game }));
    } catch (e) {
      console.error('Failed to save game state to localStorage:', e);
    }
  }, [screen, game, isHydrated]);

  // 3. Stopwatch interval ticker (runs in-game when timer is running)
  useEffect(() => {
    if (!game || !game.isRunning || screen !== 'ingame') return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.isRunning, screen]);

  const setScreen = useCallback((newScreen: ScreenType) => {
    setScreenState(newScreen);
  }, []);

  const createGame = useCallback((title: string, players: Player[]) => {
    const newGame: Game = {
      id: Math.random().toString(36).substring(2, 9),
      title: title.trim() || 'ScoreBoard Game',
      createdAt: Date.now(),
      elapsedSeconds: 0,
      isRunning: true,
      players,
    };
    setGameState(newGame);
    setScreenState('ingame');
  }, []);

  const updateGameTitle = useCallback((title: string) => {
    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        title,
      };
    });
  }, []);

  const addPlayerInGame = useCallback((name: string, color: string) => {
    setGameState((prev) => {
      if (!prev) return null;
      if (prev.players.length >= 10) return prev; // max 10 check
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim() || `Player ${prev.players.length + 1}`,
        color,
        score: 0,
        isSelected: false,
      };
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });
  }, []);

  const updateScore = useCallback((playerId: string, delta: number) => {
    setGameState((prev) => {
      if (!prev) return null;
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === playerId) {
          return { ...p, score: p.score + delta };
        }
        return p;
      });
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const togglePlayerSelection = useCallback((playerId: string) => {
    setGameState((prev) => {
      if (!prev) return null;
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === playerId) {
          return { ...p, isSelected: !p.isSelected };
        }
        return p;
      });
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const clearAllSelections = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return null;
      const updatedPlayers = prev.players.map((p) => ({
        ...p,
        isSelected: false,
      }));
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const bulkUpdateScores = useCallback((delta: number) => {
    setGameState((prev) => {
      if (!prev) return null;
      const updatedPlayers = prev.players.map((p) => {
        if (p.isSelected) {
          return { ...p, score: p.score + delta };
        }
        return p;
      });
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const toggleStopwatch = useCallback((running: boolean) => {
    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isRunning: running,
      };
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState(null);
    setScreenState('home');
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        screen,
        game,
        isHydrated,
        setScreen,
        createGame,
        updateGameTitle,
        addPlayerInGame,
        updateScore,
        togglePlayerSelection,
        clearAllSelections,
        bulkUpdateScores,
        toggleStopwatch,
        endGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
