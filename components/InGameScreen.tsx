'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game, PALETTE } from '@/hooks/useGameState';
import { PlayerDialog } from '@/components/PlayerDialog';
import { Footer } from './Footer';
import { StopwatchBanner } from './StopwatchBanner';
import { PlayerCard } from './PlayerCard';
import { BulkActionBar } from './BulkActionBar';

import { Gamepad, UserPlus, Check, RotateCcw, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { listContainerVariants, listItemVariants, useReducedMotion, createSafeVariants } from '@/lib/animations';

export const GamepadIcon = () => (
  <Gamepad className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
);

const PersonPlusIcon = () => (
  <UserPlus className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
);

const CheckIcon = () => (
  <Check className="w-6 h-6 text-[var(--app-success)]" strokeWidth={2.5} />
);

const RotateCcwIcon = () => (
  <RotateCcw className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
);

const HistoryIcon = () => (
  <History className="w-3.5 h-3.5" strokeWidth={2.5} />
);

// ponytail: map ballName and type back to styling properties to draw the styled ball visual
const getBallStyle = (ballName: string, type: 'Score' | 'Foul') => {
  if (type === 'Foul') {
    if (ballName === 'Cue/Red/Yellow/Green/Brown') {
      return {
        label: '4',
        background: 'conic-gradient(var(--app-snooker-red) 0deg 90deg, var(--app-snooker-yellow) 90deg 180deg, var(--app-snooker-green) 180deg 270deg, var(--app-snooker-brown) 270deg 360deg)',
        labelColor: '#000000',
      };
    }
    if (ballName === 'Blue') return { label: '5', color: 'var(--app-snooker-blue)', labelColor: '#ffffff' };
    if (ballName === 'Pink') return { label: '6', color: 'var(--app-snooker-pink)', labelColor: '#ffffff' };
    if (ballName === 'Black') return { label: '7', color: 'var(--app-snooker-black)', labelColor: '#ffffff' };
  }

  switch (ballName) {
    case 'White': return { label: 'W', color: 'var(--app-snooker-white)', labelColor: '#000000' };
    case 'Red': return { label: '1', color: 'var(--app-snooker-red)', labelColor: '#ffffff' };
    case 'Yellow': return { label: '2', color: 'var(--app-snooker-yellow)', labelColor: '#000000' };
    case 'Green': return { label: '3', color: 'var(--app-snooker-green)', labelColor: '#ffffff' };
    case 'Brown': return { label: '4', color: 'var(--app-snooker-brown)', labelColor: '#ffffff' };
    case 'Blue': return { label: '5', color: 'var(--app-snooker-blue)', labelColor: '#ffffff' };
    case 'Pink': return { label: '6', color: 'var(--app-snooker-pink)', labelColor: '#ffffff' };
    case 'Black': return { label: '7', color: 'var(--app-snooker-black)', labelColor: '#ffffff' };
    default: return { label: '—', color: 'var(--app-text-secondary)', labelColor: '#ffffff' };
  }
};

export function InGameScreen({
  activeGame,
  onUpdateGameTitle,
  onAddPlayerInGame,
  onUpdateScore,
  onTogglePlayerSelection,
  onBulkUpdateScores,
  onDeselectAllPlayers,
  onReversePlayerSelection,
  onToggleStopwatch,
  onEndGame,
  onUpdatePlayerName,
  onRemovePlayer,
  onIncrementFoulCount,
  onRestartGame,
  onUpdateLatestBall,
}: {
  activeGame: Game;
  onUpdateGameTitle: (title: string) => void;
  onAddPlayerInGame: (name: string, color: string) => boolean;
  onUpdateScore: (playerId: string, delta: number) => void;
  onTogglePlayerSelection: (playerId: string) => void;
  onBulkUpdateScores: (delta: number) => void;
  onDeselectAllPlayers: () => void;
  onReversePlayerSelection: () => void;
  onToggleStopwatch: (running: boolean) => void;
  onEndGame: () => void;
  onUpdatePlayerName?: (playerId: string, newName: string) => void;
  onRemovePlayer?: (playerId: string) => void;
  onIncrementFoulCount: () => void;
  onRestartGame: () => void;
  onUpdateLatestBall: (playerName: string, type: 'Score' | 'Foul', ballName: string) => void;
}) {
  const [prevTitle, setPrevTitle] = useState(activeGame?.title || '');
  const [tempTitle, setTempTitle] = useState(activeGame?.title || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [restartGameDialogOpen, setRestartGameDialogOpen] = useState(false);
  const [openDrawerPlayerId, setOpenDrawerPlayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'score' | 'foul'>('score');
  const [bulkEditNameDialogOpen, setBulkEditNameDialogOpen] = useState(false);
  const [bulkRemoveDialogOpen, setBulkRemoveDialogOpen] = useState(false);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const prefersReducedMotion = useReducedMotion();
  const safeListVariants = createSafeVariants(prefersReducedMotion, listItemVariants);
  const safeContainerVariants = createSafeVariants(prefersReducedMotion, listContainerVariants);

  // Sync tempTitle when activeGame.title changes (e.g. from state loads/updates)
  if (activeGame && activeGame.title !== prevTitle) {
    setPrevTitle(activeGame.title);
    setTempTitle(activeGame.title);
  }

  // Time tracking states and effects
  // ponytail: use initializer function to prevent impure render call warning
  const [now, setNow] = useState(() => Date.now());

  const lastScoreUpdated = activeGame?.lastScoreUpdated;

  // Tick relative time every 10 seconds
  useEffect(() => {
    if (!lastScoreUpdated) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, [lastScoreUpdated]);

  // Sync now immediately when lastScoreUpdated changes
  useEffect(() => {
    if (lastScoreUpdated) {
      // ponytail: setNow in a microtask/timeout to prevent synchronous state change warning during render cycles
      const handle = setTimeout(() => {
        setNow(Date.now());
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [lastScoreUpdated]);

  if (!activeGame) return null;

  // Leader Calculation
  const maxScore = activeGame.players.length > 0 ? Math.max(...activeGame.players.map((p) => p.score)) : 0;
  const leaderIndex = activeGame.players.findIndex((p) => p.score === maxScore);

  const selectedCount = activeGame.players.filter((p) => p.isSelected).length;

  const getRelativeTimeString = (timestamp: number, current: number) => {
    const diffMs = current - timestamp;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHrs = Math.floor(diffMins / 60);

    if (diffSecs < 10) {
      return 'just now';
    }
    if (diffSecs < 60) {
      return `${diffSecs} seconds ago`;
    }
    if (diffMins === 1) {
      return '1 minute ago';
    }
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    }
    if (diffHrs === 1) {
      return '1 hour ago';
    }
    return `${diffHrs} hours ago`;
  };

  const relativeTimeText = lastScoreUpdated
    ? getRelativeTimeString(lastScoreUpdated, now)
    : null;

  const handleSaveTitle = () => {
    const trimmed = tempTitle.trim();
    if (trimmed) {
      onUpdateGameTitle(trimmed);
    } else {
      setTempTitle(activeGame.title);
    }
    setIsEditingTitle(false);
  };

  const getFirstAvailableColor = () => {
    const usedColors = activeGame.players.map((p) => p.color.toLowerCase());
    const available = PALETTE.find((c) => !usedColors.includes(c.toLowerCase()));
    return available || PALETTE[0];
  };

  const handleBallClick = (currentPlayerId: string, points: number, tab: 'score' | 'foul') => {
    const player = activeGame.players.find((p) => p.id === currentPlayerId);
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
    onUpdateLatestBall(playerName, type, ballName);

    if (tab === 'score') {
      onUpdateScore(currentPlayerId, points);
    } else {
      // Foul tab: Give points to all OTHER players
      // ponytail: 2 points for 4-point fouls when >2 players, otherwise standard values
      const isFourPointFoul = points === 4;
      const hasMultiplePlayers = activeGame.players.length > 2;
      const foulPoints = (isFourPointFoul && hasMultiplePlayers) ? 2 : Math.max(points, 4);

      const otherPlayers = activeGame.players
        .filter((p) => p.id !== currentPlayerId)
        .map((p) => p.id);

      if (otherPlayers.length > 0) {
        otherPlayers.forEach((playerId) => {
          onUpdateScore(playerId, foulPoints);
        });
      }
      onIncrementFoulCount();
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[var(--app-background)] text-[var(--app-text-primary)] w-full max-w-[390px] mx-auto min-h-screen relative p-6 pt-[calc(24px+env(safe-area-inset-top))] justify-between">
      <h1 className="sr-only" data-testid="in-game-screen-heading">In-Game Screen</h1>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GamepadIcon />
            {isEditingTitle ? (
              <Input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTitle();
                  }
                }}
                placeholder="Enter game title"
                maxLength={40}
                autoFocus
                aria-label="Edit game title"
                className="w-full font-extrabold text-xl tracking-tight text-[var(--app-text-primary)] bg-transparent border-b-2 border-[var(--app-brand)] focus:outline-none focus:ring-0 p-0"
              />
            ) : (
              <Button
                onClick={() => {
                  setTempTitle(activeGame.title);
                  setIsEditingTitle(true);
                }}
                aria-label="Edit game title"
                variant="ghost"
                className="text-left font-extrabold text-xl tracking-tight text-[var(--app-text-primary)] hover:text-[var(--app-brand)] transition-colors break-words max-w-[180px] p-0 h-auto"
              >
                {activeGame.title}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setAddPlayerDialogOpen(true)}
              data-testid="add-player-ingame-button"
              disabled={activeGame.players.length >= 10}
              aria-label="Add player mid-game"
              variant="outline"
              className="p-2 bg-[var(--app-card-background)] hover:bg-[var(--app-background)] rounded-xl shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              size="icon"
            >
              <PersonPlusIcon />
            </Button>
            <Button
              onClick={() => setRestartGameDialogOpen(true)}
              data-testid="restart-game-button"
              aria-label="Reset game session"
              variant="outline"
              className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl shadow-sm active:scale-95"
              size="icon"
            >
              <RotateCcwIcon />
            </Button>
            <Button
              onClick={() => setEndGameDialogOpen(true)}
              data-testid="end-game-button"
              aria-label="End Game"
              variant="outline"
              className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl shadow-sm active:scale-95"
              size="icon"
            >
              <CheckIcon />
            </Button>
          </div>
        </div>

        {/* Stopwatch Banner */}
        <StopwatchBanner
          elapsedSeconds={activeGame.elapsedSeconds}
          isRunning={activeGame.isRunning}
          onToggleStopwatch={onToggleStopwatch}
        />

        {/* Stats Cards Section */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <Card
            className="bg-[var(--app-card-background)] rounded-[20px] border-none shadow-sm flex flex-col justify-center p-4"
            aria-live="polite"
          >
            <CardContent className="p-0 flex flex-col items-center justify-center text-center">
              <span className="text-[var(--app-text-secondary)] text-[10px] font-black tracking-wider uppercase mb-1">
                Fouls
              </span>
              <span
                className="text-3xl font-black text-[var(--app-danger)]"
                data-testid="foul-counter"
              >
                {activeGame.foulCount || 0}
              </span>
            </CardContent>
          </Card>
          <Card
            className="bg-[var(--app-card-background)] rounded-[20px] border-none shadow-sm flex flex-col justify-center p-4"
            aria-live="polite"
          >
            <CardContent className="p-0 flex flex-col items-center justify-center text-center">
              {activeGame.latestBall ? (
                (() => {
                  const ballStyle = getBallStyle(activeGame.latestBall.ballName, activeGame.latestBall.type);
                  return (
                    <>
                      <span
                        className="text-[var(--app-text-secondary)] text-[10px] font-black tracking-wider uppercase mb-1 truncate max-w-full px-1"
                        data-testid="latest-ball-label"
                      >
                        {activeGame.latestBall.playerName} ({activeGame.latestBall.type})
                      </span>
                      <div
                        className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-md select-none"
                        style={
                          ballStyle.background
                            ? { background: ballStyle.background }
                            : { backgroundColor: ballStyle.color }
                        }
                        data-testid="latest-ball-visual"
                      >
                        {ballStyle.background ? (
                          <div className="absolute inset-[3.5px] rounded-full bg-white flex items-center justify-center shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.15)]">
                            <span className="text-xs font-black text-black">{ballStyle.label}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-black" style={{ color: ballStyle.labelColor }}>
                            {ballStyle.label}
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  <span className="text-[var(--app-text-secondary)] text-[10px] font-black tracking-wider uppercase mb-1">
                    Stats
                  </span>
                  <span className="text-3xl font-black text-[var(--app-text-secondary)]">
                    —
                  </span>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scrollable Player Cards List */}
        <div
          className={`flex flex-col gap-3 overflow-y-auto no-scrollbar pr-1 transition-all ${
            selectedCount >= 1 ? 'pb-24' : 'pb-6'
          }`}
        >
          {activeGame.players.length === 0 ? (
            <div className="text-center py-8 text-[var(--app-text-secondary)] text-sm font-medium">
              No players in game.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                variants={safeContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {activeGame.players.map((player, index) => {
                  const isLeader = index === leaderIndex;
                  return (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      index={index}
                      isLeader={isLeader}
                      isDrawerOpen={openDrawerPlayerId === player.id}
                      onToggleDrawer={() => {
                        if (openDrawerPlayerId !== player.id) {
                          setActiveTab('score');
                        }
                        setOpenDrawerPlayerId(openDrawerPlayerId === player.id ? null : player.id);
                      }}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onTogglePlayerSelection={onTogglePlayerSelection}
                      onUpdateScore={onUpdateScore}
                      onBallClick={handleBallClick}
                      prefersReducedMotion={prefersReducedMotion}
                      safeListVariants={safeListVariants}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </div>

      {/* ponytail: keep Last Score Updated visible by fixing it above the relative footer */}
      {relativeTimeText && (
        <div
          aria-live="polite"
          className="flex items-center justify-center gap-1.5 text-xs text-[var(--app-text-secondary)] font-semibold select-none mt-4 mb-2 shrink-0"
          data-testid="last-score-updated"
        >
          <HistoryIcon />
          <span>Last score updated: {relativeTimeText}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-brand)] animate-pulse" />
        </div>
      )}

      <Footer />

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedCount >= 1 && (
          <BulkActionBar
            onDeselectAllPlayers={onDeselectAllPlayers}
            onReversePlayerSelection={onReversePlayerSelection}
            onBulkEditName={() => setBulkEditNameDialogOpen(true)}
            onBulkRemove={() => setBulkRemoveDialogOpen(true)}
            onBulkUpdateScores={onBulkUpdateScores}
          />
        )}
      </AnimatePresence>

      {/* Add Player Dialog mid-game */}
      {addPlayerDialogOpen && (
        <PlayerDialog
          isOpen={addPlayerDialogOpen}
          onClose={() => setAddPlayerDialogOpen(false)}
          onSave={(name, color) => {
            onAddPlayerInGame(name, color);
          }}
          title="Add Player"
          initialName=""
          initialColor={getFirstAvailableColor()}
          usedColors={activeGame.players.map((p) => p.color)}
        />
      )}

      {/* Bulk Edit Name Dialog */}
      <Dialog
        open={bulkEditNameDialogOpen}
        onOpenChange={(open) =>
          !open &&
          (() => {
            setBulkEditNameDialogOpen(false);
            setEditedNames({});
          })()
        }
      >
        <DialogContent className="bg-[var(--app-card-background)] w-full max-w-[360px] rounded-3xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
              Edit {selectedCount} Player Names
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form to edit the names of selected players.
            </DialogDescription>
          </DialogHeader>

          {/* Selected Players List */}
          <div className="flex flex-col gap-2 mb-4 max-h-[40vh] overflow-y-auto">
            {activeGame.players
              .filter((p) => p.isSelected)
              .map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 bg-[var(--app-background)] p-3 rounded-xl"
                >
                  <div
                    style={{ backgroundColor: `${player.color}15` }}
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  >
                    <span style={{ color: player.color }} className="font-bold text-sm">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Input
                    type="text"
                    value={editedNames[player.id] || player.name}
                    onChange={(e) =>
                      setEditedNames((prev) => ({
                        ...prev,
                        [player.id]: e.target.value,
                      }))
                    }
                    placeholder="Enter name"
                    maxLength={20}
                    className="flex-1 bg-transparent border-none focus:outline-none font-bold text-[var(--app-text-primary)] shadow-none"
                  />
                </div>
              ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setBulkEditNameDialogOpen(false);
                setEditedNames({});
              }}
              variant="secondary"
              className="flex-1 py-3 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-bold rounded-2xl active:scale-98"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                Object.entries(editedNames).forEach(([playerId, newName]) => {
                  if (newName.trim() && onUpdatePlayerName) {
                    onUpdatePlayerName(playerId, newName.trim());
                  }
                });
                setBulkEditNameDialogOpen(false);
                setEditedNames({});
              }}
              className="flex-1 py-3 h-auto bg-[var(--app-brand)] text-white font-bold rounded-2xl active:scale-98"
            >
              Save {selectedCount} Names
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Remove Confirmation Dialog */}
      <Dialog open={bulkRemoveDialogOpen} onOpenChange={(open) => !open && setBulkRemoveDialogOpen(false)}>
        <DialogContent className="bg-[var(--app-card-background)] w-full max-w-[340px] rounded-3xl p-6 shadow-xl text-center">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
              Remove {selectedCount} Player{selectedCount > 1 ? 's' : ''}?
            </DialogTitle>
            <DialogDescription className="sr-only">
              Are you sure you want to remove the selected players?
            </DialogDescription>
          </DialogHeader>

          {/* List of players to be removed */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {activeGame.players
              .filter((p) => p.isSelected)
              .map((player) => (
                <div
                  key={player.id}
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name}
                </div>
              ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                const selectedIds = activeGame.players
                  .filter((p) => p.isSelected)
                  .map((p) => p.id);

                selectedIds.forEach((playerId) => {
                  if (onRemovePlayer) {
                    onRemovePlayer(playerId);
                  }
                });

                setBulkRemoveDialogOpen(false);
                setActiveTab('score');
                setOpenDrawerPlayerId(null);
              }}
              className="w-full py-3.5 h-auto bg-[var(--app-danger)] text-white font-extrabold rounded-2xl active:scale-98"
            >
              Yes, Remove {selectedCount} Player{selectedCount > 1 ? 's' : ''}
            </Button>
            <Button
              onClick={() => setBulkRemoveDialogOpen(false)}
              variant="secondary"
              className="w-full py-3.5 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-extrabold rounded-2xl active:scale-98"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom End Game confirmation modal */}
      <Dialog open={endGameDialogOpen} onOpenChange={(open) => !open && setEndGameDialogOpen(false)}>
        <DialogContent className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-xl text-center">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-lg text-[#1A1A2E]">
              Are you sure you want to end the game?
            </DialogTitle>
            <DialogDescription className="sr-only">
              This will finish the session and log final scores.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button
              onClick={onEndGame}
              className="w-full py-3.5 h-auto bg-[var(--app-danger)] text-white font-extrabold rounded-2xl active:scale-98"
            >
              Yes, End Game
            </Button>
            <Button
              onClick={() => setEndGameDialogOpen(false)}
              variant="secondary"
              className="w-full py-3.5 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-extrabold rounded-2xl active:scale-98"
            >
              No, Keep Playing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restart Game confirmation modal */}
      <Dialog open={restartGameDialogOpen} onOpenChange={(open) => !open && setRestartGameDialogOpen(false)}>
        <DialogContent className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-xl text-center">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-lg text-[#1A1E2A]">
              Reset game session?
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--app-text-secondary)] font-medium mb-4">
              This will reset all scores, stopwatch, and fouls. Current players will be kept.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                onRestartGame();
                setRestartGameDialogOpen(false);
              }}
              className="w-full py-3.5 h-auto bg-[var(--app-brand)] text-white font-extrabold rounded-2xl active:scale-98"
            >
              Yes, Reset Game
            </Button>
            <Button
              onClick={() => setRestartGameDialogOpen(false)}
              variant="secondary"
              className="w-full py-3.5 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-extrabold rounded-2xl active:scale-98"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
