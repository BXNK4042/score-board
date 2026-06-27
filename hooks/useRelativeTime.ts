'use client';

import { useState, useEffect } from 'react';
import { getRelativeTimeString } from '@/lib/relativeTime';

export function useRelativeTime(timestamp: number | undefined): string | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timestamp) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, [timestamp]);

  useEffect(() => {
    if (timestamp) {
      const handle = setTimeout(() => {
        setNow(Date.now());
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [timestamp]);

  if (!timestamp) return null;
  return getRelativeTimeString(timestamp, now, 'long');
}
