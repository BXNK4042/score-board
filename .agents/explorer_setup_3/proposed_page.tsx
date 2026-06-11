'use client';

import React from 'react';
import { useGameState } from './proposed_useGameState';
import { HomeScreen, SetupScreen } from './proposed_layouts';

export default function Page() {
  const {
    screen,
    activeGame,
    setupTitle,
    setupPlayers,
    isInitialized,

    goToHome,
    goToSetup,
    goToInGame,

    updateSetupTitle,
    addSetupPlayer,
    updateSetupPlayer,
    deleteSetupPlayer,
    resetSetup,

    createGame,
    endGame,
  } = useGameState();

  // Show a blank/loading screen before localStorage is parsed to avoid layout shifts or hydration errors
  if (!isInitialized) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#EEEEF8] min-h-screen">
        <div className="animate-pulse text-[#4B45D4] font-bold">Loading...</div>
      </div>
    );
  }

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onNavigateSetup={() => {
            resetSetup();
            goToSetup();
          }}
          onResumeGame={goToInGame}
          hasActiveGame={activeGame !== null}
        />
      );

    case 'setup':
      return (
        <SetupScreen
          setupTitle={setupTitle}
          setupPlayers={setupPlayers}
          onUpdateTitle={updateSetupTitle}
          onAddPlayer={addSetupPlayer}
          onUpdatePlayer={updateSetupPlayer}
          onDeletePlayer={deleteSetupPlayer}
          onCancel={goToHome}
          onStartGame={() => createGame(setupTitle, setupPlayers)}
        />
      );

    case 'ingame':
      return (
        <div className="flex flex-col flex-1 items-center justify-between p-6 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen">
          <div className="flex flex-col gap-4 w-full my-auto text-center">
            <h2 className="text-2xl font-extrabold text-[#4B45D4]">In-Game Screen</h2>
            <p className="text-sm font-semibold text-[#9999AA]">
              Game Session: <span className="text-[#1A1A2E]">{activeGame?.title}</span>
            </p>
            <p className="text-xs text-[#9999AA]">
              Players: {activeGame?.players.map((p) => p.name).join(', ') || 'None'}
            </p>
            <p className="text-xs text-[#9999AA]">
              Timer state: {activeGame?.elapsedSeconds}s ({activeGame?.isRunning ? 'Running' : 'Paused'})
            </p>
          </div>
          <button
            onClick={endGame}
            className="w-full py-4 bg-[#E04040] text-white font-bold rounded-2xl active:scale-98 transition-transform cursor-pointer text-center"
          >
            END GAME (TEMPORARY FOR M1)
          </button>
        </div>
      );

    default:
      return (
        <div className="flex flex-1 items-center justify-center bg-[#EEEEF8] min-h-screen text-[#E04040] font-bold">
          Error: Unknown screen state
        </div>
      );
  }
}
