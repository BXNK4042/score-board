'use client';

import { useGameState } from '@/hooks/useGameState';

export default function HomeScreen() {
  const { game, setScreen } = useGameState();

  return (
    <div className="flex flex-col flex-1 p-6 justify-between bg-[#EEEEF8] h-full">
      {/* Header Logo */}
      <div className="flex items-center gap-2">
        {/* Gamepad Icon */}
        <svg className="w-8 h-8 text-[#4B45D4]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-3c-.83 0-1.5-.67-1.5-1.5S18.17 9 19 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
        <span className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">ScoreBoard</span>
      </div>

      {/* Center Action (Indigo + with Soft Glow) */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <button
          onClick={() => setScreen('setup')}
          className="w-32 h-32 bg-[#4B45D4] rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/35 hover:scale-105 hover:bg-[#3b35be] active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Create New Game"
        >
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <span className="text-xl font-extrabold text-[#1A1A2E]">Create New Game</span>
      </div>

      {/* Resume Active Game */}
      <div className="h-20 flex items-center justify-center">
        {game && (
          <button
            onClick={() => setScreen('ingame')}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFFFFF] border-2 border-[#4B45D4]/10 rounded-full text-[#4B45D4] font-bold shadow-md shadow-indigo-600/5 hover:bg-[#F0EFFF] hover:border-[#4B45D4]/20 transition-all duration-150 cursor-pointer"
          >
            <span>Resume Game: {game.title}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
