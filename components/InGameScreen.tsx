'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game, PALETTE, Player, getNonFoulScore } from '@/lib/gameTypes';
import { PlayerDialog } from '@/components/PlayerDialog';
import { Footer } from './Footer';
import { StopwatchBanner } from './StopwatchBanner';
import { PlayerCard } from './PlayerCard';
import { BulkActionBar } from './BulkActionBar';
import { GameHeader } from './ingame/GameHeader';
import { FoulCard } from './ingame/FoulCard';
import { LatestBallCard } from './ingame/LatestBallCard';
import { BulkRemoveDialog } from './ingame/dialogs/BulkRemoveDialog';
import { EndGameDialog } from './ingame/dialogs/EndGameDialog';
import { RestartGameDialog } from './ingame/dialogs/RestartGameDialog';
import { ShufflePlayersDialog } from './ingame/dialogs/ShufflePlayersDialog';

import { useRelativeTime } from '@/hooks/useRelativeTime';
import { listContainerVariants, listItemVariants, useReducedMotion, createSafeVariants } from '@/lib/animations';

export function InGameScreen({
  activeGame,
  elapsedSeconds,
  isRunning,
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
  onBulkUpdatePlayers,
  onRemovePlayer,
  onRestartGame,
  onRecordBallClick,
  noFoulDisplay,
  onToggleNoFoulDisplay,
  onShufflePlayers,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onViewHistory,
}: {
  activeGame: Game;
  elapsedSeconds: number;
  isRunning: boolean;
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
  onBulkUpdatePlayers?: (updates: Record<string, { name?: string; color?: string }>) => boolean;
  onRemovePlayer?: (playerId: string) => void;
  onRestartGame: () => void;
  onRecordBallClick: (playerId: string, points: number, tab: 'score' | 'foul') => void;
  noFoulDisplay: boolean;
  onToggleNoFoulDisplay: () => void;
  onShufflePlayers: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onViewHistory: () => void;
}) {
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [restartGameDialogOpen, setRestartGameDialogOpen] = useState(false);
  const [shufflePlayersDialogOpen, setShufflePlayersDialogOpen] = useState(false);
  const [openDrawerPlayerId, setOpenDrawerPlayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'score' | 'foul'>('score');
  const [editQueue, setEditQueue] = useState<Player[]>([]);
  const [editIndex, setEditIndex] = useState(0);
  const editSavedRef = useRef(false);
  const [bulkRemoveDialogOpen, setBulkRemoveDialogOpen] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const safeListVariants = useMemo(
    () => createSafeVariants(prefersReducedMotion, listItemVariants),
    [prefersReducedMotion]
  );
  const safeContainerVariants = useMemo(
    () => createSafeVariants(prefersReducedMotion, listContainerVariants),
    [prefersReducedMotion]
  );

  const relativeTimeText = useRelativeTime(activeGame?.lastScoreUpdated);

  const displayScores = useMemo<number[]>(
    () => (activeGame ? activeGame.players.map((p) => (noFoulDisplay ? getNonFoulScore(p) : p.score)) : []),
    [activeGame, noFoulDisplay]
  );
  const selectedPlayers = useMemo(
    () => (activeGame ? activeGame.players.filter((p) => p.isSelected) : []),
    [activeGame]
  );
  const selectedCount = selectedPlayers.length;

  const handleToggleDrawer = useCallback((playerId: string) => {
    setOpenDrawerPlayerId((curr) => {
      if (curr !== playerId) setActiveTab('score');
      return curr === playerId ? null : playerId;
    });
  }, []);

  if (!activeGame) return null;

  const maxScore = displayScores.length > 0 ? Math.max(...displayScores) : 0;
  const leaderIndex = displayScores.findIndex((s) => s === maxScore);

  const getFirstAvailableColor = () => {
    const usedColors = activeGame.players.map((p) => p.color.toLowerCase());
    const available = PALETTE.find((c) => !usedColors.includes(c.toLowerCase()));
    return available || PALETTE[0];
  };

  return (
    <div className="flex flex-col bg-[var(--app-background)] text-[var(--app-text-primary)] w-full max-w-[390px] mx-auto min-h-[100dvh] relative p-6 pt-[calc(24px+env(safe-area-inset-top))] gap-6">
      <h1 className="sr-only" data-testid="in-game-screen-heading">In-Game Screen</h1>

      <div className="flex flex-col gap-6 flex-1">
        <GameHeader
          title={activeGame.title}
          onSaveTitle={onUpdateGameTitle}
          onViewHistory={onViewHistory}
          onAddPlayer={() => setAddPlayerDialogOpen(true)}
          addPlayerDisabled={activeGame.players.length >= 10}
          onShufflePlayers={() => setShufflePlayersDialogOpen(true)}
          shuffleDisabled={activeGame.players.length <= 1}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onRestart={() => setRestartGameDialogOpen(true)}
          onEndGame={() => setEndGameDialogOpen(true)}
          noFoulDisplay={noFoulDisplay}
          onToggleNoFoulDisplay={onToggleNoFoulDisplay}
        />

        <StopwatchBanner
          elapsedSeconds={elapsedSeconds}
          isRunning={isRunning}
          onToggleStopwatch={onToggleStopwatch}
        />

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <FoulCard count={activeGame.foulCount || 0} />
          <LatestBallCard latestBall={activeGame.latestBall} />
        </div>

        <div
          className={`flex flex-col gap-3 pr-1 transition-all ${
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
                      displayScore={displayScores[index]}
                      isDrawerOpen={openDrawerPlayerId === player.id}
                      onToggleDrawer={handleToggleDrawer}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onTogglePlayerSelection={onTogglePlayerSelection}
                      onUpdateScore={onUpdateScore}
                      onBallClick={onRecordBallClick}
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

      <Footer relativeTimeText={relativeTimeText} />

      <AnimatePresence>
        {selectedCount >= 1 && (
          <BulkActionBar
            onDeselectAllPlayers={onDeselectAllPlayers}
            onReversePlayerSelection={onReversePlayerSelection}
            onBulkEditPlayers={() => {
              setEditQueue(selectedPlayers);
              setEditIndex(0);
              editSavedRef.current = false;
            }}
            onBulkRemove={() => setBulkRemoveDialogOpen(true)}
            onBulkUpdateScores={onBulkUpdateScores}
          />
        )}
      </AnimatePresence>

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

      {editIndex < editQueue.length && (() => {
        const editingPlayer = editQueue[editIndex];
        const livePlayer = activeGame.players.find((p) => p.id === editingPlayer.id) || editingPlayer;
        return (
          <PlayerDialog
            key={editingPlayer.id}
            isOpen={editIndex < editQueue.length}
            onClose={() => {
              if (editSavedRef.current) {
                editSavedRef.current = false;
                setEditIndex((i) => i + 1);
              } else {
                setEditQueue([]);
                setEditIndex(0);
              }
            }}
            onSave={(name, color) => {
              if (onBulkUpdatePlayers) {
                onBulkUpdatePlayers({ [editingPlayer.id]: { name, color } });
              } else if (onUpdatePlayerName) {
                onUpdatePlayerName(editingPlayer.id, name);
              }
              editSavedRef.current = true;
            }}
            title={`Edit Player (${editIndex + 1} of ${editQueue.length})`}
            initialName={livePlayer.name}
            initialColor={livePlayer.color}
            usedColors={activeGame.players
              .filter((p) => p.id !== editingPlayer.id)
              .map((p) => p.color)}
          />
        );
      })()}

      <BulkRemoveDialog
        open={bulkRemoveDialogOpen}
        onOpenChange={setBulkRemoveDialogOpen}
        players={selectedPlayers}
        onConfirm={() => {
          selectedPlayers.forEach((player) => {
            if (onRemovePlayer) {
              onRemovePlayer(player.id);
            }
          });
          setBulkRemoveDialogOpen(false);
          setActiveTab('score');
          setOpenDrawerPlayerId(null);
        }}
      />

      <EndGameDialog
        open={endGameDialogOpen}
        onOpenChange={setEndGameDialogOpen}
        onConfirm={onEndGame}
      />

      <RestartGameDialog
        open={restartGameDialogOpen}
        onOpenChange={setRestartGameDialogOpen}
        onConfirm={() => {
          onRestartGame();
          setRestartGameDialogOpen(false);
        }}
      />

      <ShufflePlayersDialog
        open={shufflePlayersDialogOpen}
        onOpenChange={setShufflePlayersDialogOpen}
        onConfirm={() => {
          onShufflePlayers();
          setShufflePlayersDialogOpen(false);
        }}
      />
    </div>
  );
}
