'use client';

import { GameStateProvider, useGameState } from '@/hooks/useGameState';
import HomeScreen from '@/components/HomeScreen';
import SetupScreen from '@/components/SetupScreen';

// Simple placeholder for InGameScreen until Milestone 2 implements it
function InGameScreenPlaceholder() {
  const { game, endGame } = useGameState();
  return (
    <div className="flex flex-col flex-1 p-6 justify-between">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E]">Active Game: {game?.title}</h2>
        <p className="text-zinc-600">Stopwatch: {game?.elapsedSeconds}s</p>
        <p className="text-zinc-600">Running: {game?.isRunning ? 'Yes' : 'No'}</p>
        <div className="mt-4">
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Players:</h3>
          {game?.players.map((p) => (
            <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded-xl mb-2 border-l-4" style={{ borderColor: p.color }}>
              <span className="font-semibold">{p.name}</span>
              <span className="font-bold text-lg">{p.score}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={endGame}
        className="w-full py-4 bg-[#E04040] text-white font-bold rounded-full hover:bg-red-600 transition-colors"
      >
        END GAME
      </button>
    </div>
  );
}

function ScoreBoardApp() {
  const { screen, isHydrated } = useGameState();

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#EEEEF8]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4B45D4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A2E] font-semibold">Loading ScoreBoard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#1A1A2E] p-0 sm:p-4">
      {/* Mobile viewport simulator frame */}
      <div className="w-full sm:w-[390px] h-screen sm:h-[844px] bg-[#EEEEF8] flex flex-col relative overflow-hidden sm:shadow-2xl sm:rounded-[40px] sm:border-[8px] sm:border-zinc-900">
        {screen === 'home' && <HomeScreen />}
        {screen === 'setup' && <SetupScreen />}
        {screen === 'ingame' && <InGameScreenPlaceholder />}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <GameStateProvider>
      <ScoreBoardApp />
    </GameStateProvider>
  );
}
