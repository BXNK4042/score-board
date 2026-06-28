'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getBallStyle } from '@/lib/snookerBalls';

type LatestBall = {
  playerName: string;
  type: 'Score' | 'Foul';
  ballName: string;
};

export const LatestBallCard = React.memo(function LatestBallCard({ latestBall }: { latestBall?: LatestBall }) {
  return (
    <Card
      className="bg-[var(--app-card-background)] rounded-[20px] border-none shadow-sm flex flex-col justify-center p-4"
      aria-live="polite"
    >
      <CardContent className="p-0 flex flex-col items-center justify-center text-center">
        {latestBall ? (
          (() => {
            const ballStyle = getBallStyle(latestBall.ballName, latestBall.type);
            return (
              <>
                <span
                  className="text-[var(--app-text-secondary)] text-[10px] font-black tracking-wider uppercase mb-1 truncate max-w-full px-1"
                  data-testid="latest-ball-label"
                >
                  {latestBall.playerName} ({latestBall.type})
                </span>
                <div
                  className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-md select-none"
                  style={
                    ballStyle.background
                      ? { background: ballStyle.background }
                      : { backgroundColor: ballStyle.color }
                  }
                  data-testid="latest-ball-visual"
                >
                  {ballStyle.background ? (
                    <div className="absolute inset-[3.5px] rounded-full bg-white flex items-center justify-center shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.15)]">
                      <span className="text-xs font-black text-black">{ballStyle.label}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-black" style={{ color: ballStyle.labelColor }}>
                      {ballStyle.label}
                    </span>
                  )}
                </div>
              </>
            );
          })()
        ) : (
          <>
            <span className="text-[var(--app-text-secondary)] text-[10px] font-black tracking-wider uppercase mb-1">
              Stats
            </span>
            <span className="text-3xl font-black text-[var(--app-text-secondary)]">—</span>
          </>
        )}
      </CardContent>
    </Card>
  );
});
