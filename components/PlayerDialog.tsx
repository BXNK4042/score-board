import React, { useState, useEffect, useRef } from 'react';
import { PALETTE } from '@/lib/gameTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlayerColorPicker } from '@/components/ui/PlayerColorPicker';

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
            <PlayerColorPicker
              value={color}
              usedColors={usedColors}
              onChange={(c) => {
                setColor(c);
                setError('');
              }}
              size="lg"
            />
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
