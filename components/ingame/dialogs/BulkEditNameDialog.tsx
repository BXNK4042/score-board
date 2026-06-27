'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Player } from '@/hooks/useGameState';

interface BulkEditNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  onSaveNames: (updates: Record<string, string>) => void;
}

export function BulkEditNameDialog({
  open,
  onOpenChange,
  players,
  onSaveNames,
}: BulkEditNameDialogProps) {
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const selectedCount = players.length;

  const reset = () => setEditedNames({});

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const handleSave = () => {
    onSaveNames(editedNames);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[var(--app-card-background)] w-full max-w-[360px] rounded-3xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-lg text-[var(--app-text-primary)]">
            Edit {selectedCount} Player Names
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form to edit the names of selected players.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mb-4 max-h-[40vh] overflow-y-auto">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 bg-[var(--app-background)] p-3 rounded-xl"
            >
              <div
                style={{ backgroundColor: `${player.color}15` }}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              >
                <span style={{ color: player.color }} className="font-bold text-sm">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <Input
                type="text"
                value={editedNames[player.id] || player.name}
                onChange={(e) =>
                  setEditedNames((prev) => ({
                    ...prev,
                    [player.id]: e.target.value,
                  }))
                }
                placeholder="Enter name"
                maxLength={20}
                className="flex-1 bg-transparent border-none focus:outline-none font-bold text-[var(--app-text-primary)] shadow-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleOpenChange(false)}
            variant="secondary"
            className="flex-1 py-3 h-auto bg-[var(--app-background)] text-[var(--app-text-primary)] font-bold rounded-2xl active:scale-98"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 py-3 h-auto bg-[var(--app-brand)] text-white font-bold rounded-2xl active:scale-98"
          >
            Save {selectedCount} Names
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
