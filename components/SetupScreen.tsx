import React, { useState } from 'react';
import { PALETTE, DraftPlayer } from '@/hooks/useGameState';
import { GamepadIcon, PlusIcon, PencilIcon, TrashIcon, BoltIcon } from '@/components/HomeScreen';
import { PlayerDialog } from '@/components/PlayerDialog';

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
    <div className="flex flex-col flex-1 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen relative p-6 justify-between">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
            <GamepadIcon />
            <span className="font-extrabold text-xl tracking-tight text-[#4B45D4]">ScoreBoard</span>
          </div>
          <button
            onClick={onCancel}
            data-testid="setup-cancel-button"
            className="text-sm font-bold text-[#9999AA] hover:text-[#1A1A2E] cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Page Title */}
        <h2 className="text-3xl font-extrabold tracking-tight">Create New Game</h2>

        {/* Game Title Input Section */}
        <div className="bg-white p-4 rounded-[20px] flex flex-col gap-1 shadow-sm">
          <label htmlFor="game-title-input" className="text-[10px] font-extrabold uppercase tracking-wider text-[#9999AA]">Title</label>
          <input
            id="game-title-input"
            data-testid="game-title-input"
            type="text"
            value={setupTitle}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="Enter game title"
            maxLength={40}
            className="w-full text-base font-bold text-[#1A1A2E] border-none focus:outline-none p-0"
          />
        </div>

        {/* Players List Section Header */}
        <div className="flex items-center justify-between mt-2">
          <h3 className="font-extrabold text-lg">Players</h3>
          <span className="px-3 py-1 text-xs font-bold bg-[#4B45D4] text-white rounded-full">
            {setupPlayers.length} ADDED
          </span>
        </div>

        {/* Scrollable Players List */}
        <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1">
          {setupPlayers.length === 0 ? (
            <div className="text-center py-8 text-[#9999AA] text-sm font-medium">
              No players added yet. Tap &apos;+&apos; below to add players.
            </div>
          ) : (
            setupPlayers.map((player) => (
              <div
                key={player.id}
                data-testid={`player-card-${player.id}`}
                style={{ borderLeftColor: player.color }}
                className="bg-white border-l-8 p-4 rounded-[20px] shadow-sm flex items-center justify-between"
              >
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
                  <span className="font-extrabold text-base text-[#1A1A2E]">{player.name}</span>
                </div>

                {/* Right Side: Edit / Delete buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(player)}
                    data-testid={`edit-player-${player.id}`}
                    className="p-1 hover:bg-[#EEEEF8] rounded-lg cursor-pointer"
                    aria-label={`Edit ${player.name}`}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => onDeletePlayer(player.id)}
                    data-testid={`delete-player-${player.id}`}
                    className="p-1 hover:bg-[#EEEEF8] rounded-lg cursor-pointer"
                    aria-label={`Delete ${player.name}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Player FAB/Button */}
        {setupPlayers.length < 10 && (
          <button
            onClick={handleOpenAdd}
            data-testid="add-player-button"
            className="w-full py-4 border-2 border-dashed border-[#9999AA]/40 text-[#4B45D4] font-extrabold rounded-[20px] flex items-center justify-center gap-2 hover:bg-white/50 cursor-pointer transition-colors mt-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>ADD PLAYER</span>
          </button>
        )}
      </div>

      {/* Start Game Action Button */}
      <div className="w-full pt-6 pb-2">
        <button
          onClick={onStartGame}
          data-testid="start-game-button"
          disabled={isStartDisabled}
          className={`w-full py-4 text-white font-extrabold rounded-full flex items-center justify-center gap-1 transition-transform cursor-pointer ${
            isStartDisabled
              ? 'bg-[#9999AA]/60 opacity-60 cursor-not-allowed'
              : 'bg-[#4B45D4] shadow-md shadow-[#4B45D4]/20 active:scale-98'
          }`}
        >
          <BoltIcon />
          <span>START GAME</span>
        </button>
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
