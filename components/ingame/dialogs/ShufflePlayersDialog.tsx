'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ShufflePlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ShufflePlayersDialog({
  open,
  onOpenChange,
  onConfirm,
}: ShufflePlayersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-xl text-center">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
            Shuffle player order?
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--app-text-secondary)] font-medium mb-4">
            This will randomly reorder all players. Scores and stats are preserved.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            className="w-full py-3.5 h-auto bg-[var(--app-brand)] text-white font-extrabold rounded-2xl active:scale-98"
          >
            Yes, Shuffle
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
