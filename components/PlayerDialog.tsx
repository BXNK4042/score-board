import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Delay keyboard appearance to allow dialog animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      <div className="bg-[var(--app-card-background)] w-full max-w-[390px] rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-extrabold text-xl mb-4 text-[var(--app-text-primary)]">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="player-name-input" className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Player Name</label>
            <input
              ref={inputRef}
              id="player-name-input"
              data-testid="player-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              maxLength={20}
              className="w-full px-4 py-3 bg-[var(--app-background)] rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-[var(--app-brand)] text-[var(--app-text-primary)]"
            />
          </div>

          {/* Color Picker Grid */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Select Color Accent</label>
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
                      isSelected ? 'border-white ring-2 ring-[var(--app-brand)]' : 'border-transparent'
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
            <div className="text-[var(--app-danger)] text-xs font-semibold px-1">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              data-testid="player-dialog-cancel"
              onClick={onClose}
              className="flex-1 py-4 bg-[var(--app-background)] text-[var(--app-text-primary)] font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="player-dialog-save"
              className="flex-1 py-4 bg-[var(--app-brand)] text-white font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
