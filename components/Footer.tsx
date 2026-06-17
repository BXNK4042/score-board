import React from 'react';
import { History } from 'lucide-react';

interface FooterProps {
  relativeTimeText?: string | null;
}

export function Footer({ relativeTimeText }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full text-center pt-4 text-xs text-[var(--app-text-secondary)] font-medium mt-auto flex flex-col gap-1 shrink-0 select-none border-t border-[var(--app-border)]">
      {relativeTimeText && (
        <div
          aria-live="polite"
          className="flex items-center justify-center gap-1.5 text-xs text-[var(--app-text-secondary)] font-semibold select-none mb-2.5 shrink-0"
          data-testid="last-score-updated"
        >
          <History className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Last score updated: {relativeTimeText}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-brand)] animate-pulse" />
        </div>
      )}
      <div>© {currentYear} Bankrupt. All rights reserved.</div>
      <div>Built with ❤️ and a lot of coffee.</div>
    </footer>
  );
}
