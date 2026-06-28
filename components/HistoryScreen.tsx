'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Game } from '@/lib/gameTypes';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useReducedMotion,
  createSafeVariants,
  listContainerVariants,
  listItemVariants,
} from '@/lib/animations';
import { getRelativeTimeString as getRelativeTimeStringShared } from '@/lib/relativeTime';
import { COLOR_TO_AVATAR } from '@/lib/playerAvatar';

export function HistoryScreen({
  activeGame,
  onBack,
}: {
  activeGame: Game;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const safeContainerVariants = createSafeVariants(prefersReducedMotion, listContainerVariants);
  const safeItemVariants = createSafeVariants(prefersReducedMotion, listItemVariants);

  // ponytail: use initializer function to prevent impure render call warning
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const getRelativeTimeString = (timestamp: number) =>
    getRelativeTimeStringShared(timestamp, now, 'short');

  const history = activeGame.scoreHistory || [];

  return (
    <div className="flex flex-col bg-[var(--app-background)] text-[var(--app-text-primary)] w-full max-w-[390px] mx-auto h-[100dvh] max-h-[100dvh] overflow-hidden relative p-6 pt-[calc(24px+env(safe-area-inset-top))]">
      <h1 className="sr-only">Score History</h1>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={onBack}
          aria-label="Back to game"
          variant="ghost"
          className="p-2 hover:bg-[var(--app-card-background)] rounded-xl"
          size="icon"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--app-brand)]" />
        </Button>
        <h2 className="text-xl font-extrabold tracking-tight">Score History</h2>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-12 text-[var(--app-text-secondary)]">
            <p className="text-sm font-medium">No score changes yet</p>
          </div>
        ) : (
          <motion.div
            variants={safeContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {history.map((change, index) => {
              const player = activeGame.players.find((p) => p.id === change.playerId);
              if (!player) return null;
              const delta = change.newScore - change.previousScore;
              const isPositive = delta > 0;
              const isFoulAward = change.isFoul === true;
              const isRed = isFoulAward || !isPositive;

              return (
                <motion.div
                  key={`${change.timestamp}-${change.playerId}-${index}`}
                  variants={safeItemVariants}
                  className="bg-[var(--app-card-background)] rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Player indicator */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                        {COLOR_TO_AVATAR[player.color.toLowerCase()] ? (
                          <img
                            src={`/player-avatar/${COLOR_TO_AVATAR[player.color.toLowerCase()]}.webp`}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: `${player.color}15` }}
                          >
                            <span className="font-bold text-sm" style={{ color: player.color }}>
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{player.name}</p>
                        <p className="text-xs text-[var(--app-text-secondary)]">
                          {getRelativeTimeString(change.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Score change */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm ${
                          isRed
                            ? 'bg-[var(--app-danger)] text-white'
                            : 'bg-[var(--app-success)] text-white'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{isPositive ? '+' : ''}{delta}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[var(--app-text-secondary)] text-xs">to</p>
                        <p className="font-bold">{change.newScore}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
