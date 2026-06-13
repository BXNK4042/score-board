'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game, PALETTE } from '@/hooks/useGameState';
import { PlayerDialog } from '@/components/PlayerDialog';
import { Gamepad, UserPlus, Check, Play, Pause, X, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { listContainerVariants, listItemVariants, leaderPulseVariants, useReducedMotion, createSafeVariants } from '@/lib/animations';

export const GamepadIcon = () => (
  <Gamepad className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
);

const PersonPlusIcon = () => (
  <UserPlus className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
);

const CheckIcon = () => (
  <Check className="w-6 h-6 text-[var(--app-success)]" strokeWidth={2.5} />
);

const PlayIcon = ({ className = "w-5 h-5" }) => (
  <Play className={className} fill="currentColor" />
);

const PauseIcon = ({ className = "w-5 h-5" }) => (
  <Pause className={className} fill="currentColor" />
);

const DeselectIcon = ({ className = "w-5 h-5" }) => (
  <X className={className} strokeWidth={2} />
);

const ReverseIcon = ({ className = "w-5 h-5" }) => (
  <RefreshCw className={className} strokeWidth={2} />
);

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
}) {
  const [prevTitle, setPrevTitle] = useState(activeGame?.title || '');
  const [tempTitle, setTempTitle] = useState(activeGame?.title || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [openDrawerPlayerId, setOpenDrawerPlayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'score' | 'foul'>('score');
  const [bulkEditNameDialogOpen, setBulkEditNameDialogOpen] = useState(false);
  const [bulkRemoveDialogOpen, setBulkRemoveDialogOpen] = useState(false);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const prefersReducedMotion = useReducedMotion();
  const safeListVariants = createSafeVariants(prefersReducedMotion, listItemVariants);
  const safeContainerVariants = createSafeVariants(prefersReducedMotion, listContainerVariants);

  // Close drawer when game ends
  useEffect(() => {
    if (!activeGame) {
      setOpenDrawerPlayerId(null);
    }
  }, [activeGame]);

  // Snooker ball configuration
  const SNOOKER_BALLS = [
    { name: 'White', points: 0, color: '#FFFFFF', label: 'W' },
    { name: 'Red', points: 1, color: '#CC0000', label: '1' },
    { name: 'Yellow', points: 2, color: '#FFD700', label: '2' },
    { name: 'Green', points: 3, color: '#228B22', label: '3' },
    { name: 'Brown', points: 4, color: '#8B4513', label: '4' },
    { name: 'Blue', points: 5, color: '#0000CD', label: '5' },
    { name: 'Pink', points: 6, color: '#FF69B4', label: '6' },
    { name: 'Black', points: 7, color: '#000000', label: '7' },
  ] as const;

  // Sync tempTitle when activeGame.title changes (e.g. from state loads/updates)
  if (activeGame && activeGame.title !== prevTitle) {
    setPrevTitle(activeGame.title);
    setTempTitle(activeGame.title);
  }

  if (!activeGame) return null;

  // Leader Calculation
  // Ties: first player in list wins the label
  const maxScore = activeGame.players.length > 0 ? Math.max(...activeGame.players.map((p) => p.score)) : 0;
  const leaderIndex = activeGame.players.findIndex((p) => p.score === maxScore);

  const selectedCount = activeGame.players.filter((p) => p.isSelected).length;

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

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  const handleBallClick = (currentPlayerId: string, points: number, tab: 'score' | 'foul') => {
    if (tab === 'score') {
      // Score tab: Add points to current player
      onUpdateScore(currentPlayerId, points);
    } else {
      // Foul tab: Give points to all OTHER players (min 4 points)
      const foulPoints = Math.max(points, 4); // Minimum 4 points for fouls
      const otherPlayers = activeGame.players
        .filter(p => p.id !== currentPlayerId)
        .map(p => p.id);

      // Update each other player individually
      if (otherPlayers.length > 0) {
        otherPlayers.forEach(playerId => {
          onUpdateScore(playerId, foulPoints);
        });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[var(--app-background)] text-[var(--app-text-primary)] w-full max-w-[390px] mx-auto min-h-screen relative p-6 justify-between">
      {/* sr-only heading for tests */}
      <h1 className="sr-only" data-testid="in-game-screen-heading">In-Game Screen</h1>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 gap-2">
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
        <div className="bg-[var(--app-brand)] text-white p-4 rounded-[20px] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--app-success)] animate-pulse" />
            <span className="text-xs font-extrabold tracking-wider">LIVE SESSION</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="timer-display font-mono text-2xl font-black tracking-wider" data-testid="stopwatch-display">
              {formatTime(activeGame.elapsedSeconds)}
            </span>
            <Button
              onClick={() => onToggleStopwatch(!activeGame.isRunning)}
              data-testid="stopwatch-toggle"
              aria-label={activeGame.isRunning ? "Pause stopwatch" : "Start stopwatch"}
              variant="ghost"
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full"
              size="icon"
            >
              {activeGame.isRunning ? (
                <PauseIcon className="w-5 h-5 text-white" />
              ) : (
                <PlayIcon className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Scrollable Player Cards List */}
        <div
          className={`flex flex-col gap-3 overflow-y-auto pr-1 transition-all ${
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
                    <motion.div
                      key={player.id}
                      variants={safeListVariants}
                      layout
                    >
                      <Card
                        data-testid={`player-card-${player.id}`}
                        onClick={() => {
                          if (openDrawerPlayerId !== player.id) {
                            setActiveTab('score');
                          }
                          setOpenDrawerPlayerId(openDrawerPlayerId === player.id ? null : player.id);
                        }}
                        style={{
                          borderColor: player.isSelected ? 'var(--app-selection)' : 'transparent',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                        }}
                        className="bg-[var(--app-card-background)] p-4 rounded-[20px] shadow-sm flex flex-col gap-2 relative transition-all cursor-pointer hover:shadow-md"
                      >
                  <CardContent className="p-0 flex flex-col gap-2">
                    {/* Top Row: Role Label & Selection Circle / Selected Pill */}
                    <div className="flex items-center justify-between">
                      <div>
                        {isLeader ? (
                          <motion.span
                            style={{ color: player.color }}
                            className="font-extrabold text-[11px] uppercase tracking-wider"
                            animate={prefersReducedMotion ? {} : {
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 0.5,
                              times: [0, 0.5, 1],
                            }}
                          >
                            LEADER
                          </motion.span>
                        ) : (
                          <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--app-text-secondary)]">
                            PLAYER {index + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {player.isSelected && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[var(--app-selection)] text-white rounded-full">
                            SELECTED
                          </span>
                        )}
                        <Checkbox
                          data-testid={`player-select-${player.id}`}
                          checked={player.isSelected}
                          onCheckedChange={() => onTogglePlayerSelection(player.id)}
                          aria-label={`Select ${player.name} for bulk action`}
                          className="w-5 h-5 rounded-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                  {/* Middle Row: Avatar + Name & Score with Adjust Buttons */}
                  <div className="flex items-center justify-between">
                    {/* Left: Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: `${player.color}15` }}
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      >
                        <span style={{ color: player.color }} className="font-extrabold text-sm">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-extrabold text-base text-[var(--app-text-primary)]">{player.name}</span>
                    </div>

                    {/* Right: Score and +/- Controls */}
                    <div className="flex items-center gap-4">
                      {/* Decrement */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateScore(player.id, -1);
                        }}
                        data-testid={`score-decrement-${player.id}`}
                        aria-label={`Decrease score for ${player.name}`}
                        variant="outline"
                        className="w-10 h-10 rounded-full bg-[var(--app-background)] flex items-center justify-center font-extrabold text-lg text-[var(--app-text-primary)] hover:bg-[var(--app-border)] active:scale-95 p-0"
                        size="icon"
                      >
                        −
                      </Button>

                      {/* Large Score Display with aria-live */}
                      <motion.div
                        key={player.score}
                        aria-live="polite"
                        data-testid={`player-score-${player.id}`}
                        className="text-5xl font-black min-w-[60px] text-center"
                        style={{ color: player.color }}
                        initial={prefersReducedMotion ? {} : { scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          damping: 15,
                          stiffness: 200,
                        }}
                      >
                        {player.score}
                      </motion.div>

                      {/* Increment */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateScore(player.id, 1);
                        }}
                        data-testid={`score-increment-${player.id}`}
                        aria-label={`Increase score for ${player.name}`}
                        style={{ backgroundColor: player.color }}
                        variant="default"
                        className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg text-white hover:opacity-90 active:scale-95 p-0"
                        size="icon"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Snooker Scoring Drawer */}
                  <AnimatePresence>
                    {openDrawerPlayerId === player.id && (
                      <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 rounded-2xl shadow-lg overflow-hidden"
                        style={{
                          backgroundColor: `${player.color}15`,
                          border: `2px solid ${player.color}40`
                        }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          bounce: 0,
                          duration: 0.5,
                        }}
                      >
                      {/* Drawer Header */}
                      <div className="bg-[var(--app-card-background)] p-3 border-b" style={{ borderColor: `${player.color}30` }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-extrabold text-sm" style={{ color: player.color }}>
                            Ball Score
                          </h4>
                          <Button
                            onClick={() => {
                              setActiveTab('score');
                              setOpenDrawerPlayerId(null);
                            }}
                            variant="ghost"
                            className="text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] p-0 h-auto"
                          >
                            ✕
                          </Button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setActiveTab('score')}
                            variant="ghost"
                            className={`flex-1 py-2 px-3 h-auto rounded-lg font-bold text-xs transition-colors ${
                              activeTab === 'score'
                                ? 'text-white'
                                : 'text-[var(--app-text-secondary)]'
                            }`}
                            style={{
                              backgroundColor: activeTab === 'score' ? player.color : 'transparent'
                            }}
                          >
                            Score
                          </Button>
                          <Button
                            onClick={() => setActiveTab('foul')}
                            variant="ghost"
                            className={`flex-1 py-2 px-3 h-auto rounded-lg font-bold text-xs transition-colors ${
                              activeTab === 'foul'
                                ? 'text-white'
                                : 'text-[var(--app-text-secondary)]'
                            }`}
                            style={{
                              backgroundColor: activeTab === 'foul' ? player.color : 'transparent'
                            }}
                          >
                            Foul
                          </Button>
                        </div>
                      </div>

                      {/* Ball Grid */}
                      <div className="p-3">
                        <div className="grid grid-cols-4 gap-2">
                          {SNOOKER_BALLS.map((ball) => (
                            <button
                              key={ball.name}
                              onClick={() => handleBallClick(player.id, ball.points, activeTab)}
                              className="aspect-square rounded-full flex flex-col items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              style={{ backgroundColor: ball.color }}
                              aria-label={`${ball.name} ball - ${ball.points} points`}
                            >
                              <span className="text-xs font-black" style={{
                                color: ball.name === 'White' || ball.name === 'Yellow' ? '#000' : '#fff'
                              }}>
                                {ball.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                  </motion.div>
                  )}
                </AnimatePresence>
                </CardContent>
                </Card>
              </motion.div>
              );
              })}
            </motion.div>
          </AnimatePresence>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedCount >= 1 && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[342px] bg-[var(--app-text-primary)] text-white p-4 rounded-3xl shadow-xl flex items-center justify-between z-40"
            data-testid="bulk-action-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
          >
          <Button
            onClick={onDeselectAllPlayers}
            data-testid="bulk-deselect-all"
            aria-label="Deselect all players"
            variant="ghost"
            className="p-2 hover:bg-white/10 rounded-full"
            size="icon"
          >
            <DeselectIcon />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={onReversePlayerSelection}
              data-testid="bulk-reverse-selection"
              aria-label="Reverse selection"
              variant="ghost"
              className="p-2 hover:bg-white/10 rounded-full"
              size="icon"
            >
              <ReverseIcon />
            </Button>
            <Button
              onClick={() => setBulkEditNameDialogOpen(true)}
              data-testid="bulk-edit-name"
              aria-label="Edit selected player names"
              variant="ghost"
              className="p-2 hover:bg-white/10 rounded-full"
              size="icon"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setBulkRemoveDialogOpen(true)}
              data-testid="bulk-remove"
              aria-label="Remove selected players"
              variant="ghost"
              className="p-2 hover:bg-white/10 rounded-full"
              size="icon"
            >
              <Trash2 className="w-5 h-5 text-[var(--app-danger)]" />
            </Button>
            <Button
              onClick={() => onBulkUpdateScores(-1)}
              data-testid="bulk-decrement"
              aria-label="Bulk decrement score"
              variant="outline"
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white hover:bg-white/30 active:scale-95 p-0"
              size="icon"
            >
              −
            </Button>
            <Button
              onClick={() => onBulkUpdateScores(1)}
              data-testid="bulk-increment"
              aria-label="Bulk increment score"
              variant="outline"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#1A1A2E] hover:bg-white/90 active:scale-95 p-0"
              size="icon"
            >
                +
              </Button>
            </div>
        </motion.div>
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
      <Dialog open={bulkEditNameDialogOpen} onOpenChange={(open) => !open && (() => {
        setBulkEditNameDialogOpen(false);
        setEditedNames({});
      })()}>
        <DialogContent className="bg-[var(--app-card-background)] w-full max-w-[360px] rounded-3xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
              Edit {selectedCount} Player Names
            </DialogTitle>
          </DialogHeader>

          {/* Selected Players List */}
          <div className="flex flex-col gap-2 mb-4 max-h-[40vh] overflow-y-auto">
            {activeGame.players.filter(p => p.isSelected).map((player) => (
              <div key={player.id} className="flex items-center gap-3 bg-[var(--app-background)] p-3 rounded-xl">
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
                  onChange={(e) => setEditedNames(prev => ({
                    ...prev,
                    [player.id]: e.target.value
                  }))}
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
                // Apply name changes
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
          </DialogHeader>

          {/* List of players to be removed */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {activeGame.players.filter(p => p.isSelected).map((player) => (
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
                // Remove all selected players
                const selectedIds = activeGame.players
                  .filter(p => p.isSelected)
                  .map(p => p.id);

                selectedIds.forEach(playerId => {
                  if (onRemovePlayer) {
                    onRemovePlayer(playerId);
                  }
                });

                setBulkRemoveDialogOpen(false);
                setActiveTab('score');
                setOpenDrawerPlayerId(null); // Close drawer if open
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
    </div>
  );
}
