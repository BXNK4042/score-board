import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PALETTE, DraftPlayer } from '@/hooks/useGameState';
import { GamepadIcon, PlusIcon, PencilIcon, TrashIcon, BoltIcon } from '@/components/HomeScreen';
import { PlayerDialog } from '@/components/PlayerDialog';
import { Button } from '@/components/ui/button';
import { MotionButton } from '@/components/ui/motion-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { listContainerVariants, listItemVariants, useReducedMotion, createSafeVariants } from '@/lib/animations';

export function SetupScreen({
  setupTitle,
  setupPlayers,
  onUpdateTitle,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  onStartGame,
  onCancel,
}: {
  setupTitle: string;
  setupPlayers: DraftPlayer[];
  onUpdateTitle: (title: string) => void;
  onAddPlayer: (name: string, color: string) => boolean;
  onUpdatePlayer: (id: string, name: string, color: string) => boolean;
  onDeletePlayer: (id: string) => void;
  onStartGame: () => void;
  onCancel: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<DraftPlayer | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const safeListVariants = createSafeVariants(prefersReducedMotion, listItemVariants);
  const safeContainerVariants = createSafeVariants(prefersReducedMotion, listContainerVariants);

  // Pick first available color in palette for default selection in add dialog
  const getFirstAvailableColor = () => {
    const usedColors = setupPlayers.map((p) => p.color.toLowerCase());
    const available = PALETTE.find((c) => !usedColors.includes(c.toLowerCase()));
    return available || PALETTE[0];
  };

  const handleOpenAdd = () => {
    setEditingPlayer(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (player: DraftPlayer) => {
    setEditingPlayer(player);
    setDialogOpen(true);
  };

  const handleSave = (name: string, color: string) => {
    if (editingPlayer) {
      onUpdatePlayer(editingPlayer.id, name, color);
    } else {
      onAddPlayer(name, color);
    }
  };

  const isStartDisabled = !setupTitle.trim() || setupPlayers.length === 0;

  return (
    <div className="flex flex-col flex-1 bg-[var(--app-background)] text-[var(--app-text-primary)] w-full max-w-[390px] mx-auto min-h-screen relative p-6 justify-between">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
            <GamepadIcon />
            <span className="font-extrabold text-xl tracking-tight text-[var(--app-brand)]">ScoreBoard</span>
          </div>
          <MotionButton
            onClick={onCancel}
            data-testid="setup-cancel-button"
            variant="ghost"
            className="text-sm font-bold text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
            motionType="default"
          >
            Cancel
          </MotionButton>
        </div>

        {/* Page Title */}
        <h2 className="text-3xl font-extrabold tracking-tight">Create New Game</h2>

        {/* Game Title Input Section */}
        <Card className="p-4 rounded-[20px] shadow-sm bg-[var(--app-card-background)]">
          <div className="flex flex-col gap-1">
            <Label htmlFor="game-title-input" className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--app-text-secondary)]">
              Title
            </Label>
            <Input
              id="game-title-input"
              data-testid="game-title-input"
              type="text"
              value={setupTitle}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Enter game title"
              maxLength={40}
              className="w-full text-base font-bold text-[var(--app-text-primary)] border-none focus:outline-none focus:ring-0 focus-visible:ring-0 p-0 shadow-none"
            />
          </div>
        </Card>

        {/* Players List Section Header */}
        <div className="flex items-center justify-between mt-2">
          <h3 className="font-extrabold text-lg">Players</h3>
          <span className="px-3 py-1 text-xs font-bold bg-[var(--app-brand)] text-white rounded-full">
            {setupPlayers.length} ADDED
          </span>
        </div>

        {/* Scrollable Players List */}
        <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1">
          {setupPlayers.length === 0 ? (
            <div className="text-center py-8 text-[var(--app-text-secondary)] text-sm font-medium">
              No players added yet. Tap &apos;+&apos; below to add players.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                variants={safeContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {setupPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    variants={safeListVariants}
                    layout
                  >
                    <Card
                      data-testid={`player-card-${player.id}`}
                      style={{ borderLeftColor: player.color }}
                      className="border-l-8 p-4 rounded-[20px] shadow-sm bg-[var(--app-card-background)] flex items-center justify-between"
                    >
                      <CardContent className="p-0 flex items-center justify-between w-full">
                  {/* Left Side: Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: `${player.color}15` }}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                    >
                      <span style={{ color: player.color }} className="font-extrabold text-sm">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-extrabold text-base text-[var(--app-text-primary)]">{player.name}</span>
                  </div>

                  {/* Right Side: Edit / Delete buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleOpenEdit(player)}
                      data-testid={`edit-player-${player.id}`}
                      variant="ghost"
                      size="icon"
                      className="p-1 hover:bg-[var(--app-background)]"
                      aria-label={`Edit ${player.name}`}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      onClick={() => onDeletePlayer(player.id)}
                      data-testid={`delete-player-${player.id}`}
                      variant="ghost"
                      size="icon"
                      className="p-1 hover:bg-[var(--app-background)]"
                      aria-label={`Delete ${player.name}`}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </CardContent>
                  </Card>
                </motion.div>
                ))
              }
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Add Player FAB/Button */}
        {setupPlayers.length < 10 && (
          <MotionButton
            onClick={handleOpenAdd}
            data-testid="add-player-button"
            variant="outline"
            className="w-full py-4 h-auto border-2 border-dashed border-[var(--app-text-secondary)]/40 text-[var(--app-brand)] font-extrabold rounded-[20px] flex items-center justify-center gap-2 hover:bg-[var(--app-card-background)]/50 mt-2"
            motionType="default"
          >
            <PlusIcon className="w-5 h-5" />
            <span>ADD PLAYER</span>
          </MotionButton>
        )}
      </div>

      {/* Start Game Action Button */}
      <div className="w-full pt-6 pb-2">
        <MotionButton
          onClick={onStartGame}
          data-testid="start-game-button"
          disabled={isStartDisabled}
          className={`w-full py-4 h-auto text-white font-extrabold rounded-full flex items-center justify-center gap-1 ${
            isStartDisabled
              ? 'bg-[var(--app-text-secondary)]/60 opacity-60 cursor-not-allowed'
              : 'bg-[var(--app-brand)] shadow-md shadow-[var(--app-brand)]/20 active:scale-98'
          }`}
          motionType="default"
        >
          <BoltIcon />
          <span>START GAME</span>
        </MotionButton>
      </div>

      {/* Player Dialog (Add / Edit) */}
      {dialogOpen && (
        <PlayerDialog
          key={editingPlayer ? editingPlayer.id : 'new'}
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          title={editingPlayer ? 'Edit Player' : 'Add Player'}
          initialName={editingPlayer ? editingPlayer.name : ''}
          initialColor={editingPlayer ? editingPlayer.color : getFirstAvailableColor()}
          usedColors={setupPlayers.map((p) => p.color)}
        />
      )}
    </div>
  );
}
