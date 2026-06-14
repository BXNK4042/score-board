import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full text-center pt-6 text-sm text-[var(--app-text-secondary)] font-medium mt-auto flex flex-col gap-1 shrink-0 select-none border-t border-[var(--app-border)]">
      <div>© {currentYear} Bankrupt. All rights reserved.</div>
      <div>Built with ❤️ and a lot of coffee.</div>
    </footer>
  );
}
