export interface DraftPlayer {
  id: string;
  name: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  isSelected: boolean;
  scoredBalls: string[];
  foulAwardedPoints: number;
}

export interface ScoreChange {
  timestamp: number;
  playerId: string;
  previousScore: number;
  newScore: number;
  isFoul?: boolean;
}

export interface Game {
  id: string;
  title: string;
  createdAt: number;
  players: Player[];
  lastScoreUpdated?: number;
  foulCount?: number;
  latestBall?: {
    playerName: string;
    type: 'Score' | 'Foul';
    ballName: string;
  };
  scoreHistory: ScoreChange[];
}

export const getNonFoulScore = (player: Player): number =>
  player.score - (player.foulAwardedPoints ?? 0);

export const PALETTE = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#84CC16', // Lime
  '#0EA5E9', // Sky
  '#A855F7', // Purple
];

export const SCORE_HISTORY_CAP = 200;

export const prependScoreHistory = (
  existing: ScoreChange[],
  newEntries: ScoreChange[],
  cap: number = SCORE_HISTORY_CAP
): ScoreChange[] => {
  const combined = [...newEntries, ...existing];
  return combined.length > cap ? combined.slice(0, cap) : combined;
};
