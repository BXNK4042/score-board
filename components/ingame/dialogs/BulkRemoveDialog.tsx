'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Player } from '@/hooks/useGameState';

interface BulkRemoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  onConfirm: () => void;
}

export function BulkRemoveDialog({
  open,
  onOpenChange,
  players,
  onConfirm,
}: BulkRemoveDialogProps) {
  const selectedCount = players.length;
  const plural = selectedCount > 1 ? 's' : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--app-card-background)] w-full max-w-[340px] rounded-3xl p-6 shadow-xl text-center">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
            Remove {selectedCount} Player{plural}?
          </DialogTitle>
          <DialogDescription className="sr-only">
            Are you sure you want to remove the selected players?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="px-3 py-1 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: player.color }}
            >
              {player.name}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            className="w-full py-3.5 h-auto bg-[var(--app-danger)] text-white font-extrabold rounded-2xl active:scale-98"
          >
            Yes, Remove {selectedCount} Player{plural}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            className="w-full py-3.5 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-extrabold rounded-2xl active:scale-98"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
