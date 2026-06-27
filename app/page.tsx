'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { HomeScreen } from '@/components/HomeScreen';
import { SetupScreen } from '@/components/SetupScreen';
import { InGameScreen } from '@/components/InGameScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { screenTransitionVariants, useReducedMotion, createSafeVariants } from '@/lib/animations';

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
    goToHistory,

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
    updatePlayerName,
    removePlayer,
    restartGame,
    recordBallClick,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useGameState();

  const prefersReducedMotion = useReducedMotion();
  const safeScreenVariants = createSafeVariants(prefersReducedMotion, screenTransitionVariants);

  // Show a blank/loading screen before localStorage is parsed to avoid layout shifts or hydration errors
  if (!isInitialized) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#EEEEF8] min-h-screen">
        <div className="animate-pulse text-[#4B45D4] font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {(() => {
        switch (screen) {
          case 'home':
            return (
              <motion.div
                key="home"
                variants={safeScreenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <HomeScreen
                  onNavigateSetup={() => {
                    resetSetup();
                    goToSetup();
                  }}
                  onResumeGame={goToInGame}
                  hasActiveGame={activeGame !== null}
                />
              </motion.div>
            );

          case 'setup':
            return (
              <motion.div
                key="setup"
                variants={safeScreenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
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
              </motion.div>
            );

          case 'ingame':
            return (
              <motion.div
                key="ingame"
                variants={safeScreenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
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
                  onUpdatePlayerName={updatePlayerName}
                  onRemovePlayer={removePlayer}
                  onRestartGame={restartGame}
                  onRecordBallClick={recordBallClick}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                  onViewHistory={goToHistory}
                />
              </motion.div>
            );

          case 'history':
            return (
              <motion.div
                key="history"
                variants={safeScreenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <HistoryScreen
                  activeGame={activeGame!}
                  onBack={goToInGame}
                />
              </motion.div>
            );

          default:
            return (
              <motion.div
                key="error"
                variants={safeScreenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-1 items-center justify-center bg-[#EEEEF8] min-h-screen text-[#E04040] font-bold">
                  Error: Unknown screen state
                </div>
              </motion.div>
            );
        }
      })()}
    </AnimatePresence>
  );
}
