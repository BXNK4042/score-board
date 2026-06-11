import React from 'react';

// SVG Icons helpers
export const GamepadIcon = () => (
  <svg className="w-6 h-6 text-[#4B45D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

export const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const PencilIcon = () => (
  <svg className="w-5 h-5 text-[#9999AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export const TrashIcon = () => (
  <svg className="w-5 h-5 text-[#E04040]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const BoltIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
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
