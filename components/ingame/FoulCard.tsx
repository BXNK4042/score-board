'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const FoulCard = React.memo(function FoulCard({ count }: { count: number }) {
  return (
    <Card
      className="bg-[var(--app-card-background)] rounded-[20px] border-none shadow-sm flex flex-col justify-center p-4"
      aria-live="polite"
    >
      <CardContent className="p-0 flex flex-col items-center justify-center text-center">
        <span className="text-[var(--app-text-secondary)] text-[10px] font-black tracking-wider uppercase mb-1">
          Fouls
        </span>
        <span
          className="text-3xl font-black text-[var(--app-danger)]"
          data-testid="foul-counter"
        >
          {count || 0}
        </span>
      </CardContent>
    </Card>
  );
});
