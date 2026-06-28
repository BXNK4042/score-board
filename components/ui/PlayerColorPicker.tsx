'use client';

import { PALETTE } from '@/lib/gameTypes';
import { COLOR_TO_AVATAR } from '@/lib/playerAvatar';

interface PlayerColorPickerProps {
  value: string;
  usedColors: string[];
  onChange: (color: string) => void;
  size?: 'lg' | 'sm';
}

export function PlayerColorPicker({
  value,
  usedColors,
  onChange,
  size = 'lg',
}: PlayerColorPickerProps) {
  const usedLower = new Set(usedColors.map((c) => c.toLowerCase()));
  const valueLower = value.toLowerCase();
  const isLg = size === 'lg';

  return (
    <div className={isLg ? 'grid grid-cols-3 gap-4' : 'grid grid-cols-6 gap-2'}>
      {PALETTE.map((c) => {
        const isSelected = valueLower === c.toLowerCase();
        const isUsedByOther = usedLower.has(c.toLowerCase()) && !isSelected;
        return (
          <button
            key={c}
            type="button"
            data-testid={`color-selector-${c.replace('#', '')}`}
            disabled={isUsedByOther}
            onClick={() => onChange(c)}
            className={`${
              isLg ? 'h-20 w-20' : 'h-9 w-9'
            } mx-auto rounded-full transition-all relative flex items-center justify-center p-0 overflow-hidden outline-none ${
              isSelected ? `${isLg ? 'ring-4' : 'ring-2'} ring-[var(--app-brand)] scale-105` : ''
            } ${isUsedByOther ? 'opacity-20 cursor-not-allowed' : 'hover:scale-105'}`}
            aria-label={`Select color ${c}`}
          >
            <img
              src={`/player-avatar/${COLOR_TO_AVATAR[c.toLowerCase()] || 'Red'}.webp`}
              alt={COLOR_TO_AVATAR[c.toLowerCase()] || 'Color'}
              className="w-full h-full object-cover"
            />
            {isUsedByOther && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✕</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
