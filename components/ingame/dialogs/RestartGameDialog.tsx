'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RestartGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RestartGameDialog({
  open,
  onOpenChange,
  onConfirm,
}: RestartGameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-xl text-center">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
            Reset game session?
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--app-text-secondary)] font-medium mb-4">
            This will reset all scores, stopwatch, and fouls. Current players will be kept.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            className="w-full py-3.5 h-auto bg-[var(--app-brand)] text-white font-extrabold rounded-2xl active:scale-98"
          >
            Yes, Reset Game
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
