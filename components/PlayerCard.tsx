'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Player } from '@/hooks/useGameState';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface BallConfig {
  name: string;
  points: number;
  color?: string;
  background?: string;
  label: string;
  labelColor?: string;
}

// Snooker ball configuration
const SNOOKER_BALLS: BallConfig[] = [
  { name: 'White', points: 0, color: 'var(--app-snooker-white)', label: 'W' },
  { name: 'Red', points: 1, color: 'var(--app-snooker-red)', label: '1' },
  { name: 'Yellow', points: 2, color: 'var(--app-snooker-yellow)', label: '2' },
  { name: 'Green', points: 3, color: 'var(--app-snooker-green)', label: '3' },
  { name: 'Brown', points: 4, color: 'var(--app-snooker-brown)', label: '4' },
  { name: 'Blue', points: 5, color: 'var(--app-snooker-blue)', label: '5' },
  { name: 'Pink', points: 6, color: 'var(--app-snooker-pink)', label: '6' },
  { name: 'Black', points: 7, color: 'var(--app-snooker-black)', label: '7' },
];

// Snooker foul ball configuration (4 balls for foul tab)
const FOUL_BALLS: BallConfig[] = [
  {
    name: 'Cue/Red/Yellow/Green/Brown',
    points: 4,
    background: 'conic-gradient(var(--app-snooker-red) 0deg 90deg, var(--app-snooker-yellow) 90deg 180deg, var(--app-snooker-green) 180deg 270deg, var(--app-snooker-brown) 270deg 360deg)',
    label: '4',
    labelColor: '#000000',
  },
  { name: 'Blue', points: 5, color: 'var(--app-snooker-blue)', label: '5', labelColor: '#ffffff' },
  { name: 'Pink', points: 6, color: 'var(--app-snooker-pink)', label: '6', labelColor: '#ffffff' },
  { name: 'Black', points: 7, color: 'var(--app-snooker-black)', label: '7', labelColor: '#ffffff' },
];

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


interface PlayerCardProps {
  player: Player;
  index: number;
  isLeader: boolean;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  activeTab: 'score' | 'foul';
  setActiveTab: (tab: 'score' | 'foul') => void;
  onTogglePlayerSelection: (playerId: string) => void;
  onUpdateScore: (playerId: string, delta: number) => void;
  onBallClick: (playerId: string, points: number, tab: 'score' | 'foul') => void;
  prefersReducedMotion: boolean;
  safeListVariants: Variants;
}

