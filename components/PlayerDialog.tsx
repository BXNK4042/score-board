import React, { useState, useEffect, useRef } from 'react';
import { PALETTE } from '@/hooks/useGameState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// ponytail: map player colors to avatar image filenames
const COLOR_TO_AVATAR: Record<string, string> = {
  '#ef4444': 'Red',
  '#f97316': 'Orange',
  '#eab308': 'Yellow',
  '#22c55e': 'Green',
  '#06b6d4': 'Cyan',
  '#3b82f6': 'Blue',
  '#8b5cf6': 'Violet',
  '#ec4899': 'Pink',
  '#f43f5e': 'Rose',
  '#84cc16': 'Lime',
  '#0ea5e9': 'Sky',
  '#a855f7': 'Purple',
};

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[var(--app-card-background)] w-[calc(100%-32px)] max-w-[390px] rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-xl text-[var(--app-text-primary)]">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to configure player name and accent color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ponytail: show warning banner when user wants to add a 3rd player */}
          {title.toLowerCase().includes('add') && usedColors.length === 2 && (
            <div
              className="bg-[#FFF8E6] border border-[#FFE099] rounded-2xl p-4 text-xs text-[#805B00] flex flex-col gap-1 shadow-sm"
              data-testid="foul-score-warning-banner"
            >
              <span className="font-black text-[10px] uppercase tracking-wider text-[#B27F00]">Warning</span>
              <p className="leading-relaxed font-semibold">
                Adding a 3rd player changes the rules: the minimum foul score will be 2 instead of 4.
              </p>
            </div>
          )}

          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="player-name-input" className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Player Name</Label>
            <Input
              ref={inputRef}
              id="player-name-input"
              data-testid="player-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              maxLength={20}
              className="w-full px-4 py-3 bg-[var(--app-background)] rounded-2xl text-[var(--app-text-primary)]"
            />
          </div>

          {/* Color Picker Grid */}
          <div className="flex flex-col gap-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Select Color Accent</Label>
            {/* ponytail: change grid layout to 3 columns to fit larger h-20 w-20 avatars */}
            <div className="grid grid-cols-3 gap-4">
              {PALETTE.map((c) => {
                const isUsed = usedColors.some((uc) => uc.toLowerCase() === c.toLowerCase()) && c.toLowerCase() !== initialColor.toLowerCase();
                const isSelected = color === c;
                // ponytail: use native button to prevent shadcn default styles/borders, size to w-20 mx-auto
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
                    className={`h-20 w-20 mx-auto rounded-full transition-all relative flex items-center justify-center p-0 overflow-hidden outline-none ${
                      isSelected ? 'ring-4 ring-[var(--app-brand)] scale-105' : ''
                    } ${isUsed ? 'opacity-20 cursor-not-allowed' : 'hover:scale-105'}`}
                    aria-label={`Select color ${c}`}
                  >
                    <img
                      src={`/player-avatar/${COLOR_TO_AVATAR[c.toLowerCase()] || 'Red'}.webp`}
                      alt={COLOR_TO_AVATAR[c.toLowerCase()] || 'Color'}
                      className="w-full h-full object-cover"
                    />
                    {isUsed && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✕</span>
                      </div>
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
            <Button
              type="button"
              data-testid="player-dialog-cancel"
              onClick={onClose}
              variant="secondary"
              className="flex-1 py-4 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-bold rounded-2xl active:scale-98"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="player-dialog-save"
              className="flex-1 py-4 h-auto bg-[var(--app-brand)] text-white font-bold rounded-2xl active:scale-98"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
