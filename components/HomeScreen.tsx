import React from 'react';
import { Gamepad, Plus, Pencil, Trash2, Zap } from 'lucide-react';
import { MotionButton } from '@/components/ui/motion-button';
import { Footer } from './Footer';


export const GamepadIcon = () => (
  <Gamepad className="w-6 h-6 text-[var(--app-brand)]" strokeWidth={2} />
);

export const PlusIcon = ({ className = "w-6 h-6" }) => (
  <Plus className={className} strokeWidth={3} />
);

export const PencilIcon = () => (
  <Pencil className="w-5 h-5 text-[var(--app-text-secondary)]" strokeWidth={2} />
);

export const TrashIcon = () => (
  <Trash2 className="w-5 h-5 text-[var(--app-danger)]" strokeWidth={2} />
);

export const BoltIcon = () => (
  <Zap className="w-5 h-5 mr-1" strokeWidth={2} />
);

export function HomeScreen({
  onNavigateSetup,
  onResumeGame,
  hasActiveGame,
}: {
  onNavigateSetup: () => void;
  onResumeGame: () => void;
  hasActiveGame: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-between p-6 pt-[calc(24px+env(safe-area-inset-top))] bg-[var(--app-background)] text-[var(--app-text-primary)] w-full max-w-[390px] mx-auto min-h-screen">
      {/* Top Header branding */}
      {/* ponytail: removed double-padding pt-6 on header, handled env(safe-area-inset-top) in parent wrapper */}
      <div className="w-full flex items-center justify-start gap-2">
        <GamepadIcon />
        <span className="font-extrabold text-xl tracking-tight text-[var(--app-brand)]">ScoreBoard</span>
      </div>

      {/* Main content button */}
      <div className="flex flex-col items-center justify-center gap-6 my-auto">
        <MotionButton
          onClick={onNavigateSetup}
          data-testid="create-new-game-button"
          className="w-24 h-24 rounded-full bg-[var(--app-brand)] text-white shadow-lg shadow-[var(--app-brand)]/30 active:scale-95"
          aria-label="Create New Game"
          size="icon"
          motionType="default"
        >
          <PlusIcon className="w-12 h-12" />
        </MotionButton>
        <span className="font-extrabold text-lg text-[var(--app-text-primary)]">Create New Game</span>
      </div>

      {/* Bottom Option to Resume Game if active */}
      <div className="w-full pb-8">
        {hasActiveGame && (
          <MotionButton
            onClick={onResumeGame}
            data-testid="resume-game-button"
            variant="outline"
            className="w-full py-4 h-auto bg-[var(--app-card-background)] border-[var(--app-brand)] text-[var(--app-brand)] font-bold rounded-2xl active:scale-98"
            motionType="default"
          >
            RESUME LIVE GAME
          </MotionButton>
        )}
      </div>

      <Footer />
    </div>
  );
}
