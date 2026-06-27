'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface EndGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function EndGameDialog({ open, onOpenChange, onConfirm }: EndGameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full max-w-[320px] rounded-3xl p-6 shadow-xl text-center">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-lg text-[#1A1A2E]">
            Are you sure you want to end the game?
          </DialogTitle>
          <DialogDescription className="sr-only">
            This will finish the session and log final scores.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            className="w-full py-3.5 h-auto bg-[var(--app-danger)] text-white font-extrabold rounded-2xl active:scale-98"
          >
            Yes, End Game
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            className="w-full py-3.5 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-extrabold rounded-2xl active:scale-98"
          >
            No, Keep Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
