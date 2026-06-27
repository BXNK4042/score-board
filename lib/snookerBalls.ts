export interface BallConfig {
  name: string;
  points: number;
  color?: string;
  background?: string;
  label: string;
  labelColor?: string;
}

export const SNOOKER_BALLS: BallConfig[] = [
  { name: 'White', points: 0, color: 'var(--app-snooker-white)', label: 'W' },
  { name: 'Red', points: 1, color: 'var(--app-snooker-red)', label: '1' },
  { name: 'Yellow', points: 2, color: 'var(--app-snooker-yellow)', label: '2' },
  { name: 'Green', points: 3, color: 'var(--app-snooker-green)', label: '3' },
  { name: 'Brown', points: 4, color: 'var(--app-snooker-brown)', label: '4' },
  { name: 'Blue', points: 5, color: 'var(--app-snooker-blue)', label: '5' },
  { name: 'Pink', points: 6, color: 'var(--app-snooker-pink)', label: '6' },
  { name: 'Black', points: 7, color: 'var(--app-snooker-black)', label: '7' },
];

export const FOUL_BALLS: BallConfig[] = [
  {
    name: 'Cue/Red/Yellow/Green/Brown',
    points: 4,
    background:
      'conic-gradient(var(--app-snooker-red) 0deg 90deg, var(--app-snooker-yellow) 90deg 180deg, var(--app-snooker-green) 180deg 270deg, var(--app-snooker-brown) 270deg 360deg)',
    label: '4',
    labelColor: '#000000',
  },
  { name: 'Blue', points: 5, color: 'var(--app-snooker-blue)', label: '5', labelColor: '#ffffff' },
  { name: 'Pink', points: 6, color: 'var(--app-snooker-pink)', label: '6', labelColor: '#ffffff' },
  { name: 'Black', points: 7, color: 'var(--app-snooker-black)', label: '7', labelColor: '#ffffff' },
];

export type BallStyle = {
  label: string;
  color?: string;
  background?: string;
  labelColor?: string;
};

export function getBallStyle(ballName: string, type: 'Score' | 'Foul'): BallStyle {
  if (type === 'Foul') {
    const foul = FOUL_BALLS.find((b) => b.name === ballName);
    if (foul) {
      return {
        label: foul.label,
        color: foul.color,
        background: foul.background,
        labelColor: foul.labelColor,
      };
    }
  }
  const ball = SNOOKER_BALLS.find((b) => b.name === ballName);
  if (ball) {
    return { label: ball.label, color: ball.color, labelColor: ball.labelColor };
  }
  return { label: '—', color: 'var(--app-text-secondary)', labelColor: '#ffffff' };
}
