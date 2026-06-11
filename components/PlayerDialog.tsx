import React, { useState } from 'react';
import { PALETTE } from '@/hooks/useGameState';

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
    // Perform duplicate color check (case insensitive), ignoring the player's own current color
    const colorLower = color.toLowerCase();
    const isColorUsed = usedColors.some((c) => c.toLowerCase() === colorLower) && colorLower !== initialColor.toLowerCase();
    if (isColorUsed) {
      setError('Color is already in use by another player');
      return;
    }

    onSave(name, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[390px] rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-extrabold text-xl mb-4 text-[#1A1A2E]">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="player-name-input" className="text-[10px] font-bold uppercase tracking-wider text-[#9999AA]">Player Name</label>
            <input
              id="player-name-input"
              data-testid="player-name-input"
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
            <div className="grid grid-cols-6 gap-3">
              {PALETTE.map((c) => {
                const isUsed = usedColors.some((uc) => uc.toLowerCase() === c.toLowerCase()) && c.toLowerCase() !== initialColor.toLowerCase();
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    data-testid={`color-selector-${c.replace('#', '')}`}
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
              data-testid="player-dialog-cancel"
              onClick={onClose}
              className="flex-1 py-4 bg-[#EEEEF8] text-[#1A1A2E] font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="player-dialog-save"
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
