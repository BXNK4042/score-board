'use client';

import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { HomeScreen } from '@/components/HomeScreen';
import { SetupScreen } from '@/components/SetupScreen';
import { InGameScreen } from '@/components/InGameScreen';

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
    updateGameTitle,
    addPlayerInGame,
    updateScore,
    togglePlayerSelection,
    bulkUpdateScores,
    deselectAllPlayers,
    reversePlayerSelection,
    toggleStopwatch,
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
        <InGameScreen
          activeGame={activeGame!}
          onUpdateGameTitle={updateGameTitle}
          onAddPlayerInGame={addPlayerInGame}
          onUpdateScore={updateScore}
          onTogglePlayerSelection={togglePlayerSelection}
          onBulkUpdateScores={bulkUpdateScores}
          onDeselectAllPlayers={deselectAllPlayers}
          onReversePlayerSelection={reversePlayerSelection}
          onToggleStopwatch={toggleStopwatch}
          onEndGame={endGame}
        />
      );

    default:
      return (
        <div className="flex flex-1 items-center justify-center bg-[#EEEEF8] min-h-screen text-[#E04040] font-bold">
          Error: Unknown screen state
        </div>
      );
  }
}
