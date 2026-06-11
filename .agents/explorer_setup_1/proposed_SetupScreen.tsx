"use client";

import React, { useState } from "react";
import { useGameState } from "../hooks/useGameState";

const PALETTE = [
  "#4B45D4", // Indigo
  "#10B981", // Emerald
  "#EC4899", // Pink
  "#F59E0B", // Orange
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#7C3AED", // Violet
  "#84CC16", // Lime
  "#D946EF"  // Fuchsia
];

export const SetupScreen: React.FC = () => {
  const {
    createGame,
    setupTitle,
    setSetupTitle,
    setupPlayers,
    setSetupPlayers,
    setScreen
  } = useGameState();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalColor, setModalColor] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");

  // Get available colors for a new player
  const getFirstAvailableColor = (excludeId: string | null = null) => {
    const usedColors = setupPlayers
      .filter((p) => p.id !== excludeId)
      .map((p) => p.color);
    const available = PALETTE.filter((c) => !usedColors.includes(c));
    return available.length > 0 ? available[0] : PALETTE[0];
  };

  const handleOpenAddModal = () => {
    if (setupPlayers.length >= 10) {
      alert("Maximum of 10 players allowed.");
      return;
    }
    setEditingPlayerId(null);
    setModalName("");
    setModalColor(getFirstAvailableColor());
    setNameError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    const player = setupPlayers.find((p) => p.id === id);
    if (!player) return;
    setEditingPlayerId(id);
    setModalName(player.name);
    setModalColor(player.color);
    setNameError("");
    setIsModalOpen(true);
  };

  const handleDeletePlayer = (id: string) => {
    setSetupPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = modalName.trim();

    if (!trimmedName) {
      setNameError("Player name is required");
      return;
    }

    // Check duplicate name
    const isDuplicateName = setupPlayers.some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase() && p.id !== editingPlayerId
    );
    if (isDuplicateName) {
      setNameError("A player with this name already exists");
      return;
    }

    // Check duplicate color
    const isDuplicateColor = setupPlayers.some(
      (p) => p.color === modalColor && p.id !== editingPlayerId
    );
    if (isDuplicateColor) {
      setNameError("This color is already assigned to another player");
      return;
    }

    if (editingPlayerId) {
      // Edit mode
      setSetupPlayers((prev) =>
        prev.map((p) =>
          p.id === editingPlayerId ? { ...p, name: trimmedName, color: modalColor } : p
        )
      );
    } else {
      // Add mode
      const newPlayer = {
        id: Math.random().toString(36).substring(2, 11),
        name: trimmedName,
        color: modalColor,
      };
      setSetupPlayers((prev) => [...prev, newPlayer]);
    }

    setIsModalOpen(false);
  };

  const handleStartGame = () => {
    if (setupPlayers.length === 0) return;
    createGame(setupTitle, setupPlayers);
  };

  return (
    <div className="flex flex-col flex-grow p-0 min-h-screen relative pb-28">
      {/* Header Logo & Back to Home */}
      <div className="w-full flex items-center justify-between p-6">
        <div
          onClick={() => setScreen("home")}
          className="flex items-center gap-2 text-[#4B45D4] cursor-pointer"
        >
          <svg
            className="w-7 h-7"
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
          <span className="text-xl font-extrabold tracking-tight">ScoreBoard</span>
        </div>
      </div>

      {/* Title section */}
      <div className="px-6 mb-4">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
          Create New Game
        </h1>
      </div>

      {/* Title input card */}
      <div className="bg-white rounded-[20px] p-4 mx-6 mb-6 shadow-sm border border-gray-100/50">
        <label className="text-[10px] tracking-wider text-[#9999AA] font-bold block mb-1 uppercase">
          Title
        </label>
        <input
          type="text"
          value={setupTitle}
          onChange={(e) => setSetupTitle(e.target.value)}
          placeholder="Enter game title"
          className="w-full text-base font-bold text-[#1A1A2E] bg-transparent outline-none border-b border-gray-100 focus:border-indigo-500 pb-1 placeholder-[#9999AA]/60"
        />
      </div>

      {/* Players Section Header */}
      <div className="px-6 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-[#1A1A2E]">Players</h2>
          <span className="bg-[#4B45D4] text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
            {setupPlayers.length} Added
          </span>
        </div>
      </div>

      {/* Scrollable list of players */}
      <div className="flex-grow overflow-y-auto px-6 space-y-3 pb-8">
        {setupPlayers.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-gray-200 rounded-[20px] p-8 text-center text-[#9999AA] font-semibold text-sm">
            No players added yet. Tap the button below to add your first player.
          </div>
        ) : (
          setupPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100/50 flex items-center justify-between transition-all"
              style={{ borderLeft: `6px solid ${player.color}` }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with matching tinted background */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm uppercase"
                  style={{
                    backgroundColor: player.color + "22",
                    color: player.color,
                  }}
                >
                  {player.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A2E] text-base leading-tight">
                    {player.name}
                  </h3>
                  <span className="text-xs text-[#9999AA] font-semibold">
                    Player {setupPlayers.indexOf(player) + 1}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(player.id)}
                  className="p-2 text-[#9999AA] hover:text-[#4B45D4] rounded-full hover:bg-gray-50 transition-colors"
                  aria-label={`Edit ${player.name}`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="p-2 text-[#9999AA] hover:text-[#E04040] rounded-full hover:bg-red-50 transition-colors"
                  aria-label={`Delete ${player.name}`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB to add new player */}
      <button
        onClick={handleOpenAddModal}
        disabled={setupPlayers.length >= 10}
        className="absolute bottom-24 right-6 w-14 h-14 bg-[#4B45D4] text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-400 disabled:shadow-none cursor-pointer border-none outline-none z-10"
        aria-label="Add Player"
      >
        <svg
          className="w-7 h-7 stroke-[3.5]"
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

      {/* Sticky Bottom START GAME Button wrapper */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#EEEEF8] via-[#EEEEF8] to-transparent pt-8">
        <button
          onClick={handleStartGame}
          disabled={setupPlayers.length === 0}
          className="w-full bg-[#4B45D4] hover:bg-indigo-600 text-white font-extrabold py-4 rounded-full uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all disabled:opacity-50 disabled:bg-gray-400 disabled:shadow-none cursor-pointer border-none outline-none text-base"
        >
          <span>Start Game</span>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </button>
      </div>

      {/* Add/Edit Player Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white rounded-[30px] w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-[#9999AA] hover:text-[#1A1A2E] rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-extrabold text-[#1A1A2E] mb-5">
              {editingPlayerId ? "Edit Player" : "Add Player"}
            </h3>

            <form onSubmit={handleSavePlayer} className="space-y-5">
              {/* Name field */}
              <div>
                <label className="text-[10px] tracking-wider text-[#9999AA] font-bold block mb-1.5 uppercase">
                  Player Name
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Enter player name"
                  maxLength={20}
                  className="w-full bg-[#EEEEF8] text-[#1A1A2E] font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#4B45D4] transition-all placeholder-[#9999AA]/70 text-sm"
                  autoFocus
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="text-[10px] tracking-wider text-[#9999AA] font-bold block mb-2 uppercase">
                  Accent Color
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {PALETTE.map((color) => {
                    const isUsedByOther = setupPlayers.some(
                      (p) => p.color === color && p.id !== editingPlayerId
                    );
                    const isSelected = modalColor === color;

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setModalColor(color)}
                        disabled={isUsedByOther}
                        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border-none relative disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      >
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                            <svg
                              className="w-3.5 h-3.5 text-slate-800"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error display */}
              {nameError && (
                <p className="text-[#E04040] text-xs font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {nameError}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold py-3.5 rounded-xl text-sm transition-all cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#4B45D4] hover:bg-indigo-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer border-none"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
