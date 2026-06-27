import { useState, useEffect, useCallback, useRef } from 'react';

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
  scoredBalls: string[];
}

export interface ScoreChange {
  timestamp: number;
  playerId: string;
  previousScore: number;
  newScore: number;
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
  latestBall?: {
    playerName: string;
    type: 'Score' | 'Foul';
    ballName: string;
  };
  scoreHistory: ScoreChange[];
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
  const [screen, setScreen] = useState<'home' | 'setup' | 'ingame' | 'history'>('home');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [setupTitle, setSetupTitle] = useState('');
  const [setupPlayers, setSetupPlayers] = useState<DraftPlayer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // ponytail: session-only undo/redo history state
  const [historyState, setHistoryState] = useState<{ list: Game[]; index: number }>({
    list: [],
    index: -1,
  });

  const isHistoryActionRef = useRef(false);

  const updateGame = useCallback((updater: (prev: Game) => Game, isHistoryAction = true) => {
    if (isHistoryAction) {
      isHistoryActionRef.current = true;
    }
    setActiveGame((prev) => {
      if (!prev) return null;
      return updater(prev);
    });
  }, []);

  // ponytail: handle history state changes outside state updater to prevent Strict Mode double-update issue
  useEffect(() => {
    if (!activeGame) return;
    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      setHistoryState((prevHistory) => {
        const sliced = prevHistory.list.slice(0, prevHistory.index + 1);
        return {
          list: [...sliced, activeGame],
          index: sliced.length,
        };
      });
    }
  }, [activeGame]);

  // Load state from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            if (parsed.screen) setScreen(parsed.screen);
            if (parsed.activeGame) {
              // ponytail: migrate existing games to add scoredBalls array and scoreHistory
              const migratedGame = {
                ...parsed.activeGame,
                players: parsed.activeGame.players.map((p: Player) => ({
                  ...p,
                  scoredBalls: p.scoredBalls || [],
                })),
                scoreHistory: parsed.activeGame.scoreHistory || [],
              };
              setActiveGame(migratedGame);
              setHistoryState({
                list: [migratedGame],
                index: 0,
              });
            }
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
  const goToHistory = useCallback(() => {
    if (activeGame) {
      setScreen('history');
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
        scoredBalls: [],
      })),
      foulCount: 0,
      scoreHistory: [],
    };
    setActiveGame(newGame);
    setHistoryState({
      list: [newGame],
      index: 0,
    });
    setScreen('ingame');
  }, []);

  const updateGameTitle = useCallback((title: string) => {
    updateGame((prev) => ({ ...prev, title }));
  }, [updateGame]);

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
      scoredBalls: [],
    };
    updateGame((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
    return true;
  }, [activeGame, updateGame]);

  const updateScore = useCallback((playerId: string, delta: number) => {
    updateGame((prev) => {
      const player = prev.players.find((p) => p.id === playerId);
      if (!player) return prev;
      const previousScore = player.score;
      const newScore = previousScore + delta;
      return {
        ...prev,
        lastScoreUpdated: Date.now(),
        scoreHistory: [
          { timestamp: Date.now(), playerId, previousScore, newScore },
          ...(prev.scoreHistory || []),
        ],
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, score: newScore } : p
        ),
      };
    });
  }, [updateGame]);

  const togglePlayerSelection = useCallback((playerId: string) => {
    updateGame((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, isSelected: !p.isSelected } : p
      ),
    }), false);
  }, [updateGame]);

  const bulkUpdateScores = useCallback((delta: number) => {
    updateGame((prev) => {
      const now = Date.now();
      const newScoreChanges: ScoreChange[] = [];
      const updatedPlayers = prev.players.map((p) => {
        if (p.isSelected) {
          newScoreChanges.push({ timestamp: now, playerId: p.id, previousScore: p.score, newScore: p.score + delta });
          return { ...p, score: p.score + delta };
        }
        return p;
      });
      return {
        ...prev,
        lastScoreUpdated: now,
        scoreHistory: [...newScoreChanges, ...(prev.scoreHistory || [])],
        players: updatedPlayers,
      };
    });
  }, [updateGame]);

  const toggleStopwatch = useCallback((running: boolean) => {
    updateGame((prev) => ({ ...prev, isRunning: running }), false);
  }, [updateGame]);

  const endGame = useCallback(() => {
    setActiveGame(null);
    setHistoryState({ list: [], index: -1 });
    setScreen('home');
  }, []);

  const deselectAllPlayers = useCallback(() => {
    updateGame((prev) => ({
      ...prev,
      players: prev.players.map((p) => ({
        ...p,
        isSelected: false,
      })),
    }), false);
  }, [updateGame]);

  const reversePlayerSelection = useCallback(() => {
    updateGame((prev) => ({
      ...prev,
      players: prev.players.map((p) => ({
        ...p,
        isSelected: !p.isSelected,
      })),
    }), false);
  }, [updateGame]);

  const updatePlayerName = useCallback((playerId: string, newName: string) => {
    updateGame((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, name: newName.trim() } : p
      ),
    }));
  }, [updateGame]);

  const removePlayer = useCallback((playerId: string) => {
    updateGame((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
  }, [updateGame]);

  // ponytail: group ball click updates (score, foul, latest ball stats) into a single atomic history entry to prevent double-undo issues
  const recordBallClick = useCallback((currentPlayerId: string, points: number, tab: 'score' | 'foul') => {
    updateGame((prev) => {
      const player = prev.players.find((p) => p.id === currentPlayerId);
      const playerName = player ? player.name : 'Unknown';
      const type = tab === 'score' ? 'Score' : 'Foul';
      const ballName = (() => {
        if (tab === 'foul') {
          if (points === 4) return 'Cue/Red/Yellow/Green/Brown';
          if (points === 5) return 'Blue';
          if (points === 6) return 'Pink';
          if (points === 7) return 'Black';
          return 'Foul';
        }
        switch (points) {
          case 0: return 'White';
          case 1: return 'Red';
          case 2: return 'Yellow';
          case 3: return 'Green';
          case 4: return 'Brown';
          case 5: return 'Blue';
          case 6: return 'Pink';
          case 7: return 'Black';
          default: return 'Custom';
        }
      })();

      let updatedPlayers = prev.players;
      let updatedFoulCount = prev.foulCount || 0;
      const now = Date.now();
      const newScoreChanges: ScoreChange[] = [];

      if (tab === 'score') {
        updatedPlayers = prev.players.map((p) =>
          p.id === currentPlayerId ? { ...p, score: p.score + points, scoredBalls: [...p.scoredBalls, ballName] } : p
        );
        const currentPlayer = prev.players.find((p) => p.id === currentPlayerId);
        if (currentPlayer) {
          newScoreChanges.push({ timestamp: now, playerId: currentPlayerId, previousScore: currentPlayer.score, newScore: currentPlayer.score + points });
        }
      } else {
        const isFourPointFoul = points === 4;
        const hasMultiplePlayers = prev.players.length > 2;
        const foulPoints = (isFourPointFoul && hasMultiplePlayers) ? 2 : Math.max(points, 4);

        const otherPlayers = prev.players.filter((p) => p.id !== currentPlayerId);
        if (otherPlayers.length > 0) {
          updatedPlayers = prev.players.map((p) => {
            if (p.id !== currentPlayerId) {
              newScoreChanges.push({ timestamp: now, playerId: p.id, previousScore: p.score, newScore: p.score + foulPoints });
              return { ...p, score: p.score + foulPoints };
            }
            return p;
          });
        }
        updatedFoulCount += 1;
      }

      return {
        ...prev,
        lastScoreUpdated: now,
        scoreHistory: [...newScoreChanges, ...(prev.scoreHistory || [])],
        latestBall: { playerName, type, ballName },
        players: updatedPlayers,
        foulCount: updatedFoulCount,
      };
    });
  }, [updateGame]);

  const restartGame = useCallback(() => {
    setActiveGame((prev) => {
      if (!prev) return null;
      const next = {
        ...prev,
        elapsedSeconds: 0,
        isRunning: true,
        lastScoreUpdated: undefined,
        foulCount: 0,
        latestBall: undefined,
        scoreHistory: [],
        players: prev.players.map((p) => ({
          ...p,
          score: 0,
          isSelected: false,
          scoredBalls: [],
        })),
      };
      setHistoryState({
        list: [next],
        index: 0,
      });
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.index > 0) {
        const nextIndex = prev.index - 1;
        const targetGame = prev.list[nextIndex];
        setActiveGame((curr) => {
          if (!curr) return null;
          return {
            ...targetGame,
            elapsedSeconds: curr.elapsedSeconds,
            isRunning: curr.isRunning,
          };
        });
        return {
          ...prev,
          index: nextIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.index < prev.list.length - 1) {
        const nextIndex = prev.index + 1;
        const targetGame = prev.list[nextIndex];
        setActiveGame((curr) => {
          if (!curr) return null;
          return {
            ...targetGame,
            elapsedSeconds: curr.elapsedSeconds,
            isRunning: curr.isRunning,
          };
        });
        return {
          ...prev,
          index: nextIndex,
        };
      }
      return prev;
    });
  }, []);

  return {
    screen,
    activeGame,
    setupTitle,
    setupPlayers,
    isInitialized,
    canUndo: historyState.index > 0,
    canRedo: historyState.index < historyState.list.length - 1,

    goToHome,
    goToSetup,
    goToInGame,
    goToHistory,

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
    restartGame,
    recordBallClick,
    undo,
    redo,
  };
}
