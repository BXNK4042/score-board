"use client";

import React from "react";
import { GameStateProvider, useGameState } from "../hooks/useGameState";
import { HomeScreen } from "../components/HomeScreen";
import { SetupScreen } from "../components/SetupScreen";

function MainAppContent() {
  const { screen, isLoaded } = useGameState();

  // Prevent hydration mismatch by rendering a loader until client state is loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#EEEEF8] min-h-screen text-slate-800 w-full max-w-[390px] mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#4B45D4] border-t-transparent mb-4"></div>
        <p className="font-extrabold text-xs uppercase tracking-wider text-[#4B45D4]/80 animate-pulse">
          Loading ScoreBoard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow w-full max-w-[390px] mx-auto bg-[#EEEEF8] min-h-screen relative overflow-x-hidden shadow-2xl">
      {screen === "home" && <HomeScreen />}
      {screen === "setup" && <SetupScreen />}
      {screen === "ingame" && (
        <div className="flex flex-col flex-grow items-center justify-center p-6 text-center">
          <div className="text-[#4B45D4] mb-4">
            <svg
              className="w-12 h-12 stroke-[2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="3" />
              <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-[#1A1A2E] mb-2">Game Session Started</h1>
          <p className="text-xs text-[#9999AA] mb-6 font-semibold">
            Milestone 2 (In-Game Screen Base) will be rendered here.
          </p>
          <button
            onClick={() => {
              if (confirm("Reset current game and go to Home?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-6 py-3 bg-white border border-gray-200 text-[#E04040] rounded-full text-xs font-extrabold uppercase hover:bg-red-50 transition-colors"
          >
            Reset Game State
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <GameStateProvider>
      <div className="flex flex-col min-h-screen bg-slate-900 justify-center items-center w-full">
        <MainAppContent />
      </div>
    </GameStateProvider>
  );
}
