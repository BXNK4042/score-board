"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

export interface Player {
  id: string;
  name: string;
  color: string; // Hex color code
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

export type ScreenState = "home" | "setup" | "ingame";

interface GameStateContextType {
  game: Game | null;
  screen: ScreenState;
  isLoaded: boolean;
  setScreen: (screen: ScreenState) => void;
  createGame: (title: string, players: Omit<Player, "score" | "isSelected">[]) => void;
  updateGameTitle: (title: string) => void;
  addPlayerInGame: (name: string, color: string) => void;
  updateScore: (playerId: string, delta: number) => void;
  togglePlayerSelection: (playerId: string) => void;
  bulkUpdateScores: (delta: number) => void;
  toggleStopwatch: (running: boolean) => void;
  endGame: () => void;
  leaderId: string | null;
  // Setup Screen state managed globally to survive reload if desired
  setupTitle: string;
  setSetupTitle: (title: string) => void;
  setupPlayers: Omit<Player, "score" | "isSelected">[];
  setSetupPlayers: React.Dispatch<React.SetStateAction<Omit<Player, "score" | "isSelected">[]>>;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [screen, setScreen] = useState<ScreenState>("home");
  const [isLoaded, setIsLoaded] = useState(false);

  // Temporary setup state
  const [setupTitle, setSetupTitle] = useState("");
  const [setupPlayers, setSetupPlayers] = useState<Omit<Player, "score" | "isSelected">[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem("scoreboard_game");
    const savedScreen = localStorage.getItem("scoreboard_screen");
    const savedSetupTitle = localStorage.getItem("scoreboard_setup_title");
    const savedSetupPlayers = localStorage.getItem("scoreboard_setup_players");

    if (savedGame) {
      try {
        setGame(JSON.parse(savedGame));
      } catch (e) {
        console.error("Failed to parse saved game:", e);
      }
    }
    if (savedScreen) {
      setScreen(savedScreen as ScreenState);
    }
    if (savedSetupTitle) {
      setSetupTitle(savedSetupTitle);
    }
    if (savedSetupPlayers) {
      try {
        setSetupPlayers(JSON.parse(savedSetupPlayers));
      } catch (e) {
        console.error("Failed to parse saved setup players:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;

    if (game) {
      localStorage.setItem("scoreboard_game", JSON.stringify(game));
    } else {
      localStorage.removeItem("scoreboard_game");
    }
    localStorage.setItem("scoreboard_screen", screen);
    localStorage.setItem("scoreboard_setup_title", setupTitle);
    localStorage.setItem("scoreboard_setup_players", JSON.stringify(setupPlayers));
  }, [game, screen, setupTitle, setupPlayers, isLoaded]);

  // Stopwatch ticking logic
  useEffect(() => {
    if (!game || !game.isRunning) return;

    const interval = setInterval(() => {
      setGame((prevGame) => {
        if (!prevGame || !prevGame.isRunning) return prevGame;
        return {
          ...prevGame,
          elapsedSeconds: prevGame.elapsedSeconds + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.isRunning]);

  // Computed leader: highest score, tie-breaker goes to the first in the list
  const leaderId = useMemo(() => {
    if (!game || game.players.length === 0) return null;
    let leader = game.players[0];
    for (let i = 1; i < game.players.length; i++) {
      if (game.players[i].score > leader.score) {
        leader = game.players[i];
      }
    }
    return leader.id;
  }, [game?.players]);

  const createGame = useCallback((title: string, playersList: Omit<Player, "score" | "isSelected">[]) => {
    const newGame: Game = {
      id: Math.random().toString(36).substring(2, 11),
      title: title.trim() || "Game Session",
      createdAt: Date.now(),
      elapsedSeconds: 0,
      isRunning: true,
      players: playersList.map((p) => ({
        ...p,
        score: 0,
        isSelected: false,
      })),
    };
    setGame(newGame);
    setScreen("ingame");
  }, []);

  const updateGameTitle = useCallback((title: string) => {
    setGame((prev) => {
      if (!prev) return null;
      return { ...prev, title };
    });
  }, []);

  const addPlayerInGame = useCallback((name: string, color: string) => {
    setGame((prev) => {
      if (!prev) return null;
      if (prev.players.length >= 10) return prev;
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(2, 11),
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
    setGame((prev) => {
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
    setGame((prev) => {
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
    setGame((prev) => {
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
    setGame((prev) => {
      if (!prev) return null;
      return { ...prev, isRunning: running };
    });
  }, []);

  const endGame = useCallback(() => {
    setGame(null);
    setSetupTitle("");
    setSetupPlayers([]);
    setScreen("home");
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        game,
        screen,
        isLoaded,
        setScreen,
        createGame,
        updateGameTitle,
        addPlayerInGame,
        updateScore,
        togglePlayerSelection,
        bulkUpdateScores,
        toggleStopwatch,
        endGame,
        leaderId,
        setupTitle,
        setSetupTitle,
        setupPlayers,
        setSetupPlayers,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
