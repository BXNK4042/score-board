"use client";

import React from "react";
import { useGameState } from "../hooks/useGameState";

export const HomeScreen: React.FC = () => {
  const { setScreen } = useGameState();

  return (
    <div className="flex flex-col flex-grow items-center justify-between p-6">
      {/* Header Logo */}
      <div className="w-full flex items-center justify-start gap-2 py-4">
        <div className="text-[#4B45D4]">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="6" width="20" height="12" rx="3" />
            <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
          </svg>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-[#4B45D4]">
          ScoreBoard
        </span>
      </div>

      {/* Center Action Area */}
      <div className="flex flex-col items-center justify-center flex-grow py-12">
        <button
          onClick={() => setScreen("setup")}
          className="w-28 h-28 rounded-full bg-[#4B45D4] text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 hover:scale-105 hover:bg-indigo-600 transition-all cursor-pointer border-none outline-none group"
          aria-label="Create New Game"
        >
          <svg
            className="w-12 h-12 stroke-[3] group-hover:rotate-90 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <span className="mt-6 text-[#1A1A2E] font-extrabold text-xl tracking-tight">
          Create New Game
        </span>
      </div>

      {/* Footer Branding or Info */}
      <div className="py-4 text-[#9999AA] text-xs font-semibold uppercase tracking-wider">
        Tabletop & Card Game Companion
      </div>
    </div>
  );
};
