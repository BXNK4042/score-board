export const COLOR_TO_AVATAR: Record<string, string> = {
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

export const hasAvatar = (color: string): boolean =>
  Boolean(COLOR_TO_AVATAR[color.toLowerCase()]);

export const getAvatarSrc = (color: string): string =>
  `/player-avatar/${COLOR_TO_AVATAR[color.toLowerCase()] ?? 'Red'}.webp`;
