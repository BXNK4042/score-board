import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DraftPlayer,
  Player,
  ScoreChange,
  Game,
  prependScoreHistory,
} from '@/lib/gameTypes';
import { getBallNameByPoints, getFoulPoints } from '@/lib/snookerBalls';

const LOCAL_STORAGE_KEY = 'scoreboard_game_state';

export function useGameState() {
  const [screen, setScreen] = useState<'home' | 'setup' | 'ingame' | 'history'>('home');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [setupTitle, setSetupTitle] = useState('');
  const [setupPlayers, setSetupPlayers] = useState<DraftPlayer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [noFoulDisplay, setNoFoulDisplay] = useState(false);

  // ponytail: session-only undo/redo history state
  const [historyState, setHistoryState] = useState<{ list: Game[]; index: number }>({
    list: [],
    index: -1,
  });

  const isHistoryActionRef = useRef(false);
  const elapsedRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

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
              // ponytail: migrate existing games; stopwatch fields moved off Game in this revision
              const ag = parsed.activeGame;
              const legacyElapsed = typeof ag.elapsedSeconds === 'number' ? ag.elapsedSeconds : undefined;
              const legacyRunning = typeof ag.isRunning === 'boolean' ? ag.isRunning : undefined;
              // strip legacy stopwatch fields if present
              const stripped: Omit<Game, never> = { ...ag };
              delete (stripped as { elapsedSeconds?: number }).elapsedSeconds;
              delete (stripped as { isRunning?: boolean }).isRunning;

              const migratedGame: Game = {
                ...stripped,
                players: ag.players.map((p: Player) => ({
                  ...p,
                  scoredBalls: p.scoredBalls || [],
                  foulAwardedPoints: p.foulAwardedPoints ?? 0,
                })),
                scoreHistory: ag.scoreHistory || [],
              };
              setActiveGame(migratedGame);
              setHistoryState({
                list: [migratedGame],
                index: 0,
              });

              if (parsed.elapsedSeconds !== undefined) setElapsedSeconds(parsed.elapsedSeconds);
              else if (legacyElapsed !== undefined) setElapsedSeconds(legacyElapsed);
              if (parsed.isRunning !== undefined) setIsRunning(parsed.isRunning);
              else if (legacyRunning !== undefined) setIsRunning(legacyRunning);
            }
            if (parsed.setupTitle !== undefined) setSetupTitle(parsed.setupTitle);
            if (parsed.setupPlayers) setSetupPlayers(parsed.setupPlayers);
            if (parsed.noFoulDisplay !== undefined) setNoFoulDisplay(parsed.noFoulDisplay);
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

  // Debounced save (500ms trailing). elapsedSeconds deliberately omitted from deps so the
  // 1s tick does not re-trigger serialization; it persists via the 10s sweep effect below.
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;
    const id = setTimeout(() => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          screen,
          activeGame,
          setupTitle,
          setupPlayers,
          noFoulDisplay,
          elapsedSeconds,
          isRunning,
        })
      );
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, activeGame, setupTitle, setupPlayers, noFoulDisplay, isRunning, isInitialized]);

  // Stopwatch persistence sweep — every 10s while running, update only the stopwatch fields.
  useEffect(() => {
    if (!isInitialized || !isRunning || typeof window === 'undefined') return;
    const id = setInterval(() => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.elapsedSeconds = elapsedRef.current;
        parsed.isRunning = true;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }, 10000);
    return () => clearInterval(id);
  }, [isInitialized, isRunning]);

  // Stopwatch tick — only touches elapsedSeconds, leaving activeGame ref stable.
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((n) => n + 1);
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
      players: players.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        score: 0,
        isSelected: false,
        scoredBalls: [],
        foulAwardedPoints: 0,
      })),
      foulCount: 0,
      scoreHistory: [],
    };
    setActiveGame(newGame);
    setHistoryState({
      list: [newGame],
      index: 0,
    });
    setElapsedSeconds(0);
    setIsRunning(true);
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
      foulAwardedPoints: 0,
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
      const now = Date.now();
      const newScore = player.score + delta;
      return {
        ...prev,
        lastScoreUpdated: now,
        scoreHistory: prependScoreHistory(prev.scoreHistory || [], [
          { timestamp: now, playerId, previousScore: player.score, newScore },
        ]),
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
        scoreHistory: prependScoreHistory(prev.scoreHistory || [], newScoreChanges),
        players: updatedPlayers,
      };
    });
  }, [updateGame]);

  const toggleStopwatch = useCallback((running: boolean) => {
    setIsRunning(running);
  }, []);

  const endGame = useCallback(() => {
    setActiveGame(null);
    setHistoryState({ list: [], index: -1 });
    setIsRunning(false);
    setNoFoulDisplay(false);
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

  // ponytail: batched update for bulk edit dialog — validates color uniqueness across the entire
  // resulting roster atomically so legitimate swaps (e.g. Alice↔Bob) succeed while collisions reject.
  const bulkUpdatePlayers = useCallback(
    (updates: Record<string, { name?: string; color?: string }>): boolean => {
      let applied = false;
      updateGame((prev) => {
        const draft = prev.players.map((p) =>
          updates[p.id]
            ? {
                ...p,
                name: updates[p.id].name?.trim() || p.name,
                color: updates[p.id].color || p.color,
              }
            : p
        );
        const seen = new Set<string>();
        for (const p of draft) {
          const k = p.color.toLowerCase();
          if (seen.has(k)) return prev;
          seen.add(k);
        }
        applied = true;
        return { ...prev, players: draft };
      });
      return applied;
    },
    [updateGame]
  );

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
      const ballName = getBallNameByPoints(points, tab);

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
        const foulPoints = getFoulPoints(points, prev.players.length);

        const otherPlayers = prev.players.filter((p) => p.id !== currentPlayerId);
        if (otherPlayers.length > 0) {
          updatedPlayers = prev.players.map((p) => {
            if (p.id !== currentPlayerId) {
              newScoreChanges.push({ timestamp: now, playerId: p.id, previousScore: p.score, newScore: p.score + foulPoints, isFoul: true });
              return {
                ...p,
                score: p.score + foulPoints,
                foulAwardedPoints: (p.foulAwardedPoints || 0) + foulPoints,
              };
            }
            return p;
          });
        }
        updatedFoulCount += 1;
      }

      return {
        ...prev,
        lastScoreUpdated: now,
        scoreHistory: prependScoreHistory(prev.scoreHistory || [], newScoreChanges),
        latestBall: { playerName, type, ballName },
        players: updatedPlayers,
        foulCount: updatedFoulCount,
      };
    });
  }, [updateGame]);

  const restartGame = useCallback(() => {
    setActiveGame((prev) => {
      if (!prev) return null;
      const next: Game = {
        ...prev,
        lastScoreUpdated: undefined,
        foulCount: 0,
        latestBall: undefined,
        scoreHistory: [],
        players: prev.players.map((p) => ({
          ...p,
          score: 0,
          isSelected: false,
          scoredBalls: [],
          foulAwardedPoints: 0,
        })),
      };
      setHistoryState({
        list: [next],
        index: 0,
      });
      return next;
    });
    setElapsedSeconds(0);
    setIsRunning(true);
    setNoFoulDisplay(false);
  }, []);

  const toggleNoFoulDisplay = useCallback(() => {
    setNoFoulDisplay((v) => !v);
  }, []);

  const undo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.index <= 0) return prev;
      const nextIndex = prev.index - 1;
      setActiveGame(prev.list[nextIndex]);
      return { ...prev, index: nextIndex };
    });
  }, []);

  const redo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.index >= prev.list.length - 1) return prev;
      const nextIndex = prev.index + 1;
      setActiveGame(prev.list[nextIndex]);
      return { ...prev, index: nextIndex };
    });
  }, []);

  return {
    screen,
    activeGame,
    elapsedSeconds,
    isRunning,
    setupTitle,
    setupPlayers,
    isInitialized,
    noFoulDisplay,
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
    bulkUpdatePlayers,
    removePlayer,
    restartGame,
    recordBallClick,
    toggleNoFoulDisplay,
    undo,
    redo,
  };
}
