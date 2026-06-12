import React from 'react';
import { Gamepad, Plus, Pencil, Trash2, Zap } from 'lucide-react';

export const GamepadIcon = () => (
  <Gamepad className="w-6 h-6 text-[#4B45D4]" strokeWidth={2} />
);

export const PlusIcon = ({ className = "w-6 h-6" }) => (
  <Plus className={className} strokeWidth={3} />
);

export const PencilIcon = () => (
  <Pencil className="w-5 h-5 text-[#9999AA]" strokeWidth={2} />
);

export const TrashIcon = () => (
  <Trash2 className="w-5 h-5 text-[#E04040]" strokeWidth={2} />
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
    <div className="flex flex-col flex-1 items-center justify-between p-6 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen">
      {/* Top Header branding */}
      <div className="w-full flex items-center justify-start gap-2 pt-6">
        <GamepadIcon />
        <span className="font-extrabold text-xl tracking-tight text-[#4B45D4]">ScoreBoard</span>
      </div>

      {/* Main content button */}
      <div className="flex flex-col items-center justify-center gap-6 my-auto">
        <button
          onClick={onNavigateSetup}
          data-testid="create-new-game-button"
          className="w-24 h-24 rounded-full bg-[#4B45D4] flex items-center justify-center text-white shadow-lg shadow-[#4B45D4]/30 active:scale-95 transition-transform cursor-pointer"
          aria-label="Create New Game"
        >
          <PlusIcon className="w-12 h-12" />
        </button>
        <span className="font-extrabold text-lg text-[#1A1A2E]">Create New Game</span>
      </div>

      {/* Bottom Option to Resume Game if active */}
      <div className="w-full pb-8">
        {hasActiveGame && (
          <button
            onClick={onResumeGame}
            data-testid="resume-game-button"
            className="w-full py-4 bg-white border border-[#4B45D4] text-[#4B45D4] font-bold rounded-2xl active:scale-98 transition-transform cursor-pointer text-center"
          >
            RESUME LIVE GAME
          </button>
        )}
      </div>
    </div>
  );
}
