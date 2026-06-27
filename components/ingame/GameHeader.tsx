'use client';

import { UserPlus, Check, RotateCcw, Undo, Redo, History, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditableTitle } from '@/hooks/useEditableTitle';

interface GameHeaderProps {
  title: string;
  onSaveTitle: (title: string) => void;
  onViewHistory: () => void;
  onAddPlayer: () => void;
  addPlayerDisabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRestart: () => void;
  onEndGame: () => void;
}

export function GameHeader({
  title,
  onSaveTitle,
  onViewHistory,
  onAddPlayer,
  addPlayerDisabled,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRestart,
  onEndGame,
}: GameHeaderProps) {
  const { tempTitle, isEditing, setTempTitle, start, save } = useEditableTitle(title, onSaveTitle);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Gamepad className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
        {isEditing ? (
          <Input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                save();
              }
            }}
            placeholder="Enter game title"
            maxLength={40}
            autoFocus
            aria-label="Edit game title"
            className="w-full font-extrabold text-xl tracking-tight text-[var(--app-text-primary)] bg-transparent border-b-2 border-[var(--app-brand)] focus:outline-none focus:ring-0 p-0"
          />
        ) : (
          <Button
            onClick={start}
            aria-label="Edit game title"
            variant="ghost"
            className="text-left font-extrabold text-xl tracking-tight text-[var(--app-text-primary)] hover:text-[var(--app-brand)] transition-colors break-words max-w-[180px] p-0 h-auto"
          >
            {title}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={onViewHistory}
          data-testid="history-button"
          aria-label="View score history"
          variant="outline"
          className="p-2 bg-[var(--app-card-background)] hover:bg-[var(--app-background)] rounded-xl shadow-sm active:scale-95"
          size="icon"
        >
          <History className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
        </Button>
        <Button
          onClick={onAddPlayer}
          data-testid="add-player-ingame-button"
          disabled={addPlayerDisabled}
          aria-label="Add player mid-game"
          variant="outline"
          className="p-2 bg-[var(--app-card-background)] hover:bg-[var(--app-background)] rounded-xl shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          size="icon"
        >
          <UserPlus className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
        </Button>
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          data-testid="undo-button"
          aria-label="Undo last action"
          variant="outline"
          className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          size="icon"
        >
          <Undo className="w-5 h-5 text-[var(--app-brand)]" />
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          data-testid="redo-button"
          aria-label="Redo last action"
          variant="outline"
          className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          size="icon"
        >
          <Redo className="w-5 h-5 text-[var(--app-brand)]" />
        </Button>
        <Button
          onClick={onRestart}
          data-testid="restart-game-button"
          aria-label="Reset game session"
          variant="outline"
          className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl shadow-sm active:scale-95"
          size="icon"
        >
          <RotateCcw className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
        </Button>
        <Button
          onClick={onEndGame}
          data-testid="end-game-button"
          aria-label="End Game"
          variant="outline"
          className="p-2 bg-white hover:bg-[#EEEEF8] rounded-xl shadow-sm active:scale-95"
          size="icon"
        >
          <Check className="w-6 h-6 text-[var(--app-success)]" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}
