'use client';

import React, { useState } from 'react';
import { Game, PALETTE } from '@/hooks/useGameState';
import { PlayerDialog } from '@/components/PlayerDialog';
import { Gamepad, UserPlus, Check, Play, Pause, X, RefreshCw } from 'lucide-react';

export const GamepadIcon = () => (
  <Gamepad className="w-6 h-6 text-[#4B45D4]" strokeWidth={2} />
);

const PersonPlusIcon = () => (
  <UserPlus className="w-6 h-6 text-[#4B45D4]" strokeWidth={2} />
);

const CheckIcon = () => (
  <Check className="w-6 h-6 text-[#22DD66]" strokeWidth={2.5} />
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
}) {
  const [prevTitle, setPrevTitle] = useState(activeGame?.title || '');
  const [tempTitle, setTempTitle] = useState(activeGame?.title || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);

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

  return (
    <div className="flex flex-col flex-1 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen relative p-6 justify-between">
      {/* sr-only heading for tests */}
      <h1 className="sr-only" data-testid="in-game-screen-heading">In-Game Screen</h1>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GamepadIcon />
            {isEditingTitle ? (
              <input
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
                className="w-full font-extrabold text-xl tracking-tight text-[#1A1A2E] bg-transparent border-b-2 border-[#4B45D4] focus:outline-none focus:ring-0 p-0"
              />
            ) : (
              <button
                onClick={() => {
                  setTempTitle(activeGame.title);
                  setIsEditingTitle(true);
                }}
                aria-label="Edit game title"
                className="text-left font-extrabold text-xl tracking-tight text-[#1A1A2E] hover:text-[#4B45D4] transition-colors break-words max-w-[180px] cursor-pointer focus:outline-none"
              >
                {activeGame.title}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAddPlayerDialogOpen(true)}
              data-testid="add-player-ingame-button"
              disabled={activeGame.players.length >= 10}
              aria-label="Add player mid-game"
              className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl cursor-pointer shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PersonPlusIcon />
            </button>
            <button
              onClick={() => setEndGameDialogOpen(true)}
              data-testid="end-game-button"
              aria-label="End Game"
              className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl cursor-pointer shadow-sm active:scale-95 transition-transform"
            >
              <CheckIcon />
            </button>
          </div>
        </div>

        {/* Stopwatch Banner */}
        <div className="bg-[#4B45D4] text-white p-4 rounded-[20px] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22DD66] animate-pulse" />
            <span className="text-xs font-extrabold tracking-wider">LIVE SESSION</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="timer-display font-mono text-2xl font-black tracking-wider" data-testid="stopwatch-display">
              {formatTime(activeGame.elapsedSeconds)}
            </span>
            <button
              onClick={() => onToggleStopwatch(!activeGame.isRunning)}
              data-testid="stopwatch-toggle"
              aria-label={activeGame.isRunning ? "Pause stopwatch" : "Start stopwatch"}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer"
            >
              {activeGame.isRunning ? (
                <PauseIcon className="w-5 h-5 text-white" />
              ) : (
                <PlayIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Player Cards List */}
        <div
          className={`flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 transition-all ${
            selectedCount >= 1 ? 'pb-24' : 'pb-6'
          }`}
        >
          {activeGame.players.length === 0 ? (
            <div className="text-center py-8 text-[#9999AA] text-sm font-medium">
              No players in game.
            </div>
          ) : (
            activeGame.players.map((player, index) => {
              const isLeader = index === leaderIndex;
              return (
                <div
                  key={player.id}
                  data-testid={`player-card-${player.id}`}
                  onClick={() => onTogglePlayerSelection(player.id)}
                  style={{
                    borderColor: player.isSelected ? '#D4156B' : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                  }}
                  className="bg-white p-4 rounded-[20px] shadow-sm flex flex-col gap-2 relative transition-all cursor-pointer hover:shadow-md"
                >
                  {/* Top Row: Role Label & Selection Circle / Selected Pill */}
                  <div className="flex items-center justify-between">
                    <div>
                      {isLeader ? (
                        <span
                          style={{ color: player.color }}
                          className="font-extrabold text-[11px] uppercase tracking-wider"
                        >
                          LEADER
                        </span>
                      ) : (
                        <span className="font-bold text-[11px] uppercase tracking-wider text-[#9999AA]">
                          PLAYER {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {player.isSelected && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#D4156B] text-white rounded-full">
                          SELECTED
                        </span>
                      )}
                      <input
                        type="checkbox"
                        data-testid={`player-select-${player.id}`}
                        checked={player.isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          onTogglePlayerSelection(player.id);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        aria-label={`Select ${player.name} for bulk action`}
                        className="w-5 h-5 rounded-full border-2 border-[#9999AA]/50 text-[#D4156B] focus:ring-0 cursor-pointer"
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
                      <span className="font-extrabold text-base text-[#1A1A2E]">{player.name}</span>
                    </div>

                    {/* Right: Score and +/- Controls */}
                    <div className="flex items-center gap-4">
                      {/* Decrement */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateScore(player.id, -1);
                        }}
                        data-testid={`score-decrement-${player.id}`}
                        aria-label={`Decrease score for ${player.name}`}
                        className="w-10 h-10 rounded-full bg-[#EEEEF8] flex items-center justify-center font-extrabold text-lg text-[#1A1A2E] hover:bg-[#E2E2F0] active:scale-95 transition-transform cursor-pointer"
                      >
                        −
                      </button>

                      {/* Large Score Display with aria-live */}
                      <div
                        aria-live="polite"
                        data-testid={`player-score-${player.id}`}
                        className="text-5xl font-black min-w-[60px] text-center"
                        style={{ color: player.color }}
                      >
                        {player.score}
                      </div>

                      {/* Increment */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateScore(player.id, 1);
                        }}
                        data-testid={`score-increment-${player.id}`}
                        aria-label={`Increase score for ${player.name}`}
                        style={{ backgroundColor: player.color }}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg text-white hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedCount >= 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[342px] bg-[#1A1A2E] text-white p-4 rounded-3xl shadow-xl flex items-center justify-between z-40" data-testid="bulk-action-bar">
          <button
            onClick={onDeselectAllPlayers}
            data-testid="bulk-deselect-all"
            aria-label="Deselect all players"
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <DeselectIcon />
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-[#9999AA]">
            {selectedCount} Player(s) SELECTED FOR BULK
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onReversePlayerSelection}
              data-testid="bulk-reverse-selection"
              aria-label="Reverse selection"
              className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ReverseIcon />
            </button>
            <button
              onClick={() => onBulkUpdateScores(-1)}
              data-testid="bulk-decrement"
              aria-label="Bulk decrement score"
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white hover:bg-white/30 cursor-pointer active:scale-95 transition-transform"
            >
              −
            </button>
            <button
              onClick={() => onBulkUpdateScores(1)}
              data-testid="bulk-increment"
              aria-label="Bulk increment score"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#1A1A2E] hover:bg-white/90 cursor-pointer active:scale-95 transition-transform"
            >
              +
            </button>
          </div>
        </div>
      )}

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

      {/* Custom End Game confirmation modal */}
      {endGameDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-xl text-center">
            <h3 className="font-extrabold text-lg mb-6 text-[#1A1A2E]">
              Are you sure you want to end the game?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={onEndGame}
                className="w-full py-3.5 bg-[#E04040] text-white font-extrabold rounded-2xl cursor-pointer active:scale-98 transition-transform"
              >
                Yes, End Game
              </button>
              <button
                onClick={() => setEndGameDialogOpen(false)}
                className="w-full py-3.5 bg-[#EEEEF8] text-[#1A1A2E] font-extrabold rounded-2xl cursor-pointer active:scale-98 transition-transform"
              >
                No, Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
