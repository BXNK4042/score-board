'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionBarProps {
  onDeselectAllPlayers: () => void;
  onReversePlayerSelection: () => void;
  onBulkEditPlayers: () => void;
  onBulkRemove: () => void;
  onBulkUpdateScores: (delta: number) => void;
}

export function BulkActionBar({
  onDeselectAllPlayers,
  onReversePlayerSelection,
  onBulkEditPlayers,
  onBulkRemove,
  onBulkUpdateScores,
}: BulkActionBarProps) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[342px] bg-[var(--app-text-primary)] text-white p-4 rounded-3xl shadow-xl flex items-center justify-between z-40"
      data-testid="bulk-action-bar"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
      }}
    >
      <Button
        onClick={onDeselectAllPlayers}
        data-testid="bulk-deselect-all"
        aria-label="Deselect all players"
        variant="ghost"
        className="p-2 hover:bg-white/10 rounded-full"
        size="icon"
      >
        <X className="w-5 h-5" strokeWidth={2} />
      </Button>

      <div className="flex items-center gap-2">
        <Button
          onClick={onReversePlayerSelection}
          data-testid="bulk-reverse-selection"
          aria-label="Reverse selection"
          variant="ghost"
          className="p-2 hover:bg-white/10 rounded-full"
          size="icon"
        >
          <RefreshCw className="w-5 h-5" strokeWidth={2} />
        </Button>
        <Button
          onClick={onBulkEditPlayers}
          data-testid="bulk-edit-players"
          aria-label="Edit selected players"
          variant="ghost"
          className="p-2 hover:bg-white/10 rounded-full"
          size="icon"
        >
          <Pencil className="w-5 h-5" />
        </Button>
        <Button
          onClick={onBulkRemove}
          data-testid="bulk-remove"
          aria-label="Remove selected players"
          variant="ghost"
          className="p-2 hover:bg-white/10 rounded-full"
          size="icon"
        >
          <Trash2 className="w-5 h-5 text-[var(--app-danger)]" />
        </Button>
        <Button
          onClick={() => onBulkUpdateScores(-1)}
          data-testid="bulk-decrement"
          aria-label="Bulk decrement score"
          variant="outline"
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white hover:bg-white/30 active:scale-95 p-0"
          size="icon"
        >
          −
        </Button>
        <Button
          onClick={() => onBulkUpdateScores(1)}
          data-testid="bulk-increment"
          aria-label="Bulk increment score"
          variant="outline"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#1A1A2E] hover:bg-white/90 active:scale-95 p-0"
          size="icon"
        >
          +
        </Button>
      </div>
    </motion.div>
  );
}