export function PlayerCard({
  player,
  index,
  isLeader,
  isDrawerOpen,
  onToggleDrawer,
  activeTab,
  setActiveTab,
  onTogglePlayerSelection,
  onUpdateScore,
  onBallClick,
  prefersReducedMotion,
  safeListVariants,
}: PlayerCardProps) {
  return (
    <motion.div
      variants={safeListVariants}
      layout="position"
    >
      <Card
        data-testid={`player-card-${player.id}`}
        onClick={onToggleDrawer}
        style={{
          borderColor: player.isSelected ? 'var(--app-selection)' : 'transparent',
          borderWidth: '2px',
          borderStyle: 'solid',
        }}
        className="bg-[var(--app-card-background)] p-4 rounded-[20px] shadow-sm flex flex-col gap-2 relative transition-all cursor-pointer hover:shadow-md overflow-hidden"
      >
        <CardContent className="p-0 flex flex-col">
          {isLeader && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{ backgroundColor: player.color }}
              className="-mx-4 -mt-4 mb-3 py-2 px-4 rounded-t-[18px] flex items-center justify-center gap-2 text-white shadow-sm overflow-hidden"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: 'easeInOut',
                }}
                className="flex items-center justify-center"
              >
                <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300 drop-shadow-md" strokeWidth={2.5} />
              </motion.div>
              <span className="font-extrabold text-[11px] uppercase tracking-widest text-white drop-shadow-sm">
                LEADER
              </span>
            </motion.div>
          )}

          {/* Top Row: Role/Index & Checkbox */}
          <div className="flex items-center justify-between">
            <div>
              {!isLeader && (
                <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--app-text-secondary)]">
                  PLAYER {index + 1}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {player.isSelected && (
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[var(--app-selection)] text-white rounded-full">
                  SELECTED
                </span>
              )}
              <Checkbox
                data-testid={`player-select-${player.id}`}
                checked={player.isSelected}
                onCheckedChange={() => onTogglePlayerSelection(player.id)}
                aria-label={`Select ${player.name} for bulk action`}
                className="w-5 h-5 rounded-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* ponytail: simple flex row for scored balls, no separate component */}
          {(player.scoredBalls?.length || 0) > 0 && (
            <div
              className="flex gap-1 mt-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {(player.scoredBalls || []).map((ballName, index) => {
                const ballConfig = SNOOKER_BALLS.find(b => b.name === ballName);
                if (!ballConfig) return null;
                return (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: ballConfig.color }}
                    aria-label={`${ballName} ball, ${ballConfig.points} points`}
                  />
                );
              })}
            </div>
          )}

          {/* Middle Row: Avatar, Name & Score Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                {COLOR_TO_AVATAR[player.color.toLowerCase()] ? (
                  <img
                    src={`/player-avatar/${COLOR_TO_AVATAR[player.color.toLowerCase()]}.webp`}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: `${player.color}15` }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <span style={{ color: player.color }} className="font-extrabold text-xl">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="font-extrabold text-base text-[var(--app-text-primary)]">{player.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateScore(player.id, -1);
                }}
                data-testid={`score-decrement-${player.id}`}
                aria-label={`Decrease score for ${player.name}`}
                variant="outline"
                className="w-10 h-10 rounded-full bg-[var(--app-background)] flex items-center justify-center font-extrabold text-lg text-[var(--app-text-primary)] hover:bg-[var(--app-border)] active:scale-95 p-0"
                size="icon"
              >
                −
              </Button>

              <motion.div
                key={player.score}
                aria-live="polite"
                data-testid={`player-score-${player.id}`}
                className="text-5xl font-black min-w-[60px] text-center"
                style={{ color: player.color }}
                initial={prefersReducedMotion ? {} : { scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 200,
                }}
              >
                {player.score}
              </motion.div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateScore(player.id, 1);
                }}
                data-testid={`score-increment-${player.id}`}
                aria-label={`Increase score for ${player.name}`}
                style={{ backgroundColor: player.color }}
                variant="default"
                className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg text-white hover:opacity-90 active:scale-95 p-0"
                size="icon"
              >
                +
              </Button>
            </div>
          </div>

          {/* Snooker Scoring Drawer */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 0.5,
                }}
              >
                <div
                  className="mt-2 rounded-2xl shadow-lg overflow-hidden"
                  style={{
                    backgroundColor: `${player.color}15`,
                    border: `2px solid ${player.color}40`,
                  }}
                >
                  {/* Drawer Header */}
                  <div
                    className="bg-[var(--app-card-background)] p-3 border-b"
                    style={{ borderColor: `${player.color}30` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-extrabold text-sm" style={{ color: player.color }}>
                        Ball Score
                      </h4>
                      <Button
                        onClick={() => {
                          setActiveTab('score');
                          onToggleDrawer();
                        }}
                        variant="ghost"
                        className="text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] p-0 h-auto"
                      >
                        ✕
                      </Button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setActiveTab('score')}
                        variant="ghost"
                        className={`flex-1 py-2 px-3 h-auto rounded-lg font-bold text-xs transition-colors ${
                          activeTab === 'score'
                            ? 'text-white hover:text-white hover:opacity-90'
                            : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-background)]'
                        }`}
                        style={{
                          backgroundColor: activeTab === 'score' ? player.color : 'transparent',
                        }}
                      >
                        Score
                      </Button>
                      <Button
                        onClick={() => setActiveTab('foul')}
                        variant="ghost"
                        className={`flex-1 py-2 px-3 h-auto rounded-lg font-bold text-xs transition-colors ${
                          activeTab === 'foul'
                            ? 'text-white hover:text-white hover:opacity-90'
                            : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-background)]'
                        }`}
                        style={{
                          backgroundColor: activeTab === 'foul' ? player.color : 'transparent',
                        }}
                      >
                        Foul
                      </Button>
                    </div>
                  </div>

                  {/* Ball Grid */}
                  <div className="p-3">
                    <div className="grid grid-cols-4 gap-2">
                      {(activeTab === 'score' ? SNOOKER_BALLS : FOUL_BALLS).map((ball) => {
                        const isFoulCombined = ball.background !== undefined;
                        const bgStyle = isFoulCombined
                          ? { background: ball.background }
                          : { backgroundColor: ball.color };

                        const labelColor =
                          ball.labelColor ||
                          (ball.name === 'White' || ball.name === 'Yellow' ? '#000000' : '#ffffff');

                        return (
                          <button
                            key={ball.name}
                            onClick={() => onBallClick(player.id, ball.points, activeTab)}
                            disabled={ball.name === 'White'}
                            className={`relative aspect-square rounded-full flex flex-col items-center justify-center shadow-md transition-all ${
                              ball.name === 'White'
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:scale-105 active:scale-95 cursor-pointer'
                            }`}
                            style={bgStyle}
                            aria-label={`${ball.name} ball - ${ball.points} points${ball.name === 'White' ? ', disabled' : ''}`}
                          >
                            {isFoulCombined ? (
                              <div className="absolute inset-[3px] rounded-full bg-white flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
                                <span className="text-xs font-black text-black">{ball.label}</span>
                              </div>
                            ) : (
                              <span className="text-xs font-black" style={{ color: labelColor }}>
                                {ball.label}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
