'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StopwatchBannerProps {
  elapsedSeconds: number;
  isRunning: boolean;
  onToggleStopwatch: (running: boolean) => void;
}

export function StopwatchBanner({
  elapsedSeconds,
  isRunning,
  onToggleStopwatch,
}: StopwatchBannerProps) {
  const formatTime = (totalSeconds: number) => {
    // ponytail: standard formatting logic
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  return (
    <div className="bg-[var(--app-brand)] text-white p-4 rounded-[20px] flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--app-success)] animate-pulse" />
        <span className="text-xs font-extrabold tracking-wider">LIVE SESSION</span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="timer-display font-mono text-2xl font-black tracking-wider"
          data-testid="stopwatch-display"
        >
          {formatTime(elapsedSeconds)}
        </span>
        <Button
          onClick={() => onToggleStopwatch(!isRunning)}
          data-testid="stopwatch-toggle"
          aria-label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
          variant="ghost"
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full"
          size="icon"
        >
          {isRunning ? (
            <Pause className="w-5 h-5 text-white" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 text-white" fill="currentColor" />
          )}
        </Button>
      </div>
    </div>
  );
}
