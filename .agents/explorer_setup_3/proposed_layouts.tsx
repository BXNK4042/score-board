import React, { useState } from 'react';
import { PALETTE, DraftPlayer } from './proposed_useGameState';

// Simple SVG Icons helper
export const GamepadIcon = () => (
  <svg className="w-6 h-6 text-[#4B45D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

export const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const PencilIcon = () => (
  <svg className="w-5 h-5 text-[#9999AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export const TrashIcon = () => (
  <svg className="w-5 h-5 text-[#E04040]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const BoltIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ----------------------------------------------------
// 1. Home Screen Component
// ----------------------------------------------------
export function HomeScreen({
  onNavigateSetup,
  onResumeGame,
  hasActiveGame,
}: {
  onNavigateSetup: () => void;
  onResumeGame: () => void;
  hasActiveGame: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-between p-6 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen">
      {/* Top Header branding */}
      <div className="w-full flex items-center justify-start gap-2 pt-6">
        <GamepadIcon />
        <span className="font-extrabold text-xl tracking-tight text-[#4B45D4]">ScoreBoard</span>
      </div>

      {/* Main content button */}
      <div className="flex flex-col items-center justify-center gap-6 my-auto">
        <button
          onClick={onNavigateSetup}
          className="w-24 h-24 rounded-full bg-[#4B45D4] flex items-center justify-center text-white shadow-lg shadow-[#4B45D4]/30 active:scale-95 transition-transform cursor-pointer"
          aria-label="Create New Game"
        >
          <PlusIcon className="w-12 h-12" />
        </button>
        <span className="font-extrabold text-lg text-[#1A1A2E]">Create New Game</span>
      </div>

      {/* Bottom Option to Resume Game if active */}
      <div className="w-full pb-8">
        {hasActiveGame && (
          <button
            onClick={onResumeGame}
            className="w-full py-4 bg-white border border-[#4B45D4] text-[#4B45D4] font-bold rounded-2xl active:scale-98 transition-transform cursor-pointer text-center"
          >
            RESUME LIVE GAME
          </button>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. Player Add/Edit Modal/Dialog Component
// ----------------------------------------------------
export function PlayerDialog({
  isOpen,
  onClose,
  onSave,
  title,
  initialName = '',
  initialColor = PALETTE[0],
  usedColors = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  title: string;
  initialName?: string;
  initialColor?: string;
  usedColors?: string[];
}) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Player name cannot be empty');
      return;
    }
    // Perform duplicate color check (case insensitive)
    const colorLower = color.toLowerCase();
    const isColorUsed = usedColors.some((c) => c.toLowerCase() === colorLower);
    if (isColorUsed) {
      setError('Color is already in use by another player');
      return;
    }

    onSave(name, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center sm:items-center p-4">
      <div className="bg-white w-full max-w-[390px] rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-extrabold text-xl mb-4 text-[#1A1A2E]">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#9999AA]">Player Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              maxLength={20}
              className="w-full px-4 py-3 bg-[#EEEEF8] rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-[#4B45D4] text-[#1A1A2E]"
              autoFocus
            />
          </div>

          {/* Color Picker Grid */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#9999AA]">Select Color Accent</label>
            <div className="grid grid-cols-4 gap-3">
              {PALETTE.map((c) => {
                const isUsed = usedColors.some((uc) => uc.toLowerCase() === c.toLowerCase()) && c.toLowerCase() !== initialColor.toLowerCase();
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={isUsed}
                    onClick={() => {
                      setColor(c);
                      setError('');
                    }}
                    style={{ backgroundColor: c }}
                    className={`h-11 rounded-full border-4 transition-all relative flex items-center justify-center cursor-pointer ${
                      isSelected ? 'border-white ring-2 ring-[#4B45D4]' : 'border-transparent'
                    } ${isUsed ? 'opacity-20 cursor-not-allowed' : ''}`}
                    aria-label={`Select color ${c}`}
                  >
                    {isUsed && (
                      <span className="text-white text-xs font-bold absolute">✕</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-[#E04040] text-xs font-semibold px-1">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-[#EEEEF8] text-[#1A1A2E] font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-[#4B45D4] text-white font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Setup Screen Component
// ----------------------------------------------------
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
            className="text-sm font-bold text-[#9999AA] hover:text-[#1A1A2E] cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Page Title */}
        <h2 className="text-3xl font-extrabold tracking-tight">Create New Game</h2>

        {/* Game Title Input Section */}
        <div className="bg-white p-4 rounded-[20px] flex flex-col gap-1 shadow-sm">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#9999AA]">Title</label>
          <input
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
                    className="p-1 hover:bg-[#EEEEF8] rounded-lg cursor-pointer"
                    aria-label={`Edit ${player.name}`}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => onDeletePlayer(player.id)}
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
